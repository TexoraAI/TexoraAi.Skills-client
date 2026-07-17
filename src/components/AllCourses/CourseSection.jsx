// import { ArrowRight } from "lucide-react";
// import CourseCard from "./CourseCard";

// /* ─────────────────────────────────────────────────────────────────
//    COURSE SECTION — eyebrow-badge title, subtitle, "View All" button,
//    and a responsive grid of CourseCards.
// ───────────────────────────────────────────────────────────────── */
// export default function CourseSection({ section, theme, onViewAll, onCourseClick, sectionRef }) {
//   const isDark = theme === "dark";
//   const { Icon, title, subtitle, courses } = section;

//   return (
//     <section ref={sectionRef} id={section.id} className="scroll-mt-28">
//       <div className="flex items-start justify-between gap-4 mb-4">
//         <div className="flex items-start gap-2.5">
//           <span
//             className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
//               isDark ? "bg-[#F97316]/15 text-[#F97316]" : "bg-orange-50 text-[#F97316]"
//             }`}
//           >
//             <Icon size={13} />
//           </span>
//           <div>
//             <h3
//               className={`text-[13px] font-extrabold tracking-wider uppercase ${
//                 isDark ? "text-white" : "text-gray-900"
//               }`}
//             >
//               {title}
//             </h3>
//             <p className={`text-[13px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
//               {subtitle}
//             </p>
//           </div>
//         </div>

//         <button
//           type="button"
//           onClick={() => onViewAll?.(section)}
//           className={`hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors duration-200 flex-shrink-0 ${
//             isDark
//               ? "text-[#F97316] hover:bg-[#F97316]/10"
//               : "text-[#F97316] hover:bg-orange-50"
//           }`}
//         >
//           View All <ArrowRight size={14} />
//         </button>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
//         {courses.map((course) => (
//           <CourseCard
//             key={course.id}
//             course={course}
//             theme={theme}
//             onClick={() => onCourseClick?.(course, section)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }





































// CourseSection.jsx
import { ArrowRight } from "lucide-react";
import CourseCard from "./CourseCard";

/* ─────────────────────────────────────────────────────────────────
   COURSE SECTION — eyebrow-badge title, subtitle, "View All" button,
   and a responsive grid of CourseCards.
───────────────────────────────────────────────────────────────── */
export default function CourseSection({ section, theme, onViewAll, onCourseClick, sectionRef }) {
  const isDark = theme === "dark";
  const { Icon, title, subtitle, courses } = section;

  return (
    <section ref={sectionRef} id={section.id} className="scroll-mt-28 min-w-0">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-2.5 min-w-0">
          <span
            className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
              isDark ? "bg-[#F97316]/15 text-[#F97316]" : "bg-orange-50 text-[#F97316]"
            }`}
          >
            <Icon size={13} />
          </span>
          <div className="min-w-0">
            <h3
              className={`text-[13px] font-extrabold tracking-wider uppercase ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            <p className={`text-[13px] mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onViewAll?.(section)}
          className={`hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors duration-200 flex-shrink-0 ${
            isDark
              ? "text-[#F97316] hover:bg-[#F97316]/10"
              : "text-[#F97316] hover:bg-orange-50"
          }`}
        >
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            theme={theme}
            onClick={() => onCourseClick?.(course, section)}
          />
        ))}
      </div>
    </section>
  );
}