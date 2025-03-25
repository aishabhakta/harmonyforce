from flask import Blueprint, jsonify
from app.utils import role_required  # Import role-based middleware

# Define a new Blueprint for protected routes
protected_bp = Blueprint('protected', __name__)

# Admin-only route
@protected_bp.route('/admin/dashboard', methods=['GET'])
@role_required('superadmin')
def admin_dashboard():
    return jsonify({"message": "Welcome, Super Admin!"}), 200

# Tournament Moderator Route
@protected_bp.route('/tournament/moderator', methods=['GET'])
@role_required('tournymod')
def tournament_moderator():
    return jsonify({"message": "Welcome, Tournament Moderator!"}), 200

# General user route (accessible to all roles)
@protected_bp.route('/dashboard', methods=['GET'])
@role_required('general', 'participant', 'captain', 'tournymod', 'unimod', 'aardvarkstaff', 'superadmin')
def general_dashboard():
    return jsonify({"message": "Welcome to your dashboard!"}), 200
