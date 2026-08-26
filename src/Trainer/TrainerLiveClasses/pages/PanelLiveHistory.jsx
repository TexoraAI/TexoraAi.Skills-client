import { useState, useEffect } from "react";
import { Video, ChevronDown, Search } from "lucide-react";
import { getSessionHistory, getMyRecordings } from "@/services/liveSessionService";
import { inputStyle } from "../data/utils";
import HistoryRow from "../components/HistoryRow";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelLiveHistory({ t, isDark, navigate, onEditRecording }) {
  const [sessions, setSessions] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const [sessRes, recRes] = await Promise.all([
          getSessionHistory(),
          getMyRecordings(),
        ]);
        setSessions(Array.isArray(sessRes.data) ? sessRes.data : []);
        setRecordings(Array.isArray(recRes.data) ? recRes.data : []);
      } catch (err) {
        console.error(err);
        setSessions([]);
        setRecordings([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recordingBySession = {};
  recordings.forEach((r) => {
    if (r.sessionId && !recordingBySession[r.sessionId])
      recordingBySession[r.sessionId] = r;
  });

  const filtered = sessions.filter((s) => {
    const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const iStyle = inputStyle(t);
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search
            size={13}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: t.textMuted,
            }}
          />
          <input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...iStyle, padding: "9px 14px 9px 34px" }}
          />
        </div>
        <div style={{ position: "relative", minWidth: 160 }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              ...iStyle,
              cursor: "pointer",
              paddingRight: 36,
              width: "auto",
            }}
          >
            <option value="all">All Status</option>
            <option value="LIVE">Live</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ENDED">Completed</option>
          </select>
          <ChevronDown
            size={13}
            color={t.textMuted}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          boxShadow: t.shadow,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  borderRadius: 10,
                  background: t.barBg,
                  animation: "pulse 1.5s ease infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 0",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1.5px dashed ${t.emptyBorder}`,
                background: t.emptyBg,
              }}
            >
              <Video size={22} color={t.emptyIcon} />
            </div>
            <p
              style={{
                fontSize: 12,
                color: t.textMuted,
                fontWeight: FONT_WEIGHT.medium,
                fontFamily: FONT_FAMILY,
                margin: 0,
              }}
            >
              No sessions found
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "4px 10px 8px",
                fontSize: 9,
                fontWeight: FONT_WEIGHT.bold,
                color: t.textMuted,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: FONT_FAMILY,
              }}
              className="rlc-hide-sm"
            >
              <span style={{ flex: "2 1 200px" }}>Session</span>
              <span style={{ flex: "1 1 140px" }}>Date &amp; Time</span>
              <span style={{ flex: "0 0 100px" }}>Duration</span>
              <span style={{ flex: "0 0 110px" }}>Status</span>
              <span style={{ flex: "0 0 auto" }}>Actions</span>
            </div>
            {filtered.map((s) => (
              <HistoryRow
                key={s.id}
                session={s}
                t={t}
                navigate={navigate}
                recording={recordingBySession[s.id] ?? null}
                onViewRecording={onEditRecording}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
