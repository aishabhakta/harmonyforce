// pages/ValidationPage.tsx
import React from "react";
import Box from "@mui/material/Box";
import ValidationComponent from "../components/ValidationComponent";
import Typography from "@mui/material/Typography";

// Simulating logged-in user role (replace with actual auth/logic)
const currentUser = {
  name: "Yenry Simon",
  role: "University Tournament Moderator", // Change this to test roles
};

const ValidationPage: React.FC = () => {
  const validRoles = ["Aardvark Support Staff", "Super Admins", "University Tournament Moderator"];

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <Box sx={{ flexGrow: 1, px: { xs: 2, md: 6 }, pt: 4 }}>
        {validRoles.includes(currentUser.role) ? (
          <ValidationComponent userRole={currentUser.role} />
        ) : (
          <Typography>You do not have permission to access this page.</Typography>
        )}
      </Box>

    </Box>
  );
};

export default ValidationPage;
