from flask import Flask, request, jsonify, session  # Import necessary Flask modules
from flask_cors import CORS                         # Enable Cross-Origin Resource Sharing
import psycopg2                                     # PostgreSQL database adapter
import bcrypt                                       # Library for hashing passwords
from flask_sqlalchemy import SQLAlchemy             # ORM for database interactions
from datetime import datetime                       # Work with date and time
import os                                           # Work with file paths
from werkzeug.utils import secure_filename          # Secure filename handling
from PIL import Image                               # Handle image processing (pip install pillow)

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
    team_name = db.Column(db.String(45))  
    captain_id = db.Column(db.Integer, nullable=False)  # Leader of the team
    university_id = db.Column(db.Integer, nullable=False) 
    profile_image = db.Column(db.String(255))  # Team profile image path
    created_at = db.Column(db.Date, default=datetime.utcnow)  # Automatically sets creation date

# Define User model
class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'aardvark'}
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Primary key
    team_id = db.Column(db.Integer, db.ForeignKey('aardvark.teams.team_id'))  # Foreign key to teams
    username = db.Column(db.String(45))  
    email = db.Column(db.String(45)) 
    password_hash = db.Column(db.String(255))  # Hashed pass
    user_type = db.Column(db.String(45))  # Role of the user
    profile_image = db.Column(db.String(255))  # Path to profile image
    created_at = db.Column(db.Date, default=datetime.utcnow)  # Automatically sets creation date

# Function to hash passwords
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')  # Return hashed password as a string

# Route to register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = hash_password(data['password'])
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        user_type=data['role'],
        profile_image=data.get('profile_image', None),  # Optional profile image
        created_at=datetime.utcnow()
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201

# Route to log in a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()  # Find user by email
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        session['user_id'] = user.user_id  # Store user session
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

# Route to register a new team
@app.route('/register_team', methods=['POST'])
def register_team():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401  # Ensure user is logged in
    
    data = request.get_json()
    captain_id = session['user_id']  # Use logged-in user as team captain
    
    new_team = Team(
        team_name=data['team_name'],
        captain_id=captain_id,
        university_id=data['university_id'],
        profile_image=data.get('profile_image', None),
        created_at=datetime.utcnow()
    )
    db.session.add(new_team)
    db.session.commit()
    
    # Assign leader to the created team
    leader = User.query.get(captain_id)
    if leader:
        leader.team_id = new_team.team_id
        db.session.commit()
    
    return jsonify({"message": "Team registered successfully!", "team_id": new_team.team_id}), 201

# Route to get team details
@app.route('/team/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = Team.query.get(team_id)
    if not team:
        return jsonify({"error": "Team not found"}), 404
    
    members = User.query.filter_by(team_id=team_id).all()
    members_data = sorted(
        [{"user_id": m.user_id, "username": m.username, "profile_image": m.profile_image} for m in members],
        key=lambda x: x['user_id'] != team.captain_id  # Ensure captain is listed first
    )
    
    return jsonify({"team_name": team.team_name, "members": members_data})

# Route to get details of a specific team member
@app.route('/member/<int:user_id>', methods=['GET'])
def get_member(user_id):
    member = User.query.get(user_id)
    if not member:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user_id": member.user_id,
        "username": member.username,
        "email": member.email,
        "profile_image": member.profile_image
    })

# Route to upload a profile image
@app.route('/upload_profile_image', methods=['POST'])
def upload_profile_image():
    if 'user_id' not in session:
        return jsonify({"error": "User not logged in"}), 401  # Ensure user is logged in
    
    if 'image' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['image']
    filename = secure_filename(file.filename)  # Sanitize filename
    
    if len(filename) > 100:
        return jsonify({"error": "Filename too long"}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)  # Save file to upload folder
    
    # Validate image dimensions
    with Image.open(filepath) as img:
        if img.width != img.height:  # Ensure image is a perfect square
            os.remove(filepath)
            return jsonify({"error": "Image must be a perfect square"}), 400
    
    user = User.query.get(session['user_id'])
    user.profile_image = filepath  # Store file path in database
    db.session.commit()
    
    return jsonify({"message": "Profile image uploaded successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True)
