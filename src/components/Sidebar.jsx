// import {
//   Activity,
//   Award,
//   BarChart3,
//   BookOpen,
//   Bot,
//   Brain,
//   Briefcase,
//   Building2,
//   GitBranch, 
//   CalendarDays,
//   ChevronDown,
//   ClipboardCheck,
//   ClipboardEdit,
//   DollarSign,
//   FileCode2,
//   FileSearch,
//   FileText,
//   FolderOpen,
//   GraduationCap,
//   History,
//   Layers,
//   LayoutDashboard,
//   LineChart,
//   LogOut,
//   Menu,
//   MessageCircleQuestion,
//   MessageSquare,
//   Moon,
//   NotebookPen,
//   PanelTop,
//   PlayCircle,
//   Radio,
//   Receipt,
//   Settings,
//   // ✅ AI Tools Icons
//   Sparkles,
//   Sun,
//   Target,
//   TrendingUp,
//   Upload,
//   Users,
//   Video
// } from "lucide-react";
// import React from "react";

// import { Phone } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import auth from "../auth";
// import userService from "../services/userService";
// // ✅ Shared AvatarContext se import
// import { useAvatarContext } from "../context/AvatarContext";

// /* ================================================================
//    MENUS
// ================================================================ */
// const studentMenus = [
//   {
//     name: "Dashboard",
//     path: "/student",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Learning & Classes",
//     icon: Radio,
//     children: [
//       { name: "Live Classes",     path: "/student/live-classes",     icon: Radio      },
//       { name: "Recorded Classes", path: "/student/recorded-classes", icon: PlayCircle },
//       { name: "Call Trainer",     path: "/student/call-trainer",     icon: Phone      },
//     ],
//   },
//   {
//     name: "Learning Materials",
//     icon: GraduationCap,
//     children: [
//       { name: "Video Lectures", path: "/student/videos",    icon: Video    },
//       { name: "Documents",      path: "/student/documents", icon: FileText },
//     ],
//   },
//   {
//     name: "My Learning",
//     icon: BookOpen,
//     children: [
//       { name: "My Courses",      path: "/student/courses",      icon: BookOpen       },
//       { name: "Assessments",     path: "/student/assessments",  icon: ClipboardCheck },
//       { name: "Assignments",     path: "/student/assignments",  icon: ClipboardEdit  },
//       { name: "My Quiz History", path: "/student/my-quizzes",   icon: History        },
//       { name: "Attendance",      path: "/student/attendance",   icon: CalendarDays   },
//     ],
//   },
//   {
//     name: "Skill & Growth",
//     icon: TrendingUp,
//     children: [
//       { name: "Skill Map",    path: "/student/skill-map",    icon: Brain },
//       { name: "Certificates", path: "/student/certificates", icon: Award },
//     ],
//   },

//   // ── ✅ NEW: AI Tools ──────────────────────────────────────────
//   {
//     name: "AI Tools",
//     icon: Sparkles,
//     children: [
//       {
//         name: "Notebook AI",
//         path: "/student/notebook",   // same path as before
//         icon: NotebookPen,
//       },
//       {
//         name: "Resume Builder",
//         path: "/student/resume-builder",
//         icon: FileCode2,
//       },
//     ],
//   },
//   // ─────────────────────────────────────────────────────────────

//   {
//     name: "Support",
//     icon: MessageCircleQuestion,
//     children: [
//       { name: "Doubts",     path: "/student/doubts",    icon: MessageCircleQuestion },
//       { name: "Feedback",   path: "/student/feedback",  icon: MessageSquare         },
//       { name: "Coding Lab", path: "/student/compiler",  icon: FileText              },
//       {
//         name: "Study Plan",
//         path: "/student/study-plan",
//         icon: CalendarDays,
//       },
//     ],
//   },
// ];

// const trainerMenus = [
//   { name: "Dashboard",        path: "/trainer",         icon: LayoutDashboard },
//   { name: "Batch Management", path: "/trainer/batches", icon: Layers },
//   {
//     name: "Content Management", icon: FileText,
//     children: [
//       { name: "Upload Videos",      path: "/trainer/upload-videos",      icon: Video },
//       { name: "Course Management",  path: "/trainer/course-management",  icon: BookOpen },
//       { name: "Assessments",        path: "/trainer/assessments",        icon: ClipboardCheck },
//       { name: "Attendance",         path: "/trainer/attendance",         icon: CalendarDays },
//       { name: "Doubts Management",  path: "/trainer/doubts-management",  icon: MessageCircleQuestion },
//       { name: "Feedback",           path: "/trainer/feedback",           icon: MessageCircleQuestion },
//     ],
//   },
//   {
//     name: "Live Classes", icon: Video,
//     children: [
//       { name: "Live Dashboard", path: "/trainer/live", icon: LayoutDashboard },
//       {
//         name: "Whiteboard",
//         path: "/trainer/whiteboard",
//         icon: PanelTop,
//       },
//       {
//         name: "AI Companion",
//         path: "/trainer/ai-companion",
//         icon: Bot,
//       },
//     ],
//   },
//   {
//     name: "Reports & Analytics", icon: BarChart3,
//     children: [
//       { name: "Student Reports",      path: "/trainer/student-reports", icon: FileSearch },
//       { name: "Batch Reports",        path: "/trainer/batch-reports",   icon: FileText },
//       { name: "Performance Analysis", path: "/trainer/performance",     icon: TrendingUp },
//       { name: "Skill Analytics",      path: "/trainer/skill-analytics", icon: Brain },
//       { name: "Coding Lab",           path: "/trainer/compiler",        icon: FileText },
//       {
//         name: "Study Plan",
//         path: "/trainer/study-plan",
//         icon: BookOpen,
//       },
//     ],
//   },
// ];

// const adminMenus = [
//   { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
//   {
//     name: "Organisation Manager", icon: Building2,
//     path: "/admin/organisation-overview",
//   },
//   {
//     name: "Assessment System",
//     icon: ClipboardCheck,
//     path: "/admin/assessment-system",
//   },
//   {
//     name: "Course Management", icon: BookOpen,
//     children: [
//       { name: "All Courses", path: "/admin/courses", icon: BookOpen },
//     ],
//   },
//   {
//     name: "Video Management",
//     icon: Video,
//     children: [
//       {
//         name: "Admin Videos",
//         path: "/admin/videos",
//         icon: Video,
//       },

//     ],

//   },
//   {
//     name: "File Management",
//     icon: FileText,
//     children: [
//       {
//         name: "Admin Files",
//         path: "/admin/files",
//         icon: FileText,
//       },
//     ],
//   },
//   {
//     name: "Live & Recorded Control", icon: Video,
//     children: [
//       { name: "Admin Live Sessions", path: "/admin/live-sessions", icon: Radio },
//     ],
//   },
//   {
//     name: "Document Generator", icon: FileText,
//     children: [
//       { name: "Certificates", path: "/admin/certificates", icon: Award },
//       { name: "Reports",      path: "/admin/reports",      icon: FileText },
//     ],
//   },
//   {
//     name: "Insight Review", icon: BarChart3,
//     children: [
//       { name: "Usage Analytics",  path: "/admin/usage",            icon: LineChart },
//       { name: "Skill Analytics",  path: "/admin/skill-analytics",  icon: Brain },
//       { name: "Feedback Review",  path: "/admin/feedback-review",  icon: MessageCircleQuestion },
//       {
//         name: "Attendance",
//         path: "/admin/attendance",
//         icon: CalendarDays,
//       },
//       { name: "Settings",         path: "/admin/settings",         icon: Settings },

//     ],
//   },
// ];

// const businessMenus = [
//   { name: "Dashboard", path: "/business", icon: LayoutDashboard },
//   {
//     name: "Hiring Manager", icon: Briefcase,
//     children: [
//       { name: "Job Openings", path: "/business/jobs",         icon: Briefcase },
//       { name: "Applications", path: "/business/applications", icon: ClipboardCheck },
//     ],
//   },
//   {
//     name: "Lead Management", icon: Target,
//     children: [
//       { name: "All Leads",  path: "/business/leads",     icon: Users },
//       { name: "Follow Ups", path: "/business/followups", icon: TrendingUp },
//     ],
//   },
//   {
//     name: "Enrollments", icon: BookOpen,
//     children: [
//       { name: "New Enrollments", path: "/business/enrollments", icon: BookOpen },
//       { name: "Renewals",        path: "/business/renewals",    icon: BookOpen },
//     ],
//   },
//   {
//     name: "Financial", icon: DollarSign,
//     children: [
//       { name: "Invoices", path: "/business/invoices", icon: Receipt },
//       { name: "Payments", path: "/business/payments", icon: DollarSign },
//     ],
//   },
//   {
//     name: "Marketing", icon: BarChart3,
//     children: [
//       { name: "Campaigns", path: "/business/campaigns", icon: Activity },
//       { name: "Sources",   path: "/business/sources",   icon: FolderOpen },
//     ],
//   },
//   {
//     name: "Team Targets", icon: Target,
//     children: [
//       { name: "Targets",     path: "/business/targets",     icon: Target },
//       { name: "Performance", path: "/business/performance", icon: TrendingUp },
//     ],
//   },
// ];

// const roleConfig = {
//   student:    { label: "Student"      },
//   trainer:    { label: "Trainer"      },
//   admin:      { label: "Manager"      },
//   business:   { label: "Tenant Admin" },
//   superAdmin: { label: "Super Admin"  },
// };

// /* ================================================================
//    SIDEBAR
// ================================================================ */
// const Sidebar = () => {
//   const location = useNavigate ? useLocation() : { pathname: "/" };
//   const navigate  = useNavigate();

//   // ✅ Global avatar state
//   const { profileImage } = useAvatarContext();

//   const isTrainer    = location.pathname.startsWith("/trainer");
//   const isAdminRoute = location.pathname.startsWith("/admin");
//   const isBusiness   = location.pathname.startsWith("/business");
//   const isSuperAdmin = location.pathname.startsWith("/super-admin");

//   let menus   = studentMenus;
//   let roleKey = "student";
//   if (isSuperAdmin)      { menus = superAdminMenus; roleKey = "superAdmin"; }
//   else if (isTrainer)    { menus = trainerMenus;    roleKey = "trainer";    }
//   else if (isAdminRoute) { menus = adminMenus;      roleKey = "admin";      }
//   else if (isBusiness)   { menus = businessMenus;   roleKey = "business";   }

//   const role = roleConfig[roleKey];

//   const [collapsed,  setCollapsed]  = React.useState(false);
//   const [openGroups, setOpenGroups] = React.useState({});
//   const [dark,       setDark]       = React.useState(
//     document.documentElement.classList.contains("dark")
//   );

//   const toggleTheme = () => {
//     setDark(prev => {
//       const next = !prev;
//       document.documentElement.classList.toggle("dark", next);
//       return next;
//     });
//   };

//   const currentRole      = localStorage.getItem("role");
//   const showRoleDropdown = currentRole === "ADMIN";
//   const currentRolePath  = isSuperAdmin  ? "/super-admin/dashboard"
//     : isAdminRoute ? "/admin"
//     : isTrainer    ? "/trainer"
//     : isBusiness   ? "/business"
//     : "/student";

//   // const userName = localStorage.getItem("userName") || "User";
//   // const initials  = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
//    const [userName, setUserName] = React.useState(
//     localStorage.getItem("userName") || "User",
//   );

//   React.useEffect(() => {
//     userService
//       .getMyProfile()
//       .then((res) => {
//         const name = res.data?.displayName || res.data?.name || "User";
//         setUserName(name);
//         localStorage.setItem("userName", name); // cache for instant load next time
//       })
//       .catch(() => {
//         // keep whatever was cached in localStorage if the call fails
//       });
//   }, []);

//   const initials =
//     userName
//       .trim()
//       .split(" ")
//       .filter(Boolean)
//       .map((w) => w[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase() || "U";



//   const handleLogout = () => {
//     auth.logout();
//     navigate("/login");
//   };

//   return (
//     <>
//       <style>{`
//         .sidebar-root[data-dark="true"]  { background: #000000; border-right: 1px solid #1a1a1a; }
//         .sidebar-root[data-dark="false"] { background: #ffffff; border-right: 1px solid #e2e8f0; }

//         .sidebar-nav::-webkit-scrollbar { width: 3px; }
//         .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
//         [data-dark="true"]  .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius:10px; }
//         [data-dark="false"] .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius:10px; }

//         .nav-item {
//           width: 100%; display: flex; align-items: center;
//           padding: 7px 10px; border-radius: 9px; font-size: 13px;
//           font-weight: 500; transition: all 0.15s ease; cursor: pointer;
//           border: none; background: transparent; text-align: left; gap: 0;
//         }
//         [data-dark="false"] .nav-item              { color: #374151; }
//         [data-dark="false"] .nav-item:hover        { color: #1d4ed8; background: #eff6ff; }
//         [data-dark="false"] .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
//         [data-dark="false"] .nav-item.group-active { color: #1d4ed8; font-weight: 600; }
//         [data-dark="true"]  .nav-item              { color: #a1a1aa; }
//         [data-dark="true"]  .nav-item:hover        { color: #ffffff; background: rgba(255,255,255,0.07); }
//         [data-dark="true"]  .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.4); }
//         [data-dark="true"]  .nav-item.group-active { color: #60a5fa; font-weight: 600; }

//         /* ✅ AI Tools group — subtle purple tint to stand out */
//         [data-dark="false"] .nav-item.ai-group              { color: #7c3aed; }
//         [data-dark="false"] .nav-item.ai-group:hover        { color: #6d28d9; background: #f5f3ff; }
//         [data-dark="false"] .nav-item.ai-group.group-active { color: #6d28d9; background: #ede9fe; }
//         [data-dark="true"]  .nav-item.ai-group              { color: #a78bfa; }
//         [data-dark="true"]  .nav-item.ai-group:hover        { color: #c4b5fd; background: rgba(139,92,246,0.10); }
//         [data-dark="true"]  .nav-item.ai-group.group-active { color: #c4b5fd; background: rgba(139,92,246,0.14); }

//         [data-dark="false"] .nav-item.ai-group .icon-box              { background: #ede9fe; color: #7c3aed; }
//         [data-dark="false"] .nav-item.ai-group:hover .icon-box        { background: #ddd6fe; color: #6d28d9; }
//         [data-dark="false"] .nav-item.ai-group.group-active .icon-box { background: #ddd6fe; color: #6d28d9; }
//         [data-dark="true"]  .nav-item.ai-group .icon-box              { background: rgba(139,92,246,0.12); color: #a78bfa; }
//         [data-dark="true"]  .nav-item.ai-group:hover .icon-box        { background: rgba(139,92,246,0.18); color: #c4b5fd; }
//         [data-dark="true"]  .nav-item.ai-group.group-active .icon-box { background: rgba(139,92,246,0.20); color: #c4b5fd; }

//         /* ✅ AI child items — purple accent */
//         [data-dark="false"] .ai-child-item        { color: #7c3aed; }
//         [data-dark="false"] .ai-child-item:hover  { color: #6d28d9; background: #f5f3ff; }
//         [data-dark="false"] .ai-child-item.active { color: #ffffff; background: #7c3aed; font-weight: 600; box-shadow: 0 1px 6px rgba(124,58,237,0.25); }
//         [data-dark="true"]  .ai-child-item        { color: #a78bfa; }
//         [data-dark="true"]  .ai-child-item:hover  { color: #c4b5fd; background: rgba(139,92,246,0.09); }
//         [data-dark="true"]  .ai-child-item.active { color: #ffffff; background: #7c3aed; font-weight: 600; box-shadow: 0 1px 6px rgba(139,92,246,0.35); }

//         [data-dark="false"] .ai-connector { border-left: 2px solid #ddd6fe; }
//         [data-dark="true"]  .ai-connector { border-left: 2px solid rgba(139,92,246,0.25); }

//         /* ✅ NEW badge pill next to AI Tools label */
//         .ai-badge {
//           font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
//           padding: 1px 5px; border-radius: 20px; flex-shrink: 0;
//           margin-left: 4px; line-height: 1.6;
//         }
//         [data-dark="false"] .ai-badge { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
//         [data-dark="true"]  .ai-badge { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }

//         .icon-box {
//           width: 28px; height: 28px; display: flex; align-items: center;
//           justify-content: center; border-radius: 7px; flex-shrink: 0; transition: background 0.15s;
//         }
//         [data-dark="false"] .icon-box                  { background: #f1f5f9; color: #64748b; }
//         [data-dark="false"] .nav-item:hover .icon-box  { background: #dbeafe; color: #1d4ed8; }
//         [data-dark="false"] .nav-item.active .icon-box { background: rgba(255,255,255,0.20); color: #ffffff; }
//         [data-dark="true"]  .icon-box                  { background: rgba(255,255,255,0.08); color: #71717a; }
//         [data-dark="true"]  .nav-item:hover .icon-box  { background: rgba(255,255,255,0.12); color: #93c5fd; }
//         [data-dark="true"]  .nav-item.active .icon-box { background: rgba(255,255,255,0.20); color: #ffffff; }

//         .child-item {
//           width: 100%; display: flex; align-items: center;
//           gap: 7px; padding: 6px 10px; border-radius: 7px;
//           font-size: 12px; font-weight: 500; transition: all 0.14s ease;
//           cursor: pointer; border: none; background: transparent; text-align: left;
//         }
//         [data-dark="false"] .child-item        { color: #6b7280; }
//         [data-dark="false"] .child-item:hover  { color: #1d4ed8; background: #eff6ff; }
//         [data-dark="false"] .child-item.active { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 1px 6px rgba(37,99,235,0.2); }
//         [data-dark="true"]  .child-item        { color: #71717a; }
//         [data-dark="true"]  .child-item:hover  { color: #e4e4e7; background: rgba(255,255,255,0.06); }
//         [data-dark="true"]  .child-item.active { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 1px 6px rgba(37,99,235,0.4); }

//         [data-dark="false"] .child-connector { border-left: 2px solid #dbeafe; }
//         [data-dark="true"]  .child-connector { border-left: 2px solid rgba(59,130,246,0.20); }
//         .child-connector {
//           margin-left: 20px; padding-left: 8px;
//           margin-top: 2px; margin-bottom: 2px;
//           display: flex; flex-direction: column; gap: 1px;
//         }
//         .ai-connector {
//           margin-left: 20px; padding-left: 8px;
//           margin-top: 2px; margin-bottom: 2px;
//           display: flex; flex-direction: column; gap: 1px;
//         }

//         .role-badge {
//           display: inline-flex; align-items: center; gap: 5px;
//           padding: 3px 10px; border-radius: 20px;
//           font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
//         }
//         [data-dark="false"] .role-badge { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
//         [data-dark="true"]  .role-badge { background: rgba(59,130,246,0.12); color: #60a5fa; border: 1px solid rgba(59,130,246,0.22); }

//         .role-dot {
//           width: 5px; height: 5px; border-radius: 50%;
//           background: #22c55e; box-shadow: 0 0 5px #22c55e;
//           animation: pulse-dot 2s infinite;
//         }
//         @keyframes pulse-dot {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%       { opacity: 0.5; transform: scale(0.75); }
//         }

//         [data-dark="false"] .sidebar-header { border-bottom: 1px solid #e2e8f0; }
//         [data-dark="true"]  .sidebar-header { border-bottom: 1px solid #1a1a1a; }
//         [data-dark="false"] .sidebar-footer { border-top: 1px solid #e2e8f0; }
//         [data-dark="true"]  .sidebar-footer { border-top: 1px solid #1a1a1a; }
//         .sidebar-header { padding: 12px 10px; }
//         .sidebar-footer { padding: 8px; }

//         .collapse-btn {
//           padding: 6px; border-radius: 8px; cursor: pointer;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//           border: none; transition: all 0.15s;
//         }
//         [data-dark="false"] .collapse-btn       { background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; }
//         [data-dark="false"] .collapse-btn:hover { background: #dbeafe; color: #1d4ed8; border-color: #bfdbfe; }
//         [data-dark="true"]  .collapse-btn       { background: rgba(255,255,255,0.07); border: 1px solid #1a1a1a; color: #71717a; }
//         [data-dark="true"]  .collapse-btn:hover { background: rgba(255,255,255,0.12); color: #60a5fa; border-color: rgba(59,130,246,0.3); }

//         [data-dark="false"] .logo-sub { color: #111827; }
//         [data-dark="true"]  .logo-sub { color: #ffffff; }
//         [data-dark="false"] .logo-icon-box { background: #dbeafe; border: 1px solid #bfdbfe; }
//         [data-dark="true"]  .logo-icon-box { background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.22); }

//         .user-card {
//           display: flex; align-items: center; gap: 8px;
//           padding: 7px 8px; border-radius: 10px;
//         }
//         [data-dark="false"] .user-card { background: #f8fafc; border: 1px solid #e2e8f0; }
//         [data-dark="true"]  .user-card { background: rgba(255,255,255,0.05); border: 1px solid #1a1a1a; }

//         .user-avatar {
//           width: 30px; height: 30px; border-radius: 8px;
//           display: flex; align-items: center; justify-content: center;
//           font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
//           background: linear-gradient(135deg, #2563eb, #6366f1);
//           overflow: hidden;
//         }
//         .user-avatar img { width: 100%; height: 100%; object-fit: cover; }

//         [data-dark="false"] .user-name       { color: #0f172a; }
//         [data-dark="true"]  .user-name       { color: #ffffff; }
//         [data-dark="false"] .user-role-label { color: #94a3b8; }
//         [data-dark="true"]  .user-role-label { color: #52525b; }

//         .logout-btn {
//           padding: 5px; border-radius: 7px; border: none;
//           cursor: pointer; display: flex; align-items: center;
//           justify-content: center; flex-shrink: 0; margin-left: auto;
//           background: transparent; transition: all 0.15s;
//         }
//         [data-dark="false"] .logout-btn       { color: #94a3b8; }
//         [data-dark="false"] .logout-btn:hover { background: #fee2e2; color: #ef4444; }
//         [data-dark="true"]  .logout-btn       { color: #52525b; }
//         [data-dark="true"]  .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }

//         .theme-btn {
//           width: 100%; display: flex; align-items: center; gap: 8px;
//           padding: 6px 8px; border-radius: 8px; font-size: 12px; font-weight: 500;
//           background: transparent; border: none; cursor: pointer;
//           transition: all 0.15s; margin-bottom: 4px;
//         }
//         [data-dark="false"] .theme-btn       { color: #64748b; }
//         [data-dark="false"] .theme-btn:hover { background: #f1f5f9; color: #1e293b; }
//         [data-dark="true"]  .theme-btn       { color: #52525b; }
//         [data-dark="true"]  .theme-btn:hover { background: rgba(255,255,255,0.06); color: #ffffff; }

//         .theme-icon-box {
//           width: 26px; height: 26px; border-radius: 7px;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         [data-dark="false"] .theme-icon-box { background: #f1f5f9; border: 1px solid #e2e8f0; }
//         [data-dark="true"]  .theme-icon-box { background: rgba(255,255,255,0.07); border: 1px solid #1a1a1a; }

//         [data-dark="false"] .chevron                          { color: #cbd5e1; }
//         [data-dark="true"]  .chevron                          { color: #3f3f46; }
//         [data-dark="false"] .nav-item.group-active .chevron   { color: #2563eb; }
//         [data-dark="true"]  .nav-item.group-active .chevron   { color: #60a5fa; }
//         [data-dark="false"] .nav-item.ai-group .chevron              { color: #c4b5fd; }
//         [data-dark="false"] .nav-item.ai-group.group-active .chevron { color: #7c3aed; }
//         [data-dark="true"]  .nav-item.ai-group .chevron              { color: rgba(139,92,246,0.35); }
//         [data-dark="true"]  .nav-item.ai-group.group-active .chevron { color: #a78bfa; }

//         .role-select {
//           width: 100%; font-size: 11px; border-radius: 8px;
//           padding: 5px 8px; outline: none; cursor: pointer; font-weight: 500;
//         }
//         [data-dark="false"] .role-select        { border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; }
//         [data-dark="false"] .role-select option { background: #ffffff; color: #374151; }
//         [data-dark="true"]  .role-select        { border: 1px solid rgba(59,130,246,0.2); background: rgba(255,255,255,0.05); color: #93c5fd; }
//         [data-dark="true"]  .role-select option { background: #000000; color: #e4e4e7; }

//         .nav-label {
//           flex: 1; text-align: left;
//           overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
//           margin-left: 9px;
//         }
//       `}</style>

//       <aside
//         className="sidebar-root"
//         data-dark={String(dark)}
//         style={{
//           width: collapsed ? "58px" : "234px",
//           transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
//           flexShrink: 0,
//           display: "flex",
//           flexDirection: "column",
//           height: "100vh",
//           overflow: "hidden",
//           zIndex: 40,
//         }}
//       >
//         {/* ── HEADER ── */}
//         <div className="sidebar-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           {!collapsed && (
//             <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: "9px" }}>
//               <div className="logo-icon-box" style={{
//                 width: 33, height: 33, borderRadius: 9,
//                 display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
//               }}>
//                 <GraduationCap size={16} color="#2563eb" />
//               </div>
//               <div style={{ minWidth: 0 }}>
//                 <p className="text-[16px] font-extrabold font-serif leading-none whitespace-nowrap">
//                   <span className="text-green-600">ILM</span>
//                   <span className="text-orange-500 ml-1">ORA</span>
//                 </p>
//                 <p className="logo-sub" style={{ fontSize: 8, marginTop: 2, letterSpacing: "0.05em", margin: 0 }}>
//                   Intelligent Learning Management
//                 </p>
//               </div>
//             </div>
//           )}
//           <button
//             className="collapse-btn"
//             onClick={() => setCollapsed(c => !c)}
//             title={collapsed ? "Expand" : "Collapse"}
//             style={collapsed ? { margin: "0 auto" } : {}}
//           >
//             <Menu size={15} />
//           </button>
//         </div>

//         {/* ── ROLE BADGE ── */}
//         {!collapsed && (
//           <div style={{ padding: "7px 10px 3px" }}>
//             <span className="role-badge">
//               <span className="role-dot" />
//               {role.label}
//             </span>
//           </div>
//         )}

//         {/* ── ROLE SWITCHER ── */}
//         {showRoleDropdown && !collapsed && (
//           <div style={{ padding: "4px 10px 6px" }}>
//             <select className="role-select" value={currentRolePath} onChange={e => navigate(e.target.value)}>
//               <option value="/student">Student</option>
//               <option value="/trainer">Trainer</option>
//               <option value="/admin">Manager</option>
//               <option value="/business">Tenant Admin</option>
//               <option value="/superadmin">Super Admin</option>
//             </select>
//           </div>
//         )}

//         {/* ── NAV ── */}
//         <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", padding: "6px 7px", display: "flex", flexDirection: "column", gap: "2px" }}>
//           {menus.map((item) => {
//             const Icon    = item.icon;
//             const isOpen  = openGroups[item.name] ?? false;
//             const isAI    = item.name === "AI Tools"; // ✅ flag for AI group

//             if (item.children) {
//               const isGroupActive = item.children.some(c => location.pathname === c.path);
//               return (
//                 <div key={item.name}>
//                   <button
//                     className={`nav-item ${isGroupActive ? "group-active" : ""} ${isAI ? "ai-group" : ""}`}
//                     onClick={() => {
//                       if (collapsed) {
//                         setCollapsed(false);
//                         setOpenGroups(p => ({ ...p, [item.name]: true }));
//                       } else {
//                         setOpenGroups(p => ({ ...p, [item.name]: !isOpen }));
//                       }
//                     }}
//                     title={collapsed ? item.name : undefined}
//                   >
//                     <span className="icon-box"><Icon size={14} /></span>
//                     {!collapsed && (
//                       <>
//                         <span className="nav-label">{item.name}</span>
//                         {/* ✅ NEW badge only for AI Tools */}
//                         {isAI && <span className="ai-badge">NEW</span>}
//                         <ChevronDown
//                           size={13}
//                           className="chevron"
//                           style={{
//                             flexShrink: 0,
//                             transition: "transform 0.2s",
//                             transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//                             marginLeft: isAI ? 4 : 0,
//                           }}
//                         />
//                       </>
//                     )}
//                   </button>

//                   {!collapsed && isOpen && (
//                     // ✅ AI group gets purple connector, others get blue
//                     <div className={isAI ? "ai-connector" : "child-connector"}>
//                       {item.children.map(child => {
//                         const active    = location.pathname === child.path;
//                         const ChildIcon = child.icon;
//                         return (
//                           <button
//                             key={child.name}
//                             className={`${isAI ? "child-item ai-child-item" : "child-item"} ${active ? "active" : ""}`}
//                             onClick={() => navigate(child.path)}
//                           >
//                             <ChildIcon size={12} style={{ flexShrink: 0 }} />
//                             <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                               {child.name}
//                             </span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             const active = location.pathname === item.path;
//             return (
//               <button
//                 key={item.name}
//                 className={`nav-item ${active ? "active" : ""}`}
//                 onClick={() => navigate(item.path)}
//                 title={collapsed ? item.name : undefined}
//               >
//                 <span className="icon-box"><Icon size={14} /></span>
//                 {!collapsed && <span className="nav-label">{item.name}</span>}
//               </button>
//             );
//           })}
//         </nav>

//         {/* ── FOOTER ── */}
//         <div className="sidebar-footer">
//           <button className="theme-btn" onClick={toggleTheme}>
//             <span className="theme-icon-box">
//               {dark ? <Sun size={13} color="#3b82f6" /> : <Moon size={13} color="#64748b" />}
//             </span>
//             {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
//           </button>

//           {/* ✅ User card — profileImage hai toh photo, nahi toh initials */}
//           <div className="user-card">
//             <div className="user-avatar">
//               {profileImage
//                 ? <img src={profileImage} alt="Profile" />
//                 : initials
//               }
//             </div>
//             {!collapsed && (
//               <>
//                 <div style={{ flex: 1, overflow: "hidden" }}>
//                   <p className="user-name" style={{ fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>
//                     {userName}
//                   </p>
//                   <p className="user-role-label" style={{ fontSize: 10, margin: 0, lineHeight: 1.3 }}>
//                     {role.label}
//                   </p>
//                 </div>
//                 <button className="logout-btn" onClick={handleLogout} title="Logout">
//                   <LogOut size={13} />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;















































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
  ChevronDown,
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
  LogOut,
  Menu,
  MessageCircleQuestion,
  MessageSquare,
  Moon,
  NotebookPen,
  PanelTop,
  PlayCircle,
  Radio,
  Receipt,
  Settings,
  // ✅ AI Tools Icons
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Upload,
  Users,
  Video
} from "lucide-react";
import React from "react";

import { Phone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../auth";
import userService from "../services/userService";
// ✅ Shared AvatarContext se import
import { useAvatarContext } from "../context/AvatarContext";

/* ================================================================
   SIDEBAR MODES  (3-step folding: full -> icon -> hidden -> full)
================================================================ */
const SIDEBAR_WIDTHS = {
  full: 280,
  icon: 72,
  hidden: 0,
};

/* ================================================================
   MENUS
================================================================ */
const studentMenus = [
  {
    name: "Dashboard",
    path: "/student",
    icon: LayoutDashboard,
  },
  {
    name: "WorkSpace",
    path: "/student/workspace",
    icon: Video,
  },
  {
    name: "Learning & Classes",
    icon: Radio,
    children: [
      { name: "Live Classes",     path: "/student/live-classes",     icon: Radio      },
      { name: "Recorded Classes", path: "/student/recorded-classes", icon: PlayCircle },
      { name: "Call Trainer",     path: "/student/call-trainer",     icon: Phone      },
    ],
  },
  {
    name: "Learning Materials",
    icon: GraduationCap,
    children: [
      { name: "Video Lectures", path: "/student/videos",    icon: Video    },
      { name: "Documents",      path: "/student/documents", icon: FileText },
    ],
  },
  {
    name: "My Learning",
    icon: BookOpen,
    children: [
      { name: "My Courses",      path: "/student/courses",      icon: BookOpen       },
      { name: "Assessments",     path: "/student/assessments",  icon: ClipboardCheck },
      { name: "Assignments",     path: "/student/assignments",  icon: ClipboardEdit  },
      { name: "My Quiz History", path: "/student/my-quizzes",   icon: History        },
      { name: "Attendance",      path: "/student/attendance",   icon: CalendarDays   },
    ],
  },
  {
    name: "Skill & Growth",
    icon: TrendingUp,
    children: [
      { name: "Skill Map",    path: "/student/skill-map",    icon: Brain },
      { name: "Certificates", path: "/student/certificates", icon: Award },
    ],
  },

  // ── ✅ NEW: AI Tools ──────────────────────────────────────────
  {
    name: "AI Tools",
    icon: Sparkles,
    children: [
      {
        name: "Notebook AI",
        path: "/student/notebook",   // same path as before
        icon: NotebookPen,
      },
      {
        name: "Resume Builder",
        path: "/student/resume-builder",
        icon: FileCode2,
      },
    ],
  },
  // ─────────────────────────────────────────────────────────────

  {
    name: "Support",
    icon: MessageCircleQuestion,
    children: [
      { name: "Doubts",     path: "/student/doubts",    icon: MessageCircleQuestion },
      { name: "Feedback",   path: "/student/feedback",  icon: MessageSquare         },
      { name: "Coding Lab", path: "/student/compiler",  icon: FileText              },
      {
        name: "Study Plan",
        path: "/student/study-plan",
        icon: CalendarDays,
      },
    ],
  },
];

const trainerMenus = [
  { name: "Dashboard",        path: "/trainer",         icon: LayoutDashboard },
  { name: "Batch Management", path: "/trainer/batches", icon: Layers },
  {
    name: "WorkSpace",
    path: "/trainer/workspace",
    icon: Video,
  },
  {
    name: "Content Management", icon: FileText,
    children: [
      { name: "Upload Videos",      path: "/trainer/upload-videos",      icon: Video },
      { name: "Course Management",  path: "/trainer/course-management",  icon: BookOpen },
      { name: "Assessments",        path: "/trainer/assessments",        icon: ClipboardCheck },
      { name: "Attendance",         path: "/trainer/attendance",         icon: CalendarDays },
      { name: "Doubts Management",  path: "/trainer/doubts-management",  icon: MessageCircleQuestion },
      { name: "Feedback",           path: "/trainer/feedback",           icon: MessageCircleQuestion },
    ],
  },
  {
    name: "Live Classes", icon: Video,
    children: [
      { name: "Live Dashboard", path: "/trainer/live", icon: LayoutDashboard },
      {
        name: "Whiteboard",
        path: "/trainer/whiteboard",
        icon: PanelTop,
      },
      {
        name: "AI Companion",
        path: "/trainer/ai-companion",
        icon: Bot,
      },
    ],
  },
  {
    name: "Reports & Analytics", icon: BarChart3,
    children: [
      { name: "Student Reports",      path: "/trainer/student-reports", icon: FileSearch },
      { name: "Batch Reports",        path: "/trainer/batch-reports",   icon: FileText },
      { name: "Performance Analysis", path: "/trainer/performance",     icon: TrendingUp },
      { name: "Skill Analytics",      path: "/trainer/skill-analytics", icon: Brain },
      { name: "Coding Lab",           path: "/trainer/compiler",        icon: FileText },
      {
        name: "Study Plan",
        path: "/trainer/study-plan",
        icon: BookOpen,
      },
    ],
  },
];

const adminMenus = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  {
    name: "WorkSpace",
    path: "/admin/workspace",
    icon: Video,
  },
  {
    name: "Organisation Manager", icon: Building2,
    path: "/admin/organisation-overview",
  },
  {
    name: "Assessment System",
    icon: ClipboardCheck,
    path: "/admin/assessment-system",
  },
  {
    name: "Course Management", icon: BookOpen,
    children: [
      { name: "All Courses", path: "/admin/courses", icon: BookOpen },
    ],
  },
  {
    name: "Video Management",
    icon: Video,
    children: [
      {
        name: "Admin Videos",
        path: "/admin/videos",
        icon: Video,
      },

    ],

  },
  {
    name: "File Management",
    icon: FileText,
    children: [
      {
        name: "Admin Files",
        path: "/admin/files",
        icon: FileText,
      },
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
      { name: "Usage Analytics",  path: "/admin/usage",            icon: LineChart },
      { name: "Skill Analytics",  path: "/admin/skill-analytics",  icon: Brain },
      { name: "Feedback Review",  path: "/admin/feedback-review",  icon: MessageCircleQuestion },
      {
        name: "Attendance",
        path: "/admin/attendance",
        icon: CalendarDays,
      },
      { name: "Settings",         path: "/admin/settings",         icon: Settings },

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
   Accepts optional controlled props (sidebarMode / setSidebarMode)
   from DashboardLayout. Falls back to internal state so the
   component still works if rendered standalone anywhere else.
================================================================ */
const Sidebar = ({ sidebarMode: sidebarModeProp, setSidebarMode: setSidebarModeProp } = {}) => {
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

  // ── 3-step fold state: "full" | "icon" | "hidden" ──────────────
  const [internalMode, setInternalMode] = React.useState(() => {
    try {
      return localStorage.getItem("sidebarMode") || "full";
    } catch {
      return "full";
    }
  });
  const sidebarMode    = sidebarModeProp    ?? internalMode;
  const setSidebarMode = setSidebarModeProp ?? setInternalMode;

  React.useEffect(() => {
    try { localStorage.setItem("sidebarMode", sidebarMode); } catch (_) {}
  }, [sidebarMode]);

  const toggleSidebar = () => {
    setSidebarMode(prev =>
      prev === "full" ? "icon" : prev === "icon" ? "hidden" : "full"
    );
  };

  const collapsed = sidebarMode === "icon";   // icon-only rail
  const hidden    = sidebarMode === "hidden"; // fully hidden
  const sidebarWidth = SIDEBAR_WIDTHS[sidebarMode];

  const [openGroups, setOpenGroups] = React.useState({});
  const [flyoutGroup, setFlyoutGroup] = React.useState(null); // hover/click flyout in icon mode
  const flyoutCloseTimer = React.useRef(null);

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

  // const userName = localStorage.getItem("userName") || "User";
  // const initials  = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
   const [userName, setUserName] = React.useState(
    localStorage.getItem("userName") || "User",
  );

  React.useEffect(() => {
    userService
      .getMyProfile()
      .then((res) => {
        const name = res.data?.displayName || res.data?.name || "User";
        setUserName(name);
        localStorage.setItem("userName", name); // cache for instant load next time
      })
      .catch(() => {
        // keep whatever was cached in localStorage if the call fails
      });
  }, []);

  const initials =
    userName
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";



  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  // ── Flyout helpers (icon mode only) ────────────────────────────
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
        .sidebar-root[data-dark="true"]  { background: #000000; border-right: 1px solid #1a1a1a; }
        .sidebar-root[data-dark="false"] { background: #ffffff; border-right: 1px solid #e2e8f0; }
        .sidebar-root {
          position: relative;
          transition: width .28s ease, margin .28s ease, transform .28s ease;
           z-index: 40;
        }
        .sidebar-root[data-mode="hidden"] {
          border-right-width: 0;
          pointer-events: none;
        }

        .sidebar-nav::-webkit-scrollbar { width: 3px; }
        .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
        [data-dark="true"]  .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius:10px; }
        [data-dark="false"] .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius:10px; }

        .nav-item {
          width: 100%; display: flex; align-items: center;
          padding: 7px 10px; border-radius: 9px; font-size: 13px;
          font-weight: 500; transition: all 0.15s ease; cursor: pointer;
          border: none; background: transparent; text-align: left; gap: 0;
          position: relative;
        }
        [data-dark="false"] .nav-item              { color: #374151; }
        [data-dark="false"] .nav-item:hover        { color: #1d4ed8; background: #eff6ff; }
        [data-dark="false"] .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.25); }
        [data-dark="false"] .nav-item.group-active { color: #1d4ed8; font-weight: 600; }
        [data-dark="true"]  .nav-item              { color: #a1a1aa; }
        [data-dark="true"]  .nav-item:hover        { color: #ffffff; background: rgba(255,255,255,0.07); }
        [data-dark="true"]  .nav-item.active       { color: #ffffff; background: #2563eb; font-weight: 600; box-shadow: 0 2px 8px rgba(37,99,235,0.4); }
        [data-dark="true"]  .nav-item.group-active { color: #60a5fa; font-weight: 600; }

        /* ✅ AI Tools group — subtle purple tint to stand out */
        [data-dark="false"] .nav-item.ai-group              { color: #7c3aed; }
        [data-dark="false"] .nav-item.ai-group:hover        { color: #6d28d9; background: #f5f3ff; }
        [data-dark="false"] .nav-item.ai-group.group-active { color: #6d28d9; background: #ede9fe; }
        [data-dark="true"]  .nav-item.ai-group              { color: #a78bfa; }
        [data-dark="true"]  .nav-item.ai-group:hover        { color: #c4b5fd; background: rgba(139,92,246,0.10); }
        [data-dark="true"]  .nav-item.ai-group.group-active { color: #c4b5fd; background: rgba(139,92,246,0.14); }

        [data-dark="false"] .nav-item.ai-group .icon-box              { background: #ede9fe; color: #7c3aed; }
        [data-dark="false"] .nav-item.ai-group:hover .icon-box        { background: #ddd6fe; color: #6d28d9; }
        [data-dark="false"] .nav-item.ai-group.group-active .icon-box { background: #ddd6fe; color: #6d28d9; }
        [data-dark="true"]  .nav-item.ai-group .icon-box              { background: rgba(139,92,246,0.12); color: #a78bfa; }
        [data-dark="true"]  .nav-item.ai-group:hover .icon-box        { background: rgba(139,92,246,0.18); color: #c4b5fd; }
        [data-dark="true"]  .nav-item.ai-group.group-active .icon-box { background: rgba(139,92,246,0.20); color: #c4b5fd; }

        /* ✅ AI child items — purple accent */
        [data-dark="false"] .ai-child-item        { color: #7c3aed; }
        [data-dark="false"] .ai-child-item:hover  { color: #6d28d9; background: #f5f3ff; }
        [data-dark="false"] .ai-child-item.active { color: #ffffff; background: #7c3aed; font-weight: 600; box-shadow: 0 1px 6px rgba(124,58,237,0.25); }
        [data-dark="true"]  .ai-child-item        { color: #a78bfa; }
        [data-dark="true"]  .ai-child-item:hover  { color: #c4b5fd; background: rgba(139,92,246,0.09); }
        [data-dark="true"]  .ai-child-item.active { color: #ffffff; background: #7c3aed; font-weight: 600; box-shadow: 0 1px 6px rgba(139,92,246,0.35); }

        [data-dark="false"] .ai-connector { border-left: 2px solid #ddd6fe; }
        [data-dark="true"]  .ai-connector { border-left: 2px solid rgba(139,92,246,0.25); }

        /* ✅ NEW badge pill next to AI Tools label */
        .ai-badge {
          font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
          padding: 1px 5px; border-radius: 20px; flex-shrink: 0;
          margin-left: 4px; line-height: 1.6;
        }
        [data-dark="false"] .ai-badge { background: #ede9fe; color: #7c3aed; border: 1px solid #ddd6fe; }
        [data-dark="true"]  .ai-badge { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }

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
        .ai-connector {
          margin-left: 20px; padding-left: 8px;
          margin-top: 2px; margin-bottom: 2px;
          display: flex; flex-direction: column; gap: 1px;
        }

        /* ── Flyout submenu (icon mode: hover / click beside the rail) ── */
        .flyout-menu {
          position: absolute;
          left: calc(100% + 8px);
          top: -4px;
          min-width: 208px;
          border-radius: 12px;
          padding: 6px;
          z-index: 60;
          display: flex;
          flex-direction: column;
          gap: 1px;
          animation: flyoutIn 0.14s ease;
        }
        @keyframes flyoutIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        [data-dark="false"] .flyout-menu { background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 12px 32px rgba(15,23,42,0.14); }
        [data-dark="true"]  .flyout-menu { background: #0a0a0a; border: 1px solid #1a1a1a; box-shadow: 0 12px 32px rgba(0,0,0,0.55); }
        .flyout-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.04em; padding: 6px 8px 4px;
        }
        [data-dark="false"] .flyout-title { color: #94a3b8; }
        [data-dark="true"]  .flyout-title { color: #52525b; }

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
        [data-dark="false"] .nav-item.ai-group .chevron              { color: #c4b5fd; }
        [data-dark="false"] .nav-item.ai-group.group-active .chevron { color: #7c3aed; }
        [data-dark="true"]  .nav-item.ai-group .chevron              { color: rgba(139,92,246,0.35); }
        [data-dark="true"]  .nav-item.ai-group.group-active .chevron { color: #a78bfa; }

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

        /* ── Icon-mode centering fix ──
           When only the icon-box renders (label hidden), the button's
           default flex-start alignment left-shoves it against the
           padding instead of centering it in the 72px rail. This was
           the "icon layout broken" bug — center everything explicitly. */
        .sidebar-root[data-mode="icon"] .nav-item {
          justify-content: center;
          padding: 9px 0;
        }
        .sidebar-root[data-mode="icon"] .sidebar-nav {
          padding-left: 0;
          padding-right: 0;
          align-items: center;
        }
        .sidebar-root[data-mode="icon"] .sidebar-nav > div {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .sidebar-root[data-mode="icon"] .theme-btn {
          justify-content: center;
          padding: 6px 0;
        }
        .sidebar-root[data-mode="icon"] .user-card {
          justify-content: center;
          padding: 7px 0;
        }
        .sidebar-root[data-mode="icon"] .sidebar-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ── Mobile/tablet: only "full" mode becomes a fixed overlay
               (280px is too wide to push content on a phone/iPad).
               "icon" mode (72px) behaves EXACTLY like desktop — it
               just pushes the content column — so the fold concept
               (full → icon → hidden) feels identical on every device. ── */
        .sidebar-backdrop { display: none; }
        @media (max-width: 768px) {
          .sidebar-root[data-mode="full"] {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            z-index: 70;
            box-shadow: 8px 0 32px rgba(0,0,0,0.25);
          }
          .sidebar-backdrop[data-show="true"] {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15,23,42,0.45);
            z-index: 65;
            animation: flyoutIn 0.2s ease;
          }
        }
      `}</style>

      {/* Mobile-only dim backdrop — shown only behind "full" mode.
          "icon" mode never dims the screen, same as on desktop. */}
      <div
        className="sidebar-backdrop"
        data-show={sidebarMode === "full"}
        onClick={() => setSidebarMode("hidden")}
      />

      <aside
        className="sidebar-root"
        data-dark={String(dark)}
        data-mode={sidebarMode}
        aria-hidden={hidden}
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          
          opacity: hidden ? 0 : 1,
        }}
      >
        {/* ── HEADER ── */}
        <div className="sidebar-header" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {!collapsed && !hidden && (
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
          {!hidden && (
            <button
              className="collapse-btn"
              onClick={toggleSidebar}
              title={collapsed ? "Expand" : "Collapse"}
              style={collapsed ? { margin: "0 auto" } : {}}
            >
              <Menu size={15} />
            </button>
          )}
        </div>

        {/* ── ROLE BADGE ── */}
        {!collapsed && !hidden && (
          <div style={{ padding: "7px 10px 3px" }}>
            <span className="role-badge">
              <span className="role-dot" />
              {role.label}
            </span>
          </div>
        )}

        {/* ── ROLE SWITCHER ── */}
        {showRoleDropdown && !collapsed && !hidden && (
          <div style={{ padding: "4px 10px 6px" }}>
            <select className="role-select" value={currentRolePath} onChange={e => navigate(e.target.value)}>
              <option value="/student">Student</option>
              <option value="/trainer">Trainer</option>
              <option value="/admin">Manager</option>
              <option value="/business">Tenant Admin</option>
              <option value="/superadmin">Super Admin</option>
            </select>
          </div>
        )}

        {/* ── NAV ── */}
        <nav className="sidebar-nav" style={{ flex: 1, overflowY: "auto", overflowX: "visible", padding: "6px 7px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {menus.map((item) => {
            const Icon    = item.icon;
            const isOpen  = openGroups[item.name] ?? false;
            const isAI    = item.name === "AI Tools"; // ✅ flag for AI group
            const isFlyoutOpen = collapsed && flyoutGroup === item.name;

            if (item.children) {
              const isGroupActive = item.children.some(c => location.pathname === c.path);
              return (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={() => collapsed && openFlyout(item.name)}
                  onMouseLeave={() => collapsed && scheduleCloseFlyout()}
                >
                  <button
                    className={`nav-item ${isGroupActive ? "group-active" : ""} ${isAI ? "ai-group" : ""}`}
                    onClick={() => {
                      if (collapsed) {
                        // icon mode → toggle flyout instead of expanding the rail
                        setFlyoutGroup(prev => (prev === item.name ? null : item.name));
                      } else {
                        setOpenGroups(p => ({ ...p, [item.name]: !isOpen }));
                      }
                    }}
                    title={collapsed ? item.name : undefined}
                  >
                    <span className="icon-box"><Icon size={14} /></span>
                    {!collapsed && !hidden && (
                      <>
                        <span className="nav-label">{item.name}</span>
                        {/* ✅ NEW badge only for AI Tools */}
                        {isAI && <span className="ai-badge">NEW</span>}
                        <ChevronDown
                          size={13}
                          className="chevron"
                          style={{
                            flexShrink: 0,
                            transition: "transform 0.2s",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            marginLeft: isAI ? 4 : 0,
                          }}
                        />
                      </>
                    )}
                  </button>

                  {/* Full mode: inline accordion connector (unchanged) */}
                  {!collapsed && !hidden && isOpen && (
                    <div className={isAI ? "ai-connector" : "child-connector"}>
                      {item.children.map(child => {
                        const active    = location.pathname === child.path;
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.name}
                            className={`${isAI ? "child-item ai-child-item" : "child-item"} ${active ? "active" : ""}`}
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

                  {/* Icon mode: flyout submenu beside the rail (hover or click) */}
                  {isFlyoutOpen && (
                    <div
                      className="flyout-menu"
                      onMouseEnter={() => openFlyout(item.name)}
                      onMouseLeave={() => scheduleCloseFlyout()}
                    >
                      <div className="flyout-title">{item.name}</div>
                      {item.children.map(child => {
                        const active    = location.pathname === child.path;
                        const ChildIcon = child.icon;
                        return (
                          <button
                            key={child.name}
                            className={`${isAI ? "child-item ai-child-item" : "child-item"} ${active ? "active" : ""}`}
                            onClick={() => {
                              navigate(child.path);
                              setFlyoutGroup(null);
                            }}
                          >
                            <ChildIcon size={13} style={{ flexShrink: 0 }} />
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
                {!collapsed && !hidden && <span className="nav-label">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* ── FOOTER ── */}
        <div className="sidebar-footer">
          <button className="theme-btn" onClick={toggleTheme} title={collapsed ? (dark ? "Light Mode" : "Dark Mode") : undefined}>
            <span className="theme-icon-box">
              {dark ? <Sun size={13} color="#3b82f6" /> : <Moon size={13} color="#64748b" />}
            </span>
            {!collapsed && !hidden && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* ✅ User card — profileImage hai toh photo, nahi toh initials */}
          <div className="user-card" title={collapsed ? userName : undefined}>
            <div className="user-avatar">
              {profileImage
                ? <img src={profileImage} alt="Profile" />
                : initials
              }
            </div>
            {!collapsed && !hidden && (
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