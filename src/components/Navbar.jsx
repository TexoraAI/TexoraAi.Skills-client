
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Bell, ChevronDown, Moon, Sun } from "lucide-react";
// import auth from "../auth";

// const Navbar = ({ label = "Dashboard" }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const currentRole = auth.getCurrentRole(); // admin / student / trainer / business
//   const showDropdown = currentRole === "admin";

//   const handleRoleChange = (e) => {
//     navigate(`/${e.target.value}`);
//   };

//   const currentPathRole = location.pathname.startsWith("/trainer")
//     ? "trainer"
//     : location.pathname.startsWith("/student")
//     ? "student"
//     : location.pathname.startsWith("/business")
//     ? "business"
//     : "admin";

//   return (
//     <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800
//                        bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
//       <div className="flex items-center justify-between px-6 py-3">
//         {/* LEFT */}
//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 
//                           flex items-center justify-center text-white font-bold">
//             T
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-slate-900 dark:text-white">
//               TexoraAi.skills
//             </p>
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               {label}
//             </p>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-4">
//           {/* Notification */}
//           <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
//             <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
//             <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
//           </button>

//           {/* Role Switch (ADMIN only) */}
//           {showDropdown && (
//             <div className="relative">
//               <select
//                 value={currentPathRole}
//                 onChange={handleRoleChange}
//                 className="appearance-none cursor-pointer rounded-xl border border-slate-300
//                            bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm
//                            text-slate-700 dark:text-slate-200
//                            hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="student">Student</option>
//                 <option value="trainer">Trainer</option>
//                 <option value="admin">Admin</option>
//                 <option value="business">Business Team</option>
//               </select>

//               <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
//                                        h-4 w-4 text-slate-400" />
//             </div>
//           )}

//           {/* Avatar */}
//           <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600
//                           flex items-center justify-center text-white font-semibold">
//             S
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import auth from "../auth";
import logo from "../assets/logo.png";

const Navbar = ({ label = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = auth.getCurrentRole();
  const showDropdown = currentRole === "admin";

  const handleRoleChange = (e) => {
    navigate(`/${e.target.value}`);
  };

  const currentPathRole = location.pathname.startsWith("/trainer")
    ? "trainer"
    : location.pathname.startsWith("/student")
    ? "student"
    : location.pathname.startsWith("/business")
    ? "business"
    : "admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800
                       bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">

        {/* LEFT */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="TexoraAi.skills Logo"
            className="h-9 w-9 rounded-xl object-contain"
          />

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              TexoraAi.skills
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Role Switch (ADMIN only) */}
          {showDropdown && (
            <div className="relative">
              <select
                value={currentPathRole}
                onChange={handleRoleChange}
                className="appearance-none cursor-pointer rounded-xl border border-slate-300
                           bg-white dark:bg-slate-900 px-3 py-2 pr-8 text-sm
                           text-slate-700 dark:text-slate-200
                           hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
                <option value="business">Business Team</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                                       h-4 w-4 text-slate-400" />
            </div>
          )}

          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600
                          flex items-center justify-center text-white font-semibold">
            S
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
