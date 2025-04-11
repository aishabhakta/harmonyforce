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
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

interface ValidationComponentProps {
  userRole: string;
}

interface PendingUser {
  id: number;
  username: string;
  email: string;
  role: string;
  university_id: number;
}

interface PendingTeamMember {
  id: number;
  email: string;
  team_id: number;
  game_role: string;
  user_id: number;
  status: string;
  team_name: string;
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

const ValidationComponent: React.FC<ValidationComponentProps> = () => {
  const { user } = useAuth();

  const roleBasedSections: { [key: string]: string[] } = {
    superadmin: ["User Accounts"],
    aardvarkstaff: ["User Accounts"],
    tournymod: ["User Accounts", "Team Registration Requests"],
    participant: ["Team Member Requests"],
    captain: ["Member Requests to Join Team"],
  };

  const availableSections = user?.role
    ? roleBasedSections[user.role] || []
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
      const data = await apiFetch("/auth/pending-registrations");
      setPendingUsers(data);
    } catch (err: any) {
      console.error("Error fetching pending users:", err.message);
    }
  };

  const fetchPendingTeams = async () => {
    try {
      const data = await apiFetch("/teams/pendingTeams");
      setPendingTeams(data);
    } catch (err: any) {
      console.error("Error fetching pending teams:", err.message);
    }
  };

  const handleApprove = async (pending_id: number) => {
    try {
      const data = await apiFetch(`/auth/approve-registration/${pending_id}`, {
        method: "POST",
      });
      setPendingUsers((prev) => prev.filter((user) => user.id !== pending_id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  const handleReject = async (pending_id: number) => {
    try {
      const data = await apiFetch(`/auth/reject-registration/${pending_id}`, {
        method: "POST",
      });
      setPendingUsers((prev) => prev.filter((user) => user.id !== pending_id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Rejection failed.");
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const data = await apiFetch("/teams/pendingMembers");
      setPendingMembers(data);
    } catch (err: any) {
      console.error("Error fetching pending members:", err.message);
    }
  };

  const handleApproveMember = async (id: number) => {
    try {
      const data = await apiFetch(`/teams/approve-member/${id}`, {
        method: "POST",
      });
      setPendingMembers((prev) => prev.filter((m) => m.id !== id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  const handleRejectMember = async (id: number) => {
    try {
      const data = await apiFetch(`/teams/reject-member/${id}`, {
        method: "POST",
      });
      setPendingMembers((prev) => prev.filter((m) => m.id !== id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Rejection failed.");
    }
  };

  const handleApproveTeam = async (id: number) => {
    try {
      const data = await apiFetch(`/teams/approve-team/${id}`, {
        method: "POST",
      });
      setPendingTeams((prev) => prev.filter((team) => team.id !== id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  const handleRejectTeam = async (id: number) => {
    try {
      const data = await apiFetch(`/teams/reject-team/${id}`, {
        method: "POST",
      });
      setPendingTeams((prev) => prev.filter((team) => team.id !== id));
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Rejection failed.");
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const data = await apiFetch("/team_requests/pending-join-requests");
      setJoinRequests(data);
    } catch (err: any) {
      console.error("Error fetching join requests:", err.message);
    }
  };

  const handleApproveJoinRequest = async (requestId: number) => {
    try {
      const data = await apiFetch("/team_requests/approve_request", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId }),
      });
      setJoinRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  const handleRejectJoinRequest = async (requestId: number) => {
    try {
      const data = await apiFetch("/team_requests/deny_request", {
        method: "POST",
        body: JSON.stringify({ request_id: requestId }),
      });
      setJoinRequests((prev) =>
        prev.filter((req) => req.request_id !== requestId)
      );
      setSnackbar({ open: true, message: data.message, severity: "success" });
    } catch (err: any) {
      alert(err.message || "Rejection failed.");
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
      // tournymod, superadmin, aardvarkstaff
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
      // participant
      case "Team Member Requests":
        return (
          <Box>
            {pendingMembers.filter((member) => member.user_id === user?.user_id)
              .length === 0 ? (
              <Typography>No pending member requests.</Typography>
            ) : (
              pendingMembers
                .filter((member) => member.user_id === user?.user_id)
                .map((member) => (
                  <Card
                    key={member.id}
                    sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography>{member.email}</Typography>
                      <Typography color="text.secondary">
                        Team Name: {member.team_name}
                      </Typography>
                      <Typography color="text.secondary">
                        Role: {member.game_role}
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

      // tournymod
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
      // captain
      case "Member Requests to Join Team":
        return (
          <Box>
            {joinRequests.filter((req) => req.team_id === user?.team_id)
              .length === 0 ? (
              <Typography>
                No pending member join requests for your team.
              </Typography>
            ) : (
              joinRequests
                .filter((req) => req.team_id === user?.team_id)
                .map((req) => (
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
                        Requested At:{" "}
                        {new Date(req.created_at).toLocaleString()}
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
