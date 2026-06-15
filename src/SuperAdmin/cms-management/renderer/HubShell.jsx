/**
 * HubShell.jsx — Reusable shell for CMS hub pages.
 * Designed to render INSIDE the SuperAdmin layout (not replace it).
 * The SuperAdmin layout provides the outer nav + background.
 * HubShell provides: page header, CMS sidebar, content area.
 */

import React from "react";
import CMSHeader from "../components/CMSHeader";
import CMSSidebar from "../components/CMSSidebar";
import "../styles/cms.css";

/**
 * Props:
 *   title        — Page title shown in header
 *   breadcrumb   — Breadcrumb string
 *   actions      — ReactNode: buttons shown in header right
 *   children     — Main content area
 *   showSidebar  — boolean (default true)
 */
const HubShell = ({ title, breadcrumb, actions, children, showSidebar = true }) => {
  return (
    <div className="cms-root">
      <div className="cms-shell">
        <CMSHeader title={title} breadcrumb={breadcrumb} actions={actions} />
        <div className="cms-layout">
          {showSidebar && <CMSSidebar />}
          <main className="cms-content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default HubShell;