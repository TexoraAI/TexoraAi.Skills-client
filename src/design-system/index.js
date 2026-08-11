// ═══════════════════════════════════════════════════════════════
// Global Design System — barrel export
// Import from "@/design-system" instead of deep-importing individual
// token/component files, so every page pulls from one place.
// ═══════════════════════════════════════════════════════════════

export {
  T,
  STAT_COLORS, // legacy gradient palette — kept so old imports don't break, do not use in new code
  STAT_COLOR_SEQUENCE,
  STAT_COLORS_FLAT, // current golden-reference palette (used by StatCard)
  STAT_COLOR_SEQUENCE_FLAT,
  ACCENT_PURPLE,
} from "./tokens/colors";
export { FONT_FAMILY, FONT_IMPORT, FONT_WEIGHT, FONT_SIZE, LINE_HEIGHT, LETTER_SPACING } from "./tokens/typography";
export { PAGE_PADDING, PAGE_PADDING_BOTTOM, BREAKPOINTS, GRID_GAP, CARD_PADDING, SECTION_GAP } from "./tokens/spacing";
export { RADIUS } from "./tokens/radius";
export { statCardShadow, SHADOW_DROPDOWN, SHADOW_TOAST } from "./tokens/shadows";

export { default as PageContainer } from "./layouts/PageContainer";
export { Hero, Section } from "./layouts/Section";

export { default as StatCard } from "./components/StatCard";
export { default as Button } from "./components/Button";
export { default as Badge } from "./components/Badge";
export { default as Panel } from "./components/Panel";

export { useAutoDarkMode } from "./hooks/useAutoDarkMode";
