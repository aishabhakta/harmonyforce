import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

const EditProfilePage: React.FC = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.user_id) return;
      try {
        const data = await apiFetch(`/teams/getPlayer/${user.user_id}`);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setUsername(data.name || ""); // 'name' is actually the username in the playerPage response
        setBio(data.about || "");
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.user_id) {
      alert("You must be logged in to update your profile.");
      return;
    }

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        username: username,
        password: password || undefined,
      };

      await apiFetch(`/auth/update-profile/${user.user_id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Profile updated!");
    } catch (error: any) {
      console.error("Update failed:", error);
      alert("Something went wrong updating your profile.");
    }
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
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
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
