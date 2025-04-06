import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Match, Tournament } from "./dummyData/dummyTournaments";
import { Link } from "react-router-dom";
import RegisterButton from "../components/RegisterButton"; // adjust path if needed


interface TournamentModalProps {
  open: boolean;
  onClose: () => void;
  tournament: Tournament;
  matches: Match[];
}

const TournamentModal: React.FC<TournamentModalProps> = ({
  open,
  onClose,
  tournament,
  matches,
}) => {
  const finalMatch = matches.find(
    (m) => m.match_id === 31 && m.tournament_id === tournament.id
  );
  const otherMatches = matches.filter(
    (m) => m.tournament_id === tournament.id && m.match_id !== 31
  );
  const isViewMode = tournament.status === "VIEW";

  const renderMatch = (match: Match) => {
    const isTeam1Winner = isViewMode && match.team1 === match.winner;
    const isTeam2Winner = isViewMode && match.team2 === match.winner;

    return (
      <Card key={match.match_id} sx={{ my: 1 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: isTeam1Winner ? "#e0e0f8" : "#f5f5f5",
              color: isTeam1Winner ? "#6a1b9a" : "#555",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography>{match.team1}</Typography>
            <Typography>{match.score_team1}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: isTeam2Winner ? "#e0e0f8" : "#f5f5f5",
              color: isTeam2Winner ? "#6a1b9a" : "#555",
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography>{match.team2}</Typography>
            <Typography>{match.score_team2}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{tournament.name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Host: {tournament.university}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {tournament.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {tournament.start_date} - {tournament.end_date}
        </Typography>

        {finalMatch && isViewMode && (
          <Box my={3}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Final Match
            </Typography>
            {renderMatch(finalMatch)}
          </Box>
        )}

        <Typography variant="h6" mt={4} mb={2}>
          All Matches
        </Typography>
        <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
          {otherMatches.map(renderMatch)}
        </Box>
        {tournament.name === "A New World Tournament" && (
          <Box mt={4} textAlign="center" display="flex" flexDirection="column" gap={2} alignItems="center">
            <Link to="/tournaments/bracket" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary">
                Go to Tournament Bracket
              </Button>
            </Link>

            <RegisterButton />

          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TournamentModal;
