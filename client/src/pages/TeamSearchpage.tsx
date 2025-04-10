import React from "react";
import { Box, Container, Typography } from "@mui/material";
import TeamList from "../components/TeamList";

const TeamSearchPage: React.FC = () => {
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
          { name: "Teams", href: "/teams" },
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
          Users
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "2rem" }}>
          Search for users participating in the tournament.
        </Typography>

        {/* Team Search Component */}
        <Box sx={{ width: "100%", maxWidth: "900px" }}>
          <TeamList />
        </Box>
      </Container>

      {/* Footer
      <Footer /> */}
    </Box>
  );
};

export default TeamSearchPage;
