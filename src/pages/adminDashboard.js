import React from "react";
import { Outlet } from "react-router-dom";
import MenuBar from "../components/admin/menuBar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <MenuBar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
