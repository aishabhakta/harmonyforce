import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("session_token");
    
            if (!token) {
                console.error("No token found in localStorage. User might already be logged out.");
                navigate("/login"); // Force navigation if token doesn't exist
                return;
            }
    
            console.log("Found token:", token);  // Debugging: Ensure token exists before fetch
    
            await fetch("http://127.0.0.1:5000/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            // Clear session storage
            localStorage.removeItem("session_token");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_role");
    
            console.log("Logout successful! Redirecting to login...");
    
            // Ensure React updates before navigation
            setTimeout(() => {
                navigate("/login");
            }, 100);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };
    

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>
            <div style={{ marginTop: "20px" }}>
                <button style={{ marginRight: "10px" }}>Manage Users</button>
                <button style={{ marginRight: "10px" }}>Manage Posts</button>
                <button style={{ marginRight: "10px" }}>Settings</button>
                <button onClick={handleLogout} style={{ background: "red", color: "white", padding: "10px", border: "none", cursor: "pointer" }}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
