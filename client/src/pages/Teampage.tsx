import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import { Link } from "react-router-dom";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";

// Team and Member Interfaces
interface Member {
  user_id: number;
  name: string;
  email: string;
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
            <Roster members={team.members} />
          </Box>

          {/* Register Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            <Link to="/TeamRegistration" style={{ textDecoration: "none" }}>
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
