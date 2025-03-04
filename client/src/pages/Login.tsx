import { useState, useEffect } from "react";
import { Button, TextField, Typography, Link, Box, Snackbar, Alert } from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; 
import { Google } from "@mui/icons-material";
import { useAuth } from "../AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/"); // Redirect if already logged in
    }
  }, [navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.token;
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_displayName", data.displayName || "");
        localStorage.setItem("user_photoURL", data.photoURL || "");

        setUser({
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          token,
        });

        setOpenSnackbar(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setUser({
        email: user.email || "",
        displayName: user.displayName || "",
        photoURL: user.photoURL || ""
      });

      const response = await fetch("http://127.0.0.1:5000/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.displayName, googleId: user.uid }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("jwt_token", data.token);
        setOpenSnackbar(true);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Google login failed. Please try again.");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("An error occurred during Google Sign-In.");
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Box sx={{ display: "flex", height: "98vh", backgroundColor: "#f5f5f5" }}>
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h3">Sign In</Typography>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />
          {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
          <Button variant="contained" fullWidth size="large" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
            Sign In
          </Button>
          <Button variant="outlined" fullWidth size="large" sx={{ mb: 2 }} onClick={handleGoogleSignIn}>
            <Google sx={{ color: "#4285F4" }} /> Sign In with Google
          </Button>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/register" underline="hover">
              Register for one
            </Link>
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "50%",
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <img
          src={heroImg}
          alt="A red swirl on a black background"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
          }}
        />
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Login successful!
        </Alert>
      </Snackbar>
    </Box>
  );
}
