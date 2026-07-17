import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import SignupModal from "./SignupModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import SplitText from "../../components/SplitText";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  GraduationCap,
  Heart,
  Lightbulb,
  Quote,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroVideo from "../../assets/hero-1.mp4";
import heroStudent2 from "../../assets/hero-student-2.png";
import heroStudent3 from "../../assets/hero-student-3.png";
import heroStudent from "../../assets/hero-student.png";
import ctaStudent from "../../assets/cta-student.png";
import auth from "../../auth";
import Navbar from "./components/Navbar";
import AnnouncementBanner from "./components/AnnouncementBanner";
import authService from "../../services/authService";
import { courseService } from "../../services/courseService";
import { subscribeNewsletter } from "../../services/notificationService";
import TexoraFloatingWidget from "./components/TexoraFloatingWidget";
import HorizontalCarousel from "./components/HorizontalCarousel";
import CategoryTabScroller from "./components/CategoryTabScroller";
import WatchNowSection from "./components/WatchNow";
import Footer from "./components/Footer";
const GOOGLE_CLIENT_ID =
  "572421778240-akk3kkb4f60ukuv9pcfrpg2ielm09thk.apps.googleusercontent.com";

/* ── Fallback data for the "Top Global Companies" section ──
   Used only while the backend call is loading or if it returns nothing. */
const FALLBACK_TECH_PARTNERS = [
  { src: "/aws.png", name: "AWS", desc: "Amazon Web Services" },
  { src: "/Google.jpg", name: "Google Cloud", desc: "Google Cloud Platform" },
  { src: "/Amazone.jpg", name: "Amazon AWS", desc: "Amazon Web Services" },
  {
    src: "/Micrososft.jpg",
    name: "Microsoft Azure",
    desc: "Microsoft Cloud Platform",
  },
];

const FALLBACK_BIZ_PARTNERS = [
  { src: "/Picture1.jpg", name: "Texora AI", desc: "AI & Digital Solutions" },
  {
    src: "/UFS-Logo.jpg",
    name: "UFS Network",
    desc: "Unified Consultancy Services",
  },
];

const ECOSYSTEM_COLORS = ["blue", "orange", "purple", "green", "rose"];

const FALLBACK_ECOSYSTEM = [
  {
    name: "TORA CX",
    color: "blue",
    desc: "Customer experience platform",
    Icon: null,
    svgPath: (
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    ),
  },
  {
    name: "UNIFIED CRM",
    color: "orange",
    desc: "AI-driven CRM for sales",
    Icon: Users,
  },
  {
    name: "ILM ORA",
    color: "purple",
    desc: "LMS with AI learning paths",
    Icon: GraduationCap,
  },
  {
    name: "INNOVORA AI",
    color: "green",
    desc: "AI-powered innovation suite",
    Icon: Lightbulb,
  },
  {
    name: "TASK ORBIT",
    color: "rose",
    desc: "AI-powered task management",
    Icon: ClipboardList,
  },
];

// MentorTestimonialCarousel — horizontally scrollable testimonial cards with
// arrow navigation + dot pagination. Purely presentational; consumes the
// same `testimonials` array/state already loaded from the backend — no
// data-fetching or business logic here.
// ─────────────────────────────────────────────────────────────────────────────

// Small avatar helper: shows the backend image in a circular frame,
// falls back to initials if there's no image or the image fails to load.
function MentorAvatar({ name, image, size = "w-9 h-9", showBadge = false }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "").charAt(0).toUpperCase();

  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <div
        className={`${size} rounded-full overflow-hidden bg-[#1E293B] dark:bg-[#F97316] flex items-center justify-center text-white font-bold`}
      >
        {image && !imgError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#22C55E] border-2 border-white dark:border-gray-900 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-2.5 h-2.5 sm:w-3 sm:h-3"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

function MentorTestimonialCarousel({ testimonials }) {
  const scrollerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // UI-only: tracks which cards have "Read More" expanded. Does not touch
  // backend data, carousel/scroll logic, or pagination logic below.
  const [expandedCards, setExpandedCards] = useState({});
  const toggleExpanded = (i) =>
    setExpandedCards((prev) => ({ ...prev, [i]: !prev[i] }));

  const scrollToIndex = (index) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.children[index];
    if (card) {
      el.scrollTo({
        left: card.offsetLeft - el.offsetLeft,
        behavior: "smooth",
      });
    }
    setActiveIndex(index);
  };

  const handlePrev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
  const handleNext = () =>
    scrollToIndex(Math.min(activeIndex + 1, testimonials.length - 1));

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    let closest = 0;
    let closestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.scrollLeft - el.offsetLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="w-full">
      <style>{`
        .mentor-scroll::-webkit-scrollbar { display: none; }
        .mentor-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes mentorFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="relative flex items-center gap-3 sm:gap-4 lg:gap-6">
        {/* Prev arrow — outside the card, desktop/tablet */}
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          disabled={activeIndex === 0}
          className="hidden sm:flex flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] group transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-5 h-5 text-[#1E293B] dark:text-white group-hover:text-white transition-colors" />
        </button>

        {/* Scroller */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          style={{ scrollSnapType: "x mandatory" }}
          className="mentor-scroll flex items-stretch overflow-x-auto flex-1 min-w-0 gap-6"
        >
          {testimonials.map((t, i) => {
            const isExpanded = !!expandedCards[i];
            return (
              <div
                key={i}
                style={{ scrollSnapAlign: "start" }}
                className="w-full md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] min-w-0 flex-shrink-0"
              >
                <div
                  className="relative h-full bg-white dark:bg-gray-900 rounded-[22px] border border-[#ECECEC] dark:border-gray-800 shadow-[0_8px_24px_rgba(17,24,39,0.06)] p-7 flex flex-col transition-all duration-300 ease-out hover:shadow-[0_18px_38px_rgba(17,24,39,0.12)] hover:-translate-y-1.5"
                  style={{ animation: "mentorFadeIn 0.4s ease both" }}
                >
                  {/* Quote icon — top-left, solid orange */}
                  <Quote
                    className="w-9 h-9 text-[#F97316] mb-3 flex-shrink-0"
                    fill="currentColor"
                    strokeWidth={0}
                  />

                  {/* Testimonial text */}
                  <p
                    className="text-gray-600 dark:text-gray-300 text-[14px] sm:text-[15px] flex-1"
                    style={{
                      lineHeight: "170%",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: isExpanded ? "unset" : 6,
                      overflow: isExpanded ? "visible" : "hidden",
                    }}
                  >
                    {t.text}
                  </p>

                  {t.text && t.text.length > 160 && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(i)}
                      className="mt-2 text-[13px] font-bold text-[#F97316] hover:underline bg-transparent border-none p-0 cursor-pointer text-left w-fit"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}

                  {/* LinkedIn + date row */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#F1F1F1] dark:border-gray-800 text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1 text-[#0A66C2] font-semibold">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                      >
                        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                      </svg>
                      LinkedIn
                    </span>
                    {t.date && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span>{t.date}</span>
                      </>
                    )}
                  </div>

                  {/* Bottom profile row */}
                  <div className="flex items-center gap-3 mt-4">
                    <MentorAvatar
                      name={t.name}
                      image={t.image}
                      size="w-12 h-12"
                      showBadge
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1E293B] dark:text-white text-sm leading-snug truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug truncate">
                        {t.role}
                      </p>
                      {t.experience && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-snug mt-0.5">
                          {t.experience}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next arrow — outside the card, desktop/tablet */}
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          disabled={activeIndex === testimonials.length - 1}
          className="hidden sm:flex flex-shrink-0 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] items-center justify-center hover:bg-[#F97316] hover:border-[#F97316] group transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-5 h-5 text-[#1E293B] dark:text-white group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Arrows on mobile — sit below the card instead of overlapping it */}
      <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 text-[#1E293B] dark:text-white" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          disabled={activeIndex === testimonials.length - 1}
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-[#1E293B] dark:text-white" />
        </button>
      </div>

      {/* Dot pagination */}
      <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
            style={{
              width: activeIndex === i ? "24px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: activeIndex === i ? "#F97316" : "#CBD5E1",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 300ms ease, background 300ms ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TopCompaniesCarousel({ logos }) {
  const [duration, setDuration] = useState(30);
  const [brokenSrcs, setBrokenSrcs] = useState(new Set());

  // Responsive speed: desktop 30-35s, tablet 25-30s, mobile 20-25s
  useEffect(() => {
    const calcDuration = () => {
      const w = window.innerWidth;
      if (w >= 1024) setDuration(32);
      else if (w >= 768) setDuration(27);
      else setDuration(22);
    };
    calcDuration();
    window.addEventListener("resize", calcDuration);
    return () => window.removeEventListener("resize", calcDuration);
  }, []);

  if (!logos || logos.length === 0) return null;

  // Always duplicate — required for a seamless CSS loop at translate(-50%)
  const infiniteLogos = [...logos, ...logos];

  return (
    <div className="relative max-w-[1400px] mx-auto">
      <style>{`
        @keyframes ilmora-marquee {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-50%,0,0); }
        }
        .ilmora-marquee-track {
          display: flex;
          width: max-content;
          align-items: center;
          animation: ilmora-marquee var(--marquee-duration, 30s) linear infinite;
          will-change: transform;
          transform: translate3d(0,0,0);
        }
        /* Pause on hover — desktop only, matches spec */
        @media (hover: hover) and (pointer: fine) {
          .ilmora-marquee-viewport:hover .ilmora-marquee-track {
            animation-play-state: paused;
          }
        }
      `}</style>

      <div
        className="ilmora-marquee-viewport bg-white dark:bg-[#111827] rounded-[18px] sm:rounded-[20px] lg:rounded-[22px] border border-gray-100 dark:border-white/[0.08] h-[120px] sm:h-[130px] lg:h-[140px] flex items-center overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          "--marquee-duration": `${duration}s`,
        }}
      >
        <div className="ilmora-marquee-track h-full">
          {infiniteLogos
            .filter((logo) => logo?.name || logo?.src)
            .map((logo, i) => {
              const isBroken = logo.src && brokenSrcs.has(logo.src);
              const showImage = Boolean(logo.src) && !isBroken;
              const initials = (logo.name || "?")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex items-center justify-center h-full flex-shrink-0 px-4 sm:px-6 transition-transform duration-300 hover:scale-105"
                  style={{ width: 160 }}
                  title={logo.desc || logo.name}
                >
                  {showImage ? (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      loading="lazy"
                      className="max-h-[45px] sm:max-h-[48px] max-w-full object-contain"
                      onError={() =>
                        setBrokenSrcs((prev) => new Set(prev).add(logo.src))
                      }
                    />
                  ) : (
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1E293B] dark:bg-[#F97316] flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {initials}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
export default function LMSHomepage({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState("product");
  const [featuredPrograms, setFeaturedPrograms] = useState({});
  const [programsLoading, setProgramsLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());

  // ── Mentors (testimonials) — now backend-connected ──
  const [testimonials, setTestimonials] = useState([]);

  // ── Top Global Companies — now backend-connected ──
  const [companyData, setCompanyData] = useState(null);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [showModalPw, setShowModalPw] = useState(false);

  const heroImages = [heroStudent, heroStudent2, heroStudent3];
  const [currentSlide, setCurrentSlide] = useState(-1);
  const carouselTimerRef = useRef(null);

  const navigate = useNavigate();

  const startCarouselTimer = () => {
    clearInterval(carouselTimerRef.current);
    carouselTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === -1) return 0;
        if (prev >= heroImages.length - 1) return -1;
        return prev + 1;
      });
    }, 3500);
  };

  useEffect(() => {
    startCarouselTimer();
    return () => clearInterval(carouselTimerRef.current);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startCarouselTimer();
  };

  /* ── Load real featured programs from the backend (courseService) ──
     Falls back to the static `courses` object below if the API call
     fails or returns no programs in any category. Includes the fuller
     backend field mapping: thumbnails, banners, instructor photos,
     LinkedIn, video URL, and only shows Published programs. */
  useEffect(() => {
    async function loadPrograms() {
      try {
        const { data } = await courseService.getAllFeaturedPrograms();
        const grouped = {};

        data
          .filter((p) => p.publishStatus === "Published") // defensive client-side guard
          .forEach((p) => {
            const cat = (p.category || "Other").trim();

            if (!grouped[cat]) {
              grouped[cat] = [];
            }

            grouped[cat].push({
              id: p.id,
              title: p.title,
              instructor: p.instructorRole || p.instructorName,
              instructorFull: p.instructorName,
              instructorTitle: p.instructorRole || "",
              duration: `${p.durationWeeks} weeks`,
              students: p.studentsEnrolled,
              rating: p.rating,
              level: p.level,
              description: p.shortDescription,
              modules: (p.syllabusWeeks || []).map((w) => w.title),
              price: `₹${Number(p.price).toLocaleString("en-IN")}`,
              thumbnailUrl: p.thumbnailUrl || "",
              bannerUrl: p.bannerUrl || "",
              instructorPhotoUrl: p.instructorPhotoUrl || "",
              instructorLinkedIn: p.instructorLinkedIn || "",
              videoUrl: p.videoUrl || "",
              highlights: (p.highlights || [])
                .map((h) => (typeof h === "string" ? h : h?.text || ""))
                .filter((h) => h && h !== "[object Object]"),
              learningOutcomes: (p.learningOutcomes || [])
                .map((t, i) => ({
                  id: i,
                  text: typeof t === "string" ? t : t?.text || "",
                }))
                .filter((t) => t.text && t.text !== "[object Object]"),
              totalLessons: p.lessons,
              projects: p.projects,
              syllabusWeeks: p.syllabusWeeks || [],
              enrollmentUrl: p.enrollmentUrl || "",
              liveSessions: p.liveSessions ?? "—",
            });
          });

        // Only use API data if we actually got programs
        const hasPrograms = Object.values(grouped).some(
          (arr) => arr.length > 0,
        );
        if (hasPrograms) {
          setFeaturedPrograms(grouped);

          const firstCategory = Object.keys(grouped)[0];

          if (firstCategory) {
            setActiveTab(firstCategory);
          }
        }
        // else featuredPrograms stays empty → fallback to hardcoded courses
      } catch (err) {
        console.error("Failed to load featured programs", err);
      } finally {
        setProgramsLoading(false);
      }
    }
    loadPrograms();
  }, []);

  /* ── Load real mentor feedback (testimonials) from the backend ── */
  useEffect(() => {
    async function loadMentorFeedback() {
      try {
        const { data } = await courseService.getActiveMentorFeedbacks();
        const mapped = data.map((m) => {
          console.log("Feedback:", m.feedbackMessage);

          return {
            name: m.candidateName,
            role: `${m.designation} @ ${m.company}`,
            text: m.feedbackMessage,
            image: m.profileImage || m.image || m.imageUrl || m.photo || null,
          };
        });
        setTestimonials(mapped);
      } catch (err) {
        console.error("Failed to load mentor feedback", err);
      }
    }
    loadMentorFeedback();
  }, []);

  /* ── Load real companies (tech / business partners + product ecosystem) ── */
  useEffect(() => {
    async function loadCompanies() {
      try {
        const { data } = await courseService.getActiveCompanies();
        setCompanyData(data);
      } catch (err) {
        console.error("Failed to load companies", err);
      } finally {
        setCompaniesLoading(false);
      }
    }
    loadCompanies();
  }, []);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLoginModal(false);
    };
    if (showLoginModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLoginModal]);

  useEffect(() => {
    const handler = (e) => {
      const { tab } = e.detail || {};
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("mm-course-tab", handler);
    return () => window.removeEventListener("mm-course-tab", handler);
  }, []);

  const scrollToSection = (sectionId, tabName = null) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (tabName) setActiveTab(tabName);
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      if (tabName) setActiveTab(tabName);
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /* ── Role-based redirect (full role map, incl. SUPER_ADMIN / TENANT_ADMIN) ── */
  const redirectByRole = (role) => {
    switch ((role || "").toUpperCase()) {
      case "SUPER_ADMIN":
        navigate("/superadmin", { replace: true });
        break;
      case "ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "TENANT_ADMIN":
        navigate("/admin", { replace: true });
        break;
      case "BUSINESS":
        navigate("/admin", { replace: true });
        break;
      case "TRAINER":
        navigate("/trainer", { replace: true });
        break;
      default:
        navigate("/student", { replace: true });
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalLoading) return;
    setModalLoading(true);
    try {
      const ok = await auth.login({
        email: modalEmail,
        password: modalPassword,
      });
      if (ok) {
        const role = (auth.getCurrentRole() || "STUDENT").toUpperCase();
        localStorage.setItem("role", role);
        setShowLoginModal(false);
        redirectByRole(role);
      } else {
        alert("Login failed! Check your credentials.");
      }
    } catch (err) {
      alert("Login error: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  /* ── Google Sign-In — full backend-aware flow ──────────────────────────────
     Existing users: backend issues a token + role (+ organizationId) and we
     redirect by role. Brand-new users: we hand off to /complete-profile so
     they can finish signing up. */
  const handleModalGoogle = async (res) => {
    try {
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
      localStorage.removeItem("role");

      const dec = jwtDecode(res.credential);

      const check = await authService.checkGoogleUser({
        idToken: res.credential,
      });

      // ── EXISTING USER ──────────────────────────────────────────
      if (check.isNewUser === false && check.token && check.role) {
        const role = check.role.toUpperCase();
        localStorage.setItem("lms_token", check.token);
        localStorage.setItem("role", role);

        if (check.organizationId) {
          localStorage.setItem("organizationId", check.organizationId);
        } else {
          localStorage.removeItem("organizationId");
        }

        localStorage.setItem(
          "lms_user",
          JSON.stringify({
            name: check.name || dec.name,
            email: check.email || dec.email,
            role: ["TENANT_ADMIN", "ADMIN", "BUSINESS"].includes(role)
              ? "admin"
              : role.toLowerCase(),
            isGoogleUser: true,
            profileCompleted: true,
            organizationId: check.organizationId || null,
          }),
        );
        setShowLoginModal(false);
        redirectByRole(role);
        return;
      }

      // ── BRAND NEW USER ─────────────────────────────────────────
      sessionStorage.setItem("ilmora_google_credential", res.credential);
      setShowLoginModal(false);
      navigate("/complete-profile", {
        replace: true,
        state: {
          name: dec.name,
          email: dec.email,
          googleCredential: res.credential,
          isGoogleUser: true,
          fromGoogleLogin: true,
        },
      });
    } catch (err) {
      // Surface the real backend message — blocked user / inactive org / etc.
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Google login failed. Please try again.";
      alert(message);
    }
  };

  /* ── Hidden subscriber-admin trigger (callable from elsewhere if needed) ── */
  const openNewsletterAdmin = () => {
    document.getElementById("newsletter-admin-trigger")?.click();
  };

  const courses = {
    product: [
      {
        id: 1,
        title: "Product Management Mastery",
        instructor: "Ex-Google PM",
        duration: "8 weeks",
        students: "2,500+",
        rating: 4.9,
        level: "Intermediate",
        description:
          "Master product lifecycle from ideation to launch. Learn roadmapping, prioritization, stakeholder management & metrics that matter.",
        modules: [
          "Discovery & Research",
          "Roadmapping",
          "Prioritization Frameworks",
          "Launch Strategy",
          "Metrics & Analytics",
        ],
        price: "₹49,000",
        highlights: [
          "Live sessions with Google PMs",
          "Real case studies",
          "1:1 mentorship",
          "Job referral support",
        ],
        liveSessions: 5,
        totalLessons: 81,
        projects: 3,
      },
      {
        id: 2,
        title: "Product Analytics",
        instructor: "Ex-Amazon",
        duration: "6 weeks",
        students: "1,800+",
        rating: 4.8,
        level: "Advanced",
        description:
          "Data-driven product decisions. Master A/B testing, cohort analysis, funnel optimization & retention strategies.",
        modules: [
          "SQL for Product Managers",
          "Experimentation",
          "Funnel Analysis",
          "Retention Metrics",
          "Customer Segmentation",
        ],
        price: "₹39,000",
        highlights: [
          "Amazon case studies",
          "Live SQL projects",
          "Advanced Mixpanel",
          "Retention frameworks",
        ],
        liveSessions: 4,
        totalLessons: 60,
        projects: 2,
      },
      {
        id: 3,
        title: "Product Strategy",
        instructor: "Ex-Meta",
        duration: "10 weeks",
        students: "2,100+",
        rating: 4.9,
        level: "Advanced",
        description:
          "Strategic frameworks for product success. Positioning, competitive analysis, growth strategies & portfolio management.",
        modules: [
          "Market Analysis",
          "Competitive Strategy",
          "Growth Playbooks",
          "Portfolio Management",
          "Pricing Strategy",
        ],
        price: "₹59,000",
        highlights: [
          "Meta growth case studies",
          "Strategy templates",
          "Live workshops",
          "Executive simulations",
        ],
        liveSessions: 6,
        totalLessons: 90,
        projects: 4,
      },
    ],
    design: [
      {
        id: 4,
        title: "UI/UX Design Bootcamp",
        instructor: "Ex-Airbnb Designer",
        duration: "12 weeks",
        students: "3,200+",
        rating: 5.0,
        level: "Beginner",
        description:
          "Complete UI/UX journey from research to prototype. Figma mastery, design systems & portfolio projects.",
        modules: [
          "User Research",
          "Wireframing",
          "Prototyping",
          "Design Systems",
          "Portfolio Building",
        ],
        price: "₹69,000",
        highlights: [
          "Airbnb case studies",
          "Figma certification",
          "Live design reviews",
          "Job ready portfolio",
        ],
        liveSessions: 8,
        totalLessons: 110,
        projects: 5,
      },
      {
        id: 5,
        title: "Design Systems",
        instructor: "Ex-Netflix",
        duration: "8 weeks",
        students: "1,500+",
        rating: 4.8,
        level: "Advanced",
        description:
          "Build scalable design systems like Netflix. Components, tokens, documentation & developer handoff.",
        modules: [
          "Component Libraries",
          "Design Tokens",
          "Documentation",
          "Dev Handoff",
          "Scale Patterns",
        ],
        price: "₹45,000",
        highlights: [
          "Netflix system breakdown",
          "Figma + Storybook",
          "Live system audits",
          "Enterprise patterns",
        ],
        liveSessions: 4,
        totalLessons: 70,
        projects: 3,
      },
      {
        id: 6,
        title: "User Research Pro",
        instructor: "Ex-Microsoft",
        duration: "6 weeks",
        students: "1,900+",
        rating: 4.7,
        level: "Intermediate",
        description:
          "Research methods that drive product decisions. Interviews, surveys, usability testing & synthesis.",
        modules: [
          "Interview Techniques",
          "Survey Design",
          "Usability Testing",
          "Synthesis Methods",
          "Stakeholder Reports",
        ],
        price: "₹35,000",
        highlights: [
          "Microsoft research frameworks",
          "Live user testing",
          "Report templates",
          "Stakeholder presentations",
        ],
        liveSessions: 3,
        totalLessons: 55,
        projects: 2,
      },
    ],
    growth: [
      {
        id: 7,
        title: "Growth Marketing",
        instructor: "Ex-Uber Growth",
        duration: "8 weeks",
        students: "2,800+",
        rating: 4.9,
        level: "Intermediate",
        description:
          "Growth loops, viral mechanics & acquisition strategies that scale businesses.",
        modules: [
          "Growth Frameworks",
          "Viral Loops",
          "Acquisition Channels",
          "Experimentation",
          "Scaling",
        ],
        price: "₹49,000",
        highlights: [
          "Uber growth case studies",
          "Live experiments",
          "Channel deep dives",
          "Scaling frameworks",
        ],
        liveSessions: 5,
        totalLessons: 75,
        projects: 3,
      },
      {
        id: 8,
        title: "SEO & Content Strategy",
        instructor: "Ex-Spotify",
        duration: "10 weeks",
        students: "2,300+",
        rating: 4.8,
        level: "Intermediate",
        description:
          "Organic growth mastery. Technical SEO, content systems & link building at scale.",
        modules: [
          "Technical SEO",
          "Content Systems",
          "Link Building",
          "Analytics",
          "Scaling Organic",
        ],
        price: "₹55,000",
        highlights: [
          "Spotify SEO case studies",
          "Live audits",
          "Content calendars",
          "Enterprise SEO",
        ],
        liveSessions: 5,
        totalLessons: 85,
        projects: 3,
      },
      {
        id: 9,
        title: "Performance Marketing",
        instructor: "Ex-Swiggy",
        duration: "8 weeks",
        students: "2,600+",
        rating: 4.9,
        level: "Advanced",
        description:
          "Paid acquisition at scale. Facebook, Google, creative testing & LTV optimization.",
        modules: [
          "Facebook Ads",
          "Google Ads",
          "Creative Strategy",
          "LTV Optimization",
          "Scaling",
        ],
        price: "₹47,000",
        highlights: [
          "Swiggy ad case studies",
          "Live campaign builds",
          "Creative testing",
          "ROAS frameworks",
        ],
        liveSessions: 5,
        totalLessons: 72,
        projects: 4,
      },
    ],
  };

  const features = [
    {
      icon: Target,
      title: "Project-Based Learning",
      description: "Build real-world projects that showcase your skills",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Learn from professionals at top tech companies",
    },
    {
      icon: Trophy,
      title: "Career Support",
      description: "Get help with resumes, interviews & job referrals",
    },
    {
      icon: Zap,
      title: "Live Sessions",
      description: "Interactive workshops with industry experts",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Learners" },
    { value: "95%", label: "Success Rate" },
    { value: "100+", label: "Expert Mentors" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const mentorBenefits = [
    { icon: Award, text: "1:1 mentorship and small cohort learning" },
    { icon: TrendingUp, text: "Project reviews with detailed feedback" },
    { icon: Users, text: "Peer community for accountability and networking" },
  ];

  const careerSupport = [
    {
      icon: Target,
      title: "Portfolio Support",
      description: "Turn your projects into case studies hiring managers love",
    },
    {
      icon: Award,
      title: "Interview Prep",
      description:
        "Mock interviews, feedback and guidance on role expectations",
    },
    {
      icon: Users,
      title: "Referrals & Network",
      description: "Warm intros to hiring teams and community-led referrals",
    },
  ];

  const getLevelColor = (level) =>
    ({
      Beginner:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Intermediate: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20",
      Advanced:
        "bg-[#1E293B]/10 text-[#1E293B] dark:bg-white/10 dark:text-white border border-[#1E293B]/20 dark:border-white/20",
    })[level] || "bg-gray-100 text-gray-700";

  /* ── Presentational-only helpers for the redesigned course cards ──
     These do not touch any API/data-fetching logic — they simply
     derive display values (initials, strike-through price, discount
     badge) from the existing course fields. */
  const getInitials = (name = "") =>
    name
      .replace(/^Ex-/i, "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "IN";

  const getPricing = (price) => {
    const current = parseInt(String(price).replace(/[^\d]/g, ""), 10) || 0;
    const original = Math.round((current * 1.35) / 1000) * 1000;
    const discount =
      original > current
        ? Math.round(((original - current) / original) * 100)
        : 0;
    return {
      current: `₹${current.toLocaleString("en-IN")}`,
      original: `₹${original.toLocaleString("en-IN")}`,
      discount,
    };
  };

  const toggleWishlist = async (id) => {
    // Not logged in → don't call the API, just prompt login
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Optimistic UI update
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

    try {
      const { data } = await courseService.toggleWishlist(id);
      // Reconcile with server truth
      setWishlist((prev) => {
        const next = new Set(prev);
        if (data.wishlisted) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (err) {
      // Roll back the optimistic update on failure
      setWishlist((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
      if (err?.response?.status === 401) {
        setShowLoginModal(true);
      } else {
        console.error("Wishlist toggle failed", err);
      }
    }
  };

  // Adjust this to match whatever base URL the rest of courseService already
  // uses for uploaded files (check courseService.js for an existing constant
  // before hardcoding this — do not guess blindly in production).
  const API_BASE_URL =
    courseService.API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "";

  const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

  const resolveImageUrl = (raw) => {
    if (!isNonEmptyString(raw)) return "";
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
      return trimmed; // already absolute
    }
    const base = API_BASE_URL.replace(/\/$/, "");
    return `${base}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`; // relative → prepend base
  };

  const mapCompany = (c) => {
    const rawSrc =
      c.uploadedLogo ||
      c.logoUrl ||
      c.logo ||
      c.image ||
      c.imageUrl ||
      c.logoPath ||
      c.fileUrl ||
      c.thumbnail ||
      c.icon ||
      c.imageURL ||
      c.companyLogo ||
      c.logoImage ||
      c.picture ||
      c.photo ||
      c.mediaUrl ||
      c.assetUrl ||
      "";

    const name = c.name || c.companyName || c.title || "";
    const finalSrc = resolveImageUrl(rawSrc);

    console.log("DEBUG company logo mapping →", {
      name,
      logo: c.logo,
      logoUrl: c.logoUrl,
      finalImageSource: finalSrc,
    });

    return {
      src: finalSrc,
      name,
      desc: c.description || c.desc || c.about || "",
    };
  };

  const findCategory = (data, ...aliases) => {
    if (!data || typeof data !== "object") return [];
    const keys = Object.keys(data);
    const normalize = (s) => s.toLowerCase().replace(/[\s_-]/g, "");

    // Pass 1: exact match
    for (const alias of aliases) {
      const target = normalize(alias);
      const foundKey = keys.find((k) => normalize(k) === target);
      if (foundKey && Array.isArray(data[foundKey])) return data[foundKey];
    }

    // Pass 2: fuzzy — key contains the alias, or alias contains the key
    for (const alias of aliases) {
      const target = normalize(alias);
      const foundKey = keys.find((k) => {
        const nk = normalize(k);
        return (
          Array.isArray(data[k]) && (nk.includes(target) || target.includes(nk))
        );
      });
      if (foundKey) return data[foundKey];
    }

    return [];
  };

  const techPartnersRaw = findCategory(
    companyData,
    "Technology Partner",
    "Technology Partners",
    "Tech Partner",
    "Tech Partners",
    "technology",
    "techPartner",
    "techPartners",
  );
  const bizPartnersRaw = findCategory(
    companyData,
    "Business Partner",
    "Business Partners",
    "business",
    "businessPartner",
    "businessPartners",
    "Partner Business",
  );
  const ecosystemRaw = findCategory(
    companyData,
    "Texora Product Ecosystem",
    "Texora Products Ecosystem",
    "Product Ecosystem",
    "Texora Product",
    "Texora Products",
    "Ecosystem",
    "products",
    "texoraProducts",
  );

  const techPartners = techPartnersRaw
    .map(mapCompany)
    .filter((c) => c.src || c.name);
  const bizPartners = bizPartnersRaw
    .map(mapCompany)
    .filter((c) => c.src || c.name);

  const ECOSYSTEM_COLOR_CLASSES = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-[#F97316] border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const ecosystemProducts = ecosystemRaw.length
    ? ecosystemRaw.map((c, i) => ({
        ...mapCompany(c),
        color: ECOSYSTEM_COLORS[i % ECOSYSTEM_COLORS.length],
      }))
    : null;

  return (
    <div className="min-h-screen bg-[#F6EDE6] dark:bg-black text-[#1E293B] dark:text-white">
      {/* ── Announcement Banner & Navbar ── */}
      <AnnouncementBanner />
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        setShowLoginModal={setShowLoginModal}
      />

      {/* ── Hero ── */}
      <section className="pt-32 pb-24 px-6 bg-[#F6EDE6] dark:bg-black relative overflow-hidden">
        <div className="absolute -top-32 left-[10%] w-[600px] h-[600px] bg-[#F97316]/8 dark:bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 right-[5%] w-[500px] h-[500px] bg-[#1E293B]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-8 inline-flex">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#F97316] text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Learn Smarter. Grow Faster. Lead the Future.
              </div>
            </div>
            <h1 className="mb-6 leading-[1.1]">
              <SplitText
                text="Empower Your"
                className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#1E293B] dark:text-white"
                splitType="chars"
                delay={60}
                duration={0.6}
              />
              <SplitText
                text="Learning Journey"
                className="block text-4xl md:text-5xl lg:text-7xl font-bold text-[#F97316]"
                splitType="chars"
                delay={60}
                duration={0.6}
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl leading-relaxed">
              Master in-demand skills through AI-powered learning, live
              sessions, certifications, and expert-led programs designed for
              students, professionals, trainers, and organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start"></div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
              style={{ aspectRatio: "4/3" }}
            >
              <video
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                style={{
                  opacity: currentSlide === -1 ? 1 : 0,
                  transform: currentSlide === -1 ? "scale(1)" : "scale(0.96)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                  zIndex: currentSlide === -1 ? 2 : 1,
                  pointerEvents: currentSlide === -1 ? "auto" : "none",
                }}
              />
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Hero Student ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform:
                      currentSlide === index ? "scale(1)" : "scale(0.96)",
                    transition: "opacity 0.6s ease, transform 0.6s ease",
                    zIndex: currentSlide === index ? 2 : 1,
                    pointerEvents: currentSlide === index ? "auto" : "none",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => goToSlide(-1)}
                aria-label="Show video"
                style={{
                  width: currentSlide === -1 ? "28px" : "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  background: currentSlide === -1 ? "#22c55e" : "#CBD5E1",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.35s ease, background 0.35s ease",
                }}
              />
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    width: currentSlide === index ? "28px" : "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    background: currentSlide === index ? "#F97316" : "#CBD5E1",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.35s ease, background 0.35s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section
        id="courses"
        className="py-12 sm:py-16 scroll-mt-20 bg-[#F8FAFC] dark:bg-black"
      >
        <div className="max-w-[1440px] mx-auto px-6">
          {/* ── Premium Section Header ── */}
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Handpicked for you
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 tracking-tight text-[#1E293B] dark:text-white">
              Featured <span className="text-[#F97316]">Programs</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose your path and start building skills that matter — taught by
              mentors who've shipped at the world's best companies.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* ── Category Tabs: compact carousel, scales to 10/20/50+ categories
                 without ever wrapping to multiple rows. Arrows + drag + wheel
                 + native swipe, active tab always auto-scrolled into view. ── */}
            <div className="mb-6 sm:mb-8 mx-auto w-fit max-w-full sm:max-w-3xl px-1 sm:px-0">
              <div className="h-[42px] flex items-center px-1 sm:px-1.5 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-none overflow-hidden">
                <CategoryTabScroller activeKey={activeTab}>
                  <TabsList className="flex w-max items-center justify-center gap-1.5 bg-transparent mx-auto h-full">
                    {Object.keys(
                      programsLoading
                        ? courses
                        : featuredPrograms &&
                            Object.values(featuredPrograms).some(
                              (a) => a.length > 0,
                            )
                          ? featuredPrograms
                          : courses,
                    ).map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="rounded-full capitalize font-semibold text-xs sm:text-sm whitespace-nowrap px-3.5 sm:px-5 h-[34px] flex-shrink-0 flex items-center text-[#1E293B] dark:text-gray-300 transition-all duration-300 ease-out data-[state=active]:bg-[#F97316] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30"
                      >
                        {tab}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CategoryTabScroller>
              </div>
            </div>

            {/* Real featured programs from the backend (with hardcoded
               `courses` as the fallback while loading or if the API
               returns nothing). */}
            {Object.entries(
              programsLoading
                ? courses
                : featuredPrograms &&
                    Object.values(featuredPrograms).some((a) => a.length > 0)
                  ? featuredPrograms
                  : courses,
            ).map(([category, categoryCourses]) => (
              <TabsContent key={category} value={category}>
                <HorizontalCarousel
                  items={categoryCourses}
                  ariaLabel={`${category} courses`}
                  getKey={(course) => course.id}
                  cardMinHeight={300}
                  renderItem={(course, idx) => {
                    const pricing = getPricing(course.price);
                    const isBestseller = course.rating >= 4.8;
                    const lessons =
                      course.totalLessons || course.modules?.length || 0;
                    const isWishlisted = wishlist.has(course.id);

                    return (
                      <div
                        onClick={() =>
                          navigate(`/course-details/${course.id}`, {
                            state: { course },
                          })
                        }
                        className="group relative flex flex-col min-w-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:shadow-slate-300/40 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden cursor-pointer w-full h-full"
                      >
                        {/* ── Thumbnail / Banner ── */}
                        <div className="relative h-16 sm:h-20 overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#F97316] flex-shrink-0">
                          {course.thumbnailUrl || course.bannerUrl ? (
                            <img
                              src={course.thumbnailUrl || course.bannerUrl}
                              alt={course.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
                              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
                                <GraduationCap
                                  className="w-8 h-8 sm:w-10 sm:h-10 text-white/25"
                                  strokeWidth={1.25}
                                />
                              </div>
                            </>
                          )}

                          {/* Top badges */}
                          <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide bg-white/95 text-[#F97316] px-2 py-0.5 rounded-full shadow-sm">
                              <Sparkles className="w-2.5 h-2.5" />
                              {isBestseller ? "Bestseller" : "Featured"}
                            </span>

                            <button
                              type="button"
                              aria-label={
                                isWishlisted
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(course.id);
                              }}
                              className="flex items-center justify-center w-7 h-7 rounded-full bg-white/95 shadow-sm hover:scale-110 active:scale-95 transition-transform duration-200"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 transition-colors ${
                                  isWishlisted
                                    ? "fill-[#F97316] text-[#F97316]"
                                    : "text-[#1E293B]"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Difficulty badge */}
                          <div className="absolute bottom-2 left-2 right-2 max-w-[70%]">
                            <span
                              className={`inline-block max-w-full truncate align-bottom text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${getLevelColor(course.level)} bg-white/95 dark:bg-white/95`}
                            >
                              {course.level}
                            </span>
                          </div>
                        </div>

                        {/* ── Body ── */}
                        <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-3 pt-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#F97316] mb-1 truncate">
                            {category}
                          </span>

                          <h3 className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-white mb-1 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-[#F97316] transition-colors">
                            {course.title}
                          </h3>

                          {/* Instructor */}
                          <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
                            {course.instructorPhotoUrl ? (
                              <img
                                src={course.instructorPhotoUrl}
                                alt={course.instructorFull || course.instructor}
                                className="w-6 h-6 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white text-[9px] font-bold shrink-0">
                                {getInitials(
                                  course.instructorFull || course.instructor,
                                )}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-[#1E293B] dark:text-white truncate">
                                {course.instructorFull || course.instructor}
                              </p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {course.instructorTitle || course.instructor}
                              </p>
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 leading-relaxed line-clamp-2 min-h-[2.2em]">
                            {course.description}
                          </p>

                          {/* Skill chips */}
                          <div className="flex flex-wrap gap-1 mb-1.5 overflow-hidden max-h-[24px]">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/15 whitespace-nowrap flex-shrink-0 truncate max-w-[120px]">
                              {category}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1E293B]/5 text-[#1E293B] dark:bg-white/10 dark:text-gray-200 border border-[#1E293B]/10 dark:border-white/10 whitespace-nowrap flex-shrink-0">
                              {course.level}
                            </span>
                            {course.liveSessions !== undefined &&
                              course.liveSessions !== "—" && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
                                  {course.liveSessions} Live
                                </span>
                              )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-1 text-center mb-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Star className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.rating ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Users className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.students ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <Clock className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {course.duration ?? "—"}
                              </span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5 min-w-0">
                              <PlayCircle className="w-3 h-3 text-[#F97316] flex-shrink-0" />
                              <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 truncate w-full">
                                {lessons ?? "—"}
                              </span>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="flex items-end justify-between mb-1.5 gap-2">
                            <div className="flex items-baseline gap-1.5 min-w-0 flex-shrink">
                              <span className="text-base sm:text-lg font-bold text-[#1E293B] dark:text-white truncate">
                                {pricing.current ?? "—"}
                              </span>
                              {pricing.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through truncate">
                                  {pricing.original}
                                </span>
                              )}
                            </div>
                            {pricing.discount > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 whitespace-nowrap flex-shrink-0">
                                {pricing.discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* CTA */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course-details/${course.id}`, {
                                state: { course },
                              });
                            }}
                            className="mt-auto w-full flex-shrink-0 bg-gradient-to-r from-[#F97316] to-[#ea580c] hover:brightness-105 text-white py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:scale-[1.02] shadow-sm shadow-orange-500/20"
                          >
                            View Details
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    );
                  }}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#F6EDE6] dark:bg-gray-900 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#F97316] mb-2">
                {stat.value}
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* ── WatchNow ── */}
      <WatchNowSection />

      {/* ── Mentors (testimonials — backend-connected) ── */}
      <section
        id="mentors"
        className="py-[60px] sm:py-[80px] lg:py-[90px] xl:py-[100px] px-4 sm:px-6 scroll-mt-20 bg-[#FAF6F2] dark:bg-gray-900/30 overflow-x-hidden"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[900px] lg:max-w-none mx-auto mb-10 sm:mb-10 lg:mb-10">
            <h2 className="text-[32px] sm:text-[40px] md:text-[44px] lg:text-[52px] xl:text-[56px] font-bold mb-3 sm:mb-4 text-[#111827] dark:text-white leading-[1.15] lg:whitespace-nowrap">
              What Our{" "}
              <span className="text-[#F97316]">Learners</span> Have To Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-300 text-sm sm:text-base font-medium">
              <Star className="w-4 h-4 sm:w-[18px] sm:h-[18px] fill-[#F97316] text-[#F97316]" />
              <span className="text-[#111827] dark:text-white font-bold">
                4.9
              </span>
              <span className="text-gray-400">•</span>
              <span>Thousands of Happy Learners</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8 sm:mb-10 lg:mb-14">
            {mentorBenefits.map((item, i) => (
              <div
                key={i}
                className="h-full flex items-center gap-3 bg-[#FAF6F2] dark:bg-gray-900 rounded-2xl p-6 border border-[#ECECEC] dark:border-gray-800 shadow-[0_10px_35px_rgba(0,0,0,0.08)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-[#1E293B] dark:bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <MentorTestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* ── Career Support ── */}
      <section
        id="successstories"
        className="py-24 px-6 scroll-mt-20 bg-[#F6EDE6] dark:bg-black"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
              Career Support That{" "}
              <span className="text-[#F97316]">Delivers Results</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get help with interview prep, portfolios, referrals and role
              mapping
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {careerSupport.map((item, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* ── Wide banner CTA ── */}
          <div className="bg-[#F6EDE6] dark:bg-gray-900 rounded-3xl relative overflow-hidden border border-[#F97316]/20 shadow-xl">
            <div className="flex flex-col lg:flex-row items-stretch">
              {/* ── Left: full-bleed image, fixed height, cropped to fill ── */}
              <div className="w-full lg:w-[280px] xl:w-[320px] h-56 sm:h-64 lg:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={ctaStudent}
                  alt="Student ready to transform their career"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* ── Middle: Content ── */}
              <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 lg:py-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-[#1E293B] dark:text-white leading-tight">
                  Ready to Transform Your Career?
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xl">
                  Join 5000+ professionals who've already taken the leap with
                  our project-based programs and expert mentorship.
                </p>
              </div>

              {/* ── Right: CTA button ── */}
              <div className="flex items-center justify-center lg:justify-end px-6 sm:px-10 pb-10 lg:pb-0 lg:pr-10">
                <button
                  onClick={() => scrollToSection("courses")}
                  className="flex items-center gap-2 bg-[#1E293B] hover:bg-[#334155] text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
                >
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-[#F6EDE6] dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E293B] dark:text-white">
              Why Choose
              <span className="ml-2">
                <span className="text-green-600">ILM</span>{" "}
                <span className="text-[#F97316]">ORA</span>
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to accelerate your career growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="w-14 h-14 bg-[#1E293B] dark:bg-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 relative overflow-hidden bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" style={{ marginBottom: 64 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400 dark:text-gray-400 font-bold">
              TRUSTED BY LEADING ORGANIZATIONS
            </p>

            <h2 className="text-4xl md:text-6xl font-bold text-[#1E293B] dark:text-white mt-4">
              Top Global <span className="text-[#F97316]">Companies</span>
            </h2>

            <p className="mt-4 max-w-[700px] mx-auto text-gray-500 dark:text-gray-300">
              We collaborate with leading technology providers and business
              organizations to deliver innovative digital solutions.
            </p>
          </div>

          <TopCompaniesCarousel
            logos={[
              ...techPartners,
              ...bizPartners,
              ...(ecosystemProducts || []),
            ]}
          />
        </div>
      </section>
      {/* ── Footer ── */}
      <Footer scrollToSection={scrollToSection} />
      {/* ── Login Modal ── */}
      {showLoginModal && (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(5px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLoginModal(false);
            }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(249,115,22,0.18)",
                padding: "20px 26px 18px",
                animation: "modalFadeUp 0.3s ease both",
              }}
            >
              <style>{`@keyframes modalFadeUp { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>

              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition text-xl font-bold leading-none"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex justify-center mb-2">
                <span className="text-3xl font-extrabold font-serif tracking-wide">
                  <span className="text-green-600">ILM</span>
                  <span className="text-[#F97316] ml-2">ORA</span>
                </span>
              </div>

              <div className="text-center mb-3">
                <h2 className="text-lg font-bold text-[#1e0e02] mb-0.5">
                  Welcome back!
                </h2>
              </div>

              <div className="flex justify-center mb-3">
                <GoogleLogin
                  onSuccess={handleModalGoogle}
                  onError={() => console.error("Google OAuth failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="360"
                  auto_select={false}
                  cancel_on_tap_outside={true}
                />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
                <span className="text-xs text-[#b8906a] uppercase tracking-widest font-medium">
                  OR
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(180,100,30,0.15)" }}
                />
              </div>

              <form onSubmit={handleModalSubmit}>
                <div className="mb-2">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    required
                    disabled={modalLoading}
                    className="w-full px-3.5 py-2 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                    style={{
                      background: "rgba(255,255,255,0.8)",
                      border: "1.5px solid rgba(180,120,60,0.2)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#F97316";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(249,115,22,0.1)";
                      e.target.style.background = "#fff";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(180,120,60,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <div className="mb-1.5">
                  <label className="block text-xs font-bold text-[#8a6040] mb-1 uppercase tracking-widest">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showModalPw ? "text" : "password"}
                      placeholder="Enter your password"
                      value={modalPassword}
                      onChange={(e) => setModalPassword(e.target.value)}
                      required
                      disabled={modalLoading}
                      className="w-full px-3.5 py-2 pr-11 rounded-xl text-sm text-[#1a0e06] placeholder-[#c0a070] outline-none transition-all disabled:opacity-50"
                      style={{
                        background: "rgba(255,255,255,0.8)",
                        border: "1.5px solid rgba(180,120,60,0.2)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#F97316";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(249,115,22,0.1)";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(180,120,60,0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowModalPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8906a] hover:text-[#F97316] transition p-0 bg-transparent border-none cursor-pointer"
                      tabIndex={-1}
                    >
                      {showModalPw ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-right mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-[#F97316] hover:underline bg-transparent border-none cursor-pointer font-medium p-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="w-full py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg,#F97316,#ea580c)",
                    boxShadow: "0 4px 18px rgba(249,115,22,0.32)",
                  }}
                >
                  {modalLoading ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="w-full mt-2.5 py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{
                  background: "transparent",
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#16a34a";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M2 12h20" />
                </svg>
                Sign up
              </button>

              <div className="text-center mt-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="text-xs text-[#b8906a] hover:text-[#8a6040] bg-transparent border-none cursor-pointer transition-colors"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          </div>
        </GoogleOAuthProvider>
      )}
      {showSignupModal && (
        <SignupModal
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
      {showForgotModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotModal(false)}
          onSwitchToLogin={() => {
            setShowForgotModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
      <TexoraFloatingWidget />
    </div>
  );
}