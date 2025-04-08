from flask import Blueprint, request, jsonify
from app.database import db
from app.models import Team, TeamRequest, User
from datetime import datetime, timedelta

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
    user_id = data.get('user_id')
    team_id = data.get('team_id')

    if not user_id or not team_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user exists and is not already in a team
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.team_id:
        return jsonify({"error": "You are already part of a team"}), 400

    # Check if team exists
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404

    # Check team size (including captain)
    member_count = User.query.filter_by(team_id=team_id).count()
    if member_count >= 7:
        return jsonify({"error": "Team already has 7 members"}), 400

    # Check for existing request
    existing_request = TeamRequest.query.filter_by(user_id=user_id, team_id=team_id).first()
    if existing_request:
        return jsonify({"error": "Join request already sent"}), 400

    # Create the new join request
    new_request = TeamRequest(
        user_id=user_id,
        team_id=team_id,
        created_at=datetime.utcnow(),
        status='pending'
    )

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

@team_requests_bp.route('/pending-join-requests', methods=['GET'])
def get_pending_join_requests():
    results = (
        db.session.query(
            TeamRequest.request_id,
            TeamRequest.created_at,
            User.user_id,
            User.first_name,
            User.last_name,
            Team.team_id,
            Team.team_name
        )
        .join(User, TeamRequest.user_id == User.user_id)
        .join(Team, TeamRequest.team_id == Team.team_id)
        .filter(TeamRequest.status == 'pending')
        .all()
    )

    response = [
        {
            "request_id": r.request_id,
            "created_at": r.created_at.isoformat(),
            "user_id": r.user_id,
            "first_name": r.first_name,
            "last_name": r.last_name,
            "team_id": r.team_id,
            "team_name": r.team_name
        }
        for r in results
    ]

    return jsonify(response), 200
