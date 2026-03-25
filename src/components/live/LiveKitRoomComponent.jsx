// import {
//   LiveKitRoom,
//   RoomAudioRenderer,
//   VideoConference,
// } from "@livekit/components-react";

// import "@livekit/components-styles";

// const LiveKitRoomComponent = ({ token }) => {
//   const serverUrl =  import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

//   return (
//     <LiveKitRoom
//       token={token}
//       serverUrl={serverUrl}
//       connect={true}
//       video={true}
//       audio={true}
//       style={{ height: "100%", width: "100%" }}
//     >
//       <VideoConference />

//       <RoomAudioRenderer />
//     </LiveKitRoom>
//   );
// };

// export default LiveKitRoomComponent;











import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

const LiveKitRoomComponent = ({ token, onLeave }) => {
  const serverUrl = import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  return (
    <>
      {/* ── Global style overrides so VideoConference fills the screen ── */}
      <style>{`
        /* Force livekit root to fill whatever parent it's in */
        .lk-room-container,
        [data-lk-theme] {
          height: 100% !important;
          width: 100% !important;
          min-height: 0 !important;
        }

        /* Fix chat sidebar — sometimes gets display:none from parent overflow */
        .lk-chat {
          display: flex !important;
          flex-direction: column !important;
        }

        /* Ensure control bar is always visible and not clipped */
        .lk-control-bar {
          flex-shrink: 0 !important;
          z-index: 100 !important;
        }

        /* People/Participants panel */
        .lk-participant-tile,
        .lk-focus-layout,
        .lk-grid-layout {
          min-height: 0 !important;
        }

        /* Prevent sidebar from overflowing */
        .lk-sidebar {
          overflow: hidden !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>

      {/*
        Wrapper div — MUST be position:fixed or 100vh/100vw.
        If your app wraps this in a <main> or <div> with padding/overflow,
        the VideoConference UI gets clipped. This wrapper escapes that.
      */}
      <div
        style={{
          position: "fixed",
          inset: 0,               /* top:0 right:0 bottom:0 left:0 */
          zIndex: 1000,
          background: "#000",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          video={true}
          audio={true}
          onDisconnected={onLeave}   /* calls onLeave when user clicks Leave */
          style={{ height: "100%", width: "100%", flex: 1, minHeight: 0 }}
        >
          {/*
            VideoConference renders:
              ✅ Camera grid
              ✅ Screen share
              ✅ Chat sidebar
              ✅ Participants sidebar
              ✅ Control bar (mic, cam, screen share, chat, people, leave)
          */}
          <VideoConference />

          {/* Required for remote audio to play */}
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </>
  );
};

export default LiveKitRoomComponent;