import { Button, TextField, Typography, Link, Box } from "@mui/material";
import heroImg from "../assets/images/hero-image.jpg";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Register() {
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
          <Typography variant="h3">
            Register
          </Typography>
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
        <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select label="Role"></Select>
        </FormControl>
        <TextField
            label="University"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Typography variant="body2" >
            Already have an account?{" "}
            <Link href="/" underline="hover">
              Sign In
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
