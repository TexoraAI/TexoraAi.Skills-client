
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Sidebar from "../components/Sidebar";
import RoleGuard from "../components/RoleGuard";


const StudentPanel = () => {
  return (
    <RoleGuard allowedRole="student">
      <DashboardLayout SidebarComponent={Sidebar} label="Student panel">
        {/* ✅ Child routes will render here */}
        <Outlet />
         
      </DashboardLayout>
    </RoleGuard>
  );
};

export default StudentPanel;
