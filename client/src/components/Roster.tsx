import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Popover, Typography, Snackbar, Alert } from "@mui/material";
import { useAuth } from "../AuthProvider";

const USE_DUMMY_DATA = false;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  game_role: string;
  imageUrl: string;
  isCaptain?: boolean;
  paymentStatus?: string;
}

interface RosterProps {
  members: TeamMember[];
  captain?: TeamMember;
  teamId?: number;
  teamSize?: number;
}

const Roster: React.FC<RosterProps> = ({ members, captain, teamId }) => {
  const teamSize = members.length + (captain ? 1 : 0);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Store members in state so we can update their paymentStatus
  const [allMembers, setAllMembers] = useState<TeamMember[]>(() => {
    const combined = captain ? [captain, ...members.filter((m) => m.id !== captain.id)] : members;
    return combined.map((m) => ({ ...m, paymentStatus: "Checking..." }));
  });

  useEffect(() => {
    const fetchStatuses = async () => {
      const updated = await Promise.all(
        allMembers.map(async (member) => {
          try {
            const res = await fetch(`http://localhost:5000/stripe/check-user-paid/${member.id}`);
            const data = await res.json();
            return {
              ...member,
              paymentStatus: res.ok && data.status === "succeeded" ? "Paid" : "Not Paid",
            };
          } catch (err) {
            return {
              ...member,
              paymentStatus: "Not Paid",
            };
          }
        })
      );
      setAllMembers(updated);
    };

    fetchStatuses();
  }, [teamId]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, memberId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedMemberId(memberId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMemberId(null);
  };

  const handleConfirmRemove = async () => {
    if (!selectedMemberId) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/teams/removeMember/${selectedMemberId}`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Member removed successfully!",
          severity: "success",
        });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setSnackbar({
          open: true,
          message: data.error || "Failed to remove member",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    } finally {
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  const canEditTeam = user && ((user.role === "captain" && user.team_id === teamId) ||
    ["tournymod", "aardvarkstaff", "superadmin"].includes(user.role || ""));

  const canRequestJoin = user && user.role === "participant" && !user.team_id;

  const canRemoveMembers = user && ((user.role === "captain" && user.team_id === teamId) ||
    ["tournymod", "aardvarkstaff", "superadmin"].includes(user.role || ""));

  return (
    <>
      <div style={{ width: "100%", padding: "4rem 2rem", backgroundColor: "#f9f9f9" }}>
        {canEditTeam && (
          <div style={{ display: "flex", justifyContent: "start", marginBottom: "1.5rem" }}>
            <Link to={`/team/${teamId}/editTeam`} style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" sx={{ textTransform: "none" }}>
                Edit Team
              </Button>
            </Link>
          </div>
        )}

        {canRequestJoin && (
          <div style={{ display: "flex", justifyContent: "start", marginBottom: "1.5rem" }}>
            <Button
              variant="contained"
              disabled={teamSize >= 7}
              title={teamSize >= 7 ? "This team already has 7 members." : ""}
              onClick={() => {
                fetch("http://127.0.0.1:5000/team_requests/request_join", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user_id: user?.user_id,
                    team_id: teamId,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.message) alert(data.message);
                    else alert(data.error || "Failed to send request.");
                  });
              }}
            >
              Request to Join
            </Button>
          </div>
        )}

        <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#333", marginBottom: "2rem" }}>
          Roster
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
          {allMembers.map((member) => (
            <Link
              key={member.id}
              to={`/player/${member.id}${USE_DUMMY_DATA ? "?dummy=true" : ""}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    backgroundImage: `url(${member.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h4 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>{member.name}</h4>
                  <p style={{ fontSize: "1rem", color: "#666", marginTop: "0.5rem" }}>
                    {member.isCaptain ? "Team Captain" : member.role}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "0.2rem" }}>
                    {member.game_role}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginTop: "0.4rem", color: member.paymentStatus === "Paid" ? "green" : "red" }}>
                    {member.paymentStatus}
                  </p>

                  {canRemoveMembers && !member.isCaptain && (
                    <div style={{ position: "absolute", bottom: "1rem", right: "1rem" }}>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClick(e, member.id);
                        }}
                      >
                        Remove
                      </Button>
                      <Popover
                        open={open && selectedMemberId === member.id}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Typography>Are you sure you want to remove this member?</Typography>
                          <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button size="small" onClick={handleClose}>
                              Cancel
                            </Button>
                            <Button size="small" color="error" onClick={handleConfirmRemove}>
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Roster;
