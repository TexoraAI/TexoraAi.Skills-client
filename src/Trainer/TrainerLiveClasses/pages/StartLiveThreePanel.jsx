import { useState, useEffect } from "react";
import { Video, Calendar, Clock, Users, Radio, ChevronDown, ChevronRight, X, CheckCircle2, Bell, MessageSquare, Save, Copy, Zap, ExternalLink, Globe, RefreshCw, Link, Layers, Settings, Rocket, Send } from "lucide-react";
import { createLiveSession, startLiveSessionWithToken, getTrainerCalendar } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";
import { unwrapBatches, getBatchId, getBatchName, zonedDateTimeToUTC, DEFAULT_TIMEZONE, genRoomId } from "../data/utils";
import ThreePanelLayout from "../components/ThreePanelLayout";
import MiniCalendar from "../components/MiniCalendar";
import PanelSectionHeader from "../components/PanelSectionHeader";
import ToggleSwitch from "../components/ToggleSwitch";
import CompactLabel from "../components/CompactLabel";
import TimezoneSelect from "../components/TimezoneSelect";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function StartLiveThreePanel({ t, isDark, navigate, isMobile, isTablet }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publishDone, setPublishDone] = useState(false);
  const [error, setError] = useState(null);
  const [shortScheduleWarning, setShortScheduleWarning] = useState(null);

  // const [form, setForm] = useState({
  //   title: "",
  //   description: "",
  //   batchId: "",
  //   date: "",
  //   time: "",
  //   duration: "",
  //   chat: true,
  //   recording: true,
  //   notifications: true,
  //   isPublished: false, // ADD
  //   mode: "",
  //   meetingLink: "",
  //   roomId: genRoomId(),
  // });
  const [form, setForm] = useState({
    title: "",
    description: "",
    batchId: "",
    date: "",
    time: "",
    duration: "",
    chat: true,
    recording: true,
    notifications: true,
    isPublished: false, // ADD
    mode: "",
    meetingLink: "",
    roomId: genRoomId(),
    timezone: DEFAULT_TIMEZONE, // ✅ NEW
    scheduleMode: "schedule", // ✅ NEW — "schedule" | "now"
  });
  const upd = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (key === "date" || key === "time") setShortScheduleWarning(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getTrainerBatches();
        setBatches(unwrapBatches(data) || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  // ✅ Load existing sessions into calendar on mount
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const now = new Date();
  //       const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  //       const to = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-31`;
  //       const res = await getTrainerCalendar(from, to);
  //       const data = Array.isArray(res.data) ? res.data : [];
  //       setSessionEvents(
  //         data.map((s) => ({
  //           date: s.scheduledDate,
  //           title: s.title,
  //         })),
  //       );
  //     } catch (err) {
  //       console.error("Calendar load failed", err);
  //     }
  //   })();
  // }, []);
  const loadCalendarEvents = async (year, month) => {
    try {
      const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const to = `${year}-${String(month + 1).padStart(2, "0")}-31`;
      const res = await getTrainerCalendar(from, to);
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("Calendar data:", JSON.stringify(data.slice(0, 2)));
      // setSessionEvents(
      //   data.map((s) => ({ date: s.scheduledDate, title: s.title })),
      // );
      setSessionEvents(
        data.map((s) => {
          let dateStr = s.scheduledDate;
          if (Array.isArray(dateStr)) {
            const [y, m, d] = dateStr;
            dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          }
          return { date: dateStr, title: s.title };
        }),
      );
    } catch (err) {
      console.error("Calendar load failed", err);
    }
  };

  useEffect(() => {
    const now = new Date();
    loadCalendarEvents(now.getFullYear(), now.getMonth());
  }, []);
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(form.roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedBatch = batches.find(
    (b) => String(b.id ?? b.batchId) === String(form.batchId),
  );
  const batchLabel = selectedBatch
    ? getBatchName(selectedBatch, form.batchId)
    : null;

  // ✅ batchId no longer required — session can be global (no batch)
  // const step1Valid = form.title.trim() && form.date && form.time;
  // ✅ batchId no longer required — session can be global (no batch)
  // ✅ "Start Now" mode doesn't need date/time
  const step1Valid =
    form.scheduleMode === "now"
      ? form.title.trim()
      : form.title.trim() && form.date && form.time;
  // const buildPayload = (status) => ({
  //   title: form.title,
  //   description: form.description,
  //   // ✅ batchId is optional — null if not selected (global session)
  //   ...(form.batchId ? { batchId: Number(form.batchId) } : {}),
  //   scheduledDate: form.date,
  //   scheduledTime: form.time,
  //   duration: Number(form.duration),
  //   chatEnabled: form.chat,
  //   autoRecord: form.recording,
  //   notifyStudents: form.notifications,
  //   isPublished: form.isPublished,
  //   // ✅ meetingType maps to backend field
  //   meetingType: form.mode === "external" ? "EXTERNAL" : "CUSTOM",
  //   ...(status ? { status } : {}),
  //   ...(form.mode === "external"
  //     ? { externalMeetingUrl: form.meetingLink }
  //     : {}),
  // });
  const buildPayload = (status) => {
    // ✅ "Start Now" — use this instant's date/time in the chosen timezone
    let scheduledDate = form.date;
    let scheduledTime = form.time;
    const tz = form.scheduleMode === "now" ? DEFAULT_TIMEZONE : form.timezone;
    if (form.scheduleMode === "now") {
      const nowParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .formatToParts(new Date())
        .reduce((acc, p) => {
          acc[p.type] = p.value;
          return acc;
        }, {});
      scheduledDate = `${nowParts.year}-${nowParts.month}-${nowParts.day}`;
      scheduledTime = `${nowParts.hour}:${nowParts.minute}`;
    }
    return {
      title: form.title,
      description: form.description,
      // ✅ batchId is optional — null if not selected (global session)
      ...(form.batchId ? { batchId: Number(form.batchId) } : {}),
      scheduledDate,
      scheduledTime,
      timezone: tz, // ✅ NEW — always sent
      duration: Number(form.duration),
      chatEnabled: form.chat,
      autoRecord: form.recording,
      notifyStudents: form.notifications,
      isPublished: form.isPublished,
      // ✅ meetingType maps to backend field
      meetingType: form.mode === "external" ? "EXTERNAL" : "CUSTOM",
      ...(status ? { status } : {}),
      ...(form.mode === "external"
        ? { externalMeetingUrl: form.meetingLink }
        : {}),
    };
  };
  // const handleGoLive = async () => {
  //   setError(null);
  //   setShortScheduleWarning(null);
  //   if (!form.title.trim()) {
  //     setError("Session title is required.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   if (!form.date) {
  //     setError("Please select a date.");
  //     setCurrentStep(1);
  //     return;
  //   }
  //   if (!form.time) {
  //     setError("Please select a time.");
  //     setCurrentStep(1);
  //     return;
  //   }
  //   if (!form.duration) {
  //     setError("Please select a duration.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   const scheduledDateTime = new Date(`${form.date}T${form.time}`);
  //   const now = new Date();
  //   if (scheduledDateTime <= now) {
  //     setError("Scheduled date and time must be in the future.");
  //     setCurrentStep(1);
  //     return;
  //   }

  //   const diffMin = (scheduledDateTime - now) / (1000 * 60);
  //   if (diffMin < 30) {
  //     setShortScheduleWarning(
  //       `⚡ Session starts in ${Math.ceil(diffMin)} min. Students will get an immediate notification instead of a 15-min reminder.`,
  //     );
  //   }

  //   try {
  //     setSubmitting(true);
  //     const res = await createLiveSession(buildPayload());
  //     navigate(`/trainer/session-scheduled/${res.data.id}`, {
  //       state: {
  //         scheduledDate: form.date,
  //         scheduledTime: form.time,
  //         title: form.title,
  //         duration: form.duration,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setError(
  //       err?.response?.data?.error ||
  //         "Failed to create session. Please try again.",
  //     );
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };
  const handleGoLive = async () => {
    setError(null);
    setShortScheduleWarning(null);
    if (!form.title.trim()) {
      setError("Session title is required.");
      setCurrentStep(1);
      return;
    }
    if (!form.duration) {
      setError("Please enter a duration.");
      setCurrentStep(1);
      return;
    }

    // ✅ NEW — "Start Now": create then immediately go live
    if (form.scheduleMode === "now") {
      try {
        setSubmitting(true);
        const res = await createLiveSession(buildPayload());
        const liveRes = await startLiveSessionWithToken(res.data.id);
        const { room, token } = liveRes.data;
        if (!token) {
          setError(
            "Session created, but couldn't get a live token. Start it from the dashboard.",
          );
          return;
        }
        // ✅ NEW: stamp startedAt so the meeting room can anchor its
        // timer to a real wall-clock moment (see LiveSessionControls'
        // meeting-persistence fix) instead of resetting to 00:00 on the
        // first refresh.
        const startedAt = Date.now();
        sessionStorage.setItem(
          "call_state",
          JSON.stringify({ room, token, startedAt }),
        );
        navigate(`/trainer/live-controls/${res.data.id}`, {
          state: { room, token, startedAt },
        });
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.error ||
            "Failed to start session. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // ── Scheduled flow (unchanged logic, now timezone-aware) ──
    if (!form.date) {
      setError("Please select a date.");
      setCurrentStep(1);
      return;
    }
    if (!form.time) {
      setError("Please select a time.");
      setCurrentStep(1);
      return;
    }

    const scheduledDateTime = zonedDateTimeToUTC(
      form.date,
      form.time,
      form.timezone,
    );
    const now = new Date();
    if (!scheduledDateTime || scheduledDateTime <= now) {
      setError("Scheduled date and time must be in the future.");
      setCurrentStep(1);
      return;
    }

    try {
      setSubmitting(true);
      const res = await createLiveSession(buildPayload());
      navigate(`/trainer/session-scheduled/${res.data.id}`, {
        state: {
          scheduledDate: form.date,
          scheduledTime: form.time,
          timezone: form.timezone,
          title: form.title,
          duration: form.duration,
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          "Failed to create session. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!step1Valid) {
      setError("Please complete Step 1 first.");
      setCurrentStep(1);
      return;
    }
    try {
      setPublishing(true);
      await createLiveSession(buildPayload("SCHEDULED"));
      if (form.date)
        setSessionEvents((prev) => [
          ...prev,
          { date: form.date, title: form.title },
        ]);
      setPublishDone(true);
      setTimeout(() => setPublishDone(false), 3500);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to schedule session.");
    } finally {
      setPublishing(false);
    }
  };

  const stepState = (n) => {
    if (currentStep === n) return "active";
    if (n === 1 && step1Valid) return "done";
    if (n === 2 && step1Valid && currentStep > 2) return "done";
    return "pending";
  };

  /* ── LEFT PANEL ── */
  const LeftPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader icon={Layers} color="#22c55e" title="Steps" t={t} />
      <div
        className="panel-scroll"
        style={{
          padding: "12px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[
          {
            n: 1,
            title: "Session Details",
            subtitle: "Title, batch & schedule",
            icon: Calendar,
          },
          {
            n: 2,
            title: "Settings",
            subtitle: "Chat, record, alerts",
            icon: Settings,
          },
          {
            n: 3,
            title: "Review & Launch",
            subtitle: "Confirm and go live",
            icon: Rocket,
          },
        ].map(({ n, title, subtitle, icon: Icon }) => {
          const s = stepState(n);
          const isAct = s === "active",
            isDone = s === "done";
          return (
            <button
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "9px 10px",
                borderRadius: 8,
                border: `1px solid ${isAct ? "rgba(34,197,94,0.35)" : isDone ? "rgba(34,197,94,0.20)" : t.border}`,
                background: isAct
                  ? "rgba(34,197,94,0.07)"
                  : isDone
                    ? "rgba(34,197,94,0.04)"
                    : "transparent",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isAct
                    ? "#22c55e"
                    : isDone
                      ? "rgba(34,197,94,0.20)"
                      : t.stepBadgePending,
                  border: `1.5px solid ${isAct ? "#22c55e" : isDone ? "rgba(34,197,94,0.40)" : t.stepBadgePendingBorder}`,
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.extrabold,
                  color: isAct
                    ? "#fff"
                    : isDone
                      ? "#22c55e"
                      : t.stepBadgePendingText,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {isDone ? <CheckCircle2 size={12} color="#22c55e" /> : n}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: FONT_WEIGHT.bold,
                    color: isAct ? t.text : isDone ? t.text : t.textSub,
                    fontFamily: FONT_FAMILY,
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: t.textMuted,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {subtitle}
                </div>
              </div>
              {isAct && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}

        <div style={{ margin: "8px 0", borderTop: `1px solid ${t.border}` }} />

        {[
          { label: "Title", val: form.title || "—", color: "#22c55e" },
          { label: "Batch", val: batchLabel || "—", color: "#22d3ee" },
          { label: "Date", val: form.date || "—", color: "#a78bfa" },
          { label: "Time", val: form.time || "—", color: "#f59e0b" },
          {
            label: "Duration",
            val: form.duration ? `${form.duration}m` : "—",
            color: "#2dd4bf",
          },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 6px",
              borderRadius: 5,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.semibold,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: val === "—" ? t.textMuted : t.text,
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.semibold,
                maxWidth: 90,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {val}
            </span>
          </div>
        ))}

        {form.mode && (
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 8px",
              borderRadius: 6,
              background:
                form.mode === "custom"
                  ? "rgba(34,197,94,0.08)"
                  : "rgba(0,120,212,0.08)",
              border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.22)" : "rgba(0,120,212,0.22)"}`,
            }}
          >
            {form.mode === "custom" ? (
              <Zap size={10} color="#22c55e" />
            ) : (
              <ExternalLink size={10} color="#0078d4" />
            )}
            <span
              style={{
                fontSize: 9,
                fontWeight: FONT_WEIGHT.bold,
                color: form.mode === "custom" ? "#22c55e" : "#0078d4",
                fontFamily: FONT_FAMILY,
              }}
            >
              {form.mode === "custom" ? "Custom Live" : "External Link"}
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          padding: "10px",
          borderTop: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {publishDone && (
          <div
            className="publish-toast"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 10px",
              borderRadius: 7,
              background: isDark ? "rgba(34,197,94,0.10)" : "#f0fdf4",
              border: `1px solid ${isDark ? "rgba(34,197,94,0.3)" : "#bbf7d0"}`,
            }}
          >
            <CheckCircle2 size={13} color="#22c55e" />
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  color: "#22c55e",
                  fontFamily: FONT_FAMILY,
                }}
              >
                Published!
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                }}
              >
                Session scheduled.
              </div>
            </div>
          </div>
        )}
        {/* <button
          onClick={handlePublish}
          disabled={publishing}
          style={{
            width: "100%",
            padding: "7px 0",
            borderRadius: 7,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.textSub,
            fontSize: 10,
            fontWeight: FONT_WEIGHT.semibold,
            cursor: publishing ? "not-allowed" : "pointer",
            fontFamily: FONT_FAMILY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            transition: "all 0.18s",
          }}
        >
          <Send size={11} />
          {publishing ? "Scheduling…" : "Schedule for Later"}
        </button> */}
        {form.scheduleMode !== "now" && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            style={{
              width: "100%",
              padding: "7px 0",
              borderRadius: 7,
              border: `1px solid ${t.border}`,
              background: "transparent",
              color: t.textSub,
              fontSize: 10,
              fontWeight: FONT_WEIGHT.semibold,
              cursor: publishing ? "not-allowed" : "pointer",
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transition: "all 0.18s",
            }}
          >
            <Send size={11} />
            {publishing ? "Scheduling…" : "Schedule for Later"}
          </button>
        )}
      </div>
    </div>
  );

  /* ── CENTER PANEL ── */
  const CenterPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* step header bar */}
      <div
        style={{
          padding: "10px 16px",
          borderBottom: `1px solid ${t.panelHeaderBorder}`,
          background: t.panelHeader,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(34,197,94,0.15)",
            border: "1.5px solid rgba(34,197,94,0.4)",
            fontSize: 11,
            fontWeight: FONT_WEIGHT.extrabold,
            color: "#22c55e",
            fontFamily: FONT_FAMILY,
          }}
        >
          {currentStep}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              fontFamily: FONT_FAMILY,
            }}
          >
            {currentStep === 1
              ? "Session Details"
              : currentStep === 2
                ? "Session Settings"
                : "Review & Launch"}
          </div>
          <div
            style={{
              fontSize: 9,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
            }}
          >
            {currentStep === 1
              ? "Title, batch & schedule"
              : currentStep === 2
                ? "Chat, recording & alerts"
                : "Confirm and go live"}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              onClick={() => setCurrentStep(n)}
              style={{
                width: n === currentStep ? 20 : 6,
                height: 6,
                borderRadius: 99,
                background:
                  n === currentStep
                    ? "#22c55e"
                    : n < currentStep
                      ? "rgba(34,197,94,0.4)"
                      : t.border,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
            />
          ))}
        </div>
      </div>

      <div className="panel-scroll">
        {/* error / warning banners */}
        {error && (
          <div
            style={{
              margin: "10px 16px 0",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
              color: "#f87171",
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            ⚠️ {error}
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
              }}
            >
              <X size={13} />
            </button>
          </div>
        )}
        {shortScheduleWarning && (
          <div
            style={{
              margin: "10px 16px 0",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 11,
              color: "#f59e0b",
              fontFamily: FONT_FAMILY,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {shortScheduleWarning}
            <button
              onClick={() => setShortScheduleWarning(null)}
              style={{
                background: "none",
                border: "none",
                color: "#f59e0b",
                cursor: "pointer",
              }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* ✅ NEW — Schedule vs Start Now */}
            <div style={{ display: "flex", gap: 8 }}>
              <div
                className={`mode-card${form.scheduleMode === "schedule" ? " sel-custom" : ""}`}
                onClick={() => upd("scheduleMode", "schedule")}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.scheduleMode === "schedule"
                        ? "rgba(34,197,94,0.14)"
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#f1f5f9",
                    border: `1px solid ${form.scheduleMode === "schedule" ? "rgba(34,197,94,0.35)" : t.modeCardBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <Calendar
                    size={13}
                    color={
                      form.scheduleMode === "schedule"
                        ? "#22c55e"
                        : t.calIconColor
                    }
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: FONT_WEIGHT.bold,
                      color:
                        form.scheduleMode === "schedule" ? "#22c55e" : t.text,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Schedule
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Pick date & time
                  </div>
                </div>
                {form.scheduleMode === "schedule" && (
                  <CheckCircle2
                    size={13}
                    color="#22c55e"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>
              <div
                className={`mode-card${form.scheduleMode === "now" ? " sel-ext" : ""}`}
                onClick={() => upd("scheduleMode", "now")}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      form.scheduleMode === "now"
                        ? "rgba(0,120,212,0.12)"
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "#f1f5f9",
                    border: `1px solid ${form.scheduleMode === "now" ? "rgba(0,120,212,0.35)" : t.modeCardBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <Zap
                    size={13}
                    color={
                      form.scheduleMode === "now" ? "#0078d4" : t.calIconColor
                    }
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: FONT_WEIGHT.bold,
                      color: form.scheduleMode === "now" ? "#0078d4" : t.text,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Start Now
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Go live immediately
                  </div>
                </div>
                {form.scheduleMode === "now" && (
                  <CheckCircle2
                    size={13}
                    color="#0078d4"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </div>
            </div>
            <div>
              <CompactLabel t={t}>Session Title *</CompactLabel>
              <input
                className="sls-input"
                value={form.title}
                onChange={(e) => upd("title", e.target.value)}
                placeholder="e.g. React Hooks Deep Dive"
              />
            </div>
            <div>
              <CompactLabel t={t}>
                Description{" "}
                <span
                  style={{
                    fontWeight: FONT_WEIGHT.regular,
                    textTransform: "none",
                    fontSize: 9,
                  }}
                >
                  (optional)
                </span>
              </CompactLabel>
              <textarea
                className="sls-input"
                value={form.description}
                onChange={(e) => upd("description", e.target.value)}
                placeholder="Brief overview for students..."
                rows={2}
                style={{ resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
            <div>
              {/* <CompactLabel t={t}>Select Batch *</CompactLabel> */}
              <CompactLabel t={t}>
                Select Batch{" "}
                <span
                  style={{
                    fontWeight: FONT_WEIGHT.regular,
                    textTransform: "none",
                    fontSize: 9,
                  }}
                >
                  (optional — leave empty for global session)
                </span>
              </CompactLabel>
              <div style={{ position: "relative" }}>
                <select
                  className="sls-input"
                  value={form.batchId}
                  onChange={(e) => upd("batchId", e.target.value)}
                  style={{ cursor: "pointer", paddingRight: 30 }}
                >
                  <option value="">Choose a batch...</option>
                  {batches.map((b, i) => {
                    const id = getBatchId(b);
                    const name = getBatchName(b, id);
                    return (
                      <option key={i} value={id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={11}
                  color={t.textMuted}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
            {/* <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              <div>
                <CompactLabel t={t}>Date *</CompactLabel>
                <input
                  type="date"
                  className="sls-input"
                  value={form.date}
                  onChange={(e) => upd("date", e.target.value)}
                />
              </div>
              <div>
                <CompactLabel t={t}>Time *</CompactLabel>
                <input
                  type="time"
                  className="sls-input"
                  value={form.time}
                  onChange={(e) => upd("time", e.target.value)}
                />
              </div>
              <div>
                <CompactLabel t={t}>Duration</CompactLabel>
                <div style={{ position: "relative" }}>
                  <select
                    className="sls-input"
                    value={form.duration}
                    onChange={(e) => upd("duration", e.target.value)}
                    style={{ cursor: "pointer", paddingRight: 30 }}
                  >
                    <option value="">Select...</option>
                    {durations.map((d) => (
                      <option key={d} value={d}>
                        {d} min
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={11}
                    color={t.textMuted}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div> */}
            {form.scheduleMode === "schedule" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                  gap: 8,
                }}
              >
                <div>
                  <CompactLabel t={t}>Date *</CompactLabel>
                  <input
                    type="date"
                    className="sls-input"
                    value={form.date}
                    onChange={(e) => upd("date", e.target.value)}
                  />
                </div>
                <div>
                  <CompactLabel t={t}>Time *</CompactLabel>
                  <input
                    type="time"
                    className="sls-input"
                    value={form.time}
                    onChange={(e) => upd("time", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  form.scheduleMode === "schedule"
                    ? "repeat(auto-fit,minmax(140px,1fr))"
                    : "1fr",
                gap: 8,
              }}
            >
              {form.scheduleMode === "schedule" && (
                <div>
                  <CompactLabel t={t}>Timezone *</CompactLabel>
                  <TimezoneSelect
                    t={t}
                    value={form.timezone}
                    onChange={(tz) => upd("timezone", tz)}
                  />
                </div>
              )}
              <div>
                <CompactLabel t={t}>
                  Duration (minutes) * — max 150
                </CompactLabel>
                <input
                  type="number"
                  min="1"
                  max="150"
                  className="sls-input"
                  value={form.duration}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "" || (Number(v) >= 0 && Number(v) <= 150))
                      upd("duration", v);
                  }}
                  placeholder="e.g. 45"
                />
              </div>
            </div>

            {/* Session Mode */}
            <div>
              <CompactLabel t={t}>Session Mode</CompactLabel>
              <div style={{ display: "flex", gap: 8 }}>
                <div
                  className={`mode-card${form.mode === "custom" ? " sel-custom" : ""}`}
                  onClick={() =>
                    upd("mode", form.mode === "custom" ? "" : "custom")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        form.mode === "custom"
                          ? "rgba(34,197,94,0.14)"
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#f1f5f9",
                      border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.35)" : t.modeCardBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    <Zap
                      size={13}
                      color={
                        form.mode === "custom" ? "#22c55e" : t.calIconColor
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: FONT_WEIGHT.bold,
                        color: form.mode === "custom" ? "#22c55e" : t.text,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Custom Live
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: t.textSub,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Your platform
                    </div>
                  </div>
                  {form.mode === "custom" && (
                    <CheckCircle2
                      size={13}
                      color="#22c55e"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
                <div
                  className={`mode-card${form.mode === "external" ? " sel-ext" : ""}`}
                  onClick={() =>
                    upd("mode", form.mode === "external" ? "" : "external")
                  }
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        form.mode === "external"
                          ? "rgba(0,120,212,0.12)"
                          : isDark
                            ? "rgba(255,255,255,0.06)"
                            : "#f1f5f9",
                      border: `1px solid ${form.mode === "external" ? "rgba(0,120,212,0.35)" : t.modeCardBorder}`,
                      flexShrink: 0,
                    }}
                  >
                    <ExternalLink
                      size={13}
                      color={
                        form.mode === "external" ? "#0078d4" : t.calIconColor
                      }
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: FONT_WEIGHT.bold,
                        color: form.mode === "external" ? "#0078d4" : t.text,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      External Link
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: t.textSub,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      Zoom / Meet
                    </div>
                  </div>
                  {form.mode === "external" && (
                    <CheckCircle2
                      size={13}
                      color="#0078d4"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
              </div>
              {form.mode === "custom" && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    borderRadius: 7,
                    background: isDark ? "rgba(34,197,94,0.05)" : "#f0fdf4",
                    border: "1px solid rgba(34,197,94,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Globe size={11} color="#22c55e" style={{ flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      fontWeight: FONT_WEIGHT.bold,
                      color: "#22c55e",
                      flex: 1,
                    }}
                  >
                    {form.roomId}
                  </span>
                  <button
                    onClick={handleCopyRoomId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "1px solid rgba(34,197,94,0.25)",
                      background: copied
                        ? "rgba(34,197,94,0.10)"
                        : "transparent",
                      color: "#22c55e",
                      fontSize: 10,
                      fontWeight: FONT_WEIGHT.semibold,
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <Copy size={9} /> {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => upd("roomId", genRoomId())}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "3px 8px",
                      borderRadius: 5,
                      border: "1px solid rgba(34,197,94,0.25)",
                      background: "transparent",
                      color: "#22c55e",
                      fontSize: 10,
                      fontWeight: FONT_WEIGHT.semibold,
                      cursor: "pointer",
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <RefreshCw size={9} />
                  </button>
                </div>
              )}
              {form.mode === "external" && (
                <div style={{ marginTop: 8, position: "relative" }}>
                  <Link
                    size={11}
                    color={t.calIconColor}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                  <input
                    className="sls-input"
                    value={form.meetingLink}
                    onChange={(e) => upd("meetingLink", e.target.value)}
                    placeholder="Paste Zoom / Meet / Teams link..."
                    style={{ paddingLeft: 28 }}
                  />
                </div>
              )}
              {/* ✅ Publish toggle — makes session globally visible */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: form.isPublished
                    ? isDark
                      ? "rgba(34,197,94,0.06)"
                      : "#f0fdf4"
                    : isDark
                      ? "rgba(255,255,255,0.02)"
                      : "#f8fafc",
                  border: `1px solid ${form.isPublished ? "rgba(34,197,94,0.25)" : t.border}`,
                  marginTop: 4,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: FONT_WEIGHT.bold,
                      color: form.isPublished ? "#22c55e" : t.text,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Publish Globally
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: t.textSub,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    Show in public sessions list (no batch required)
                  </div>
                </div>
                <ToggleSwitch
                  checked={form.isPublished}
                  onChange={(val) => upd("isPublished", val)}
                  color="#22c55e"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 4,
              }}
            >
              <button
                className="next-btn"
                onClick={() => {
                  if (step1Valid) setCurrentStep(2);
                  else {
                    setError("Fill Title, Batch, Date & Time first.");
                  }
                }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            {[
              {
                key: "chat",
                label: "Enable Chat",
                sub: "Students can message during live",
                Icon: MessageSquare,
                color: "#22d3ee",
              },
              {
                key: "recording",
                label: "Auto Record",
                sub: "Save session for replay access",
                Icon: Radio,
                color: "#f43f5e",
              },
              {
                key: "notifications",
                label: "Notify Students",
                sub: "Push alert when going live",
                Icon: Bell,
                color: "#22c55e",
              },
            ].map(({ key, label, sub, Icon, color }) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderBottom: `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = isDark
                    ? "rgba(255,255,255,0.02)"
                    : "#fafafa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: form[key]
                        ? `${color}14`
                        : isDark
                          ? "rgba(255,255,255,0.04)"
                          : "#f8fafc",
                      border: `1px solid ${form[key] ? color + "30" : t.border}`,
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                  >
                    <Icon
                      size={14}
                      color={form[key] ? color : t.calIconColor}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: FONT_WEIGHT.semibold,
                        color: t.text,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: t.textSub,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {sub}
                    </div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={form[key]}
                  onChange={(val) => upd(key, val)}
                  color={color}
                />
              </div>
            ))}
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button className="next-btn" onClick={() => setCurrentStep(3)}>
                Next <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
                gap: 8,
              }}
            >
              {[
                {
                  label: "Title",
                  value: form.title || "—",
                  icon: <Video size={10} color="#22c55e" />,
                },
                {
                  label: "Batch",
                  value: batchLabel || "—",
                  icon: <Users size={10} color="#22d3ee" />,
                },
                // {
                //   label: "Date",
                //   value: form.date || "—",
                //   icon: <Calendar size={10} color="#a78bfa" />,
                // },
                // {
                //   label: "Time",
                //   value: form.time || "—",
                //   icon: <Clock size={10} color="#f59e0b" />,
                // },
                {
                  label: "Date",
                  value: form.scheduleMode === "now" ? "Now" : form.date || "—",
                  icon: <Calendar size={10} color="#a78bfa" />,
                },
                {
                  label: "Time",
                  value:
                    form.scheduleMode === "now"
                      ? "Immediately"
                      : form.time || "—",
                  icon: <Clock size={10} color="#f59e0b" />,
                },
                {
                  label: "Timezone",
                  value:
                    form.scheduleMode === "now"
                      ? DEFAULT_TIMEZONE
                      : form.timezone || "—",
                  icon: <Globe size={10} color="#0078d4" />,
                },
                {
                  label: "Duration",
                  value: form.duration ? `${form.duration} min` : "—",
                  icon: <Clock size={10} color="#2dd4bf" />,
                },
                {
                  label: "Chat",
                  value: form.chat ? "Enabled" : "Disabled",
                  icon: <MessageSquare size={10} color="#22d3ee" />,
                },
                {
                  label: "Recording",
                  value: form.recording ? "Enabled" : "Disabled",
                  icon: <Radio size={10} color="#f43f5e" />,
                },
                {
                  label: "Notify",
                  value: form.notifications ? "Enabled" : "Disabled",
                  icon: <Bell size={10} color="#22c55e" />,
                },
                {
                  label: "Published",
                  value: form.isPublished ? "Global" : "Batch Only",
                  icon: <Globe size={10} color="#22c55e" />,
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="review-field">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 3,
                    }}
                  >
                    {icon}
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: FONT_WEIGHT.bold,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: t.textMuted,
                        fontFamily: FONT_FAMILY,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: FONT_WEIGHT.semibold,
                      color: t.text,
                      fontFamily: FONT_FAMILY,
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {form.mode && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: FONT_WEIGHT.semibold,
                    color: form.mode === "custom" ? "#22c55e" : "#0078d4",
                    background:
                      form.mode === "custom"
                        ? "rgba(34,197,94,0.10)"
                        : "rgba(0,120,212,0.10)",
                    border: `1px solid ${form.mode === "custom" ? "rgba(34,197,94,0.28)" : "rgba(0,120,212,0.28)"}`,
                    padding: "3px 10px",
                    borderRadius: 5,
                    fontFamily: FONT_FAMILY,
                  }}
                >
                  {form.mode === "custom" ? (
                    <>
                      <Zap size={10} /> Custom Live
                    </>
                  ) : (
                    <>
                      <ExternalLink size={10} /> External
                    </>
                  )}
                </span>
                {form.mode === "custom" && (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "#22c55e",
                      fontWeight: FONT_WEIGHT.semibold,
                    }}
                  >
                    {form.roomId}
                  </span>
                )}
                {form.mode === "external" && form.meetingLink && (
                  <span
                    style={{
                      fontSize: 10,
                      color: t.textSub,
                      fontFamily: FONT_FAMILY,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 160,
                    }}
                  >
                    {form.meetingLink}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleGoLive}
              disabled={submitting || !step1Valid}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: !step1Valid
                  ? isDark
                    ? "rgba(34,197,94,0.25)"
                    : "#bbf7d0"
                  : submitting
                    ? "#16a34a"
                    : "#22c55e",
                color: !step1Valid ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: 13,
                fontWeight: FONT_WEIGHT.extrabold,
                cursor: !step1Valid || submitting ? "not-allowed" : "pointer",
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
                boxShadow:
                  step1Valid && !submitting
                    ? "0 6px 20px rgba(34,197,94,0.35)"
                    : "none",
              }}
            >
              {/* {submitting ? (
                "Scheduling…"
              ) : ( */}
              {submitting ? (
                form.scheduleMode === "now" ? (
                  "Starting…"
                ) : (
                  "Scheduling…"
                )
              ) : (
                <>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "inline-block",
                      animation: step1Valid
                        ? "liveDot 1.2s ease-in-out infinite"
                        : "none",
                    }}
                  />
                  {/* {form.mode === "external"
                    ? "Save & Notify Students"
                    : "Schedule Session"} */}
                  {form.scheduleMode === "now"
                    ? "Start Now"
                    : form.mode === "external"
                      ? "Save & Notify Students"
                      : "Schedule Session"}
                </>
              )}
            </button>
            {/* <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 9,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                background: "transparent",
                color: t.textSub,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                cursor: publishing ? "not-allowed" : "pointer",
                fontFamily: FONT_FAMILY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Send size={12} />
              {publishing ? "Scheduling…" : "Schedule for Later (Publish)"}
            </button> */}
            {form.scheduleMode !== "now" && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  width: "100%",
                  padding: "9px 0",
                  borderRadius: 9,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0"}`,
                  background: "transparent",
                  color: t.textSub,
                  fontSize: 11,
                  fontWeight: FONT_WEIGHT.semibold,
                  cursor: publishing ? "not-allowed" : "pointer",
                  fontFamily: FONT_FAMILY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Send size={12} />
                {publishing ? "Scheduling…" : "Schedule for Later (Publish)"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  /* ── RIGHT PANEL ── */
  const RightPanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PanelSectionHeader
        icon={Calendar}
        color="#0078d4"
        title="Schedule"
        t={t}
      />
      <div className="panel-scroll">
        {/* <MiniCalendar
          t={t}
          isDark={isDark}
          selectedDate={form.date}
          onSelectDate={(dateStr) => upd("date", dateStr)}
          sessionEvents={sessionEvents}
        /> */}
        <MiniCalendar
          t={t}
          isDark={isDark}
          selectedDate={form.date}
          onSelectDate={(dateStr) => upd("date", dateStr)}
          sessionEvents={sessionEvents}
          onMonthChange={loadCalendarEvents}
        />
        {form.date && (
          <div style={{ borderTop: `1px solid ${t.calDivider}` }}>
            <div style={{ padding: "8px 12px 4px" }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  color: t.text,
                  fontFamily: FONT_FAMILY,
                }}
              >
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div style={{ padding: "0 10px 10px" }}>
              {sessionEvents.filter((e) => e.date === form.date).length ===
              0 ? (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <p
                    style={{
                      fontSize: 9,
                      color: t.textMuted,
                      fontFamily: FONT_FAMILY,
                      margin: 0,
                    }}
                  >
                    No sessions scheduled
                  </p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {sessionEvents
                    .filter((e) => e.date === form.date)
                    .map((ev, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "5px 8px",
                          borderRadius: 6,
                          background: t.calEventBg,
                          border: `1px solid ${t.calEventBorder}`,
                        }}
                      >
                        <div
                          style={{
                            width: 2,
                            height: 22,
                            borderRadius: 99,
                            background: "#0078d4",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: FONT_WEIGHT.semibold,
                              color: t.calEventText,
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            {ev.title}
                          </div>
                          <div
                            style={{
                              fontSize: 8,
                              color: t.calIconColor,
                              fontFamily: FONT_FAMILY,
                            }}
                          >
                            Scheduled
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          style={{
            margin: "0 10px 10px",
            background: isDark ? "rgba(0,120,212,0.06)" : "#f0f8ff",
            border: `1px solid ${isDark ? "rgba(0,120,212,0.2)" : "#bfdbfe"}`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: FONT_WEIGHT.bold,
              color: "#0078d4",
              fontFamily: FONT_FAMILY,
              marginBottom: 6,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Tips
          </div>
          {[
            "Click a date to auto-fill the date field",
            "Complete all 3 steps before scheduling",
            "'Schedule for Later' saves without going live",
          ].map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 5,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "#0078d4",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: t.textSub,
                  fontFamily: FONT_FAMILY,
                  lineHeight: 1.5,
                }}
              >
                {tip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
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
      isMobile={isMobile}
      isTablet={isTablet}
    />
  );
}
