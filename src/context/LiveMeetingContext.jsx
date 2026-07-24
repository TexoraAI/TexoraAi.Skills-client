// import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";

// const LiveMeetingContext = createContext(null);
// const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

// const nowLabel = () =>
//   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// // ── AUDIO FIX ────────────────────────────────────────────────────
// // Root cause: audio was only attached inside <LiveRoom>, which
// // unmounts whenever `minimized` becomes true (i.e. any Dashboard
// // navigation). This component renders the same hidden <audio>
// // elements, but lives inside LiveMeetingProvider — which sits above
// // the router and NEVER unmounts on navigation, whether LiveRoom or
// // FloatingMeetingWidget is the currently-visible UI. Audio now keeps
// // playing on every route, exactly like Meet/Teams.
// function RemoteAudioTrack({ track }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     const el = ref.current;
//     if (!track || !el) return;
//     track.attach(el);
//     return () => { try { track.detach(el); } catch (_) {} };
//   }, [track]);
//   return <audio ref={ref} autoPlay />;
// }

// function RemoteAudioLayer({ participants }) {
//   return (
//     <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
//       {participants
//         .filter((p) => !p.isLocal && p.micTrack)
//         .map((p) => (
//           <RemoteAudioTrack key={p.identity} track={p.micTrack} />
//         ))}
//     </div>
//   );
// }
// // ─────────────────────────────────────────────────────────────────

// export function LiveMeetingProvider({ children }) {
//   const roomRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);
//   const floaterIdRef = useRef(0);

//   const [activeMeeting, setActiveMeeting] = useState(null); // { role, sessionId, roomName, title, joinedAt }
//   const [minimized, setMinimized] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [raisedHands, setRaisedHands] = useState({});
//   const [floaters, setFloaters] = useState([]);

//   const syncParticipants = useCallback(() => {
//     const room = roomRef.current;
//     if (!room) return;
//     const list = [];
//     const lp = room.localParticipant;
//     const localEntry = {
//       identity: "you", name: "You", isLocal: true, isHost: false,
//       cameraTrack: null, cameraMuted: true, micTrack: null, micMuted: true, screenTrack: null,
//     };
//     lp.trackPublications.forEach((pub) => {
//       if (!pub.track) return;
//       if (pub.source === Track.Source.Camera) { localEntry.cameraTrack = pub.track; localEntry.cameraMuted = pub.isMuted; }
//       else if (pub.source === Track.Source.Microphone) { localEntry.micTrack = pub.track; localEntry.micMuted = pub.isMuted; }
//       else if (pub.source === Track.Source.ScreenShare) { localEntry.screenTrack = pub.track; }
//     });
//     list.push(localEntry);

//     room.remoteParticipants.forEach((p) => {
//       const entry = {
//         identity: p.identity, name: p.name || p.identity, isLocal: false, isHost: true,
//         cameraTrack: null, cameraMuted: true, micTrack: null, micMuted: true, screenTrack: null,
//       };
//       p.trackPublications.forEach((pub) => {
//         // NOTE: previously required `pub.isSubscribed` as well as
//         // `pub.track`. `isSubscribed` can flip to true a beat *after*
//         // `pub.track` is actually attached/playable, which was making
//         // the spotlight/grid switch lag a moment behind a remote
//         // participant starting or stopping a screen share. `pub.track`
//         // being present already implies it's usable, so that alone is
//         // the correct (and faster) check.
//         if (!pub.track) return;
//         if (pub.source === Track.Source.Camera) { entry.cameraTrack = pub.track; entry.cameraMuted = pub.isMuted; }
//         else if (pub.source === Track.Source.Microphone) { entry.micTrack = pub.track; entry.micMuted = pub.isMuted; }
//         else if (pub.source === Track.Source.ScreenShare) { entry.screenTrack = pub.track; }
//       });
//       list.push(entry);
//     });
//     setParticipants(list);
//   }, []);

//   const pushSystemMsg = useCallback((text) => {
//     setMessages((prev) => [...prev, {
//       id: Date.now() + Math.random(), name: "System", text, system: true, time: nowLabel(),
//     }]);
//   }, []);

//   const joinMeeting = useCallback(async ({ role, sessionId, roomName, token, title, joinedAt }) => {
//     if (roomRef.current && activeMeeting?.sessionId === sessionId && activeMeeting?.roomName === roomName) {
//       setMinimized(false);
//       return;
//     }
//     if (roomRef.current) {
//       await roomRef.current.disconnect();
//       roomRef.current = null;
//     }

//     const room = new Room({ adaptiveStream: true, dynacast: true });
//     roomRef.current = room;

//     room
//       .on(RoomEvent.TrackSubscribed, syncParticipants)
//       .on(RoomEvent.TrackUnsubscribed, syncParticipants)
//       .on(RoomEvent.TrackMuted, syncParticipants)
//       .on(RoomEvent.TrackUnmuted, syncParticipants)
//       .on(RoomEvent.LocalTrackPublished, syncParticipants)
//       .on(RoomEvent.LocalTrackUnpublished, syncParticipants)
//       .on(RoomEvent.ParticipantConnected, (p) => { syncParticipants(); pushSystemMsg(`${p.name || p.identity} joined`); })
//       .on(RoomEvent.ParticipantDisconnected, (p) => {
//         syncParticipants();
//         pushSystemMsg(`${p.name || p.identity} left`);
//         setRaisedHands((prev) => {
//           if (!(p.identity in prev)) return prev;
//           const next = { ...prev };
//           delete next[p.identity];
//           return next;
//         });
//       })
//       .on(RoomEvent.Disconnected, () => setConnected(false))
//       .on(RoomEvent.DataReceived, (payload, participant) => {
//         try {
//           const msg = JSON.parse(new TextDecoder().decode(payload));

//           if (msg.type === "reaction") {
//             const id = ++floaterIdRef.current;
//             setFloaters((prev) => [
//               ...prev,
//               { id, emoji: msg.emoji, name: participant?.name || participant?.identity || "Someone" },
//             ]);
//             setTimeout(() => {
//               setFloaters((prev) => prev.filter((f) => f.id !== id));
//             }, 2500);
//             return;
//           }

//           if (msg.type === "raiseHand") {
//             const identity = participant?.identity;
//             if (identity) {
//               setRaisedHands((prev) => ({ ...prev, [identity]: !!msg.raised }));
//               pushSystemMsg(`${participant?.name || identity} ${msg.raised ? "raised" : "lowered"} their hand`);
//             }
//             return;
//           }

//           // FIX (trainer-sync gap): the trainer's "Lower All Hands" broadcasts
//           // { type: "trainer_command", command: "handsLowered", value: true } over
//           // the same data channel. Without this branch the trainer's own view
//           // clears immediately but this student's UI kept showing their hand as
//           // raised (out of sync) until they manually toggled it. This clears the
//           // local "you" flag and re-publishes raiseHand:false so the trainer and
//           // every other participant's raisedHands map also gets the update -
//           // same publishData contract toggleHandRaise already uses below.
//           if (msg.type === "trainer_command" && msg.command === "handsLowered" && msg.value) {
//             setRaisedHands((prev) => {
//               if (!prev.you) return prev;
//               return { ...prev, you: false };
//             });
//             pushSystemMsg("Your hand was lowered by the trainer.");
//             try {
//               const downPayload = new TextEncoder().encode(JSON.stringify({ type: "raiseHand", raised: false }));
//               roomRef.current?.localParticipant?.publishData(downPayload, { reliable: true });
//             } catch (_) {}
//             return;
//           }

//           if (msg.text) {
//             setMessages((prev) => [...prev, {
//               id: Date.now() + Math.random(),
//               name: participant?.name || participant?.identity || "User",
//               text: msg.text, self: false, time: nowLabel(),
//             }]);
//           }
//         } catch (_) {}
//       });

//     await room.connect(LIVEKIT_URL, token);
//     setConnected(true);

//     try {
//       const tracks = await createLocalTracks({ audio: true, video: true });
//       for (const track of tracks) {
//         await room.localParticipant.publishTrack(track);
//         if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
//         if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
//       }
//     } catch (err) {
//       console.error("getUserMedia failed:", err);
//     }

//     syncParticipants();
//     setRaisedHands({});
//     setFloaters([]);
//     setActiveMeeting({ role, sessionId, roomName, title, joinedAt: joinedAt || Date.now() });
//     setMinimized(false);
//     setMessages([{ id: 0, name: "System", text: "Session started. Welcome!", system: true, time: nowLabel() }]);
//   }, [activeMeeting, syncParticipants, pushSystemMsg]);

//   const leaveMeeting = useCallback(() => {
//     roomRef.current?.disconnect();
//     roomRef.current = null;
//     localVideoTrackRef.current?.stop();
//     localAudioTrackRef.current?.stop();
//     localVideoTrackRef.current = null;
//     localAudioTrackRef.current = null;
//     setActiveMeeting(null);
//     setConnected(false);
//     setParticipants([]);
//     setMessages([]);
//     setRaisedHands({});
//     setFloaters([]);
//     setMinimized(false);
//   }, []);

//   const toggleMic = useCallback(async () => {
//     const track = localAudioTrackRef.current;
//     if (!track) return;
//     if (micOn) await track.mute(); else await track.unmute();
//     setMicOn((v) => !v);
//     syncParticipants();
//   }, [micOn, syncParticipants]);

//   const toggleCam = useCallback(async () => {
//     const track = localVideoTrackRef.current;
//     if (!track) return;
//     if (camOn) await track.mute(); else await track.unmute();
//     setCamOn((v) => !v);
//     syncParticipants();
//   }, [camOn, syncParticipants]);

//   const toggleScreen = useCallback(async () => {
//     const room = roomRef.current;
//     if (!room) return;
//     try {
//       if (screenOn) {
//         // FIX: previously this awaited `setScreenShareEnabled(false)`
//         // before touching any state, and the layout only updated once
//         // the LiveKit "LocalTrackUnpublished" event round-tripped back
//         // through syncParticipants(). That round trip is what made the
//         // UI feel slow to "snap back" to the normal grid after ending a
//         // share (see the reported delay). We now flip `screenOn` and
//         // optimistically clear the local participant's screenTrack
//         // immediately — before the await — so the spotlight/grid
//         // layout switches back the instant the button is pressed. The
//         // real unpublish still happens right after; syncParticipants()
//         // in `finally` reconciles with the real LiveKit state either
//         // way, so this can't get out of sync.
//         setScreenOn(false);
//         setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
//         await room.localParticipant.setScreenShareEnabled(false);
//       } else {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return;
//         setScreenOn(true);
//         pub.track?.mediaStreamTrack?.addEventListener("ended", () => {
//           room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//           setScreenOn(false);
//           setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
//           syncParticipants();
//         });
//       }
//     } finally {
//       syncParticipants();
//     }
//   }, [screenOn, syncParticipants]);

//   const sendMessage = useCallback((text) => {
//     if (!text?.trim()) return;
//     setMessages((prev) => [...prev, { id: Date.now() + Math.random(), name: "You", text, self: true, time: nowLabel() }]);
//     try {
//       const payload = new TextEncoder().encode(JSON.stringify({ text }));
//       roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//     } catch (_) {}
//   }, []);

//   const toggleHandRaise = useCallback(() => {
//     setRaisedHands((prev) => {
//       const next = !prev.you;
//       pushSystemMsg(next ? "You raised your hand" : "You lowered your hand");
//       try {
//         const payload = new TextEncoder().encode(JSON.stringify({ type: "raiseHand", raised: next }));
//         roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//       } catch (e) {
//         console.warn("raise hand send failed:", e);
//       }
//       return { ...prev, you: next };
//     });
//   }, [pushSystemMsg]);

//   const sendReaction = useCallback((emoji) => {
//     const id = ++floaterIdRef.current;
//     setFloaters((prev) => [...prev, { id, emoji, name: "You" }]);
//     setTimeout(() => {
//       setFloaters((prev) => prev.filter((f) => f.id !== id));
//     }, 2500);
//     try {
//       const payload = new TextEncoder().encode(JSON.stringify({ type: "reaction", emoji }));
//       roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//     } catch (e) {
//       console.warn("reaction send failed:", e);
//     }
//   }, []);

//   // Only ever cleans up on a hard app unload — never on route change,
//   // because this provider is mounted above the router.
//   useEffect(() => () => { roomRef.current?.disconnect(); }, []);

//   const value = {
//     activeMeeting, minimized, setMinimized,
//     connected, micOn, camOn, screenOn, participants, messages,
//     raisedHands, floaters,
//     joinMeeting, leaveMeeting, toggleMic, toggleCam, toggleScreen, sendMessage,
//     toggleHandRaise, sendReaction,
//     room: roomRef.current,
//   };

//   return (
//     <LiveMeetingContext.Provider value={value}>
//       {children}
//       {/* AUDIO FIX: always mounted, survives every route change and
//           every minimized/expanded UI switch. */}
//       <RemoteAudioLayer participants={participants} />
//     </LiveMeetingContext.Provider>
//   );
// }

// export const useLiveMeeting = () => {
//   const ctx = useContext(LiveMeetingContext);
//   if (!ctx) throw new Error("useLiveMeeting must be used within LiveMeetingProvider");
//   return ctx;
// };




















































import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";

const LiveMeetingContext = createContext(null);
const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ── AUDIO FIX ────────────────────────────────────────────────────
// Root cause: audio was only attached inside <LiveRoom>, which
// unmounts whenever `minimized` becomes true (i.e. any Dashboard
// navigation). This component renders the same hidden <audio>
// elements, but lives inside LiveMeetingProvider — which sits above
// the router and NEVER unmounts on navigation, whether LiveRoom or
// FloatingMeetingWidget is the currently-visible UI. Audio now keeps
// playing on every route, exactly like Meet/Teams.
function RemoteAudioTrack({ track }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!track || !el) return;
    track.attach(el);
    return () => { try { track.detach(el); } catch (_) {} };
  }, [track]);
  return <audio ref={ref} autoPlay />;
}

function RemoteAudioLayer({ participants }) {
  return (
    <div style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
      {participants
        .filter((p) => !p.isLocal && p.micTrack)
        .map((p) => (
          <RemoteAudioTrack key={p.identity} track={p.micTrack} />
        ))}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────

export function LiveMeetingProvider({ children }) {
  const roomRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const floaterIdRef = useRef(0);

  const [activeMeeting, setActiveMeeting] = useState(null); // { role, sessionId, roomName, title, joinedAt }
  const [minimized, setMinimized] = useState(false);
  const [connected, setConnected] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [raisedHands, setRaisedHands] = useState({});
  const [floaters, setFloaters] = useState([]);

  // ── Trainer-enforced flags. Previously the trainer's "Mute All" /
  // "Disable Chat" / "Block Screen Share" buttons only flipped a
  // *local* flag on the trainer's own screen and broadcast a
  // { type: "trainer_command", command, value } data message — but
  // nothing on the student side was listening for it, so none of these
  // controls had any real effect on a connected student. These flags
  // are the student-side source of truth for that broadcast, and are
  // enforced below in sendMessage/toggleMic/toggleCam/toggleScreen and
  // by the DataReceived "trainer_command" branch further down.
  const [chatDisabled, setChatDisabled] = useState(false);
  const [micLockedByTrainer, setMicLockedByTrainer] = useState(false);
  const [screenShareBlocked, setScreenShareBlocked] = useState(false);
  // NEW: camera lock, mirrors micLockedByTrainer exactly. Previously
  // there was no listener at all for the trainer's "Disable Cameras" /
  // "Enable Cameras" buttons, so they had zero effect on students.
  const [cameraLockedByTrainer, setCameraLockedByTrainer] = useState(false);

  const syncParticipants = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;
    const list = [];
    const lp = room.localParticipant;
    const localEntry = {
      identity: "you", name: "You", isLocal: true, isHost: false,
      cameraTrack: null, cameraMuted: true, micTrack: null, micMuted: true, screenTrack: null,
    };
    lp.trackPublications.forEach((pub) => {
      if (!pub.track) return;
      if (pub.source === Track.Source.Camera) { localEntry.cameraTrack = pub.track; localEntry.cameraMuted = pub.isMuted; }
      else if (pub.source === Track.Source.Microphone) { localEntry.micTrack = pub.track; localEntry.micMuted = pub.isMuted; }
      else if (pub.source === Track.Source.ScreenShare) { localEntry.screenTrack = pub.track; }
    });
    list.push(localEntry);

    room.remoteParticipants.forEach((p) => {
      const entry = {
        identity: p.identity, name: p.name || p.identity, isLocal: false, isHost: true,
        cameraTrack: null, cameraMuted: true, micTrack: null, micMuted: true, screenTrack: null,
      };
      p.trackPublications.forEach((pub) => {
        // NOTE: previously required `pub.isSubscribed` as well as
        // `pub.track`. `isSubscribed` can flip to true a beat *after*
        // `pub.track` is actually attached/playable, which was making
        // the spotlight/grid switch lag a moment behind a remote
        // participant starting or stopping a screen share. `pub.track`
        // being present already implies it's usable, so that alone is
        // the correct (and faster) check.
        if (!pub.track) return;
        if (pub.source === Track.Source.Camera) { entry.cameraTrack = pub.track; entry.cameraMuted = pub.isMuted; }
        else if (pub.source === Track.Source.Microphone) { entry.micTrack = pub.track; entry.micMuted = pub.isMuted; }
        else if (pub.source === Track.Source.ScreenShare) { entry.screenTrack = pub.track; }
      });
      list.push(entry);
    });
    setParticipants(list);
  }, []);

  const pushSystemMsg = useCallback((text) => {
    setMessages((prev) => [...prev, {
      id: Date.now() + Math.random(), name: "System", text, system: true, time: nowLabel(),
    }]);
  }, []);

  const joinMeeting = useCallback(async ({ role, sessionId, roomName, token, title, joinedAt }) => {
    if (roomRef.current && activeMeeting?.sessionId === sessionId && activeMeeting?.roomName === roomName) {
      setMinimized(false);
      return;
    }
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }

    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    room
      .on(RoomEvent.TrackSubscribed, syncParticipants)
      .on(RoomEvent.TrackUnsubscribed, syncParticipants)
      .on(RoomEvent.TrackMuted, syncParticipants)
      .on(RoomEvent.TrackUnmuted, syncParticipants)
      .on(RoomEvent.LocalTrackPublished, syncParticipants)
      .on(RoomEvent.LocalTrackUnpublished, syncParticipants)
      .on(RoomEvent.ParticipantConnected, (p) => { syncParticipants(); pushSystemMsg(`${p.name || p.identity} joined`); })
      .on(RoomEvent.ParticipantDisconnected, (p) => {
        syncParticipants();
        pushSystemMsg(`${p.name || p.identity} left`);
        setRaisedHands((prev) => {
          if (!(p.identity in prev)) return prev;
          const next = { ...prev };
          delete next[p.identity];
          return next;
        });
      })
      .on(RoomEvent.Disconnected, () => setConnected(false))
      .on(RoomEvent.DataReceived, (payload, participant) => {
        try {
          const msg = JSON.parse(new TextDecoder().decode(payload));

          if (msg.type === "reaction") {
            const id = ++floaterIdRef.current;
            setFloaters((prev) => [
              ...prev,
              { id, emoji: msg.emoji, name: participant?.name || participant?.identity || "Someone" },
            ]);
            setTimeout(() => {
              setFloaters((prev) => prev.filter((f) => f.id !== id));
            }, 2500);
            return;
          }

          if (msg.type === "raiseHand") {
            const identity = participant?.identity;
            if (identity) {
              setRaisedHands((prev) => ({ ...prev, [identity]: !!msg.raised }));
              pushSystemMsg(`${participant?.name || identity} ${msg.raised ? "raised" : "lowered"} their hand`);
            }
            return;
          }

          // ── Trainer Controls enforcement. The trainer broadcasts
          // { type: "trainer_command", command, value, identity? } over
          // this same data channel.
          if (msg.type === "trainer_command") {
            const room = roomRef.current;
            switch (msg.command) {
              case "handsLowered": {
                if (msg.value) {
                  setRaisedHands((prev) => (prev.you ? { ...prev, you: false } : prev));
                  pushSystemMsg("Your hand was lowered by the trainer.");
                  try {
                    const downPayload = new TextEncoder().encode(JSON.stringify({ type: "raiseHand", raised: false }));
                    room?.localParticipant?.publishData(downPayload, { reliable: true });
                  } catch (_) {}
                }
                break;
              }
              case "chatDisabled": {
                setChatDisabled(!!msg.value);
                pushSystemMsg(msg.value ? "Chat has been disabled by the trainer." : "Chat has been re-enabled.");
                break;
              }
              case "allMuted": {
                if (msg.value) {
                  setMicLockedByTrainer(true);
                  const track = localAudioTrackRef.current;
                  if (track) track.mute().catch(() => {});
                  setMicOn(false);
                  syncParticipants();
                  pushSystemMsg("You were muted by the trainer.");
                } else {
                  // "Unmute All" alone doesn't force students live —
                  // it just lifts the trainer-side lock so toggleMic
                  // works again; the student still chooses to unmute.
                  setMicLockedByTrainer(false);
                }
                break;
              }
              case "requestUnmuteAll": {
                setMicLockedByTrainer(false);
                pushSystemMsg("The trainer asked everyone to unmute.");
                break;
              }
              // NEW: camera lock, mirrors "allMuted" exactly. Fixes
              // "Camera Enable/Disable Not Working" — this listener
              // did not exist before, so the trainer's buttons had no
              // effect at all on the student's actual video track.
              case "camerasDisabled": {
                if (msg.value) {
                  setCameraLockedByTrainer(true);
                  const track = localVideoTrackRef.current;
                  if (track) track.mute().catch(() => {});
                  setCamOn(false);
                  syncParticipants();
                  pushSystemMsg("Your camera was disabled by the trainer.");
                } else {
                  // Mirrors "allMuted"/false: lifting the lock doesn't
                  // force the camera back on, it just lets the student
                  // choose to re-enable it themselves.
                  setCameraLockedByTrainer(false);
                  pushSystemMsg("Cameras have been re-enabled by the trainer.");
                }
                break;
              }
              case "screenShareBlocked": {
                setScreenShareBlocked(!!msg.value);
                if (msg.value) {
                  setScreenOn(false);
                  setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
                  room?.localParticipant?.setScreenShareEnabled(false).catch(() => {});
                }
                pushSystemMsg(msg.value ? "Screen sharing has been blocked by the trainer." : "Screen sharing is allowed again.");
                break;
              }
              case "stopScreenShare": {
                // Targeted at one specific student — ignore unless it's us.
                const myIdentity = room?.localParticipant?.identity;
                if (msg.identity && msg.identity === myIdentity) {
                  setScreenOn(false);
                  setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
                  room?.localParticipant?.setScreenShareEnabled(false).catch(() => {});
                  pushSystemMsg("The trainer stopped your screen share.");
                }
                break;
              }
              default:
                break;
            }
            return;
          }

          if (msg.text) {
            setMessages((prev) => [...prev, {
              id: Date.now() + Math.random(),
              name: participant?.name || participant?.identity || "User",
              text: msg.text, self: false, time: nowLabel(),
            }]);
          }
        } catch (_) {}
      });

    await room.connect(LIVEKIT_URL, token);
    setConnected(true);

    try {
      const tracks = await createLocalTracks({ audio: true, video: true });
      for (const track of tracks) {
        await room.localParticipant.publishTrack(track);
        if (track.kind === Track.Kind.Video) localVideoTrackRef.current = track;
        if (track.kind === Track.Kind.Audio) localAudioTrackRef.current = track;
      }
    } catch (err) {
      console.error("getUserMedia failed:", err);
    }

    syncParticipants();
    setRaisedHands({});
    setFloaters([]);
    setChatDisabled(false);
    setMicLockedByTrainer(false);
    setScreenShareBlocked(false);
    setCameraLockedByTrainer(false);
    setActiveMeeting({ role, sessionId, roomName, title, joinedAt: joinedAt || Date.now() });
    setMinimized(false);
    setMessages([{ id: 0, name: "System", text: "Session started. Welcome!", system: true, time: nowLabel() }]);
  }, [activeMeeting, syncParticipants, pushSystemMsg]);

  const leaveMeeting = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    localVideoTrackRef.current?.stop();
    localAudioTrackRef.current?.stop();
    localVideoTrackRef.current = null;
    localAudioTrackRef.current = null;
    setActiveMeeting(null);
    setConnected(false);
    setParticipants([]);
    setMessages([]);
    setRaisedHands({});
    setFloaters([]);
    setChatDisabled(false);
    setMicLockedByTrainer(false);
    setScreenShareBlocked(false);
    setCameraLockedByTrainer(false);
    setMinimized(false);
  }, []);

  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) {
      await track.mute();
    } else {
      if (micLockedByTrainer) {
        pushSystemMsg("You've been muted by the trainer and can't unmute right now.");
        return;
      }
      await track.unmute();
    }
    setMicOn((v) => !v);
    syncParticipants();
  }, [micOn, micLockedByTrainer, pushSystemMsg, syncParticipants]);

  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) {
      await track.mute();
    } else {
      // NEW guard, mirrors toggleMic's micLockedByTrainer check —
      // this is what actually makes "Disable Cameras" stick instead
      // of the student being able to immediately click Camera back on.
      if (cameraLockedByTrainer) {
        pushSystemMsg("Your camera has been disabled by the trainer and can't be turned on right now.");
        return;
      }
      await track.unmute();
    }
    setCamOn((v) => !v);
    syncParticipants();
  }, [camOn, cameraLockedByTrainer, pushSystemMsg, syncParticipants]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    if (!screenOn && screenShareBlocked) {
      pushSystemMsg("Screen sharing has been blocked by the trainer.");
      return;
    }
    try {
      if (screenOn) {
        // FIX: previously this awaited `setScreenShareEnabled(false)`
        // before touching any state, and the layout only updated once
        // the LiveKit "LocalTrackUnpublished" event round-tripped back
        // through syncParticipants(). That round trip is what made the
        // UI feel slow to "snap back" to the normal grid after ending a
        // share (see the reported delay). We now flip `screenOn` and
        // optimistically clear the local participant's screenTrack
        // immediately — before the await — so the spotlight/grid
        // layout switches back the instant the button is pressed. The
        // real unpublish still happens right after; syncParticipants()
        // in `finally` reconciles with the real LiveKit state either
        // way, so this can't get out of sync.
        setScreenOn(false);
        setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
        await room.localParticipant.setScreenShareEnabled(false);
      } else {
        // FIX (recursive "hall of mirrors" screen share): without
        // these options, the browser's share picker lets the student
        // select the very tab/window this meeting is running in,
        // producing an infinite self-capture loop. selfBrowserSurface:
        // "exclude" removes the current tab from the picker entirely
        // in Chromium browsers.
        const pub = await room.localParticipant.setScreenShareEnabled(true, {
          selfBrowserSurface: "exclude",
          surfaceSwitching: "include",
          systemAudio: "exclude",
        });
        if (!pub) return;
        setScreenOn(true);
        pub.track?.mediaStreamTrack?.addEventListener("ended", () => {
          room.localParticipant.setScreenShareEnabled(false).catch(() => {});
          setScreenOn(false);
          setParticipants((prev) => prev.map((p) => (p.isLocal ? { ...p, screenTrack: null } : p)));
          syncParticipants();
        });
      }
    } finally {
      syncParticipants();
    }
  }, [screenOn, screenShareBlocked, pushSystemMsg, syncParticipants]);

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    if (chatDisabled) {
      pushSystemMsg("Chat is disabled by the trainer.");
      return;
    }
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), name: "You", text, self: true, time: nowLabel() }]);
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ text }));
      roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
    } catch (_) {}
  }, [chatDisabled, pushSystemMsg]);

  const toggleHandRaise = useCallback(() => {
    setRaisedHands((prev) => {
      const next = !prev.you;
      pushSystemMsg(next ? "You raised your hand" : "You lowered your hand");
      try {
        const payload = new TextEncoder().encode(JSON.stringify({ type: "raiseHand", raised: next }));
        roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
      } catch (e) {
        console.warn("raise hand send failed:", e);
      }
      return { ...prev, you: next };
    });
  }, [pushSystemMsg]);

  const sendReaction = useCallback((emoji) => {
    const id = ++floaterIdRef.current;
    setFloaters((prev) => [...prev, { id, emoji, name: "You" }]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((f) => f.id !== id));
    }, 2500);
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ type: "reaction", emoji }));
      roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
    } catch (e) {
      console.warn("reaction send failed:", e);
    }
  }, []);

  // Only ever cleans up on a hard app unload — never on route change,
  // because this provider is mounted above the router.
  useEffect(() => () => { roomRef.current?.disconnect(); }, []);

  const value = {
    activeMeeting, minimized, setMinimized,
    connected, micOn, camOn, screenOn, participants, messages,
    raisedHands, floaters,
    chatDisabled, micLockedByTrainer, screenShareBlocked, cameraLockedByTrainer,
    joinMeeting, leaveMeeting, toggleMic, toggleCam, toggleScreen, sendMessage,
    toggleHandRaise, sendReaction,
    room: roomRef.current,
  };

  return (
    <LiveMeetingContext.Provider value={value}>
      {children}
      {/* AUDIO FIX: always mounted, survives every route change and
          every minimized/expanded UI switch. */}
      <RemoteAudioLayer participants={participants} />
    </LiveMeetingContext.Provider>
  );
}

export const useLiveMeeting = () => {
  const ctx = useContext(LiveMeetingContext);
  if (!ctx) throw new Error("useLiveMeeting must be used within LiveMeetingProvider");
  return ctx;
};