import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOutlets: 0,
    totalManagers: 0,
    pendingRequests: 0,
  });
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            setStats({
              totalCustomers: responseData.data.totalCustomers || 0,
              totalOutlets: responseData.data.totalOutlets || 0,
              totalManagers: responseData.data.totalManagers || 0,
              pendingRequests: responseData.data.pendingRequests || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/dashboard/sales/monthly",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.data) {
            setSalesData(responseData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchStats();
    fetchSalesData();
  }, []);

  const recentActivities = [
    {
      id: 1,
      type: "New Registration",
      outlet: "Shell Station Ampang",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "Business Request",
      outlet: "Petron Damansara",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "Sales Update",
      outlet: "Petronas KLCC",
      time: "5 hours ago",
    },
    {
      id: 4,
      type: "New Manager",
      outlet: "BHP Station Bangsar",
      time: "1 day ago",
    },
  ];

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
              <p className="text-sm font-medium text-gray-500">Total Outlets</p>
              <p className="text-2xl font-bold">{stats.totalOutlets}</p>
            </div>
            <span className="text-2xl text-purple-500">🏪</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Managers
              </p>
              <p className="text-2xl font-bold">{stats.totalManagers}</p>
            </div>
            <span className="text-2xl text-blue-500">👥</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
            <span className="text-2xl text-green-500">🚗</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Pending Requests
              </p>
              <p className="text-2xl font-bold">{stats.pendingRequests}</p>
            </div>
            <span className="text-2xl text-red-500">⏳</span>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col space-y-1 border-b border-gray-200 pb-3 last:border-0"
                >
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.outlet}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
