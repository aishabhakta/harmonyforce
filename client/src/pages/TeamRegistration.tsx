import React, { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import GeneralTeamInfo from "../components/GeneralTeamInfo";
import TeamMembers from "../components/TeamMembers";
import { useParams } from "react-router-dom";

const TeamRegistration: React.FC = () => {
  const { id } = useParams(); // Correct param name
  const teamId = id;
  const [success] = useState("");
  const [error] = useState("");
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    if (teamId) {
      console.log("🛠️ Fetching team data for teamId:", teamId);
      fetch(`http://127.0.0.1:5000/teams/getTeam/${teamId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("🎯 Retrieved team data from backend:", data);
          setTeamData(data);
        })
        .catch((err) => console.error(" Failed to fetch team data:", err));
    }
  }, [teamId]);

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
        <GeneralTeamInfo teamData={teamData} />
        <TeamMembers members={teamData?.members || []} />
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Box>
  );
};

export default TeamRegistration;
