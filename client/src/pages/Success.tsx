import React from "react";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>✅ Payment Successful!</h1>
      <button onClick={() => navigate("/")}>Go Back to Home</button>
    </div>
  );
};

export default Success;
