// import { useEffect } from "react";
// import { Room, createLocalTracks } from "livekit-client";

// const LiveRoom = ({ token }) => {
//   useEffect(() => {
//     const start = async () => {
//       const room = new Room();

//       await room.connect("ws://localhost:7880", token);

//       const tracks = await createLocalTracks({
//         audio: true,
//         video: true,
//       });

//       tracks.forEach((track) => {
//         room.localParticipant.publishTrack(track);
//       });

//       room.on("trackSubscribed", (track) => {
//         const el = track.attach();
//         document.getElementById("remote").appendChild(el);
//       });
//     };

//     start();
//   }, [token]);

//   return (
//     <div className="h-screen">
//       <div id="remote" className="h-full bg-black"></div>
//     </div>
//   );
// };

// export default LiveRoom; shareef1













// import { useEffect, useRef } from "react";
// import { Room, createLocalTracks } from "livekit-client";

// const LiveRoom = ({ token }) => {
//   const roomRef = useRef(null);

//   useEffect(() => {
//     const start = async () => {
//       const room = new Room();
//       roomRef.current = room;

//       const serverUrl =
//         import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//       try {
//         await room.connect(serverUrl, token);

//         const tracks = await createLocalTracks({
//           audio: true,
//           video: true,
//         });

//         tracks.forEach((track) => {
//           room.localParticipant.publishTrack(track);
//         });

//         room.on("trackSubscribed", (track) => {
//           const el = track.attach();
//           document.getElementById("remote").appendChild(el);
//         });
//       } catch (error) {
//         console.error("LiveKit connection error:", error);
//       }
//     };

//     start();

//     // CLEANUP (VERY IMPORTANT)
//     return () => {
//       if (roomRef.current) {
//         roomRef.current.disconnect();
//       }
//     };
//   }, [token]);

//   return (
//     <div className="h-screen">
//       <div id="remote" className="h-full bg-black"></div>
//     </div>
//   );
// };

// export default LiveRoom;2

















import { useEffect, useRef } from "react";
import { Room, createLocalTracks } from "livekit-client";

const LiveRoom = ({ token }) => {
  const roomRef      = useRef(null);
  const remoteRef    = useRef(null); // ✅ FIX: ref instead of getElementById
  const localRef     = useRef(null); // ✅ FIX: show student's own camera

  useEffect(() => {
    const start = async () => {
      const room = new Room();
      roomRef.current = room;

      const serverUrl =
        import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

      try {
        await room.connect(serverUrl, token);

        const tracks = await createLocalTracks({
          audio: true,
          video: true,
        });

        tracks.forEach((track) => {
          room.localParticipant.publishTrack(track);

          // ✅ FIX: attach local video to localRef
          if (track.kind === "video" && localRef.current) {
            const el = track.attach();
            el.style.width        = "100%";
            el.style.height       = "100%";
            el.style.objectFit    = "cover";
            el.style.transform    = "scaleX(-1)"; // mirror
            el.style.borderRadius = "0";
            localRef.current.innerHTML = "";
            localRef.current.appendChild(el);
          }
        });

        // ✅ FIX: use remoteRef instead of document.getElementById
        room.on("trackSubscribed", (track) => {
          if (remoteRef.current) {
            const el = track.attach();
            el.style.width     = "100%";
            el.style.height    = "100%";
            el.style.objectFit = "cover";
            remoteRef.current.appendChild(el);
          }
        });

        room.on("trackUnsubscribed", (track) => {
          track.detach();
        });

      } catch (error) {
        console.error("LiveKit connection error:", error);
      }
    };

    start();

    // CLEANUP (VERY IMPORTANT)
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, [token]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#000" }}>

      {/* Remote (Trainer) video — full area */}
      <div
        ref={remoteRef}
        style={{ width: "100%", height: "100%", background: "#000" }}
      />

      {/* Local (Student) PIP — bottom right */}
      <div
        style={{
          position : "absolute",
          bottom   : 16,
          right    : 16,
          width    : 160,
          height   : 110,
          borderRadius : 12,
          overflow : "hidden",
          border   : "2px solid rgba(255,255,255,0.2)",
          background : "#111",
          boxShadow  : "0 4px 20px rgba(0,0,0,0.6)",
          zIndex   : 10,
        }}
      >
        <div ref={localRef} style={{ width: "100%", height: "100%" }} />
        <span style={{
          position   : "absolute",
          bottom     : 5,
          left       : 8,
          fontSize   : 10,
          color      : "#fff",
          background : "rgba(0,0,0,0.55)",
          padding    : "1px 6px",
          borderRadius : 4,
        }}>
          You
        </span>
      </div>
    </div>
  );
};

export default LiveRoom;