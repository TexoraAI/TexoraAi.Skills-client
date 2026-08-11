// ═══════════════════════════════════════════════════════════════
// Section — Global Design System
// The hero-section wrapper pattern from DashboardPage.jsx. Use this
// for the top banner on every page (Dashboard, My Courses, Reports,
// Finance, etc.) instead of a page-local hero div.
// ═══════════════════════════════════════════════════════════════
import React from "react";

/**
 * Hero — top banner section. Fades in on mount (.dfade), bordered
 * bottom-only, no background/card styling (matches Golden Reference:
 * "background: transparent, border: none, borderBottom only").
 *
 * @param {string} borderHero - T[mode].borderHero from tokens/colors.js
 */
export const Hero = ({ borderHero, children }) => (
  <div
    className="dfade"
    style={{
      padding: "8px 0 24px",
      background: "transparent",
      border: "none",
      borderBottom: `1px solid ${borderHero}`,
      marginBottom: 20,
      boxShadow: "none",
    }}
  >
    <div className="hero-flex">{children}</div>
  </div>
);

/**
 * Section — a standard content block with the shared vertical rhythm
 * (14px gap between sections, matching SECTION_GAP.betweenSections).
 */
export const Section = ({ style, children }) => (
  <div style={{ marginBottom: 14, ...style }}>{children}</div>
);

export default { Hero, Section };
