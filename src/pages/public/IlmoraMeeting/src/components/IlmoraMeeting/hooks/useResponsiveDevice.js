import { useEffect, useState } from "react";

export function useResponsiveDevice() {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1366,
  );
  useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setW(window.innerWidth));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  if (w <= 767) return "phone";
  if (w <= 1023) return "tablet";
  if (w <= 1365) return "laptop";
  return "desktop";
}
