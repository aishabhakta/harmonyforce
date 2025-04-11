from flask import Blueprint, request, jsonify
from app.payments.stripe_service import create_payment_intent
from app.database import db
from app.models import Payment, User 
from flask_cors import CORS 

stripe_bp = Blueprint('stripe', __name__)
CORS(stripe_bp, origins=["http://localhost:5173"])

@stripe_bp.route('/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.json
    amount = data.get("amount")
    currency = data.get("currency", "usd")
    user_id = data.get("user_id")  # 👈 Get user_id from frontend

    if not amount or not user_id:
        return jsonify({"error": "Missing required parameters"}), 400

    # Get user email from DB
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    email = user.email

    # Create Stripe PaymentIntent
    intent = create_payment_intent(amount, currency, email)
    if "error" in intent:
        return jsonify(intent), 400

    # Save to payments table
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


@stripe_bp.route('/check-user-paid/<int:user_id>', methods=['GET'])
def check_user_paid(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    latest_payment = (
        Payment.query
        .filter_by(email=user.email, status='succeeded')
        .order_by(Payment.created_at.desc())
        .first()
    )

    if not latest_payment:
        return jsonify({
            "status": "not_paid"
        }), 200

    return jsonify({
        "email": latest_payment.email,
        "status": latest_payment.status,
        "amount": latest_payment.amount,
        "payment_intent_id": latest_payment.payment_intent_id
    }), 200
