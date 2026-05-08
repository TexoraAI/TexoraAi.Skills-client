import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import {
  startLiveSessionWithToken,
  endLiveSession,
  getSessionParticipants,
} from "@/services/liveSessionService";
import {
  FaPhoneSlash,
  FaTimes,
  FaDotCircle,
  FaUsers,
  FaPaperPlane,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
} from "react-icons/fa";

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const attachTrack = (track, container) => {
  if (!container || !track) return;
  const el = track.attach();
  if (track.kind === Track.Kind.Video) {
    Object.assign(el.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    });
  }
  container.appendChild(el);
};

/* ─── Live Timer ─── */
const useLiveTimer = (running) => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

/* ═════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════ */
const LiveSessionControls = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const roomRef = useRef(null);
  const remoteGridRef = useRef(null);
  const localPreviewRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const screenTrackRef = useRef(null);
  const chatEndRef = useRef(null);
  const autoEndPollRef = useRef(null);
  // ✅ NEW: ref for participant DB polling interval
  const participantPollRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [recording, setRecording] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("chat");
  const [participants, setParticipants] = useState([]);
  // ✅ NEW: DB participants (real emails from backend)
  const [dbParticipants, setDbParticipants] = useState([]);
  const [messages, setMessages] = useState(() => [
    {
      id: 0,
      user: "System",
      text: "Session started. Welcome!",
      time: getTime(),
      system: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionTitle, setSessionTitle] = useState(`Session ${id}`);
  const [autoEndWarning, setAutoEndWarning] = useState(false);

  const timer = useLiveTimer(connected);

  const pushSystem = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "System", text, time: getTime(), system: true },
    ]);
  }, []);

  const refreshParticipants = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    const list = [
      {
        id: room.localParticipant.identity,
        name: room.localParticipant.name || "You (Trainer)",
        self: true,
        isHost: true,
      },
    ];
    room.remoteParticipants.forEach((p) =>
      list.push({
        id: p.identity,
        name: p.name || p.identity,
        self: false,
        isHost: false,
      }),
    );
    setParticipants(list);
  }, []);

  // ✅ NEW: fetch real participants from DB
  const fetchDbParticipants = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getSessionParticipants(id);
      setDbParticipants(res.data || []);
    } catch (_) {
      // silently ignore
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

    const start = async () => {
      let token;
      let room_name;

      try {
        const saved = sessionStorage.getItem("call_state");
        const saved_parsed = saved ? JSON.parse(saved) : null;

        if (saved_parsed?.token) {
          token = saved_parsed.token;
          room_name = saved_parsed.room;
        } else {
          const res = await startLiveSessionWithToken(id);
          token = res?.data?.token;
          room_name = res?.data?.room;
          setSessionTitle(res?.data?.title || `Session ${id}`);
        }

        if (!token) {
          console.error("No token returned");
          return;
        }
      } catch (err) {
        console.error("startLiveSessionWithToken failed:", err);
        return;
      }

      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      try {
        await room.connect(serverUrl, token);
        sessionStorage.removeItem("call_state");
        setConnected(true);
        refreshParticipants();

        // ✅ NEW: Fetch DB participants immediately on connect, then poll every 5s
        fetchDbParticipants();
        participantPollRef.current = setInterval(fetchDbParticipants, 5000);

        // Auto-end poll every 20s
        const token_for_poll =
          localStorage.getItem("token") ||
          localStorage.getItem("lms_token") ||
          localStorage.getItem("accessToken") ||
          (() => {
            try {
              return JSON.parse(localStorage.getItem("lms_user") || "{}")
                ?.token;
            } catch {
              return null;
            }
          })();

        autoEndPollRef.current = setInterval(async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/api/live-sessions/${id}`,
              {
                headers: token_for_poll
                  ? { Authorization: `Bearer ${token_for_poll}` }
                  : {},
              },
            );
            if (!res.ok) return;
            const data = await res.json();
            if (data.status === "ENDED") {
              clearInterval(autoEndPollRef.current);
              setAutoEndWarning(true);
              setTimeout(() => {
                roomRef.current?.disconnect();
                navigate("/trainer/live");
              }, 3000);
            }
          } catch (_) {
            // silently ignore network errors during poll
          }
        }, 20000);
      } catch (err) {
        console.error("LiveKit connect failed:", err);
        return;
      }

      try {
        const tracks = await createLocalTracks({ audio: true, video: true });
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
          if (track.kind === Track.Kind.Video) {
            localVideoTrackRef.current = track;
            if (localPreviewRef.current) {
              const el = track.attach();
              Object.assign(el.style, {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "scaleX(-1)",
              });
              localPreviewRef.current.innerHTML = "";
              localPreviewRef.current.appendChild(el);
            }
          }
          if (track.kind === Track.Kind.Audio)
            localAudioTrackRef.current = track;
        }
      } catch (err) {
        console.error("createLocalTracks failed:", err);
      }

      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((pub) => {
          if (pub.isSubscribed && pub.track)
            attachTrack(pub.track, remoteGridRef.current);
        });
      });

      room.on(RoomEvent.TrackSubscribed, (track) =>
        attachTrack(track, remoteGridRef.current),
      );
      room.on(RoomEvent.TrackUnsubscribed, (track) =>
        track.detach().forEach((el) => el.remove()),
      );
      room.on(RoomEvent.ParticipantConnected, (p) => {
        refreshParticipants();
        // ✅ NEW: also refresh DB list when someone joins via WebRTC
        fetchDbParticipants();
        pushSystem(`${p.name || p.identity} joined`);
      });
      room.on(RoomEvent.ParticipantDisconnected, (p) => {
        refreshParticipants();
        pushSystem(`${p.name || p.identity} left`);
      });
      room.on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          const decoded = new TextDecoder().decode(payload);
          const msg = JSON.parse(decoded);
          if (msg.text)
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                user: participant?.name || participant?.identity || "Student",
                text: msg.text,
                time: getTime(),
                self: false,
              },
            ]);
        } catch (_) {}
      });
      room.on(RoomEvent.Disconnected, () => setConnected(false));
    };

    start();

    return () => {
      if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
      // ✅ NEW: clear participant poll on unmount
      if (participantPollRef.current) clearInterval(participantPollRef.current);
      roomRef.current?.disconnect();
    };
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) await track.mute();
    else await track.unmute();
    setMicOn((v) => !v);
  }, [micOn]);

  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) {
      await track.mute();
      if (localPreviewRef.current)
        localPreviewRef.current.style.visibility = "hidden";
    } else {
      await track.unmute();
      if (localPreviewRef.current)
        localPreviewRef.current.style.visibility = "visible";
    }
    setCamOn((v) => !v);
  }, [camOn]);

  const restoreCamPip = useCallback(() => {
    if (localVideoTrackRef.current && camOn && localPreviewRef.current) {
      const el = localVideoTrackRef.current.attach();
      Object.assign(el.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        transform: "scaleX(-1)",
      });
      localPreviewRef.current.innerHTML = "";
      localPreviewRef.current.appendChild(el);
      localPreviewRef.current.style.visibility = "visible";
    }
  }, [camOn]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    if (screenOn) {
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch (_) {}
      screenTrackRef.current = null;
      setScreenOn(false);
      restoreCamPip();
    } else {
      try {
        const pub = await room.localParticipant.setScreenShareEnabled(true);
        if (!pub) return;
        const screenTrack = pub.track ?? pub.videoTrack ?? null;
        screenTrackRef.current = screenTrack;
        if (screenTrack && localPreviewRef.current) {
          const el = screenTrack.attach();
          Object.assign(el.style, {
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          });
          localPreviewRef.current.innerHTML = "";
          localPreviewRef.current.appendChild(el);
          localPreviewRef.current.style.visibility = "visible";
        }
        setScreenOn(true);
        const mediaTrack =
          screenTrack?.mediaStreamTrack ?? pub.track?.mediaStreamTrack ?? null;
        if (mediaTrack) {
          mediaTrack.addEventListener(
            "ended",
            () => {
              room.localParticipant
                .setScreenShareEnabled(false)
                .catch(() => {});
              screenTrackRef.current = null;
              setScreenOn(false);
              restoreCamPip();
            },
            { once: true },
          );
        }
      } catch (err) {
        if (err?.name !== "NotAllowedError")
          console.warn("Screen share failed:", err);
      }
    }
  }, [screenOn, restoreCamPip]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "You (Trainer)",
        text,
        time: getTime(),
        self: true,
      },
    ]);
    setInput("");
    try {
      const payload = new TextEncoder().encode(
        JSON.stringify({ text, name: "Trainer" }),
      );
      roomRef.current?.localParticipant?.publishData(payload, {
        reliable: true,
      });
    } catch (e) {
      console.warn("data send failed:", e);
    }
  }, [input]);

  const handleEndSession = useCallback(async () => {
    if (autoEndPollRef.current) clearInterval(autoEndPollRef.current);
    // ✅ NEW: clear participant poll on end session too
    if (participantPollRef.current) clearInterval(participantPollRef.current);
    try {
      await endLiveSession(id);
    } catch (_) {}
    roomRef.current?.disconnect();
    navigate("/trainer/live");
  }, [id, navigate]);

  // ✅ NEW: active students = those who joined but haven't left yet
  const activeDbParticipants = dbParticipants.filter(
    (p) => p.leaveTime === null || p.leaveTime === undefined,
  );

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
        @keyframes recBlink{0%,100%{opacity:1}50%{opacity:.2}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Auto-end warning toast */}
      {autoEndWarning && (
        <div style={S.autoEndToast}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              Session time is up!
            </div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>
              Session was auto-ended by the system. Redirecting...
            </div>
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <div style={S.topBar}>
        <div style={S.topLeft}>
          <div style={S.liveBadge}>
            <span style={S.liveDot} />
            LIVE
          </div>
          <span style={S.timerText}>{timer}</span>
          <span style={S.sessionTitle}>{sessionTitle}</span>
          {recording && (
            <div style={S.recBadge}>
              <FaDotCircle
                size={8}
                style={{ animation: "recBlink 1.5s infinite" }}
              />{" "}
              REC
            </div>
          )}
        </div>

        <div style={S.topRight}>
          <div style={S.pCountBadge}>
            <FaUsers size={11} />
            {/* ✅ UPDATED: show real DB count instead of LiveKit count */}
            <span>{activeDbParticipants.length} Participants</span>
          </div>
          <button
            style={{ ...S.recBtn, ...(recording ? S.recBtnOn : S.recBtnOff) }}
            onClick={() => setRecording((r) => !r)}
          >
            <FaDotCircle size={10} /> {recording ? "Recording" : "Record"}
          </button>
          <button style={S.endBtn} onClick={handleEndSession}>
            <FaPhoneSlash size={12} /> End Session
          </button>
          <button style={S.closeBtn} onClick={() => navigate("/trainer/live")}>
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={S.body}>
        {/* VIDEO AREA */}
        <div style={S.videoArea}>
          {connected ? (
            <>
              <div ref={remoteGridRef} style={S.remoteGrid} />
              <div style={S.pip}>
                <div
                  ref={localPreviewRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    visibility: camOn || screenOn ? "visible" : "hidden",
                  }}
                />
                {!camOn && !screenOn && (
                  <div style={S.pipOff}>
                    <FaVideoSlash size={18} color="#64748b" />
                    <span style={S.pipOffTxt}>Cam Off</span>
                  </div>
                )}
                <span style={S.pipLabel}>
                  You (Trainer){screenOn ? " · Sharing" : ""}
                </span>
              </div>
              <div style={S.ctrlBar}>
                <CtrlBtn
                  icon={micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  label={micOn ? "Mute" : "Unmute"}
                  danger={!micOn}
                  onClick={toggleMic}
                />
                <CtrlBtn
                  icon={camOn ? <FaVideo /> : <FaVideoSlash />}
                  label={camOn ? "Stop Cam" : "Start Cam"}
                  danger={!camOn}
                  onClick={toggleCam}
                />
                <CtrlBtn
                  icon={<FaDesktop />}
                  label={screenOn ? "Stop Share" : "Share Screen"}
                  active={screenOn}
                  onClick={toggleScreen}
                />
                <CtrlBtn
                  icon={<span style={{ fontSize: 16 }}>💬</span>}
                  label="Chat"
                  active={sidebarOpen && sidebarTab === "chat"}
                  onClick={() => {
                    if (sidebarOpen && sidebarTab === "chat")
                      setSidebarOpen(false);
                    else {
                      setSidebarTab("chat");
                      setSidebarOpen(true);
                    }
                  }}
                />
                <CtrlBtn
                  icon={<FaUsers />}
                  label="People"
                  active={sidebarOpen && sidebarTab === "participants"}
                  onClick={() => {
                    if (sidebarOpen && sidebarTab === "participants")
                      setSidebarOpen(false);
                    else {
                      setSidebarTab("participants");
                      setSidebarOpen(true);
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <p style={S.loadingText}>Starting live session…</p>
            </div>
          )}
        </div>

        {/* DRAG HANDLE */}
        <div
          style={S.handle}
          onClick={() => setSidebarOpen((o) => !o)}
          title="Toggle panel"
        >
          <div style={S.handlePill}>
            {sidebarOpen ? (
              <>
                <Chevron dir="right" />
                <div style={S.handleLine} />
                <Chevron dir="left" />
              </>
            ) : (
              <>
                <Chevron dir="left" />
                <div style={S.handleLine} />
                <Chevron dir="right" />
              </>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ ...S.sidebar, width: sidebarOpen ? 340 : 0 }}>
          {sidebarOpen && (
            <>
              <div style={S.tabRow}>
                <TabBtn
                  active={sidebarTab === "chat"}
                  label="💬 Chat"
                  onClick={() => setSidebarTab("chat")}
                />
                <TabBtn
                  active={sidebarTab === "participants"}
                  label="👥 People"
                  onClick={() => setSidebarTab("participants")}
                />
              </div>

              {sidebarTab === "chat" && (
                <>
                  <div style={S.msgList}>
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        style={
                          m.system
                            ? S.sysRow
                            : m.self
                              ? { ...S.msgBlock, alignItems: "flex-end" }
                              : S.msgBlock
                        }
                      >
                        {m.system ? (
                          <div style={S.sysBubble}>{m.text}</div>
                        ) : (
                          <>
                            <span style={S.msgUser}>
                              {m.user} · {m.time}
                            </span>
                            <div
                              style={{
                                ...S.msgBubble,
                                ...(m.self ? S.bubbleSelf : S.bubbleOther),
                              }}
                            >
                              {m.text}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={S.inputRow}>
                    <input
                      style={S.chatInput}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Message students…"
                    />
                    <button style={S.sendBtn} onClick={sendMessage}>
                      <FaPaperPlane size={13} />
                    </button>
                  </div>
                </>
              )}

              {sidebarTab === "participants" && (
                <div style={S.peopleList}>
                  {/* ✅ UPDATED: Trainer row always at top */}
                  <div style={S.pRow}>
                    <div
                      style={{
                        ...S.pAv,
                        background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                      }}
                    >
                      T
                    </div>
                    <span style={S.pName}>You (Trainer)</span>
                    <span style={S.hostTag}>Host</span>
                    <span style={S.youTag}>You</span>
                  </div>

                  {/* ✅ NEW: Real students from DB with email + join time */}
                  {activeDbParticipants.map((p) => (
                    <div key={p.id} style={S.pRow}>
                      <div
                        style={{
                          ...S.pAv,
                          background:
                            "linear-gradient(135deg,#8b5cf6,#ec4899)",
                        }}
                      >
                        {(p.studentEmail?.[0] || "S").toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            ...S.pName,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.studentEmail}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "#475569",
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          Joined{" "}
                          {p.joinTime
                            ? new Date(p.joinTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          background: "rgba(52,211,153,.12)",
                          color: "#6ee7b7",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontWeight: 700,
                          fontFamily: "'Poppins',sans-serif",
                          letterSpacing: "0.06em",
                        }}
                      >
                        LIVE
                      </span>
                    </div>
                  ))}

                  {activeDbParticipants.length === 0 && (
                    <div style={S.emptyPeople}>
                      <FaUsers size={28} style={{ opacity: 0.3 }} />
                      <p
                        style={{
                          fontSize: 12,
                          color: "#475569",
                          marginTop: 8,
                          fontFamily: "'Poppins',sans-serif",
                        }}
                      >
                        No students joined yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
const Chevron = ({ dir }) => (
  <svg width="5" height="10" viewBox="0 0 6 12" fill="none">
    {dir === "right" ? (
      <path
        d="M1 1L6 6L1 11"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ) : (
      <path
        d="M5 1L0 6L5 11"
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    )}
  </svg>
);

const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "11px 0",
      border: "none",
      background: "transparent",
      borderBottom: active ? "2px solid #22d3ee" : "2px solid transparent",
      color: active ? "#22d3ee" : "#475569",
      fontFamily: "'Poppins',sans-serif",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all .15s",
      ...(active ? { background: "rgba(34,211,238,0.06)" } : {}),
    }}
  >
    {label}
  </button>
);

const PersonRow = ({ name, isHost, self }) => (
  <div style={S.pRow}>
    <div
      style={{
        ...S.pAv,
        background: self
          ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
          : "linear-gradient(135deg,#8b5cf6,#ec4899)",
      }}
    >
      {(name || "?")[0].toUpperCase()}
    </div>
    <span style={S.pName}>{name}</span>
    {isHost && <span style={S.hostTag}>Host</span>}
    {self && <span style={S.youTag}>You</span>}
  </div>
);

const CtrlBtn = ({ icon, label, active, danger, onClick }) => {
  const [hov, setHov] = useState(false);
  const bg = danger
    ? hov
      ? "#991b1b"
      : "#7f1d1d"
    : active
      ? hov
        ? "rgba(34,211,238,.3)"
        : "rgba(34,211,238,.16)"
      : hov
        ? "rgba(255,255,255,.14)"
        : "rgba(255,255,255,.07)";
  const col = danger ? "#fca5a5" : active ? "#67e8f9" : "#cbd5e1";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        background: bg,
        color: col,
        border: danger
          ? "1px solid rgba(239,68,68,.3)"
          : active
            ? "1px solid rgba(34,211,238,.3)"
            : "1px solid transparent",
        borderRadius: 14,
        padding: "10px 20px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'Poppins',sans-serif",
        letterSpacing: 0.3,
        transition: "all .18s",
        minWidth: 68,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const S = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    background: "#07090f",
    color: "#e2e8f0",
    fontFamily: "'Poppins','DM Sans','Segoe UI',sans-serif",
    overflow: "hidden",
  },
  autoEndToast: {
    position: "fixed",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 24px",
    borderRadius: 14,
    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
    color: "#fff",
    fontFamily: "'Poppins',sans-serif",
    boxShadow: "0 8px 32px rgba(244,63,94,0.5)",
    animation: "slideIn 0.4s ease",
    minWidth: 300,
  },
  topBar: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 20px",
    background: "#0d1117",
    borderBottom: "1px solid rgba(255,255,255,.07)",
    zIndex: 10,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 10 },
  topRight: { display: "flex", alignItems: "center", gap: 8 },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(244,63,94,.12)",
    border: "1px solid rgba(244,63,94,.28)",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.15em",
    color: "#f43f5e",
    fontFamily: "'Poppins',sans-serif",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#f43f5e",
    animation: "livePulse 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  timerText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#f1f5f9",
    fontFamily: "'Poppins',sans-serif",
  },
  recBadge: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 9px",
    borderRadius: 999,
    background: "rgba(244,63,94,.1)",
    border: "1px solid rgba(244,63,94,.2)",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#fca5a5",
    fontFamily: "'Poppins',sans-serif",
  },
  pCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 10,
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.09)",
    fontSize: 11,
    color: "#94a3b8",
    fontFamily: "'Poppins',sans-serif",
  },
  recBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.05em",
    transition: "all .15s",
  },
  recBtnOn: {
    background: "rgba(244,63,94,.15)",
    border: "1px solid rgba(244,63,94,.3)",
    color: "#f87171",
  },
  recBtnOff: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.09)",
    color: "#94a3b8",
  },
  endBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#dc2626,#f43f5e)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.03em",
  },
  closeBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 9,
    border: "1px solid rgba(255,255,255,.09)",
    background: "rgba(255,255,255,.04)",
    color: "#64748b",
    cursor: "pointer",
    transition: "all .15s",
  },
  body: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },
  videoArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    minWidth: 0,
    background: "#05070d",
  },
  remoteGrid: {
    position: "absolute",
    inset: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 4,
    padding: 4,
    alignContent: "center",
    paddingBottom: 80,
  },
  pip: {
    position: "absolute",
    bottom: 90,
    right: 16,
    width: 176,
    height: 118,
    borderRadius: 14,
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,.12)",
    background: "#0d1117",
    boxShadow: "0 8px 32px rgba(0,0,0,.7)",
    zIndex: 10,
  },
  pipOff: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    background: "#0f172a",
  },
  pipOffTxt: {
    fontSize: 10,
    color: "#475569",
    fontFamily: "'Poppins',sans-serif",
  },
  pipLabel: {
    position: "absolute",
    bottom: 6,
    left: 8,
    fontSize: 9,
    color: "#fff",
    background: "rgba(0,0,0,.6)",
    padding: "2px 8px",
    borderRadius: 6,
    pointerEvents: "none",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
  ctrlBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 24px",
    background: "rgba(13,17,23,.92)",
    backdropFilter: "blur(12px)",
    borderTop: "1px solid rgba(255,255,255,.07)",
    zIndex: 20,
  },
  loadingBox: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid rgba(34,211,238,.2)",
    borderTop: "3px solid #22d3ee",
    borderRadius: "50%",
    animation: "spin .8s linear infinite",
  },
  loadingText: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 600,
  },
  handle: {
    flexShrink: 0,
    width: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.05)",
    borderRight: "1px solid rgba(255,255,255,.05)",
    cursor: "pointer",
    zIndex: 5,
    transition: "background .2s",
  },
  handlePill: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "10px 3px",
    borderRadius: 8,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,.1)",
  },
  handleLine: { width: 1, height: 12, background: "rgba(255,255,255,.15)" },
  sidebar: {
    flexShrink: 0,
    background: "#0d1117",
    borderLeft: "1px solid rgba(255,255,255,.07)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "width .25s ease",
  },
  tabRow: {
    flexShrink: 0,
    display: "flex",
    borderBottom: "1px solid rgba(255,255,255,.07)",
  },
  msgList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 0,
  },
  sysRow: { display: "flex", justifyContent: "center" },
  sysBubble: {
    fontSize: 10,
    color: "#475569",
    fontStyle: "italic",
    background: "rgba(255,255,255,.04)",
    borderRadius: 8,
    padding: "3px 10px",
    fontFamily: "'Poppins',sans-serif",
  },
  msgBlock: { display: "flex", flexDirection: "column", gap: 2 },
  msgUser: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.04em",
  },
  msgBubble: {
    maxWidth: "88%",
    padding: "7px 11px",
    borderRadius: 12,
    fontSize: 12,
    color: "#f1f5f9",
    lineHeight: 1.45,
    fontFamily: "'Poppins',sans-serif",
  },
  bubbleSelf: {
    background: "linear-gradient(135deg,#0e7490,#22d3ee)",
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  bubbleOther: { background: "#1e293b", borderBottomLeftRadius: 2 },
  inputRow: {
    flexShrink: 0,
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid rgba(255,255,255,.07)",
  },
  chatInput: {
    flex: 1,
    background: "#1e293b",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10,
    padding: "8px 12px",
    color: "#e2e8f0",
    fontSize: 12,
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
    outline: "none",
  },
  sendBtn: {
    flexShrink: 0,
    background: "linear-gradient(135deg,#0e7490,#22d3ee)",
    border: "none",
    borderRadius: 10,
    padding: "0 14px",
    color: "#0f172a",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  peopleList: {
    flex: 1,
    overflowY: "auto",
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 0,
  },
  emptyPeople: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 32,
  },
  pRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,.03)",
  },
  pAv: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'Poppins',sans-serif",
  },
  pName: {
    flex: 1,
    fontSize: 12,
    color: "#cbd5e1",
    fontFamily: "'Poppins',sans-serif",
    fontWeight: 500,
  },
  hostTag: {
    fontSize: 9,
    background: "rgba(34,211,238,.12)",
    color: "#67e8f9",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em",
  },
  youTag: {
    fontSize: 9,
    background: "rgba(52,211,153,.12)",
    color: "#6ee7b7",
    padding: "2px 8px",
    borderRadius: 6,
    fontWeight: 700,
    fontFamily: "'Poppins',sans-serif",
    letterSpacing: "0.06em",
  },
};

export default LiveSessionControls;