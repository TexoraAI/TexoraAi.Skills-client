// components/BreadcrumbNavigation.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

// ─────────────────────────────────────────────
// CHEVRON ICON
// ─────────────────────────────────────────────
const ChevronRight = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const HomeIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);

const BackArrow = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

// ─────────────────────────────────────────────
// BREADCRUMB NAVIGATION
// ─────────────────────────────────────────────
// items: [{ label: "Organizations", href: "/superadmin/organizations" }, ...]
// last item is current page (not clickable)

const BreadcrumbNavigation = ({ items = [], showBack = true }) => {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const wrapBg    = dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)";
  const wrapBdr   = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const linkColor = dark ? "#94a3b8" : "#64748b";
  const linkHover = dark ? "#c4b5fd" : "#6366f1";
  const curColor  = dark ? "#f1f5f9" : "#0f172a";
  const sepColor  = dark ? "#334155" : "#cbd5e1";
  const backBg    = dark ? "rgba(255,255,255,0.05)" : "#f1f5f9";
  const backColor = dark ? "#94a3b8" : "#64748b";
  const backHoverBg = dark ? "rgba(255,255,255,0.08)" : "#e5e7eb";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      {/* Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: backBg, color: backColor, border: "none", cursor: "pointer",
            transition: "all 0.15s", flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = backHoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = backBg; }}
        >
          <BackArrow />
          Back
        </button>
      )}

      {/* Breadcrumb trail */}
      <nav
        style={{
          display: "flex", alignItems: "center", gap: 0,
          background: wrapBg, border: `1px solid ${wrapBdr}`,
          borderRadius: 8, padding: "5px 12px", overflow: "hidden",
        }}
        aria-label="Breadcrumb"
      >
        {/* Home */}
        <Link
          to="/superadmin"
          style={{
            display: "flex", alignItems: "center",
            color: linkColor, textDecoration: "none", transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = linkHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
        >
          <HomeIcon />
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              {/* Separator */}
              <span style={{ color: sepColor, margin: "0 6px", display: "flex", alignItems: "center", userSelect: "none" }}>
                <ChevronRight />
              </span>

              {isLast ? (
                // Current page - not clickable
                <span style={{ fontSize: 12, fontWeight: 700, color: curColor, whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </span>
              ) : (
                // Clickable link
                <Link
                  to={item.href}
                  style={{
                    fontSize: 12, fontWeight: 500, color: linkColor,
                    textDecoration: "none", transition: "color 0.15s",
                    whiteSpace: "nowrap", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = linkHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default BreadcrumbNavigation;