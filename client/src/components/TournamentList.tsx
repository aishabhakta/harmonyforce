// useEffect(() => {
//   const fetchTournaments = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/tournament/tournaments"
//       );
//       if (!response.ok) throw new Error("Failed to fetch tournaments");
//       const data = await response.json();
//       setTournaments(data);
//     } catch (error) {
//       console.error("Error loading tournaments:", error);
//     }
//   };

//   fetchTournaments();
// }, []);
import React, { useState } from "react";
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

const ITEMS_PER_PAGE = 5;

const TournamentList: React.FC = () => {
  const [tournaments] = useState<Tournament[]>(dummyTournaments);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const navigate = useNavigate();

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
          <MenuItem key={univ as string} value={univ as string}>
            {univ}
          </MenuItem>
        ))}
      </Select>

      <List>
        {paginatedTournaments.map((tournament) => (
          <ListItem key={tournament.id} disableGutters sx={{ padding: 0 }}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 0,
                height: 60,
                alignItems: "center",
              }}
            >
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={tournament.logo}
                      alt={tournament.name}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        display: "block",
                        mx: "auto",
                      }}
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
                          ? "primary"
                          : tournament.status === "UPCOMING"
                          ? "secondary"
                          : "error"
                      }
                      onClick={() => handleOpenModal(tournament)}
                    >
                      {tournament.status}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Bottom row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
        }}
      >
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
      </Box>

      {/* Modal */}
      {selectedTournament && (
        <TournamentModal
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
