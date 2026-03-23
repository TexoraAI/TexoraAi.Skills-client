import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";

import "@livekit/components-styles";

const LiveKitRoomComponent = ({ token }) => {
  const serverUrl =  import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880";

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      style={{ height: "100%", width: "100%" }}
    >
      <VideoConference />

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default LiveKitRoomComponent;
