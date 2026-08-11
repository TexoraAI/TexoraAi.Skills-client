// ═══════════════════════════════════════════════════════════════
// useAutoDarkMode — Global Design System
// Every page in the LMS toggles dark mode by adding/removing the
// "dark" class (or a data-theme="dark" attribute) on
// <html>/document.documentElement — this is the SAME pattern already
// used independently in DashboardLayout.jsx, Dashboard.jsx (Trainer),
// and the Student "golden reference" DashboardPage.jsx.
//
// Previously, shared components (StatCard, Button, Panel) took a
// `mode` prop that defaulted to "light" and relied on every single
// call site remembering to pass `mode={isDark ? "dark" : "light"}`.
// Miss it once (as happened with the Trainer Dashboard's StatCard
// grid) and that piece silently stays light forever, regardless of
// the page's real theme.
//
// This hook centralizes the detection ONCE. Shared components now
// call this internally as a fallback: an explicitly-passed `mode`
// prop still wins (so nothing already working changes behavior),
// but if a page forgets to pass it, the component still renders the
// correct theme automatically — across Student, Trainer, and
// Admin/Business dashboards alike, with zero per-page wiring.
//
// Usage inside a design-system component:
//   const autoDark = useAutoDarkMode();
//   const resolvedMode = mode ?? (autoDark ? "dark" : "light");
// ═══════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";

const readIsDark = () =>
  typeof document !== "undefined" &&
  (document.documentElement.classList.contains("dark") ||
    document.documentElement.getAttribute("data-theme") === "dark");

/**
 * @param {boolean} [skip] - pass true to skip observing (e.g. when the
 *   caller already supplied an explicit mode) to avoid an unnecessary
 *   MutationObserver.
 * @returns {boolean} true if the app is currently in dark mode
 */
export function useAutoDarkMode(skip = false) {
  const [isDark, setIsDark] = useState(readIsDark);

  useEffect(() => {
    if (skip) return;
    // Re-sync immediately in case the class changed between initial
    // render and effect mount (e.g. theme restored from localStorage).
    setIsDark(readIsDark());
    const obs = new MutationObserver(() => setIsDark(readIsDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, [skip]);

  return isDark;
}

export default useAutoDarkMode;
