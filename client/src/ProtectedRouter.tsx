import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";  // Correct Import

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const userRole = user?.role || localStorage.getItem("user_role");

  return allowedRoles.includes(userRole || "") ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
