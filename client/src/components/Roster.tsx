import React from "react";
import { Link } from "react-router-dom";

interface TeamMember {
  id: string; // Unique ID for the player
  name: string;
  role: string;
  imageUrl: string;
}

interface RosterProps {
  members: TeamMember[];
}

const Roster: React.FC<RosterProps> = ({ members }) => {
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
      <h3
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          // textAlign: "center",
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
        {members.map((member) => (
          <Link
            key={member.id}
            to={`/player/${member.id}`} // Dynamic link to the player's profile page
            style={{
              textDecoration: "none", // Remove default link styling
              color: "inherit", // Inherit text color
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                cursor: "pointer",
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
                  }}
                >
                  {member.role}
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
