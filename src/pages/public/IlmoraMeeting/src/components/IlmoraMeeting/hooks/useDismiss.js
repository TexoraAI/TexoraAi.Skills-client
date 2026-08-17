import { useEffect } from "react";

export function useDismiss(active, onDismiss, refs = []) {
  useEffect(() => {
    if (!active) return undefined;
    const handlePointer = (e) => {
      const insideAny = refs.some(
        (r) => r.current && r.current.contains(e.target),
      );
      if (!insideAny) onDismiss();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", handlePointer, true);
    document.addEventListener("touchstart", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer, true);
      document.removeEventListener("touchstart", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [active, onDismiss, refs]);
}
