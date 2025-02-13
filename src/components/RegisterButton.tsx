import React from "react";
import { Button } from "@mui/material";

const RegisterButton: React.FC = () => {
  return (
    <Button
      fullWidth
      variant="contained"
      color="success"
      size="large"
      sx={{
        textTransform: "none",
      }}
    >
      Register Team
    </Button>
  );
};

export default RegisterButton;
