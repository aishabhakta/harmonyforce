import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, CircularProgress } from "@mui/material";

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setError(error.message ?? "An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <PaymentElement />
      </Paper>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!stripe || loading}
        sx={{ fontWeight: "bold", textTransform: "none", py: 1.5 }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Processing...
          </>
        ) : (
          "Pay"
        )}
      </Button>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CheckoutForm;
