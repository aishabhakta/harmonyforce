import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const USE_DUMMY_DATA = false;

interface User {
  user_id: number;
  username: string;
  email: string;
  profile_image: string;
  user_type: string;
  game_role: string;
  university_name?: string;
  team_name?: string;
}

const dummyUsers: User[] = [
  {
    user_id: 1,
    username: "yenry_s",
    email: "yenry@example.com",
    profile_image: "https://example.com/images/yenry.png",
    user_type: "player",
    game_role: "strategist",
  },
  {
    user_id: 2,
    username: "maria_l",
    email: "maria@example.com",
    profile_image: "https://example.com/images/maria.png",
    user_type: "player",
    game_role: "defender",
  },
];

const ITEMS_PER_PAGE = 5;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        if (USE_DUMMY_DATA) {
          setUsers(dummyUsers);
        } else {
          const res = await fetch("http://127.0.0.1:5000/teams/user/participants-and-captains");
          const data = await res.json();
          if (res.ok) {
            setUsers(data.map((u: any) => ({
              user_id: u.user_id,
              username: u.username,
              email: u.email,
              profile_image: u.profile_image,
              user_type: u.role,
              game_role: u.game_role,
              university_name: u.university_name || "Unknown University",
              team_name: u.team_name || "No Team",
            })));
          } else {
            setError(data.error || "Failed to fetch users");
          }
        }
      } catch (err) {
        setError("Error loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto", mt: 3 }}>
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <>
          <List>
            {paginatedUsers.map((user) => (
              <ListItem key={user.user_id} disablePadding>
                <Card
                  sx={{
                    width: "100%",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { boxShadow: 4 },
                    mb: 2,
                  }}
                  onClick={() => navigate(`/player/${user.user_id}`)}
                >
                  <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={2}>
                        <Box
                          component="img"
                          src={user.profile_image || "https://via.placeholder.com/50"}
                          alt={user.username}
                          sx={{ width: 50, height: 50 }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        <ListItemText
                          primary={user.username}
                          secondary={`${user.user_type}• ${user.university_name} • ${user.team_name}`}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
            }}
          >
            {/* Show Create Team button if user is eligible */}
            {/* {user && user.role === "participant" && !user.team_id && ( */}
            {["participant", "tournymod", "aardvarkstaff", "superadmin"].includes(user?.role || "") && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/TeamRegistration")}
                sx={{ textTransform: "none" }}
              >
                Create Team
              </Button>
            )} 

            <Pagination
              count={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, val) => setPage(val)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserList;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   TextField,
//   List,
//   ListItem,
//   ListItemText,
//   Card,
//   CardContent,
//   Grid,
//   Pagination,
//   CircularProgress,
//   Alert,
//   Button,
// } from "@mui/material";
// import { useAuth } from "../AuthProvider"; // Import auth context

// interface Team {
//   team_id: number;
//   team_name: string;
//   university_id: number;
//   profile_image?: string;
// }

// interface TeamListProps {
//   universityId?: number;
// }

// // Toggle this to `true` to use dummy data if using the backend switch true to false 
// const USE_DUMMY_DATA = false;

// const dummyTeams: Team[] = [
//   { team_id: 1, team_name: "Team Alpha", university_id: 101, profile_image: "https://via.placeholder.com/50" },
//   { team_id: 2, team_name: "Team Beta", university_id: 101, profile_image: "https://via.placeholder.com/50" },
//   { team_id: 3, team_name: "Team Gamma", university_id: 102, profile_image: "https://via.placeholder.com/50" },
//   { team_id: 4, team_name: "Team Delta", university_id: 103, profile_image: "https://via.placeholder.com/50" },
//   { team_id: 5, team_name: "Team Epsilon", university_id: 102, profile_image: "https://via.placeholder.com/50" },
//   { team_id: 6, team_name: "Team Zeta", university_id: 101, profile_image: "https://via.placeholder.com/50" },
// ];

// const ITEMS_PER_PAGE = 5;

// const TeamList: React.FC<TeamListProps> = ({ universityId }) => {
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [search, setSearch] = useState<string>("");
//   const [page, setPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const { user } = useAuth(); // Get current user

//   useEffect(() => {
//     const loadTeams = async () => {
//       setLoading(true);
//       setError(null);

//       if (USE_DUMMY_DATA) {
//         setTeams(dummyTeams);
//         setLoading(false);
//         return;
//       }
//       try {
//         const response = await fetch("http://127.0.0.1:5000/teams/getAllTeams");
//         const data = await response.json();
//         if (response.ok) {
//           setTeams(data.teams);
//         } else {
//           setError(data.error || "Failed to fetch teams");
//         }
//       } catch (err) {
//         setError("An error occurred while loading teams.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTeams();
//   }, []);

//   const filteredTeams = teams.filter(
//     (team) =>
//       team.team_name.toLowerCase().includes(search.toLowerCase()) &&
//       (!universityId || team.university_id === universityId)
//   );

//   const paginatedTeams = filteredTeams.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   );

//   return (
//     <Box sx={{ width: "100%", maxWidth: "900px", margin: "auto", mt: 3 }}>
//       <TextField
//         label="Search Teams"
//         variant="outlined"
//         fullWidth
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         sx={{ marginBottom: 2 }}
//       />

//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       {error && <Alert severity="error">{error}</Alert>}

//       {!loading && !error && (
//         <>
//           <List>
//             {paginatedTeams.map((team) => (
//               <ListItem key={team.team_id} disablePadding>
//                 <Card
//                   sx={{
//                     width: "100%",
//                     cursor: "pointer",
//                     transition: "0.3s",
//                     "&:hover": { boxShadow: 4 },
//                   }}
//                   onClick={() => {
//                     const path = `/team/${team.team_id}${USE_DUMMY_DATA ? "?dummy=true" : ""}`;
//                     navigate(path);
//                   }}
                  
//                 >
//                   <CardContent>
//                     <Grid container alignItems="center" spacing={2}>
//                       <Grid item xs={2}>
//                         <Box
//                           component="img"
//                           src={team.profile_image || "https://via.placeholder.com/50"}
//                           alt={team.team_name}
//                           sx={{ width: 50, height: 50 }}
//                         />
//                       </Grid>
//                       <Grid item xs={10}>
//                         <ListItemText primary={team.team_name} />
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </ListItem>
//             ))}
//           </List>

//           {/* Pagination & Conditional Create Button */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mt: 4,
//             }}
//           >
//             {user && user.role === "participant" && !user.team_id && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => navigate("/TeamRegistration")}
//                 sx={{ textTransform: "none" }}
//               >
//                 Create Team
//               </Button>
//             )}

//             <Pagination
//               count={Math.ceil(filteredTeams.length / ITEMS_PER_PAGE)}
//               page={page}
//               onChange={(_, value) => setPage(value)}
//             />
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default TeamList;
