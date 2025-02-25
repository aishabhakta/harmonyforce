import React from "react";
import { Box, Container, Typography } from "@mui/material";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import UniversityList from "../components/UniversityList";

const UniversitySearchPage: React.FC = () => {
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
          Universities
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "2rem" }}>
          Search for universities
        </Typography>

        {/* University Search Component */}
        <Box sx={{ width: "100%", maxWidth: "900px" }}>
          <UniversityList />
        </Box>
      </Container>

      {/* Footer
      <Footer /> */}
    </Box>
  );
};

export default UniversitySearchPage;
