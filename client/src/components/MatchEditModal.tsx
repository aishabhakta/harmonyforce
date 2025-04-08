import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Radio,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Match } from "../pages/TournamentBracket/TournamentBracket";
import axios from "axios";

interface MatchEditModalProps {
  match: Match;
  onClose: () => void;
  onSave: (updatedMatch: Match) => void;
  editable?: boolean;
}

const MatchEditModal: React.FC<MatchEditModalProps> = ({
  match,
  onClose,
  onSave,
  editable = false,
}) => {
  const [team1Score, setTeam1Score] = useState(match.score_team1 ?? "");
  const [team2Score, setTeam2Score] = useState(match.score_team2 ?? "");
  const [winner, setWinner] = useState<"team1" | "team2" | "">(() => {
    if (match.winner_id === match.team1_id) return "team1";
    if (match.winner_id === match.team2_id) return "team2";
    return "";
  });
  const [date, setDate] = useState(
    match.start_time ?? new Date().toISOString().split("T")[0]
  );

  const handleSave = async () => {
    const updatedMatch: Match = {
      ...match,
      score_team1: Number(team1Score),
      score_team2: Number(team2Score),
      winner_id:
        winner === "team1"
          ? match.team1_id
          : winner === "team2"
          ? match.team2_id
          : null,
      start_time: date,
      status: 1,
    };

    try {
      await axios.post(`/api/match/${match.match_id}/set_scores`, {
        score_team1: updatedMatch.score_team1,
        score_team2: updatedMatch.score_team2,
      });

      onSave(updatedMatch);
      onClose();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="relative flex justify-between items-center px-6 pt-4 pb-2">
        <span className="text-xl font-bold">Edit Match Results</span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-row gap-10 w-full">
            <div className="w-1/2 flex flex-col justify-start">
              <div className="mb-4">
                <h6 className="text-lg font-semibold mb-2">Team 1 Name</h6>
                <TextField
                  value={match.team1_name}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="University"
                  value={match.team1_university}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  fullWidth
                  label="Team 1 Score"
                  sx={{ mb: 2 }}
                  disabled={!editable}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={winner === "team1"}
                      onChange={() => editable && setWinner("team1")}
                    />
                  }
                  label="Winner of match?"
                  sx={{ mb: 2 }}
                />
              </div>

              <div className="mb-4">
                <h6 className="text-lg font-semibold mb-2">Team 2 Name</h6>
                <TextField
                  value={match.team2_name}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="University"
                  value={match.team2_university}
                  fullWidth
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  fullWidth
                  label="Team 2 Score"
                  sx={{ mb: 2 }}
                  disabled={!editable}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={winner === "team2"}
                      onChange={() => editable && setWinner("team2")}
                    />
                  }
                  label="Winner of match?"
                  sx={{ mb: 2 }}
                />
              </div>

              <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={!editable}
              >
                Save Results
              </Button>
            </div>

            <div className="w-1/2 flex flex-col items-end justify-start">
              <h6 className="text-lg font-semibold mb-2">Date of Match</h6>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={!editable}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchEditModal;
