import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Pagination,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import TournamentModal from "./TournamentModal";
import { Tournament, Match } from "../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

const ITEMS_PER_PAGE = 5;

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [paidTournaments, setPaidTournaments] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    apiFetch("/tournament/tournaments")
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Failed to fetch tournaments", err));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      apiFetch(`/stripe/check-user-paid/${userId}`)
        .then((data) => {
          if (data.status === "succeeded") {
            setPaidTournaments(["A New World Tournament"]);
          } else {
            setPaidTournaments([]);
          }
        })
        .catch((err) => {
          console.error("Payment check failed:", err);
          setPaidTournaments([]);
        });
    }
  }, []);

  const handleOpenModal = async (tournament: Tournament) => {
    try {
      const matchData = await apiFetch(`/tournament/${tournament.id}/matches`);
      const formattedMatches = matchData.map((m: any) => ({
        match_id: m.match_id,
        tournament_id: m.tournament_id,
        team1: `Team ${m.team1_id}`,
        team2: `Team ${m.team2_id}`,
        score_team1: m.score_team1,
        score_team2: m.score_team2,
        winner:
          m.winner_id === m.team1_id
            ? `Team ${m.team1_id}`
            : m.winner_id === m.team2_id
            ? `Team ${m.team2_id}`
            : null,
      }));
      setMatches(formattedMatches);
      setSelectedTournament(tournament);
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTournament(null);
    setMatches([]);
  };

  const filteredTournaments = tournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || t.university === filter)
  );

  const sortedTournaments = [...filteredTournaments].sort((a, b) => {
    const statusPriority = {
      APPLY: 0,
      VIEW: 1,
      RESULTS: 2,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const paginatedTournaments = sortedTournaments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
      <TextField
        label="Search Tournaments"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Select
        value={filter}
        onChange={(e: SelectChangeEvent<string>) => setFilter(e.target.value)}
        displayEmpty
        sx={{ marginBottom: 2 }}
        fullWidth
      >
        <MenuItem value="All">All Universities</MenuItem>
        {[...new Set(tournaments.map((t) => t.university))].map((univ) => (
          <MenuItem key={univ} value={univ}>
            {univ}
          </MenuItem>
        ))}
      </Select>

      <List>
        {paginatedTournaments.map((tournament) => {
          const isPaid = paidTournaments.includes(tournament.name);
          const buttonLabel =
            tournament.status === "APPLY" && isPaid
              ? "APPLIED"
              : tournament.status;

          return (
            <ListItem key={tournament.id} disableGutters sx={{ padding: 0 }}>
              <Card sx={{ width: "100%", borderRadius: 0, height: 60 }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={6}>
                      <ListItemText primary={tournament.name} />
                    </Grid>
                    <Grid item xs={2}>
                      <ListItemText primary={tournament.university} />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color={
                          tournament.status === "APPLY"
                            ? isPaid
                              ? "success"
                              : "primary"
                            : tournament.status === "VIEW"
                            ? "secondary"
                            : "error"
                        }
                        onClick={() => handleOpenModal(tournament)}
                      >
                        {buttonLabel}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        {user &&
          ["superadmin", "tournymod", "aardvarkstaff"].includes(
            user.role || ""
          ) && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/TournamentRegistration")}
            >
              Create Tournament
            </Button>
          )}

        <Pagination
          count={Math.ceil(filteredTournaments.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value: number) => setPage(value)}
        />
      </Box>

      {selectedTournament && (
        <TournamentModal
          open={modalOpen}
          onClose={handleCloseModal}
          tournament={selectedTournament}
          matches={matches}
        />
      )}
    </Box>
  );
};

export default TournamentList;
