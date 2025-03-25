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
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Avatar, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";

// Sample Player Data (Replace with API Data Later)
//when I have time tommrowo fix the // Show team name and school dynamically
const playerData = {
  name: "John Smith",
  profileImage: "https://via.placeholder.com/150", // Update image later
  about: "Lorem ipsum dolor sit amet consectetur. Pulvinar ornare nisl quam ut ullamcorper nisl. Metus sed neque diam ut arcu mauris pellentesque auctor. Gravida odio platea pellentesque arcu.",

  // Aisha if you're seeing this this is where you would need to update the permission to see if the 
  // the button is visible bases on role
  primaryRoles: ["Scientist", "Physician", "Weapons Specialists", "Aardvark Support Staff"],

  university: "Cornell University",
  universityLogo:
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Cornell_University_seal.svg/1200px-Cornell_University_seal.svg.png",
  team: "The Roaches",
  teamLogo: "https://via.placeholder.com/50",
  dateJoined: "1/30/2025",
};

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

          {/* Player Info and Team/University on the Right */}
          <Grid item xs={12} md={8}>
            {/* Player Info Card - Aligned with Bottom Cards */}
            <Card
              sx={{
                width: "100%",
                maxWidth: 630, // Ensuring it matches the width of the bottom cards
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {playerData.name}
                </Typography>
                <Typography sx={{ fontWeight: "bold", display: "inline" }}>Primary Roles: </Typography>
                <Typography sx={{ display: "inline" }}>{playerData.primaryRoles}</Typography>
                <Typography sx={{ mt: 2 }}>{playerData.about}</Typography>
                <Typography sx={{ fontWeight: "bold", mt: 3 }}>Date Joined: {playerData.dateJoined}</Typography>


              {/* Validation Button (conditionally visible) */}
              {playerData.primaryRoles.some(role => ["Aardvark Support Staff", "Super Admins", "University Tournament Moderator"].includes(role)) && (
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" href="/validation">
                  Go to Validation Page
                  </Button>
                </Box>
              )}

              </CardContent>
            </Card>

            {/* University & Team Cards  */}
            <Grid
              container
              spacing={2}
              sx={{
                marginTop: "1.5rem",
                justifyContent: "space-between",
                maxWidth: 580, // Ensuring both bottom cards align with the Info Card
              }}
            >
              {/* University Card  */}
              <Grid item xs={12} md={5.5}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    height: 85,
                    width: "100%",
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: "1rem",
                  }}
                >
                  <Box
                    component="img"
                    src={playerData.universityLogo}
                    alt={playerData.university}
                    sx={{ width: 40, height: 40, marginRight: "1rem" }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {playerData.university}
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
