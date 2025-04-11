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
import { dummyTournaments, Tournament } from "./dummyData/dummyTournaments";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const ITEMS_PER_PAGE = 5;

const TournamentList: React.FC = () => {
  const [tournaments] = useState<Tournament[]>(dummyTournaments);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [paidTournaments, setPaidTournaments] = useState<string[]>([]); // always initialized as an array

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:5000/stripe/check-user-paid/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("No payment found");
          return res.json();
        })
        .then((data) => {
          if (data.status === "succeeded") {
            // ✅ Set default tournament name manually for now
            setPaidTournaments(["A New World Tournament"]);
          } else {
            setPaidTournaments([]); // no valid payment
          }
        })
        .catch((err) => {
          console.error("Payment check failed:", err);
          setPaidTournaments([]); // handle errors safely
        });
    }
  }, []);

  const handleOpenModal = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTournament(null);
  };

  const filteredTournaments = tournaments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || t.university === filter)
  );

  const paginatedTournaments = filteredTournaments.slice(
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
        {[...new Set(dummyTournaments.map((t) => t.university))].map((univ) => (
          <MenuItem key={univ} value={univ}>
            {univ}
          </MenuItem>
        ))}
      </Select>

      <List>
        {paginatedTournaments.map((tournament) => {
          const isPaid = paidTournaments.includes(tournament.name); // ✅ no more TypeError
          const buttonLabel =
            tournament.status === "APPLY" && isPaid ? "APPLIED" : tournament.status;

          return (
            <ListItem key={tournament.id}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={2}>
                      <Box
                      />
                    </Grid>
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
                            : tournament.status === "UPCOMING"
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
        }}
      >
        {["superadmin", "tournymod", "aardvarkstaff"].includes(user?.role || "") && (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", ml: 1 }}
              onClick={() => navigate("/TournamentRegistration")}
            >
              Create Tournament
            </Button>

            <Pagination
              count={Math.ceil(filteredTournaments.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value: number) => setPage(value)}
              sx={{ mr: 1 }}
            />
          </>
        )}
      </Box>

      {selectedTournament && (
        <TournamentModal
          key={modalOpen ? "open" : "closed"}
          open={modalOpen}
          onClose={handleCloseModal}
          tournament={selectedTournament}
          matches={selectedTournament.matches}
        />
      )}
    </Box>
  );
};

export default TournamentList;
