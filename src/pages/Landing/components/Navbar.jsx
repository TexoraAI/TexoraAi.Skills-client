// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Award,
//   BarChart3,
//   BookOpen,
//   ChevronDown,
//   Code2,
//   FileText,
//   GraduationCap,
//   Lock,
//   LogOut,
//   Menu,
//   Moon,
//   Sparkles,
//   Sun,
//   User,
//   UserCog,
//   Users,
//   LayoutDashboard,
//   PenTool,
//   CalendarCheck,
  
// } from "lucide-react";
// import MobileFullScreenMenu from "./MobileFullScreenMenu";

// // ILM ORA Feature dropdown items, in this exact order: Student Hub,
// // Trainer Hub, Manager Hub, Whiteboard, AI Companion, AI Resume Builder,
// // Coding Lab.
// const HUB_MENU_ITEMS = [
//   { key: "student", title: "Student Hub", description: "AI-Powered Learning & Career Growth", icon: "GraduationCap" },
//   { key: "trainer", title: "Trainer Hub", description: "Training Management & Mentorship", icon: "Users" },
//   { key: "admin", title: "Manager Hub", description: "Analytics, Performance & Team Development", icon: "BarChart3" },
//   { key: "whiteboard", title: "Whiteboard", description: "Draw, Design & Collaborate Visually", icon: "PenTool" },
//   { key: "aiCompanion", title: "AI Companion", description: "Your personal AI tutor, 24/7", icon: "Sparkles" },
//   { key: "resume", title: "AI Resume Builder", description: "Build a job-ready resume with AI", icon: "FileText" },
//   { key: "codingLab", title: "Coding Lab", description: "Practice, Code & Build Real Projects", icon: "Code2" },
//   { key: "studyPlan", title: "Study Plan", description: "Personalized Study Plans & Progress Tracking", icon: "CalendarCheck" },
// ];

// // Product dropdown — ILM ORA Calendry (renamed from "ILM ORA Meet"; same
// // route/functionality) and Workspace only. Resume Builder, AI Companion,
// // and Whiteboard moved up into ILM ORA Feature above.
// const PRODUCT_MENU_ITEMS = [
//   { key: "meet", title: "ILM ORA Calendry", description: "Live classes & video sessions", icon: "LayoutDashboard" },
//   { key: "workspace", title: "Workspace", description: "Your all-in-one collaborative space", icon: "Users" },
// ];

// // Icon name (string) → actual lucide-react component.
// const NAV_ICON_MAP = {
//    GraduationCap,
//   Users,
//   BarChart3,
//   FileText,
//   LayoutDashboard,
//   Sparkles,
//   PenTool,
//   Code2,
//   CalendarCheck,
// };
// const HUB_ROUTES = {
//   student: "/student-hub",
//   trainer: "/trainer-hub",
//   admin: "/manager-hub",
//   whiteboard: "/whiteboard",
//   aiCompanion: "/ai-companion",
//   resume: "/resume-builder",
//   codingLab: "/coding-lab",
//   studyPlan: "/study-plan",
// };
// const PRODUCT_ROUTES = {
//   meet: "/ilm-ora-meet",
//   resume: "/resume-builder",
//   workspace: "/workspace",
//   aiCompanion: "/ai-companion",
//   whiteboard: "/whiteboard",
// };
// const HUB_ICON_COLORS = {
//   student: "text-green-600",
//   trainer: "text-blue-600",
//   admin: "text-purple-600",
//   whiteboard: "text-orange-500",
//   aiCompanion: "text-purple-500",
//   resume: "text-green-600",
//   codingLab: "text-cyan-600",
//   studyPlan: "text-orange-500",
// };
// const PRODUCT_ICON_COLORS = {
//   meet: "text-orange-500",
//   workspace: "text-orange-500",
// };

// /* ─────────────────────────────────────────────────────────────────
//    NAVBAR — logo, desktop navigation, mega menu, dropdowns, user/login
//    state, avatar/profile menu, logout, "Get Started" CTA, mobile menu
//    button, theme toggle, scroll effects, sticky behavior.
// ───────────────────────────────────────────────────────────────── */
// export default function Navbar({ theme, toggleTheme, setShowLoginModal }) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [user, setUser] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Bug fix: this used to read sessionStorage["user"], a key the real
//   // login flow never writes to — so this navbar never saw a logged-in
//   // user. It now reads the SAME real session source IlmOraDemoPage.jsx
//   // already uses (localStorage["lms_token"] / localStorage["lms_user"]),
//   // so the same authenticated session is detected everywhere, including
//   // after navigating away from /ilm-demo to a public page.
//   useEffect(() => {
//     const token = localStorage.getItem("lms_token");
//     const rawUser = localStorage.getItem("lms_user");
//     let parsedUser = null;
//     try {
//       parsedUser = rawUser ? JSON.parse(rawUser) : null;
//     } catch {
//       parsedUser = null;
//     }

//     // Same stale-data guard IlmOraDemoPage.jsx already runs on mount: a
//     // bare isNewUser:true flag with no matching Google credential is
//     // leftover data from an interrupted Google sign-in (tab/browser
//     // closed before role selection finished) — sessionStorage clears on
//     // session end but localStorage["lms_user"] doesn't, so this flag can
//     // outlive the real session. Without this check, a public page loaded
//     // first (before /ilm-demo ever mounts and cleans it up) would trust
//     // the stale flag and show the avatar for a user who never logged in.
//     const hasGoogleCred = !!sessionStorage.getItem("ilmora_google_credential");
//     if (!token && parsedUser?.isNewUser === true && !hasGoogleCred) {
//       localStorage.removeItem("lms_user");
//       setUser(null);
//       return;
//     }

//     if (token || parsedUser) {
//       setUser(parsedUser || {});
//     } else {
//       setUser(null);
//     }
//   }, []);

//   // Same fields the "Student Hub"/"Trainer Hub"/"Manager Hub" logic in
//   // IlmOraDemoPage.jsx already normalizes role strings with — copied
//   // here as a pure function (no shared/duplicate STATE, just the same
//   // string-mapping logic) so "Go to Dashboard" below sends the user to
//   // the correct role dashboard, same as it does on /ilm-demo.
//   const normalizeAppRole = (raw) => {
//     const r = (raw || "").toString().trim().toUpperCase();
//     if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER", "PARTNERSHIP"].includes(r))
//       return "admin";
//     if (r === "TRAINER") return "trainer";
//     if (r === "STUDENT") return "student";
//     return "";
//   };
//   const DASHBOARD_ROUTE_BY_ROLE = {
//     student: "/student/dashboard",
//     trainer: "/trainer/dashboard",
//     admin: "/admin/dashboard",
//   };
//   const goToDashboard = () => {
//     const role =
//       normalizeAppRole(user?.role) ||
//       normalizeAppRole(localStorage.getItem("role")) ||
//       "student";
//     navigate(DASHBOARD_ROUTE_BY_ROLE[role] || "/ilm-demo");
//   };
//   // Same roleChangeUsed flag IlmOraDemoPage.jsx's hasUsedRoleChange()
//   // already reads from lms_user — same source, read here too. Kept for
//   // potential future use even though the public dropdown no longer
//   // surfaces an "Edit Role" item itself.
//   const hasUsedRoleChange = () => !!user?.roleChangeUsed;

//   // Mirrors IlmOraDemoPage.jsx's handleSignOut exactly — same keys
//   // cleared, so signing out here fully signs the user out everywhere,
//   // not just on this page.
//   const handleLogout = () => {
//     localStorage.removeItem("lms_token");
//     localStorage.removeItem("lms_user");
//     localStorage.removeItem("role");
//     localStorage.removeItem("organizationId");
//     localStorage.removeItem("selectedPlan");
//     sessionStorage.removeItem("ilmora_google_user");
//     sessionStorage.removeItem("ilmora_google_credential");
//     sessionStorage.removeItem("ilmora_profile_return_path");
//     setUser(null);
//     navigate("/", { replace: true });
//   };

//   const navLinks = [
//   {
//     text: "Mentors",
//     href: "#mentors",
//     icon: BookOpen,
//     color: "text-orange-500",
//     description: "Learn from Industry Experts",
//   },
//   {
//     text: "Success Stories",
//     href: "#successstories",
//     icon: Award,
//     color: "text-green-500",
//     description: "Real Success Stories from Learners",
//   },
// ];

//   const navButtons = [];

//   return (
//     <>
      
//       {/* ── Full-Screen Mobile Menu ── */}
// {mobileMenuOpen && (
//   <MobileFullScreenMenu
//     onClose={() => setMobileMenuOpen(false)}
//     navLinks={navLinks}
//     navButtons={navButtons}
//     user={user}
//     navigate={navigate}
//     handleLogout={handleLogout}
//     setShowLoginModal={setShowLoginModal}
//     productMenuItems={PRODUCT_MENU_ITEMS}
//     productRoutes={PRODUCT_ROUTES}
//   />
// )}

//       {/* ── Nav ── */}
//       <nav
//         className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#1F1D1F]/95 border-b border-[#F97316]/20 ${
//           scrolled
//             ? "backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
//             : "backdrop-blur-md"
//         }`}
//       >
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-[68px]">
//             {/* Logo */}
//             <div
//               className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
//               onClick={() => navigate("/")}
//             >
//               <span className="text-[28px] sm:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
//                 <span className="text-green-600">ILM</span>
//                 <span className="text-[#F97316] ml-1">ORA</span>
//                 <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
//                   Beta
//                 </span>
//               </span>
//             </div>

//             {/* Desktop Nav — visible from lg (1024px) and above */}
//             <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
//               <button
//                 type="button"
//                 onClick={() => navigate("/all-courses")}
//                 className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
//               >
//                 All Courses
//               </button>
//               {/* ILM ORA Feature Dropdown */}
//               <div className="relative group">
//                 <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
//                   ILM ORA Feature
//                   <ChevronDown className="w-4 h-4" />
//                 </button>

//                 <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   {HUB_MENU_ITEMS.map((item) => {
//                     const ItemIcon = NAV_ICON_MAP[item.icon];
//                     return (
//                       <button
//                         key={item.key}
//                         onClick={() => navigate(HUB_ROUTES[item.key])}
//                         className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                       >
//                         <div className="flex items-start gap-3">
//                           <ItemIcon className={`w-5 h-5 ${HUB_ICON_COLORS[item.key]} mt-1`} />
//                           <div>
//                             <div className="font-semibold text-sm text-white">
//                               {item.title}
//                             </div>
//                             <div className="text-xs text-gray-400">
//                               {item.description}
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Product Dropdown */}
//               <div className="relative group">
//                 <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
//                   Product
//                   <ChevronDown className="w-4 h-4" />
//                 </button>

//                 <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   {PRODUCT_MENU_ITEMS.map((item) => {
//                     const ItemIcon = NAV_ICON_MAP[item.icon];
//                     return (
//                       <button
//                         key={item.key}
//                         onClick={() => navigate(PRODUCT_ROUTES[item.key])}
//                         className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
//                       >
//                         <div className="flex items-start gap-3">
//                           <ItemIcon className={`w-5 h-5 ${PRODUCT_ICON_COLORS[item.key]} mt-1`} />
//                           <div>
//                             <div className="font-semibold text-sm text-white">
//                               {item.title}
//                             </div>
//                             <div className="text-xs text-gray-400">
//                               {item.description}
//                             </div>
//                           </div>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Direct Nav Links — Mentors, Success Stories */}
//               {navLinks.map((link) => (
//                 <button
//                   key={link.text}
//                   type="button"
//                   onClick={() => {
//                     document
//                       .querySelector(link.href)
//                       ?.scrollIntoView({ behavior: "smooth" });
//                   }}
//                   className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
//                 >
//                   {link.text}
//                 </button>
//               ))}
//             </div>
//             {/* Right side */}
//             <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
//               <button
//                 onClick={toggleTheme}
//                 className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-[#F97316] transition-colors duration-300 shadow-sm bg-[#2A2A2A] flex-shrink-0"
//               >
//                 {theme === "dark" ? (
//                   <Sun className="w-[18px] h-[18px] text-[#F97316]" />
//                 ) : (
//                   <Moon className="w-[18px] h-[18px] text-gray-300" />
//                 )}
//               </button>

//               {user ? (
//                 <div className="hidden lg:block">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className="gap-2 rounded-xl border-white/[0.08] bg-[#2A2A2A] hover:border-[#F97316] text-white h-10 px-3"
//                       >
//                         <Avatar className="w-7 h-7">
//                           <AvatarImage src={user.picture} alt={user.name} />
//                           <AvatarFallback className="bg-[#1E293B] text-white text-xs">
//                             {user.name?.charAt(0) || (
//                               <User className="w-3 h-3" />
//                             )}
//                           </AvatarFallback>
//                         </Avatar>
//                         <ChevronDown className="w-3 h-3" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent
//                       align="end"
//                       className="w-72 bg-[#232323] border-white/[0.08]"
//                     >
//                       <div className="px-3 py-3 bg-[#2A2A2A] rounded-t-md">
//                         <p className="font-semibold text-sm text-white truncate">
//                           {user.name || "User"}
//                         </p>
//                         <p className="text-xs text-gray-400 truncate">
//                           {user.email}
//                         </p>
//                       </div>
//                       <DropdownMenuSeparator />
//                       {/* Public/landing dropdown is intentionally minimal:
//                           only "Go to Dashboard" here + "Sign Out" below.
//                           Profile / Edit Role / Change Password are
//                           dashboard-only items and live in
//                           IlmOraDemoPage.jsx's own avatar dropdown — do not
//                           add them back here; these two UI contexts are
//                           intentionally different. */}
//                       {[
//                         {
//                           icon: LayoutDashboard,
//                           label: "Go to Dashboard",
//                           desc: "Jump back into your dashboard",
//                           onClick: goToDashboard,
//                         },
//                       ].map((item) => (
//                         <DropdownMenuItem
//                           key={item.label}
//                           onClick={item.onClick}
//                           className="gap-3 cursor-pointer"
//                         >
//                           <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
//                             <item.icon className="w-4 h-4 text-[#F97316]" />
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-white">
//                               {item.label}
//                             </p>
//                             <p className="text-xs text-gray-400">{item.desc}</p>
//                           </div>
//                         </DropdownMenuItem>
//                       ))}
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem
//                         onClick={handleLogout}
//                         className="gap-3 text-red-600 cursor-pointer"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         <span className="text-sm font-medium">Sign Out</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               ) : (
//                 <Button
//                   onClick={() => setShowLoginModal(true)}
//                   className="flex bg-gradient-to-br from-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold px-3 sm:px-4 xl:px-5 py-2.5 rounded-xl items-center gap-1.5 sm:gap-2 shadow-md hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 text-[12px] sm:text-[13px] xl:text-[15px] h-10 whitespace-nowrap"
//                 >
//                   <Sparkles className="w-4 h-4" /> Get Started
//                 </Button>
//               )}

//               {/* Hamburger — only shown below lg (below 1024px) */}
//               <button
//                 className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-[#F97316] bg-[#2A2A2A] transition-colors duration-300 shadow-sm"
//                 aria-label="Open menu"
//                 onClick={() => setMobileMenuOpen(true)}
//               >
//                 <Menu className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }
































import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  Code2,
  FileText,
  GraduationCap,
  Lock,
  LogOut,
  Menu,
  Moon,
  Sparkles,
  Sun,
  User,
  UserCog,
  Users,
  LayoutDashboard,
  PenTool,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import MobileFullScreenMenu from "./MobileFullScreenMenu";

// ILM ORA Feature dropdown items, in this exact order: Student Hub,
// Trainer Hub, Manager Hub, Whiteboard, AI Companion, AI Resume Builder,
// Coding Lab.
const HUB_MENU_ITEMS = [
  { key: "student", title: "Student Hub", description: "AI-Powered Learning & Career Growth", icon: "GraduationCap" },
  { key: "trainer", title: "Trainer Hub", description: "Training Management & Mentorship", icon: "Users" },
  { key: "admin", title: "Manager Hub", description: "Analytics, Performance & Team Development", icon: "BarChart3" },
  { key: "whiteboard", title: "Whiteboard", description: "Draw, Design & Collaborate Visually", icon: "PenTool" },
  { key: "aiCompanion", title: "AI Companion", description: "Your personal AI tutor, 24/7", icon: "Sparkles" },
  { key: "resume", title: "AI Resume Builder", description: "Build a job-ready resume with AI", icon: "FileText" },
  { key: "codingLab", title: "Coding Lab", description: "Practice, Code & Build Real Projects", icon: "Code2" },
  { key: "studyPlan", title: "Study Plan", description: "Personalized Study Plans & Progress Tracking", icon: "CalendarCheck" },
];

// Product dropdown — ILM ORA Calendry (renamed from "ILM ORA Meet"; same
// route/functionality) and Workspace only. Resume Builder, AI Companion,
// and Whiteboard moved up into ILM ORA Feature above.
const PRODUCT_MENU_ITEMS = [
  { key: "meet", title: "ILM ORA Calendry", description: "Live classes & video sessions", icon: "LayoutDashboard" },
  { key: "workspace", title: "Workspace", description: "Your all-in-one collaborative space", icon: "Users" },
];

// Icon name (string) → actual lucide-react component.
const NAV_ICON_MAP = {
  GraduationCap,
  Users,
  BarChart3,
  FileText,
  LayoutDashboard,
  Sparkles,
  PenTool,
  Code2,
  CalendarCheck,
};
const HUB_ROUTES = {
  student: "/student-hub",
  trainer: "/trainer-hub",
  admin: "/manager-hub",
  whiteboard: "/whiteboard",
  aiCompanion: "/ai-companion",
  resume: "/resume-builder",
  codingLab: "/coding-lab",
  studyPlan: "/study-plan",
};
const PRODUCT_ROUTES = {
  meet: "/ilm-ora-meet",
  resume: "/resume-builder",
  workspace: "/workspace",
  aiCompanion: "/ai-companion",
  whiteboard: "/whiteboard",
};
const HUB_ICON_COLORS = {
  student: "text-green-600",
  trainer: "text-blue-600",
  admin: "text-purple-600",
  whiteboard: "text-orange-500",
  aiCompanion: "text-purple-500",
  resume: "text-green-600",
  codingLab: "text-cyan-600",
  studyPlan: "text-orange-500",
};
const PRODUCT_ICON_COLORS = {
  meet: "text-orange-500",
  workspace: "text-orange-500",
};

/* ─────────────────────────────────────────────────────────────────
   NAVBAR — logo, desktop navigation, mega menu, dropdowns, user/login
   state, avatar/profile menu, logout, "Get Started" CTA, mobile menu
   button, theme toggle, scroll effects, sticky behavior.
───────────────────────────────────────────────────────────────── */
export default function Navbar({ theme, toggleTheme, setShowLoginModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bug fix: this used to read sessionStorage["user"], a key the real
  // login flow never writes to — so this navbar never saw a logged-in
  // user. It now reads the SAME real session source IlmOraDemoPage.jsx
  // already uses (localStorage["lms_token"] / localStorage["lms_user"]),
  // so the same authenticated session is detected everywhere, including
  // after navigating away from /ilm-demo to a public page.
  useEffect(() => {
    const token = localStorage.getItem("lms_token");
    const rawUser = localStorage.getItem("lms_user");
    let parsedUser = null;
    try {
      parsedUser = rawUser ? JSON.parse(rawUser) : null;
    } catch {
      parsedUser = null;
    }

    // Same stale-data guard IlmOraDemoPage.jsx already runs on mount: a
    // bare isNewUser:true flag with no matching Google credential is
    // leftover data from an interrupted Google sign-in (tab/browser
    // closed before role selection finished) — sessionStorage clears on
    // session end but localStorage["lms_user"] doesn't, so this flag can
    // outlive the real session. Without this check, a public page loaded
    // first (before /ilm-demo ever mounts and cleans it up) would trust
    // the stale flag and show the avatar for a user who never logged in.
    const hasGoogleCred = !!sessionStorage.getItem("ilmora_google_credential");
    if (!token && parsedUser?.isNewUser === true && !hasGoogleCred) {
      localStorage.removeItem("lms_user");
      setUser(null);
      return;
    }

    if (token || parsedUser) {
      setUser(parsedUser || {});
    } else {
      setUser(null);
    }
  }, []);

  // Same fields the "Student Hub"/"Trainer Hub"/"Manager Hub" logic in
  // IlmOraDemoPage.jsx already normalizes role strings with — copied
  // here as a pure function (no shared/duplicate STATE, just the same
  // string-mapping logic) so "Go to Dashboard" below sends the user to
  // the correct role dashboard, same as it does on /ilm-demo.
  const normalizeAppRole = (raw) => {
    const r = (raw || "").toString().trim().toUpperCase();
    if (["TENANT_ADMIN", "ADMIN", "BUSINESS", "MANAGER", "PARTNERSHIP"].includes(r))
      return "admin";
    if (r === "TRAINER") return "trainer";
    if (r === "STUDENT") return "student";
    return "";
  };
  const DASHBOARD_ROUTE_BY_ROLE = {
    student: "/student/dashboard",
    trainer: "/trainer/dashboard",
    admin: "/admin/dashboard",
  };
  const goToDashboard = () => {
    const role =
      normalizeAppRole(user?.role) ||
      normalizeAppRole(localStorage.getItem("role")) ||
      "student";
    navigate(DASHBOARD_ROUTE_BY_ROLE[role] || "/ilm-demo");
  };
  // Same roleChangeUsed flag IlmOraDemoPage.jsx's hasUsedRoleChange()
  // already reads from lms_user — same source, read here too. Kept for
  // potential future use even though the public dropdown no longer
  // surfaces an "Edit Role" item itself.
  const hasUsedRoleChange = () => !!user?.roleChangeUsed;

  // Mirrors IlmOraDemoPage.jsx's handleSignOut exactly — same keys
  // cleared, so signing out here fully signs the user out everywhere,
  // not just on this page.
  const handleLogout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    localStorage.removeItem("role");
    localStorage.removeItem("organizationId");
    localStorage.removeItem("selectedPlan");
    sessionStorage.removeItem("ilmora_google_user");
    sessionStorage.removeItem("ilmora_google_credential");
    sessionStorage.removeItem("ilmora_profile_return_path");
    setUser(null);
    navigate("/", { replace: true });
  };

  const navLinks = [
    {
      text: "Mentors",
      href: "#mentors",
      icon: BookOpen,
      color: "text-orange-500",
      description: "Learn from Industry Experts",
    },
    {
      text: "Success Stories",
      href: "#successstories",
      icon: Award,
      color: "text-green-500",
      description: "Real Success Stories from Learners",
    },
  ];

  const navButtons = [];

  return (
    <>
      {/* ── Full-Screen Mobile Menu ── */}
      {mobileMenuOpen && (
        <MobileFullScreenMenu
          onClose={() => setMobileMenuOpen(false)}
          navLinks={navLinks}
          navButtons={navButtons}
          user={user}
          navigate={navigate}
          handleLogout={handleLogout}
          setShowLoginModal={setShowLoginModal}
          productMenuItems={PRODUCT_MENU_ITEMS}
          productRoutes={PRODUCT_ROUTES}
        />
      )}

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#1F1D1F]/95 border-b border-[#F97316]/20 ${
          scrolled
            ? "backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            : "backdrop-blur-md"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <span className="text-[28px] sm:text-[32px] font-extrabold tracking-wide font-serif leading-none whitespace-nowrap">
                <span className="text-green-600">ILM</span>
                <span className="text-[#F97316] ml-1">ORA</span>
                <span className="inline-flex items-center bg-orange-50 border border-[#F97316] rounded ml-1.5 px-1.5 py-0.5 text-[0.45rem] sm:text-[0.5rem] font-sans font-semibold tracking-widest text-[#F97316] uppercase leading-snug align-middle">
                  Beta
                </span>
              </span>
            </div>

            {/* Desktop Nav — visible from lg (1024px) and above */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-4 xl:mx-6">
              <button
                type="button"
                onClick={() => navigate("/all-courses")}
                className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
              >
                All Courses
              </button>

              {/* ILM ORA Feature Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
                  ILM ORA Feature
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-[420px] bg-[#1A1A1A] border border-white/[0.08] rounded-xl shadow-2xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="grid grid-cols-2 gap-2">
                    {HUB_MENU_ITEMS.map((item) => {
                      const ItemIcon = NAV_ICON_MAP[item.icon];
                      return (
                        <button
                          key={item.key}
                          onClick={() => navigate(HUB_ROUTES[item.key])}
                          className="text-left p-2.5 rounded-lg bg-[#232323] border border-white/[0.05] hover:border-[#F97316]/40 hover:bg-[#F97316]/[0.08] transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <ItemIcon className={`w-4 h-4 ${HUB_ICON_COLORS[item.key]} flex-shrink-0`} />
                            <div className="font-semibold text-[13px] text-white leading-tight">
                              {item.title}
                            </div>
                          </div>
                          <div className="text-[11px] text-gray-400 leading-snug">
                            {item.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Dropdown */}
              <div className="relative group">
                <button className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer flex items-center gap-1">
                  Product
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="absolute top-full left-0 mt-2 w-80 bg-[#232323] border border-white/[0.08] rounded-xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {PRODUCT_MENU_ITEMS.map((item) => {
                    const ItemIcon = NAV_ICON_MAP[item.icon];
                    return (
                      <button
                        key={item.key}
                        onClick={() => navigate(PRODUCT_ROUTES[item.key])}
                        className="w-full text-left p-3 rounded-lg hover:bg-[#F97316]/[0.12]"
                      >
                        <div className="flex items-start gap-3">
                          <ItemIcon className={`w-5 h-5 ${PRODUCT_ICON_COLORS[item.key]} mt-1`} />
                          <div>
                            <div className="font-semibold text-sm text-white">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Nav Links — Mentors, Success Stories */}
              {navLinks.map((link) => (
                <button
                  key={link.text}
                  type="button"
                  onClick={() => {
                    document
                      .querySelector(link.href)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-white hover:text-[#F97316] font-medium transition-colors duration-300 px-3 xl:px-4 py-2 rounded-lg hover:bg-[#F97316]/10 text-[13px] xl:text-[15px] whitespace-nowrap bg-transparent border-none cursor-pointer"
                >
                  {link.text}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 xl:gap-3 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-[#F97316] transition-colors duration-300 shadow-sm bg-[#2A2A2A] flex-shrink-0"
              >
                {theme === "dark" ? (
                  <Sun className="w-[18px] h-[18px] text-[#F97316]" />
                ) : (
                  <Moon className="w-[18px] h-[18px] text-gray-300" />
                )}
              </button>

              {user ? (
                <div className="hidden lg:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 rounded-xl border-white/[0.08] bg-[#2A2A2A] hover:border-[#F97316] text-white h-10 px-3"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-[#1E293B] text-white text-xs">
                            {user.name?.charAt(0) || (
                              <User className="w-3 h-3" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-72 bg-[#232323] border-white/[0.08]"
                    >
                      <div className="px-3 py-3 bg-[#2A2A2A] rounded-t-md">
                        <p className="font-semibold text-sm text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      {/* Public/landing dropdown is intentionally minimal:
                          only "Go to Dashboard" here + "Sign Out" below.
                          Profile / Edit Role / Change Password are
                          dashboard-only items and live in
                          IlmOraDemoPage.jsx's own avatar dropdown — do not
                          add them back here; these two UI contexts are
                          intentionally different. */}
                      {[
                        {
                          icon: LayoutDashboard,
                          label: "Go to Dashboard",
                          desc: "Jump back into your dashboard",
                          onClick: goToDashboard,
                        },
                      ].map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={item.onClick}
                          className="gap-3 cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-[#F97316]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-400">{item.desc}</p>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="gap-3 text-red-600 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="flex bg-gradient-to-br from-[#F97316] to-[#EA580C] hover:from-[#F97316] hover:to-[#EA580C] text-white font-bold px-3 sm:px-4 xl:px-5 py-2.5 rounded-xl items-center gap-1.5 sm:gap-2 shadow-md hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(249,115,22,0.35)] transition-all duration-300 text-[12px] sm:text-[13px] xl:text-[15px] h-10 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" /> Get Started
                </Button>
              )}

              {/* Hamburger — only shown below lg (below 1024px) */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-white/[0.08] hover:border-[#F97316] bg-[#2A2A2A] transition-colors duration-300 shadow-sm"
                aria-label="Open menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}