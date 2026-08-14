/* ─────────────────────────────────────────────────────────────────
   navMenuData.js — single source of truth for the "ILM ORA Feature"
   (Hub) and "Product" nav dropdown CONTENT, shared by:
     - Navbar.jsx            (public navbar)
     - IlmOraDemoPage.jsx    (ILM Demo navbar, /ilm-demo)

   IMPORTANT: this file exports DATA ONLY — key, icon name, title,
   description. It intentionally does NOT export routes, colors, or
   onClick handlers. Each consumer keeps its own:
     - icon component lookup (its own local ICON_MAP, resolving the
       `icon` string against the lucide-react icons it already imports)
     - color/styling (its own local color map, unchanged from before)
     - navigation behavior:
         Navbar.jsx         → navigate("/student-hub") etc. (own local
                               route map, not in this file)
         IlmOraDemoPage.jsx → goToHub("student") / goToProductSection(...)
                               (own local handlers, keyed by `item.key`)

   Editing a title/description/icon/order here updates BOTH navbars.
   Editing routes, colors, or click behavior does NOT belong in this
   file — that stays local to each consumer, on purpose.
───────────────────────────────────────────────────────────────── */

export const HUB_MENU_ITEMS = [
  {
    key: "student",
    icon: "GraduationCap",
    title: "Student Hub",
    description: "AI-Powered Learning & Career Growth",
  },
  {
    key: "trainer",
    icon: "Users",
    title: "Trainer Hub",
    description: "Training Management & Mentorship",
  },
  {
    key: "admin",
    icon: "BarChart3",
    title: "Manager Hub",
    description: "Analytics, Performance & Team Development",
  },
];

export const PRODUCT_MENU_ITEMS = [
  {
    key: "meet",
    icon: "Users",
    title: "ILM ORA Meet",
    description: "Virtual Meetings & Collaboration",
  },
  {
    key: "resume",
    icon: "FileText",
    title: "AI Resume Builder",
    description: "Create ATS-Friendly Professional Resumes",
  },
  {
    key: "workspace",
    icon: "LayoutDashboard",
    title: "Workspace",
    description: "Your Live Sessions & Meetings Hub",
  },
];