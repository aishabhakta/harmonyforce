import { Button, Typography, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import backimg from "../assets/images/Photo - mountains from air.jpg";

const errorMessages: Record<string, { code: number; message: string }> = {
    "/404": { code: 404, message: "Page Not Found" },
    "/access-denied": { code: 403, message: "Access Denied" },
    "/unauthorized": { code: 401, message: "Unauthorized" },
    "/forbidden": { code: 403, message: "Forbidden" },
    "/bad-request": { code: 400, message: "Bad Request" },
    "/internal-server-error": { code: 500, message: "Internal Server Error" },
    "/service-unavailable": { code: 503, message: "Service Unavailable" },
    "/gateway-timeout": { code: 504, message: "Gateway Timeout" },
};

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get error details based on path or default to 500 Internal Server Error
    const error = errorMessages[location.pathname] || { code: 500, message: "Something went wrong" };

    return (
        <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
            {/* Left Side: Error Message */}
            <Box sx={{ width: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem" }}>
                <Typography variant="h2" fontWeight="bold" sx={{ color: "#333" }}>
                    {error.code}
                </Typography>
                <Typography variant="h4" sx={{ color: "#666", mt: 1, textAlign: "center" }}>
                    {error.message}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/")}>
                    Return to Homepage
                </Button>
            </Box>

            {/* Right Side: Background Image */}
            <Box
                sx={{
                    width: "50%",
                    backgroundImage: `${backimg}`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        </Box>
    );
};

export default ErrorPage;
