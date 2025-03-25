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


const moderatorSections = [
  "Moderator Accounts",
  "Moderator Accounts Validation",
  "Current Moderator Accounts",
];

const universitySections = [
  "User Accounts",
  "Team Member Requests",
  "Team Page Validation",
];

const ValidationComponent: React.FC<ValidationComponentProps> = ({ userRole }) => {
  const isModerator = ["Aardvark Support Staff", "Super Admins"].includes(userRole);
  const isUniversity = userRole === "University Tournament Moderator";

  const availableSections = isModerator
    ? moderatorSections
    : isUniversity
    ? universitySections
    : [];

  const [section, setSection] = useState(availableSections[0] || "");
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingMembers, setPendingMembers] = useState<PendingTeamMember[]>([]);


  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/pending-registrations");
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

  const handleApprove = async (pending_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/auth/approve-registration/${pending_id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingUsers((prev) => prev.filter((user) => user.id !== pending_id));
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };  
  
  const handleReject = async (pending_id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/auth/reject-registration/${pending_id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingUsers((prev) => prev.filter((user) => user.id !== pending_id));
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Rejection failed.");
    }
  };

  const fetchPendingMembers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/teams/pendingMembers");
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
      const response = await fetch(`http://127.0.0.1:5000/teams/approve-member/${memberId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingMembers((prev) => prev.filter((member) => member.id !== memberId));
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Approval failed.");
    }
  };
  
  const handleRejectMember = async (memberId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/teams/reject-member/${memberId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setPendingMembers((prev) => prev.filter((member) => member.id !== memberId));
        alert(data.message);
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
                <Card key={user.id} sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{user.username}</Typography>
                    <Typography color="text.secondary">{user.email} — {user.role}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleApprove(user.id)}
                    sx={{ mr: 1 }}
                  >
                    ACCEPT
                  </Button>
                  <Button variant="contained"
                    color="error"
                    onClick={() => handleReject(user.id)}
                    sx={{ mr: 1 }}>
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
                  <Card key={member.id} sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
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
      <Select value={section} onChange={(e) => setSection(e.target.value)} sx={{ mb: 3, width: 300 }}>
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
