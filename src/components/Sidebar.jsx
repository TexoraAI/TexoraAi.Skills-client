/**
 * Sidebar.jsx  (Updated)
 *
 * ✅ useAvatarContext se profileImage read karta hai
 * ✅ Image upload hone par user-card avatar instantly update
 * ✅ Fallback: image nahi hai toh initials + gradient background
 * ✅ Existing UI/styling/colors — kuch nahi badla
 */

import React from "react";
import {
  LayoutDashboard, GraduationCap, Video, FileText, FolderOpen,
  BookOpen, ClipboardCheck, ClipboardEdit, History, CalendarDays,
  MessageCircleQuestion, Award, Users, UserCog, ShieldCheck, BarChart3,
  Activity, TrendingUp, LineChart, Briefcase, Building2, Layers, Target,
  DollarSign, Receipt, Settings, Mail, FileSearch, ChevronDown,
  Sun, Moon, LogOut, Radio, PlayCircle, Mic, Upload,
  List, Star, Menu,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../auth";
import { Phone } from "lucide-react";

// ✅ Shared AvatarContext se import
import { useAvatarContext } from "../context/AvatarContext";

/* ================================================================
   MENUS — NO CHANGES
================================================================ */
const studentMenus = [
  { name: "Dashboard", path: "/student", icon: LayoutDashboard },
  {
    name: "Live & Recorded", icon: Radio,
    children: [
      { name: "Live Classes",     path: "/student/live-classes",     icon: Radio },
      { name: "Call Trainer",     path: "/student/call-trainer",     icon: Phone },
      { name: "Recorded Classes", path: "/student/recorded-classes", icon: PlayCircle },
    ],
  },
  {
    name: "Learning Materials", icon: GraduationCap,
    children: [
      { name: "Video Lectures", path: "/student/videos",    icon: Video },
      { name: "Documents",      path: "/student/documents", icon: FileText },
    ],
  },
  {
    name: "My Courses", icon: BookOpen,
    children: [
      { name: "My Courses",      path: "/student/courses",      icon: BookOpen },
      { name: "Assessments",     path: "/student/assessments",  icon: ClipboardCheck },
      { name: "Assignments",     path: "/student/assignments",  icon: ClipboardEdit },
      { name: "My Quiz History", path: "/student/my-quizzes",   icon: History },
      { name: "Attendance",      path: "/student/attendance",   icon: CalendarDays },
      { name: "Doubts",          path: "/student/doubts",       icon: MessageCircleQuestion },
      { name: "Certificates",    path: "/student/certificates", icon: Award },
    ],
  },
];

const trainerMenus = [
  { name: "Dashboard",        path: "/trainer",         icon: LayoutDashboard },
  { name: "Batch Management", path: "/trainer/batches", icon: Layers },
  {
    name: "Content Management", icon: FileText,
    children: [
      { name: "Upload Videos",      path: "/trainer/upload-videos",      icon: Video },
      // { name: "Upload Documents",   path: "/trainer/upload-docs",        icon: FileText },
      // { name: "Create Quiz",        path: "/trainer/create-quiz",        icon: ClipboardEdit },
      // { name: "My Quizzes",         path: "/trainer/my-quizzes",         icon: ClipboardCheck },
      // { name: "Create Assignments", path: "/trainer/create-assignments", icon: ClipboardEdit },
      { name: "Course Management",  path: "/trainer/course-management",  icon: BookOpen },
      { name: "Assessments",        path: "/trainer/assessments",        icon: ClipboardCheck },
      { name: "Attendance",         path: "/trainer/attendance",         icon: CalendarDays },
      { name: "Doubts Management",  path: "/trainer/doubts-management",  icon: MessageCircleQuestion },
    ],
  },
  {
    name: "Live Classes", icon: Video,
    children: [
      { name: "Live Dashboard",         path: "/trainer/live",            icon: LayoutDashboard },
      { name: "Start Live Session",     path: "/trainer/start-live",      icon: Video },
      { name: "Join Call",              path: "/trainer/join-call",       icon: Phone },
      { name: "Live Session History",   path: "/trainer/live-history",    icon: History },
      { name: "Live Attendance Report", path: "/trainer/live-attendance", icon: Users },
    ],
  },
  {
    name: "Recorded Classes", icon: PlayCircle,
    children: [
      { name: "Upload Recorded Video", path: "/trainer/upload-recorded", icon: Upload },
      { name: "Recorded Classes List", path: "/trainer/recorded-list",   icon: List },
    ],
  },
  {
    name: "Reports & Analytics", icon: BarChart3,
    children: [
      { name: "Student Reports",      path: "/trainer/student-reports", icon: FileSearch },
      { name: "Batch Reports",        path: "/trainer/batch-reports",   icon: FileText },
      { name: "Performance Analysis", path: "/trainer/performance",     icon: TrendingUp },
    ],
  },
];

const adminMenus = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  {
    name: "Organisation Manager", icon: Building2,
    children: [
      { name: "Department List", path: "/admin/departmentlist", icon: Layers },
    ],
  },
  {
    name: "User Management", icon: Users,
    children: [
      { name: "All Users", path: "/admin/users", icon: Users },
    ],
  },
  {
    name: "Course Management", icon: BookOpen,
    children: [
      { name: "All Courses", path: "/admin/courses", icon: BookOpen },
    ],
  },
  {
    name: "Free Learning Hub", icon: GraduationCap,
    children: [
      { name: "Upload Course",          path: "/admin/course-upload",          icon: Upload },
      // { name: "Upload Featured Course", path: "/admin/featured-course-upload", icon: Star },
    ],
  },
  {
    name: "Live & Recorded Control", icon: Video,
    children: [
      { name: "Admin Live Sessions", path: "/admin/live-sessions", icon: Radio },
    ],
  },
  {
    name: "Document Generator", icon: FileText,
    children: [
      { name: "Certificates", path: "/admin/certificates", icon: Award },
      { name: "Reports",      path: "/admin/reports",      icon: FileText },
    ],
  },
  {
    name: "Insight Review", icon: BarChart3,
    children: [
      { name: "Usage Analytics", path: "/admin/usage",    icon: LineChart },
      { name: "Feedback",        path: "/admin/feedback", icon: MessageCircleQuestion },
      { name: "Settings",        path: "/admin/settings", icon: Settings },
    ],
  },
];

const superAdminMenus = [
  { name: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  {
    name: "Controls", icon: ShieldCheck,
    children: [
      { name: "Manager",      path: "/super-admin/Manager",      icon: UserCog },
      { name: "Tenant Admin", path: "/super-admin/Tenant Admin", icon: Briefcase },
      { name: "Trainer",      path: "/super-admin/trainer",      icon: Users },
      { name: "Student",      path: "/super-admin/student",      icon: GraduationCap },
    ],
  },
  {
    name: "Settings", icon: Settings,
    children: [
      { name: "Role Page Matrix", path: "/super-admin/settings/role-matrix", icon: ShieldCheck },
      { name: "Send Email",       path: "/super-admin/settings/send-email",  icon: Mail },
      { name: "Audit Logs",       path: "/super-admin/settings/audit-logs",  icon: FileSearch },
    ],
  },
];

const businessMenus = [
  { name: "Dashboard", path: "/business", icon: LayoutDashboard },
  {
    name: "Hiring Manager", icon: Briefcase,
    children: [
      { name: "Job Openings", path: "/business/jobs",         icon: Briefcase },
      { name: "Applications", path: "/business/applications", icon: ClipboardCheck },
    ],
  },
  {
    name: "Lead Management", icon: Target,
    children: [
      { name: "All Leads",  path: "/business/leads",     icon: Users },
      { name: "Follow Ups", path: "/business/followups", icon: TrendingUp },
    ],
  },
  {
    name: "Enrollments", icon: BookOpen,
    children: [
      { name: "New Enrollments", path: "/business/enrollments", icon: BookOpen },
      { name: "Renewals",        path: "/business/renewals",    icon: BookOpen },
    ],
  },
  {
    name: "Financial", icon: DollarSign,
    children: [
      { name: "Invoices", path: "/business/invoices", icon: Receipt },
      { name: "Payments", path: "/business/payments", icon: DollarSign },
    ],
  },
  {
    name: "Marketing", icon: BarChart3,
    children: [
      { name: "Campaigns", path: "/business/campaigns", icon: Activity },
      { name: "Sources",   path: "/business/sources",   icon: FolderOpen },
    ],
  },
  {
    name: "Team Targets", icon: Target,
    children: [
      { name: "Targets",     path: "/business/targets",     icon: Target },
      { name: "Performance", path: "/business/performance", icon: TrendingUp },
    ],
  },
];

const roleConfig = {
  student:    { label: "Student"      },
  trainer:    { label: "Trainer"      },
  admin:      { label: "Manager"      },
  business:   { label: "Tenant Admin" },
  superAdmin: { label: "Super Admin"  },
};

/* ================================================================
   SIDEBAR
================================================================ */
const Sidebar = () => {
  const location = useNavigate ? useLocation() : { pathname: "/" };
  const navigate  = useNavigate();

  // ✅ Global avatar state
  const { profileImage } = useAvatarContext();

  const isTrainer    = location.pathname.startsWith("/trainer");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBusiness   = location.pathname.startsWith("/business");
  const isSuperAdmin = location.pathname.startsWith("/super-admin");

  let menus   = studentMenus;
  let roleKey = "student";
  if (isSuperAdmin)      { menus = superAdminMenus; roleKey = "superAdmin"; }
  else if (isTrainer)    { menus = trainerMenus;    roleKey = "trainer";    }
  else if (isAdminRoute) { menus = adminMenus;      roleKey = "admin";      }
  else if (isBusiness)   { menus = businessMenus;   roleKey = "business";   }

  const role = roleConfig[roleKey];

  const [collapsed,  setCollapsed]  = React.useState(false);
  const [openGroups, setOpenGroups] = React.useState({});
  const [dark,       setDark]       = React.useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const currentRole      = localStorage.getItem("role");
  const showRoleDropdown = currentRole === "ADMIN";
  const currentRolePath  = isSuperAdmin  ? "/super-admin/dashboard"
    : isAdminRoute ? "/admin"
    : isTrainer    ? "/trainer"
    : isBusiness   ? "/business"
    : "/student";

  const userName = localStorage.getItem("userName") || "User";
  const initials  = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .sidebar-root[data-dark="true"]  { background: #000000; border-right: 1px solid #1a1a1a; }
        .sidebar-root[data-dark="false"] { background: #ffffff; border-right: 1px solid #e2e8f0; }

        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        [data-dark="true"]  .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius:10px; }
        [data-dark="false"] .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius:10px; }

        .nav-item {
          width: 100%; display: flex; align-items: center;
          padding: 7px 10px; border-radius: 9px; font-size: 13px;
          font-weight: 500; transition: all 0.15s ease; cursor: pointer;
          border: none; background: transparent; text-align: left; gap: 0;
        }
        [data-dark="false"] .nav-item              { color: #374151; }
        [data-dark="false"] .nav-item:hover        { color: #1d4ed8; background: #eff6ff; }
        [data-dark="false"] .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
        [data-dark="false"] .nav-item.group-active { color: #1d4ed8; font-weight: 600; }
        [data-dark="true"]  .nav-item              { color: #a1a1aa; }
        [data-dark="true"]  .nav-item:hover        { color: #ffffff; background: rgba(255,255,255,0.07); }
        [data-dark="true"]  .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.4); }
        [data-dark="true"]  .nav-item.group-active { color: #60a5fa; font-weight: 600; }

        .icon-box {
          width: 28px; height: 28px; display: flex; align-items: center;
          justify-content: center; border-radius: 7px; flex-shrink: 0; transition: background 0.15s;
        }
        [data-dark="false"] .icon-box                  { background: #f1f5f9; color: #64748b; }
        [data-dark="false"] .nav-item:hover .icon-box  { background: #dbeafe; color: #1d4ed8; }
        [data-dark="false"] .nav-item.active .icon-box { background: rgba(255,255,255,0.20); color: #ffffff; }
        [data-dark="true"]  .icon-box                  { background: rgba(255,255,255,0.08); color: #71717a; }
        [data-dark="true"]  .nav-item:hover .icon-box  { background: rgba(255,255,255,0.12); color: #93c5fd; }
        [data-dark="true"]  .nav-item.active .icon-box { background: rgba(255,255,255,0.20); color: #ffffff; }

        .child-item {
          width: 100%; display: flex; align-items: center;
          gap: 7px; padding: 6px 10px; border-radius: 7px;
          font-size: 12px; font-weight: 500; transition: all 0.14s ease;
          cursor: pointer; border: none; background: transparent; text-align: left;
        }
        [data-dark="false"] .child-item        { color: #6b7280; }
        [data-dark="false"] .child-item:hover  { color: #1d4ed8; background: #eff6ff; }
        [data-dark="false"] .child-item.active { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 1px 6px rgba(37,99,235,0.2); }
        [data-dark="true"]  .child-item        { color: #71717a; }
        [data-dark="true"]  .child-item:hover  { color: #e4e4e7; background: rgba(255,255,255,0.06); }
        [data-dark="true"]  .child-item.active { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 1px 6px rgba(37,99,235,0.4); }

        [data-dark="false"] .child-connector { border-left: 2px solid #dbeafe; }
        [data-dark="true"]  .child-connector { border-left: 2px solid rgba(59,130,246,0.20); }
        .child-connector {
          margin-left: 20px; padding-left: 8px;
          margin-top: 2px; margin-bottom: 2px;
          display: flex; flex-direction: column; gap: 1px;
        }

        .role-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
        }
        [data-dark="false"] .role-badge { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
        [data-dark="true"]  .role-badge { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.22); }

        .role-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e; box-shadow: 0 0 5px #22c55e;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }

        [data-dark="false"] .sidebar-header { border-bottom: 1px solid #e2e8f0; }
        [data-dark="true"]  .sidebar-header { border-bottom: 1px solid #1a1a1a; }
        [data-dark="false"] .sidebar-footer { border-top: 1px solid #e2e8f0; }
        [data-dark="true"]  .sidebar-footer { border-top: 1px solid #1a1a1a; }
        .sidebar-header { padding: 12px 10px; }
        .sidebar-footer { padding: 8px; }

        .collapse-btn {
          padding: 6px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          border: none; transition: all 0.15s;
        }
        [data-dark="false"] .collapse-btn       { background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; }
        [data-dark="false"] .collapse-btn:hover { background: #dbeafe; color: #1d4ed8; border-color: #bfdbfe; }
        [data-dark="true"]  .collapse-btn       { background: rgba(255,255,255,0.07); border: 1px solid #1a1a1a; color: #71717a; }
        [data-dark="true"]  .collapse-btn:hover { background: rgba(255,255,255,0.12); color: #60a5fa; border-color: rgba(59,130,246,0.3); }

        [data-dark="false"] .logo-sub { color: #111827; }
        [data-dark="true"]  .logo-sub { color: #ffffff; }
        [data-dark="false"] .logo-icon-box { background: #dbeafe; border: 1px solid #bfdbfe; }
        [data-dark="true"]  .logo-icon-box { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.22); }

        .user-card {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 8px; border-radius: 10px;
        }
        [data-dark="false"] .user-card { background: #f8fafc; border: 1px solid #e2e8f0; }
        [data-dark="true"]  .user-card { background: rgba(255,255,255,0.05); border: 1px solid #1a1a1a; }

        /* ✅ user-avatar: image hai toh overflow hidden, nahi toh gradient */
        .user-avatar {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
          background: linear-gradient(135deg, #2563eb, #6366f1);
          overflow: hidden;
        }
        .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

        [data-dark="false"] .user-name       { color: #0f172a; }
        [data-dark="true"]  .user-name       { color: #ffffff; }
        [data-dark="false"] .user-role-label { color: #94a3b8; }
        [data-dark="true"]  .user-role-label { color: #52525b; }

        .logout-btn {
          padding: 5px; border-radius: 7px; border: none;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; margin-left: auto;
          background: transparent; transition: all 0.15s;
        }
        [data-dark="false"] .logout-btn       { color: #94a3b8; }
        [data-dark="false"] .logout-btn:hover { background: #fee2e2; color: #ef4444; }
        [data-dark="true"]  .logout-btn       { color: #52525b; }
        [data-dark="true"]  .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }

        .theme-btn {
          width: 100%; display: flex; align-items: center; gap: 8px;
          padding: 6px 8px; border-radius: 8px; font-size: 12px; font-weight: 500;
          background: transparent; border: none; cursor: pointer;
          transition: all 0.15s; margin-bottom: 4px;
        }
        [data-dark="false"] .theme-btn       { color: #64748b; }
        [data-dark="false"] .theme-btn:hover { background: #f1f5f9; color: #1e293b; }
        [data-dark="true"]  .theme-btn       { color: #52525b; }
        [data-dark="true"]  .theme-btn:hover { background: rgba(255,255,255,0.06); color: #ffffff; }

        .theme-icon-box {
          width: 26px; height: 26px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        [data-dark="false"] .theme-icon-box { background: #f1f5f9; border: 1px solid #e2e8f0; }
        [data-dark="true"]  .theme-icon-box { background: rgba(255,255,255,0.07); border: 1px solid #1a1a1a; }

        [data-dark="false"] .chevron                          { color: #cbd5e1; }
        [data-dark="true"]  .chevron                          { color: #3f3f46; }
        [data-dark="false"] .nav-item.group-active .chevron   { color: #2563eb; }
        [data-dark="true"]  .nav-item.group-active .chevron   { color: #60a5fa; }

        .role-select {
          width: 100%; font-size: 11px; border-radius: 8px;
          padding: 5px 8px; outline: none; cursor: pointer; font-weight: 500;
        }
        [data-dark="false"] .role-select        { border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; }
        [data-dark="false"] .role-select option { background: #ffffff; color: #374151; }
        [data-dark="true"]  .role-select        { border: 1px solid rgba(59,130,246,0.2); background: rgba(255,255,255,0.05); color: #93c5fd; }
        [data-dark="true"]  .role-select option { background: #000000; color: #e4e4e7; }

        .nav-label {
          flex: 1; text-align: left;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          margin-left: 9px;
        }
      `}</style>

      <aside
        className="sidebar-root"
        data-dark={String(dark)}
        style={{
          width: collapsed ? "58px" : "234px",
          transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          zIndex: 40,
        }}
      >
        {/* ── HEADER ── */}
        <div className="sidebar-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "9px" }}>
              <div className="logo-icon-box" style={{
                width: 33, height: 33, borderRadius: 9,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <GraduationCap size={16} color="#2563eb" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p className="text-[16px] font-extrabold font-serif leading-none whitespace-nowrap">
                  <span className="text-green-600">ILM</span>
                  <span className="text-orange-500 ml-1">ORA</span>
                </p>
                <p className="logo-sub" style={{ fontSize: 8, marginTop: 2, letterSpacing: "0.05em", margin: 0 }}>
                  Intelligent Learning Management
                </p>
              </div>
            </div>
          )}
          <button
            className="collapse-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={collapsed ? { margin: "0 auto" } : {}}
          >
            <Menu size={15} />
          </button>
        </div>

        {/* ── ROLE BADGE ── */}
        {!collapsed && (
          <div style={{ padding: "7px 10px 3px" }}>
            <span className="role-badge">
              <span className="role-dot" />
              {role.label}
            </span>
          </div>
        )}

        {/* ── ROLE SWITCHER ── */}
        {showRoleDropdown && !collapsed && (
          <div style={{ padding: "4px 10px 6px" }}>
            <select className="role-select" value={currentRolePath} onChange={e => navigate(e.target.value)}>
              <option value="/student">Student</option>
              <option value="/trainer">Trainer</option>
              <option value="/admin">Manager</option>
              <option value="/business">Tenant Admin</option>
              <option value="/super-admin/dashboard">Super Admin</option>
            </select>
          </div>
        )}

        {/* ── NAV ── */}
        <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", padding: "6px 7px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {menus.map((item) => {
            const Icon   = item.icon;
            const isOpen = openGroups[item.name] ?? false;

            if (item.children) {
              const isGroupActive = item.children.some(c => location.pathname === c.path);
              return (
                <div key={item.name}>
                  <button
                    className={`nav-item ${isGroupActive ? "group-active" : ""}`}
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false);
                        setOpenGroups(p => ({ ...p, [item.name]: true }));
                      } else {
                        setOpenGroups(p => ({ ...p, [item.name]: !isOpen }));
                      }
                    }}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className="icon-box"><Icon size={14} /></span>
                    {!collapsed && (
                      <>
                        <span className="nav-label">{item.name}</span>
                        <ChevronDown
                          size={13}
                          className="chevron"
                          style={{
                            flexShrink: 0,
                            transition: "transform 0.2s",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && isOpen && (
                    <div className="child-connector">
                      {item.children.map(child => {
                        const active    = location.pathname === child.path;
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.name}
                            className={`child-item ${active ? "active" : ""}`}
                            onClick={() => navigate(child.path)}
                          >
                            <ChildIcon size={12} style={{ flexShrink: 0 }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {child.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const active = location.pathname === item.path;
            return (
              <button
                key={item.name}
                className={`nav-item ${active ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.name : undefined}
              >
                <span className="icon-box"><Icon size={14} /></span>
                {!collapsed && <span className="nav-label">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* ── FOOTER ── */}
        <div className="sidebar-footer">
          <button className="theme-btn" onClick={toggleTheme}>
            <span className="theme-icon-box">
              {dark ? <Sun size={13} color="#3b82f6" /> : <Moon size={13} color="#64748b" />}
            </span>
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* ✅ User card — profileImage hai toh photo, nahi toh initials */}
          <div className="user-card">
            <div className="user-avatar">
              {profileImage
                ? <img src={profileImage} alt="Profile" />
                : initials
              }
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <p className="user-name" style={{ fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>
                    {userName}
                  </p>
                  <p className="user-role-label" style={{ fontSize: 10, margin: 0, lineHeight: 1.3 }}>
                    {role.label}
                  </p>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Logout">
                  <LogOut size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;








































