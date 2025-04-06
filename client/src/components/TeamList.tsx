import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";

// Team Interface
interface Team {
  team_id: number;
  team_name: string;
  university_id: number;
  profile_image?: string;
}

// Props (Optional University Filter)
interface TeamListProps {
  universityId?: number;
}

// Toggle this to `true` to use dummy data if using the backend switch true to false 
const USE_DUMMY_DATA = false;

const dummyTeams: Team[] = [
  { team_id: 1, team_name: "Team Alpha", university_id: 101, profile_image: "https://via.placeholder.com/50" },
  { team_id: 2, team_name: "Team Beta", university_id: 101, profile_image: "https://via.placeholder.com/50" },
  { team_id: 3, team_name: "Team Gamma", university_id: 102, profile_image: "https://via.placeholder.com/50" },
  { team_id: 4, team_name: "Team Delta", university_id: 103, profile_image: "https://via.placeholder.com/50" },
  { team_id: 5, team_name: "Team Epsilon", university_id: 102, profile_image: "https://via.placeholder.com/50" },
  { team_id: 6, team_name: "Team Zeta", university_id: 101, profile_image: "https://via.placeholder.com/50" },
];

const ITEMS_PER_PAGE = 5;

const TeamList: React.FC<TeamListProps> = ({ universityId }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      setError(null);

      if (USE_DUMMY_DATA) {
        setTeams(dummyTeams);
        setLoading(false);
        return;
      }

      try {
        // Fetch from backend
        const response = await fetch("http://127.0.0.1:5000/teams/getAllTeams");
        const data = await response.json();

        if (response.ok) {
          setTeams(data.teams);
        } else {
          setError(data.error || "Failed to fetch teams");
        }
      } catch (err) {
        setError("An error occurred while loading teams.");
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(search.toLowerCase()) &&
      (!universityId || team.university_id === universityId)
  );

  const paginatedTeams = filteredTeams.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto", mt: 3 }}>
      <TextField
        label="Search Teams"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <List>
            {paginatedTeams.map((team) => (
              <ListItem key={team.team_id} disablePadding>
                <Card
                  sx={{
                    width: "100%",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { boxShadow: 4 },
                  }}
                  onClick={() => {
                    const path = `/team/${team.team_id}${USE_DUMMY_DATA ? "?dummy=true" : ""}`;
                    navigate(path);
                  }}
                  
                >
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={2}>
                        <Box
                          component="img"
                          src={team.profile_image || "https://via.placeholder.com/50"}
                          alt={team.team_name}
                          sx={{ width: 50, height: 50 }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <ListItemText primary={team.team_name} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>

          {/* Create Button & Pagination Row */}
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
              onClick={() => navigate("/TeamRegistration")}
              sx={{ textTransform: "none" }}
            >
              Create Team
            </Button>

            <Pagination
              count={Math.ceil(filteredTeams.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TeamList;