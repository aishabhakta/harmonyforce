from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, TeamRequest, User

team_requests_bp = Blueprint('team_requests', __name__)

# Function to set a team's blacklist status
@team_requests_bp.route('/set_blacklist', methods=['POST'])
def set_blacklist_status():
    data = request.get_json()
    team = Team.query.get(data['team_id'])
    if not team:
        return jsonify({"error": "Team not found"}), 404
    team.blacklisted = data['blacklisted']
    db.session.commit()
    return jsonify({"message": "Blacklist status updated successfully!"}), 200

# Function to add a member to a team
@team_requests_bp.route('/add_member', methods=['POST'])
def add_member_to_team():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.team_id = data['team_id']
    db.session.commit()
    return jsonify({"message": "User added to team successfully!"}), 200

# Function to remove a member from a team
@team_requests_bp.route('/remove_member', methods=['POST'])
def remove_member_from_team():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.team_id = None
    db.session.commit()
    return jsonify({"message": "User removed from team successfully!"}), 200

# Function to update team details
@team_requests_bp.route('/update', methods=['POST'])
def update_team():
    data = request.get_json()
    team = Team.query.get(data['team_id'])
    if not team:
        return jsonify({"error": "Team not found"}), 404
    team.team_name = data.get('team_name', team.team_name)
    team.profile_image = data.get('profile_image', team.profile_image)
    db.session.commit()
    return jsonify({"message": "Team updated successfully!"}), 200

# Function to send a request to join a team
@team_requests_bp.route('/request_join', methods=['POST'])
def request_join_team():
    data = request.get_json()
    existing_request = TeamRequest.query.filter_by(user_id=data['user_id'], team_id=data['team_id']).first()
    if existing_request:
        return jsonify({"error": "Request already exists"}), 400
    new_request = TeamRequest(user_id=data['user_id'], team_id=data['team_id'])
    db.session.add(new_request)
    db.session.commit()
    return jsonify({"message": "Join request sent successfully!"}), 201

# Function to view join requests for a team leader
@team_requests_bp.route('/view_requests/<int:leader_id>', methods=['GET'])
def view_team_requests(leader_id):
    team = Team.query.filter_by(captain_id=leader_id).first()
    if not team:
        return jsonify({"error": "No team found for this leader"}), 404
    requests = TeamRequest.query.filter_by(team_id=team.team_id, status='pending').all()
    return jsonify([
        {
            "request_id": r.request_id,
            "user_id": r.user_id,
            "team_id": r.team_id
        }
        for r in requests
    ]), 200

# Function to approve a join request
@team_requests_bp.route('/approve_request', methods=['POST'])
def approve_request():
    data = request.get_json()
    request_entry = TeamRequest.query.get(data['request_id'])
    if not request_entry:
        return jsonify({"error": "Request not found"}), 404
    user = User.query.get(request_entry.user_id)
    user.team_id = request_entry.team_id
    request_entry.status = 'approved'
    db.session.commit()
    return jsonify({"message": "User added to team successfully!"}), 200

# Function to deny a join request
@team_requests_bp.route('/deny_request', methods=['POST'])
def deny_request():
    data = request.get_json()
    request_entry = TeamRequest.query.get(data['request_id'])
    if not request_entry:
        return jsonify({"error": "Request not found"}), 404
    request_entry.status = 'denied'
    db.session.commit()
    return jsonify({"message": "Request denied successfully!"}), 200