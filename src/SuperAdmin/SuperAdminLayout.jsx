import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [avatar, setAvatar] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const activePage = getActivePage(location.pathname);

  /* 🔥 AVATAR SYNC FIX */
  useEffect(() => {
    const loadAvatar = () => {
      setAvatar(localStorage.getItem("superAdminAvatar"));
    };

    loadAvatar(); // initial load

    window.addEventListener("super-admin-avatar-updated", loadAvatar);

    return () => {
      window.removeEventListener("super-admin-avatar-updated", loadAvatar);
    };
  }, []);

  const handleNavigate = (pageId) => {
    const routeMap = {
      dashboard: "/super-admin/dashboard",
      "admin-control": "/super-admin/admin-control",
      "business-control": "/super-admin/business-control",
      "trainer-control": "/super-admin/trainer-control",
      "student-control": "/super-admin/student-control",
      "role-page-matrix": "/super-admin/settings/role-matrix",
      "audit-logs": "/super-admin/settings/audit-logs",
      "send-email": "/super-admin/settings/send-email",
    };

    navigate(routeMap[pageId]);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8eaf6 100%)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <SuperAdminSidebar
        isOpen={sidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        <header
          style={{
            height: "72px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                border: "1px solid rgba(99, 102, 241, 0.2)",
                borderRadius: "10px",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
                fontSize: "18px",
                color: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(99, 102, 241, 0.1)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(99, 102, 241, 0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(99, 102, 241, 0.1)";
              }}
            >
              ☰
            </button>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {getPageTitle(activePage)}
              </h1>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                {getPageBreadcrumb(activePage)}
              </p>
            </div>
          </div>

          {/* RIGHT AVATAR */}
          <div
            onClick={() => navigate("/super-admin/profile")}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              cursor: "pointer",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{ color: "#fff", fontWeight: 700 }}>SA</span>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <main
          style={{
            flex: 1,
            padding: "32px",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* -------- HELPERS -------- */

function getActivePage(path) {
  if (path.includes("admin-control")) return "admin-control";
  if (path.includes("business-control")) return "business-control";
  if (path.includes("trainer-control")) return "trainer-control";
  if (path.includes("student-control")) return "student-control";
  if (path.includes("role-matrix")) return "role-page-matrix";
  if (path.includes("audit-logs")) return "audit-logs";
  if (path.includes("send-email")) return "send-email";
  return "dashboard";
}

function getPageTitle(page) {
  return {
    dashboard: "Dashboard",
    "admin-control": "Admin Control",
    "business-control": "Business Control",
    "trainer-control": "Trainer Control",
    "student-control": "Student Control",
    "role-page-matrix": "Role Page Matrix",
    "audit-logs": "Audit Logs",
    "send-email": "Send Email",
  }[page];
}

function getPageBreadcrumb(page) {
  return {
    dashboard: "Overview",
    "admin-control": "Manage Admins",
    "business-control": "Business Overview",
    "trainer-control": "Trainer Management",
    "student-control": "Student Management",
    "role-page-matrix": "Permissions",
    "audit-logs": "System Logs",
    "send-email": "Email Center",
  }[page];
}




