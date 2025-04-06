import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const TournamentForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await fetch("http://localhost:5000/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to register tournament.");
      const data = await response.json();
      console.log("Tournament registered:", data);
    } catch (error) {
      console.error("Error:", error);
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

        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TournamentForm;
