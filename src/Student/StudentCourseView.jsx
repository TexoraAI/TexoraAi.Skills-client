import axios from "axios";
import {
  BookOpen,
  CheckCircle,
  File,
  FileText,
  GraduationCap,
  Lock,
  PlayCircle,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { progressService } from "../services/progressService";
import videoService from "../services/videoService";

// ── Same Global Design System the Dashboard (Golden Reference) and
// MyCourses use. Tokens, StatCard, and PageContainer are the single
// source of truth for every page — no page-local CSS injection here.
import { T, StatCard, PageContainer } from "@/design-system";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

/* ─── Progress helpers (identical to Dashboard's/MyCourses')
   Duplicated here for the same reason noted in MyCourses.jsx — these
   should eventually be hoisted into @/design-system so there's one
   copy shared by every page. ─── */
const getProgressColor = (pct) => {
  if (pct >= 100) return "#34d399";
  if (pct >= 60) return "#a78bfa";
  if (pct >= 30) return "#fb923c";
  return "#94a3b8";
};

/* ════════════════════════════════════════════════════════════════
   COMPONENT — all fetch/streaming/progress logic is unchanged from
   the original; presentation layer uses the shared design system
   (t tokens, PageContainer, StatCard). Transcript feature (polling,
   segment sync, panel UI) ported in and restyled with t tokens.
   ════════════════════════════════════════════════════════════════ */
export default function StudentCourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [planSummary, setPlanSummary] = useState(null);
  const [active, setActive] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const autoMarkedRef = useRef(new Set());
  const videoRef = useRef(null);
  const studentEmail = getEmailFromToken();

  /* ── dark mode detection identical to Dashboard/MyCourses ── */
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  // ── Transcript (course video) ──────────────────────────────────────────
  // NOTE: looked up by video URL, not by ContentItem.id — ContentItem
  // (course-service) has no field pointing back to video-service's
  // CourseVideo.id, only the stream `url`. This mirrors exactly how
  // ContentEventConsumer resolves CourseVideo rows on the backend
  // (repo.findByUrl(url)), so the same key is used here.
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptState, setTranscriptState] = useState({
    status: null,
    segments: [],
  });
  const [activeSegIdx, setActiveSegIdx] = useState(-1);
  const transcriptPollCountRef = useRef(0);
  const transcriptPollTimerRef = useRef(null);
  const transcriptVideoUrlRef = useRef(null);

  const getMaxPollAttempts = () => Math.ceil((10 * 60000) / 15000); // 10 min minimum window

  const pollTranscript = async (videoUrl) => {
    let data = null;
    try {
      const res = await videoService.getCourseVideoTranscriptByUrl(videoUrl);
      data = res.data;
    } catch {
      data = { status: "FAILED", segments: [] };
    }
    if (transcriptVideoUrlRef.current !== videoUrl) return;

    setTranscriptState({
      status: data?.status || "FAILED",
      segments: Array.isArray(data?.segments) ? data.segments : [],
    });

    if (data?.status === "PROCESSING" || data?.status === "NONE") {
      transcriptPollCountRef.current += 1;
      if (transcriptPollCountRef.current < getMaxPollAttempts()) {
        transcriptPollTimerRef.current = setTimeout(
          () => pollTranscript(videoUrl),
          15000,
        );
      } else {
        setTranscriptState((prev) => ({ ...prev, status: "TIMEOUT" }));
      }
    }
  };

  useEffect(() => {
    if (transcriptPollTimerRef.current)
      clearTimeout(transcriptPollTimerRef.current);
    transcriptPollCountRef.current = 0;
    setActiveSegIdx(-1);
    setTranscriptOpen(false);
    transcriptVideoUrlRef.current = active?.url ?? null;

    if (!active || mediaType !== "VIDEO") {
      setTranscriptState({ status: null, segments: [] });
      return;
    }
    pollTranscript(active.url);

    return () => {
      if (transcriptPollTimerRef.current)
        clearTimeout(transcriptPollTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || transcriptState.status !== "READY") return;
    const onTime = () => {
      const tSec = v.currentTime;
      const idx = transcriptState.segments.findIndex(
        (s) => tSec >= s.startSeconds && tSec < s.endSeconds,
      );
      setActiveSegIdx(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [transcriptState.status, transcriptState.segments]);

  const seekToSegment = (seg) => {
    const v = videoRef.current;
    if (v) v.currentTime = seg.startSeconds;
  };

  const fmtTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };
  // ─────────────────────────────────────────────────────────────────────

  const calcPercent = (ids, valid) => {
    if (!valid?.length) return 0;
    return Math.min(Math.round((ids.length / valid.length) * 100), 100);
  };

  useEffect(() => {
    load();
    return () => {
      if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const [courseRes, contentRes, planRes] = await Promise.all([
        axios.get(`${API}/courses/${id}`, { headers: authHeader() }),
        axios.get(`${API}/content/student/course/${id}`, {
          headers: authHeader(),
        }),
        axios
          .get(`${API}/courses/student/plan-summary`, {
            headers: authHeader(),
          })
          .catch(() => ({ data: null })),
      ]);
      setPlanSummary(planRes.data);
      const valid = contentRes.data.filter(
        (c) => c.url && c.url !== "undefined",
      );
      setCourse(courseRes.data);
      setContents(valid);
      if (studentEmail) {
        try {
          const prog = await progressService.getProgress(
            studentEmail,
            Number(id),
          );
          const ids = prog.data.completedContentIds || [];
          setCompletedIds(ids);
          setProgressPercent(calcPercent(ids, valid));
        } catch {
          setCompletedIds([]);
          setProgressPercent(0);
        }
      }
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  const markComplete = async (contentId, currentContents) => {
    if (!studentEmail) return;
    try {
      const res = await progressService.markContentComplete(
        studentEmail,
        Number(id),
        contentId,
        currentContents.length,
      );
      const updatedIds = res.data.completedContentIds || [];
      setCompletedIds(updatedIds);
      setProgressPercent(calcPercent(updatedIds, currentContents));
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  const moduleCap = planSummary?.modulesPerCourse ?? null;
  const isPlanLocked = (index) => moduleCap !== null && index >= moduleCap;

  const isUnlocked = (index) => {
    if (isPlanLocked(index)) return false;
    if (index === 0) return true;
    return completedIds.includes(contents[index - 1].id);
  };

  const playVideo = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) {
      alert("Video missing");
      return;
    }
    try {
      const fileName = c.url.split("/").pop();
      const presignedUrl =
        await videoService.getCourseVideoPlaybackUrl(fileName);
      setMediaUrl(presignedUrl);
      setMediaType("VIDEO");
      setActive(c);
    } catch (err) {
      console.error("Video load failed", err);
    }
  };

  // const openPdf = async (c, index) => {
  //   if (!isUnlocked(index)) return;
  //   if (!c?.url) {
  //     alert("File missing");
  //     return;
  //   }
  //   try {
  //     if (mediaType === "PDF" && mediaUrl) URL.revokeObjectURL(mediaUrl);

  //     const fileId = c.url.split("/").pop(); // now the CourseFile id, not a filename
  //     const meta = await axios.get(`${API}/course-files/download/${fileId}`, {
  //       headers: authHeader(),
  //     });
  //     const res = await axios.get(meta.data.url, { responseType: "blob" }); // no auth header — plain S3 fetch

  //     setMediaUrl(
  //       URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })),
  //     );
  //     setMediaType("PDF");
  //     setActive(c);
  //     if (!completedIds.includes(c.id)) markComplete(c.id, contents);
  //   } catch (err) {
  //     console.error("PDF load failed", err);
  //   }
  const openPdf = async (c, index) => {
    if (!isUnlocked(index)) return;
    if (!c?.url) {
      alert("File missing");
      return;
    }
    try {
      const fileId = c.url.split("/").pop();
      const meta = await axios.get(`${API}/course-files/download/${fileId}`, {
        headers: authHeader(),
      });
      setMediaUrl(meta.data.url); // presigned S3 URL, fed straight to the <iframe>
      setMediaType("PDF");
      setActive(c);
      if (!completedIds.includes(c.id)) markComplete(c.id, contents);
    } catch (err) {
      console.error("PDF load failed", err);
    }
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active || mediaType !== "VIDEO") return;
    const onTime = () => {
      const { currentTime, duration } = el;
      if (!duration) return;
      if (
        (currentTime / duration) * 100 >= 80 &&
        !autoMarkedRef.current.has(active.id) &&
        !completedIds.includes(active.id)
      ) {
        autoMarkedRef.current.add(active.id);
        markComplete(active.id, contents);
      }
    };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, mediaType, completedIds]);

  /* ── derived values ── */
  const videoCount = contents.filter((c) => c.contentType === "VIDEO").length;
  const pdfCount = contents.filter((c) => c.contentType === "PDF").length;
  const isAllCompleted =
    contents.length > 0 && completedIds.length >= contents.length;
  const progressColor = getProgressColor(progressPercent);

  // Reuse the exact accent colors Dashboard's ResourceBlock uses for
  // videos (#22d3ee) and documents (#0ea5e9) so this page's badges and
  // icons read as the same system, not a one-off palette.
  const VIDEO_COLOR = "#22d3ee";
  const PDF_COLOR = "#0ea5e9";

  /* stat cards — same StatCard component + colorKey scheme as Dashboard/MyCourses */
  const stats = [
    {
      label: "Total Modules",
      numericValue: contents.length,
      change: `${contents.length} in course`,
      trend: "up",
      icon: BookOpen,
      colorKey: "blue",
    },
    {
      label: "Videos",
      numericValue: videoCount,
      change: `${videoCount} to watch`,
      trend: "up",
      icon: Video,
      colorKey: "orange",
    },
    {
      label: "Documents",
      numericValue: pdfCount,
      change: `${pdfCount} to review`,
      trend: "up",
      icon: FileText,
      colorKey: "green",
    },
  ];

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — same band as Dashboard/MyCourses ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="hero-flex">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7c3aed",
                }}
                className="d1"
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Student Portal
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {course?.title || "Loading…"}
            </h1>
            <p
              style={{
                fontSize: 12,
                color: t.textSub,
                margin: 0,
                fontWeight: 500,
                fontFamily: "'Poppins',sans-serif",
                maxWidth: 520,
              }}
            >
              {course?.description ||
                "Continue your learning journey and track your progress"}
            </p>
          </div>

          <div className="hero-badges">
            {isAllCompleted && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: t.statusCompletedBg,
                  border: `1px solid ${progressColor}40`,
                  borderRadius: 999,
                  padding: "8px 16px",
                  color: t.statusCompletedText,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                <CheckCircle size={13} /> 🎉 Course Completed
              </div>
            )}
            <div
              className="livebadge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 999,
                padding: "8px 18px",
                color: "#7c3aed",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  display: "inline-block",
                }}
              />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={!course} />
        ))}
      </div>

      {/* ═══ OVERALL PROGRESS — same bar styling Dashboard uses for resource progress ═══ */}
      {contents.length > 0 && (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            padding: 22,
            boxShadow: t.shadow,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: t.textMuted,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              Your Progress
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: t.text,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              {progressPercent}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: t.barBg,
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 99,
                background: progressColor,
                width: `${progressPercent}%`,
                transition: "width 0.7s ease",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 11,
              color: t.textMuted,
              margin: 0,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            {completedIds.length} of {contents.length} modules completed
          </p>
        </div>
      )}

      {/* ═══ BODY GRID ═══ */}
      <div
        className="dash-row-grid"
        style={{ gridTemplateColumns: "1fr 2fr", alignItems: "flex-start" }}
      >
        {/* LEFT — Modules */}
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            boxShadow: t.shadow,
            padding: 20,
            position: "sticky",
            top: 16,
            maxHeight: "calc(100vh - 40px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              paddingBottom: 14,
              borderBottom: `1px solid ${t.border}`,
              marginBottom: 12,
            }}
          >
            <BookOpen size={15} color="#7c3aed" />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: t.text,
                fontFamily: "'Poppins',sans-serif",
              }}
            >
              Course Modules
            </span>
          </div>

          <div
            style={{
              background: t.newBadgeBg,
              border: `1px solid ${t.newBadgeBorder}`,
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 10.5,
              fontWeight: 500,
              color: t.newBadgeText,
              marginBottom: 12,
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            📋 Complete each module in order to unlock the next one
          </div>

          {contents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "26px 0" }}>
              <File
                size={34}
                color={t.emptyIcon}
                style={{ margin: "0 auto 7px", display: "block" }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                No content available
              </p>
            </div>
          ) : (
            contents.map((c, index) => {
              const isDone = completedIds.includes(c.id);
              const isActive = active?.id === c.id;
              const unlocked = isUnlocked(index);
              const typeColor =
                c.contentType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR;

              // module container colors — reusing the same status tokens
              // Dashboard's course cards use for completed / in-progress / not-started
              let modBg = t.cardBg;
              let modBorder = t.border;
              let modOpacity = 1;
              let modCursor = unlocked ? "pointer" : "not-allowed";
              if (isActive) {
                modBg = t.statusProgressBg;
                modBorder = "#7c3aed";
              } else if (isDone) {
                modBg = t.statusCompletedBg;
                modBorder = "#34d39950";
              } else if (!unlocked) {
                modBg = t.statusNotStartedBg;
                modOpacity = 0.5;
              }

              let idxBg = t.statusNotStartedBg;
              let idxColor = t.textMuted;
              if (isDone) {
                idxBg = "#34d399";
                idxColor = "#fff";
              } else if (isActive) {
                idxBg = "#7c3aed";
                idxColor = "#fff";
              } else if (unlocked) {
                idxBg = t.iconBg;
                idxColor = t.textMuted;
              }

              const iconColor = isActive
                ? "#7c3aed"
                : unlocked
                  ? t.textMuted
                  : t.textLabel;

              return (
                <div
                  key={c.id}
                  style={{
                    borderRadius: 12,
                    padding: "10px 12px",
                    marginBottom: 8,
                    border: `1px solid ${modBorder}`,
                    background: modBg,
                    opacity: modOpacity,
                    cursor: modCursor,
                    transition:
                      "box-shadow 0.2s, border-color 0.2s, background 0.25s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        background: idxBg,
                        color: idxColor,
                        border:
                          !unlocked && !isDone
                            ? `1px solid ${t.border}`
                            : "none",
                      }}
                    >
                      {isDone ? (
                        <CheckCircle size={12} />
                      ) : !unlocked ? (
                        <Lock size={10} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          alignItems: "flex-start",
                          marginBottom: 4,
                        }}
                      >
                        {c.contentType === "VIDEO" ? (
                          <Video
                            size={11}
                            color={iconColor}
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                        ) : (
                          <FileText
                            size={11}
                            color={iconColor}
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: unlocked ? t.text : t.textMuted,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {c.title}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 20,
                            background: `${typeColor}18`,
                            color: typeColor,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {c.contentType}
                        </span>
                        {isDone && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: t.statusCompletedBg,
                              color: t.statusCompletedText,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            ✓ Done
                          </span>
                        )}
                        {!unlocked && isPlanLocked(index) && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: "rgba(251,146,60,0.12)",
                              color: "#d97706",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            <Lock size={7} /> Upgrade to unlock
                          </span>
                        )}
                        {!unlocked && !isPlanLocked(index) && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              padding: "2px 7px",
                              borderRadius: 20,
                              background: t.statusNotStartedBg,
                              color: t.textMuted,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            <Lock size={7} /> Complete previous module
                          </span>
                        )}
                        {unlocked && !isDone && c.contentType === "VIDEO" && (
                          <span
                            style={{
                              fontSize: 9,
                              color: t.textMuted,
                              fontStyle: "italic",
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            Watch 80% to complete
                          </span>
                        )}
                      </div>

                      {c.contentType === "VIDEO" && (
                        <button
                          onClick={() => unlocked && playVideo(c, index)}
                          disabled={!unlocked}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            padding: "7px 10px",
                            borderRadius: 8,
                            border: "none",
                            fontSize: 10.5,
                            fontWeight: 600,
                            fontFamily: "'Poppins',sans-serif",
                            cursor: unlocked ? "pointer" : "not-allowed",
                            background: unlocked ? VIDEO_COLOR : t.barBg,
                            color: unlocked ? "#0a0a0a" : t.textMuted,
                          }}
                        >
                          <PlayCircle size={11} />
                          {isDone
                            ? "Replay Video"
                            : unlocked
                              ? "Play Video"
                              : "Locked"}
                        </button>
                      )}
                      {c.contentType === "PDF" && (
                        <button
                          onClick={() => unlocked && openPdf(c, index)}
                          disabled={!unlocked}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                            padding: "7px 10px",
                            borderRadius: 8,
                            border: `1px solid ${t.border}`,
                            fontSize: 10.5,
                            fontWeight: 600,
                            fontFamily: "'Poppins',sans-serif",
                            cursor: unlocked ? "pointer" : "not-allowed",
                            background: t.actBg,
                            color: unlocked ? t.text : t.textMuted,
                          }}
                        >
                          <FileText size={11} />
                          {isDone
                            ? "View Again"
                            : unlocked
                              ? "View Document"
                              : "Locked"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT — Player */}
        <div
          style={{
            background: t.cardBg,
            borderRadius: 20,
            boxShadow: t.shadow,
            border: `1px solid ${t.border}`,
            padding: 20,
          }}
        >
          {!mediaUrl ? (
            <div
              style={{
                height: 460,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: t.emptyBg,
                borderRadius: 14,
                border: `2px dashed ${t.emptyBorder}`,
              }}
            >
              <BookOpen
                size={48}
                strokeWidth={1.4}
                color={t.emptyIcon}
                style={{ marginBottom: 12 }}
              />
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: t.textMuted,
                  margin: "0 0 4px",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Ready to Learn?
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: t.textMuted,
                  margin: 0,
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Select a module from the left to begin
              </p>
            </div>
          ) : (
            <>
              {active && (
                <div
                  style={{
                    background: t.recentItemBg,
                    border: `1px solid ${t.recentItemBorder}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background:
                        mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {mediaType === "VIDEO" ? (
                      <Video size={16} color="#0a0a0a" />
                    ) : (
                      <FileText size={16} color="#0a0a0a" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: t.text,
                        marginBottom: 5,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      {active.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          padding: "2px 7px",
                          borderRadius: 20,
                          background:
                            mediaType === "VIDEO"
                              ? `${VIDEO_COLOR}18`
                              : `${PDF_COLOR}18`,
                          color:
                            mediaType === "VIDEO" ? VIDEO_COLOR : PDF_COLOR,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        {mediaType}
                      </span>
                      {completedIds.includes(active.id) && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: 20,
                            background: t.statusCompletedBg,
                            color: t.statusCompletedText,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          <CheckCircle size={9} /> Completed
                        </span>
                      )}
                      {mediaType === "VIDEO" &&
                        !completedIds.includes(active.id) && (
                          <span
                            style={{
                              fontSize: 10,
                              color: t.newBadgeText,
                              fontStyle: "italic",
                              fontFamily: "'Poppins',sans-serif",
                            }}
                          >
                            ⏱ Watch 80% to auto-complete
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Transcript panel toggle ── */}
              {mediaType === "VIDEO" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 8,
                  }}
                >
                  <button
                    onClick={() => setTranscriptOpen((o) => !o)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: t.textMuted,
                      background: "none",
                      border: `1px solid ${t.border}`,
                      borderRadius: 10,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <FileText size={13} />
                    {transcriptOpen ? "Hide Transcript" : "Transcript"}
                  </button>
                </div>
              )}

              {mediaType === "VIDEO" && (
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `1px solid ${t.border}`,
                    marginBottom: 12,
                    boxShadow: t.shadow,
                  }}
                >
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    disablePictureInPicture
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      background: "#000",
                      display: "block",
                    }}
                  />
                </div>
              )}

              {/* ── Transcript panel ── */}
              {mediaType === "VIDEO" && transcriptOpen && (
                <div
                  style={{
                    border: `1px solid ${t.border}`,
                    borderRadius: 12,
                    marginBottom: 12,
                    maxHeight: 240,
                    overflowY: "auto",
                    padding: 12,
                    background: t.pageBg,
                  }}
                >
                  {transcriptState.status === "READY" &&
                  transcriptState.segments.length > 0 ? (
                    transcriptState.segments.map((seg, idx) => (
                      <button
                        key={idx}
                        onClick={() => seekToSegment(seg)}
                        style={{
                          display: "flex",
                          gap: 10,
                          width: "100%",
                          textAlign: "left",
                          padding: "6px 8px",
                          borderRadius: 8,
                          border: "none",
                          background:
                            idx === activeSegIdx
                              ? `${VIDEO_COLOR}18`
                              : "transparent",
                          cursor: "pointer",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: VIDEO_COLOR,
                            flexShrink: 0,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {fmtTime(seg.startSeconds)}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: t.text,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {seg.text}
                        </span>
                      </button>
                    ))
                  ) : transcriptState.status === "TIMEOUT" ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: t.textMuted,
                        textAlign: "center",
                        padding: "24px 0",
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Transcript is taking longer than expected.
                    </p>
                  ) : transcriptState.status === "PROCESSING" ||
                    transcriptState.status === "NONE" ||
                    transcriptState.status === null ? (
                    <p
                      style={{
                        fontSize: 12,
                        color: t.textMuted,
                        textAlign: "center",
                        padding: "24px 0",
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Generating transcript…
                    </p>
                  ) : (
                    <p
                      style={{
                        fontSize: 12,
                        color: t.textMuted,
                        textAlign: "center",
                        padding: "24px 0",
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      Transcript unavailable for this video.
                    </p>
                  )}
                </div>
              )}

              {mediaType === "PDF" && (
                <iframe
                  src={mediaUrl}
                  title="PDF Viewer"
                  style={{
                    width: "100%",
                    height: 460,
                    borderRadius: 12,
                    border: `1px solid ${t.border}`,
                    display: "block",
                  }}
                />
              )}

              {active && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 6,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {completedIds.includes(active.id) ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 14px",
                        background: t.statusCompletedBg,
                        border: `1px solid ${t.statusCompletedText}40`,
                        borderRadius: 10,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: t.statusCompletedText,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      <CheckCircle size={13} /> Marked as Complete
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "7px 14px",
                        background: t.newBadgeBg,
                        border: `1px solid ${t.newBadgeBorder}`,
                        borderRadius: 10,
                        fontSize: 11.5,
                        fontWeight: 500,
                        color: t.newBadgeText,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: "#f59e0b",
                          flexShrink: 0,
                          animation: "scv-pulse 1.5s infinite",
                        }}
                      />
                      {mediaType === "VIDEO"
                        ? "Keep watching… (80% needed)"
                        : "Loading…"}
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      color: t.textMuted,
                      fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    {completedIds.length} of {contents.length} completed
                  </span>
                </div>
              )}

              {isAllCompleted && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 14,
                    marginTop: 12,
                    background: t.statusCompletedBg,
                    border: `1px solid ${t.statusCompletedText}40`,
                    borderRadius: 12,
                  }}
                >
                  <CheckCircle
                    size={22}
                    color={t.statusCompletedText}
                    style={{ flexShrink: 0 }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.statusCompletedText,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      🎉 Course Completed!
                    </div>
                    <div
                      style={{
                        fontSize: 10.5,
                        color: t.statusCompletedText,
                        opacity: 0.8,
                        fontFamily: "'Poppins',sans-serif",
                      }}
                    >
                      You have completed all modules in this course.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes scv-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>
    </PageContainer>
  );
}
