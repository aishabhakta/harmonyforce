import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";

// Import Images
import jungleBoardImg from "../assets/images/game pieces on jungle board.jpg";
import newWorldTitleImg from "../assets/images/A New World title text clear background.png";
import newWorldBoxCover from "../assets/images/A New World box cover 640px.jpg";
import gameBoardMountain from "../assets/images/game board - mountain.jpg";

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: "white", color: "black" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: 550,
          backgroundImage: `url(${jungleBoardImg})`, // Use imported image
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          position: "relative",
        }}
      >
        {/* Hidden Image for Accessibility */}
        <img
          src={jungleBoardImg}
          alt="Board game pieces on a jungle-themed board"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* A New World Title Section */}
      <Box sx={{ textAlign: "center", py: 4 }}>
        {/* A New World Title Image */}
        <Box
          component="img"
          src={newWorldTitleImg}
          alt="A New World Title"
          sx={{
            maxWidth: "100%",
            width: 450,
            mx: "auto",
            display: "block",
            py: 1,
            px: 2,
          }}
        />

        {/* Introductory Text */}
        <Typography
          variant="h5"
          sx={{ maxWidth: 800, mx: "auto", mb: 2, px: 4, pt: 3 }}
        >
          Join us in an exciting international tournament to launch Aardvark’s
          great adventure into A New World! Form a team and win the university
          championship!
        </Typography>
      </Box>

      {/* Content Section with Proper Padding that was asked from me  */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 6, maxWidth: "1200px", mx: "auto" }}>
        {/* A New World Section */}
        <Grid
          container
          spacing={4}
          alignItems="flex-start" // Align text to start of the image
          sx={{ display: "flex", alignItems: "flex-start" }} // Ensures proper vertical alignment
        >
          {/* Image for A New World Box Cover */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={newWorldBoxCover}
              alt="A New World board game box cover"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
          </Grid>

          {/* Text and Button - Now Properly Aligned */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <Typography variant="body1">
              A New World requires a team of 4–7 players who will work together
              to score as many points as possible after being dropped into a
              new, unpopulated world. For the tournament, teams will play in a
              head-to-head competition with an opponent seeking to survive in
              its own New World, but competing with your team for the same
              resources.
            </Typography>

            {/* Button properly positioned */}
            <Button
              variant="contained"
              color="primary"
              sx={{ alignSelf: "flex-start" }}
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </Grid>
        </Grid>

        {/* Tournament Section */}
        <Grid
          container
          spacing={4}
          sx={{ my: 6, display: "flex", alignItems: "flex-start" }} // Merged into a single sx prop
        >
          {/* Text Content */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Tournament
            </Typography>
            <Typography variant="body1">
              Gather a team and sign up to play, first for the honor of being
              your University's championship team and then for the chance to
              represent your school in continued rounds of global competition.
            </Typography>

            {/* Buttons properly positioned */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/tournaments")}
              >
                Sign up
              </Button>
            </Box>
          </Grid>

          {/* Image for Game Board - Mountain */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={gameBoardMountain}
              alt="Mountain-themed game board for A New World"
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Homepage;
