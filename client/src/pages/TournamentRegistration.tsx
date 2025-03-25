import React from "react";
import { Box } from "@mui/material";
import TournamentForm from "../components/TournamentForm";

const TournamentRegistration: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "black",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <TournamentForm />
      </Box>
    </Box>
  );
};

export default TournamentRegistration;
