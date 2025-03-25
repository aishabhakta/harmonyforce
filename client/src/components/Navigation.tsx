import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthProvider";

import aardvarkLogo from "../assets/images/aardvark_logo_png.png";

interface NavigationProps {
  links: { name: string; href: string }[];
}

const NavigationBar: React.FC<NavigationProps> = ({ links }) => {
  const navigate = useNavigate();

  // Grab the user from context
  const { user, setUser } = useAuth();

  // Example logout handler:
  const handleLogout = async () => {
    try {
      const token = user?.token || localStorage.getItem("session_token");
      await fetch("http://127.0.0.1:5000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
      });
      setUser(null);
      localStorage.removeItem("session_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_displayName");
      localStorage.removeItem("user_photoURL");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          {/* Logo - Clickable to Navigate to Home */}
          <IconButton edge="start" color="inherit" aria-label="logo" sx={{ mr: 2 }} onClick={() => navigate("/")}>
             <img
               src={aardvarkLogo}
               alt="Aardvark Games Logo"
               style={{ height: "80px", width: "auto" }}
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

          {/* Conditionally render profile or login buttons */}
          {user ? (
            /* If user is logged in, show avatar + logout button */
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                alt={user.displayName || "Profile"}
                src={user.photoURL || ""}
                sx={{ width: 40, height: 40 }}
              />
              <Button
                color="inherit"
                variant="outlined"
                sx={{ color: "white" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            /* If no user, show Login / Sign Up */
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                color="inherit"
                variant="outlined"
                sx={{ color: "white" }}
                onClick={() => navigate("/login")}
              >
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
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavigationBar;
