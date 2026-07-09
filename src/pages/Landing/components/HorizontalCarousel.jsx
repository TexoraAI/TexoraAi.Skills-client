import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * HorizontalCarousel
 * ------------------------------------------------------------------
 * Generic, scalable horizontal carousel used for course card rails.
 * - Desktop: 3 cards / Tablet: 2 / Mobile: 1 (never more, never wraps)
 * - Left/right arrow navigation (scrolls by one viewport "page")
 * - Native touch swipe (overflow-x + scroll-snap, momentum on iOS/Android)
 * - Click-and-drag scrolling on desktop (mouse)
 * - Mouse wheel → horizontal scroll when hovering the rail
 * - Scales to 100s of cards without janking: off-screen cards use
 *   `content-visibility:auto` so the browser skips layout/paint work
 *   for anything not near the viewport, instead of unmounting/remounting
 *   (which would fight the browser's native scroll + snap behavior).
 *
 * Props:
 *  - items: array of data
 *  - renderItem: (item, index) => ReactNode  (the card itself)
 *  - getKey: (item, index) => string|number
 *  - ariaLabel: string
 *  - cardMinHeight: number (px) — used as contain-intrinsic-size hint
 */
export default function HorizontalCarousel({
  items = [],
  renderItem,
  getKey,
  ariaLabel = "Course carousel",
  cardMinHeight = 420,
}) {
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(
      el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    );
  };

  useEffect(() => {
    updateArrowState();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateArrowState();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateArrowState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.92, behavior: "smooth" });
  };

  // Convert vertical wheel intent into horizontal scroll on this rail only.
  const onWheel = (e) => {
    const el = trackRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  // Click-and-drag (desktop mouse) scrolling.
  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.pageX;
    dragStartScroll.current = el.scrollLeft;
    el.classList.add("cursor-grabbing");
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.pageX - dragStartX.current;
    el.scrollLeft = dragStartScroll.current - dx;
  };
  const endDrag = () => {
    isDragging.current = false;
    trackRef.current?.classList.remove("cursor-grabbing");
  };

  if (!items.length) return null;

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollByPage(-1)}
        disabled={!canScrollLeft}
        className={`flex absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-200 ${
          canScrollLeft
            ? "opacity-100 hover:scale-110 hover:border-[#F97316]/40 text-[#1E293B] dark:text-white"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft size={16} className="sm:hidden" />
        <ChevronLeft size={20} className="hidden sm:block" />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollByPage(1)}
        disabled={!canScrollRight}
        className={`flex absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-200 ${
          canScrollRight
            ? "opacity-100 hover:scale-110 hover:border-[#F97316]/40 text-[#1E293B] dark:text-white"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight size={16} className="sm:hidden" />
        <ChevronRight size={20} className="hidden sm:block" />
      </button>

      {/* Edge fade masks (desktop) */}
      <div className="hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#F8FAFC] dark:from-black to-transparent" />
      <div className="hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#F8FAFC] dark:from-black to-transparent" />

      <div
        ref={trackRef}
        role="list"
        aria-label={ariaLabel}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        className="carousel-track flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 cursor-grab select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.carousel-track::-webkit-scrollbar{display:none;}`}</style>
        {items.map((item, index) => (
          <div
            key={getKey ? getKey(item, index) : index}
            role="listitem"
            className="carousel-item snap-start shrink-0 basis-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
            style={{
              contentVisibility: "auto",
              containIntrinsicSize: `${cardMinHeight}px`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}