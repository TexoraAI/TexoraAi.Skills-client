import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
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
  Users,
  Video,
  Menu,
  X,
} from "lucide-react";
import { Phone } from "lucide-react";

/* ================================================================
   MENUS — unchanged
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
    path: "/admin/organisation-overview",
    icon: Building2,
  },
  {
    name: "Assessment System",
    path: "/admin/assessment-system",
    icon: ClipboardCheck,
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
  student: { label: "Student Portal" },
  trainer: { label: "Trainer Panel" },
  admin: { label: "Manager Panel" },
  business: { label: "Tenant Admin Panel" },
};

/* ================================================================
   TOP NAVBAR — logo row + underline tabs row (desktop) + hamburger
   / slide-out panel (mobile).

   DESIGN: restyled to match the SuperAdmin navbar — a two-row
   fixed header (logo row, then a thin underline-tab row), with
   the same spacing, font sizes, and dropdown panel treatment.
   No logic was touched: routing, the profile-completion gate, the
   portaled dropdown positioning fix, and all state/handlers are
   byte-identical to before — only markup/CSS changed.

   FIX (Bug 1, preserved): the desktop dropdown is rendered through
   a React portal directly into document.body, positioned with
   `position: fixed` using raw viewport coordinates, so it can never
   be clipped or covered by page content on any route.
================================================================ */
const TopNavbar = ({ isDark, roleOverride, rightSlot }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const scrollRef = useRef(null);
  const dropdownRef = useRef(null); // ref to the portaled dropdown itself

  const isTrainer = location.pathname.startsWith("/trainer");
  const isAdmin = location.pathname.startsWith("/admin");
  const isBusiness = location.pathname.startsWith("/business");

  let menus = studentMenus,
    roleKey = "student";
  if (roleOverride) {
    // Explicit override — used on /ilm-demo where the path itself
    // gives no role signal. Real dashboard routes never pass this.
    // roleKey = roleOverride;
    // if (roleOverride === "trainer") menus = trainerMenus;
    // else if (roleOverride === "admin") menus = adminMenus;
    // else if (roleOverride === "business") menus = businessMenus;
    // else menus = studentMenus;
    roleKey = roleOverride;
    if (roleOverride === "trainer") menus = trainerMenus;
    else if (roleOverride === "admin") menus = adminMenus;
    // "Business & Partnership" is the tenant-admin experience and reuses
    // the admin menu set — see IlmDemoSidebar.jsx for the same fix.
    else if (roleOverride === "business") menus = adminMenus;
    else menus = studentMenus;
  } else if (isTrainer) {
    menus = trainerMenus;
    roleKey = "trainer";
  } else if (isAdmin) {
    menus = adminMenus;
    roleKey = "admin";
  } else if (isBusiness) {
    menus = businessMenus;
    roleKey = "business";
  }

  const role = roleConfig[roleKey];

  const [openTab, setOpenTab] = useState(null); // name of open desktop dropdown
  const [dropdownPos, setDropdownPos] = useState(null); // { left, top } — viewport-relative (fixed)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});

  // Close on outside click — must also ignore clicks inside the
  // portaled dropdown, since it no longer lives inside wrapRef's DOM
  // subtree once it's rendered into document.body.
  useEffect(() => {
    const onClick = (e) => {
      const insideWrap = wrapRef.current && wrapRef.current.contains(e.target);
      const insideDropdown =
        dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!insideWrap && !insideDropdown) {
        setOpenTab(null);
        setDropdownPos(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setOpenTab(null);
    setDropdownPos(null);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close the desktop dropdown if the tabs row scrolls, or the window
  // resizes — its position was computed from a snapshot of the button's
  // coordinates and would otherwise go stale.
  useEffect(() => {
    const close = () => {
      setOpenTab(null);
      setDropdownPos(null);
    };
    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener("scroll", close);
    window.addEventListener("resize", close);
    return () => {
      scrollEl?.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  const go = (path) => {
    if (!path) return;

    // Profile completion is NOT required to navigate between dashboard
    // tabs right now — every feature is free. To gate a specific
    // paid/advanced tab later, check that tab's path here (e.g. against
    // a plan/subscription flag) before navigating, instead of blocking
    // every tab behind a completed profile.
    navigate(path);
    setOpenTab(null);
    setDropdownPos(null);
    setMobileOpen(false);
  };

  const handleTabClick = (item, e) => {
    if (!item.children) {
      go(item.path);
      return;
    }
    if (openTab === item.name) {
      setOpenTab(null);
      setDropdownPos(null);
      return;
    }
    // Viewport-relative coordinates — the dropdown is now portaled to
    // <body> and positioned with `position: fixed`, so no offsetting
    // against wrapRef is needed (and none of wrapRef's ancestors can
    // clip or bury it behind page content anymore).
    const btnRect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({
      left: btnRect.left,
      top: btnRect.bottom + 6,
    });
    setOpenTab(item.name);
  };

  const toggleMobileGroup = (name) =>
    setMobileExpanded((p) => ({ ...p, [name]: !p[name] }));

  const openItem = menus.find((m) => m.name === openTab);

  return (
    <div className="tnv-wrap" ref={wrapRef} data-dark={String(!!isDark)}>
      <style>{TOPNAV_CSS}</style>

      {/* ── ROW 1 — Logo (52px) ── */}
      <div className="tnv-row1">
        <div className="tnv-logo" onClick={() => go(menus[0]?.path || "/")}>
          <div className="tnv-logo-text">
            <p className="tnv-logo-name">
              <span className="g">ILM</span> <span className="o">ORA</span>
            </p>
            <p className="tnv-logo-sub">{role.label.toUpperCase()}</p>
          </div>
        </div>

        <div className="tnv-spacer" />

        {/* Parent-supplied controls (theme toggle, bell, profile menu, etc.)
            — rendered here so they sit in the SAME row as the logo,
            exactly like the SuperAdmin header. */}
        {rightSlot && <div className="tnv-right-slot">{rightSlot}</div>}

        {/* Hamburger — only shown on mobile via CSS */}
        <button
          type="button"
          className="tnv-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── ROW 2 — Underline tabs (44px, desktop only) ── */}
      <nav className="tnv-tabs" ref={scrollRef}>
        {menus.map((item) => {
          const hasChildren = !!item.children;
          const isActiveGroup = hasChildren
            ? item.children.some((c) => location.pathname === c.path)
            : location.pathname === item.path;
          const isOpen = openTab === item.name;

          return (
            <button
              key={item.name}
              type="button"
              className={`tnv-tab ${isActiveGroup ? "active" : ""}`}
              onClick={(e) => handleTabClick(item, e)}
            >
              {item.name}
              {hasChildren && (
                <ChevronDown
                  size={12}
                  className="tnv-chevron"
                  style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Single dropdown — portaled to document.body so it can never be
          clipped or covered by page content again, on any route. */}
      {openTab &&
        dropdownPos &&
        openItem?.children &&
        createPortal(
          <div
            className="tnv-dropdown"
            ref={dropdownRef}
            data-dark={String(!!isDark)}
            style={{ left: dropdownPos.left, top: dropdownPos.top }}
          >
            {openItem.children.map((child) => {
              const ChildIcon = child.icon;
              const active = location.pathname === child.path;
              return (
                <button
                  key={child.name}
                  type="button"
                  className={`tnv-dd-item ${active ? "active" : ""}`}
                  onClick={() => go(child.path)}
                >
                  <ChildIcon size={13} style={{ flexShrink: 0 }} />
                  <span>{child.name}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {/* Mobile slide-out panel */}
      {mobileOpen && (
        <>
          <div
            className="tnv-mobile-backdrop"
            onClick={() => setMobileOpen(false)}
          />
          <div className="tnv-mobile-panel">
            <div className="tnv-mobile-header">
              <div
                className="tnv-logo"
                onClick={() => go(menus[0]?.path || "/")}
              >
                <div className="tnv-logo-text">
                  <p className="tnv-logo-name">
                    <span className="g">ILM</span>{" "}
                    <span className="o">ORA</span>
                  </p>
                  <p className="tnv-logo-sub">{role.label.toUpperCase()}</p>
                </div>
              </div>
              <button
                type="button"
                className="tnv-mobile-close"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="tnv-mobile-list">
              {menus.map((item) => {
                const Icon = item.icon;
                const hasChildren = !!item.children;
                const isExpanded = !!mobileExpanded[item.name];
                const isActiveGroup = hasChildren
                  ? item.children.some((c) => location.pathname === c.path)
                  : location.pathname === item.path;

                if (!hasChildren) {
                  return (
                    <button
                      key={item.name}
                      type="button"
                      className={`tnv-mobile-item ${isActiveGroup ? "active" : ""}`}
                      onClick={() => go(item.path)}
                    >
                      <Icon size={15} style={{ flexShrink: 0 }} />
                      <span>{item.name}</span>
                    </button>
                  );
                }

                return (
                  <div key={item.name} className="tnv-mobile-group">
                    <button
                      type="button"
                      className={`tnv-mobile-item ${isActiveGroup ? "active" : ""}`}
                      onClick={() => toggleMobileGroup(item.name)}
                    >
                      <Icon size={15} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, textAlign: "left" }}>
                        {item.name}
                      </span>
                      <ChevronDown
                        size={14}
                        style={{
                          transition: "transform .15s",
                          transform: isExpanded ? "rotate(180deg)" : "none",
                        }}
                      />
                    </button>
                    {isExpanded && (
                      <div className="tnv-mobile-children">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const active = location.pathname === child.path;
                          return (
                            <button
                              key={child.name}
                              type="button"
                              className={`tnv-mobile-child ${active ? "active" : ""}`}
                              onClick={() => go(child.path)}
                            >
                              <ChildIcon size={13} style={{ flexShrink: 0 }} />
                              <span>{child.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const TOPNAV_CSS = `
  .tnv-wrap {
    display: flex; flex-direction: column;
    flex: 1; min-width: 0; position: relative;
  }

  /* ── ROW 1 — logo row ───────────────────────────────────── */
  .tnv-row1 {
    display: flex; align-items: center;
    height: 52px; padding: 0 4px;
  }
  [data-dark="false"] .tnv-row1 { border-bottom: 1px solid rgba(0,0,0,.09); }
  [data-dark="true"]  .tnv-row1 { border-bottom: 1px solid rgba(255,255,255,.07); }
  .tnv-spacer { flex: 1; }

  .tnv-right-slot {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }

  .tnv-logo {
    display: flex; align-items: center; gap: 9px;
    cursor: pointer; flex-shrink: 0;
  }
  .tnv-logo-text { min-width: 0; }
  .tnv-logo-name {
    font-size: 19px; font-weight: 700; letter-spacing: -0.05em;
    line-height: 1; white-space: nowrap; margin: 0;
  }
  .tnv-logo-name .g { color: #22c55e; }
  .tnv-logo-name .o { color: #f97316; }
  .tnv-logo-sub {
    font-size: 8px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; margin: 2px 0 0; white-space: nowrap;
  }
  [data-dark="false"] .tnv-logo-sub { color: #64748b; }
  [data-dark="true"]  .tnv-logo-sub { color: #94a3b8; }

  /* ── ROW 2 — underline tabs row ─────────────────────────── */
  .tnv-tabs {
    display: flex; align-items: stretch; gap: 0;
    height: 44px;
    overflow-x: auto; overflow-y: hidden;
    min-width: 0;
    scrollbar-width: thin;
  }
  [data-dark="false"] .tnv-tabs { scrollbar-color: rgba(148,163,184,0.5) transparent; }
  [data-dark="true"]  .tnv-tabs { scrollbar-color: rgba(255,255,255,0.25) transparent; }
  .tnv-tabs::-webkit-scrollbar { height: 6px; }
  .tnv-tabs::-webkit-scrollbar-track { background: transparent; }
  [data-dark="false"] .tnv-tabs::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.5); border-radius: 999px; }
  [data-dark="true"]  .tnv-tabs::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.25); border-radius: 999px; }

  .tnv-tab {
    display: flex; align-items: center; gap: 4px;
    padding: 0 14px; height: 100%; border: none;
    background: transparent; cursor: pointer; white-space: nowrap;
    font-size: 13px; font-weight: 500; font-family: inherit;
    flex-shrink: 0;
    border-bottom: 2px solid transparent;
    transition: color .15s, border-color .15s;
  }
  [data-dark="false"] .tnv-tab { color: #64748b; }
  [data-dark="true"]  .tnv-tab { color: #94a3b8; }
  [data-dark="false"] .tnv-tab:hover { color: #1e293b; }
  [data-dark="true"]  .tnv-tab:hover { color: #fff; }
  [data-dark="false"] .tnv-tab.active { color: #2563eb; border-bottom-color: #2563eb; }
  [data-dark="true"]  .tnv-tab.active { color: #60a5fa; border-bottom-color: #60a5fa; }

  /* Dropdown — portaled to <body>, position: fixed, max z-index so it
     is never clipped or covered by page content on any route. */
  .tnv-dropdown {
    position: fixed; z-index: 2147483000;
    min-width: 210px; border-radius: 10px; padding: 6px;
    display: flex; flex-direction: column; gap: 2px;
    animation: tnvIn .15s ease;
  }
  .tnv-dropdown[data-dark="false"] { background: #fff; border: 1px solid rgba(0,0,0,.10); box-shadow: 0 8px 32px rgba(0,0,0,.14); }
  .tnv-dropdown[data-dark="true"]  { background: #13131f; border: 1px solid rgba(255,255,255,.10); box-shadow: 0 24px 64px rgba(0,0,0,.55); }
  @keyframes tnvIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

  .tnv-dd-item {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 12px; border-radius: 7px; border: none;
    background: transparent; cursor: pointer; text-align: left;
    font-size: 13px; font-weight: 500; font-family: inherit;
    transition: all .12s; white-space: nowrap;
  }
  .tnv-dropdown[data-dark="false"] .tnv-dd-item { color: #374151; }
  .tnv-dropdown[data-dark="true"]  .tnv-dd-item { color: #cbd5e1; }
  .tnv-dropdown[data-dark="false"] .tnv-dd-item:hover { background: rgba(0,0,0,.04); }
  .tnv-dropdown[data-dark="true"]  .tnv-dd-item:hover { background: rgba(255,255,255,.06); }
  .tnv-dropdown[data-dark="false"] .tnv-dd-item.active { background: rgba(37,99,235,.07); color: #2563eb; }
  .tnv-dropdown[data-dark="true"]  .tnv-dd-item.active { background: rgba(96,165,250,.12); color: #60a5fa; }

  .tnv-hamburger {
    display: none;
    align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 7px;
    border: none; cursor: pointer; flex-shrink: 0; background: none;
  }
  [data-dark="false"] .tnv-hamburger { color: #64748b; }
  [data-dark="true"]  .tnv-hamburger { color: #94a3b8; }

  .tnv-mobile-backdrop {
    position: fixed; inset: 0; background: rgba(15,23,42,0.45);
    z-index: 300; animation: tnvFade .18s ease;
  }
  .tnv-mobile-panel {
    position: fixed; top: 0; right: 0; height: 100vh; width: min(300px, 86vw);
    z-index: 301; display: flex; flex-direction: column;
    animation: tnvSlideIn .2s ease;
    box-shadow: -8px 0 32px rgba(0,0,0,0.25);
  }
  [data-dark="false"] .tnv-mobile-panel { background: #fff; }
  [data-dark="true"]  .tnv-mobile-panel { background: #0d0d14; }
  @keyframes tnvFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes tnvSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .tnv-mobile-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; flex-shrink: 0;
  }
  [data-dark="false"] .tnv-mobile-header { border-bottom: 1px solid rgba(0,0,0,.09); }
  [data-dark="true"]  .tnv-mobile-header { border-bottom: 1px solid rgba(255,255,255,.07); }

  .tnv-mobile-close {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer; flex-shrink: 0;
  }
  [data-dark="false"] .tnv-mobile-close { background: rgba(0,0,0,.04); color: #1e293b; }
  [data-dark="true"]  .tnv-mobile-close { background: rgba(255,255,255,0.07); color: #fff; }

  .tnv-mobile-list {
    flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 2px;
  }

  .tnv-mobile-item {
    display: flex; align-items: center; gap: 11px;
    width: 100%; padding: 11px 12px; border-radius: 8px; border: none;
    background: transparent; cursor: pointer; text-align: left;
    font-size: 14px; font-weight: 500; font-family: inherit;
  }
  [data-dark="false"] .tnv-mobile-item { color: #374151; }
  [data-dark="true"]  .tnv-mobile-item { color: #cbd5e1; }
  [data-dark="false"] .tnv-mobile-item.active { background: rgba(37,99,235,.07); color: #2563eb; }
  [data-dark="true"]  .tnv-mobile-item.active { background: rgba(96,165,250,.12); color: #60a5fa; }

  .tnv-mobile-children {
    display: flex; flex-direction: column; gap: 1px;
    margin: 2px 0 4px 14px; padding-left: 12px;
  }
  [data-dark="false"] .tnv-mobile-children { border-left: 2px solid rgba(0,0,0,.09); }
  [data-dark="true"]  .tnv-mobile-children { border-left: 2px solid rgba(255,255,255,.07); }

  .tnv-mobile-child {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 9px 10px; border-radius: 7px; border: none;
    background: transparent; cursor: pointer; text-align: left;
    font-size: 13px; font-weight: 500; font-family: inherit;
  }
  [data-dark="false"] .tnv-mobile-child { color: #6b7280; }
  [data-dark="true"]  .tnv-mobile-child { color: #94a3b8; }
  [data-dark="false"] .tnv-mobile-child.active { background: rgba(37,99,235,.07); color: #2563eb; }
  [data-dark="true"]  .tnv-mobile-child.active { background: rgba(96,165,250,.12); color: #60a5fa; }

  @media (max-width: 900px) {
    .tnv-logo-sub { display: none; }
  }

  @media (max-width: 640px) {
    .tnv-tabs { display: none; }
    .tnv-hamburger { display: flex; }
  }
`;

export default TopNavbar;
