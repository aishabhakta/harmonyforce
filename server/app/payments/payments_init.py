from flask import Flask
from app.routes.stripe_routes import stripe_bp
from app.payments.stripe_webhooks import webhook_bp
from flask_sqlalchemy import SQLAlchemy


def create_payments_app(app):  # 👈 pass in the main app
    from app.routes.stripe_routes import stripe_bp
    from app.payments.stripe_webhooks import webhook_bp

    # app.register_blueprint(stripe_bp, url_prefix="/stripe")
    # app.register_blueprint(webhook_bp, url_prefix="/stripe")

