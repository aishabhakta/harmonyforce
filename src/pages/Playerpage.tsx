import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";

// Sample Player Data (Replace with API Data Later)
//when I have time tommrowo fix the // Show team name and school dynamically
const playerData = {
  name: "John Smith",
  profileImage: "https://via.placeholder.com/150", // Update image later
  about:
    "Lorem ipsum dolor sit amet consectetur. Pulvinar ornare nisl quam ut ullamcorper nisl. Metus sed neque diam ut arcu mauris pellentesque auctor. Gravida odio platea pellentesque arcu.",
  primaryRoles: "Scientist, Physician, Weapons Specialists",
  university: "Cornell University",
  universityLogo:
    "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Cornell_University_seal.svg/1200px-Cornell_University_seal.svg.png",
  team: "The Roaches",
  teamLogo: "https://via.placeholder.com/50",
  dateJoined: "1/30/2025",
};

const PlayerPage: React.FC = () => {
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
      {/* Navigation Bar */}
      <NavigationBar
        links={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Tournaments", href: "/tournaments" },
          { name: "Teams", href: "/teams" },
          { name: "Universities", href: "/universities" },
        ]}
      />

      {/* Main Content Wrapper  */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "auto",
          padding: { xs: "2rem", md: "4rem" },
        }}
      >
        <Grid container spacing={4} alignItems="flex-start">
          {/* Profile Picture on the Left */}
          <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                width: "100%",
                maxWidth: 250,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1rem",
              }}
            >
              <Avatar
                src={playerData.profileImage}
                alt={`${playerData.name}'s profile`}
                sx={{
                  width: 200,
                  height: 200,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  border: "3px solid #1976d2",
                }}
              />
            </Card>
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
                </Card>
              </Grid>

              {/* Team Card */}
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
                    src={playerData.teamLogo}
                    alt={playerData.team}
                    sx={{
                      width: 40,
                      height: 40,
                      marginRight: "1rem",
                      bgcolor: "grey.300",
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {playerData.team}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>


        <Footer/>

    </Box>
  );
};

export default PlayerPage;
