import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Popover,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

const USE_DUMMY_DATA = false; // change to false when using live backend

interface TeamMember {
  id: string;
  name: string;
  role: string;
  game_role: string;
  imageUrl: string;
  isCaptain?: boolean;
}

interface RosterProps {
  members: TeamMember[];
  captain?: TeamMember;
  teamId?: number;
  teamSize?: number;
}

const Roster: React.FC<RosterProps> = ({ members, captain, teamId }) => {
  const teamSize = members.length + (captain ? 1 : 0);
  const allMembers = captain
    ? [captain, ...members.filter((m) => m.id !== captain.id)]
    : members;
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    memberId: string
  ) => {
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
      const res = await apiFetch(`/teams/removeMember/${selectedMemberId}`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({
          open: true,
          message: "Member removed successfully!",
          severity: "success",
        });

        // Optionally reload or update state here
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

  const canEditTeam =
    user &&
    ["captain", "tournymod", "aardvarkstaff", "superadmin"].includes(
      user.role || ""
    );

  const canRequestJoin = user && user.role === "participant" && !user.team_id;

  const canRemoveMembers =
    user &&
    ["captain", "tournymod", "aardvarkstaff", "superadmin"].includes(
      user.role || ""
    );

  return (
    <>
      <div
        style={{
          width: "100%",
          padding: "4rem 2rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {/* Edit Team Button */}
        {canEditTeam && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              marginBottom: "1.5rem",
            }}
          >
            <Link
              to={`/team/${teamId}/editTeam`}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: "none" }}
              >
                Edit Team
              </Button>
            </Link>
          </div>
        )}

        {/* Request to Join Button */}
        {canRequestJoin && (
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              marginBottom: "1.5rem",
            }}
          >
            <Button
              variant="contained"
              disabled={teamSize >= 7}
              title={teamSize >= 7 ? "This team already has 7 members." : ""}
              onClick={async () => {
                try {
                  const data = await apiFetch("/team_requests/request_join", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      user_id: user?.user_id,
                      team_id: teamId,
                    }),
                  });

                  setSnackbar({
                    open: true,
                    message: data.message || "Join request sent!",
                    severity: "success",
                  });
                } catch (err: any) {
                  setSnackbar({
                    open: true,
                    message:
                      err?.error === "Join request already sent"
                        ? "You have already requested to join this team."
                        : err?.error || "Failed to send join request.",
                    severity: "error",
                  });
                }
              }}
            >
              Request to Join
            </Button>
          </div>
        )}

        <h3
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "2rem",
            textAlign: "left",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "1200px",
          }}
        >
          Roster
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
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
                  transition: "transform 0.2s",
                  cursor: "pointer",
                  position: "relative",
                  border: member.isCaptain ? "" : "none",
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
                  <h4
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {member.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#666",
                      marginTop: "0.5rem",
                      fontWeight: member.isCaptain ? "bold" : "normal",
                    }}
                  >
                    {member.isCaptain ? "Team Captain" : member.role}
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#888",
                      marginTop: "0.2rem",
                    }}
                  >
                    {member.game_role}
                  </p>

                  {/* Remove Button - shown only for non-captains */}
                  {canRemoveMembers && !member.isCaptain && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        right: "1rem",
                        zIndex: 10,
                      }}
                    >
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
                          <Typography>
                            Are you sure you want to remove this member?
                          </Typography>
                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClose();
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleConfirmRemove();
                              }}
                            >
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
