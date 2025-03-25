import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import UserValidation from "../components/UserValidation";
import StaffValidation from "../components/StaffValidation";
import TeamPageValidation from "../components/TeamPageValidation";
import Blacklist from "../components/Blacklist";
import Reports from "../components/Reports";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState("User Validation");

    const renderComponent = () => {
        switch (selectedPage) {
          case "User Validation":
            return <UserValidation />;
          case "Staff Validation":
            return <StaffValidation />;
          case "Team Page Validation":
            return <TeamPageValidation />;
          case "Blacklist":
            return <Blacklist />;
          case "Reports":
            return <Reports />;
          default:
            return <UserValidation />;
        }
      };
    
      return (
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
    
            <div className="flex space-x-4">
              {/* Dropdown for Page Selection */}
              <FormControl className="bg-white border border-gray-300 rounded-md w-72">
                <InputLabel>Select Page</InputLabel>
                <Select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  <MenuItem value="User Validation">University Member Validation</MenuItem>
                  <MenuItem value="Staff Validation">Staff Validation</MenuItem>
                  <MenuItem value="Team Page Validation">Team Page Update Validation</MenuItem>
                  <MenuItem value="Blacklist">Blacklist</MenuItem>
                  <MenuItem value="Reports">Reports</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
    
          {/* Render the selected component dynamically */}
          <div className="bg-white rounded-lg shadow p-4">{renderComponent()}</div>
        </div>
      );
    };
    
    export default AdminDashboard;
