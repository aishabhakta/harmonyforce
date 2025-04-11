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
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

interface University {
  university_id: number;
  university_name: string;
  country?: string;
  university_image: string;
}

const ITEMS_PER_PAGE = 5;

const UniversityList: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    apiFetch("/university/getAll")
      .then((data) => setUniversities(data))
      .catch((err) => console.error("Failed to fetch universities:", err));
  }, []);

  const filtered = universities.filter(
    (u) =>
      u.university_id !== 0 &&
      u.university_name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || u.country === filter)
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
      <TextField
        label="Search Universities"
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
        <MenuItem value="All">All Countries</MenuItem>
        {[...new Set(universities.map((u) => u.country))]
          .filter(Boolean)
          .map((loc) => (
            <MenuItem key={loc} value={loc}>
              {loc}
            </MenuItem>
          ))}
      </Select>

      <List>
        {paginated.map((u) => (
          <ListItem key={u.university_id} disablePadding>
            <Card
              sx={{
                width: "100%",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { boxShadow: 4 },
              }}
              onClick={() => navigate(`/university/${u.university_id}`)}
            >
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={u.university_image}
                      alt={u.university_name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ListItemText primary={u.university_name} />
                  </Grid>
                  <Grid item xs={4}>
                    <ListItemText primary={u.country || "N/A"} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
        }}
      >
        {["superadmin", "unimod", "aardvarkstaff"].includes(user?.role || "") &&
          user?.university_id == 0 && (
            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "none", ml: 1 }}
              onClick={() => navigate("/UniversityRegistration")}
            >
              Create University
            </Button>
          )}

        <Pagination
          count={Math.ceil(filtered.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{ mr: 1 }}
        />
      </Box>
    </Box>
  );
};

export default UniversityList;
