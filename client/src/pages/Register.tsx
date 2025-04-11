import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [university, setUniversity] = useState("");
  const [universities, setUniversities] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await apiFetch("/university/getAll");
        if (Array.isArray(data)) {
          setUniversities(data.map((uni: any) => uni.university_name));
        } else {
          console.error("Failed to fetch universities:", data.error);
        }
      } catch (err: any) {
        console.error("Error fetching universities:", err.message || err);
      }
    };
    fetchUniversities();
  }, []);

  const handleRegister = async () => {
    const payload = { username, email, password, role, university };

    try {
      const result = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (result.message) {
        alert(result.message);
        navigate("/login");
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration.");
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
          <Typography variant="h3">Create User</Typography>

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
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <MenuItem value="participant">Participant</MenuItem>
              <MenuItem value="captain">Captain</MenuItem>
              <MenuItem value="tournymod">Tournament Moderator</MenuItem>
              <MenuItem value="unimod">University Moderator</MenuItem>
              <MenuItem value="aardvarkstaff">Aardvark Support Staff</MenuItem>

              {/* Only show this if the current user is a superadmin */}
              {user?.role === "superadmin" && (
                <MenuItem value="superadmin">Super Admin</MenuItem>
              )}
            </Select>
          </FormControl>

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
