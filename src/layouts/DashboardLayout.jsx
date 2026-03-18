import { Bell, Search, Menu } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const DashboardLayout = ({ SidebarComponent }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];

  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

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
          fixed md:relative z-40
          top-0 left-0
          h-full w-64
          bg-white dark:bg-slate-950
          border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          `}
        >
          {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
        </aside>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 md:ml-0">

          {/* TOPBAR */}
          <div
            className="h-16 flex items-center justify-between
            px-4 md:px-6
            bg-white/80 dark:bg-slate-900/80
            border-b border-slate-200 dark:border-slate-800
            backdrop-blur-xl"
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 w-full max-w-xl">

              {/* MENU BUTTON (mobile only) */}
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              {/* SEARCH */}
              <div
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg
                bg-slate-100 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                w-full"
              >
                <Search className="w-4 h-4 text-slate-500" />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 ml-4">

              {/* NOTIFICATION */}
              <button
                onClick={() => navigate(`${base}/notifications`)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              {/* PROFILE */}
              <button
                onClick={() => navigate(`${base}/profile`)}
                className="w-9 h-9 rounded-full
                bg-indigo-600 hover:bg-indigo-700
                text-white font-semibold
                flex items-center justify-center shadow-md"
              >
                S
              </button>

            </div>
          </div>

          {/* PAGE CONTENT */}
          <main
            className="flex-1 overflow-y-auto
            p-4 md:p-6
            bg-slate-50 dark:bg-slate-950"
          >
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;






