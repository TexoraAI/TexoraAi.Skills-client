// src/Trainer/ai-companion/AiWorkflowCreate.jsx
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Send,
  ChevronRight,
  ChevronDown,
  FileText,
  Bell,
  CheckSquare,
  MessageSquare,
  List,
  BarChart2,
  ArrowLeft,
  Zap,
  Search,
  Settings,
  Trash2,
  X,
  Save,
  AlertCircle,
  Copy,
  Play,
  PauseCircle,
  Clock,
  GitBranch,
  Mail,
  Users,
  ClipboardList,
  BookOpen,
  Activity,
  Database,
  ChevronLeft,
  Layers,
} from "lucide-react";
import {
  createWorkflow,
  updateWorkflow,
} from "../../services/liveSessionService";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const safeStringify = (value, fallback) => {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NODE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const NODE_LIBRARY = {
  triggers: {
    label: "Triggers",
    icon: Zap,
    color: "#f59e0b",
    nodes: [
      {
        id: "t1",
        type: "trigger",
        label: "Live session scheduled",
        description: "Fires when a live session is created/scheduled",
        icon: Bell,
        color: "#f59e0b",
      },
      {
        id: "t2",
        type: "trigger",
        label: "Live session started",
        description: "Fires when a trainer starts a live session",
        icon: Play,
        color: "#f59e0b",
      },
      {
        id: "t3",
        type: "trigger",
        label: "Live session ended",
        description: "Fires when a live session ends",
        icon: PauseCircle,
        color: "#f59e0b",
      },
      {
        id: "t4",
        type: "trigger",
        label: "Transcript created",
        description: "Fires when a session transcript is generated",
        icon: FileText,
        color: "#f59e0b",
      },
      {
        id: "t5",
        type: "trigger",
        label: "Attendance below threshold",
        description: "Fires when session attendance is below a set %",
        icon: Users,
        color: "#f59e0b",
      },
    ],
  },
  ai: {
    label: "AI Powered",
    icon: Zap,
    color: "#7c3aed",
    nodes: [
      {
        id: "a1",
        type: "ai",
        label: "Generate session summary",
        description: "AI generates a concise session summary",
        icon: FileText,
        color: "#7c3aed",
      },
      {
        id: "a2",
        type: "ai",
        label: "Extract action items",
        description: "AI extracts action items from session",
        icon: CheckSquare,
        color: "#7c3aed",
      },
      {
        id: "a3",
        type: "ai",
        label: "Generate engagement report",
        description: "AI builds an engagement analytics report",
        icon: BarChart2,
        color: "#7c3aed",
      },
      {
        id: "a4",
        type: "ai",
        label: "Generate quiz from session",
        description: "AI creates quiz questions from content",
        icon: ClipboardList,
        color: "#7c3aed",
      },
      {
        id: "a5",
        type: "ai",
        label: "Summarize chat messages",
        description: "AI summarizes chat from the session",
        icon: MessageSquare,
        color: "#7c3aed",
      },
    ],
  },
  actions: {
    label: "Actions",
    icon: Activity,
    color: "#059669",
    nodes: [
      {
        id: "ac1",
        type: "action",
        label: "Save to In-Person Notes",
        description: "Save output to trainer's notes",
        icon: BookOpen,
        color: "#059669",
      },
      {
        id: "ac2",
        type: "action",
        label: "Send email to trainer",
        description: "Send an email with output to the trainer",
        icon: Mail,
        color: "#059669",
      },
      {
        id: "ac3",
        type: "action",
        label: "Notify students",
        description: "Send notification to enrolled students",
        icon: Users,
        color: "#059669",
      },
      {
        id: "ac4",
        type: "action",
        label: "Create follow-up task",
        description: "Create a task in the task list",
        icon: ClipboardList,
        color: "#059669",
      },
      {
        id: "ac5",
        type: "action",
        label: "Save report",
        description: "Save generated report to reports section",
        icon: Database,
        color: "#059669",
      },
    ],
  },
  controls: {
    label: "Flow Controls",
    icon: GitBranch,
    color: "#0891b2",
    nodes: [
      {
        id: "c1",
        type: "control",
        label: "If condition",
        description: "Branch workflow based on a condition",
        icon: GitBranch,
        color: "#0891b2",
      },
      {
        id: "c2",
        type: "control",
        label: "Delay",
        description: "Wait before proceeding to next node",
        icon: Clock,
        color: "#0891b2",
      },
      {
        id: "c3",
        type: "control",
        label: "Stop workflow",
        description: "End the workflow at this point",
        icon: X,
        color: "#0891b2",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE STARTER NODES
// ─────────────────────────────────────────────────────────────────────────────
const TEMPLATE_NODES = {
  "Post Meeting Action Tracker": ["t3", "a2", "ac4"],
  "Post-Meeting Action Tracker": ["t3", "a2", "ac4"],
  "Meeting Summary to Chat Channel": ["t3", "a1", "ac3"],
  "Pre-meeting Reminder": ["t1", "c2", "ac3"],
  "Pre-meeting reminder": ["t1", "c2", "ac3"],
  "Decision & Open Questions Log": ["t3", "a1", "ac1"],
  "Daily Chat Summary": ["t3", "a5", "ac5"],
  "Generate session summary": ["t3", "a1", "ac1"],
};

function findNodeDef(id) {
  for (const cat of Object.values(NODE_LIBRARY)) {
    const found = cat.nodes.find((n) => n.id === id);
    if (found) return found;
  }
  return null;
}

function buildStarterNodes(templateName) {
  const ids = TEMPLATE_NODES[templateName] || ["t3"];
  return ids
    .map((id, idx) => {
      const def = findNodeDef(id);
      if (!def) return null;
      return { ...def, instanceId: `node-${Date.now()}-${idx}`, config: {} };
    })
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

function TypeBadge({ type, color }) {
  const labels = {
    trigger: "Trigger",
    ai: "AI",
    action: "Action",
    control: "Control",
  };
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 99,
        background: `${color}18`,
        color,
        border: `1px solid ${color}30`,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {labels[type] || type}
    </span>
  );
}

function NodeCard({ node, isDark, onConfigure, onDelete, index, total }) {
  const Icon = node.icon;
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const cardBg = isDark ? "#161d2b" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: `1.5px solid ${border}`,
          background: cardBg,
          boxShadow: isDark
            ? "0 2px 12px rgba(0,0,0,0.3)"
            : "0 2px 8px rgba(0,0,0,0.06)",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = node.color + "66")
        }
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: `${node.color}14`,
              border: `1px solid ${node.color}28`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={node.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: textPrimary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {node.label}
              </span>
              <TypeBadge type={node.type} color={node.color} />
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
              {node.description}
            </p>
            {node.config && Object.keys(node.config).length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: "6px 10px",
                  borderRadius: 7,
                  background: isDark ? "rgba(255,255,255,0.04)" : "#f9fafb",
                  border: `1px solid ${border}`,
                }}
              >
                {Object.entries(node.config).map(
                  ([k, v]) =>
                    v && (
                      <div
                        key={k}
                        style={{
                          fontSize: 10,
                          color: textSecondary,
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{k}: </span>
                        {String(v).substring(0, 60)}
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => onConfigure(node)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: "transparent",
                color: textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.color = textSecondary;
              }}
              title="Configure"
            >
              <Settings size={13} />
            </button>
            <button
              onClick={() => onDelete(node.instanceId)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: "transparent",
                color: textSecondary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#dc2626";
                e.currentTarget.style.color = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.color = textSecondary;
              }}
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
      {index < total - 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "4px 0",
          }}
        >
          <div
            style={{
              width: 2,
              height: 16,
              background: isDark ? "rgba(255,255,255,0.12)" : "#d1d5db",
            }}
          />
          <ChevronDown
            size={14}
            color={isDark ? "rgba(255,255,255,0.25)" : "#9ca3af"}
          />
        </div>
      )}
    </div>
  );
}

function NodeConfigPanel({ node, isDark, onSave, onClose }) {
  const [config, setConfig] = useState({ ...node.config });
  const bg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#f9fafb";
  const Icon = node.icon;

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 10px",
    borderRadius: 8,
    border: `1px solid ${border}`,
    background: inputBg,
    color: textPrimary,
    fontSize: 12,
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
  };
  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: textSecondary,
    marginBottom: 5,
    fontFamily: "'Poppins', sans-serif",
  };
  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const renderFields = () => {
    if (node.type === "trigger")
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Session Source</label>
            <select
              value={config.source || "all"}
              onChange={(e) =>
                setConfig((p) => ({ ...p, source: e.target.value }))
              }
              style={selectStyle}
            >
              <option value="all">All sessions</option>
              <option value="batch">Selected batch</option>
              <option value="trainer">Selected trainer</option>
            </select>
          </div>
          {node.id === "t5" && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Attendance Threshold (%)</label>
              <input
                type="number"
                value={config.threshold || 70}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, threshold: e.target.value }))
                }
                style={inputStyle}
                min={1}
                max={100}
              />
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Additional Condition (optional)</label>
            <input
              type="text"
              value={config.condition || ""}
              onChange={(e) =>
                setConfig((p) => ({ ...p, condition: e.target.value }))
              }
              placeholder="e.g. duration > 30 minutes"
              style={inputStyle}
            />
          </div>
        </>
      );
    if (node.type === "ai")
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Output Format</label>
            <select
              value={config.format || "summary"}
              onChange={(e) =>
                setConfig((p) => ({ ...p, format: e.target.value }))
              }
              style={selectStyle}
            >
              <option value="summary">Summary</option>
              <option value="bullets">Bullet points</option>
              <option value="action_items">Action items</option>
              <option value="report">Report</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Custom Prompt (optional)</label>
            <textarea
              value={config.prompt || ""}
              onChange={(e) =>
                setConfig((p) => ({ ...p, prompt: e.target.value }))
              }
              placeholder="Add custom instructions for the AI..."
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Max Length</label>
            <select
              value={config.maxLength || "medium"}
              onChange={(e) =>
                setConfig((p) => ({ ...p, maxLength: e.target.value }))
              }
              style={selectStyle}
            >
              <option value="short">Short (100 words)</option>
              <option value="medium">Medium (300 words)</option>
              <option value="long">Long (600 words)</option>
            </select>
          </div>
        </>
      );
    if (node.type === "action")
      return (
        <>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Destination</label>
            <select
              value={config.destination || "notes"}
              onChange={(e) =>
                setConfig((p) => ({ ...p, destination: e.target.value }))
              }
              style={selectStyle}
            >
              <option value="notes">In-Person Notes</option>
              <option value="email">Email</option>
              <option value="notification">Notification</option>
              <option value="tasks">Task list</option>
            </select>
          </div>
          {(config.destination === "email" || node.id === "ac2") && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Recipient Email</label>
              <input
                type="email"
                value={config.recipient || ""}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, recipient: e.target.value }))
                }
                placeholder="trainer@example.com"
                style={inputStyle}
              />
            </div>
          )}
          {(config.destination === "notification" || node.id === "ac3") && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Notify</label>
              <select
                value={config.notifyTarget || "all_students"}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, notifyTarget: e.target.value }))
                }
                style={selectStyle}
              >
                <option value="all_students">All students</option>
                <option value="absent_students">Absent students only</option>
                <option value="trainer">Trainer only</option>
              </select>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Custom Message (optional)</label>
            <textarea
              value={config.message || ""}
              onChange={(e) =>
                setConfig((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="Custom message to include..."
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>
        </>
      );
    if (node.type === "control")
      return (
        <>
          {node.id === "c1" && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Condition</label>
              <textarea
                value={config.condition || ""}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, condition: e.target.value }))
                }
                placeholder="e.g. attendance < 70 OR session_duration > 60"
                rows={3}
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>
          )}
          {node.id === "c2" && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Delay (minutes)</label>
              <input
                type="number"
                value={config.delayMinutes || 30}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, delayMinutes: e.target.value }))
                }
                style={inputStyle}
                min={1}
              />
            </div>
          )}
          {node.id === "c3" && (
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Stop Reason (optional)</label>
              <input
                type="text"
                value={config.stopReason || ""}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, stopReason: e.target.value }))
                }
                placeholder="Why this workflow stops here"
                style={inputStyle}
              />
            </div>
          )}
        </>
      );
    return null;
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 320,
        height: "100%",
        background: bg,
        borderLeft: `1px solid ${border}`,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 20px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: `${node.color}14`,
            border: `1px solid ${node.color}28`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={node.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {node.label}
          </div>
          <div
            style={{
              fontSize: 10,
              color: textSecondary,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Configure node
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textSecondary,
            padding: 4,
          }}
        >
          <X size={16} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {renderFields()}
      </div>
      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${border}`,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={() => onSave(config)}
          style={{
            flex: 1,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontSize: 12,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          Save Configuration
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: "transparent",
            color: textSecondary,
            fontSize: 12,
            fontFamily: "'Poppins', sans-serif",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function NodeLibraryPanel({ isDark, onAddNode, recentNodes }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({
    triggers: true,
    ai: false,
    actions: false,
    controls: false,
  });
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#ffffff";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const bg = isDark ? "#111827" : "#ffffff";

  const allNodes = Object.values(NODE_LIBRARY).flatMap((c) => c.nodes);
  const filtered = search
    ? allNodes.filter(
        (n) =>
          n.label.toLowerCase().includes(search.toLowerCase()) ||
          n.description.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const toggle = (key) => setExpanded((p) => ({ ...p, [key]: !p[key] }));

  const NodeItem = ({ node }) => {
    const Icon = node.icon;
    return (
      <button
        onClick={() => onAddNode(node)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 10px",
          border: "none",
          borderRadius: 8,
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
          transition: "all 0.12s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: `${node.color}14`,
            border: `1px solid ${node.color}28`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={12} color={node.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {node.label}
          </div>
        </div>
        <Plus size={11} color={textSecondary} />
      </button>
    );
  };

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        height: "100%",
        background: bg,
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 10px 8px",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 10px",
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: inputBg,
          }}
        >
          <Search size={13} color={textSecondary} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: textPrimary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: textSecondary,
                padding: 0,
              }}
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
        {filtered && (
          <div>
            <div
              style={{
                padding: "4px 10px 6px",
                fontSize: 10,
                fontWeight: 700,
                color: textSecondary,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Results ({filtered.length})
            </div>
            {filtered.map((n) => (
              <NodeItem key={n.id} node={n} />
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  padding: "12px 10px",
                  fontSize: 11,
                  color: textSecondary,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                No nodes match
              </div>
            )}
          </div>
        )}

        {!filtered && (
          <>
            {recentNodes.length > 0 && (
              <div style={{ marginBottom: 4 }}>
                <div
                  style={{
                    padding: "4px 10px 4px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Recent
                </div>
                {recentNodes.slice(0, 3).map((n) => (
                  <NodeItem key={n.id} node={n} />
                ))}
              </div>
            )}

            {Object.entries(NODE_LIBRARY).map(([key, cat]) => {
              const CatIcon = cat.icon;
              return (
                <div key={key} style={{ marginBottom: 2 }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 10px",
                      border: "none",
                      borderRadius: 8,
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = hoverBg)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <CatIcon size={13} color={cat.color} />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: 600,
                        color: textPrimary,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {cat.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: textSecondary,
                        marginRight: 4,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {cat.nodes.length}
                    </span>
                    {expanded[key] ? (
                      <ChevronDown size={12} color={textSecondary} />
                    ) : (
                      <ChevronRight size={12} color={textSecondary} />
                    )}
                  </button>
                  {expanded[key] &&
                    cat.nodes.map((n) => <NodeItem key={n.id} node={n} />)}
                </div>
              );
            })}

            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: `1px solid ${border}`,
              }}
            >
              <div
                style={{
                  padding: "4px 10px 6px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: textSecondary,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Apps
              </div>
              {[
                {
                  id: "app1",
                  type: "action",
                  label: "ILM Chat",
                  description: "Post to ILM Chat channel",
                  icon: MessageSquare,
                  color: "#7c3aed",
                },
                {
                  id: "app2",
                  type: "trigger",
                  label: "Live Meetings",
                  description: "Connect to live session events",
                  icon: Activity,
                  color: "#f59e0b",
                },
                {
                  id: "app3",
                  type: "action",
                  label: "Tasks",
                  description: "Create or update tasks",
                  icon: ClipboardList,
                  color: "#059669",
                },
              ].map((n) => (
                <NodeItem key={n.id} node={n} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKFLOW BUILDER — backend-connected handleSave
// ─────────────────────────────────────────────────────────────────────────────
function WorkflowBuilder({ isDark, selectedTemplate, onBack, onSaved }) {
  const bg = isDark ? "#0d1117" : "#f0f2f5";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#ffffff";
  const headerBg = isDark ? "#111827" : "#ffffff";

  const [nodes, setNodes] = useState(() => {
    if (selectedTemplate) {
      return buildStarterNodes(
        selectedTemplate.title || selectedTemplate.name || "",
      );
    }
    return [];
  });
  const [workflowName, setWorkflowName] = useState(
    selectedTemplate?.name || selectedTemplate?.title || "Untitled Workflow",
  );
  const [workflowDesc, setWorkflowDesc] = useState(
    selectedTemplate?.description || "",
  );
  const [status, setStatus] = useState(selectedTemplate?.status || "DRAFT");
  const [configNode, setConfigNode] = useState(null);
  const [recentNodeDefs, setRecentNodeDefs] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // editingId: only set when selectedTemplate already has a backend id
  const editingId = selectedTemplate?.id || null;

  // Determine sourceType
  const resolveSourceType = () => {
    if (selectedTemplate?.id) return selectedTemplate.sourceType || "CUSTOM";
    if (selectedTemplate?.title || selectedTemplate?.name) return "TEMPLATE";
    return "CUSTOM";
  };

  const handleAddNode = (nodeDef) => {
    const instance = {
      ...nodeDef,
      instanceId: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      config: {},
    };
    setNodes((prev) => [...prev, instance]);
    setRecentNodeDefs((prev) => {
      const filtered = prev.filter((n) => n.id !== nodeDef.id);
      return [nodeDef, ...filtered].slice(0, 5);
    });
    setError("");
  };

  const handleDeleteNode = (instanceId) => {
    setNodes((prev) => prev.filter((n) => n.instanceId !== instanceId));
  };

  const handleConfigureSave = (updatedConfig) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.instanceId === configNode.instanceId
          ? { ...n, config: updatedConfig }
          : n,
      ),
    );
    setConfigNode(null);
  };

  const addDefaultTrigger = () => {
    const def = findNodeDef("t3");
    if (def) handleAddNode(def);
  };

  const validate = () => {
    if (nodes.length === 0) return "Add at least one node to your workflow.";
    const hasTrigger = nodes.some((n) => n.type === "trigger");
    if (!hasTrigger)
      return "Add at least one Trigger node (e.g. Live session ended).";
    const hasAction = nodes.some((n) => n.type === "action" || n.type === "ai");
    if (!hasAction) return "Add at least one AI or Action node.";
    if (!workflowName.trim()) return "Please enter a workflow name.";
    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setSaving(true);

    const triggerNode = nodes.find((n) => n.type === "trigger");
    const sourceType = resolveSourceType();

    const payload = {
      name: workflowName.trim() || "Untitled Workflow",
      description: workflowDesc.trim() || selectedTemplate?.description || "",
      category: selectedTemplate?.category || "General",
      triggerType:
        triggerNode?.label || selectedTemplate?.triggerType || "MANUAL",
      status: status || "DRAFT",
      sourceType,
      templateKey:
        sourceType === "TEMPLATE"
          ? String(selectedTemplate?.id || selectedTemplate?.title || "")
          : null,
      nodesJson: safeStringify(
        nodes.map((n) => ({
          instanceId: n.instanceId,
          id: n.id,
          type: n.type,
          label: n.label,
          config: n.config,
        })),
        [],
      ),
      configJson: safeStringify({}, {}),
    };

    try {
      if (editingId) {
        await updateWorkflow(editingId, payload);
      } else {
        await createWorkflow(payload);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (onSaved) onSaved();
      }, 1200);
    } catch (apiErr) {
      console.error("Failed to save workflow:", apiErr);
      setError(
        apiErr?.response?.data?.message ||
          "Failed to save workflow. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClearCanvas = () => {
    if (nodes.length === 0) return;
    if (window.confirm("Clear all nodes from the canvas?")) setNodes([]);
  };

  const canvasEmpty = nodes.length === 0;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 20px",
          background: headerBg,
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
          boxShadow: isDark
            ? "0 1px 8px rgba(0,0,0,0.2)"
            : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div style={{ width: 1, height: 20, background: border }} />

        <input
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          placeholder="Workflow name..."
          style={{
            border: "none",
            background: "transparent",
            color: textPrimary,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            outline: "none",
            flex: 1,
            minWidth: 0,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: 7,
              border: `1px solid ${border}`,
              background: inputBg,
              color: textPrimary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            onClick={handleClearCanvas}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: "transparent",
              color: textSecondary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
            }}
          >
            Clear
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              background: saved ? "#059669" : saving ? "#6b7280" : "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!saved && !saving)
                e.currentTarget.style.background = "#1d4ed8";
            }}
            onMouseLeave={(e) => {
              if (!saved && !saving)
                e.currentTarget.style.background = "#2563eb";
            }}
          >
            <Save size={14} />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Workflow"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: isDark ? "rgba(220,38,38,0.12)" : "#fef2f2",
            borderBottom: `1px solid ${isDark ? "rgba(220,38,38,0.2)" : "#fecaca"}`,
            flexShrink: 0,
          }}
        >
          <AlertCircle size={14} color="#dc2626" />
          <span
            style={{
              fontSize: 12,
              color: "#dc2626",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {error}
          </span>
          <button
            onClick={() => setError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <NodeLibraryPanel
          isDark={isDark}
          onAddNode={handleAddNode}
          recentNodes={recentNodeDefs}
        />

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          <div style={{ maxWidth: 600, margin: "0 auto 20px" }}>
            <input
              value={workflowDesc}
              onChange={(e) => setWorkflowDesc(e.target.value)}
              placeholder="Add a description (optional)..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: 8,
                border: `1px solid ${border}`,
                background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
                color: textPrimary,
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
              }}
            />
          </div>

          {canvasEmpty ? (
            <div
              style={{
                maxWidth: 480,
                margin: "40px auto",
                textAlign: "center",
                padding: "48px 32px",
                borderRadius: 16,
                border: `2px dashed ${border}`,
                background: isDark ? "rgba(255,255,255,0.01)" : "#fafafa",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: isDark ? "rgba(37,99,235,0.12)" : "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Zap size={24} color="#2563eb" />
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: textPrimary,
                  marginBottom: 8,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Workflow Canvas
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: textSecondary,
                  margin: "0 0 20px",
                  fontFamily: "'Poppins', sans-serif",
                  lineHeight: 1.6,
                }}
              >
                Click a node in the left panel to add it here, or use the
                buttons below.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={addDefaultTrigger}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Start with a node
                </button>
                <button
                  onClick={() => {}}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: "transparent",
                    color: textSecondary,
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Choose a template
                </button>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
              {nodes.map((node, idx) => (
                <NodeCard
                  key={node.instanceId}
                  node={node}
                  isDark={isDark}
                  index={idx}
                  total={nodes.length}
                  onConfigure={setConfigNode}
                  onDelete={handleDeleteNode}
                />
              ))}
              <div
                style={{
                  marginTop: 12,
                  padding: "12px",
                  borderRadius: 10,
                  border: `1px dashed ${border}`,
                  textAlign: "center",
                  color: textSecondary,
                  fontSize: 11,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                ← Click a node in the left panel to add more steps
              </div>
            </div>
          )}
        </div>

        {configNode && (
          <NodeConfigPanel
            node={configNode}
            isDark={isDark}
            onSave={handleConfigureSave}
            onClose={() => setConfigNode(null)}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUGGESTED PROMPTS / TEMPLATE DATA
// ─────────────────────────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  "meeting summary to Gmail",
  "meeting summary to Slack",
  "meeting engagement report",
];

const TEMPLATE_TABS = [
  { id: "all", label: "All" },
  { id: "meetings", label: "Meetings" },
  { id: "chat", label: "Chat" },
  { id: "sales", label: "Sales" },
  { id: "hr", label: "HR" },
  { id: "others", label: "Others" },
];

const TEMPLATES_BY_CATEGORY = {
  meetings: [
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
      description: "Extract and track action items.",
      icon: CheckSquare,
      color: "#059669",
    },
    {
      id: 3,
      title: "Meeting Summary to Chat Channel",
      description: "Send formatted summaries to chat.",
      icon: MessageSquare,
      color: "#7c3aed",
    },
    {
      id: 4,
      title: "Action Items Follow-up Thread",
      description: "Create follow-up threads for actions.",
      icon: List,
      color: "#d97706",
    },
    {
      id: 5,
      title: "Decision & Open Questions Log",
      description: "Log decisions and questions.",
      icon: FileText,
      color: "#0891b2",
    },
  ],
  chat: [
    {
      id: 6,
      title: "Daily Chat Summary",
      description: "Summarize daily chat interactions.",
      icon: BarChart2,
      color: "#dc2626",
    },
  ],
  sales: [
    {
      id: 7,
      title: "Sales Opportunity Tracker",
      description: "Track sales opportunities automatically.",
      icon: Zap,
      color: "#f59e0b",
    },
  ],
  hr: [
    {
      id: 8,
      title: "Interview Meeting Reminder",
      description: "Send interview meeting reminders.",
      icon: Bell,
      color: "#8b5cf6",
    },
  ],
  others: [
    {
      id: 9,
      title: "Custom Workflow",
      description: "Build a completely custom workflow.",
      icon: Plus,
      color: "#6366f1",
    },
  ],
};

function SmallTemplateCard({ t, isDark, onSelect }) {
  const Icon = t.icon;
  const [hov, setHov] = useState(false);
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(t)}
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        border: `1px solid ${hov ? t.color + "44" : border}`,
        background: hov
          ? `${t.color}08`
          : isDark
            ? "rgba(255,255,255,0.02)"
            : "#ffffff",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: `${t.color}12`,
            border: `1px solid ${t.color}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={13} color={t.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: isDark ? "#f9fafb" : "#111827",
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {t.title}
            {hov && <ChevronRight size={11} color={t.color} />}
          </div>
          <p
            style={{
              fontSize: 10,
              color: isDark ? "rgba(255,255,255,0.45)" : "#6b7280",
              margin: 0,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {t.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AiWorkflowCreate({
  isDark,
  selectedTemplate,
  onBack,
  onOpenTemplates,
  onSaved,
  onNavigate,
}) {
  const [showBuilder, setShowBuilder] = useState(() => !!selectedTemplate);
  const [prompt, setPrompt] = useState(selectedTemplate?.title || "");
  const [activeTab, setActiveTab] = useState("all");
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null);
  const [workflowName, setWorkflowName] = useState("");
  const [builderTemplate, setBuilderTemplate] = useState(
    selectedTemplate || null,
  );
  const [promptSaving, setPromptSaving] = useState(false);
  const [promptError, setPromptError] = useState("");

  const bg = isDark ? "#0d1117" : "#f8fafc";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#ffffff";
  const accentBg = isDark ? "rgba(37,99,235,0.1)" : "#eff6ff";

  useEffect(() => {
    if (selectedTemplate) {
      setPrompt(selectedTemplate.title || selectedTemplate.name || "");
      setBuilderTemplate(selectedTemplate);
      setShowBuilder(true);
    }
  }, [selectedTemplate]);

  const filteredTemplates =
    activeTab === "all"
      ? Object.values(TEMPLATES_BY_CATEGORY).flat()
      : TEMPLATES_BY_CATEGORY[activeTab] || [];

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;
    setGeneratedWorkflow({
      name: prompt.substring(0, 40),
      trigger: "Live session ended",
      actions: [
        { type: "AI_SUMMARIZE", label: "Summarize meeting" },
        { type: "EMAIL", label: "Send to email" },
      ],
      nodes: 2,
    });
  };

  // Prompt-based save → calls createWorkflow directly
  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      alert("Please enter a workflow name");
      return;
    }
    setPromptSaving(true);
    setPromptError("");

    const payload = {
      name: workflowName.trim(),
      description: prompt || "",
      category: "General",
      triggerType: generatedWorkflow?.trigger || "MANUAL",
      status: "DRAFT",
      sourceType: "PROMPT",
      templateKey: null,
      nodesJson: safeStringify([], []),
      configJson: safeStringify({}, {}),
    };

    try {
      await createWorkflow(payload);
      setPrompt("");
      setWorkflowName("");
      setGeneratedWorkflow(null);
      if (onSaved) onSaved();
      else if (onNavigate) onNavigate("workflow-my");
    } catch (apiErr) {
      console.error("Failed to save prompt workflow:", apiErr);
      setPromptError(
        apiErr?.response?.data?.message ||
          "Failed to save workflow. Please try again.",
      );
    } finally {
      setPromptSaving(false);
    }
  };

  const handleSelectTemplate = (template) => {
    setBuilderTemplate(template);
    setShowBuilder(true);
  };

  const handleBuilderBack = () => {
    setShowBuilder(false);
    setBuilderTemplate(null);
  };

  const handleBuilderSaved = () => {
    if (onSaved) onSaved();
    else if (onNavigate) onNavigate("workflow-my");
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder
        isDark={isDark}
        selectedTemplate={builderTemplate}
        onBack={handleBuilderBack}
        onSaved={handleBuilderSaved}
      />
    );
  }

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
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 20,
          }}
        >
          <ChevronLeft size={15} /> Back to Workflows
        </button>
      )}

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: textPrimary,
            margin: "0 0 10px 0",
            letterSpacing: "-0.01em",
          }}
        >
          What kind of workflow would you like to create?
        </h1>
        <p style={{ fontSize: 13, color: textSecondary, margin: 0 }}>
          Describe your workflow or choose a template to get started
        </p>
      </div>

      <div
        style={{
          maxWidth: 700,
          margin: "0 auto 24px",
          display: "flex",
          gap: 8,
        }}
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your workflow and I can help you build it"
          rows={3}
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border: `1px solid ${border}`,
            background: inputBg,
            color: textPrimary,
            fontSize: 13,
            fontFamily: "'Poppins', sans-serif",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleSendPrompt}
          disabled={!prompt.trim()}
          style={{
            width: 44,
            height: 44,
            minWidth: 44,
            borderRadius: 10,
            border: "none",
            background: prompt.trim() ? "#2563eb" : "#d1d5db",
            color: "#fff",
            cursor: prompt.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.15s",
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <div
        style={{
          maxWidth: 700,
          margin: "0 auto 24px",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setPrompt(p)}
            style={{
              padding: "5px 13px",
              borderRadius: 20,
              border: `1px solid ${border}`,
              background: inputBg,
              color: textSecondary,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.color = "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = border;
              e.currentTarget.style.color = textSecondary;
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {generatedWorkflow && (
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto 28px",
            padding: 20,
            borderRadius: 12,
            background: accentBg,
            border: `1px solid #2563eb28`,
          }}
        >
          {promptError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                marginBottom: 12,
                background: "#fef2f2",
                borderRadius: 8,
                border: "1px solid #fecaca",
              }}
            >
              <AlertCircle size={13} color="#dc2626" />
              <span
                style={{
                  fontSize: 12,
                  color: "#dc2626",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {promptError}
              </span>
            </div>
          )}
          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                color: textSecondary,
                marginBottom: 5,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Workflow Name
            </label>
            <input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Enter workflow name..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 10,
                borderRadius: 8,
                border: `1px solid ${border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
              }}
            />
          </div>
          <div
            style={{
              background: inputBg,
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${border}`,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: textPrimary,
                marginBottom: 6,
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Trigger: {generatedWorkflow.trigger}
            </div>
            {generatedWorkflow.actions.map((a, i) => (
              <div
                key={i}
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  paddingLeft: 16,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                • {a.label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSaveWorkflow}
              disabled={promptSaving}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: promptSaving ? "#6b7280" : "#2563eb",
                color: "#fff",
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                cursor: promptSaving ? "not-allowed" : "pointer",
              }}
            >
              {promptSaving ? "Saving..." : "Save Workflow"}
            </button>
            <button
              onClick={() => {
                setBuilderTemplate({ title: workflowName || prompt });
                setShowBuilder(true);
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: `1px solid ${border}`,
                background: "transparent",
                color: textSecondary,
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
              }}
            >
              Open in Builder
            </button>
          </div>
        </div>
      )}

      <div
        style={{ maxWidth: 700, margin: "0 auto 28px", textAlign: "center" }}
      >
        <button
          onClick={() => {
            setBuilderTemplate(null);
            setShowBuilder(true);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          or Build from scratch →
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: textPrimary,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Templates
          </div>
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
              }}
            >
              View all
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            borderBottom: `1px solid ${border}`,
            overflowX: "auto",
            paddingBottom: 6,
          }}
        >
          {TEMPLATE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "5px 12px",
                borderRadius: "6px 6px 0 0",
                border: "none",
                background: activeTab === tab.id ? "#2563eb" : "transparent",
                color: activeTab === tab.id ? "#fff" : textSecondary,
                fontSize: 11,
                fontFamily: "'Poppins', sans-serif",
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 10,
          }}
        >
          {filteredTemplates.map((t) => (
            <SmallTemplateCard
              key={t.id}
              t={t}
              isDark={isDark}
              onSelect={handleSelectTemplate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
