

// import { startCall } from "@/services/liveSessionService";
// import { useNavigate } from "react-router-dom";

// const CallTrainer = () => {
//   const navigate = useNavigate();

//   const handleCall = async () => {
//     try {
//       console.log("Calling trainer...");

//       const trainerEmail = "trainer1@gmail.com";

//       const res = await startCall(trainerEmail);

//       console.log("API RESPONSE:", res);

//       if (!res || !res.data) {
//         alert("No response from server");
//         return;
//       }

//       const { room, token } = res.data;

//       if (!room || !token) {
//         alert("Invalid response from backend");
//         return;
//       }

//       console.log("Navigating to call room...");

//       // ✅ FIX: PASS STATE HERE
//       navigate("/student/call-room", {
//         state: {
//           room: room,
//           token: token,
//         },
//       });
//     } catch (err) {
//       console.error("CALL ERROR:", err);
//       alert("Call failed. Check backend or token.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h2 className="text-2xl font-semibold mb-6">📞 Call Your Trainer</h2>

//       <button
//         onClick={handleCall}
//         className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg"
//       >
//         Start Call
//       </button>
//     </div>
//   );
// };

// export default CallTrainer;



















import { startCall } from "@/services/liveSessionService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const CallTrainer = () => {
  const navigate = useNavigate();
  const [calling, setCalling] = useState(false);
  const [callStatus, setCallStatus] = useState("idle"); // idle | ringing | failed
  const [time, setTime] = useState(0);
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark") ||
          window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const timerRef = useRef(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (callStatus === "ringing") {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleCall = async () => {
    if (calling) return;
    setCalling(true);
    setCallStatus("ringing");
    try {
      const trainerEmail = "trainer1@gmail.com";
      const res = await startCall(trainerEmail);
      if (!res?.data) { setCallStatus("failed"); setCalling(false); return; }
      const { room, token } = res.data;
      if (!room || !token) { setCallStatus("failed"); setCalling(false); return; }
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/student/call-room", { state: { room, token } });
    } catch (err) {
      console.error("CALL ERROR:", err);
      setCallStatus("failed");
      setCalling(false);
    }
  };

  const handleCancel = () => {
    setCalling(false);
    setCallStatus("idle");
  };

  const t = isDark ? dark : light;
  const isRinging = callStatus === "ringing";
  const isFailed = callStatus === "failed";

  return (
    <div style={t.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        @keyframes float-in {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes avatar-bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes ring-expand {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes ring-expand-2 {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(2.8); opacity: 0;   }
        }
        @keyframes timer-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          40%     { transform: translateX(6px); }
          60%     { transform: translateX(-4px); }
          80%     { transform: translateX(4px); }
        }
        @keyframes spin-in {
          from { transform: rotate(-90deg) scale(0); opacity: 0; }
          to   { transform: rotate(0deg) scale(1);  opacity: 1; }
        }
        @keyframes status-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
      `}</style>

      {/* Decorative background */}
      <div style={t.bg}>
        <div style={t.bgOrb1} />
        <div style={t.bgOrb2} />
        <div style={t.bgGrid} />
      </div>

      <div style={t.card}>
        {/* Top badge */}
        <div style={t.badge}>
          <span style={t.badgeDot} />
          <span style={t.badgeText}>
            {callStatus === "idle"   && "READY TO CONNECT"}
            {callStatus === "ringing" && "CONNECTING · " + formatTime(time)}
            {callStatus === "failed"  && "CONNECTION FAILED"}
          </span>
        </div>

        {/* Avatar section */}
        <div style={t.avatarSection}>
          {/* Rings */}
          {isRinging && (
            <>
              <div style={{ ...t.ring, animation: "ring-expand 2s ease-out infinite 0s" }} />
              <div style={{ ...t.ring, animation: "ring-expand-2 2s ease-out infinite 0.5s" }} />
            </>
          )}

          {/* Avatar circle */}
          <div style={{
            ...t.avatarCircle,
            animation: isRinging ? "avatar-bob 2.2s ease-in-out infinite" : "none",
          }}>
            <div style={t.avatarInner}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="22" r="11" fill="rgba(255,255,255,0.92)" />
                <ellipse cx="28" cy="46" rx="18" ry="11" fill="rgba(255,255,255,0.92)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Name & email */}
        <div style={t.nameBlock}>
          <h1 style={t.trainerName}>Your Trainer</h1>
          <p style={t.trainerEmail}>trainer1@gmail.com</p>
          {isFailed && (
            <p style={{ ...t.trainerEmail, color: "#f87171", marginTop: 4, animation: "shake 0.4s ease" }}>
              Could not connect — try again
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={t.divider} />

        {/* CTA button */}
        <div style={t.ctaSection}>
          {!isRinging ? (
            <button
              onClick={handleCall}
              style={t.callButton}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
                e.currentTarget.style.boxShadow = t.callButtonHoverShadow;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = t.callButtonShadow;
              }}
            >
              <PhoneIcon />
              <span style={t.callBtnLabel}>
                {isFailed ? "Retry Call" : "Start Call"}
              </span>
            </button>
          ) : (
            <div style={t.ringingRow}>
              <div style={t.ringingIndicator}>
                <span style={{ ...t.ringingDot, animationDelay: "0s" }} />
                <span style={{ ...t.ringingDot, animationDelay: "0.2s" }} />
                <span style={{ ...t.ringingDot, animationDelay: "0.4s" }} />
              </div>
              <span style={t.ringingText}>Ringing trainer…</span>
              <button
                onClick={handleCancel}
                style={t.cancelBtn}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <EndIcon />
                <span style={t.callBtnLabel}>End</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom hint */}
        <p style={t.hint}>
          {isRinging ? "Waiting for trainer to accept…" : "Your trainer will be notified instantly"}
        </p>
      </div>
    </div>
  );
};

/* ─── Icons ─────────────────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const EndIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.09 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L7.09 9.91"/>
    <line x1="23" y1="1" x2="1" y2="23"/>
  </svg>
);

/* ─── DARK ────────────────────────────────────────────────────────── */
const dark = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
    background: "#060910",
    overflow: "hidden",
  },
  bg: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 },
  bgOrb1: {
    position: "absolute",
    width: 700,
    height: 700,
    top: "-250px",
    left: "-200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 60%)",
  },
  bgOrb2: {
    position: "absolute",
    width: 500,
    height: 500,
    bottom: "-200px",
    right: "-150px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 60%)",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
    backgroundSize: "48px 48px",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: 400,
    background: "rgba(12,16,28,0.88)",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 32,
    padding: "36px 40px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    boxShadow: "0 48px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07)",
    animation: "float-in 0.55s cubic-bezier(0.22,1,0.36,1) both",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
    padding: "5px 14px",
    marginBottom: 40,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    animation: "status-blink 2s ease-in-out infinite",
  },
  badgeText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "rgba(255,255,255,0.4)",
  },
  avatarSection: {
    position: "relative",
    width: 140,
    height: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid rgba(99,102,241,0.5)",
  },
  avatarCircle: {
    width: 108,
    height: 108,
    borderRadius: "50%",
    background: "linear-gradient(145deg, #1e1b4b 0%, #4c1d95 40%, #7c3aed 100%)",
    padding: 3,
    zIndex: 2,
    boxShadow: "0 16px 48px rgba(99,102,241,0.5)",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #4338ca, #818cf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    textAlign: "center",
    marginBottom: 28,
  },
  trainerName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 34,
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 6px",
    letterSpacing: "-0.04em",
  },
  trainerEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.32)",
    margin: 0,
    fontWeight: 300,
    fontStyle: "italic",
  },
  divider: {
    width: "100%",
    height: 1,
    background: "rgba(255,255,255,0.06)",
    marginBottom: 28,
  },
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  callButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "linear-gradient(135deg, #16a34a, #22c55e)",
    border: "none",
    borderRadius: 50,
    padding: "16px 40px",
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
  },
  callButtonShadow: "0 8px 28px rgba(34,197,94,0.35)",
  callButtonHoverShadow: "0 14px 40px rgba(34,197,94,0.55)",
  callBtnLabel: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.03em",
    color: "#fff",
  },
  ringingRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  ringingIndicator: {
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  ringingDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    animation: "status-blink 1s ease-in-out infinite",
  },
  ringingText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.06em",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
    border: "none",
    borderRadius: 50,
    padding: "13px 32px",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    boxShadow: "0 8px 24px rgba(239,68,68,0.4)",
  },
  hint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.18)",
    margin: 0,
    textAlign: "center",
    fontWeight: 300,
    letterSpacing: "0.03em",
  },
};

/* ─── LIGHT ──────────────────────────────────────────────────────── */
const light = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Instrument Sans', sans-serif",
    position: "relative",
    background: "#eef0f7",
    overflow: "hidden",
  },
  bg: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 },
  bgOrb1: {
    position: "absolute",
    width: 700,
    height: 700,
    top: "-300px",
    left: "-200px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)",
  },
  bgOrb2: {
    position: "absolute",
    width: 500,
    height: 500,
    bottom: "-200px",
    right: "-100px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
    backgroundSize: "48px 48px",
  },
  card: {
    position: "relative",
    zIndex: 10,
    width: 400,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(40px)",
    WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 32,
    padding: "36px 40px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    boxShadow: "0 32px 80px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
    animation: "float-in 0.55s cubic-bezier(0.22,1,0.36,1) both",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: "rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: "5px 14px",
    marginBottom: 40,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
    animation: "status-blink 2s ease-in-out infinite",
  },
  badgeText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "rgba(0,0,0,0.4)",
  },
  avatarSection: {
    position: "relative",
    width: 140,
    height: 140,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ring: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "2px solid rgba(79,70,229,0.45)",
  },
  avatarCircle: {
    width: 108,
    height: 108,
    borderRadius: "50%",
    background: "linear-gradient(145deg, #c7d2fe 0%, #818cf8 50%, #6366f1 100%)",
    padding: 3,
    zIndex: 2,
    boxShadow: "0 16px 48px rgba(99,102,241,0.35)",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(145deg, #4338ca, #818cf8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    textAlign: "center",
    marginBottom: 28,
  },
  trainerName: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 34,
    fontWeight: 800,
    color: "#1e1b4b",
    margin: "0 0 6px",
    letterSpacing: "-0.04em",
  },
  trainerEmail: {
    fontSize: 13,
    color: "rgba(0,0,0,0.35)",
    margin: 0,
    fontWeight: 300,
    fontStyle: "italic",
  },
  divider: {
    width: "100%",
    height: 1,
    background: "rgba(0,0,0,0.06)",
    marginBottom: 28,
  },
  ctaSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  callButton: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "linear-gradient(135deg, #15803d, #22c55e)",
    border: "none",
    borderRadius: 50,
    padding: "16px 40px",
    cursor: "pointer",
    transition: "transform 0.22s ease, box-shadow 0.22s ease",
    boxShadow: "0 8px 28px rgba(34,197,94,0.35)",
  },
  callButtonShadow: "0 8px 28px rgba(34,197,94,0.35)",
  callButtonHoverShadow: "0 14px 40px rgba(34,197,94,0.5)",
  callBtnLabel: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: "0.03em",
    color: "#fff",
  },
  ringingRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  ringingIndicator: {
    display: "flex",
    gap: 6,
    alignItems: "center",
  },
  ringingDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#16a34a",
    animation: "status-blink 1s ease-in-out infinite",
  },
  ringingText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(0,0,0,0.38)",
    letterSpacing: "0.06em",
  },
  cancelBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
    border: "none",
    borderRadius: 50,
    padding: "13px 32px",
    cursor: "pointer",
    transition: "opacity 0.2s ease",
    boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
  },
  hint: {
    fontSize: 11,
    color: "rgba(0,0,0,0.22)",
    margin: 0,
    textAlign: "center",
    fontWeight: 300,
    letterSpacing: "0.03em",
  },
};

export default CallTrainer;