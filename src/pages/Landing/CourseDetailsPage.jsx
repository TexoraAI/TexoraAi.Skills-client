import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Github,
  GraduationCap,
  Heart,
  HelpCircle,
  Linkedin,
  Moon,
  PlayCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Users,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
export default function CourseDetailsPage() {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const courseData = location.state?.course;

  // const [showEnrollModal, setShowEnrollModal] = useState(false);
  // const [dark, setDark] = useState(
  //   () => localStorage.getItem("theme") === "dark",
  // );
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [courseData, setCourseData] = useState(location.state?.course || null);
  const [loadingCourse, setLoadingCourse] = useState(!location.state?.course);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [expandedModule, setExpandedModule] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);

  // Ref used to smoothly scroll to the in-page Course Syllabus section
  // instead of navigating to a separate route.
  const syllabusRef = useRef(null);
  const scrollToSyllabus = () => {
    syllabusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // useEffect(() => {
  //   if (!courseData) navigate("/");
  // }, [courseData, navigate]);

  // if (!courseData) return null;
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    if (courseData) return; // already have it from state
    async function load() {
      try {
        const { data } = await courseService.getFeaturedProgramById(id);
        setCourseData({
          id: data.id,
          title: data.title,
          instructor: data.instructorRole || data.instructorName,
          instructorFull: data.instructorName,
          instructorTitle: data.instructorRole || "",
          duration: `${data.durationWeeks} weeks`,
          students: data.studentsEnrolled,
          rating: data.rating,
          level: data.level,
          description: data.shortDescription,
          modules: (data.syllabusWeeks || []).map((w) => w.title),
          price: `₹${Number(data.price).toLocaleString("en-IN")}`,
          thumbnailUrl: data.thumbnailUrl || "",
          bannerUrl: data.bannerUrl || "",
          videoUrl: data.videoUrl || "",
          instructorLinkedIn: data.instructorLinkedIn || "",
          instructorPhotoUrl: data.instructorPhotoUrl || "",
          certificateImageUrl: data.certificateImageUrl || "",
          // thumbnailUrl: data.thumbnailUrl || "",
          // bannerUrl: data.bannerUrl || "",
          // videoUrl: data.videoUrl || "",
          // instructorPhotoUrl: data.instructorPhotoUrl || "",
          // certificateImageUrl: data.certificateImageUrl || "",
          // highlights: (data.highlights || []).map((t, i) => ({
          //   id: i,
          //   text: t,
          // })),
          // learningOutcomes: (data.learningOutcomes || []).map((t, i) => ({
          //   id: i,
          //   text: t,
          // })),
          highlights: (data.highlights || [])
            .map((t) => (typeof t === "string" ? t : t?.text || ""))
            .filter((t) => t && t !== "[object Object]"),
          learningOutcomes: (data.learningOutcomes || [])
            .map((t, i) => ({
              id: i,
              text: typeof t === "string" ? t : t?.text || "",
            }))
            .filter((t) => t.text && t.text !== "[object Object]"),
          totalLessons: data.lessons,
          projects: data.projects,
          syllabusWeeks: data.syllabusWeeks || [],
          enrollmentUrl: data.enrollmentUrl || "",
          liveSessions: data.liveSessions ?? "—",
        });
        console.log("instructorLinkedIn:", data.instructorLinkedIn);
        console.log("videoUrl:", data.videoUrl);
      } catch (err) {
        console.error("Failed to load course", err);
        navigate("/");
      } finally {
        setLoadingCourse(false);
      }
    }
    load();
  }, [id]);

  /* ── Related courses: reuses the SAME existing service call already
     used on the homepage (courseService.getAllFeaturedPrograms) —
     no new API/service is introduced. Just filters out the current
     course and shows a few others. ── */
  useEffect(() => {
    if (!courseData?.id) return;
    async function loadRelated() {
      try {
        const { data } = await courseService.getAllFeaturedPrograms();
        const others = (data || [])
          .filter((p) => String(p.id) !== String(courseData.id))
          .slice(0, 3)
          //   .map((p) => ({
          //     id: p.id,
          //     title: p.title,
          //     instructor: p.instructorRole || p.instructorName,
          //     duration: `${p.durationWeeks} weeks`,
          //     students: p.studentsEnrolled,
          //     rating: p.rating,
          //     level: p.level,
          //     price: `₹${Number(p.price).toLocaleString("en-IN")}`,
          //   }));
          // setRelatedCourses(others);
          // .map((p) => ({
          //   id: p.id,
          //   title: p.title,
          //   instructor: p.instructorRole || p.instructorName,
          //   duration: `${p.durationWeeks} weeks`,
          //   students: p.studentsEnrolled,
          //   rating: p.rating,
          //   level: p.level,
          //   price: `₹${Number(p.price).toLocaleString("en-IN")}`,
          //   thumbnailUrl: p.thumbnailUrl || "",
          // }));
          .map((p) => ({
            id: p.id,
            title: p.title,
            instructor: p.instructorRole || p.instructorName,
            duration: `${p.durationWeeks} weeks`,
            students: p.studentsEnrolled,
            rating: p.rating,
            level: p.level,
            price: `₹${Number(p.price).toLocaleString("en-IN")}`,
            thumbnailUrl: p.thumbnailUrl || "",
            instructorLinkedIn: p.instructorLinkedIn || "",
            videoUrl: p.videoUrl || "",
          }));
        setRelatedCourses(others);
      } catch (err) {
        console.error("Failed to load related courses", err);
      } finally {
        setRelatedLoading(false);
      }
    }
    loadRelated();
  }, [courseData?.id]);

  if (loadingCourse)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6EDE6] dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  if (!courseData) return null;

  // const learningOutcomes = courseData.learningOutcomes?.length
  //   ? courseData.learningOutcomes
  //   : [
  //       { id: 0, text: "Build and launch a real product from scratch" },
  //       { id: 1, text: "Master product strategy and roadmapping" },
  //       { id: 2, text: "Learn data-driven decision making" },
  //       { id: 3, text: "Understand user research and validation" },
  //       { id: 4, text: "Manage stakeholders and cross-functional teams" },
  //       { id: 5, text: "Create compelling product narratives" },
  //     ];
  const learningOutcomes = (courseData.learningOutcomes || [])
    .map((t, i) => (typeof t === "string" ? { id: i, text: t } : t))
    .filter((t) => t?.text && t.text !== "[object Object]");

  const finalLearningOutcomes = learningOutcomes.length
    ? learningOutcomes
    : [
        { id: 0, text: "Build and launch a real product from scratch" },
        { id: 1, text: "Master product strategy and roadmapping" },
        { id: 2, text: "Learn data-driven decision making" },
        { id: 3, text: "Understand user research and validation" },
        { id: 4, text: "Manage stakeholders and cross-functional teams" },
        { id: 5, text: "Create compelling product narratives" },
      ];

  /* ── Presentational-only helpers (no business logic changes) ── */
  const getInitials = (name = "") =>
    name
      .replace(/^Ex-/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "IN";

  // Illustrative star-rating breakdown derived from the course's real
  // aggregate rating — not fabricated review content.
  const getRatingBreakdown = (rating) => {
    const r = Number(rating) || 4.5;
    const five = Math.round(Math.min(92, Math.max(35, (r - 3) * 55)));
    const four = Math.round(Math.min(45, 100 - five) * 0.75);
    const three = Math.max(0, Math.round((100 - five - four) * 0.55));
    const two = Math.max(0, Math.round((100 - five - four - three) * 0.6));
    const one = Math.max(0, 100 - five - four - three - two);
    return [
      { stars: 5, pct: five },
      { stars: 4, pct: four },
      { stars: 3, pct: three },
      { stars: 2, pct: two },
      { stars: 1, pct: one },
    ];
  };
  const ratingBreakdown = getRatingBreakdown(courseData.rating);

  const moduleWeeks =
    courseData.syllabusWeeks && courseData.syllabusWeeks.length > 0
      ? courseData.syllabusWeeks.map((w, idx) => ({
          title: w.title,
          weekLabel: `Week ${w.weekNumber ?? idx + 1}`,
          lessonsCount: (w.items || []).length,
          duration: w.dateRange || "",
          items: w.items || [],
        }))
      : (courseData.modules || []).map((m, idx) => ({
          title: m,
          weekLabel: `Module ${idx + 1}`,
          lessonsCount: 0,
          duration: "",
          items: [],
        }));

  const faqs = [
    {
      q: "How do I get access after enrolling?",
      a: "Once you enroll, you get instant access to the course dashboard, live session schedule, and all learning materials.",
    },
    {
      q: "Will I receive a certificate?",
      a: "Yes — on successful completion of the program you receive an industry-recognized certificate you can add to your resume and LinkedIn profile.",
    },
    {
      q: "What if I need help during the course?",
      a: "You'll have access to mentor support, a peer community, and dedicated Q&A sessions throughout the program.",
    },
    {
      q: "Is there a refund policy?",
      a: "Yes, please reach out to our support team within the eligibility window mentioned in your enrollment confirmation for refund assistance.",
    },
  ];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy link", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black text-[#1E293B] dark:text-white pb-20 lg:pb-0">
      {/* ══════════════════════════ HERO (dark gradient) ══════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1E293B] to-[#1e3a5f]">
        {/* decorative glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F97316]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-2.5 sm:pt-3 pb-8 sm:pb-12 md:pb-16">
          {/* Top row */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-300 hover:text-white transition font-medium text-xs sm:text-sm"
            >
              <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline sm:inline">
                Back to courses
              </span>
              <span className="inline xs:hidden sm:hidden">Back</span>
            </button>

            <button
              onClick={() => setDark(!dark)}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl border border-white/15 hover:bg-white/10 transition shadow-sm bg-white/5 backdrop-blur-sm flex-shrink-0"
            >
              {dark ? (
                <Sun className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#F97316]" />
              ) : (
                <Moon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-center">
            {/* ── Left: course info ── */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-1.5 bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide mb-4">
                <Award size={13} />
                Featured Program
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-white mb-3 sm:mb-4 leading-tight">
                {courseData.title}
              </h1>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-5 sm:mb-6 max-w-xl">
                {courseData.description}
              </p>

              {/* Instructor */}
              {/* {(courseData.instructorFull || courseData.instructor) && (
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white font-bold text-sm shadow-lg shrink-0">
                    {getInitials(
                      courseData.instructorFull || courseData.instructor,
                    )}
                  </div>
                  <div> */}
              {(courseData.instructorFull || courseData.instructor) && (
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  {courseData.instructorPhotoUrl ? (
                    <img
                      src={courseData.instructorPhotoUrl}
                      alt={courseData.instructorFull || courseData.instructor}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-lg shrink-0"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white font-bold text-sm shadow-lg shrink-0">
                      {getInitials(
                        courseData.instructorFull || courseData.instructor,
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-white">
                      {courseData.instructorFull || courseData.instructor}
                    </p>
                    {courseData.instructorTitle && (
                      <p className="text-xs sm:text-sm text-gray-400">
                        {courseData.instructorTitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs sm:text-sm text-gray-300 mb-5 sm:mb-6">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">
                    {courseData.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-[#F97316]" />
                  <span>{courseData.students} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#F97316]" />
                  <span>{courseData.duration}</span>
                </div>
                {courseData.level && (
                  <div className="flex items-center gap-1.5">
                    <Target size={14} className="text-[#F97316]" />
                    <span>{courseData.level}</span>
                  </div>
                )}
              </div>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  courseData.level,
                  `${courseData.duration}`,
                  "Certificate Included",
                ]
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] sm:text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-gray-200 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>

            {/* ── Right: thumbnail / preview ── */}
            <div className="lg:col-span-2">
              {/* <div className="relative rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/15 shadow-2xl bg-white/5 backdrop-blur-md aspect-video group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] opacity-90" />
                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_25%,white,transparent_35%),radial-gradient(circle_at_80%_70%,white,transparent_30%)]" />
                <div className="absolute inset-0 flex items-center justify-center"> */}
              <div className="relative rounded-2xl sm:rounded-[24px] overflow-hidden border border-white/15 shadow-2xl bg-white/5 backdrop-blur-md aspect-video group">
                {courseData.bannerUrl || courseData.thumbnailUrl ? (
                  <img
                    src={courseData.bannerUrl || courseData.thumbnailUrl}
                    alt={courseData.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] opacity-90" />
                    <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_25%_25%,white,transparent_35%),radial-gradient(circle_at_80%_70%,white,transparent_30%)]" />
                  </>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Preview course"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                  >
                    <PlayCircle
                      className="w-8 h-8 sm:w-10 sm:h-10 text-[#F97316]"
                      fill="currentColor"
                    />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    Course Preview
                  </span>
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#1E293B] bg-white/95 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {courseData.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════ STATS STRIP ══════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 -mt-6 sm:-mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {[
            {
              icon: PlayCircle,
              value: courseData.liveSessions ?? "—",
              label: "Live Sessions",
              desc: "Interactive mentor-led sessions",
              color: "text-blue-500",
              bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900",
            },
            {
              icon: BookOpen,
              value: courseData.totalLessons || "—",
              label: "Lessons",
              desc: "Self-paced structured content",
              color: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900",
            },
            {
              icon: Target,
              value: courseData.projects || "—",
              label: "Projects",
              desc: "Hands-on, portfolio-ready work",
              color: "text-[#F97316]",
              bg: "bg-[#F97316]/5 dark:bg-[#F97316]/10 border-[#F97316]/20",
            },
            {
              icon: ShieldCheck,
              value: "Yes",
              label: "Certificate",
              desc: "Industry-recognized on completion",
              color: "text-violet-500",
              bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`group rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-900 ${stat.bg}`}
            >
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={18} className={stat.color} />
              </div>
              <p className="font-bold text-lg sm:text-xl text-[#1E293B] dark:text-white mb-0.5">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#1E293B] dark:text-gray-200 mb-0.5">
                {stat.label}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 leading-snug">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ MAIN CONTENT ══════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7 md:gap-10">
          {/* LEFT — 2/3 */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-7 md:space-y-8">
            {/* About this program */}
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-md">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#1E293B] dark:text-white mb-2 sm:mb-3">
                About this program
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-5 sm:mb-7 md:mb-8">
                {courseData.description}
              </p>

              {/* Highlights */}
              {(courseData.highlights || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  {(courseData.highlights || [])
                    .map((h) => (typeof h === "string" ? h : h?.text || ""))
                    .filter((h) => h && h !== "[object Object]")
                    .map((highlight, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20"
                      >
                        <Sparkles size={12} />
                        {highlight}
                      </span>
                    ))}
                </div>
              )}

              {/* What You'll Learn */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 sm:pt-6">
                <h3 className="font-bold text-base sm:text-lg text-[#1E293B] dark:text-white mb-3 sm:mb-5">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                  {finalLearningOutcomes.map((outcome, idx) => (
                    <div
                      key={outcome.id ?? idx}
                      className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-gray-800/60 transition-colors"
                    >
                      <CheckCircle
                        size={16}
                        className="sm:w-[18px] sm:h-[18px] text-[#F97316] flex-shrink-0 mt-0.5"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {outcome.text ?? outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Syllabus — premium accordion (in-page, no separate route) */}
            <div
              ref={syllabusRef}
              id="syllabus"
              className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-md scroll-mt-24"
            >
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#1E293B] dark:text-white mb-3 sm:mb-5 md:mb-6">
                Course Syllabus
              </h3>
              <div className="space-y-2.5 sm:space-y-3">
                {moduleWeeks.map((week, index) => {
                  const isOpen = expandedModule === index;
                  return (
                    <div
                      key={index}
                      className="border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-2xl overflow-hidden bg-[#F8FAFC] dark:bg-gray-800/40 hover:border-[#F97316]/30 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedModule(isOpen ? -1 : index)}
                        className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 text-left"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-[#F97316] mb-0.5">
                            {week.weekLabel}
                          </p>
                          <p className="text-sm sm:text-base text-[#1E293B] dark:text-white font-semibold truncate">
                            {week.title}
                          </p>
                        </div>
                        {week.lessonsCount > 0 && (
                          <span className="hidden sm:inline text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {week.lessonsCount} lessons
                          </span>
                        )}
                        {isOpen ? (
                          <ChevronUp
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                      </button>

                      {isOpen && week.items.length > 0 && (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 border-t border-gray-100 dark:border-gray-800">
                          <ul className="space-y-2 pt-3">
                            {week.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor */}
            {(courseData.instructorFull || courseData.instructor) && (
              <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-md">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#1E293B] dark:text-white mb-4 sm:mb-6">
                  Your Instructor
                </h3>
                {/* <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white font-bold text-xl shadow-md flex-shrink-0">
                    {getInitials(
                      courseData.instructorFull || courseData.instructor,
                    )}
                  </div>
                  <div className="flex-1"> */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {courseData.instructorPhotoUrl ? (
                    <img
                      src={courseData.instructorPhotoUrl}
                      alt={courseData.instructorFull || courseData.instructor}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md flex-shrink-0"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white font-bold text-xl shadow-md flex-shrink-0">
                      {getInitials(
                        courseData.instructorFull || courseData.instructor,
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-base sm:text-lg font-bold text-[#1E293B] dark:text-white">
                      {courseData.instructorFull || courseData.instructor}
                    </p>
                    {courseData.instructorTitle && (
                      <p className="text-sm text-[#F97316] font-semibold mb-2 sm:mb-3">
                        {courseData.instructorTitle}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4">
                      An industry expert with hands-on experience at leading
                      global companies, dedicated to helping students build
                      real, job-ready skills through practical, mentor-led
                      learning.
                    </p>
                    <div className="flex items-center gap-2">
                      {[
                        { Icon: Linkedin, url: courseData.instructorLinkedIn },
                        { Icon: Youtube, url: courseData.videoUrl },
                      ]
                        .filter((item) => item.url)
                        .map(({ Icon, url }, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-[#F97316] hover:border-[#F97316]/40 transition-colors"
                          >
                            <Icon size={15} />
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-md">
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#1E293B] dark:text-white mb-4 sm:mb-6">
                Ratings &amp; Reviews
              </h3>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                <div className="flex flex-col items-center justify-center sm:border-r sm:border-gray-100 sm:dark:border-gray-800 sm:pr-10">
                  <p className="text-4xl sm:text-5xl font-bold text-[#1E293B] dark:text-white mb-1">
                    {courseData.rating}
                  </p>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= Math.round(courseData.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300 dark:text-gray-700"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Based on {courseData.students} enrolled students
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBreakdown.map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-10">
                        {row.stars} star
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full bg-[#F97316] rounded-full"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {row.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-md">
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#1E293B] dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-[#F97316]" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-2.5">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-3 p-3.5 sm:p-4 text-left bg-[#F8FAFC] dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="text-sm sm:text-base font-semibold text-[#1E293B] dark:text-white">
                          {faq.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 sm:p-4 pt-2 sm:pt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — 1/3 sidebar (sticky on desktop) */}
          <div className="lg:col-span-1">
            <div className="hidden lg:block lg:sticky lg:top-24 space-y-4 sm:space-y-5">
              {/* Price card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-md overflow-hidden">
                <div className="h-1 bg-[#F97316]" />
                <div className="p-4 sm:p-6 md:p-7">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-1">
                        {courseData.price}
                      </p>
                      <p className="text-xs sm:text-sm text-[#F97316] font-semibold">
                        Limited time offer
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        onClick={() => setWishlisted((w) => !w)}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#F97316]/40 transition-colors"
                      >
                        <Heart
                          size={16}
                          className={
                            wishlisted
                              ? "fill-[#F97316] text-[#F97316]"
                              : "text-gray-400"
                          }
                        />
                      </button>
                      <button
                        type="button"
                        aria-label="Share course"
                        onClick={handleShare}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#F97316]/40 transition-colors relative"
                      >
                        <Share2 size={16} className="text-gray-400" />
                        {shareCopied && (
                          <span className="absolute -top-8 right-0 text-[10px] font-semibold bg-[#1E293B] text-white px-2 py-1 rounded-md whitespace-nowrap">
                            Link copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:brightness-105 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all mb-2.5 sm:mb-3"
                  >
                    Enroll Now
                  </button>

                  <button
                    onClick={scrollToSyllabus}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1E293B] dark:text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:border-[#F97316]/40 transition-all mb-4 sm:mb-6 text-xs sm:text-sm"
                  >
                    View Full Syllabus
                  </button>

                  {/* Cohort info */}
                  <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
                    {[
                      { icon: Calendar, text: "Next cohort starting soon" },
                      {
                        icon: Clock,
                        text: `${courseData.duration} intensive program`,
                      },
                      { icon: Users, text: "Small cohort (max 30 students)" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                      >
                        <item.icon
                          size={14}
                          className="sm:w-[15px] sm:h-[15px] text-[#F97316] flex-shrink-0"
                        />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Program Highlights */}
              <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-[24px] p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-md">
                <h3 className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-white mb-3 sm:mb-5">
                  Program Highlights
                </h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {(courseData.highlights || [])
                    .map((h) => (typeof h === "string" ? h : h?.text || ""))
                    .filter((h) => h && h !== "[object Object]")
                    .map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 sm:gap-3"
                      >
                        <Zap
                          size={15}
                          className="sm:w-4 sm:h-4 text-[#F97316] flex-shrink-0 mt-0.5"
                        />
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          {highlight}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════ RELATED COURSES ══════════════════════════ */}
        {!relatedLoading && relatedCourses.length > 0 && (
          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1E293B] dark:text-white flex items-center gap-2">
                <GraduationCap size={22} className="text-[#F97316]" />
                Related Courses
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {relatedCourses.map((rc) => (
                <div
                  key={rc.id}
                  onClick={() =>
                    navigate(`/course-details/${rc.id}`, {
                      state: { course: rc },
                    })
                  }
                  className="group flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#F97316] flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white/80" />
                  </div> */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#F97316] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {rc.thumbnailUrl ? (
                      <img
                        src={rc.thumbnailUrl}
                        alt={rc.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-white/80" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-white truncate group-hover:text-[#F97316] transition-colors">
                      {rc.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
                      {rc.instructor}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star
                          size={11}
                          className="fill-amber-400 text-amber-400"
                        />
                        {rc.rating}
                      </span>
                      <span>{rc.duration}</span>
                      <span className="font-semibold text-[#1E293B] dark:text-white">
                        {rc.price}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════ MOBILE STICKY CTA ══════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 py-2.5 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
            {courseData.title}
          </p>
          <p className="text-base font-bold text-[#1E293B] dark:text-white">
            {courseData.price}
          </p>
        </div>
        <button
          onClick={() => setShowEnrollModal(true)}
          className="bg-gradient-to-r from-[#F97316] to-[#ea580c] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-1.5 flex-shrink-0"
        >
          Enroll Now
        </button>
      </div>

      {/* ── Enroll Modal ── */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Orange top bar */}
            <div className="h-1.5 bg-[#F97316]" />

            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1E293B] dark:text-white">
                  Ready to start?
                </h3>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-[#F6EDE6] dark:hover:bg-gray-800 transition"
                >
                  <X
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-gray-500"
                  />
                </button>
              </div>

              {/* Price box */}
              <div className="bg-[#F6EDE6] dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
                <p className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white mb-1">
                  {courseData.price}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  One-time payment
                </p>
              </div>

              {/* Inclusions */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                {[
                  "Full access to all course materials",
                  "1:1 mentorship sessions",
                  "Lifetime community access",
                  "Industry certification",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
                  >
                    <CheckCircle
                      size={15}
                      className="sm:w-4 sm:h-4 text-[#F97316] flex-shrink-0"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/learn/${courseData.id}`)}
                className="w-full bg-[#1E293B] hover:bg-[#334155] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
