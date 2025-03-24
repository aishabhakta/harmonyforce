import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";

interface Team {
  id: number;
  name: string;
  logo: string;
  university: string;
}

const allTeams: Team[] = [
  { id: 1, name: "Harvard Hawks", logo: "https://via.placeholder.com/50", university: "Harvard University" },
  { id: 2, name: "Crimson Clash", logo: "https://via.placeholder.com/50", university: "Harvard University" },
  { id: 3, name: "MIT Mavericks", logo: "https://via.placeholder.com/50", university: "MIT" },
  { id: 4, name: "Cornell Crushers", logo: "https://via.placeholder.com/50", university: "Cornell University" },
  { id: 5, name: "Cornell Crushers", logo: "https://via.placeholder.com/50", university: "Cornell University" },
];

const UniversityPage: React.FC = () => {
  const { universityName } = useParams<{ universityName: string }>();
  const teams = allTeams.filter((team) => team.university === universityName);
  const [selectedTab, setSelectedTab] = useState<"teams" | "matches">("teams");
  const isAdmin = true;

  return (
    <Box sx={{ backgroundColor: "white", color: "black", width: "100vw", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "400px",
          backgroundImage: `url(https://via.placeholder.com/1500x400)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
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
{/* About Section */}
<Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, mt: 4, mb: 4 }}>
  <Typography variant="h4" fontWeight="bold">About</Typography>
  <Typography variant="body1" mt={2}>
    Lorem ipsum dolor sit amet consectetur. Quam adipiscing laoreet ipsum morbi enim eget pellentesque.
    Consectetur vel nisl interdum ultricies velit quam.
  </Typography>
</Box>


      {/* Tabs */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 4 }}>
        <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight={selectedTab === "teams" ? "bold" : "normal"}
            sx={{
              cursor: "pointer",
              borderBottom: selectedTab === "teams" ? "3px solid black" : "none",
            }}
            onClick={() => setSelectedTab("teams")}
          >
            Teams
          </Typography>
          <Typography
            variant="h5"
            fontWeight={selectedTab === "matches" ? "bold" : "normal"}
            sx={{
              cursor: "pointer",
              borderBottom: selectedTab === "matches" ? "3px solid black" : "none",
            }}
            onClick={() => setSelectedTab("matches")}
          >
            Matches
          </Typography>
        </Box>

        {selectedTab === "teams" && (
  <Box>
    <Typography variant="h4" fontWeight="bold" mb={2}>Teams</Typography>
    <Grid container spacing={2}>
      {teams.map((team) => (
        <Grid item xs={12} key={team.id}>
          <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
            <Box
              component="img"
              src={team.logo}
              alt={team.name}
              sx={{ width: 50, height: 50, mr: 2 }}
            />
            <Typography variant="body1">{team.name}</Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
)}

{selectedTab === "matches" && (
  <Box>
    <Typography variant="h4" fontWeight="bold" mb={2}>
      Round 1
    </Typography>

    {[...Array(3)].map((_, idx) => (
      <Card key={idx} sx={{ my: 2, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* Team A */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Box
              component="img"
              src="https://via.placeholder.com/60"
              alt="Team A"
              sx={{ width: 60, height: 60, mr: 3 }} // 👈 more space from image
            />
            <Box sx={{ ml: 1 }}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Team A
              </Typography>
              <Typography variant="h4">0</Typography>
            </Box>
          </Box>

          {/* Edit Results Button */}
          {isAdmin && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button variant="contained" size="medium">
                Edit Results
              </Button>
            </Box>
          )}

          {/* Team B */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            <Box sx={{ textAlign: "right", mr: 3 }}>
              <Typography fontWeight="bold" sx={{ mb: 1 }}>
                Team B
              </Typography>
              <Typography variant="h4">3</Typography>
            </Box>
            <Box
              component="img"
              src="https://via.placeholder.com/60"
              alt="Team B"
              sx={{ width: 60, height: 60, ml: 3 }} // 👈 more space from score
            />
          </Box>
        </Box>
      </Card>
    ))}
  </Box>
)}



      </Box>
    </Box>
  );
};

export default UniversityPage;
