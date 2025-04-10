// src/pages/PaymentPage.tsx
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import CheckoutForm from "./CheckoutForm";
import { apiFetch } from "../api";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51QtzIzRs2kvuUjpRcFD95L5g9qisHKIwua7Scho2hwOfTZDVODAMxEZGDFOsu0gdPbKoN0pZhSgW0QqAZc6CqLe8003zbdmLbK"
);

const PaymentPage: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    apiFetch("/stripe/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({
        amount: 1000,
        currency: "usd",
        email: "test@example.com",
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret || data.client_secret))
      .catch((err) => console.error("Failed to fetch payment intent", err));
  }, []);

  const appearance = { theme: "stripe" } as const;
  const options: StripeElementsOptions = { clientSecret, appearance };

  if (!clientSecret) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f5f5f5"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading payment details...</Typography>
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper
        elevation={6}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          width: "100%",
          maxWidth: "1000px",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        {/* Left Side - Info */}
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Register your placement in your team
          </Typography>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            $10.00
          </Typography>
          <Typography variant="body1" color="text.secondary">
            In order to participate in the upcoming tournament games, you’ll
            need to pay a one-time registration fee.
          </Typography>
        </Box>

        {/* Right Side - Stripe Payment Form */}
        <Box
          bgcolor="#fafafa"
          p={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box width="100%" maxWidth="400px">
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentPage;
