import React, { useState } from "react";
import { Box, Alert } from "@mui/material";
import GeneralTeamInfo from "../components/GeneralTeamInfo";
import TeamMembers from "../components/TeamMembers";


const TeamRegistration: React.FC = () => {

  const [success] = useState("");
  const [error] = useState("");


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
        <GeneralTeamInfo/>

        <TeamMembers captainId={0} currentUserId={0} members={[]} setMembers={function (): void {
          throw new Error("Function not implemented.");
        } }/>

        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ marginTop: "2rem", maxWidth: "800px", width: "100%" }}>
          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
          >
            Register Team
          </Button> */}
          {/* <RegisterButton /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default TeamRegistration;
