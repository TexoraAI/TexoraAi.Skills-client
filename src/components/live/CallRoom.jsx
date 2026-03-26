// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Room,
//   RoomEvent,
//   Track,
//   createLocalVideoTrack,
//   createLocalAudioTrack,
// } from "livekit-client";

// const CallRoom = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const livekitRoomRef = useRef(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const [status, setStatus] = useState("Connecting...");
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [remoteConnected, setRemoteConnected] = useState(false);

//   useEffect(() => {
//     const room = location.state?.room;
//     const token = location.state?.token;

//     if (!room || !token) {
//       alert("Missing room or token. Please try again.");
//       navigate(-1);
//       return;
//     }

//     const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//     const livekitRoom = new Room({
//       adaptiveStream: true,
//       dynacast: true,
//     });

//     livekitRoomRef.current = livekitRoom;

//     // ─── Remote participant joined ───────────────────────────────────────────
//     livekitRoom.on(
//       RoomEvent.TrackSubscribed,
//       (track, _publication, participant) => {
//         console.log(
//           "Remote track subscribed:",
//           track.kind,
//           participant.identity,
//         );

//         if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
//           track.attach(remoteVideoRef.current);
//           setRemoteConnected(true);
//           setStatus("Call Connected");
//         }

//         if (track.kind === Track.Kind.Audio) {
//           const audioEl = track.attach();
//           document.body.appendChild(audioEl);
//         }
//       },
//     );

//     livekitRoom.on(RoomEvent.TrackUnsubscribed, (track) => {
//       track.detach();
//     });

//     livekitRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
//       console.log("Participant left:", participant.identity);
//       setStatus("Call Ended — Other participant left");
//       setRemoteConnected(false);
//     });

//     livekitRoom.on(RoomEvent.Disconnected, () => {
//       console.log("Room disconnected");
//       setStatus("Disconnected");
//     });

//     // ─── Connect & publish local tracks ─────────────────────────────────────
//     const joinRoom = async () => {
//       try {
//         setStatus("Connecting...");

//         await livekitRoom.connect(serverUrl, token);
//         console.log("Connected to room:", room);
//         setStatus("Waiting for other participant...");

//         // Local video
//         const videoTrack = await createLocalVideoTrack();
//         await livekitRoom.localParticipant.publishTrack(videoTrack);
//         if (localVideoRef.current) {
//           videoTrack.attach(localVideoRef.current);
//         }

//         // Local audio
//         const audioTrack = await createLocalAudioTrack();
//         await livekitRoom.localParticipant.publishTrack(audioTrack);
//       } catch (err) {
//         console.error("LiveKit Error:", err);
//         setStatus("Connection failed. Please try again.");
//       }
//     };

//     joinRoom();

//     // ─── Cleanup on unmount ──────────────────────────────────────────────────
//     return () => {
//       console.log("Cleaning up LiveKit room...");
//       livekitRoom.disconnect();
//     };
//   }, []);

//   // ─── Toggle Mute ────────────────────────────────────────────────────────────
//   const toggleMute = async () => {
//     const room = livekitRoomRef.current;
//     if (!room) return;
//     const enabled = room.localParticipant.isMicrophoneEnabled;
//     await room.localParticipant.setMicrophoneEnabled(!enabled);
//     setIsMuted(enabled); // if was enabled, now muted
//   };

//   // ─── Toggle Camera ──────────────────────────────────────────────────────────
//   const toggleCamera = async () => {
//     const room = livekitRoomRef.current;
//     if (!room) return;
//     const enabled = room.localParticipant.isCameraEnabled;
//     await room.localParticipant.setCameraEnabled(!enabled);
//     setIsCameraOff(enabled);
//   };

//   // ─── End Call ───────────────────────────────────────────────────────────────
//   const endCall = () => {
//     livekitRoomRef.current?.disconnect();
//     navigate(-1);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white relative">
//       {/* Status Banner */}
//       <div className="absolute top-6 text-center">
//         <p className="text-lg font-semibold tracking-wide">{status}</p>
//       </div>

//       {/* Video Grid */}
//       <div className="flex gap-4 w-full max-w-4xl px-4">
//         {/* Remote Video */}
//         <div className="flex-1 bg-gray-800 rounded-2xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
//           {!remoteConnected && (
//             <p className="text-gray-400 text-sm absolute">
//               Waiting for other participant...
//             </p>
//           )}
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Local Video (picture-in-picture style) */}
//         <div className="w-48 h-36 bg-gray-700 rounded-xl overflow-hidden self-end shadow-lg">
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             muted
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex gap-6 mt-8">
//         {/* Mute Button */}
//         <button
//           onClick={toggleMute}
//           className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
//             isMuted
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-gray-600 hover:bg-gray-500"
//           }`}
//           title={isMuted ? "Unmute" : "Mute"}
//         >
//           {isMuted ? "🔇" : "🎙️"}
//         </button>

//         {/* End Call Button */}
//         <button
//           onClick={endCall}
//           className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-2xl shadow-lg transition-all"
//           title="End Call"
//         >
//           📵
//         </button>

//         {/* Camera Button */}
//         <button
//           onClick={toggleCamera}
//           className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
//             isCameraOff
//               ? "bg-red-500 hover:bg-red-600"
//               : "bg-gray-600 hover:bg-gray-500"
//           }`}
//           title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
//         >
//           {isCameraOff ? "🚫" : "📷"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CallRoom;
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Room,
  RoomEvent,
  Track,
  createLocalVideoTrack,
  createLocalAudioTrack,
} from "livekit-client";

// ✅ role = "student" | "trainer"
const CallRoom = ({ role = "student" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const livekitRoomRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [status, setStatus] = useState("Connecting...");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    // ✅ Try location.state first, then sessionStorage fallback
    let room = location.state?.room;
    let token = location.state?.token;

    // ✅ Fallback: read from sessionStorage (set before navigate)
    if (!room || !token) {
      try {
        const saved = sessionStorage.getItem("call_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          room = parsed.room;
          token = parsed.token;
        }
      } catch {}
    }

    console.log("CallRoom state:", {
      room,
      token: token ? "present" : "missing",
    });

    if (!room || !token) {
      alert("Missing room or token. Please try again.");
      navigate(-1);
      return;
    }

    // ✅ Clear sessionStorage after reading
    sessionStorage.removeItem("call_state");

    const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

    const livekitRoom = new Room({ adaptiveStream: true, dynacast: true });
    livekitRoomRef.current = livekitRoom;

    livekitRoom.on(RoomEvent.TrackSubscribed, (track, _pub, participant) => {
      console.log("Remote track:", track.kind, participant.identity);

      if (track.kind === Track.Kind.Video && remoteVideoRef.current) {
        track.attach(remoteVideoRef.current);
        setRemoteConnected(true);
        setStatus("Call Connected ✅");
      }

      if (track.kind === Track.Kind.Audio) {
        const audioEl = track.attach();
        document.body.appendChild(audioEl);
      }
    });

    livekitRoom.on(RoomEvent.TrackUnsubscribed, (track) => track.detach());

    livekitRoom.on(RoomEvent.ParticipantDisconnected, () => {
      setStatus("Other participant left");
      setRemoteConnected(false);
    });

    livekitRoom.on(RoomEvent.Disconnected, () => setStatus("Disconnected"));

    const joinRoom = async () => {
      try {
        setStatus("Connecting...");
        await livekitRoom.connect(serverUrl, token);
        console.log("Connected to room:", room);
        setStatus("Waiting for other participant...");

        const videoTrack = await createLocalVideoTrack();
        await livekitRoom.localParticipant.publishTrack(videoTrack);
        if (localVideoRef.current) videoTrack.attach(localVideoRef.current);

        const audioTrack = await createLocalAudioTrack();
        await livekitRoom.localParticipant.publishTrack(audioTrack);
      } catch (err) {
        console.error("LiveKit Error:", err);
        setStatus("Connection failed: " + err.message);
      }
    };

    joinRoom();

    return () => {
      console.log("Cleanup LiveKit room");
      livekitRoom.disconnect();
    };
  }, []);

  const toggleMute = async () => {
    const r = livekitRoomRef.current;
    if (!r) return;
    const enabled = r.localParticipant.isMicrophoneEnabled;
    await r.localParticipant.setMicrophoneEnabled(!enabled);
    setIsMuted(enabled);
  };

  const toggleCamera = async () => {
    const r = livekitRoomRef.current;
    if (!r) return;
    const enabled = r.localParticipant.isCameraEnabled;
    await r.localParticipant.setCameraEnabled(!enabled);
    setIsCameraOff(enabled);
  };

  const endCall = () => {
    livekitRoomRef.current?.disconnect();
    // ✅ Navigate to correct page based on role
    if (role === "trainer") {
      navigate("/trainer/join-call");
    } else {
      navigate("/student/call-trainer");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white relative">
      <div className="absolute top-6 text-center">
        <p className="text-lg font-semibold tracking-wide">{status}</p>
      </div>

      <div className="flex gap-4 w-full max-w-4xl px-4">
        {/* Remote Video */}
        <div className="flex-1 bg-gray-800 rounded-2xl overflow-hidden relative min-h-[400px] flex items-center justify-center">
          {!remoteConnected && (
            <p className="text-gray-400 text-sm absolute">
              Waiting for other participant...
            </p>
          )}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Local Video */}
        <div className="w-48 h-36 bg-gray-700 rounded-xl overflow-hidden self-end shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
            isMuted
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isMuted ? "🔇" : "🎙️"}
        </button>

        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-2xl shadow-lg transition-all"
        >
          📵
        </button>

        <button
          onClick={toggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${
            isCameraOff
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isCameraOff ? "🚫" : "📷"}
        </button>
      </div>
    </div>
  );
};

export default CallRoom;
