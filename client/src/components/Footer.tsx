import React from "react";
import { Box, Typography, Link, Grid, IconButton } from "@mui/material";
import { Facebook, YouTube, Twitter } from "@mui/icons-material";

 // Import the Aardvark Games logo
 import aardvarkLogo from "../assets/images/aardvark_logo_png.png";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2", // Blue background
        color: "white",
        py: 4, // Padding for top and bottom
        px: 4, // Padding for sides
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Social Media Section */}

      <Grid container spacing={4} alignItems="center" justifyContent="space-between">
         {/* Left Section: Logo */}
         <Grid item xs={12} md={4}>
           <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" } }}>
             <img
               src={aardvarkLogo}
               alt="Aardvark Games Logo"
               style={{ height: "200px", maxWidth: "100%", objectFit: "contain" }}
             />
           </Box>
         </Grid>

         {/* Right Section: Social Media & Links */}
         <Grid item xs={12} md={8} sx={{ textAlign: { xs: "center", md: "right" } }}>
           <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, gap: 2, mb: 1 }}>
             <IconButton href="https://facebook.com" target="_blank" sx={{ color: "white" }}>
               <Facebook fontSize="large" />
             </IconButton>
             <IconButton href="https://youtube.com" target="_blank" sx={{ color: "white" }}>
               <YouTube fontSize="large" />
             </IconButton>
             <IconButton href="https://twitter.com" target="_blank" sx={{ color: "white" }}>
               <Twitter fontSize="large" />
             </IconButton>
           </Box>

           {/* Footer Links */}
           <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, gap: 2, mt: 1 }}>
             <Link href="/faqpage" underline="hover" sx={{ color: "white" }}>
               Contact Us
             </Link>
             <Link href="/privacy-policy" underline="hover" sx={{ color: "white" }}>
               Privacy Policy
             </Link>
           </Box>

           {/* Copyright */}
           <Typography variant="body2" sx={{ mt: 2 }}>
             © Aardvark Games 2025
           </Typography>
         </Grid>
       </Grid>

    </Box>
  );
};

export default Footer;
