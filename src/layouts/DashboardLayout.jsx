
import { Bell, Search } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const DashboardLayout = ({ SidebarComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden md:flex md:w-64 border-r
                          bg-white dark:bg-slate-950
                          border-slate-200 dark:border-slate-800">
          {SidebarComponent && <SidebarComponent />}
        </aside>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col">

          {/* TOP BAR */}
          <div className="flex justify-between items-center px-6 py-4
                          bg-white/80 dark:bg-slate-900/80
                          border-b border-slate-200 dark:border-slate-800
                          backdrop-blur-xl">

            {/* SEARCH */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg
                              bg-slate-100 dark:bg-slate-800
                              border border-slate-200 dark:border-slate-700">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-sm
                             placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`${base}/notifications`)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

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
          <main className="flex-1 overflow-y-auto p-6
                           bg-slate-50 dark:bg-slate-950">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
