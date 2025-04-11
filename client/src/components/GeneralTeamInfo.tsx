import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { apiFetch } from "../api";

const GeneralTeamInfo: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [profileImage] = useState(""); // Placeholder for image URL or base64 string

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      team_name: teamName,
      captain_name: teamLeaderName,
      captain_email: teamLeaderEmail,
      team_bio: teamBio,
      university_id: 1, // Adjust as necessary
      profile_image: profileImage,
      members: [],
    };

    try {
      const response = await apiFetch("/teams/registerTeam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setSnackbarMessage(data.message || "Failed to register team.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage("Team registered successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        // Optionally clear form:
        setTeamName("");
        setTeamBio("");
        setTeamLeaderName("");
        setTeamLeaderEmail("");
      }
    } catch (error) {
      console.error("Error registering team:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  function setImage(_file: File) {
    // You can implement this if you want to handle uploads later
    console.warn("Image upload not implemented yet.");
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

      <Typography variant="h6" sx={{ marginBottom: "1rem", marginTop: "2rem" }}>
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

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneralTeamInfo;
