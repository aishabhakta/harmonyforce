import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface PrivateRouteProps {
    allowedRoles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
    const { user } = useAuth();
    const token = localStorage.getItem("session_token");
    const userRole = user?.role || localStorage.getItem("user_role");

    // Redirect to login if no token (not authenticated)
    if (!token) return <Navigate to="/login" replace />;

    // Redirect to access denied if the user role is not allowed
    if (!allowedRoles.includes(userRole || "")) return <Navigate to="/access-denied" replace />;

    return <Outlet />; // Render the page if authenticated and authorized
};
