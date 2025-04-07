import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

interface University {
  university_id: number;
  university_name: string;
}

const TournamentForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5000/university/getAll");
        const data = await response.json();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); // Disable button immediately
  
    if (!name || !description || !startDate || !endDate || !selectedUniversityId) {
      alert("Please fill in all fields.");
      setSubmitting(false);
      return;
    }
  
    const payload = {
      name,
      description,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      university_id: selectedUniversityId,
    };
  
    try {
      const response = await fetch("http://localhost:5000/tournament/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error("Failed to register tournament.");
      const data = await response.json();
  
      alert(`🎉 Tournament "${name}" created successfully! ID: ${data.tournament_id}`);
  
      // Optionally reset form fields
      setName("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setSelectedUniversityId("");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred. Please try again.");
    } finally {
      setSubmitting(false); // Re-enable button
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#f9f9f9",
          padding: "2rem",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "2rem", textAlign: "center" }}>
          Tournament Creator
        </Typography>

        <TextField
          fullWidth
          label="Tournament Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: "1rem" }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ marginBottom: "1rem" }}
        />

        <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
          <InputLabel id="university-select-label">Select University</InputLabel>
          <Select
            labelId="university-select-label"
            value={selectedUniversityId}
            label="Select University"
            onChange={(e) => setSelectedUniversityId(Number(e.target.value))}
          >
            {universities.map((uni) => (
              <MenuItem key={uni.university_id} value={uni.university_id}>
                {uni.university_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </Box>

        <Button type="submit" variant="contained" fullWidth disabled={submitting}>
  {submitting ? "Submitting..." : "Submit"}
</Button>

      </Box>
    </LocalizationProvider>
  );
};

export default TournamentForm;
