// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY TOKENS — Global Design System
// Extracted from Student/DashboardPage.jsx (Golden Reference).
// Every page must import the font via FONT_IMPORT once (already wired
// in DashboardLayout) and use these scale values — no page-local
// font sizes for headings, card titles, or card values.
// ═══════════════════════════════════════════════════════════════

export const FONT_FAMILY = "'Poppins', sans-serif";

/** Drop this <style> once at the layout root — DashboardLayout already does this. */
export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');";

export const FONT_WEIGHT = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  heroTitle: 600, // used specifically for portal hero <h1> (Admin hero uses 650, not 700)
  extrabold: 800,
  black: 900,
};

/**
 * Type scale — name matches how it's used across Student/Trainer/Admin
 * dashboards, so every page picks the same label instead of a raw px value.
 */

export const FONT_SIZE = {
  cardValue: 30, // big StatCard number ("142")
  heroTitle: "clamp(24px, 2.2vw, 30px)",
  sectionTitle: 13, // card/section header labels
  cardLabel: 13, // StatCard label under the number
  body: 12.5,
  bodySmall: 12,
  caption: 11,
  micro: 10,
  eyebrow: 9, // uppercase status pills / badges
  eyebrowLetterSpacing: "0.1em",
};

export const LINE_HEIGHT = {
  tight: 1,
  heroTitle: 1.1,
  body: 1.5,
};

export const LETTER_SPACING = {
  base: "0.01em", // applied globally to p/span/h1/h3/button/input
  heroTitle: "-0.02em",
  eyebrow: "0.05em",
  eyebrowWide: "0.1em",
};

const typography = {
  FONT_FAMILY,
  FONT_IMPORT,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
};

export default typography;
