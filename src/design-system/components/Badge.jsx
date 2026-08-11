// ═══════════════════════════════════════════════════════════════
// Badge — Global Design System
// Status pills / labels. Reuse everywhere a page currently hand-
// rolls a colored rounded <span> (table status cells, card corner
// tags, list-item states).
//
// Usage: <Badge tone="success">Completed</Badge>
// ═══════════════════════════════════════════════════════════════
import React from "react";
import { FONT_FAMILY } from "../tokens/typography";

const TONES = {
  success: { bg: "#dcfce7", text: "#15803d" },
  warning: { bg: "#fef3c7", text: "#b45309" },
  danger: { bg: "#fee2e2", text: "#b91c1c" },
  info: { bg: "#dbeafe", text: "#1d4ed8" },
  purple: { bg: "#ede9fe", text: "#6d28d9" },
  neutral: { bg: "#f1f5f9", text: "#64748b" },
};

/** @param {"success"|"warning"|"danger"|"info"|"purple"|"neutral"} [tone="neutral"] */
const Badge = ({ tone = "neutral", children, style }) => {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 999,
        fontFamily: FONT_FAMILY,
        fontSize: 11,
        fontWeight: 600,
        background: t.bg,
        color: t.text,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
