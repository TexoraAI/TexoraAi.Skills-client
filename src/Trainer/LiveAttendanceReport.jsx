
import { AlertCircle, ArrowLeft, BarChart3, CheckCircle2, Clock, Download, FileText, MessageCircle, Users, XCircle, Sparkles, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ─── theme tokens ─── */
const T = {
  dark: {
    pageBg: "#0a0a0a", cardBg: "#111111", heroBg: "#141414",
    border: "rgba(255,255,255,0.06)", borderHero: "rgba(255,255,255,0.07)",
    text: "#ffffff", textSub: "rgba(255,255,255,0.3)", textMuted: "rgba(255,255,255,0.2)",
    pillBg: "rgba(255,255,255,0.04)", pillBorder: "rgba(255,255,255,0.07)", pillText: "rgba(255,255,255,0.25)",
    actBg: "rgba(255,255,255,0.04)", actBorder: "rgba(255,255,255,0.07)",
    actBar: "rgba(255,255,255,0.5)", actIcon: "rgba(255,255,255,0.3)",
    shadow: "0 4px 20px rgba(0,0,0,0.4)", gridLine: "rgba(255,255,255,0.5)",
    barBg: "rgba(255,255,255,0.05)", tableBorderColor: "rgba(255,255,255,0.05)",
    tableHov: "rgba(255,255,255,0.03)", theadBg: "rgba(255,255,255,0.03)",
    emptyBorder: "rgba(255,255,255,0.07)", emptyBg: "rgba(255,255,255,0.02)", emptyIcon: "rgba(255,255,255,0.12)",
    shadowHov: "0 20px 60px rgba(0,0,0,0.6)",
  },
  light: {
    pageBg: "#f1f5f9", cardBg: "#ffffff", heroBg: "#ffffff",
    border: "#e2e8f0", borderHero: "#e2e8f0",
    text: "#0f172a", textSub: "#64748b", textMuted: "#94a3b8",
    pillBg: "#f1f5f9", pillBorder: "#e2e8f0", pillText: "#94a3b8",
    actBg: "#f8fafc", actBorder: "#e2e8f0", actBar: "#94a3b8", actIcon: "#94a3b8",
    shadow: "0 1px 8px rgba(0,0,0,0.07)", gridLine: "rgba(0,0,0,0.12)",
    barBg: "#f1f5f9", tableBorderColor: "#e2e8f0",
    tableHov: "#f8fafc", theadBg: "#f8fafc",
    emptyBorder: "#e2e8f0", emptyBg: "#f8fafc", emptyIcon: "#cbd5e1",
    shadowHov: "0 8px 32px rgba(0,0,0,0.10)",
  },
};

const statusConfig = {
  present: { label: "On Time", icon: CheckCircle2, color: "#34d399" },
  late: { label: "Late", icon: AlertCircle, color: "#f59e0b" },
  "left-early": { label: "Left Early", icon: XCircle, color: "#f87171" },
};

const LiveAttendanceReport = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [report, setReport] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setReport({ sessionTitle: "React Live Class", date: "2026-02-19", time: "10:00 AM" });
    setAttendees([{ name: "Raghib Imam", joinTime: "10:00 AM", leaveTime: "11:00 AM", duration: "60 min", watchPercent: 95, chatMessages: 5, status: "present" }]);
  }, [sessionId]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Name,Join Time,Leave Time,Duration,Watch %,Chat Messages\n" + attendees.map((a) => `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `attendance-${sessionId}.csv`;
    document.body.appendChild(link);
    link.click();
  };

  const filtered = attendees.filter((a) => a.name?.toLowerCase().includes(search.toLowerCase()));
  const completedCount = attendees.filter((a) => a.status === "present").length;
  const completionRate = attendees.length > 0 ? Math.round((completedCount / attendees.length) * 100) : 0;
  const avgWatchTime = attendees.length > 0 ? Math.round(attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) / attendees.length) : 0;
  const totalMessages = attendees.reduce((acc, a) => acc + (a.chatMessages ?? 0), 0);

  const metricCards = [
    { label: "Total Attendees", value: attendees.length, color: "#22d3ee", icon: Users },
    { label: "Completed", value: completedCount, color: "#34d399", icon: CheckCircle2 },
    { label: "Completion Rate", value: `${completionRate}%`, color: "#a78bfa", icon: BarChart3 },
    { label: "Avg Watch Time", value: `${avgWatchTime}%`, color: "#f59e0b", icon: Clock },
    { label: "Chat Messages", value: totalMessages, color: "#f43f5e", icon: MessageCircle },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}
        .d2{animation:blink 1.6s 0.3s ease infinite}
        .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
        <div style={{ position: "relative", zIndex: 1, padding: 24, maxWidth: 1300, margin: "0 auto", paddingBottom: 52 }}>

          {/* ═══ HERO ═══ */}
          <div className="dfade" style={{ borderRadius: 24, padding: "30px 36px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 20, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => navigate("/trainer/live/history")} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, flexShrink: 0, transition: "all 0.2s" }}>
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                    <Sparkles size={11} color={t.textSub} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Report</span>
                  </div>
                  <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,3vw,2.4rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
                    <BarChart3 size={22} color="#a78bfa" /> Attendance Report
                  </h1>
                  {report && <p style={{ fontSize: 12, color: t.textSub, marginTop: 7, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>{report.sessionTitle} · {report.date} · {report.time}</p>}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <HeroBtn label="Export CSV" icon={Download} color="#22d3ee" onClick={handleExport} t={t} />
                <HeroBtn label="Full Report" icon={FileText} color="#a78bfa" onClick={() => navigate(`/trainer/live/full-report/${sessionId}`)} t={t} primary />
              </div>
            </div>
          </div>

          {/* ═══ METRIC CARDS ═══ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
            {metricCards.map((m, i) => (
              <MetricCard key={i} metric={m} t={t} index={i} />
            ))}
          </div>

          {/* ═══ TABLE ═══ */}
          <div className="dfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, boxShadow: t.shadow, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.tableBorderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                  <Users size={15} color="#a78bfa" />
                </div>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: t.text }}>Attendee Details</span>
              </div>
              <input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: isDark ? "#1a1a1a" : "#f8fafc", color: t.text, fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 500, outline: "none", width: 200 }}
              />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.tableBorderColor}` }}>
                    {["Student", "Joined", "Left", "Duration", "Watch %", "Chat", "Status"].map((h) => (
                      <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a, i) => (
                    <AttendeeRow key={i} attendee={a} t={t} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function MetricCard({ metric, t, index }) {
  const [hov, setHov] = useState(false);
  const Icon = metric.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="dfade" style={{
      animationDelay: `${index * 60}ms`, background: hov ? (t === T.dark ? "#161616" : "#f8fafc") : t.cardBg,
      border: `1px solid ${hov ? metric.color + "30" : t.border}`,
      boxShadow: hov ? `0 8px 32px ${metric.color}12` : t.shadow,
      borderRadius: 20, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 10,
      transition: "all 0.25s ease", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -15, right: -15, width: 70, height: 70, borderRadius: "50%", background: metric.color, filter: "blur(30px)", opacity: hov ? 0.15 : 0.04, transition: "opacity 0.4s", pointerEvents: "none" }} />
      <div style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}>
        <Icon size={17} color={metric.color} />
      </div>
      <div>
        <p style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, fontFamily: "'Poppins',sans-serif", color: t.text, margin: 0 }}>{metric.value}</p>
        <p style={{ fontSize: 9, marginTop: 5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: "5px 0 0" }}>{metric.label}</p>
      </div>
      <div style={{ height: 2, background: t.barBg, borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, background: metric.color, width: hov ? "60%" : "18%", transition: "width 0.65s ease", opacity: 0.85 }} />
      </div>
    </div>
  );
}

function AttendeeRow({ attendee: a, t }) {
  const [hov, setHov] = useState(false);
  const cfg = statusConfig[a.status] || statusConfig.present;
  const Icon = cfg.icon;
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderBottom: `1px solid ${t.tableBorderColor}`, background: hov ? t.tableHov : "transparent", transition: "background 0.15s" }}>
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{(a.name || "?")[0]}</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.name}</span>
        </div>
      </td>
      {[a.joinTime, a.leaveTime, a.duration].map((v, i) => (
        <td key={i} style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{v}</td>
      ))}
      <td style={{ padding: "13px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ flex: 1, maxWidth: 60, height: 4, borderRadius: 99, background: t.barBg, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: a.watchPercent >= 80 ? "#34d399" : a.watchPercent >= 50 ? "#f59e0b" : "#f87171", width: `${a.watchPercent}%` }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{a.watchPercent}%</span>
        </div>
      </td>
      <td style={{ padding: "13px 18px", fontSize: 12, color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>{a.chatMessages}</td>
      <td style={{ padding: "13px 18px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: cfg.color, background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, padding: "3px 10px", borderRadius: 999, width: "fit-content", fontFamily: "'Poppins',sans-serif" }}>
          <Icon size={10} color={cfg.color} /> {cfg.label}
        </span>
      </td>
    </tr>
  );
}

function HeroBtn({ label, icon: Icon, color, onClick, t, primary }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: `1px solid ${hov ? color + "55" : color + "30"}`, background: hov ? `${color}22` : `${color}12`, color, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", transition: "all 0.2s", letterSpacing: "0.03em" }}>
      <Icon size={13} /> {label}
    </button>
  );
}

export default LiveAttendanceReport;