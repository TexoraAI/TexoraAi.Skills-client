// // AllCourses.jsx
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { SearchX } from "lucide-react";
// import { useNavigate } from "react-router-dom";
 
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import AllCoursesSidebar from "../../components/AllCourses/AllCoursesSidebar";
// import CourseSection from "../../components/AllCourses/CourseSection";
// import CourseCard from "../../components/AllCourses/CourseCard";
// import SearchBar from "../../components/AllCourses/SearchBar";
 
// // ⚠️ SINGLE SOURCE OF TRUTH: all course/category data lives in the
// // MegaMenu. This page renders that same data — it does NOT define,
// // duplicate, or hardcode any course lists of its own.
// import { CATEGORIES, COURSE_GROUPS, navigateToCourseItem } from "../../components/MegaMenu";
 
// /* ─────────────────────────────────────────────────────────────────
//    Turn MegaMenu's CATEGORIES into the section list this page renders.
//    The "courses" category (MegaMenu's "All Courses" entry) bundles
//    Product/Design/Growth items together via a `tab` field, so it gets
//    fanned out into three sub-sections here — using the exact same
//    COURSE_GROUPS grouping the MegaMenu itself uses. Every other
//    category (School Boards, Competitive Exams, Career Tracks, ILM ORA
//    Talk, Study Abroad, ILM ORA Gulf, ILM ORA Feature) renders as a
//    single section with its existing items, untouched.
 
//    `parentId` ties each rendered section back to the sidebar category
//    it belongs to, so "courses-product" / "courses-design" /
//    "courses-growth" all report back to the single "courses" sidebar
//    entry for scroll-spy + click-to-scroll.
// ───────────────────────────────────────────────────────────────── */
// function buildSections() {
//   const sections = [];
 
//   CATEGORIES.forEach((cat) => {
//     if (cat.id === "courses") {
//       COURSE_GROUPS.forEach((group) => {
//         const items = cat.items.filter((item) => item.tab === group.key);
//         if (!items.length) return;
//         sections.push({
//           id: `courses-${group.key}`,
//           parentId: cat.id,
//           title: group.label,
//           subtitle: `${group.label} courses`,
//           Icon: group.Icon,
//           courses: items.map((item, idx) => ({
//             id: `courses-${group.key}-${idx}`,
//             name: item.name,
//             desc: item.desc,
//             Icon: item.Icon,
//             route: item.route,
//             tab: item.tab,
//           })),
//         });
//       });
//     } else {
//       sections.push({
//         id: cat.id,
//         parentId: cat.id,
//         title: cat.label,
//         subtitle: cat.description,
//         Icon: cat.Icon,
//         courses: cat.items.map((item, idx) => ({
//           id: `${cat.id}-${idx}`,
//           name: item.name,
//           desc: item.desc,
//           Icon: item.Icon,
//           flagCode: item.flagCode,
//           route: item.route,
//           tab: item.tab,
//         })),
//       });
//     }
//   });
 
//   return sections;
// }
 
// export default function AllCourses({ theme, toggleTheme, setShowLoginModal, embedded = false }) {
//   const isDark = theme === "dark";
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [activeId, setActiveId] = useState(CATEGORIES[0]?.id);
//   const sectionRefs = useRef({});
//   const isClickScrolling = useRef(false);
 
//   const sections = useMemo(buildSections, []);
 
//   // Map every rendered section id back to the sidebar category id
//   // it belongs to (e.g. "courses-product" -> "courses").
//   const sectionToParent = useMemo(() => {
//     const map = {};
//     sections.forEach((s) => { map[s.id] = s.parentId; });
//     return map;
//   }, [sections]);
 
//   // First rendered section for each sidebar category — this is what
//   // we scroll to when a sidebar item is clicked.
//   const firstSectionByParent = useMemo(() => {
//     const map = {};
//     sections.forEach((s) => {
//       if (!(s.parentId in map)) map[s.parentId] = s.id;
//     });
//     return map;
//   }, [sections]);
 
//   /* Scroll-spy: highlight the sidebar item for whichever section is
//      in view, unless the user just clicked a sidebar item (in which
//      case we let the smooth-scroll finish first). */
//   useEffect(() => {
//     if (query) return; // don't scroll-spy while showing search results
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (isClickScrolling.current) return;
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveId(sectionToParent[entry.target.id] ?? entry.target.id);
//           }
//         });
//       },
//       { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
//     );
//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
//     return () => observer.disconnect();
//   }, [query, sectionToParent]);
 
//   const handleSelectCategory = (parentId) => {
//     setQuery("");
//     setActiveId(parentId);
//     isClickScrolling.current = true;
 
//     const targetId = firstSectionByParent[parentId] ?? parentId;
//     sectionRefs.current[targetId]?.scrollIntoView({ behavior: "smooth", block: "start" });
 
//     window.setTimeout(() => {
//       isClickScrolling.current = false;
//     }, 700);
//   };
 
//   /* Footer's nav links call scrollToSection(sectionId, tab) expecting the
//      homepage's "#courses" section. From this page we navigate home first,
//      then let LMSHomepage's existing mm-course-tab listener pick up the tab. */
//   const handleFooterScroll = (sectionId, tab) => {
//     navigate("/");
//     window.setTimeout(() => {
//       if (tab) {
//         window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab } }));
//       }
//       document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 400);
//   };
 
//   /* Clicking a course card reuses the exact same routing behavior as
//      the MegaMenu popup (navigate to route, or jump to the homepage's
//      course tab), instead of re-implementing that logic here. */
//   const handleCourseClick = (course) => navigateToCourseItem(navigate, course);
 
//   /* Flattened + filtered search results across name / category / description */
//   const searchResults = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return null;
//     const results = [];
//     sections.forEach((section) => {
//       section.courses.forEach((course) => {
//         const haystack = `${course.name} ${course.desc || ""} ${section.title}`.toLowerCase();
//         if (haystack.includes(q)) results.push({ ...course, sectionTitle: section.title });
//       });
//     });
//     return results;
//   }, [query, sections]);
 
//   /* ── Custom vertical scrollbar for the AllCourses content panel ──
//      Below 1024px this replaces the native scrollbar entirely: iOS
//      Safari ignores ::-webkit-scrollbar styling on touch-scroll
//      containers, so a themed, always-visible, draggable bar has to be
//      built by hand and synced to scroll position. Native touch swipe
//      scrolling on <main> is left fully intact underneath it. */
//   const mainRef = useRef(null);
//   const vDragRef = useRef(null);
//   const [vThumb, setVThumb] = useState({ top: 0, height: 100, visible: false });
 
//   const updateVThumb = useCallback(() => {
//     const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
//     const scrollHeight = document.documentElement.scrollHeight;
//     const clientHeight = window.innerHeight;
//     if (scrollHeight <= clientHeight + 1) {
//       setVThumb((t) => (t.visible ? { ...t, visible: false } : t));
//       return;
//     }
//     const heightPct = (clientHeight / scrollHeight) * 100;
//     const maxTopPct = 100 - heightPct;
//     const topPct = (scrollTop / (scrollHeight - clientHeight)) * maxTopPct;
//     setVThumb({ top: topPct, height: heightPct, visible: true });
//   }, []);
 
//   useEffect(() => {
//     updateVThumb();
//     window.addEventListener("scroll", updateVThumb, { passive: true });
//     window.addEventListener("resize", updateVThumb);
//     // Content height changes (search filtering, section rendering) also
//     // change how much the *page* can scroll, so watch the main content
//     // element for size changes even though it's no longer the scroller.
//     const el = mainRef.current;
//     const ro = el ? new ResizeObserver(updateVThumb) : null;
//     if (el && ro) ro.observe(el);
//     return () => {
//       window.removeEventListener("scroll", updateVThumb);
//       window.removeEventListener("resize", updateVThumb);
//       if (ro) ro.disconnect();
//     };
//   }, [updateVThumb, sections, searchResults]);
 
//   const handleVThumbPointerDown = (e) => {
//     e.preventDefault();
//     vDragRef.current = {
//       startY: e.clientY,
//       startScrollTop: window.scrollY || document.documentElement.scrollTop || 0,
//       trackHeight: e.currentTarget.parentElement.clientHeight,
//     };
//     window.addEventListener("pointermove", handleVThumbPointerMove);
//     window.addEventListener("pointerup", handleVThumbPointerUp);
//   };
 
//   const handleVThumbPointerMove = (e) => {
//     const state = vDragRef.current;
//     if (!state) return;
//     const scrollHeight = document.documentElement.scrollHeight;
//     const clientHeight = window.innerHeight;
//     const scrollable = scrollHeight - clientHeight;
//     const thumbHeightPx = (clientHeight / scrollHeight) * state.trackHeight;
//     const movablePx = state.trackHeight - thumbHeightPx;
//     if (movablePx <= 0) return;
//     const ratio = scrollable / movablePx;
//     window.scrollTo(0, state.startScrollTop + (e.clientY - state.startY) * ratio);
//   };
 
//   const handleVThumbPointerUp = () => {
//     vDragRef.current = null;
//     window.removeEventListener("pointermove", handleVThumbPointerMove);
//     window.removeEventListener("pointerup", handleVThumbPointerUp);
//   };
 
//   return (
//     <div className={`w-full max-w-full max-lg:overflow-x-hidden ${isDark ? "bg-[#141414]" : "bg-gray-50"}`}>
//       {/* Skip this page's own Navbar when embedded inside /ilm-demo —
//           that shell already has its own navbar right above this. */}
//       {!embedded && (
//         <Navbar theme={theme} toggleTheme={toggleTheme} setShowLoginModal={setShowLoginModal} />
//       )}
 
//       <style>{`
//         .no-scrollbar::-webkit-scrollbar{display:none}
//         .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
 
//         /* Desktop (>=1024px) native scrollbar — unchanged, approved */
//         .ac-scroll{scrollbar-width:thin;scrollbar-color:#F97316 #1F1F1F;}
//         .ac-scroll::-webkit-scrollbar{width:8px;height:0}
//         .ac-scroll::-webkit-scrollbar-track{background:#1F1F1F;border-radius:999px}
//         .ac-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#F97316,#EA580C);border-radius:999px}
//         .ac-scroll::-webkit-scrollbar-thumb:hover{background:#FB923C}
 
//         /* Below 1024px the native bar is hidden — replaced by the custom
//            draggable overlay, since iOS Safari won't theme it anyway */
//         @media (max-width: 1023px) {
//           .ac-scroll{scrollbar-width:none}
//           .ac-scroll::-webkit-scrollbar{width:0;height:0}
//         }
 
//         .ac-track{background:#1F1F1F}
//         .ac-thumb-v,.ac-thumb-h{background:linear-gradient(180deg,#F97316,#EA580C);min-height:24px}
//         .ac-thumb-h{background:linear-gradient(90deg,#F97316,#EA580C);min-width:24px;min-height:0}
//         .ac-thumb-v:hover,.ac-thumb-v:active,.ac-thumb-h:hover,.ac-thumb-h:active{background:#FB923C}
//       `}</style>
 
//       <div className={`${embedded ? "" : "pt-[68px]"} flex flex-col lg:flex-row lg:items-start min-h-screen w-full max-w-full`}>
//         <AllCoursesSidebar
//           categories={CATEGORIES}
//           activeId={activeId}
//           onSelect={handleSelectCategory}
//           theme={theme}
//         />
 
//         <div className="relative flex-1 min-w-0 w-full max-w-full flex flex-col">
//           <main
//             ref={mainRef}
//             className="ac-scroll flex-1 min-w-0 w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8"
//           >
//             {/* Header */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//               <div className="min-w-0">
//                 <h1
//                   className={`text-[26px] sm:text-[30px] font-extrabold tracking-tight ${
//                     isDark ? "text-white" : "text-gray-900"
//                   }`}
//                 >
//                   All Courses
//                 </h1>
//                 <p className={`text-[14px] sm:text-[15px] mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//                   Explore our complete range of courses across all domains and categories.
//                 </p>
//               </div>
//               <SearchBar value={query} onChange={setQuery} theme={theme} className="lg:w-[340px]" />
//             </div>
 
//             {/* Search results view */}
//             {searchResults ? (
//               <section className="min-w-0">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className={`text-[13px] font-extrabold tracking-wider uppercase ${isDark ? "text-white" : "text-gray-900"}`}>
//                     Search Results
//                   </h3>
//                   <span className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//                     {searchResults.length} course{searchResults.length === 1 ? "" : "s"} found
//                   </span>
//                 </div>
 
//                 {searchResults.length === 0 ? (
//                   <div
//                     className={`flex flex-col items-center justify-center text-center py-20 rounded-2xl border ${
//                       isDark ? "border-white/[0.08] text-gray-400" : "border-gray-100 text-gray-500"
//                     }`}
//                   >
//                     <SearchX size={32} className="mb-3 opacity-60" />
//                     <p className="font-semibold">No courses match "{query}"</p>
//                     <p className="text-[13px] mt-1">Try a different course name, category, or keyword.</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
//                     {searchResults.map((course) => (
//                       <CourseCard
//                         key={course.id}
//                         course={course}
//                         theme={theme}
//                         onClick={() => handleCourseClick(course)}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </section>
//             ) : (
//               <div className="flex flex-col gap-10 sm:gap-12 min-w-0">
//                 {sections.map((section) => (
//                   <CourseSection
//                     key={section.id}
//                     section={section}
//                     theme={theme}
//                     sectionRef={(el) => (sectionRefs.current[section.id] = el)}
//                     onViewAll={() => handleSelectCategory(section.parentId)}
//                     onCourseClick={handleCourseClick}
//                   />
//                 ))}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
 
//       {/* Always-visible custom vertical scrollbar — mobile/tablet only.
//           Fixed to the viewport (not an internal container) since the
//           whole page scrolls now; tracks document scroll position.
//           Desktop keeps the native .ac-scroll bar, untouched. */}
//       {vThumb.visible && (
//         <div className="lg:hidden pointer-events-none fixed top-[68px] right-0 bottom-0 w-2 py-1 z-40">
//           <div className="relative w-full h-full rounded-full ac-track pointer-events-auto">
//             <div
//               onPointerDown={handleVThumbPointerDown}
//               className="absolute left-0 w-full rounded-full ac-thumb-v cursor-grab active:cursor-grabbing"
//               style={{ top: `${vThumb.top}%`, height: `${vThumb.height}%` }}
//             />
//           </div>
//         </div>
//       )}
 
//       <Footer scrollToSection={handleFooterScroll} />
//     </div>
//   );
// }old






















// AllCourses.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchX, Star, Users, Clock, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllCoursesSidebar from "../../components/AllCourses/AllCoursesSidebar";
import CourseSection from "../../components/AllCourses/CourseSection";
import CourseCard from "../../components/AllCourses/CourseCard";
import SearchBar from "../../components/AllCourses/SearchBar";
import { courseService } from "../../services/courseService";
 
// ⚠️ Static category shortcuts (School Boards, Study Abroad, etc.) still
// come from the MegaMenu — untouched. Only the "courses" entry now pulls
// REAL data from the backend instead of MegaMenu's static course list.
import { CATEGORIES, navigateToCourseItem } from "../../components/MegaMenu";
 
/* ─────────────────────────────────────────────────────────────────
   Turn MegaMenu's CATEGORIES into the section list this page renders.
   The "courses" category (MegaMenu's "All Courses" entry) bundles
   Product/Design/Growth items together via a `tab` field, so it gets
   fanned out into three sub-sections here — using the exact same
   COURSE_GROUPS grouping the MegaMenu itself uses. Every other
   category (School Boards, Competitive Exams, Career Tracks, ILM ORA
   Talk, Study Abroad, ILM ORA Gulf, ILM ORA Feature) renders as a
   single section with its existing items, untouched.
 
   `parentId` ties each rendered section back to the sidebar category
   it belongs to, so "courses-product" / "courses-design" /
   "courses-growth" all report back to the single "courses" sidebar
   entry for scroll-spy + click-to-scroll.
───────────────────────────────────────────────────────────────── */
function buildSections() {
  const sections = [];
 
  CATEGORIES.forEach((cat) => {
    if (cat.id === "courses") return; // ⬅ real API data used instead — see loadAllCourses()
 
    sections.push({
      id: cat.id,
      parentId: cat.id,
      title: cat.label,
      subtitle: cat.description,
      Icon: cat.Icon,
      courses: cat.items.map((item, idx) => ({
        id: `${cat.id}-${idx}`,
        name: item.name,
        desc: item.desc,
        Icon: item.Icon,
        flagCode: item.flagCode,
        route: item.route,
        tab: item.tab,
      })),
    });
  });
 
  return sections;
}
 
/* ─────────────────────────────────────────────────────────────────
   REAL COURSE CARD — used only for the "All Courses" (real API)
   section. Same compact design as the homepage Featured Programs
   cards. Does not touch CourseCard.jsx (that stays for static
   category tiles like School Boards, Study Abroad, etc).
───────────────────────────────────────────────────────────────── */
function getPricing(price) {
  const current = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
  const original = Math.round((current * 1.35) / 1000) * 1000;
  const discount = original > current ? Math.round(((original - current) / original) * 100) : 0;
  return {
    current: `₹${current.toLocaleString("en-IN")}`,
    original: `₹${original.toLocaleString("en-IN")}`,
    discount,
  };
}
 
function RealCourseCard({ course, onClick }) {
  const pricing = getPricing(course.price);
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-[#F97316]/50 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer w-full h-full"
    >
      <div className="relative h-16 sm:h-20 overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] flex-shrink-0">
        {course.thumbnailUrl || course.bannerUrl ? (
          <img
            src={course.thumbnailUrl || course.bannerUrl}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white/25" strokeWidth={1.25} />
          </div>
        )}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase bg-white/95 text-[#F97316] px-2 py-0.5 rounded-full">
          <Sparkles className="w-2.5 h-2.5" />
          {course.rating >= 4.8 ? "Bestseller" : "Featured"}
        </span>
      </div>
 
      <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-3">
        <h3 className="text-sm font-bold text-[#1E293B] dark:text-white mb-1 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-[#F97316] transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 truncate">
          {course.instructorFull}
        </p>
 
        <div className="grid grid-cols-3 gap-1 text-center mb-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center gap-0.5">
            <Star className="w-3 h-3 text-[#F97316]" />
            <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{course.rating ?? "—"}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Users className="w-3 h-3 text-[#F97316]" />
            <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{course.students ?? "—"}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Clock className="w-3 h-3 text-[#F97316]" />
            <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{course.duration ?? "—"}</span>
          </div>
        </div>
 
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <span className="text-base font-bold text-[#1E293B] dark:text-white">{pricing.current}</span>
          {pricing.discount > 0 && (
            <span className="text-xs text-gray-400 line-through">{pricing.original}</span>
          )}
        </div>
 
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="mt-auto w-full bg-gradient-to-r from-[#F97316] to-[#ea580c] text-white py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
 
function RealCourseSection({ section, onCourseClick, sectionRef }) {
  return (
    <section ref={sectionRef} id={section.id} className="scroll-mt-28 min-w-0">
      <h3 className="text-[13px] font-extrabold tracking-wider uppercase text-[#1E293B] dark:text-white mb-4">
        {section.title}
      </h3>
      {section.courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-gray-100 dark:border-white/[0.08] text-gray-500 dark:text-gray-400">
          <p className="font-semibold">No courses available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {section.courses.map((course) => (
            <RealCourseCard key={course.id} course={course} onClick={() => onCourseClick(course)} />
          ))}
        </div>
      )}
    </section>
  );
}
 
export default function AllCourses({ theme, toggleTheme, setShowLoginModal, embedded = false }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(CATEGORIES[0]?.id);
  const sectionRefs = useRef({});
  const isClickScrolling = useRef(false);
 
  const [realCourseSections, setRealCourseSections] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
 
  /* ── Load ALL real courses from the backend (not just featured) ──
     Falls back to nothing (→ "No courses available") if the API
     returns empty or fails — never falls back to dummy data. */
  useEffect(() => {
    async function loadAllCourses() {
      try {
        const { data } = await courseService.getAllFeaturedPrograms();
        const grouped = {};
        data.forEach((p) => {
          const cat = (p.category || "Other").trim();
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            id: p.id,
            isReal: true,
            title: p.title,
            instructorFull: p.instructorName,
            duration: `${p.durationWeeks} weeks`,
            students: p.studentsEnrolled,
            rating: p.rating,
            level: p.level,
            price: p.price,
            thumbnailUrl: p.thumbnailUrl || "",
            bannerUrl: p.bannerUrl || "",
          });
        });
 
        setRealCourseSections(
          Object.entries(grouped).map(([category, list]) => ({
            id: `courses-${category.toLowerCase().replace(/\s+/g, "-")}`,
            parentId: "courses",
            title: category,
            isRealCourses: true,
            courses: list,
          })),
        );
      } catch (err) {
        console.error("Failed to load all courses", err);
        setRealCourseSections([]); // → renders "No courses available"
      } finally {
        setCoursesLoading(false);
      }
    }
    loadAllCourses();
  }, []);
 
  const staticSections = useMemo(buildSections, []);
  const sections = useMemo(
    () => [...realCourseSections, ...staticSections],
    [realCourseSections, staticSections],
  );
 
  // Map every rendered section id back to the sidebar category id
  // it belongs to (e.g. "courses-product" -> "courses").
  const sectionToParent = useMemo(() => {
    const map = {};
    sections.forEach((s) => { map[s.id] = s.parentId; });
    return map;
  }, [sections]);
 
  // First rendered section for each sidebar category — this is what
  // we scroll to when a sidebar item is clicked.
  const firstSectionByParent = useMemo(() => {
    const map = {};
    sections.forEach((s) => {
      if (!(s.parentId in map)) map[s.parentId] = s.id;
    });
    return map;
  }, [sections]);
 
  /* Scroll-spy: highlight the sidebar item for whichever section is
     in view, unless the user just clicked a sidebar item (in which
     case we let the smooth-scroll finish first). */
  useEffect(() => {
    if (query) return; // don't scroll-spy while showing search results
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(sectionToParent[entry.target.id] ?? entry.target.id);
          }
        });
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [query, sectionToParent]);
 
  const handleSelectCategory = (parentId) => {
    setQuery("");
    setActiveId(parentId);
    isClickScrolling.current = true;
 
    const targetId = firstSectionByParent[parentId] ?? parentId;
    sectionRefs.current[targetId]?.scrollIntoView({ behavior: "smooth", block: "start" });
 
    window.setTimeout(() => {
      isClickScrolling.current = false;
    }, 700);
  };
 
  /* Footer's nav links call scrollToSection(sectionId, tab) expecting the
     homepage's "#courses" section. From this page we navigate home first,
     then let LMSHomepage's existing mm-course-tab listener pick up the tab. */
  const handleFooterScroll = (sectionId, tab) => {
    navigate("/");
    window.setTimeout(() => {
      if (tab) {
        window.dispatchEvent(new CustomEvent("mm-course-tab", { detail: { tab } }));
      }
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };
 
  /* Clicking a course card reuses the exact same routing behavior as
     the MegaMenu popup (navigate to route, or jump to the homepage's
     course tab), instead of re-implementing that logic here. */
  const handleCourseClick = (course) => {
    if (course.isReal) {
      navigate(`/course-details/${course.id}`, { state: { course } });
      return;
    }
    navigateToCourseItem(navigate, course);
  };
 
  /* Flattened + filtered search results across name / category / description */
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const results = [];
    sections.forEach((section) => {
      section.courses.forEach((course) => {
        const haystack = `${course.name} ${course.desc || ""} ${section.title}`.toLowerCase();
        if (haystack.includes(q)) results.push({ ...course, sectionTitle: section.title });
      });
    });
    return results;
  }, [query, sections]);
 
  /* ── Custom vertical scrollbar for the AllCourses content panel ──
     Below 1024px this replaces the native scrollbar entirely: iOS
     Safari ignores ::-webkit-scrollbar styling on touch-scroll
     containers, so a themed, always-visible, draggable bar has to be
     built by hand and synced to scroll position. Native touch swipe
     scrolling on <main> is left fully intact underneath it. */
  const mainRef = useRef(null);
  const vDragRef = useRef(null);
  const [vThumb, setVThumb] = useState({ top: 0, height: 100, visible: false });
 
  const updateVThumb = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    if (scrollHeight <= clientHeight + 1) {
      setVThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    const heightPct = (clientHeight / scrollHeight) * 100;
    const maxTopPct = 100 - heightPct;
    const topPct = (scrollTop / (scrollHeight - clientHeight)) * maxTopPct;
    setVThumb({ top: topPct, height: heightPct, visible: true });
  }, []);
 
  useEffect(() => {
    updateVThumb();
    window.addEventListener("scroll", updateVThumb, { passive: true });
    window.addEventListener("resize", updateVThumb);
    // Content height changes (search filtering, section rendering) also
    // change how much the *page* can scroll, so watch the main content
    // element for size changes even though it's no longer the scroller.
    const el = mainRef.current;
    const ro = el ? new ResizeObserver(updateVThumb) : null;
    if (el && ro) ro.observe(el);
    return () => {
      window.removeEventListener("scroll", updateVThumb);
      window.removeEventListener("resize", updateVThumb);
      if (ro) ro.disconnect();
    };
  }, [updateVThumb, sections, searchResults]);
 
  const handleVThumbPointerDown = (e) => {
    e.preventDefault();
    vDragRef.current = {
      startY: e.clientY,
      startScrollTop: window.scrollY || document.documentElement.scrollTop || 0,
      trackHeight: e.currentTarget.parentElement.clientHeight,
    };
    window.addEventListener("pointermove", handleVThumbPointerMove);
    window.addEventListener("pointerup", handleVThumbPointerUp);
  };
 
  const handleVThumbPointerMove = (e) => {
    const state = vDragRef.current;
    if (!state) return;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const scrollable = scrollHeight - clientHeight;
    const thumbHeightPx = (clientHeight / scrollHeight) * state.trackHeight;
    const movablePx = state.trackHeight - thumbHeightPx;
    if (movablePx <= 0) return;
    const ratio = scrollable / movablePx;
    window.scrollTo(0, state.startScrollTop + (e.clientY - state.startY) * ratio);
  };
 
  const handleVThumbPointerUp = () => {
    vDragRef.current = null;
    window.removeEventListener("pointermove", handleVThumbPointerMove);
    window.removeEventListener("pointerup", handleVThumbPointerUp);
  };
 
  return (
    <div className={`w-full max-w-full max-lg:overflow-x-hidden ${isDark ? "bg-[#141414]" : "bg-gray-50"}`}>
      {/* Skip this page's own Navbar when embedded inside /ilm-demo —
          that shell already has its own navbar right above this. */}
      {!embedded && (
        <Navbar theme={theme} toggleTheme={toggleTheme} setShowLoginModal={setShowLoginModal} />
      )}
 
      <style>{`
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
 
        /* Desktop (>=1024px) native scrollbar — unchanged, approved */
        .ac-scroll{scrollbar-width:thin;scrollbar-color:#F97316 #1F1F1F;}
        .ac-scroll::-webkit-scrollbar{width:8px;height:0}
        .ac-scroll::-webkit-scrollbar-track{background:#1F1F1F;border-radius:999px}
        .ac-scroll::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#F97316,#EA580C);border-radius:999px}
        .ac-scroll::-webkit-scrollbar-thumb:hover{background:#FB923C}
 
        /* Below 1024px the native bar is hidden — replaced by the custom
           draggable overlay, since iOS Safari won't theme it anyway */
        @media (max-width: 1023px) {
          .ac-scroll{scrollbar-width:none}
          .ac-scroll::-webkit-scrollbar{width:0;height:0}
        }
 
        .ac-track{background:#1F1F1F}
        .ac-thumb-v,.ac-thumb-h{background:linear-gradient(180deg,#F97316,#EA580C);min-height:24px}
        .ac-thumb-h{background:linear-gradient(90deg,#F97316,#EA580C);min-width:24px;min-height:0}
        .ac-thumb-v:hover,.ac-thumb-v:active,.ac-thumb-h:hover,.ac-thumb-h:active{background:#FB923C}
      `}</style>
 
      <div className={`${embedded ? "" : "pt-[68px]"} flex flex-col lg:flex-row lg:items-start min-h-screen w-full max-w-full`}>
        <AllCoursesSidebar
          categories={CATEGORIES}
          activeId={activeId}
          onSelect={handleSelectCategory}
          theme={theme}
        />
 
        <div className="relative flex-1 min-w-0 w-full max-w-full flex flex-col">
          <main
            ref={mainRef}
            className="ac-scroll flex-1 min-w-0 w-full max-w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8"
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="min-w-0">
                <h1
                  className={`text-[26px] sm:text-[30px] font-extrabold tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  All Courses
                </h1>
                <p className={`text-[14px] sm:text-[15px] mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Explore our complete range of courses across all domains and categories.
                </p>
              </div>
              <SearchBar value={query} onChange={setQuery} theme={theme} className="lg:w-[340px]" />
            </div>
 
            {/* Search results view */}
            {searchResults ? (
              <section className="min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-[13px] font-extrabold tracking-wider uppercase ${isDark ? "text-white" : "text-gray-900"}`}>
                    Search Results
                  </h3>
                  <span className={`text-[13px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {searchResults.length} course{searchResults.length === 1 ? "" : "s"} found
                  </span>
                </div>
 
                {searchResults.length === 0 ? (
                  <div
                    className={`flex flex-col items-center justify-center text-center py-20 rounded-2xl border ${
                      isDark ? "border-white/[0.08] text-gray-400" : "border-gray-100 text-gray-500"
                    }`}
                  >
                    <SearchX size={32} className="mb-3 opacity-60" />
                    <p className="font-semibold">No courses match "{query}"</p>
                    <p className="text-[13px] mt-1">Try a different course name, category, or keyword.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {searchResults.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        theme={theme}
                        onClick={() => handleCourseClick(course)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <div className="flex flex-col gap-10 sm:gap-12 min-w-0">
                {sections.map((section) =>
                  section.isRealCourses ? (
                    <RealCourseSection
                      key={section.id}
                      section={section}
                      sectionRef={(el) => (sectionRefs.current[section.id] = el)}
                      onCourseClick={handleCourseClick}
                    />
                  ) : (
                    <CourseSection
                      key={section.id}
                      section={section}
                      theme={theme}
                      sectionRef={(el) => (sectionRefs.current[section.id] = el)}
                      onViewAll={() => handleSelectCategory(section.parentId)}
                      onCourseClick={handleCourseClick}
                    />
                  ),
                )}
              </div>
            )}
          </main>
        </div>
      </div>
 
      {/* Always-visible custom vertical scrollbar — mobile/tablet only.
          Fixed to the viewport (not an internal container) since the
          whole page scrolls now; tracks document scroll position.
          Desktop keeps the native .ac-scroll bar, untouched. */}
      {vThumb.visible && (
        <div className="lg:hidden pointer-events-none fixed top-[68px] right-0 bottom-0 w-2 py-1 z-40">
          <div className="relative w-full h-full rounded-full ac-track pointer-events-auto">
            <div
              onPointerDown={handleVThumbPointerDown}
              className="absolute left-0 w-full rounded-full ac-thumb-v cursor-grab active:cursor-grabbing"
              style={{ top: `${vThumb.top}%`, height: `${vThumb.height}%` }}
            />
          </div>
        </div>
      )}
 
      <Footer scrollToSection={handleFooterScroll} />
    </div>
  );
}