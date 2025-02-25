from flask import Flask, request, jsonify, session  # Import necessary Flask modules
from flask_cors import CORS  # Enable Cross-Origin Resource Sharing
import psycopg2  # PostgreSQL database adapter
import bcrypt  # Library for hashing passwords
from flask_sqlalchemy import SQLAlchemy  # ORM for database interactions
from datetime import datetime  # Work with date and time
import os  # Work with file paths
from werkzeug.utils import secure_filename  # Secure filename handling
from PIL import Image  # Handle image processing

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:adminpass@localhost/postgres'  # Database connection
app.config['SECRET_KEY'] = 'your_secret_key'  # Required for session management
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Directory to store profile images
CORS(app)  # Enable CORS

# Initialize database
db = SQLAlchemy(app)

# Define Team model
class Team(db.Model):
    __tablename__ = 'teams'
    __table_args__ = {'schema': 'aardvark'}
    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    team_name = db.Column(db.String(45))  # Name of the team
    captain_id = db.Column(db.Integer, nullable=False)  # Leader of the team
    university_id = db.Column(db.Integer, nullable=False)  # Associated university
    profile_image = db.Column(db.String(255))  # Team profile image path
    blacklisted = db.Column(db.SmallInteger, default=0)  # Blacklist status (0 = not blacklisted, 1 = blacklisted)
    created_at = db.Column(db.Date, default=datetime.utcnow)  # Automatically sets creation date

# Define User model
class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'aardvark'}
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'))  # Foreign key to teams
    username = db.Column(db.String(45))  # Username of the user
    email = db.Column(db.String(45))  # Email of the user
    password_hash = db.Column(db.String(255))  # Hashed password storage
    user_type = db.Column(db.String(45))  # Role of the user
    profile_image = db.Column(db.String(255))  # Path to profile image
    created_at = db.Column(db.Date, default=datetime.utcnow)  # Automatically sets creation date

# Define TeamRequests model
class TeamRequest(db.Model):
    __tablename__ = 'team_requests'
    __table_args__ = {'schema': 'aardvark'}
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    user_id = db.Column(db.Integer, db.ForeignKey('aardvark.users.user_id'), nullable=False)  # Requesting user
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'), nullable=False)  # Requested team
    status = db.Column(db.String(20), default='pending')  # Request status
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Timestamp of request

# Function to set a team's blacklist status
@app.route('/team/set_blacklist', methods=['POST'])
def set_blacklist_status():
    data = request.get_json()
    team = Team.query.get(data['team_id'])
    if not team:
        return jsonify({"error": "Team not found"}), 404
    team.blacklisted = data['blacklisted']
    db.session.commit()
    return jsonify({"message": "Blacklist status updated successfully!"}), 200

# Function to add a member to a team
@app.route('/team/add_member', methods=['POST'])
def add_member_to_team():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.team_id = data['team_id']
    db.session.commit()
    return jsonify({"message": "User added to team successfully!"}), 200

# Function to remove a member from a team
@app.route('/team/remove_member', methods=['POST'])
def remove_member_from_team():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.team_id = None
    db.session.commit()
    return jsonify({"message": "User removed from team successfully!"}), 200

# Function to update team details
@app.route('/team/update', methods=['POST'])
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
@app.route('/team/request_join', methods=['POST'])
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
@app.route('/team/view_requests', methods=['GET'])
def view_team_requests():
    leader_id = request.args.get('leader_id')
    team = Team.query.filter_by(captain_id=leader_id).first()
    if not team:
        return jsonify({"error": "No team found for this leader"}), 404
    requests = TeamRequest.query.filter_by(team_id=team.team_id, status='pending').all()
    return jsonify([{ "request_id": r.request_id, "user_id": r.user_id, "team_id": r.team_id } for r in requests]), 200

# Function to approve a join request
@app.route('/team/approve_request', methods=['POST'])
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
@app.route('/team/deny_request', methods=['POST'])
def deny_request():
    data = request.get_json()
    request_entry = TeamRequest.query.get(data['request_id'])
    if not request_entry:
        return jsonify({"error": "Request not found"}), 404
    request_entry.status = 'denied'
    db.session.commit()
    return jsonify({"message": "Request denied successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True)


#CREATE TABLE IF NOT EXISTS team_requests (
#  request_id SERIAL PRIMARY KEY,
#  user_id INT NOT NULL,
#  team_id INT NOT NULL,
#  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'denied'
#  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#);
