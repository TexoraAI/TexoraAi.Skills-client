import React from "react";
import { NavLink } from "react-router-dom";
import { GraduationCap, UserCheck, ShieldCheck } from "lucide-react";
import "../styles/cms.css";

const items = [
  { label: "Student Hub", path: "/superadmin/cms/student-hub", icon: GraduationCap },
  { label: "Trainer Hub", path: "/superadmin/cms/trainer-hub", icon: UserCheck },
  { label: "Admin Hub",   path: "/superadmin/cms/admin-hub",   icon: ShieldCheck },
];

const CMSSidebar = () => {
  return (
    <div className="cms-sidebar">
      <div className="cms-sidebar__label">CMS Management</div>
      {items.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `cms-sidebar__item${isActive ? " cms-sidebar__item--active" : ""}`
          }
        >
          <Icon size={15} />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default CMSSidebar;