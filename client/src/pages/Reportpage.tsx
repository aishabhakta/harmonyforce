import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
} from "@mui/material";
import { useAuth } from "../AuthProvider";
import { apiFetch } from "../api";

interface UniversityReportRow {
  university_id: number;
  university_name: string;
  country: string;
  created_at: string;
  status: number;
  team_count: number;
  total_members: number;
  unimod_exists: boolean;
}

interface TournamentReportRow {
  start_date: string;
  university_name: string;
  university_country: string;
  matches_on_next_day: number;
  matches_played: number;
  is_complete: boolean;
}

const Reports = () => {
  const { user } = useAuth();
  const isStaff = user?.role === "aardvarkstaff" || user?.role === "superadmin";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [collegeStats, setCollegeStats] = useState<UniversityReportRow[]>([]);
  const [tournamentStats, setTournamentStats] = useState<TournamentReportRow[]>(
    []
  );

  const [, setCollegeTotals] = useState({
    colleges: 0,
    teams: 0,
    members: 0,
  });

  const [, setTournamentTotals] = useState({
    colleges: 0,
    matchesPlanned: 0,
    matchesCompleted: 0,
  });

  const fetchReports = async () => {
    try {
      const params: Record<string, string> = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const queryString = new URLSearchParams(params).toString();
      const query = queryString ? `?${queryString}` : "";

      const [collegeRes, totalCollegeRes, tournamentRes, totalTournamentRes] =
        await Promise.all([
          apiFetch(`/university/report/full_statistics${query}`),
          apiFetch(`/university/report/total_counts${query}`),
          apiFetch(`/tournament/report/full_statistics${query}`),
          apiFetch(`/tournament/report/total_tournament_statistics${query}`),
        ]);

      setCollegeStats(collegeRes);
      setCollegeTotals({
        colleges: totalCollegeRes.total_universities,
        teams: totalCollegeRes.total_teams,
        members: totalCollegeRes.total_team_members,
      });

      setTournamentStats(tournamentRes);
      setTournamentTotals({
        colleges: totalTournamentRes.active_universities,
        matchesPlanned: totalTournamentRes.matches_yet_to_play,
        matchesCompleted: totalTournamentRes.matches_completed,
      });
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    if (isStaff) {
      fetchReports();
    }
  }, []);

  if (!isStaff) {
    return (
      <Typography variant="h6">
        You do not have permission to view this page.
      </Typography>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Analytics and Reports
      </Typography>

      {/* Date Range Filter */}
      <Box mb={3} display="flex" gap={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={fetchReports}>
          Generate
        </Button>
      </Box>

      {/* College Stats */}
      <Typography variant="h6" gutterBottom>
        College and Team Signup Status
      </Typography>
      <Paper sx={{ mb: 4, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date Added</TableCell>
              <TableCell>College Name</TableCell>
              <TableCell>College Country</TableCell>
              <TableCell># of Teams</TableCell>
              <TableCell># of Team Members</TableCell>
              <TableCell>Moderator?</TableCell>
              <TableCell>College Page?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collegeStats.map((uni, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(uni.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{uni.university_name}</TableCell>
                <TableCell>{uni.country}</TableCell>
                <TableCell>{uni.team_count}</TableCell>
                <TableCell>{uni.total_members}</TableCell>
                <TableCell>{uni.unimod_exists ? "O" : "X"}</TableCell>
                <TableCell>{uni.status === 1 ? "O" : "X"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Tournament Stats */}
      <Typography variant="h6" gutterBottom>
        Tournament Status
      </Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date of Next Play</TableCell>
              <TableCell>College Name</TableCell>
              <TableCell>College Country</TableCell>
              <TableCell># of Matches Next Round</TableCell>
              <TableCell>Total Matches Played</TableCell>
              <TableCell>Eliminations Complete?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tournamentStats.map((t, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(t.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{t.university_name || "N/A"}</TableCell>
                <TableCell>{t.university_country || "N/A"}</TableCell>
                <TableCell>{t.matches_on_next_day}</TableCell>
                <TableCell>{t.matches_played}</TableCell>
                <TableCell>{t.is_complete ? "X" : "O"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Reports;
