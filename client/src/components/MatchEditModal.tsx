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
import { apiFetch } from "../api";

interface MatchEditModalProps {
  match: Match;
  onClose: () => void;
  onSave: (updatedMatch: Match) => void;
}

interface Team {
  team_id: number;
  team_name: string;
  university_name: string;
}

const MatchEditModal: React.FC<MatchEditModalProps> = ({
  match,
  onClose,
  onSave,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
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

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await apiFetch("/teams/getAllTeams");
        setTeams(data);
      } catch (err) {
        console.error("Failed to fetch teams", err);
        setError("Could not load teams.");
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    const info1 = teams.find(
      (team) => team.team_name.toLowerCase() === team1Name.toLowerCase()
    );
    const info2 = teams.find(
      (team) => team.team_name.toLowerCase() === team2Name.toLowerCase()
    );

    setTeam1University(info1?.university_name || "");
    setTeam2University(info2?.university_name || "");
  }, [team1Name, team2Name, teams]);

  const handleSave = async () => {
    const info1 = teams.find(
      (team) => team.team_name.toLowerCase() === team1Name.toLowerCase()
    );
    const info2 = teams.find(
      (team) => team.team_name.toLowerCase() === team2Name.toLowerCase()
    );

    if (!info1 || !info2) {
      setError("One or both team names are invalid.");
      return;
    }

    const updatedMatch: Match = {
      ...match,
      team1_id: info1.team_id,
      team2_id: info2.team_id,
      team1_name: info1.team_name,
      team2_name: info2.team_name,
      team1_university: info1.university_name,
      team2_university: info2.university_name,
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

    try {
      const response = await apiFetch("/matches/updateMatch", {
        method: "POST",
        body: JSON.stringify(updatedMatch),
      });

      if (response.message === "Match updated successfully!") {
        onSave(updatedMatch);
        onClose();
      } else {
        setError(response.error || "Failed to update match.");
      }
    } catch (err: any) {
      console.error("Match update error:", err);
      setError("An unexpected error occurred.");
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
          {error && <p className="text-red-600 font-medium -mt-3">{error}</p>}

          <div className="flex flex-row gap-10 w-full">
            <div className="w-1/2 flex flex-col justify-start">
              <TextField
                type="text"
                label="Team 1 Name"
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

            <div className="w-1/2 flex flex-col">
              <TextField
                type="text"
                label="Team 2 Name"
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
          </div>

          <div className="flex justify-end mt-4">
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="contained" onClick={handleSave}>
              Save Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchEditModal;
