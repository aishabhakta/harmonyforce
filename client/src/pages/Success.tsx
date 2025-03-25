import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Success: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000); // ⏱ 4 seconds

    return () => clearTimeout(timer); // 🧹 Cleanup in case the component unmounts
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4"> Payment Successful!</h1>
        <p className="text-gray-700 mb-4">Redirecting to home in 4 seconds...</p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back Now
        </button>
      </div>
    </div>
  );
};

export default Success;
