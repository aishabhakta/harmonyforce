import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  Card,
  Avatar,
} from "@mui/material";
import { apiFetch } from "../api";
interface ValidationComponentProps {
  userRole: string;
}

interface PendingUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface PendingTeamMember {
  id: number;
  email: string;
  team_id: number;
  game_role: string;
  user_id: number;
  status: string;
}

interface PendingTeam {
  id: number;
  team_name: string;
  captain_name: string;
  captain_email: string;
  university_id: number;
  university_name: string;
  profile_image: string;
}

interface TeamRequest {
  request_id: number;
  user_id: number;
  team_id: number;
  status: string;
  created_at: string;
  user_email?: string; // optionally populate this from backend
  team_name?: string;
  first_name?: string;
  last_name?: string;
}

const moderatorSections = [
  "Moderator Accounts",
  "Moderator Accounts Validation",
  "Current Moderator Accounts",
];

const universitySections = [
  "User Accounts",
  "Team Member Requests",
  "Team Registration Requests",
  "Member Requests to Join Team",
];

const ValidationComponent: React.FC<ValidationComponentProps> = ({
  userRole,
}) => {
  const isModerator = ["Aardvark Support Staff", "Super Admins"].includes(
    userRole
  );
  const isUniversity = userRole === "University Tournament Moderator";

  const availableSections = isModerator
    ? moderatorSections
    : isUniversity
    ? universitySections
    : [];

  const [section, setSection] = useState(availableSections[0] || "");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingMembers, setPendingMembers] = useState<PendingTeamMember[]>([]);
  const [pendingTeams, setPendingTeams] = useState<PendingTeam[]>([]);
  const [joinRequests, setJoinRequests] = useState<TeamRequest[]>([]);
  const [, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPendingUsers = async () => {
    try {
      const response = await apiFetch("/auth/pending-registrations");

      const data = await response.json();
      if (response.ok) {
        setPendingUsers(data);
      } else {
        console.error("Error fetching pending users:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchPendingTeams = async () => {
    try {
      const response = await apiFetch("/teams/pendingTeams");
      const data = await response.json();
      if (response.ok) {
        setPendingTeams(data);
      } else {
        console.error("Error fetching pending users:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleApprove = async (pending_id: number) => {
    try {
      const response = await apiFetch(
        `/auth/approve-registration/${pending_id}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPendingUsers((prev) =>
          prev.filter((user) => user.id !== pending_id)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const handleReject = async (pending_id: number) => {
    try {
      const response = await apiFetch(
        `/auth/reject-registration/${pending_id}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPendingUsers((prev) =>
          prev.filter((user) => user.id !== pending_id)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const response = await apiFetch("/teams/pendingMembers");
      const data = await response.json();
      if (response.ok) {
        setPendingMembers(data);
      } else {
        console.error("Error fetching pending members:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleApproveMember = async (memberId: number) => {
    try {
      const response = await apiFetch(`/teams/approve-member/${memberId}`, {
        method: "POST",
      });

      const data = await response.json();
      if (response.ok) {
        setPendingMembers((prev) =>
          prev.filter((member) => member.id !== memberId)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const handleRejectMember = async (memberId: number) => {
    try {
      const response = await apiFetch(`/teams/reject-member/${memberId}`, {
        method: "POST",
      });

      const data = await response.json();
      if (response.ok) {
        setPendingMembers((prev) =>
          prev.filter((member) => member.id !== memberId)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  const handleApproveTeam = async (id: number) => {
    try {
      const response = await apiFetch(`/teams/approve-team/${id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingTeams((prev) => prev.filter((team) => team.id !== id));
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const handleRejectTeam = async (id: number) => {
    try {
      const response = await apiFetch(`/teams/reject-team/${id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingTeams((prev) => prev.filter((team) => team.id !== id));
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const response = await apiFetch("/team_requests/pending-join-requests");
      const data = await response.json();
      if (response.ok) {
        setJoinRequests(data);
      } else {
        console.error("Error fetching join requests:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleApproveJoinRequest = async (requestId: number) => {
    try {
      const response = await apiFetch("/team_requests/approve_request", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId }),
      });

      const data = await response.json();
      if (response.ok) {
        setJoinRequests((prev) =>
          prev.filter((req) => req.request_id !== requestId)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };

  const handleRejectJoinRequest = async (requestId: number) => {
    try {
      const response = await apiFetch("/team_requests/deny_request", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId }),
      });

      const data = await response.json();
      if (response.ok) {
        setJoinRequests((prev) =>
          prev.filter((req) => req.request_id !== requestId)
        );
        setSnackbar({ open: true, message: data.message, severity: "success" });
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  useEffect(() => {
    if (section === "User Accounts") {
      fetchPendingUsers();
    } else if (section === "Team Member Requests") {
      fetchPendingMembers();
    } else if (section === "Team Registration Requests") {
      fetchPendingTeams();
    } else if (section === "Member Requests to Join Team") {
      fetchJoinRequests();
    }
  }, [section]);

  const renderSectionData = () => {
    switch (section) {
      case "User Accounts":
        return (
          <Box>
            {pendingUsers.length === 0 ? (
              <Typography>No pending registrations.</Typography>
            ) : (
              pendingUsers.map((user) => (
                <Card
                  key={user.id}
                  sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
                >
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{user.username}</Typography>
                    <Typography color="text.secondary">
                      {user.email} — {user.role}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(user.id)}
                    sx={{ mr: 1 }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(user.id)}
                    sx={{ mr: 1 }}
                  >
                    DENY
                  </Button>
                </Card>
              ))
            )}
          </Box>
        );
      case "Team Member Requests":
        return (
          <Box>
            {pendingMembers.length === 0 ? (
              <Typography>No pending member requests.</Typography>
            ) : (
              pendingMembers.map((member) => (
                <Card
                  key={member.id}
                  sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
                >
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{member.email}</Typography>
                    <Typography color="text.secondary">
                      Team ID: {member.team_id} — Role: {member.game_role}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApproveMember(member.id)}
                    sx={{ mr: 1 }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectMember(member.id)}
                  >
                    DENY
                  </Button>
                </Card>
              ))
            )}
          </Box>
        );
      case "Team Registration Requests":
        return (
          <Box>
            {pendingTeams.length === 0 ? (
              <Typography>No pending team registrations.</Typography>
            ) : (
              pendingTeams.map((team) => (
                <Card
                  key={team.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      Team Name: {team.team_name}
                    </Typography>
                    <Typography variant="body2">
                      {/* Captain: {team.captain_name} ({team.captain_email})<br /> */}
                      University: {team.university_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      onClick={() => handleApproveTeam(team.id)}
                      sx={{ mr: 1 }}
                      variant="contained"
                    >
                      ACCEPT
                    </Button>
                    <Button
                      onClick={() => handleRejectTeam(team.id)}
                      variant="contained"
                      color="error"
                    >
                      DENY
                    </Button>
                  </Box>
                </Card>
              ))
            )}
          </Box>
        );
      case "Member Requests to Join Team":
        return (
          <Box>
            {joinRequests.length === 0 ? (
              <Typography>No pending member join requests.</Typography>
            ) : (
              joinRequests.map((req) => (
                <Card
                  key={req.request_id}
                  sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>
                      {req.first_name} {req.last_name} wants to join{" "}
                      {req.team_name}
                    </Typography>
                    <Typography color="text.secondary">
                      Requested At: {new Date(req.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApproveJoinRequest(req.request_id)}
                    sx={{ mr: 1 }}
                  >
                    ACCEPT
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectJoinRequest(req.request_id)}
                  >
                    DENY
                  </Button>
                </Card>
              ))
            )}
          </Box>
        );

      default:
        return <Typography>No access</Typography>;
    }
  };

  if (!isModerator && !isUniversity) {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Staff Validation
      </Typography>
      <Select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        sx={{ mb: 3, width: 300 }}
      >
        {availableSections.map((sec) => (
          <MenuItem key={sec} value={sec}>
            {sec}
          </MenuItem>
        ))}
      </Select>
      <Box mt={2}>{renderSectionData()}</Box>
    </Box>
  );
};

export default ValidationComponent;
