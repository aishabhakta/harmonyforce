import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const GeneralTeamInfo: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [profileImage] = useState(""); // Placeholder for image URL or base64 string
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      team_name: teamName,
      captain_name: teamLeaderName,
      captain_email: teamLeaderEmail,
      team_bio: teamBio,
      university_id: 1,
      profile_image: "", // Will be uploaded separately
      members: [],
    };

    try {
      const registerRes = await fetch(
        "http://18.218.163.17:5000/teams/registerTeam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        console.error("Error registering team:", registerData);
        return;
      }

      console.log("Team registered:", registerData);

      // Now upload the image, if selected
      if (imageFile) {
        const teamId = registerData.team_id || registerData.id; // depending on your backend response

        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(
          `http://18.218.163.17:5000/team/${teamId}/upload_image`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          console.error("Image upload failed:", uploadData);
        } else {
          console.log("Image uploaded:", uploadData.image_url);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  function setImage(_file: File) {
    setImageFile(_file);
  }

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

      <TextField
        fullWidth
        label="Team Bio"
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
        value={teamBio}
        onChange={(e) => setTeamBio(e.target.value)}
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
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Team Image
      </Typography>

      <Box
        sx={{
          border: "1px dashed #1976d2",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
          }}
        />
        <Typography variant="caption">
          SVG, PNG, JPG or GIF (max. 3MB)
        </Typography>
      </Box>
      <Button type="submit" variant="contained" sx={{ marginTop: "1rem" }}>
        Register Team
      </Button>
    </Box>
  );
};

export default GeneralTeamInfo;
