import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface MatchResultsEditorProps {
  open: boolean;
  onClose: () => void;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  date: string;
  onChange: (field: string, value: any) => void;
  onSave: () => void;
}

const MatchResultsEditor: React.FC<MatchResultsEditorProps> = ({
  open,
  onClose,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  date,
  onChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Match Results</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Team 1 Name"
          value={team1Name}
          onChange={(e) => onChange("team1Name", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Team 1 Score"
          type="number"
          value={team1Score}
          onChange={(e) => onChange("team1Score", parseInt(e.target.value))}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Team 2 Name"
          value={team2Name}
          onChange={(e) => onChange("team2Name", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Team 2 Score"
          type="number"
          value={team2Score}
          onChange={(e) => onChange("team2Score", parseInt(e.target.value))}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Date of Match"
          type="date"
          value={date}
          onChange={(e) => onChange("date", e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onSave}
          >
            Save Results
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MatchResultsEditor;
