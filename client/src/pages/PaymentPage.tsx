// src/pages/PaymentPage.tsx
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import type { StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51QtzIzRs2kvuUjpRcFD95L5g9qisHKIwua7Scho2hwOfTZDVODAMxEZGDFOsu0gdPbKoN0pZhSgW0QqAZc6CqLe8003zbdmLbK"
);

const PaymentPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000, currency: "usd", email: "test@example.com" }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret || data.client_secret));
  }, []);

  const appearance = { theme: "stripe" } as const;
  const options: StripeElementsOptions = { clientSecret, appearance };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      {!clientSecret ? (
        <div className="text-gray-500 text-lg">Loading payment details...</div>
      ) : (
        <div className="w-full max-w-6xl h-full bg-white shadow-xl rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left side - Info */}
          <div className="bg-white p-12 flex flex-col justify-center">
            <div className="max-w-md">
              <h1 className="text-3xl font-bold mb-4">Register your placement in your team</h1>
              <p className="text-4xl font-extrabold text-gray-900 mb-4">$10.00</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                In order to participate in the upcoming tournament games, you’ll need to pay a one-time registration fee.
              </p>
            </div>
          </div>

          {/* Right side - Payment */}
          <div className="bg-gray-50 flex justify-center items-center p-12">
            <div className="w-full max-w-sm">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
