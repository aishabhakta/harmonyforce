import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 800 }, // Extra Bold
    h2: { fontWeight: 700 }, // Bold
    h3: { fontWeight: 600 }, // Semi-Bold
    h4: { fontWeight: 500 }, // Medium
    body1: { fontWeight: 400 }, // Regular
    body2: { fontWeight: 300 }, // Light
  },
});

export default theme;
