import { useEffect } from "react";
import { Room, createLocalTracks } from "livekit-client";

const LiveRoom = ({ token }) => {
  useEffect(() => {
    const start = async () => {
      const room = new Room();

      await room.connect("ws://localhost:7880", token);

      const tracks = await createLocalTracks({
        audio: true,
        video: true,
      });

      tracks.forEach((track) => {
        room.localParticipant.publishTrack(track);
      });

      room.on("trackSubscribed", (track) => {
        const el = track.attach();
        document.getElementById("remote").appendChild(el);
      });
    };

    start();
  }, [token]);

  return (
    <div className="h-screen">
      <div id="remote" className="h-full bg-black"></div>
    </div>
  );
};

export default LiveRoom;
