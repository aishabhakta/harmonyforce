import { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MatchEditModal from "../../components/MatchEditModal";
import "./TournamentBracket.css";
import { useAuth } from "../../AuthProvider";
import { apiFetch } from "../../api";

export interface Match {
  match_id: number;
  tournament_id: number;
  team1_id: number;
  team2_id: number;
  score_team1: number | null;
  score_team2: number | null;
  winner_id: number | null;
  start_time: string | null;
  status: number;
  team1_name?: string;
  team2_name?: string;
  team1_university?: string;
  team2_university?: string;
}

const TournamentBracket = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { user } = useAuth();
  const isPrivileged = ["superadmin", "tournymod", "aardvarkstaff"].includes(
    user?.role || ""
  );

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await apiFetch("/tournaments/9/matches");
        setMatches(data);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }
    };
    fetchMatches();
  }, []);

  const handleOpenMatchModal = (match: Match) => {
    if (isPrivileged) setSelectedMatch(match);
  };
  console.log("User role:", user?.role);
  console.log("Is privileged?", isPrivileged);

  const handleCloseModal = () => setSelectedMatch(null);

  const updateMatchInState = (updated: Match) => {
    setMatches((prev) =>
      prev.map((m) => (m.match_id === updated.match_id ? updated : m))
    );
  };

  const round1Matches = matches.filter((m, i) => i < 16);
  const round2Matches = matches.filter((m, i) => i >= 16 && i < 24);
  const round3Matches = matches.filter((m, i) => i >= 24 && i < 28);
  const round4Matches = matches.filter((m, i) => i >= 28 && i < 30);
  const round5Matches = matches.filter((m, i) => i === 30);

  const renderMatch = (match: Match) => {
    const winner = match.winner_id;
    const team1Won = winner === match.team1_id;
    const team2Won = winner === match.team2_id;

    const team1Class = team1Won ? "winner" : winner ? "loser" : "";
    const team2Class = team2Won ? "winner" : winner ? "loser" : "";

    return (
      <Box key={match.match_id} className="matchup">
        <Card
          className={`match-card ${team1Class}`}
          onClick={() => handleOpenMatchModal(match)}
        >
          <CardContent className="match-card-content">
            <Box className="team-info">
              <Box className="team-image" />
              <Box>
                <Typography className="team-name">
                  {match.team1_name}
                </Typography>
                <Typography className="school-name">
                  {match.team1_university}
                </Typography>
              </Box>
            </Box>
            <Typography className="score">{match.score_team1}</Typography>
          </CardContent>
        </Card>

        <Card
          className={`match-card match-card-bottom ${team2Class}`}
          onClick={() => handleOpenMatchModal(match)}
        >
          <CardContent className="match-card-content">
            <Box className="team-info">
              <Box className="team-image" />
              <Box>
                <Typography className="team-name">
                  {match.team2_name}
                </Typography>
                <Typography className="school-name">
                  {match.team2_university}
                </Typography>
              </Box>
            </Box>
            <Typography className="score">{match.score_team2}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box className="bracket-container">
      <Typography variant="h3" className="bracket-title">
        A New World Tournament
      </Typography>
      <Typography variant="h5" className="bracket-subtitle">
        Who will reign champion?
      </Typography>
      <Grid container spacing={4} className="bracket-grid">
        <Grid container className="bracket-side">
          <Grid container className="column round1">
            {round1Matches.slice(0, 8).map(renderMatch)}
          </Grid>
          <Grid container className="column round2">
            {round2Matches.slice(0, 4).map(renderMatch)}
          </Grid>
          <Grid container className="column round3">
            {round3Matches.slice(0, 2).map(renderMatch)}
          </Grid>
          <Grid container className="column round4">
            {round4Matches.slice(0, 1).map(renderMatch)}
          </Grid>
          <Grid container className="column round5">
            {round5Matches.map(renderMatch)}
          </Grid>
        </Grid>

        <Grid container className="bracket-side">
          <Grid container className="column round4">
            {round4Matches.slice(1).map(renderMatch)}
          </Grid>
          <Grid container className="column round3">
            {round3Matches.slice(2).map(renderMatch)}
          </Grid>
          <Grid container className="column round2">
            {round2Matches.slice(4).map(renderMatch)}
          </Grid>
          <Grid container className="column round1">
            {round1Matches.slice(8).map(renderMatch)}
          </Grid>
        </Grid>
      </Grid>

      {selectedMatch && (
        <MatchEditModal
          match={selectedMatch}
          onClose={handleCloseModal}
          onSave={updateMatchInState}
        />
      )}
    </Box>
  );
};

export default TournamentBracket;
