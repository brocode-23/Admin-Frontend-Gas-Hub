import React, { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [businessRequests, setBusinessRequests] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [managers, setManagers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalOutlets: 0,
    totalManagers: 0,
    totalSales: 0,
    outletSales: [],
  });

  const fetchBusinessRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/business-requests"
      );
      const data = await response.json();
      setBusinessRequests(data);
    } catch (error) {
      console.error("Error fetching business requests:", error);
    }
  };

  const handleBusinessRequest = async (requestId, status) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/business-requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (response.ok) {
        fetchBusinessRequests();
      }
    } catch (error) {
      console.error("Error handling business request:", error);
    }
  };

  const addOutlet = async (outletData) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/outlets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(outletData),
      });
      if (response.ok) {
        const data = await response.json();
        setOutlets([...outlets, data]);
      }
    } catch (error) {
      console.error("Error adding outlet:", error);
    }
  };

  const updateOutletStock = async (outletId, stockData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/outlets/${outletId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockData),
        }
      );
      if (response.ok) {
        const updatedOutlets = outlets.map((outlet) =>
          outlet.id === outletId ? { ...outlet, ...stockData } : outlet
        );
        setOutlets(updatedOutlets);
      }
    } catch (error) {
      console.error("Error updating outlet stock:", error);
    }
  };

  const addManager = async (managerData) => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(managerData),
      });
      if (response.ok) {
        const data = await response.json();
        setManagers([...managers, data]);
      }
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  const updateOutletManager = async (outletId, managerEmail) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/outlets/${outletId}/manager`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ managerEmail }),
        }
      );
      if (response.ok) {
        const updatedOutlets = outlets.map((outlet) =>
          outlet.id === outletId ? { ...outlet, managerEmail } : outlet
        );
        setOutlets(updatedOutlets);
      }
    } catch (error) {
      console.error("Error updating outlet manager:", error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchBusinessRequests();
    // Add other fetch functions for outlets, managers, analytics
  }, []);

  return (
    <AdminContext.Provider
      value={{
        businessRequests,
        outlets,
        managers,
        analytics,
        handleBusinessRequest,
        addOutlet,
        updateOutletStock,
        addManager,
        updateOutletManager,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
