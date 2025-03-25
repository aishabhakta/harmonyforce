import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button
} from "@mui/material";

interface Player {
  user_id: number;
  name: string;
  email: string;
  role: string;
  team_name: string;
  team_logo?: string;
  university_name: string;
  university_logo?: string;
  profile_image?: string;
  about?: string;
  date_joined?: string;
}

const PlayerPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setError("Invalid player ID");
      setLoading(false);
      return;
    }

    const fetchPlayer = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/teams/getPlayer/${playerId}`);
        const data = await response.json();

        if (response.ok) {
          setPlayer(data);
        } else {
          setError(data.error || "Failed to fetch player details.");
        }
      } catch (err) {
        setError("An error occurred while fetching player details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 5 }}>{error}</Alert>;
  }

  if (!player) return null;

  const isPrivileged =
    ["Aardvark Support Staff", "superadmin", "University Tournament Moderator"].includes(player.role);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
        color: "black",
        px: 2,
        py: 4,
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <Box sx={{ maxWidth: "900px", margin: "auto" }}>
        <Grid container spacing={4}>
          {/* Profile Image */}
          <Grid item xs={12} md={4}>
            <Avatar
              src={player.profile_image || "https://via.placeholder.com/150"}
              alt={player.name}
              sx={{ width: 200, height: 200, border: "3px solid #1976d2" }}
            />
          </Grid>

          {/* Info Card */}
          <Grid item xs={12} md={8}>
            <Card sx={{ width: "100%", boxShadow: 2, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {player.name}
                </Typography>
                <Typography sx={{ fontWeight: "bold", display: "inline" }}>
                  Role:{" "}
                </Typography>
                <Typography sx={{ display: "inline" }}>{player.role}</Typography>

                <Typography sx={{ mt: 2 }}>
                  {player.about || "No bio available."}
                </Typography>

                <Typography sx={{ fontWeight: "bold", mt: 3 }}>
                  Date Joined: {player.date_joined || "Unknown"}
                </Typography>

                {/* {isPrivileged && ( */}
                  <Box sx={{ mt: 2 }}>
                    <Button variant="contained" href="/validation">
                      Go to Validation Page
                    </Button>
                  </Box>
                {/* )} */}
              </CardContent>
            </Card>

            {/* University & Team Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {/* University Card */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    height: 85,
                    boxShadow: 3,
                    borderRadius: 2
                  }}
                >
                  <Box
                    component="img"
                    src={player.university_logo || "https://via.placeholder.com/50"}
                    alt={player.university_name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="subtitle1">
                    {player.university_name}
                  </Typography>
                </Card>
              </Grid>

              {/* Team Card */}
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    height: 85,
                    boxShadow: 3,
                    borderRadius: 2
                  }}
                >
                  <Box
                    component="img"
                    src={player.team_logo || "https://via.placeholder.com/50"}
                    alt={player.team_name}
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Typography variant="subtitle1">{player.team_name}</Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PlayerPage;
