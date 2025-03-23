import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Button, Typography, Avatar, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";

// Team and Member Interfaces
interface Member {
  user_id: number;
  name: string;
  email: string;
  id: number;
  role: string;
  team_role: string;  // New field for team role
  imageUrl: string;
}

interface Team {
  team_id: number;
  team_name: string;
  university_id: number;
  profile_image?: string;
  captain: {
    user_id: number | null;
    name: string | null;
    email: string | null;
    imageUrl?: string; // Optional image for captain
    team_role?: string; // Optional team role for captain
  };
  members: Member[];
}

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get team ID from URL
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/teams/getTeam/${id}`);
        const data = await response.json();
        console.log(data);  

        if (response.ok) {
          setTeam(data);
        } else {
          setError(data.error || "Failed to fetch team details.");
        }
      } catch (err) {
        setError("An error occurred while fetching team details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Team Details */}
      {team && !loading && !error && (
        <>
          {/* Team Header */}
          <Box sx={{ width: "100%" }}>
            <TeamHeader
              teamName={team.team_name}
              universityName={`University ID: ${team.university_id}`} // Replace with actual university name if available
              description="Lorem ipsum dolor sit amet consectetur. Tincidunt sodales dui tellus tortor tellus quam donec nibh."
            />
          </Box>

          {/* Roster Section */}
          <Box sx={{ width: "100%", marginBottom: "2rem" }}>
            <Roster
              teamId={team.team_id}
              members={team.members.map((member) => ({
                id: member.user_id.toString(),
                name: member.name,
                role: member.role, // Participant or Captain
                team_role: member.team_role, // Ensure team_role is fetched
                imageUrl: member.imageUrl || "https://via.placeholder.com/150",
              }))}
              captain={team.captain ? {
                id: team.captain.user_id?.toString() || "0",
                name: team.captain.name || "Unknown Captain",
                role: "Team Captain",
                team_role: team.captain.team_role || "Expedition Leader", // Default if missing
                imageUrl: team.captain.imageUrl || "https://via.placeholder.com/150",
              } : undefined}
            />
          </Box>

          {/* Register Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <Link to={`/team/${id}/registration`} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  textTransform: "none",
                }}
              >
                Register Team
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default TeamPage;
