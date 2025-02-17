import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Import components
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import RolesAccordion from "../components/RolesAccordion";

// Import Images
import underseaBoardImg from "../images/game board - undersea.jpg";
import aardvarkLogo from "../images/Aardvark logo clear.png";
import gamingAardvarkImg from "../images/gaming Aardvark Forests of Legend.jpg";
import preOrderBurstImg from "../images/pre-order peach burst.png";

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "white", color: "black" }}> 
      {/* Navigation Bar */}
      <NavigationBar
        links={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Tournaments", href: "/tournaments" },
          { name: "Team", href: "/team" },
          { name: "Universities", href: "/universities" },
        ]}
      />

      {/* Hero Section */}
      <Box
        sx={{
          height: 550,
          backgroundImage: `url(${underseaBoardImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          position: "relative",
        }}
      >
        {/* Hidden Image for Accessibility */}
        <img
          src={underseaBoardImg}
          alt="Underwater-themed game board for A New World"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6, maxWidth: "1200px", mx: "auto" }}>
        
        {/* Section: About A New World (Image on Left, Text on Right) */}
        <Grid container spacing={4} alignItems="flex-start">
          {/* Image on the left */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={aardvarkLogo}
              alt="Aardvark Games Logo"
              sx={{
                width: "100%",
                maxWidth: 400, // Adjusted image size
                mx: "auto",
                display: "block",
              }}
            />
          </Grid>

          {/* Text on the right */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              About Aardvark Games
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Aardvark Games is a tabletop game publisher dedicated to entertaining game players worldwide with products designed
              to engage and challenge. Our best-known games include Meeple City, Beyond the Galaxy, Continental Conquest, 
              Forests of Legend, Between the Seas, and now, A New World. 
              Whether you are new to gaming, an experienced player, or prefer solo play, we create games to keep you engaged!
            </Typography>
          </Grid>
        </Grid>

        {/* Section: About Aardvark Games (Text on Left, Image on Right) */}
        <Grid container spacing={4} alignItems="flex-start" sx={{ my: 6 }}>
          {/* Text on the left */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              About A New World
            </Typography>
            <Typography variant="body1">
              A New World requires a team of 4-7 players who will work together to score as many points as possible after being dropped into a new, unpopulated world.
              The environments vary, including deserts, underwater locations, frozen mountains, or jungle landscapes full of dangers.  
              The game is best played in a **head-to-head** competition with another team, but solo play modifications allow for a thrilling experience!
            </Typography>
          </Grid>

          {/* Image on the right */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={gamingAardvarkImg}
              alt="Gaming Aardvark: Forests of Legend"
              sx={{
                width: "100%",
                // maxWidth: 350, // Adjusted size
                borderRadius: 2,
                boxShadow: 2,
                mx: "auto",
                display: "block",
              }}
            />
          </Grid>
        </Grid>

        {/* Roles Accordion Component */}
        <RolesAccordion />

        {/* Section: Where to Buy */}
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4} alignItems="flex-start">
            {/* Text on the left */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Where to Buy A New World
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Ask your local game store for information!
              </Typography>
            </Grid>

            {/* Image on the right */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={preOrderBurstImg}
                alt="Pre-Order Now Burst Graphic"
                sx={{
                  width: "100%",
                  // maxWidth: 300, // Adjusted size
                  mx: "auto",
                  display: "block",
                }}
              />
            </Grid>
          </Grid>
        </Box>

      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default AboutPage;
