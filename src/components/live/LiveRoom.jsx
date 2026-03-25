import { useEffect, useRef, useState, useCallback } from "react";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";
import {
  Mic, MicOff, Video, VideoOff, MonitorUp, MonitorOff,
  PhoneOff, MessageSquare, Users, ChevronRight, ChevronLeft,
  Send, X, Radio, Timer, Disc2, Wifi, WifiOff,
} from "lucide-react";

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
      width: "100%", height: "100%",
      objectFit: "cover", display: "block",
    });
  }
  container.appendChild(el);
};

/* ─────────────────────────────────────────────────────────────
   LIVE TIMER
───────────────────────────────────────────────────────────── */
const useLiveTimer = (running) => {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) { setSecs(0); return; }
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
const LiveRoom = ({ token, roomName, onLeave }) => {
  /* ── refs ── */
  const roomRef            = useRef(null);
  const remoteRef          = useRef(null);
  const localRef           = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const screenTrackRef     = useRef(null);
  const chatEndRef         = useRef(null);

  /* ── state ── */
  const [connected,     setConnected]     = useState(false);
  const [micOn,         setMicOn]         = useState(true);
  const [camOn,         setCamOn]         = useState(true);
  const [screenOn,      setScreenOn]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [sidebarTab,    setSidebarTab]    = useState("chat");
  const [trainerOnline, setTrainerOnline] = useState(false);
  const [participants,  setParticipants]  = useState([]);
  const [msgInput,      setMsgInput]      = useState("");

  // ✅ FIX 1: use lazy initialiser so getTime() runs after it's defined
  const [messages, setMessages] = useState(() => [
    { id: 1, name: "System", text: "Session started. Welcome!", time: getTime(), self: false, system: true },
  ]);

  const timer = useLiveTimer(connected);

  /* ── stable helpers ── */
  const pushSystemMsg = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), name: "System", text, time: getTime(), self: false, system: true },
    ]);
  }, []);

  const updateParticipants = useCallback(() => {
    if (!roomRef.current) return;
    const list = [];
    roomRef.current.remoteParticipants.forEach((p) => {
      list.push({ id: p.identity, name: p.name || p.identity, isHost: true });
    });
    setParticipants([{ id: "you", name: "You (Me)", self: true }, ...list]);
  }, []);

  /* ══════════════════════════════════════════════════════════
     CONNECT TO LIVEKIT
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const serverUrl =
      (typeof import.meta !== "undefined" && import.meta.env?.VITE_LIVEKIT_URL) ||
      "ws://localhost:7880";

    const start = async () => {
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;

      try {
        await room.connect(serverUrl, token);
        setConnected(true);

        /* publish local cam + mic */
        const tracks = await createLocalTracks({ audio: true, video: true });
        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);
          if (track.kind === Track.Kind.Video) {
            localVideoTrackRef.current = track;
            if (localRef.current) {
              const el = track.attach();
              Object.assign(el.style, {
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                transform: "scaleX(-1)",
              });
              localRef.current.innerHTML = "";
              localRef.current.appendChild(el);
            }
          }
          if (track.kind === Track.Kind.Audio) {
            localAudioTrackRef.current = track;
          }
        }

        /* attach already-existing remote tracks */
        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((pub) => {
            if (pub.isSubscribed && pub.track) {
              attachTrack(pub.track, remoteRef.current);
            }
          });
          setTrainerOnline(true);
        });
        updateParticipants();

        /* new remote tracks */
        room.on(RoomEvent.TrackSubscribed, (track) => {
          attachTrack(track, remoteRef.current);
          setTrainerOnline(true);
          updateParticipants();
        });

        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((el) => el.remove());
        });

        room.on(RoomEvent.ParticipantConnected, (p) => {
          setTrainerOnline(true);
          updateParticipants();
          pushSystemMsg(`${p.name || p.identity} joined`);
        });

        room.on(RoomEvent.ParticipantDisconnected, (p) => {
          updateParticipants();
          pushSystemMsg(`${p.name || p.identity} left`);
        });

        room.on(RoomEvent.Disconnected, () => {
          setConnected(false);
          setTrainerOnline(false);
        });

        /* ✅ FIX 2: receive chat from others via DataChannel */
        room.on(RoomEvent.DataReceived, (payload, participant) => {
          try {
            const decoded = new TextDecoder().decode(payload);
            const msg     = JSON.parse(decoded);
            if (msg.text) {
              setMessages((prev) => [
                ...prev,
                {
                  id:   Date.now(),
                  name: participant?.name || participant?.identity || "Trainer",
                  text: msg.text,
                  time: getTime(),
                  self: false,
                },
              ]);
            }
          } catch (_) { /* ignore non-json */ }
        });

      } catch (err) {
        console.error("LiveKit error:", err);
        setConnected(false);
      }
    };

    start();
    return () => { roomRef.current?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sidebarTab, sidebarOpen]);

  /* ══════════════════════════════════════════════════════════
     CONTROLS
  ══════════════════════════════════════════════════════════ */

  /* MIC */
  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) await track.mute();
    else        await track.unmute();
    setMicOn((v) => !v);
  }, [micOn]);

  /* CAM */
  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) {
      await track.mute();
      if (localRef.current) localRef.current.style.visibility = "hidden";
    } else {
      await track.unmute();
      if (localRef.current) localRef.current.style.visibility = "visible";
    }
    setCamOn((v) => !v);
  }, [camOn]);

  /* ✅ FIX 3: Screen share — correct API: setScreenShareEnabled */
  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    if (screenOn) {
      /* stop */
      try {
        await room.localParticipant.setScreenShareEnabled(false);
      } catch (e) { console.warn("stop screen share:", e); }

      screenTrackRef.current = null;
      setScreenOn(false);

      /* restore cam in PIP */
      if (localVideoTrackRef.current && camOn && localRef.current) {
        const el = localVideoTrackRef.current.attach();
        Object.assign(el.style, {
          width: "100%", height: "100%",
          objectFit: "cover", display: "block",
          transform: "scaleX(-1)",
        });
        localRef.current.innerHTML = "";
        localRef.current.appendChild(el);
        localRef.current.style.visibility = "visible";
      }

    } else {
      /* start */
      try {
        const pub = await room.localParticipant.setScreenShareEnabled(true);
        if (!pub) return; // user cancelled

        const screenTrack = pub.track;
        screenTrackRef.current = screenTrack;

        /* preview own screen in PIP */
        if (screenTrack && localRef.current) {
          const el = screenTrack.attach();
          Object.assign(el.style, {
            width: "100%", height: "100%",
            objectFit: "contain", display: "block",
          });
          localRef.current.innerHTML = "";
          localRef.current.appendChild(el);
          localRef.current.style.visibility = "visible";
        }

        setScreenOn(true);

        /* handle browser "Stop sharing" button */
        const mediaTrack = screenTrack?.mediaStreamTrack;
        if (mediaTrack) {
          mediaTrack.addEventListener("ended", () => {
            room.localParticipant.setScreenShareEnabled(false).catch(() => {});
            screenTrackRef.current = null;
            setScreenOn(false);
            /* restore cam */
            if (localVideoTrackRef.current && camOn && localRef.current) {
              const el2 = localVideoTrackRef.current.attach();
              Object.assign(el2.style, {
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                transform: "scaleX(-1)",
              });
              localRef.current.innerHTML = "";
              localRef.current.appendChild(el2);
            }
          });
        }

      } catch (err) {
        console.warn("Screen share failed/cancelled:", err);
      }
    }
  }, [screenOn, camOn]);

  /* LEAVE */
  const handleLeave = useCallback(() => {
    roomRef.current?.disconnect();
    localVideoTrackRef.current?.stop();
    localAudioTrackRef.current?.stop();
    screenTrackRef.current?.stop();
    if (typeof onLeave === "function") onLeave();
  }, [onLeave]);

  /* SEND MESSAGE — DataChannel broadcast */
  const sendMsg = useCallback(() => {
    const text = msgInput.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), name: "You", text, time: getTime(), self: true },
    ]);
    setMsgInput("");

    try {
      const payload = new TextEncoder().encode(JSON.stringify({ text }));
      roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
    } catch (e) { console.warn("data send failed:", e); }
  }, [msgInput]);

  /* SIDEBAR */
  const openTab = useCallback((tab) => {
    if (sidebarOpen && sidebarTab === tab) setSidebarOpen(false);
    else { setSidebarTab(tab); setSidebarOpen(true); }
  }, [sidebarOpen, sidebarTab]);

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={S.root}>

      {/* TOP BAR */}
      <div style={S.topBar}>
        <div style={S.topLeft}>
          <div style={S.liveBadge}><span style={S.liveDot} />LIVE</div>
          <div style={S.recBadge}><Disc2 size={11} />REC</div>
          <div style={S.timerBadge}><Timer size={12} />{timer}</div>
          <span style={S.sessionName}>{roomName || "Live Session"}</span>
        </div>
        <div style={S.topRight}>
          <div style={{ ...S.connBadge, ...(connected ? S.connOn : S.connOff) }}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? "Connected" : "Connecting…"}
          </div>
          <div style={S.trainerBadge}>
            <Radio size={12} style={{ color: trainerOnline ? "#34d399" : "#64748b" }} />
            <span style={{ color: trainerOnline ? "#34d399" : "#64748b" }}>
              {trainerOnline ? "Trainer Online" : "Waiting for Trainer"}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div style={S.mainArea}>

        {/* Stage */}
        <div style={S.stage}>
          <div ref={remoteRef} style={S.remoteVideo} />

          {!trainerOnline && (
            <div style={S.stagePH}>
              <div style={S.avatarRing}><div style={S.avatarInner}>T</div></div>
              <p style={S.phText}>Waiting for trainer's stream…</p>
              <p style={S.phSub}>Session will begin shortly</p>
            </div>
          )}

          {/* Student PIP */}
          <div style={S.pip}>
            <div
              ref={localRef}
              style={{ width:"100%", height:"100%", visibility: camOn || screenOn ? "visible" : "hidden" }}
            />
            {!camOn && !screenOn && (
              <div style={S.pipOff}>
                <VideoOff size={18} color="#64748b" />
                <span style={S.pipOffTxt}>Cam Off</span>
              </div>
            )}
            <span style={S.pipLabel}>You{screenOn ? " · Sharing" : ""}</span>
          </div>
        </div>

        {/* Handle */}
        <div
          style={S.handle}
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse" : "Expand"}
        >
          {sidebarOpen
            ? <ChevronRight size={15} color="#64748b" />
            : <ChevronLeft  size={15} color="#64748b" />}
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={S.sidebar}>
            <div style={S.tabRow}>
              <button
                style={{ ...S.tab, ...(sidebarTab === "chat" ? S.tabOn : {}) }}
                onClick={() => setSidebarTab("chat")}
              >
                <MessageSquare size={13} /> Chat
              </button>
              <button
                style={{ ...S.tab, ...(sidebarTab === "people" ? S.tabOn : {}) }}
                onClick={() => setSidebarTab("people")}
              >
                <Users size={13} /> People
                <span style={S.cnt}>{participants.length || 1}</span>
              </button>
              <button style={S.closeBtn} onClick={() => setSidebarOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {/* CHAT */}
            {sidebarTab === "chat" && (
              <div style={S.chatWrap}>
                <div style={S.msgList}>
                  {messages.map((m) => (
                    <div key={m.id} style={{ ...S.msgRow, ...(m.self ? S.msgSelf : {}) }}>
                      {!m.self && !m.system && (
                        <div style={S.av}>{m.name[0]}</div>
                      )}
                      {m.system ? (
                        <div style={S.sysBubble}>{m.text}</div>
                      ) : (
                        <div style={{ ...S.bubble, ...(m.self ? S.bSelf : S.bOther) }}>
                          {!m.self && <span style={S.bName}>{m.name}</span>}
                          <span style={S.bText}>{m.text}</span>
                          <span style={S.bTime}>{m.time}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* ✅ Chat input — fixed */}
                <div style={S.inputRow}>
                  <input
                    style={S.chatInput}
                    placeholder="Type a message…"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMsg();
                      }
                    }}
                  />
                  <button style={S.sendBtn} onClick={sendMsg}>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* PEOPLE */}
            {sidebarTab === "people" && (
              <div style={S.peopleList}>
                <PersonRow name="You (Me)" self />
                {participants
                  .filter((p) => !p.self)
                  .map((p) => <PersonRow key={p.id} name={p.name} isHost={p.isHost} />)
                }
                {participants.filter((p) => !p.self).length === 0 && (
                  <p style={S.emptyPpl}>No other participants yet</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTROL BAR */}
      <div style={S.ctrlBar}>
        <div style={S.ctrlGrp}>
          <Btn
            icon={micOn ? <Mic size={18} /> : <MicOff size={18} />}
            label={micOn ? "Mute" : "Unmute"}
            danger={!micOn}
            onClick={toggleMic}
          />
          <Btn
            icon={camOn ? <Video size={18} /> : <VideoOff size={18} />}
            label={camOn ? "Stop Cam" : "Start Cam"}
            danger={!camOn}
            onClick={toggleCam}
          />
          <Btn
            icon={screenOn ? <MonitorOff size={18} /> : <MonitorUp size={18} />}
            label={screenOn ? "Stop Share" : "Share Screen"}
            active={screenOn}
            onClick={toggleScreen}
          />
        </div>
        <div style={S.ctrlGrp}>
          <Btn
            icon={<MessageSquare size={18} />}
            label="Chat"
            active={sidebarOpen && sidebarTab === "chat"}
            onClick={() => openTab("chat")}
          />
          <Btn
            icon={<Users size={18} />}
            label="People"
            active={sidebarOpen && sidebarTab === "people"}
            onClick={() => openTab("people")}
          />
        </div>
        <div style={S.ctrlGrp}>
          <Btn icon={<PhoneOff size={18} />} label="Leave" leave onClick={handleLeave} />
        </div>
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
        @keyframes recBlink  { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
const PersonRow = ({ name, isHost, self }) => (
  <div style={S.pRow}>
    <div style={{
      ...S.pAv,
      background: self
        ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
        : "linear-gradient(135deg,#8b5cf6,#ec4899)",
    }}>
      {name[0]}
    </div>
    <span style={S.pName}>{name}</span>
    {isHost && <span style={S.hostTag}>Host</span>}
    {self   && <span style={S.youTag}>You</span>}
  </div>
);

const Btn = ({ icon, label, active, danger, leave, onClick }) => {
  const [hov, setHov] = useState(false);
  const bg  = leave  ? (hov ? "#dc2626" : "#ef4444")
            : danger ? (hov ? "#991b1b" : "#7f1d1d")
            : active ? (hov ? "rgba(99,102,241,.38)" : "rgba(99,102,241,.22)")
                     : (hov ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.07)");
  const col = leave  ? "#fff"
            : danger ? "#fca5a5"
            : active ? "#a5b4fc"
                     : "#cbd5e1";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"flex", flexDirection:"column", alignItems:"center", gap:5,
        background:bg, color:col,
        border: danger ? "1px solid rgba(239,68,68,.3)"
              : active ? "1px solid rgba(99,102,241,.35)"
                       : "1px solid transparent",
        borderRadius:14, padding:"10px 20px",
        cursor:"pointer", fontSize:11, fontWeight:600,
        fontFamily:"inherit", letterSpacing:0.3, transition:"all .18s",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const S = {
  root:        { display:"flex", flexDirection:"column", height:"100vh", background:"#07090f", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#e2e8f0", overflow:"hidden" },
  topBar:      { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px", background:"#0d1117", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 },
  topLeft:     { display:"flex", alignItems:"center", gap:10 },
  topRight:    { display:"flex", alignItems:"center", gap:10 },
  liveBadge:   { display:"flex", alignItems:"center", gap:5, background:"rgba(239,68,68,.14)", border:"1px solid rgba(239,68,68,.28)", borderRadius:8, padding:"3px 9px", fontSize:10, fontWeight:800, letterSpacing:1.5, color:"#ef4444" },
  liveDot:     { width:7, height:7, borderRadius:"50%", background:"#ef4444", animation:"livePulse 1.2s ease-in-out infinite", display:"inline-block" },
  recBadge:    { display:"flex", alignItems:"center", gap:4, background:"rgba(248,113,113,.09)", border:"1px solid rgba(248,113,113,.18)", borderRadius:8, padding:"3px 8px", fontSize:10, fontWeight:700, letterSpacing:1, color:"#fca5a5", animation:"recBlink 2s infinite" },
  timerBadge:  { display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:"#94a3b8", background:"rgba(255,255,255,.05)", borderRadius:8, padding:"3px 10px", fontVariantNumeric:"tabular-nums" },
  sessionName: { fontSize:14, fontWeight:600, color:"#f1f5f9", marginLeft:4 },
  connBadge:   { display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, borderRadius:8, padding:"3px 10px" },
  connOn:      { background:"rgba(52,211,153,.1)", border:"1px solid rgba(52,211,153,.24)", color:"#34d399" },
  connOff:     { background:"rgba(100,116,139,.1)", border:"1px solid rgba(100,116,139,.2)", color:"#94a3b8" },
  trainerBadge:{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, background:"rgba(255,255,255,.04)", borderRadius:8, padding:"3px 10px" },

  mainArea:    { flex:1, display:"flex", overflow:"hidden" },

  stage:       { flex:1, position:"relative", background:"#05070d", overflow:"hidden" },
  remoteVideo: { position:"absolute", inset:0 },
  stagePH:     { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14 },
  avatarRing:  { width:96, height:96, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", padding:3 },
  avatarInner: { width:"100%", height:"100%", borderRadius:"50%", background:"#0d1117", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:800, color:"#fff" },
  phText:      { margin:0, fontSize:16, fontWeight:600, color:"#94a3b8" },
  phSub:       { margin:0, fontSize:12, color:"#334155" },

  pip:         { position:"absolute", bottom:20, right:20, width:176, height:118, borderRadius:14, overflow:"hidden", border:"2px solid rgba(255,255,255,.13)", background:"#0d1117", boxShadow:"0 8px 32px rgba(0,0,0,.7)", zIndex:10 },
  pipOff:      { position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, background:"#0f172a" },
  pipOffTxt:   { fontSize:10, color:"#475569" },
  pipLabel:    { position:"absolute", bottom:6, left:8, fontSize:10, color:"#fff", background:"rgba(0,0,0,.6)", padding:"1px 7px", borderRadius:5, pointerEvents:"none" },

  handle:      { width:22, display:"flex", alignItems:"center", justifyContent:"center", background:"#0d1117", borderLeft:"1px solid rgba(255,255,255,.05)", cursor:"pointer", flexShrink:0 },

  sidebar:     { width:320, background:"#0d1117", borderLeft:"1px solid rgba(255,255,255,.06)", display:"flex", flexDirection:"column", animation:"slideIn .2s ease", flexShrink:0 },
  tabRow:      { display:"flex", alignItems:"center", gap:6, padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,.06)", flexShrink:0 },
  tab:         { flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:5, padding:"7px 0", borderRadius:10, border:"none", background:"transparent", color:"#475569", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600, transition:"all .15s" },
  tabOn:       { background:"rgba(99,102,241,.15)", color:"#818cf8" },
  cnt:         { fontSize:10, background:"rgba(99,102,241,.2)", color:"#a5b4fc", borderRadius:10, padding:"1px 6px", marginLeft:3 },
  closeBtn:    { background:"none", border:"none", color:"#334155", cursor:"pointer", display:"flex", marginLeft:"auto", padding:4 },

  chatWrap:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden" },
  msgList:     { flex:1, overflowY:"auto", padding:"12px 14px", display:"flex", flexDirection:"column", gap:10 },
  msgRow:      { display:"flex", alignItems:"flex-end", gap:7 },
  msgSelf:     { flexDirection:"row-reverse" },
  av:          { width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 },
  sysBubble:   { fontSize:11, color:"#475569", background:"rgba(255,255,255,.04)", borderRadius:8, padding:"4px 10px", fontStyle:"italic", margin:"0 auto" },
  bubble:      { maxWidth:"78%", borderRadius:14, padding:"7px 11px", display:"flex", flexDirection:"column", gap:2 },
  bSelf:       { background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", borderBottomRightRadius:2 },
  bOther:      { background:"#1e293b", borderBottomLeftRadius:2 },
  bName:       { fontSize:10, color:"#94a3b8", fontWeight:600 },
  bText:       { fontSize:13, color:"#f1f5f9", lineHeight:1.45 },
  bTime:       { fontSize:10, color:"rgba(255,255,255,.3)", alignSelf:"flex-end" },

  inputRow:    { display:"flex", gap:7, padding:"10px 12px", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0 },
  chatInput:   { flex:1, background:"#1e293b", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:"8px 12px", color:"#e2e8f0", fontSize:13, fontFamily:"inherit", outline:"none" },
  sendBtn:     { background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", border:"none", borderRadius:10, padding:"0 14px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 },

  peopleList:  { flex:1, overflowY:"auto", padding:"10px 12px", display:"flex", flexDirection:"column", gap:4 },
  emptyPpl:    { fontSize:12, color:"#334155", textAlign:"center", marginTop:20 },
  pRow:        { display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, background:"rgba(255,255,255,.03)" },
  pAv:         { width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, flexShrink:0 },
  pName:       { flex:1, fontSize:13, color:"#cbd5e1" },
  hostTag:     { fontSize:10, background:"rgba(59,130,246,.15)", color:"#60a5fa", padding:"2px 8px", borderRadius:6, fontWeight:600 },
  youTag:      { fontSize:10, background:"rgba(52,211,153,.12)", color:"#6ee7b7", padding:"2px 8px", borderRadius:6, fontWeight:600 },

  ctrlBar:     { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 24px", background:"#0d1117", borderTop:"1px solid rgba(255,255,255,.06)", flexShrink:0 },
  ctrlGrp:     { display:"flex", alignItems:"center", gap:6 },
};

export default LiveRoom;



































