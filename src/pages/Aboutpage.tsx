import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Import your NavigationBar and Footer components
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";

const AboutPage: React.FC = () => {
  return (
    <Box>
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

      {/* Main Content */}
      <Box
        sx={{
          px: 4,
          py: 6,
          backgroundColor: "white", // Set background color to white
          color: "black", // Set text color to black
        }}
      >
        {/* Section: A New World */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            {/* Title and Description */}
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              A New World
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Image Placeholder */}
            <Box
              sx={{
                height: 200,
                width: "100%",
                backgroundColor: "#ccc",
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#666",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Image Placeholder
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Section: About Aardvark Games */}
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ my: 6, flexDirection: { xs: "column-reverse", md: "row" } }}
        >
          <Grid item xs={12} md={6}>
            {/* Logo Placeholder */}
            <Box
              sx={{
                height: 150,
                width: 150,
                backgroundColor: "#ccc",
                borderRadius: "50%",
                mx: "auto",
              }}
            >
              <Typography
                sx={{
                  color: "#666",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                Logo
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              About Aardvark Games
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu.
            </Typography>
          </Grid>
        </Grid>

        {/* Section: Where to Buy */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Where to Buy A New World
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Ask your local game store for information!
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Call-to-Action Placeholder */}
            <Box
              sx={{
                height: 200,
                width: 200,
                backgroundColor: "#007FFF",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                mx: "auto",
              }}
            >
              PRE-ORDER NOW!
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AboutPage;
