import React, { useState } from "react";
import { usePermissions } from "../context/PermissionContext";
import { useTheme } from "../context/ThemeContext";
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from "../constants/permissions";
import PageHeader from "../common/PageHeader";

const PERMISSION_GROUPS = {
  "User Management": [
    PERMISSIONS.VIEW_USERS, PERMISSIONS.CREATE_USER, PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER, PERMISSIONS.SUSPEND_USER, PERMISSIONS.ACTIVATE_USER,
  ],
  "Student Control": [
    PERMISSIONS.VIEW_STUDENTS, PERMISSIONS.MANAGE_STUDENTS,
    PERMISSIONS.VIEW_STUDENT_PROGRESS, PERMISSIONS.MANAGE_ENROLLMENTS,
    PERMISSIONS.MANAGE_CERTIFICATES,
  ],
  "Trainer Control": [
    PERMISSIONS.VIEW_TRAINERS, PERMISSIONS.MANAGE_TRAINERS,
    PERMISSIONS.APPROVE_TRAINER, PERMISSIONS.VIEW_TRAINER_PERFORMANCE,
  ],
  "Admin Control": [
    PERMISSIONS.VIEW_ADMINS, PERMISSIONS.MANAGE_ADMINS, PERMISSIONS.CREATE_ADMIN,
  ],
  "Course Management": [
    PERMISSIONS.VIEW_COURSES, PERMISSIONS.CREATE_COURSE, PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.DELETE_COURSE, PERMISSIONS.MANAGE_CATEGORIES,
  ],
  "Content": [
    PERMISSIONS.UPLOAD_VIDEOS, PERMISSIONS.MANAGE_RESOURCES, PERMISSIONS.VIEW_CONTENT,
  ],
  "Live Sessions": [
    PERMISSIONS.CREATE_LIVE_SESSION, PERMISSIONS.JOIN_LIVE_SESSION,
    PERMISSIONS.MANAGE_LIVE_SESSIONS,
  ],
  "Analytics & Reports": [
    PERMISSIONS.VIEW_ANALYTICS, PERMISSIONS.VIEW_REPORTS, PERMISSIONS.EXPORT_REPORTS,
  ],
  "Finance": [
    PERMISSIONS.VIEW_REVENUE, PERMISSIONS.MANAGE_PAYMENTS,
  ],
  "Settings & Security": [
    PERMISSIONS.VIEW_SETTINGS, PERMISSIONS.MANAGE_SETTINGS, PERMISSIONS.MANAGE_SECURITY,
    PERMISSIONS.MANAGE_ROLES, PERMISSIONS.MANAGE_PERMISSIONS,
  ],
  "Assignments & Quizzes": [
    PERMISSIONS.CREATE_ASSIGNMENT, PERMISSIONS.MANAGE_ASSIGNMENTS,
    PERMISSIONS.CREATE_QUIZ, PERMISSIONS.MANAGE_QUIZZES, PERMISSIONS.ATTEMPT_QUIZ,
  ],
  "Batches": [
    PERMISSIONS.MANAGE_BATCHES, PERMISSIONS.VIEW_BATCHES,
  ],
  "Notifications": [
    PERMISSIONS.SEND_NOTIFICATIONS, PERMISSIONS.VIEW_NOTIFICATIONS,
  ],
};

const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    label: "Admin",
    desc: "Platform administrators",
    dot: "#6366f1",
    accentColor: "#6366f1",
    accentBg:     { dark: "rgba(99,102,241,0.12)",  light: "#eef2ff" },
    accentBorder: { dark: "rgba(99,102,241,0.35)",  light: "#a5b4fc" },
    accentText:   { dark: "#818cf8",                light: "#4338ca" },
    permBg:       { dark: "rgba(99,102,241,0.1)",   light: "#eef2ff" },
    permText:     { dark: "#818cf8",                light: "#4338ca" },
    toggleOn: "#6366f1",
    bar: "#6366f1",
  },
  [ROLES.TRAINER]: {
    label: "Trainer",
    desc: "Course instructors",
    dot: "#8b5cf6",
    accentColor: "#8b5cf6",
    accentBg:     { dark: "rgba(139,92,246,0.12)", light: "#f5f3ff" },
    accentBorder: { dark: "rgba(139,92,246,0.35)", light: "#c4b5fd" },
    accentText:   { dark: "#a78bfa",               light: "#5b21b6" },
    permBg:       { dark: "rgba(139,92,246,0.1)",  light: "#f5f3ff" },
    permText:     { dark: "#a78bfa",               light: "#5b21b6" },
    toggleOn: "#8b5cf6",
    bar: "#8b5cf6",
  },
  [ROLES.STUDENT]: {
    label: "Student",
    desc: "Enrolled learners",
    dot: "#3b82f6",
    accentColor: "#3b82f6",
    accentBg:     { dark: "rgba(59,130,246,0.12)", light: "#eff6ff" },
    accentBorder: { dark: "rgba(59,130,246,0.35)", light: "#93c5fd" },
    accentText:   { dark: "#60a5fa",               light: "#1d4ed8" },
    permBg:       { dark: "rgba(59,130,246,0.1)",  light: "#eff6ff" },
    permText:     { dark: "#60a5fa",               light: "#1d4ed8" },
    toggleOn: "#3b82f6",
    bar: "#3b82f6",
  },
};

const formatPermission = (p) =>
  p.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getTokens = (dark) => ({
  pageBg: "transparent",
  titleText:       dark ? "#f1f5f9" : "#0f172a",   // ← FIXED: stronger black in light mode
  subtitleText:    dark ? "#94a3b8" : "#64748b",
  labelText:       dark ? "#94a3b8" : "#475569",
  mutedText:       dark ? "#64748b" : "#94a3b8",
  bodyText:        dark ? "#e2e8f0" : "#1e293b",
  roleBtnBg:       dark ? "rgba(255,255,255,0.04)" : "#ffffff",
  roleBtnBorder:   dark ? "rgba(255,255,255,0.09)" : "#e2e8f0",
  roleBtnShadow:   dark ? "none"                   : "0 1px 3px rgba(0,0,0,0.06)",
  roleBtnSubText:  dark ? "#64748b"                : "#64748b",
  superBg:         dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
  superBorder:     dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
  superTitleText:  dark ? "#94a3b8"                : "#475569",
  superSubText:    dark ? "#475569"                : "#94a3b8",
  summaryBg:       dark ? "rgba(255,255,255,0.04)" : "#ffffff",
  summaryBorder:   dark ? "rgba(255,255,255,0.09)" : "#e2e8f0",
  summaryShadow:   dark ? "none"                   : "0 1px 3px rgba(0,0,0,0.06)",
  progressTrack:   dark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
  cardBg:          dark ? "rgba(255,255,255,0.03)" : "#ffffff",
  cardBorder:      dark ? "rgba(255,255,255,0.09)" : "#e2e8f0",
  cardShadow:      dark ? "none"                   : "0 1px 3px rgba(0,0,0,0.06)",
  groupHeaderBg:   dark ? "rgba(255,255,255,0.04)" : "#f8fafc",
  groupHeaderBorder: dark ? "rgba(255,255,255,0.07)" : "#e2e8f0",
  groupTitleText:  dark ? "#f1f5f9"                : "#1e293b",
  groupCountText:  dark ? "#64748b"                : "#94a3b8",
  permInactiveText:    dark ? "#64748b"                : "#475569",
  permHoverBg:         dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
  checkBorderInactive: dark ? "rgba(255,255,255,0.2)"  : "#cbd5e1",
  checkBgInactive:     dark ? "transparent"             : "#ffffff",
  toggleOff:     dark ? "rgba(255,255,255,0.12)" : "#cbd5e1",
  togglePartial: dark ? "#475569"                : "#94a3b8",
  resetText:     dark ? "#94a3b8" : "#475569",
  resetHoverBg:  dark ? "rgba(255,255,255,0.07)" : "#f1f5f9",
  resetBorder:   dark ? "rgba(255,255,255,0.1)"  : "#e2e8f0",
});

const PermissionManagerPage = () => {
  const { getRolePermissions, updateRolePermissions } = usePermissions();
  const { dark } = useTheme();

  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [localPerms, setLocalPerms]     = useState(() => getRolePermissions(ROLES.ADMIN));
  const [saved, setSaved]               = useState(false);
  const [resetHover, setResetHover]     = useState(false);

  const tk   = getTokens(dark);
  const cfg  = ROLE_CONFIG[selectedRole];
  const mode = dark ? "dark" : "light";
  const totalPerms = Object.values(PERMISSIONS).length;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setLocalPerms(getRolePermissions(role));
    setSaved(false);
  };
  const togglePerm = (perm) => {
    setLocalPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
    setSaved(false);
  };
  const toggleGroup = (groupPerms) => {
    const allOn = groupPerms.every((p) => localPerms.includes(p));
    setLocalPerms((prev) =>
      allOn
        ? prev.filter((p) => !groupPerms.includes(p))
        : [...new Set([...prev, ...groupPerms])]
    );
    setSaved(false);
  };
  const handleSave = () => {
    updateRolePermissions(selectedRole, localPerms);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handleReset = () => {
    setLocalPerms(ROLE_PERMISSIONS[selectedRole] || []);
    setSaved(false);
  };

  return (
    <div style={{ background: tk.pageBg }}>

      <PageHeader
        // ── ONLY CHANGE: wrap title in a span with explicit color ──
        title={
          <span style={{ color: tk.titleText }}>
            Permission Manager
          </span>
        }
        subtitle="Control which roles can access what features across the platform"
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={handleReset}
              onMouseEnter={() => setResetHover(true)}
              onMouseLeave={() => setResetHover(false)}
              style={{
                padding: "7px 14px",
                fontSize: "13px",
                fontWeight: 500,
                borderRadius: "8px",
                border: `1px solid ${tk.resetBorder}`,
                cursor: "pointer",
                transition: "all 0.15s",
                color: tk.resetText,
                background: resetHover ? tk.resetHoverBg : "transparent",
              }}
            >
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 18px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s",
                background: saved ? "#10b981" : "#8b5cf6",
                color: "#ffffff",
              }}
            >
              {saved ? (
                <>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth={2.5}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Saved!
                </>
              ) : "Save Changes"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: tk.labelText, marginBottom: "4px",
          }}>
            Select Role
          </p>

          <div style={{
            borderRadius: "12px",
            border: `1px solid ${tk.superBorder}`,
            background: tk.superBg,
            padding: "12px 16px",
            opacity: 0.65,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8b5cf6" }} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: tk.superTitleText }}>
                Super Admin
              </span>
            </div>
            <p style={{ fontSize: "12px", marginTop: "4px", color: tk.superSubText }}>
              Full access — cannot be restricted
            </p>
          </div>

          {Object.entries(ROLE_CONFIG).map(([role, rc]) => {
            const isActive = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderRadius: "12px",
                  border: `1px solid ${isActive ? rc.accentBorder[mode] : tk.roleBtnBorder}`,
                  background: isActive ? rc.accentBg[mode] : tk.roleBtnBg,
                  padding: "12px 16px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: isActive ? "none" : tk.roleBtnShadow,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: rc.dot }} />
                  <span style={{ fontSize: "14px", fontWeight: 600, color: tk.bodyText }}>
                    {rc.label}
                  </span>
                </div>
                <p style={{ fontSize: "12px", marginTop: "4px", color: tk.roleBtnSubText }}>
                  {rc.desc}
                </p>
                <p style={{ fontSize: "12px", marginTop: "6px", fontWeight: 600,
                            color: rc.accentText[mode] }}>
                  {getRolePermissions(role).length}/{totalPerms} permissions
                </p>
              </button>
            );
          })}

          <div style={{
            marginTop: "4px",
            borderRadius: "12px",
            border: `1px solid ${tk.summaryBorder}`,
            background: tk.summaryBg,
            padding: "14px 16px",
            boxShadow: tk.summaryShadow,
          }}>
            <p style={{ fontSize: "12px", color: tk.labelText, marginBottom: "8px" }}>
              Selected:{" "}
              <span style={{ fontWeight: 700, color: cfg.accentText[mode] }}>
                {cfg.label}
              </span>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                flex: 1, borderRadius: "999px", height: "7px",
                background: tk.progressTrack, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: "999px",
                  background: cfg.bar,
                  width: `${(localPerms.length / totalPerms) * 100}%`,
                  transition: "width 0.5s ease",
                }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: tk.bodyText }}>
                {localPerms.length}
              </span>
            </div>
            <p style={{ fontSize: "12px", marginTop: "4px", color: tk.mutedText }}>
              {localPerms.length} of {totalPerms} permissions enabled
            </p>
          </div>
        </div>

        <div
          className="lg:col-span-3"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
            const enabledInGroup = perms.filter((p) => localPerms.includes(p)).length;
            const allOn  = enabledInGroup === perms.length;
            const someOn = enabledInGroup > 0 && !allOn;

            const toggleBg = allOn
              ? cfg.toggleOn
              : someOn ? tk.togglePartial : tk.toggleOff;

            return (
              <div
                key={group}
                style={{
                  borderRadius: "12px",
                  border: `1px solid ${tk.cardBorder}`,
                  background: tk.cardBg,
                  overflow: "hidden",
                  boxShadow: tk.cardShadow,
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 16px",
                  background: tk.groupHeaderBg,
                  borderBottom: `1px solid ${tk.groupHeaderBorder}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      fontSize: "13px", fontWeight: 600,
                      color: tk.groupTitleText,
                    }}>
                      {group}
                    </span>
                    <span style={{ fontSize: "11px", color: tk.groupCountText }}>
                      {enabledInGroup}/{perms.length}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleGroup(perms)}
                    style={{
                      width: "38px", height: "20px",
                      borderRadius: "999px",
                      background: toggleBg,
                      border: "none", cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <span style={{
                      position: "absolute",
                      top: "2px",
                      left: allOn ? "20px" : "2px",
                      width: "16px", height: "16px",
                      borderRadius: "50%",
                      background: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                      transition: "left 0.2s",
                      display: "block",
                    }} />
                  </button>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
                  gap: "2px",
                  padding: "10px",
                }}>
                  {perms.map((perm) => {
                    const on = localPerms.includes(perm);
                    return (
                      <button
                        key={perm}
                        onClick={() => togglePerm(perm)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          padding: "7px 10px",
                          borderRadius: "7px",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontSize: "12px",
                          fontWeight: 500,
                          lineHeight: 1.3,
                          transition: "all 0.12s",
                          background: on ? cfg.permBg[mode] : "transparent",
                          color: on ? cfg.permText[mode] : tk.permInactiveText,
                        }}
                        onMouseEnter={(e) => {
                          if (!on) e.currentTarget.style.background = tk.permHoverBg;
                        }}
                        onMouseLeave={(e) => {
                          if (!on) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div style={{
                          width: "14px", height: "14px",
                          borderRadius: "3px",
                          border: `1.5px solid ${on ? cfg.accentColor : tk.checkBorderInactive}`,
                          background: on ? cfg.accentColor : tk.checkBgInactive,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.12s",
                        }}>
                          {on && (
                            <svg width={8} height={8} viewBox="0 0 24 24"
                                 fill="none" stroke="white" strokeWidth={3.5}>
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                        <span>{formatPermission(perm)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PermissionManagerPage;