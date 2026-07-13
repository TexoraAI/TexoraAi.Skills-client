// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { Play, ChevronLeft, ChevronRight } from "lucide-react";
// import videoService from "../../services/videoService";

// /* ============================================================
//    UNCHANGED LOGIC — video URL parsing, source resolution, and
//    the smart player. Do not touch.
//    ============================================================ */
// function parseVideoUrl(rawUrl) {
//   if (!rawUrl) return null;
//   const url = rawUrl.trim();
//   const ytMatch = url.match(
//     /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
//   );
//   if (ytMatch)
//     return {
//       type: "iframe",
//       url: `https://www.youtube.com/embed/${ytMatch[1]}`,
//     };
//   const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
//   if (vimeoMatch)
//     return {
//       type: "iframe",
//       url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
//     };
//   if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
//     return { type: "video", url };
//   return { type: "iframe", url };
// }

// function getVideoSourceUrl(item) {
//   if (item.videoFileName)
//     return videoService.getWatchNowStreamUrl(item.videoFileName);
//   return item.externalVideoUrl || "";
// }

// function WatchNowSmartPlayer({ item }) {
//   const rawUrl = getVideoSourceUrl(item);
//   if (!rawUrl) return null;

//   if (item.videoFileName) {
//     return (
//       <video
//         src={rawUrl}
//         controls
//         autoPlay
//         playsInline
//         className="w-full h-full rounded-2xl bg-black object-cover"
//       />
//     );
//   }

//   const parsed = parseVideoUrl(rawUrl);
//   if (!parsed) return null;

//   if (parsed.type === "video") {
//     return (
//       <video
//         src={parsed.url}
//         controls
//         autoPlay
//         playsInline
//         className="w-full h-full rounded-2xl bg-black object-cover"
//       />
//     );
//   }

//   const sep = parsed.url.includes("?") ? "&" : "?";
//   return (
//     <iframe
//       src={`${parsed.url}${sep}autoplay=1`}
//       title={item.personName || "WatchNow video"}
//       className="w-full h-full rounded-2xl bg-black"
//       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//       allowFullScreen
//     />
//   );
// }

// /* ============================================================
//    CAROUSEL CONFIG
//    ============================================================ */
// const GAP = 20; // px gap between cards, also used in width math

// /*
//   Breakpoint → visible-card-count map.
//   NOTE: CSS width alone can't perfectly separate "iPad Pro
//   landscape" (~1194–1366px) from "small laptop" (~1200px+) — both
//   live in the same physical pixel range. These thresholds are a
//   practical best-fit for the requested layout. If pixel-perfect
//   device detection is ever required, it needs UA/pointer-type
//   sniffing on top of this.
// */
// function getVisibleCount(width) {
//   if (width >= 1536) return 4; // Large desktop
//   if (width >= 1200) return 4; // Desktop / laptop
//   if (width >= 900) return 3; // iPad Pro / large tablet landscape
//   if (width >= 641) return 2; // iPad Air / iPad Mini / Android tablet
//   return 1; // Phones
// }

// function useVisibleCount() {
//   const [width, setWidth] = useState(
//     typeof window !== "undefined" ? window.innerWidth : 1280,
//   );
//   useEffect(() => {
//     const onResize = () => setWidth(window.innerWidth);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);
//   return { visibleCount: getVisibleCount(width), isMobile: width < 641 };
// }

// /* ============================================================
//    Single carousel card — compact version of the story slide.
//    Play button / video player logic reused as-is.
//    ============================================================ */
// function StoryCard({ item, isPlaying, onPlay }) {
//   return (
//     <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
//       <div className="relative w-full aspect-video bg-black">
//         {isPlaying ? (
//           <WatchNowSmartPlayer item={item} />
//         ) : (
//           <button
//             type="button"
//             onClick={() => onPlay(item.id)}
//             className="group relative w-full h-full block"
//             aria-label={`Play video from ${item.personName}`}
//           >
//             <img
//               src={videoService.getWatchNowStreamUrl(item.thumbnail)}
//               alt={item.personName}
//               className="w-full h-full object-cover"
//               draggable={false}
//             />
//             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
//               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 shadow-lg group-hover:scale-105 transition-transform">
//                 <Play className="w-4 h-4 text-[#7c3aed]" fill="#7c3aed" />
//                 <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
//                   Watch story
//                 </span>
//               </span>
//             </div>
//           </button>
//         )}
//       </div>

//       <div className="flex flex-col flex-1 p-4 sm:p-5">
//         <p className="text-sm sm:text-base font-semibold text-[#1E293B] dark:text-white leading-snug line-clamp-3">
//           "{item.quote}"
//         </p>
//         <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 mt-3">
//           <p className="font-bold text-[#1E293B] dark:text-white text-sm">
//             {item.personName}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//             {item.personRole}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ============================================================
//    Netflix-style circular nav button
//    ============================================================ */
// function NavButton({ direction, onClick, className = "" }) {
//   const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       aria-label={direction === "prev" ? "Previous" : "Next"}
//       className={`group w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all duration-200 hover:bg-[#F97316] hover:border-[#F97316] hover:scale-105 active:scale-95 ${className}`}
//     >
//       <Icon className="w-5 h-5 text-[#1E293B] dark:text-white transition-colors group-hover:text-white" />
//     </button>
//   );
// }

// /* ============================================================
//    Carousel track — infinite loop, autoplay, drag/swipe, keyboard
//    ============================================================ */
// function WatchNowCarousel({ stories }) {
//   const { visibleCount, isMobile } = useVisibleCount();
//   const [playing, setPlaying] = useState({});

//   const containerRef = useRef(null);
//   const trackRef = useRef(null);
//   const autoplayRef = useRef(null);
//   const resumeTimeoutRef = useRef(null);

//   const [containerWidth, setContainerWidth] = useState(0);
//   const [index, setIndex] = useState(0);
//   const [transitionEnabled, setTransitionEnabled] = useState(true);
//   const [dragDelta, setDragDelta] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);

//   const dragState = useRef({
//     dragging: false,
//     startX: 0,
//     startY: 0,
//     axis: null,
//   });

//   const isLooping = stories.length > visibleCount;
//   const clonesCount = isLooping ? visibleCount : 0;

//   const trackItems = useMemo(() => {
//     if (!isLooping) return stories.map((item) => ({ item, key: `${item.id}` }));
//     const head = stories
//       .slice(-clonesCount)
//       .map((item, i) => ({ item, key: `head-${i}-${item.id}` }));
//     const body = stories.map((item) => ({ item, key: `${item.id}` }));
//     const tail = stories
//       .slice(0, clonesCount)
//       .map((item, i) => ({ item, key: `tail-${i}-${item.id}` }));
//     return [...head, ...body, ...tail];
//   }, [stories, isLooping, clonesCount]);

//   // Reset position whenever breakpoint or data changes
//   useEffect(() => {
//     setTransitionEnabled(false);
//     setIndex(isLooping ? clonesCount : 0);
//     const raf = requestAnimationFrame(() => setTransitionEnabled(true));
//     return () => cancelAnimationFrame(raf);
//   }, [isLooping, clonesCount, visibleCount, stories.length]);

//   // Measure container width responsively
//   useLayoutEffect(() => {
//     const el = containerRef.current;
//     if (!el) return;
//     const update = () => setContainerWidth(el.offsetWidth);
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   const cardWidth =
//     containerWidth > 0
//       ? (containerWidth - GAP * (visibleCount - 1)) / visibleCount
//       : 0;
//   const step = cardWidth + GAP;

//   const goNext = useCallback(() => setIndex((i) => i + 1), []);
//   const goPrev = useCallback(() => setIndex((i) => i - 1), []);
//   const goTo = useCallback(
//     (realIdx) => setIndex(clonesCount + realIdx),
//     [clonesCount],
//   );

//   // Autoplay
//   useEffect(() => {
//     if (!isLooping || isHovering || dragState.current.dragging) return;
//     autoplayRef.current = setInterval(goNext, 4000);
//     return () => clearInterval(autoplayRef.current);
//   }, [isLooping, isHovering, goNext, cardWidth]);

//   const pauseAutoplayBriefly = () => {
//     clearInterval(autoplayRef.current);
//     clearTimeout(resumeTimeoutRef.current);
//   };

//   // Seamless loop reset after transition completes
//   const handleTransitionEnd = () => {
//     if (!isLooping) return;
//     if (index >= clonesCount + stories.length) {
//       setTransitionEnabled(false);
//       setIndex(index - stories.length);
//     } else if (index < clonesCount) {
//       setTransitionEnabled(false);
//       setIndex(index + stories.length);
//     }
//   };

//   useEffect(() => {
//     if (!transitionEnabled) {
//       const raf = requestAnimationFrame(() => setTransitionEnabled(true));
//       return () => cancelAnimationFrame(raf);
//     }
//   }, [transitionEnabled]);

//   // Keyboard navigation
//   const handleKeyDown = (e) => {
//     if (!isLooping) return;
//     if (e.key === "ArrowLeft") goPrev();
//     else if (e.key === "ArrowRight") goNext();
//   };

//   // Drag / swipe (pointer events cover mouse + touch)
//   const onPointerDown = (e) => {
//     if (!isLooping) return;
//     dragState.current = {
//       dragging: true,
//       startX: e.clientX,
//       startY: e.clientY,
//       axis: null,
//     };
//     pauseAutoplayBriefly();
//   };

//   const onPointerMove = (e) => {
//     const ds = dragState.current;
//     if (!ds.dragging) return;
//     const dx = e.clientX - ds.startX;
//     const dy = e.clientY - ds.startY;

//     if (ds.axis === null) {
//       if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
//       ds.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
//       if (ds.axis === "y") {
//         ds.dragging = false; // let the page scroll vertically
//         return;
//       }
//     }
//     if (ds.axis === "x") {
//       e.preventDefault();
//       setTransitionEnabled(false);
//       setDragDelta(dx);
//     }
//   };

//   const endDrag = () => {
//     const ds = dragState.current;
//     if (!ds.dragging) return;
//     const threshold = cardWidth * 0.2;
//     if (dragDelta < -threshold) goNext();
//     else if (dragDelta > threshold) goPrev();
//     setDragDelta(0);
//     setTransitionEnabled(true);
//     dragState.current.dragging = false;
//     dragState.current.axis = null;
//     resumeTimeoutRef.current = setTimeout(() => {}, 300);
//   };

//   const handlePlay = (itemId) => {
//     setPlaying((prev) => ({ ...prev, [itemId]: true }));
//   };

//   const translateX = -(index * step) + dragDelta;

//   return (
//     <div
//       ref={containerRef}
//       className="relative"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//       tabIndex={0}
//       role="region"
//       aria-label="Watch Now stories carousel"
//       onKeyDown={handleKeyDown}
//     >
//       <div
//         className="overflow-hidden"
//         style={{ touchAction: "pan-y" }}
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={endDrag}
//         onPointerLeave={endDrag}
//         onPointerCancel={endDrag}
//       >
//         <div
//           ref={trackRef}
//           className="flex select-none cursor-grab active:cursor-grabbing"
//           style={{
//             gap: `${GAP}px`,
//             transform: `translateX(${translateX}px)`,
//             transition: transitionEnabled
//               ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
//               : "none",
//           }}
//           onTransitionEnd={handleTransitionEnd}
//         >
//           {trackItems.map(({ item, key }) => (
//             <div
//               key={key}
//               style={{
//                 width: cardWidth ? `${cardWidth}px` : `${100 / visibleCount}%`,
//                 flexShrink: 0,
//               }}
//             >
//               <StoryCard
//                 item={item}
//                 isPlaying={!!playing[item.id]}
//                 onPlay={handlePlay}
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {isLooping && !isMobile && (
//         <>
//           <NavButton
//             direction="prev"
//             onClick={goPrev}
//             className="absolute -left-5 top-1/2 -translate-y-1/2 hidden sm:flex z-10"
//           />
//           <NavButton
//             direction="next"
//             onClick={goNext}
//             className="absolute -right-5 top-1/2 -translate-y-1/2 hidden sm:flex z-10"
//           />
//         </>
//       )}

//       {isLooping && isMobile && (
//         <div className="flex sm:hidden justify-center items-center gap-4 mt-6">
//           <NavButton direction="prev" onClick={goPrev} />
//           <NavButton direction="next" onClick={goNext} />
//         </div>
//       )}
//     </div>
//   );
// }

// /* ============================================================
//    Section wrapper — data fetching logic unchanged
//    ============================================================ */
// export default function WatchNowSection({ id = "watch-now" }) {
//   const [stories, setStories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let active = true;
//     videoService
//       .getWatchNowPublished()
//       .then(({ data }) => {
//         if (active) setStories(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => console.error("Failed to load WatchNow stories", err))
//       .finally(() => active && setLoading(false));
//     return () => {
//       active = false;
//     };
//   }, []);

//   return (
//     <section
//       id={id}
//       className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
//     >
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
//           <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
//             Watch Now
//           </span>
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
//             Learn Through,{" "}
//             <span className="text-[#F97316]">Expert Sessions</span>
//           </h2>
//           <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
//             Explore live sessions, career guidance, interview preparation,
//             hands-on projects, and expert-led learning designed to help you
//             build real-world skills and grow your career.
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-16">
//             <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-[#F97316] animate-spin" />
//           </div>
//         ) : stories.length === 0 ? (
//           <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
//             No stories published yet — check back soon.
//           </p>
//         ) : (
//           <WatchNowCarousel stories={stories} />
//         )}
//       </div>
//     </section>
//   );
// }



























import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import videoService from "../../services/videoService";
 
/* ============================================================
   UNCHANGED LOGIC — video URL parsing, source resolution, and
   the smart player. Do not touch.
   ============================================================ */
function parseVideoUrl(rawUrl) {
  if (!rawUrl) return null;
  const url = rawUrl.trim();
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/,
  );
  if (ytMatch)
    return {
      type: "iframe",
      url: `https://www.youtube.com/embed/${ytMatch[1]}`,
    };
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch)
    return {
      type: "iframe",
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
    return { type: "video", url };
  return { type: "iframe", url };
}
 
function getVideoSourceUrl(item) {
  if (item.videoFileName)
    return videoService.getWatchNowStreamUrl(item.videoFileName);
  return item.externalVideoUrl || "";
}
 
/*
  WatchNowSmartPlayer lifecycle:
  - This component is only ever mounted while its card is the single
    "active" playing card (see WatchNowCarousel). As soon as the
    parent stops treating this card as active, React unmounts this
    component, which immediately removes the <video>/<iframe> node
    from the DOM — that alone stops a YouTube/Vimeo iframe from
    playing audio, since the browser tears down its embedded
    document.
  - For an uploaded <video>, we additionally pause it and clear its
    source on unmount so playback and buffering stop immediately
    rather than relying only on DOM removal timing.
  - onEnded lets the parent reset its "active" state back to the
    thumbnail once an uploaded video finishes naturally, so we never
    leave a finished player mounted.
*/
function WatchNowSmartPlayer({ item, onEnded }) {
  const rawUrl = getVideoSourceUrl(item);
  const videoRef = useRef(null);
 
  // Explicit destroy-on-unmount for uploaded/direct <video> sources.
  useEffect(() => {
    return () => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.load();
      }
    };
  }, []);
 
  if (!rawUrl) return null;
 
  if (item.videoFileName) {
    return (
      <video
        ref={videoRef}
        src={rawUrl}
        controls
        autoPlay
        playsInline
        onEnded={onEnded}
        className="w-full h-full rounded-2xl bg-black object-cover"
      />
    );
  }
 
  const parsed = parseVideoUrl(rawUrl);
  if (!parsed) return null;
 
  if (parsed.type === "video") {
    return (
      <video
        ref={videoRef}
        src={parsed.url}
        controls
        autoPlay
        playsInline
        onEnded={onEnded}
        className="w-full h-full rounded-2xl bg-black object-cover"
      />
    );
  }
 
  const sep = parsed.url.includes("?") ? "&" : "?";
  return (
    <iframe
      src={`${parsed.url}${sep}autoplay=1`}
      title={item.personName || "WatchNow video"}
      className="w-full h-full rounded-2xl bg-black"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
 
/* ============================================================
   CAROUSEL CONFIG
   ============================================================ */
const GAP = 20; // px gap between cards, also used in width math
 
/*
  Breakpoint → visible-card-count map.
  NOTE: CSS width alone can't perfectly separate "iPad Pro
  landscape" (~1194–1366px) from "small laptop" (~1200px+) — both
  live in the same physical pixel range. These thresholds are a
  practical best-fit for the requested layout. If pixel-perfect
  device detection is ever required, it needs UA/pointer-type
  sniffing on top of this.
*/
function getVisibleCount(width) {
  if (width >= 1536) return 4; // Large desktop
  if (width >= 1200) return 4; // Desktop / laptop
  if (width >= 900) return 3; // iPad Pro / large tablet landscape
  if (width >= 641) return 2; // iPad Air / iPad Mini / Android tablet
  return 1; // Phones
}
 
function useVisibleCount() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { visibleCount: getVisibleCount(width), isMobile: width < 641 };
}
 
/* ============================================================
   Single carousel card — compact version of the story slide.
   Play button / video player logic reused as-is.
   ============================================================ */
function StoryCard({ item, isPlaying, onPlay, onEnded }) {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full aspect-video bg-black">
        {isPlaying ? (
          <WatchNowSmartPlayer item={item} onEnded={onEnded} />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            className="group relative w-full h-full block"
            aria-label={`Play video from ${item.personName}`}
          >
            <img
              src={videoService.getWatchNowStreamUrl(item.thumbnail)}
              alt={item.personName}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-4 h-4 text-[#7c3aed]" fill="#7c3aed" />
                <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
                  Watch story
                </span>
              </span>
            </div>
          </button>
        )}
      </div>
 
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <p className="text-sm sm:text-base font-semibold text-[#1E293B] dark:text-white leading-snug line-clamp-3">
          "{item.quote}"
        </p>
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 mt-3">
          <p className="font-bold text-[#1E293B] dark:text-white text-sm">
            {item.personName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {item.personRole}
          </p>
        </div>
      </div>
    </div>
  );
}
 
/* ============================================================
   Netflix-style circular nav button
   ============================================================ */
function NavButton({ direction, onClick, className = "" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={`group w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all duration-200 hover:bg-[#F97316] hover:border-[#F97316] hover:scale-105 active:scale-95 ${className}`}
    >
      <Icon className="w-5 h-5 text-[#1E293B] dark:text-white transition-colors group-hover:text-white" />
    </button>
  );
}
 
/* ============================================================
   Carousel track — infinite loop, autoplay, drag/swipe, keyboard
   ============================================================ */
function WatchNowCarousel({ stories }) {
  const { visibleCount, isMobile } = useVisibleCount();
  // Single active-player key instead of a per-item map: only one card
  // (identified by its unique trackItems `key`) can ever be "playing"
  // at once. Setting this to null unmounts whichever player is
  // currently mounted, which stops/destroys it (see WatchNowSmartPlayer).
  const [playing, setPlaying] = useState(null);
 
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const autoplayRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
 
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [dragDelta, setDragDelta] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
 
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    axis: null,
  });
 
  const isLooping = stories.length > visibleCount;
  const clonesCount = isLooping ? visibleCount : 0;
 
  const trackItems = useMemo(() => {
    if (!isLooping) return stories.map((item) => ({ item, key: `${item.id}` }));
    const head = stories
      .slice(-clonesCount)
      .map((item, i) => ({ item, key: `head-${i}-${item.id}` }));
    const body = stories.map((item) => ({ item, key: `${item.id}` }));
    const tail = stories
      .slice(0, clonesCount)
      .map((item, i) => ({ item, key: `tail-${i}-${item.id}` }));
    return [...head, ...body, ...tail];
  }, [stories, isLooping, clonesCount]);
 
  // Reset position whenever breakpoint or data changes
  useEffect(() => {
    setTransitionEnabled(false);
    setPlaying(null); // stop/unmount any active player before re-laying-out
    setIndex(isLooping ? clonesCount : 0);
    const raf = requestAnimationFrame(() => setTransitionEnabled(true));
    return () => cancelAnimationFrame(raf);
  }, [isLooping, clonesCount, visibleCount, stories.length]);
 
  // Measure container width responsively
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
 
  const cardWidth =
    containerWidth > 0
      ? (containerWidth - GAP * (visibleCount - 1)) / visibleCount
      : 0;
  const step = cardWidth + GAP;
 
  const goNext = useCallback(() => {
    setPlaying(null); // stop the active player before the slide changes
    setIndex((i) => i + 1);
  }, []);
  const goPrev = useCallback(() => {
    setPlaying(null); // stop the active player before the slide changes
    setIndex((i) => i - 1);
  }, []);
  const goTo = useCallback(
    (realIdx) => {
      setPlaying(null); // dot pagination: stop the active player first
      setIndex(clonesCount + realIdx);
    },
    [clonesCount],
  );
 
  // Autoplay
  useEffect(() => {
    if (!isLooping || isHovering || dragState.current.dragging) return;
    autoplayRef.current = setInterval(goNext, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [isLooping, isHovering, goNext, cardWidth]);
 
  const pauseAutoplayBriefly = () => {
    clearInterval(autoplayRef.current);
    clearTimeout(resumeTimeoutRef.current);
  };
 
  // Seamless loop reset after transition completes
  const handleTransitionEnd = () => {
    if (!isLooping) return;
    if (index >= clonesCount + stories.length) {
      setTransitionEnabled(false);
      setIndex(index - stories.length);
    } else if (index < clonesCount) {
      setTransitionEnabled(false);
      setIndex(index + stories.length);
    }
  };
 
  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);
 
  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isLooping) return;
    if (e.key === "ArrowLeft") goPrev();
    else if (e.key === "ArrowRight") goNext();
  };
 
  // Drag / swipe (pointer events cover mouse + touch)
  const onPointerDown = (e) => {
    if (!isLooping) return;
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      axis: null,
    };
    pauseAutoplayBriefly();
  };
 
  const onPointerMove = (e) => {
    const ds = dragState.current;
    if (!ds.dragging) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
 
    if (ds.axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      ds.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (ds.axis === "y") {
        ds.dragging = false; // let the page scroll vertically
        return;
      }
    }
    if (ds.axis === "x") {
      e.preventDefault();
      setTransitionEnabled(false);
      setDragDelta(dx);
    }
  };
 
  const endDrag = () => {
    const ds = dragState.current;
    if (!ds.dragging) return;
    const threshold = cardWidth * 0.2;
    if (dragDelta < -threshold) goNext();
    else if (dragDelta > threshold) goPrev();
    setDragDelta(0);
    setTransitionEnabled(true);
    dragState.current.dragging = false;
    dragState.current.axis = null;
    resumeTimeoutRef.current = setTimeout(() => {}, 300);
  };
 
  // Keyed by the trackItem's unique `key` (not item.id) so that a
  // looping carousel's head/tail clones of the same story never both
  // report as "playing" — only the exact card instance the user
  // clicked becomes active, and starting it implicitly stops
  // whatever else was playing since `playing` holds a single value.
  const handlePlay = (key) => {
    setPlaying(key);
  };
 
  const resetPlaying = () => setPlaying(null);
 
  const translateX = -(index * step) + dragDelta;
 
  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      role="region"
      aria-label="Watch Now stories carousel"
      onKeyDown={handleKeyDown}
    >
      <div
        className="overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={trackRef}
          className="flex select-none cursor-grab active:cursor-grabbing"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${translateX}px)`,
            transition: transitionEnabled
              ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {trackItems.map(({ item, key }) => (
            <div
              key={key}
              style={{
                width: cardWidth ? `${cardWidth}px` : `${100 / visibleCount}%`,
                flexShrink: 0,
              }}
            >
              <StoryCard
                item={item}
                isPlaying={playing === key}
                onPlay={() => handlePlay(key)}
                onEnded={resetPlaying}
              />
            </div>
          ))}
        </div>
      </div>
 
      {isLooping && !isMobile && (
        <>
          <NavButton
            direction="prev"
            onClick={goPrev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 hidden sm:flex z-10"
          />
          <NavButton
            direction="next"
            onClick={goNext}
            className="absolute -right-5 top-1/2 -translate-y-1/2 hidden sm:flex z-10"
          />
        </>
      )}
 
      {isLooping && isMobile && (
        <div className="flex sm:hidden justify-center items-center gap-4 mt-6">
          <NavButton direction="prev" onClick={goPrev} />
          <NavButton direction="next" onClick={goNext} />
        </div>
      )}
    </div>
  );
}
 
/* ============================================================
   Section wrapper — data fetching logic unchanged
   ============================================================ */
export default function WatchNowSection({ id = "watch-now" }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let active = true;
    videoService
      .getWatchNowPublished()
      .then(({ data }) => {
        if (active) setStories(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load WatchNow stories", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
 
  return (
    <section
      id={id}
      className="py-16 sm:py-20 px-6 scroll-mt-20 bg-white dark:bg-gray-900/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
            Watch Now
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1E293B] dark:text-white">
            Learn Through,{" "}
            <span className="text-[#F97316]">Expert Sessions</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            Explore live sessions, career guidance, interview preparation,
            hands-on projects, and expert-led learning designed to help you
            build real-world skills and grow your career.
          </p>
        </div>
 
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-[#F97316] animate-spin" />
          </div>
        ) : stories.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
            No stories published yet — check back soon.
          </p>
        ) : (
          <WatchNowCarousel stories={stories} />
        )}
      </div>
    </section>
  );
}