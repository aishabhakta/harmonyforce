import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";

const EditProfilePage: React.FC = () => {
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Smith");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("johnsmith");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send updated info to your backend here
    console.log({
      firstName,
      lastName,
      bio,
      username,
      password,
      profilePic,
    });
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        padding: "2rem",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Edit Profile
      </Typography>

      <Card sx={{ padding: "2rem" }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Avatar
                src={profilePic ? URL.createObjectURL(profilePic) : ""}
                sx={{ width: 100, height: 100 }}
              />
            </Box>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Profile Picture
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>

            <TextField
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button variant="contained" type="submit" fullWidth>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfilePage;
