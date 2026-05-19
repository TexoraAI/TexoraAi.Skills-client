// src/SuperAdmin/components/layout/SuperAdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import SuperAdminTopbar from "./SuperAdminTopbar";
import { useUserManagement } from "../../context/UserManagementContext";
import { ThemeProvider, useTheme } from "../../context/ThemeContext"; // ← FIXED: ../../ instead of ../

// ── Inner layout (must be inside ThemeProvider to use useTheme) ──
const LayoutInner = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { dark } = useTheme();

  const { pendingApprovals, getStats } = useUserManagement();
  const stats = (() => {
    try { return getStats?.() || {}; } catch { return {}; }
  })();

  return (
    <div className={`min-h-screen ${dark ? "dark bg-[#0a0a0f] text-white" : "bg-gray-50 text-gray-900"}`}>

      <SuperAdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        pendingCount={pendingApprovals?.length ?? 0}
      />

      <SuperAdminTopbar
        collapsed={collapsed}
        activeUsers={stats.activeUsers ?? 0}
        pendingUsers={stats.pendingUsers ?? 0}
      />

      <main
        style={{
          marginLeft: collapsed ? 64 : 240,
          paddingTop: 64,
          transition: "margin-left 0.3s",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// ── Exported layout — wraps everything in ThemeProvider ──
const SuperAdminLayout = () => (
  <ThemeProvider>
    <LayoutInner />
  </ThemeProvider>
);

export default SuperAdminLayout;