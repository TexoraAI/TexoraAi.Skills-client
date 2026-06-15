import React from "react";
import { Layers } from "lucide-react";
import "../styles/cms.css";

/**
 * CMSHeader — Top bar for CMS management pages.
 * Props: title, breadcrumb, actions (ReactNode)
 */
const CMSHeader = ({ title, breadcrumb, actions }) => {
  return (
    <div className="cms-header">
      <div>
        <h1 className="cms-header__title">
          <Layers size={16} style={{ color: "#6366f1", flexShrink: 0 }} />
          {title}
        </h1>
        {breadcrumb && <div className="cms-header__breadcrumb">{breadcrumb}</div>}
      </div>
      {actions && <div className="cms-header__actions">{actions}</div>}
    </div>
  );
};

export default CMSHeader;