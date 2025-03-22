import { useState } from "react";
import { Button, TextField, Typography, Link, Box, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import { useNavigate } from "react-router-dom";
import { Google } from "@mui/icons-material";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [university, setUniversity] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Prepare data to send
    const data = { email, password, role, university };

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "98vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Typography variant="h3">Register</Typography>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="faculty">Faculty</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="University"
            variant="outlined"
            fullWidth
            margin="normal"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleRegister}
          >
            Register
          </Button>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Login
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
        }}
      />
    </Box>
  );
}
