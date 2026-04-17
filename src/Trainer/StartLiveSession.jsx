import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Circle, Sparkles } from "lucide-react";
import { createLiveSession } from "@/services/liveSessionService";
import { getTrainerBatches } from "@/services/batchService";

/* ─── theme token map ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    textLabel: "rgba(255,255,255,0.22)", inputBg: "#1a1a1a", inputBorder: "rgba(255,255,255,0.08)",
    inputText: "#ffffff", inputPlaceholder: "rgba(255,255,255,0.2)",
    labelColor: "rgba(255,255,255,0.4)", selectBg: "#1a1a1a",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", gridLine: "rgba(255,255,255,0.5)",
    toggleBg: "rgba(255,255,255,0.04)", toggleBorder: "rgba(255,255,255,0.07)",
    sectionBg: "#111111", barBg: "rgba(255,255,255,0.05)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
    border: "#e2e8f0", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    textLabel: "#94a3b8", inputBg: "#f8fafc", inputBorder: "#e2e8f0",
    inputText: "#0f172a", inputPlaceholder: "#94a3b8",
    labelColor: "#64748b", selectBg: "#f8fafc",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", gridLine: "rgba(0,0,0,0.12)",
    toggleBg: "#f8fafc", toggleBorder: "#e2e8f0",
    sectionBg: "#ffffff", barBg: "#f1f5f9",
  },
};

const StartLiveSession = () => {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [form, setForm] = useState({ title: "", description: "", batchId: "", date: "", time: "", duration: "", chat: true, recording: true, notifications: true });
  const [batches, setBatches] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const durations = ["15", "30", "45", "60", "75", "90"];

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const data = await getTrainerBatches();
        setBatches(data || []);
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };
    loadBatches();
  }, []);

  const handleGoLive = async () => {
    try {
      setSubmitting(true);
      const payload = { title: form.title, description: form.description, batchId: Number(form.batchId), scheduledDate: form.date, scheduledTime: form.time, duration: Number(form.duration), chatEnabled: form.chat, autoRecord: form.recording, notifyStudents: form.notifications };
      const res = await createLiveSession(payload);
      navigate(`/trainer/live-controls/${res.data.id}`);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10,
    border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText,
    fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none",
    transition: "border 0.2s",
  };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: t.labelColor, fontFamily: "'Poppins',sans-serif", letterSpacing: "0.04em", marginBottom: 6, display: "block" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes liveDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(1.5)}}
        input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:${isDark ? "invert(1) opacity(0.3)" : "opacity(0.5)"};cursor:pointer}
        select option{background:${t.selectBg};color:${t.inputText}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
      <div style={{
  position: "relative",
  zIndex: 1,
  padding: "24px 40px",   // thoda side spacing rakho
  width: "100%",
  maxWidth: "100%",
  margin: 0,
  paddingBottom: 52
}}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(244,63,94,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => navigate("/trainer/live")} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0, transition: "all 0.2s" }}>
                <ArrowLeft size={16} />
              </button>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <Sparkles size={11} color={t.textSub} />
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Live Studio</span>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,3vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
                  <Video size={22} color="#f43f5e" />
                  Start Live Session
                </h1>
              </div>
            </div>
          </div>

          {/* ═══ SESSION DETAILS ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>
                <Video size={15} color="#f43f5e" />
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Session Details</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FormField label="Session Title" style={labelStyle}>
                <input style={inputStyle} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Enter session title..." />
              </FormField>

              <FormField label="Description" style={labelStyle}>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Brief description of this session..." />
              </FormField>

              <FormField label="Select Batch" style={labelStyle}>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.batchId} onChange={(e) => updateField("batchId", e.target.value)}>
                  <option value="">Select a batch...</option>
                  {Array.isArray(batches) && batches.map((b, i) => {
                    const id = b.id ?? b.batchId ?? b.batch_id;
                    const name = b.name ?? b.batchName ?? `Batch (ID: ${id})`;
                    return <option key={i} value={String(id)}>{name}</option>;
                  })}
                </select>
              </FormField>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <FormField label="Date" style={labelStyle}>
                  <input type="date" style={inputStyle} value={form.date} onChange={(e) => updateField("date", e.target.value)} />
                </FormField>
                <FormField label="Time" style={labelStyle}>
                  <input type="time" style={inputStyle} value={form.time} onChange={(e) => updateField("time", e.target.value)} />
                </FormField>
              </div>

              <FormField label="Duration (minutes)" style={labelStyle}>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.duration} onChange={(e) => updateField("duration", e.target.value)}>
                  <option value="">Select duration...</option>
                  {durations.map((d) => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </FormField>
            </div>
          </div>

          {/* ═══ SESSION SETTINGS ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 24, boxShadow: t.shadow, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Session Settings</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { key: "chat", label: "Enable Chat", color: "#22d3ee" },
                { key: "recording", label: "Auto Record", color: "#f43f5e" },
                { key: "notifications", label: "Notify Students", color: "#34d399" },
              ].map(({ key, label, color }) => (
                <ToggleRow key={key} label={label} checked={form[key]} color={color} t={t} onChange={(v) => updateField(key, v)} />
              ))}
            </div>
          </div>

          {/* ═══ GO LIVE BUTTON ═══ */}
          <GoLiveButton submitting={submitting} onClick={handleGoLive} />
        </div>
      </div>
    </>
  );
};

function FormField({ label, children, style }) {
  return (
    <div>
      <label style={style}>{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, color, t, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: t.toggleBg, border: `1px solid ${t.toggleBorder}` }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{label}</span>
      <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", background: checked ? color : t.inputBorder, transition: "background 0.25s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 2, left: checked ? "calc(100% - 22px)" : 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

function GoLiveButton({ submitting, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={submitting} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
      background: submitting ? "rgba(244,63,94,0.5)" : hov ? "#e11d48" : "#f43f5e",
      color: "#fff", fontSize: 13, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
      fontFamily: "'Poppins',sans-serif", letterSpacing: "0.05em", display: "flex",
      alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s",
      boxShadow: hov && !submitting ? "0 8px 24px rgba(244,63,94,0.35)" : "none",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block", animation: "liveDot 1.2s ease-in-out infinite" }} />
      {submitting ? "Starting..." : "Go Live Now"}
    </button>
  );
}

export default StartLiveSession;