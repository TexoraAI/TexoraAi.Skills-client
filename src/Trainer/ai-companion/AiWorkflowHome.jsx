// src/Trainer/ai-companion/AiWorkflowHome.jsx
// NOTE: This file was not provided in the original upload, so this is the
// minimum implementation per spec: recent workflows from backend (top 3),
// template cards remain static.
import { useState, useEffect } from "react";
import {
  Plus,
  Zap,
  Bell,
  CheckSquare,
  MessageSquare,
  FileText,
  BarChart2,
  ChevronRight,
  Clock,
  Activity,
} from "lucide-react";
import { getMyWorkflows } from "../../services/liveSessionService";

const normalizeList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.data?.content)) return res.data.content;
  return [];
};

const QUICK_TEMPLATES = [
  {
    id: 1,
    title: "Pre-meeting Reminder",
    description: "Automatically send reminders before meetings.",
    icon: Bell,
    color: "#2563eb",
  },
  {
    id: 2,
    title: "Post Meeting Action Tracker",
    description: "Extract and track action items after every session.",
    icon: CheckSquare,
    color: "#059669",
  },
  {
    id: 3,
    title: "Meeting Summary to Chat Channel",
    description: "Send formatted meeting summaries to your team chat.",
    icon: MessageSquare,
    color: "#7c3aed",
  },
  {
    id: 4,
    title: "Daily Chat Summary",
    description: "Summarize daily chat interactions.",
    icon: BarChart2,
    color: "#dc2626",
  },
];

function StatusBadge({ status }) {
  const s = (status || "DRAFT").toUpperCase();
  const colors = {
    DRAFT: { bg: "rgba(96,165,250,0.1)", color: "#2563eb" },
    ACTIVE: { bg: "rgba(5,150,105,0.1)", color: "#059669" },
    INACTIVE: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
  };
  const c = colors[s] || colors.DRAFT;
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 99,
        background: c.bg,
        color: c.color,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {s}
    </span>
  );
}

export default function AiWorkflowHome({
  isDark,
  onCreateWorkflow,
  onOpenTemplates,
  onOpenMyWorkflows,
  onSelectTemplate,
}) {
  const [recentWorkflows, setRecentWorkflows] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const bg = isDark ? "#0d1117" : "#f8fafc";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const cardBg = isDark ? "rgba(255,255,255,0.02)" : "#ffffff";
  const inputBg = isDark ? "#1f2937" : "#ffffff";

  useEffect(() => {
    const fetchRecent = async () => {
      setLoadingRecent(true);
      try {
        const res = await getMyWorkflows();
        const all = normalizeList(res);
        // Sort by updatedAt desc, fallback createdAt
        const sorted = [...all].sort((a, b) => {
          const da = new Date(a.updatedAt || a.createdAt || 0);
          const db = new Date(b.updatedAt || b.createdAt || 0);
          return db - da;
        });
        setRecentWorkflows(sorted.slice(0, 3));
      } catch (err) {
        console.error("Failed to load recent workflows:", err);
        setRecentWorkflows([]);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr || "—";
    }
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
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb18, #7c3aed18)",
              border: `1px solid rgba(37,99,235,0.15)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={20} color="#2563eb" />
          </div>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: textPrimary,
                margin: 0,
                letterSpacing: "-0.01em",
              }}
            >
              Workflows
            </h1>
            <p style={{ fontSize: 12, color: textSecondary, margin: 0 }}>
              Automate your LMS tasks with AI-powered workflows
            </p>
          </div>
        </div>
        <button
          onClick={onCreateWorkflow}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginTop: 16,
            padding: "10px 20px",
            borderRadius: 9,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(37,99,235,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          <Plus size={15} /> Create Workflow
        </button>
      </div>

      {/* Recent Workflows */}
      <div style={{ marginBottom: 36 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color={textSecondary} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: textPrimary,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Recent Workflows
            </span>
          </div>
          {onOpenMyWorkflows && (
            <button
              onClick={onOpenMyWorkflows}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ChevronRight size={12} />
            </button>
          )}
        </div>

        {loadingRecent ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: textSecondary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Loading recent workflows...
          </div>
        ) : recentWorkflows.length === 0 ? (
          <div
            style={{
              padding: "28px",
              textAlign: "center",
              borderRadius: 12,
              border: `1px dashed ${border}`,
              background: cardBg,
            }}
          >
            <Activity
              size={22}
              color={textSecondary}
              style={{ margin: "0 auto 10px" }}
            />
            <p
              style={{
                fontSize: 13,
                color: textPrimary,
                margin: "0 0 4px",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              No recent workflows found
            </p>
            <p
              style={{
                fontSize: 11,
                color: textSecondary,
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Create your first workflow to get started
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {recentWorkflows.map((wf) => (
              <div
                key={wf.id}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: cardBg,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#2563eb44";
                  e.currentTarget.style.background = isDark
                    ? "rgba(37,99,235,0.06)"
                    : "#f5f8ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.background = cardBg;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: textPrimary,
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.3,
                    }}
                  >
                    {wf.name || "Untitled Workflow"}
                  </span>
                  <StatusBadge status={wf.status} />
                </div>
                {wf.description && (
                  <p
                    style={{
                      fontSize: 11,
                      color: textSecondary,
                      margin: "0 0 8px",
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {wf.description}
                  </p>
                )}
                <div
                  style={{
                    fontSize: 10,
                    color: textSecondary,
                    fontFamily: "'Poppins', sans-serif",
                    display: "flex",
                    gap: 10,
                  }}
                >
                  {wf.triggerType && <span>Trigger: {wf.triggerType}</span>}
                  <span>{formatDate(wf.updatedAt || wf.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Templates */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Start from a template
          </span>
          {onOpenTemplates && (
            <button
              onClick={onOpenTemplates}
              style={{
                background: "none",
                border: "none",
                color: "#2563eb",
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View all <ChevronRight size={12} />
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {QUICK_TEMPLATES.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTemplate && onSelectTemplate(t)}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  border: `1px solid ${border}`,
                  background: cardBg,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = t.color + "44";
                  e.currentTarget.style.background = `${t.color}06`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.background = cardBg;
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: `${t.color}12`,
                      border: `1px solid ${t.color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} color={t.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: textPrimary,
                        fontFamily: "'Poppins', sans-serif",
                        marginBottom: 4,
                      }}
                    >
                      {t.title}
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: textSecondary,
                        margin: 0,
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.4,
                      }}
                    >
                      {t.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
