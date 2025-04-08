import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { apiFetch } from "../api";

interface UniversityFormProps {
  universityId?: string | null;
}

const UniversityForm: React.FC<UniversityFormProps> = ({ universityId }) => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Fetch university data if editing
  useEffect(() => {
    if (universityId) {
      apiFetch(`/university/${universityId}`)
        .then((res) => res.json())
        .then((data) => {
          setName(data.university_name || "");
          setBio(data.description || "");
          setLink(data.universitylink || "");
        })
        .catch((err) => {
          console.error("Failed to fetch university for editing", err);
        });
    }
  }, [universityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("university_id", universityId ?? "");
    formData.append("university_name", name);
    formData.append("description", bio);
    formData.append("universitylink", link);
    if (image) {
      formData.append("university_image", image); // actual file
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/university/update`,
        {
          method: "POST",
          body: formData, // no JSON.stringify here!
        }
      );

      if (!response.ok) throw new Error("Failed to update university.");
      const data = await response.json();
      console.log("University updated:", data);
      alert("University updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating university.");
    }
  };

  return (
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
      <Typography
        variant="h4"
        sx={{ marginBottom: "2rem", textAlign: "center" }}
      >
        {universityId ? "Edit University" : "University Registration"}
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        University Information
      </Typography>

      <TextField
        fullWidth
        label="University Name *"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ marginBottom: "1rem" }}
      />

      <TextField
        fullWidth
        label="University Bio *"
        variant="outlined"
        multiline
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        sx={{ marginBottom: "1rem" }}
        helperText="500 characters allowed"
      />

      <TextField
        fullWidth
        label="University Link"
        variant="outlined"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        sx={{ marginBottom: "1rem" }}
      />

      <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
        University Image
      </Typography>

      <Box
        sx={{
          border: "1px dashed #1976d2",
          borderRadius: "8px",
          padding: "1rem",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
          }}
        />
        <Typography variant="caption">
          SVG, PNG, JPG or GIF (max. 3MB)
        </Typography>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ marginTop: "1rem" }}
      >
        {universityId ? "Update University" : "Submit"}
      </Button>
    </Box>
  );
};

export default UniversityForm;
