import React, { useState, useEffect } from "react";
import { getStudentClassroom } from "@/services/batchService";
import { getLiveSessionsByBatch, joinLiveSession } from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";
import { ChevronDown, ChevronUp, Radio, Users, Calendar, Clock, Wifi, TrendingUp } from "lucide-react";

/* ─── Styles ─────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

  :root {
    --lc-bg:        #f1f5f9;
    --lc-card:      #ffffff;
    --lc-text:      #0f172a;
    --lc-muted:     #64748b;
    --lc-border:    #e2e8f0;
    --lc-accent1:   #22d3ee;
    --lc-accent2:   #fb923c;
    --lc-accent3:   #34d399;
    --lc-accent4:   #a78bfa;
    --lc-danger:    #f87171;
    --lc-shadow:    0 4px 24px rgba(0,0,0,0.06);
    --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.10);
    --lc-radius:    20px;
  }

  .lc-dark {
    --lc-bg:        #0a0a0a;
    --lc-card:      #111111;
    --lc-text:      #ffffff;
    --lc-muted:     #94a3b8;
    --lc-border:    rgba(255,255,255,0.06);
    --lc-shadow:    0 4px 24px rgba(0,0,0,0.40);
    --lc-shadow-lg: 0 8px 40px rgba(0,0,0,0.60);
  }

  .lc-root {
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    background: var(--lc-bg);
    color: var(--lc-text);
    padding: 24px;
    box-sizing: border-box;
    transition: background 0.3s;
  }

  .lc-inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

  /* ── Header ── */
  .lc-header {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    padding: 28px 32px;
    box-shadow: var(--lc-shadow);
    display: flex; align-items: center;
    justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }

  .lc-header-left { display: flex; align-items: center; gap: 16px; }

  .lc-header-icon {
    width: 52px; height: 52px; border-radius: 14px;
    background: rgba(248,113,113,0.10);
    border: 1px solid rgba(248,113,113,0.18);
    display: flex; align-items: center; justify-content: center;
    color: var(--lc-danger); flex-shrink: 0;
  }

  .lc-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 11px; border-radius: 50px;
    border: 1px solid var(--lc-border);
    background: rgba(248,113,113,0.08);
    color: var(--lc-danger);
    font-size: 10px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 6px;
  }

  .lc-h1 { font-size: 24px; font-weight: 800; color: var(--lc-text); margin: 0 0 2px; }
  .lc-subtitle { font-size: 13px; color: var(--lc-muted); margin: 0; }

  /* ── Stats ── */
  .lc-stats { display: flex; gap: 12px; flex-wrap: wrap; }

  .lc-stat {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 18px; border-radius: 14px;
    background: var(--lc-bg); border: 1px solid var(--lc-border);
    box-shadow: var(--lc-shadow);
  }

  .lc-stat-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-stat-val { font-size: 18px; font-weight: 800; line-height: 1; margin-bottom: 2px; }
  .lc-stat-lbl { font-size: 10px; font-weight: 600; color: var(--lc-muted); text-transform: uppercase; letter-spacing: 0.06em; }

  /* ── Panel card ── */
  .lc-panel {
    background: var(--lc-card);
    border: 1px solid var(--lc-border);
    border-radius: var(--lc-radius);
    box-shadow: var(--lc-shadow);
    overflow: hidden;
  }

  .lc-panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 24px;
    background: rgba(248,113,113,0.06);
    border-bottom: 1px solid var(--lc-border);
  }

  .lc-panel-head-left { display: flex; align-items: center; gap: 12px; }

  .lc-panel-icon {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--lc-danger); flex-shrink: 0;
  }

  .lc-panel-title { font-size: 14px; font-weight: 700; color: var(--lc-text); margin: 0 0 2px; }
  .lc-panel-sub   { font-size: 11px; color: var(--lc-muted); margin: 0; }

  .lc-collapse-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 10px; border: 1px solid var(--lc-border);
    background: var(--lc-bg); color: var(--lc-muted);
    font-family: 'Poppins', sans-serif;
    font-size: 11px; font-weight: 700;
    cursor: pointer; transition: border-color 0.2s, color 0.2s;
  }

  .lc-collapse-btn:hover { border-color: rgba(248,113,113,0.30); color: var(--lc-danger); }

  /* ── Body ── */
  .lc-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }

  /* ── Empty ── */
  .lc-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 20px; gap: 10px;
    color: var(--lc-muted); font-size: 13px; font-weight: 500; text-align: center;
  }

  .lc-empty-icon { opacity: 0.35; margin-bottom: 4px; }
  .lc-empty-sub  { font-size: 12px; color: var(--lc-muted); margin: 0; }

  /* ── Session item ── */
  .lc-session {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 16px; border-radius: 14px;
    border-left: 3px solid transparent;
    border-top: 1px solid var(--lc-border);
    border-right: 1px solid var(--lc-border);
    border-bottom: 1px solid var(--lc-border);
    cursor: pointer; transition: all 0.18s;
    background: var(--lc-bg);
    position: relative; overflow: hidden;
  }

  .lc-session:hover { border-color: rgba(34,211,238,0.25); background: rgba(34,211,238,0.03); }

  .lc-session.selected-normal {
    border-left-color: var(--lc-accent1);
    background: rgba(34,211,238,0.05);
    border-top-color: rgba(34,211,238,0.20);
    border-right-color: rgba(34,211,238,0.20);
    border-bottom-color: rgba(34,211,238,0.20);
  }

  .lc-session.is-live {
    border-left-color: var(--lc-danger);
    background: rgba(248,113,113,0.04);
    border-top-color: rgba(248,113,113,0.12);
    border-right-color: rgba(248,113,113,0.12);
    border-bottom-color: rgba(248,113,113,0.12);
  }

  .lc-session.selected-live {
    border-color: rgba(248,113,113,0.35);
    background: rgba(248,113,113,0.07);
  }

  .lc-session-icon {
    width: 40px; height: 40px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .lc-session-info { flex: 1; min-width: 0; }

  .lc-session-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }

  .lc-session-title { font-size: 13px; font-weight: 700; color: var(--lc-text); margin: 0; }

  .lc-live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 8px; border-radius: 6px;
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--lc-danger);
    font-size: 10px; font-weight: 800; letter-spacing: 0.06em;
  }

  .lc-blink { width: 5px; height: 5px; border-radius: 50%; background: var(--lc-danger); animation: lc-blink 1s infinite; }
  @keyframes lc-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

  .lc-session-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

  .lc-session-meta-item {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: var(--lc-muted);
  }

  .lc-check {
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Join button ── */
  .lc-join-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 14px 24px; border-radius: 14px; border: none;
    background: var(--lc-danger); color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(248,113,113,0.30);
    transition: opacity 0.2s, transform 0.2s;
  }

  .lc-join-btn:hover { opacity: 0.87; transform: translateY(-1px); }
  .lc-join-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .lc-join-dot { width: 8px; height: 8px; border-radius: 50%; background: white; animation: lc-blink 1s infinite; }

  @keyframes lc-spin { to { transform: rotate(360deg); } }
`;

if (!document.getElementById("lc-styles")) {
  const tag = document.createElement("style");
  tag.id = "lc-styles";
  tag.textContent = styles;
  document.head.appendChild(tag);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const LiveClasses = () => {
  const [sessions, setSessions]   = useState([]);
  const [selected, setSelected]   = useState(null);
  const [token, setToken]         = useState(null);
  const [room, setRoom]           = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [joining, setJoining]     = useState(false);
  const [dark, setDark]           = useState(isDark);

  useEffect(() => {
    const loadLive = async () => {
      try {
        const response  = await getStudentClassroom();
        const classroom = response.data;
        const batchId   = classroom.batchId;
        if (!batchId) { console.warn("No batch assigned"); return; }
        const res = await getLiveSessionsByBatch(batchId);
        setSessions(res.data || []);
      } catch (err) { console.error("Live fetch failed", err); }
    };
    loadLive();
  }, []);

  useEffect(() => {
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const handleJoin = async () => {
    try {
      if (!selected) return;
      setJoining(true);
      const studentId = 1;
      const res = await joinLiveSession(selected.id, studentId);
      setToken(res.data.token);
      setRoom(res.data.room);
    } catch (err) { console.error("Join failed", err); }
    finally { setJoining(false); }
  };

  if (token) return <LiveRoom token={token} roomName={room} />;

  const liveCount     = sessions.filter((s) => s.isLive || s.status === "LIVE").length;
  const upcomingCount = sessions.filter((s) => !s.isLive && s.status !== "LIVE").length;

  const statCards = [
    { icon: <Radio size={16} />,      value: sessions.length, label: "Total",    accent: "var(--lc-accent1)", bg: "rgba(34,211,238,0.10)" },
    { icon: <TrendingUp size={16} />, value: liveCount,       label: "Live Now", accent: "var(--lc-danger)",  bg: "rgba(248,113,113,0.10)" },
    { icon: <Clock size={16} />,      value: upcomingCount,   label: "Upcoming", accent: "var(--lc-accent2)", bg: "rgba(251,146,60,0.10)" },
  ];

  return (
    <div className={`lc-root${dark ? " lc-dark" : ""}`}>
      <div className="lc-inner">

        {/* ── Header ── */}
        <div className="lc-header">
          <div className="lc-header-left">
            <div className="lc-header-icon"><Radio size={24} /></div>
            <div>
              <div className="lc-badge"><Radio size={10} /> Live & Recorded</div>
              <h1 className="lc-h1">Live Classes</h1>
              <p className="lc-subtitle">Join your trainer's live sessions in real-time</p>
            </div>
          </div>

          <div className="lc-stats">
            {statCards.map((s, i) => (
              <div key={i} className="lc-stat">
                <div className="lc-stat-icon" style={{ background: s.bg, color: s.accent }}>{s.icon}</div>
                <div>
                  <div className="lc-stat-val" style={{ color: s.accent }}>{s.value}</div>
                  <div className="lc-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel ── */}
        <div className="lc-panel">
          <div className="lc-panel-head">
            <div className="lc-panel-head-left">
              <div className="lc-panel-icon"><Radio size={18} /></div>
              <div>
                <p className="lc-panel-title">Live Classes</p>
                <p className="lc-panel-sub">
                  {sessions.length > 0
                    ? `${sessions.length} session${sessions.length !== 1 ? "s" : ""} available${liveCount > 0 ? ` · ${liveCount} live now` : ""}`
                    : "Loading sessions..."}
                </p>
              </div>
            </div>

            <button className="lc-collapse-btn" onClick={() => setCollapsed(c => !c)}>
              {collapsed
                ? <><ChevronDown size={13} /> Show</>
                : <><ChevronUp size={13} /> Hide</>
              }
            </button>
          </div>

          {!collapsed && (
            <div className="lc-body">
              {sessions.length === 0 && (
                <div className="lc-empty">
                  <div className="lc-empty-icon"><Wifi size={40} /></div>
                  No live sessions available
                  <p className="lc-empty-sub">Check back later or refresh the page</p>
                </div>
              )}

              {sessions.map((s) => {
                const isLive     = s.isLive || s.status === "LIVE";
                const isSelected = selected?.id === s.id;
                let cls = "lc-session";
                if (isLive && isSelected) cls += " selected-live";
                else if (isSelected)      cls += " selected-normal";
                else if (isLive)          cls += " is-live";

                return (
                  <div key={s.id} className={cls} onClick={() => setSelected(s)}>
                    <div
                      className="lc-session-icon"
                      style={{
                        background: isLive ? "rgba(248,113,113,0.12)" : "rgba(34,211,238,0.10)",
                        color: isLive ? "var(--lc-danger)" : "var(--lc-accent1)",
                        border: `1px solid ${isLive ? "rgba(248,113,113,0.18)" : "rgba(34,211,238,0.15)"}`,
                      }}
                    >
                      <Radio size={17} style={isLive ? { animation: "lc-blink 1.5s infinite" } : {}} />
                    </div>

                    <div className="lc-session-info">
                      <div className="lc-session-title-row">
                        <span
                          className="lc-session-title"
                          style={isSelected ? { color: isLive ? "var(--lc-danger)" : "var(--lc-accent1)" } : {}}
                        >
                          {s.title}
                        </span>
                        {isLive && (
                          <span className="lc-live-badge">
                            <span className="lc-blink" />
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="lc-session-meta">
                        {s.date && <span className="lc-session-meta-item"><Calendar size={11} />{s.date}</span>}
                        {s.time && <span className="lc-session-meta-item"><Clock size={11} />{s.time}</span>}
                        {s.viewers != null && <span className="lc-session-meta-item"><Users size={11} />{s.viewers} watching</span>}
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="lc-check"
                        style={{ background: isLive ? "var(--lc-danger)" : "var(--lc-accent1)" }}
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}

              {selected && (
                <button className="lc-join-btn" onClick={handleJoin} disabled={joining}>
                  {joining ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "lc-spin 0.8s linear infinite" }}>
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      <span className="lc-join-dot" />
                      Join Live Session — {selected.title}
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LiveClasses;