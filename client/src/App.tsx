import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  // Navigate,
} from "react-router-dom";
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
// import CheckoutForm from "./pages/CheckoutForm";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import FaqPage from "./pages/faqpage";
import AdminDashboard from "./pages/AdminDashboard";
// import TournamentModerator from "./pages/TournamentModerator";
import { PrivateRoute } from "./PrivateRoute";
import ErrorPage from "./pages/ErrorPage";
import ValidationPage from "./pages/ValidationPage";
import UniversityRegistration from "./pages/UniversityRegistration";
import TournamentRegistration from "./pages/TournamentRegistration";
import EditProfilePage from "./pages/EditProfilePage";
import PaymentPage from "./pages/PaymentPage";
import TournamentBracket from "./pages/TournamentBracket/TournamentBracket";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ViewerSignUpPage from "./pages/ViewerSignUpPage";
import Reportpage from "./pages/Reportpage";
import { useAuth } from "./AuthProvider";
import CheckoutPage from "./pages/CheckoutPage";

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
  const hideNavigationAndFooter = [
    // "/login",
    // "/register",
    "/access-denied",
    "/404",
    // "/viewregister"
  ].includes(location.pathname);

  // const stripePromise = loadStripe(
  //   "pk_test_51QtzIzRs2kvuUjpRcFD95L5g9qisHKIwua7Scho2hwOfTZDVODAMxEZGDFOsu0gdPbKoN0pZhSgW0QqAZc6CqLe8003zbdmLbK"
  // );
  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Users", href: "/team" },
    { name: "Universities", href: "/universities" },
  ];

  const links = [
    ...baseLinks,
    ...(["superadmin", "aardvarkstaff"].includes(user?.role || "")
      ? [
          { name: "Report", href: "/Report" },
          { name: "Create User", href: "/viewregister" },
        ]
      : []),
  ];

  // return <NavigationBar links={links} />;

  return (
    <>
      {!hideNavigationAndFooter && <NavigationBar links={links} />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team/:id" element={<TeamPage />} />
        <Route path="/team/:id/registration" element={<TeamRegistration />} />
        <Route path="/TeamRegistration" element={<TeamRegistration />} />
        <Route path="/team/:id/editTeam" element={<TeamRegistration />} />
        <Route path="/player/:playerId" element={<Playerpage />} />
        <Route path="/team" element={<TeamSearchPage />} />
        <Route path="/universities" element={<UniversitySearchPage />} />
        <Route path="/university/:universityId" element={<UniversityPage />} />
        <Route path="/tournaments" element={<TournamentSearchpage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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

        <Route path="/faqpage" element={<FaqPage />} />
        <Route path="/validation" element={<ValidationPage />} />

        <Route
          path="/UniversityRegistration"
          element={<UniversityRegistration />}
        />
        <Route
          path="/TournamentRegistration"
          element={<TournamentRegistration />}
        />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/checkout" element={<PaymentPage />} />
        <Route path="/tournaments/bracket" element={<TournamentBracket />} />

        {/* <Route
            path="/checkoutform"
            element={
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            }
          /> */}
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <PrivateRoute allowedRoles={["superadmin", "aardvarkstaff"]} />
          }
        >
          <Route path="/report" element={<Reportpage />} />
        </Route>
        <Route path="/checkoutform" element={<CheckoutPage />} />
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
