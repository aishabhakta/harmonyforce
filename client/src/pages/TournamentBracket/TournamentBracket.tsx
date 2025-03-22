import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MatchEditModal from "./MatchEditModal";
import "./TournamentBracket.css";

interface Match {
  id: string;
  team1: string;
  school1: string;
  score1?: number;
  team2: string;
  school2: string;
  score2?: number;
  winner?: string;
}

// **ROUND 1 Matches (8 Matches per Side)**
const round1Left: Match[] = [
  {
    id: "1",
    team1: "Team Alpha",
    school1: "Cornell",
    team2: "Team Beta",
    school2: "RIT",
    score1: 0,
    score2: 3,
    winner: "team2",
  },
  {
    id: "2",
    team1: "Team Gamma",
    school1: "Penn State",
    team2: "Team Delta",
    school2: "Binghamton",
    score1: 4,
    score2: 2,
    winner: "team1",
  },
  {
    id: "3",
    team1: "Team Epsilon",
    school1: "NYU",
    team2: "Team Zeta",
    school2: "UCLA",
    score1: 1,
    score2: 5,
    winner: "team2",
  },
  {
    id: "4",
    team1: "Team Theta",
    school1: "MIT",
    team2: "Team Iota",
    school2: "Harvard",
    score1: 2,
    score2: 4,
    winner: "team2",
  },
  {
    id: "5",
    team1: "Team Kappa",
    school1: "Duke",
    team2: "Team Lambda",
    school2: "Stanford",
    score1: 6,
    score2: 3,
    winner: "team1",
  },
  {
    id: "6",
    team1: "Team Mu",
    school1: "Berkeley",
    team2: "Team Nu",
    school2: "Yale",
    score1: 2,
    score2: 1,
    winner: "team1",
  },
  {
    id: "7",
    team1: "Team Xi",
    school1: "Columbia",
    team2: "Team Omicron",
    school2: "Princeton",
    score1: 5,
    score2: 7,
    winner: "team2",
  },
  {
    id: "8",
    team1: "Team Pi",
    school1: "Georgetown",
    team2: "Team Rho",
    school2: "UChicago",
    score1: 0,
    score2: 2,
    winner: "team2",
  },
];

const round1Right: Match[] = [
  {
    id: "9",
    team1: "Team Sigma",
    school1: "Johns Hopkins",
    team2: "Team Tau",
    school2: "Brown",
    score1: 3,
    score2: 4,
    winner: "team2",
  },
  {
    id: "10",
    team1: "Team Upsilon",
    school1: "USC",
    team2: "Team Phi",
    school2: "Northwestern",
    score1: 5,
    score2: 1,
    winner: "team1",
  },
  {
    id: "11",
    team1: "Team Chi",
    school1: "Notre Dame",
    team2: "Team Psi",
    school2: "Dartmouth",
    score1: 6,
    score2: 4,
    winner: "team1",
  },
  {
    id: "12",
    team1: "Team Omega",
    school1: "Texas A&M",
    team2: "Team Alpha2",
    school2: "UNC",
    score1: 1,
    score2: 3,
    winner: "team2",
  },
  {
    id: "13",
    team1: "Team Beta2",
    school1: "Michigan",
    team2: "Team Gamma2",
    school2: "Ohio State",
    score1: 2,
    score2: 0,
    winner: "team1",
  },
  {
    id: "14",
    team1: "Team Delta2",
    school1: "Wisconsin",
    team2: "Team Epsilon2",
    school2: "Washington",
    score1: 3,
    score2: 1,
    winner: "team1",
  },
  {
    id: "15",
    team1: "Team Zeta2",
    school1: "Florida",
    team2: "Team Eta2",
    school2: "Virginia",
    score1: 4,
    score2: 2,
    winner: "team1",
  },
  {
    id: "16",
    team1: "Team Theta2",
    school1: "Illinois",
    team2: "Team Iota2",
    school2: "Georgia Tech",
    score1: 2,
    score2: 5,
    winner: "team2",
  },
];

// **ROUND 2**
const round2Left: Match[] = [
  {
    id: "17",
    team1: "Team Beta",
    school1: "RIT",
    team2: "Team Gamma",
    school2: "Penn State",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "18",
    team1: "Team Zeta",
    school1: "UCLA",
    team2: "Team Iota",
    school2: "Harvard",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "19",
    team1: "Team Kappa",
    school1: "Duke",
    team2: "Team Mu",
    school2: "Berkeley",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "20",
    team1: "Team Omicron",
    school1: "Princeton",
    team2: "Team Rho",
    school2: "UChicago",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

const round2Right: Match[] = [
  {
    id: "21",
    team1: "Team Tau",
    school1: "Brown",
    team2: "Team Upsilon",
    school2: "USC",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "22",
    team1: "Team Chi",
    school1: "Notre Dame",
    team2: "Team Alpha2",
    school2: "UNC",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "23",
    team1: "Team Beta2",
    school1: "Michigan",
    team2: "Team Delta2",
    school2: "Wisconsin",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "24",
    team1: "Team Zeta2",
    school1: "Florida",
    team2: "Team Iota2",
    school2: "Georgia Tech",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

// **ROUND 3**
const round3Left: Match[] = [
  {
    id: "25",
    team1: "Team Beta",
    school1: "RIT",
    team2: "Team Zeta",
    school2: "UCLA",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "26",
    team1: "Team Kappa",
    school1: "Duke",
    team2: "Team Rho",
    school2: "UChicago",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

const round3Right: Match[] = [
  {
    id: "27",
    team1: "Team Tau",
    school1: "Brown",
    team2: "Team Chi",
    school2: "Notre Dame",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
  {
    id: "28",
    team1: "Team Beta2",
    school1: "Michigan",
    team2: "Team Zeta2",
    school2: "Florida",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

// **ROUND 4**
const round4Left: Match[] = [
  {
    id: "29",
    team1: "Team Beta",
    school1: "RIT",
    team2: "Team Kappa",
    school2: "Duke",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

const round4Right: Match[] = [
  {
    id: "30",
    team1: "Team Tau",
    school1: "Brown",
    team2: "Team Beta2",
    school2: "Michigan",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

const round5: Match[] = [
  {
    id: "31",
    team1: "Team Tau",
    school1: "Brown",
    team2: "Team Beta",
    school2: "RIT",
    score1: undefined,
    score2: undefined,
    winner: "",
  },
];

const TournamentBracket = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const isAdmin = true;

  const handleOpenMatchModal = (match: Match) => {
    if (isAdmin) setSelectedMatch(match);
  };

  const handleCloseModal = () => setSelectedMatch(null);

  // render function for match cards
  const renderMatch = (match: Match) => (
    <Box key={match.id} className="matchup">
      <Card className="match-card" onClick={() => handleOpenMatchModal(match)}>
        <CardContent className="match-card-content">
          <Box className="team-info">
            <Box className="team-image" />
            <Box>
              <Typography className="team-name">{match.team1}</Typography>
              <Typography className="school-name">{match.school1}</Typography>
            </Box>
          </Box>
          <Typography className="score">{match.score1}</Typography>
        </CardContent>
      </Card>

      <Card
        className="match-card match-card-bottom"
        onClick={() => handleOpenMatchModal(match)}
      >
        <CardContent className="match-card-content">
          <Box className="team-info">
            <Box className="team-image" />
            <Box>
              <Typography className="team-name">{match.team2}</Typography>
              <Typography className="school-name">{match.school2}</Typography>
            </Box>
          </Box>
          <Typography className="score">{match.score2}</Typography>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box className="bracket-container">
      <Typography variant="h3" className="bracket-title">
        A New World Tournament
      </Typography>
      <Typography variant="h5" className="bracket-subtitle">
        Who will reign champion?
      </Typography>
      <Grid container spacing={4} className="bracket-grid">
        {/* LEFT SIDE */}
        <Grid container className="bracket-side">
          <Grid container className="column round1">
            {round1Left.map(renderMatch)}
          </Grid>
          <Grid container className="column round2">
            {round2Left.map(renderMatch)}
          </Grid>
          <Grid container className="column round3">
            {round3Left.map(renderMatch)}
          </Grid>
          <Grid container className="column round4">
            {round4Left.map(renderMatch)}
          </Grid>
          <Grid container className="column round5">
            {round5.map(renderMatch)}
          </Grid>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid container className="bracket-side">
          <Grid container className="column round4">
            {round4Right.map(renderMatch)}
          </Grid>
          <Grid container className="column round3">
            {round3Right.map(renderMatch)}
          </Grid>
          <Grid container className="column round2">
            {round2Right.map(renderMatch)}
          </Grid>
          <Grid container className="column round1">
            {round1Right.map(renderMatch)}
          </Grid>
        </Grid>
      </Grid>

      {selectedMatch && (
        <MatchEditModal match={selectedMatch} onClose={handleCloseModal} />
      )}
    </Box>
  );
};

export default TournamentBracket;
