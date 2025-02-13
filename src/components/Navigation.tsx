import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router";

interface NavigationProps {
  links: { name: string; href: string }[]; // Array of navigation links
}

const NavigationBar: React.FC<NavigationProps> = ({ links }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar for navigation */}
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          {/* Logo Section */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
          >
            <img
              src="/placeholder-logo.png" // Placeholder for logo
              alt="" // Alt text to be added later
              style={{ height: "40px", width: "auto" }}
            />
          </IconButton>

          {/* Title or Navigation Links */}
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {links.map((link, index) => (
              <MenuItem key={index} component="a" href={link.href}>
                <Typography textAlign="center" sx={{ color: "white" }}>
                  {link.name}
                </Typography>
              </MenuItem>
            ))}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" variant="outlined" sx={{ color: "white" }} onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button
              color="inherit"
              variant="contained"
              sx={{ backgroundColor: "white", color: "#1976d2" }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
