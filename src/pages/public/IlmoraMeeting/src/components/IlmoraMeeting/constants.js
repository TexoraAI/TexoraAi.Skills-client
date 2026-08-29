export const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
export const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const LOBBY_POLL_MS = 3000;
// Was 4000ms — at that interval alone, a host could wait up to 4s just to
// learn a new join request exists, before any notification/chime logic
// even runs. Tightened so "Join Request" notifications feel near-instant.
export const WAITING_ROOM_POLL_MS = 1500;
export const MEETING_STATUS_POLL_MS = 15000;
// Phase 1 — join notification tune: join events that land within this
// window of each other are treated as "one batch" and produce a single
// chime instead of one per person. Events further apart than this get
// their own separate chime.
export const JOIN_CHIME_BATCH_MS = 900;
// Phase 2 — Raise Hand notification tune: same "batch the audio, not the
// events" idea as JOIN_CHIME_BATCH_MS. 2-4 hands raised within this window
// of each other still produce exactly one chime; hands raised further apart
// than this each get their own separate, immediate chime.
export const RAISE_HAND_CHIME_BATCH_MS = 900;