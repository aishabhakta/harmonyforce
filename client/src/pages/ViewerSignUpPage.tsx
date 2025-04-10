import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Link,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("participant");
  const [university, setUniversity] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await apiFetch("/university/getAll");
        setUniversities(data.map((uni: any) => uni.university_name));
      } catch (err) {
        console.error("Error fetching universities:", err);
      }
    };
    fetchUniversities();
  }, []);

  const handleRegister = async () => {
    const data = { username, email, password, role, university };

    try {
      const result = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      alert(result.message);
      navigate("/login");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "An error occurred during registration.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "98vh", backgroundColor: "#f5f5f5" }}>
      {/* Registration Form */}
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
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>University</InputLabel>
            <Select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            >
              {universities.map((uniName, index) => (
                <MenuItem key={index} value={uniName}>
                  {uniName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

      {/* Right-side Image */}
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
