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
