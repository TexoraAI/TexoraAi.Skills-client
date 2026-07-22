import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff, MonitorPlay,
  PhoneOff, MessageSquare, Users, ChevronRight, ChevronLeft, Send, X,
  Radio, Timer, Disc2, AlertTriangle, PictureInPicture2, Hand, Settings,
  Captions, MoreVertical, SignalHigh, SmilePlus, Bell, Crown,
} from "lucide-react";
import { getSessionById, participantLeave } from "@/services/liveSessionService";
import { useLiveMeeting } from "@/context/LiveMeetingContext";

const REACTIONS = ["👍", "❤️", "😂", "👏", "🎉", "😮"];

const useLiveTimer = (running, startedAt) => {
  const [secs, setSecs] = useState(() =>
    startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0,
  );
  useEffect(() => {
    if (!running) return;
    const anchor = startedAt || Date.now();
    const tick = () => setSecs(Math.max(0, Math.floor((Date.now() - anchor) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running, startedAt]);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

// Fires a callback when a pointer goes down outside every ref in `refs`,
// or when Escape is pressed. Used to make the popups (reaction picker,
// overflow menu, mobile sidebar) close reliably instead of relying on
// ad-hoc onClick wiring, which is what caused the React-picker
// flicker/close bugs.
function useDismiss(active, onDismiss, refs = []) {
  useEffect(() => {
    if (!active) return undefined;
    const handlePointer = (e) => {
      const insideAny = refs.some((r) => r.current && r.current.contains(e.target));
      if (!insideAny) onDismiss();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("mousedown", handlePointer, true);
    document.addEventListener("touchstart", handlePointer, true);
    document.addEventListener("keydown", handleKey, true);
    return () => {
      document.removeEventListener("mousedown", handlePointer, true);
      document.removeEventListener("touchstart", handlePointer, true);
      document.removeEventListener("keydown", handleKey, true);
    };
  }, [active, onDismiss, refs]);
}

// Watches document.documentElement's "dark" class (the same flag
// App.jsx toggles via `document.documentElement.classList.toggle("dark", ...)`)
// so the top header can pick light/dark colors without needing a new
// prop threaded through, and without touching any meeting/LiveKit state.
function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function VideoTrackEl({ track, mirrored, fit = "cover", hidden, videoRef }) {
  const internalRef = useRef(null);
  useEffect(() => {
    const el = internalRef.current;
    if (!track || !el) return;
    track.attach(el);
    return () => { try { track.detach(el); } catch (_) {} };
  }, [track]);
  return (
    <video
      ref={(node) => { internalRef.current = node; if (videoRef) videoRef.current = node; }}
      autoPlay playsInline muted
      style={hidden
        ? { position: "absolute", left: -9999, top: -9999, width: 2, height: 2, opacity: 0, pointerEvents: "none" }
        : { width: "100%", height: "100%", objectFit: fit, transform: mirrored ? "scaleX(-1)" : "none", display: "block", background: "#000" }}
    />
  );
}

function AudioTrackEl({ track }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!track || !el) return;
    track.attach(el);
    return () => { try { track.detach(el); } catch (_) {} };
  }, [track]);
  return <audio ref={ref} autoPlay />;
}

function PiPPanel({ track, isScreen, label, timer, micOn, onToggleMic, onReturn }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#000", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        {track ? (
          <VideoTrackEl track={track} fit={isScreen ? "contain" : "cover"} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13 }}>
            Meeting in progress…
          </div>
        )}
        <div style={{ position: "absolute", top: 6, left: 8, fontSize: 11, color: "#fff", background: "rgba(0,0,0,.55)", padding: "3px 8px", borderRadius: 6 }}>{timer}</div>
        <div style={{ position: "absolute", bottom: 6, left: 8, fontSize: 10, color: "#fff", background: "rgba(0,0,0,.55)", padding: "2px 7px", borderRadius: 6 }}>{label}</div>
      </div>
      <div style={{ flexShrink: 0, display: "flex", gap: 6, padding: 6, background: "#0d1117" }}>
        <button onClick={onToggleMic} aria-label={micOn ? "Mute microphone" : "Unmute microphone"} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 8px", borderRadius: 8, border: "none", background: micOn ? "rgba(255,255,255,.12)" : "#7f1d1d", color: micOn ? "#e2e8f0" : "#fca5a5", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
          {micOn ? "Mute" : "Unmute"}
        </button>
        <button onClick={onReturn} aria-label="Return to meeting window" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 8px", borderRadius: 8, border: "none", background: "rgba(34,211,238,.18)", color: "#67e8f9", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          Return to meeting
        </button>
      </div>
    </div>
  );
}

function useInView(ref) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const root = el.closest("[data-scroll-root]") || null;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { root, threshold: 0.01, rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

function EmojiFloaters({ floaters, S }) {
  return (
    <div style={S.floaterLayer} aria-hidden="true">
      {floaters.map((f, i) => (
        <span key={f.id} style={{ ...S.floaterEmoji, left: `${10 + ((i * 17) % 80)}%`, animationDelay: `${(i % 4) * 0.15}s` }}>
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

function StripTile({ p, active, raised, compact, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  const speaking = !!p.isSpeaking;
  const showBadge = raised || p.isHost;
  return (
    <div
      ref={wrapRef}
      className={`lr-strip-tile${active ? " lr-strip-tile-active" : ""}${speaking ? " lr-speaking" : ""}`}
      style={{ ...S.stripTile, ...(compact ? S.stripTileCompact : {}) }}
    >
      {hasVideo ? (
        <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
      ) : (
        <div style={S.stripAvatarWrap}>
          <div style={{ ...S.stripAvatar, background: p.isLocal ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
            {initial}
          </div>
        </div>
      )}
      
      {showBadge && (
        <div style={S.stripBadgeTopLeft} aria-label={raised ? "Hand raised" : "Host"} title={raised ? "Hand raised" : "Host"}>
          {raised ? <Hand size={11} color="#1a1a1a" /> : <Crown size={11} color="#1a1a1a" />}
        </div>
      )}
      <div style={S.stripMicDot}>{p.micMuted ? <MicOff size={10} /> : <Mic size={10} />}</div>
      <div style={S.stripName}>{p.isLocal ? "You" : p.name}</div>
    </div>
  );
}

function StripOverflow({ count, compact, S }) {
  return (
    <div
      style={{ ...S.stripTile, ...(compact ? S.stripTileCompact : {}), ...S.stripOverflow }}
      className="lr-strip-tile"
    >
      <span style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1" }}>+{count}</span>
      <span style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>others</span>
    </div>
  );
}

function StageTile({ p, raised, S }) {
  if (!p) {
    return (
      <div style={S.stageOuter}>
        <div style={S.stage}>
          <div style={S.stageEmpty}>Waiting for participants…</div>
        </div>
      </div>
    );
  }
  const isScreen = !!p.screenTrack;
  const track = isScreen ? p.screenTrack : p.cameraTrack;
  const hasVideo = !!track && (isScreen || !p.cameraMuted);
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  const speaking = !isScreen && !!p.isSpeaking;
  return (
    // stageOuter is the flex:1 area that absorbs whatever space is left;
    // it centers the fixed-ratio .stage box instead of letting the box
    // itself stretch to fill an arbitrary (non-16:9) parent shape.
    <div style={S.stageOuter}>
      <div
        style={{ ...S.stage, ...(isScreen ? S.stagePresenting : {}) }}
        className={`lr-stage${speaking ? " lr-speaking" : ""}${isScreen ? " lr-stage-presenting" : ""}`}
      >
        {hasVideo ? (
          <VideoTrackEl track={track} mirrored={!isScreen && p.isLocal} fit={isScreen ? "contain" : "cover"} />
        ) : (
          <div style={S.stageAvatarWrap}><div style={S.stageAvatar}>{initial}</div></div>
        )}
        
        {isScreen && (
          <div style={S.screenLabel}><MonitorPlay size={13} />{p.isLocal ? "You are presenting" : `${p.name} is presenting`}</div>
        )}
        <div style={S.stageNameTag}>
          {speaking && !p.micMuted && (
            <span style={{ display: "inline-flex", alignItems: "center", height: 13 }}>
              <span className="lr-speak-bar" /><span className="lr-speak-bar" /><span className="lr-speak-bar" />
            </span>
          )}
          {p.micMuted ? <MicOff size={13} /> : <Mic size={13} />}
          <span>{p.isLocal ? "You" : p.name}</span>
        </div>
        {p.isHost && <span style={S.stageHostTag}>Host</span>}
        {raised && <div style={S.stageHandBadge}><Hand size={14} color="#1a1a1a" /><span>Hand raised</span></div>}
      </div>
    </div>
  );
}

// ---- Dynamic tiled grid (Meet's "Auto" layout for when nobody is
// pinned/presenting): 1 → full stage, 2 → balanced split, 3–4 → 2x2,
// 5–9 → 3x3, 10+ → auto-fit grid. Column count is picked once per
// participant count here, then the CSS (.lr-grid, see <style> block)
// clamps it further per breakpoint so tiles never shrink below a
// usable size on tablets/phones. ----
function gridColumns(n) {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n <= 4) return 2;
  if (n <= 9) return 3;
  return Math.min(Math.ceil(Math.sqrt(n)), 5);
}

function GridTile({ p, raised, S }) {
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef);
  const hasVideo = !!p.cameraTrack && !p.cameraMuted && inView;
  const initial = (p.name || "?").trim().charAt(0).toUpperCase() || "?";
  const speaking = !!p.isSpeaking;
  return (
    <div ref={wrapRef} className="lr-grid-cell-outer" style={S.gridCellOuter}>
      <div style={S.gridTile} className={`lr-grid-tile${speaking ? " lr-speaking" : ""}`}>
        {hasVideo ? (
          <VideoTrackEl track={p.cameraTrack} mirrored={p.isLocal} fit="cover" />
        ) : (
          <div style={S.stageAvatarWrap}>
            <div style={{ ...S.gridAvatar, background: p.isLocal ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>
              {initial}
            </div>
          </div>
        )}
        
        <div style={S.gridNameTag}>
          {p.micMuted ? <MicOff size={12} /> : <Mic size={12} />}
          <span>{p.isLocal ? "You" : p.name}</span>
        </div>
        {p.isHost && <span style={S.gridHostTag}>Host</span>}
        {raised && <div style={S.gridHandBadge}><Hand size={12} color="#1a1a1a" /></div>}
      </div>
    </div>
  );
}

function ParticipantGrid({ participants, raisedHands, handRaised, S }) {
  const cols = gridColumns(participants.length);
  const colsTablet = Math.min(cols, 3);
  const colsPhone = Math.min(cols, 2);
  const style = {
    ...S.gridWrap,
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    "--cols-tablet": colsTablet,
    "--cols-phone": colsPhone,
    "--cols-small": 1,
  };
  return (
    <div style={style} className="lr-grid">
      {participants.map((p) => (
        <GridTile key={p.identity} p={p} raised={p.isLocal ? handRaised : !!raisedHands[p.identity]} S={S} />
      ))}
    </div>
  );
}

/**
 * Pure view component — owns NO LiveKit Room and makes NO connect()
 * call. All connection state (participants, mic/cam/screen, chat,
 * raised hands, reactions) comes from LiveMeetingContext, which is the
 * single owner of the Room instance. This is what prevents the
 * duplicate-connection bug (two Rooms under the same identity kicking
 * each other out) that existed when this component connected on its own.
 *
 * NOTE ON VISUAL SCOPE: the reference screenshot also shows a left
 * app-navigation sidebar and a top-right notification/avatar cluster.
 * Those belong to the persistent app shell/Layout that wraps every
 * page (not to this component) and weren't part of the source files
 * provided, so they aren't reproduced here — only the meeting UI that
 * LiveRoom itself owns (top bar, stage, filmstrip, chat/people panel,
 * control bar) has been pixel-matched and made responsive here.
 */
const LiveRoom = ({ sessionId, onSessionEnded, onLeave }) => {
  const {
    activeMeeting, connected, micOn, camOn, screenOn,
    participants, messages, raisedHands, floaters,
    toggleMic, toggleCam, toggleScreen, sendMessage,
    toggleHandRaise, sendReaction, leaveMeeting,
  } = useLiveMeeting();

  const chatEndRef = useRef(null);
  const autoEndPollRef = useRef(null);
  const pipFallbackVideoRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuPanelRef = useRef(null);
  const reactionBtnRef = useRef(null);
  const reactionPanelRef = useRef(null);

  // Sidebar starts open on desktop (docked chat, matches Meet/Zoom) but
  // collapses automatically on tablets and phones, where it becomes a
  // floating overlay instead -- "collapse automatically on phones and
  // tablets" means not eating the stage with a docked panel on first
  // paint on a narrow device.
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 1023
  );
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [msgInput, setMsgInput] = useState("");
  const [sessionEndedWarning, setSessionEndedWarning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [recordingBadge, setRecordingBadge] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);
  
  // ── Reaction picker position (portal fix) ──────────────────────
const [reactionPickerPos, setReactionPickerPos] = useState(null);

const updateReactionPickerPos = useCallback(() => {
  const btn = reactionBtnRef.current;
  if (!btn) return;

  const rect = btn.getBoundingClientRect();

  setReactionPickerPos({
    left: rect.left + rect.width / 2,
    bottom: window.innerHeight - rect.top + 10,
  });
}, []);

useEffect(() => {
  if (!reactionPickerOpen) return;

  updateReactionPickerPos();

  window.addEventListener("resize", updateReactionPickerPos);
  window.addEventListener("scroll", updateReactionPickerPos, true);

  return () => {
    window.removeEventListener("resize", updateReactionPickerPos);
    window.removeEventListener("scroll", updateReactionPickerPos, true);
  };
}, [reactionPickerOpen, updateReactionPickerPos]);
  // The shell (DashboardLayout) always renders an empty
  // #lr-topbar-slot element inside its existing bell/avatar header
  // row. When LiveRoom mounts, it portals its LIVE/timer/REC/
  // participants/End Session controls into that slot so they sit
  // alongside the bell + avatar in a single row, instead of drawing a
  // second, separate top bar. If the slot isn't found (e.g. LiveRoom
  // used standalone outside the shell), it falls back to rendering
  // its own bar normally.
  const [topbarSlotEl, setTopbarSlotEl] = useState(null);
  useEffect(() => {
    setTopbarSlotEl(document.getElementById("lr-topbar-slot"));
  }, []);

  const timer = useLiveTimer(connected, activeMeeting?.joinedAt);
  const handRaised = !!raisedHands.you;

  // Auto-end poll — still a per-view concern, not connection state.
  useEffect(() => {
    if (!sessionId) return;
    autoEndPollRef.current = setInterval(async () => {
      try {
        const res = await getSessionById(sessionId);
        if (res?.data?.status === "ENDED") {
          clearInterval(autoEndPollRef.current);
          setSessionEndedWarning(true);
          setTimeout(() => {
            if (typeof onSessionEnded === "function") onSessionEnded();
          }, 3000);
        }
      } catch (_) {}
    }, 20000);
    return () => clearInterval(autoEndPollRef.current);
  }, [sessionId, onSessionEnded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  const handleLeave = useCallback(() => {
    if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
    if (sessionId) participantLeave(sessionId).catch(() => {});
    leaveMeeting();
    if (typeof onLeave === "function") onLeave();
  }, [onLeave, sessionId, leaveMeeting]);

  const sendMsg = useCallback(() => {
    const text = msgInput.trim();
    if (!text) return;
    sendMessage(text);
    setMsgInput("");
  }, [msgInput, sendMessage]);

  const openTab = useCallback((tab) => {
    if (sidebarOpen && sidebarTab === tab) setSidebarOpen(false);
    else { setSidebarTab(tab); setSidebarOpen(true); }
  }, [sidebarOpen, sidebarTab]);

  const screenSharer = useMemo(() => participants.find((p) => !!p.screenTrack), [participants]);
  const featured = useMemo(() => {
    if (screenSharer) return screenSharer;
    return participants.find((p) => p.isHost) || participants.find((p) => !p.isLocal) || participants[0] || null;
  }, [participants, screenSharer]);
  const stripParticipants = useMemo(
    () => participants.filter((p) => p.identity !== featured?.identity),
    [participants, featured],
  );
  const MAX_STRIP_VISIBLE = 6;
  const visibleStrip = stripParticipants.slice(0, MAX_STRIP_VISIBLE);
  const overflowCount = Math.max(0, stripParticipants.length - MAX_STRIP_VISIBLE);
  // Meet's "Auto" behavior: tiled grid when nobody is pinned/presenting;
  // spotlight (one big tile + filmstrip) only while someone is screen
  // sharing, or there's only one other person to look at anyway.
  const gridMode = !screenSharer && participants.length > 1;

  const pipTrack =
    screenSharer?.screenTrack ||
    participants.find((p) => p.isLocal)?.cameraTrack ||
    participants.find((p) => !p.isLocal && p.cameraTrack)?.cameraTrack ||
    null;
  const pipIsScreen = !!screenSharer?.screenTrack;
  const pipLabel = screenSharer ? (screenSharer.isLocal ? "You are presenting" : `${screenSharer.name} is presenting`) : "Live meeting";
  const pipSupported = typeof window !== "undefined" && "documentPictureInPicture" in window;

  const closePiP = useCallback(() => {
    setPipWindow((win) => { if (win && !win.closed) win.close(); return null; });
    if (document.pictureInPictureElement) document.exitPictureInPicture().catch(() => {});
  }, []);

  const openPiP = useCallback(async () => {
    if (pipWindow) return;
    if (pipSupported) {
      try {
        const win = await window.documentPictureInPicture.requestWindow({ width: 340, height: 220 });
        [...document.styleSheets].forEach((sheet) => {
          try {
            const css = [...sheet.cssRules].map((r) => r.cssText).join("");
            const style = win.document.createElement("style");
            style.textContent = css;
            win.document.head.appendChild(style);
          } catch (_) {
            if (sheet.href) {
              const link = win.document.createElement("link");
              link.rel = "stylesheet";
              link.href = sheet.href;
              win.document.head.appendChild(link);
            }
          }
        });
        win.document.body.style.margin = "0";
        win.document.body.style.background = "#000";
        win.document.body.style.overflow = "hidden";
        win.addEventListener("pagehide", () => setPipWindow(null), { once: true });
        setPipWindow(win);
        return;
      } catch (err) {
        console.warn("Document PiP unavailable, falling back:", err);
      }
    }
    const el = pipFallbackVideoRef.current;
    if (el && el.requestPictureInPicture) {
      try { await el.requestPictureInPicture(); } catch (_) {}
    }
  }, [pipSupported, pipWindow]);

  const togglePiP = useCallback(() => {
    if (pipWindow || document.pictureInPictureElement) closePiP(); else openPiP();
  }, [pipWindow, openPiP, closePiP]);

  useEffect(() => {
    if (!connected) return;
    const onVisibility = () => { if (document.hidden) openPiP(); else closePiP(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [connected, openPiP, closePiP]);

  useEffect(() => () => closePiP(), []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Popup dismissal (fixes the "React picker closes immediately /
  // flickers / doesn't close on outside click" bug: previously there
  // was no outside-click or Escape handling at all, so the picker's
  // open state only ever changed from the toggle button itself). ---
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeReactionPicker = useCallback(() => setReactionPickerOpen(false), []);
  useDismiss(menuOpen, closeMenu, [menuBtnRef, menuPanelRef]);
  useDismiss(reactionPickerOpen, closeReactionPicker, [reactionBtnRef, reactionPanelRef]);

  const handleReactionSelect = useCallback((emoji) => {
    sendReaction(emoji);
    setReactionPickerOpen(false);
  }, [sendReaction]);

const isDark = useIsDarkTheme();
const headerS = useMemo(() => (isDark ? HEADER_DARK : HEADER_LIGHT), [isDark]);
const S = isDark ? LR_STYLES_DARK : LR_STYLES_LIGHT;

  // NOTE: the top bar / control bar use env(safe-area-inset-*) padding
  // for notch and home-indicator devices. That only activates if the
  // document's <meta name="viewport"> includes viewport-fit=cover; this
  // component doesn't own the document head, so that tag needs to live
  // wherever the app shell renders it (e.g. index.html / _document).

  return (
    <div style={S.root} className="lr-root">
      <VideoTrackEl videoRef={pipFallbackVideoRef} track={pipTrack} fit={pipIsScreen ? "contain" : "cover"} hidden />

      {pipWindow && createPortal(
        <PiPPanel track={pipTrack} isScreen={pipIsScreen} label={pipLabel} timer={timer} micOn={micOn}
          onToggleMic={toggleMic} onReturn={() => { window.focus(); closePiP(); }} />,
        pipWindow.document.body,
      )}

      {sessionEndedWarning && (
        <div style={S.autoEndToast} className="lr-toast" role="alert">
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Session ended by trainer</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Redirecting you out in 3 seconds…</div>
          </div>
        </div>
      )}

      {(() => {
        const topBarInner = (
          <>
            <div style={headerS.topLeft} className="lr-topleft">
              <div style={headerS.liveBadge}><span style={headerS.liveDot} />LIVE</div>
              <span style={headerS.sessionName} className="lr-sessionname">{activeMeeting?.title || activeMeeting?.roomName || "Live Session"}</span>
              <div style={headerS.timerBadge}><Timer size={13} />{timer}</div>
              {recordingBadge && <div style={headerS.recBadge}><Disc2 size={11} />REC</div>}
            </div>
            <div style={headerS.topRight} className="lr-topright">
              <div style={headerS.peopleCountBadge}><Users size={14} />{participants.length || 1}</div>
              <div style={{ ...headerS.connBadge, ...(connected ? headerS.connOn : headerS.connOff) }} aria-label={connected ? "Connected" : "Disconnected"}><SignalHigh size={14} /></div>
              <button style={headerS.endSessionBtn} onClick={handleLeave} aria-label="End session"><PhoneOff size={14} /><span className="lr-btn-label">End Session</span></button>
              <div style={{ position: "relative" }}>
                <button
                  ref={menuBtnRef}
                  style={headerS.iconGhostBtn}
                  onClick={() => setMenuOpen((v) => !v)}
                  title="More options"
                  aria-label="More options"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div ref={menuPanelRef} style={headerS.dropMenu} role="menu">
                    <button role="menuitem" style={headerS.dropMenuItem} onClick={() => { setRecordingBadge((v) => !v); setMenuOpen(false); }}>
                      <Disc2 size={13} />{recordingBadge ? "Hide REC badge" : "Show REC badge"}
                    </button>
                    <button role="menuitem" style={headerS.dropMenuItem} onClick={() => { setSettingsOpen(true); setMenuOpen(false); }}>
                      <Settings size={13} />Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        );
        return topbarSlotEl
          ? createPortal(topBarInner, topbarSlotEl)
          : <div style={headerS.topBar} className="lr-topbar">{topBarInner}</div>;
      })()}

      <div style={S.mainArea} className="lr-mainarea">
        <div style={S.stageColumn} className="lr-stagecolumn">
          {gridMode ? (
            <>
              <ParticipantGrid participants={participants} raisedHands={raisedHands} handRaised={handRaised} S={S} />
              {captionsOn && <div style={S.captionsBar}><Captions size={13} /><span>Live captions are enabled for this session.</span></div>}
            </>
          ) : (
            <>
              <StageTile p={featured} raised={featured ? (featured.isLocal ? handRaised : !!raisedHands[featured.identity]) : false} S={S} />
              {captionsOn && <div style={S.captionsBar}><Captions size={13} /><span>Live captions are enabled for this session.</span></div>}
              {(visibleStrip.length > 0 || overflowCount > 0) && (
                <div
                  data-scroll-root
                  className="lr-filmstrip"
                  style={{ ...S.filmstrip, ...(screenSharer ? S.filmstripCompact : {}) }}
                >
                  {visibleStrip.map((p) => (
                    <StripTile
                      key={p.identity}
                      p={p}
                      active={p.isLocal}
                      raised={p.isLocal ? handRaised : !!raisedHands[p.identity]}
                      compact={!!screenSharer}
                      S={S}
                    />
                  ))}
                  {overflowCount > 0 && <StripOverflow count={overflowCount} compact={!!screenSharer} S={S} />}
                </div>
              )}
            </>
          )}
          {/* Hoisted here (was previously inside StageTile only) so
              reactions still show over the new grid layout, not just
              the old spotlight view. */}
          <EmojiFloaters floaters={floaters} S={S} />
        </div>

        <button
          type="button"
          style={S.handle}
          className="lr-handle"
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse panel" : "Expand panel"}
          aria-label={sidebarOpen ? "Collapse side panel" : "Expand side panel"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <ChevronRight size={15} color="#64748b" /> : <ChevronLeft size={15} color="#64748b" />}
        </button>

        {sidebarOpen && (
          <div style={S.sidebarBackdrop} className="lr-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        {sidebarOpen && (
          <div style={S.sidebar} className="lr-sidebar" role="complementary" aria-label={sidebarTab === "chat" ? "Chat panel" : "People panel"}>
            <div style={S.tabRow}>
              <button style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }} onClick={() => setSidebarTab("chat")} aria-pressed={sidebarTab === "chat"}>
                <MessageSquare size={15} /> Chat
              </button>
              <button style={{ ...S.tab, ...(sidebarTab === "people" ? S.tabOn : {}) }} onClick={() => setSidebarTab("people")} aria-pressed={sidebarTab === "people"}>
                <Users size={15} /> People<span style={S.cnt}>{participants.length || 1}</span>
              </button>
              <button style={S.closeBtn} onClick={() => setSidebarOpen(false)} aria-label="Close panel"><X size={16} /></button>
            </div>

            {sidebarTab === "chat" && (
              <div style={S.chatWrap}>
                <div style={S.msgList} className="lr-scroll-y">
                  {messages.map((m) => (
                    m.system ? (
                      <div key={m.id} className="lr-msg-row" style={S.msgRow}><div style={S.sysBubble}>{m.text}</div></div>
                    ) : (
                      <div key={m.id} className="lr-msg-row" style={{ ...S.msgCol, ...(m.self ? S.msgColSelf : {}) }}>
                        <span style={{ ...S.bHeader, ...(m.self ? S.bHeaderSelf : {}) }}>
                          {m.self ? "You" : m.name}<span style={S.bHeaderTime}>{m.time}</span>
                        </span>
                        <div style={{ ...S.bubble, ...(m.self ? S.bSelf : S.bOther) }}>
                          <span style={S.bText}>{m.text}</span>
                        </div>
                      </div>
                    )
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div style={S.inputRow}>
                  <input
                    style={S.chatInput}
                    placeholder="Type a message…"
                    aria-label="Type a message"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  />
                  <button style={S.sendBtn} onClick={sendMsg} aria-label="Send message"><Send size={16} /></button>
                </div>
              </div>
            )}

            {sidebarTab === "people" && (
              <div style={S.peopleList} className="lr-scroll-y">
                {participants.map((p) => (
                  <PersonRow key={p.identity} name={p.isLocal ? "You (Me)" : p.name} isHost={p.isHost} self={p.isLocal}
                    handRaised={p.isLocal ? handRaised : !!raisedHands[p.identity]} S={S} />
                ))}
                {participants.length <= 1 && <p style={S.emptyPpl}>No other participants yet</p>}
              </div>
            )}
          </div>
        )}
      </div>

      {settingsOpen && (
        <div style={S.settingsOverlay} onClick={() => setSettingsOpen(false)} role="presentation">
          <div
            style={S.settingsPanel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            onKeyDown={(e) => { if (e.key === "Escape") setSettingsOpen(false); }}
          >
            <div style={S.settingsHead}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Settings</span>
              <button style={S.closeBtn} onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={16} /></button>
            </div>
            <div style={S.settingsBody}>
              <div style={S.settingsRow}>
                <span>Live captions</span>
                <button style={{ ...S.settingsToggle, ...(captionsOn ? S.settingsToggleOn : {}) }} onClick={() => setCaptionsOn((v) => !v)} aria-pressed={captionsOn}>
                  {captionsOn ? "On" : "Off"}
                </button>
              </div>
              <div style={S.settingsRow}>
                <span>Show REC badge</span>
                <button style={{ ...S.settingsToggle, ...(recordingBadge ? S.settingsToggleOn : {}) }} onClick={() => setRecordingBadge((v) => !v)} aria-pressed={recordingBadge}>
                  {recordingBadge ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={S.ctrlBar} className="lr-ctrlbar" role="toolbar" aria-label="Meeting controls">
        <Btn icon={micOn ? <Mic size={18} /> : <MicOff size={18} />} label="Mic" danger={!micOn} onClick={toggleMic} pressed={micOn} S={S} />
        <Btn icon={camOn ? <Video size={18} /> : <VideoOff size={18} />} label="Camera" danger={!camOn} onClick={toggleCam} pressed={camOn} S={S} />
        <Btn icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />} label="Present" active={screenOn} onClick={toggleScreen} pressed={screenOn} S={S} />
        <Btn icon={<Hand size={18} />} label="Raise Hand" active={handRaised} onClick={toggleHandRaise} pressed={handRaised} S={S} />
        <div style={{ position: "relative" }}>
          <Btn
            btnRef={reactionBtnRef}
            icon={<SmilePlus size={18} />}
            label="React"
            active={reactionPickerOpen}
            onClick={() => setReactionPickerOpen((v) => !v)}
            ariaHasPopup="true"
            ariaExpanded={reactionPickerOpen}
            S={S}
          />
        </div>
        {reactionPickerOpen && reactionPickerPos && createPortal(
          <div
            ref={reactionPanelRef}
            style={{
              ...S.reactionPicker,
              position: "fixed",
              left: reactionPickerPos.left,
              bottom: reactionPickerPos.bottom,
              transform: "translateX(-50%)",
              zIndex: 200,
            }}
            role="menu"
            aria-label="Send a reaction"
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                role="menuitem"
                style={S.reactionPickerBtn}
                onClick={() => handleReactionSelect(emoji)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.08)"; e.currentTarget.style.transform = "translateY(-2px) scale(1.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
                aria-label={`React with ${emoji}`}>
                {emoji}
              </button>
            ))}
          </div>,
          document.body
        )}
        <Btn icon={<MessageSquare size={18} />} label="Chat" active={sidebarOpen && sidebarTab === "chat"} onClick={() => openTab("chat")} S={S} />
        <Btn icon={<Users size={18} />} label="People" badge={participants.length || 1} active={sidebarOpen && sidebarTab === "people"} onClick={() => openTab("people")} S={S} />
        <Btn icon={<Settings size={18} />} label="Settings" active={settingsOpen} onClick={() => setSettingsOpen((v) => !v)} S={S} />
        <Btn icon={<Captions size={18} />} label="Captions" active={captionsOn} onClick={() => setCaptionsOn((v) => !v)} pressed={captionsOn} S={S} />
        <Btn icon={<Disc2 size={18} />} label="Record" active={recordingBadge} onClick={() => setRecordingBadge((v) => !v)} pressed={recordingBadge} S={S} />
        <Btn icon={<PictureInPicture2 size={18} />} label="PiP" active={!!pipWindow} onClick={togglePiP} pressed={!!pipWindow} S={S} />
        <Btn icon={<PhoneOff size={18} />} label="Leave" leave onClick={handleLeave} S={S} />
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
        @keyframes toastIn   { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeScaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(0) scale(0.6)} 15%{opacity:1;transform:translateY(-20px) scale(1)} 100%{opacity:0;transform:translateY(-160px) scale(1.1)} }
        /* Active-speaker: a soft breathing glow on the tile border,
           plus a tiny pulsing bar used inside the name tag -- additive,
           only fires when a participant object carries isSpeaking. */
        @keyframes speakGlow { 0%,100%{ box-shadow: 0 0 0 2px rgba(52,211,153,.55), 0 0 22px 2px rgba(52,211,153,.28); } 50%{ box-shadow: 0 0 0 2px rgba(52,211,153,.85), 0 0 32px 6px rgba(52,211,153,.4); } }
        @keyframes speakBar { 0%,100%{ transform: scaleY(0.4); opacity:.6 } 50%{ transform: scaleY(1); opacity:1 } }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        /* Participant join: a soft grow-and-settle so a new tile doesn't
           just pop in when someone joins or the grid rebalances. */
        @keyframes tileIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }

        .lr-root, .lr-root * { box-sizing: border-box; }
        .lr-root { max-width: 100vw; }

        .lr-tile, .lr-strip-tile, .lr-stage, .lr-grid-tile { transition: transform 0.18s cubic-bezier(.2,.7,.3,1), box-shadow 0.18s ease, border-color .18s ease; will-change: transform; backface-visibility: hidden; }
        .lr-strip-tile:hover { transform: translateY(-4px) scale(1.015); box-shadow: 0 10px 26px rgba(0,0,0,0.4); border-color: rgba(255,255,255,.18) !important; }
        .lr-strip-tile-active { border: 2px solid #6d5ef7 !important; }
        .lr-grid-tile:hover { transform: translateY(-2px) scale(1.008); box-shadow: 0 12px 30px rgba(0,0,0,.4); }
        .lr-grid-cell-outer, .lr-strip-tile { animation: tileIn .22s cubic-bezier(.2,.8,.3,1); }
        /* Speaking gets its own slightly-larger scale on top of the
           glow so the active speaker visibly steps forward, like Meet. */
        .lr-speaking { animation: speakGlow 1.6s ease-in-out infinite; border-color: rgba(52,211,153,.6) !important; transform: scale(1.012); }
        .lr-strip-tile.lr-speaking:hover, .lr-grid-tile.lr-speaking:hover { transform: translateY(-2px) scale(1.02); }
        .lr-speak-bar { display: inline-block; width: 3px; height: 11px; border-radius: 2px; background: #34d399; animation: speakBar .7s ease-in-out infinite; margin-right: 1px; }
        .lr-speak-bar:nth-child(2) { animation-delay: .15s; }
        .lr-speak-bar:nth-child(3) { animation-delay: .3s; }
        .lr-ctrl-btn { transition: all 0.16s cubic-bezier(.2,.7,.3,1); }
        .lr-ctrl-btn:active { transform: scale(0.94); }
        .lr-sidebar { animation: slideIn .28s cubic-bezier(.16,1,.3,1); }
        .lr-stage { animation: fadeScaleIn .25s ease; }
        .lr-grid { transition: grid-template-columns .25s ease; }
        .lr-msg-row { animation: msgIn .18s ease; }
        .lr-sidebar-backdrop { display: none; }


        /* Keyboard-accessible focus rings everywhere, without adding a
           visible ring on mouse/touch interaction. */
        .lr-root button:focus { outline: none; }
        .lr-root button:focus-visible,
        .lr-root input:focus-visible,
        .lr-root a:focus-visible {
          outline: 2px solid #8b7dfb;
          outline-offset: 2px;
          border-radius: 6px;
        }

        /* Filmstrip scrollbar: dark track, orange thumb, always visible
           (not "auto"-hide) so it reads clearly on touch devices too.
           Desktop = 10px; tablet/mobile shrink this via the breakpoints
           below. Firefox only supports thin/auto/none for width, so it
           gets "auto" here and the color pair via scrollbar-color. */
        .lr-filmstrip { scrollbar-width: auto; scrollbar-color: #f97316 #14161d; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; scroll-behavior: smooth; }
        .lr-filmstrip::-webkit-scrollbar { height: 10px; }
        .lr-filmstrip::-webkit-scrollbar-track { background: #14161d; border-radius: 999px; }
        .lr-filmstrip::-webkit-scrollbar-thumb { background: #f97316; border-radius: 999px; border: 2px solid #14161d; }
        .lr-filmstrip::-webkit-scrollbar-thumb:hover { background: #fb923c; }

        .lr-ctrlbar { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.22) transparent; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; }
        .lr-ctrlbar::-webkit-scrollbar { height: 6px; }
        .lr-ctrlbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.22); border-radius: 999px; }

        /* Chat / people lists: same momentum scrolling + contained
           overscroll as the filmstrip so a flick-scroll on a phone never
           bounces the whole page behind the sidebar. */
        .lr-scroll-y { -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.18) transparent; }
        .lr-scroll-y::-webkit-scrollbar { width: 6px; }
        .lr-scroll-y::-webkit-scrollbar-thumb { background: rgba(255,255,255,.18); border-radius: 999px; }
        .lr-scroll-y::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.3); }

        /* Every control-bar button keeps a real touch target no matter
           how tight the padding gets at small breakpoints -- 48x48 is
           the floor, mobile breakpoints below bump it to 56x56. */
        .lr-ctrl-btn { min-width: 48px; min-height: 48px; }

        .lr-btn-label { display: inline; }

        /* ---- Large laptop / small desktop ---- */
        @media (max-width: 1439px) { .lr-sidebar { width: 320px !important; } }

        /* ---- Laptop ---- */
        @media (max-width: 1199px) {
          .lr-sidebar { width: 300px !important; }
          .lr-ctrl-btn { padding: 9px 14px !important; }
        }

        /* ---- Tablet (iPad, iPad Air, Android tablets): sidebar becomes
           a floating overlay with a backdrop, rather than pushing the
           stage narrower than it needs to be. ---- */
        @media (max-width: 1023px) {
          .lr-mainarea { position: relative; }
          .lr-filmstrip::-webkit-scrollbar { height: 9px; }
          .lr-grid { grid-template-columns: repeat(var(--cols-tablet, 3), 1fr) !important; }
          .lr-sidebar {
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: min(320px, 88vw) !important;
            z-index: 40;
            box-shadow: -12px 0 32px rgba(0,0,0,.45);
            animation: slideIn .28s cubic-bezier(.16,1,.3,1);
            background: rgba(11,13,18,.82) !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          .lr-sidebar-backdrop {
            display: block;
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,.35);
            backdrop-filter: blur(2px);
            z-index: 30;
            animation: fadeIn .18s ease;
          }
          .lr-handle { display: none !important; }
        }

        /* ---- Mobile: sidebar is a full-screen overlay ---- */
        @media (max-width: 767px) {
          .lr-sidebar {
            width: 100% !important;
            max-width: 100% !important;
          }
          .lr-sessionname { display: none; }
          .lr-stage { border-radius: 12px !important; }
          .lr-filmstrip::-webkit-scrollbar { height: 8px; }
          .lr-grid { grid-template-columns: repeat(var(--cols-phone, 2), 1fr) !important; }
        }

        @media (max-width: 899px) {
          .lr-topbar { padding: 8px max(12px, env(safe-area-inset-right)) 8px max(12px, env(safe-area-inset-left)) !important; }
          .lr-ctrlbar { padding: 10px max(14px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left)) !important; }
          .lr-ctrl-btn { padding: 8px 12px !important; }
          .lr-stagecolumn { padding: 10px !important; gap: 8px !important; }
        }

        @media (max-width: 599px) {
          .lr-topbar { flex-wrap: wrap; row-gap: 6px; }
          .lr-topright { order: 3; width: 100%; justify-content: flex-start; }
          .lr-ctrlbar { padding: 8px max(6px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(6px, env(safe-area-inset-left)) !important; gap: 6px !important; overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .lr-btn-label { display: none !important; }
          .lr-ctrl-btn { padding: 10px !important; border-radius: 14px !important; min-width: 56px !important; min-height: 56px !important; }
        }

        @media (max-width: 430px) {
          .lr-stagecolumn { padding: 6px !important; gap: 6px !important; }
          .lr-filmstrip { padding: 6px 8px !important; gap: 6px !important; }
          .lr-grid { grid-template-columns: repeat(var(--cols-small, 1), 1fr) !important; gap: 8px !important; }
        }

        @media (max-width: 375px) {
          .lr-ctrl-btn { padding: 8px !important; }
          .lr-topbar { padding: 6px max(8px, env(safe-area-inset-right)) 6px max(8px, env(safe-area-inset-left)) !important; }
        }

        @media (max-width: 420px) {
          .lr-toast { min-width: unset !important; width: 92vw !important; padding: 10px 14px !important; }
        }

        @media (max-height: 480px) and (orientation: landscape) {
          .lr-topbar { padding: 4px max(10px, env(safe-area-inset-right)) 4px max(10px, env(safe-area-inset-left)) !important; }
          .lr-ctrlbar { padding: 6px max(12px, env(safe-area-inset-right)) max(6px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)) !important; }
          .lr-ctrl-btn { padding: 6px 10px !important; gap: 2px !important; }
          .lr-sidebar { width: min(280px, 70vw) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lr-root * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>
    </div>
  );
};

const PersonRow = ({ name, isHost, self, handRaised, S }) => (
  <div style={S.pRow}>
    <div style={{ ...S.pAv, background: self ? "linear-gradient(135deg,#0ea5e9,#6366f1)" : "linear-gradient(135deg,#8b5cf6,#ec4899)" }}>{name[0]}</div>
    <span style={S.pName}>{name}</span>
    {handRaised && <Hand size={13} color="#fbbf24" aria-label="Hand raised" />}
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);

const Btn = ({ icon, label, active, danger, leave, badge, onClick, btnRef, pressed, ariaHasPopup, ariaExpanded, S }) => {
  const [hov, setHov] = useState(false);
  const bg = leave ? (hov ? "#dc2626" : "#ef4444")
    : danger ? (hov ? "#991b1b" : "#7f1d1d")
    : active ? (hov ? "rgba(109,94,247,.34)" : "rgba(109,94,247,.20)")
    : (hov ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.05)");
  const col = leave ? "#fff" : danger ? "#fca5a5" : active ? "#c4b8ff" : "#cbd5e1";
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        className="lr-ctrl-btn"
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={label}
        aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
        aria-haspopup={ariaHasPopup}
        aria-expanded={ariaExpanded}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: bg, color: col,
          border: danger ? "1px solid rgba(239,68,68,.3)" : active ? "1px solid rgba(109,94,247,.45)" : "1px solid rgba(255,255,255,.06)",
          borderRadius: 14, padding: "10px 16px", cursor: "pointer", fontSize: 10, fontWeight: 600,
          fontFamily: "inherit", letterSpacing: 0.2, flexShrink: 0,
          boxShadow: active ? "0 0 0 1px rgba(109,94,247,.25), 0 6px 16px -4px rgba(109,94,247,.35)" : "none",
        }}>
        {icon}
        <span className="lr-btn-label">{label}</span>
      </button>
      {!!badge && <span style={S.ctrlBadge}>{badge}</span>}
    </div>
  );
};

// Top-header-only theme tokens. HEADER_DARK is byte-for-byte the same
// as the header styles that used to live in LR_STYLES, so dark mode is
// visually unchanged. HEADER_LIGHT gives the same pieces WCAG-friendly
// contrast on a light surface. Nothing outside the header (stage,
// filmstrip, sidebar, controls) reads from these.
const HEADER_DARK = {
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "max(12px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) 12px max(20px, env(safe-area-inset-left))", background: "#0b0d12", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0, flexWrap: "wrap", gap: 8 },
  topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  topRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

  liveBadge: { display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,.14)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#ef4444" },
  liveDot: { width: 7, height: 7, borderRadius: "50%", background: "#ef4444", animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block" },
  recBadge: { display: "flex", alignItems: "center", gap: 5, background: "rgba(127,29,29,.35)", border: "1px solid rgba(248,113,113,.25)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: "#fca5a5", animation: "recBlink 2s infinite" },
  timerBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#cbd5e1", background: "rgba(255,255,255,.06)", borderRadius: 8, padding: "5px 10px", fontVariantNumeric: "tabular-nums" },
  sessionName: { fontSize: 15, fontWeight: 700, color: "#f8fafc", marginLeft: 2 },

  peopleCountBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#cbd5e1", background: "rgba(255,255,255,.06)", borderRadius: 8, padding: "6px 10px" },
  connBadge: { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, padding: "6px 9px" },
  connOn: { background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.28)", color: "#22c55e" },
  connOff: { background: "rgba(100,116,139,.1)", border: "1px solid rgba(100,116,139,.2)", color: "#94a3b8" },
  endSessionBtn: { display: "flex", alignItems: "center", gap: 6, background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,.35)" },
  iconGhostBtn: { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 9, padding: 8, color: "#94a3b8", cursor: "pointer", display: "flex" },
  dropMenu: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#161b26", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 6, minWidth: 180, boxShadow: "0 12px 32px rgba(0,0,0,.5)", zIndex: 50, display: "flex", flexDirection: "column", gap: 2 },
  dropMenuItem: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#cbd5e1", fontSize: 12, fontWeight: 600, padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left" },
};

const HEADER_LIGHT = {
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "max(12px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) 12px max(20px, env(safe-area-inset-left))", background: "#ffffff", borderBottom: "1px solid #e2e8f0", flexShrink: 0, flexWrap: "wrap", gap: 8 },
  topLeft: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },
  topRight: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" },

  liveBadge: { display: "flex", alignItems: "center", gap: 6, background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.35)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 1.2, color: "#dc2626" },
  liveDot: { width: 7, height: 7, borderRadius: "50%", background: "#dc2626", animation: "livePulse 1.2s ease-in-out infinite", display: "inline-block" },
  recBadge: { display: "flex", alignItems: "center", gap: 5, background: "rgba(220,38,38,.08)", border: "1px solid rgba(220,38,38,.3)", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: "#b91c1c", animation: "recBlink 2s infinite" },
  timerBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 10px", fontVariantNumeric: "tabular-nums" },
  sessionName: { fontSize: 15, fontWeight: 700, color: "#0f172a", marginLeft: 2 },

  peopleCountBadge: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px" },
  connBadge: { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, padding: "6px 9px" },
  connOn: { background: "rgba(22,163,74,.1)", border: "1px solid rgba(22,163,74,.35)", color: "#16a34a" },
  connOff: { background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#64748b" },
  endSessionBtn: { display: "flex", alignItems: "center", gap: 6, background: "#ef4444", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(239,68,68,.25)" },
  iconGhostBtn: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 9, padding: 8, color: "#475569", cursor: "pointer", display: "flex" },
  dropMenu: { position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 6, minWidth: 180, boxShadow: "0 12px 32px rgba(15,23,42,.18)", zIndex: 50, display: "flex", flexDirection: "column", gap: 2 },
  dropMenuItem: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#334155", fontSize: 12, fontWeight: 600, padding: "8px 10px", borderRadius: 8, cursor: "pointer", textAlign: "left" },
};

const LR_STYLES_DARK = {
  root: { display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "#0a0a0a", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#e2e8f0", overflow: "hidden" },
  autoEndToast: { position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 99999, display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 14, background: "linear-gradient(135deg,#dc2626,#f43f5e)", color: "#fff", fontFamily: "'Inter','Segoe UI',sans-serif", boxShadow: "0 8px 32px rgba(244,63,94,0.5)", animation: "toastIn 0.35s ease", minWidth: 300 },

  bellBtn: { position: "relative", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 9, padding: 8, color: "#94a3b8", cursor: "pointer", display: "flex" },
  bellBadge: { position: "absolute", top: -6, right: -8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 8, padding: "1px 5px", border: "2px solid #111111", lineHeight: 1.3 },
  topAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 },

  reactionPicker: { position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, padding: "8px 10px", background: "#111111", border: "1px solid rgba(255,255,255,.06)", borderRadius: 999, boxShadow: "0 4px 24px rgba(0,0,0,.40)", zIndex: 50, animation: "slideUp .16s ease" },
  reactionPickerBtn: { width: 36, height: 36, border: "none", background: "transparent", fontSize: 19, cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s, transform .15s" },
  ctrlBadge: { position: "absolute", top: -4, right: -4, background: "#6d5ef7", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 8, padding: "1px 5px", border: "2px solid #0a0a0a", lineHeight: 1.3 },

  mainArea: { flex: 1, display: "flex", overflow: "hidden", position: "relative", minWidth: 0 },
  stageColumn: { flex: 1, display: "flex", flexDirection: "column", gap: 14, padding: 18, overflow: "hidden", minWidth: 0, position: "relative", maxWidth: 1800, width: "100%", margin: "0 auto" },
  stageOuter: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0, overflow: "hidden" },
  stage: { position: "relative", background: "#111111", borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.40)", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "16 / 9", height: "100%", width: "auto", maxWidth: "100%", maxHeight: "100%" },
  stagePresenting: { aspectRatio: "auto", width: "100%", maxWidth: "100%" },
  stageEmpty: { color: "#94a3b8", fontSize: 13, fontWeight: 500 },
  stageAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#111111" },
  stageAvatar: { width: 108, height: 108, borderRadius: "50%", background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: "#fff", boxShadow: "0 10px 40px rgba(109,94,247,.35)" },
  stageNameTag: { position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 9, padding: "6px 12px" },
  stageHostTag: { position: "absolute", top: 16, right: 16, fontSize: 12, fontWeight: 700, color: "#93c5fd", background: "rgba(37,99,235,.22)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 8, padding: "4px 12px" },
  stageHandBadge: { position: "absolute", top: 60, left: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#1a1a1a", background: "#fbbf24", borderRadius: 8, padding: "5px 10px", boxShadow: "0 4px 14px rgba(251,191,36,.4)", animation: "recBlink 1.4s infinite" },
  screenLabel: { position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 8, padding: "5px 10px" },
  captionsBar: { display: "flex", alignItems: "center", gap: 8, background: "#111111", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#e2e8f0", flexShrink: 0 },
  floaterLayer: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" },
  floaterEmoji: { position: "absolute", bottom: 20, fontSize: 30, animation: "floatUp 2.4s ease-out forwards" },

  filmstrip: { flexShrink: 0, display: "flex", gap: 16, padding: "2px 2px 6px", overflowX: "auto" },
  filmstripCompact: { gap: 8 },
  stripTile: { position: "relative", flex: "0 0 auto", width: "clamp(112px, 15vw, 220px)", aspectRatio: "16 / 12.6", background: "#111111", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.40)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" },
  stripTileCompact: { width: "clamp(64px, 8vw, 108px)" },
  stripOverflow: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,.04)" },
  stripAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  stripAvatar: { width: "40%", aspectRatio: "1 / 1", minWidth: 34, maxWidth: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "#fff" },
  stripBadgeTopLeft: { position: "absolute", top: 8, left: 8, width: 20, height: 20, borderRadius: "50%", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(251,191,36,.5)" },
  stripMicDot: { position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  stripName: { position: "absolute", bottom: 7, left: 8, fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "2px 8px", maxWidth: "calc(100% - 14px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  gridWrap: { flex: 1, display: "grid", gridAutoRows: "minmax(0, 1fr)", gap: 14, minHeight: 0, minWidth: 0, overflow: "auto", alignContent: "center" },
  gridCellOuter: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0, overflow: "hidden" },
  gridTile: { position: "relative", background: "#111111", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 4px 24px rgba(0,0,0,.40)", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "16 / 9", height: "100%", width: "auto", maxWidth: "100%", maxHeight: "100%" },
  gridAvatar: { width: "26%", aspectRatio: "1 / 1", minWidth: 40, maxWidth: 96, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(16px, 3vw, 32px)", fontWeight: 800, color: "#fff" },
  gridNameTag: { position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 8, padding: "4px 9px", maxWidth: "calc(100% - 20px)", overflow: "hidden" },
  gridHostTag: { position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, color: "#93c5fd", background: "rgba(37,99,235,.22)", border: "1px solid rgba(96,165,250,.25)", borderRadius: 6, padding: "3px 8px" },
  gridHandBadge: { position: "absolute", top: 10, left: 10, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#fbbf24", borderRadius: "50%", boxShadow: "0 4px 14px rgba(251,191,36,.4)", animation: "recBlink 1.4s infinite" },

  handle: { width: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", border: "none", borderLeft: "1px solid rgba(255,255,255,.06)", cursor: "pointer", flexShrink: 0, padding: 0 },
  sidebar: { width: 340, background: "#111111", borderLeft: "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", flexShrink: 0, minWidth: 0 },
  sidebarBackdrop: { display: "none" },
  tabRow: { display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 },
  tab: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0 11px", borderRadius: 0, border: "none", borderBottom: "2px solid transparent", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 700, transition: "all .15s" },
  tabOn: { color: "#6d8bf7", borderBottom: "2px solid #6d8bf7" },
  cnt: { fontSize: 11, background: "rgba(109,94,247,.2)", color: "#b7aefc", borderRadius: 10, padding: "1px 7px", marginLeft: 3 },
  closeBtn: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", marginLeft: "auto", padding: 4 },

  chatWrap: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  msgList: { flex: 1, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 14, minHeight: 0 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 7, justifyContent: "center" },
  msgCol: { display: "flex", flexDirection: "column", gap: 4, maxWidth: "82%", alignSelf: "flex-start" },
  msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
  bHeader: { display: "flex", alignItems: "baseline", gap: 8, fontSize: 12, fontWeight: 700, color: "#7ba9f7", padding: "0 2px" },
  bHeaderSelf: { color: "#b7aefc" },
  bHeaderTime: { fontSize: 11, fontWeight: 500, color: "#94a3b8" },
  sysBubble: { fontSize: 12, color: "#94a3b8", background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "6px 14px", fontWeight: 500 },
  bubble: { maxWidth: "100%", borderRadius: 16, padding: "9px 14px", display: "flex", flexDirection: "column", gap: 2, wordBreak: "break-word" },
  bSelf: { background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", borderBottomRightRadius: 4 },
  bOther: { background: "#111111", border: "1px solid rgba(255,255,255,.06)", borderBottomLeftRadius: 4 },
  bText: { fontSize: 14, color: "#f1f5f9", lineHeight: 1.45 },
  inputRow: { display: "flex", gap: 8, padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,.06)", flexShrink: 0 },
  chatInput: { flex: 1, minWidth: 0, background: "#111111", border: "1px solid rgba(255,255,255,.06)", borderRadius: 999, padding: "10px 16px", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none" },
  sendBtn: { background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  peopleList: { flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, minHeight: 0 },
  emptyPpl: { fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20 },
  pRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#111111", border: "1px solid rgba(255,255,255,.06)" },
  pAv: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 },
  pName: { flex: 1, fontSize: 13, color: "#e2e8f0", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hostTag: { fontSize: 10, background: "rgba(59,130,246,.15)", color: "#60a5fa", padding: "2px 8px", borderRadius: 6, fontWeight: 600, flexShrink: 0 },
  youTag: { fontSize: 10, background: "rgba(52,211,153,.12)", color: "#6ee7b7", padding: "2px 8px", borderRadius: 6, fontWeight: 600, flexShrink: 0 },

  settingsOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  settingsPanel: { width: 320, maxWidth: "100%", background: "#111111", border: "1px solid rgba(255,255,255,.06)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.40)" },
  settingsHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.06)" },
  settingsBody: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#e2e8f0" },
  settingsToggle: { border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.05)", color: "#94a3b8", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  settingsToggleOn: { background: "rgba(109,94,247,.22)", borderColor: "rgba(109,94,247,.4)", color: "#b7aefc" },

  ctrlBar: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px max(20px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))", background: "#111111", borderTop: "1px solid rgba(255,255,255,.06)", flexShrink: 0, overflowX: "auto", flexWrap: "nowrap" },
};

const LR_STYLES_LIGHT = {
  root: { display: "flex", flexDirection: "column", height: "100%", width: "100%", background: "#f8f9fc", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#16182b", overflow: "hidden" },
  autoEndToast: { position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 99999, display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 14, background: "linear-gradient(135deg,#dc2626,#f43f5e)", color: "#fff", fontFamily: "'Inter','Segoe UI',sans-serif", boxShadow: "0 8px 32px rgba(244,63,94,0.5)", animation: "toastIn 0.35s ease", minWidth: 300 },

  bellBtn: { position: "relative", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 9, padding: 8, color: "#475569", cursor: "pointer", display: "flex" },
  bellBadge: { position: "absolute", top: -6, right: -8, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 8, padding: "1px 5px", border: "2px solid #ffffff", lineHeight: 1.3 },
  topAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 },

  reactionPicker: { position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", display: "flex", gap: 4, padding: "8px 10px", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 999, boxShadow: "0 12px 32px rgba(15,23,42,.18)", zIndex: 50, animation: "slideUp .16s ease" },
  reactionPickerBtn: { width: 36, height: 36, border: "none", background: "transparent", fontSize: 19, cursor: "pointer", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s, transform .15s" },
  ctrlBadge: { position: "absolute", top: -4, right: -4, background: "#6d5ef7", color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 8, padding: "1px 5px", border: "2px solid #f8f9fc", lineHeight: 1.3 },

  mainArea: { flex: 1, display: "flex", overflow: "hidden", position: "relative", minWidth: 0 },
  stageColumn: { flex: 1, display: "flex", flexDirection: "column", gap: 14, padding: 18, overflow: "hidden", minWidth: 0, position: "relative", maxWidth: 1800, width: "100%", margin: "0 auto" },
  stageOuter: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0, overflow: "hidden" },
  stage: { position: "relative", background: "#ffffff", borderRadius: 22, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(16,24,64,0.06)", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "16 / 9", height: "100%", width: "auto", maxWidth: "100%", maxHeight: "100%" },
  stagePresenting: { aspectRatio: "auto", width: "100%", maxWidth: "100%" },
  stageEmpty: { color: "#8a8fa3", fontSize: 13, fontWeight: 500 },
  stageAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" },
  stageAvatar: { width: 108, height: 108, borderRadius: "50%", background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: "#fff", boxShadow: "0 10px 40px rgba(109,94,247,.35)" },
  stageNameTag: { position: "absolute", bottom: 16, left: 16, display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.6)", borderRadius: 9, padding: "6px 12px" },
  stageHostTag: { position: "absolute", top: 16, right: 16, fontSize: 12, fontWeight: 700, color: "#1d4ed8", background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.2)", borderRadius: 8, padding: "4px 12px" },
  stageHandBadge: { position: "absolute", top: 60, left: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "#1a1a1a", background: "#fbbf24", borderRadius: 8, padding: "5px 10px", boxShadow: "0 4px 14px rgba(251,191,36,.4)", animation: "recBlink 1.4s infinite" },
  screenLabel: { position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,.6)", borderRadius: 8, padding: "5px 10px" },
  captionsBar: { display: "flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#16182b", flexShrink: 0 },
  floaterLayer: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" },
  floaterEmoji: { position: "absolute", bottom: 20, fontSize: 30, animation: "floatUp 2.4s ease-out forwards" },

  filmstrip: { flexShrink: 0, display: "flex", gap: 16, padding: "2px 2px 6px", overflowX: "auto" },
  filmstripCompact: { gap: 8 },
  stripTile: { position: "relative", flex: "0 0 auto", width: "clamp(112px, 15vw, 220px)", aspectRatio: "16 / 12.6", background: "#ffffff", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(16,24,64,0.06)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "default" },
  stripTileCompact: { width: "clamp(64px, 8vw, 108px)" },
  stripOverflow: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f1f5f9" },
  stripAvatarWrap: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  stripAvatar: { width: "40%", aspectRatio: "1 / 1", minWidth: 34, maxWidth: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "#fff" },
  stripBadgeTopLeft: { position: "absolute", top: 8, left: 8, width: 20, height: 20, borderRadius: "50%", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(251,191,36,.5)" },
  stripMicDot: { position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" },
  stripName: { position: "absolute", bottom: 7, left: 8, fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 6, padding: "2px 8px", maxWidth: "calc(100% - 14px)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  gridWrap: { flex: 1, display: "grid", gridAutoRows: "minmax(0, 1fr)", gap: 14, minHeight: 0, minWidth: 0, overflow: "auto", alignContent: "center" },
  gridCellOuter: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, minWidth: 0, overflow: "hidden" },
  gridTile: { position: "relative", background: "#ffffff", borderRadius: 18, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(16,24,64,0.06)", display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "16 / 9", height: "100%", width: "auto", maxWidth: "100%", maxHeight: "100%" },
  gridAvatar: { width: "26%", aspectRatio: "1 / 1", minWidth: 40, maxWidth: 96, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(16px, 3vw, 32px)", fontWeight: 800, color: "#fff" },
  gridNameTag: { position: "absolute", bottom: 10, left: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,.55)", borderRadius: 8, padding: "4px 9px", maxWidth: "calc(100% - 20px)", overflow: "hidden" },
  gridHostTag: { position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, color: "#1d4ed8", background: "rgba(37,99,235,.12)", border: "1px solid rgba(37,99,235,.2)", borderRadius: 6, padding: "3px 8px" },
  gridHandBadge: { position: "absolute", top: 10, left: 10, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "#fbbf24", borderRadius: "50%", boxShadow: "0 4px 14px rgba(251,191,36,.4)", animation: "recBlink 1.4s infinite" },

  handle: { width: 22, display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", border: "none", borderLeft: "1px solid #e2e8f0", cursor: "pointer", flexShrink: 0, padding: 0 },
  sidebar: { width: 340, background: "#ffffff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0, minWidth: 0 },
  sidebarBackdrop: { display: "none" },
  tabRow: { display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", borderBottom: "1px solid #e2e8f0", flexShrink: 0 },
  tab: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0 11px", borderRadius: 0, border: "none", borderBottom: "2px solid transparent", background: "transparent", color: "#8a8fa3", cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 700, transition: "all .15s" },
  tabOn: { color: "#6d5ef7", borderBottom: "2px solid #6d5ef7" },
  cnt: { fontSize: 11, background: "rgba(109,94,247,.12)", color: "#6d5ef7", borderRadius: 10, padding: "1px 7px", marginLeft: 3 },
  closeBtn: { background: "none", border: "none", color: "#8a8fa3", cursor: "pointer", display: "flex", marginLeft: "auto", padding: 4 },

  chatWrap: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  msgList: { flex: 1, overflowY: "auto", padding: "16px 16px", display: "flex", flexDirection: "column", gap: 14, minHeight: 0 },
  msgRow: { display: "flex", alignItems: "flex-end", gap: 7, justifyContent: "center" },
  msgCol: { display: "flex", flexDirection: "column", gap: 4, maxWidth: "82%", alignSelf: "flex-start" },
  msgColSelf: { alignSelf: "flex-end", alignItems: "flex-end" },
  bHeader: { display: "flex", alignItems: "baseline", gap: 8, fontSize: 12, fontWeight: 700, color: "#3b6fe0", padding: "0 2px" },
  bHeaderSelf: { color: "#6d5ef7" },
  bHeaderTime: { fontSize: 11, fontWeight: 500, color: "#8a8fa3" },
  sysBubble: { fontSize: 12, color: "#8a8fa3", background: "#f1f5f9", borderRadius: 8, padding: "6px 14px", fontWeight: 500 },
  bubble: { maxWidth: "100%", borderRadius: 16, padding: "9px 14px", display: "flex", flexDirection: "column", gap: 2, wordBreak: "break-word" },
  bSelf: { background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", borderBottomRightRadius: 4 },
  bOther: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderBottomLeftRadius: 4 },
  bText: { fontSize: 14, color: "#16182b", lineHeight: 1.45 },
  inputRow: { display: "flex", gap: 8, padding: "12px 14px", borderTop: "1px solid #e2e8f0", flexShrink: 0 },
  chatInput: { flex: 1, minWidth: 0, background: "#f8f9fc", border: "1px solid #e2e8f0", borderRadius: 999, padding: "10px 16px", color: "#16182b", fontSize: 13, fontFamily: "inherit", outline: "none" },
  sendBtn: { background: "linear-gradient(135deg,#6d5ef7,#8b5cf6)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },

  peopleList: { flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, minHeight: 0 },
  emptyPpl: { fontSize: 12, color: "#8a8fa3", textAlign: "center", marginTop: 20 },
  pRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#f8f9fc", border: "1px solid #e2e8f0" },
  pAv: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 },
  pName: { flex: 1, fontSize: 13, color: "#16182b", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  hostTag: { fontSize: 10, background: "rgba(59,130,246,.12)", color: "#1d4ed8", padding: "2px 8px", borderRadius: 6, fontWeight: 600, flexShrink: 0 },
  youTag: { fontSize: 10, background: "rgba(22,163,74,.12)", color: "#15803d", padding: "2px 8px", borderRadius: 6, fontWeight: 600, flexShrink: 0 },

  settingsOverlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  settingsPanel: { width: 320, maxWidth: "100%", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(15,23,42,.18)" },
  settingsHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #e2e8f0" },
  settingsBody: { padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  settingsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#16182b" },
  settingsToggle: { border: "1px solid #e2e8f0", background: "#f8f9fc", color: "#8a8fa3", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" },
  settingsToggleOn: { background: "rgba(109,94,247,.12)", borderColor: "rgba(109,94,247,.35)", color: "#6d5ef7" },

  ctrlBar: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px max(20px, env(safe-area-inset-right)) max(14px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left))", background: "#ffffff", borderTop: "1px solid #e2e8f0", flexShrink: 0, overflowX: "auto", flexWrap: "nowrap" },
};

export default LiveRoom;