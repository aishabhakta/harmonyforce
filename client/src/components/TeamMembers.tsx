import React from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";

const TeamMembers: React.FC = () => {
  return (
    <Box
      sx={{
        marginBottom: "2rem",
        padding: "1rem", // this si for onsistent padding
        maxWidth: "800px", // Constrain width to match the layout
        width: "100%", 
        boxSizing: "border-box", // Include padding and borders in width
        backgroundColor: "#f9f9f9", 
        borderRadius: "8px", 
        margin: "0 auto", // Center horizontally within the parent container
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Team Members
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
        Each team must have between 5 – 7 members.
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <TextField label="Name *" variant="outlined" fullWidth />
        <TextField label="Email Address *" variant="outlined" fullWidth />
      </Box>
      <TextField
        fullWidth
        select
        label="Role"
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      >
        {["Captain", "Player", "Substitute"].map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <Box
        sx={{
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
      <Button
        variant="contained"
        color="primary"
        sx={{
          marginTop: "1rem",
          width: "100%", // Stretch button so it can match the button
        }}
      >
        Add Member
      </Button>
    </Box>
  );
};

export default TeamMembers;
