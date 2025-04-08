from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, University, User, Tournament, Match
from datetime import datetime

tournament_bp = Blueprint('tournament', __name__)

# Function to create a tournament
@tournament_bp.route('/create', methods=['POST'])
def create_tournament():
    data = request.get_json()


    # Validate required fields
    required_fields = ["name", "description", "start_date", "end_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400


    # Extract and validate dates
    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
        if start_date >= end_date:
            return jsonify({"error": "Start date must be before end date"}), 400
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400


    university_id = data.get("university_id")
    if not university_id:
        return jsonify({"error": "Missing university_id"}), 400

    # Create new tournament entry
    new_tournament = Tournament(
        name=data["name"],
        description=data["description"],
        start_date=start_date,
        end_date=end_date,
        university_id=university_id,
        created_at=datetime.utcnow().date()
    )

    db.session.add(new_tournament)
    db.session.commit()

    return jsonify({
        "message": "Tournament created successfully",
        "tournament_id": new_tournament.tournament_id
    }), 201


# Tournament getter function
@tournament_bp.route('/<int:tournament_id>', methods=['GET'])
def get_tournament(tournament_id):
    tournament = Tournament.query.get(tournament_id)


    if not tournament:
        return jsonify({"error": "Tournament not found"}), 404


    return jsonify({
        "tournament_id": tournament.tournament_id,
        "name": tournament.name,
        "description": tournament.description,
        "start_date": tournament.start_date.strftime("%Y-%m-%d"),
        "end_date": tournament.end_date.strftime("%Y-%m-%d")
    }), 200


# Tournament update function
@tournament_bp.route('/<int:tournament_id>', methods=['PUT'])
def update_tournament(tournament_id):
    data = request.get_json()
    tournament = Tournament.query.get(tournament_id)


    if not tournament:
        return jsonify({"error": "Tournament not found"}), 404


    # Update only fields that are provided
    if "name" in data:
        tournament.name = data["name"]
    if "description" in data:
        tournament.description = data["description"]
    if "start_date" in data:
        tournament.start_date = datetime.strptime(data["start_date"], "%Y-%m-%d")
    if "end_date" in data:
        tournament.end_date = datetime.strptime(data["end_date"], "%Y-%m-%d")


    db.session.commit()


    return jsonify({
        "message": "Tournament updated successfully",
        "tournament_id": tournament.tournament_id,
        "name": tournament.name,
        "description": tournament.description,
        "start_date": tournament.start_date.strftime("%Y-%m-%d"),
        "end_date": tournament.end_date.strftime("%Y-%m-%d")
    }), 200




# Function to manually set match scores
@tournament_bp.route('/match/<int:match_id>/set_scores', methods=['POST'])
def set_match_scores(match_id):
    data = request.get_json()


    if "score_team1" not in data or "score_team2" not in data:
        return jsonify({"error": "Missing required fields"}), 400


    match = Match.query.get(match_id)
    if not match:
        return jsonify({"error": "Match not found"}), 404


    match.score_team1 = data["score_team1"]
    match.score_team2 = data["score_team2"]
    match.status = 1  # Mark as completed


    # Determine winner
    if match.score_team1 > match.score_team2:
        match.winner_id = match.team1_id
    elif match.score_team2 > match.score_team1:
        match.winner_id = match.team2_id
    else:
        match.winner_id = None  # Tie scenario


    db.session.commit()


    return jsonify({
        "message": "Match scores updated successfully",
        "match_id": match.match_id,
        "score_team1": match.score_team1,
        "score_team2": match.score_team2,
        "winner_id": match.winner_id
    }), 200


# Function to retrieve match scores with team names
@tournament_bp.route('/match/<int:match_id>/get_scores', methods=['GET'])
def get_match_scores(match_id):
    match = Match.query.get(match_id)
    if not match:
        return jsonify({"error": "Match not found"}), 404


    # Fetch team names
    team1 = Team.query.get(match.team1_id)
    team2 = Team.query.get(match.team2_id)
    winner_team = Team.query.get(match.winner_id) if match.winner_id else None


    return jsonify({
        "match_id": match.match_id,
        "tournament_id": match.tournament_id,
        "team1_name": team1.team_name if team1 else "Unknown",
        "team2_name": team2.team_name if team2 else "Unknown",
        "score_team1": match.score_team1,
        "score_team2": match.score_team2,
        "winner_team": winner_team.team_name if winner_team else "Draw",
        "status": "Completed" if match.status == 1 else "Pending"
    }), 200


# Returns statistics based on tournament id
@tournament_bp.route('/report/tournament_status/<int:tournament_id>', methods=['GET'])
def get_tournament_status(tournament_id):
    tournament = Tournament.query.get(tournament_id)
   
    if not tournament:
        return jsonify({"error": "Tournament not found"}), 404


    university = University.query.get(tournament.university_id)
   
    if not university:
        return jsonify({"error": "University not found"}), 404


    # Get next match date for the tournament
    next_match = db.session.query(Match.start_time).filter(
        Match.tournament_id == tournament_id,
        Match.start_time >= datetime.utcnow()
    ).order_by(Match.start_time).first()


    next_match_date = next_match[0] if next_match else None


    # Count total matches played
    matches_played = db.session.query(Match).filter(
        Match.tournament_id == tournament_id,
        Match.status == 1  # Only completed matches
    ).count()


    # Count total matches scheduled for the next tournament day
    matches_on_next_day = db.session.query(Match).filter(
        Match.tournament_id == tournament_id,
        Match.start_time == next_match_date
    ).count() if next_match_date else 0


    # Check if the tournament is complete
    is_complete = datetime.utcnow().date() > tournament.end_date if tournament.end_date else False


    return jsonify({
        "tournament_name": tournament.name,
        "next_match_date": next_match_date,
        "university_name": university.university_name,
        "university_country": university.country,
        "matches_on_next_day": matches_on_next_day,
        "matches_played": matches_played,
        "is_complete": is_complete
    }), 200


# Returns total tournament statistics
@tournament_bp.route('/report/total_tournament_statistics', methods=['GET'])
def get_total_tournament_statistics():
    # Count distinct universities that have at least one active tournament
    active_university_count = db.session.query(db.func.count(db.distinct(Tournament.university_id))).filter(
        Tournament.end_date >= datetime.utcnow().date()
    ).scalar()


    # Count total matches yet to be played (status = 0)
    matches_yet_to_play = db.session.query(Match).filter(
        Match.status == 0  # Matches not yet completed
    ).count()


    # Count total completed matches (status = 1)
    matches_completed = db.session.query(Match).filter(
        Match.status == 1  # Matches completed
    ).count()


    return jsonify({
        "active_universities": active_university_count,
        "matches_yet_to_play": matches_yet_to_play,
        "matches_completed": matches_completed
    }), 200


# Function to get tournament statistics with optional date range filtering
@tournament_bp.route('/statistics', methods=['GET'])
def get_tournament_statistics():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')


    query = Tournament.query
    if start_date and end_date:
        try:
            start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
            end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
            query = query.filter(Tournament.created_at.between(start_date, end_date))
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400


    tournaments = query.all()
    return jsonify([{
        "tournament_id": t.tournament_id,
        "name": t.name,
        "start_date": t.start_date,
        "end_date": t.end_date,
        "created_at": t.created_at
    } for t in tournaments]), 200

@tournament_bp.route('/tournaments', methods=['GET'])
def get_all_tournaments():
    tournaments = Tournament.query.all()
    response = []

    for t in tournaments:
        university = University.query.get(t.university_id)
        response.append({
            "id": t.tournament_id,
            "name": t.name,
            "university": university.university_name if university else "Unknown",
            "logo": university.university_image if university else "https://via.placeholder.com/50",
            "status": "APPLY" if datetime.utcnow().date() < t.end_date else "VIEW"
        })

    return jsonify(response), 200
