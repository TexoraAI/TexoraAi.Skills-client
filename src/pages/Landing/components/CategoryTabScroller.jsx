import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * CategoryTabScroller
 * ------------------------------------------------------------------
 * Wraps a `TabsList` (or any wide row of pill buttons) so that it scales
 * to 10, 20, or 50+ categories without wrapping to multiple rows:
 *  - Compact horizontal scroll strip, scrollbar hidden
 *  - Left/right arrows fade in only when there's more to scroll
 *  - Mouse-wheel and click-drag scrolling on desktop
 *  - Native swipe on touch devices
 *  - Auto-scrolls the active tab into view when it changes
 */
export default function CategoryTabScroller({ children, activeKey }) {
  const scrollerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    // Watch both the scroll container (viewport resizes) AND its content
    // (the tab list itself, e.g. `w-max` TabsList). The container's own
    // box never changes size when tabs are added/removed — only the
    // content does — so without observing the content too, arrows would
    // never appear if categories grow from a few to 50+ after data loads.
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    // Belt-and-braces: catch tab additions/removals directly, in case
    // the browser doesn't fire a resize for a given DOM change.
    const mo = new MutationObserver(updateArrows);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  // Keep the active tab visible when it changes.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const activeEl = el.querySelector('[data-state="active"]');
    if (activeEl) {
      const elRect = el.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      if (activeRect.left < elRect.left || activeRect.right > elRect.right) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  const scrollByAmount = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const onWheel = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const onMouseDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.pageX;
    dragStartScroll.current = el.scrollLeft;
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = dragStartScroll.current - (e.pageX - dragStartX.current);
  };
  const endDrag = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative flex items-center gap-2">
      {canLeft && (
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scrollByAmount(-1)}
          className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-opacity duration-200 opacity-100 hover:border-[#F97316]/40"
        >
          <ChevronLeft size={16} className="text-[#1E293B] dark:text-white" />
        </button>
      )}

      <div
        ref={scrollerRef}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className="tabs-scroll-hide flex-1 min-w-0 flex justify-center overflow-x-auto cursor-grab select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.tabs-scroll-hide::-webkit-scrollbar{display:none;}`}</style>
        {children}
      </div>

      {canRight && (
        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scrollByAmount(1)}
          className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-opacity duration-200 opacity-100 hover:border-[#F97316]/40"
        >
          <ChevronRight size={16} className="text-[#1E293B] dark:text-white" />
        </button>
      )}
    </div>
  );
}