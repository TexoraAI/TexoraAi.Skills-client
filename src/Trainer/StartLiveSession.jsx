// src/trainer/StartLiveSession.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Video, Sparkles, MessageSquare, Radio, Bell,
  Calendar, Clock, Users, ChevronDown, CheckCircle2,
  Link, Zap, ExternalLink, Copy, RefreshCw, MapPin,
  Globe, FileText, Layers, Settings, Rocket,
  ChevronLeft, ChevronRight, Send as SendIcon,
} from "lucide-react";
import { createLiveSession } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", cardBgHov: "#161616",
    heroBg: "#141414", border: "rgba(255,255,255,0.06)",
    borderHov: "rgba(255,255,255,0.14)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    pillBg: "rgba(255,255,255,0.04)", pillText: "rgba(255,255,255,0.25)",
    barBg: "rgba(255,255,255,0.05)", actBg: "rgba(255,255,255,0.04)",
    actBorder: "rgba(255,255,255,0.07)", gridLine: "rgba(255,255,255,0.5)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)",
    emptyIcon: "rgba(255,255,255,0.12)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.10)", inputText: "#ffffff",
    labelColor: "rgba(255,255,255,0.45)", selectBg: "#1a1a1a",
    panelBg: "#101010", panelBorder: "rgba(255,255,255,0.06)",
    panelHeader: "#141414", panelHeaderBorder: "rgba(255,255,255,0.07)",
    dividerBg: "rgba(255,255,255,0.05)", dividerHov: "rgba(34,197,94,0.4)",
    stepBadgePending: "rgba(255,255,255,0.06)", stepBadgePendingBorder: "rgba(255,255,255,0.10)",
    stepBadgePendingText: "rgba(255,255,255,0.25)",
    toggleTrackOff: "rgba(255,255,255,0.10)", toggleTrackOn: "#22c55e",
    reviewFieldBg: "#161616", reviewFieldBorder: "rgba(255,255,255,0.07)",
    calMiniHeaderBg: "#111111", calDivider: "rgba(255,255,255,0.07)",
    calMiniDayHov: "rgba(255,255,255,0.06)", calMiniTodayBg: "#0078d4",
    calMiniSelectedBg: "rgba(0,120,212,0.25)", calMiniWeekend: "rgba(255,255,255,0.18)",
    calMiniDayOther: "rgba(255,255,255,0.12)", calMiniEventDot: "#22c55e",
    calEventBg: "rgba(0,120,212,0.10)", calEventBorder: "rgba(0,120,212,0.30)",
    calEventText: "#60a5fa", calIconColor: "rgba(255,255,255,0.3)",
    modeCardBg: "#161616", modeCardBorder: "rgba(255,255,255,0.08)",
    modeCardHov: "#1c1c1c",
    sidebarBg: "#0d0d0d", sidebarBorder: "rgba(255,255,255,0.05)",
    heroBannerBg: "linear-gradient(135deg, #0f1a0f 0%, #0a120a 50%, #0a0a0a 100%)",
    heroBannerBorder: "rgba(34,197,94,0.08)",
  },
  light: {
    pageBg: "#f0f2f5", cardBg: "#ffffff", cardBgHov: "#f8fafc",
    heroBg: "#ffffff", border: "#e2e8f0",
    borderHov: "#cbd5e1", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    pillBg: "#f1f5f9", pillText: "#94a3b8",
    barBg: "#f1f5f9", actBg: "#f8fafc", actBorder: "#e2e8f0",
    gridLine: "rgba(0,0,0,0.12)", shadow: "0 1px 8px rgba(0,0,0,0.07)",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
    labelColor: "#64748b", selectBg: "#f8fafc",
    panelBg: "#ffffff", panelBorder: "#e2e8f0",
    panelHeader: "#f8fafc", panelHeaderBorder: "#e8ecf2",
    dividerBg: "#e2e8f0", dividerHov: "rgba(34,197,94,0.5)",
    stepBadgePending: "#f1f5f9", stepBadgePendingBorder: "#e2e8f0",
    stepBadgePendingText: "#94a3b8",
    toggleTrackOff: "#e2e8f0", toggleTrackOn: "#22c55e",
    reviewFieldBg: "#f8fafc", reviewFieldBorder: "#e2e8f0",
    calMiniHeaderBg: "#f8fafc", calDivider: "#e8ecf0",
    calMiniDayHov: "#f1f5f9", calMiniTodayBg: "#0078d4",
    calMiniSelectedBg: "#dbeafe", calMiniWeekend: "#64748b",
    calMiniDayOther: "#cbd5e1", calMiniEventDot: "#22c55e",
    calEventBg: "#e8f4fd", calEventBorder: "#90caf9",
    calEventText: "#1565c0", calIconColor: "#8b9ab0",
    modeCardBg: "#f8fafc", modeCardBorder: "#e2e8f0",
    modeCardHov: "#f1f5f9",
    sidebarBg: "#f8fafc", sidebarBorder: "#e8ecf2",
    heroBannerBg: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #ffffff 100%)",
    heroBannerBorder: "rgba(34,197,94,0.12)",
  },
};

const genRoomId = () => "room-" + Math.random().toString(36).slice(2, 10).toUpperCase();

/* ══════════════════════════════════════════════════
   DRAG-TO-RESIZE THREE-PANEL LAYOUT
══════════════════════════════════════════════════ */
function ThreePanelLayout({
  t, isDark, left, center, right,
  defaultLeftW = 220, defaultRightW = 260,
  minLeft = 160, maxLeft = 320,
  minRight = 200, maxRight = 360,
}) {
  const containerRef = useRef(null);
  const [leftW,  setLeftW]  = useState(defaultLeftW);
  const [rightW, setRightW] = useState(defaultRightW);
  const [dragging, setDragging] = useState(null);
  const dragStartRef = useRef(null);

  const onMouseDown = (side, e) => {
    e.preventDefault();
    setDragging(side);
    dragStartRef.current = { x: e.clientX, leftW, rightW };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragStartRef.current.x;
      if (dragging === "left") {
        setLeftW(Math.max(minLeft, Math.min(maxLeft, dragStartRef.current.leftW + dx)));
      } else {
        setRightW(Math.max(minRight, Math.min(maxRight, dragStartRef.current.rightW - dx)));
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, minLeft, maxLeft, minRight, maxRight]);

  const dividerStyle = (side) => ({
    width: 6, flexShrink: 0, cursor: "col-resize", position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "transparent", userSelect: "none", zIndex: 10,
    transition: dragging === side ? "none" : "background 0.2s",
  });

  return (
    <div ref={containerRef} style={{ display: "flex", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* LEFT */}
      <div style={{
        width: leftW, flexShrink: 0,
        background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}`,
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {left}
      </div>

      {/* LEFT DIVIDER */}
      <div
        style={dividerStyle("left")}
        onMouseDown={e => onMouseDown("left", e)}
        onMouseEnter={e => e.currentTarget.style.background = t.dividerHov}
        onMouseLeave={e => { if (dragging !== "left") e.currentTarget.style.background = "transparent"; }}
        title="Drag to resize"
      >
        <div style={{
          position: "absolute", width: 2, top: 0, bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          background: dragging === "left" ? "#22c55e" : t.dividerBg,
          borderRadius: 99, transition: "background 0.2s",
        }} />
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 2, pointerEvents: "none" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: dragging === "left" ? "#22c55e" : t.textMuted, opacity: 0.5 }} />
          ))}
        </div>
        {dragging === "left" && <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, cursor: "col-resize", zIndex: 9999 }} />}
      </div>

      {/* CENTER */}
      <div style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: t.panelBg }}>
        {center}
      </div>

      {/* RIGHT DIVIDER */}
      <div
        style={dividerStyle("right")}
        onMouseDown={e => onMouseDown("right", e)}
        onMouseEnter={e => e.currentTarget.style.background = t.dividerHov}
        onMouseLeave={e => { if (dragging !== "right") e.currentTarget.style.background = "transparent"; }}
        title="Drag to resize"
      >
        <div style={{
          position: "absolute", width: 2, top: 0, bottom: 0, left: "50%",
          transform: "translateX(-50%)",
          background: dragging === "right" ? "#22c55e" : t.dividerBg,
          borderRadius: 99, transition: "background 0.2s",
        }} />
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 2, pointerEvents: "none" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: dragging === "right" ? "#22c55e" : t.textMuted, opacity: 0.5 }} />
          ))}
        </div>
        {dragging === "right" && <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, cursor: "col-resize", zIndex: 9999 }} />}
      </div>

      {/* RIGHT */}
      <div style={{
        width: rightW, flexShrink: 0,
        background: t.sidebarBg, borderLeft: `1px solid ${t.sidebarBorder}`,
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        {right}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MINI CALENDAR WIDGET
══════════════════════════════════════════════════ */
function MiniCalendar({ t, isDark, selectedDate, onSelectDate, sessionEvents = [] }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const firstDay   = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMon  = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, thisMonth: false, prev: true });
  for (let d = 1; d <= daysInMon; d++)    cells.push({ day: d, thisMonth: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)    cells.push({ day: d, thisMonth: false, next: true });

  const isToday    = (cell) => cell.thisMonth && cell.day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (cell) => {
    if (!selectedDate || !cell.thisMonth) return false;
    const [y, m, d] = selectedDate.split("-").map(Number);
    return cell.day === d && viewMonth === (m - 1) && viewYear === y;
  };
  const hasEvent = (cell) => {
    if (!cell.thisMonth) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    return sessionEvents.some(e => e.date === dateStr);
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const handleClick = (cell) => {
    if (!cell.thisMonth) return;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
    onSelectDate(dateStr);
  };

  const accent = "#0078d4";
  return (
    <div style={{ userSelect: "none" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px 8px", background: t.calMiniHeaderBg, borderBottom: `1px solid ${t.calDivider}` }}>
        <button onClick={prevMonth} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.calDivider}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted }}>
          <ChevronLeft size={11} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ width: 22, height: 22, borderRadius: 5, border: `1px solid ${t.calDivider}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted }}>
          <ChevronRight size={11} />
        </button>
      </div>

      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "5px 6px 2px" }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 8, fontWeight: 700, color: t.textMuted, fontFamily: "'Poppins',sans-serif", padding: "1px 0" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 6px 8px", gap: "1px 0" }}>
        {cells.map((cell, i) => {
          const tod = isToday(cell);
          const sel = isSelected(cell);
          const evt = hasEvent(cell);
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          return (
            <div
              key={i}
              onClick={() => handleClick(cell)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: 24, borderRadius: 5,
                cursor: cell.thisMonth ? "pointer" : "default",
                background: tod ? accent : sel ? t.calMiniSelectedBg : "transparent",
                transition: "background 0.15s", position: "relative",
              }}
              onMouseEnter={e => { if (!tod && !sel && cell.thisMonth) e.currentTarget.style.background = t.calMiniDayHov; }}
              onMouseLeave={e => { if (!tod && !sel) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                fontSize: 10, fontWeight: tod || sel ? 700 : 500, lineHeight: 1,
                color: tod ? "#fff" : !cell.thisMonth ? t.calMiniDayOther : isWeekend ? t.calMiniWeekend : t.text,
                fontFamily: "'Poppins',sans-serif",
              }}>{cell.day}</span>
              {evt && !tod && <span style={{ width: 3, height: 3, borderRadius: "50%", background: t.calMiniEventDot, marginTop: 1 }} />}
            </div>
          );
        })}
      </div>

      {/* Today button */}
      <div style={{ borderTop: `1px solid ${t.calDivider}`, padding: "5px 12px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            setViewMonth(today.getMonth());
            setViewYear(today.getFullYear());
            const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
            onSelectDate(d);
          }}
          style={{ fontSize: 10, fontWeight: 700, color: accent, background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}
        >
          Today
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TOGGLE SWITCH
══════════════════════════════════════════════════ */
function ToggleSwitch({ checked, onChange, color = "#22c55e" }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 99, cursor: "pointer",
        border: "none", outline: "none", position: "relative",
        background: checked ? color : "#94a3b8", flexShrink: 0,
        transition: "background 0.2s",
      }}
      role="switch" aria-checked={checked}
    >
      <div style={{
        position: "absolute", top: 2, left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 4px rgba(0,0,0,0.25)", transition: "left 0.2s",
      }} />
    </button>
  );
}

/* ══════════════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════════════ */
function CompactLabel({ children, t }) {
  return (
    <label style={{
      fontSize: 9, fontWeight: 700, color: t.labelColor,
      fontFamily: "'Poppins',sans-serif", letterSpacing: "0.06em",
      textTransform: "uppercase", marginBottom: 4, display: "block",
    }}>{children}</label>
  );
}

function PanelSectionHeader({ icon: Icon, color, title, t }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 14px", borderBottom: `1px solid ${t.panelHeaderBorder}`,
      background: t.panelHeader,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 7, display: "flex",
        alignItems: "center", justifyContent: "center",
        background: `${color}18`, border: `1px solid ${color}28`, flexShrink: 0,
      }}>
        <Icon size={13} color={color} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{title}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT — StartLiveSession
══════════════════════════════════════════════════ */
const StartLiveSession = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
       document.documentElement.getAttribute("data-theme") === "dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"
      )
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  /* ── State ── */
  const [currentStep,    setCurrentStep]    = useState(1);
  const [sessionEvents,  setSessionEvents]  = useState([]);
  const [batches,        setBatches]        = useState([]);
  const [submitting,     setSubmitting]     = useState(false);
  const [publishing,     setPublishing]     = useState(false);
  const [copied,         setCopied]         = useState(false);
  const [publishDone,    setPublishDone]    = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", batchId: "", date: "", time: "",
    duration: "", chat: true, recording: true, notifications: true,
    mode: "", meetingLink: "", roomId: genRoomId(),
  });

  const upd = (key, val) => setForm(p => ({ ...p, [key]: val }));
  const durations = ["15", "30", "45", "60", "75", "90"];

  /* ── Load batches ── */
  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainerBatches();
        setBatches(data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    })();
  }, []);

  /* ── Derived ── */
  const selectedBatch = batches.find(b => String(b.id ?? b.batchId) === String(form.batchId));
  const batchLabel    = selectedBatch ? (selectedBatch.name ?? selectedBatch.batchName ?? `Batch ${form.batchId}`) : null;
  const step1Valid    = form.title.trim() && form.batchId && form.date && form.time;

  /* ── Handlers ── */
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(form.roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGoLive = async () => {
    try {
      setSubmitting(true);
      const payload = {
        title: form.title, description: form.description,
        batchId: Number(form.batchId), scheduledDate: form.date,
        scheduledTime: form.time, duration: Number(form.duration),
        chatEnabled: form.chat, autoRecord: form.recording,
        notifyStudents: form.notifications,
        mode: form.mode || "custom",
        ...(form.mode === "custom"   ? { roomId: form.roomId }           : {}),
        ...(form.mode === "external" ? { meetingLink: form.meetingLink } : {}),
      };
      const res = await createLiveSession(payload);
      if (form.mode === "external") {
        navigate("/trainer/live");
      } else {
        navigate(`/trainer/live-controls/${res.data.id}`);
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!step1Valid) { alert("Please complete Step 1 first."); return; }
    try {
      setPublishing(true);
      const payload = {
        title: form.title, description: form.description,
        batchId: Number(form.batchId), scheduledDate: form.date,
        scheduledTime: form.time, duration: Number(form.duration),
        chatEnabled: form.chat, autoRecord: form.recording,
        notifyStudents: form.notifications,
        mode: form.mode || "custom", status: "SCHEDULED",
        ...(form.mode === "custom"   ? { roomId: form.roomId }           : {}),
        ...(form.mode === "external" ? { meetingLink: form.meetingLink } : {}),
      };
      await createLiveSession(payload);
      if (form.date) setSessionEvents(prev => [...prev, { date: form.date, title: form.title }]);
      setPublishDone(true);
      setTimeout(() => setPublishDone(false), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const stepState = (n) => {
    if (currentStep === n) return "active";
    if (n === 1 && step1Valid) return "done";
    if (n === 2 && step1Valid && currentStep > 2) return "done";
    if (n === 3 && currentStep > 3) return "done";
    return "pending";
  };

  /* ══════════════
     LEFT PANEL
  ══════════════ */
  const LeftPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader icon={Layers} color="#22c55e" title="Steps" t={t} />

      <div className="panel-scroll" style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Step buttons */}
        {[
          { n: 1, title: "Session Details",  subtitle: "Title, batch & schedule", icon: Calendar },
          { n: 2, title: "Settings",          subtitle: "Chat, record, alerts",    icon: Settings },
          { n: 3, title: "Review & Launch",   subtitle: "Confirm and go live",     icon: Rocket   },
        ].map(({ n, title, subtitle, icon: Icon }) => {
          const s = stepState(n);
          const accent = "#22c55e";
          const isAct  = s === "active";
          const isDone = s === "done";
          return (
            <button
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "9px 10px", borderRadius: 8,
                border: `1px solid ${isAct ? `${accent}35` : isDone ? `${accent}20` : t.border}`,
                background: isAct ? `${accent}0a` : isDone ? `${accent}06` : "transparent",
                cursor: "pointer", textAlign: "left", width: "100%", transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: isAct ? accent : isDone ? `${accent}20` : t.stepBadgePending,
                border: `1.5px solid ${isAct ? accent : isDone ? `${accent}40` : t.stepBadgePendingBorder}`,
                fontSize: 10, fontWeight: 800,
                color: isAct ? "#fff" : isDone ? accent : t.stepBadgePendingText,
                fontFamily: "'Poppins',sans-serif",
              }}>
                {isDone ? <CheckCircle2 size={12} color={accent} /> : n}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isAct ? t.text : isDone ? t.text : t.textSub, fontFamily: "'Poppins',sans-serif", lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{subtitle}</div>
              </div>
              {isAct && <div style={{ width: 4, height: 4, borderRadius: "50%", background: accent, flexShrink: 0 }} />}
            </button>
          );
        })}

        <div style={{ margin: "8px 0", borderTop: `1px solid ${t.border}` }} />

        {/* Session summary mini */}
        {[
          { label: "Title",    val: form.title || "—",    color: "#22c55e" },
          { label: "Batch",    val: batchLabel || "—",    color: "#22d3ee" },
          { label: "Date",     val: form.date || "—",     color: "#a78bfa" },
          { label: "Time",     val: form.time || "—",     color: "#f59e0b" },
          { label: "Duration", val: form.duration ? `${form.duration}m` : "—", color: "#2dd4bf" },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px", borderRadius: 5 }}>
            <span style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 10, color: val === "—" ? t.textMuted : t.text, fontFamily: "'Poppins',sans-serif", fontWeight: 600, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
          </div>
        ))}

        {/* Mode badge */}
        {form.mode && (
          <div style={{
            marginTop: 4, display: "flex", alignItems: "center", gap: 5,
            padding: "5px 8px", borderRadius: 6,
            background: form.mode === "custom" ? "rgba(34,197,94,0.08)" : "rgba(0,120,212,0.08)",
            border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.22)" : "rgba(0,120,212,0.22)"}`,
          }}>
            {form.mode === "custom"
              ? <Zap size={10} color="#22c55e" />
              : <ExternalLink size={10} color="#0078d4" />
            }
            <span style={{ fontSize: 9, fontWeight: 700, color: form.mode === "custom" ? "#22c55e" : "#0078d4", fontFamily: "'Poppins',sans-serif" }}>
              {form.mode === "custom" ? "Custom Live" : "External Link"}
            </span>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{ padding: "10px", borderTop: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
        {publishDone && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 7,
            background: isDark ? "rgba(34,197,94,0.10)" : "#f0fdf4",
            border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "#bbf7d0"}`,
            animation: "toastIn 0.3s ease both",
          }}>
            <CheckCircle2 size={13} color="#22c55e" />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", fontFamily: "'Poppins',sans-serif" }}>Published!</div>
              <div style={{ fontSize: 9, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Session scheduled.</div>
            </div>
          </div>
        )}
        {/* Back button */}
        <button
          onClick={() => navigate("/trainer/live")}
          style={{
            width: "100%", padding: "7px 0", borderRadius: 7,
            border: `1px solid ${t.border}`, background: "transparent",
            color: t.textSub, fontSize: 10, fontWeight: 600,
            cursor: "pointer", fontFamily: "'Poppins',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "all 0.18s",
          }}
        >
          <ArrowLeft size={11} /> Back to Live
        </button>
        {/* Schedule later */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            width: "100%", padding: "7px 0", borderRadius: 7,
            border: `1px solid ${t.border}`, background: "transparent",
            color: t.textSub, fontSize: 10, fontWeight: 600,
            cursor: publishing ? "not-allowed" : "pointer",
            fontFamily: "'Poppins',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            transition: "all 0.18s",
          }}
        >
          <SendIcon size={11} />{publishing ? "Scheduling…" : "Schedule for Later"}
        </button>
      </div>
    </div>
  );

  /* ══════════════
     CENTER PANEL
  ══════════════ */
  const CenterPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Step header */}
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${t.panelHeaderBorder}`,
        background: t.panelHeader, display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(34,197,94,0.15)", border: "1.5px solid rgba(34,197,94,0.4)",
          fontSize: 11, fontWeight: 800, color: "#22c55e", fontFamily: "'Poppins',sans-serif",
        }}>{currentStep}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
            {currentStep === 1 ? "Session Details" : currentStep === 2 ? "Session Settings" : "Review & Launch"}
          </div>
          <div style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
            {currentStep === 1 ? "Title, batch & schedule" : currentStep === 2 ? "Chat, recording & alerts" : "Confirm and go live"}
          </div>
        </div>
        {/* Step dots */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {[1, 2, 3].map(n => (
            <div
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                width: n === currentStep ? 20 : 6, height: 6, borderRadius: 99,
                background: n === currentStep ? "#22c55e" : n < currentStep ? "rgba(34,197,94,0.4)" : t.border,
                cursor: "pointer", transition: "all 0.25s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Scrollable step content */}
      <div className="panel-scroll">

        {/* ── STEP 1: Session Details ── */}
        {currentStep === 1 && (
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Title */}
            <div>
              <CompactLabel t={t}>Session Title *</CompactLabel>
              <input
                className="sls-input"
                value={form.title}
                onChange={e => upd("title", e.target.value)}
                placeholder="e.g. React Hooks Deep Dive"
              />
            </div>

            {/* Description */}
            <div>
              <CompactLabel t={t}>Description <span style={{ fontWeight: 400, textTransform: "none", fontSize: 9 }}>(optional)</span></CompactLabel>
              <textarea
                className="sls-input"
                value={form.description}
                onChange={e => upd("description", e.target.value)}
                placeholder="Brief overview for students..."
                rows={2}
                style={{ resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            {/* Batch */}
            <div>
              <CompactLabel t={t}>Select Batch *</CompactLabel>
              <div style={{ position: "relative" }}>
                <select
                  className="sls-input"
                  value={form.batchId}
                  onChange={e => upd("batchId", e.target.value)}
                  style={{ cursor: "pointer", paddingRight: 30, appearance: "none" }}
                >
                  <option value="">Choose a batch...</option>
                  {Array.isArray(batches) && batches.map((b, i) => {
                    const id   = b.id ?? b.batchId ?? b.batch_id;
                    const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
                    return <option key={i} value={String(id)}>{name}</option>;
                  })}
                </select>
                <ChevronDown size={11} color={t.textMuted} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>

            {/* Date / Time / Duration */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div>
                <CompactLabel t={t}>Date *</CompactLabel>
                <input type="date" className="sls-input" value={form.date} onChange={e => upd("date", e.target.value)} />
              </div>
              <div>
                <CompactLabel t={t}>Time *</CompactLabel>
                <input type="time" className="sls-input" value={form.time} onChange={e => upd("time", e.target.value)} />
              </div>
              <div>
                <CompactLabel t={t}>Duration</CompactLabel>
                <div style={{ position: "relative" }}>
                  <select
                    className="sls-input"
                    value={form.duration}
                    onChange={e => upd("duration", e.target.value)}
                    style={{ cursor: "pointer", paddingRight: 30, appearance: "none" }}
                  >
                    <option value="">Select...</option>
                    {durations.map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                  <ChevronDown size={11} color={t.textMuted} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>
            </div>

            {/* Session Mode */}
            <div>
              <CompactLabel t={t}>Session Mode</CompactLabel>
              <div style={{ display: "flex", gap: 8 }}>
                {/* Custom Live card */}
                <div
                  className={`mode-card${form.mode === "custom" ? " sel-custom" : ""}`}
                  onClick={() => upd("mode", form.mode === "custom" ? "" : "custom")}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: form.mode === "custom" ? "rgba(34,197,94,0.14)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                    border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.35)" : t.modeCardBorder}`, flexShrink: 0,
                  }}>
                    <Zap size={13} color={form.mode === "custom" ? "#22c55e" : t.calIconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: form.mode === "custom" ? "#22c55e" : t.text, fontFamily: "'Poppins',sans-serif" }}>Custom Live</div>
                    <div style={{ fontSize: 9, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Your platform</div>
                  </div>
                  {form.mode === "custom" && <CheckCircle2 size={13} color="#22c55e" style={{ marginLeft: "auto" }} />}
                </div>

                {/* External Link card */}
                <div
                  className={`mode-card${form.mode === "external" ? " sel-ext" : ""}`}
                  onClick={() => upd("mode", form.mode === "external" ? "" : "external")}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: form.mode === "external" ? "rgba(0,120,212,0.12)" : (isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"),
                    border: `1px solid ${form.mode === "external" ? "rgba(0,120,212,0.35)" : t.modeCardBorder}`, flexShrink: 0,
                  }}>
                    <ExternalLink size={13} color={form.mode === "external" ? "#0078d4" : t.calIconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: form.mode === "external" ? "#0078d4" : t.text, fontFamily: "'Poppins',sans-serif" }}>External Link</div>
                    <div style={{ fontSize: 9, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Zoom / Meet</div>
                  </div>
                  {form.mode === "external" && <CheckCircle2 size={13} color="#0078d4" style={{ marginLeft: "auto" }} />}
                </div>
              </div>

              {/* Custom Live — Room ID */}
              {form.mode === "custom" && (
                <div style={{
                  marginTop: 8, padding: "8px 10px", borderRadius: 7,
                  background: isDark ? "rgba(34,197,94,0.05)" : "#f0fdf4",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                }}>
                  <Globe size={11} color="#22c55e" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#22c55e", flex: 1 }}>{form.roomId}</span>
                  <button
                    onClick={handleCopyRoomId}
                    style={{
                      display: "flex", alignItems: "center", gap: 3, padding: "3px 8px",
                      borderRadius: 5, border: "1px solid rgba(34,197,94,0.25)",
                      background: copied ? "rgba(34,197,94,0.10)" : "transparent",
                      color: "#22c55e", fontSize: 10, fontWeight: 600,
                      cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <Copy size={9} /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => upd("roomId", genRoomId())}
                    style={{
                      display: "flex", alignItems: "center", gap: 3, padding: "3px 8px",
                      borderRadius: 5, border: "1px solid rgba(34,197,94,0.25)",
                      background: "transparent", color: "#22c55e", fontSize: 10,
                      fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
                    }}
                  >
                    <RefreshCw size={9} />
                  </button>
                </div>
              )}

              {/* External Link input */}
              {form.mode === "external" && (
                <div style={{ marginTop: 8, position: "relative" }}>
                  <Link size={11} color={t.calIconColor} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    className="sls-input"
                    value={form.meetingLink}
                    onChange={e => upd("meetingLink", e.target.value)}
                    placeholder="Paste Zoom / Meet / Teams link..."
                    style={{ paddingLeft: 28 }}
                  />
                </div>
              )}
            </div>

            {/* Next button */}
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
              <button
                className="next-btn"
                onClick={() => { if (step1Valid) setCurrentStep(2); else alert("Fill Title, Batch, Date & Time."); }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Settings ── */}
        {currentStep === 2 && (
          <div>
            {[
              { key: "chat",          label: "Enable Chat",     sub: "Students can message during live",  Icon: MessageSquare, color: "#22d3ee" },
              { key: "recording",     label: "Auto Record",     sub: "Save session for replay access",    Icon: Radio,         color: "#f43f5e" },
              { key: "notifications", label: "Notify Students", sub: "Push alert when going live",        Icon: Bell,          color: "#22c55e" },
            ].map(({ key, label, sub, Icon, color }) => (
              <div
                key={key}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderBottom: `1px solid ${t.border}`, transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.02)" : "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: form[key] ? `${color}14` : (isDark ? "rgba(255,255,255,0.04)" : "#f8fafc"),
                    border: `1px solid ${form[key] ? color + "30" : t.border}`,
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    <Icon size={14} color={form[key] ? color : t.calIconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{label}</div>
                    <div style={{ fontSize: 10, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{sub}</div>
                  </div>
                </div>
                <ToggleSwitch checked={form[key]} onChange={val => upd(key, val)} color={color} />
              </div>
            ))}
            <div style={{ padding: "12px 16px", display: "flex", justifyContent: "flex-end" }}>
              <button className="next-btn" onClick={() => setCurrentStep(3)}>
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review & Launch ── */}
        {currentStep === 3 && (
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Review grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { label: "Title",     value: form.title || "—",                              icon: <Video size={10} color="#22c55e" />        },
                { label: "Batch",     value: batchLabel || "—",                              icon: <Users size={10} color="#22d3ee" />        },
                { label: "Date",      value: form.date || "—",                               icon: <Calendar size={10} color="#a78bfa" />     },
                { label: "Time",      value: form.time || "—",                               icon: <Clock size={10} color="#f59e0b" />        },
                { label: "Duration",  value: form.duration ? `${form.duration} min` : "—",  icon: <Clock size={10} color="#2dd4bf" />        },
                { label: "Chat",      value: form.chat          ? "Enabled" : "Disabled",   icon: <MessageSquare size={10} color="#22d3ee" />},
                { label: "Recording", value: form.recording     ? "Enabled" : "Disabled",   icon: <Radio size={10} color="#f43f5e" />        },
                { label: "Notify",    value: form.notifications ? "Enabled" : "Disabled",   icon: <Bell size={10} color="#22c55e" />         },
              ].map(({ label, value, icon }) => (
                <div key={label} className="review-field">
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
                    {icon}
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", wordBreak: "break-all" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Mode row */}
            {form.mode && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 10, fontWeight: 600,
                  color: form.mode === "custom" ? "#22c55e" : "#0078d4",
                  background: form.mode === "custom" ? "rgba(34,197,94,0.10)" : "rgba(0,120,212,0.10)",
                  border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.28)" : "rgba(0,120,212,0.28)"}`,
                  padding: "3px 10px", borderRadius: 5, fontFamily: "'Poppins',sans-serif",
                }}>
                  {form.mode === "custom" ? <><Zap size={10} /> Custom Live</> : <><ExternalLink size={10} /> External</>}
                </span>
                {form.mode === "custom" && (
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: "#22c55e", fontWeight: 600 }}>{form.roomId}</span>
                )}
                {form.mode === "external" && form.meetingLink && (
                  <span style={{ fontSize: 10, color: t.textSub, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{form.meetingLink}</span>
                )}
              </div>
            )}

            {/* Go Live button */}
            <button
              onClick={handleGoLive}
              disabled={submitting || !step1Valid}
              style={{
                width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                background: !step1Valid
                  ? (isDark ? "rgba(34,197,94,0.25)" : "#bbf7d0")
                  : submitting ? "#16a34a" : "#22c55e",
                color: !step1Valid ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: 13, fontWeight: 800,
                cursor: !step1Valid || submitting ? "not-allowed" : "pointer",
                fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
                boxShadow: step1Valid && !submitting ? "0 6px 20px rgba(34,197,94,0.35)" : "none",
              }}
            >
              {submitting ? <>Starting…</> : (
                <>
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", background: "#fff",
                    display: "inline-block",
                    animation: step1Valid ? "liveDot 1.2s ease-in-out infinite" : "none",
                  }} />
                  {form.mode === "external" ? "Save & Notify Students" : "Go Live Now"}
                </>
              )}
            </button>

            {/* Schedule for later */}
            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: "100%", padding: "9px 0", borderRadius: 9,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                background: "transparent", color: t.textSub,
                fontSize: 11, fontWeight: 600,
                cursor: publishing ? "not-allowed" : "pointer",
                fontFamily: "'Poppins',sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              <SendIcon size={12} />{publishing ? "Scheduling…" : "Schedule for Later (Publish)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════
     RIGHT PANEL
  ══════════════ */
  const RightPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader icon={Calendar} color="#0078d4" title="Schedule" t={t} />

      <div className="panel-scroll">
        {/* Mini Calendar */}
        <MiniCalendar
          t={t}
          isDark={isDark}
          selectedDate={form.date}
          onSelectDate={(dateStr) => upd("date", dateStr)}
          sessionEvents={sessionEvents}
        />

        {/* Selected date events */}
        {form.date && (
          <div style={{ borderTop: `1px solid ${t.calDivider}` }}>
            <div style={{ padding: "8px 12px 4px" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
            </div>
            <div style={{ padding: "0 10px 10px" }}>
              {sessionEvents.filter(e => e.date === form.date).length === 0 ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <p style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No sessions scheduled</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {sessionEvents.filter(e => e.date === form.date).map((ev, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 7, padding: "5px 8px",
                      borderRadius: 6, background: t.calEventBg, border: `1px solid ${t.calEventBorder}`,
                    }}>
                      <div style={{ width: 2, height: 22, borderRadius: 99, background: "#0078d4", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: t.calEventText, fontFamily: "'Poppins',sans-serif" }}>{ev.title}</div>
                        <div style={{ fontSize: 8, color: t.calIconColor, fontFamily: "'Poppins',sans-serif" }}>Scheduled</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips box */}
        <div style={{
          margin: "0 10px 10px",
          background: isDark ? "rgba(0,120,212,0.06)" : "#f0f8ff",
          border: `1px solid ${isDark ? "rgba(0,120,212,0.2)" : "#bfdbfe"}`,
          borderRadius: 10, padding: "10px 12px",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#0078d4", fontFamily: "'Poppins',sans-serif", marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Tips</div>
          {[
            "Click a date to auto-fill",
            "Complete all 3 steps before going live",
            "'Schedule' saves without going live",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, marginBottom: 4 }}>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#0078d4", marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: t.textSub, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes liveDot     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.5)} }
        @keyframes toastIn     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator {
          opacity: 0.4; cursor: pointer;
          filter: ${isDark ? "invert(1)" : "none"};
        }
        select option { background: ${t.selectBg}; color: ${t.inputText}; }

        .sls-input {
          width: 100%; padding: 7px 10px; border-radius: 7px;
          border: 1px solid ${t.inputBorder};
          background: ${t.inputBg}; color: ${t.inputText};
          font-size: 11px; font-family: 'Poppins',sans-serif; font-weight: 500;
          outline: none; transition: border 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .sls-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.12);
        }
        .sls-input::placeholder { color: ${t.textMuted}; font-weight: 400; }

        .mode-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 8px;
          border: 1.5px solid ${t.modeCardBorder};
          background: ${t.modeCardBg};
          cursor: pointer; transition: all 0.18s; flex: 1;
        }
        .mode-card:hover {
          border-color: ${isDark ? "rgba(255,255,255,0.18)" : "#94a3b8"};
          background: ${t.modeCardHov};
        }
        .mode-card.sel-custom {
          border-color: #22c55e;
          background: ${isDark ? "rgba(34,197,94,0.06)" : "#f0fdf4"};
          box-shadow: 0 0 0 2px rgba(34,197,94,0.12);
        }
        .mode-card.sel-ext {
          border-color: #0078d4;
          background: ${isDark ? "rgba(0,120,212,0.06)" : "#eff6ff"};
          box-shadow: 0 0 0 2px rgba(0,120,212,0.12);
        }

        .review-field {
          background: ${t.reviewFieldBg};
          border: 1px solid ${t.reviewFieldBorder};
          border-radius: 7px; padding: 8px 10px;
        }

        .next-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 7px; border: none;
          background: #22c55e; color: #fff;
          font-size: 11px; font-weight: 700;
          cursor: pointer; font-family: 'Poppins',sans-serif;
          transition: all 0.18s;
        }
        .next-btn:hover { background: #16a34a; box-shadow: 0 3px 10px rgba(34,197,94,0.35); }

        .panel-scroll { overflow-y: auto; flex: 1; }
        .panel-scroll::-webkit-scrollbar { width: 3px; }
        .panel-scroll::-webkit-scrollbar-track { background: transparent; }
        .panel-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
          border-radius: 99px;
        }
      `}</style>

      <div style={{
        height: "calc(100vh - 60px)",
        background: t.pageBg,
        color: t.text,
        fontFamily: "'Poppins',sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* ── Hero Banner ── */}
        <div style={{
          position: "relative", padding: "28px 28px 24px",
          background: t.heroBannerBg,
          borderBottom: `1px solid ${t.heroBannerBorder}`,
          overflow: "hidden", flexShrink: 0,
        }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "#22c55e", filter: "blur(80px)", opacity: isDark ? 0.07 : 0.10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: 120, width: 120, height: 120, borderRadius: "50%", background: "#22c55e", filter: "blur(60px)", opacity: isDark ? 0.04 : 0.07, pointerEvents: "none" }} />

          {/* Back button */}
          <button
            onClick={() => navigate("/trainer/live")}
            style={{
              position: "absolute", top: 20, left: 20,
              width: 32, height: 32, borderRadius: 8,
              border: `1px solid ${t.border}`, background: "transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: t.textMuted, transition: "all 0.2s",
            }}
          >
            <ArrowLeft size={14} />
          </button>

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingLeft: 44 }}>
            <Radio size={11} color={isDark ? "rgba(255,255,255,0.3)" : "#94a3b8"} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "#94a3b8", fontFamily: "'Poppins',sans-serif" }}>LIVE STUDIO</span>
          </div>

          <h1 style={{
            fontFamily: "'Poppins',sans-serif", fontSize: 32, fontWeight: 900,
            letterSpacing: "-0.03em", color: t.text, margin: "0 0 6px",
            lineHeight: 1.1, paddingLeft: 44,
          }}>Start Live Session</h1>

          <p style={{
            fontFamily: "'Poppins',sans-serif", fontSize: 13,
            color: t.textSub, margin: 0, fontWeight: 400, paddingLeft: 44,
          }}>Schedule or go live instantly</p>
        </div>

        {/* ── Three-panel layout ── */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ThreePanelLayout
            t={t}
            isDark={isDark}
            left={LeftPanel}
            center={CenterPanel}
            right={RightPanel}
            defaultLeftW={210}
            defaultRightW={250}
            minLeft={170}
            maxLeft={300}
            minRight={200}
            maxRight={340}
          />
        </div>
      </div>
    </>
  );
};

export default StartLiveSession;