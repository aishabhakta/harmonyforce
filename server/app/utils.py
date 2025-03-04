import jwt
from flask import request, jsonify
from functools import wraps
import os

# Load secret key from environment variables
SECRET_KEY = os.getenv('SECRET_KEY')

# Use a set to store blacklisted tokens
blacklisted_tokens = set()

def verify_jwt(f):
    """Decorator to verify JWT token and check if it's blacklisted."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Unauthorized"}), 401

        token = token.replace("Bearer ", "")  # Remove "Bearer " prefix if present

        if token in blacklisted_tokens:
            return jsonify({"error": "Token has been revoked. Please log in again."}), 403

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = decoded_token["user_id"]  # Attach user_id to request
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 403

        return f(*args, **kwargs)

    return wrapper

def blacklist_token(token):
    """Function to add a token to the blacklist."""
    blacklisted_tokens.add(token)
