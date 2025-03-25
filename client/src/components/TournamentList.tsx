import React, { useState, useEffect } from "react";
import {
  Box, TextField, List, ListItem, ListItemText, Card, CardContent,
  Grid, Pagination, MenuItem, Select, SelectChangeEvent, Button
} from "@mui/material";

interface Tournament {
  id: number;
  name: string;
  university: string;
  logo: string;
  status: "APPLY" | "VIEW";
}

const ITEMS_PER_PAGE = 5;

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch("http://localhost:5000/tournament/tournaments");
        if (!response.ok) throw new Error("Failed to fetch tournaments");
        const data = await response.json();
        setTournaments(data);
      } catch (error) {
        console.error("Error loading tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

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
        {[...new Set(tournaments.map((t) => t.university))].map((univ) => (
          <MenuItem key={univ} value={univ}>{univ}</MenuItem>
        ))}
      </Select>

      <List>
        {paginatedTournaments.map((tournament) => (
          <ListItem key={tournament.id}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={tournament.logo}
                      alt={tournament.name}
                      sx={{ width: 50, height: 50 }}
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
                      color={tournament.status === "APPLY" ? "primary" : "error"}
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

{/* Bottom row: Create Button (left) and Pagination (right) */}
<Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 4,
  }}
>
  {/* Left-aligned Create Button */}
  <Button
    variant="contained"
    color="primary"
    sx={{ textTransform: "none", ml: 1 }}
    onClick={() => {
      // Replace with your actual route if needed
      console.log("Navigate to create tournament form");
    }}
  >
    Create Tournament
  </Button>

  {/* Right-aligned Pagination */}
  <Pagination
    count={Math.ceil(filteredTournaments.length / ITEMS_PER_PAGE)}
    page={page}
    onChange={(_, value: number) => setPage(value)}
    sx={{ mr: 1 }}
  />
</Box>

    </Box>
  );
};

export default TournamentList;
