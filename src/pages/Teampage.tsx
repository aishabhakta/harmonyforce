import React from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

// Sample Team Data (Replace with API Fetch Later)
const teamsData = [
  { id: 1, name: "Team Alpha", university: "Harvard" },
  { id: 2, name: "Team Beta", university: "MIT" },
  { id: 3, name: "Team Gamma", university: "Stanford" },
];

// Placeholder Roster Data
const teamMembers = [
  { id: "1", name: "John Smith", role: "Expedition Leader", imageUrl: "/path/to/image1.jpg" },
  { id: "2", name: "Jane Doe", role: "Resource Specialist", imageUrl: "/path/to/image2.jpg" },
  { id: "3", name: "Mike Johnson", role: "Technician", imageUrl: "/path/to/image3.jpg" },
  { id: "4", name: "Sarah Brown", role: "Chronicler", imageUrl: "/path/to/image4.jpg" },
  { id: "5", name: "David Wilson", role: "Weapons Specialist", imageUrl: "/path/to/image5.jpg" },
  { id: "6", name: "Emma White", role: "Physician", imageUrl: "/path/to/image6.jpg" },
  { id: "7", name: "Alex Green", role: "Scientist", imageUrl: "/path/to/image7.jpg" },
];

const TeamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the team ID from URL
  const team = teamsData.find((t) => t.id === Number(id)); // Find team by ID

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
          { name: "Teams", href: "/team" },
          { name: "Universities", href: "/universities" },
        ]}
      />

      {/* Team Header with Dynamic Data */}
      <Box sx={{ width: "100%" }}>
        <TeamHeader
          teamName={team?.name || "Unknown Team"} // Show team name dynamically
          universityName={team?.university || "Unknown University"} // Show university name dynamically
          description="Lorem ipsum dolor sit amet consectetur. Tincidunt sodales dui tellus tortor tellus quam donec nibh."
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
