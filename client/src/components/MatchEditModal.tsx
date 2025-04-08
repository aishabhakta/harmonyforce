import React, { useState, useEffect } from "react";
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
import { teamDatabase } from "../pages/TournamentBracket/dummyMatches";

interface MatchEditModalProps {
  match: Match;
  onClose: () => void;
  onSave: (updatedMatch: Match) => void;
}

const MatchEditModal: React.FC<MatchEditModalProps> = ({
  match,
  onClose,
  onSave,
}) => {
  const [team1Name, setTeam1Name] = useState(match.team1_name || "");
  const [team2Name, setTeam2Name] = useState(match.team2_name || "");
  const [team1University, setTeam1University] = useState(
    match.team1_university || ""
  );
  const [team2University, setTeam2University] = useState(
    match.team2_university || ""
  );
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
  const [error, setError] = useState("");

  const getTeamInfo = (name: string) => {
    return teamDatabase.find(
      (team) => team.name.toLowerCase() === name.toLowerCase()
    );
  };
  const [team1Error, setTeam1Error] = useState("");
  const [team2Error, setTeam2Error] = useState("");

  useEffect(() => {
    const info1 = getTeamInfo(team1Name);
    if (info1) setTeam1University(info1.university);

    const info2 = getTeamInfo(team2Name);
    if (info2) setTeam2University(info2.university);
  }, [team1Name, team2Name]);

  useEffect(() => {
    const team1Match = teamDatabase.find((t) => t.name === team1Name);
    const team2Match = teamDatabase.find((t) => t.name === team2Name);

    setTeam1University(team1Match?.university || "");
    setTeam2University(team2Match?.university || "");

    setTeam1Error(team1Match ? "" : "Team not found");
    setTeam2Error(team2Match ? "" : "Team not found");
  }, [team1Name, team2Name]);

  const handleSave = () => {
    const info1 = getTeamInfo(team1Name);
    const info2 = getTeamInfo(team2Name);

    if (!info1 || !info2) {
      setError("One or both team names are invalid.");
      return;
    }

    const updatedMatch: Match = {
      ...match,
      team1_id: info1.team_id,
      team2_id: info2.team_id,
      team1_name: team1Name,
      team2_name: team2Name,
      team1_university: info1.university,
      team2_university: info2.university,
      score_team1: Number(team1Score),
      score_team2: Number(team2Score),
      winner_id:
        winner === "team1"
          ? info1.team_id
          : winner === "team2"
          ? info2.team_id
          : null,
      start_time: date,
    };

    setError("");
    onSave(updatedMatch);
    onClose();
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
          {error && <p className="text-red-600 font-medium -mt-3">{error}</p>}

          <div className="flex flex-row gap-10 w-full">
            <div className="w-1/2 flex flex-col justify-start">
              <div className="mb-4">
                <h6
                  className="text-lg font-semibold"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Team 1 Name
                </h6>
                <TextField
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="University"
                  value={team1University}
                  fullWidth
                  disabled
                  error={!!team1Error}
                  helperText={team1Error || ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  value={team1Score}
                  onChange={(e) => setTeam1Score(e.target.value)}
                  fullWidth
                  label="Team 1 Score"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={winner === "team1"}
                      onChange={() => setWinner("team1")}
                    />
                  }
                  label="Winner of match?"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>

              <div className="mb-4">
                <h6
                  className="text-lg font-semibold"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Team 2 Name
                </h6>
                <TextField
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="University"
                  value={team2University}
                  fullWidth
                  disabled
                  error={!!team2Error}
                  helperText={team2Error || ""}
                  sx={{ mb: 2 }}
                />
                <TextField
                  type="number"
                  value={team2Score}
                  onChange={(e) => setTeam2Score(e.target.value)}
                  fullWidth
                  label="Team 2 Score"
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={winner === "team2"}
                      onChange={() => setWinner("team2")}
                    />
                  }
                  label="Winner of match?"
                  style={{ marginBottom: "0.5rem" }}
                />
              </div>

              <Button
                onClick={handleSave}
                variant="contained"
                color="primary"
                className="mt-4 w-fit"
                sx={{ mb: 2 }}
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
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchEditModal;
