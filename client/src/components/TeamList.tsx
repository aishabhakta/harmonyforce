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

const ITEMS_PER_PAGE = 5;

const TeamList: React.FC<TeamListProps> = ({ universityId }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch Teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://127.0.0.1:5000/teams/getAllTeams");
        const data = await response.json();

        if (response.ok) {
          setTeams(data.teams);
        } else {
          setError(data.error || "Failed to fetch teams");
        }
      } catch (err) {
        setError("An error occurred while fetching teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search and university
  const filteredTeams = teams.filter(
    (team) =>
      team.team_name.toLowerCase().includes(search.toLowerCase()) &&
      (!universityId || team.university_id === universityId)
  );

  // Pagination
  const paginatedTeams = filteredTeams.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto", mt: 3 }}>
      {/* Search Input */}
      <TextField
        label="Search Teams"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Show Loader While Fetching Data */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Show Team List */}
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
                  onClick={() => navigate(`/team/${team.team_id}`)}
                >
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      {/* Team Logo */}
                      <Grid item xs={2}>
                        <Box
                          component="img"
                          src={team.profile_image || "https://via.placeholder.com/50"}
                          alt={team.team_name}
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
          onClick={() => navigate("/TeamRegistration")}
          sx={{ textTransform: "none", ml: 1 }}
        >
          Create Team
        </Button>
        
        {/* Right-aligned Pagination */}
        <Pagination
          count={Math.ceil(filteredTeams.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mr: 1 }}
        />
        </Box>
                      {/* Team Name */}
                      <Grid item xs={8}>
                        <ListItemText primary={team.team_name} />
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
        </>
      )}
    </Box>
  );
};

export default TeamList;
