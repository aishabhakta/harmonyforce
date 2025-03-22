import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/lab";
import "./MatchEditModal.css";

interface Match {
  id: string;
  team1: string;
  school1: string;
  team2: string;
  school2: string;
  score1?: number;
  score2?: number;
  date?: string;
  winner?: string;
}

interface MatchEditModalProps {
  match: Match;
  onClose: () => void;
}

const MatchEditModal: React.FC<MatchEditModalProps> = ({ match, onClose }) => {
  const [team1Name, setTeam1Name] = useState(match.team1);
  const [team2Name, setTeam2Name] = useState(match.team2);
  const [team1Score, setTeam1Score] = useState(match.score1 || "");
  const [team2Score, setTeam2Score] = useState(match.score2 || "");
  const [winner, setWinner] = useState(match.winner || "");
  const [date, setDate] = useState(
    match.date || new Date().toISOString().split("T")[0]
  );

  const handleSave = () => {
    console.log("Saved match details:", {
      team1Name,
      team2Name,
      team1Score,
      team2Score,
      winner,
      date,
    });
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Match Results
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <div className="match-details-container">
          {/* Left Side - Team Info */}
          <div className="team-section">
            {/* Team 1 */}
            <Typography variant="h6" className="team-title">
              Team 1:
              <TextField
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                variant="standard"
                className="team-name-input"
              />
            </Typography>
            <Typography variant="body2" className="score-label">
              Team 1 Score
            </Typography>
            <TextField
              type="number"
              value={team1Score}
              onChange={(e) => setTeam1Score(e.target.value)}
              fullWidth
              className="score-input"
            />
            <FormControlLabel
              control={
                <Radio
                  checked={winner === "team1"}
                  onChange={() => setWinner("team1")}
                />
              }
              label="Winner of match?"
            />

            {/* Team 2 */}
            <Typography variant="h6" className="team-title">
              Team 2:
              <TextField
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                variant="standard"
                className="team-name-input"
              />
            </Typography>
            <Typography variant="body2" className="score-label">
              Team 2 Score
            </Typography>
            <TextField
              type="number"
              value={team2Score}
              onChange={(e) => setTeam2Score(e.target.value)}
              fullWidth
              className="score-input"
            />
            <FormControlLabel
              control={
                <Radio
                  checked={winner === "team2"}
                  onChange={() => setWinner("team2")}
                />
              }
              label="Winner of match?"
            />

            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              className="save-button"
            >
              Save Results
            </Button>
          </div>

          {/* Right Side - Date Picker */}
          <div className="date-section">
            <Typography variant="h6">Date of Match</Typography>
            <DatePicker
              value={date}
              onChange={(newDate) =>
                setDate(newDate?.toISOString().split("T")[0] || date)
              }
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchEditModal;
