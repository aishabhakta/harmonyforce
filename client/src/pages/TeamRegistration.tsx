import React, { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import GeneralTeamInfo from "../components/GeneralTeamInfo";
import TeamMembers from "../components/TeamMembers";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

const TeamRegistration: React.FC = () => {
  const { id } = useParams();
  const teamId = id;
  const [success] = useState("");
  const [error] = useState("");
  const [teamData, setTeamData] = useState<any>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (teamId) {
        console.log("🛠️ Fetching team data for teamId:", teamId);
        try {
          const data = await apiFetch(`/teams/getTeam/${teamId}`);
          console.log("🎯 Retrieved team data from backend:", data);
          setTeamData(data);
        } catch (err) {
          console.error("❌ Failed to fetch team data:", err);
        }
      }
    };

    fetchTeam();
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
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default TeamRegistration;
