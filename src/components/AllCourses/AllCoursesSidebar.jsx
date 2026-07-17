// /* ─────────────────────────────────────────────────────────────────
//    ALL COURSES SIDEBAR — "Browse Categories" navigation. Each item
//    has an icon, title, subtitle, active state, and hover effect.
//    Clicking an item smooth-scrolls the main panel to that section.

//    Renders as a fixed left rail on desktop/tablet (>=1024px) and
//    collapses into a horizontal, swipeable chip strip on smaller
//    screens so nothing forces horizontal page scroll.
// ───────────────────────────────────────────────────────────────── */
// export default function AllCoursesSidebar({ categories, activeId, onSelect, theme }) {
//   const isDark = theme === "dark";

//   return (
//     <>
//       {/* ── Desktop / tablet rail ── */}
//       <aside
//         className={`hidden lg:flex flex-col w-[260px] flex-shrink-0 h-[calc(100vh-68px)] sticky top-[68px] overflow-y-auto border-r ${
//           isDark
//             ? "bg-[#1F1D1F] border-white/[0.06]"
//             : "bg-[#1F1D1F] border-black/[0.06]"
//         }`}
//       >
//         <div className="px-5 pt-6 pb-3">
//           <span className="text-[11px] font-extrabold tracking-widest uppercase text-gray-500">
//             Browse Categories
//           </span>
//         </div>

//         <nav className="flex-1 px-3 pb-6 flex flex-col gap-1">
//           {categories.map((cat) => {
//             const isActive = activeId === cat.id;
//             const CatIcon = cat.Icon;
//             return (
//               <button
//                 key={cat.id}
//                 type="button"
//                 onClick={() => onSelect(cat.id)}
//                 className={`group relative w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
//                   isActive
//                     ? "bg-[#F97316] text-white shadow-[0_6px_16px_rgba(249,115,22,0.35)]"
//                     : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
//                 }`}
//               >
//                 <span
//                   className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
//                     isActive ? "bg-white/20" : "bg-white/[0.06] group-hover:bg-white/10"
//                   }`}
//                 >
//                   <CatIcon size={16} />
//                 </span>
//                 <span className="min-w-0">
//                   <span className="block text-[13.5px] font-semibold leading-tight truncate">
//                     {cat.label}
//                   </span>
//                   <span
//                     className={`block text-[11px] leading-tight truncate ${
//                       isActive ? "text-white/80" : "text-gray-500"
//                     }`}
//                   >
//                     {cat.description}
//                   </span>
//                 </span>
//               </button>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* ── Mobile / small-tablet horizontal chip strip ── */}
//       <div
//         className={`lg:hidden sticky top-[68px] z-30 border-b overflow-x-auto no-scrollbar ${
//           isDark ? "bg-[#1F1D1F] border-white/[0.06]" : "bg-[#1F1D1F] border-black/[0.06]"
//         }`}
//       >
//         <div className="flex gap-2 px-4 py-3 min-w-max">
//           {categories.map((cat) => {
//             const isActive = activeId === cat.id;
//             const CatIcon = cat.Icon;
//             return (
//               <button
//                 key={cat.id}
//                 type="button"
//                 onClick={() => onSelect(cat.id)}
//                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 border ${
//                   isActive
//                     ? "bg-[#F97316] border-[#F97316] text-white"
//                     : "bg-white/[0.04] border-white/[0.08] text-gray-300 hover:border-[#F97316]/50"
//                 }`}
//               >
//                 <CatIcon size={13} />
//                 {cat.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }


















































// AllCoursesSidebar.jsx
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   ALL COURSES SIDEBAR — "Browse Categories" navigation. Each item
   has an icon, title, subtitle, active state, and hover effect.
   Clicking an item smooth-scrolls the main panel to that section.

   Renders as a fixed left rail on desktop/tablet (>=1024px) and
   collapses into a horizontal, swipeable chip strip on smaller
   screens. Below 1024px the strip carries its own always-visible
   custom (black track / orange gradient thumb) horizontal scrollbar,
   draggable, since iOS Safari ignores ::-webkit-scrollbar styling
   on touch-scroll containers — a real OS scrollbar can't be themed
   there, so this is a JS-driven overlay synced to scroll position.
───────────────────────────────────────────────────────────────── */
export default function AllCoursesSidebar({ categories, activeId, onSelect, theme }) {
  const isDark = theme === "dark";

  const stripRef = useRef(null);
  const dragRef = useRef(null);
  const [hThumb, setHThumb] = useState({ left: 0, width: 100, visible: false });

  const updateHThumb = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth + 1) {
      setHThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    const widthPct = (clientWidth / scrollWidth) * 100;
    const maxLeftPct = 100 - widthPct;
    const leftPct = (scrollLeft / (scrollWidth - clientWidth)) * maxLeftPct;
    setHThumb({ left: leftPct, width: widthPct, visible: true });
  }, []);

  useEffect(() => {
    updateHThumb();
    const el = stripRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(updateHThumb);
    ro.observe(el);
    window.addEventListener("resize", updateHThumb);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHThumb);
    };
  }, [updateHThumb, categories]);

  const handleThumbPointerDown = (e) => {
    const el = stripRef.current;
    if (!el) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      trackWidth: e.currentTarget.parentElement.clientWidth,
    };
    window.addEventListener("pointermove", handleThumbPointerMove);
    window.addEventListener("pointerup", handleThumbPointerUp);
  };

  const handleThumbPointerMove = (e) => {
    const el = stripRef.current;
    const state = dragRef.current;
    if (!el || !state) return;
    const { scrollWidth, clientWidth } = el;
    const scrollable = scrollWidth - clientWidth;
    const thumbWidthPx = (clientWidth / scrollWidth) * state.trackWidth;
    const movablePx = state.trackWidth - thumbWidthPx;
    if (movablePx <= 0) return;
    const ratio = scrollable / movablePx;
    el.scrollLeft = state.startScrollLeft + (e.clientX - state.startX) * ratio;
  };

  const handleThumbPointerUp = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", handleThumbPointerMove);
    window.removeEventListener("pointerup", handleThumbPointerUp);
  };

  return (
    <>
      {/* ── Desktop / tablet rail — unchanged ── */}
      <aside
        className={`hidden lg:flex flex-col w-[260px] flex-shrink-0 h-[calc(100vh-68px)] sticky top-[68px] overflow-y-auto border-r ${
          isDark
            ? "bg-[#1F1D1F] border-white/[0.06]"
            : "bg-[#1F1D1F] border-black/[0.06]"
        }`}
      >
        <div className="px-5 pt-6 pb-3">
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-gray-500">
            Browse Categories
          </span>
        </div>

        <nav className="flex-1 px-3 pb-6 flex flex-col gap-1">
          {categories.map((cat) => {
            const isActive = activeId === cat.id;
            const CatIcon = cat.Icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`group relative w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-[0_6px_16px_rgba(249,115,22,0.35)]"
                    : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    isActive ? "bg-white/20" : "bg-white/[0.06] group-hover:bg-white/10"
                  }`}
                >
                  <CatIcon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-semibold leading-tight truncate">
                    {cat.label}
                  </span>
                  <span
                    className={`block text-[11px] leading-tight truncate ${
                      isActive ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {cat.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Mobile / small-tablet horizontal chip strip ── */}
      <div
        className={`lg:hidden sticky top-[68px] z-30 border-b w-full max-w-full ${
          isDark ? "bg-[#1F1D1F] border-white/[0.06]" : "bg-[#1F1D1F] border-black/[0.06]"
        }`}
      >
        <div
          ref={stripRef}
          onScroll={updateHThumb}
          className="overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar w-full max-w-full"
        >
          <div className="flex gap-2 px-4 py-3 min-w-max">
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              const CatIcon = cat.Icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelect(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-[#F97316] border-[#F97316] text-white"
                      : "bg-white/[0.04] border-white/[0.08] text-gray-300 hover:border-[#F97316]/50"
                  }`}
                >
                  <CatIcon size={13} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Always-visible custom horizontal scrollbar — black track, orange gradient thumb, draggable */}
        {hThumb.visible && (
          <div className="px-3 pb-2 pt-0.5">
            <div className="relative w-full h-[6px] rounded-full ac-track">
              <div
                onPointerDown={handleThumbPointerDown}
                className="absolute top-0 h-full rounded-full ac-thumb-h cursor-grab active:cursor-grabbing"
                style={{ left: `${hThumb.left}%`, width: `${hThumb.width}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}