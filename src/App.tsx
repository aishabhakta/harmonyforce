import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import AboutPage from "./pages/Aboutpage";
import TeamPage from "./pages/Teampage";
import Playerpage from "./pages/Playerpage";
import TeamRegistration from "./pages/TeamRegistration";
import NavigationBar from "./components/Navigation";
import Footer from "./components/Footer";
import { AuthProvider } from "./AuthProvider";
import TeamSearchPage from "./pages/TeamSearchpage";

import UniversitySearchPage from "./pages/UniversitySearchPage";
import UniversityPage from "./pages/Universitypage"; 
import TournamentSearchpage from "./pages/TournamentSearchpage";
import FaqPage from "./pages/faqpage";

const AppContent: React.FC = () => {
  const location = useLocation(); 

  const hideNavigationAndFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <>
    {/* Conditional rendering of the navigation and footer since we don't want the navigation and footer in the login and register page */}
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
        {/* Tournament Search Page */}
        <Route path="/tournaments" element={<TournamentSearchpage />} />
        <Route path="/faqpage" element={<FaqPage />} />
      </Routes>

      {/* ✅ Show Footer only if NOT on login/register pages */}
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
