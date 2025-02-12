import React from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "../components/manager/menuBar";

const ManagerDashboard = () => {
  return (
    <div className="flex">
      <MenuBar />
      <div className="flex-1 min-h-screen bg-gray-100" id="main-content">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;