

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
  const [callStatus, setCallStatus] = useState("idle"); // idle | ringing | connected | failed
  const [ripple, setRipple] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

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
    setRipple(true);

    try {
      const trainerEmail = "trainer1@gmail.com";
      const res = await startCall(trainerEmail);

      if (!res || !res.data) {
        setCallStatus("failed");
        setCalling(false);
        return;
      }

      const { room, token } = res.data;
      if (!room || !token) {
        setCallStatus("failed");
        setCalling(false);
        return;
      }

      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/student/call-room", { state: { room, token } });
    } catch (err) {
      console.error("CALL ERROR:", err);
      setCallStatus("failed");
      setCalling(false);
      setRipple(false);
    }
  };

  const handleCancel = () => {
    setCalling(false);
    setCallStatus("idle");
    setRipple(false);
  };

  return (
    <div style={styles.page}>
      {/* Animated background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Noise overlay */}
      <div style={styles.noise} />

      <div style={styles.card}>
        {/* Top label */}
        <p style={styles.topLabel}>
          {callStatus === "idle" && "DIRECT CALL"}
          {callStatus === "ringing" && "CALLING..."}
          {callStatus === "failed" && "CALL FAILED"}
        </p>

        {/* Avatar zone */}
        <div style={styles.avatarZone}>
          {/* Ripple rings — only when ringing */}
          {ripple && (
            <>
              <div style={{ ...styles.ring, ...styles.ring1 }} />
              <div style={{ ...styles.ring, ...styles.ring2 }} />
              <div style={{ ...styles.ring, ...styles.ring3 }} />
            </>
          )}

          {/* Avatar */}
          <div style={styles.avatar}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="20" r="11" fill="#e2d9f3" />
              <ellipse cx="26" cy="42" rx="18" ry="11" fill="#e2d9f3" />
            </svg>
          </div>
        </div>

        {/* Trainer info */}
        <div style={styles.infoBlock}>
          <h2 style={styles.trainerName}>Your Trainer</h2>
          <p style={styles.trainerEmail}>trainer1@gmail.com</p>
          {callStatus === "ringing" && (
            <p style={styles.timer}>{formatTime(time)}</p>
          )}
          {callStatus === "failed" && (
            <p style={styles.failedText}>Connection failed. Try again.</p>
          )}
        </div>

        {/* Call controls */}
        <div style={styles.controls}>
          {callStatus === "idle" || callStatus === "failed" ? (
            <button
              onClick={handleCall}
              style={styles.callBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(52,211,153,0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(52,211,153,0.35)";
              }}
            >
              <PhoneIcon />
            </button>
          ) : (
            <button
              onClick={handleCancel}
              style={styles.endBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <EndIcon />
            </button>
          )}
        </div>

        {/* Label under button */}
        <p style={styles.btnLabel}>
          {callStatus === "idle" && "Tap to call"}
          {callStatus === "ringing" && "Tap to cancel"}
          {callStatus === "failed" && "Tap to retry"}
        </p>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const EndIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 013.09 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f0c1a",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%)",
    top: "-100px",
    left: "-120px",
    animation: "blobFloat 8s ease-in-out infinite",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
    bottom: "-80px",
    right: "-80px",
    animation: "blobFloat 10s ease-in-out infinite reverse",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)",
    top: "40%",
    right: "10%",
    animation: "blobFloat 12s ease-in-out infinite",
    pointerEvents: "none",
  },
  noise: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    opacity: 0.4,
  },
  card: {
    position: "relative",
    zIndex: 10,
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 32,
    padding: "56px 48px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 0,
    minWidth: 340,
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    animation: "fadeSlideUp 0.6s ease both",
  },
  topLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    fontSize: 11,
    letterSpacing: "0.22em",
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    marginBottom: 40,
    margin: "0 0 40px 0",
  },
  avatarZone: {
    position: "relative",
    width: 110,
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ring: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "2px solid rgba(52,211,153,0.45)",
    animation: "ripple 2s ease-out infinite",
  },
  ring1: { animationDelay: "0s" },
  ring2: { animationDelay: "0.6s" },
  ring3: { animationDelay: "1.2s" },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #5b21b6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(109,40,217,0.5)",
    zIndex: 2,
    position: "relative",
  },
  infoBlock: {
    textAlign: "center",
    marginBottom: 44,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  trainerName: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 28,
    fontWeight: 400,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  trainerEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    margin: 0,
    fontWeight: 300,
  },
  timer: {
    fontSize: 22,
    color: "#34d399",
    fontWeight: 500,
    margin: "8px 0 0",
    fontVariantNumeric: "tabular-nums",
    animation: "pulse 2s ease-in-out infinite",
  },
  failedText: {
    fontSize: 13,
    color: "#f87171",
    margin: "6px 0 0",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
  },
  callBtn: {
    width: 76,
    height: 76,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #059669, #34d399)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 24px rgba(52,211,153,0.35)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  endBtn: {
    width: 76,
    height: 76,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #dc2626, #ef4444)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 24px rgba(239,68,68,0.4)",
    transition: "transform 0.2s ease",
  },
  btnLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.25)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    margin: 0,
  },
};

export default CallTrainer;