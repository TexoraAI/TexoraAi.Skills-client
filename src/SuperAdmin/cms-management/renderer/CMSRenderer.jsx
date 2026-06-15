/**
 * CMSRenderer.jsx
 * Dynamically renders: Page → Sections → Components
 * Used to preview the live CMS output inside the management UI.
 */

import React from "react";
import { getIcon } from "./iconRegistry";
import { getSectionMeta } from "./componentRegistry";
import "../styles/cms.css";

// ─── Component Renderers ──────────────────────────────────────────────────────

const HeroRenderer = ({ data }) => (
  <div
    style={{
      background: data.backgroundImage
        ? `url(${data.backgroundImage}) center/cover`
        : "linear-gradient(135deg,#6366f1,#8b5cf6)",
      borderRadius: 12,
      padding: "48px 40px",
      color: "#fff",
      minHeight: 180,
    }}
  >
    <h2 style={{ margin: "0 0 10px", fontSize: 28, fontWeight: 800 }}>{data.title}</h2>
    {data.subtitle && <p style={{ margin: "0 0 20px", opacity: 0.85, fontSize: 16 }}>{data.subtitle}</p>}
    {data.buttons?.length > 0 && (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {data.buttons.map((btn, i) => (
          <span
            key={i}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: btn.variant === "primary" ? "#fff" : "rgba(255,255,255,0.2)",
              color: btn.variant === "primary" ? "#6366f1" : "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {btn.label}
          </span>
        ))}
      </div>
    )}
  </div>
);

const CTARenderer = ({ data }) => (
  <div
    style={{
      background: "linear-gradient(135deg,#1e1b4b,#312e81)",
      borderRadius: 12,
      padding: "32px 40px",
      textAlign: "center",
      color: "#fff",
    }}
  >
    <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700 }}>{data.title}</h3>
    {data.subtitle && <p style={{ margin: "0 0 18px", opacity: 0.8 }}>{data.subtitle}</p>}
    <span
      style={{
        padding: "10px 28px",
        background: "#6366f1",
        borderRadius: 8,
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {data.buttonLabel}
    </span>
  </div>
);

const FeatureCardRenderer = ({ data }) => {
  const Icon = getIcon(data.icon);
  return (
    <div
      style={{
        background: "var(--cms-surface-2)",
        border: "1px solid var(--cms-border)",
        borderRadius: 10,
        padding: "18px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <div style={{ color: "#6366f1", flexShrink: 0, marginTop: 2 }}>
        <Icon size={22} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{data.title}</div>
        <div style={{ fontSize: 12, color: "var(--cms-text-muted)", lineHeight: 1.5 }}>{data.description}</div>
      </div>
    </div>
  );
};

const CourseCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "16px",
    }}
  >
    {data.badge && (
      <span
        style={{
          background: "#4f46e5",
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 4,
          marginBottom: 8,
          display: "inline-block",
        }}
      >
        {data.badge}
      </span>
    )}
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{data.title}</div>
    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--cms-text-muted)" }}>
      <span>📅 {data.duration}</span>
      <span>📊 {data.level}</span>
      <span>👤 {data.enrolled} enrolled</span>
    </div>
  </div>
);

const TrainerCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "16px",
      display: "flex",
      gap: 14,
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#6366f1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 18,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {data.name?.[0] || "T"}
    </div>
    <div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{data.name}</div>
      <div style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>{data.role}</div>
      <div style={{ fontSize: 11, color: "var(--cms-text-muted)" }}>Exp: {data.experience}</div>
    </div>
  </div>
);

const StudentCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 16px",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{data.name}</div>
    <div style={{ fontSize: 12, color: "var(--cms-text-muted)", marginBottom: 8 }}>
      Batch: {data.batch}
    </div>
    <div
      style={{
        height: 6,
        background: "var(--cms-border)",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          background: "#6366f1",
          width: `${data.progress || 0}%`,
          borderRadius: 3,
        }}
      />
    </div>
    <div style={{ fontSize: 11, color: "var(--cms-text-muted)", marginTop: 4 }}>
      {data.progress}% complete
    </div>
  </div>
);

const BatchCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 16px",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{data.name}</div>
    <div
      style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--cms-text-muted)" }}
    >
      <span>👤 {data.students} students</span>
      <span>📅 {data.startDate}</span>
      <span
        style={{
          background:
            data.status === "Active"
              ? "#14532d"
              : data.status === "Upcoming"
              ? "#1e1b4b"
              : "#3b1414",
          color:
            data.status === "Active"
              ? "#86efac"
              : data.status === "Upcoming"
              ? "#a5b4fc"
              : "#fca5a5",
          padding: "1px 8px",
          borderRadius: 4,
        }}
      >
        {data.status}
      </span>
    </div>
  </div>
);

const ResourceCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{data.title}</div>
      <div style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>
        {data.type} · {data.size}
      </div>
    </div>
    <span style={{ color: "#6366f1", fontSize: 12 }}>⬇ Download</span>
  </div>
);

const FAQRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 18px",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{data.question}</div>
    <div style={{ fontSize: 13, color: "var(--cms-text-muted)", lineHeight: 1.6 }}>{data.answer}</div>
  </div>
);

const TestimonialRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "18px",
    }}
  >
    <div style={{ fontSize: 13, color: "var(--cms-text-muted)", marginBottom: 12, fontStyle: "italic" }}>
      "{data.quote}"
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontWeight: 600, fontSize: 13 }}>{data.name}</div>
      <div style={{ color: "#f59e0b" }}>{"★".repeat(data.rating || 5)}</div>
    </div>
  </div>
);

const AnalyticsCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "18px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 28, fontWeight: 800, color: "#6366f1" }}>{data.value}</div>
    <div style={{ fontSize: 13, color: "var(--cms-text-muted)", marginTop: 4 }}>{data.metric}</div>
    <div
      style={{
        fontSize: 11,
        marginTop: 4,
        color: data.trend === "up" ? "#22c55e" : data.trend === "down" ? "#ef4444" : "var(--cms-text-muted)",
      }}
    >
      {data.trend === "up" ? "↑ Up" : data.trend === "down" ? "↓ Down" : "→ Stable"}
    </div>
  </div>
);

const AssignmentCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 18px",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{data.title}</div>
    <div
      style={{
        display: "flex",
        gap: 16,
        fontSize: 12,
        color: "var(--cms-text-muted)",
      }}
    >
      <span>Due: {data.dueDate}</span>
      <span>
        {data.submissions}/{data.total} submitted
      </span>
    </div>
  </div>
);

const CertificateCardRenderer = ({ data }) => (
  <div
    style={{
      background: "linear-gradient(135deg,#1e1b4b,#312e81)",
      border: "1px solid #4338ca",
      borderRadius: 10,
      padding: "18px",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 28 }}>🏆</div>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#e0e7ff", marginTop: 8 }}>{data.title}</div>
    <div style={{ fontSize: 12, color: "#a5b4fc" }}>
      {data.issuer} · {data.validity}
    </div>
  </div>
);

const RoadmapStepRenderer = ({ data }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#6366f1",
        color: "#fff",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 14,
      }}
    >
      {data.step}
    </div>
    <div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{data.title}</div>
      <div style={{ fontSize: 12, color: "var(--cms-text-muted)", marginTop: 2 }}>{data.description}</div>
    </div>
  </div>
);

const ReportCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{data.title}</div>
      <div style={{ fontSize: 12, color: "var(--cms-text-muted)" }}>
        {data.type} · {data.date}
      </div>
    </div>
    <span style={{ color: "#6366f1", fontSize: 12 }}>View →</span>
  </div>
);

const PlacementCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "16px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14 }}>{data.company}</div>
    <div>
      <span style={{ fontWeight: 700, color: "#22c55e" }}>{data.placed}</span>
      <span style={{ fontSize: 12, color: "var(--cms-text-muted)", marginLeft: 4 }}>placed · {data.month}</span>
    </div>
  </div>
);

const SessionCardRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 10,
      padding: "14px 18px",
    }}
  >
    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{data.title}</div>
    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--cms-text-muted)" }}>
      <span>📅 {data.date}</span>
      <span>⏰ {data.time}</span>
      <span>⏱ {data.duration}</span>
    </div>
  </div>
);

const NavigationItemRenderer = ({ data }) => (
  <div
    style={{
      background: "var(--cms-surface-2)",
      border: "1px solid var(--cms-border)",
      borderRadius: 8,
      padding: "10px 16px",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
    }}
  >
    <span style={{ fontWeight: 500 }}>{data.label}</span>
    <span style={{ color: "var(--cms-text-muted)" }}>{data.href}</span>
  </div>
);

// ─── Component type → renderer map ────────────────────────────────────────────

const RENDERERS = {
  FeatureCard: FeatureCardRenderer,
  CourseCard: CourseCardRenderer,
  TrainerCard: TrainerCardRenderer,
  StudentCard: StudentCardRenderer,
  BatchCard: BatchCardRenderer,
  ResourceCard: ResourceCardRenderer,
  FAQItem: FAQRenderer,
  TestimonialCard: TestimonialRenderer,
  AnalyticsCard: AnalyticsCardRenderer,
  AssignmentCard: AssignmentCardRenderer,
  CertificateCard: CertificateCardRenderer,
  RoadmapStep: RoadmapStepRenderer,
  ReportCard: ReportCardRenderer,
  PlacementCard: PlacementCardRenderer,
  SessionCard: SessionCardRenderer,
  NavigationItem: NavigationItemRenderer,
};

// Section-level renderers (no child components)
const SECTION_RENDERERS = {
  HeroSection: HeroRenderer,
  CTASection: CTARenderer,
};

// ─── CMSRenderer ──────────────────────────────────────────────────────────────

/**
 * Props:
 *   sections     — array of section objects
 *   componentMap — { [sectionId]: component[] }
 */
const CMSRenderer = ({ sections = [], componentMap = {} }) => {
  if (!sections.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--cms-text-muted)" }}>
        No sections to preview. Add sections to see the live preview.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {sections
        .filter((s) => s.visible !== false)
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const SectionRenderer = SECTION_RENDERERS[section.type];
          const components = componentMap[section.id] || [];

          return (
            <div key={section.id}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--cms-text-muted)",
                  marginBottom: 10,
                }}
              >
                {section.label || section.type}
              </div>

              {/* Section-level renderer (Hero, CTA) */}
              {SectionRenderer && <SectionRenderer data={section.data || {}} />}

              {/* Component-based sections */}
              {!SectionRenderer && (
                <div>
                  {section.data?.title && (
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 14,
                        color: "var(--cms-text)",
                      }}
                    >
                      {section.data.title}
                    </h3>
                  )}
                  {components.length === 0 ? (
                    <div
                      style={{
                        padding: "20px 0",
                        color: "var(--cms-text-muted)",
                        fontSize: 13,
                        textAlign: "center",
                        border: "1px dashed var(--cms-border)",
                        borderRadius: 10,
                      }}
                    >
                      No components yet
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gap: 12,
                        gridTemplateColumns:
                          components.length === 1
                            ? "1fr"
                            : "repeat(auto-fill, minmax(260px, 1fr))",
                      }}
                    >
                      {components
                        .filter((c) => c.visible !== false)
                        .map((comp) => {
                          const Renderer = RENDERERS[comp.type];
                          if (!Renderer)
                            return (
                              <div
                                key={comp.id}
                                style={{
                                  background: "var(--cms-surface-2)",
                                  border: "1px solid var(--cms-border)",
                                  borderRadius: 10,
                                  padding: 14,
                                  fontSize: 12,
                                  color: "var(--cms-text-muted)",
                                }}
                              >
                                Unknown: {comp.type}
                              </div>
                            );
                          return <Renderer key={comp.id} data={comp.data || {}} />;
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default CMSRenderer;
