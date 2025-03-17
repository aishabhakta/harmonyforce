import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import AboutPage from "./pages/Aboutpage";
import TeamPage from "./pages/Teampage";
import Playerpage from "./pages/Playerpage";
import TeamRegistration from "./pages/TeamRegistration";
import NavigationBar from "./components/Navigation";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./AuthProvider";
import TeamSearchPage from "./pages/TeamSearchpage";
import UniversitySearchPage from "./pages/UniversitySearchPage";
import UniversityPage from "./pages/Universitypage"; 
import TournamentSearchpage from "./pages/TournamentSearchpage";
import AdminDashboard from "./pages/AdminDashboard";
import TournamentModerator from "./pages/TournamentModerator";
import AccessDenied from "./pages/AccessDenied";
import { PrivateRoute } from "./PrivateRoute";

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Only show admin dashboard if user is admin, hide everything else
  if (user?.role === "superadmin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" />} /> 
      </Routes>
    );
  }

  // Hide navigation and footer for login/register pages
  const hideNavigationAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavigationAndFooter && <NavigationBar
        links={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
          { name: "Tournaments", href: "/tournaments" },
          { name: "Teams", href: "/team" },
          { name: "Universities", href: "/universities" },
        ]}
      />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/TeamRegistration" element={<TeamRegistration />} />
        <Route path="/player/:playerId" element={<Playerpage />} />
        <Route path="/team" element={<TeamSearchPage />} />
        <Route path="/universities" element={<UniversitySearchPage />} />
        <Route path="/university/:universityName" element={<UniversityPage />} />
        <Route path="/tournaments" element={<TournamentSearchpage />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["tournymod"]} />}>
          <Route path="/tournament/moderator" element={<TournamentModerator />} />
        </Route>
      </Routes>

      {!hideNavigationAndFooter && <Footer />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
