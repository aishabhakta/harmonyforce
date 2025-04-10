import { useState, useEffect } from "react";
import { Button, TextField, Typography, Link, Box, Snackbar, Alert } from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import { useNavigate } from "react-router-dom";
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
        const response = await fetch("http://127.0.0.1:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
          // Safely store values in localStorage
          if (data.user_id !== undefined && data.user_id !== null) {
            localStorage.setItem("user_id", String(data.user_id));
          }
          if (data.token) {
            localStorage.setItem("session_token", data.token);
          }
          if (data.email) {
            localStorage.setItem("user_email", data.email);
          }
          if (data.username) {
            localStorage.setItem("user_displayName", data.username);
          }
          if (data.profile_image) {
            localStorage.setItem("user_photoURL", data.profile_image);
          }
          if (data.role) {
            localStorage.setItem("user_role", data.role);
          }
          if (data.team_id !== undefined && data.team_id !== null) {
            localStorage.setItem("team_id", String(data.team_id));
          } 
          if (data.university_id !== undefined && data.university_id !== null) {
            localStorage.setItem("university_id", String(data.university_id));
          }
        
          // Set user in context
          setUser({
            user_id: Number(data.user_id),
            email: data.email,
            token: data.token,
            displayName: data.username,
            photoURL: data.profile_image,
            role: data.role,
            team_id: data.team_id !== undefined ? Number(data.team_id) : undefined,
            university_id: data.university_id !== undefined ? Number(data.university_id) : undefined,
          });
        
          setOpenSnackbar(true);
        

            // Redirect based on role
            switch (data.role) {
                case "superadmin":
                    setTimeout(() => navigate("/validation"), 1000);
                    break;
                case "tournymod":
                    setTimeout(() => navigate("/"), 1000);
                    break;
                case "unimod":
                    setTimeout(() => navigate("/"), 1000);
                    break;
                case "aardvarkstaff":
                    setTimeout(() => navigate("/"), 1000);
                    break;
                case "captain":
                    setTimeout(() => navigate("/team"), 1000);
                    break;
                case "participant":
                    setTimeout(() => navigate("/"), 1000);
                    break;
                default:
                    setTimeout(() => navigate("/"), 1000);
                    break;
            }
        } else {
            setError(data.error || "Login failed. Please try again.");
        }
    } catch (err) {
        console.error("Login Error:", err);
        setError("An error occurred. Please try again.");
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
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/viewregister" underline="hover">
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
