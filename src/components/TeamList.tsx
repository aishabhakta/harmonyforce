import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

// Team Interface
interface Team {
  id: number;
  name: string;
  university: string;
  logo?: string;
}

interface TeamListProps {
  university?: string; // Optional filter by university
}

// Sample Team Data
const teamsData: Team[] = [
  { id: 1, name: "Team Alpha", university: "Cornell University", logo: "https://via.placeholder.com/50" },
  { id: 2, name: "Team Beta", university: "Cornell University", logo: "https://via.placeholder.com/50" },
  { id: 3, name: "Team Gamma", university: "MIT", logo: "https://via.placeholder.com/50" },
  { id: 4, name: "Team Delta", university: "Stanford", logo: "https://via.placeholder.com/50" },
  { id: 5, name: "Team Epsilon", university: "MIT", logo: "https://via.placeholder.com/50" },
  { id: 6, name: "Team Zeta", university: "Cornell University", logo: "https://via.placeholder.com/50" },
];

const ITEMS_PER_PAGE = 5;

const TeamList: React.FC<TeamListProps> = ({ university }) => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();

  // Filter teams based on search and university
  const filteredTeams = teamsData.filter(
    (team) =>
      team.name.toLowerCase().includes(search.toLowerCase()) &&
      (!university || team.university === university) // Filter by university if provided
  );

  // Pagination
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
              onClick={() => navigate(`/team/${team.id}`)}
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
                  <Grid item xs={8}>
                    <ListItemText primary={team.name} />
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
