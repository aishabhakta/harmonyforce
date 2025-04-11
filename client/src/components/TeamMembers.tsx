import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

interface TeamMembersProps {
  captainId: number;
  currentUserId: number;
  members: any[];
  setMembers: React.Dispatch<React.SetStateAction<any[]>>;
}

const TeamMembers: React.FC<TeamMembersProps> = () => {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || "0");
  const [teamData, setTeamData] = useState<any>(null);
  const [, setLoading] = useState(true);
  const teamSize = (teamData?.members?.length || 0) + 1;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("participant");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddMember = async () => {
    if (!name || !email || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const data = await apiFetch(`/teams/requestAddMember`, {
        method: "POST",
        body: JSON.stringify({
          email,
          team_id: teamId,
          game_role: role,
        }),
      });

      // If API sends a message back, display it
      setSuccess(data.message || "Member request sent for approval!");
      setError("");
      setName("");
      setEmail("");
      setRole("participant");
    } catch (err: any) {
      console.error("Add member error:", err);
      setError(err.message || "Failed to submit request.");
      setSuccess("");
    }
  };

  useEffect(() => {
    if (!teamId) return;

    apiFetch(`/teams/getTeam/${teamId}`)
      .then((data) => {
        setTeamData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch team", err);
        setLoading(false);
      });
  }, [teamId]);

  return (
    <Box
      sx={{
        marginBottom: "2rem",
        padding: "1rem",
        maxWidth: "800px",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
        Team Members
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: "1rem" }}>
        Each team must have between 5 – 7 members.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <TextField
          label="Name *"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email Address *"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <TextField
        fullWidth
        select
        label="Role"
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        {[
          "Expedition Leader",
          "Resource Specialist",
          "Scientist",
          "Technician",
          "Chronicler",
          "Weapons Specialist",
          "Physician",
        ].map((roleOption) => (
          <MenuItem key={roleOption} value={roleOption}>
            {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "1rem", width: "100%" }}
        onClick={handleAddMember}
        disabled={teamSize >= 7}
      >
        Add Member
      </Button>
    </Box>
  );
};

export default TeamMembers;
