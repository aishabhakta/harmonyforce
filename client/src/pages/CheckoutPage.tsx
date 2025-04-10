import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
  CircularProgress,
  Box,
  Paper,
  Typography,
  Container,
} from "@mui/material";

const stripePromise = loadStripe(
  "pk_test_51QtzIzRs2kvuUjpRcFD95L5g9qisHKIwua7Scho2hwOfTZDVODAMxEZGDFOsu0gdPbKoN0pZhSgW0QqAZc6CqLe8003zbdmLbK"
);

const CheckoutPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/stripe/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 5000, // $50.00
        user_id: userId,
        currency: "usd",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create payment intent");
        return res.json();
      })
      .then((data) => {
        if (data.client_secret) {
          setClientSecret(data.client_secret);
        } else {
          setError("Stripe did not return a client secret.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography variant="subtitle1" mt={2}>
          Initializing payment...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!clientSecret) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error" variant="h6">
          Payment setup failed.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Complete Your Registration
        </Typography>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
