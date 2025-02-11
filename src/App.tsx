import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Register from "./pages/Register";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />}/>
      </Routes>
    </Router>
  );
};

export default App; //export app to be used in other places like main.tsx

// <div style={{ textAlign: "center", marginTop: "50px" }} ... -> inline styles, can be put in css later
// <CustomButton>: renders the custom button component
// label="Click Me": passes prop named 'label' with the value `"Click Me"` to the `CustomButton` component, determines button's displayed text
// onClick={handleButtonClick}: passes function prop named 'onClick' to 'CustomButton' component, when button is clicked, 'handleButtonClick' function executed
