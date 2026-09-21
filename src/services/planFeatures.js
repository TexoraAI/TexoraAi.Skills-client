// planFeatures.js
//
// Mirrors real backend constants. This file is NOT fetched live from the
// backend — it's cosmetic/display only. The backend remains the actual
// source of enforcement. Keep this in sync by hand whenever the constants
// files below change.
//
// Sources used to build this file:
//   - IndividualPlanLimits.java        (pricing)
//   - PlanLimits.java (org)            (org tiers)
//   - ResumeAiUsageLimits.java         (resume)
//   - ResumeTemplateAccess.java        (resume)
//   - CourseTierLimits.java            (course)
//   - VideoTierLimits.java             (video)
//   - video.CourseContentTierLimits.java
//   - FileTierLimits.java              (file)
//   - file.CourseContentTierLimits.java
//   - LiveSessionTierLimits.java       (live-session)
//   - NotebookUsageLimits.java         (AI notebook generations)
//   - AssessmentUsageLimits.java       (quizzes/assignments/coding/study plans)
//   - RoadmapUsageLimits.java          (AI roadmap generations)
//
// GAP: auth-service / user-service general limits (anything outside Resume
// Builder) haven't been shared yet.
//
// ROLE TAGGING
// ------------
// Every feature item has an `audience` array telling the UI who should see
// it: "TRAINER", "STUDENT", "ORG_ADMIN". Some items apply to more than one
// role (e.g. "AI Companion" is used by the trainer running the class but
// gated the same way for both) — this was inferred from field names, not
// confirmed against your actual permission checks, so re-tag anything that
// doesn't match reality.
//
// getComparisonRows(planType, currentPlan, targetPlan, role) filters items
// by `role` before returning them, and drops a whole category if nothing
// in it applies to that role. Always pass the caller's role (e.g.
// user.role from your auth context) from the modal — if you don't pass a
// role, everything is shown unfiltered (kept for backward compatibility
// only, not what you want in production).

// ---------- formatting helpers ----------

const GB = 1_073_741_824;
const MB = 1_048_576;

function formatBytes(bytes) {
  if (bytes === -1) return "Unlimited";
  if (bytes >= GB) {
    const gb = bytes / GB;
    return `${Number.isInteger(gb) ? gb : gb.toFixed(1)} GB`;
  }
  const mb = bytes / MB;
  return `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`;
}

function formatCount(n, unit = "") {
  if (n === -1) return "Unlimited";
  return unit ? `${n} ${unit}` : `${n}`;
}

function formatMinutes(n) {
  if (n === -1) return "Unlimited";
  return `${n} min`;
}

export function formatFeatureValue(item, tierKey) {
  const raw = item[tierKey];
  switch (item.type) {
    case "boolean":
      return raw ? "Included" : "Not included";
    case "storage":
      return formatBytes(raw);
    case "minutes":
      return formatMinutes(raw);
    case "count":
    default:
      return formatCount(raw, item.unit);
  }
}

// ---------- raw feature data, grouped by category ----------
// audience: ["TRAINER"] | ["STUDENT"] | ["ORG_ADMIN"] | combination

const INDIVIDUAL_CATEGORIES = [
  {
    category: "Courses & Content",
    icon: "BookOpen",
    items: [
      {
        label: "Courses you can create",
        type: "count",
        audience: ["TRAINER"],
        free: 2,
        pro: 5,
        premium: 10,
      },
      {
        label: "Modules per course",
        type: "count",
        audience: ["TRAINER"],
        free: 8,
        pro: 14,
        premium: 20,
      },
      {
        label: "Courses visible to you",
        type: "count",
        audience: ["STUDENT"],
        free: 10,
        pro: 25,
        premium: -1,
      },
    ],
  },
  {
    category: "Video",
    icon: "Video",
    items: [
      {
        label: "Video library storage",
        type: "storage",
        audience: ["TRAINER"],
        free: GB,
        pro: 3 * GB,
        premium: 6 * GB,
      },
      {
        label: "Max video file size",
        type: "storage",
        audience: ["TRAINER"],
        free: 100 * MB,
        pro: 200 * MB,
        premium: 300 * MB,
      },
      {
        label: "Videos you can upload",
        type: "count",
        audience: ["TRAINER"],
        free: 5,
        pro: 20,
        premium: 35,
      },
      {
        label: "Videos visible to you",
        type: "count",
        audience: ["STUDENT"],
        free: 10,
        pro: 25,
        premium: -1,
      },
      {
        label: "Course video storage",
        type: "storage",
        audience: ["TRAINER"],
        free: GB,
        pro: 8 * GB,
        premium: 40 * GB,
      },
      {
        label: "Max course video size",
        type: "storage",
        audience: ["TRAINER"],
        free: 50 * MB,
        pro: 100 * MB,
        premium: 200 * MB,
      },
    ],
  },
  {
    category: "Files & Materials",
    icon: "FileText",
    items: [
      {
        label: "File storage",
        type: "storage",
        audience: ["TRAINER"],
        free: GB,
        pro: 3 * GB,
        premium: 6 * GB,
      },
      {
        label: "Max file size",
        type: "storage",
        audience: ["TRAINER"],
        free: 100 * MB,
        pro: 200 * MB,
        premium: 300 * MB,
      },
      {
        label: "Files you can upload",
        type: "count",
        audience: ["TRAINER"],
        free: 5,
        pro: 20,
        premium: 35,
      },
      {
        label: "Files visible to you",
        type: "count",
        audience: ["STUDENT"],
        free: 10,
        pro: 25,
        premium: -1,
      },
      {
        label: "Course material storage",
        type: "storage",
        audience: ["TRAINER"],
        free: GB,
        pro: 8 * GB,
        premium: 40 * GB,
      },
      {
        label: "Max course material size",
        type: "storage",
        audience: ["TRAINER"],
        free: 50 * MB,
        pro: 100 * MB,
        premium: 200 * MB,
      },
    ],
  },
  {
    category: "Live Classes",
    icon: "Radio",
    items: [
      {
        label: "Live classes per month",
        type: "count",
        audience: ["TRAINER"],
        free: 3,
        pro: 15,
        premium: -1,
      },
      {
        label: "AI Companion",
        type: "boolean",
        audience: ["TRAINER", "STUDENT"],
        free: false,
        pro: true,
        premium: true,
      },
      {
        label: "AI Companion sessions per month",
        type: "count",
        audience: ["TRAINER", "STUDENT"],
        free: 0,
        pro: 15,
        premium: -1,
      },
      {
        label: "Recording storage",
        type: "storage",
        audience: ["TRAINER"],
        free: GB,
        pro: 5 * GB,
        premium: 20 * GB,
      },
      {
        label: "Max recording length",
        type: "minutes",
        audience: ["TRAINER", "STUDENT"],
        free: 30,
        pro: 90,
        premium: -1,
      },
      {
        label: "Whiteboard",
        type: "boolean",
        audience: ["TRAINER", "STUDENT"],
        free: false,
        pro: true,
        premium: true,
      },
      {
        label: "Meetings per month",
        type: "count",
        audience: ["TRAINER"],
        free: 5,
        pro: 25,
        premium: -1,
      },
    ],
  },
  {
    category: "Calendar & Notifications",
    icon: "CalendarClock",
    items: [
      {
        label: "Google Calendar sync",
        type: "boolean",
        audience: ["TRAINER"],
        free: false,
        pro: true,
        premium: true,
      },
      {
        label: "Calendar resyncs per month",
        type: "count",
        audience: ["TRAINER"],
        free: 0,
        pro: 3,
        premium: -1,
      },
      {
        label: "Dashboard emails per month",
        type: "count",
        audience: ["TRAINER"],
        free: 10,
        pro: 50,
        premium: -1,
      },
    ],
  },
  {
    category: "AI Tools",
    icon: "Sparkles",
    items: [
      {
        label: "AI Notebook generations",
        type: "count",
        unit: "/ month",
        audience: ["TRAINER", "STUDENT"],
        free: 3,
        pro: 30,
        premium: -1,
      },
      {
        label: "AI Roadmap generations",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 3,
        pro: 8,
        premium: -1,
      },
    ],
  },
  {
    category: "Resume Builder",
    icon: "FileUser",
    items: [
      {
        label: "AI resume generations",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 3,
        pro: 15,
        premium: -1,
      },
      {
        label: "Resume templates",
        type: "count",
        unit: "templates",
        audience: ["STUDENT"],
        free: 3,
        pro: 5,
        premium: 10,
      },
    ],
  },
  {
    category: "Assessments & Practice",
    icon: "ClipboardCheck",
    items: [
      {
        label: "Quizzes you can create",
        type: "count",
        unit: "/ month",
        audience: ["TRAINER"],
        free: 3,
        pro: 15,
        premium: -1,
      },
      {
        label: "Quiz attempts",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 5,
        pro: 25,
        premium: -1,
      },
      {
        label: "Assignments you can create",
        type: "count",
        unit: "/ month",
        audience: ["TRAINER"],
        free: 3,
        pro: 15,
        premium: -1,
      },
      {
        label: "Assignment submissions",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 5,
        pro: 25,
        premium: -1,
      },
      {
        label: "Coding challenges you can create",
        type: "count",
        unit: "/ month",
        audience: ["TRAINER"],
        free: 2,
        pro: 10,
        premium: -1,
      },
      {
        label: "Coding challenges you can solve",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 5,
        pro: 20,
        premium: -1,
      },
      {
        label: "Study plans you can create",
        type: "count",
        unit: "/ month",
        audience: ["TRAINER", "STUDENT"],
        free: 3,
        pro: 8,
        premium: -1,
      },
    ],
  },
];

// LEGACY — no longer triggered from the UI (BillingTab used to have a
// separate "Upgrade Resume Plan" button using planType="resume"; that
// button is gone now that Resume Builder features live inside
// INDIVIDUAL_CATEGORIES above, tagged audience: STUDENT). Left here in
// case anything else still calls getComparisonMatrix("resume", ...).
const RESUME_CATEGORIES = [
  {
    category: "Resume Builder",
    icon: "FileUser",
    items: [
      {
        label: "AI resume generations",
        type: "count",
        unit: "/ month",
        audience: ["STUDENT"],
        free: 3,
        pro: 15,
        premium: -1,
      },
      {
        label: "Resume templates",
        type: "count",
        unit: "templates",
        audience: ["STUDENT"],
        free: 3,
        pro: 5,
        premium: 10,
      },
    ],
  },
];

const ORG_CATEGORIES = [
  {
    category: "Organization",
    icon: "Building2",
    // org tiers use trial / starter / growth instead of free / pro / premium
    items: [
      {
        label: "Students",
        type: "count",
        audience: ["ORG_ADMIN"],
        trial: 20,
        starter: 50,
        growth: 150,
      },
      {
        label: "Trainers",
        type: "count",
        audience: ["ORG_ADMIN"],
        trial: 3,
        starter: 10,
        growth: 25,
      },
      {
        label: "Departments",
        type: "count",
        audience: ["ORG_ADMIN"],
        trial: 1,
        starter: 2,
        growth: 5,
      },
      {
        label: "Branches per department",
        type: "count",
        audience: ["ORG_ADMIN"],
        trial: 2,
        starter: 3,
        growth: 5,
      },
      {
        label: "Batches per branch",
        type: "count",
        audience: ["ORG_ADMIN"],
        trial: 2,
        starter: 3,
        growth: 5,
      },
    ],
  },
];

const CATEGORY_SETS = {
  individual: INDIVIDUAL_CATEGORIES,
  resume: RESUME_CATEGORIES,
  org: ORG_CATEGORIES,
};

/**
 * Returns the raw category/items list for a given planType, optionally
 * pre-filtered by role. Pass no role to get everything (unfiltered).
 */
export function getFeatureCategories(planType, role) {
  const categories = CATEGORY_SETS[planType] || CATEGORY_SETS.individual;
  if (!role) return categories;

  const normalizedRole = role.toUpperCase();
  return categories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.audience.includes(normalizedRole)),
    }))
    .filter((cat) => cat.items.length > 0);
}

// Tier keys per planType, in display order. individual/resume use the
// free/pro/premium naming; org uses its own trial/starter/growth naming.
export const PLAN_TIERS = {
  individual: ["free", "pro", "premium"],
  resume: ["free", "pro", "premium"],
  org: ["trial", "starter", "growth"],
};

export const PLAN_TIER_LABELS = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
  trial: "Trial",
  starter: "Starter",
  growth: "Growth",
};

/**
 * Builds a full side-by-side matrix (all tiers at once, not just current
 * vs target) for a planType, current plan, target plan, and role. This is
 * what a free user needs to see everything pro/premium unlock in one
 * glance, instead of a single current→target arrow.
 *
 * Returns: { tiers, currentTier, targetTier, categories: [{ category,
 *   icon, items: [{ label, type, values: { tierKey: formattedValue },
 *   improved }] }] }
 *
 * role: "TRAINER" | "STUDENT" | "ORG_ADMIN" (case-insensitive)
 */
export function getComparisonMatrix(
  planType,
  currentPlanKey,
  targetPlanKey,
  role,
) {
  const tiers = PLAN_TIERS[planType] || PLAN_TIERS.individual;
  const categories = getFeatureCategories(planType, role);
  const currentKey = (currentPlanKey || tiers[0]).toLowerCase();
  const targetKey = (
    targetPlanKey ||
    tiers[tiers.length - 1] ||
    ""
  ).toLowerCase();

  return {
    tiers,
    currentTier: currentKey,
    targetTier: targetKey,
    categories: categories.map((cat) => ({
      category: cat.category,
      icon: cat.icon,
      items: cat.items.map((item) => {
        const values = {};
        tiers.forEach((t) => {
          values[t] = formatFeatureValue(item, t);
        });
        const currentRaw = item[currentKey];
        const targetRaw = item[targetKey];
        const improved =
          item.type === "boolean"
            ? targetRaw === true && currentRaw !== true
            : (targetRaw === -1 && currentRaw !== -1) ||
              (targetRaw !== -1 && currentRaw !== -1 && targetRaw > currentRaw);
        return { label: item.label, type: item.type, values, improved };
      }),
    })),
  };
}

/**
 * Builds ready-to-render comparison rows for a planType, current plan,
 * target plan, and the caller's role. Categories/items that don't apply
 * to that role are dropped entirely — a student never sees trainer-only
 * rows (course creation caps, upload limits, etc.) and vice versa.
 *
 * role: "TRAINER" | "STUDENT" | "ORG_ADMIN" (case-insensitive)
 * (Kept for backward compatibility — UpgradeModal now uses
 * getComparisonMatrix() instead, which shows all tiers at once.)
 */
export function getComparisonRows(
  planType,
  currentPlanKey,
  targetPlanKey,
  role,
) {
  const categories = getFeatureCategories(planType, role);
  const currentKey = (currentPlanKey || "free").toLowerCase();
  const targetKey = (targetPlanKey || "").toLowerCase();

  return categories.map((cat) => ({
    category: cat.category,
    icon: cat.icon,
    items: cat.items.map((item) => {
      const currentRaw = item[currentKey];
      const targetRaw = item[targetKey];
      const improved =
        item.type === "boolean"
          ? targetRaw === true && currentRaw !== true
          : (targetRaw === -1 && currentRaw !== -1) ||
            (targetRaw !== -1 && currentRaw !== -1 && targetRaw > currentRaw);
      return {
        label: item.label,
        type: item.type,
        currentValue: formatFeatureValue(item, currentKey),
        targetValue: formatFeatureValue(item, targetKey),
        currentRaw,
        targetRaw,
        improved,
      };
    }),
  }));
}
