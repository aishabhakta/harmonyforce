import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import TournamentList from "../components/TournamentList";
import { Link } from "react-router-dom";

const TournamentSearchPage: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Navigation Bar
      <NavigationBar
        links={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Tournaments", href: "/tournaments" },
          { name: "Team", href: "/team" },
          { name: "Universities", href: "/universities" },
        ]}
      /> */}

      {/* Main Content */}
      <Container
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "4rem",
          paddingBottom: "4rem",
          maxWidth: "1200px",
        }}
      >
        {/* Title & Subtitle */}
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Tournaments
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "2rem" }}>
          Search for tournaments
        </Typography>

        {/* Tournament Search Component */}
        <Box sx={{ width: "100%", maxWidth: "900px" }}>
          <TournamentList />
        </Box>
      </Container>
      {/* Temporary Button to Bracket Page */}
      <Link to="/tournaments/bracket" style={{ textDecoration: "none" }}>
        <Button variant="contained" color="primary" sx={{ marginTop: "2rem" }}>
          Go to Tournament Bracket
        </Button>
      </Link>

      {/* Footer
      <Footer /> */}
    </Box>
  );
};

export default TournamentSearchPage;
