// src/pages/public/PublicSessionsPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Loader,
  AlertCircle,
  Search,
  Zap,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const PublicSessionsPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Fetch all sessions — filter SCHEDULED ones on frontend
        // You can also create a dedicated public endpoint if needed
        const res = await axios.get(`${API_BASE}/live-sessions/public/upcoming`);
        setSessions(res.data);
        setFiltered(res.data);
      } catch (err) {
        // Fallback: if no dedicated endpoint, show friendly error
        console.error("Failed to fetch sessions:", err);
        setError("Unable to load sessions right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(sessions);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        sessions.filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, sessions]);

  const formatDate = (date) => {
    if (!date) return "TBD";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time) => {
    if (!time) return "TBD";
    try {
      const [h, m] = time.split(":");
      const d = new Date();
      d.setHours(parseInt(h), parseInt(m));
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return time;
    }
  };

  // ── Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading sessions...</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ── Hero Header ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)",
          padding: "56px 24px 48px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.15)",
            color: "#bfdbfe",
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: "999px",
            marginBottom: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <Zap size={12} /> Free Live Sessions
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 44px)",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 12px",
            lineHeight: 1.15,
          }}
        >
          Learn Live. Learn Free.
        </h1>
        <p
          style={{
            color: "#bfdbfe",
            fontSize: "16px",
            maxWidth: "520px",
            margin: "0 auto 28px",
            lineHeight: 1.6,
          }}
        >
          Join expert-led live sessions on the topics that matter. No cost, no
          commitment — just book your spot and show up.
        </p>

        {/* Search */}
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              borderRadius: "12px",
              border: "none",
              fontSize: "15px",
              background: "#fff",
              color: "#1e293b",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* ── Session Cards ────────────────────────────────────────────── */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px 64px" }}>

        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#1e293b", margin: "0 0 8px" }}>
              No sessions found
            </p>
            <p style={{ color: "#64748b", fontSize: "14px" }}>
              {search ? "Try a different search term." : "Check back soon — new sessions are added regularly."}
            </p>
          </div>
        ) : (
          <>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
              {filtered.length} session{filtered.length !== 1 ? "s" : ""} available
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onBook={() => navigate(`/public/book-session/${session.id}`)}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Session Card ───────────────────────────────────────────────────────────────
const SessionCard = ({ session, onBook, formatDate, formatTime }) => {
  const isLive = session.status === "LIVE";
  const isScheduled = session.status === "SCHEDULED";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: isLive ? "2px solid #ef4444" : "1.5px solid #e2e8f0",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Left accent */}
      <div
        style={{
          width: "4px",
          alignSelf: "stretch",
          borderRadius: "4px",
          background: isLive ? "#ef4444" : "#1d4ed8",
          flexShrink: 0,
          minHeight: "60px",
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: "200px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          {isLive && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "#fef2f2",
                color: "#dc2626",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                  animation: "pulse 1.2s infinite",
                }}
              />
              Live Now
            </span>
          )}
          {isScheduled && (
            <span
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "999px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Upcoming
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 6px",
            lineHeight: 1.3,
          }}
        >
          {session.title}
        </h3>

        {session.description && (
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: "0 0 12px",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {session.description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <MetaItem icon={<Calendar size={13} />} text={formatDate(session.scheduledDate)} />
          <MetaItem icon={<Clock size={13} />} text={formatTime(session.scheduledTime)} />
          <MetaItem icon={<Users size={13} />} text={`${session.duration || 60} min`} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ flexShrink: 0 }}>
        {isLive ? (
          <button
            onClick={onBook}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Join Now <ArrowRight size={15} />
          </button>
        ) : isScheduled ? (
          <button
            onClick={onBook}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Book Now <ArrowRight size={15} />
          </button>
        ) : (
          <span
            style={{
              padding: "10px 20px",
              background: "#f1f5f9",
              color: "#94a3b8",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Unavailable
          </span>
        )}
      </div>
    </div>
  );
};

const MetaItem = ({ icon, text }) => (
  <span
    style={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "12px",
      color: "#64748b",
      fontWeight: 500,
    }}
  >
    <span style={{ color: "#94a3b8" }}>{icon}</span>
    {text}
  </span>
);

export default PublicSessionsPage;