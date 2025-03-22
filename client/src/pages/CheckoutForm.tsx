import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); //  Used for navigation

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded");
      setLoading(false);
      return;
    }

    // 🔹 Step 1: Request Payment Intent from Flask
    const response = await fetch("http://127.0.0.1:5000/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 5000, // Adjust based on the purchase amount
        currency: "usd",
        email: "testuser@gmail.com"
      }),
    });

    const { client_secret } = await response.json();

    if (!client_secret) {
      setError("Failed to fetch payment intent.");
      setLoading(false);
      return;
    }

    // 🔹 Step 2: Confirm Payment with Stripe
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("No card details provided");
      setLoading(false);
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(client_secret, {
      payment_method: { card: cardElement }
    });

    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("✅ Payment successful!", paymentIntent);
      setError(null);
      navigate("/success"); // ✅ Redirect to success page
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CheckoutForm;
