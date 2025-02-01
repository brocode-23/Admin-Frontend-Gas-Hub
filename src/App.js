import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/authenticationContext";
import { AdminProvider } from "./context/adminContext";
import { ProtectedRoute } from "./components/protectedroute/protectedRoute";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signUpPage";
import AdminDashboard from "./pages/adminDashboard";
import AdminDashboardOverview from "./pages/admin/adminDashBoardOverview";
import ManagerDashboard from "./pages/managerDashboard";
import BusinessRequests from "./pages/admin/buisnessRequest";
import OutletManagement from "./pages/admin/outletManagment";
import ManagerManagement from "./pages/admin/managerManagment";
import Analytics from "./pages/admin/analytics";
import Settings from "./pages/admin/settings";

import ManagerDashboardOverview from "./pages/manager/managerDashBoardOverview";
import TokenManagement from "./pages/manager/tokenManagment";
import RequestManagement from "./pages/manager/requestManagment";
import PaymentManagement from "./pages/manager/paymentManagment";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/admin-dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardOverview />} />
              <Route path="requests" element={<BusinessRequests />} />
              <Route path="outlets" element={<OutletManagement />} />
              <Route path="managers" element={<ManagerManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route
              path="/manager-dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ManagerDashboardOverview />} />
              <Route path="token" element={<TokenManagement />} />
              <Route path="request" element={<RequestManagement />} />
              <Route path="payment" element={<PaymentManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/" element={<LoginPage />} />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
