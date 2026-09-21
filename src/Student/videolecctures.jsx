//student page video lectures
import React, { useEffect, useRef, useState, useCallback } from "react";
import videoService from "../services/videoService";
import { progressService } from "../services/progressService";
import {
  BookOpen,
  Check,
  CheckCircle,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Film,
  Grid,
  Layers,
  Lock,
  Pause,
  Play,
  Search,
  Settings,
  SkipForward,
  TrendingUp,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";

// ── Same Global Design System the Dashboard (Golden Reference),
// MyCourses, and StudentCourseView use. Tokens, StatCard, and
// PageContainer are the single source of truth for every page — the
// old vl-* CSS injection and its own indigo palette are gone.
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  StatCard,
  PageContainer,
} from "@/design-system";

/* ══════════════════════════════════════════════════════════════════
   NOTE ON THE AUTO-COMPLETE BEHAVIOR (unchanged from original)
   ────────────────────────────────────────────────────────────────
   - There is no manual "Mark as Watched" button.
   - Watch progress is tracked automatically:
       • Uploaded / direct file videos (<video> tag)  -> onTimeUpdate
       • YouTube embeds                               -> YouTube IFrame API
       • Vimeo embeds                                 -> Vimeo postMessage API
   - As soon as a student has watched >= 80% of a lecture, we call
     progressService.markVideoWatched(...) exactly ONCE for that video.
   - A "watchedFiredRef" (a Set) guards against firing the API call
     more than once per video per session.
═══════════════════════════════════════════════════════════════════ */

const AUTO_COMPLETE_THRESHOLD = 0.8; // 80%

// Accent used for the "active" state across the app (chat, hero dot,
// StudentCourseView active module, etc.) — reused here instead of the
// page's old one-off indigo (#4f46e5) so the active lecture, ring, and
// scrubber all read as the same accent as the rest of the LMS.
const ACCENT = "#7c3aed";
const VIDEO_COLOR = "#22d3ee"; // same video accent StudentCourseView uses

/* ─── Small scoped CSS — only for things inline styles truly can't do:
   the two-column responsive collapse, the range-input thumb (::-webkit
   pseudo-elements aren't reachable via inline style), and the list's
   scrollbar. Everything else (colors, spacing, cards) is inline + t. ─── */
const SCOPED_CSS = `
  .vl-body { display: flex; gap: 20px; align-items: flex-start; }
  .vl-sidebar { width: 340px; flex-shrink: 0; }
  .vl-main { flex: 1; min-width: 0; }
  .vl-list::-webkit-scrollbar { width: 5px; }
  .vl-list::-webkit-scrollbar-thumb { background: var(--vl-scroll-thumb); border-radius: 4px; }
  .vl-scrub { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 4px; cursor: pointer; outline: none; }
  .vl-scrub::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 0 3px rgba(124,58,237,0.5); }
  .vl-scrub::-moz-range-thumb { width: 13px; height: 13px; border-radius: 50%; background: #fff; cursor: pointer; border: none; box-shadow: 0 0 0 3px rgba(124,58,237,0.5); }
  .vl-transcript::-webkit-scrollbar { width: 5px; }
  .vl-transcript::-webkit-scrollbar-thumb { background: var(--vl-scroll-thumb); border-radius: 4px; }
  @media (max-width: 1024px) {
    .vl-body { flex-direction: column; }
    .vl-sidebar { width: 100%; }
  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById("vl-scoped-styles")
) {
  const tag = document.createElement("style");
  tag.id = "vl-scoped-styles";
  tag.textContent = SCOPED_CSS;
  document.head.appendChild(tag);
}

/* ─── URL → embed parsing (adds jsapi flags so we can track progress) ─── */
const parseVideoUrl = (rawUrl) => {
  if (!rawUrl || !rawUrl.trim()) return null;
  const url = rawUrl.trim();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const ytWatch = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/,
  );
  const ytShorts = url.match(/youtube\.com\/shorts\/([\w-]{11})/);
  const ytEmbed = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (ytWatch || ytShorts || ytEmbed) {
    const id = (ytWatch || ytShorts || ytEmbed)[1];
    return {
      type: "youtube",
      id,
      url: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`,
    };
  }

  const vimeo = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/);
  if (vimeo) {
    return {
      type: "vimeo",
      id: vimeo[1],
      url: `https://player.vimeo.com/video/${vimeo[1]}?api=1`,
    };
  }

  if (url.includes("youtube.com/embed/")) {
    const sep = url.includes("?") ? "&" : "?";
    return {
      type: "youtube",
      url: `${url}${sep}enablejsapi=1&origin=${encodeURIComponent(origin)}`,
    };
  }
  if (url.includes("player.vimeo.com/video/")) {
    const sep = url.includes("?") ? "&" : "?";
    return { type: "vimeo", url: `${url}${sep}api=1` };
  }

  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url))
    return { type: "file", url };
  return { type: "file", url };
};

const getVideoSourceUrl = (video) =>
  video
    ? video.videoUrl ||
      video.originalUrl ||
      video.sourceUrl ||
      video.url ||
      video.embedUrl ||
      null
    : null;

const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
};

const formatTime = (s) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

/* ═══════════ Small ring/progress visual helper ═══════════ */
const Ring = ({ size, stroke, pct, color, track }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={track}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset .4s ease",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
    </svg>
  );
};

/* ═══════════ MAIN COMPONENT ═══════════
   All fetch/streaming/progress-tracking logic below is unchanged from
   the original; only the JSX/markup further down was migrated to the
   shared design system. Transcript feature (polling, segment sync,
   panel UI) ported in from the legacy version and restyled with t
   tokens. ═══════════ */
const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const [watchedVideoIds, setWatchedVideoIds] = useState([]);
  const [watchPercentage, setWatchPercentage] = useState(0);

  // live in-progress percentage for the currently open video (sidebar %)
  const [liveProgress, setLiveProgress] = useState({}); // { [videoId]: 0-100 }

  const [search, setSearch] = useState("");
  const [loadingVideoId, setLoadingVideoId] = useState(null);
  const [lockedCount, setLockedCount] = useState(0);

  // player UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);

  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const pollRef = useRef(null);

  // guards against firing "mark watched" more than once per video/session
  const watchedFiredRef = useRef(new Set());

  const studentEmail = getEmailFromToken();

  /* ── dark mode detection identical to Dashboard/MyCourses/StudentCourseView ── */
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

  // ── Transcript tab ──
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [transcriptState, setTranscriptState] = useState({
    status: null,
    segments: [],
  });
  const [activeSegIdx, setActiveSegIdx] = useState(-1);
  const transcriptPollCountRef = useRef(0);
  const transcriptPollTimerRef = useRef(null);
  const transcriptVideoIdRef = useRef(null);

  const getMaxPollAttempts = () => {
    const POLL_INTERVAL_MS = 15000;
    return Math.ceil((10 * 60000) / POLL_INTERVAL_MS); // 10 min minimum window
  };

  const pollTranscript = async (videoId) => {
    let data = null;
    try {
      const res = await videoService.getVideoTranscript(videoId);
      data = res.data;
    } catch {
      data = { status: "FAILED", segments: [] };
    }
    if (transcriptVideoIdRef.current !== videoId) return;

    setTranscriptState({
      status: data?.status || "FAILED",
      segments: Array.isArray(data?.segments) ? data.segments : [],
    });

    if (data?.status === "PROCESSING" || data?.status === "NONE") {
      transcriptPollCountRef.current += 1;
      if (transcriptPollCountRef.current < getMaxPollAttempts()) {
        transcriptPollTimerRef.current = setTimeout(
          () => pollTranscript(videoId),
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
    transcriptVideoIdRef.current = playingId;

    if (playingId == null) {
      setTranscriptState({ status: null, segments: [] });
      return;
    }
    pollTranscript(playingId);

    return () => {
      if (transcriptPollTimerRef.current)
        clearTimeout(transcriptPollTimerRef.current);
    };
  }, [playingId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Segment sync is only meaningful for native <video> playback (uploaded
  // files / direct mp4 sources) — YouTube/Vimeo iframes don't expose a
  // DOM timeupdate event we can attach to here.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || transcriptState.status !== "READY") return;
    const onTime = () => {
      const tt = v.currentTime;
      const idx = transcriptState.segments.findIndex(
        (s) => tt >= s.startSeconds && tt < s.endSeconds,
      );
      setActiveSegIdx(idx);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [transcriptState.status, transcriptState.segments]);

  const seekToSegment = (seg) => {
    const v = videoRef.current;
    if (v) v.currentTime = seg.startSeconds;
    else if (ytPlayerRef.current?.seekTo)
      ytPlayerRef.current.seekTo(seg.startSeconds, true);
    else if (iframeRef.current)
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ method: "setCurrentTime", value: seg.startSeconds }),
        "*",
      );
    setCurrentTime(seg.startSeconds);
  };

  const fmtTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ── Load videos + progress ── */
  /* ── Load videos + progress ── */
  useEffect(() => {
    videoService
      .getStudentVideos()
      .then(async (res) => {
        const data = res.data || [];
        setVideos(data);
        if (data.length > 0 && studentEmail) {
          try {
            const prog = await progressService.getVideoProgress(
              studentEmail,
              data[0].batchId,
            );
            setWatchedVideoIds(prog.data.watchedVideoIds || []);
            setWatchPercentage(prog.data.watchPercentage || 0);
          } catch {
            setWatchedVideoIds([]);
            setWatchPercentage(0);
          }
        }
      })
      .catch(console.error);

    videoService
      .getStudentVideoCount()
      .then((res) => {
        const { totalCount = 0, visibleCount = 0 } = res.data || {};
        setLockedCount(Math.max(0, totalCount - visibleCount));
      })
      .catch(() => setLockedCount(0));
  }, []);

  useEffect(() => {
    watchedVideoIds.forEach((id) => watchedFiredRef.current.add(id));
  }, [watchedVideoIds]);

  const selectedVideo = videos.find((v) => v.id === playingId);
  const totalMinutes = Math.round(
    videos.reduce((acc, v) => acc + (v.durationSeconds || v.duration || 0), 0) /
      60,
  );

  /* ── Core: auto mark-as-watched once threshold is crossed ── */
  const maybeAutoComplete = useCallback(
    (videoId, percent /* 0-1 */) => {
      const pct = Math.max(0, Math.min(1, percent));
      setLiveProgress((prev) => ({
        ...prev,
        [videoId]: Math.round(pct * 100),
      }));

      if (pct < AUTO_COMPLETE_THRESHOLD) return;
      if (watchedFiredRef.current.has(videoId)) return;

      const video = videos.find((v) => v.id === videoId);
      if (!video || !studentEmail) return;

      watchedFiredRef.current.add(videoId); // fire once
      progressService
        .markVideoWatched(studentEmail, video.batchId, video.id, videos.length)
        .then((res) => {
          setWatchedVideoIds(res.data.watchedVideoIds || []);
          setWatchPercentage(res.data.watchPercentage || 0);
        })
        .catch((err) => {
          console.error("Auto mark-as-watched failed", err);
          watchedFiredRef.current.delete(videoId); // allow retry
        });
    },
    [videos, studentEmail],
  );

  /* ── Play a video ── */
  const playVideo = async (video) => {
    if (video.locked) return;
    setHasStartedPlaying(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    const sourceUrl = getVideoSourceUrl(video);

    if (sourceUrl) {
      setPlayingId(video.id);
      return;
    }
    if (!videoUrls[video.id]) {
      if (!video.id) {
        alert("Video source not found");
        return;
      }
      try {
        setLoadingVideoId(video.id);
        setPlayingId(video.id);
        const { url } = await videoService.getVideoBlob(video.id); // now id-based
        setVideoUrls((prev) => ({ ...prev, [video.id]: url })); // direct S3 URL, no blob/objectURL needed
      } catch {
        alert("Unable to play video");
        setPlayingId(null);
      } finally {
        setLoadingVideoId(null);
      }
    } else {
      setPlayingId(video.id);
    }
  };

  const startPlaying = () => {
    setHasStartedPlaying(true);
    setIsPlaying(true);
    requestAnimationFrame(() => {
      if (videoRef.current) videoRef.current.play().catch(() => {});
    });
  };

  const togglePlay = () => {
    if (!hasStartedPlaying) {
      startPlaying();
      return;
    }
    if (videoRef.current) {
      isPlaying
        ? videoRef.current.pause()
        : videoRef.current.play().catch(() => {});
    } else if (ytPlayerRef.current) {
      isPlaying
        ? ytPlayerRef.current.pauseVideo()
        : ytPlayerRef.current.playVideo();
    }
    setIsPlaying((p) => !p);
  };

  const playNext = () => {
    const idx = videos.findIndex((v) => v.id === playingId);
    if (idx > -1 && idx < videos.length - 1 && !videos[idx + 1].locked) {
      playVideo(videos[idx + 1]);
    }
  };

  /* ══════ Native <video> auto-tracking (uploaded files / direct mp4) ══════ */
  const onNativeTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    setCurrentTime(el.currentTime);
    setDuration(el.duration);
    maybeAutoComplete(playingId, el.currentTime / el.duration);
  };
  const onNativeLoadedMeta = () => {
    if (videoRef.current) setDuration(videoRef.current.duration || 0);
  };
  const onNativeEnded = () => {
    setIsPlaying(false);
    maybeAutoComplete(playingId, 1);
  };

  /* ══════ YouTube IFrame API auto-tracking ══════ */
  useEffect(() => {
    const sourceUrl = getVideoSourceUrl(selectedVideo);
    const parsed = sourceUrl ? parseVideoUrl(sourceUrl) : null;
    if (!hasStartedPlaying || !parsed || parsed.type !== "youtube") return;

    let destroyed = false;

    const setupPlayer = () => {
      if (destroyed || !iframeRef.current || !window.YT || !window.YT.Player)
        return;
      ytPlayerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            pollRef.current = setInterval(() => {
              const p = ytPlayerRef.current;
              if (!p || typeof p.getDuration !== "function") return;
              const d = p.getDuration();
              const tt = p.getCurrentTime();
              if (d > 0) {
                setDuration(d);
                setCurrentTime(tt);
                maybeAutoComplete(playingId, tt / d);
              }
            }, 1000);
          },
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              maybeAutoComplete(playingId, 1);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const existing = document.getElementById("yt-iframe-api");
      if (!existing) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === "function") prevReady();
        setupPlayer();
      };
    }

    return () => {
      destroyed = true;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      ytPlayerRef.current = null;
    };
  }, [hasStartedPlaying, playingId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ══════ Vimeo postMessage auto-tracking ══════ */
  useEffect(() => {
    const sourceUrl = getVideoSourceUrl(selectedVideo);
    const parsed = sourceUrl ? parseVideoUrl(sourceUrl) : null;
    if (!hasStartedPlaying || !parsed || parsed.type !== "vimeo") return;

    const handler = (e) => {
      if (typeof e.data !== "string" || !e.origin.includes("vimeo.com")) return;
      let data;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }
      if (data.event === "ready" && iframeRef.current) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
          "*",
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ method: "addEventListener", value: "play" }),
          "*",
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ method: "addEventListener", value: "pause" }),
          "*",
        );
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ method: "addEventListener", value: "finish" }),
          "*",
        );
      }
      if (data.event === "timeupdate" && data.data?.duration) {
        const { seconds, duration: d } = data.data;
        setCurrentTime(seconds);
        setDuration(d);
        maybeAutoComplete(playingId, seconds / d);
      }
      if (data.event === "play") setIsPlaying(true);
      if (data.event === "pause") setIsPlaying(false);
      if (data.event === "finish") {
        setIsPlaying(false);
        maybeAutoComplete(playingId, 1);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [hasStartedPlaying, playingId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── helper metadata ── */
  const getVideoMeta = (v) => {
    let tags = [];
    if (Array.isArray(v?.tags)) tags = v.tags.filter(Boolean);
    else if (typeof v?.tags === "string" && v.tags.trim())
      tags = v.tags
        .split(",")
        .map((tg) => tg.trim())
        .filter(Boolean);
    return {
      desc: v?.description || v?.shortDesc || "",
      category: v?.category || "General",
      language: v?.language || "",
      level: v?.level || "Beginner",
      tags,
    };
  };

  const filteredVideos = videos.filter((v) => {
    if (!search.trim()) return true;
    const title = (v.title || v.originalFileName || "").toLowerCase();
    return title.includes(search.toLowerCase());
  });

  const selectedIdx = videos.findIndex((v) => v.id === playingId);
  const nextVideo = selectedIdx > -1 ? videos[selectedIdx + 1] : null;
  const meta = selectedVideo ? getVideoMeta(selectedVideo) : null;
  const isWatched = selectedVideo
    ? watchedVideoIds.includes(selectedVideo.id)
    : false;
  const overallPct = videos.length
    ? Math.round((watchedVideoIds.length / videos.length) * 100)
    : 0;

  const scrubPct =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const seek = (pct) => {
    const tt = duration * (pct / 100);
    if (videoRef.current) videoRef.current.currentTime = tt;
    else if (ytPlayerRef.current?.seekTo) ytPlayerRef.current.seekTo(tt, true);
    else if (iframeRef.current)
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ method: "setCurrentTime", value: tt }),
        "*",
      );
    setCurrentTime(tt);
  };

  const changeSpeed = () => {
    const options = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const next = options[(options.indexOf(speed) + 1) % options.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const requestFullscreen = () => {
    const el = document.querySelector(".vl-player-card");
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  /* stat cards — same StatCard component + colorKey scheme as the rest of the app */
  const stats = [
    {
      label: "Total Lectures",
      numericValue: videos.length,
      change: totalMinutes
        ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m total`
        : "—",
      trend: "up",
      icon: Film,
      colorKey: "blue",
    },
    {
      label: "Completed",
      numericValue: watchedVideoIds.length,
      change: `${Math.max(videos.length - watchedVideoIds.length, 0)} remaining`,
      trend: "up",
      icon: CheckCircle,
      colorKey: "green",
    },
    {
      label: "Overall Progress",
      numericValue: overallPct,
      isPercent: true,
      change: overallPct >= 100 ? "All done!" : "Keep going",
      trend: overallPct >= 50 ? "up" : "down",
      icon: TrendingUp,
      colorKey: "purple",
    },
  ];

  /* ── Player content ── */
  const renderStage = () => {
    if (!playingId || !selectedVideo) {
      return (
        <div
          style={{
            aspectRatio: "16/9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <Film size={40} />
          <span style={{ fontSize: 13, fontFamily: FONT_FAMILY }}>
            Select a lecture to play
          </span>
        </div>
      );
    }

    const sourceUrl = getVideoSourceUrl(selectedVideo);
    const blobUrl = videoUrls[playingId];
    const isLoading = loadingVideoId === playingId;

    if (isLoading && !blobUrl && !sourceUrl) {
      return (
        <div
          style={{
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.6)",
              fontFamily: FONT_FAMILY,
            }}
          >
            Loading video…
          </span>
        </div>
      );
    }

    if (!hasStartedPlaying) {
      return (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: FONT_WEIGHT.bold,
              margin: "0 0 8px",
              fontFamily: FONT_FAMILY,
            }}
          >
            Welcome to the Course
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 14,
              margin: "0 0 26px",
              fontFamily: FONT_FAMILY,
            }}
          >
            Let&apos;s start learning something amazing today!
          </p>
          <button
            onClick={startPlaying}
            style={{
              width: 74,
              height: 74,
              borderRadius: "50%",
              border: "none",
              background: ACCENT,
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: `0 10px 30px ${ACCENT}70`,
            }}
          >
            <Play size={30} fill="#fff" />
          </button>
        </div>
      );
    }

    const videoTagStyle = {
      position: "relative",
      zIndex: 1,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      border: "none",
      display: "block",
    };

    if (sourceUrl) {
      const parsed = parseVideoUrl(sourceUrl);
      if (parsed.type === "youtube" || parsed.type === "vimeo") {
        return (
          <iframe
            ref={iframeRef}
            src={parsed.url}
            title="Video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={videoTagStyle}
          />
        );
      }
      return (
        <video
          ref={videoRef}
          src={parsed.url}
          autoPlay
          onTimeUpdate={onNativeTimeUpdate}
          onLoadedMetadata={onNativeLoadedMeta}
          onEnded={onNativeEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          style={videoTagStyle}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        src={blobUrl}
        autoPlay
        onTimeUpdate={onNativeTimeUpdate}
        onLoadedMetadata={onNativeLoadedMeta}
        onEnded={onNativeEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        style={videoTagStyle}
      />
    );
  };

  return (
    <PageContainer
      mode={isDark ? "dark" : "light"}
      pageBg={t.pageBg}
      textColor={t.text}
    >
      {/* ═══ HERO — same band as Dashboard/MyCourses/StudentCourseView ═══ */}
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
                  background: ACCENT,
                }}
                className="d1"
              />
              <span
                style={{
                  fontSize: FONT_SIZE.eyebrow,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: LETTER_SPACING.eyebrowWide,
                  textTransform: "uppercase",
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Student Portal
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.heroTitle,
                fontSize: FONT_SIZE.heroTitle,
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: LINE_HEIGHT.heroTitle,
                letterSpacing: LETTER_SPACING.heroTitle,
              }}
            >
              Video Lectures
            </h1>
            <p
              style={{
                fontSize: FONT_SIZE.bodySmall,
                color: t.textSub,
                margin: 0,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <Grid size={13} /> {videos.length} lectures
              </span>
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <Clock size={13} />{" "}
                {totalMinutes
                  ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m total`
                  : "—"}
              </span>
            </p>
          </div>

          <div className="hero-badges">
            <div
              className="livebadge"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: `${ACCENT}14`,
                border: `1px solid ${ACCENT}4d`,
                borderRadius: 999,
                padding: "8px 18px",
                color: ACCENT,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: "0.1em",
                fontFamily: FONT_FAMILY,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: ACCENT,
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
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ BODY ═══ */}
      <div className="vl-body">
        {/* Sidebar — lecture library */}
        <div
          className="vl-sidebar"
          style={{
            background: t.cardBg,
            border: `1px solid ${t.border}`,
            borderRadius: 20,
            boxShadow: t.shadow,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "18px 20px 14px",
              borderBottom: `1px solid ${t.border}`,
            }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: FONT_WEIGHT.bold,
                margin: "0 0 2px",
                color: t.text,
                fontFamily: FONT_FAMILY,
              }}
            >
              Lecture Library
            </p>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                margin: "0 0 12px",
                fontFamily: FONT_FAMILY,
              }}
            >
              {videos.length} Lectures
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: t.actBg,
                border: `1px solid ${t.actBorder}`,
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              <Search size={15} color={t.textMuted} />
              <input
                placeholder="Search lectures..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 13,
                  fontFamily: FONT_FAMILY,
                  color: t.text,
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div
            className="vl-list"
            style={{
              "--vl-scroll-thumb": t.border,
              maxHeight: 640,
              overflowY: "auto",
              padding: "6px 0",
            }}
          >
            {filteredVideos.map((v, index) => {
              const active = playingId === v.id;
              const watched = watchedVideoIds.includes(v.id);
              const inProgressPct = liveProgress[v.id] || 0;
              const inProgress = !watched && inProgressPct > 0;
              const title = v.title || v.originalFileName || "Untitled";
              const durSec = v.durationSeconds || v.duration || 0;
              const mm = Math.floor(durSec / 60);
              const ss = Math.floor(durSec % 60)
                .toString()
                .padStart(2, "0");
              const locked = !!v.locked;

              let itemBg = "transparent";
              let itemBorderLeft = "3px solid transparent";
              if (active) {
                itemBg = t.statusProgressBg;
                itemBorderLeft = `3px solid ${ACCENT}`;
              }

              return (
                <button
                  key={v.id}
                  onClick={() => playVideo(v)}
                  disabled={locked}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 20px",
                    width: "100%",
                    textAlign: "left",
                    border: "none",
                    borderLeft: itemBorderLeft,
                    background: itemBg,
                    cursor: locked ? "not-allowed" : "pointer",
                    opacity: locked ? 0.55 : 1,
                    transition: "background .15s, border-color .15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!locked && !active)
                      e.currentTarget.style.background = t.cardBgHov;
                  }}
                  onMouseLeave={(e) => {
                    if (!locked && !active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: FONT_WEIGHT.bold,
                      color: active ? ACCENT : t.textMuted,
                      width: 18,
                      flexShrink: 0,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: locked ? t.barBg : `${VIDEO_COLOR}18`,
                      color: locked ? t.textMuted : VIDEO_COLOR,
                    }}
                  >
                    {locked ? (
                      <Lock size={13} />
                    ) : (
                      <Play size={13} fill="currentColor" />
                    )}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13.5,
                        fontWeight: FONT_WEIGHT.semibold,
                        color: active ? ACCENT : t.text,
                        margin: "0 0 2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {title}
                    </p>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {durSec ? `${mm}:${ss}` : ""}
                    </span>
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {locked ? (
                      <Lock size={16} color={t.textMuted} />
                    ) : watched ? (
                      <CheckCircle
                        size={20}
                        color="#34d399"
                        fill="#34d399"
                        style={{ color: t.cardBg }}
                      />
                    ) : inProgress ? (
                      <span
                        style={{ position: "relative", width: 26, height: 26 }}
                      >
                        <Ring
                          size={26}
                          stroke={3}
                          pct={inProgressPct}
                          color={ACCENT}
                          track={t.border}
                        />
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 8,
                            fontWeight: FONT_WEIGHT.bold,
                            color: ACCENT,
                          }}
                        >
                          {inProgressPct}%
                        </span>
                      </span>
                    ) : (
                      <Circle size={18} color={t.border} />
                    )}
                  </span>
                </button>
              );
            })}

            {lockedCount > 0 && (
              <div
                style={{
                  margin: "10px 14px 4px",
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: `${ACCENT}0f`,
                  border: `1px dashed ${ACCENT}66`,
                  textAlign: "center",
                }}
              >
                <Lock size={16} color={ACCENT} style={{ marginBottom: 6 }} />
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: FONT_WEIGHT.semibold,
                    color: t.text,
                    margin: "0 0 3px",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {lockedCount} more lecture{lockedCount > 1 ? "s" : ""} locked
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: t.textMuted,
                    margin: "0 0 10px",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Upgrade your plan to unlock the full lecture library.
                </p>
                <button
                  onClick={() =>
                    (window.location.href = "/profile?tab=billing")
                  }
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: ACCENT,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.bold,
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderTop: `1px solid ${t.border}`,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10.5,
                fontWeight: FONT_WEIGHT.semibold,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
              }}
            >
              <Circle size={12} color={t.border} /> Not Started
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10.5,
                fontWeight: FONT_WEIGHT.semibold,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
              }}
            >
              <Circle size={12} color={ACCENT} /> In Progress
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10.5,
                fontWeight: FONT_WEIGHT.semibold,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
              }}
            >
              <CheckCircle size={12} color="#34d399" /> Completed
            </span>
          </div>
        </div>

        {/* Main / Player */}
        <div
          className="vl-main"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: FONT_WEIGHT.bold,
                margin: 0,
                color: t.text,
                fontFamily: FONT_FAMILY,
              }}
            >
              {selectedVideo
                ? `${selectedIdx + 1}. ${selectedVideo.title || selectedVideo.originalFileName}`
                : "No lecture selected"}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              {playingId && selectedVideo && (
                <button
                  onClick={() => setTranscriptOpen((o) => !o)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: FONT_WEIGHT.semibold,
                    color: transcriptOpen ? ACCENT : t.textMuted,
                    background: transcriptOpen ? `${ACCENT}14` : t.actBg,
                    border: `1px solid ${transcriptOpen ? `${ACCENT}4d` : t.actBorder}`,
                    borderRadius: 10,
                    padding: "7px 12px",
                    cursor: "pointer",
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  <FileText size={13} />
                  {transcriptOpen ? "Hide Transcript" : "Transcript"}
                </button>
              )}
              <button
                onClick={playNext}
                disabled={!nextVideo || nextVideo.locked}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontWeight: FONT_WEIGHT.semibold,
                  color: !nextVideo || nextVideo.locked ? t.textMuted : ACCENT,
                  cursor:
                    !nextVideo || nextVideo.locked ? "not-allowed" : "pointer",
                  background: "none",
                  border: "none",
                  fontFamily: FONT_FAMILY,
                }}
              >
                Next Lecture <ChevronRight size={15} />
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 480px",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Player card — intentionally kept as a dark cinema stage
                 regardless of light/dark app theme, same as the original. */}
              <div
                className="vl-player-card"
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: t.shadowHov,
                  background: "#05050c",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    background:
                      "radial-gradient(120% 130% at 50% 20%, #241a55 0%, #140f33 45%, #05050f 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at 20% 90%, ${ACCENT}59, transparent 55%), radial-gradient(circle at 85% 100%, rgba(56,189,248,0.20), transparent 50%)`,
                    }}
                  />
                  {renderStage()}
                </div>

                {playingId && selectedVideo && (
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      background: "#0a0a16",
                      padding: "10px 18px 14px",
                    }}
                  >
                    <div style={{ width: "100%", marginBottom: 10 }}>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={scrubPct}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="vl-scrub"
                        style={{
                          background: `linear-gradient(to right, ${ACCENT} ${scrubPct}%, rgba(255,255,255,0.18) ${scrubPct}%)`,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <button
                          onClick={togglePlay}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                          }}
                        >
                          {isPlaying ? (
                            <Pause size={18} />
                          ) : (
                            <Play size={18} fill="currentColor" />
                          )}
                        </button>
                        <button
                          onClick={playNext}
                          disabled={!nextVideo}
                          style={{
                            background: "none",
                            border: "none",
                            color: !nextVideo
                              ? "rgba(255,255,255,0.35)"
                              : "#fff",
                            cursor: !nextVideo ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                          }}
                        >
                          <SkipForward size={17} />
                        </button>
                        <button
                          onClick={() => setMuted((m) => !m)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                          }}
                        >
                          {muted ? (
                            <VolumeX size={17} />
                          ) : (
                            <Volume2 size={17} />
                          )}
                        </button>
                        <span
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.7)",
                            fontVariantNumeric: "tabular-nums",
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                        }}
                      >
                        <button
                          onClick={changeSpeed}
                          style={{
                            fontSize: 12,
                            fontWeight: FONT_WEIGHT.bold,
                            color: "rgba(255,255,255,0.8)",
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {speed}x
                        </button>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                          }}
                        >
                          <Settings size={17} />
                        </button>
                        <button
                          onClick={requestFullscreen}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 2,
                          }}
                        >
                          <Maximize size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedVideo && meta && (
                <div
                  style={{
                    background: t.cardBg,
                    border: `1px solid ${t.border}`,
                    borderRadius: 20,
                    boxShadow: t.shadow,
                    padding: "22px 24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: FONT_WEIGHT.bold,
                      margin: "0 0 8px",
                      color: t.text,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    About this lecture
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: t.textMuted,
                      lineHeight: 1.6,
                      margin: "0 0 18px",
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    {meta.desc || "No description provided for this lecture."}
                  </p>

                  <div className="progress-summary-grid">
                    {[
                      {
                        label: "Duration",
                        value:
                          selectedVideo.durationSeconds ||
                          selectedVideo.duration
                            ? formatTime(
                                selectedVideo.durationSeconds ||
                                  selectedVideo.duration,
                              ) + " min"
                            : formatTime(duration) + " min",
                        icon: Clock,
                      },
                      { label: "Category", value: meta.category, icon: Layers },
                      { label: "Level", value: meta.level, icon: TrendingUp },
                    ].map((info, i) => (
                      <div
                        key={i}
                        style={{
                          background: t.recentItemBg,
                          border: `1px solid ${t.recentItemBorder}`,
                          borderRadius: 12,
                          padding: "12px 14px",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 9,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: t.cardBg,
                            color: ACCENT,
                            border: `1px solid ${t.border}`,
                          }}
                        >
                          <info.icon size={15} />
                        </span>
                        <div>
                          <p
                            style={{
                              fontSize: 10.5,
                              color: t.textMuted,
                              fontWeight: FONT_WEIGHT.semibold,
                              margin: "0 0 2px",
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            {info.label}
                          </p>
                          <p
                            style={{
                              fontSize: 13.5,
                              fontWeight: FONT_WEIGHT.bold,
                              color: t.text,
                              margin: 0,
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            {info.value}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        background: isWatched
                          ? t.statusCompletedBg
                          : t.recentItemBg,
                        border: `1px solid ${isWatched ? "#34d39950" : t.recentItemBorder}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 9,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isWatched ? "#34d399" : t.cardBg,
                          color: isWatched ? "#fff" : ACCENT,
                          border: isWatched ? "none" : `1px solid ${t.border}`,
                        }}
                      >
                        {isWatched ? (
                          <Check size={15} />
                        ) : (
                          <BookOpen size={15} />
                        )}
                      </span>
                      <div>
                        <p
                          style={{
                            fontSize: 10.5,
                            color: t.textMuted,
                            fontWeight: FONT_WEIGHT.semibold,
                            margin: "0 0 2px",
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          Status
                        </p>
                        <p
                          style={{
                            fontSize: 13.5,
                            fontWeight: FONT_WEIGHT.bold,
                            color: isWatched ? t.statusCompletedText : t.text,
                            margin: 0,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {isWatched ? "Completed" : "In Progress"}
                        </p>
                        {isWatched && (
                          <p
                            style={{
                              fontSize: 10.5,
                              color: t.textMuted,
                              margin: "3px 0 0",
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            Automatically marked (
                            {Math.round(AUTO_COMPLETE_THRESHOLD * 100)}%
                            watched)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Transcript side panel ── */}
            {transcriptOpen && playingId && selectedVideo && (
              <div
                style={{
                  flex: "0 0 300px",
                  width: 300,
                  display: "flex",
                  flexDirection: "column",
                  background: t.cardBg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 20,
                  boxShadow: t.shadow,
                  overflow: "hidden",
                  maxHeight: 640,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderBottom: `1px solid ${t.border}`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: FONT_WEIGHT.bold,
                      color: t.text,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Transcript
                  </span>
                  <button
                    onClick={() => setTranscriptOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: t.textMuted,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="vl-transcript"
                  style={{
                    "--vl-scroll-thumb": t.border,
                    flex: 1,
                    overflowY: "auto",
                    padding: 14,
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
                            fontWeight: FONT_WEIGHT.bold,
                            color: VIDEO_COLOR,
                            flexShrink: 0,
                            fontFamily: FONT_FAMILY,
                          }}
                        >
                          {fmtTime(seg.startSeconds)}
                        </span>
                        <span
                          style={{
                            fontSize: 12.5,
                            color: t.text,
                            fontFamily: FONT_FAMILY,
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
                        padding: "32px 0",
                        fontFamily: FONT_FAMILY,
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
                        padding: "32px 0",
                        fontFamily: FONT_FAMILY,
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
                        padding: "32px 0",
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Transcript unavailable for this video.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default VideoLectures;
