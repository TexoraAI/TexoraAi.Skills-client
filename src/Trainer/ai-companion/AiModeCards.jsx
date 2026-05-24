// src/trainer/ai-companion/AiModeCards.jsx
import { useState } from "react";
import {
  CheckSquare,
  Sun,
  TrendingUp,
  List,
  FileText,
  BarChart2,
  HelpCircle,
  Award,
  ClipboardList,
  MessageCircle,
  Monitor,
  Video,
  Mic,
  ChevronRight,
  BookOpen,
  FileEdit,
  Megaphone,
  AlignLeft,
  Minus,
  Plus,
} from "lucide-react";

const MODES_BY_TAB = {
  suggested: [
    {
      mode: "POST_MEETING_FOLLOWUP",
      label: "Post Meeting Follow Up",
      description:
        "Identify tasks and owners, suggest and complete next steps.",
      icon: CheckSquare,
      color: "#2563eb",
      requiresSession: true,
    },
    {
      mode: "DAILY_REFLECTION",
      label: "Daily Reflection",
      description:
        "Reflects on your selected day's meetings, wins, challenges, lessons.",
      icon: Sun,
      color: "#d97706",
      requiresSession: false,
    },
    {
      mode: "CROSS_MEETING_ANALYST",
      label: "Cross Meeting Analyst",
      description:
        "Identify recurring topics, evolving decisions, or unresolved issues.",
      icon: TrendingUp,
      color: "#7c3aed",
      requiresSession: false,
    },
    {
      mode: "SUMMARIZER",
      label: "Summarizer",
      description: "Provides a high-level summary of a meeting or document.",
      icon: FileText,
      color: "#dc2626",
      requiresSession: true,
    },
    {
      mode: "DAILY_REPORT",
      label: "Daily Report",
      description:
        "Creates a daily status report by summarizing meetings and tasks.",
      icon: BarChart2,
      color: "#0891b2",
      requiresSession: true,
    },
    {
      mode: "TOP_5_THINGS",
      label: "Top 5 Things",
      description:
        "Distills weekly meetings into Top 5 Things and a polished team email.",
      icon: List,
      color: "#059669",
      requiresSession: false,
    },
  ],
  meeting: [
    {
      mode: "MEETING_PREP",
      label: "Meeting Prep",
      description: "Prepare agenda, talking points, and goals for the session.",
      icon: ClipboardList,
      color: "#2563eb",
      requiresSession: true,
    },
    {
      mode: "ACTION_ITEMS",
      label: "Action Items",
      description: "Extract all action items and owners from the meeting.",
      icon: CheckSquare,
      color: "#059669",
      requiresSession: true,
    },
    {
      mode: "OPEN_QUESTIONS",
      label: "Open Questions",
      description: "List unresolved questions that need follow-up.",
      icon: HelpCircle,
      color: "#d97706",
      requiresSession: true,
    },
    {
      mode: "STUDENT_DOUBTS",
      label: "Student Doubts",
      description: "Identify and compile doubts raised by students.",
      icon: MessageCircle,
      color: "#7c3aed",
      requiresSession: true,
    },
    {
      mode: "ENGAGEMENT_REPORT",
      label: "Engagement Report",
      description: "Analyze participant engagement during the session.",
      icon: BarChart2,
      color: "#0891b2",
      requiresSession: true,
    },
    {
      mode: "RECORDING_SUMMARY",
      label: "Recording Summary",
      description: "Summarize the key points from the session recording.",
      icon: Video,
      color: "#dc2626",
      requiresSession: true,
    },
    {
      mode: "WHITEBOARD_SUMMARY",
      label: "Whiteboard Summary",
      description: "Extract and summarize whiteboard content from the session.",
      icon: Monitor,
      color: "#374151",
      requiresSession: true,
    },
    {
      mode: "CHAT_SUMMARY",
      label: "Chat Summary",
      description: "Summarize chat messages and key interactions.",
      icon: Mic,
      color: "#b45309",
      requiresSession: true,
    },
  ],
  coaching: [
    {
      mode: "GENERATE_QUIZ",
      label: "Generate Quiz",
      description:
        "Creates quiz questions to test student understanding of session content.",
      icon: HelpCircle,
      color: "#d97706",
      requiresSession: true,
    },
    {
      mode: "COACHING",
      label: "Coaching Insights",
      description:
        "Personalized coaching insights and improvement suggestions.",
      icon: Award,
      color: "#7c3aed",
      requiresSession: false,
    },
    {
      mode: "LESSON_PLAN",
      label: "Lesson Plan",
      description: "Generate a structured lesson plan for a topic.",
      icon: BookOpen,
      color: "#2563eb",
      requiresSession: false,
    },
    {
      mode: "ASSIGNMENT_DRAFT",
      label: "Assignment Draft",
      description: "Draft an assignment or assessment for students.",
      icon: FileEdit,
      color: "#059669",
      requiresSession: false,
    },
    {
      mode: "ANNOUNCEMENT_DRAFT",
      label: "Announcement Draft",
      description: "Write a class announcement or notice.",
      icon: Megaphone,
      color: "#dc2626",
      requiresSession: false,
    },
    {
      mode: "REWRITE_TEXT",
      label: "Rewrite Text",
      description: "Rewrite existing text for clarity and engagement.",
      icon: AlignLeft,
      color: "#0891b2",
      requiresSession: false,
    },
    {
      mode: "MAKE_SHORTER",
      label: "Make Shorter",
      description: "Condense content while preserving key points.",
      icon: Minus,
      color: "#b45309",
      requiresSession: false,
    },
    {
      mode: "MAKE_LONGER",
      label: "Make Longer",
      description: "Expand content with more detail and explanation.",
      icon: Plus,
      color: "#374151",
      requiresSession: false,
    },
  ],
};

function ModeCard({ m, isDark, onSelect }) {
  const [hov, setHov] = useState(false);
  const Icon = m.icon;
  const border = isDark ? "rgba(255,255,255,0.07)" : "#e5e7eb";

  return (
    <div
      onClick={() => onSelect(m)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 16px",
        borderRadius: 12,
        cursor: "pointer",
        border: `1px solid ${hov ? m.color + "55" : border}`,
        background: hov
          ? `${m.color}0a`
          : isDark
            ? "rgba(255,255,255,0.02)"
            : "#ffffff",
        transition: "all 0.18s",
        boxShadow: hov ? `0 4px 20px ${m.color}18` : "none",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${m.color}15`,
            border: `1px solid ${m.color}25`,
            flexShrink: 0,
          }}
        >
          <Icon size={16} color={m.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? "#f9fafb" : "#111827",
              fontFamily: "'Poppins', sans-serif",
              lineHeight: 1.3,
              marginBottom: 4,
            }}
          >
            {m.label}
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
            {m.description}
          </p>
        </div>
        {hov && (
          <ChevronRight
            size={14}
            color={m.color}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
        )}
      </div>
    </div>
  );
}

export default function AiModeCards({
  isDark,
  activeTab,
  onSelectMode,
  sessionId,
}) {
  const modes = MODES_BY_TAB[activeTab] || MODES_BY_TAB.suggested;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 10,
        padding: "4px 0",
      }}
    >
      {modes.map((m) => (
        <ModeCard key={m.mode} m={m} isDark={isDark} onSelect={onSelectMode} />
      ))}
    </div>
  );
}

export { MODES_BY_TAB };
