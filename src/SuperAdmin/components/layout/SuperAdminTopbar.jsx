import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const NOTIFICATIONS = [
  { id: 1, type: "approval", message: "New trainer application from Rajesh Kumar",     time: "2m ago",  unread: true  },
  { id: 2, type: "alert",    message: "Student account suspended: Priya Singh",         time: "15m ago", unread: true  },
  { id: 3, type: "info",     message: "System backup completed successfully",            time: "1h ago",  unread: false },
  { id: 4, type: "warning",  message: "High CPU usage detected on live session server", time: "2h ago",  unread: false },
  { id: 5, type: "approval", message: "Admin account pending review: Kiran D.",         time: "3h ago",  unread: false },
];

const notifDotColors = {
  approval: "#fbbf24",
  alert:    "#f87171",
  info:     "#60a5fa",
  warning:  "#fb923c",
};

const IlmoraLogo = () => (
  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>
    <span style={{ color: "#22c55e" }}>ILM</span>
    <span style={{ color: "#f97316" }}>ORA</span>
  </h3>
);

const SuperAdminTopbar = ({ collapsed, activeUsers = 0, pendingUsers = 0 }) => {
  const user = { name: "Super Admin" };
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [searchQuery,   setSearchQuery]   = useState("");
  const [showNotif,     setShowNotif]     = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ── Theme tokens ──────────────────────────────────────────
  const t = {
    // Topbar background
    headerBg:       dark ? "rgba(10,10,15,0.92)"        : "rgba(255,255,255,0.95)",
    headerBorder:   dark ? "rgba(255,255,255,0.06)"     : "rgba(0,0,0,0.08)",

    // Search input
    searchBg:       dark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.04)",
    searchBorder:   dark ? "rgba(255,255,255,0.08)"     : "rgba(0,0,0,0.12)",
    searchText:     dark ? "#fff"                       : "#111",
    searchIcon:     dark ? "#64748b"                    : "#94a3b8",

    // Stats text
    statLabel:      dark ? "#94a3b8"                    : "#64748b",
    statValue:      dark ? "#fff"                       : "#111",

    // Divider
    divider:        dark ? "rgba(255,255,255,0.08)"     : "rgba(0,0,0,0.08)",

    // Icon button
    iconColor:      dark ? "#94a3b8"                    : "#64748b",

    // Notification panel
    notifBg:        dark ? "#13131f"                    : "#ffffff",
    notifBorder:    dark ? "rgba(255,255,255,0.10)"     : "rgba(0,0,0,0.10)",
    notifHeaderBdr: dark ? "rgba(255,255,255,0.07)"     : "rgba(0,0,0,0.07)",
    notifTitle:     dark ? "#fff"                       : "#111",
    notifMarkAll:   "#a78bfa",
    notifRowBdr:    dark ? "rgba(255,255,255,0.05)"     : "rgba(0,0,0,0.05)",
    notifUnreadBg:  dark ? "rgba(124,58,237,0.05)"      : "rgba(124,58,237,0.06)",
    notifMsg:       dark ? "#cbd5e1"                    : "#374151",
    notifTime:      dark ? "#64748b"                    : "#9ca3af",

    // User chip
    userChipBg:     dark ? "rgba(255,255,255,0.04)"     : "rgba(0,0,0,0.04)",
    userChipBorder: dark ? "rgba(255,255,255,0.08)"     : "rgba(0,0,0,0.10)",
    userName:       dark ? "#fff"                       : "#111",
    userRole:       "#a78bfa",
    chevron:        dark ? "#64748b"                    : "#94a3b8",
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () =>
    setNotifications((n) => n.map((item) => ({ ...item, unread: false })));

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 40,
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        background: t.headerBg,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${t.headerBorder}`,
        transition: "left 0.3s",
        left: collapsed ? 64 : 240,
        boxShadow: dark ? "none" : "0 1px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Logo (only visible when sidebar is collapsed) ── */}
      {collapsed && (
        <div style={{ display: "flex", alignItems: "center", paddingRight: 8 }}>
          <IlmoraLogo />
        </div>
      )}

      {/* ── Search ── */}
      <div style={{ flex: 1, maxWidth: 400 }}>
        <div style={{ position: "relative" }}>
          <svg
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.searchIcon }}
            width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          >
            <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, courses, reports..."
            style={{
              width: "100%",
              paddingLeft: 32, paddingRight: 36, paddingTop: 7, paddingBottom: 7,
              background: t.searchBg,
              border: `1px solid ${t.searchBorder}`,
              borderRadius: 8,
              fontSize: 13,
              color: t.searchText,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: t.searchIcon,
              }}
            >
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Right Side Group ── */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>

        {/* Quick Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
            <span style={{ color: t.statLabel }}>
              <span style={{ color: t.statValue, fontWeight: 600 }}>{activeUsers}</span> active
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
            <span style={{ color: t.statLabel }}>
              <span style={{ color: t.statValue, fontWeight: 600 }}>{pendingUsers}</span> pending
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: t.divider }} />

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              position: "relative", padding: 8, background: "none", border: "none",
              cursor: "pointer", color: t.iconColor, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4, width: 16, height: 16,
                background: "#7c3aed", color: "#fff", fontSize: 9, fontWeight: 700,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320,
              background: t.notifBg,
              border: `1px solid ${t.notifBorder}`,
              borderRadius: 12,
              boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 8px 30px rgba(0,0,0,0.12)",
              overflow: "hidden", zIndex: 100,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderBottom: `1px solid ${t.notifHeaderBdr}`,
              }}>
                <span style={{ color: t.notifTitle, fontSize: 13, fontWeight: 600 }}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: 11, color: t.notifMarkAll, background: "none", border: "none", cursor: "pointer" }}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: "12px 16px",
                    borderBottom: `1px solid ${t.notifRowBdr}`,
                    background: n.unread ? t.notifUnreadBg : "transparent",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{
                        marginTop: 5, width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: n.unread ? notifDotColors[n.type] : "#475569",
                        display: "inline-block",
                      }} />
                      <div>
                        <p style={{ fontSize: 12, color: t.notifMsg, margin: 0, lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ fontSize: 11, color: t.notifTime, margin: "3px 0 0" }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <button style={{ fontSize: 11, color: t.notifMarkAll, background: "none", border: "none", cursor: "pointer" }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: t.divider }} />

        {/* User Avatar */}
        <button
          onClick={() => navigate("/superadmin/profile")}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            background: t.userChipBg,
            border: `1px solid ${t.userChipBorder}`,
            cursor: "pointer", padding: "6px 12px", borderRadius: 8,
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0,
          }}>
            {user?.name?.[0] || "S"}
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 12, color: t.userName, fontWeight: 500, margin: 0, lineHeight: 1.2 }}>
              {user?.name || "Super Admin"}
            </p>
            <p style={{ fontSize: 10, color: t.userRole, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Super Admin
            </p>
          </div>
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={t.chevron} strokeWidth={2} style={{ marginLeft: 2, flexShrink: 0 }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

      </div>
    </header>
  );
};

export default SuperAdminTopbar;