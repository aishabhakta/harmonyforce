import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1976d2", // Blue background
        color: "white",
        py: 4, // Padding for top and bottom
        px: 2, // Padding for sides
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Social Media Section */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
          Follow Us
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Social Media Icons (Placeholders) */}
          <img
            src="/facebook-placeholder.png"
            alt="Facebook logo" // Alt text to be added later
            style={{ height: "32px", width: "32px" }}
          />
          <img
            src="/youtube-placeholder.png"
            alt="YouTube logo" // Alt text to be added later
            style={{ height: "32px", width: "32px" }}
          />
          <img
            src="/x-placeholder.png"
            alt="X logo" // Alt text to be added later
            style={{ height: "32px", width: "32px" }}
          />
        </Box>
      </Box>

      {/* Privacy Policy and Copyright Section */}
      <Box sx={{ textAlign: "right" }}>
        <Link
          href="/privacy-policy"
          underline="hover"
          sx={{ color: "white", display: "block", mb: 1 }}
        >
          Privacy Policy
        </Link>
        <Typography variant="body2">
          © Aardvark Games 2025
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
