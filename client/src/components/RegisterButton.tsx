import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegisterButton: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <Button
      fullWidth
      variant="contained"
      color="success"
      size="large"
      sx={{
        textTransform: "none",
      }}
      onClick={() => navigate("/checkoutform")} 
    >
      Register Team
    </Button>
  );
};

export default RegisterButton;
