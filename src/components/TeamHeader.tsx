import React from "react";

interface TeamHeaderProps {
  teamName: string;
  universityName: string;
  description: string;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({
  teamName,
  universityName,
  description,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#f4f4f4",
        padding: "4rem 2rem",
        position: "relative",
      }}
    >
      {/* decorative background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "url('/path/to/decorative-background.png') no-repeat center",
          backgroundSize: "cover",
          zIndex: -1,
        }}
      />
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#6a1b9a" }}>
        {teamName}
      </h1>
      <h2 style={{ fontSize: "1.5rem", color: "#444", marginTop: "1rem" }}>
        {universityName}
      </h2>
      <p style={{ marginTop: "1rem", color: "#666", maxWidth: "800px", margin: "0 auto" }}>
        {description}
      </p>
    </div>
  );
};

export default TeamHeader;
