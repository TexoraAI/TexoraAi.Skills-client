import { useEffect, useState } from "react";

export function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const root = el.closest("[data-scroll-root]") || null;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, threshold: 0.01, rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}
