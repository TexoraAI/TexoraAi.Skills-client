
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../auth"; // 🔴 path check kar lena

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "admin-control",
    label: "Admin Control",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="7" r="4" />
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      </svg>
    ),
  },
  {
    id: "business-control",
    label: "Business Control",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16" />
      </svg>
    ),
  },
  {
    id: "trainer-control",
    label: "Trainer Control",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14" />
      </svg>
    ),
  },
  {
    id: "student-control",
    label: "Student Control",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82" />
      </svg>
    ),
    sub: [
      { id: "role-page-matrix", label: "Role Page Matrix" },
      { id: "audit-logs", label: "Audit Logs" },
      { id: "send-email", label: "Send Email" },
    ],
  },
];

export default function SuperAdminSidebar({ activePage, onNavigate, isOpen }) {
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: isOpen ? "260px" : "72px",
        minHeight: "100vh",
        background: "linear-gradient(180deg,#0f1117,#161822)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "width .3s",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 🔹 HEADER */}
      <div
        style={{
          padding: isOpen ? "20px 16px" : "20px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "flex-start" : "center",
          gap: "12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          T
        </div>

        {isOpen && (
          <div>
            <div style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>
              TexoraAi.skills
            </div>
            <div style={{ color: "rgba(255,255,255,.4)", fontSize: "11px" }}>
              Super Admin
            </div>
          </div>
        )}
      </div>

      {/* 🔹 MENU */}
      <nav style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {menuItems.map((item) => {
          const active =
            activePage === item.id ||
            (item.sub && item.sub.some((s) => s.id === activePage));

          return (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.sub ? setOpenSettings(!openSettings) : onNavigate(item.id)
                }
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: isOpen ? "12px" : "0",
                  justifyContent: isOpen ? "flex-start" : "center",
                  padding: isOpen ? "11px 14px" : "12px 0",
                  borderRadius: "10px",
                  background: active
                    ? "linear-gradient(135deg,rgba(99,102,241,.18),rgba(139,92,246,.1))"
                    : "transparent",
                  color: active ? "#a5b4fc" : "rgba(255,255,255,.5)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {item.icon}
                {isOpen && <span>{item.label}</span>}
              </button>

              {item.sub && openSettings && isOpen && (
                <div style={{ paddingLeft: "38px" }}>
                  {item.sub.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onNavigate(sub.id)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background:
                          activePage === sub.id
                            ? "rgba(99,102,241,.12)"
                            : "transparent",
                        border: "none",
                        color:
                          activePage === sub.id
                            ? "#a5b4fc"
                            : "rgba(255,255,255,.4)",
                        borderRadius: "8px",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 🔻 LOGOUT */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: isOpen ? "12px" : "0",
            justifyContent: isOpen ? "flex-start" : "center",
            padding: isOpen ? "11px 14px" : "12px 0",
            borderRadius: "10px",
            background: "rgba(239,68,68,0.12)",
            color: "#f87171",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>

          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
