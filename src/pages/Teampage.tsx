import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";

const TeamPage: React.FC = () => {
  // place holders
  const teamMembers = [
    { id: "1", name: "John Smith", role: "Expedition Leader", imageUrl: "/path/to/image1.jpg" },
    { id: "2", name: "John Smith", role: "Resource Specialist", imageUrl: "/path/to/image2.jpg" },
    { id: "3", name: "John Smith", role: "Technician", imageUrl: "/path/to/image3.jpg" },
    { id: "4", name: "John Smith", role: "Chronicler", imageUrl: "/path/to/image4.jpg" },
    { id: "5", name: "John Smith", role: "Weapons Specialist", imageUrl: "/path/to/image5.jpg" },
    { id: "6", name: "John Smith", role: "Physician", imageUrl: "/path/to/image6.jpg" },
    { id: "7", name: "John Smith", role: "Scientist", imageUrl: "/path/to/image7.jpg" },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
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

      {/* Team Header */}
      <Box sx={{ width: "100%" }}>
        <TeamHeader
          teamName="Team Name"
          universityName="Rochester Institute of Technology"
          description="Lorem ipsum dolor sit amet consectetur. Tincidunt sodales duii tellus tortor tellus quam donec nibh."
        />
      </Box>

      {/* Roster */}
      <Box sx={{ width: "100%", marginBottom: "2rem" }}>
        <Roster members={teamMembers} />
      </Box>

      {/* Register Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Link to="/TeamRegistration" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              textTransform: "none",
            }}
          >
            Register Team
          </Button>
        </Link>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default TeamPage;
