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
import {PrivateRoute} from "./PrivateRoute";
import ErrorPage from "./pages/ErrorPage";

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  // // Only show admin dashboard if user is admin, hide everything else
  // if (user?.role === "superadmin") {
  //   return (
  //     <Routes>
  //       <Route path="/admin" element={<AdminDashboard />} />
  //       <Route path="*" element={<Navigate to="/admin" />} /> 
  //     </Routes>
  //   );
  // }

  // Hide navigation and footer for login/register pages
  const hideNavigationAndFooter = ["/login", "/register", "/access-denied", "/404"].includes(location.pathname);

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
          <Route path="/team/:id/registration" element={<TeamRegistration />} />
          <Route path="/team/:id/editTeam" element={<TeamRegistration />} />
          <Route path="/player/:playerId" element={<Playerpage />} />
          <Route path="/team" element={<TeamSearchPage />} />
          <Route path="/universities" element={<UniversitySearchPage />} />
          <Route path="/university/:universityName" element={<UniversityPage />} />
          <Route path="/tournaments" element={<TournamentSearchpage />} />

          {/* Protected Admin Route */}
          <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Dynamic Error Pages */}
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/access-denied" element={<ErrorPage />} />
          <Route path="/unauthorized" element={<ErrorPage />} />
          <Route path="/forbidden" element={<ErrorPage />} />
          <Route path="/bad-request" element={<ErrorPage />} />
          <Route path="/internal-server-error" element={<ErrorPage />} />
          <Route path="/service-unavailable" element={<ErrorPage />} />
          <Route path="/gateway-timeout" element={<ErrorPage />} />

          {/* Redirect all unknown routes to 404 */}
          <Route path="*" element={<Navigate to="/404" />} />
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
