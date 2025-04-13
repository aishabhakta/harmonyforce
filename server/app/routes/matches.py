from flask import Blueprint, request, jsonify
from app.models import db, Match

matches_bp = Blueprint("matches", __name__)

@matches_bp.route('/<int:match_id>', methods=['PUT']) 
def update_match(match_id):
    data = request.get_json()

    match = db.session.query(Match).filter_by(match_id=match_id).first()
    if not match:
        return jsonify({"error": "Match not found"}), 404

    match.score_team1 = data.get("score_team1", match.score_team1)
    match.score_team2 = data.get("score_team2", match.score_team2)
    match.start_time = data.get("start_time", match.start_time)
    match.end_time = data.get("end_time", match.end_time)
    match.winner_id = data.get("winner_id", match.winner_id)
    match.status = data.get("status", match.status)

    db.session.commit()
    return jsonify({"message": "Match updated successfully"})

@matches_bp.route('/tournament/<int:tournament_id>', methods=['GET'])
def get_matches_by_tournament(tournament_id):
    matches = Match.query.filter_by(tournament_id=tournament_id).all()
    match_list = []
    for match in matches:
        match_list.append({
            "match_id": match.match_id,
            "tournament_id": match.tournament_id,
            "team1_id": match.team1_id,
            "team2_id": match.team2_id,
            "score_team1": match.score_team1,
            "score_team2": match.score_team2,
            "winner_id": match.winner_id,
            "start_time": str(match.start_time) if match.start_time else None,
            "end_time": str(match.end_time) if match.end_time else None,
            "status": match.status,
            "team1_name": f"Team {match.team1_id}",
            "team2_name": f"Team {match.team2_id}",
            "team1_university": "School",
            "team2_university": "School"
        })
    return jsonify(match_list)



