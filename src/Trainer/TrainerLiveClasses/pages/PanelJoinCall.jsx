import { useState, useEffect, useRef } from "react";
import { Phone } from "lucide-react";
import { Client } from "@stomp/stompjs";
import { joinCall } from "@/services/liveSessionService";
import { wsUrl, FONT_FAMILY, FONT_WEIGHT } from "../data/theme";
import { getTrainerEmail } from "../data/utils";
import CallActionBtn from "../components/CallActionBtn";

export default function PanelJoinCall({ t, isDark, navigate }) {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setEmail] = useState(null);
  const stompRef = useRef(null);

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) return;
    setEmail(email);
    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/calls/${email}`, (msg) => setRoom(msg.body));
      },
      onDisconnect: () => setConnected(false),
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token");
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) {
      console.error(err);
      alert("Failed to join call.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 32,
        padding: "32px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: t.actBg,
            border: `1px solid ${t.actBorder}`,
            borderRadius: 12,
            padding: "8px 16px",
            fontSize: 11,
            fontWeight: FONT_WEIGHT.semibold,
            fontFamily: FONT_FAMILY,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: connected ? t.liveText : t.textMuted,
              fontWeight: FONT_WEIGHT.bold,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: connected ? t.liveColor : t.textMuted,
                display: "inline-block",
                animation: connected
                  ? "liveDot 1.2s ease-in-out infinite"
                  : "none",
              }}
            />
            {connected ? "Connected" : "Offline"}
          </span>
        </div>
        <div
          className="livebadge"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: isDark
              ? "rgba(34,197,94,0.08)"
              : "rgba(22,163,74,0.08)",
            border: isDark
              ? "1px solid rgba(34,197,94,0.3)"
              : "1px solid rgba(22,163,74,0.3)",
            borderRadius: 999,
            padding: "8px 18px",
            color: t.liveText,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            letterSpacing: "0.1em",
            fontFamily: FONT_FAMILY,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: t.liveColor,
              display: "inline-block",
            }}
          />
          LIVE
        </div>
      </div>
      {room ? (
        <>
          <div
            style={{
              position: "relative",
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.5)",
                animation: "callPulse 2s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2px solid rgba(99,102,241,0.3)",
                animation: "callPulse2 2s ease-out infinite 0.4s",
              }}
            />
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#4338ca,#818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="17" r="9" fill="rgba(255,255,255,0.9)" />
                <ellipse
                  cx="22"
                  cy="38"
                  rx="15"
                  ry="9"
                  fill="rgba(255,255,255,0.9)"
                />
              </svg>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 9,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                margin: "0 0 8px",
              }}
            >
              INCOMING CALL
            </p>
            <h2
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 32,
                fontWeight: FONT_WEIGHT.black,
                color: t.text,
                margin: "0 0 6px",
                letterSpacing: "-0.04em",
              }}
            >
              Student
            </h2>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                margin: 0,
                fontFamily: FONT_FAMILY,
              }}
            >
              Room · {room}
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <CallActionBtn type="decline" onClick={() => setRoom(null)} />
            <CallActionBtn type="accept" onClick={handleJoin} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "1.5px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "radarPulse 3s ease-in-out infinite",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                border: "1.5px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: isDark
                    ? "rgba(99,102,241,0.12)"
                    : "rgba(79,70,229,0.07)",
                  border: "1.5px solid rgba(99,102,241,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Phone size={22} color={isDark ? "#a5b4fc" : "#6366f1"} />
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 26,
                fontWeight: FONT_WEIGHT.black,
                color: t.text,
                margin: "0 0 8px",
              }}
            >
              Waiting for calls
            </h3>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                margin: 0,
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.medium,
              }}
            >
              {connected
                ? `Listening as ${trainerEmail ?? "trainer"}`
                : trainerEmail
                  ? "Connecting…"
                  : "Email not found"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: connected
                    ? isDark
                      ? "#6366f1"
                      : "#4f46e5"
                    : isDark
                      ? "#374151"
                      : "#d1d5db",
                  animation: "liveDot 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
