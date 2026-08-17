import { Room, Track } from "livekit-client";

/* Builds the flat participant list (with tracks) from the raw LiveKit
   Room, the same shape LiveRoom.jsx's context normally provides — but
   derived locally here since this page owns the Room itself. */
export function buildParticipantList(room, raisedHands, speakingSet) {
  if (!room) return [];
  const list = [];
  const addOne = (participant, isLocal) => {
    const videoPubs = Array.from(
      participant.videoTrackPublications?.values?.() || [],
    );
    const audioPubs = Array.from(
      participant.audioTrackPublications?.values?.() || [],
    );
    const camPub = videoPubs.find((p) => p.source === Track.Source.Camera);
    const screenPub = videoPubs.find(
      (p) => p.source === Track.Source.ScreenShare,
    );
    const micPub = audioPubs.find((p) => p.source === Track.Source.Microphone);
    const identity = isLocal ? participant.identity : participant.identity;

    list.push({
      identity,
      name: participant.name || participant.identity || "Guest",
      isLocal,
      isHost: !!participant.metadata && safeParse(participant.metadata)?.isHost,
      avatarSeed: safeParse(participant.metadata)?.avatarSeed || null,
      cameraTrack: camPub?.track || null,
      cameraMuted: !camPub || !!camPub.isMuted || !camPub.track,
      screenTrack: screenPub?.track || null,
      micTrack: !isLocal ? micPub?.track || null : null,
      micMuted: micPub ? !!micPub.isMuted : true,
      isSpeaking: speakingSet?.has(identity) || false,
    });
  };

  addOne(room.localParticipant, true);
  room.remoteParticipants.forEach((p) => addOne(p, false));
  // Layout must stay stable — tiles never reorder based on who's
  // speaking. Active speaker is indicated only visually (im-speaking
  // glow class on the tile), never by moving its position.
  return list;
}

export function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
}
