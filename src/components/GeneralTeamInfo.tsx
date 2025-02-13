import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const GeneralTeamInfo: React.FC = () => {
  return (
    <Box
      sx={{
        marginBottom: "2rem",
        padding: "1rem", // this si for onsistent padding
        maxWidth: "800px", //  match the layout
        width: "100%", 
        boxSizing: "border-box", //padding and borders in width
        backgroundColor: "#f9f9f9",
        borderRadius: "8px", 
        margin: "0 auto", // Center horizontally within the parent container
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        General Team Information
      </Typography>
      <TextField
        fullWidth
        label="Team Name *"
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "1rem",
        }}
      >
        <TextField label="Team Leader Name *" variant="outlined" fullWidth />
        <TextField label="Team Leader Email Address *" variant="outlined" fullWidth />
      </Box>
      <Box
        sx={{
          marginTop: "1rem",
          border: "1px dashed #1976d2",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
          Link or drag and drop
        </Typography>
        <Typography variant="caption">SVG, PNG, JPG, or GIF (max. 3MB)</Typography>
      </Box>
    </Box>
  );
};

export default GeneralTeamInfo;
