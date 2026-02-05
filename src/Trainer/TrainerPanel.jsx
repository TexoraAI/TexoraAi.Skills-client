// import React from "react";
// import { Outlet } from "react-router-dom";
// import RoleGuard from "../components/RoleGuard";
// import Sidebar from "../components/Sidebar";
// import DashboardLayout from "../layouts/DashboardLayout";

// const TrainerPanel = () => {
//   return (
//     <RoleGuard allowedRole="trainer">
//       <DashboardLayout SidebarComponent={Sidebar} label="Trainer panel">
//         {/* ✅ Trainer child pages render here */}
//         <Outlet />
//       </DashboardLayout>
//     </RoleGuard>
//   );
// };

// export default TrainerPanel;

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
