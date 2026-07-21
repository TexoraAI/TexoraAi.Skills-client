// import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
// import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";

// const LiveMeetingContext = createContext(null);
// const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

// export function LiveMeetingProvider({ children }) {
//   const roomRef = useRef(null);
//   const localVideoTrackRef = useRef(null);
//   const localAudioTrackRef = useRef(null);

//   const [activeMeeting, setActiveMeeting] = useState(null); // { role, sessionId, roomName, title, joinedAt }
//   const [minimized, setMinimized] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);
//   const [screenOn, setScreenOn] = useState(false);
//   const [participants, setParticipants] = useState([]);
//   const [messages, setMessages] = useState([]);

//   const syncParticipants = useCallback(() => {
//     const room = roomRef.current;
//     if (!room) return;
//     const list = [];
//     const lp = room.localParticipant;
//     const localEntry = {
//       identity: lp.identity || "you", name: "You", isLocal: true,
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
//         identity: p.identity, name: p.name || p.identity, isLocal: false,
//         cameraTrack: null, cameraMuted: true, micTrack: null, micMuted: true, screenTrack: null,
//       };
//       p.trackPublications.forEach((pub) => {
//         if (!pub.isSubscribed || !pub.track) return;
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
//       id: Date.now(), name: "System", text, system: true,
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     }]);
//   }, []);

//   // ── Join (called once per session; re-entering an already-active
//   // meeting just un-minimizes it instead of reconnecting) ──────────
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
//       .on(RoomEvent.ParticipantDisconnected, (p) => { syncParticipants(); pushSystemMsg(`${p.name || p.identity} left`); })
//       .on(RoomEvent.Disconnected, () => setConnected(false))
//       .on(RoomEvent.DataReceived, (payload, participant) => {
//         try {
//           const msg = JSON.parse(new TextDecoder().decode(payload));
//           if (msg.text) {
//             setMessages((prev) => [...prev, {
//               id: Date.now(), name: participant?.name || participant?.identity || "User",
//               text: msg.text, self: false,
//               time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
//     setActiveMeeting({ role, sessionId, roomName, title, joinedAt: joinedAt || Date.now() });
//     setMinimized(false);
//     setMessages([{ id: 0, name: "System", text: "Session started. Welcome!", system: true,
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
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
//         await room.localParticipant.setScreenShareEnabled(false);
//         setScreenOn(false);
//       } else {
//         const pub = await room.localParticipant.setScreenShareEnabled(true);
//         if (!pub) return;
//         setScreenOn(true);
//         pub.track?.mediaStreamTrack?.addEventListener("ended", () => {
//           room.localParticipant.setScreenShareEnabled(false).catch(() => {});
//           setScreenOn(false);
//           syncParticipants();
//         });
//       }
//     } finally {
//       syncParticipants();
//     }
//   }, [screenOn, syncParticipants]);

//   const sendMessage = useCallback((text) => {
//     if (!text?.trim()) return;
//     setMessages((prev) => [...prev, { id: Date.now(), name: "You", text, self: true,
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
//     try {
//       const payload = new TextEncoder().encode(JSON.stringify({ text }));
//       roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
//     } catch (_) {}
//   }, []);

//   // Only ever cleans up on a hard app unload — never on route change,
//   // because this provider is mounted above the router.
//   useEffect(() => () => { roomRef.current?.disconnect(); }, []);

//   const value = {
//     activeMeeting, minimized, setMinimized,
//     connected, micOn, camOn, screenOn, participants, messages,
//     joinMeeting, leaveMeeting, toggleMic, toggleCam, toggleScreen, sendMessage,
//     room: roomRef.current,
//   };

//   return <LiveMeetingContext.Provider value={value}>{children}</LiveMeetingContext.Provider>;
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

  // 👇 raised-hand map: identity -> true/false, driven by broadcast data
  const [raisedHands, setRaisedHands] = useState({});
  // 👇 floating emoji reactions, auto-expire after a few seconds
  const [floaters, setFloaters] = useState([]);

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
        if (!pub.isSubscribed || !pub.track) return;
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

  // ── Join (called once per session; re-entering an already-active
  // meeting just un-minimizes it instead of reconnecting) ──────────
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
        // clean up their raised-hand state if they had one set
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

          // Emoji reaction — floats on the stage, auto-expires
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

          // Raise-hand broadcast
          if (msg.type === "raiseHand") {
            const identity = participant?.identity;
            if (identity) {
              setRaisedHands((prev) => ({ ...prev, [identity]: !!msg.raised }));
              pushSystemMsg(`${participant?.name || identity} ${msg.raised ? "raised" : "lowered"} their hand`);
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
    setMinimized(false);
  }, []);

  const toggleMic = useCallback(async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;
    if (micOn) await track.mute(); else await track.unmute();
    setMicOn((v) => !v);
    syncParticipants();
  }, [micOn, syncParticipants]);

  const toggleCam = useCallback(async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    if (camOn) await track.mute(); else await track.unmute();
    setCamOn((v) => !v);
    syncParticipants();
  }, [camOn, syncParticipants]);

  const toggleScreen = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      if (screenOn) {
        await room.localParticipant.setScreenShareEnabled(false);
        setScreenOn(false);
      } else {
        const pub = await room.localParticipant.setScreenShareEnabled(true);
        if (!pub) return;
        setScreenOn(true);
        pub.track?.mediaStreamTrack?.addEventListener("ended", () => {
          room.localParticipant.setScreenShareEnabled(false).catch(() => {});
          setScreenOn(false);
          syncParticipants();
        });
      }
    } finally {
      syncParticipants();
    }
  }, [screenOn, syncParticipants]);

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), name: "You", text, self: true, time: nowLabel() }]);
    try {
      const payload = new TextEncoder().encode(JSON.stringify({ text }));
      roomRef.current?.localParticipant?.publishData(payload, { reliable: true });
    } catch (_) {}
  }, []);

  // 👇 Raise hand — single owning Room, so this is actually seen by
  // every other participant (unlike a component-local room would be).
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

  // 👇 Emoji reaction — broadcasts + shows locally immediately (no
  // need to wait for the round-trip through LiveKit for your own UI).
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
    joinMeeting, leaveMeeting, toggleMic, toggleCam, toggleScreen, sendMessage,
    toggleHandRaise, sendReaction,
    room: roomRef.current,
  };

  return <LiveMeetingContext.Provider value={value}>{children}</LiveMeetingContext.Provider>;
}

export const useLiveMeeting = () => {
  const ctx = useContext(LiveMeetingContext);
  if (!ctx) throw new Error("useLiveMeeting must be used within LiveMeetingProvider");
  return ctx;
};