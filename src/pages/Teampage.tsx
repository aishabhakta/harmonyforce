import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TeamHeader from "../components/TeamHeader";
import Roster from "../components/Roster";

const TeamPage: React.FC = () => {
  // Get team id from the URL, e.g., /teams/1
  const { id } = useParams<{ id: string }>();
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No team id provided in the URL");
      setLoading(false);
      return;
    }
    
    // Use the team id from the route
    fetch(`http://127.0.0.1:5000/team/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch team data");
        }
        return response.json();
      })
      .then((data) => {
        setTeamData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching team data");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading team information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Destructure team data from the fetched response
  const { team_name, members } = teamData;

  return (
    <Box
      sx={{
        backgroundColor: "white",
        color: "black",
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Team Header */}
      <Box sx={{ width: "100%" }}>
        <TeamHeader
          teamName={team_name || "Team Name"}
          universityName="Rochester Institute of Technology"
          description="Lorem ipsum dolor sit amet consectetur. Tincidunt sodales dui tellus tortor tellus quam donec nibh."
        />
      </Box>

      {/* Roster */}
      <Box sx={{ width: "100%", marginBottom: "2rem" }}>
        <Roster
          members={
            members && members.length > 0
              ? members.map((member: any) => ({
                  id: String(member.id),
                  name: member.name,
                  role: member.role,
                  imageUrl: member.imageUrl || "/path/to/default.jpg",
                }))
              : []
          }
        />
      </Box>

      {/* Register Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <Link to="/TeamRegistration" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" size="large" sx={{ textTransform: "none" }}>
            Register Team
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default TeamPage;
