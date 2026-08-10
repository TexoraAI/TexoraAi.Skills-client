import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Edit3,
  FileText,
  Flag,
  Gauge,
  Lock,
  Maximize,
  MessageSquare,
  Paperclip,
  Pause,
  Play,
  PlayCircle,
  PictureInPicture2,
  Radio,
  Save,
  Settings,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
// NOTE: adjust this relative path if ProgramPlayer.jsx lives at a different
// folder depth than CourseDetailsPage.jsx (which imports the same service
// from "../../services/courseService").
import { courseService } from "../../services/courseService";
import videoService from "../../services/videoService";

const TYPE_ICON = {
  Video: PlayCircle,
  Live: Radio,
  Assignment: ClipboardList,
  Quiz: FileText,
  Reading: BookOpen,
};

const SIDE_TABS = [
  { id: "transcript", label: "Transcript", icon: MessageSquare },
  { id: "notes", label: "Notes", icon: Edit3 },
  { id: "files", label: "Files", icon: Paperclip },
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Sidebar duration label. Always prefers the REAL duration the backend
// measured from the uploaded file (videoDurationSeconds) over the
// free-text `duration` an admin typed in the syllabus form — that text
// field can drift from the actual file and is only a fallback for
// sessions whose video hasn't finished processing yet (or non-video
// session types, which have no videoDurationSeconds at all).
function formatDurationLabel(sess) {
  const secs = sess?.videoDurationSeconds;
  if (Number.isFinite(secs) && secs > 0) {
    const totalMin = Math.round(secs / 60);
    if (totalMin < 60) return `${totalMin} min`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return sess?.duration || "";
}
function isPdfUrl(url) {
  if (!url) return false;
  return url.toLowerCase().split("?")[0].endsWith(".pdf");
}
const SESSION_TYPE_FROM_BACKEND = {
  VIDEO: "Video",
  LIVE: "Live",
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
  READING: "Reading",
};
const normalizeSessionType = (type) =>
  SESSION_TYPE_FROM_BACKEND[String(type || "").toUpperCase()] ||
  type ||
  "Video";

export default function ProgramPlayer() {
  const { programId } = useParams();
  const navigate = useNavigate();

  // ── Data (fetching logic unchanged except for the shape-parsing fix) ──
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } =
          await courseService.getFeaturedProgramSyllabus(programId);
        if (cancelled) return;
        setSyllabus(data);
      } catch (err) {
        console.error("Failed to load syllabus", err);
        if (!cancelled) {
          setError("Could not load this course. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (programId) load();
    return () => {
      cancelled = true;
    };
  }, [programId]);

  // ── FIX: backend returns List<SyllabusWeekDto> directly, i.e. `syllabus`
  // IS the weeks array — not an object wrapping it. Handle that first,
  // keep the object-wrapped shapes only as a fallback. ──
  const weeks = useMemo(() => {
    let raw;
    if (Array.isArray(syllabus)) raw = syllabus;
    else if (Array.isArray(syllabus?.syllabusWeeks))
      raw = syllabus.syllabusWeeks;
    else if (Array.isArray(syllabus?.weeks)) raw = syllabus.weeks;
    else if (Array.isArray(syllabus?.modules)) raw = syllabus.modules;
    else raw = [];

    // Normalize session.type casing once, here, so every consumer below
    // (left-nav labels, isSessionPlayable, the video/placeholder branch,
    // TYPE_ICON lookups) sees the same mixed-case strings consistently.
    return raw.map((week) => ({
      ...week,
      modules: (week.modules || []).map((mod) => ({
        ...mod,
        sessions: (mod.sessions || []).map((sess) => ({
          ...sess,
          type: normalizeSessionType(sess.type),
        })),
      })),
    }));
  }, [syllabus]);

  const [expandedWeeks, setExpandedWeeks] = useState(new Set([0]));
  const [selectedSessionKey, setSelectedSessionKey] = useState(null);

  const flatSessions = useMemo(() => {
    const flat = [];
    weeks.forEach((week, wIdx) => {
      (week.modules || []).forEach((mod, mIdx) => {
        (mod.sessions || []).forEach((sess, sIdx) => {
          flat.push({
            key: `${wIdx}-${mIdx}-${sIdx}`,
            weekIdx: wIdx,
            weekTitle: week.title,
            moduleTitle: mod.title,
            ...sess,
          });
        });
      });
    });
    return flat;
  }, [weeks]);

  const selectedSession = useMemo(
    () => flatSessions.find((s) => s.key === selectedSessionKey) || null,
    [flatSessions, selectedSessionKey],
  );

  useEffect(() => {
    if (!selectedSessionKey && flatSessions.length > 0) {
      const firstPlayable = flatSessions.find((s) => isSessionPlayable(s));
      if (firstPlayable) setSelectedSessionKey(firstPlayable.key);
    }
  }, [flatSessions, selectedSessionKey]);

  function isSessionPlayable(sess) {
    if (sess.locked) return false;
    if (sess.type === "Video" && sess.videoStatus !== "READY") return false;
    return true;
  }

  const toggleWeek = (idx) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const handleSelectSession = (sess) => {
    if (!isSessionPlayable(sess)) return;
    setSelectedSessionKey(sess.key);
  };

  const goToNext = () => {
    if (!selectedSession) return;
    const currentIdx = flatSessions.findIndex(
      (s) => s.key === selectedSession.key,
    );
    for (let i = currentIdx + 1; i < flatSessions.length; i++) {
      if (isSessionPlayable(flatSessions[i])) {
        setSelectedSessionKey(flatSessions[i].key);
        return;
      }
    }
  };

  const hasNext = useMemo(() => {
    if (!selectedSession) return false;
    const currentIdx = flatSessions.findIndex(
      (s) => s.key === selectedSession.key,
    );
    return flatSessions.slice(currentIdx + 1).some((s) => isSessionPlayable(s));
  }, [flatSessions, selectedSession]);

  // ── Custom video controls (native <video>, no library dependency) ──
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // ── Quality: only real if the session actually carries multiple
  // sources. Supports either `sess.qualities` or `sess.videoQualities`,
  // each shaped like [{ label: "1080p", url: "...", default?: true }].
  // Falls back to a single "Auto" source (sess.videoUrl) when the
  // backend hasn't sent quality variants — nothing is fabricated. ──
  const availableQualities = useMemo(() => {
    const list = selectedSession?.qualities || selectedSession?.videoQualities;
    return Array.isArray(list) && list.length ? list : null;
  }, [selectedSession]);

  const [currentQuality, setCurrentQuality] = useState(null);
  const pendingRestoreRef = useRef(null);

  const activeVideoUrl = useMemo(() => {
    if (availableQualities && currentQuality) {
      const match = availableQualities.find((q) => q.label === currentQuality);
      if (match) return match.url;
    }
    return selectedSession?.videoUrl;
  }, [availableQualities, currentQuality, selectedSession]);

  useEffect(() => {
    // reset player state whenever the selected session changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackRate(1);
    if (availableQualities) {
      const def =
        availableQualities.find((q) => q.default) || availableQualities[0];
      setCurrentQuality(def.label);
    } else {
      setCurrentQuality(null);
    }
  }, [selectedSessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore playback position/state after a quality switch swaps the
  // <video> src (which otherwise resets time and pauses playback).
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !pendingRestoreRef.current) return;
    const { time, playing } = pendingRestoreRef.current;
    pendingRestoreRef.current = null;
    const onLoaded = () => {
      v.currentTime = time;
      v.playbackRate = playbackRate;
      if (playing) v.play();
      v.removeEventListener("loadedmetadata", onLoaded);
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, [activeVideoUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
    v.playbackRate = playbackRate;
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrentTime(t);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (e) => {
    const v = videoRef.current;
    const vol = Number(e.target.value);
    setVolume(vol);
    if (v) {
      v.volume = vol;
      v.muted = vol === 0;
      setMuted(vol === 0);
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setSettingsView("main");
  };

  const handleQualityChange = (label) => {
    if (label === currentQuality) {
      setSettingsView("main");
      return;
    }
    const v = videoRef.current;
    if (v) {
      pendingRestoreRef.current = { time: v.currentTime, playing: !v.paused };
    }
    setCurrentQuality(label);
    setSettingsView("main");
  };

  const handlePiP = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
      }
    } catch (err) {
      console.error("Picture-in-picture failed", err);
    }
  };

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  };

  // Captions: only enable the toggle if the session actually carries
  // caption/subtitle data — never fabricate captions. When present, an
  // actual <track> is mounted and its mode is flipped on toggle.
  const [captionsOn, setCaptionsOn] = useState(false);
  const captionsUrl =
    selectedSession?.captionsUrl || selectedSession?.captionTracks?.[0]?.url;
  const hasCaptions = Boolean(captionsUrl);

  useEffect(() => {
    setCaptionsOn(false);
  }, [selectedSessionKey]);

  useEffect(() => {
    const track = trackRef.current?.track;
    if (track) track.mode = captionsOn ? "showing" : "hidden";
  }, [captionsOn, activeVideoUrl]);

  // ── Settings dropdown (playback speed + quality) ──
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState("main"); // main | speed | quality
  const settingsRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const onClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
        setSettingsView("main");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [settingsOpen]);

  useEffect(() => {
    setSettingsOpen(false);
    setSettingsView("main");
  }, [selectedSessionKey]);

  // ── Purely visual, local-state only — no backend endpoint exists yet ──
  const [reaction, setReaction] = useState(null); // 'up' | 'down' | null
  const [flagged, setFlagged] = useState(false);

  // ── Right-side collapsible panel (Transcript / Notes / Files) ──
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState("transcript");
  const [notesBySession, setNotesBySession] = useState({});
  const [noteDraft, setNoteDraft] = useState("");
  const [noteSavedFlash, setNoteSavedFlash] = useState(false);
  // ── Transcript tab: fetch + poll + playback sync (additive, Video-only) ──
  const [transcriptState, setTranscriptState] = useState({
    status: null, // null (checking) | "NONE" | "PROCESSING" | "READY" | "FAILED" | "TIMEOUT"
    language: null,
    segments: [],
    errorMessage: null,
  });
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(-1);
  const transcriptPollCountRef = useRef(0);
  const transcriptPollTimerRef = useRef(null);
  const transcriptSessionIdRef = useRef(null);
  const transcriptListRef = useRef(null);
  const transcriptSegmentRefs = useRef([]);

  useEffect(() => {
    setNoteDraft(notesBySession[selectedSessionKey] || "");
    setNoteSavedFlash(false);
  }, [selectedSessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveNote = () => {
    // TODO: persist notes to a backend endpoint once one exists — for now
    // this only lives in component state and is lost on refresh/navigation.
    setNotesBySession((prev) => ({
      ...prev,
      [selectedSessionKey]: noteDraft,
    }));
    setNoteSavedFlash(true);
    setTimeout(() => setNoteSavedFlash(false), 1500);
  };

  // ── TASK 1: fetch transcript when a Video session (with a ready video)
  // is selected, poll while PROCESSING, stop after ~6 attempts (~1 min) ──
  // ── TASK 1: fetch transcript when a Video session (with a ready video)
  // is selected, poll while PROCESSING. Timeout scales with video length
  // instead of a fixed 60s — whisper on CPU genuinely takes several
  // minutes for short videos and can take 15-30+ min for long ones, so a
  // flat 6-attempt/60s cutoff was firing "taking longer than expected" on
  // every video, healthy or not. ──
  const POLL_INTERVAL_MS = 15000; // 15s between polls (was 10s)

  const getMaxPollAttempts = (durationSeconds) => {
    const minMinutes = 10;
    const estimatedMinutes = durationSeconds
      ? Math.ceil((durationSeconds / 60) * 1.5) + 5
      : minMinutes;
    const totalMinutes = Math.max(minMinutes, estimatedMinutes);
    return Math.ceil((totalMinutes * 60 * 1000) / POLL_INTERVAL_MS);
  };

  const pollTranscript = async (sessionId) => {
    let data = null;
    try {
      const res =
        await videoService.getFeaturedSessionVideoTranscript(sessionId);
      data = res.data;
    } catch (err) {
      console.error("Failed to fetch transcript", err);
      data = { status: "FAILED", segments: [] };
    }

    // ignore stale responses if the user has since switched sessions
    if (transcriptSessionIdRef.current !== sessionId) return;

    setTranscriptState({
      status: data?.status || "FAILED",
      language: data?.language || null,
      segments: Array.isArray(data?.segments) ? data.segments : [],
      errorMessage: data?.errorMessage || null,
    });

    if (data?.status === "PROCESSING") {
      transcriptPollCountRef.current += 1;
      const maxAttempts = getMaxPollAttempts(
        selectedSession?.videoDurationSeconds,
      );
      if (transcriptPollCountRef.current < maxAttempts) {
        transcriptPollTimerRef.current = setTimeout(
          () => pollTranscript(sessionId),
          POLL_INTERVAL_MS,
        );
      } else {
        setTranscriptState((prev) => ({ ...prev, status: "TIMEOUT" }));
      }
    }
  };

  useEffect(() => {
    if (transcriptPollTimerRef.current) {
      clearTimeout(transcriptPollTimerRef.current);
      transcriptPollTimerRef.current = null;
    }
    transcriptPollCountRef.current = 0;
    setActiveTranscriptIndex(-1);

    // NOTE: verify the key name — using selectedSession.sessionId, falling
    // back to selectedSession.id. It must match whatever sessionId
    // FeaturedSessionVideo/FeaturedVideoTranscript was saved under in
    // video-service. Adjust this one line if your syllabus DTO uses a
    // different field name.
    const sessionId = selectedSession?.id ?? null;
    transcriptSessionIdRef.current = sessionId;

    const eligible =
      selectedSession?.type === "Video" &&
      selectedSession?.videoStatus === "READY" &&
      sessionId != null;

    if (!eligible) {
      setTranscriptState({
        status: null,
        language: null,
        segments: [],
        errorMessage: null,
      });
      return;
    }

    pollTranscript(sessionId);

    return () => {
      if (transcriptPollTimerRef.current) {
        clearTimeout(transcriptPollTimerRef.current);
        transcriptPollTimerRef.current = null;
      }
    };
  }, [selectedSessionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefreshTranscript = () => {
    const sessionId = selectedSession?.id ?? null;
    if (sessionId == null) return;
    transcriptPollCountRef.current = 0;
    pollTranscript(sessionId);
  };

  // ── TASK 3: sync highlight during playback, only while the Transcript
  // tab is actually open (avoids an idle listener during normal viewing) ──
  useEffect(() => {
    const shouldListen =
      sidePanelOpen &&
      activeSideTab === "transcript" &&
      transcriptState.status === "READY" &&
      transcriptState.segments.length > 0;

    const v = videoRef.current;
    if (!shouldListen || !v) {
      setActiveTranscriptIndex(-1);
      return;
    }

    const handleTranscriptTimeUpdate = () => {
      const t = v.currentTime;
      const segments = transcriptState.segments;
      let idx = -1;
      for (let i = 0; i < segments.length; i++) {
        if (t >= segments[i].startSeconds && t < segments[i].endSeconds) {
          idx = i;
          break;
        }
      }
      setActiveTranscriptIndex((prev) => (prev === idx ? prev : idx));
    };

    v.addEventListener("timeupdate", handleTranscriptTimeUpdate);
    handleTranscriptTimeUpdate(); // correct highlight immediately on tab open

    return () =>
      v.removeEventListener("timeupdate", handleTranscriptTimeUpdate);
  }, [
    sidePanelOpen,
    activeSideTab,
    transcriptState.status,
    transcriptState.segments,
    activeVideoUrl,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-scroll the transcript panel to keep the highlighted segment in
  // view, but only when it isn't already visible (don't fight manual scroll)
  useEffect(() => {
    if (activeTranscriptIndex < 0) return;
    const container = transcriptListRef.current;
    const el = transcriptSegmentRefs.current[activeTranscriptIndex];
    if (!container || !el) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const isVisible =
      elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom;

    if (!isVisible) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeTranscriptIndex]);

  const handleTranscriptSegmentClick = (seg) => {
    const v = videoRef.current;
    if (!v) return;
    const wasPlaying = isPlaying;
    v.currentTime = seg.startSeconds;
    setCurrentTime(seg.startSeconds);
    if (wasPlaying) v.play();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-black">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Loading course…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F5F7FA] dark:bg-black">
        <p className="text-red-500 text-sm font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-[#F97316] hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F5F7FA] dark:bg-black text-[#0F172A] dark:text-white overflow-hidden font-sans antialiased">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-[#F97316] transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
        <p className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white truncate">
          Course Player
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ══════════════ LEFT PANEL — Coursera-style syllabus nav ══════════════ */}
        <div className="w-full sm:w-80 md:w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
          {weeks.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-8 px-4">
              No syllabus content available yet.
            </p>
          )}
          {weeks.map((week, wIdx) => {
            const isOpen = expandedWeeks.has(wIdx);
            return (
              <div
                key={wIdx}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <button
                  onClick={() => toggleWeek(wIdx)}
                  className="w-full flex items-center gap-2.5 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <span className="w-6 h-6 bg-[#0F172A] dark:bg-[#F97316] text-white rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {wIdx + 1}
                  </span>
                  <span className="flex-1 text-[13.5px] font-bold text-gray-900 dark:text-gray-100 truncate">
                    {week.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-gray-400 flex-shrink-0"
                    />
                  )}
                </button>

                {isOpen && (
                  <div className="pb-2">
                    {(week.modules || []).map((mod, mIdx) => (
                      <div key={mIdx} className="px-4 mb-1.5">
                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 px-2 py-1.5 uppercase tracking-wider">
                          {mod.title}
                        </p>
                        <div className="space-y-0.5">
                          {(mod.sessions || []).map((sess, sIdx) => {
                            const key = `${wIdx}-${mIdx}-${sIdx}`;
                            const playable = isSessionPlayable(sess);
                            const isSelected = key === selectedSessionKey;
                            // const videoNotReady =
                            //   sess.type === "Video" &&
                            //   sess.videoStatus !== "READY" &&
                            //   !sess.locked;
                            // ── EXTENDED (was video-only) to also cover
                            // Reading sessions whose file isn't ready yet,
                            // same boolean/badge reused for both. ──
                            const contentNotReady =
                              (sess.type === "Video" &&
                                sess.videoStatus !== "READY" &&
                                !sess.locked) ||
                              (sess.type === "Reading" &&
                                sess.fileStatus !== "READY" &&
                                !sess.locked);
                            return (
                              <button
                                key={key}
                                onClick={() =>
                                  handleSelectSession({ key, ...sess })
                                }
                                disabled={!playable}
                                className={[
                                  "w-full flex items-start gap-3 px-2.5 py-2.5 rounded-lg text-left transition-colors",
                                  isSelected
                                    ? "bg-[#F97316]/10"
                                    : playable
                                      ? "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                                      : "cursor-not-allowed",
                                ].join(" ")}
                              >
                                {sess.type === "Video" &&
                                  sess.videoThumbnailUrl && (
                                    <img
                                      src={sess.videoThumbnailUrl}
                                      alt=""
                                      className="w-10 h-7 rounded object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0 mt-0.5"
                                    />
                                  )}
                                {/* fixed-width status indicator column */}
                                <span className="w-5 flex-shrink-0 flex items-center justify-center pt-0.5">
                                  {sess.locked ? (
                                    <Lock
                                      size={15}
                                      className="text-gray-300 dark:text-gray-600"
                                    />
                                  ) : isSelected ? (
                                    <span className="w-4 h-4 rounded-full bg-[#F97316] flex items-center justify-center flex-shrink-0">
                                      <Check
                                        size={11}
                                        className="text-white"
                                        strokeWidth={3}
                                      />
                                    </span>
                                  ) : (
                                    <span
                                      className={[
                                        "w-4 h-4 rounded-full border-2 flex-shrink-0",
                                        playable
                                          ? "border-gray-300 dark:border-gray-600"
                                          : "border-gray-200 dark:border-gray-700",
                                      ].join(" ")}
                                    />
                                  )}
                                </span>

                                {/* two-line text */}
                                <span className="flex-1 min-w-0">
                                  <span
                                    className={[
                                      "block text-[13px] leading-snug truncate",
                                      isSelected
                                        ? "text-[#F97316] font-semibold"
                                        : playable
                                          ? "text-gray-700 dark:text-gray-200 font-medium"
                                          : "text-gray-300 dark:text-gray-600 font-medium",
                                    ].join(" ")}
                                  >
                                    {sess.title}
                                  </span>
                                  <span
                                    className={[
                                      "block text-[11.5px] mt-0.5 truncate",
                                      playable
                                        ? "text-gray-400 dark:text-gray-500"
                                        : "text-gray-300 dark:text-gray-600",
                                    ].join(" ")}
                                  >
                                    {sess.type}
                                    {formatDurationLabel(sess)
                                      ? ` • ${formatDurationLabel(sess)}`
                                      : ""}
                                    {contentNotReady ? " • Coming soon" : ""}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════ RIGHT — video player + collapsible side panel ══════════════ */}
        <div className="flex-1 flex overflow-hidden bg-[#F5F7FA] dark:bg-black">
          <div className="flex-1 overflow-y-auto">
            {!selectedSession ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400 font-medium">
                  Select a session from the syllabus to begin.
                </p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 sm:p-5">
                  {/* side-panel toggle, top-right of the player area */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => setSidePanelOpen((v) => !v)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#F97316] transition-colors px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <MessageSquare size={13} />
                      {sidePanelOpen
                        ? "Hide panel"
                        : "Transcript / Notes / Files"}
                    </button>
                  </div>

                  {selectedSession.type === "Video" ? (
                    <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-4 group">
                      <video
                        key={activeVideoUrl}
                        ref={videoRef}
                        src={activeVideoUrl}
                        poster={selectedSession.videoThumbnailUrl || undefined}
                        className="w-full h-full"
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        {hasCaptions && (
                          <track
                            ref={trackRef}
                            kind="subtitles"
                            src={captionsUrl}
                            srcLang="en"
                            label="English"
                          />
                        )}
                      </video>

                      {/* custom control bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-6 pb-2.5">
                        <input
                          type="range"
                          min={0}
                          max={duration || 0}
                          step={0.1}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 mb-2 accent-[#F97316] cursor-pointer"
                        />
                        <div className="flex items-center gap-3">
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-[#F97316] transition-colors"
                            aria-label={isPlaying ? "Pause" : "Play"}
                          >
                            {isPlaying ? (
                              <Pause size={18} />
                            ) : (
                              <Play size={18} />
                            )}
                          </button>

                          <button
                            onClick={toggleMute}
                            className="text-white hover:text-[#F97316] transition-colors"
                            aria-label={muted ? "Unmute" : "Mute"}
                          >
                            {muted || volume === 0 ? (
                              <VolumeX size={17} />
                            ) : (
                              <Volume2 size={17} />
                            )}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={muted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 accent-[#F97316] cursor-pointer"
                          />

                          <span className="text-[11px] text-white/90 font-medium tabular-nums">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>

                          <div className="flex-1" />

                          <button
                            onClick={() =>
                              hasCaptions && setCaptionsOn((v) => !v)
                            }
                            disabled={!hasCaptions}
                            className={[
                              "text-white transition-colors",
                              hasCaptions
                                ? "hover:text-[#F97316]"
                                : "opacity-30 cursor-not-allowed",
                              captionsOn ? "text-[#F97316]" : "",
                            ].join(" ")}
                            aria-label="Toggle captions"
                            title={
                              hasCaptions
                                ? "Toggle captions"
                                : "No captions available"
                            }
                          >
                            <FileText size={16} />
                          </button>

                          {/* ── Settings: playback speed + quality ── */}
                          <div className="relative" ref={settingsRef}>
                            <button
                              onClick={() => {
                                setSettingsOpen((v) => !v);
                                setSettingsView("main");
                              }}
                              className={[
                                "text-white transition-colors",
                                settingsOpen
                                  ? "text-[#F97316]"
                                  : "hover:text-[#F97316]",
                              ].join(" ")}
                              aria-label="Settings"
                            >
                              <Settings size={16} />
                            </button>

                            {settingsOpen && (
                              <div className="absolute bottom-8 right-0 w-48 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden text-xs z-20">
                                {settingsView === "main" && (
                                  <div className="py-1">
                                    <button
                                      onClick={() => setSettingsView("speed")}
                                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <span className="flex items-center gap-2 font-medium">
                                        <Gauge size={13} />
                                        Playback speed
                                      </span>
                                      <span className="flex items-center gap-0.5 text-gray-400">
                                        {playbackRate === 1
                                          ? "Normal"
                                          : `${playbackRate}x`}
                                        <ChevronRight size={13} />
                                      </span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        availableQualities &&
                                        setSettingsView("quality")
                                      }
                                      disabled={!availableQualities}
                                      className={[
                                        "w-full flex items-center justify-between px-3 py-2 transition-colors",
                                        availableQualities
                                          ? "hover:bg-gray-50 dark:hover:bg-gray-800"
                                          : "opacity-40 cursor-not-allowed",
                                      ].join(" ")}
                                    >
                                      <span className="font-medium">
                                        Quality
                                      </span>
                                      <span className="flex items-center gap-0.5 text-gray-400">
                                        {currentQuality || "Auto"}
                                        {availableQualities && (
                                          <ChevronRight size={13} />
                                        )}
                                      </span>
                                    </button>
                                  </div>
                                )}

                                {settingsView === "speed" && (
                                  <div className="py-1">
                                    <button
                                      onClick={() => setSettingsView("main")}
                                      className="w-full flex items-center gap-1.5 px-3 py-2 font-semibold border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <ChevronLeft size={13} />
                                      Playback speed
                                    </button>
                                    {SPEED_OPTIONS.map((rate) => (
                                      <button
                                        key={rate}
                                        onClick={() => handleSpeedChange(rate)}
                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                      >
                                        <span>
                                          {rate === 1 ? "Normal" : `${rate}x`}
                                        </span>
                                        {playbackRate === rate && (
                                          <Check
                                            size={13}
                                            className="text-[#F97316]"
                                          />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                )}

                                {settingsView === "quality" &&
                                  availableQualities && (
                                    <div className="py-1">
                                      <button
                                        onClick={() => setSettingsView("main")}
                                        className="w-full flex items-center gap-1.5 px-3 py-2 font-semibold border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                      >
                                        <ChevronLeft size={13} />
                                        Quality
                                      </button>
                                      {availableQualities.map((q) => (
                                        <button
                                          key={q.label}
                                          onClick={() =>
                                            handleQualityChange(q.label)
                                          }
                                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                          <span>{q.label}</span>
                                          {currentQuality === q.label && (
                                            <Check
                                              size={13}
                                              className="text-[#F97316]"
                                            />
                                          )}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={handlePiP}
                            className="text-white hover:text-[#F97316] transition-colors"
                            aria-label="Picture in picture"
                            title="Picture in picture"
                          >
                            <PictureInPicture2 size={16} />
                          </button>

                          <button
                            onClick={handleFullscreen}
                            className="text-white hover:text-[#F97316] transition-colors"
                            aria-label="Fullscreen"
                          >
                            <Maximize size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : //   ) : selectedSession.type === "Reading" ? (

                  selectedSession.type === "Reading" ? (
                    selectedSession.fileStatus === "READY" &&
                    selectedSession.fileUrl ? (
                      isPdfUrl(selectedSession.fileUrl) ? (
                        <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 h-[80vh] min-h-[600px] mb-4">
                          <iframe
                            src={selectedSession.fileUrl}
                            title={selectedSession.title}
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 aspect-video mb-4 flex flex-col items-center justify-center gap-3">
                          <FileText size={40} className="text-[#F97316]" />
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-xs text-center px-4 truncate">
                            {selectedSession.fileName || "Reading material"}
                          </p>
                          <a
                            href={selectedSession.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#F97316] text-white text-sm font-semibold hover:brightness-110 transition"
                          >
                            Open File
                          </a>
                        </div>
                      )
                    ) : (
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 aspect-video mb-4 flex flex-col items-center justify-center gap-3">
                        <BookOpen size={40} className="text-[#F97316]" />
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                          Reading material
                        </p>
                        <p className="text-xs text-gray-400 max-w-xs text-center px-4">
                          This reading material isn't available yet.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 aspect-video mb-4 flex flex-col items-center justify-center gap-3">
                      {React.createElement(
                        TYPE_ICON[selectedSession.type] || FileText,
                        { size: 40, className: "text-[#F97316]" },
                      )}
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {selectedSession.type} content
                      </p>
                      <p className="text-xs text-gray-400 max-w-xs text-center px-4">
                        Full {selectedSession.type.toLowerCase()} rendering is
                        coming soon. This session will be available here
                        shortly.
                      </p>
                    </div>
                  )}

                  {/* title row */}
                  {/* title row */}
                  {/* title row */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#F97316] mb-1.5">
                        {selectedSession.weekTitle} &middot;{" "}
                        {selectedSession.moduleTitle}
                      </p>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                        {selectedSession.title || selectedSession.title}
                      </h2>
                      {selectedSession.videoDescription && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                          {selectedSession.videoDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* thin action row — like / dislike / flag (visual only) */}
                  <div className="flex items-center gap-5 py-3 border-b border-gray-100 dark:border-gray-800 mb-4">
                    <button
                      onClick={() =>
                        setReaction((r) => (r === "up" ? null : "up"))
                      }
                      className={[
                        "transition-colors",
                        reaction === "up"
                          ? "text-[#F97316]"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                      ].join(" ")}
                      aria-label="Like"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setReaction((r) => (r === "down" ? null : "down"))
                      }
                      className={[
                        "transition-colors",
                        reaction === "down"
                          ? "text-[#F97316]"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                      ].join(" ")}
                      aria-label="Dislike"
                    >
                      <ThumbsDown size={16} />
                    </button>
                    <button
                      onClick={() => setFlagged((f) => !f)}
                      className={[
                        "transition-colors",
                        flagged
                          ? "text-red-500"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                      ].join(" ")}
                      aria-label="Flag"
                    >
                      <Flag size={16} />
                    </button>
                  </div>

                  {/* Go to next item — bottom right, under the video, not floating */}
                  <div className="flex justify-end">
                    <button
                      onClick={goToNext}
                      disabled={!hasNext}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#F97316] text-white text-sm font-semibold hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Go to next item
                      <SkipForward size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible right side panel: Transcript / Notes / Files */}
          {sidePanelOpen && selectedSession && (
            <div className="w-72 md:w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {SIDE_TABS.find((t) => t.id === activeSideTab)?.label}
                </span>
                <button
                  onClick={() => setSidePanelOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeSideTab === "transcript" &&
                  (selectedSession.type !== "Video" ? (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Transcript is only available for video sessions.
                    </p>
                  ) : transcriptState.status === "READY" ? (
                    transcriptState.segments.length > 0 ? (
                      <div
                        ref={transcriptListRef}
                        className="flex flex-col gap-0.5 -mx-1"
                      >
                        {transcriptState.segments.map((seg, idx) => {
                          const isActive = idx === activeTranscriptIndex;
                          return (
                            <button
                              key={idx}
                              ref={(el) =>
                                (transcriptSegmentRefs.current[idx] = el)
                              }
                              onClick={() => handleTranscriptSegmentClick(seg)}
                              className={[
                                "flex items-start gap-2.5 text-left px-2 py-1.5 rounded-lg transition-colors",
                                isActive
                                  ? "bg-[#F97316]/10 text-gray-900 dark:text-white font-semibold"
                                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60",
                              ].join(" ")}
                            >
                              <span className="text-[11px] font-semibold text-[#F97316] tabular-nums mt-0.5 flex-shrink-0">
                                {formatTime(seg.startSeconds)}
                              </span>
                              <span className="text-[13px] leading-relaxed">
                                {seg.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-8">
                        Transcript unavailable for this video.
                      </p>
                    )
                  ) : transcriptState.status === "TIMEOUT" ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <p className="text-xs text-gray-400 text-center px-4">
                        Transcript is taking longer than expected.
                      </p>
                      <button
                        onClick={handleRefreshTranscript}
                        className="text-xs font-semibold text-[#F97316] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : //   ) : transcriptState.status === "PROCESSING" ||
                  //     transcriptState.status === null ? (
                  transcriptState.status === "PROCESSING" ||
                    transcriptState.status === "NONE" ||
                    transcriptState.status === null ? (
                    <div className="flex flex-col items-center gap-2 py-8">
                      <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                      <p className="text-xs text-gray-400 text-center">
                        Generating transcript…
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Transcript unavailable for this video.
                    </p>
                  ))}

                {activeSideTab === "notes" && (
                  <div className="flex flex-col gap-2.5">
                    <textarea
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Type your note here…"
                      rows={8}
                      className="w-full text-[13px] rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent p-2.5 outline-none focus:border-[#F97316] resize-none text-gray-800 dark:text-gray-100"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="self-start flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F97316] text-white hover:brightness-110 transition"
                    >
                      <Save size={13} />
                      Save note
                    </button>
                    {noteSavedFlash && (
                      <span className="text-[11px] text-emerald-500 font-medium">
                        Saved locally
                      </span>
                    )}
                    {/* TODO: persist notes to a backend endpoint once one exists */}
                  </div>
                )}

                {activeSideTab === "files" &&
                  (selectedSession.files && selectedSession.files.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedSession.files.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-gray-200"
                        >
                          <Paperclip
                            size={13}
                            className="text-gray-400 flex-shrink-0"
                          />
                          <span className="truncate">{f.name || f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-8">
                      No files attached.
                    </p>
                  ))}
              </div>

              {/* vertical tab switcher, Coursera-style */}
              <div className="flex border-t border-gray-100 dark:border-gray-800">
                {SIDE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeSideTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSideTab(tab.id)}
                      className={[
                        "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                        active
                          ? "text-[#F97316] bg-[#F97316]/5"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                      ].join(" ")}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
