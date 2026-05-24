// src/SuperAdmin/components/layout/SuperAdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "./SuperAdminNavbar";
import { useUserManagement } from "../../context/UserManagementContext";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

const LayoutInner = () => {
  const { dark } = useTheme();

  const { pendingApprovals, getStats } = useUserManagement();
  const stats = (() => {
    try { return getStats?.() || {}; } catch { return {}; }
  })();

  return (
    <div style={{
      minHeight: "100vh",
      background: dark ? "#090910" : "#f8fafc",
      color: dark ? "#e2e8f0" : "#1e293b",
    }}>
      <SuperAdminNavbar
        pendingCount={pendingApprovals?.length ?? 0}
        activeUsers={stats.activeUsers ?? 0}
      />

      {/*
        Desktop: paddingTop = 52px (Row1) + 44px (Row2) = 96px
        Mobile:  paddingTop = 52px only (Row2 hidden)
      */}
      <main style={{ paddingTop: 96, minHeight: "100vh", boxSizing: "border-box" }}>
        <style>{`
          @media (max-width: 768px) {
            main { padding-top: 52px !important; }
          }
        `}</style>
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const SuperAdminLayout = () => (
  <ThemeProvider>
    <LayoutInner />
  </ThemeProvider>
);

export default SuperAdminLayout;