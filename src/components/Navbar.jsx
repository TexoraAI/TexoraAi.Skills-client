
// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Bell, ChevronDown } from "lucide-react";
// import auth from "../auth";
// import logo from "../assets/logo.png";

// const Navbar = ({ label = "Dashboard" }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const currentRole = auth.getCurrentRole();
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
//         <div
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <img
//             src={logo}
//             alt="TexoraAi.skills Logo"
//             className="h-9 w-9 rounded-xl object-contain"
//           />

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

// export default Navbar; old1















/**
 * Navbar.jsx  (Updated)
 *
 * ✅ useAvatarContext se profileImage read karta hai
 * ✅ Image upload hone par instantly update ho jaata hai — no reload
 * ✅ Fallback: image nahi hai toh initials dikhaata hai (gradient circle)
 * ✅ Existing UI/design/colors — kuch nahi badla
 */

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import auth from "../auth";
import logo from "../assets/logo.png";

// ✅ Shared AvatarContext se import
import { useAvatarContext } from "../context/AvatarContext";

const Navbar = ({ label = "Dashboard" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Global avatar state — ProfilePage mein upload karo, yahan instantly update
  const { profileImage } = useAvatarContext();

  // User initials for fallback
  const userName = localStorage.getItem("userName") || "S";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const currentRole  = auth.getCurrentRole();
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
    <header
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800
                 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-6 py-3">

        {/* LEFT — Logo */}
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
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Notification Bell */}
          <button className="relative rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Role Switch — ADMIN only */}
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
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2
                           h-4 w-4 text-slate-400"
              />
            </div>
          )}

          {/* ✅ Avatar — image hai toh photo, nahi toh initials */}
          <div
            className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center
                       bg-gradient-to-br from-indigo-600 to-purple-600
                       text-white font-semibold text-sm shrink-0
                       ring-2 ring-indigo-300/40 dark:ring-indigo-500/30"
            title={userName}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;