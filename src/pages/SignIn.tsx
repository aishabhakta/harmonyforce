import { Button, TextField, Typography, Link, Box } from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";

export default function SignIn() {
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
          // padding: "2rem",
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
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" fullWidth size="large" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/register" underline="hover">
              Register for one
            </Link>
          </Typography>
        </Box>
      </Box>

      {/*
      <Box
        sx={{
            width: "50%",
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        />
        */}
      <Box
        sx={{
          width: "50%",
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",  // Ensure absolute positioning works for the hidden img
        }}
      >
        {/* Visually hidden <img> for accessibility */}
        <img 
          src={heroImg} 
          alt="A red swirl on a black background"  // Add a description for screen readers
          style={{ 
            position: "absolute", 
            width: "1px", 
            height: "1px", 
            opacity: 0 
          }}
        />
      </Box>
    </Box>
  );
}
