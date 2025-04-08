import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid, Button, Card, Skeleton } from "@mui/material";
import MatchResultsEditor from "../components/UniversityModal"; // adjust path if needed


interface Team {
  team_id: number;
  team_name: string;
  profile_image: string;
}

interface University {
  university_id: number;
  university_name: string;
  description: string;
  university_image: string;
  status: string;
  created_at: string;
  country: string;
  universitylink: string;
  tournymod: { name: string, email: string}
}

interface Match {
  match_id: number;
  team1_id: number;
  team2_id: number;
  score_team1: number | null;
  score_team2: number | null;
  start_time: string;
  end_time: string;
  winner_id: number | null;
  status: string;
}

const UniversityPage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [university, setUniversity] = useState<University | null>(null);
  const [selectedTab, setSelectedTab] = useState<"teams" | "matches">("teams");
  const [matches, setMatches] = useState<Match[]>([]);
  const isAdmin = true;
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchFormData, setMatchFormData] = useState({
    team1Name: "",
    team2Name: "",
    team1Score: 0,
    team2Score: 0,
    date: "",
  });

  const handleOpenEditor = (match: Match) => {
    setSelectedMatch(match);
    setMatchFormData({
      team1Name: `Team ${match.team1_id}`,
      team2Name: `Team ${match.team2_id}`,
      team1Score: match.score_team1 ?? 0,
      team2Score: match.score_team2 ?? 0,
      date: match.start_time?.split("T")[0] ?? "",
    });
    setEditorOpen(true);
  };
  
  const handleMatchChange = (field: string, value: any) => {
    setMatchFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleMatchSave = async () => {
    if (!selectedMatch) return;
  
    const updatedMatch = {
      score_team1: matchFormData.team1Score,
      score_team2: matchFormData.team2Score,
      start_time: matchFormData.date,
      winner_id:
        matchFormData.team1Score > matchFormData.team2Score
          ? selectedMatch.team1_id
          : matchFormData.team2Score > matchFormData.team1Score
          ? selectedMatch.team2_id
          : null,
      status: "Completed",
    };    
  
    try {
      const response = await fetch(`http://localhost:5000/matches/${selectedMatch.match_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMatch),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update match");
      }
  
      // Optional: show success toast
      console.log(" Match updated!");
  
      // Refetch matches to reflect updated scores
      const updatedMatchesRes = await fetch(
        `http://localhost:5000/university/${universityId}/matches`
      );
      const updatedMatches = await updatedMatchesRes.json();
      setMatches(updatedMatches);
  
      setEditorOpen(false);
    } catch (err) {
      console.error("Error saving match:", err);
      // Optional: show error toast
    }
  };

  useEffect(() => {
    if (!universityId) return;

    fetch(`http://localhost:5000/university/${universityId}`)
      .then((res) => res.json())
      .then((data) => setUniversity(data))
      .catch((err) => console.error("Failed to fetch university details", err));

    fetch(`http://localhost:5000/university/${universityId}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Failed to fetch teams", err));

    fetch(`http://localhost:5000/university/${universityId}/matches`)
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error("Failed to fetch matches", err));
  }, [universityId]);

  if (!university) {
    return (
      <Box sx={{ px: 2, py: 4 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ mb: 3 }}
        />
        <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "400px",
          backgroundImage: `url(http://localhost:5000/university/${university.university_id}/image)`,
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
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            color: "white",
            p: 4,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            {university.university_name}
          </Typography>
          <Typography variant="h5">Location: {university.country}</Typography>
          <Typography variant="body1" mt={2}>
            Status: {university.status}<br />
            Created at: {university.created_at}<br />
            Moderator: {university.tournymod?.name
            ? `${university.tournymod.name} (${university.tournymod.email})`
            : "N/A"}
          </Typography>

          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            mt: 2,
            }}
          >
            
            <Button
             variant="contained"
             sx={{ backgroundColor: "#1976d2" }}
             href={university.universitylink}
             target="_blank"
             rel="noopener noreferrer"
            >
              Visit University Website
            </Button>
            
            <Button 
            variant="contained"
            sx={{ backgroundColor: "#1976d2" }}
            onClick={() => window.location.href = `/UniversityRegistration?university_id=${university.university_id}`}
            >
              Edit Page
            </Button>  
          </Box>
        </Box>
      </Box>

      {/* About Section */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, mt: 4, mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          About
        </Typography>
        <Typography variant="body1" mt={2}>
          {university.description}
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
              borderBottom:
                selectedTab === "teams" ? "3px solid black" : "none",
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
              borderBottom:
                selectedTab === "matches" ? "3px solid black" : "none",
            }}
            onClick={() => setSelectedTab("matches")}
          >
            Matches
          </Typography>
        </Box>

        {/* Teams Section */}
        {selectedTab === "teams" && (
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Teams
            </Typography>
            <Grid container spacing={2}>
              {teams.map((team) => (
                <Grid item xs={12} key={team.team_id}>
                  <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
                    <Box
                      component="img"
                      src={
                        team.profile_image || "https://via.placeholder.com/50"
                      }
                      alt={team.team_name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Typography variant="body1">{team.team_name}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Matches Placeholder */}
        {selectedTab === "matches" && (
          <Box>
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Matches
            </Typography>
            {matches.length === 0 ? (
              <Typography>No matches found for this university.</Typography>
            ) : (
              matches.map((match) => (
                <Card key={match.match_id} sx={{ my: 2, p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Team 1 */}
                    <Box
                      sx={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      <Box
                        component="img"
                        src="https://via.placeholder.com/60"
                        alt="Team A"
                        sx={{ width: 60, height: 60, mr: 3 }}
                      />
                      <Box>
                        <Typography fontWeight="bold">
                          Team ID: {match.team1_id}
                        </Typography>
                        <Typography variant="h4">
                          {match.score_team1 ?? "-"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Status and Optional Admin Button */}
                    {isAdmin && (
                      <Box
                        sx={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Button variant="contained" size="medium">
                          {match.status === "Completed"
                            ? "View Result"
                            : "Edit Result"}
                        </Button> */}

                        <Button variant="contained" size="medium" onClick={() => handleOpenEditor(match)}>
                          {match.status === "Completed" ? "View Result" : "Edit Result"}
                        </Button>


                        <MatchResultsEditor open={editorOpen} onClose={() => setEditorOpen(false)} 
                        team1Name={matchFormData.team1Name}
                        team2Name={matchFormData.team2Name}
                        team1Score={matchFormData.team1Score}
                        team2Score={matchFormData.team2Score}
                        date={matchFormData.date}
                        onChange={handleMatchChange}
                        onSave={handleMatchSave}
                        />


                      </Box>
                    )}

                    {/* Team 2 */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flex: 1,
                      }}
                    >
                      <Box sx={{ textAlign: "right", mr: 3 }}>
                        <Typography fontWeight="bold">
                          Team ID: {match.team2_id}
                        </Typography>
                        <Typography variant="h4">
                          {match.score_team2 ?? "-"}
                        </Typography>
                      </Box>
                      <Box
                        component="img"
                        src="https://via.placeholder.com/60"
                        alt="Team B"
                        sx={{ width: 60, height: 60, ml: 3 }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" mt={1} color="gray">
                    Match Date: {match.start_time} | Status: {match.status}
                  </Typography>
                </Card>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UniversityPage;
