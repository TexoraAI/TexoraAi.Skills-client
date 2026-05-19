
// // src/SuperAdmin/components/layout/SuperAdminSidebar.jsx
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Mail, FileSearch, ChevronDown } from "lucide-react";
// import { PERMISSIONS } from "@/SuperAdmin/constants/permissions";
// import { useTheme } from "../../context/ThemeContext";

// // ============================================================
// // ICONS (SVG path strings)
// // ============================================================
// const icons = {
//   dashboard:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
//   students:    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
//   trainers:    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
//   admins:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
//   permissions: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
//   analytics:   "M18 20V10 M12 20V4 M6 20v-6",
//   approvals:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
//   security:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
//   settings:    "M12 20a8 8 0 100-16 8 8 0 000 16z M12 14a2 2 0 100-4 2 2 0 000 4z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
//   logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
//   sun:         "M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
//   moon:        "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
//   folder:      "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
//   chart:       "M12 20V10 M18 20V4 M6 20v-4",
// };

// // ============================================================
// // NAV STRUCTURE — flat items + dropdown groups
// // ============================================================
// const navStructure = [
//   {
//     type: "item",
//     label: "Dashboard",
//     path: "/superadmin",
//     icon: icons.dashboard,
//     permission: null,
//     end: true,
//   },

//   // ── ACCESS MANAGEMENT dropdown ──
//   {
//     type: "group",
//     label: "Access Management",
//     icon: icons.folder,
//     defaultOpen: true,
  
//     children: [
//       // ───────────────── ORGANIZATIONS ─────────────────
//       {
//         label: "Organizations",
//         path: "/superadmin/organizations",
//         icon: icons.folder,
//         permission: PERMISSIONS.VIEW_ORGANIZATIONS,
//         description: "Manage SaaS organizations",
//       },
  
//       // ───────────────── ORGANIZATION ADMINS ─────────────────
//       {
//         label: "Organization Admins",
//         path: "/superadmin/admins",
//         icon: icons.admins,
//         permission: PERMISSIONS.VIEW_ADMINS,
//         description: "Manage organization admins & roles",
//       },
  
//       // ───────────────── TRAINERS ─────────────────
//       {
//         label: "Trainers",
//         path: "/superadmin/trainers",
//         icon: icons.trainers,
//         permission: PERMISSIONS.VIEW_TRAINERS,
//         description: "Manage organization trainers",
//       },
  
//       // ───────────────── STUDENTS ─────────────────
//       {
//         label: "Students",
//         path: "/superadmin/students",
//         icon: icons.students,
//         permission: PERMISSIONS.VIEW_STUDENTS,
//         description: "Manage enrolled students",
//       },
  
//       // ───────────────── APPROVALS ─────────────────
//       {
//         label: "Pending Approvals",
//         path: "/superadmin/pending-approvals",
//         icon: icons.approvals,
//         permission: PERMISSIONS.APPROVE_TRAINER,
//         badge: true,
//         description: "Requests awaiting admin approval",
//       },
  
//       // ───────────────── PERMISSIONS ─────────────────
//       {
//         label: "Permissions",
//         path: "/superadmin/permissions",
//         icon: icons.permissions,
//         permission: PERMISSIONS.MANAGE_PERMISSIONS,
//         description: "Manage SaaS RBAC permissions",
//       },
//     ],
//   },
//   // ── ANALYTICS FLOW dropdown ──
//   {
//     type: "group",
//     label: "Analytics Flow",
//     icon: icons.chart,
//     defaultOpen: false,
//     children: [
//       {
//         label: "Analytics",
//         path: "/superadmin/analytics",
//         icon: icons.analytics,
//         permission: PERMISSIONS.VIEW_ANALYTICS,
//         description: "View key metrics and insights",
//       },
//       {
//         label: "Security",
//         path: "/superadmin/security-settings",
//         icon: icons.security,
//         permission: PERMISSIONS.MANAGE_SECURITY,
//         description: "Manage security policies and access controls",
//       },
//       {
//         label: "Send Email",
//         path: "/superadmin/settings/send-email",
//         iconComponent: Mail,
//         permission: PERMISSIONS.VIEW_SETTINGS,
//         description: "Send notifications and important emails",
//       },
//       {
//         label: "Audit Logs",
//         path: "/superadmin/settings/audit-logs",
//         iconComponent: FileSearch,
//         permission: PERMISSIONS.VIEW_SETTINGS,
//         description: "Track activities and maintain audit logs",
//       },
//       {
//         type: "item",
//         label: "Settings",
//         path: "/superadmin/global-settings",
//         icon: icons.settings,
//         permission: PERMISSIONS.VIEW_SETTINGS,
//       },
//     ],
//   },
// ];

// // ============================================================
// // HELPERS
// // ============================================================
// const Icon = ({ d, size = 18 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={1.75}
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="shrink-0"
//   >
//     <path d={d} />
//   </svg>
// );

// // ============================================================
// // NAV ITEM COMPONENT
// // ============================================================
// const NavItem = ({ item, collapsed, navActive, navIdle, indicator, pendingCount }) => {
//   const IconEl = item.iconComponent ? item.iconComponent : null;

//   return (
//     <NavLink
//       to={item.path}
//       end={item.end ?? false}
//       title={collapsed ? item.label : undefined}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
//           isActive ? navActive : navIdle
//         }`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           {isActive && (
//             <span
//               className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full ${indicator}`}
//             />
//           )}
//           {IconEl ? (
//             <IconEl size={18} className="shrink-0" />
//           ) : (
//             <Icon d={item.icon} />
//           )}
//           {!collapsed && (
//             <span className="whitespace-nowrap truncate">{item.label}</span>
//           )}
//           {!collapsed && item.badge && pendingCount > 0 && (
//             <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
//               {pendingCount}
//             </span>
//           )}
//           {collapsed && item.badge && pendingCount > 0 && (
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
//           )}
//         </>
//       )}
//     </NavLink>
//   );
// };

// // ============================================================
// // DROPDOWN GROUP COMPONENT
// // ============================================================
// const NavGroup = ({
//   group,
//   collapsed,
//   dark,
//   navActive,
//   navIdle,
//   indicator,
//   pendingCount,
//   hasPermission,
// }) => {
//   const [open, setOpen] = useState(group.defaultOpen ?? false);

//   const filteredChildren = group.children.filter(
//     (c) => !c.permission || hasPermission(c.permission)
//   );

//   const groupHeader = dark
//     ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
//     : "text-slate-500 hover:text-slate-800 hover:bg-gray-100";

//   const groupLabelCls = dark ? "text-slate-500" : "text-slate-400";

//   if (collapsed) {
//     return (
//       <>
//         {filteredChildren.map((item) => (
//           <NavItem
//             key={item.path}
//             item={item}
//             collapsed={collapsed}
//             navActive={navActive}
//             navIdle={navIdle}
//             indicator={indicator}
//             pendingCount={pendingCount}
//           />
//         ))}
//       </>
//     );
//   }

//   return (
//     <div className="mt-1">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${groupHeader}`}
//       >
//         <Icon d={group.icon} size={15} />
//         <span className={`flex-1 text-left truncate ${groupLabelCls}`}>
//           {group.label}
//         </span>
//         <span
//           className="ml-auto transition-transform duration-200"
//           style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
//         >
//           <ChevronDown size={13} />
//         </span>
//       </button>

//       <div
//         className="overflow-hidden transition-all duration-300 ease-in-out"
//         style={{ maxHeight: open ? `${filteredChildren.length * 52}px` : "0px" }}
//       >
//         <div className="pl-2 mt-0.5 space-y-0.5 border-l-2 ml-4 border-violet-500/20">
//           {filteredChildren.map((item) => (
//             <NavItem
//               key={item.path}
//               item={item}
//               collapsed={false}
//               navActive={navActive}
//               navIdle={navIdle}
//               indicator={indicator}
//               pendingCount={pendingCount}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // SIDEBAR
// // ============================================================
// const SuperAdminSidebar = ({ collapsed, onToggle, pendingCount = 0 }) => {
//   const { dark, toggleTheme } = useTheme();

//   const user = { name: "Super Admin" };
//   const logout = () => { window.location.href = "/"; };
//   const hasPermission = () => true;

//   // ── Theme-aware classes ──
//   const aside       = dark ? "bg-[#0d0d14] border-white/5"                          : "bg-white border-gray-200";
//   const hdr         = dark ? "border-white/5"                                        : "border-gray-200";
//   const navActive   = dark ? "bg-violet-500/15 text-violet-400"                     : "bg-violet-50 text-violet-600";
//   const navIdle     = dark ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100";
//   const indicator   = dark ? "bg-violet-400"                                         : "bg-violet-500";
//   const divider     = dark ? "border-white/5"                                        : "border-gray-200";
//   const userCard    = dark ? "bg-white/[0.03] border-white/5"                       : "bg-gray-50 border-gray-200";
//   const userName    = dark ? "text-white"                                            : "text-gray-800";
//   const subLabel    = dark ? "text-slate-500"                                        : "text-slate-400";
//   const collapseBtn = dark ? "text-slate-500 hover:text-white"                       : "text-slate-400 hover:text-slate-700";
//   const toggleCls   = dark ? "text-slate-400 hover:text-yellow-300 hover:bg-white/5": "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50";

//   // Logout button inside card
//   const logoutInCard = dark
//     ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10"
//     : "text-slate-400 hover:text-red-500 hover:bg-red-50";

//   // Collapsed logout button (standalone icon)
//   const logoutCollapsed = dark
//     ? "text-slate-400 hover:text-red-400 hover:bg-red-400/5"
//     : "text-slate-500 hover:text-red-500 hover:bg-red-50";

//   return (
//     <aside
//       className={`fixed left-0 top-0 h-full z-50 flex flex-col border-r transition-all duration-300 ease-in-out ${aside} ${
//         collapsed ? "w-16" : "w-64"
//       }`}
//     >
//       {/* ── Logo ── */}
//       <div
//         className={`flex items-center h-16 border-b shrink-0 ${hdr} ${
//           collapsed ? "px-3 justify-center" : "px-4"
//         }`}
//       >
//         {collapsed ? (
//           <button
//             onClick={onToggle}
//             className="flex items-center justify-center w-full h-full"
//             title="Expand sidebar"
//           >
//             <span className="font-extrabold text-base leading-none select-none">
//               <span className="text-green-500">I</span>
//               <span className="text-[#F97316]">O</span>
//             </span>
//           </button>
//         ) : (
//           <div className="flex items-center justify-between w-full gap-2">
//             <div className="flex flex-col leading-tight overflow-hidden">
//               <h3
//                 className="font-extrabold leading-none select-none m-0 p-0"
//                 style={{ fontSize: 22, letterSpacing: "-0.02em" }}
//               >
//                 <span className="text-green-500">ILM</span>
//                 <span> </span>
//                 <span className="text-[#F97316]">ORA</span>
//               </h3>
//               <span
//                 className={`text-[9px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap mt-0.5 ${subLabel}`}
//               >
//                 SuperAdmin Panel
//               </span>
//             </div>
//             <button
//               onClick={onToggle}
//               className={`ml-auto transition-colors p-1 rounded shrink-0 ${collapseBtn}`}
//               title="Collapse sidebar"
//             >
//               <svg
//                 width={15}
//                 height={15}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={2}
//               >
//                 <path d="M15 18l-6-6 6-6" />
//               </svg>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── Nav ── */}
//       <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-none">
//         {navStructure.map((entry, idx) => {
//           if (entry.type === "item") {
//             if (entry.permission && !hasPermission(entry.permission)) return null;
//             return (
//               <NavItem
//                 key={entry.path}
//                 item={entry}
//                 collapsed={collapsed}
//                 navActive={navActive}
//                 navIdle={navIdle}
//                 indicator={indicator}
//                 pendingCount={pendingCount}
//               />
//             );
//           }

//           if (entry.type === "group") {
//             return (
//               <NavGroup
//                 key={idx}
//                 group={entry}
//                 collapsed={collapsed}
//                 dark={dark}
//                 navActive={navActive}
//                 navIdle={navIdle}
//                 indicator={indicator}
//                 pendingCount={pendingCount}
//                 hasPermission={hasPermission}
//               />
//             );
//           }

//           return null;
//         })}
//       </nav>

//       {/* ── Bottom ── */}
//       <div className={`border-t px-2 py-3 space-y-0.5 ${divider}`}>

//         {/* Theme Toggle */}
//         <button
//           onClick={toggleTheme}
//           title={collapsed ? (dark ? "Light Mode" : "Dark Mode") : undefined}
//           className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${toggleCls}`}
//         >
//           <Icon d={dark ? icons.sun : icons.moon} />
//           {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
//         </button>

//         {/* ── User Card (with inline Logout) ── */}
//         {collapsed ? (
//           // Collapsed: show just the avatar + logout icon below it
//           <>
//             <div
//               className="flex items-center justify-center py-1"
//               title={user.name}
//             >
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
//                 {user.name?.[0] || "S"}
//               </div>
//             </div>
//             <button
//               onClick={logout}
//               title="Logout"
//               className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${logoutCollapsed}`}
//             >
//               <Icon d={icons.logout} />
//             </button>
//           </>
//         ) : (
//           // Expanded: user info + logout button inside the card
//           <div className={`mt-1 px-3 py-2.5 rounded-lg border ${userCard}`}>
//             <div className="flex items-center gap-2">
//               {/* Avatar */}
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
//                 {user.name?.[0] || "S"}
//               </div>

//               {/* Name + Role */}
//               <div className="flex-1 overflow-hidden">
//                 <p className={`text-xs font-semibold truncate ${userName}`}>
//                   {user.name}
//                 </p>
//                 <p className="text-violet-500 text-[10px] font-semibold uppercase tracking-wider">
//                   Super Admin
//                 </p>
//               </div>

//               {/* Logout button — inline right side */}
//               <button
//                 onClick={logout}
//                 title="Logout"
//                 className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${logoutInCard}`}
//               >
//                 {/* Arrow-right-from-bracket style icon */}
//                 <svg
//                   width={14}
//                   height={14}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
//                   <polyline points="16 17 21 12 16 7" />
//                   <line x1="21" y1="12" x2="9" y2="12" />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default SuperAdminSidebar;



































// src/SuperAdmin/components/layout/SuperAdminSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Mail, FileSearch, ChevronDown } from "lucide-react";
import { PERMISSIONS } from "@/SuperAdmin/constants/permissions";
import { useTheme } from "../../context/ThemeContext";

// ============================================================
// ICONS
// ============================================================
const icons = {
  dashboard:   "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  students:    "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  trainers:    "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16",
  admins:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  permissions: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  analytics:   "M18 20V10 M12 20V4 M6 20v-6",
  approvals:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  security:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  settings:    "M12 20a8 8 0 100-16 8 8 0 000 16z M12 14a2 2 0 100-4 2 2 0 000 4z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
  logout:      "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  sun:         "M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon:        "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  folder:      "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  chart:       "M12 20V10 M18 20V4 M6 20v-4",
};

// ============================================================
// NAV STRUCTURE — updated for SaaS hierarchy
// ============================================================
const navStructure = [
  {
    type: "item",
    label: "Dashboard",
    path: "/superadmin",
    icon: icons.dashboard,
    permission: null,
    end: true,
  },

  // ── ACCESS MANAGEMENT dropdown ──
  {
    type: "group",
    label: "Access Management",
    icon: icons.folder,
    defaultOpen: true,
    children: [
      {
        label: "Organizations",
        path: "/superadmin/organizations",
        icon: icons.folder,
        permission: PERMISSIONS.VIEW_ORGANIZATIONS,
        description: "Manage SaaS organizations",
      },
      {
        label: "Pending Approvals",
        path: "/superadmin/pending-approvals",
        icon: icons.approvals,
        permission: PERMISSIONS.APPROVE_TRAINER,
        badge: true,
        description: "Requests awaiting admin approval",
      },
      {
        label: "Permissions",
        path: "/superadmin/permissions",
        icon: icons.permissions,
        permission: PERMISSIONS.MANAGE_PERMISSIONS,
        description: "Manage SaaS RBAC permissions",
      },
    ],
  },

  // ── ANALYTICS FLOW dropdown ──
  {
    type: "group",
    label: "Analytics Flow",
    icon: icons.chart,
    defaultOpen: false,
    children: [
      {
        label: "Analytics",
        path: "/superadmin/analytics",
        icon: icons.analytics,
        permission: PERMISSIONS.VIEW_ANALYTICS,
        description: "View key metrics and insights",
      },
      {
        label: "Security",
        path: "/superadmin/security-settings",
        icon: icons.security,
        permission: PERMISSIONS.MANAGE_SECURITY,
        description: "Manage security policies and access controls",
      },
      {
        label: "Send Email",
        path: "/superadmin/settings/send-email",
        iconComponent: Mail,
        permission: PERMISSIONS.VIEW_SETTINGS,
        description: "Send notifications and important emails",
      },
      {
        label: "Audit Logs",
        path: "/superadmin/settings/audit-logs",
        iconComponent: FileSearch,
        permission: PERMISSIONS.VIEW_SETTINGS,
        description: "Track activities and maintain audit logs",
      },
      {
        type: "item",
        label: "Settings",
        path: "/superadmin/global-settings",
        icon: icons.settings,
        permission: PERMISSIONS.VIEW_SETTINGS,
      },
    ],
  },
];

// ============================================================
// HELPERS
// ============================================================
const Icon = ({ d, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <path d={d} />
  </svg>
);

// ============================================================
// NAV ITEM
// ============================================================
const NavItem = ({ item, collapsed, navActive, navIdle, indicator, pendingCount }) => {
  const IconEl = item.iconComponent ? item.iconComponent : null;

  return (
    <NavLink
      to={item.path}
      end={item.end ?? false}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group ${
          isActive ? navActive : navIdle
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full ${indicator}`}
            />
          )}
          {IconEl ? (
            <IconEl size={18} className="shrink-0" />
          ) : (
            <Icon d={item.icon} />
          )}
          {!collapsed && (
            <span className="whitespace-nowrap truncate">{item.label}</span>
          )}
          {!collapsed && item.badge && pendingCount > 0 && (
            <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {pendingCount}
            </span>
          )}
          {collapsed && item.badge && pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

// ============================================================
// NAV GROUP
// ============================================================
const NavGroup = ({
  group,
  collapsed,
  dark,
  navActive,
  navIdle,
  indicator,
  pendingCount,
  hasPermission,
}) => {
  const [open, setOpen] = useState(group.defaultOpen ?? false);

  const filteredChildren = group.children.filter(
    (c) => !c.permission || hasPermission(c.permission)
  );

  const groupHeader = dark
    ? "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    : "text-slate-500 hover:text-slate-800 hover:bg-gray-100";

  const groupLabelCls = dark ? "text-slate-500" : "text-slate-400";

  if (collapsed) {
    return (
      <>
        {filteredChildren.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            collapsed={collapsed}
            navActive={navActive}
            navIdle={navIdle}
            indicator={indicator}
            pendingCount={pendingCount}
          />
        ))}
      </>
    );
  }

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${groupHeader}`}
      >
        <Icon d={group.icon} size={15} />
        <span className={`flex-1 text-left truncate ${groupLabelCls}`}>
          {group.label}
        </span>
        <span
          className="ml-auto transition-transform duration-200"
          style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          <ChevronDown size={13} />
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${filteredChildren.length * 52}px` : "0px" }}
      >
        <div className="pl-2 mt-0.5 space-y-0.5 border-l-2 ml-4 border-violet-500/20">
          {filteredChildren.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              collapsed={false}
              navActive={navActive}
              navIdle={navIdle}
              indicator={indicator}
              pendingCount={pendingCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SIDEBAR
// ============================================================
const SuperAdminSidebar = ({ collapsed, onToggle, pendingCount = 0 }) => {
  const { dark, toggleTheme } = useTheme();

  const user = { name: "Super Admin" };
  const logout = () => { window.location.href = "/"; };
  const hasPermission = () => true;

  const aside       = dark ? "bg-[#0d0d14] border-white/5"                          : "bg-white border-gray-200";
  const hdr         = dark ? "border-white/5"                                        : "border-gray-200";
  const navActive   = dark ? "bg-violet-500/15 text-violet-400"                     : "bg-violet-50 text-violet-600";
  const navIdle     = dark ? "text-slate-400 hover:text-slate-200 hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-gray-100";
  const indicator   = dark ? "bg-violet-400"                                         : "bg-violet-500";
  const divider     = dark ? "border-white/5"                                        : "border-gray-200";
  const userCard    = dark ? "bg-white/[0.03] border-white/5"                       : "bg-gray-50 border-gray-200";
  const userName    = dark ? "text-white"                                            : "text-gray-800";
  const subLabel    = dark ? "text-slate-500"                                        : "text-slate-400";
  const collapseBtn = dark ? "text-slate-500 hover:text-white"                       : "text-slate-400 hover:text-slate-700";
  const toggleCls   = dark ? "text-slate-400 hover:text-yellow-300 hover:bg-white/5": "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50";
  const logoutInCard     = dark ? "text-slate-400 hover:text-red-400 hover:bg-red-400/10" : "text-slate-400 hover:text-red-500 hover:bg-red-50";
  const logoutCollapsed  = dark ? "text-slate-400 hover:text-red-400 hover:bg-red-400/5"  : "text-slate-500 hover:text-red-500 hover:bg-red-50";

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col border-r transition-all duration-300 ease-in-out ${aside} ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* ── Logo ── */}
      <div
        className={`flex items-center h-16 border-b shrink-0 ${hdr} ${
          collapsed ? "px-3 justify-center" : "px-4"
        }`}
      >
        {collapsed ? (
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full h-full"
            title="Expand sidebar"
          >
            <span className="font-extrabold text-base leading-none select-none">
              <span className="text-green-500">I</span>
              <span className="text-[#F97316]">O</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex flex-col leading-tight overflow-hidden">
              <h3
                className="font-extrabold leading-none select-none m-0 p-0"
                style={{ fontSize: 22, letterSpacing: "-0.02em" }}
              >
                <span className="text-green-500">ILM</span>
                <span> </span>
                <span className="text-[#F97316]">ORA</span>
              </h3>
              <span
                className={`text-[9px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap mt-0.5 ${subLabel}`}
              >
                SuperAdmin Panel
              </span>
            </div>
            <button
              onClick={onToggle}
              className={`ml-auto transition-colors p-1 rounded shrink-0 ${collapseBtn}`}
              title="Collapse sidebar"
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-none">
        {navStructure.map((entry, idx) => {
          if (entry.type === "item") {
            if (entry.permission && !hasPermission(entry.permission)) return null;
            return (
              <NavItem
                key={entry.path}
                item={entry}
                collapsed={collapsed}
                navActive={navActive}
                navIdle={navIdle}
                indicator={indicator}
                pendingCount={pendingCount}
              />
            );
          }

          if (entry.type === "group") {
            return (
              <NavGroup
                key={idx}
                group={entry}
                collapsed={collapsed}
                dark={dark}
                navActive={navActive}
                navIdle={navIdle}
                indicator={indicator}
                pendingCount={pendingCount}
                hasPermission={hasPermission}
              />
            );
          }

          return null;
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className={`border-t px-2 py-3 space-y-0.5 ${divider}`}>
        <button
          onClick={toggleTheme}
          title={collapsed ? (dark ? "Light Mode" : "Dark Mode") : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${toggleCls}`}
        >
          <Icon d={dark ? icons.sun : icons.moon} />
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {collapsed ? (
          <>
            <div className="flex items-center justify-center py-1" title={user.name}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name?.[0] || "S"}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${logoutCollapsed}`}
            >
              <Icon d={icons.logout} />
            </button>
          </>
        ) : (
          <div className={`mt-1 px-3 py-2.5 rounded-lg border ${userCard}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name?.[0] || "S"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`text-xs font-semibold truncate ${userName}`}>{user.name}</p>
                <p className="text-violet-500 text-[10px] font-semibold uppercase tracking-wider">
                  Super Admin
                </p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${logoutInCard}`}
              >
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;