import { useCallback } from "react";

// Adds a Material-style ripple to any element with className="ripple-btn".
// Usage: <button className="ripple-btn" onClick={useRipple(handleClick)}>
export default function useRipple(onClick) {
  return useCallback(
    (e) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
      onClick?.(e);
    },
    [onClick],
  );
}
