import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
// import TeamList from "../components/TeamList"; // uncomment this one when merge is done 

const UniversityPage: React.FC = () => {
  const { universityName } = useParams<{ universityName: string }>();

  return (
    <Box sx={{ backgroundColor: "white", color: "black", width: "100vw", overflowX: "hidden" }}>
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

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "400px",
          backgroundImage: `url(https://via.placeholder.com/1500x400)`, // Placeholder image
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay effect
          }}
        />
        {/* Text Content */}
        <Box sx={{ position: "relative", textAlign: "center", color: "white", p: 4, borderRadius: 2 }}>
          <Typography variant="h3" fontWeight="bold">{universityName}</Typography>
          <Typography variant="h5">Location: TBD</Typography>
          <Typography variant="body1" mt={2}>
            Moderator: John Doe <br /> contact@{universityName?.toLowerCase().replace(/\s/g, "")}.edu
          </Typography>
          <Button variant="contained" sx={{ mt: 2, backgroundColor: "#1976d2" }}>
            University Website
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6, maxWidth: "1200px", mx: "auto" }}>
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">About</Typography>
            <Typography variant="body1" mt={2}>
              Lorem ipsum dolor sit amet consectetur. Quam adipiscing laoreet ipsum morbi enim eget pellentesque.
              Consectetur vel nisl interdum ultricies velit quam.
            </Typography>
          </Grid>

          {/* Matches Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold">Matches</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Typography variant="body1" fontWeight="bold" sx={{ cursor: "pointer", borderBottom: "2px solid blue" }}>
                Upcoming
              </Typography>
              <Typography variant="body1" sx={{ cursor: "pointer" }}>
                Previous
              </Typography>
            </Box>

            {[1, 2, 3].map((match) => (
              <Card key={match} sx={{ my: 2, boxShadow: 2 }}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      backgroundColor: "#ccc",
                      mr: 2,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">vs. Team Name</Typography>
                    <Typography variant="body2">Time | Location</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>

        {/* Teams Section */}
        <Box mt={6}>
          <Typography variant="h4" fontWeight="bold" mb={2}>Teams</Typography>
          {/* <TeamList university={universityName} /> */}
        </Box>
      </Box>

      {/* Footer
      <Footer /> */}
    </Box>
  );
};

export default UniversityPage;
