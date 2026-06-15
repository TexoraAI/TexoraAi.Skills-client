/**
 * superAdminSidebarCMSMenu.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Copy-paste this menu config into your existing SuperAdmin sidebar.
 *
 * HOW TO INTEGRATE
 * ────────────────
 * 1. Find your sidebar menu array (usually something like `menuItems`, `navItems`, etc.)
 * 2. Add the CMS_MENU_GROUP below into that array.
 * 3. The sidebar already uses react-router NavLink — no extra wiring needed.
 *
 * ICON IMPORTS needed (add to your sidebar file if not already imported):
 *   import { Layers, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
 */

// ─── Menu group object ────────────────────────────────────────────────────────
// Paste this object into your sidebar menu array:

export const CMS_MENU_GROUP = {
  groupLabel: "CMS Management",      // Section header label
  icon: "Layers",                    // Group icon (Lucide)
  basePath: "/superadmin/cms",
  items: [
    {
      label: "Student Hub",
      path: "/superadmin/cms/student-hub",
      icon: "GraduationCap",
      description: "Manage Student Hub pages",
    },
    {
      label: "Trainer Hub",
      path: "/superadmin/cms/trainer-hub",
      icon: "UserCheck",
      description: "Manage Trainer Hub pages",
    },
    {
      label: "Admin Hub",
      path: "/superadmin/cms/admin-hub",
      icon: "ShieldCheck",
      description: "Manage Admin Hub pages",
    },
  ],
};

// ─── JSX Snippet ─────────────────────────────────────────────────────────────
// If your sidebar renders items manually, paste this JSX block:

/*

import { Layers, GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

// ---- Paste inside your sidebar JSX ----

{/* CMS Management Group *\/}
<div className="sidebar-group">
  <div className="sidebar-group-label">
    <Layers size={14} />
    CMS Management
  </div>

  <NavLink
    to="/superadmin/cms/student-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <GraduationCap size={16} />
    Student Hub
  </NavLink>

  <NavLink
    to="/superadmin/cms/trainer-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <UserCheck size={16} />
    Trainer Hub
  </NavLink>

  <NavLink
    to="/superadmin/cms/admin-hub"
    className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
  >
    <ShieldCheck size={16} />
    Admin Hub
  </NavLink>
</div>

// ---- End paste ----
*/

// ─── CSS to add to your sidebar stylesheet (if classes differ, adapt to yours)
/*

.sidebar-group-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--sidebar-text-muted, #64748b);
  margin-top: 12px;
}

*/
