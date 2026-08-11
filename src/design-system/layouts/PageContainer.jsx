// ═══════════════════════════════════════════════════════════════
// PageContainer — Global Design System
// This is the exact `.dashboard-shell` + responsive breakpoint system
// from Student/DashboardPage.jsx (Golden Reference), extracted so
// every page (Student/Trainer/Admin/Business) wraps its content in
// the SAME container instead of redeclaring padding/breakpoints.
//
// Usage:
//   import PageContainer from "@/design-system/layouts/PageContainer";
//   <PageContainer>
//     ...page content...
//   </PageContainer>
//
// Do NOT add page-specific padding/maxWidth overrides here or in the
// consuming page — if a page needs different spacing, that's a sign
// the design system itself needs updating (change it here, once).
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { FONT_FAMILY, FONT_IMPORT } from "../tokens/typography";

/**
 * Global responsive CSS — identical to DashboardPage.jsx's inline
 * <style> block. Scoped to class names so it can be shared by every
 * page without prop-drilling breakpoint numbers.
 */
const GLOBAL_LAYOUT_CSS = `
  ${FONT_IMPORT}

  /* ══════ Crisp / HD rendering ══════ */
  * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
  .dashboard-shell, .dashboard-shell * { backface-visibility: hidden; }
  .dashboard-shell p, .dashboard-shell span, .dashboard-shell h1, .dashboard-shell h3, .dashboard-shell button, .dashboard-shell input {
    -webkit-font-smoothing: antialiased;
    letter-spacing: 0.01em;
  }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .dfade { animation: fadeUp 0.45s ease both; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
  .d1 { animation: blink 1.6s ease infinite; }
  .d2 { animation: blink 1.6s 0.3s ease infinite; }
  .d3 { animation: blink 1.6s 0.6s ease infinite; }
  @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); } 70% { box-shadow: 0 0 0 8px rgba(124,58,237,0); } 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); } }
  .livebadge { animation: pulse-ring 2.2s ease-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  /* ══════ Page container ══════ */
  .dashboard-shell { padding: 24px 32px; width: 100%; margin: 0; padding-bottom: 52px; box-sizing: border-box; }

  /* ══════ Shared grids — reuse these class names on every page ══════ */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .dash-row-grid { display: grid; grid-template-columns: 1fr 1fr 290px; gap: 14px; align-items: stretch; }
  .mini-progress-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .progress-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }

  .hero-flex { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .hero-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  /* ── Laptop / small desktop (<=1280px) ── */
  @media (max-width: 1280px) {
    .dashboard-shell { padding: 20px; }
  }

  /* ── iPad landscape / small laptop (<=1024px) ── */
  @media (max-width: 1024px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .dash-row-grid { grid-template-columns: 1fr 1fr; }
    .dash-row-grid > :nth-child(3) { grid-column: 1 / -1; }
    .mini-progress-grid { grid-template-columns: repeat(2, 1fr); }
    .progress-summary-grid { grid-template-columns: repeat(2, 1fr); }
  }

  /* ── iPad portrait / tablet (<=834px) ── */
  @media (max-width: 834px) {
    .dashboard-shell { padding: 18px; }
    .dash-row-grid { grid-template-columns: 1fr; }
    .dash-row-grid > :nth-child(3) { grid-column: auto; }
  }

  /* ── iPad mini / small tablet (<=700px) ── */
  @media (max-width: 700px) {
    .courses-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
  }

  /* ── Large phones / phablets (<=640px) ── */
  @media (max-width: 640px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .mini-progress-grid { grid-template-columns: 1fr; }
    .progress-summary-grid { grid-template-columns: repeat(2, 1fr); }
    .courses-grid { grid-template-columns: 1fr; }
    .course-progress-row .course-progress-badge { display: none; }
  }

  /* ── Phones (<=480px) ── */
  @media (max-width: 480px) {
    .dashboard-shell { padding: 12px; padding-bottom: 40px; }
    .stat-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
    .progress-summary-grid { grid-template-columns: 1fr 1fr; }
    .stat-card { padding: 16px 14px 14px !important; }
    .hero-flex { gap: 12px; }
  }

  /* ── Very small phones (<=380px) ── */
  @media (max-width: 380px) {
    .stat-grid { grid-template-columns: 1fr; }
    .progress-summary-grid { grid-template-columns: 1fr; }
  }
`;

/**
 * @param {Object} props
 * @param {"dark"|"light"} props.mode - current theme mode
 * @param {string} props.pageBg - T[mode].pageBg from tokens/colors.js
 * @param {string} props.textColor - T[mode].text from tokens/colors.js
 * @param {React.ReactNode} props.children
 */
const PageContainer = ({ mode = "dark", pageBg, textColor, children }) => (
  <div
    style={{
      minHeight: "100vh",
      background: pageBg,
      color: textColor,
      fontFamily: FONT_FAMILY,
      transition: "background 0.3s, color 0.3s",
    }}
  >
    <style>{GLOBAL_LAYOUT_CSS}</style>
    <div className="dashboard-shell" style={{ position: "relative", zIndex: 1 }}>
      {children}
    </div>
  </div>
);

export default PageContainer;
export { GLOBAL_LAYOUT_CSS };
