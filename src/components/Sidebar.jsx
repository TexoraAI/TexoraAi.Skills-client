import React from "react";

import {
  LayoutDashboard,
  GraduationCap,
  Video,
  FileText,
  FolderOpen,
  BookOpen,
  ClipboardCheck,
  ClipboardEdit,
  History,
  CalendarDays,
  MessageCircleQuestion,
  Award,
  Users,
  UserCog,
  ShieldCheck,
  BarChart3,
  Activity,
  TrendingUp,
  LineChart,
  Briefcase,
  Building2,
  Layers,
  Target,
  DollarSign,
  Receipt,
  Settings,
  Mail,
  FileSearch,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Radio,
  PlayCircle,
  Mic,
  Upload,
  List
} from "lucide-react";


import { useLocation, useNavigate } from "react-router-dom";
import auth from "../auth";

/* ================= MENUS ================= */

// STUDENT MENUS
const studentMenus = [
  { name: "Dashboard", path: "/student", icon: LayoutDashboard },

  {
    name: "Live & Recorded",
    icon: Radio,
    children: [
      { name: "Live Classes", path: "/student/live-classes", icon: Radio },
      { name: "Recorded Classes", path: "/student/recorded-classes", icon: PlayCircle },
    ],
  },

  {
    name: "Learning Materials",
    icon: GraduationCap,
    children: [
      { name: "Video Lectures", path: "/student/videos", icon: Video },
      { name: "Documents", path: "/student/documents", icon: FileText },
      
    ],
  },

  {
    name: "My Courses",
    icon: BookOpen,
    children: [
      { name: "My Courses", path: "/student/courses", icon: BookOpen },
      { name: "Assessments", path: "/student/assessments", icon: ClipboardCheck },
      { name: "Assignments", path: "/student/assignments", icon: ClipboardEdit },
      { name: "My Quiz History", path: "/student/my-quizzes", icon: History },
      { name: "Attendance", path: "/student/attendance", icon: CalendarDays },
      { name: "Doubts", path: "/student/doubts", icon: MessageCircleQuestion },
      { name: "Certificates", path: "/student/certificates", icon: Award },
    ],
  },
];

// TRAINER MENUS
const trainerMenus = [
  { name: "Dashboard", path: "/trainer", icon: LayoutDashboard },

  { name: "Batch Management", path: "/trainer/batches", icon: Layers },

  //  LIVE CLASSES MODULE
  {
    name: "Live Classes",
    icon: Video,
    children: [
      { 
        name: "Live Dashboard", 
        path: "/trainer/live", 
        icon: LayoutDashboard 
      },
      { 
        name: "Start Live Session", 
        path: "/trainer/start-live", 
        icon: Video 
      },
      { 
        name: "Live Session Controls", 
        path: "/trainer/live-controls", 
        icon: Mic 
      },
      { 
        name: "Live Session History", 
        path: "/trainer/live-history", 
        icon: History 
      },
      { 
        name: "Live Attendance Report", 
        path: "/trainer/live-attendance", 
        icon: Users 
      },
    ],
  },

  //  RECORDED CLASSES MODULE
  {
    name: "Recorded Classes",
    icon: PlayCircle,
    children: [
      { 
        name: "Upload Recorded Video", 
        path: "/trainer/upload-recorded", 
        icon: Upload 
      },
      { 
        name: "Recorded Classes List", 
        path: "/trainer/recorded-list", 
        icon: List
      },
    ],
  },

  //  CONTENT MANAGEMENT
  {
    name: "Content Management",
    icon: FileText,
    children: [
      { name: "Upload Videos", path: "/trainer/upload-videos", icon: Video },
      { name: "Upload Documents", path: "/trainer/upload-docs", icon: FileText },
      { name: "Create Quiz", path: "/trainer/create-quiz", icon: ClipboardEdit },
      { name: "My Quizzes", path: "/trainer/my-quizzes", icon: ClipboardCheck },
      { name: "Create Assignments", path: "/trainer/create-assignments", icon: ClipboardEdit },
      { name: "Course Management", path: "/trainer/course-management", icon: BookOpen },
      { name: "Assessments", path: "/trainer/assessments", icon: ClipboardCheck },
      { name: "Attendance", path: "/trainer/attendance", icon: CalendarDays },
      { name: "Doubts Management", path: "/trainer/doubts-management", icon: MessageCircleQuestion },
    ],
  },

  //  REPORTS
  {
    name: "Reports & Analytics",
    icon: BarChart3,
    children: [
      { name: "Student Reports", path: "/trainer/student-reports", icon: FileSearch },
      { name: "Batch Reports", path: "/trainer/batch-reports", icon: FileText },
      { name: "Performance Analysis", path: "/trainer/performance", icon: TrendingUp },
    ],
  },
];


// ADMIN MENUS
const adminMenus = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },

  {
    name: "Organisation Manager",
    icon: Building2,
    children: [
      { name: "Settings", path: "/admin/settings", icon: Settings },
      { name: "DepartmentList", path: "/admin/departmentlist", icon: Layers },
      { name: "Branches", path: "/admin/branches", icon: Building2 },
      { name: "Batches", path: "/admin/batches", icon: Layers },
    ],
  },

  {
    name: "User Management",
    icon: Users,
    children: [
      { name: "All Users", path: "/admin/users", icon: Users },
      { name: "Students", path: "/admin/students", icon: GraduationCap },
      { name: "Trainers", path: "/admin/trainers", icon: UserCog },
      { name: "Pending Users", path: "/admin/pending-users", icon: ClipboardCheck },
    ],
  },

  {
    name: "Course Management",
    icon: BookOpen,
    children: [
      { name: "All Courses", path: "/admin/courses", icon: BookOpen },
      { name: "Categories", path: "/admin/categories", icon: FolderOpen },
    ],
  },

  // ✅ NEW DROPDOWN ADDED HERE
  {
    name: "Live & Recorded Control",
    icon: Video,
    children: [
      { name: "Admin Live Sessions", path: "/admin/live-sessions", icon: Radio },
      { name: "Admin Recorded Videos", path: "/admin/recorded-videos", icon: Video },
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
      { name: "Feedback", path: "/admin/feedback", icon: MessageCircleQuestion },
    ],
  },
];

// SUPER ADMIN MENUS
const superAdminMenus = [
  { name: "Dashboard", path: "/super-admin/dashboard", icon: LayoutDashboard },
  {
    name: "Controls",
    icon: ShieldCheck,
    children: [
      { name: "Admin Control", path: "/super-admin/admin-control", icon: UserCog },
      { name: "Business Control", path: "/super-admin/business-control", icon: Briefcase },
      { name: "Trainer Control", path: "/super-admin/trainer-control", icon: Users },
      { name: "Student Control", path: "/super-admin/student-control", icon: GraduationCap },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Role Page Matrix", path: "/super-admin/settings/role-matrix", icon: ShieldCheck },
      { name: "Send Email", path: "/super-admin/settings/send-email", icon: Mail },
      { name: "Audit Logs", path: "/super-admin/settings/audit-logs", icon: FileSearch },
    ],
  },
];

// BUSINESS MENUS
const businessMenus = [
  { name: "Dashboard", path: "/business", icon: LayoutDashboard },
  {
    name: "Hiring Manager",
    icon: Briefcase,
    children: [
      { name: "Job Openings", path: "/business/jobs", icon: Briefcase },
      { name: "Applications", path: "/business/applications", icon: ClipboardCheck },
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
      { name: "New Enrollments", path: "/business/enrollments", icon: BookOpen },
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

/* ================= SIDEBAR ================= */

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTrainer = location.pathname.startsWith("/trainer");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBusiness = location.pathname.startsWith("/business");
  const isSuperAdmin = location.pathname.startsWith("/super-admin");

  let menus = studentMenus;
  if (isSuperAdmin) menus = superAdminMenus;
  else if (isTrainer) menus = trainerMenus;
  else if (isAdminRoute) menus = adminMenus;
  else if (isBusiness) menus = businessMenus;

  const [openGroups, setOpenGroups] = React.useState({});
  const [dark, setDark] = React.useState(
    document.documentElement.classList.contains("dark"),
  );

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const currentRole = localStorage.getItem("role");
  const showRoleDropdown = currentRole === "ADMIN";

  const currentRolePath = isSuperAdmin
    ? "/super-admin/dashboard"
    : isAdminRoute
      ? "/admin"
      : isTrainer
        ? "/trainer"
        : isBusiness
          ? "/business"
          : "/student";

  const handleRoleChange = (value) => {
    navigate(value);
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold">TexoraAi<span className="text-blue-600">.skills</span></p>
            <p className="text-xs text-slate-500">Learning Platform</p>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* ADMIN ROLE DROPDOWN */}
        {showRoleDropdown && (
          <select
            value={currentRolePath}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          >
            <option value="/student">Student</option>
            <option value="/trainer">Trainer</option>
            <option value="/admin">Admin</option>
            <option value="/business">Business</option>
            <option value="/super-admin/dashboard">Super Admin</option>
          </select>
        )}
      </div>

      {/* MENUS */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menus.map((item) => {
          const Icon = item.icon;
          const isOpen = openGroups[item.name] ?? true;

          if (item.children) {
            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    setOpenGroups((p) => ({ ...p, [item.name]: !isOpen }))
                  }
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    {item.name}
                  </span>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {isOpen &&
                  item.children.map((child) => {
                    const active = location.pathname === child.path;
                    const ChildIcon = child.icon;

                    return (
                      <button
                        key={child.name}
                        onClick={() => navigate(child.path)}
                        className={`ml-3 w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg ${
                          active
                            ? "bg-blue-600 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <ChildIcon size={15} />
                        {child.name}
                      </button>
                    );
                  })}
              </div>
            );
          }

          const active = location.pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={16} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
