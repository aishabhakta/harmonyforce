import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const roles = [
  {
    title: "Expedition Leader",
    description: "This team member will make decisions on when and how action cards are played. They facilitate the team’s joint strategic planning and manage the expedition budget.",
  },
  {
    title: "Resource Specialist",
    description: "Manages and allocates the team’s resources efficiently, ensuring survival and success.",
  },
  {
    title: "Scientist",
    description: "Conducts research, analyzes the environment, and discovers new opportunities for the team.",
  },
  {
    title: "Technician",
    description: "Responsible for operating and maintaining technical equipment and machinery.",
  },
  {
    title: "Chronicler",
    description: "Records the journey, ensuring that history and findings are preserved.",
  },
  {
    title: "Weapons Specialist",
    description: "Ensures the team’s safety by handling combat and defensive strategies.",
  },
  {
    title: "Physician",
    description: "Provides medical support, treating injuries and keeping the team healthy.",
  },
];

const RolesAccordion: React.FC = () => {
  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 6 }}>
      <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}>
        A New World Roles
      </Typography>
      {roles.map((role, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: "bold" }}>{role.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{role.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default RolesAccordion;
