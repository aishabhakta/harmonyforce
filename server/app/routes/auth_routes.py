from flask import Blueprint, request, jsonify
from app.database import db  
from app import bcrypt 
from app.models import User
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps
from app.utils import generate_jwt, verify_jwt, blacklisted_tokens

auth_bp = Blueprint('auth', __name__)

# Use a fallback secret key in case env variable is not set
SECRET_KEY = os.getenv('SECRET_KEY')

# Store blacklisted tokens (Use Redis in production)
blacklisted_tokens = set()

# User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # logging.info(f"Received data: {data}")  # Debugging: Log received data

    if not data:
        return jsonify({"error": "Invalid or missing JSON payload"}), 400

    required_fields = ['username', 'email', 'password', 'role']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Check if the email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Create the new user
    new_user = User(
        team_id=1,
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        user_type=data['role'],
        status=1,
        blacklisted=0
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

# User Login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(user.user_id, user.user_type)  # Include role in JWT

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "role": user.user_type  # Send role to frontend
    }), 200

# Protected Route
@auth_bp.route('/protected', methods=['GET'])
@verify_jwt
def protected():
    return jsonify({"message": "Access granted", "user_id": request.user_id}), 200

# User Logout (Blacklist Token)
@auth_bp.route('/logout', methods=['POST'])
@verify_jwt
def logout():
    token = request.headers.get("Authorization")

    if token and token.startswith("Bearer "):
        token = token.split(" ")[1]
        blacklisted_tokens.add(token)  # Add token to blacklist
    
    return jsonify({"message": "Logout successful!"}), 200
