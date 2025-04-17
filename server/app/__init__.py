from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import database and bcrypt from database.py
from app.database import db, migrate, bcrypt

# Import blueprints registration function
from app.routes import register_blueprints
from app.payments.payments_init import create_payments_app

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": "http://18.218.163.17",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Allow only frontend origin
    # CORS(app, resources={r"/*": {"origins": "http://18.218.163.17"}})
    # CORS(app, resources={r"/*": {"origins": "http://18.218.163.17"}}, supports_credentials=True)

    # Load configuration
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app) 
    migrate.init_app(app, db)

    # Register all blueprints
    register_blueprints(app)
    create_payments_app(app)

    return app
