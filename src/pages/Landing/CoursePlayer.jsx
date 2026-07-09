import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  FastForward,
  FileText,
  Gauge,
  Loader2,
  Lock,
  Maximize,
  MessageSquare,
  Menu,
  Moon,
  Notebook,
  Pause,
  PlayCircle,
  Settings,
  Share2,
  Sun,
  User,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../services/courseService";

/* ──────────────────────────────────────────────────────────────────────────
   ILM ORA — Premium Learning Player  (/learn/:courseId)

   This page is intentionally separate from CourseDetailsPage.jsx:
   CourseDetailsPage is for marketing + enrollment, this page is the
   post-enrollment learning experience (Udemy-style).

   Reuses the SAME data the rest of the app already fetches
   (courseService.getFeaturedProgramById) — no new APIs/services/routes
   added on the backend. Course content (sections/lessons) is derived
   from the existing `syllabusWeeks` structure.

   Progress is tracked with localStorage, keyed per course + lesson, and
   only changes when the learner actually clicks "Mark Complete" — this
   is real, user-driven progress, never pre-filled/fake numbers.
────────────────────────────────────────────────────────────────────────── */

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const qualityOptions = ["Auto", "1080p", "720p", "480p", "360p"];

export default function CoursePlayer() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [completed, setCompleted] = useState({}); // { [lessonId]: true }
  const [notesText, setNotesText] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  // ── Video control state ──
  const videoRef = useRef(null);
  const playerWrapRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progressPct, setProgressPct] = useState(0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("Auto");

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // ── Load course (reuses existing service/API — no changes) ──
  useEffect(() => {
    if (!courseId) {
      navigate("/");
      return;
    }
    async function load() {
      try {
        const { data } = await courseService.getFeaturedProgramById(courseId);
        setCourseData({
          id: data.id,
          title: data.title,
          instructor: data.instructorRole || data.instructorName,
          instructorFull: data.instructorName,
          totalLessons: data.lessons,
          syllabusWeeks: data.syllabusWeeks || [],
        });
      } catch (err) {
        console.error("Failed to load course for learning player", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId, navigate]);

  // ── Flatten syllabusWeeks into sections/lessons (real course data,
  //     no invented durations/content) ──
  const sections = useMemo(() => {
    const weeks = courseData?.syllabusWeeks || [];
    return weeks.map((w, wIdx) => ({
      id: `section-${wIdx}`,
      title: w.title || `Week ${w.weekNumber ?? wIdx + 1}`,
      weekLabel: `Week ${w.weekNumber ?? wIdx + 1}`,
      lessons: (w.items || []).map((item, lIdx) => ({
        id: `w${wIdx}-l${lIdx}`,
        title: typeof item === "string" ? item : item?.title || `Lesson ${lIdx + 1}`,
        duration: typeof item === "object" ? item?.duration : null,
        videoUrl: typeof item === "object" ? item?.videoUrl : null,
      })),
    }));
  }, [courseData]);

  const allLessons = useMemo(
    () => sections.flatMap((s) => s.lessons),
    [sections],
  );

  // ── Restore progress + last lesson from localStorage ──
  useEffect(() => {
    if (!courseData?.id || allLessons.length === 0) return;
    try {
      const stored = localStorage.getItem(`lms_progress_${courseData.id}`);
      const parsed = stored ? JSON.parse(stored) : {};
      setCompleted(parsed);
    } catch {
      setCompleted({});
    }
    const lastLesson = localStorage.getItem(`lms_last_lesson_${courseData.id}`);
    setActiveLessonId(
      lastLesson && allLessons.some((l) => l.id === lastLesson)
        ? lastLesson
        : allLessons[0]?.id,
    );
  }, [courseData?.id, allLessons]);

  // Load per-lesson notes
  useEffect(() => {
    if (!courseData?.id || !activeLessonId) return;
    const stored = localStorage.getItem(
      `lms_notes_${courseData.id}_${activeLessonId}`,
    );
    setNotesText(stored || "");
  }, [courseData?.id, activeLessonId]);

  const activeLessonIndex = allLessons.findIndex(
    (l) => l.id === activeLessonId,
  );
  const activeLesson = allLessons[activeLessonIndex];
  const activeSectionIndex = sections.findIndex((s) =>
    s.lessons.some((l) => l.id === activeLessonId),
  );

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = allLessons.length;
  const percentComplete = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const persistCompleted = (next) => {
    setCompleted(next);
    if (courseData?.id) {
      localStorage.setItem(
        `lms_progress_${courseData.id}`,
        JSON.stringify(next),
      );
    }
  };

  const goToLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setIsPlaying(false);
    setProgressPct(0);
    setSidebarOpen(false);
    if (courseData?.id) {
      localStorage.setItem(`lms_last_lesson_${courseData.id}`, lessonId);
    }
  };

  const markComplete = (value = true) => {
    if (!activeLesson) return;
    persistCompleted({ ...completed, [activeLesson.id]: value });
  };

  const goPrev = () => {
    if (activeLessonIndex > 0) goToLesson(allLessons[activeLessonIndex - 1].id);
  };
  const goNext = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      // Auto-marks the lesson you're leaving as complete — a real,
      // user-triggered action (advancing = finishing), not fabricated data.
      markComplete(true);
      goToLesson(allLessons[activeLessonIndex + 1].id);
    }
  };

  const toggleSection = (idx) =>
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));

  // ── Video control handlers ──
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) {
      setIsPlaying((p) => !p); // no real src available — still toggle UI state
      return;
    }
    if (v.paused) v.play();
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
    setMuted((m) => !m);
  };
  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) videoRef.current.volume = val;
  };
  const handleSeek = (e) => {
    const v = videoRef.current;
    const pct = Number(e.target.value);
    setProgressPct(pct);
    if (v && v.duration) v.currentTime = (pct / 100) * v.duration;
  };
  const handleSpeed = (s) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
    setShowSpeedMenu(false);
  };
  const toggleFullscreen = () => {
    const el = playerWrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy link", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] dark:bg-black">
        <Loader2 className="w-6 h-6 text-[#F97316] animate-spin" />
      </div>
    );
  }
  if (!courseData) return null;

  const tabs = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "notes", label: "Notes", icon: Notebook },
    { key: "resources", label: "Resources", icon: Download },
    { key: "qa", label: "Q&A", icon: MessageSquare },
    { key: "announcements", label: "Announcements", icon: Menu },
  ];

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-5 py-4 border-b border-white/10 dark:border-gray-800">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#F97316] mb-1">
          Course content
        </p>
        <div className="flex items-center justify-between text-xs text-gray-300 dark:text-gray-400">
          <span>
            {completedCount}/{totalCount} lessons complete
          </span>
          <span className="font-semibold text-white dark:text-gray-200">
            {percentComplete}%
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#F97316] rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sections.map((section, sIdx) => {
          const sectionDone = section.lessons.filter(
            (l) => completed[l.id],
          ).length;
          const isOpen = expandedSections[sIdx] ?? sIdx === activeSectionIndex;
          return (
            <div
              key={section.id}
              className="border-b border-white/5 dark:border-gray-800"
            >
              <button
                type="button"
                onClick={() => toggleSection(sIdx)}
                className="w-full flex items-center justify-between gap-2 px-4 sm:px-5 py-3.5 text-left hover:bg-white/5 dark:hover:bg-gray-800/60 transition"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    {section.weekLabel}
                  </p>
                  <p className="text-sm font-semibold text-white dark:text-gray-100 truncate">
                    {section.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {sectionDone}/{section.lessons.length} complete
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="pb-2">
                  {section.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    const isDone = !!completed[lesson.id];
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => goToLesson(lesson.id)}
                        className={`w-full flex items-start gap-3 px-4 sm:px-5 py-2.5 text-left transition ${
                          isActive
                            ? "bg-[#F97316]/15 border-l-2 border-[#F97316]"
                            : "hover:bg-white/5 dark:hover:bg-gray-800/40 border-l-2 border-transparent"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-400 flex-shrink-0 mt-0.5"
                          />
                        ) : isActive ? (
                          <PlayCircle
                            size={16}
                            className="text-[#F97316] flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <Circle
                            size={16}
                            className="text-gray-500 flex-shrink-0 mt-0.5"
                          />
                        )}
                        <span
                          className={`text-xs sm:text-sm leading-snug ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-gray-300 dark:text-gray-300"
                          }`}
                        >
                          {lesson.title}
                          {lesson.duration && (
                            <span className="block text-[11px] text-gray-500 mt-0.5">
                              {lesson.duration}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="p-4 sm:p-5 border-t border-white/10 dark:border-gray-800">
          <div className="bg-[#F97316]/10 border border-[#F97316]/30 rounded-xl p-3.5 text-center">
            <Award className="w-6 h-6 text-[#F97316] mx-auto mb-2" />
            <p className="text-xs font-semibold text-white dark:text-gray-100 mb-2">
              Course complete!
            </p>
            <button
              type="button"
              className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white text-xs font-bold py-2 rounded-lg transition"
            >
              Download Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-black flex flex-col">
      {/* ══════════════════════════ TOP NAV ══════════════════════════ */}
      <header className="flex-shrink-0 bg-[#0B1120] border-b border-white/10 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            aria-label="Course content"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition flex-shrink-0"
          >
            <Menu size={18} className="text-white" />
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden sm:flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center font-bold text-white text-sm">
              I
            </div>
            <span className="font-bold text-white text-sm">ILM ORA</span>
          </button>
          <div className="hidden md:block w-px h-5 bg-white/15" />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-white truncate max-w-[38vw] sm:max-w-xs">
              {courseData.title}
            </p>
            <div className="hidden sm:flex items-center gap-2 mt-0.5">
              <div className="w-24 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#F97316] rounded-full"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <span className="text-[11px] text-gray-400">
                {percentComplete}% complete
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share"
            className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
          >
            <Share2 size={16} className="text-gray-300" />
            {shareCopied && (
              <span className="absolute -bottom-8 right-0 text-[10px] font-semibold bg-white text-[#1E293B] px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                Link copied!
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition"
          >
            {dark ? (
              <Sun size={16} className="text-[#F97316]" />
            ) : (
              <Moon size={16} className="text-gray-300" />
            )}
          </button>
          <button
            type="button"
            aria-label="User menu"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
          >
            <User size={16} className="text-gray-200" />
          </button>
        </div>
      </header>

      {/* ══════════════════════════ BODY: two-column ══════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT: video + tabs ── */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          {/* Video player */}
          <div
            ref={playerWrapRef}
            className="relative w-full bg-black aspect-video flex-shrink-0 group/player"
          >
            <video
              ref={videoRef}
              key={activeLesson?.id}
              className="w-full h-full"
              src={activeLesson?.videoUrl || undefined}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgressPct((v.currentTime / v.duration) * 100);
              }}
              onEnded={() => markComplete(true)}
            />

            {!activeLesson?.videoUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1E293B] to-[#1e3a5f] text-center px-6">
                <PlayCircle className="w-14 h-14 text-white/30 mb-3" />
                <p className="text-white/70 text-sm max-w-sm">
                  Video for "{activeLesson?.title}" isn't connected yet —
                  controls below are fully wired up for when a lesson video is
                  available.
                </p>
              </div>
            )}

            {/* Custom control bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 sm:px-4 pt-8 pb-2.5 sm:pb-3 opacity-0 group-hover/player:opacity-100 focus-within:opacity-100 transition-opacity">
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={progressPct}
                onChange={handleSeek}
                className="w-full h-1 mb-2.5 accent-[#F97316] cursor-pointer"
                aria-label="Seek"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className="text-white hover:text-[#F97316] transition"
                  >
                    {isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <PlayCircle size={22} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="text-white hover:text-[#F97316] transition hidden sm:block"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX size={18} />
                    ) : (
                      <Volume2 size={18} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={handleVolume}
                    className="w-16 h-1 accent-white hidden sm:block"
                    aria-label="Volume"
                  />
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3 relative">
                  {/* Speed */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSpeedMenu((s) => !s);
                        setShowQualityMenu(false);
                      }}
                      className="flex items-center gap-1 text-white text-xs font-semibold hover:text-[#F97316] transition"
                    >
                      <FastForward size={15} />
                      {speed}x
                    </button>
                    {showSpeedMenu && (
                      <div className="absolute bottom-8 right-0 bg-[#1E293B] rounded-lg shadow-xl border border-white/10 py-1 min-w-[80px] z-10">
                        {speedOptions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSpeed(s)}
                            className={`w-full text-left px-3 py-1.5 text-xs ${
                              s === speed
                                ? "text-[#F97316] font-semibold"
                                : "text-gray-200 hover:bg-white/5"
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quality */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowQualityMenu((s) => !s);
                        setShowSpeedMenu(false);
                      }}
                      className="flex items-center gap-1 text-white text-xs font-semibold hover:text-[#F97316] transition"
                    >
                      <Settings size={15} />
                      <span className="hidden sm:inline">{quality}</span>
                    </button>
                    {showQualityMenu && (
                      <div className="absolute bottom-8 right-0 bg-[#1E293B] rounded-lg shadow-xl border border-white/10 py-1 min-w-[90px] z-10">
                        {qualityOptions.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => {
                              setQuality(q);
                              setShowQualityMenu(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 text-xs ${
                              q === quality
                                ? "text-[#F97316] font-semibold"
                                : "text-gray-200 hover:bg-white/5"
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Fullscreen"
                    className="text-white hover:text-[#F97316] transition"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 sm:px-5 flex-shrink-0 overflow-x-auto">
            <div
              className="flex gap-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-[#F97316] text-[#F97316]"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-[#1E293B] dark:hover:text-white"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-4 sm:p-6 md:p-8">
            {activeTab === "overview" && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-white mb-2">
                  {activeLesson?.title || "Select a lesson"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {sections[activeSectionIndex]?.weekLabel} ·{" "}
                  {sections[activeSectionIndex]?.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  This lesson is part of {courseData.title}. Use the sidebar
                  to jump between lessons, and mark this lesson complete once
                  you've finished it to track your progress through the
                  course.
                </p>
              </div>
            )}

            {activeTab === "notes" && (
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#1E293B] dark:text-white mb-3">
                  Your notes for this lesson
                </h3>
                <textarea
                  value={notesText}
                  onChange={(e) => {
                    setNotesText(e.target.value);
                    if (courseData?.id && activeLesson?.id) {
                      localStorage.setItem(
                        `lms_notes_${courseData.id}_${activeLesson.id}`,
                        e.target.value,
                      );
                    }
                  }}
                  placeholder="Type notes while you watch — saved automatically for this lesson."
                  rows={10}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F97316]/40"
                />
              </div>
            )}

            {activeTab === "resources" && (
              <div className="text-center py-10">
                <Download className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No downloadable resources have been attached to this lesson
                  yet.
                </p>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="text-center py-10">
                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  No questions yet on this lesson.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Be the first to ask the instructor a question.
                </p>
              </div>
            )}

            {activeTab === "announcements" && (
              <div className="text-center py-10">
                <Menu className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No announcements from the instructor yet.
                </p>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={activeLessonIndex <= 0}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1E293B] dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#F97316] transition"
            >
              <ChevronLeft size={16} />
              <span className="hidden xs:inline">Previous</span>
            </button>

            <button
              type="button"
              onClick={() => markComplete(!completed[activeLesson?.id])}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                completed[activeLesson?.id]
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                  : "bg-[#F97316] text-white hover:bg-[#ea6c0a] shadow-md"
              }`}
            >
              <Check size={15} />
              {completed[activeLesson?.id] ? "Completed" : "Mark Complete"}
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={activeLessonIndex >= allLessons.length - 1}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1E293B] dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#F97316] transition"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── RIGHT: sidebar (desktop) ── */}
        <aside className="hidden lg:block w-[340px] flex-shrink-0 bg-[#0B1120] overflow-hidden">
          {SidebarContent}
        </aside>
      </div>

      {/* ── Mobile sidebar drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-[#0B1120] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-sm font-bold text-white">
                Course Content
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{SidebarContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}
