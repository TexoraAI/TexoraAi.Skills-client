// src/Trainer/ai-companion/AiWorkflowTemplates.jsx
import { useState } from "react";
import {
  Search,
  Bell,
  CheckSquare,
  MessageSquare,
  List,
  FileText,
  BarChart2,
  Zap,
  ChevronRight,
} from "lucide-react";

const TEMPLATES = {
  "Meeting Management": [
    {
      id: 1,
      title: "Pre-meeting reminder",
      description:
        "Automatically send a reminder with agenda 30 minutes before each meeting.",
      icon: Bell,
      color: "#2563eb",
    },
    {
      id: 2,
      title: "Post-Meeting Action Tracker",
      description: "Extract and track action items after every session ends.",
      icon: CheckSquare,
      color: "#059669",
    },
    {
      id: 3,
      title: "Meeting Summary to Chat Channel",
      description:
        "Send a formatted meeting summary to your team chat after each session.",
      icon: MessageSquare,
      color: "#7c3aed",
    },
    {
      id: 4,
      title: "Action Items Follow-up Thread",
      description:
        "Create a follow-up thread for each action item and assign to owners.",
      icon: List,
      color: "#d97706",
    },
    {
      id: 5,
      title: "Decision & Open Questions Log",
      description:
        "Log all decisions and open questions to a shared doc after each meeting.",
      icon: FileText,
      color: "#0891b2",
    },
  ],
  Chat: [
    {
      id: 6,
      title: "Daily Chat Summary",
      description:
        "Summarize chat messages and key interactions from the day's sessions.",
      icon: BarChart2,
      color: "#dc2626",
    },
    {
      id: 7,
      title: "Channel Welcome And Summary",
      description: "Welcome new members and provide channel overview.",
      icon: MessageSquare,
      color: "#7c3aed",
    },
    {
      id: 8,
      title: "Smart Message Categorizer & Responder",
      description: "Automatically categorize and respond to messages.",
      icon: Zap,
      color: "#f59e0b",
    },
    {
      id: 9,
      title: "Track @Mentions in Document",
      description: "Keep track of all @mentions and create a document.",
      icon: FileText,
      color: "#0891b2",
    },
  ],
  Sales: [
    {
      id: 10,
      title: "Cross-Platform Knowledge Retrieval",
      description: "Retrieve and consolidate knowledge across platforms.",
      icon: Zap,
      color: "#f59e0b",
    },
  ],
  HR: [
    {
      id: 11,
      title: "Interview Meeting Join Reminder",
      description: "Send interview meeting reminders to participants.",
      icon: Bell,
      color: "#2563eb",
    },
  ],
  Others: [
    {
      id: 12,
      title: "OpenAI News Auto Publisher",
      description: "Auto-publish OpenAI news to your channels.",
      icon: Zap,
      color: "#f59e0b",
    },
    {
      id: 13,
      title: "Zoom Service Status Alerts",
      description: "Get alerts on Zoom service status changes.",
      icon: Bell,
      color: "#2563eb",
    },
    {
      id: 14,
      title: "Food Order Monitoring",
      description: "Monitor and track food orders.",
      icon: CheckSquare,
      color: "#059669",
    },
    {
      id: 15,
      title: "Lead Weekly Friendly Health Check Report",
      description: "Generate weekly health check reports for leads.",
      icon: BarChart2,
      color: "#dc2626",
    },
  ],
};

function TemplateCard({ t, isDark, onSelect }) {
  const Icon = t.icon;
  const [hov, setHov] = useState(false);
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(t)}
      style={{
        padding: "16px",
        borderRadius: 12,
        border: `1px solid ${hov ? t.color + "44" : border}`,
        background: hov
          ? `${t.color}06`
          : isDark
            ? "rgba(255,255,255,0.02)"
            : "#ffffff",
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: hov ? `0 4px 20px ${t.color}14` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${t.color}12`,
            border: `1px solid ${t.color}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={t.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? "#f9fafb" : "#111827",
              fontFamily: "'Poppins', sans-serif",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.title}
            {hov && <ChevronRight size={13} color={t.color} />}
          </div>
          <p
            style={{
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.45)" : "#6b7280",
              fontFamily: "'Poppins', sans-serif",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {t.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AiWorkflowTemplates({
  isDark,
  // New prop — parent passes this instead of onNavigate so routing stays in AiCompanionPage
  onSelectTemplate,
  onBack,
  // Legacy — kept so existing callers without onSelectTemplate don't crash
  onNavigate,
}) {
  const [searchQ, setSearchQ] = useState("");

  const bg = isDark ? "#0d1117" : "#f8fafc";
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#ffffff";

  const allTemplates = Object.values(TEMPLATES).flat();
  const filteredTemplates = allTemplates.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQ.toLowerCase()),
  );

  const handleSelectTemplate = (template) => {
    if (onSelectTemplate) {
      // Preferred: parent handles routing
      onSelectTemplate(template);
    } else if (onNavigate) {
      // Legacy fallback
      sessionStorage.setItem(
        "selectedWorkflowTemplate",
        JSON.stringify(template),
      );
      onNavigate("workflow-create");
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
      <div
        style={{
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: textPrimary,
              margin: "0 0 6px 0",
              letterSpacing: "-0.01em",
            }}
          >
            Workflow templates
          </h2>
          <p style={{ fontSize: 13, color: textSecondary, margin: 0 }}>
            Choose from pre-built templates to get started
          </p>
        </div>
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            border: `1px solid ${border}`,
            background: inputBg,
            minWidth: 250,
          }}
        >
          <Search size={15} color={textSecondary} />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search templates..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: textPrimary,
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Template sections */}
      {Object.entries(TEMPLATES).map(([category, templates]) => {
        const filteredInCategory = templates.filter(
          (t) =>
            t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQ.toLowerCase()),
        );

        if (filteredInCategory.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: textPrimary,
                marginBottom: 16,
                letterSpacing: "-0.01em",
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {filteredInCategory.map((t) => (
                <TemplateCard
                  key={t.id}
                  t={t}
                  isDark={isDark}
                  onSelect={handleSelectTemplate}
                />
              ))}
            </div>
          </div>
        );
      })}

      {filteredTemplates.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: textSecondary,
          }}
        >
          <p style={{ fontSize: 13, margin: 0 }}>
            No templates match "{searchQ}"
          </p>
        </div>
      )}
    </div>
  );
}
