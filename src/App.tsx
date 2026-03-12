/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import AdminLayout from "./components/layouts/AdminLayout";
import ClientLayout from "./components/layouts/ClientLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCatalog from "./pages/admin/Catalog";
import AdminChannels from "./pages/admin/Channels";
import ProtocolList from "./pages/admin/ProtocolList";
import ProtocolDetail from "./pages/admin/ProtocolDetail";
import ClientList from "./pages/admin/ClientList";
import GlobalQueue from "./pages/admin/GlobalQueue";
import ClientProfile from "./pages/admin/ClientProfile";
import Insights from "./pages/admin/Insights";
import AdminReports from "./pages/admin/Reports";
import AdminTeam from "./pages/admin/Team";
import AdminSettings from "./pages/admin/Settings";
import Login from "./pages/shared/Login";
import ResetPassword from "./pages/shared/ResetPassword";
import ClientDashboard from "./pages/client/Dashboard";
import CreateProtocol from "./pages/client/CreateProtocol";
import ClientProtocolDetail from "./pages/client/ProtocolDetail";
import Reports from "./pages/client/Reports";
import Support from "./pages/client/Support";
import UserProfile from "./pages/shared/Profile";

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Unified Login Route */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user?.type === 'admin' ? <AdminLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route index element={<AdminDashboard user={user} />} />
            <Route path="queue" element={<GlobalQueue />} />
            <Route path="clients" element={<ClientList />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="protocols" element={<ProtocolList />} />
            <Route path="protocols/:id" element={<ProtocolDetail />} />
            <Route path="insights" element={<Insights />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<UserProfile user={user} onUpdateUser={handleUpdateUser} />} />
          </Route>

          {/* Client Routes */}
          <Route path="/" element={
            !user ? <Navigate to="/login" /> :
            user.type === 'admin' ? <Navigate to="/admin" /> :
            <ClientLayout user={user} onLogout={handleLogout} />
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="support" element={<Support />} />
            <Route path="new-protocol" element={<CreateProtocol />} />
            <Route path="protocols/:id" element={<ClientProtocolDetail />} />
            <Route path="profile" element={<UserProfile user={user} onUpdateUser={handleUpdateUser} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
