// ═══════════════════════════════════════════════════════════════
// SPACING TOKENS — Global Design System
// Extracted from Student/DashboardPage.jsx (.dashboard-shell system).
// Every page must use PageContainer/Section (see ../layouts) instead
// of re-declaring these numbers locally.
// ═══════════════════════════════════════════════════════════════

/** Page container padding, keyed by breakpoint name (desktop-first). */
export const PAGE_PADDING = {
  desktop: "24px 32px", // > 1280px
  laptop: "20px", // <= 1280px
  tablet: "18px", // <= 834px
  mobile: "12px", // <= 480px
};

export const PAGE_PADDING_BOTTOM = {
  default: 52,
  mobile: 40, // <= 480px
};

/** Breakpoints — SAME set every page must use. Never invent page-local breakpoints. */
export const BREAKPOINTS = {
  desktop: 1280, // laptop / small desktop
  laptop: 1024, // iPad landscape / small laptop
  tablet: 834, // iPad portrait / tablet
  tabletSmall: 700, // iPad mini / small tablet
  phablet: 640, // large phones / phablets
  mobile: 480, // phones
  mobileSmall: 380, // very small phones (iPhone SE etc.)
};

/** Grid gaps used across stat rows, mini-progress rows, course grids. */
export const GRID_GAP = {
  statGrid: 14,
  statGridMobile: 10,
  miniProgressGrid: 14,
  coursesGrid: 16,
  dashRowGrid: 14,
};

/** Card internal padding by card type. */
export const CARD_PADDING = {
  statCard: "20px 22px 18px",
  statCardMobile: "16px 14px 14px",
  standardCard: 22,
  heroCard: "8px 0 24px",
  emptyState: "60px 20px",
};

/** Section-level vertical rhythm (space between major dashboard blocks). */
export const SECTION_GAP = {
  heroToContent: 20,
  betweenSections: 14,
};

const spacing = {
  PAGE_PADDING,
  PAGE_PADDING_BOTTOM,
  BREAKPOINTS,
  GRID_GAP,
  CARD_PADDING,
  SECTION_GAP,
};

export default spacing;
