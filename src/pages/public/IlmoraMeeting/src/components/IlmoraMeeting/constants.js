
export const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
export const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const LOBBY_POLL_MS = 3000;
export const WAITING_ROOM_POLL_MS = 4000;
export const MEETING_STATUS_POLL_MS = 15000;
// Phase 1 — join notification tune: join events that land within this
// window of each other are treated as "one batch" and produce a single
// chime instead of one per person. Events further apart than this get
// their own separate chime.
export const JOIN_CHIME_BATCH_MS = 900;