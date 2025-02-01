import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Store, UserCheck, DollarSign } from "lucide-react";
import { useAdmin } from "../../context/adminContext";

const Analytics = () => {
  const { analytics } = useAdmin();
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOutlets: 0,
    totalManagers: 0,
    totalSales: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    // Function to fetch sales data
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/payment/total/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setSalesData(
            data.map((item) => ({
              outletName: item.outletName || "Unknown",
              amount: parseInt(item.totalPayment) || 0,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setSalesData([]);
      }
    };

    // Function to fetch dashboard stats
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

        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }

        const responseData = await response.json();
        console.log("API Response:", responseData);

        if (responseData.success && responseData.data) {
          const statsData = responseData.data;
          setStats({
            totalCustomers: statsData.totalCustomers || 0,
            totalOutlets: statsData.totalOutlets || 0,
            totalManagers: statsData.totalManagers || 0,
            totalSales: statsData.totalSales || 0,
            pendingRequests: statsData.pendingRequests || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep the default values in case of error
      }
    };

    fetchSalesData();
    fetchStats();
  }, []);

  // Format number with commas and handle undefined/null values
  const formatNumber = (num) => {
    return (num || 0).toLocaleString();
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(stats.totalCustomers)}
              </p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Total Outlets
              </p>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(stats.totalOutlets)}
              </p>
            </div>
            <Store className="text-green-500" size={24} />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Total Managers
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {formatNumber(stats.totalManagers)}
              </p>
            </div>
            <UserCheck className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-orange-900">
                ${formatNumber(stats.totalSales)}
              </p>
            </div>
            <DollarSign className="text-orange-500" size={24} />
          </div>
        </div>
      </div>

      {/* Pending Requests Card */}
      <div className="mb-6">
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatNumber(stats.pendingRequests)}
              </p>
            </div>
            <TrendingUp className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Outlet Sales Performance</h2>
        <div className="w-full h-96 bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="outletName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
