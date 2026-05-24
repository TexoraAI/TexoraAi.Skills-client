// src/trainer/ai-companion/AiActivityLogs.jsx
import { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader,
} from "lucide-react";
import { getAiActivityLogs } from "../../services/liveSessionService";

function formatDate(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return val;
  }
}

function LogRow({ log, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  const success =
    log.success !== undefined ? log.success : log.status === "SUCCESS";
  const mode = log.mode || log.action || "UNKNOWN";
  const timestamp = log.createdAt || log.timestamp;
  const errMsg = log.errorMessage;

  return (
    <div
      style={{
        borderRadius: 10,
        border: `1px solid ${border}`,
        background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
        overflow: "hidden",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: errMsg ? "pointer" : "default",
        }}
        onClick={() => errMsg && setExpanded((p) => !p)}
      >
        {success ? (
          <CheckCircle size={16} color="#059669" style={{ flexShrink: 0 }} />
        ) : (
          <XCircle size={16} color="#dc2626" style={{ flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 2,
            }}
          >
            {mode.replace(/_/g, " ")}
          </div>
          <div
            style={{
              fontSize: 11,
              color: textSecondary,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Clock size={10} />
            {formatDate(timestamp)}
          </div>
        </div>

        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 99,
            background: success
              ? "rgba(5,150,105,0.08)"
              : "rgba(220,38,38,0.08)",
            color: success ? "#059669" : "#dc2626",
            border: `1px solid ${success ? "rgba(5,150,105,0.2)" : "rgba(220,38,38,0.2)"}`,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontFamily: "'Poppins', sans-serif",
            flexShrink: 0,
          }}
        >
          {success ? "Success" : "Failed"}
        </span>

        {errMsg && (
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: textSecondary,
              padding: 2,
              flexShrink: 0,
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {expanded && errMsg && (
        <div
          style={{
            padding: "10px 16px 12px",
            borderTop: `1px solid ${border}`,
            background: "rgba(220,38,38,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#dc2626",
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.6,
            }}
          >
            <strong>Error:</strong> {errMsg}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AiActivityLogs({ isDark }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const bg = isDark ? "#0d1117" : "#f8fafc";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  const fetchLogs = async (pg = 0, replace = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAiActivityLogs(pg, 20);
      const data = res.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.logs)
            ? data.logs
            : [];

      if (replace) {
        setLogs(items);
      } else {
        setLogs((prev) => [...prev, ...items]);
      }
      setHasMore(items.length === 20);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load activity logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0, true);
  }, []);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchLogs(next, false);
  };

  return (
    <div
      style={{
        flex: 1,
        background: bg,
        overflowY: "auto",
        padding: "32px 40px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #60a5fa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            <Activity size={17} color="#fff" />
          </div>
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: textPrimary,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Activity Logs
            </h2>
            <p
              style={{
                fontSize: 12,
                color: textSecondary,
                margin: 0,
              }}
            >
              History of all AI Companion interactions
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setPage(0);
            fetchLogs(0, true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: "transparent",
            cursor: "pointer",
            color: textSecondary,
            fontSize: 12,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = isDark
              ? "rgba(255,255,255,0.05)"
              : "#f3f4f6")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Stats row */}
      {logs.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            {
              label: "Total",
              value: logs.length,
              color: "#2563eb",
              bg: "rgba(37,99,235,0.08)",
            },
            {
              label: "Successful",
              value: logs.filter((l) =>
                l.success !== undefined ? l.success : l.status === "SUCCESS",
              ).length,
              color: "#059669",
              bg: "rgba(5,150,105,0.08)",
            },
            {
              label: "Failed",
              value: logs.filter((l) =>
                l.success !== undefined ? !l.success : l.status !== "SUCCESS",
              ).length,
              color: "#dc2626",
              bg: "rgba(220,38,38,0.08)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: stat.color,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && logs.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0",
            color: textSecondary,
            gap: 12,
          }}
        >
          <Loader
            size={28}
            color="#2563eb"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <span style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>
            Loading activity logs...
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: 10,
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.2)",
            color: "#dc2626",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 16,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && logs.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0",
            color: textSecondary,
            gap: 12,
          }}
        >
          <Activity size={36} color={textSecondary} />
          <div style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>
            No activity yet
          </div>
          <div style={{ fontSize: 13 }}>
            Start using AI Companion to see your activity here.
          </div>
        </div>
      )}

      {/* Logs list */}
      {logs.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {logs.map((log, i) => (
            <LogRow
              key={log.id || log.activityId || i}
              log={log}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && !loading && logs.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={loadMore}
            style={{
              padding: "9px 24px",
              borderRadius: 9,
              border: `1px solid ${border}`,
              background: "transparent",
              color: "#2563eb",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(37,99,235,0.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Load more
          </button>
        </div>
      )}

      {loading && logs.length > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "16px",
            color: textSecondary,
            fontSize: 12,
          }}
        >
          Loading...
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
