import { AudioTrackEl } from "./AudioTrackEl";

// Always mounts an <audio> element for every remote participant's mic
// track, independent of tile visibility (grid cap, stage/strip split,
// screen-share mode). Tile rendering must never gate audio playback.
export function RemoteAudioRenderer({ participants }) {
  return (
    <>
      {participants
        .filter((p) => !p.isLocal && p.micTrack)
        .map((p) => (
          <AudioTrackEl key={p.identity} track={p.micTrack} />
        ))}
    </>
  );
}