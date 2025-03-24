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

// Define Tournament interface
interface Tournament {
  id: number;
  name: string;
  university: string;
  logo: string;
  status: "APPLY" | "VIEW";
}

// Sample Tournament Data
const tournamentsData: Tournament[] = [
  { id: 1, name: "Tournament A", university: "Harvard", logo: "https://via.placeholder.com/50", status: "APPLY" },
  { id: 2, name: "Tournament B", university: "MIT", logo: "https://via.placeholder.com/50", status: "VIEW" },
  { id: 3, name: "Tournament C", university: "Stanford", logo: "https://via.placeholder.com/50", status: "VIEW" },
  { id: 4, name: "Tournament D", university: "Oxford", logo: "https://via.placeholder.com/50", status: "APPLY" },
  { id: 5, name: "Tournament E", university: "Cambridge", logo: "https://via.placeholder.com/50", status: "APPLY" },
];

const ITEMS_PER_PAGE = 5;

const TournamentList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");

  // Filter and Paginate Tournaments
  const filteredTournaments = tournamentsData.filter(
    (tournament) =>
      tournament.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || tournament.university === filter)
  );

  const paginatedTournaments = filteredTournaments.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
      {/* Search Input */}
      <TextField
        label="Search Tournaments"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        sx={{ marginBottom: 2 }}
      />

      {/* Filter Dropdown */}
      <Select
        value={filter}
        onChange={(e: SelectChangeEvent<string>) => setFilter(e.target.value)}
        displayEmpty
        sx={{ marginBottom: 2 }}
        fullWidth
      >
        <MenuItem value="All">All Universities</MenuItem>
        {[...new Set(tournamentsData.map((t) => t.university))].map((univ) => (
          <MenuItem key={univ} value={univ}>
            {univ}
          </MenuItem>
        ))}
      </Select>

      {/* Tournament List */}
      <List>
        {paginatedTournaments.map((tournament) => (
          <ListItem key={tournament.id}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  {/* Tournament Logo */}
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={tournament.logo}
                      alt={tournament.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>

                  {/* Tournament Name */}
                  <Grid item xs={6}>
                    <ListItemText primary={tournament.name} />
                  </Grid>

                  {/* University */}
                  <Grid item xs={2}>
                    <ListItemText primary={tournament.university} />
                  </Grid>

                  {/* Status Button */}
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
