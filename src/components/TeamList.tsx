import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Enables navigation
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
} from "@mui/material";

// Team Interface
interface Team {
  id: number;
  name: string;
  university: string;
  logo?: string;
}

// Sample Team Data
const teamsData: Team[] = [
  { id: 1, name: "Team Alpha", university: "Harvard", logo: "https://via.placeholder.com/50" },
  { id: 2, name: "Team Beta", university: "MIT", logo: "https://via.placeholder.com/50" },
  { id: 3, name: "Team Gamma", university: "Stanford", logo: "https://via.placeholder.com/50" },
  { id: 4, name: "Team Delta", university: "Oxford", logo: "https://via.placeholder.com/50" },
  { id: 5, name: "Team Epsilon", university: "Cambridge", logo: "https://via.placeholder.com/50" },
  { id: 6, name: "Team Zeta", university: "Yale", logo: "https://via.placeholder.com/50" },
];

const ITEMS_PER_PAGE = 5;

const TeamList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");
  const navigate = useNavigate(); // Hook for navigation

  // Filtering and Pagination
  const filteredTeams = teamsData.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || team.university === filter)
  );

  const paginatedTeams = filteredTeams.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
      {/* Search Input */}
      <TextField
        label="Search Teams"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
        {[...new Set(teamsData.map((team) => team.university))].map(
          (univ) => (
            <MenuItem key={univ} value={univ}>
              {univ}
            </MenuItem>
          )
        )}
      </Select>

      {/* Team List */}
      <List>
        {paginatedTeams.map((team) => (
          <ListItem key={team.id} disablePadding>
            <Card
              sx={{
                width: "100%",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
              }}
              onClick={() => navigate(`/team/${team.id}`)} // Navigate to TeamPage
            >
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  {/* Team Logo */}
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={team.logo || "https://via.placeholder.com/50"}
                      alt={team.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>

                  {/* Team Name */}
                  <Grid item xs={6}>
                    <ListItemText primary={team.name} />
                  </Grid>

                  {/* University Name */}
                  <Grid item xs={4}>
                    <ListItemText primary={team.university} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredTeams.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default TeamList;
