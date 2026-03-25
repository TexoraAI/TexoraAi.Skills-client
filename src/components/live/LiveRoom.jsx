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
import { Room, RoomEvent, Track, createLocalTracks } from "livekit-client";

/* ================================================================
   HELPER — safely attach a track element into a container div
================================================================ */
const attachTrack = (track, container) => {
  if (!container) return;
  const el = track.attach();

  if (track.kind === Track.Kind.Video) {
    el.style.width      = "100%";
    el.style.height     = "100%";
    el.style.objectFit  = "cover";
    el.style.display    = "block";
  }
  // Audio elements don't need visual styling — just append
  container.appendChild(el);
};

/* ================================================================
   MAIN COMPONENT
================================================================ */
const LiveRoom = ({ token }) => {
  const roomRef   = useRef(null);
  const remoteRef = useRef(null); // trainer video/audio container
  const localRef  = useRef(null); // student's own PIP video

  useEffect(() => {
    const start = async () => {
      const room = new Room({
        // ✅ Auto-subscribe to all remote tracks
        adaptiveStream : true,
        dynacast       : true,
      });
      roomRef.current = room;

      const serverUrl =
        import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

      try {
        /* ── 1. Connect ── */
        await room.connect(serverUrl, token);
        console.log("✅ LiveRoom connected");

        /* ── 2. Publish local (student) tracks ── */
        const tracks = await createLocalTracks({ audio: true, video: true });

        for (const track of tracks) {
          await room.localParticipant.publishTrack(track);

          // Show student's own video in PIP
          if (track.kind === Track.Kind.Video && localRef.current) {
            const el = track.attach();
            el.style.width        = "100%";
            el.style.height       = "100%";
            el.style.objectFit    = "cover";
            el.style.transform    = "scaleX(-1)"; // mirror
            el.style.display      = "block";
            localRef.current.innerHTML = "";
            localRef.current.appendChild(el);
          }
        }

        /* ── 3. Attach ALREADY-PUBLISHED remote tracks ──
               (trainer joined before student → tracks already exist) */
        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((pub) => {
            if (pub.isSubscribed && pub.track) {
              console.log("✅ Attaching existing track:", pub.track.kind);
              attachTrack(pub.track, remoteRef.current);
            }
          });
        });

        /* ── 4. Listen for NEW remote tracks (joins after student) ── */
        room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          console.log("✅ TrackSubscribed:", track.kind, "from", participant.identity);
          attachTrack(track, remoteRef.current);
        });

        /* ── 5. Cleanup detached tracks ── */
        room.on(RoomEvent.TrackUnsubscribed, (track) => {
          track.detach().forEach((el) => el.remove());
        });

      } catch (error) {
        console.error("❌ LiveKit connection error:", error);
      }
    };

    start();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        console.log("🔌 LiveRoom disconnected");
      }
    };
  }, [token]);

  /* ── UI ── */
  return (
    <div style={{
      position   : "relative",
      width      : "100%",
      height     : "100%",
      background : "#000",
      overflow   : "hidden",
    }}>

      {/* ── Trainer video + audio (remote tracks go here) ── */}
      <div
        ref={remoteRef}
        style={{ width: "100%", height: "100%", background: "#000" }}
      />

      {/* ── Student's own camera — PIP bottom-right ── */}
      <div style={{
        position     : "absolute",
        bottom       : 16,
        right        : 16,
        width        : 160,
        height       : 110,
        borderRadius : 12,
        overflow     : "hidden",
        border       : "2px solid rgba(255,255,255,0.2)",
        background   : "#111",
        boxShadow    : "0 4px 20px rgba(0,0,0,0.6)",
        zIndex       : 10,
      }}>
        <div ref={localRef} style={{ width: "100%", height: "100%" }} />
        <span style={{
          position     : "absolute",
          bottom       : 5,
          left         : 8,
          fontSize     : 10,
          color        : "#fff",
          background   : "rgba(0,0,0,0.55)",
          padding      : "1px 6px",
          borderRadius : 4,
        }}>
          You
        </span>
      </div>
    </div>
  );
};

export default LiveRoom;