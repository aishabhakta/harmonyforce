import React, { useState } from "react";
import { Box, Button, Alert } from "@mui/material";
import GeneralTeamInfo from "../components/GeneralTeamInfo";
import TeamMembers from "../components/TeamMembers";
import RegisterButton from "../components/RegisterButton";

const TeamRegistration: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const [universityId, setUniversityId] = useState<number | null>(null);
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]); // Replace with stricter typing if you have
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    const payload = {
      team_name: teamName,
      university_id: universityId,
      captain_name: captainName,
      captain_email: captainEmail,
      profile_image: profileImage,
      members,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/teams/registerTeam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setError("");
      } else {
        setError(data.error || "Team registration failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("Something went wrong during registration.");
      setSuccess("");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <GeneralTeamInfo
          teamName={teamName}
          setTeamName={setTeamName}
          captainName={captainName}
          setCaptainName={setCaptainName}
          captainEmail={captainEmail}
          setCaptainEmail={setCaptainEmail}
          universityId={universityId}
          setUniversityId={setUniversityId}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />

        <TeamMembers members={members} setMembers={setMembers} />

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ marginTop: "2rem", maxWidth: "800px", width: "100%" }}>
          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
          >
            Register Team
          </Button> */}
          <RegisterButton />
        </Box>
      </Box>
    </Box>
  );
};

export default TeamRegistration;
