import { useCallback, useRef, useState } from "react";

/**
 * Minimal toast used across the roadmap-upgraded screens instead of
 * whatever global toast system the rest of the app has, so these files stay
 * drop-in / dependency-free. Swap `useRuToast` for your app's real toast
 * hook if you'd rather not render a second toast implementation.
 */
export function useRuToast() {
  const [msg, setMsg] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((text) => {
    setMsg(text);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  const ToastEl = (
    <div className={`ru-toast${msg ? " show" : ""}`}>
      <span className="ru-tdot" />
      <span>{msg}</span>
    </div>
  );

  return { showToast, ToastEl };
}

// Applies a role's accent color as CSS variables on the .ru-scope wrapper.
export function ruAccentStyle(roleConfig) {
  return {
    "--ru-accent": roleConfig.accent,
    "--ru-accent-soft": roleConfig.accentSoft,
    "--ru-accent-glow": roleConfig.accentGlow,
  };
}
