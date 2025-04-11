import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

interface GeneralTeamInfoProps {
  teamData?: any;
}

const GeneralTeamInfo: React.FC<GeneralTeamInfoProps> = ({ teamData }) => {
  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    if (teamData) {
      console.log("GeneralTeamInfo received:", teamData); // Debug log
  
      setTeamName(teamData.team_name || "");
      setTeamBio(teamData.description || "");
      setTeamLeaderName(teamData.captain?.name || "");
      setTeamLeaderEmail(teamData.captain?.email || "");
      setProfileImage(teamData.profile_image || "");
    }
  }, [teamData]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      team_name: teamName,
      captain_name: teamLeaderName,
      captain_email: teamLeaderEmail,
      team_bio: teamBio,
      university_id: teamData?.university_id || 1,
      profile_image: profileImage,
      members: teamData?.members || [],
    };

    const url = teamData
      ? `http://127.0.0.1:5000/teams/updateTeam/${teamData.team_id}` // ← you'll need to implement this PUT route
      : "http://127.0.0.1:5000/teams/registerTeam";

    const method = teamData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setSnackbarMessage(data.message || "Failed to submit team.");
        setSnackbarSeverity("error");
      } else {
        setSnackbarMessage(
          teamData ? "Team updated successfully!" : "Team registered successfully!"
        );
        setSnackbarSeverity("success");

        if (!teamData) {
          setTeamName("");
          setTeamBio("");
          setTeamLeaderName("");
          setTeamLeaderEmail("");
        }
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error submitting team:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
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
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => setProfileImage(reader.result as string);
              reader.readAsDataURL(file);
            }
          }}
        />
        <Typography variant="caption">SVG, PNG, JPG or GIF (max. 3MB)</Typography>
      </Box>

      <Button type="submit" variant="contained" sx={{ marginTop: "1rem" }}>
        {teamData ? "Update Team" : "Register Team"}
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
