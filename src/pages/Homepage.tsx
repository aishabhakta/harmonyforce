import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

// Import your NavigationBar and Footer components
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";

const Homepage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "white", color: "black" }}>
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

      {/* Hero Section */}
      <Box
        sx={{
          height: 400,
          backgroundColor: "#ccc", // Placeholder for hero image
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#666",
          width: "100vw", // Full width of the viewport
          marginLeft: "calc(-50vw + 50%)", // Center alignment trick for edge-to-edge
        }}
      >
        Hero Image Placeholder
      </Box>

      {/* Content Section */}
      <Box sx={{ px: 4, py: 6 }}>
        {/* A New World Section */}
        <Grid container spacing={4} alignItems="center">
          {/* Game Image Placeholder*/}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: 300,
                backgroundColor: "#ccc",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#666",
              }}
            >
              Game Image Placeholder
            </Box>
          </Grid>
          {/* Text and Button - Now on the Right Side */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              A New World
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              A New World requires a team of 4–7 players who will work together
              to score as many points as possible after being dropped into a
              new, unpopulated world. For the tournament, teams will play in a
              head-to-head competition with an opponent seeking to survive in
              its own New World, but competing with your team for the same
              resources.
            </Typography>
            <Button variant="contained" color="primary">
              Learn More
            </Button>
          </Grid>
        </Grid>

        {/* Tournament Section */}
        <Grid container spacing={4} sx={{ my: 6 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Tournament
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Gather a team and sign up to play, first for the honor of being
              your University's championship team and then for the chance to
              represent your school in continued rounds of global competition.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="primary">
                Learn More
              </Button>
              <Button variant="outlined" color="primary">
                Sign Up
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Tournament Image Placeholder */}
            <Box
              sx={{
                height: 300,
                backgroundColor: "#ccc",
                borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#666",
              }}
            >
              Tournament Image Placeholder
            </Box>
          </Grid>
        </Grid>

        {/* Upcoming Tournaments Section */}
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
          >
            Upcoming Tournaments
          </Typography>
          <Grid container spacing={4}>
            {/* Tournament Cards */}
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "white",
                    height: 150,
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Tournament Name
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Oct 5 - Oct 7, 2024
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "#1976d2",
                        textTransform: "none",
                      }}
                    >
                      Register
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Homepage;

