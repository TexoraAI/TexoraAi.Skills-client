// Shared constants for the Roadmap Upgraded feature, used by the wizard,
// dashboard and detail views across all four role pages.

export const DOMAINS = [
  "Technology & Computing",
  "Business & Finance",
  "Career & Professional Skills",
  "Science & Academia",
  "Creative Arts & Media",
  "Lifestyle & Health",
];

// Sent as `pathType` in the generate request. The backend just stores this
// as a free-text String (no real enum), but we keep it a fixed, predictable
// set of values so stats/breakdowns stay meaningful.
export const BASE_PATH_TYPES = [
  { value: "JOB_PROFILE", label: "Job Profile", tag: "40–100h", desc: "Fundamentals → expert curriculum for a full role." },
  { value: "SKILL", label: "Skill", tag: "10–40h", desc: "3–5 modules to master one specific ability." },
  { value: "TASK", label: "Task", tag: "1–5h", desc: "The best short resources to finish one job." },
  { value: "CERTIFICATION", label: "Certification", tag: "30–80h", desc: "Syllabus-aligned prep for a recognised exam." },
];

// Trainers, admins and super-admins get one extra path type for cohort-style
// teaching; students don't (mirrors the approved prototype).
export const COURSE_BATCH_PATH_TYPE = {
  value: "COURSE_BATCH",
  label: "Course / Batch",
  tag: "Cohort",
  desc: "Scheduled path with a start/end date for a group.",
};

export function pathTypesForRole(role) {
  return role === "student" ? BASE_PATH_TYPES : [...BASE_PATH_TYPES, COURSE_BATCH_PATH_TYPE];
}

export const CONTENT_SOURCES = [
  { value: "VIDEO", icon: "▶", label: "Video" },
  { value: "ARTICLE", icon: "▤", label: "Articles & docs" },
  { value: "PDF", icon: "▥", label: "PDFs / e-books" },
  { value: "QUIZ", icon: "✓", label: "Practice & quizzes" },
];

export const RESOURCE_ICON = { VIDEO: "▶", ARTICLE: "▤", PDF: "▥", QUIZ: "✓" };

export const STATUS_BADGE = {
  GENERATING: "Building…",
  READY: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Done",
};

// Per-role look, copy and permissions. Every role page imports its slice of
// this object instead of duplicating the dashboard/wizard/detail components.
export const ROLE_CONFIG = {
  student: {
    accent: "#1F6F5C",
    accentSoft: "#DCEEE7",
    accentGlow: "rgba(31,111,92,.14)",
    eyebrow: "STUDENT · MY LEARNING",
    title: "Your roadmaps",
    lede: "Every roadmap you generate belongs to you — no approval needed, no waiting. Build it, start it, reshape it whenever.",
    note: "<b>Self-serve, always.</b> As a student, everything you generate is yours immediately — there is no trainer or admin sign-off step before you can start learning.",
    ctaTitle: "Start a new roadmap",
    ctaSub: "Pick a domain, a path type, and a target — ready in minutes.",
    canClone: false,
    canSeeOrgStats: false,
    basePath: "/student/roadmap-upgraded",
  },
  trainer: {
    accent: "#B5541F",
    accentSoft: "#F6E4D3",
    accentGlow: "rgba(181,84,31,.14)",
    eyebrow: "TRAINER · MY ROADMAPS",
    title: "Your roadmaps",
    lede: "Generate roadmaps for your own upskilling, or as a private template you reuse every time you run a new batch.",
    note: "<b>Personal, not published.</b> Clone this roadmap as a starting template for your next batch — it stays private to you.",
    ctaTitle: "Build a new roadmap or batch template",
    ctaSub: "Same generator as students — plus batch scheduling and reuse tools.",
    canClone: true,
    canSeeOrgStats: false,
    basePath: "/trainer/roadmap-upgraded",
  },
  admin: {
    accent: "#4B3B8F",
    accentSoft: "#E9E4F7",
    accentGlow: "rgba(75,59,143,.14)",
    eyebrow: "ADMIN · MY ROADMAPS",
    title: "Your roadmaps",
    lede: "Admins generate roadmaps the same self-serve way as everyone else. Below that, get organization-wide usage insight.",
    note: "<b>No approval layer.</b> Students and trainers self-generate freely. This panel is for visibility into usage, not permission control.",
    ctaTitle: "Start a new roadmap",
    ctaSub: "Same generator as every other role.",
    canClone: false,
    canSeeOrgStats: true,
    basePath: "/admin/roadmap-upgraded",
  },
  superadmin: {
    accent: "#4B3B8F",
    accentSoft: "#E9E4F7",
    accentGlow: "rgba(75,59,143,.14)",
    eyebrow: "SUPER ADMIN · PLATFORM ROADMAPS",
    title: "Your roadmaps",
    lede: "Super admins can generate their own roadmaps too. Below that: cross-organization usage, broken down per org.",
    note: "<b>Cross-org visibility.</b> This view spans every organization, plus any roadmap generated outside an org.",
    ctaTitle: "Start a new roadmap",
    ctaSub: "Same generator as every other role.",
    canClone: false,
    canSeeOrgStats: true,
    basePath: "/superadmin/roadmap-upgraded",
  },
};
