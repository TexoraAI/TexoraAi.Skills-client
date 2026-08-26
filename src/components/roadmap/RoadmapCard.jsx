import React from "react";
import ProgressBar from "./ProgressBar";
import "./roadmap-tokens.css";

/**
 * RoadmapCard — one roadmap tile. Serves both the student browser and the
 * trainer list; unused props are simply omitted.
 *
 * Props:
 *  - title, category, description, thumbnailUrl
 *  - nodeCount
 *  - completionPercent | completionPct | progress   (0-100; renders a bar)
 *  - showProgress (bool)         force showing the bar even at 0%
 *  - difficulty                  (student) e.g. "Beginner"
 *  - studentCount                (trainer)
 *  - updatedAt                   (trainer) ISO / display string
 *  - status                      (trainer) "draft" | "published"
 *  - variant "light" | "dark"    (dark = student browser grid)
 *  - onClick, href
 */
export default function RoadmapCard({
  title,
  category,
  description,
  thumbnailUrl,
  nodeCount,
  completionPercent,
  completionPct,
  progress,
  showProgress = false,
  difficulty,
  studentCount,
  updatedAt,
  status,
  variant = "light",
  onClick,
  href,
}) {
  const pct =
    completionPercent != null
      ? completionPercent
      : completionPct != null
        ? completionPct
        : progress != null
          ? progress
          : null;

  const dark = variant === "dark";
  const palette = dark
    ? {
        surface: "var(--rm-dark-surface, #171a21)",
        surfaceHover: "var(--rm-dark-surface-2, #1e222b)",
        text: "var(--rm-dark-text, #e6e8ec)",
        muted: "var(--rm-dark-text-muted, #9aa1ac)",
        border: "var(--rm-dark-border, #2a2f3a)",
      }
    : {
        surface: "var(--rm-surface, #fff)",
        surfaceHover: "var(--rm-surface-2, #faf9f6)",
        text: "var(--rm-text, #17130a)",
        muted: "var(--rm-text-muted, #6b7280)",
        border: "var(--rm-border, #d9d5cc)",
      };

  const [hover, setHover] = React.useState(false);
  const Comp = href ? "a" : "div";

  const statusChip =
    status &&
    (status === "published" ? (
      <Chip color="var(--rm-done, #16a34a)" bg="var(--rm-done-bg, #dcfce7)">
        Published
      </Chip>
    ) : (
      <Chip
        color="var(--rm-progress, #d97706)"
        bg="var(--rm-progress-bg, #fef3c7)"
      >
        Draft
      </Chip>
    ));

  return (
    <Comp
      href={href || undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 18,
        borderRadius: "var(--rm-radius-lg, 16px)",
        background: hover ? palette.surfaceHover : palette.surface,
        border: `1px solid ${palette.border}`,
        color: palette.text,
        cursor: "pointer",
        textDecoration: "none",
        boxShadow: hover
          ? "var(--rm-shadow, 0 4px 12px rgba(0,0,0,.06))"
          : "none",
        transform: hover ? "translateY(-2px)" : "none",
        transition:
          "transform .15s ease, box-shadow .15s ease, background .15s ease",
        fontFamily: "var(--rm-font-ui, system-ui, sans-serif)",
        minHeight: 150,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              display: "grid",
              placeItems: "center",
              background: "var(--rm-node-bg, #ffe08a)",
              color: "var(--rm-node-text, #23200f)",
              fontWeight: 800,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {(title || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {title}
            </h3>
            {statusChip}
          </div>
          {category && (
            <span style={{ fontSize: 12, color: palette.muted }}>
              {category}
            </span>
          )}
        </div>
      </div>

      {description && (
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.5,
            color: palette.muted,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
      )}

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            fontSize: 12,
            color: palette.muted,
          }}
        >
          {nodeCount != null && <Meta>{nodeCount} topics</Meta>}
          {studentCount != null && <Meta>{studentCount} students</Meta>}
          {difficulty && <Meta>{difficulty}</Meta>}
          {updatedAt && <Meta>Updated {updatedAt}</Meta>}
        </div>

        {pct != null && (pct > 0 || showProgress) && (
          <ProgressBar percentage={pct} size="sm" />
        )}
      </div>
    </Comp>
  );
}

function Meta({ children }) {
  return <span style={{ whiteSpace: "nowrap" }}>{children}</span>;
}

function Chip({ children, color, bg }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 999,
        color,
        background: bg,
      }}
    >
      {children}
    </span>
  );
}
