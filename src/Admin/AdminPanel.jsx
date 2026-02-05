
import React from "react";
import { Outlet } from "react-router-dom";
import RoleGuard from "../components/RoleGuard";
import Sidebar from "../components/Sidebar";
import DashboardLayout from "../layouts/DashboardLayout";

const AdminPanel = () => {
  return (
    <RoleGuard allowedRole="admin">
      <DashboardLayout SidebarComponent={Sidebar} label="Admin panel">
        {/*  Admin child routes render here */}
        <Outlet />
      </DashboardLayout>
    </RoleGuard>
  );
};

export default AdminPanel;
