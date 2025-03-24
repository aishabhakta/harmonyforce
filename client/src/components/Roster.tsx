import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

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
  teamId?: number; // Add this if you want dynamic routing for Edit button
}

const Roster: React.FC<RosterProps> = ({ members, captain, teamId }) => {
  const allMembers = captain ? [captain, ...members] : members;

  return (
    <div
      style={{
        width: "100%",
        padding: "4rem 2rem",
        backgroundColor: "#f9f9f9",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      {/* Edit Button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <Link to={`/team/${teamId}/editTeam`} style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary">Edit Team</Button>
        </Link>
      </div>

      <h3
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
          marginBottom: "2rem",
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
            to={`/player/${member.id}`}
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
                border: member.isCaptain ? "2px solid #1976d2" : "none",
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
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Roster;
