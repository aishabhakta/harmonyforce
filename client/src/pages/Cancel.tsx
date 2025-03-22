import React from "react";
import { useNavigate } from "react-router-dom";

const Cancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Payment Canceled</h2>
      <p>Your payment was not completed.</p>
      <button onClick={() => navigate("/")}>Try Again</button>
    </div>
  );
};

export default Cancel;
