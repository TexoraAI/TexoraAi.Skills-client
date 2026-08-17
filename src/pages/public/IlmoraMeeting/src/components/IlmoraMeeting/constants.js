export const REACTIONS = ["👍", "❤️", "😂", "😮", "👏", "🎉"];
export const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const LOBBY_POLL_MS = 3000;
export const WAITING_ROOM_POLL_MS = 4000;
export const MEETING_STATUS_POLL_MS = 15000;
