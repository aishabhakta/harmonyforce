import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage"; // Import the Homepage component
import AboutPage from "./pages/Aboutpage"; // Import the AboutPage component
import TeamPage from "./pages/Teampage"; // Import the TeamPage component
import Playerpage from "./pages/Playerpage";
import TeamRegistration from "./pages/TeamRegistration";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route for Homepage */}
        <Route path="/" element={<Homepage />} />

        {/* Route for Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Route for Register */}
        <Route path="/register" element={<Register />}/>
        
        {/* Route for AboutPage */}
        <Route path="/about" element={<AboutPage />} />

        {/* Route for TeamPage */}
        <Route path="/teams" element={<TeamPage />} />

        {/* Route for TeamRegistration */}
        <Route path="/TeamRegistration" element={<TeamRegistration />} />

        <Route path="/player/:playerId" element={<Playerpage />} /> {/* Dynamic route */}
      </Routes>
    </Router>
  );
};

export default App; //export app to be used in other places like main.tsx





// import React from "react";
// import CustomButton from "./components/CustomButton";
// import BasicTextFields from "./components/BasicTextFields";
// import BasicCard from "./components/BasicCard";
// import "./styles/App.css"; // import CSS file

// const App: React.FC = () => {
//   //declaring react functional component + {} -> define body of component
//   const handleButtonClick = () => {
//     // declare function using 'const', function is triggered when the button is clicked
//     alert("Button clicked!"); // displays browser alert dialog with the text `"Button clicked!"
//   };

//   return (
//     // return block contains JSX - defines UI structure of App component
//     <div className="container">
//       <h1>Welcome to My App</h1>
//       <BasicTextFields />
//       {/* <BasicCard /> */}
//       <CustomButton label="Click Me" onClick={handleButtonClick} />
//     </div>
//   );
// };

// export default App; //export app to be used in other places like main.tsx

// // <div style={{ textAlign: "center", marginTop: "50px" }} ... -> inline styles, can be put in css later
// // <CustomButton>: renders the custom button component
// // label="Click Me": passes prop named 'label' with the value `"Click Me"` to the `CustomButton` component, determines button's displayed text
// // onClick={handleButtonClick}: passes function prop named 'onClick' to 'CustomButton' component, when button is clicked, 'handleButtonClick' function executed
