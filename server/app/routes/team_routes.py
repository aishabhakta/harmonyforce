from flask import Flask, Blueprint, request, jsonify, session, current_app
from flask_cors import CORS # luke add
from app.database import db
from app.models import Team, User, PendingTeamMember, PendingTeamRegistration, University
from datetime import datetime
import os # luke add
from werkzeug.utils import secure_filename # luke add
from PIL import Image    # luke add
import base64 
import traceback

team_bp = Blueprint('team', __name__)


# Route to register a new team
@team_bp.route('/registerTeam', methods=['POST'])
def register_team():
    data = request.get_json()

    captain_name = data.get('captain_name')
    captain_email = data.get('captain_email')
    team_name = data.get('team_name')
    university_id = data.get('university_id')
    members = data.get('members', [])
    profile_image = data.get('profile_image', None)

    if not team_name or not captain_name or not captain_email or not university_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the user already exists
    existing_user = User.query.filter_by(email=captain_email).first()
    if existing_user:
        if existing_user.user_type != "participant":
            return jsonify({"error": "Only participants can create a team."}), 403
        if existing_user.team_id:
            return jsonify({"error": "You are already in a team and cannot create a new one."}), 403

    total_members = 1 + len(members)  # Including captain
    if total_members > 7:
        return jsonify({"error": "A team cannot have more than 7 members (including captain)."}), 400

    try:
        pending_team = PendingTeamRegistration(
            team_name=team_name,
            captain_name=captain_name,
            captain_email=captain_email,
            university_id=university_id,
            profile_image=profile_image,
            members=members,
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.session.add(pending_team)
        db.session.commit()

        return jsonify({"message": "Team registration request submitted for approval!"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to submit team request", "details": str(e)}), 500


# Route to get team details
@team_bp.route('/getTeam/<int:team_id>', methods=['GET'])
def get_team(team_id):
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        captain = User.query.filter_by(user_id=team.captain_id).first()
        members = User.query.filter(User.team_id == team.team_id, User.user_type != "captain").all()

        team_data = {
            "team_id": team.team_id,
            "team_name": team.team_name,
            "captain": {
                "user_id": captain.user_id if captain else None,
                "name": captain.username if captain else None,
                "email": captain.email if captain else None,
                "game_role": captain.game_role if captain else None, 
                # "imageUrl": captain.profile_image if captain else None  # Include profile image
            },
            "university_id": team.university_id,
            "profile_image": team.profile_image,
            "status": team.status,
            "blacklisted": team.blacklisted,
            "registration_date": team.registration_date.strftime('%Y-%m-%d') if team.registration_date else None,
            "members": [
                {
                    "user_id": member.user_id,
                    "name": member.username,
                    "email": member.email,
                    "game_role": member.game_role, 
                    # "imageUrl": member.profile_image  # Include profile image
                }
                for member in members
            ]
        }


        return jsonify(team_data), 200


    except Exception as e:
        return jsonify({"error": "Failed to fetch team details", "details": str(e)}), 500


@team_bp.route('/getAllTeams', methods=['GET'])
def get_all_teams():
    try:
        teams = Team.query.all()
        teams_data = []

        for team in teams:
            captain = User.query.filter_by(user_id=team.captain_id).first()
            
            # Fetch members while excluding the captain
            members = User.query.filter(User.team_id == team.team_id, User.user_type != "captain").all()

            team_data = {
                "team_id": team.team_id,
                "team_name": team.team_name,
                "captain": {
                    "user_id": captain.user_id if captain else None,
                    "name": captain.username if captain else None,
                    "email": captain.email if captain else None,
                },
                "university_id": team.university_id,
                "profile_image": team.profile_image,
                "status": team.status,
                "blacklisted": team.blacklisted,
                "registration_date": team.registration_date.strftime('%Y-%m-%d') if team.registration_date else None,
                "members": [
                    {
                        "user_id": member.user_id,
                        "name": member.username,
                        "email": member.email
                    }
                    for member in members
                ]
            }
            teams_data.append(team_data)

        return jsonify({"teams": teams_data}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch teams", "details": str(e)}), 500

@team_bp.route('/getPlayer/<int:user_id>', methods=['GET'])
def get_player(user_id):
    try:
        # Fetch player
        player = User.query.get(user_id)
        if not player:
            return jsonify({"error": "Player not found"}), 404

        team = Team.query.filter_by(team_id=player.team_id).first()
        university = University.query.get(player.university_id) if player.university_id else None

        player_data = {
            "user_id": player.user_id,
            "name": player.username,
            "email": player.email,
            "role": player.user_type,
            "profile_image": getattr(player, 'profile_image', None),
            "about": getattr(player, 'bio', None),
            "date_joined": player.created_at.strftime('%Y-%m-%d') if player.created_at else None,
            "team_id": player.team_id,
            "team_name": team.team_name if team else None,
            "team_logo": team.profile_image if team else None,
            "university_id": player.university_id,
            "university_name": university.university_name if university else "Unknown University",
            "university_logo": university.university_image if university else None,
            "first_name": player.first_name,
            "last_name": player.last_name,
        }

        return jsonify(player_data), 200

    except Exception as e:
        print("🔥 Error in /getPlayer route:")
        print(traceback.format_exc())  # ⬅️ Logs the full error stack trace in your server
        return jsonify({"error": "Failed to fetch player details", "details": str(e)}), 500
    
@team_bp.route('/addMember/<int:team_id>', methods=['POST'])
def add_member(team_id):
    try:
        data = request.get_json()

        email = data.get('email')
        game_role = data.get('game_role', None)

        if not email:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if the user exists
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not registered"}), 404

        # Check if user is already in a team
        if user.team_id is not None:
            return jsonify({
                "error": "User is already in a team and cannot be added to another."
            }), 403

        # Assign user to the team
        user.team_id = team_id
        user.game_role = game_role
        user.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            "message": "User successfully added to the team",
            "user_id": user.user_id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to add member",
            "details": str(e)
        }), 500

# Route to get details of a specific team member
@team_bp.route('/member/<int:user_id>', methods=['GET'])
def get_member(user_id):
    member = User.query.get(user_id)
    if not member:
        return jsonify({"error": "User not found"}), 404
   
    return jsonify({
        "user_id": member.user_id,
        "username": member.username,
        "email": member.email,
        "profile_image": member.profile_image,
        "game_role": member.game_role
    })


# Route to upload a profile image
@team_bp.route('/upload_profile_image', methods=['POST'])
def upload_profile_image():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401  # Ensure user is logged in
   
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
   
    file = request.files['image']
    filename = secure_filename(file.filename)  # Sanitize filename
   
    if len(filename) > 100:
        return jsonify({"error": "Filename too long"}), 400
   
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)  # Save file to upload folder
   
    # Validate image dimensions
    with Image.open(filepath) as img:
        if img.width != img.height:  # Ensure image is a perfect square
            os.remove(filepath)
            return jsonify({"error": "Image must be a perfect square"}), 400
   
    user = User.query.get(session['user_id'])
    user.profile_image = filepath  # Store file path in database
    db.session.commit()
   
    return jsonify({"message": "Profile image uploaded successfully!"}), 200

@team_bp.route('/requestAddMember', methods=['POST'])
def request_add_member():
    data = request.get_json()
    email = data.get('email')
    team_id = data.get('team_id')
    game_role = data.get('game_role')

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not registered"}), 404

    if user.team_id:
        return jsonify({"error": "User already in a team"}), 400

    # Add to a pending table
    new_request = PendingTeamMember(
        user_id=user.user_id,
        team_id=team_id,
        game_role=game_role,
        status="pending",
        created_at=datetime.utcnow()
    )
    db.session.add(new_request)
    db.session.commit()

    return jsonify({"message": "Member request submitted for approval"}), 200

@team_bp.route('/pendingMembers', methods=['GET'])
def get_pending_team_members():
    try:
        pending_members = PendingTeamMember.query.all()

        result = []
        for member in pending_members:
            result.append({
                "id": member.id,
                "email": member.user.email if member.user else None,  # pull from User
                "team_id": member.team_id,
                "team_name": member.team.team_name if member.team else None,
                "game_role": member.game_role,
                "user_id": member.user_id,
                "status": member.status,
                "created_at": member.created_at,
                "updated_at": member.updated_at
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch pending members", "details": str(e)}), 500

@team_bp.route('/approve-member/<int:member_id>', methods=['POST'])
def approve_member(member_id):
    try:
        pending = PendingTeamMember.query.get(member_id)
        if not pending:
            return jsonify({"error": "Pending member not found"}), 404

        user = User.query.get(pending.user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Assign the team and role
        user.team_id = pending.team_id
        user.game_role = pending.game_role
        user.updated_at = datetime.utcnow()

        db.session.delete(pending)
        db.session.commit()

        return jsonify({"message": "Member approved and added to team"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to approve member", "details": str(e)}), 500

@team_bp.route('/reject-member/<int:member_id>', methods=['POST'])
def reject_member(member_id):
    try:
        pending = PendingTeamMember.query.get(member_id)
        if not pending:
            return jsonify({"error": "Pending member not found"}), 404

        db.session.delete(pending)
        db.session.commit()

        return jsonify({"message": "Member request rejected"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to reject member", "details": str(e)}), 500

@team_bp.route('/removeMember/<int:user_id>', methods=['POST'])
def remove_member(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.team_id = None
        user.game_role = None
        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "Member removed from team"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to remove member", "details": str(e)}), 500

#return all participants and captains
@team_bp.route('/user/participants-and-captains', methods=['GET'])
def get_participants_and_captains():
    users = User.query.filter(User.user_type.in_(['participant', 'captain'])).all()

    result = []
    for user in users:
        image_url = None
        if user.profile_image:
            try:
                image_url = f"data:image/jpeg;base64,{base64.b64encode(user.profile_image).decode('utf-8')}"
            except Exception as e:
                print("Image decode error:", e)

        # Safely fetch university name based on ID
        university_name = None
        if user.university_id:
            uni = University.query.get(user.university_id)
            university_name = uni.university_name if uni else None

        result.append({
            "user_id": user.user_id,
            "username": user.username,
            "profile_image": image_url,
            "email": user.email,
            "university_id": user.university_id,
            "university_name": university_name,
            "in_team": user.team_id is not None and user.team_id != 0,
            "role": user.user_type,
            "team_name": user.team.team_name if user.team else None,
        })

    return jsonify(result), 200

    
@team_bp.route('/pendingTeams', methods=['GET'])
def get_pending_teams():
    results = (
        db.session.query(
            PendingTeamRegistration.id,
            PendingTeamRegistration.team_name,
            PendingTeamRegistration.captain_name,
            PendingTeamRegistration.captain_email,
            PendingTeamRegistration.profile_image,
            PendingTeamRegistration.status,
            PendingTeamRegistration.created_at,
            University.university_name
        )
        .outerjoin(University, PendingTeamRegistration.university_id == University.university_id)
        .filter(PendingTeamRegistration.status == "pending")
        .all()
    )

    response = [
        {
            "id": r.id,
            "team_name": r.team_name,
            "captain_name": r.captain_name,
            "captain_email": r.captain_email,
            "profile_image": r.profile_image,
            "status": r.status,
            "created_at": r.created_at.isoformat(),
            "university_name": r.university_name or "Unknown University"
        }
        for r in results
    ]

    return jsonify(response), 200

# @team_bp.route('/approve-team/<int:pending_team_id>', methods=['POST'])
# def approve_pending_team(pending_team_id):
#     try:
#         pending = PendingTeamRegistration.query.get(pending_team_id)
#         if not pending:
#             return jsonify({"error": "Pending team not found"}), 404

#         # Check if captain exists
#         existing_user = User.query.filter_by(email=pending.captain_email).first()
#         if existing_user:
#             if existing_user.team_id:
#                 return jsonify({"error": "Captain is already in a team"}), 400
#         else:
#             # Create new captain
#             existing_user = User(
#                 username=pending.captain_name,
#                 email=pending.captain_email,
#                 user_type="captain",
#                 status=1,
#                 blacklisted=0,
#                 created_at=datetime.utcnow(),
#                 updated_at=datetime.utcnow()
#             )
#             db.session.add(existing_user)
#             db.session.flush()

#         # Create the team
#         new_team = Team(
#             team_name=pending.team_name,
#             captain_id=existing_user.user_id,
#             registration_date=datetime.utcnow().date(),
#             status=1,
#             blacklisted=0,
#             profile_image=pending.profile_image,
#             university_id=pending.university_id,
#             created_at=datetime.utcnow().date(),
#             updated_at=datetime.utcnow().date(),
#             description=""
#         )
#         db.session.add(new_team)
#         db.session.flush()

#         # Assign team_id to captain
#         existing_user.team_id = new_team.team_id
#         existing_user.updated_at = datetime.utcnow()

#         # Assign team_id to other members (by email)
#         for email in pending.members:
#             if email == pending.captain_email:
#                 continue  # Skip the captain
#             user = User.query.filter_by(email=email).first()
#             if user:
#                 if user.team_id:
#                     continue  # already in a team
#                 user.team_id = new_team.team_id
#                 user.updated_at = datetime.utcnow()

#         # Delete from pending table
#         db.session.delete(pending)
#         db.session.commit()

#         return jsonify({"message": "Team approved and created successfully!"}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"error": "Team approval failed", "details": str(e)}), 500
@team_bp.route('/approve-team/<int:pending_team_id>', methods=['POST'])
def approve_pending_team(pending_team_id):
    try:
        pending = PendingTeamRegistration.query.get(pending_team_id)
        if not pending:
            return jsonify({"error": "Pending team not found"}), 404

        existing_user = User.query.filter_by(email=pending.captain_email).first()
        if existing_user:
            if existing_user.team_id:
                return jsonify({"error": "Captain is already in a team"}), 400
        else:
            existing_user = User(
                username=pending.captain_name,
                email=pending.captain_email,
                user_type="captain",
                status=1,
                blacklisted=0,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                # team_id=None,
                university_id=pending.university_id or 0, 
            )
            db.session.add(existing_user)
            db.session.flush()

        new_team = Team(
            team_name=pending.team_name,
            captain_id=existing_user.user_id,
            registration_date=datetime.utcnow().date(),
            status=1,
            blacklisted=0,
            profile_image=pending.profile_image,
            university_id=pending.university_id,
            created_at=datetime.utcnow().date(),
            updated_at=datetime.utcnow().date(),
            description=""
        )
        db.session.add(new_team)
        db.session.flush()

        existing_user.team_id = new_team.team_id
        existing_user.updated_at = datetime.utcnow()

        for email in pending.members:
            if email == pending.captain_email:
                continue
            user = User.query.filter_by(email=email).first()
            if user and not user.team_id:
                user.team_id = new_team.team_id
                user.updated_at = datetime.utcnow()

        db.session.delete(pending)
        db.session.commit()

        return jsonify({"message": "Team approved and created successfully!"}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())  # Logs full error trace
        db.session.rollback()
        return jsonify({"error": "Team approval failed", "details": str(e)}), 500



@team_bp.route('/reject-team/<int:team_id>', methods=['POST'])
def reject_team(team_id):
    team = PendingTeamRegistration.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404

    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Team registration rejected and removed."}), 200

# @team_bp.route('/getUser/<int:user_id>', methods=['GET'])
# def get_user_details(user_id):
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     university = University.query.get(user.university_id)
#     team = Team.query.get(user.team_id)

#     return jsonify({
#         "user_id": user.user_id,
#         "email": user.email,
#         "username": user.username,
#         "user_type": user.user_type,
#         "profile_image": user.profile_image,
#         "team_id": user.team_id,
#         "team_name": team.team_name if team else None,
#         "team_logo": team.profile_image if team else None,
#         "university_name": university.university_name if university else None,
#         "university_logo": university.university_image if university else None,
#         "about": user.bio,
#         "first_name": user.first_name,
#         "last_name": user.last_name,
#         "date_joined": user.created_at.strftime('%Y-%m-%d') if user.created_at else None
#     }), 200
