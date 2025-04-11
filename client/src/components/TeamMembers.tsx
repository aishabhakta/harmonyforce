import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { useParams } from "react-router-dom";

interface TeamMembersProps {
  members: any[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ members }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [, setLoading] = useState(true);
  const teamSize = (members?.length || 0) + 1;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const roleOptions = [
    "Expedition Leader",
    "Resource Specialist",
    "Scientist",
    "Technician",
    "Chronicler",
    "Weapons Specialist",
    "Physician",
    "Strategist",
    "Medic",
  ];

  const [role, setRole] = useState(roleOptions[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddMember = async () => {
    if (!name || !email || !role) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/teams/requestAddMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          team_id: parseInt(teamId || "0"),
          game_role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Member request sent for approval!");
        setError("");
        setName("");
        setEmail("");
        setRole(roleOptions[0]);
      } else {
        setError(data.error || "Failed to submit request.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Add member error:", err);
      setError("An unexpected error occurred.");
      setSuccess("");
    }
  };

  useEffect(() => {
    console.log("👥 TeamMembers received props:", members);
    if (!teamId) return;

    // Optional fetch if needed (currently unused)
    fetch(`http://127.0.0.1:5000/teams/getTeam/${teamId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📡 TeamMembers fetched team data:", data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch team", err);
        setLoading(false);
      });
  }, [teamId, members]);

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

      {/* Show list of current members */}
      <List sx={{ mb: 2 }}>
        {members.map((member) => (
          <ListItem key={member.user_id}>
            <ListItemAvatar>
              <Avatar src={member.profile_image || undefined}>
                {member.name?.charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${member.name} (${member.game_role || "No Role"})`}
              secondary={member.email}
            />
          </ListItem>
        ))}
      </List>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Add new member */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <TextField label="Name *" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email Address *" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
      </Box>

      <TextField
        fullWidth
        select
        label="Role"
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
        value={roleOptions.includes(role) ? role : ""}
        onChange={(e) => setRole(e.target.value)}
      >
        {roleOptions.map((roleOption) => (
          <MenuItem key={roleOption} value={roleOption}>
            {roleOption}
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
