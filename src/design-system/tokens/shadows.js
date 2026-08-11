// ═══════════════════════════════════════════════════════════════
// SHADOW TOKENS — Global Design System
// Standard card shadows come from T[mode].shadow / shadowHov in
// colors.js (they differ dark vs light — see there). This file holds
// the shadow values that are NOT theme-dependent: the StatCard glow,
// which is derived from each gradient's own color (see STAT_COLORS).
// ═══════════════════════════════════════════════════════════════

import { STAT_COLORS } from "./colors";

/** StatCard shadow — rest vs hover state, colored by the card's own gradient. */
export function statCardShadow(colorKey, hovered) {
  const c = STAT_COLORS[colorKey] || STAT_COLORS.blue;
  return hovered ? `0 14px 32px ${c.shadow}` : `0 8px 20px ${c.shadow}`;
}

/** Dropdown / toast / floating-panel shadow (not theme-dependent, from PROFILE_MENU_CSS in DashboardLayout). */
export const SHADOW_DROPDOWN = {
  light: "0 16px 40px rgba(0,0,0,0.14)",
  dark: "0 16px 40px rgba(0,0,0,0.45)",
};

export const SHADOW_TOAST = "0 8px 32px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)";

export default { statCardShadow, SHADOW_DROPDOWN, SHADOW_TOAST };
