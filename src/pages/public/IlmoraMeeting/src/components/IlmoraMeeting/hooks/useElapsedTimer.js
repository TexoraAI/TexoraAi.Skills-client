import { useEffect, useState } from "react";

/* ─── small utility hooks (self-contained, no external context) ──── */

export function useElapsedTimer(startedAtMs) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!startedAtMs) return undefined;
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [startedAtMs]);
  if (!startedAtMs) return "00:00:00";
  const secs = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
