
// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { joinCall } from "@/services/liveSessionService";
// import { Client } from "@stomp/stompjs";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// const getTrainerEmail = () => {
//   try {
//     const lmsUser = localStorage.getItem("lms_user");
//     if (lmsUser) {
//       const parsed = JSON.parse(lmsUser);
//       if (parsed.email) return parsed.email;
//     }
//   } catch {}
//   return null;
// };

// const TrainerJoinCall = () => {
//   const [room, setRoom] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [trainerEmail, setTrainerEmail] = useState(null);
//   const navigate = useNavigate();
//   const stompClientRef = useRef(null);

//   useEffect(() => {
//     const email = getTrainerEmail();
//     if (!email) {
//       console.error(
//         "No trainer email found. localStorage:",
//         Object.keys(localStorage),
//       );
//       return;
//     }

//     console.log("✅ Trainer email:", email);
//     setTrainerEmail(email);

//     const wsUrl = API_BASE_URL.replace("http", "ws") + "/live-chat";
//     console.log("Connecting to WebSocket:", wsUrl);

//     const client = new Client({
//       brokerURL: wsUrl,
//       reconnectDelay: 5000,
//       onConnect: () => {
//         console.log("✅ WebSocket connected");
//         setConnected(true);
//         client.subscribe(`/topic/calls/${email}`, (msg) => {
//           console.log("📞 Incoming call, room:", msg.body);
//           setRoom(msg.body);
//         });
//       },
//       onDisconnect: () => setConnected(false),
//       onStompError: (frame) => console.error("STOMP error:", frame),
//     });

//     client.activate();
//     stompClientRef.current = client;
//     return () => client.deactivate();
//   }, []);

//   const handleJoin = async () => {
//     try {
//       if (!room) return alert("No incoming call");
//       const res = await joinCall(room);
//       const { token } = res.data;
//       if (!token) return alert("Invalid token from server");

//       // ✅ Save to sessionStorage BEFORE navigating (state can be lost in nested routes)
//       sessionStorage.setItem("call_state", JSON.stringify({ room, token }));

//       navigate("/trainer/call-room", { state: { room, token } });
//     } catch (err) {
//       console.error("Join failed:", err);
//       alert("Failed to join call.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <h2 className="text-3xl font-bold mb-2">📞 Incoming Call</h2>

//       <p
//         className={`text-sm mb-6 ${connected ? "text-green-400" : "text-red-400"}`}
//       >
//         {connected
//           ? `🟢 Listening as ${trainerEmail}`
//           : trainerEmail
//             ? "🔴 Connecting to server..."
//             : "🔴 Email not found in storage"}
//       </p>

//       {room ? (
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-4xl shadow-lg">
//             📲
//           </div>
//           <p className="text-green-400 text-lg font-semibold">
//             Student is calling!
//           </p>
//           <p className="text-gray-400 text-sm">Room: {room}</p>
//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={handleJoin}
//               className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
//             >
//               ✅ Accept
//             </button>
//             <button
//               onClick={() => setRoom(null)}
//               className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
//             >
//               ❌ Decline
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center gap-3 text-gray-400">
//           <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
//             📵
//           </div>
//           <p>Waiting for incoming calls...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerJoinCall;




























import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { joinCall } from "@/services/liveSessionService";
import { Client } from "@stomp/stompjs";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const getTrainerEmail = () => {
  try {
    const lmsUser = localStorage.getItem("lms_user");
    if (lmsUser) {
      const parsed = JSON.parse(lmsUser);
      if (parsed.email) return parsed.email;
    }
  } catch {}
  return null;
};

const TrainerJoinCall = () => {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const navigate = useNavigate();
  const stompClientRef = useRef(null);
  const audioRef = useRef(null);

  // Listen for theme changes from the LMS sidebar toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) return;
    setTrainerEmail(email);

    const wsUrl = API_BASE_URL.replace("http", "ws") + "/live-chat";
    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/calls/${email}`, (msg) => {
          setRoom(msg.body);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    client.activate();
    stompClientRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token from server");
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) {
      console.error("Join failed:", err);
      alert("Failed to join call.");
    }
  };

  const t = isDark ? dark : light;

  return (
    <div style={t.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:wght@300;400;500&display=swap');

        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.7; }
          70%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes pulse-ring-2 {
          0%   { transform: scale(0.95); opacity: 0.5; }
          70%  { transform: scale(1.6);  opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes float-in {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes status-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes scanner {
          0%   { top: 0; opacity: 0.7; }
          50%  { opacity: 1; }
          100% { top: 100%; opacity: 0.7; }
        }
        @keyframes shimmer-slide {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes wave-in {
          from { clip-path: circle(0% at 50% 100%); }
          to   { clip-path: circle(150% at 50% 100%); }
        }
        @keyframes tick-spin {
          0%   { transform: rotate(0deg) scale(0); opacity: 0; }
          60%  { transform: rotate(380deg) scale(1.15); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Ambient background orbs */}
      <div style={t.orb1} />
      <div style={t.orb2} />

      <div style={t.card}>
        {/* Header strip */}
        <div style={t.headerStrip}>
          <div style={t.logoMark}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect width="18" height="18" rx="5" fill={isDark ? "#6366f1" : "#4f46e5"}/>
              <path d="M5 9h8M9 5v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={t.headerTitle}>TRAINER CONSOLE</span>
          <div style={t.statusPill}>
            <span style={{
              ...t.statusDot,
              animation: connected ? "status-dot 2s ease-in-out infinite" : "none",
              background: connected ? "#22c55e" : "#ef4444"
            }} />
            <span style={t.statusText}>{connected ? "LIVE" : "OFFLINE"}</span>
          </div>
        </div>

        {/* Main content */}
        {room ? (
          /* ── INCOMING CALL STATE ── */
          <div style={t.callContainer}>
            <div style={t.avatarWrap}>
              {/* Pulsing rings */}
              <div style={{ ...t.pulseRing, animation: "pulse-ring 2s ease-out infinite" }} />
              <div style={{ ...t.pulseRing, animation: "pulse-ring-2 2s ease-out infinite 0.4s" }} />
              <div style={t.avatarOuter}>
                <div style={t.avatarInner}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" />
                    <ellipse cx="22" cy="38" rx="15" ry="9" fill="rgba(255,255,255,0.9)" />
                  </svg>
                </div>
              </div>
            </div>

            <div style={t.callInfo}>
              <p style={t.callLabel}>INCOMING CALL</p>
              <h2 style={t.callTitle}>Student</h2>
              <p style={t.callRoom}>Room · {room}</p>
            </div>

            <div style={t.actionRow}>
              <button
                style={t.declineBtn}
                onClick={() => setRoom(null)}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                <span style={t.btnSubLabel}>Decline</span>
              </button>

              <button
                style={t.acceptBtn}
                onClick={handleJoin}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <span style={t.btnSubLabel}>Accept</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── WAITING STATE ── */
          <div style={t.waitingContainer}>
            {/* Animated radar */}
            <div style={t.radarWrap}>
              <div style={t.radarOuter}>
                <div style={t.radarMiddle}>
                  <div style={t.radarInner}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#a5b4fc" : "#6366f1"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div style={t.waitingTextBlock}>
              <h3 style={t.waitingTitle}>Waiting for calls</h3>
              <p style={t.waitingSubtitle}>
                {connected
                  ? `Listening as ${trainerEmail ?? "trainer"}`
                  : trainerEmail
                    ? "Connecting to server…"
                    : "Email not found in storage"}
              </p>
            </div>

            {/* Divider with dots */}
            <div style={t.dotRow}>
              {[0,1,2,3,4].map(i => (
                <div key={i} style={{
                  ...t.dot,
                  animationDelay: `${i * 0.18}s`,
                  animation: "status-dot 1.4s ease-in-out infinite",
                  background: connected
                    ? (isDark ? "#6366f1" : "#4f46e5")
                    : (isDark ? "#374151" : "#d1d5db")
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={t.footer}>
          <span style={t.footerText}>
            {room ? "Respond within 30s · call will auto-dismiss" : "Auto-rings when student dials in"}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── DARK THEME ──────────────────────────────────────────────────── */
const dark = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#080b14",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%)",
    top: "-200px",
    right: "-150px",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 65%)",
    bottom: "-180px",
    left: "-100px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: 420,
    background: "rgba(15,20,35,0.85)",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
    animation: "float-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
  },
  headerStrip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "18px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.02)",
  },
  logoMark: { display: "flex", alignItems: "center" },
  headerTitle: {
    flex: 1,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "rgba(255,255,255,0.4)",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "4px 10px",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  statusText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.5)",
  },

  /* WAITING */
  waitingContainer: {
    padding: "48px 40px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  },
  radarWrap: { position: "relative" },
  radarOuter: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "1.5px solid rgba(99,102,241,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "status-dot 3s ease-in-out infinite",
  },
  radarMiddle: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    border: "1.5px solid rgba(99,102,241,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radarInner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(99,102,241,0.12)",
    border: "1.5px solid rgba(99,102,241,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  waitingTextBlock: { textAlign: "center" },
  waitingTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: "rgba(255,255,255,0.9)",
    margin: "0 0 8px",
    letterSpacing: "-0.03em",
  },
  waitingSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    margin: 0,
    fontWeight: 300,
  },
  dotRow: { display: "flex", gap: 8, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: "50%" },

  /* CALL */
  callContainer: {
    padding: "44px 40px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
  },
  avatarWrap: {
    position: "relative",
    width: 120,
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid rgba(99,102,241,0.6)",
  },
  avatarOuter: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #312e81 0%, #6366f1 100%)",
    padding: 3,
    zIndex: 2,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4338ca 0%, #818cf8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  callInfo: { textAlign: "center" },
  callLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.22em",
    color: "rgba(255,255,255,0.3)",
    margin: "0 0 8px",
    animation: "status-dot 2s ease-in-out infinite",
  },
  callTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.04em",
  },
  callRoom: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    margin: 0,
    fontWeight: 300,
  },
  actionRow: {
    display: "flex",
    gap: 24,
  },
  declineBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxShadow: "0 8px 32px rgba(239,68,68,0.4)",
    transition: "transform 0.2s ease",
  },
  acceptBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #14532d, #22c55e)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxShadow: "0 8px 32px rgba(34,197,94,0.45)",
    transition: "transform 0.2s ease",
  },
  btnSubLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.1em",
    fontFamily: "'Syne', sans-serif",
  },
  footer: {
    padding: "14px 24px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
    textAlign: "center",
  },
  footerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    fontWeight: 300,
    letterSpacing: "0.02em",
  },
};

/* ─── LIGHT THEME ─────────────────────────────────────────────────── */
const light = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f4f9",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
    top: "-260px",
    right: "-200px",
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 65%)",
    bottom: "-200px",
    left: "-100px",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: 420,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(32px)",
    WebkitBackdropFilter: "blur(32px)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 24px 64px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04)",
    animation: "float-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
  },
  headerStrip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "18px 24px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    background: "rgba(0,0,0,0.01)",
  },
  logoMark: { display: "flex", alignItems: "center" },
  headerTitle: {
    flex: 1,
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "rgba(0,0,0,0.35)",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 20,
    padding: "4px 10px",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    display: "inline-block",
  },
  statusText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "rgba(0,0,0,0.4)",
  },

  waitingContainer: {
    padding: "48px 40px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  },
  radarWrap: { position: "relative" },
  radarOuter: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "1.5px solid rgba(79,70,229,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "status-dot 3s ease-in-out infinite",
  },
  radarMiddle: {
    width: 88,
    height: 88,
    borderRadius: "50%",
    border: "1.5px solid rgba(79,70,229,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  radarInner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(79,70,229,0.07)",
    border: "1.5px solid rgba(79,70,229,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  waitingTextBlock: { textAlign: "center" },
  waitingTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#1e1b4b",
    margin: "0 0 8px",
    letterSpacing: "-0.03em",
  },
  waitingSubtitle: {
    fontSize: 13,
    color: "rgba(0,0,0,0.38)",
    margin: 0,
    fontWeight: 300,
  },
  dotRow: { display: "flex", gap: 8, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: "50%" },

  callContainer: {
    padding: "44px 40px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
  },
  avatarWrap: {
    position: "relative",
    width: 120,
    height: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid rgba(79,70,229,0.5)",
  },
  avatarOuter: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c7d2fe 0%, #6366f1 100%)",
    padding: 3,
    zIndex: 2,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4338ca 0%, #818cf8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  callInfo: { textAlign: "center" },
  callLabel: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.22em",
    color: "rgba(0,0,0,0.3)",
    margin: "0 0 8px",
    animation: "status-dot 2s ease-in-out infinite",
  },
  callTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 32,
    fontWeight: 800,
    color: "#1e1b4b",
    margin: "0 0 6px",
    letterSpacing: "-0.04em",
  },
  callRoom: {
    fontSize: 12,
    color: "rgba(0,0,0,0.3)",
    margin: 0,
    fontWeight: 300,
  },
  actionRow: {
    display: "flex",
    gap: 24,
  },
  declineBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #fee2e2, #ef4444)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxShadow: "0 8px 28px rgba(239,68,68,0.3)",
    transition: "transform 0.2s ease",
  },
  acceptBtn: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dcfce7, #22c55e)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
    transition: "transform 0.2s ease",
  },
  btnSubLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: "0.1em",
    fontFamily: "'Syne', sans-serif",
  },
  footer: {
    padding: "14px 24px",
    borderTop: "1px solid rgba(0,0,0,0.04)",
    textAlign: "center",
  },
  footerText: {
    fontSize: 11,
    color: "rgba(0,0,0,0.25)",
    fontWeight: 300,
    letterSpacing: "0.02em",
  },
};

export default TrainerJoinCall;