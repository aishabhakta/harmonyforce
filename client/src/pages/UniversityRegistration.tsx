import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import UniversityForm from "../components/UniversityForm";

const UniversityRegistration: React.FC = () => {
  const { search } = useLocation();
  const universityId = new URLSearchParams(search).get("university_id");

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
        <UniversityForm universityId={universityId} />
      </Box>
    </Box>
  );
};

export default UniversityRegistration;
