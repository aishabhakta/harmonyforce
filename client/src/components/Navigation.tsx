import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useAuth } from "../AuthProvider";
import aardvarkLogo from "../assets/images/aardvark_logo_png.png";
import { apiFetch } from "../api";

interface NavigationProps {
  links: { name: string; href: string }[];
}

const NavigationBar: React.FC<NavigationProps> = ({ links }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, setUser } = useAuth();

  console.log("user.photoURL in NavigationBar:", user?.photoURL);
  console.log("Current User in NavigationBar:", user);

  const handleLogout = async () => {
    try {
      const token = user?.token || localStorage.getItem("session_token");
      await apiFetch("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: token || "",
        },
      });
      setUser(null);
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {links.map((link, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => navigate(link.href)}>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {user && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "100px !important",
          }}
        >
          {isMobile ? (
            <>
              {/* Left: Hamburger */}
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>

              {/* Center: Logo */}
              <IconButton
                color="inherit"
                onClick={() => navigate("/")}
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <img
                  src={aardvarkLogo}
                  alt="Aardvark Games Logo"
                  style={{ height: "95px", width: "auto" }}
                />
              </IconButton>
            </>
          ) : (
            <>
              {/* Logo */}
              <IconButton
                edge="start"
                color="inherit"
                aria-label="logo"
                sx={{ mr: 2 }}
                onClick={() => navigate("/")}
              >
                <img
                  src={aardvarkLogo}
                  alt="Aardvark Games Logo"
                  style={{ height: "80px", width: "auto" }}
                />
              </IconButton>

              {/* Nav links */}
              <Box sx={{ display: "flex", flexGrow: 1 }}>
                {links.map((link, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => navigate(link.href)}
                    sx={{
                      mx: 1,
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            </>
          )}

          {/* Right: login/signup section */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                alt={user.displayName || "Profile"}
                src={user.photoURL || ""}
                sx={{ width: 40, height: 40, cursor: "pointer" }}
                onClick={() => navigate(`/player/${user.user_id}`)}
              />
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                sx={{
                  color: "white",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                sx={{
                  color: "white",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                color="inherit"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "white",
                  color: "#1976d2",
                  fontSize: { xs: "0.85rem", sm: "1rem" },
                }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default NavigationBar;
