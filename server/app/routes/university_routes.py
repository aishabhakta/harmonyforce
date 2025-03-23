from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, University
from datetime import datetime

university_bp = Blueprint('university', __name__)

# Function to register a university
@university_bp.route('/register', methods=['POST'])
def register_university():
    data = request.get_json()
    new_university = University(
        university_name=data['university_name'],
        description=data.get('description', ''),
        university_image=data.get('university_image', ''),
        created_at=datetime.utcnow()
    )
    db.session.add(new_university)
    db.session.commit()
    return jsonify({"message": "University registered successfully!"}), 201

# Function to update university details
@university_bp.route('/update', methods=['POST'])
def update_university():
    data = request.get_json()
    university = University.query.get(data['university_id'])
    if not university:
        return jsonify({"error": "University not found"}), 404
    university.university_name = data.get('university_name', university.university_name)
    university.description = data.get('description', university.description)
    university.university_image = data.get('university_image', university.university_image)
    db.session.commit()
    return jsonify({"message": "University updated successfully!"}), 200

# Function to get all teams for a given university
@university_bp.route('/<int:university_id>/teams', methods=['GET'])
def get_university_teams(university_id):
    teams = Team.query.filter_by(university_id=university_id).all()
    teams_data = [{
        "team_id": team.team_id,
        "team_name": team.team_name,
        "profile_image": team.profile_image
    } for team in teams]
    return jsonify(teams_data), 200

@university_bp.route('/getAll', methods=['GET'])
def get_all_universities():
    try:
        universities = University.query.all()
        university_data = [
            {
                "university_id": uni.university_id,
                "university_name": uni.university_name,
                "description": uni.description,
                "university_image": uni.university_image,
                "created_at": uni.created_at.strftime('%Y-%m-%d') if uni.created_at else None
            }
            for uni in universities
        ]
        return jsonify(university_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch universities", "details": str(e)}), 500
