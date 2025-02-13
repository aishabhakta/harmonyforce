import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";

const PlayerPage: React.FC = () => {
  const playerData = {
    name: "Jane Doe",
    profileImage: "/path/to/profile-image.jpg", // when I have tine please go back and updatethe pic
    about:
      "Lorem ipsum dolor sit amet consectetur. Pulvinar ornare nisl quam ut ullamcorper nisl. Metus sed neque diam ut arcu mauris pellentesque auctor. Gravida odio platea pellentesque arcu.",
    primaryRoles: "Scientist, Physician, Weapons Specialist",
    university: "Cornell University",
    team: "The Roaches",
    dateJoined: "1/30/2025",
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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

      {/* Player Section */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: "2rem",
          alignItems: { md: "center" },
          gap: "2rem",
        }}
      >
        {/* Profile Image */}
        <Box
          sx={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={playerData.profileImage}
            alt={`${playerData.name}'s profile`}
            sx={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              border: "3px solid #1976d2",
            }}
          />
        </Box>

        {/* Information Section */}
        <Box
          sx={{
            flex: "1 1 auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // Single column on smaller screens
              sm: "repeat(2, 1fr)", // Two columns on medium screens
            },
            gap: "1.5rem",
          }}
        >
          {[
            { title: "About", content: playerData.about },
            { title: "Primary Roles", content: playerData.primaryRoles },
            { title: "University", content: playerData.university },
            { title: "Team", content: playerData.team },
            { title: "Date Joined", content: playerData.dateJoined },
          ].map((section, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "10px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                {section.title}
              </Typography>
              <Typography>{section.content}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default PlayerPage;
