from flask import Blueprint, request, jsonify
from app.database import db  
from app import bcrypt 
from app.models import User, PendingRegistration
from datetime import datetime, timedelta
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
    required_fields = ['username', 'email', 'password', 'role', 'university']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if already exists
    if User.query.filter_by(email=data['email']).first() or \
       PendingRegistration.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists or is pending approval"}), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    pending = PendingRegistration(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role=data['role'],
        university=data['university']
    )
    db.session.add(pending)
    db.session.commit()

    return jsonify({"message": "Registration submitted for validation!"}), 201

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

@auth_bp.route('/pending-registrations', methods=['GET'])
def get_pending():
    pendings = PendingRegistration.query.all()
    return jsonify([{
        "id": p.id,
        "username": p.username,
        "email": p.email,
        "role": p.role,
        "university": p.university,
    } for p in pendings])

@auth_bp.route('/approve-registration/<int:pending_id>', methods=['POST'])
def approve_user(pending_id):
    pending = PendingRegistration.query.get(pending_id)
    if not pending:
        return jsonify({"error": "Not found"}), 404

    user = User(
        username=pending.username,
        email=pending.email,
        password_hash=pending.password_hash,
        user_type=pending.role,
        university_id=None,  # Map based on name if needed
        status=1,
        blacklisted=0,
        created_at=datetime.utcnow()
    )
    db.session.add(user)
    db.session.delete(pending)
    db.session.commit()

    return jsonify({"message": "User approved and registered!"}), 201

@auth_bp.route('/reject-registration/<int:pending_id>', methods=['POST'])
def reject_user(pending_id):
    pending = db.session.get(PendingRegistration, pending_id)
    if not pending:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(pending)
    db.session.commit()

    return jsonify({"message": "User registration rejected and removed."}), 200

