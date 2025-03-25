from flask import Flask, Blueprint, request, jsonify, session, current_app
from flask_cors import CORS # luke add
import psycopg2 # luke add
from flask_sqlalchemy import SQLAlchemy
from app.database import db
from app.models import Team, User, PendingTeamMember
from datetime import datetime
import os # luke add
from werkzeug.utils import secure_filename # luke add
from PIL import Image    # luke add


team_bp = Blueprint('team', __name__)


# Route to register a new team
@team_bp.route('/registerTeam', methods=['POST'])
def register_team():
    data = request.get_json()


    team_name = data.get('team_name')
    captain_name = data.get('captain_name')
    captain_email = data.get('captain_email')
    university_id = data.get('university_id')
    members = data.get('members', [])


    if not team_name or not captain_name or not captain_email or not university_id:
        return jsonify({"error": "Missing required fields"}), 400


    profile_image = data.get('profile_image', None)


    try:
        new_team = Team(
            team_name=team_name,
            captain_id=0,  
            university_id=university_id,
            profile_image=profile_image,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            status=1,        
            blacklisted=0,  
            registration_date=datetime.utcnow().date()
        )
        db.session.add(new_team)
        db.session.flush()


        captain_user = User(
            team_id=new_team.team_id,
            username=captain_name,      
            email=captain_email,
            user_type="captain",
            status=1,
            blacklisted=0,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            password_hash=None
        )
        db.session.add(captain_user)
        db.session.flush()


        new_team.captain_id = captain_user.user_id
        db.session.commit()


    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to register team", "details": str(e)}), 500


    return jsonify({"message": "Team registered successfully!", "team_id": new_team.team_id}), 201


# Route to get team details
@team_bp.route('/getTeam/<int:team_id>', methods=['GET'])
def get_team(team_id):
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({"error": "Team not found"}), 404

        # Fetch the captain details

        captain = User.query.filter_by(user_id=team.captain_id).first()

        # Fetch all other team members (excluding the captain)
        members = User.query.filter(User.team_id == team.team_id, User.user_type != "captain").all()


        team_data = {
            "team_id": team.team_id,
            "team_name": team.team_name,
            "captain": {
                "user_id": captain.user_id if captain else None,
                "name": captain.username if captain else None,
                "email": captain.email if captain else None,
                "game_role": captain.game_role if captain else None,  # Include game_role
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
                    "game_role": member.game_role,  # Include game_role
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
        # Fetch player details
        player = User.query.get(user_id)
        if not player:
            return jsonify({"error": "Player not found"}), 404

        # Fetch team details
        team = Team.query.filter_by(team_id=player.team_id).first()

        # Construct player data
        player_data = {
            "user_id": player.user_id,
            "name": player.username,
            "email": player.email,
            "role": player.user_type,
            "profile_image": getattr(player, 'profile_image', None),  # FIXED: Prevent crash
            "about": "Experienced player with expertise in various skills.",
            "date_joined": player.created_at.strftime('%Y-%m-%d') if player.created_at else None,
            "team_name": team.team_name if team else "No Team",
            "team_logo": team.profile_image if team and team.profile_image else None,
            "university_id": team.university_id if team else None,
            "university_name": f"University ID {team.university_id}" if team else "Unknown University",
            "university_logo": None
        }

        return jsonify(player_data), 200

    except Exception as e:
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
                "email": member.email,
                "team_id": member.team_id,
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
