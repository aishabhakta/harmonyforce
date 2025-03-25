import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const GeneralTeamInfo: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Placeholder for image URL or base64 string

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      team_name: teamName,
      captain_name: teamLeaderName,
      captain_email: teamLeaderEmail,
      university_id: 1, // Adjust as necessary
      profile_image: profileImage,
      members: [] // Leaving members empty for now
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/teams/registerTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error registering team:", errorData);
      } else {
        const data = await response.json();
        console.log("Team registered:", data);
      }
    } catch (error) {
      console.error("Error registering team:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        marginBottom: "2rem",
        padding: "1rem",
        maxWidth: "800px",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        margin: "0 auto",
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
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "1rem",
        }}
      >
        <TextField
          label="Team Leader Name *"
          variant="outlined"
          fullWidth
          value={teamLeaderName}
          onChange={(e) => setTeamLeaderName(e.target.value)}
        />
        <TextField
          label="Team Leader Email Address *"
          variant="outlined"
          fullWidth
          value={teamLeaderEmail}
          onChange={(e) => setTeamLeaderEmail(e.target.value)}
        />
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
        <Typography variant="caption">
          SVG, PNG, JPG, or GIF (max. 3MB)
        </Typography>
      </Box>
      <Button type="submit" variant="contained" sx={{ marginTop: "1rem" }}>
        Register Team
      </Button>
    </Box>
  );
};

export default GeneralTeamInfo;
