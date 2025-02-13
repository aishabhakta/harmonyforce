import React from "react";
import { Box } from "@mui/material";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import GeneralTeamInfo from "../components/GeneralTeamInfo";
import TeamMembers from "../components/TeamMembers";
import RegisterButton from "../components/RegisterButton";

const TeamRegistration: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw", 
        overflow: "hidden", 
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

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Helps Center horizontally
          justifyContent: "center", // Helps Center vertically
          padding: "2rem", // Helps with add spacing around content
          width: "100%", // Full width
          boxSizing: "border-box", 
        }}
      >
        {/* Components */}
        <GeneralTeamInfo />
        <TeamMembers />
        <Box
          sx={{
            marginTop: "2rem",
            maxWidth: "800px", 
            width: "100%",
          }}
        >
          <RegisterButton />
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default TeamRegistration;
