from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, User
from datetime import datetime

team_bp = Blueprint('team', __name__)

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
                "team_role": captain.team_role if captain else None,  # Include team_role
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
                    "team_role": member.team_role,  # Include team_role
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
        team_role = data.get('team_role', None)

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
        user.team_role = team_role
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
