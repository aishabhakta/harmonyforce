import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <Typography variant="h3" color="error">Access Denied</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>You do not have permission to view this page.</Typography>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/")}>Go to Home</Button>
        </Box>
    );
};

export default AccessDenied;
