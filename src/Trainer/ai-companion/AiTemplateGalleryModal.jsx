// src/trainer/ai-companion/AiTemplateGalleryModal.jsx
import { useState } from "react";
import { X, Sparkles } from "lucide-react";

const WRITING_TEMPLATES = [
  {
    id: 1,
    name: "Email Template",
    description: "Professional email composition",
    placeholder:
      "Subject: [Add subject]\n\n[Add greeting],\n\n[Add main content]\n\n[Add closing]\n\nBest regards,\n[Your name]",
    category: "Communication",
  },
  {
    id: 2,
    name: "Report Template",
    description: "Structured report format",
    placeholder:
      "Report Title\n=============\n\nExecutive Summary\n-----------------\n[Summary here]\n\nKey Findings\n-----------\n• [Finding 1]\n• [Finding 2]\n• [Finding 3]\n\nRecommendations\n---------------\n[Recommendations here]\n\nConclusion\n----------\n[Conclusion here]",
    category: "Documentation",
  },
  {
    id: 3,
    name: "Lesson Plan",
    description: "Structured lesson planning",
    placeholder:
      "Lesson Title: [Title]\nGrade Level: [Grade]\n\nObjectives:\n-----------\nStudents will be able to:\n• [Objective 1]\n• [Objective 2]\n• [Objective 3]\n\nMaterials Needed:\n-----------------\n• [Material 1]\n• [Material 2]\n\nInstructional Approach:\n-----------------------\n[Describe approach]\n\nActivities:\n-----------\n[Describe activities]\n\nAssessment:\n-----------\n[Assessment method]\n\nHomework/Extension:\n-------------------\n[Homework details]",
    category: "Education",
  },
  {
    id: 4,
    name: "Meeting Notes",
    description: "Organized meeting documentation",
    placeholder:
      "Meeting Date: [Date]\nAttendees: [Names]\nLocation: [Location]\n\nAgenda Items\n------------\n1. [Item 1]\n2. [Item 2]\n3. [Item 3]\n\nKey Discussion Points\n--------------------\n[Discussion details]\n\nDecisions Made\n--------------\n• [Decision 1]\n• [Decision 2]\n\nAction Items\n-----------\n• [Item] - Owner: [Name] - Due: [Date]\n• [Item] - Owner: [Name] - Due: [Date]\n\nNext Meeting: [Date]",
    category: "Organization",
  },
  {
    id: 5,
    name: "Course Syllabus",
    description: "Complete course structure",
    placeholder:
      "Course Title: [Title]\nCourse Code: [Code]\nInstructor: [Name]\n\nCourse Description\n------------------\n[Description]\n\nLearning Outcomes\n-----------------\nStudents will:\n• [Outcome 1]\n• [Outcome 2]\n• [Outcome 3]\n\nRequired Materials\n------------------\n[Materials]\n\nGrading Breakdown\n-----------------\n• Participation: 10%\n• Assignments: 30%\n• Midterm: 30%\n• Final Project: 30%\n\nCourse Policies\n---------------\n[Policies]\n\nWeekly Topics\n-------------\nWeek 1: [Topic]\nWeek 2: [Topic]\n[etc.]\n\nResources\n---------\n[Resources]",
    category: "Education",
  },
  {
    id: 6,
    name: "Feedback Template",
    description: "Constructive feedback structure",
    placeholder:
      "Student Name: [Name]\nDate: [Date]\nAssignment: [Assignment]\n\nWhat You Did Well\n-----------------\n• [Strength 1]\n• [Strength 2]\n\nAreas for Improvement\n--------------------\n• [Area 1]: [Suggestion]\n• [Area 2]: [Suggestion]\n\nAction Steps\n-----------\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nResources & Support\n-------------------\n[Resources available]\n\nNext Review Date: [Date]",
    category: "Education",
  },
  {
    id: 7,
    name: "Blog Post",
    description: "Engaging blog article format",
    placeholder:
      "Title: [Your Title]\nAuthor: [Your Name]\nDate: [Publication Date]\n\nIntroduction\n-----------\n[Hook your reader with an engaging introduction]\n\nMain Points\n-----------\n\nPoint 1: [Your Topic]\n[Detailed explanation]\n\nPoint 2: [Your Topic]\n[Detailed explanation]\n\nPoint 3: [Your Topic]\n[Detailed explanation]\n\nConclusion\n----------\n[Summarize key takeaways and call to action]\n\nCall to Action\n--------------\n[Encourage reader engagement]",
    category: "Content",
  },
  {
    id: 8,
    name: "Project Proposal",
    description: "Project planning document",
    placeholder:
      "Project Title: [Title]\nProject Lead: [Name]\nStart Date: [Date]\n\nProject Overview\n---------------\n[Brief description]\n\nObjectives\n---------\n• [Objective 1]\n• [Objective 2]\n• [Objective 3]\n\nScope\n-----\n[What's included]\n\nTimeline\n--------\nPhase 1: [Description] - [Dates]\nPhase 2: [Description] - [Dates]\nPhase 3: [Description] - [Dates]\n\nBudget & Resources\n------------------\n[Resource needs]\n\nRisks & Mitigation\n------------------\n• Risk: [Risk] - Mitigation: [Strategy]\n\nSuccess Criteria\n---------------\n[How we'll measure success]\n\nNext Steps\n---------\n[Initial actions]",
    category: "Business",
  },
];

export default function AiTemplateGalleryModal({
  isDark,
  onSelectTemplate,
  onClose,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const bg = isDark ? "#111827" : "#ffffff";
  const overlay = "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const activeBg = isDark ? "rgba(37,99,235,0.15)" : "#eff6ff";

  const categories = [
    "All",
    ...new Set(WRITING_TEMPLATES.map((t) => t.category)),
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? WRITING_TEMPLATES
      : WRITING_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: overlay,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          width: "100%",
          maxWidth: 900,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: isDark
            ? "0 20px 60px rgba(0,0,0,0.6)"
            : "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: textPrimary,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 2,
              }}
            >
              <Sparkles size={16} color="#2563eb" />
              Writing Templates
            </div>
            <div style={{ fontSize: 11, color: textSecondary }}>
              Choose a template to get started with your writing
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
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Categories */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            gap: 8,
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 7,
                border: `1px solid ${
                  selectedCategory === cat ? "#2563eb" : border
                }`,
                background:
                  selectedCategory === cat ? activeBg : "transparent",
                color:
                  selectedCategory === cat ? "#2563eb" : textSecondary,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.background = hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            minHeight: 0,
          }}
        >
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              style={{
                padding: "16px",
                borderRadius: 12,
                border: `1px solid ${border}`,
                background: hoverBg,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = activeBg;
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(37,99,235,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.borderColor = border;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(37,99,235,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={16} color="#2563eb" />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {template.name}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: textSecondary,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {template.description}
                </p>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#2563eb",
                  fontWeight: 600,
                  marginTop: 4,
                }}
              >
                Use Template →
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${border}`,
            background: isDark ? "#1f2937" : "#f9fafb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: `1px solid ${border}`,
              background: "transparent",
              color: textSecondary,
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = hoverBg)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}