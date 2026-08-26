export const DEFAULT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export const genRoomId = () =>
  "ROOM-" + Math.random().toString(36).slice(2, 10).toUpperCase();

export const inputStyle = (t) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${t.inputBorder}`,
  background: t.inputBg,
  color: t.inputText,
  fontSize: 12,
  fontFamily: "'Poppins',sans-serif",
  fontWeight: 500,
  outline: "none",
  transition: "border 0.2s",
  appearance: "none",
});
export const labelStyle = (t) => ({
  fontSize: 10,
  fontWeight: 600,
  color: t.labelColor,
  fontFamily: "'Poppins',sans-serif",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
});

export const getTrainerEmail = () => {
  try {
    const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
    return u.email || null;
  } catch {
    return null;
  }
};

export function unwrapBatches(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.batches)) return raw.batches;
  if (Array.isArray(raw.content)) return raw.content;
  return [];
}

export function getBatchId(b) {
  return String(b.id ?? b.batchId ?? b.batch_id ?? b.BatchId ?? "");
}

export function getBatchName(b, id) {
  return b.name ?? b.batchName ?? b.batch_name ?? b.BatchName ?? `Batch ${id}`;
}

export function parseScheduledDateTime(session) {
  const rawDate = session.scheduledDate ?? session.date ?? "";
  const rawTime = session.scheduledTime ?? session.time ?? "";
  if (!rawDate || !rawTime) return null;
  let dateStr = String(rawDate).trim();
  if (/^\d{8}$/.test(dateStr))
    dateStr = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  let timeStr = String(rawTime).trim();
  if (/^\d{4}$/.test(timeStr))
    timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
  if (/^\d{2}\d{2}:\d{2}$/.test(timeStr))
    timeStr = `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
  // ✅ NEW — if the session carries a timezone, interpret date/time in THAT zone
  if (session.timezone) {
    const dt = zonedDateTimeToUTC(dateStr, timeStr, session.timezone);
    return dt && !isNaN(dt.getTime()) ? dt : null;
  }
  // Legacy fallback for sessions created before this feature existed
  const dt = new Date(`${dateStr}T${timeStr}`);
  return isNaN(dt.getTime()) ? null : dt;
}

export function zonedDateTimeToUTC(dateStr, timeStr, tz) {
  if (!dateStr || !timeStr) return null;
  const naiveUTC = new Date(`${dateStr}T${timeStr}:00Z`);
  const offsetMin = getTzOffsetMinutes(tz, naiveUTC);
  return new Date(naiveUTC.getTime() - offsetMin * 60000);
}

export function getTzOffsetMinutes(tz, atDate = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(atDate)
      .reduce((acc, p) => {
        acc[p.type] = p.value;
        return acc;
      }, {});
    const asUTC = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    return Math.round((asUTC - atDate.getTime()) / 60000);
  } catch {
    return 0;
  }
}

export function formatTzOffset(mins) {
  const sign = mins >= 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ":" + String(m).padStart(2, "0") : ""}`;
}

export function canShowGoLive(session) {
  if (session.status !== "SCHEDULED") return false;
  const scheduledAt = parseScheduledDateTime(session);
  if (!scheduledAt) return true;
  const now = new Date();
  const diffMinutes = (scheduledAt.getTime() - now.getTime()) / (1000 * 60);
  if (session.createdAt) {
    const createdAt = new Date(session.createdAt);
    const gapFromCreation =
      (scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60);
    if (gapFromCreation < 15) return diffMinutes <= 0;
  }
  return diffMinutes <= 15;
}

export function getGoLiveCountdown(session) {
  const scheduledAt = parseScheduledDateTime(session);
  if (!scheduledAt) return null;
  const now = new Date();
  if (session.createdAt) {
    const createdAt = new Date(session.createdAt);
    const gapFromCreation =
      (scheduledAt.getTime() - createdAt.getTime()) / (1000 * 60);
    if (gapFromCreation < 15) {
      const diffMs = scheduledAt.getTime() - now.getTime();
      if (diffMs <= 0) return null;
      const mins = Math.ceil(diffMs / (1000 * 60));
      const secs = Math.ceil((diffMs % (1000 * 60)) / 1000);
      return mins <= 1 ? `in ${secs}s` : `in ${mins}m`;
    }
  }
  const diffMs = scheduledAt.getTime() - now.getTime();
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));
  if (diffMinutes > 15) {
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
  }
  return null;
}
