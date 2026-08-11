// ═══════════════════════════════════════════════════════════════
// COLOR TOKENS — Global Design System
// Extracted verbatim from Student/DashboardPage.jsx (Golden Reference).
// DO NOT hand-tune values here without re-checking the Golden Reference —
// every page in the LMS inherits colors from this single file.
// ═══════════════════════════════════════════════════════════════

/**
 * T — full theme token map, keyed by "dark" | "light".
 * Every page/card in the LMS should read colors from T[mode], never
 * hardcode its own hex values. This is copied 1:1 from DashboardPage.jsx.
 */
export const T = {
  dark: {
    pageBg: "#0a0a0a",
    cardBg: "#111111",
    cardBgHov: "#161616",
    heroBg: "#141414",

    border: "rgba(255,255,255,0.08)",
    borderHov: "rgba(255,255,255,0.18)",
    borderHero: "rgba(255,255,255,0.09)",

    text: "#ffffff",
    textSub: "rgba(255,255,255,0.55)",
    textMuted: "rgba(255,255,255,0.42)",
    textLabel: "rgba(255,255,255,0.45)",

    pillBg: "rgba(255,255,255,0.05)",
    pillBorder: "rgba(255,255,255,0.09)",
    pillText: "rgba(255,255,255,0.5)",

    iconBg: "rgba(255,255,255,0.06)",
    iconBorder: "rgba(255,255,255,0.1)",

    calDayText: "rgba(255,255,255,0.7)",
    calDayHeader: "rgba(255,255,255,0.4)",
    calFooter: "rgba(255,255,255,0.4)",
    calFooterBdr: "rgba(255,255,255,0.07)",

    emptyBorder: "rgba(255,255,255,0.09)",
    emptyBg: "rgba(255,255,255,0.03)",
    emptyIcon: "rgba(255,255,255,0.2)",

    gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.07)",

    actBar: "rgba(255,255,255,0.55)",
    actIcon: "rgba(255,255,255,0.45)",
    actBg: "rgba(255,255,255,0.05)",
    actBorder: "rgba(255,255,255,0.09)",

    navBtnBg: "rgba(255,255,255,0.05)",
    navBtnBorder: "rgba(255,255,255,0.1)",
    navBtnColor: "#aaa",

    todayBg: "#ffffff",
    todayText: "#000000",

    shadow: "0 2px 12px rgba(0,0,0,0.35)",
    shadowHov: "0 14px 36px rgba(0,0,0,0.5)",

    liveColor: "#34d399",
    liveText: "#34d399",

    recentItemBg: "rgba(255,255,255,0.04)",
    recentItemBorder: "rgba(255,255,255,0.07)",
    recentItemBgHov: "rgba(255,255,255,0.07)",

    overdueBg: "rgba(239,68,68,0.14)",
    overdueText: "#f87171",
    overdueBorder: "rgba(239,68,68,0.25)",

    newBadgeBg: "rgba(245,158,11,0.14)",
    newBadgeText: "#fbbf24",
    newBadgeBorder: "rgba(245,158,11,0.25)",

    courseCardBg: "#111111",
    courseSkeletonBg: "rgba(255,255,255,0.06)",

    statusCompletedBg: "rgba(52,211,153,0.12)",
    statusCompletedText: "#34d399",
    statusProgressBg: "rgba(124,58,237,0.12)",
    statusProgressText: "#a78bfa",
    statusNotStartedBg: "rgba(255,255,255,0.05)",
    statusNotStartedText: "rgba(255,255,255,0.4)",
  },

  light: {
    pageBg: "#f1f5f9",
    cardBg: "#ffffff",
    cardBgHov: "#f8fafc",
    heroBg: "#ffffff",

    border: "#e2e8f0",
    borderHov: "#cbd5e1",
    borderHero: "#e2e8f0",

    text: "#0f172a",
    textSub: "#64748b",
    textMuted: "#94a3b8",
    textLabel: "#94a3b8",

    pillBg: "#f1f5f9",
    pillBorder: "#e2e8f0",
    pillText: "#94a3b8",

    iconBg: "#f8fafc",
    iconBorder: "#e2e8f0",

    calDayText: "#374151",
    calDayHeader: "#9ca3af",
    calFooter: "#9ca3af",
    calFooterBdr: "#e5e7eb",

    emptyBorder: "#e2e8f0",
    emptyBg: "#f8fafc",
    emptyIcon: "#cbd5e1",

    gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9",

    actBar: "#94a3b8",
    actIcon: "#94a3b8",
    actBg: "#f8fafc",
    actBorder: "#e2e8f0",

    navBtnBg: "#f8fafc",
    navBtnBorder: "#e2e8f0",
    navBtnColor: "#64748b",

    todayBg: "#0f172a",
    todayText: "#ffffff",

    shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",

    liveColor: "#16a34a",
    liveText: "#16a34a",

    recentItemBg: "#f8fafc",
    recentItemBorder: "#e2e8f0",
    recentItemBgHov: "#f1f5f9",

    overdueBg: "#fef2f2",
    overdueText: "#ef4444",
    overdueBorder: "#fecaca",

    newBadgeBg: "#fffbeb",
    newBadgeText: "#d97706",
    newBadgeBorder: "#fde68a",

    courseCardBg: "#ffffff",
    courseSkeletonBg: "#f1f5f9",

    statusCompletedBg: "#dcfce7",
    statusCompletedText: "#15803d",
    statusProgressBg: "#ede9fe",
    statusProgressText: "#6d28d9",
    statusNotStartedBg: "#f1f5f9",
    statusNotStartedText: "#94a3b8",
  },
};

/**
 * STAT_COLORS — the exact 4(+1)-gradient palette every StatCard in the
 * LMS must reuse. This is the "Card 1 = Blue, Card 2 = Green,
 * Card 3 = Orange, Card 4 = Purple" sequence referenced in the design
 * brief. `red` is kept for warning/overdue-style stat cards that need
 * a 5th color outside the core 4-sequence.
 *
 * Usage across portals:
 *   Student   → Active Courses (blue), Completed (green), Pending (orange), Attendance (purple)
 *   Trainer   → same 4-color sequence, different labels
 *   Admin     → same 4-color sequence, different labels
 *   Analytics / Reports / Finance → same 4-color sequence
 */
export const STAT_COLORS = {
  blue: {
    gradient: "linear-gradient(135deg, #4F8CFF 0%, #2563EB 100%)",
    shadow: "rgba(37,99,235,0.35)",
  },
  green: {
    gradient: "linear-gradient(135deg, #34C77B 0%, #15803D 100%)",
    shadow: "rgba(21,128,61,0.35)",
  },
  orange: {
    gradient: "linear-gradient(135deg, #FBA23C 0%, #D97706 100%)",
    shadow: "rgba(217,119,6,0.35)",
  },
  purple: {
    gradient: "linear-gradient(135deg, #A66BF5 0%, #7C3AED 100%)",
    shadow: "rgba(124,58,237,0.35)",
  },
  red: {
    gradient: "linear-gradient(135deg, #F87171 0%, #DC2626 100%)",
    shadow: "rgba(220,38,38,0.35)",
  },
};

/** Fixed 4-card color order every dashboard's primary stat row must follow. */
export const STAT_COLOR_SEQUENCE = ["blue", "green", "orange", "purple"];

/** Accent used for chat bubbles / send buttons / active-state highlights across the app. */
export const ACCENT_PURPLE = { base: "#7c3aed", light: "#a855f7" };

/**
 * STAT_COLORS_FLAT — SuperAdmin golden-reference stat palette (flat white
 * card + soft-tint icon badge, NOT the gradient cards in STAT_COLORS above).
 * Values taken verbatim from the SuperAdmin Onboarding Management screenshot
 * brief. This is what StatCard.jsx now renders by default across every
 * portal (Student/Trainer/Admin/Business) — STAT_COLORS (gradient) is kept
 * only so nothing that still imports it breaks.
 */
export const STAT_COLORS_FLAT = {
  purple: { solid: "#7c3aed", soft: "#ede9fe" },
  green: { solid: "#16a34a", soft: "#dcfce7" },
  amber: { solid: "#f59e0b", soft: "#fef3c7" },
  red: { solid: "#ef4444", soft: "#fee2e2" },
  blue: { solid: "#3b82f6", soft: "#dbeafe" },
};

/** Fixed color order for the primary stat row, flat-palette version. */
export const STAT_COLOR_SEQUENCE_FLAT = ["blue", "green", "amber", "red"];

export default T;
