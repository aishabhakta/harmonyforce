import stripe
import os
from dotenv import load_dotenv

load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_payment_intent(amount: int, currency: str, email: str):
    try:
        return stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            receipt_email=email
        )
    except Exception as e:
        return {"error": str(e)}
