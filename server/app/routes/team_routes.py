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

        captain = User.query.filter_by(user_id=team.captain_id).first()
        
        # FIX: Fetch members while excluding captain
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
            "registration_date": team.registration_date.strftime('%Y-%m-%d'),
            "members": [
                {
                    "user_id": member.user_id,
                    "name": member.username,
                    "email": member.email
                }
                for member in members  # FIX: Now members will be correctly included
            ]
        }

        return jsonify(team_data), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch team details", "details": str(e)}), 500

