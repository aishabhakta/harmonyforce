from flask import Blueprint, request, jsonify
from app.database import db  
from app import bcrypt 
from app.models import User
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

auth_bp = Blueprint('auth', __name__)

# Use a fallback secret key in case env variable is not set
SECRET_KEY = os.getenv('SECRET_KEY', 'your_default_secret_key')

# Store blacklisted tokens (Use Redis in production)
blacklisted_tokens = set()

def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=1),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# JWT Verification Middleware
def verify_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        
        if not token or not token.startswith("Bearer "):
            return jsonify({"error": "Token is missing!"}), 401
        
        token = token.split(" ")[1]  # Extract token part
        
        if token in blacklisted_tokens:
            return jsonify({"error": "Token has been revoked!"}), 401
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token!"}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# User Registration
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

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

    if not user or not user.password_hash or not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_jwt(user.user_id)

    return jsonify({"message": "Login successful!", "token": token}), 200

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
