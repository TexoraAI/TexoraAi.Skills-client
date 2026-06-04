// src/SuperAdmin/components/layout/SuperAdminNavbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Mail, FileSearch, ChevronDown, Menu, X } from "lucide-react";
import { PERMISSIONS } from "@/SuperAdmin/constants/permissions";
import { useTheme } from "../../context/ThemeContext";

// ── Icons ─────────────────────────────────────────────────────
const ic = {
  dashboard:     "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  onboarding:    "M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 11a4 4 0 100-8 4 4 0 000 8z M20 8v6 M23 11h-6",
  organizations: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  approvals:     "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  permissions:   "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  analytics:     "M18 20V10 M12 20V4 M6 20v-6",
  security:      "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
  settings:      "M12 20a8 8 0 100-16 8 8 0 000 16z M12 14a2 2 0 100-4 2 2 0 000 4z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41",
  logout:        "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  sun:           "M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon:          "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  user:          "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  bell:          "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  featuredPrograms: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2z M9 7h6 M9 11h6 M9 15h4",
};

const SvgIcon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// ── Nav structure — all tabs from old sidebar ─────────────────
const NAV = [
  {
    type: "item",
    label: "Dashboard",
    path: "/superadmin",
    icon: ic.dashboard,
    end: true,
    permission: null,
  },
  {
    type: "dropdown",
    label: "Access Management",
    children: [
      {
        label: "Onboarding",
        path: "/superadmin/onboarding",
        icon: ic.onboarding,
        permission: PERMISSIONS.VIEW_ONBOARDING,
      },
      {
        label: "Organizations",
        path: "/superadmin/organizations",
        icon: ic.organizations,
        permission: PERMISSIONS.VIEW_ORGANIZATIONS,
      },
      
      {
        label: "Permissions",
        path: "/superadmin/permissions",
        icon: ic.permissions,
        permission: PERMISSIONS.MANAGE_PERMISSIONS,
      },
    ],
  },
  {
    type: "item",
    label: "Analytics",
    path: "/superadmin/analytics",
    icon: ic.analytics,
    permission: PERMISSIONS.VIEW_ANALYTICS,
  },
  {
    type: "item",
    label: "Featured Programs",
    path: "/superadmin/featured-programs",
    icon: ic.featuredPrograms,
    permission: null,
  },
  {
    type: "item",
    label: "Security",
    path: "/superadmin/security-settings",
    icon: ic.security,
    permission: PERMISSIONS.MANAGE_SECURITY,
  },
  {
    type: "dropdown",
    label: "Settings",
    children: [
      {
        label: "Send Email",
        path: "/superadmin/settings/send-email",
        iconComponent: Mail,
        permission: PERMISSIONS.VIEW_SETTINGS,
      },
      {
        label: "Audit Logs",
        path: "/superadmin/settings/audit-logs",
        iconComponent: FileSearch,
        permission: PERMISSIONS.VIEW_SETTINGS,
      },
      {
        label: "Global Settings",
        path: "/superadmin/global-settings",
        icon: ic.settings,
        permission: PERMISSIONS.VIEW_SETTINGS,
      },
    ],
  },
];

// ── Notifications ─────────────────────────────────────────────
const INIT_NOTIFS = [
  { id: 1, type: "approval", msg: "New trainer application from Rajesh Kumar",  time: "2m ago",  unread: true  },
  { id: 2, type: "alert",    msg: "Student account suspended: Priya Singh",      time: "15m ago", unread: true  },
  { id: 3, type: "info",     msg: "System backup completed successfully",         time: "1h ago",  unread: false },
  { id: 4, type: "warning",  msg: "High CPU usage on live session server",       time: "2h ago",  unread: false },
];
const NOTIF_CLR = { approval: "#fbbf24", alert: "#f87171", info: "#60a5fa", warning: "#fb923c" };

// ── Hook ──────────────────────────────────────────────────────
const useOutside = (ref, cb) => {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
};

// ── Desktop dropdown ──────────────────────────────────────────
const Dropdown = ({ group, pendingCount, dark, active, idle }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false));

  const panelBg  = dark ? "#13131f" : "#fff";
  const panelBdr = dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)";
  const itemClr  = dark ? "#cbd5e1" : "#374151";
  const activeBg = dark ? "rgba(124,58,237,.12)" : "rgba(124,58,237,.07)";

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "stretch" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: "0 14px", height: "100%",
          background: "none", border: "none", cursor: "pointer",
          color: open ? active : idle,
          fontSize: 13, fontWeight: 500,
          borderBottom: `2px solid ${open ? active : "transparent"}`,
          transition: "all .15s",
          whiteSpace: "nowrap",
        }}
      >
        {group.label}
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 2px)", left: 0, minWidth: 210, zIndex: 500,
          background: panelBg, border: `1px solid ${panelBdr}`,
          borderRadius: 10, padding: 6,
          boxShadow: dark ? "0 24px 64px rgba(0,0,0,.55)" : "0 8px 32px rgba(0,0,0,.14)",
        }}>
          {group.children.map(item => {
            const IconEl = item.iconComponent || null;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "9px 12px", borderRadius: 7,
                  textDecoration: "none",
                  color: isActive ? active : itemClr,
                  background: isActive ? activeBg : "transparent",
                  fontSize: 13, fontWeight: 500,
                  transition: "all .12s",
                })}
              >
                {IconEl ? <IconEl size={13} /> : <SvgIcon d={item.icon} size={13} />}
                <span>{item.label}</span>
                {item.badge && pendingCount > 0 && (
                  <span style={{
                    marginLeft: "auto", background: "#f59e0b", color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999,
                  }}>{pendingCount}</span>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main navbar ───────────────────────────────────────────────
const SuperAdminNavbar = ({ pendingCount = 0, activeUsers = 0 }) => {
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showNotif,     setShowNotif]     = useState(false);
  const [showUser,      setShowUser]      = useState(false);
  const [notifs,        setNotifs]        = useState(INIT_NOTIFS);

  const notifRef = useRef(null);
  const userRef  = useRef(null);

  useOutside(notifRef, () => setShowNotif(false));
  useOutside(userRef,  () => setShowUser(false));

  const unread = notifs.filter(n => n.unread).length;
  const user   = { name: "Super Admin" };
  const logout = () => { window.location.href = "/"; };
  const hasPermission = () => true;

  // ── Design tokens ────────────────────────────────────────────
  const bg     = dark ? "#0d0d14"               : "#ffffff";
  const bdr    = dark ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.09)";
  const active = dark ? "#a78bfa"               : "#7c3aed";
  const idle   = dark ? "#94a3b8"               : "#64748b";
  const panel  = dark ? "#13131f"               : "#ffffff";
  const pdBdr  = dark ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)";
  const uName  = dark ? "#ffffff"               : "#111111";
  const mText  = dark ? "#cbd5e1"               : "#374151";

  const ibtn = (extra = {}) => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "none", border: "none", cursor: "pointer",
    color: idle, padding: "7px 8px", borderRadius: 7,
    transition: "color .15s",
    ...extra,
  });

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HEADER — fixed, full width, two rows
      ══════════════════════════════════════════════════════ */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: bg,
        borderBottom: `1px solid ${bdr}`,
        boxShadow: dark ? "none" : "0 1px 8px rgba(0,0,0,.06)",
      }}>

        {/* ── ROW 1 — Logo + Right controls (52px) ── */}
        <div style={{
          display: "flex", alignItems: "center",
          height: 52, padding: "0 20px",
          borderBottom: `1px solid ${bdr}`,
        }}>
          {/* Logo */}
          <div style={{ flexShrink: 0, marginRight: 24 }}>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>
         <span style={{ color: "#22c55e" }}>ILM</span>
         <span style={{ color: "#f97316" }}>&nbsp;ORA</span>
         </h3>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: idle }}>
              SuperAdmin Panel
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>

            {/* Stats — desktop only */}
            <div className="sa-stats" style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, paddingRight: 8 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: idle }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <b style={{ color: uName, fontWeight: 600 }}>{activeUsers}</b>&nbsp;active
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, color: idle }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
                <b style={{ color: uName, fontWeight: 600 }}>{pendingCount}</b>&nbsp;pending
              </span>
            </div>

            <div className="sa-stats" style={{ width: 1, height: 20, background: bdr, margin: "0 6px" }} />

            {/* Theme toggle */}
            <button onClick={toggleTheme} title={dark ? "Light Mode" : "Dark Mode"} style={ibtn()}>
              <SvgIcon d={dark ? ic.sun : ic.moon} size={17} />
            </button>

            {/* Bell */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button
                onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
                style={ibtn({ position: "relative" })}
              >
                <SvgIcon d={ic.bell} size={18} />
                {unread > 0 && (
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    width: 15, height: 15,
                    background: "#7c3aed", color: "#fff", fontSize: 8, fontWeight: 700,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{unread}</span>
                )}
              </button>

              {showNotif && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", width: 304,
                  background: panel, border: `1px solid ${pdBdr}`, borderRadius: 12, zIndex: 600,
                  boxShadow: dark ? "0 24px 64px rgba(0,0,0,.55)" : "0 8px 32px rgba(0,0,0,.14)",
                  overflow: "hidden",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: `1px solid ${pdBdr}` }}>
                    <span style={{ color: uName, fontSize: 13, fontWeight: 600 }}>Notifications</span>
                    {unread > 0 && (
                      <button
                        onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                        style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer" }}
                      >Mark all read</button>
                    )}
                  </div>
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {notifs.map(n => (
                      <div key={n.id} style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        padding: "10px 14px", borderBottom: `1px solid ${pdBdr}`,
                        background: n.unread
                          ? (dark ? "rgba(124,58,237,.05)" : "rgba(124,58,237,.04)")
                          : "transparent",
                      }}>
                        <span style={{
                          marginTop: 5, width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: n.unread ? NOTIF_CLR[n.type] : "#475569",
                          display: "inline-block",
                        }} />
                        <div>
                          <p style={{ fontSize: 12, color: mText, margin: 0, lineHeight: 1.4 }}>{n.msg}</p>
                          <p style={{ fontSize: 11, color: idle, margin: "3px 0 0" }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "8px 14px", textAlign: "center" }}>
                    <button style={{ fontSize: 11, color: "#a78bfa", background: "none", border: "none", cursor: "pointer" }}>
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="sa-stats" style={{ width: 1, height: 20, background: bdr, margin: "0 6px" }} />

            {/* User chip — desktop only */}
            <div ref={userRef} style={{ position: "relative" }} className="sa-stats">
              <button
                onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
                  border: `1px solid ${dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.10)"}`,
                  borderRadius: 8, padding: "5px 10px 5px 6px",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>{user.name?.[0] || "S"}</div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 12, color: uName, fontWeight: 500, margin: 0, lineHeight: 1.2 }}>{user.name}</p>
                  <p style={{ fontSize: 9, color: "#a78bfa", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Super Admin</p>
                </div>
                <ChevronDown size={11} style={{
                  color: idle, marginLeft: 2,
                  transform: showUser ? "rotate(180deg)" : "none",
                  transition: "transform .2s",
                }} />
              </button>

              {showUser && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 6px)", minWidth: 160,
                  background: panel, border: `1px solid ${pdBdr}`,
                  borderRadius: 10, padding: 6, zIndex: 600,
                  boxShadow: dark ? "0 24px 64px rgba(0,0,0,.55)" : "0 8px 32px rgba(0,0,0,.14)",
                }}>
                  <button
                    onClick={() => { navigate("/superadmin/profile"); setShowUser(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px", background: "none", border: "none",
                      cursor: "pointer", color: mText, fontSize: 13, borderRadius: 6, textAlign: "left",
                    }}
                  >
                    <SvgIcon d={ic.user} size={13} />Profile
                  </button>
                  <div style={{ height: 1, background: pdBdr, margin: "3px 0" }} />
                  <button
                    onClick={logout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px", background: "none", border: "none",
                      cursor: "pointer", color: "#f87171", fontSize: 13, borderRadius: 6, textAlign: "left",
                    }}
                  >
                    <SvgIcon d={ic.logout} size={13} />Logout
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="sa-mobile-only"
              style={{ ...ibtn(), display: "none" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* ── ROW 2 — Nav tabs (44px, desktop only) ── */}
        <div
          className="sa-nav-row"
          style={{
            display: "flex",
            alignItems: "stretch",
            height: 44,
            // ✅ KEY FIX: Use padding that keeps all tabs visible
            // overflowX hidden + flex-wrap won't work, so we use
            // a min-width trick to let items shrink slightly if needed
            padding: "0 12px",
            gap: 0,
            background: bg,
          }}
        >
          {NAV.map((entry, idx) => {
            if (entry.type === "item") {
              if (entry.permission && !hasPermission(entry.permission)) return null;
              return (
                <NavLink
                  key={entry.path}
                  to={entry.path}
                  end={entry.end ?? false}
                  style={({ isActive }) => ({
                    display: "flex", alignItems: "center",
                    // ✅ Reduced padding so all 5 tabs fit without scrolling
                    padding: "0 12px", height: "100%",
                    textDecoration: "none",
                    fontSize: 13, fontWeight: 500,
                    whiteSpace: "nowrap",
                    color: isActive ? active : idle,
                    borderBottom: `2px solid ${isActive ? active : "transparent"}`,
                    transition: "color .15s, border-color .15s",
                    flexShrink: 0,
                  })}
                >
                  {entry.label}
                </NavLink>
              );
            }
            if (entry.type === "dropdown") {
              return (
                <Dropdown
                  key={idx}
                  group={entry}
                  pendingCount={pendingCount}
                  dark={dark}
                  active={active}
                  idle={idle}
                />
              );
            }
            return null;
          })}
        </div>

      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 52, left: 0, right: 0, bottom: 0,
          background: dark ? "#0d0d14" : "#fff",
          zIndex: 49, overflowY: "auto",
          borderTop: `1px solid ${bdr}`,
        }}>
          {/* User row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "14px 18px", borderBottom: `1px solid ${bdr}`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700,
            }}>{user.name?.[0] || "S"}</div>
            <div>
              <p style={{ fontSize: 13, color: uName, fontWeight: 600, margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 10, color: "#a78bfa", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Super Admin</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 11, color: idle }}>
              <span><b style={{ color: uName }}>{activeUsers}</b> active</span>
              <span><b style={{ color: "#fbbf24" }}>{pendingCount}</b> pending</span>
            </div>
          </div>

          {/* Nav items */}
          <nav style={{ padding: "8px 10px" }}>
            {NAV.map((entry, idx) => {
              if (entry.type === "item") {
                if (entry.permission && !hasPermission(entry.permission)) return null;
                return (
                  <NavLink
                    key={entry.path}
                    to={entry.path}
                    end={entry.end ?? false}
                    onClick={() => setMobileOpen(false)}
                    style={({ isActive }) => ({
                      display: "flex", alignItems: "center", gap: 11,
                      padding: "11px 12px", borderRadius: 8, textDecoration: "none",
                      color: isActive ? active : mText,
                      background: isActive
                        ? (dark ? "rgba(124,58,237,.10)" : "rgba(124,58,237,.07)")
                        : "transparent",
                      fontSize: 14, fontWeight: 500, marginBottom: 2,
                    })}
                  >
                    <SvgIcon d={entry.icon} size={15} />
                    {entry.label}
                  </NavLink>
                );
              }
              if (entry.type === "dropdown") {
                const isOpen = expandedGroup === idx;
                return (
                  <div key={idx} style={{ marginBottom: 2 }}>
                    <button
                      onClick={() => setExpandedGroup(isOpen ? null : idx)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 11,
                        padding: "11px 12px", borderRadius: 8,
                        background: "none", border: "none", cursor: "pointer",
                        color: mText, fontSize: 14, fontWeight: 500, textAlign: "left",
                      }}
                    >
                      <ChevronDown size={15} style={{
                        color: idle,
                        transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: "transform .2s",
                      }} />
                      {entry.label}
                    </button>
                    {isOpen && (
                      <div style={{ paddingLeft: 30, paddingBottom: 4 }}>
                        {entry.children.map(item => {
                          const IconEl = item.iconComponent || null;
                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => { setMobileOpen(false); setExpandedGroup(null); }}
                              style={({ isActive }) => ({
                                display: "flex", alignItems: "center", gap: 9,
                                padding: "9px 10px", borderRadius: 7, textDecoration: "none",
                                color: isActive ? active : idle,
                                background: isActive
                                  ? (dark ? "rgba(124,58,237,.10)" : "rgba(124,58,237,.07)")
                                  : "transparent",
                                fontSize: 13, fontWeight: 500, marginBottom: 1,
                              })}
                            >
                              {IconEl ? <IconEl size={13} /> : <SvgIcon d={item.icon} size={13} />}
                              <span>{item.label}</span>
                              {item.badge && pendingCount > 0 && (
                                <span style={{
                                  marginLeft: "auto", background: "#f59e0b",
                                  color: "#fff", fontSize: 10, fontWeight: 700,
                                  padding: "1px 6px", borderRadius: 999,
                                }}>{pendingCount}</span>
                              )}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </nav>

          {/* Bottom: theme + logout */}
          <div style={{ padding: "10px 18px", borderTop: `1px solid ${bdr}`, display: "flex", flexDirection: "column", gap: 2 }}>
            <button onClick={toggleTheme} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", background: "none", border: "none",
              cursor: "pointer", color: mText, fontSize: 14, borderRadius: 8, textAlign: "left",
            }}>
              <SvgIcon d={dark ? ic.sun : ic.moon} size={15} />
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            <button onClick={logout} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", background: "none", border: "none",
              cursor: "pointer", color: "#f87171", fontSize: 14, borderRadius: 8, textAlign: "left",
            }}>
              <SvgIcon d={ic.logout} size={15} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ── Responsive CSS ────────────────────────────────────── */}
      <style>{`
        /* Desktop (>1024px): everything visible */
        .sa-mobile-only { display: none !important; }
        .sa-nav-row     { display: flex !important; }
        .sa-stats       { display: flex !important; }

        /* Tablet (769–1024px): hide stats, keep nav row */
        @media (max-width: 1024px) and (min-width: 769px) {
          .sa-stats { display: none !important; }
        }

        /* Mobile (≤768px): hide nav row, show hamburger */
        @media (max-width: 768px) {
          .sa-nav-row     { display: none !important; }
          .sa-stats       { display: none !important; }
          .sa-mobile-only { display: flex !important; }
        }

        /* ✅ FIX: Remove any overflow/scroll so all tabs stay visible */
        .sa-nav-row { overflow: visible !important; }

        /* Hover state for nav links */
        .sa-nav-row a:hover { color: #7c3aed !important; }
      `}</style>
    </>
  );
};

export default SuperAdminNavbar;