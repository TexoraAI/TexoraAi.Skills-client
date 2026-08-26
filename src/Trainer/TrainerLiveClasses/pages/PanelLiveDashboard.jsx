import { useState, useEffect } from "react";
import { Video, BarChart3, Circle, Calendar, Users, Radio, ChevronDown, Check } from "lucide-react";
import { getSessionHistory, endLiveSession, deleteLiveSession, startLiveSessionWithToken } from "@/services/liveSessionService";
import StatCard from "../components/StatCard";
import SessionRow from "../components/SessionRow";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelLiveDashboard({ t, isDark, navigate }) {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    live: 0,
    viewers: 0,
    scheduled: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isSessionsOpen, setIsSessionsOpen] = useState(true);
  const [, setTick] = useState(0);

  const fetchSessions = async () => {
    try {
      const res = await getSessionHistory();
      const data = Array.isArray(res.data) ? res.data : [];
      setSessions(data);
      setStats({
        live: data.filter((s) => s.status === "LIVE").length,
        viewers: data.reduce((acc, s) => acc + (s.viewerCount ?? 0), 0),
        scheduled: data.filter((s) => s.status === "SCHEDULED").length,
        completed: data.filter((s) => s.status === "ENDED").length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const dataInterval = setInterval(fetchSessions, 15000);
    const tickInterval = setInterval(() => setTick((n) => n + 1), 10000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const sessionTabs = ["all", "LIVE", "SCHEDULED", "ENDED"];
  const filtered =
    activeTab === "all"
      ? sessions
      : sessions.filter((s) => s.status === activeTab);

  const handleEnd = async (id) => {
    try {
      await endLiveSession(id);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: "ENDED", actualEndTime: new Date().toISOString() }
            : s,
        ),
      );
      setStats((prev) => ({
        ...prev,
        live: Math.max(0, prev.live - 1),
        completed: prev.completed + 1,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to end session.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteLiveSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => ({
        ...prev,
        completed: Math.max(0, prev.completed - 1),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete session.");
    }
  };

  // const handleStartLive = async (id) => {
  //   try {
  //     const res = await startLiveSessionWithToken(id);
  //     const { room, token } = res.data;
  //     if (!token) {
  //       alert("Could not get LiveKit token.");
  //       return;
  //     }
  //     setSessions((prev) =>
  //       prev.map((s) =>
  //         s.id === id
  //           ? {
  //               ...s,
  //               status: "LIVE",
  //               actualStartTime: new Date().toISOString(),
  //             }
  //           : s,
  //       ),
  //     );
  //     setStats((prev) => ({
  //       ...prev,
  //       live: prev.live + 1,
  //       scheduled: Math.max(0, prev.scheduled - 1),
  //     }));
  //     sessionStorage.setItem("call_state", JSON.stringify({ room, token }));
  //     navigate(`/trainer/live-controls/${id}`, { state: { room, token } });
  //   } catch (err) {
  //     console.error(err);
  //     const msg =
  //       err?.response?.data?.error ??
  //       err?.response?.data?.message ??
  //       err.message;
  //     alert("Cannot start: " + msg);
  //   }
  // };
  const handleStartLive = async (id) => {
    try {
      // ✅ Check if EXTERNAL session — open link directly
      const session = sessions.find((s) => s.id === id);
      if (session?.meetingType === "EXTERNAL" && session?.externalMeetingUrl) {
        // Still start the session on backend to set status LIVE
        await startLiveSessionWithToken(id);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: "LIVE",
                  actualStartTime: new Date().toISOString(),
                }
              : s,
          ),
        );
        setStats((prev) => ({
          ...prev,
          live: prev.live + 1,
          scheduled: Math.max(0, prev.scheduled - 1),
        }));
        // Open the external meeting link
        window.open(session.externalMeetingUrl, "_blank");
        return;
      }

      // CUSTOM — normal LiveKit flow
      const res = await startLiveSessionWithToken(id);
      const { room, token } = res.data;
      if (!token) {
        alert("Could not get LiveKit token.");
        return;
      }
      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "LIVE",
                actualStartTime: new Date().toISOString(),
              }
            : s,
        ),
      );
      setStats((prev) => ({
        ...prev,
        live: prev.live + 1,
        scheduled: Math.max(0, prev.scheduled - 1),
      }));
      // ✅ NEW: same startedAt stamp as the "Start Now" path above.
      const startedAt = Date.now();
      sessionStorage.setItem(
        "call_state",
        JSON.stringify({ room, token, startedAt }),
      );
      navigate(`/trainer/live-controls/${id}`, {
        state: { room, token, startedAt },
      });
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err.message;
      alert("Cannot start: " + msg);
    }
  };
  const statCards = [
    { label: "Live Now", value: stats.live, color: "#f43f5e", icon: Circle },
    {
      label: "Live Viewers",
      value: stats.viewers,
      color: "#f59e0b",
      icon: Users,
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      color: "#22d3ee",
      icon: Calendar,
    },
    {
      label: "Completed",
      value: stats.completed,
      color: "#34d399",
      icon: BarChart3,
    },
  ];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <StatCard key={i} stat={s} index={i} isDark={isDark} />
        ))}
      </div>
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          padding: 22,
          boxShadow: t.shadow,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <Radio size={15} color="#22c55e" />
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.bold,
                fontSize: 13,
                color: t.text,
              }}
            >
              All Sessions
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {sessionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "5px 14px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontFamily: FONT_FAMILY,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.2s",
                  background: activeTab === tab ? "#22c55e" : t.pillBg,
                  color: activeTab === tab ? "#fff" : t.pillText,
                  boxShadow:
                    activeTab === tab
                      ? "0 4px 12px rgba(34,197,94,0.3)"
                      : "none",
                }}
              >
                {tab}
              </button>
            ))}
            <button
              onClick={() => setIsSessionsOpen((p) => !p)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.textMuted,
              }}
            >
              <ChevronDown
                size={13}
                style={{
                  transition: "transform 0.3s",
                  transform: isSessionsOpen ? "rotate(0deg)" : "rotate(-90deg)",
                }}
              />
            </button>
          </div>
        </div>
        {isSessionsOpen &&
          (loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 56,
                    borderRadius: 12,
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
                padding: "40px 0",
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
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  t={t}
                  navigate={navigate}
                  handleEnd={handleEnd}
                  handleDelete={handleDelete}
                  handleStartLive={handleStartLive}
                />
              ))}
            </div>
          ))}
      </div>
    </>
  );
}
