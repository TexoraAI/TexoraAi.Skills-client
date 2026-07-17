import {
  Target, Palette, TrendingUp, BarChart2, BarChart3, Bot, Zap,
  FlaskConical, BookOpen, Brush, Award, BookMarked, GraduationCap,
  Microscope, Calculator, Code2, Database, Cloud, Brain, Server,
  Shield, MessageSquare, Mic, Briefcase, Building2, FileText,
  ClipboardList, Flag, BarChart, Search, LineChart, Users,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   SINGLE SOURCE OF TRUTH for all course/category data in the app.

   This file used to also render the "All Courses" MegaMenu popup.
   That popup has been removed entirely — Navbar now navigates
   straight to the dedicated /all-courses page instead of opening
   any dropdown/modal/overlay. This file's only remaining job is to
   hold the shared data (CATEGORIES, COURSE_GROUPS) and the shared
   navigation helper (navigateToCourseItem) that the /all-courses
   page imports and renders. There is no other All Courses UI left
   in the project — this is it.
───────────────────────────────────────────────────────────────── */
export const CATEGORIES = [
  {
    id: "courses",
    label: "All Courses",
    description: "PM, Design, Growth, AI",
    Icon: Target,
    items: [
      { name: "Product Management",    desc: "Master PM fundamentals",         Icon: Target,      route: "/", tab: "product" },
      { name: "Product Analytics",     desc: "Data-driven decisions",          Icon: BarChart,    route: "/", tab: "product" },
      { name: "Product Strategy",      desc: "Strategy & positioning",         Icon: LineChart,   route: "/", tab: "product" },
      { name: "Data Analytics",        desc: "Analytics & BI tools",           Icon: BarChart2,   route: "/", tab: "product" },
      { name: "Gen AI",                desc: "Generative AI essentials",       Icon: Bot,         route: "/", tab: "product" },
      { name: "UI/UX Design",          desc: "Design beautiful interfaces",    Icon: Palette,     route: "/", tab: "design"  },
      { name: "Design Systems",        desc: "Scalable component libraries",   Icon: Brush,       route: "/", tab: "design"  },
      { name: "User Research",         desc: "Interviews & usability testing", Icon: Search,      route: "/", tab: "design"  },
      { name: "Growth Marketing",      desc: "Growth loops & strategies",      Icon: TrendingUp,  route: "/", tab: "growth"  },
      { name: "SEO & Content",         desc: "Organic growth at scale",        Icon: FileText,    route: "/", tab: "growth"  },
      { name: "Performance Marketing", desc: "Paid ads at scale",              Icon: Zap,         route: "/", tab: "growth"  },
    ],
  },
  {
    id: "school-boards",
    label: "School Boards",
    description: "CBSE, Bihar, ICSE, UP Board",
    Icon: GraduationCap,
    items: [
      { name: "CBSE Science",  desc: "Class 9–12 Science stream",   Icon: FlaskConical, route: "/school-class" },
      { name: "CBSE Commerce", desc: "Class 11–12 Commerce stream", Icon: BarChart2,    route: "/school-class" },
      { name: "CBSE Arts",     desc: "Class 11–12 Arts stream",     Icon: Brush,        route: "/school-class" },
      { name: "ICSE",          desc: "CISCE Board – Class 9–12",    Icon: Award,        route: "/school-class" },
      { name: "UP Board",      desc: "UPMSP – Class 9–12",          Icon: BookMarked,   route: "/school-class" },
      { name: "Bihar Board",   desc: "BSEB – Class 9–12",           Icon: BookOpen,     route: "/school-class" },
    ],
  },
  {
    id: "competitive",
    label: "Competitive Exams",
    description: "JEE, NEET",
    Icon: Award,
    items: [
      { name: "IIT JEE", desc: "Engineering entrance", Icon: Calculator, route: "/school-class" },
      { name: "NEET",    desc: "Medical entrance",     Icon: Microscope, route: "/school-class" },
    ],
  },
  {
    id: "career-tracks",
    label: "Career Tracks",
    description: "Full Stack, AI, DevOps",
    Icon: Code2,
    items: [
      { name: "Full Stack Dev",                desc: "Frontend + Backend",    Icon: Code2,     route: "/platforms" },
      { name: "Data Engineering",              desc: "Big data pipelines",    Icon: Database,  route: "/platforms" },
      { name: "Cloud & DevOps",                desc: "Cloud infrastructure",  Icon: Cloud,     route: "/platforms" },
      { name: "AI Engineer",                   desc: "ML & AI systems",       Icon: Brain,     route: "/platforms" },
      { name: "Backend Java",                  desc: "Enterprise backend",    Icon: Server,    route: "/platforms" },
      { name: "Cyber Security",                desc: "Security fundamentals", Icon: Shield,    route: "/platforms" },
      { name: "Forward Deployed Engineering",  desc: "Applied AI, FDE",       Icon: Briefcase, route: "/fde-academy" },
    ],
  },
  {
    id: "ilm-ora-talk",
    label: "ILM ORA Talk",
    description: "English, Public Speaking",
    Icon: Mic,
    items: [
      { name: "Spoken English",          desc: "English fluency basics",  Icon: MessageSquare, route: "/ilm-ora-talk" },
      { name: "Public Speaking",         desc: "Confidence & delivery",   Icon: Mic,           route: "/ilm-ora-talk" },
      { name: "Interview Communication", desc: "Crack interviews",        Icon: Briefcase,     route: "/ilm-ora-talk" },
      { name: "Corporate Communication", desc: "Professional skills",     Icon: Building2,     route: "/ilm-ora-talk" },
      { name: "Presentation Skills",     desc: "Effective presentations", Icon: Target,        route: "/ilm-ora-talk" },
    ],
  },
  {
    id: "study-abroad",
    label: "Study Abroad",
    description: "IELTS, TOEFL, UK, USA",
    Icon: Flag,
    items: [
      { name: "IELTS Preparation", desc: "IELTS exam prep",  Icon: FileText,      route: "/study-abroad" },
      { name: "TOEFL Preparation", desc: "TOEFL exam prep",  Icon: ClipboardList, route: "/study-abroad" },
      { name: "Study in UK",       desc: "UK universities",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in Canada",   desc: "Canada programs",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in USA",      desc: "US universities",  Icon: Flag,          route: "/study-abroad" },
      { name: "Study in Germany",  desc: "Germany programs", Icon: Flag,          route: "/study-abroad" },
    ],
  },
  {
    id: "ilm-ora-gulf",
    label: "ILM ORA Gulf",
    description: "UAE, Oman, Kuwait, Qatar & more",
    Icon: Flag,
    isGulf: true,
    items: [
      { name: "Oman",         flagCode: "om", route: "/ilm-ora-gulf" },
      { name: "UAE",          flagCode: "ae", route: "/ilm-ora-gulf" },
      { name: "Malaysia",     flagCode: "my", route: "/ilm-ora-gulf" },
      { name: "Kuwait",       flagCode: "kw", route: "/ilm-ora-gulf" },
      { name: "Qatar",        flagCode: "qa", route: "/ilm-ora-gulf" },
      { name: "Saudi Arabia", flagCode: "sa", route: "/ilm-ora-gulf" },
      { name: "Bahrain",      flagCode: "bh", route: "/ilm-ora-gulf" },
      { name: "Uganda",       flagCode: "ug", route: "/ilm-ora-gulf" },
      { name: "Nigeria",      flagCode: "ng", route: "/ilm-ora-gulf" },
      { name: "Tanzania",     flagCode: "tz", route: "/ilm-ora-gulf" },
      { name: "Singapore",    flagCode: "sg", route: "/ilm-ora-gulf" },
    ],
  },
  {
    id: "ilm-ora-feature",
    label: "ILM ORA Feature",
    description: "Student, Trainer & Manager Hubs",
    Icon: GraduationCap,
    items: [
      {
        name: "Student Hub",
        desc: "AI-Powered Learning & Career Growth",
        Icon: GraduationCap,
        route: "/student-hub",
      },
      {
        name: "Trainer Hub",
        desc: "Training Management & Mentorship",
        Icon: Users,
        route: "/trainer-hub",
      },
      {
        name: "Manager Hub",
        desc: "Analytics, Performance & Team Development ",
        Icon: BarChart3,
        route: "/manager-hub",
      },
    ],
  },
];

export const COURSE_GROUPS = [
  { key: "product", label: "Product",  Icon: Target     },
  { key: "design",  label: "Design",   Icon: Palette    },
  { key: "growth",  label: "Growth",   Icon: TrendingUp },
];

/* ─────────────────────────────────────────────────────────────────
   Shared item-navigation logic — used by the /all-courses page (and
   anywhere else a CATEGORIES item is clicked) so routing behavior
   lives in exactly one place: navigate straight to `item.route`, or
   for items tagged with `tab` (Product/Design/Growth), jump to the
   homepage's course tab.
───────────────────────────────────────────────────────────────── */
export function navigateToCourseItem(navigate, item) {
  if (!item) return;
  if (item.tab) {
    window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab: item.tab } }));
    if (window.location.pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById("courses");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      navigate("/");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab: item.tab } }));
        const el = document.getElementById("courses");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  } else if (item.route) {
    navigate(item.route);
  }
}