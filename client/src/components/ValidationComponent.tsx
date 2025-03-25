// components/ValidationComponent.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";

interface ValidationComponentProps {
  userRole: string;
}

const moderatorSections = [
  "Moderator Accounts",
  "Moderator Accounts Validation",
  "Current Moderator Accounts",
];

const universitySections = [
  "User Accounts",
  "Team Member Requests",
  "Team Page Validation",
];

const dummyUsers = [
  {
    name: "John Doe",
    role: "Marketing Moderator",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Jane Doe",
    role: "Tournament Moderator",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Markus Drop",
    role: "Marketing Moderator",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Emmett Tru",
    role: "Tournament Moderator",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Sal Moru",
    role: "Tournament Moderator",
    image: "https://randomuser.me/api/portraits/men/95.jpg",
  },
];

const ValidationComponent: React.FC<ValidationComponentProps> = ({ userRole }) => {
  const isModerator = ["Aardvark Support Staff", "Super Admins"].includes(userRole);
  const isUniversity = userRole === "University Tournament Moderator";

  const availableSections = isModerator ? moderatorSections : isUniversity ? universitySections : [];
  const [section, setSection] = useState(availableSections[0] || "");

  const renderUserCards = (actionButtons: React.ReactNode) => (
    <Box>
      {dummyUsers.map((user, index) => (
        <Card key={index} sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
          <Avatar src={user.image} sx={{ width: 56, height: 56, mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography>{user.name}</Typography>
            <Typography color="text.secondary">{user.role}</Typography>
          </Box>
          {actionButtons}
        </Card>
      ))}
    </Box>
  );

  const renderSectionData = () => {
    switch (section) {
      case "Moderator Accounts":
        return renderUserCards(
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              ACCEPT
            </Button>
            <Button variant="contained" color="error">
              DENY
            </Button>
          </Box>
        );
      case "Moderator Accounts Validation":
        return (
          <Box>
            <Button variant="contained" color="primary" sx={{ mb: 2 }}>
              CREATE MODERATOR
            </Button>
            {renderUserCards(
              <Box>
                <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                  ACCEPT
                </Button>
                <Button variant="contained" color="error">
                  DENY
                </Button>
              </Box>
            )}
          </Box>
        );
      case "Current Moderator Accounts":
        return renderUserCards(
          <Button variant="outlined" color="primary">
            EDIT
          </Button>
        );
      case "User Accounts":
        return renderUserCards(
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              ACCEPT
            </Button>
            <Button variant="contained" color="error">
              DENY
            </Button>
          </Box>
        );
      case "Team Member Requests":
        return renderUserCards(
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              ACCEPT
            </Button>
            <Button variant="contained" color="error">
              DENY
            </Button>
          </Box>
        );
      case "Team Page Validation":
        return renderUserCards(
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 1 }}>
              ACCEPT
            </Button>
            <Button variant="contained" color="error" sx={{ mr: 1 }}>
              DENY
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "black", color: "white" }}>
              BLACKLIST
            </Button>
          </Box>
        );
      default:
        return <Typography>No access</Typography>;
    }
  };

  if (!isModerator && !isUniversity) {
    return <Typography>You do not have access to this page.</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Staff Validation
      </Typography>
      <Select value={section} onChange={(e) => setSection(e.target.value)} sx={{ mb: 3, width: 300 }}>
        {availableSections.map((sec) => (
          <MenuItem key={sec} value={sec}>
            {sec}
          </MenuItem>
        ))}
      </Select>
      <Box mt={2}>{renderSectionData()}</Box>
    </Box>
  );
};

export default ValidationComponent;

