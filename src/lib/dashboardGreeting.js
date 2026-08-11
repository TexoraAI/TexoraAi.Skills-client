// ─────────────────────────────────────────────────────────────────────────
// SHARED DASHBOARD GREETING + LIVE CLOCK UTILITY
//
// Single source of truth for the "Good Morning/Afternoon/Evening/Night"
// greeting and the real-time clock shown on the Student, Trainer and Admin
// dashboards. Import from here — do NOT re-implement this logic inside any
// individual dashboard file.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

/**
 * getDashboardGreeting
 * Returns "Good Morning" | "Good Afternoon" | "Good Evening" | "Good Night"
 * based on the LOCAL hour of the given Date (browser time, never hardcoded).
 *
 *   5:00 AM – 11:59 AM  -> Good Morning
 *  12:00 PM –  4:59 PM  -> Good Afternoon
 *   5:00 PM –  8:59 PM  -> Good Evening
 *   9:00 PM –  4:59 AM  -> Good Night
 */
export function getDashboardGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

/**
 * getFormattedTime
 * Formats a Date as the user's current local time, e.g. "3:13 PM".
 */
export function getFormattedTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/**
 * getCurrentUserName
 * Resolves the logged-in user's display name from existing auth state only
 * — never hardcoded. Checked in order:
 *   1. localStorage "lms_user" JSON  -> name / fullName / displayName
 *   2. localStorage "lms_user" JSON  -> email local-part (before the "@")
 *   3. "lms_token" JWT payload       -> name claim, else "sub" local-part
 *   4. Fallback: "there"
 */
export function getCurrentUserName() {
  try {
    const rawUser = localStorage.getItem("lms_user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const name = user?.name || user?.fullName || user?.displayName;
      if (name) return name;
      if (user?.email) return user.email.split("@")[0];
    }
  } catch {
    // malformed lms_user JSON — fall through to token lookup
  }

  try {
    const token = localStorage.getItem("lms_token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload?.name) return payload.name;
      if (payload?.sub) return String(payload.sub).split("@")[0];
    }
  } catch {
    // malformed/missing token — fall through to default
  }

  return "there";
}

/**
 * useDashboardGreeting
 * React hook: live greeting + clock derived from the browser's local time.
 * Re-computes on an interval (well under the required 60s) so the greeting
 * automatically flips the moment it crosses a boundary (e.g. 11:59 AM ->
 * 12:00 PM) and the clock stays current — no page refresh, no backend call.
 *
 * Used identically by the Student, Trainer and Admin dashboards.
 */
export function useDashboardGreeting() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  return {
    greeting: getDashboardGreeting(now),
    time: getFormattedTime(now),
    userName: getCurrentUserName(),
  };
}