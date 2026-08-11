import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  GitBranch,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ClipboardEdit,
  DollarSign,
  FileCode2,
  FileSearch,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Layers,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageCircleQuestion,
  MessageSquare,
  NotebookPen,
  PanelTop,
  PlayCircle,
  Radio,
  Receipt,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  Users,
  Video,
  Headphones,
} from "lucide-react";
import React from "react";
import { Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../auth";
import userService from "../services/userService";
import { useAvatarContext } from "../context/AvatarContext";

/* ================================================================
   ILM DEMO SIDEBAR — used ONLY by IlmOraDemoPage.jsx.

   Visual style rebuilt to match the reference screenshot exactly:
     - plain white sidebar, no dark-mode variant
     - logo block with "<ROLE> PORTAL" subtitle under ILM ORA
     - flat nav items, bold dark label + icon, chevron-right for groups
     - active item = light peach background + orange text/icon
     - no footer (no theme toggle, no user card, no logout) — the
       screenshot's dark-mode toggle / avatar live in the top navbar,
       not in this sidebar
================================================================ */
const SIDEBAR_WIDTHS = {
  full: 280,
  icon: 72,
  hidden: 0,
};

/* ================================================================
   MENUS — identical to Sidebar.jsx
================================================================ */
const studentMenus = [
  {
    name: "Dashboard",
    path: "/student",
    icon: LayoutDashboard,
  },

  {
    name: "Workspace",
    path: "/student/workspace",
    icon: Video,
  },

  // ================= Learning =================
  {
    name: "Learning",
    icon: GraduationCap,
    children: [
      {
        name: "My Courses",
        path: "/student/courses",
        icon: BookOpen,
      },
      {
        name: "Video Lectures",
        path: "/student/videos",
        icon: Video,
      },
      {
        name: "Documents",
        path: "/student/documents",
        icon: FileText,
      },
      {
        name: "Assignments",
        path: "/student/assignments",
        icon: ClipboardEdit,
      },
      {
        name: "Assessments",
        path: "/student/assessments",
        icon: ClipboardCheck,
      },
      {
        name: "Quiz History",
        path: "/student/my-quizzes",
        icon: History,
      },
      {
        name: "Attendance",
        path: "/student/attendance",
        icon: CalendarDays,
      },
    ],
  },

  // ================= Meetings =================
  {
    name: "Meetings",
    icon: Radio,
    children: [
      {
        name: "Live Classes",
        path: "/student/live-classes",
        icon: Radio,
      },
      {
        name: "Recorded Classes",
        path: "/student/recorded-classes",
        icon: PlayCircle,
      },
    ],
  },

  // ================= Skill Growth =================
  {
    name: "Skill & Growth",
    icon: TrendingUp,
    children: [
      {
        name: "Skill Map",
        path: "/student/skill-map",
        icon: Brain,
      },
      {
        name: "Certificates",
        path: "/student/certificates",
        icon: Award,
      },
      {
        name: "Study Plan",
        path: "/student/study-plan",
        icon: CalendarDays,
      },
    ],
  },

  // ================= AI =================
  {
    name: "AI Tools",
    icon: Sparkles,
    children: [
      {
        name: "Notebook AI",
        path: "/student/notebook",
        icon: NotebookPen,
      },
      {
        name: "Resume Builder",
        path: "/student/resume-builder",
        icon: FileCode2,
      },
      {
        name: "Coding Lab",
        path: "/student/compiler",
        icon: FileText,
      },
    ],
  },

  // ================= Support =================
  {
    name: "Support",
    icon: MessageCircleQuestion,
    children: [
      {
        name: "Ask Doubts",
        path: "/student/doubts",
        icon: MessageCircleQuestion,
      },
      {
        name: "Feedback",
        path: "/student/feedback",
        icon: MessageSquare,
      },
    ],
  },
];

const trainerMenus = [
  { name: "Dashboard", path: "/trainer", icon: LayoutDashboard },
  { name: "Batch Management", path: "/trainer/batches", icon: Layers },
  { name: "WorkSpace", path: "/trainer/workspace", icon: Video },
  {
    name: "Content Management",
    icon: FileText,
    children: [
      { name: "Upload Videos", path: "/trainer/upload-videos", icon: Video },
      {
        name: "Course Management",
        path: "/trainer/course-management",
        icon: BookOpen,
      },
      {
        name: "Assessments",
        path: "/trainer/assessments",
        icon: ClipboardCheck,
      },
      { name: "Attendance", path: "/trainer/attendance", icon: CalendarDays },
      {
        name: "Doubts Management",
        path: "/trainer/doubts-management",
        icon: MessageCircleQuestion,
      },
      {
        name: "Feedback",
        path: "/trainer/feedback",
        icon: MessageCircleQuestion,
      },
    ],
  },
  {
    name: "Live Classes",
    icon: Video,
    children: [
      { name: "Live Dashboard", path: "/trainer/live", icon: LayoutDashboard },
      { name: "Whiteboard", path: "/trainer/whiteboard", icon: PanelTop },
      { name: "AI Companion", path: "/trainer/ai-companion", icon: Bot },
    ],
  },
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    children: [
      {
        name: "Student Reports",
        path: "/trainer/student-reports",
        icon: FileSearch,
      },
      { name: "Batch Reports", path: "/trainer/batch-reports", icon: FileText },
      {
        name: "Performance Analysis",
        path: "/trainer/performance",
        icon: TrendingUp,
      },
      {
        name: "Skill Analytics",
        path: "/trainer/skill-analytics",
        icon: Brain,
      },
      { name: "Coding Lab", path: "/trainer/compiler", icon: FileText },
      { name: "Study Plan", path: "/trainer/study-plan", icon: BookOpen },
    ],
  },
];

const adminMenus = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "WorkSpace", path: "/admin/workspace", icon: Video },
  {
    name: "Organisation Manager",
    icon: Building2,
    path: "/admin/organisation-overview",
  },
  {
    name: "Assessment System",
    icon: ClipboardCheck,
    path: "/admin/assessment-system",
  },
  {
    name: "Course Management",
    icon: BookOpen,
    children: [{ name: "All Courses", path: "/admin/courses", icon: BookOpen }],
  },
  {
    name: "Video Management",
    icon: Video,
    children: [{ name: "Admin Videos", path: "/admin/videos", icon: Video }],
  },
  {
    name: "File Management",
    icon: FileText,
    children: [{ name: "Admin Files", path: "/admin/files", icon: FileText }],
  },
  {
    name: "Live & Recorded Control",
    icon: Video,
    children: [
      {
        name: "Admin Live Sessions",
        path: "/admin/live-sessions",
        icon: Radio,
      },
    ],
  },
  {
    name: "Document Generator",
    icon: FileText,
    children: [
      { name: "Certificates", path: "/admin/certificates", icon: Award },
      { name: "Reports", path: "/admin/reports", icon: FileText },
    ],
  },
  {
    name: "Insight Review",
    icon: BarChart3,
    children: [
      { name: "Usage Analytics", path: "/admin/usage", icon: LineChart },
      { name: "Skill Analytics", path: "/admin/skill-analytics", icon: Brain },
      {
        name: "Feedback Review",
        path: "/admin/feedback-review",
        icon: MessageCircleQuestion,
      },
      { name: "Attendance", path: "/admin/attendance", icon: CalendarDays },
      { name: "Settings", path: "/admin/settings", icon: Settings },
    ],
  },
];

const businessMenus = [
  { name: "Dashboard", path: "/business", icon: LayoutDashboard },
  {
    name: "Hiring Manager",
    icon: Briefcase,
    children: [
      { name: "Job Openings", path: "/business/jobs", icon: Briefcase },
      {
        name: "Applications",
        path: "/business/applications",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    name: "Lead Management",
    icon: Target,
    children: [
      { name: "All Leads", path: "/business/leads", icon: Users },
      { name: "Follow Ups", path: "/business/followups", icon: TrendingUp },
    ],
  },
  {
    name: "Enrollments",
    icon: BookOpen,
    children: [
      {
        name: "New Enrollments",
        path: "/business/enrollments",
        icon: BookOpen,
      },
      { name: "Renewals", path: "/business/renewals", icon: BookOpen },
    ],
  },
  {
    name: "Financial",
    icon: DollarSign,
    children: [
      { name: "Invoices", path: "/business/invoices", icon: Receipt },
      { name: "Payments", path: "/business/payments", icon: DollarSign },
    ],
  },
  {
    name: "Marketing",
    icon: BarChart3,
    children: [
      { name: "Campaigns", path: "/business/campaigns", icon: Activity },
      { name: "Sources", path: "/business/sources", icon: FolderOpen },
    ],
  },
  {
    name: "Team Targets",
    icon: Target,
    children: [
      { name: "Targets", path: "/business/targets", icon: Target },
      { name: "Performance", path: "/business/performance", icon: TrendingUp },
    ],
  },
];

const roleConfig = {
  student: { label: "Student" },
  trainer: { label: "Trainer" },
  admin: { label: "Admin" },
  business: { label: "Admin" },
  superAdmin: { label: "Super Admin" },
};

// The "Dashboard" item's path for each role — clicking it (or calling
// goToFeature with it) clears the ?section= param and goes back to the
// ILM ORA demo landing/overview instead of showing a section page.
const ROLE_HOME_PATH = {
  student: "/student",
  trainer: "/trainer",
  admin: "/admin",
  business: "/business",
  superAdmin: "/admin",
};

// Flat path -> { name, icon, roleKey, parent? } lookup built from every
// menu set above. IlmOraDemoPage uses this to label whatever section is
// currently selected (via ?section=<path>) without needing its own copy
// of every menu's name/icon.
const ALL_MENUS_BY_ROLE = {
  student: studentMenus,
  trainer: trainerMenus,
  admin: adminMenus,
  business: businessMenus,
  superAdmin: adminMenus,
};

function buildSectionIndex() {
  const index = {};
  Object.entries(ALL_MENUS_BY_ROLE).forEach(([roleKey, menus]) => {
    menus.forEach((item) => {
      if (item.path && !index[item.path]) {
        index[item.path] = { name: item.name, icon: item.icon, roleKey };
      }
      if (item.children) {
        item.children.forEach((child) => {
          if (!index[child.path]) {
            index[child.path] = {
              name: child.name,
              icon: child.icon,
              roleKey,
              parent: item.name,
            };
          }
        });
      }
    });
  });
  return index;
}

const SECTION_INDEX = buildSectionIndex();

/* ================================================================
   SIDEBAR
================================================================ */
const IlmDemoSidebar = ({
  sidebarMode: sidebarModeProp,
  setSidebarMode: setSidebarModeProp,
  roleOverride,
  onNavigate, // Steps 7-10 gate from IlmOraDemoPage: checks profileCompleted before navigating
  activeSection = null, // NEW: which "path" is currently shown in IlmOraDemoPage's content
  // area (via ?section=). We no longer do a real router navigate() when
  // onNavigate is supplied, so we can't rely on location.pathname to know
  // which item is active anymore — the parent tells us via this prop.
  theme = "light", // "light" | "dark" — passed down from IlmOraDemoPage so the sidebar stays in sync with the navbar toggle
} = {}) => {
  const location = useNavigate ? useLocation() : { pathname: "/" };
  const navigate = useNavigate();
  // Step 7: every tab click in this sidebar goes through the gate (if given).
  const go = onNavigate || navigate;
  // When we're being driven by IlmOraDemoPage (onNavigate is set), active
  // highlighting is based on activeSection, not the real browser URL —
  // clicking a menu item never changes location.pathname anymore.
  const currentPath = onNavigate
    ? activeSection || ROLE_HOME_PATH[roleOverride] || "/student"
    : location.pathname;

  const { profileImage } = useAvatarContext();

  const isTrainer = location.pathname.startsWith("/trainer");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBusiness = location.pathname.startsWith("/business");
  const isSuperAdmin = location.pathname.startsWith("/super-admin");

  let menus = studentMenus;
  let roleKey = "student";

  if (roleOverride) {
    roleKey = roleOverride;
    if (roleOverride === "trainer") {
      menus = trainerMenus;
    } else if (roleOverride === "admin") {
      menus = adminMenus;
    }
    // "Business & Partnership" is really the tenant-admin experience —
    // it should reuse the admin sidebar (Organisation Manager, Assessment
    // System, etc.), not the unrelated `businessMenus` set (which was for
    // a different hiring/CRM-style role and doesn't match the
    // ROLE_CONFIG.business features on IlmOraDemoPage — those already use
    // /admin/... routes).
    else if (roleOverride === "business") {
      menus = adminMenus;
    } else {
      menus = studentMenus;
      roleKey = "student";
    }
  } else if (isSuperAdmin) {
    menus = adminMenus;
    roleKey = "superAdmin";
  } else if (isTrainer) {
    menus = trainerMenus;
    roleKey = "trainer";
  } else if (isAdminRoute) {
    menus = adminMenus;
    roleKey = "admin";
  } else if (isBusiness) {
    menus = businessMenus;
    roleKey = "business";
  }

  const role = roleConfig[roleKey] || roleConfig.student;
  const portalLabel = `${role.label.toUpperCase()} PORTAL`;

  const sidebarStorageKey = `sidebarMode:ilmdemo:${roleKey}`;
  const [internalMode, setInternalMode] = React.useState(() => {
    try {
      return localStorage.getItem(sidebarStorageKey) || "full";
    } catch {
      return "full";
    }
  });
  const sidebarMode = sidebarModeProp ?? internalMode;
  const setSidebarMode = setSidebarModeProp ?? setInternalMode;

  React.useEffect(() => {
    if (sidebarModeProp !== undefined) return;
    try {
      setInternalMode(localStorage.getItem(sidebarStorageKey) || "full");
    } catch {
      setInternalMode("full");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleKey]);

  React.useEffect(() => {
    try {
      localStorage.setItem(sidebarStorageKey, sidebarMode);
    } catch (_) {}
  }, [sidebarMode, sidebarStorageKey]);

  // --- FIX: guard against an invalid/unexpected sidebarMode value ---
  // Previously, if sidebarMode was ever anything other than exactly
  // "full" / "icon" / "hidden" (e.g. stale/corrupt localStorage value,
  // undefined during a race, etc.), BOTH `collapsed` and `hidden`
  // evaluated to false, which made the header render condition
  // (`!collapsed && !hidden` for full header, `collapsed && !hidden`
  // for the icon-only logo) behave inconsistently and the logo/
  // "STUDENT PORTAL" block could disappear entirely (as seen in the
  // cut-off screenshot). We now clamp to a known-good mode first.
  const safeMode = SIDEBAR_WIDTHS.hasOwnProperty(sidebarMode)
    ? sidebarMode
    : "full";
  const collapsed = safeMode === "icon";
  const hidden = safeMode === "hidden";
  const sidebarWidth = SIDEBAR_WIDTHS[safeMode];

  // 3-step fold toggle: full -> icon -> hidden -> full (same flow as Sidebar.jsx)
  const toggleSidebar = () => {
    setSidebarMode((prev) =>
      prev === "full" ? "icon" : prev === "icon" ? "hidden" : "full",
    );
  };

  const [openGroups, setOpenGroups] = React.useState({});
  const [flyoutGroup, setFlyoutGroup] = React.useState(null);
  const flyoutCloseTimer = React.useRef(null);

  const currentRole = localStorage.getItem("role");
  const showRoleDropdown = false;
  const currentRolePath = "/ilm-demo";

  const [userName, setUserName] = React.useState(
    localStorage.getItem("userName") || "User",
  );

  React.useEffect(() => {
    userService
      .getMyProfile()
      .then((res) => {
        const name = res.data?.displayName || res.data?.name || "User";
        setUserName(name);
        localStorage.setItem("userName", name);
      })
      .catch(() => {});
  }, []);

  const openFlyout = (name) => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    setFlyoutGroup(name);
  };
  const scheduleCloseFlyout = () => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    flyoutCloseTimer.current = setTimeout(() => setFlyoutGroup(null), 150);
  };

  return (
    <>
      <style>{`
        .ilm-sb-root[data-theme="light"] {
          --sb-bg: #ffffff;
          --sb-border: #edf1f5;
          --sb-logo-bg: #eaf2fe;
          --sb-logo-border: #dbe9fd;
          --sb-text-muted: #94a3b8;
          --sb-text: #1e293b;
          --sb-item-hover-bg: #f8fafc;
          --sb-active-bg: #fef1e6;
          --sb-active-color: #ea580c;
          --sb-child-color: #64748b;
          --sb-child-hover-bg: #fff7f0;
          --sb-connector-border: #f1f5f9;
          --sb-flyout-bg: #ffffff;
          --sb-flyout-border: #edf1f5;
          --sb-flyout-shadow: 0 12px 32px rgba(15,23,42,0.14);
          --sb-chevron: #cbd5e1;
          --sb-scrollbar-thumb: rgba(148,163,184,0.35);
          --sb-ai-color: #a855f7;
        }
        .ilm-sb-root[data-theme="dark"] {
          --sb-bg: #0f172a;
          --sb-border: #1e293b;
          --sb-logo-bg: #1e293b;
          --sb-logo-border: #334155;
          --sb-text-muted: #94a3b8;
          --sb-text: #f1f5f9;
          --sb-item-hover-bg: #1e293b;
          --sb-active-bg: rgba(251,146,60,0.12);
          --sb-active-color: #fb923c;
          --sb-child-color: #94a3b8;
          --sb-child-hover-bg: rgba(251,146,60,0.08);
          --sb-connector-border: #334155;
          --sb-flyout-bg: #1e293b;
          --sb-flyout-border: #334155;
          --sb-flyout-shadow: 0 12px 32px rgba(0,0,0,0.45);
          --sb-chevron: #475569;
          --sb-scrollbar-thumb: rgba(100,116,139,0.5);
          --sb-ai-color: #c084fc;
        }

        .ilm-sb-root {
          position: fixed; top: 68px; left: 0;
          background: var(--sb-bg);
          border-right: 1px solid var(--sb-border);
          transition: width .28s ease, margin .28s ease, transform .28s ease, background .3s, border-color .3s;
          z-index: 90;
        }
        .ilm-sb-root[data-mode="hidden"] {
          border-right-width: 0;
          pointer-events: none;
        }

        .ilm-sb-nav::-webkit-scrollbar { width: 3px; }
        .ilm-sb-nav::-webkit-scrollbar-track { background: transparent; }
        .ilm-sb-nav::-webkit-scrollbar-thumb { background: var(--sb-scrollbar-thumb); border-radius: 10px; }

        .ilm-sb-header { padding: 18px 18px 14px; }

        .ilm-sb-collapse-btn {
          padding: 6px; border-radius: 8px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          border: 1px solid var(--sb-border); background: var(--sb-item-hover-bg);
          color: var(--sb-text-muted); transition: all 0.15s;
        }
        .ilm-sb-collapse-btn:hover {
          color: var(--sb-active-color); border-color: var(--sb-active-color);
        }

        .ilm-sb-logo-icon-box {
          width: 40px; height: 40px; border-radius: 11px;
          background: var(--sb-logo-bg); border: 1px solid var(--sb-logo-border);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ilm-sb-logo-sub {
          font-size: 10.5px; font-weight: 700; color: var(--sb-text-muted);
          letter-spacing: 0.08em; margin: 2px 0 0;
        }

        .ilm-sb-nav-item {
          width: 100%; display: flex; align-items: center;
          padding: 11px 12px; border-radius: 10px; font-size: 14.5px;
          font-weight: 700; transition: all 0.15s ease; cursor: pointer;
          border: none; background: transparent; text-align: left; gap: 11px;
          position: relative; color: var(--sb-text);
        }
        .ilm-sb-nav-item svg { flex-shrink: 0; color: var(--sb-text-muted); }
        .ilm-sb-nav-item:hover { background: var(--sb-item-hover-bg); }
        .ilm-sb-nav-item.active {
          background: var(--sb-active-bg); color: var(--sb-active-color);
        }
        .ilm-sb-nav-item.active svg { color: var(--sb-active-color); }
        .ilm-sb-nav-item.group-active { color: var(--sb-active-color); }
        .ilm-sb-nav-item.group-active svg { color: var(--sb-active-color); }

        .ilm-sb-nav-item.ai-group svg { color: var(--sb-ai-color); }

        .ilm-sb-child-item {
          width: 100%; display: flex; align-items: center;
          gap: 9px; padding: 9px 12px; border-radius: 9px;
          font-size: 13.5px; font-weight: 600; transition: all 0.14s ease;
          cursor: pointer; border: none; background: transparent; text-align: left;
          color: var(--sb-child-color);
        }
        .ilm-sb-child-item svg { flex-shrink: 0; color: var(--sb-text-muted); }
        .ilm-sb-child-item:hover  { color: var(--sb-active-color); background: var(--sb-child-hover-bg); }
        .ilm-sb-child-item.active { color: var(--sb-active-color); background: var(--sb-active-bg); }
        .ilm-sb-child-item.active svg { color: var(--sb-active-color); }

        .ilm-sb-connector {
          margin-left: 22px; padding-left: 10px;
          margin-top: 3px; margin-bottom: 4px;
          border-left: 2px solid var(--sb-connector-border);
          display: flex; flex-direction: column; gap: 1px;
        }

        .ilm-sb-flyout {
          position: absolute; left: calc(100% + 8px); top: -4px;
          min-width: 208px; border-radius: 12px; padding: 6px; z-index: 95;
          display: flex; flex-direction: column; gap: 1px;
          background: var(--sb-flyout-bg); border: 1px solid var(--sb-flyout-border);
          box-shadow: var(--sb-flyout-shadow);
          animation: ilmSbFlyoutIn 0.14s ease;
        }
        @keyframes ilmSbFlyoutIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ilm-sb-flyout-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 6px 8px 4px; color: var(--sb-text-muted);
        }

        .ilm-sb-chevron { color: var(--sb-chevron); transition: transform 0.2s; flex-shrink: 0; margin-left: auto; }
        .ilm-sb-nav-item.group-active .ilm-sb-chevron { color: var(--sb-active-color); }

        .ilm-sb-nav-label {
          flex: 1; text-align: left;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .ilm-sb-root[data-mode="icon"] .ilm-sb-nav-item { justify-content: center; padding: 11px 0; }
        .ilm-sb-root[data-mode="icon"] .ilm-sb-nav { padding-left: 0; padding-right: 0; align-items: center; }
        .ilm-sb-root[data-mode="icon"] .ilm-sb-nav > div { width: 100%; display: flex; justify-content: center; }

        .ilm-sb-backdrop { display: none; }
        @media (max-width: 768px) {
          .ilm-sb-root[data-mode="full"] { z-index: 170; box-shadow: 8px 0 32px rgba(0,0,0,0.25); }
          .ilm-sb-backdrop[data-show="true"] {
            display: block; position: fixed; inset: 0;
            background: rgba(15,23,42,0.45); z-index: 165;
            animation: ilmSbFlyoutIn 0.2s ease;
          }
        }
      `}</style>

      <div
        className="ilm-sb-backdrop"
        data-show={safeMode === "full"}
        onClick={() => setSidebarMode("hidden")}
      />

      <aside
        className="ilm-sb-root"
        data-mode={safeMode}
        data-theme={theme}
        aria-hidden={hidden}
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 68px)",
          overflow: "hidden",
          opacity: hidden ? 0 : 1,
        }}
      >
        <div
          className="ilm-sb-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexDirection: collapsed ? "column" : "row",
          }}
        >
          {!collapsed && !hidden && (
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                gap: "11px",
              }}
            >
              <div className="ilm-sb-logo-icon-box">
                <GraduationCap size={19} color="#2563eb" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  className="text-[18px] font-extrabold font-serif leading-none whitespace-nowrap"
                  style={{ margin: 0 }}
                >
                  <span className="text-green-600">ILM</span>
                  <span className="text-orange-500 ml-1">ORA</span>
                </p>
                <p className="ilm-sb-logo-sub">{portalLabel}</p>
              </div>
            </div>
          )}
          {collapsed && !hidden && (
            <div className="ilm-sb-logo-icon-box" style={{ margin: "0 auto" }}>
              <GraduationCap size={19} color="#2563eb" />
            </div>
          )}
          {!hidden && (
            <button
              className="ilm-sb-collapse-btn"
              onClick={toggleSidebar}
              title={collapsed ? "Expand" : "Collapse"}
              style={collapsed ? { marginTop: "6px" } : { marginLeft: "auto" }}
            >
              <Menu size={15} />
            </button>
          )}
        </div>

        <nav
          className="ilm-sb-nav"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "visible",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {menus.map((item) => {
            const Icon = item.icon;
            const isOpen = openGroups[item.name] ?? false;
            const isAI = item.name === "AI Tools";
            const isFlyoutOpen = collapsed && flyoutGroup === item.name;

            if (item.children) {
              const isGroupActive = item.children.some(
                (c) => currentPath === c.path,
              );
              return (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={() => collapsed && openFlyout(item.name)}
                  onMouseLeave={() => collapsed && scheduleCloseFlyout()}
                >
                  <button
                    className={`ilm-sb-nav-item ${isGroupActive ? "group-active" : ""} ${isAI ? "ai-group" : ""}`}
                    onClick={() => {
                      if (collapsed) {
                        setFlyoutGroup((prev) =>
                          prev === item.name ? null : item.name,
                        );
                      } else {
                        setOpenGroups((p) => ({ ...p, [item.name]: !isOpen }));
                      }
                    }}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon size={19} />
                    {!collapsed && !hidden && (
                      <>
                        <span className="ilm-sb-nav-label">{item.name}</span>
                        <ChevronRight
                          size={16}
                          className="ilm-sb-chevron"
                          style={{
                            transform: isOpen
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          }}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && !hidden && isOpen && (
                    <div className="ilm-sb-connector">
                      {item.children.map((child) => {
                        const active = currentPath === child.path;
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.name}
                            className={`ilm-sb-child-item ${active ? "active" : ""}`}
                            onClick={() => go(child.path)}
                          >
                            <ChildIcon size={14} />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {child.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isFlyoutOpen && (
                    <div
                      className="ilm-sb-flyout"
                      onMouseEnter={() => openFlyout(item.name)}
                      onMouseLeave={() => scheduleCloseFlyout()}
                    >
                      <div className="ilm-sb-flyout-title">{item.name}</div>
                      {item.children.map((child) => {
                        const active = currentPath === child.path;
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.name}
                            className={`ilm-sb-child-item ${active ? "active" : ""}`}
                            onClick={() => {
                              go(child.path);
                              setFlyoutGroup(null);
                            }}
                          >
                            <ChildIcon size={15} />
                            <span
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
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

            const active = currentPath === item.path;
            return (
              <button
                key={item.name}
                className={`ilm-sb-nav-item ${active ? "active" : ""}`}
                onClick={() => go(item.path)}
                title={collapsed ? item.name : undefined}
              >
                <Icon size={19} />
                {!collapsed && !hidden && (
                  <span className="ilm-sb-nav-label">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default IlmDemoSidebar;
export { SIDEBAR_WIDTHS, SECTION_INDEX, ROLE_HOME_PATH };