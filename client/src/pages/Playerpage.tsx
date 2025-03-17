import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress, Alert, Typography, Card, CardContent, Avatar, Grid } from "@mui/material";

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
  const { playerId } = useParams<{ playerId: string }>(); // ✅ Use correct param
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) {
      setError("Invalid player ID");
      setLoading(false);
      return;
    }

    console.log(`Fetching player details for ID: ${playerId}`); // Debugging log

    const fetchPlayer = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/getPlayer/${playerId}`);
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "white",
        color: "black",
        margin: 0,
        padding: 0,
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {player && !loading && !error && (
        <Box sx={{ maxWidth: "900px", margin: "auto", padding: "2rem" }}>
          <Grid container spacing={4}>
            {/* Profile Picture */}
            <Grid item xs={12} md={4}>
              <Avatar
                src={player.profile_image || "https://via.placeholder.com/150"}
                alt={`${player.name}'s profile`}
                sx={{ width: 200, height: 200, border: "3px solid #1976d2" }}
              />
            </Grid>

            {/* Player Info */}
            <Grid item xs={12} md={8}>
              <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {player.name}
                  </Typography>
                  <Typography>Role: {player.role || "N/A"}</Typography>
                  <Typography>Date Joined: {player.date_joined || "Unknown"}</Typography>
                  <Typography>{player.about || "No bio available."}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default PlayerPage;
