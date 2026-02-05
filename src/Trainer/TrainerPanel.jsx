

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardLayout from "../layouts/DashboardLayout";

const TrainerPanel = () => {
  return (
    <DashboardLayout SidebarComponent={Sidebar} label="Trainer panel">
      <Outlet />
    </DashboardLayout>
  );
};

export default TrainerPanel;




