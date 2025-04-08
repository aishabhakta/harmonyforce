import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Alert } from "@mui/material";
import { useParams } from "react-router-dom";

interface TeamMembersProps {
  captainId: number;
  currentUserId: number;
  members: any[];
  setMembers: React.Dispatch<React.SetStateAction<any[]>>;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ members, currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const teamId = parseInt(id || "0");
  const [teamData, setTeamData] = useState<any>(null);
  const [, setLoading] = useState(true);
  const captainId = teamData?.captain?.user_id;
  const isCaptainOfTeam = currentUserId === captainId;
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
      const response = await fetch(`http://127.0.0.1:5000/teams/requestAddMember`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          team_id: teamId,
          game_role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Member request sent for approval!");
        setError("");
        setName("");
        setEmail("");
        setRole("participant");
      } else {
        setError(data.error || "Failed to submit request.");
        setSuccess("");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSuccess("");
    }
  };

  useEffect(() => {
    if (!teamId) return;

    fetch(`http://127.0.0.1:5000/teams/getTeam/${teamId}`)
      .then(res => res.json())
      .then(data => {
        setTeamData(data);
        setLoading(false);
      })
      .catch(err => {
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: "1rem", marginBottom: "1rem" }}>
        <TextField label="Name *" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email Address *" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
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
        {["Expedition Leader", "Resource Specialist", "Scientist", "Technician", "Chronicler", "Weapons Specialist", "Physician"].map((roleOption) => (
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
