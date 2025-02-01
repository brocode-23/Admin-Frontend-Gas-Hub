import React, { useState, useEffect } from "react";

const ManagerDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalTokens: 0,
    pendingTokens: 0,
    outletStock: 0,
    totalPayments: "0",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dashboard/outlet-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            setStats(responseData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching outlet stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tokens</p>
              <p className="text-2xl font-bold">{stats.totalTokens}</p>
            </div>
            <span className="text-2xl text-purple-500">🎫</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Tokens
              </p>
              <p className="text-2xl font-bold">{stats.pendingTokens}</p>
            </div>
            <span className="text-2xl text-blue-500">⏳</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Outlet Stock</p>
              <p className="text-2xl font-bold">{stats.outletStock}</p>
            </div>
            <span className="text-2xl text-green-500">📦</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Payment</p>
              <p className="text-2xl font-bold">${stats.totalPayments}</p>
            </div>
            <span className="text-2xl text-red-500">💰</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardOverview;
