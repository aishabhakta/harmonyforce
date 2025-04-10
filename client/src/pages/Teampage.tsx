import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";
import { apiFetch } from "../api";

interface Member {
  user_id: number;
  name: string;
  email: string;
  id: number;
  role: string;
  game_role: string;
  imageUrl: string;
}

interface Team {
  team_id: number;
  team_name: string;
  university_id: number;
  university_name?: string;
  profile_image?: string;
  description?: string;
  captain: {
    user_id: number | null;
    name: string | null;
    email: string | null;
    imageUrl?: string;
    game_role?: string;
  };
  members: Member[];
}

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const USE_DUMMY_DATA = searchParams.get("dummy") === "true";

  const dummyTeam: Team = {
    team_id: 1,
    team_name: "Team Alpha",
    university_id: 101,
    university_name: "Cornell University",
    profile_image: "https://via.placeholder.com/150",
    description: "A team of explorers and scientists.",
    captain: {
      user_id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      imageUrl: "https://via.placeholder.com/150",
      game_role: "Expedition Leader",
    },
    members: [
      {
        user_id: 2,
        id: 2,
        name: "Bob Johnson",
        email: "bob@example.com",
        role: "Member",
        game_role: "Technician",
        imageUrl: "https://via.placeholder.com/150",
      },
      {
        user_id: 3,
        id: 3,
        name: "Carol Lee",
        email: "carol@example.com",
        role: "Member",
        game_role: "Scientist",
        imageUrl: "https://via.placeholder.com/150",
      },
    ],
  };

  useEffect(() => {
    const fetchTeam = async () => {
      if (USE_DUMMY_DATA && id === "1") {
        setTeam(dummyTeam);
        setLoading(false);
        return;
      }

      try {
        const response = await apiFetch(`/teams/getTeam/${id}`);
        const data = await response.json();

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
  }, [id, USE_DUMMY_DATA]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!team) return null;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Team Header */}
      <TeamHeader
        teamName={team.team_name}
        universityName={
          team.university_name || `University ID: ${team.university_id}`
        }
        description={team.description || "No description available."}
      />

      {/* Roster */}
      <Box sx={{ width: "100%", marginBottom: "2rem" }}>
        <Roster
          teamId={team.team_id}
          teamSize={1 + team.members.length} // captain + members
          members={team.members.map((member) => ({
            id: member.user_id.toString(),
            name: member.name,
            role: member.role,
            game_role: member.game_role,
            imageUrl: member.imageUrl || "https://via.placeholder.com/150",
          }))}
          captain={
            team.captain
              ? {
                  id: team.captain.user_id?.toString() || "0",
                  name: team.captain.name || "Unknown Captain",
                  role: "Team Captain",
                  game_role: team.captain.game_role || "Expedition Leader",
                  imageUrl:
                    team.captain.imageUrl || "https://via.placeholder.com/150",
                  isCaptain: true,
                }
              : undefined
          }
        />
      </Box>
    </Box>
  );
};

export default TeamPage;
