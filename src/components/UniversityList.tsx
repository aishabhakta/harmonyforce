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

// Define University interface
interface University {
  id: number;
  name: string;
  location: string;
  logo: string;
}

// Sample University Data
const universitiesData: University[] = [
  { id: 1, name: "Harvard University", location: "USA", logo: "https://via.placeholder.com/50" },
  { id: 2, name: "MIT", location: "USA", logo: "https://via.placeholder.com/50" },
  { id: 3, name: "Stanford University", location: "USA", logo: "https://via.placeholder.com/50" },
  { id: 4, name: "Oxford University", location: "UK", logo: "https://via.placeholder.com/50" },
  { id: 5, name: "Cambridge University", location: "UK", logo: "https://via.placeholder.com/50" },
];

const ITEMS_PER_PAGE = 5;

const UniversityList: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("All");

  // Filter and Paginate Universities
  const filteredUniversities = universitiesData.filter(
    (university) =>
      university.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || university.location === filter)
  );

  const paginatedUniversities = filteredUniversities.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
      {/* Search Input */}
      <TextField
        label="Search Universities"
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
        <MenuItem value="All">All Locations</MenuItem>
        {[...new Set(universitiesData.map((u) => u.location))].map((loc) => (
          <MenuItem key={loc} value={loc}>
            {loc}
          </MenuItem>
        ))}
      </Select>

      {/* University List */}
      <List>
        {paginatedUniversities.map((university) => (
          <ListItem key={university.id}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  {/* University Logo */}
                  <Grid item xs={2}>
                    <Box
                      component="img"
                      src={university.logo}
                      alt={university.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Grid>

                  {/* University Name */}
                  <Grid item xs={6}>
                    <ListItemText primary={university.name} />
                  </Grid>

                  {/* Location */}
                  <Grid item xs={4}>
                    <ListItemText primary={university.location} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={(_, value: number) => setPage(value)}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default UniversityList;
