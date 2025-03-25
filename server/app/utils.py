import jwt
from flask import request, jsonify
from functools import wraps
import os
from datetime import datetime, timedelta

# Load secret key from environment variables
SECRET_KEY = os.getenv('SECRET_KEY')

# Use a set to store blacklisted tokens
blacklisted_tokens = set()

# Generate JWT Token (Includes User Role)
def generate_jwt(user_id, role):
    payload = {
        "user_id": user_id,
        "role": role,  # Include role
        "exp": datetime.utcnow() + timedelta(days=1),  # Token expires in 1 day
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

def blacklist_token(token):
    """Function to add a token to the blacklist."""
    blacklisted_tokens.add(token)


# Role-Based Access Control Middleware
def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.headers.get("Authorization")

            if not token or not token.startswith("Bearer "):
                return jsonify({"error": "Token is missing!"}), 401

            token = token.split(" ")[1]  # Extract token part

            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_role = payload.get("role")

                if user_role not in allowed_roles:
                    return jsonify({"error": "Access denied! Insufficient permissions."}), 403

                request.user_id = payload["user_id"]
                request.user_role = user_role  # Store role for use in views

            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token has expired!"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid token!"}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator
