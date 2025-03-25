from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, University, User,Match
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
                "country": uni.country,
                "universitylink": uni.universitylink,
                "status": uni.status,
                "created_at": uni.created_at.strftime('%Y-%m-%d') if uni.created_at else None
            }
            for uni in universities
        ]

        return jsonify(university_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch universities", "details": str(e)}), 500



# Report to get information based on University
@university_bp.route('/report/<int:university_id>', methods=['GET'])
def get_university_report(university_id):
    university = University.query.get(university_id)
    if not university:
        return jsonify({"error": "University not found"}), 404
   
    team_count = Team.query.filter_by(university_id=university_id).count()
    total_members = User.query.filter_by(university_id=university_id).count()
    unimod_exists = db.session.query(User.query.filter_by(university_id=university_id, user_type='unimod').exists()).scalar()
   
    return jsonify({
        "university_id": university.university_id,
        "university_name": university.university_name,
        "country": university.country,
        "created_at": university.created_at,
        "status": "Active" if university.status == 1 else "Inactive",
        "team_count": team_count,
        "total_members": total_members,
        "unimod_exists": unimod_exists
    }), 200


# Report to get the total counts of universities, teams, and members
@university_bp.route('/report/total_counts', methods=['GET'])
def get_total_counts():
    university_count = db.session.query(University).count()
    team_count = db.session.query(Team).count()
   
    # Count only users whose user_type is 'captain' or 'participant'
    team_member_count = db.session.query(User).filter(User.user_type.in_(['captain', 'participant'])).count()


    return jsonify({
        "total_universities": university_count,
        "total_teams": team_count,
        "total_team_members": team_member_count
    }), 200


# Function to get university statistics with optional date range filtering
@university_bp.route('/statistics', methods=['GET'])
def get_university_statistics():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')


    query = University.query
    if start_date and end_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(University.created_at.between(start_date, end_date))
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400


    universities = query.all()
    return jsonify([{
        "university_id": uni.university_id,
        "university_name": uni.university_name,
        "country": uni.country,
        "status": uni.status,
        "created_at": uni.created_at
    } for uni in universities]), 200

@university_bp.route('/<int:university_id>', methods=['GET'])
def get_university_details(university_id):
    uni = University.query.get(university_id)
    if not uni:
        return jsonify({"error": "University not found"}), 404
    return jsonify({
        "university_id": uni.university_id,
        "university_name": uni.university_name,
        "description": uni.description,
        "university_image": uni.university_image,
        "status": "Active" if uni.status == 1 else "Inactive",
        "created_at": uni.created_at.strftime('%Y-%m-%d') if uni.created_at else None,
        "country": uni.country,
        "universitylink": uni.universitylink,
    }), 200

@university_bp.route('/<int:university_id>/matches', methods=['GET'])
def get_university_matches(university_id):
    # Get all team IDs for the university
    teams = Team.query.filter_by(university_id=university_id).all()
    team_ids = [team.team_id for team in teams]

    if not team_ids:
        return jsonify([]), 200

    # Get matches where either team1 or team2 belongs to the university
    matches = Match.query.filter(
        db.or_(
            Match.team1_id.in_(team_ids),
            Match.team2_id.in_(team_ids)
        )
    ).all()

    match_data = []
    for match in matches:
        match_data.append({
            "match_id": match.match_id,
            "tournament_id": match.tournament_id,
            "team1_id": match.team1_id,
            "team2_id": match.team2_id,
            "start_time": match.start_time.strftime("%Y-%m-%d") if match.start_time else None,
            "end_time": match.end_time.strftime("%Y-%m-%d") if match.end_time else None,
            "score_team1": match.score_team1,
            "score_team2": match.score_team2,
            "status": "Completed" if match.status == 1 else "Scheduled",
            "winner_id": match.winner_id
        })

    return jsonify(match_data), 200
