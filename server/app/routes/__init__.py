from flask import Blueprint

# Import all route blueprints
from app.routes.auth_routes import auth_bp
from app.routes.team_routes import team_bp
from app.routes.team_requests_routes import team_requests_bp
from app.routes.university_routes import university_bp
from app.routes.stripe_routes import stripe_bp 
from app.payments.stripe_webhooks import webhook_bp

# Create a Blueprint registry
def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(team_bp, url_prefix="/teams")
    app.register_blueprint(team_requests_bp, url_prefix="/team_requests")
    app.register_blueprint(university_bp, url_prefix="/university")
    app.register_blueprint(stripe_bp, url_prefix="/stripe")     # e.g. /stripe/create-payment-intent
    app.register_blueprint(webhook_bp)                           # e.g. /webhook
