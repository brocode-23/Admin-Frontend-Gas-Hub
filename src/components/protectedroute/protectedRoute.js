import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authenticationContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "Admin":
        return <Navigate to="/admin-dashboard" />;
      case "Manager":
        return <Navigate to="/manager-dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};
