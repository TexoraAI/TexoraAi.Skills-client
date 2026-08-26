import React from "react";
import { Handle, Position } from "@xyflow/react";
import "./roadmap-tokens.css";

/**
 * RoadmapNode — custom React-Flow node in the roadmap.sh style.
 *
 * Registered as node type "roadmapNode" by RoadmapCanvas.
 *
 * data: {
 *   title, description,
 *   nodeType: "topic" | "subtopic" | "milestone",
 *   status:   "not_started" | "in_progress" | "done" | "skipped",
 *   estimatedHours, orderIndex,
 *   isOptional, hasQuiz, hasProject,
 *   hasPrerequisites, prerequisites: string[],
 *   resources: [...],
 *   badge,                     // optional small text badge
 *   locked,                    // student view: prerequisites not met
 *   highlight,                 // transient emphasis (e.g. clicked)
 *   shake,                     // transient "can't open, locked" feedback
 * }
 */
function statusStyles(status) {
  switch (status) {
    case "done":
      return {
        bg: "var(--rm-done-bg, #dcfce7)",
        border: "var(--rm-done-border, #16a34a)",
        dot: "var(--rm-done, #16a34a)",
      };
    case "in_progress":
      return {
        bg: "var(--rm-progress-bg, #fef3c7)",
        border: "var(--rm-progress-border, #d97706)",
        dot: "var(--rm-progress, #d97706)",
      };
    case "skipped":
      return {
        bg: "var(--rm-skipped-bg, #f3f4f6)",
        border: "var(--rm-skipped, #6b7280)",
        dot: "var(--rm-skipped, #6b7280)",
      };
    default:
      return null; // not_started -> use node-type default
  }
}

function typeStyles(nodeType) {
  switch (nodeType) {
    case "milestone":
      return {
        bg: "var(--rm-milestone-bg, #c4b5fd)",
        border: "var(--rm-milestone-border, #8b5cf6)",
        text: "#241b45",
        radius: 999,
      };
    case "subtopic":
      return {
        bg: "var(--rm-subtopic-bg, #fff3cd)",
        border: "var(--rm-subtopic-border, #e6c34a)",
        text: "var(--rm-node-text, #23200f)",
        radius: 8,
      };
    case "topic":
    default:
      return {
        bg: "var(--rm-node-bg, #ffe08a)",
        border: "var(--rm-node-border, #e0a800)",
        text: "var(--rm-node-text, #23200f)",
        radius: 8,
      };
  }
}

export default function RoadmapNode({ data = {}, selected }) {
  const {
    title,
    nodeType = "topic",
    status = "not_started",
    estimatedHours,
    badge,
    isOptional,
    hasQuiz,
    hasProject,
    locked,
    highlight,
    shake,
  } = data;

  const t = typeStyles(nodeType);
  const s = statusStyles(status);

  const bg = locked ? "var(--rm-locked-bg, #eceaf1)" : s ? s.bg : t.bg;
  const border = locked ? "var(--rm-locked, #9ca3af)" : s ? s.border : t.border;

  const isMilestone = nodeType === "milestone";

  return (
    <div
      className={shake ? "rm-node-shake" : undefined}
      style={{
        fontFamily: "var(--rm-font, system-ui, sans-serif)",
        minWidth: isMilestone ? 150 : 168,
        maxWidth: 240,
        padding: isMilestone ? "10px 18px" : "10px 12px",
        background: bg,
        color: locked ? "var(--rm-locked, #9ca3af)" : t.text,
        border: `2px solid ${border}`,
        borderRadius: t.radius,
        boxShadow: highlight
          ? "0 0 0 3px rgba(124,58,237,.35), var(--rm-shadow-node, 2px 2px 0 rgba(0,0,0,.18))"
          : selected
            ? "0 0 0 3px rgba(124,58,237,.55)"
            : "var(--rm-shadow-node, 2px 2px 0 rgba(0,0,0,.18))",
        cursor: "pointer",
        textAlign: isMilestone ? "center" : "left",
        opacity: status === "skipped" ? 0.75 : 1,
        transition: "box-shadow .15s ease, transform .1s ease",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: border, width: 8, height: 8, border: "none" }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: isMilestone ? "center" : "flex-start",
        }}
      >
        {/* status dot */}
        {!locked && s && (
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: s.dot,
              flexShrink: 0,
            }}
          />
        )}
        {locked && (
          <span style={{ fontSize: 13, flexShrink: 0 }} aria-label="locked">
            🔒
          </span>
        )}
        <span
          style={{
            fontSize: isMilestone ? 14 : 13.5,
            fontWeight: 700,
            lineHeight: 1.25,
            wordBreak: "break-word",
          }}
        >
          {title}
        </span>
      </div>

      {/* meta row */}
      {(estimatedHours || isOptional || hasQuiz || hasProject || badge) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 6,
            justifyContent: isMilestone ? "center" : "flex-start",
          }}
        >
          {badge && <NodePill>{badge}</NodePill>}
          {estimatedHours ? <NodePill>{estimatedHours}h</NodePill> : null}
          {isOptional && <NodePill>optional</NodePill>}
          {hasQuiz && <NodePill>quiz</NodePill>}
          {hasProject && <NodePill>project</NodePill>}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: border, width: 8, height: 8, border: "none" }}
      />

      <style>{`
        @keyframes rm-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .rm-node-shake { animation: rm-shake .4s ease; }
      `}</style>
    </div>
  );
}

function NodePill({ children }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: "1px 6px",
        borderRadius: 999,
        background: "rgba(0,0,0,.08)",
        color: "inherit",
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}
