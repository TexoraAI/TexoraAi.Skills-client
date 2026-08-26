import { useState } from "react";
import { BarChart3, Clock, Users, Search, CheckCircle2, Download, MessageCircle } from "lucide-react";
import HeroBtn from "../components/HeroBtn";
import AttMetricCard from "../components/AttMetricCard";
import AttendeeRow from "../components/AttendeeRow";
import { FONT_FAMILY, FONT_WEIGHT } from "../data/theme";

export default function PanelAttendanceReport({ t, isDark, navigate }) {
  const [attendees] = useState([
    {
      name: "Raghib Imam",
      joinTime: "10:00 AM",
      leaveTime: "11:00 AM",
      duration: "60 min",
      watchPercent: 95,
      chatMessages: 5,
      status: "present",
    },
  ]);
  const [search, setSearch] = useState("");
  const filtered = attendees.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const completedCount = attendees.filter((a) => a.status === "present").length;
  const completionRate =
    attendees.length > 0
      ? Math.round((completedCount / attendees.length) * 100)
      : 0;
  const avgWatch =
    attendees.length > 0
      ? Math.round(
          attendees.reduce((acc, a) => acc + (a.watchPercent ?? 0), 0) /
            attendees.length,
        )
      : 0;
  const totalMessages = attendees.reduce(
    (acc, a) => acc + (a.chatMessages ?? 0),
    0,
  );

  const handleExport = () => {
    const csv =
      "data:text/csv;charset=utf-8,Name,Join Time,Leave Time,Duration,Watch %,Chat\n" +
      attendees
        .map(
          (a) =>
            `${a.name},${a.joinTime},${a.leaveTime},${a.duration},${a.watchPercent},${a.chatMessages}`,
        )
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "attendance.csv";
    document.body.appendChild(link);
    link.click();
  };

  const metricCards = [
    {
      label: "Total Attendees",
      value: attendees.length,
      color: "#22d3ee",
      icon: Users,
    },
    {
      label: "Completed",
      value: completedCount,
      color: "#34d399",
      icon: CheckCircle2,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      color: "#a78bfa",
      icon: BarChart3,
    },
    {
      label: "Avg Watch Time",
      value: `${avgWatch}%`,
      color: "#f59e0b",
      icon: Clock,
    },
    {
      label: "Chat Messages",
      value: totalMessages,
      color: "#f43f5e",
      icon: MessageCircle,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
          justifyContent: "flex-end",
        }}
      >
        <HeroBtn
          label="Export CSV"
          icon={Download}
          color="#22d3ee"
          onClick={handleExport}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {metricCards.map((m, i) => (
          <AttMetricCard key={i} metric={m} isDark={isDark} index={i} />
        ))}
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
        <div
          style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${t.tableBorderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
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
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
              }}
            >
              <Users size={15} color="#a78bfa" />
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.bold,
                fontSize: 13,
                color: t.text,
              }}
            >
              Attendee Details
            </span>
          </div>
          <input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: isDark ? "#1a1a1a" : "#f8fafc",
              color: t.text,
              fontSize: 11,
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.medium,
              outline: "none",
              width: 200,
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 12,
          }}
        >
          <div
            className="rlc-hide-sm"
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
          >
            <span style={{ flex: "2 1 160px" }}>Student</span>
            <span style={{ flex: "1 1 90px" }}>Joined</span>
            <span style={{ flex: "1 1 90px" }}>Left</span>
            <span style={{ flex: "0 0 80px" }}>Duration</span>
            <span style={{ flex: "0 0 80px" }}>Watch %</span>
            <span style={{ flex: "0 0 60px" }}>Chat</span>
            <span style={{ flex: "0 0 100px" }}>Status</span>
          </div>
          {filtered.map((a, i) => (
            <AttendeeRow key={i} attendee={a} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
