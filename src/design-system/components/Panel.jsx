// ═══════════════════════════════════════════════════════════════
// Panel — Global Design System
// The white rounded content-block used for tables, charts, and any
// secondary section below the stat-card row (matches the SuperAdmin
// "Overall Completion Rate" / role-breakdown cards in the golden
// reference). Use this instead of a page-local <div> with its own
// border/radius/shadow.
//
// Usage:
//   <Panel title="Overall Completion Rate" action={<Button size="sm">Export</Button>}>
//     ...content...
//   </Panel>
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { FONT_FAMILY } from "../tokens/typography";
import { useAutoDarkMode } from "../hooks/useAutoDarkMode";

/**
 * @param {string} [title]
 * @param {React.ReactNode} [action] - right-aligned header slot (button, link, dropdown)
 * @param {"light"|"dark"} [mode] - explicit override. If omitted,
 *   auto-detects the app's current theme (via the "dark" class /
 *   data-theme attribute on <html>) so panels match the page across
 *   every dashboard without per-page wiring.
 * @param {number|string} [padding=20]
 */
const Panel = ({ title, action, mode, padding = 20, children, style }) => {
  const autoDark = useAutoDarkMode(mode != null);
  const resolvedMode = mode ?? (autoDark ? "dark" : "light");
  const bg = resolvedMode === "dark" ? "#111111" : "#ffffff";
  const border = resolvedMode === "dark" ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const titleColor = resolvedMode === "dark" ? "#ffffff" : "#0f172a";

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        boxShadow: resolvedMode === "dark" ? "0 2px 10px rgba(0,0,0,0.3)" : "0 1px 6px rgba(15,23,42,0.04)",
        overflow: "hidden",
        fontFamily: FONT_FAMILY,
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: `${typeof padding === "number" ? padding : 20}px ${typeof padding === "number" ? padding : 20}px 0`,
            marginBottom: 14,
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: titleColor, fontFamily: FONT_FAMILY }}>
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      <div style={{ padding: `${title || action ? 0 : (typeof padding === "number" ? padding : 20)}px ${typeof padding === "number" ? padding : 20}px ${typeof padding === "number" ? padding : 20}px` }}>
        {children}
      </div>
    </div>
  );
};

export default Panel;
