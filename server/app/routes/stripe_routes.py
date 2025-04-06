from flask import Blueprint, request, jsonify
from app.payments.stripe_service import create_payment_intent
from app.database import db
from app.models import Payment
from flask_cors import CORS 

stripe_bp = Blueprint('stripe', __name__)
CORS(stripe_bp, origins=["http://localhost:5173"])

@stripe_bp.route('/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.json
    amount = data.get("amount")
    currency = data.get("currency", "usd")
    email = data.get("email")

    if not amount or not email:
        return jsonify({"error": "Missing required parameters"}), 400

    intent = create_payment_intent(amount, currency, email)
    if "error" in intent:
        return jsonify(intent), 400

    new_payment = Payment(
        email=email,
        amount=amount,
        currency=currency,
        status=intent["status"],
        payment_intent_id=intent["id"]
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify(intent)

@stripe_bp.route('/check-payment', methods=['GET'])
def check_payment():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    payment = Payment.query.filter_by(email=email).order_by(Payment.created_at.desc()).first()
    if not payment:
        return jsonify({"status": "No payment found"}), 404

    return jsonify({
        "email": payment.email,
        "amount": payment.amount,
        "currency": payment.currency,
        "status": payment.status,
        "payment_intent_id": payment.payment_intent_id
    })
