// import { Bell, Search } from "lucide-react";
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const DashboardLayout = ({
//   children,
//   SidebarComponent,
//   label = "Dashboard",
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // "/student/..." -> "/student"
//   const base = "/" + location.pathname.split("/")[1];

//   // UI state
//   const [query, setQuery] = useState("");

//   // Role-wise placeholder
//   const placeholder =
//     base === "/student"
//       ? "Search in your courses, assessments, documents..."
//       : base === "/trainer"
//       ? "Search batches, students, videos, documents..."
//       : base === "/business"
//       ? "Search leads, enrollments, invoices, campaigns..."
//       : "Search users, courses, payments, logs...";

//   // 🔹 INPUT CHANGE
//   const handleSearchChange = (e) => {
//     setQuery(e.target.value);
//   };

//   // 🔹 ENTER KEY HANDLER (THIS WAS MISSING / MISPLACED)
//   const handleSearchKeyDown = (e) => {
//     if (e.key === "Enter" && query.trim()) {
//       navigate(`${base}/search?q=${encodeURIComponent(query.trim())}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100">
//       <div className="flex h-screen">
//         {/* Sidebar */}
//         <aside className="hidden md:flex md:w-60 flex-col border-r bg-slate-950 border-slate-800">
//           {SidebarComponent && <SidebarComponent />}
//         </aside>

//         {/* Main */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Top bar */}
//           <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
//             {/* Search */}
//             <div className="flex-1 max-w-xl">
//               <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-slate-700 bg-slate-900/90">
//                 <Search size={18} className="text-slate-500" />
//                 <input
//                   type="text"
//                   value={query}
//                   onChange={handleSearchChange}
//                   onKeyDown={handleSearchKeyDown}
//                   placeholder={placeholder}
//                   className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-500"
//                 />
//               </div>
//             </div>

//             {/* Right */}
//             <div className="flex items-center gap-4 ml-4">
//               <button
//                 onClick={() => navigate(`${base}/notifications`)}
//                 className="relative bg-slate-900 border rounded-full p-2 hover:bg-slate-800 border-slate-700 transition-colors"
//               >
//                 <Bell size={18} className="text-slate-100" />
//                 <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3" />
//               </button>

//               <button
//                 onClick={() => navigate(`${base}/profile`)}
//                 className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold shadow-lg hover:scale-105 transition-all"
//               >
//                 S
//               </button>
//             </div>
//           </div>

//           {/* Page content */}
//           <main className="flex-1 overflow-auto p-6">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout; old




// import { Bell, Search } from "lucide-react";
// import React, { useState } from "react";
// import { useLocation, useNavigate, Outlet } from "react-router-dom";

// const DashboardLayout = ({ SidebarComponent }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const base = "/" + location.pathname.split("/")[1];
//   const [query, setQuery] = useState("");

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
//       <div className="flex min-h-screen">
//         {/* SIDEBAR */}
//         <aside className="hidden md:flex md:w-60 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 shadow-sm">
//           {SidebarComponent && <SidebarComponent />}
//         </aside>

//         {/* RIGHT */}
//         <div className="flex-1 flex flex-col">
//           {/* TOP BAR */}
//           <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 shadow-sm">
//             {/* SEARCH */}
//             <div className="flex-1 max-w-xl">
//               <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 dark:bg-slate-900 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-colors">
//                 <Search className="w-4 h-4 text-gray-500 dark:text-slate-400" />
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search..."
//                   className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-500 dark:placeholder:text-slate-500"
//                 />
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => navigate(`${base}/notifications`)}
//                 className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
//               >
//                 <Bell className="w-5 h-5 text-gray-700 dark:text-slate-300" />
//               </button>

//               <button
//                 onClick={() => navigate(`${base}/profile`)}
//                 className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center transition-colors shadow-sm"
//               >
//                 S
//               </button>
//             </div>
//           </div>

//           {/* PAGE CONTENT */}
//           <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-900">
//             <Outlet />
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;






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
