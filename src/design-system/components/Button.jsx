// ═══════════════════════════════════════════════════════════════
// Button — Global Design System
// One button component for the whole app. variant controls color,
// size controls height/padding. Every portal (Student/Trainer/
// Admin/Business/SuperAdmin) should render buttons through this
// instead of hand-rolling styles per page.
//
// Usage:
//   <Button variant="primary" icon={Plus} onClick={...}>Add User</Button>
//   <Button variant="secondary" mode="dark">Export</Button>
//   <Button variant="danger" size="sm">Delete</Button>
// ═══════════════════════════════════════════════════════════════
import React, { useState } from "react";
import { FONT_FAMILY } from "../tokens/typography";
import { RADIUS } from "../tokens/radius";
import { useAutoDarkMode } from "../hooks/useAutoDarkMode";

const VARIANTS = {
  primary: { bg: "#7c3aed", bgHov: "#6d28d9", text: "#ffffff", border: "none" },
  secondary: { bg: "#ffffff", bgHov: "#f8fafc", text: "#0f172a", border: "1px solid #e2e8f0" },
  danger: { bg: "#ef4444", bgHov: "#dc2626", text: "#ffffff", border: "none" },
  success: { bg: "#16a34a", bgHov: "#15803d", text: "#ffffff", border: "none" },
  ghost: { bg: "transparent", bgHov: "#f1f5f9", text: "#64748b", border: "none" },
};

const SIZES = {
  sm: { height: 32, padding: "0 12px", fontSize: 12.5 },
  md: { height: 38, padding: "0 16px", fontSize: 13 },
  lg: { height: 44, padding: "0 20px", fontSize: 14 },
};

/**
 * @param {"primary"|"secondary"|"danger"|"success"|"ghost"} [variant="primary"]
 * @param {"sm"|"md"|"lg"} [size="md"]
 * @param {"light"|"dark"} [mode] - only affects "secondary"/"ghost" surface
 *   colors. If omitted, auto-detects the app's current theme (via the
 *   "dark" class / data-theme attribute on <html>) so buttons match the
 *   page across every dashboard without per-page wiring.
 * @param {LucideIcon} [icon] - optional leading icon
 * @param {boolean} [disabled]
 * @param {boolean} [fullWidth]
 */
const Button = ({
  variant = "primary",
  size = "md",
  mode,
  icon: Icon,
  disabled = false,
  fullWidth = false,
  children,
  style,
  ...rest
}) => {
  const [hov, setHov] = useState(false);
  const autoDark = useAutoDarkMode(mode != null);
  const resolvedMode = mode ?? (autoDark ? "dark" : "light");
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  const secondaryDark = variant === "secondary" && resolvedMode === "dark";
  const ghostDark = variant === "ghost" && resolvedMode === "dark";

  const bg = secondaryDark
    ? (hov ? "#1c1c1c" : "#111111")
    : ghostDark
    ? (hov ? "rgba(255,255,255,0.08)" : "transparent")
    : (hov ? v.bgHov : v.bg);
  const text = secondaryDark ? "#e5e7eb" : ghostDark ? "#94a3b8" : v.text;
  const border = secondaryDark ? "1px solid rgba(255,255,255,0.1)" : v.border;

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        height: s.height,
        padding: s.padding,
        width: fullWidth ? "100%" : "auto",
        fontFamily: FONT_FAMILY,
        fontSize: s.fontSize,
        fontWeight: 600,
        color: text,
        background: bg,
        border,
        borderRadius: RADIUS.button,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {Icon && <Icon size={s.fontSize + 2} strokeWidth={2.2} />}
      {children}
    </button>
  );
};

export default Button;
