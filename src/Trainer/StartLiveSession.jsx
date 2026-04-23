import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Video, Sparkles, MessageSquare, Radio, Bell,
  Calendar, Clock, Users, ChevronDown, CheckCircle2, Circle,
} from "lucide-react";
import { createLiveSession } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHero: "rgba(255,255,255,0.07)",
    borderHov: "rgba(255,255,255,0.14)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    labelColor: "rgba(255,255,255,0.4)",
    inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)", inputText: "#ffffff",
    selectBg: "#1a1a1a",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", shadowCard: "0 8px 32px rgba(0,0,0,0.5)",
    gridLine: "rgba(255,255,255,0.5)",
    toggleBg: "rgba(255,255,255,0.03)", toggleBorder: "rgba(255,255,255,0.06)",
    panelActiveBg: "#141414", panelInactiveBg: "#0f0f0f",
    headHov: "rgba(255,255,255,0.02)",
    reviewBg: "rgba(255,255,255,0.03)", reviewBorder: "rgba(255,255,255,0.06)",
    barBg: "rgba(255,255,255,0.05)",
    numInactiveBg: "rgba(255,255,255,0.04)", numInactiveBorder: "rgba(255,255,255,0.10)", numInactiveText: "rgba(255,255,255,0.25)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
    border: "#e2e8f0", borderHero: "#e2e8f0", borderHov: "#cbd5e1",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    labelColor: "#64748b",
    inputBg: "#f8fafc", inputBorder: "#e2e8f0", inputText: "#0f172a",
    selectBg: "#f8fafc",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", shadowCard: "0 4px 24px rgba(0,0,0,0.08)",
    gridLine: "rgba(0,0,0,0.12)",
    toggleBg: "#f8fafc", toggleBorder: "#e2e8f0",
    panelActiveBg: "#ffffff", panelInactiveBg: "#fafafa",
    headHov: "rgba(0,0,0,0.015)",
    reviewBg: "#f8fafc", reviewBorder: "#e2e8f0",
    barBg: "#f1f5f9",
    numInactiveBg: "#f1f5f9", numInactiveBorder: "#e2e8f0", numInactiveText: "#94a3b8",
  },
};

const ACCENTS = {
  1: { color: "#f43f5e", dim: "rgba(244,63,94,0.10)", border: "rgba(244,63,94,0.25)", label: "Session Details",  sub: "Title, batch & schedule" },
  2: { color: "#22d3ee", dim: "rgba(34,211,238,0.10)",  border: "rgba(34,211,238,0.25)",  label: "Session Settings", sub: "Chat, recording & alerts" },
  3: { color: "#34d399", dim: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)",  label: "Review & Launch",  sub: "Confirm and go live" },
};

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

  /* ─ form state ─ */
  const [form, setForm] = useState({
    title: "", description: "", batchId: "", date: "", time: "",
    duration: "", chat: true, recording: true, notifications: true,
  });
  const [batches,    setBatches]    = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [openPanel,  setOpenPanel]  = useState(1);

  const upd = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const durations = ["15", "30", "45", "60", "75", "90"];

  useEffect(() => {
    (async () => {
      try { const data = await getTrainerBatches(); setBatches(data || []); }
      catch (err) { console.error("Failed to load batches:", err); }
    })();
  }, []);

  const handleGoLive = async () => {
    try {
      setSubmitting(true);
      const payload = {
        title: form.title, description: form.description,
        batchId: Number(form.batchId), scheduledDate: form.date,
        scheduledTime: form.time, duration: Number(form.duration),
        chatEnabled: form.chat, autoRecord: form.recording,
        notifyStudents: form.notifications,
      };
      const res = await createLiveSession(payload);
      navigate(`/trainer/live-controls/${res.data.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  /* ─ styles ─ */
  const iStyle = {
    width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText,
    fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none",
    transition: "border 0.2s", appearance: "none",
  };
  const lStyle = {
    fontSize: 10, fontWeight: 600, color: t.labelColor, fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  /* ─ batch name lookup ─ */
  const selectedBatch = batches.find((b) => String(b.id ?? b.batchId) === String(form.batchId));
  const batchLabel    = selectedBatch ? (selectedBatch.name ?? selectedBatch.batchName ?? `Batch ${form.batchId}`) : null;

  /* ─ review items ─ */
  const reviewItems = [
    { label: "Title",     value: form.title    || "—", icon: Video    },
    { label: "Batch",     value: batchLabel    || "—", icon: Users    },
    { label: "Date",      value: form.date     || "—", icon: Calendar },
    { label: "Time",      value: form.time     || "—", icon: Clock    },
    { label: "Duration",  value: form.duration ? `${form.duration} min` : "—", icon: Clock },
    { label: "Chat",      value: form.chat         ? "Enabled" : "Off", icon: MessageSquare, bool: form.chat },
    { label: "Recording", value: form.recording    ? "Enabled" : "Off", icon: Radio,         bool: form.recording },
    { label: "Notify",    value: form.notifications ? "Enabled" : "Off", icon: Bell,         bool: form.notifications },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes liveDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.6)} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .dfade  { animation: fadeUp 0.4s ease both }
        .sdown  { animation: slideDown 0.3s ease both }
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator {
          filter: ${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"}; cursor:pointer;
        }
        select option { background: ${t.selectBg}; color: ${t.inputText}; }
        .panel-body-inner { animation: slideDown 0.3s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 24px 60px" }}>

          {/* ─── HERO ─── */}
          <div className="dfade" style={{
            borderRadius: 22, padding: "26px 30px", background: t.heroBg,
            border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden",
            marginBottom: 22, boxShadow: t.shadow,
          }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.035 : 0.02, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "36px 36px" }} />
            <div style={{ position: "absolute", top: "-40%", right: "20%", width: 260, height: 180, background: "radial-gradient(ellipse,rgba(244,63,94,0.08),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => navigate("/trainer/live")} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0, transition: "all 0.2s" }}>
                <ArrowLeft size={15} />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <Sparkles size={10} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Live Studio</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.025em", display: "flex", alignItems: "center", gap: 10 }}>
                  <Video size={20} color="#f43f5e" />
                  Start Live Session
                </h1>
              </div>
              {/* Progress pills */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {[1, 2, 3].map((n) => {
                  const a = ACCENTS[n];
                  const active = openPanel === n;
                  return (
                    <div key={n} onClick={() => setOpenPanel(n)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 99, border: `1px solid ${active ? a.border : t.border}`, background: active ? a.dim : "transparent", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: active ? 18 : 6, height: 6, borderRadius: 99, background: active ? a.color : t.textMuted, transition: "all 0.3s ease" }} />
                      {active && <span style={{ fontSize: 9, fontWeight: 700, color: a.color, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em" }}>{n}/3</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── PANELS ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

            {/* ── Panel 1: Session Details ── */}
            <CRMPanel
              num={1} t={t} isDark={isDark} isOpen={openPanel === 1}
              onToggle={() => setOpenPanel(openPanel === 1 ? null : 1)}
              summaryChips={[
                form.title && { label: form.title.slice(0, 22) + (form.title.length > 22 ? "…" : ""), color: "#f43f5e" },
                batchLabel  && { label: batchLabel.split(" ").slice(0, 2).join(" "), color: "#f43f5e" },
                form.date   && { label: form.date, color: "#f43f5e" },
              ].filter(Boolean)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={lStyle}>Session Title</label>
                  <input style={iStyle} value={form.title} onChange={(e) => upd("title", e.target.value)} placeholder="e.g. React Hooks Deep Dive" />
                </div>
                <div>
                  <label style={lStyle}>Description</label>
                  <textarea style={{ ...iStyle, resize: "vertical", minHeight: 72 }} value={form.description} onChange={(e) => upd("description", e.target.value)} placeholder="Brief overview for students..." />
                </div>
                <div>
                  <label style={lStyle}>Select Batch</label>
                  <div style={{ position: "relative" }}>
                    <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.batchId} onChange={(e) => upd("batchId", e.target.value)}>
                      <option value="">Choose a batch...</option>
                      {Array.isArray(batches) && batches.map((b, i) => {
                        const id   = b.id ?? b.batchId ?? b.batch_id;
                        const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
                        return <option key={i} value={String(id)}>{name}</option>;
                      })}
                    </select>
                    <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={lStyle}>Date</label>
                    <input type="date" style={iStyle} value={form.date} onChange={(e) => upd("date", e.target.value)} />
                  </div>
                  <div>
                    <label style={lStyle}>Time</label>
                    <input type="time" style={iStyle} value={form.time} onChange={(e) => upd("time", e.target.value)} />
                  </div>
                  <div>
                    <label style={lStyle}>Duration</label>
                    <div style={{ position: "relative" }}>
                      <select style={{ ...iStyle, cursor: "pointer", paddingRight: 36 }} value={form.duration} onChange={(e) => upd("duration", e.target.value)}>
                        <option value="">Select...</option>
                        {durations.map((d) => <option key={d} value={d}>{d} min</option>)}
                      </select>
                      <ChevronDown size={13} color={t.textMuted} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    </div>
                  </div>
                </div>

                {/* Next CTA inside panel */}
                <PanelNextBtn label="Next: Session Settings →" color="#f43f5e" onClick={() => setOpenPanel(2)} />
              </div>
            </CRMPanel>

            {/* ── Panel 2: Session Settings ── */}
            <CRMPanel
              num={2} t={t} isDark={isDark} isOpen={openPanel === 2}
              onToggle={() => setOpenPanel(openPanel === 2 ? null : 2)}
              summaryChips={[
                form.chat         && { label: "Chat On",      color: "#22d3ee" },
                form.recording    && { label: "Auto Record",  color: "#22d3ee" },
                form.notifications && { label: "Notifying",   color: "#22d3ee" },
              ].filter(Boolean)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { key: "chat",          label: "Enable Chat",       sub: "Students can message during live",  color: "#22d3ee", Icon: MessageSquare },
                  { key: "recording",     label: "Auto Record",       sub: "Save session for replay access",    color: "#f43f5e", Icon: Radio         },
                  { key: "notifications", label: "Notify Students",   sub: "Push alert when going live",        color: "#34d399", Icon: Bell          },
                ].map(({ key, label, sub, color, Icon }) => (
                  <PremiumToggleRow key={key} label={label} sub={sub} Icon={Icon} checked={form[key]} color={color} t={t} onChange={(v) => upd(key, v)} />
                ))}
                <PanelNextBtn label="Next: Review & Launch →" color="#22d3ee" onClick={() => setOpenPanel(3)} />
              </div>
            </CRMPanel>

            {/* ── Panel 3: Review & Launch ── */}
            <CRMPanel
              num={3} t={t} isDark={isDark} isOpen={openPanel === 3}
              onToggle={() => setOpenPanel(openPanel === 3 ? null : 3)}
              summaryChips={[]}
            >
              {/* Review grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                {reviewItems.map((item, i) => {
                  const Icon = item.icon;
                  const isBool = item.bool !== undefined;
                  const boolColor = item.bool ? "#34d399" : t.textMuted;
                  return (
                    <div key={i} style={{ background: t.reviewBg, border: `1px solid ${t.reviewBorder}`, borderRadius: 12, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon size={11} color={t.textMuted} />
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>{item.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: isBool ? boolColor : t.text, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {isBool && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: boolColor, marginRight: 5 }} />}
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Go Live Button */}
              <GoLiveButton submitting={submitting} onClick={handleGoLive} />
            </CRMPanel>

          </div>
        </div>
      </div>
    </>
  );
};

/* ══ CRM Panel Component ══ */
function CRMPanel({ num, t, isDark, isOpen, onToggle, summaryChips = [], children }) {
  const a = ACCENTS[num];
  return (
    <div style={{
      background: isOpen ? t.panelActiveBg : t.panelInactiveBg,
      border: `1px solid ${isOpen ? a.border : t.border}`,
      borderRadius: 18, overflow: "hidden",
      boxShadow: isOpen ? `0 4px 28px ${a.color}12` : t.shadow,
      transition: "all 0.25s ease",
    }}>
      {/* Head */}
      <div onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "15px 20px",
        cursor: "pointer", transition: "background 0.15s",
        background: "transparent",
      }}
        onMouseEnter={(e) => e.currentTarget.style.background = t.headHov}
        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
      >
        {/* Number badge */}
        <div style={{
          width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
          background: isOpen ? a.dim : t.numInactiveBg,
          border: `1px solid ${isOpen ? a.border : t.numInactiveBorder}`,
          fontSize: 12, fontWeight: 800, fontFamily: "'Poppins',sans-serif",
          color: isOpen ? a.color : t.numInactiveText,
        }}>
          {num}
        </div>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", letterSpacing: "-0.01em" }}>{a.label}</div>
          {!isOpen && (
            <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 2 }}>{a.sub}</div>
          )}
        </div>

        {/* Summary chips (visible when collapsed) */}
        {!isOpen && summaryChips.length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {summaryChips.slice(0, 3).map((chip, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 700, color: chip.color, background: `${chip.color}12`, border: `1px solid ${chip.color}25`, padding: "3px 8px", borderRadius: 99, fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                {chip.label}
              </span>
            ))}
          </div>
        )}

        {/* Vertical divider */}
        <div style={{ width: 1, height: 20, background: t.border, flexShrink: 0 }} />

        {/* Arrow */}
        <div style={{
          width: 26, height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
          background: isOpen ? a.dim : "transparent",
          border: `1px solid ${isOpen ? a.border : t.border}`,
          transition: "all 0.25s",
          flexShrink: 0,
        }}>
          <ChevronDown size={13} color={isOpen ? a.color : t.textMuted} style={{ transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </div>

      {/* Divider line */}
      {isOpen && <div style={{ height: 1, background: `linear-gradient(90deg, ${a.color}25, transparent)`, marginLeft: 20, marginRight: 20 }} />}

      {/* Body */}
      <div style={{
        maxHeight: isOpen ? 1000 : 0,
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div className="panel-body-inner" style={{ padding: "18px 20px 20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ══ Premium Toggle Row ══ */
function PremiumToggleRow({ label, sub, Icon, checked, color, t, onChange }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
      borderRadius: 12, background: t.toggleBg, border: `1px solid ${t.toggleBorder}`,
      transition: "border-color 0.2s",
    }}>
      <div style={{ width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: checked ? `${color}12` : t.barBg, border: `1px solid ${checked ? color + "25" : "transparent"}`, transition: "all 0.2s" }}>
        <Icon size={14} color={checked ? color : t.textMuted} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{label}</div>
        <div style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginTop: 1 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
        position: "relative", background: checked ? color : t.inputBorder,
        transition: "background 0.25s", flexShrink: 0,
      }}>
        <span style={{
          position: "absolute", top: 2,
          left: checked ? "calc(100% - 22px)" : 2,
          width: 20, height: 20, borderRadius: "50%",
          background: "#fff", transition: "left 0.25s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );
}

/* ══ Panel Next Button ══ */
function PanelNextBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "9px 18px", borderRadius: 10, border: `1px solid ${hov ? color + "45" : color + "25"}`,
      background: hov ? `${color}15` : `${color}08`, color,
      fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif",
      letterSpacing: "0.03em", transition: "all 0.18s", alignSelf: "flex-end",
    }}>
      {label}
    </button>
  );
}

/* ══ Go Live Button ══ */
function GoLiveButton({ submitting, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={submitting}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
        background: submitting ? "rgba(244,63,94,0.5)" : hov ? "#e11d48" : "#f43f5e",
        color: "#fff", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
        fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "all 0.2s",
        boxShadow: hov && !submitting ? "0 8px 28px rgba(244,63,94,0.38)" : "none",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />
      {submitting ? "Starting session…" : "Go Live Now"}
    </button>
  );
}

export default StartLiveSession;