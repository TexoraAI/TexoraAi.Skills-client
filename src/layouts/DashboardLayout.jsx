import { Bell, Menu } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const DashboardLayout = ({ SidebarComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className="h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="flex h-full overflow-hidden">

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static z-40
            top-0 left-0 h-full
            w-64 md:w-auto
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
        </aside>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 md:ml-0 min-w-0">

          {/* TOPBAR */}
          <div
            className="
              h-16 flex items-center justify-between
              px-4 md:px-6
              bg-white dark:bg-black
              border-b border-slate-200 dark:border-[#1a1a1a]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 ml-auto">
              {/* NOTIFICATION */}
              <button
                onClick={() => navigate(`${base}/notifications`)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* PROFILE AVATAR */}
              <button
                onClick={() => navigate(`${base}/profile`)}
                className="w-9 h-9 rounded-full
                  bg-gradient-to-br from-blue-600 to-indigo-600
                  hover:opacity-90 transition
                  text-white font-semibold text-sm
                  flex items-center justify-center shadow-md"
              >
                S
              </button>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-black p-4 md:p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;