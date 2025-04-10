from flask import Blueprint, request, jsonify
import stripe
import os
from app.database import db
from app.models import Payment

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

webhook_bp = Blueprint("webhook", __name__)

@webhook_bp.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data()  # ✅ Safer for signature verification
    sig_header = request.headers.get("Stripe-Signature")

    # 🔍 Debug prints
    print("📥 Received Payload:", payload.decode("utf-8"))
    print("📩 Signature Header:", sig_header)
    print("🔐 Webhook Secret from .env:", WEBHOOK_SECRET)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, WEBHOOK_SECRET
        )
        print(f"✅ Verified Stripe Event: {event['type']}")
    except ValueError:
        print("❌ Invalid payload")
        return jsonify({"error": "Invalid payload"}), 400
    except stripe.error.SignatureVerificationError:
        print("❌ Invalid signature")
        return jsonify({"error": "Invalid signature"}), 400

    # Handle successful payment
    if event["type"] == "payment_intent.succeeded":
        intent = event["data"]["object"]
        payment_intent_id = intent["id"]
        amount = intent["amount"]
        currency = intent["currency"]
        email = intent.get("receipt_email") or intent.get("metadata", {}).get("email") or "unknown@example.com"

        print(f"💰 Payment succeeded for {email}, intent: {payment_intent_id}")

        payment = Payment.query.filter_by(payment_intent_id=payment_intent_id).first()
        if not payment:
            print("🆕 Creating new Payment entry...")
            payment = Payment(
                email=email,
                amount=amount,
                currency=currency,
                status="succeeded",
                payment_intent_id=payment_intent_id
            )
            db.session.add(payment)
        else:
            print("♻️ Updating existing Payment to 'succeeded'")
            payment.status = "succeeded"

        db.session.commit()

    # Handle failed payment
    elif event["type"] == "payment_intent.payment_failed":
        intent = event["data"]["object"]
        payment_intent_id = intent["id"]
        payment = Payment.query.filter_by(payment_intent_id=payment_intent_id).first()
        if payment:
            print("⚠️ Marking payment as failed")
            payment.status = "failed"
            db.session.commit()

    # Handle refund
    elif event["type"] == "charge.refunded":
        charge = event["data"]["object"]
        payment_intent_id = charge["payment_intent"]
        payment = Payment.query.filter_by(payment_intent_id=payment_intent_id).first()
        if payment:
            print("💸 Marking payment as refunded")
            payment.status = "refunded"
            db.session.commit()

    return jsonify({"status": "success"}), 200
