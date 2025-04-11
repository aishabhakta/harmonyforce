from flask import Blueprint, request, jsonify
from app.database import db  
from app import bcrypt 
from app.models import User, PendingRegistration, University
from datetime import datetime, timedelta
import os
from functools import wraps
from app.utils import generate_jwt, verify_jwt, blacklisted_tokens
from werkzeug.utils import secure_filename
from app.models import Payment

auth_bp = Blueprint('auth', __name__)

# Use a fallback secret key in case env variable is not set
SECRET_KEY = os.getenv('SECRET_KEY')

# Store blacklisted tokens (Use Redis in production)
blacklisted_tokens = set()

# User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['username', 'email', 'password', 'university']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Default role to participant
    role = data.get('role', 'participant').lower()

    # Convert university name to ID
    university = University.query.filter_by(university_name=data['university']).first()
    if not university:
        return jsonify({"error": "University not found"}), 400

    # Check if email already exists or is pending
    if User.query.filter_by(email=data['email']).first() or \
       PendingRegistration.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists or is pending approval"}), 409

    # Hash password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # If role is participant → add to pending table
    if role == 'participant':
        pending = PendingRegistration(
            username=data['username'],
            email=data['email'],
            password_hash=hashed_password,
            role=role,
            university=university.university_id,
            team_id=0, 
        )
        db.session.add(pending)
        db.session.commit()
        return jsonify({"message": "Registration submitted for validation!"}), 201

    # All other roles → directly create User
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        user_type=role,
        university_id=university.university_id,
        status=1,
        blacklisted=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
        team_id=0  
    )
    db.session.add(user)
    db.session.commit()

    existing_payment = Payment.query.filter_by(email=user.email).first()
    if not existing_payment:
        placeholder_payment = Payment(
            email=user.email,
            amount=0,
            currency="usd",
            status="pending",
            payment_intent_id=f"placeholder_user_{user.user_id}"
        )
        db.session.add(placeholder_payment)
        db.session.commit()
        print(f"📝 Placeholder payment created for {user.email}")

    return jsonify({"message": "User registered successfully!"}), 201

# User Login
# @auth_bp.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     user = User.query.filter_by(email=data['email']).first()

#     if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
#         return jsonify({"error": "Invalid email or password"}), 401

#     token = generate_jwt(user.user_id, user.user_type)  # Include role in JWT

#     return jsonify({
#         "message": "Login successful!",
#         "token": token,
#         "role": user.user_type,
#         "user_id": user.user_id,
#         "email": user.email,
#         "username": user.username,
#         "profile_image": user.profile_image,
#         "team_id": user.team_id,
#         "university_id": user.university_id,
#     }), 200
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print("LOGIN DATA:", data)

    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        print("USER NOT FOUND")
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.check_password_hash(user.password_hash, data["password"]):
        print("PASSWORD MISMATCH")
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(user.user_id, user.user_type)
    # return jsonify({
    #     "message": "Login successful!",
    #     "token": token,
    #     "user": {
    #         "user_id": user.user_id,
    #         "email": user.email,
    #         "role": user.user_type,
    #         "username": user.username,
    #         "team_id": user.team_id,
    #         "university_id": user.university_id
    #     }
    # }), 200
    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user_id": user.user_id,
        "email": user.email,
        "role": user.user_type,
        "username": user.username,
        "team_id": user.team_id,
        "university_id": user.university_id,
        "profile_image": user.profile_image
    }), 200


# Protected Route
@auth_bp.route('/protected', methods=['GET'])
@verify_jwt
def protected():
    return jsonify({"message": "Access granted", "user_id": request.user_id}), 200

# User Logout (Blacklist Token)
@auth_bp.route('/logout', methods=['POST'])
# @verify_jwt
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
        team_id=0,
        university_id=None,  # Map based on name if needed
        status=1,
        blacklisted=0,
        created_at=datetime.utcnow()
    )
    db.session.add(user)
    db.session.delete(pending)
    db.session.commit()

    # ✅ Add placeholder payment after approval
    existing_payment = Payment.query.filter_by(email=user.email).first()
    if not existing_payment:
        placeholder_payment = Payment(
            email=user.email,
            amount=0,
            currency="usd",
            status="pending",
            payment_intent_id=f"placeholder_user_{user.user_id}"
        )
        db.session.add(placeholder_payment)
        db.session.commit()
        print(f"🧾 Placeholder created after approval for {user.email}")

    return jsonify({"message": "User approved and registered!"}), 201

@auth_bp.route('/reject-registration/<int:pending_id>', methods=['POST'])
def reject_user(pending_id):
    pending = db.session.get(PendingRegistration, pending_id)
    if not pending:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(pending)
    db.session.commit()

    return jsonify({"message": "User registration rejected and removed."}), 200

@auth_bp.route('/update-profile/<int:user_id>', methods=['POST'])
def update_profile(user_id):
    data = request.get_json()

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        user.first_name = data.get("first_name")
        user.last_name = data.get("last_name")
        user.username = data.get("username")
        user.password_hash = data.get("password")  # hash in real use
        user.bio = data.get("bio")
        user.updated_at = datetime.utcnow()

        db.session.commit()
        return jsonify({"message": "Profile updated successfully!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500