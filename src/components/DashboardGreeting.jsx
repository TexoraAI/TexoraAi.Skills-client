import React from "react";
import { Clock } from "lucide-react";
import {
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  ACCENT_PURPLE,
} from "@/design-system";
import { useDashboardGreeting } from "@/lib/dashboardGreeting";

// Exact brand colors from the "ILM ORA" logo — ILM in green, ORA in orange.
const BRAND_GREEN = "#16A34A";
const BRAND_ORANGE = "#F97316";

/**
 * DashboardGreeting
 * The ONE shared greeting + real-time clock block used inside the Hero of
 * the Student, Trainer and Admin dashboards. This IS the Hero's main title
 * now — it replaces the old static "Admin/Trainer/Student Dashboard" <h1>.
 *
 * Uses ONLY the global typography tokens (FONT_SIZE.heroTitle,
 * FONT_WEIGHT.heroTitle, LINE_HEIGHT.heroTitle, LETTER_SPACING.heroTitle,
 * FONT_SIZE.bodySmall) — the exact same scale the old page <h1> and
 * subtitle used. No page-local or custom font sizes.
 *
 * Renders:
 *   Good Afternoon, imam.syed.0256! 👋
 *   Welcome to ILM ORA  ◷ 4:13 PM   ("ILM" green, "ORA" orange — matches
 *                                    the sidebar/navbar logo exactly)
 *
 * Do not copy this markup into individual dashboard files — import this
 * component so all three dashboards stay pixel-identical and never drift.
 *
 * Props:
 *   t          - the page's active theme token object (same one already
 *                used for every other Hero text on that page).
 *   brandName  - only used if it's something OTHER than "ILM ORA" (falls
 *                back to plain text). Leave unset to get the two-tone
 *                "ILM ORA" logo treatment.
 *   titleColor - color for the greeting heading. Defaults to
 *                ACCENT_PURPLE.base (matches Admin/Trainer). Pass the
 *                page's own title color (e.g. Student uses "#3B82F6") to
 *                keep each dashboard's original accent unchanged.
 */
export default function DashboardGreeting({
  t,
  brandName,
  titleColor = ACCENT_PURPLE.base,
}) {
  const { greeting, time, userName } = useDashboardGreeting();
  const isDefaultBrand = !brandName || brandName === "ILM ORA";

  return (
    <>
      <h1
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT.heroTitle,
          fontSize: FONT_SIZE.heroTitle,
          color: titleColor,
          margin: "0 0 6px",
          lineHeight: LINE_HEIGHT.heroTitle,
          letterSpacing: LETTER_SPACING.heroTitle,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: t.text }}>
          {greeting}, <span style={{ color: titleColor }}>{userName}!</span>
        </span>
        <span role="img" aria-label="waving hand">👋</span>
      </h1>
      <p
        style={{
          fontSize: FONT_SIZE.bodySmall,
          color: t.textSub,
          margin: "0 0 4px",
          fontWeight: FONT_WEIGHT.medium,
          fontFamily: FONT_FAMILY,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {isDefaultBrand ? (
          <span>
            Welcome to{" "}
            <span style={{ color: BRAND_GREEN, fontWeight: FONT_WEIGHT.bold }}>ILM</span>{" "}
            <span style={{ color: BRAND_ORANGE, fontWeight: FONT_WEIGHT.bold }}>ORA</span>
          </span>
        ) : (
          <span>Welcome to {brandName}</span>
        )}
        <Clock size={12} color={t.textSub} />
        <span>{time}</span>
      </p>
    </>
  );
}