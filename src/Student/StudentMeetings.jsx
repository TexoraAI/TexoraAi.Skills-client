/*
 * StudentMeetings.jsx
 * ILMORA Meetings — Student workspace (wired to backend Meetings API)
 *
 * ── Nav integration (paste into your real files) ─────────────────────────────
 * Sidebar.jsx  (studentMenus, right after the Dashboard entry):
 *   { name: "Meetings", path: "/student/meetings", icon: Video }
 *
 * App.jsx:
 *   const StudentMeetings = lazyLoad(() => import("./Student/Meetings.jsx"));
 *   ...inside the /student nested <Route> block...
 *   <Route path="meetings" element={<StudentMeetings />} />
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Palette (blue system, inherited from Sidebar.jsx):
 *   --brand:      #2563eb   (primary blue)
 *   --brand-2:    #6366f1   (indigo, gradient partner)
 *   --live:       #14b8a6   (teal — live / verified state)
 *   --accent:     #f59e0b   (amber — supporting accent)
 *   --accent-2:   #f43f5e   (rose — attendance streak highlight, Student-only 4th stat)
 *   dark bg:      #000000   (pure black, per Sidebar.jsx convention)
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Video,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Link2,
  ShieldCheck,
  CalendarDays,
  CalendarClock,
  Users,
  Clock,
  Sun,
  Moon,
  KeyRound,
  ArrowUpRight,
  CalendarPlus,
  ExternalLink,
  X,
  Check,
  PlayCircle,
  Copy,
  CheckCircle2,
  Users2,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getMyMeetings,
  createInstantMeeting,
  createScheduledMeeting,
  validateMeetingJoinCode,
  getAllJoinRequests,
  deleteMeetingApi,
  getMeetingsCalendar,
} from "../services/liveSessionService"; // adjust path to match each file's actual location

/* ---------------------------------------------------------------------------
 * Helpers — calendar export (frontend-only: Google Calendar URL + .ics blob)
 * ------------------------------------------------------------------------- */
const pad = (n) => (n < 10 ? "0" + n : "" + n);

function toGCalStamp(d) {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    "00Z"
  );
}

function buildGoogleCalendarUrl({ title, start, end, details }) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${toGCalStamp(start)}/${toGCalStamp(end)}`,
    details: details || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildICS({ title, start, end, details }) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ILMORA//Meetings//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@ilmora.app`,
    `DTSTAMP:${toGCalStamp(new Date())}`,
    `DTSTART:${toGCalStamp(start)}`,
    `DTEND:${toGCalStamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${(details || "").replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(session) {
  const blob = new Blob([buildICS(session)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.title.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatClock(d) {
  let h = d.getHours();
  const m = pad(d.getMinutes());
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const day = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return `${pad(h)}:${m} ${ampm} · ${day}`;
}

/* ---------------------------------------------------------------------------
 * Current user helper — reads the real lms_user object instead of the
 * nonexistent "lms_user_name" key. Falls back gracefully at every step.
 * ------------------------------------------------------------------------- */
function getCurrentUserName() {
  try {
    const raw = localStorage.getItem("lms_user");
    if (!raw) return "You";
    const user = JSON.parse(raw);
    return user?.name || user?.email || "You";
  } catch {
    return "You";
  }
}

/* ---------------------------------------------------------------------------
 * Map backend MeetingResponseDTO -> this page's session row shape
 * ------------------------------------------------------------------------- */
// function mapMeetingToRow(m) {
//   return {
//     id: m.id,
//     joinCode: m.joinCode,
//     title: m.title,
//     // trainer: m.creatorName || m.creatorId,
//     trainer: m.creatorName || "—",
//     creatorEmail: m.creatorId || "—",
//     batch: "—",
//     time:
//       m.meetingStatus === "SCHEDULED" && m.scheduledTimeUtc
//         ? new Date(m.scheduledTimeUtc).toLocaleString()
//         : "Now",
//     // status:
//     //   m.meetingStatus === "ACTIVE"
//     //     ? "live"
//     //     : m.meetingStatus === "SCHEDULED"
//     //       ? "scheduled"
//     //       : "upcoming",
//     status:
//       m.meetingStatus === "ACTIVE"
//         ? "live"
//         : m.meetingStatus === "SCHEDULED"
//           ? "scheduled"
//           : m.meetingStatus === "ENDED"
//             ? "completed"
//             : "upcoming",
//   };
// }
// Guards against browsers rejecting Java's default LocalDateTime
// serialization (e.g. nanosecond fractions) — shows a clean fallback
// instead of "Invalid Date" if the value can't be parsed.
// function formatDateTime(value) {
//   if (!value) return null;
//   const d = new Date(value);
//   return isNaN(d.getTime()) ? null : d.toLocaleString();
// }
function parseUtcDate(value) {
  if (!value) return null;
  // Backend sends an unmarked "yyyy-MM-dd'T'HH:mm:ss" string that is
  // actually a UTC instant with no zone/offset in it. JS's Date treats
  // an unmarked string as *local* time, silently shifting it by your
  // timezone offset — that's what made a scheduled meeting look startable
  // immediately after creation. Appending "Z" forces correct UTC parsing.
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateTime(value) {
  const d = parseUtcDate(value);
  return d ? d.toLocaleString() : null;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function mapMeetingToRow(m) {
  const scheduledLabel = formatDateTime(m.scheduledTimeUtc);
  const endedLabel = formatDateTime(m.endedAt);
  return {
    id: m.id,
    joinCode: m.joinCode,
    title: m.title,
    trainer: m.creatorName || "—",
    creatorEmail: m.creatorId || "—",
    batch: "—",
    // Raw value kept (not just the formatted label) so SessionRow can
    // compare it against "now" to know whether the scheduled time has
    // actually arrived yet.
    scheduledTimeUtc: m.scheduledTimeUtc || null,
    time:
      m.meetingStatus === "SCHEDULED"
        ? scheduledLabel
          ? `Starts ${scheduledLabel}`
          : "Scheduled"
        : m.meetingStatus === "ENDED"
          ? endedLabel
            ? `Ended ${endedLabel}`
            : "Ended"
          : "Now",
    status:
      m.meetingStatus === "ACTIVE"
        ? "live"
        : m.meetingStatus === "SCHEDULED"
          ? "scheduled"
          : m.meetingStatus === "ENDED"
            ? "completed"
            : "upcoming",
  };
}

const SLIDES = [
  {
    icon: Link2,
    title: "Share a session link",
    body: "Start a New meeting to get a link you can send to trainers and students you want in the class.",
    variant: "link",
  },
  {
    icon: CalendarClock,
    title: "Plan sessions ahead",
    body: "Create a New meeting to schedule sessions on the batch calendar and notify participants in advance.",
    variant: "schedule",
  },
  {
    icon: ShieldCheck,
    title: "Every session is verified",
    body: "No one can join a session unless invited or admitted by the trainer or admin.",
    variant: "verified",
  },
  {
    icon: CalendarDays,
    title: "Attendance, automatically",
    body: "Every join and leave is logged automatically for trainers, batches, and admins — no manual roll call.",
    variant: "attendance",
  },
];

/* ---------------------------------------------------------------------------
 * Illustration — abstract layered "video tile" scene, badge icon overlay
 * ------------------------------------------------------------------------- */
function MeetingIllustration({ variant }) {
  return (
    <div className={`illo illo--${variant}`}>
      <div className="illo-grid">
        <div className="illo-tile illo-tile--main">
          <span className="illo-avatar" />
          <span className="illo-bar illo-bar--w60" />
          <span className="illo-bar illo-bar--w35" />
        </div>
        <div className="illo-tile illo-tile--sm">
          <span className="illo-avatar illo-avatar--sm" />
        </div>
        <div className="illo-tile illo-tile--sm illo-tile--alt">
          <span className="illo-avatar illo-avatar--sm" />
        </div>
      </div>
      <div className="illo-dot illo-dot--a" />
      <div className="illo-dot illo-dot--b" />
      <div className="illo-badge">
        {variant === "link" && <Link2 size={22} />}
        {variant === "schedule" && <CalendarClock size={22} />}
        {variant === "verified" && <ShieldCheck size={22} />}
        {variant === "attendance" && <CalendarDays size={22} />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Carousel
 * ------------------------------------------------------------------------- */
function SpotlightCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, [paused]);

  const go = useCallback(
    (i) => setActive((i + SLIDES.length) % SLIDES.length),
    [],
  );

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        className="carousel-arrow carousel-arrow--l"
        onClick={() => go(active - 1)}
        aria-label="Previous"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="carousel-stage">
        {SLIDES.map((s, i) => (
          <div
            key={s.title}
            className={`carousel-slide ${i === active ? "is-active" : ""}`}
          >
            <MeetingIllustration variant={s.variant} />
            <div className="carousel-copy">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-arrow carousel-arrow--r"
        onClick={() => go(active + 1)}
        aria-label="Next"
      >
        <ChevronRight size={18} />
      </button>

      <div className="carousel-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === active ? "is-active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * New meeting — split button (Start instant / Schedule for later / Add to calendar)
 * Now available to Student too, per product decision to let students host study sessions.
 * ------------------------------------------------------------------------- */
function NewMeetingSplit({ onStartInstant, onSchedule, onAddToCalendar }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="split-btn" ref={ref}>
      <button className="split-btn-main" onClick={onStartInstant}>
        <Plus size={16} /> New meeting
      </button>
      <button
        className="split-btn-caret"
        onClick={() => setOpen((o) => !o)}
        aria-label="More options"
      >
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="split-menu">
          <button
            onClick={() => {
              setOpen(false);
              onStartInstant();
            }}
          >
            <PlayCircle size={16} /> Start instant session
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onSchedule();
            }}
          >
            <CalendarClock size={16} /> Schedule for later
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onAddToCalendar();
            }}
          >
            <CalendarPlus size={16} /> Add to calendar
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Schedule modal (lightweight, mock — client-side only)
 * ------------------------------------------------------------------------- */
function ScheduleModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [batch, setBatch] = useState("");

  const canSave = title && date && time;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Schedule for later</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>Session title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Group study — Arrays"
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>
          <label className="field">
            <span>Batch / participants</span>
            <input
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="e.g. FSD-Batch 12"
            />
          </label>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            disabled={!canSave}
            onClick={() => {
              onSave({ title, date, time, batch });
              onClose();
            }}
          >
            <Check size={16} /> Save session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Meeting link modal — shown right after a meeting is created, so the
 * host can copy/share the link before anyone actually joins the room.
 * ------------------------------------------------------------------------- */
function MeetingLinkModal({ meeting, onClose, onJoinNow }) {
  const [copied, setCopied] = useState(false);
  if (!meeting) return null;

  const link = `${window.location.origin}/workspace/${meeting.joinCode}`;
  const isScheduled = meeting.status === "scheduled";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on non-HTTPS/older browsers — fall back silently.
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{isScheduled ? "Session scheduled" : "Your meeting is ready"}</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>Session code</span>
            <div className="link-row">
              <input readOnly value={meeting.joinCode} />
            </div>
          </label>
          <label className="field">
            <span>Shareable link</span>
            <div className="link-row">
              <input readOnly value={link} />
              <button
                type="button"
                className="icon-btn"
                title="Copy link"
                onClick={handleCopy}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </label>
          {copied && <div className="copy-confirm">Link copied ✓</div>}
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>
            {isScheduled ? "Done" : "Later"}
          </button>
          {!isScheduled && (
            <button className="btn-primary" onClick={onJoinNow}>
              <ArrowUpRight size={16} /> Join now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// function MeetingCalendar({
//   calendarData,
//   month,
//   onMonthChange,
//   selectedDate,
//   onSelectDate,
// }) {
//   const [year, mon] = month.split("-").map(Number);
//   const firstOfMonth = new Date(year, mon - 1, 1);
//   const startWeekday = firstOfMonth.getDay(); // 0 = Sun
//   const daysInMonth = new Date(year, mon, 0).getDate();
//   const todayKey = new Date().toISOString().slice(0, 10);

//   const cells = [];
//   for (let i = 0; i < startWeekday; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(d);

//   const shiftMonth = (delta) => {
//     const next = new Date(year, mon - 1 + delta, 1);
//     onMonthChange(
//       `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
//     );
//   };

//   const monthLabel = firstOfMonth.toLocaleDateString(undefined, {
//     month: "long",
//     year: "numeric",
//   });

//   const selectedList = selectedDate ? calendarData[selectedDate] || [] : [];

//   return (
//     <aside className="calendar-card">
//       <div className="cal-head">
//         <button
//           className="icon-btn"
//           onClick={() => shiftMonth(-1)}
//           aria-label="Previous month"
//         >
//           <ChevronLeft size={15} />
//         </button>
//         <span className="cal-month-label">{monthLabel}</span>
//         <button
//           className="icon-btn"
//           onClick={() => shiftMonth(1)}
//           aria-label="Next month"
//         >
//           <ChevronRight size={15} />
//         </button>
//       </div>
//       <div className="cal-weekdays">
//         {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
//           <span key={i}>{d}</span>
//         ))}
//       </div>
//       <div className="cal-grid">
//         {cells.map((d, i) => {
//           if (d === null)
//             return <span key={i} className="cal-cell cal-cell--empty" />;
//           const key = `${year}-${String(mon).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
//           const hasEvents = !!calendarData[key]?.length;
//           const isToday = key === todayKey;
//           const isSelected = key === selectedDate;
//           return (
//             <button
//               key={i}
//               className={`cal-cell ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${hasEvents ? "has-events" : ""}`}
//               onClick={() => onSelectDate(key)}
//             >
//               {d}
//               {hasEvents && <span className="cal-dot" />}
//             </button>
//           );
//         })}
//       </div>

//       <div className="cal-day-panel">
//         <div className="cal-day-panel-head">
//           {selectedDate
//             ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
//                 undefined,
//                 {
//                   weekday: "short",
//                   month: "short",
//                   day: "numeric",
//                 },
//               )
//             : "Select a date"}
//         </div>
//         {selectedDate && selectedList.length === 0 && (
//           <p className="muted" style={{ padding: "0 4px" }}>
//             No sessions on this day.
//           </p>
//         )}
//         {selectedList.map((m) => (
//           <div key={m.id} className="cal-event">
//             <span
//               className={`cal-event-dot ${m.meetingStatus?.toLowerCase()}`}
//             />
//             <div style={{ minWidth: 0 }}>
//               <div className="cal-event-title">{m.title}</div>
//               <div className="cal-event-time">
//                 {m.scheduledTimeUtc
//                   ? new Date(m.scheduledTimeUtc + "Z").toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })
//                   : m.meetingStatus}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// }
function parseCalendarUtc(value) {
  if (!value) return null;
  // Backend sends an unmarked UTC string with no zone — appending "Z"
  // forces correct UTC parsing instead of JS treating it as local time.
  const iso = /[zZ]|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function MeetingCalendar({
  calendarData,
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  sessions = [],
}) {
  const [year, mon] = month.split("-").map(Number);
  const firstOfMonth = new Date(year, mon - 1, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, mon, 0).getDate();
  const todayKey = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const shiftMonth = (delta) => {
    const next = new Date(year, mon - 1 + delta, 1);
    onMonthChange(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const monthLabel = firstOfMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const selectedList = selectedDate ? calendarData[selectedDate] || [] : [];

  // Upcoming sessions — sessions whose scheduled time is still ahead of
  // "now", shown by default so nothing needs to be clicked to see them.
  const now = new Date();
  const upcoming = sessions
    .filter((s) => s.status === "scheduled" && s.scheduledTimeUtc)
    .map((s) => ({ ...s, _date: parseCalendarUtc(s.scheduledTimeUtc) }))
    .filter((s) => s._date && s._date > now)
    .sort((a, b) => a._date - b._date)
    .slice(0, 5);

  return (
    <aside className="calendar-card">
      <div className="cal-head">
        <button
          className="icon-btn"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="cal-month-label">{monthLabel}</span>
        <button
          className="icon-btn"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="cal-weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {cells.map((d, i) => {
          if (d === null)
            return <span key={i} className="cal-cell cal-cell--empty" />;
          const key = `${year}-${String(mon).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const dayEvents = calendarData[key] || [];
          const hasEvents = dayEvents.length > 0;
          const hasLive = dayEvents.some((m) => m.meetingStatus === "ACTIVE");
          const hasScheduled = dayEvents.some(
            (m) => m.meetingStatus === "SCHEDULED",
          );
          const isToday = key === todayKey;
          const isSelected = key === selectedDate;
          return (
            <button
              key={i}
              className={`cal-cell ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${hasEvents ? "has-events" : ""} ${hasLive ? "has-live" : ""} ${hasScheduled ? "has-scheduled" : ""}`}
              onClick={() => onSelectDate(key)}
              title={
                hasEvents ? dayEvents.map((m) => m.title).join(", ") : undefined
              }
            >
              {d}
              {hasEvents && <span className="cal-dot" />}
            </button>
          );
        })}
      </div>

      <div className="cal-day-panel">
        {selectedDate ? (
          <>
            <div className="cal-day-panel-head">
              <span>
                {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  undefined,
                  { weekday: "short", month: "short", day: "numeric" },
                )}
              </span>
              <button
                className="cal-clear-btn"
                onClick={() => onSelectDate(null)}
              >
                Upcoming
              </button>
            </div>
            {selectedList.length === 0 && (
              <p className="muted" style={{ padding: "0 4px" }}>
                No sessions on this day.
              </p>
            )}
            {selectedList.map((m) => (
              <div key={m.id} className="cal-event">
                <span
                  className={`cal-event-dot ${m.meetingStatus?.toLowerCase()}`}
                />
                <div style={{ minWidth: 0 }}>
                  <div className="cal-event-title">{m.title}</div>
                  <div className="cal-event-time">
                    {m.scheduledTimeUtc
                      ? new Date(m.scheduledTimeUtc + "Z").toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : m.meetingStatus}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="cal-day-panel-head">Upcoming sessions</div>
            {upcoming.length === 0 && (
              <p className="muted" style={{ padding: "0 4px" }}>
                No upcoming sessions scheduled.
              </p>
            )}
            {upcoming.map((s) => (
              <div
                key={s.id}
                className="cal-event cal-event--clickable"
                onClick={() => onSelectDate(s._date.toISOString().slice(0, 10))}
              >
                <span className="cal-event-dot scheduled" />
                <div style={{ minWidth: 0 }}>
                  <div className="cal-event-title">{s.title}</div>
                  <div className="cal-event-time">
                    {s._date.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    ·{" "}
                    {s._date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
/* ---------------------------------------------------------------------------
 * Stat card
 * ------------------------------------------------------------------------- */
function StatCard({ icon: Icon, label, value, delta, tone }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-underline" />
      {delta && <div className="stat-delta">↑ {delta}</div>}
    </div>
  );
}

function InstantMeetingModal({ onClose, onStart }) {
  const [title, setTitle] = useState("");
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Start instant session</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            <span>Session name</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Java doubts session"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onStart(title);
              }}
            />
          </label>
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={() => onStart(title)}>
            <PlayCircle size={16} /> Start now
          </button>
        </div>
      </div>
    </div>
  );
}
/* ---------------------------------------------------------------------------
 * Join requests modal — "View details": who requested to join this meeting,
 * whether they were admitted/denied/never responded to, and when.
 * ------------------------------------------------------------------------- */
function JoinRequestsModal({ meetingId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!meetingId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    getAllJoinRequests(meetingId)
      .then((res) => {
        if (!cancelled) setRequests(res.data || []);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err?.response?.data?.error || "Couldn't load join requests.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  const statusMeta = {
    ADMITTED: { label: "Joined", bg: "rgba(34,197,94,.14)", color: "#16a34a" },
    DENIED: { label: "Denied", bg: "rgba(239,68,68,.14)", color: "#dc2626" },
    PENDING: {
      label: "Never responded",
      bg: "rgba(148,163,184,.18)",
      color: "#64748b",
    },
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{
          width: 480,
          maxHeight: "78vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h3>Who requested to join</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {loading && <p className="muted">Loading…</p>}
          {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
          {!loading && !error && requests.length === 0 && (
            <p className="muted">
              No one has requested to join this meeting yet.
            </p>
          )}
          {!loading &&
            !error &&
            requests.map((r) => {
              const meta = statusMeta[r.status] || statusMeta.PENDING;
              return (
                <div
                  key={r.requestId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                      {r.guestName || "Guest"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {r.guestEmail || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      Requested{" "}
                      {r.requestedAt
                        ? new Date(r.requestedAt).toLocaleString()
                        : "—"}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: meta.bg,
                      color: meta.color,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {meta.label}
                  </span>
                </div>
              );
            })}
        </div>
        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionRow({ s, onJoin, onViewDetails, onDelete }) {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10,
    0,
  );
  const end = new Date(start.getTime() + 60 * 60000);

  const evt = {
    title: s.title,
    start,
    end,
    details: `${s.trainer} · ${s.batch}`,
  };

  const isCompleted = s.status === "completed";
  // Backend flips SCHEDULED -> ACTIVE automatically once the scheduled
  // time is due (MeetingScheduler runs every 30s). Until then, a
  // "scheduled" meeting whose start time is still in the future should
  // not be joinable yet — this compares against the real start time
  // instead of just trusting the status label.
  //   const scheduledDate = s.scheduledTimeUtc
  //     ? new Date(s.scheduledTimeUtc)
  //     : null;
  //   const isPending =
  //     s.status === "scheduled" &&
  //     scheduledDate &&
  //     !isNaN(scheduledDate.getTime()) &&
  //     scheduledDate > now;
  const scheduledDate = parseUtcDate(s.scheduledTimeUtc);
  const isPending =
    s.status === "scheduled" && scheduledDate && scheduledDate > now;

  return (
    <div className="session-row">
      <div className={`session-dot ${s.status}`} />
      <div className="session-main">
        <div className="session-title">{s.title}</div>
        <div className="session-meta">{s.creatorEmail}</div>
      </div>
      <div className="session-time">
        <Clock size={14} /> {s.time}
      </div>
      <div className="session-actions">
        {s.status !== "live" && !isCompleted && (
          <>
            <a
              className="icon-btn"
              href={buildGoogleCalendarUrl(evt)}
              target="_blank"
              rel="noreferrer"
              title="Add to Google Calendar"
            >
              <ExternalLink size={14} />
            </a>
            <button
              className="icon-btn"
              title="Download .ics"
              onClick={() => downloadICS(evt)}
            >
              <CalendarPlus size={14} />
            </button>
          </>
        )}
        <button
          className={`btn-join ${s.status === "live" ? "is-live" : ""} ${isCompleted ? "is-completed" : ""}`}
          disabled={s.status === "upcoming" || isCompleted || isPending}
          onClick={() => !isCompleted && !isPending && onJoin(s.joinCode)}
        >
          {s.status === "live"
            ? "Join now"
            : isPending
              ? "Not yet"
              : s.status === "scheduled"
                ? "Join"
                : isCompleted
                  ? "Completed"
                  : "Not yet"}
          {!isCompleted && !isPending && <ArrowUpRight size={14} />}
        </button>
        <button
          className="icon-btn"
          title="View who requested to join"
          onClick={() => onViewDetails(s.id)}
        >
          <Users2 size={14} />
        </button>
        <button
          className="icon-btn"
          title="Delete meeting"
          style={{ color: "#dc2626" }}
          onClick={() => onDelete(s.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
/* ---------------------------------------------------------------------------
 * Main page
 * ------------------------------------------------------------------------- */
export default function StudentMeetings() {
  const [dark, setDark] = useState(false);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [sessions, setSessions] = useState([]);
  const [linkMeeting, setLinkMeeting] = useState(null); // { joinCode, status }
  const [showInstantModal, setShowInstantModal] = useState(false);
  const [detailsMeetingId, setDetailsMeetingId] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const currentUserName = getCurrentUserName();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    getMyMeetings()
      .then((res) => setSessions(res.data.map(mapMeetingToRow)))
      .catch((err) => console.error("Failed to load meetings", err));
  }, []);

  const refreshCalendar = useCallback((month) => {
    getMeetingsCalendar(month)
      .then((res) => setCalendarData(res.data || {}))
      .catch((err) => console.error("Failed to load calendar", err));
  }, []);

  useEffect(() => {
    refreshCalendar(calendarMonth);
  }, [calendarMonth, refreshCalendar]);

  const liveCount = sessions.filter((s) => s.status === "live").length;
  const scheduledTodayCount = sessions.filter(
    (s) =>
      s.status === "scheduled" &&
      s.scheduledTimeUtc &&
      isSameDay(new Date(s.scheduledTimeUtc), now),
  ).length;
  const thisWeekCount = sessions.length;
  const attendancePct = 92;

  //   const handleStartInstant = async () => {
  //     try {
  //       const res = await createInstantMeeting({
  //         title: "My instant session",
  //         creatorName: currentUserName,
  //       });
  //       // Show the link first instead of navigating straight into the room —
  //       // gives the student a chance to copy/share it with study partners.
  //       setLinkMeeting({ joinCode: res.data.joinCode, status: "live" });
  //       const refreshed = await getMyMeetings();
  //       setSessions(refreshed.data.map(mapMeetingToRow));
  //     } catch (err) {
  //       console.error("Failed to start instant meeting", err);
  //     }
  //   };
  const handleStartInstant = async (title) => {
    try {
      const res = await createInstantMeeting({
        title: title?.trim() || undefined,
        creatorName: currentUserName,
      });
      setLinkMeeting({ joinCode: res.data.joinCode, status: "live" });
      const refreshed = await getMyMeetings();
      setSessions(refreshed.data.map(mapMeetingToRow));
      refreshCalendar(calendarMonth); // NEW
    } catch (err) {
      console.error("Failed to start instant meeting", err);
    }
  };

  const handleAddToCalendar = () => setShowSchedule(true);

  const handleSaveSchedule = async ({ title, date, time }) => {
    try {
      const res = await createScheduledMeeting({
        title: title || "Untitled session",
        date,
        time,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        creatorName: currentUserName,
      });
      setLinkMeeting({ joinCode: res.data.joinCode, status: "scheduled" });
      const refreshed = await getMyMeetings();
      setSessions(refreshed.data.map(mapMeetingToRow));
      refreshCalendar(calendarMonth);
      //     } catch (err) {
      //       console.error("Failed to schedule meeting", err);
      //     }
      //   };
    } catch (err) {
      console.error("Failed to schedule meeting", err);
      alert(
        err?.response?.data?.error ||
          "Couldn't schedule this meeting. Try again.",
      );
    }
  };
  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm("Delete this meeting? This can't be undone.")) return;
    try {
      await deleteMeetingApi(meetingId);
      setSessions((prev) => prev.filter((s) => s.id !== meetingId));
      refreshCalendar(calendarMonth); // NEW
    } catch (err) {
      console.error("Failed to delete meeting", err);
      alert(
        err?.response?.data?.error ||
          "Couldn't delete this meeting. Try again.",
      );
    }
  };

  return (
    <div
      className="ilmora-student-meetings"
      data-dark={dark ? "true" : undefined}
    >
      <style>{STYLES}</style>

      <div className="mesh-bg">
        <div className="mesh-blob mesh-blob--1" />
        <div className="mesh-blob mesh-blob--2" />
        <div className="mesh-blob mesh-blob--3" />
      </div>

      <div className="page-inner">
        {/* Header */}
        <header className="page-header">
          <div className="brand-lockup">
            <div className="logo-mark">
              <Video size={20} />
            </div>
            <div>
              <div className="wordmark">
                {/* <span className="ilm">ILM</span>
                <span className="ora">ORA</span> */}
                <span className="wm-suffix"> WorkSpace</span>
              </div>
              <div className="subtitle">Student workspace</div>
            </div>
          </div>
          <div className="header-right">
            <div className="live-pill">
              <span className="pulse-dot" /> {liveCount} live now
            </div>
            <div className="clock">{formatClock(now)}</div>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> Work hub
            </div>
            <h1>Join your next class, right on time.</h1>
            <p>
              See what's live, hop into scheduled sessions, catch up on
              recordings.
            </p>

            <div className="hero-actions">
              <div className="join-by-code">
                <KeyRound size={16} />
                <input
                  placeholder="Enter session code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                />
                <button
                  className="btn-primary"
                  disabled={!joinCode}
                  onClick={async () => {
                    try {
                      const res = await validateMeetingJoinCode(joinCode);
                      if (res.data.valid) {
                        setJoinError("");
                        navigate(`/workspace/${joinCode}`);
                      } else {
                        setJoinError(res.data.message || "Invalid code");
                      }
                    } catch (err) {
                      setJoinError("Invalid code");
                    }
                  }}
                >
                  Join <ArrowUpRight size={14} />
                </button>
              </div>
              {/* <NewMeetingSplit
                onStartInstant={handleStartInstant}
                onSchedule={() => setShowSchedule(true)}
                onAddToCalendar={handleAddToCalendar}
              /> */}
              <NewMeetingSplit
                onStartInstant={() => setShowInstantModal(true)}
                onSchedule={() => setShowSchedule(true)}
                onAddToCalendar={handleAddToCalendar}
              />
            </div>
            {joinError && (
              <div className="pill-row" style={{ color: "#dc2626" }}>
                {joinError}
              </div>
            )}
            <div className="pill-row">
              0 courses · 0 completed · All clear ✓
            </div>
          </div>
        </section>

        {/* Carousel */}
        <SpotlightCarousel />

        {/* Stats */}
        <section className="stat-grid">
          <StatCard
            icon={Video}
            label="Live now"
            value={liveCount}
            tone="brand"
          />
          <StatCard
            icon={CalendarClock}
            label="Scheduled today"
            value={scheduledTodayCount}
            tone="live"
          />
          <StatCard
            icon={CalendarDays}
            label="This week"
            value={thisWeekCount}
            tone="accent"
          />
          <StatCard
            icon={ShieldCheck}
            label="Attendance %"
            value={`${attendancePct}%`}
            delta="4% vs last week"
            tone="rose"
          />
        </section>

        {/* Session list */}
        {/* <section className="session-list">
          <div className="session-list-head">
            <h2>Your sessions</h2>
            <span className="muted">{sessions.length} total</span>
          </div>
          <div className="session-list-body">
            {sessions.map((s) => (
              <SessionRow
                key={s.id}
                s={s}
                onJoin={(code) => code && navigate(`/ilmorameet/${code}`)}
                onViewDetails={(id) => setDetailsMeetingId(id)}
                onDelete={handleDeleteMeeting}
              />
            ))}
          </div>
        </section> */}
        {/* Session list */}
        <div className="content-grid">
          <section className="session-list">
            <div className="session-list-head">
              <h2>Your sessions</h2>
              <span className="muted">{sessions.length} total</span>
            </div>
            <div className="session-list-body">
              {sessions.map((s) => (
                <SessionRow
                  key={s.id}
                  s={s}
                  onJoin={(code) => code && navigate(`/workspace/${code}`)}
                  onViewDetails={(id) => setDetailsMeetingId(id)}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          </section>

          <MeetingCalendar
            calendarData={calendarData}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            sessions={sessions}
          />
        </div>
      </div>

      {showSchedule && (
        <ScheduleModal
          onClose={() => setShowSchedule(false)}
          onSave={handleSaveSchedule}
        />
      )}

      {linkMeeting && (
        <MeetingLinkModal
          meeting={linkMeeting}
          onClose={() => setLinkMeeting(null)}
          onJoinNow={() => {
            const code = linkMeeting.joinCode;
            setLinkMeeting(null);
            navigate(`/workspace/${code}`);
          }}
        />
      )}
      {showInstantModal && (
        <InstantMeetingModal
          onClose={() => setShowInstantModal(false)}
          onStart={(title) => {
            setShowInstantModal(false);
            handleStartInstant(title);
          }}
        />
      )}
      {detailsMeetingId && (
        <JoinRequestsModal
          meetingId={detailsMeetingId}
          onClose={() => setDetailsMeetingId(null)}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Styles — scoped under .ilmora-student-meetings, blue system + rose accent
 * ------------------------------------------------------------------------- */
const STYLES = `
.ilmora-student-meetings {
  --brand: #2563eb;
  --brand-2: #6366f1;
  --live: #14b8a6;
  --accent: #f59e0b;
  --accent-2: #f43f5e;
  --bg: #f6f8fc;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: rgba(15, 23, 42, 0.08);
  position: relative;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-x: hidden;
  transition: background .3s ease, color .3s ease;
}
.ilmora-student-meetings[data-dark] {
  --bg: #000000;
  --card: #101319;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --border: rgba(255,255,255,0.08);
}

.mesh-bg { position: absolute; inset: 0; overflow: hidden; z-index: 0; pointer-events: none; }
.mesh-blob { position: absolute; border-radius: 9999px; filter: blur(90px); opacity: .32; }
[data-dark] .mesh-blob { opacity: .16; }
.mesh-blob--1 { width: 520px; height: 520px; top: -160px; left: -120px; background: radial-gradient(circle, var(--brand), transparent 70%); }
.mesh-blob--2 { width: 480px; height: 480px; top: -100px; right: -160px; background: radial-gradient(circle, var(--live), transparent 70%); }
.mesh-blob--3 { width: 460px; height: 460px; bottom: -200px; left: 30%; background: radial-gradient(circle, var(--accent), transparent 70%); }

.page-inner { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 28px 32px 80px; }

.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.brand-lockup { display: flex; align-items: center; gap: 12px; }
.logo-mark { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; background: linear-gradient(135deg, var(--brand), var(--brand-2)); box-shadow: 0 6px 16px rgba(37,99,235,.35); }
.wordmark { font-weight: 800; font-size: 17px; letter-spacing: -0.01em; }
.wordmark .ilm { color: #16a34a; }
.wordmark .ora { color: #f97316; }
.wm-suffix { color: var(--text); font-weight: 700; }
.subtitle { font-size: 12.5px; color: var(--muted); margin-top: 1px; }

.header-right { display: flex; align-items: center; gap: 12px; }
.live-pill { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: rgba(20,184,166,.12); color: #0f766e; }
[data-dark] .live-pill { background: rgba(20,184,166,.16); color: #5eead4; }
.pulse-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--live); box-shadow: 0 0 0 0 rgba(20,184,166,.6); animation: pulse 1.8s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(20,184,166,.55);} 70% { box-shadow: 0 0 0 8px rgba(20,184,166,0);} 100% { box-shadow: 0 0 0 0 rgba(20,184,166,0);} }
.clock { font-size: 12.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 10px; border: 1px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; transition: transform .15s ease, background .15s ease; }
.icon-btn:hover { transform: translateY(-1px); background: rgba(37,99,235,.08); }
.avatar { width: 34px; height: 34px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--brand-2), var(--accent-2)); }

.hero { display: flex; margin-bottom: 26px; }
.hero-copy { max-width: 640px; }
.eyebrow { display: flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--brand); margin-bottom: 10px; }
.eyebrow-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--brand); }
.hero h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; line-height: 1.15; }
.hero p { color: var(--muted); font-size: 14.5px; margin: 0 0 20px; }
.hero-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }

.join-by-code { display: flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--border); padding: 6px 8px 6px 12px; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
.join-by-code svg { color: var(--muted); }
.join-by-code input { border: none; outline: none; background: transparent; font-size: 13.5px; width: 150px; color: var(--text); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, var(--brand), var(--brand-2)); color: #fff; border: none; padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 16px rgba(37,99,235,.3); transition: transform .15s ease, opacity .15s ease; }
.btn-primary:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.btn-primary:not(:disabled):hover { transform: translateY(-1px); }
.btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; }

.split-btn { position: relative; display: flex; }
.split-btn-main { display: flex; align-items: center; gap: 6px; background: var(--text); color: var(--bg); border: none; padding: 8px 14px; border-radius: 9px 0 0 9px; font-size: 13px; font-weight: 700; cursor: pointer; }
[data-dark] .split-btn-main { background: #f1f5f9; color: #0f172a; }
.split-btn-caret { display: flex; align-items: center; justify-content: center; background: var(--text); color: var(--bg); border: none; border-left: 1px solid rgba(255,255,255,.25); padding: 8px 8px; border-radius: 0 9px 9px 0; cursor: pointer; }
[data-dark] .split-btn-caret { background: #f1f5f9; color: #0f172a; }
.split-menu { position: absolute; top: calc(100% + 6px); left: 0; min-width: 210px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; box-shadow: 0 12px 30px rgba(15,23,42,.14); padding: 6px; z-index: 20; }
.split-menu button { display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; background: transparent; border: none; padding: 9px 10px; border-radius: 8px; font-size: 13px; color: var(--text); cursor: pointer; }
.split-menu button:hover { background: rgba(37,99,235,.1); }

.pill-row { font-size: 12.5px; color: var(--muted); }

.carousel { position: relative; display: flex; align-items: center; gap: 10px; margin: 10px 0 32px; }
.carousel-stage { position: relative; flex: 1; height: 360px; border-radius: 24px; overflow: hidden; background: linear-gradient(135deg, rgba(37,99,235,.06), rgba(99,102,241,.08)); border: 1px solid var(--border); }
.carousel-slide { position: absolute; inset: 0; display: flex; align-items: center; gap: 32px; padding: 32px 44px; opacity: 0; transition: opacity .6s ease; pointer-events: none; }
.carousel-slide.is-active { opacity: 1; pointer-events: auto; }
.carousel-copy { max-width: 340px; }
.carousel-copy h3 { font-size: 22px; font-weight: 800; margin: 0 0 10px; letter-spacing: -0.01em; }
.carousel-copy p { font-size: 14px; color: var(--muted); line-height: 1.55; margin: 0; }
.carousel-arrow { width: 36px; height: 36px; border-radius: 999px; border: 1px solid var(--border); background: var(--card); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; z-index: 2; }
.carousel-arrow:hover { background: rgba(37,99,235,.1); }
.carousel-dots { position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 2; }
.carousel-dot { width: 7px; height: 7px; border-radius: 999px; border: none; background: rgba(37,99,235,.25); cursor: pointer; }
.carousel-dot.is-active { background: var(--brand); width: 20px; border-radius: 999px; transition: width .2s ease; }

.illo { position: relative; width: 300px; height: 260px; flex-shrink: 0; border-radius: 20px; background: linear-gradient(160deg, rgba(37,99,235,.14), rgba(20,184,166,.10)); display: flex; align-items: center; justify-content: center; }
.illo--verified { background: linear-gradient(160deg, rgba(20,184,166,.16), rgba(37,99,235,.08)); }
.illo--attendance { background: linear-gradient(160deg, rgba(244,63,94,.14), rgba(99,102,241,.10)); }
.illo-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 0.6fr; gap: 8px; width: 220px; height: 180px; }
.illo-tile { border-radius: 12px; background: rgba(255,255,255,.75); border: 1px solid rgba(37,99,235,.15); padding: 10px; display: flex; flex-direction: column; gap: 6px; justify-content: center; }
[data-dark] .illo-tile { background: rgba(255,255,255,.06); }
.illo-tile--main { grid-column: 1 / span 2; align-items: flex-start; }
.illo-tile--alt { background: rgba(20,184,166,.14); }
.illo-avatar { width: 26px; height: 26px; border-radius: 999px; background: linear-gradient(135deg, var(--brand), var(--brand-2)); display: block; }
.illo-avatar--sm { width: 18px; height: 18px; }
.illo-bar { display: block; height: 6px; border-radius: 999px; background: rgba(37,99,235,.3); }
.illo-bar--w60 { width: 60%; }
.illo-bar--w35 { width: 35%; }
.illo-dot { position: absolute; border-radius: 999px; background: var(--accent); opacity: .5; }
.illo-dot--a { width: 14px; height: 14px; top: 18px; right: 22px; }
.illo-dot--b { width: 8px; height: 8px; bottom: 24px; left: 20px; background: var(--live); }
.illo-badge { position: absolute; bottom: -14px; right: 26px; width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, var(--brand), var(--brand-2)); color: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 18px rgba(37,99,235,.35); }
.illo--verified .illo-badge { background: linear-gradient(135deg, var(--live), #0ea5e9); box-shadow: 0 8px 18px rgba(20,184,166,.35); }
.illo--attendance .illo-badge { background: linear-gradient(135deg, var(--accent-2), var(--brand-2)); box-shadow: 0 8px 18px rgba(244,63,94,.3); }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
.stat-card { position: relative; background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 18px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
.stat-icon { width: 34px; height: 34px; border-radius: 11px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; background: rgba(37,99,235,.12); color: var(--brand); }
.tone-live .stat-icon { background: rgba(20,184,166,.14); color: #0d9488; }
.tone-accent .stat-icon { background: rgba(245,158,11,.16); color: #b45309; }
.tone-rose .stat-icon { background: rgba(244,63,94,.14); color: #be123c; }
.stat-value { font-size: 26px; font-weight: 800; letter-spacing: -0.01em; }
.stat-label { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-top: 2px; }
.stat-underline { height: 3px; border-radius: 999px; background: linear-gradient(90deg, var(--brand), var(--brand-2)); margin-top: 12px; width: 60%; }
.tone-live .stat-underline { background: linear-gradient(90deg, var(--live), #0ea5e9); }
.tone-accent .stat-underline { background: linear-gradient(90deg, var(--accent), #fbbf24); }
.tone-rose .stat-underline { background: linear-gradient(90deg, var(--accent-2), var(--brand-2)); }
.stat-delta { font-size: 11.5px; font-weight: 700; color: #16a34a; margin-top: 8px; }

.session-list { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 8px 8px 14px; }
.session-list-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; }
.session-list-head h2 { font-size: 15px; margin: 0; }
.muted { color: var(--muted); font-size: 12.5px; }
.session-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-radius: 14px; transition: background .15s ease; }
.session-row:hover { background: rgba(37,99,235,.05); }
.session-dot { width: 8px; height: 8px; border-radius: 999px; background: #cbd5e1; flex-shrink: 0; }
.session-dot.live { background: var(--live); box-shadow: 0 0 0 3px rgba(20,184,166,.18); }
.session-dot.scheduled { background: var(--brand); }
.session-dot.completed { background: #94a3b8; }
.session-main { flex: 1; min-width: 0; }
.session-title { font-size: 13.5px; font-weight: 700; }
.session-meta { font-size: 12px; color: var(--muted); margin-top: 1px; }
.session-time { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--muted); white-space: nowrap; }
.session-actions { display: flex; align-items: center; gap: 8px; }
.btn-join { display: inline-flex; align-items: center; gap: 5px; border: none; background: var(--brand); color: #fff; font-size: 12.5px; font-weight: 700; padding: 7px 12px; border-radius: 8px; cursor: pointer; }
.btn-join.is-live { background: linear-gradient(135deg, var(--live), #0ea5e9); }
.btn-join:disabled { background: rgba(100,116,139,.25); color: var(--muted); cursor: not-allowed; }
.btn-join.is-completed { background: #2563eb; color: #fff; opacity: .55; cursor: not-allowed; pointer-events: none; }

.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.45); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal-card { width: 420px; background: var(--card); border-radius: 18px; padding: 18px; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.modal-head h3 { margin: 0; font-size: 16px; }
.modal-body { display: flex; flex-direction: column; gap: 12px; }
.field { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: var(--muted); flex: 1; }
.field input { border: 1px solid var(--border); border-radius: 9px; padding: 8px 10px; font-size: 13.5px; background: var(--bg); color: var(--text); outline: none; }
.field input:focus { border-color: var(--brand); }
.field-row { display: flex; gap: 10px; }
.modal-foot { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }

.link-row { display: flex; align-items: center; gap: 8px; }
.link-row input { flex: 1; }
.link-row input[readOnly] { cursor: text; }
.copy-confirm { font-size: 12px; font-weight: 700; color: #16a34a; margin-top: -4px; }


.content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
.calendar-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 16px; }
.cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.cal-month-label { font-size: 13.5px; font-weight: 700; }
.cal-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 10.5px; color: var(--muted); font-weight: 700; margin-bottom: 4px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-cell { position: relative; aspect-ratio: 1; border: none; background: transparent; border-radius: 8px; font-size: 12px; color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cal-cell--empty { cursor: default; }
.cal-cell:not(.cal-cell--empty):hover { background: rgba(37,99,235,.08); }
.cal-cell.is-today { font-weight: 800; color: var(--brand); }
.cal-cell.is-selected { background: var(--brand); color: #fff; }
.cal-dot { position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 999px; background: var(--live); }
.cal-cell.is-selected .cal-dot { background: #fff; }
.cal-day-panel { margin-top: 14px; border-top: 1px solid var(--border); padding-top: 12px; display: flex; flex-direction: column; gap: 8px; max-height: 260px; overflow-y: auto; }
.cal-day-panel-head { display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: var(--muted); padding: 0 4px 4px; }
.cal-clear-btn { background: none; border: none; color: var(--brand); font-size: 11px; font-weight: 700; cursor: pointer; padding: 0; }
.cal-event--clickable { cursor: pointer; transition: background .15s ease; }
.cal-event--clickable:hover { background: rgba(37,99,235,.12); }
.cal-cell.has-scheduled { background: rgba(37,99,235,.14); color: var(--brand); font-weight: 800; }
.cal-cell.has-live { background: rgba(20,184,166,.18); color: #0d9488; font-weight: 800; }
.cal-cell.is-selected.has-scheduled,
.cal-cell.is-selected.has-live { background: var(--brand); color: #fff; }
.cal-event { display: flex; align-items: center; gap: 8px; padding: 8px; border-radius: 10px; background: rgba(37,99,235,.05); }
.cal-event-dot { width: 7px; height: 7px; border-radius: 999px; background: #94a3b8; flex-shrink: 0; }
.cal-event-dot.live { background: var(--live); }
.cal-event-dot.scheduled { background: var(--brand); }
.cal-event-dot.ended { background: #94a3b8; }
.cal-event-title { font-size: 12.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cal-event-time { font-size: 11px; color: var(--muted); }

@media (max-width: 900px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .carousel-slide { flex-direction: column; text-align: center; padding: 24px; }
  .page-inner { padding: 20px 16px 60px; }
  .content-grid { grid-template-columns: 1fr; }
}
`;
