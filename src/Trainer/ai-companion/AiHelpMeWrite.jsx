// // src/trainer/ai-companion/AiHelpMeWrite.jsx
// import { useState } from "react";
// import {
//   PenLine,
//   Plus,
//   FileText,
//   Sparkles,
//   Copy,
//   Check,
//   Trash2,
// } from "lucide-react";
// import AiTemplateGalleryModal from "./AiTemplateGalleryModal";
// import AiContextResourceModal from "./AiContextResourceModal";

// const SAMPLE_RECENT_DOCS = [
//   {
//     id: 1,
//     title: "Q1 Training Plan",
//     type: "Document",
//     date: "Today",
//   },
//   {
//     id: 2,
//     title: "Student Feedback Summary",
//     type: "Notes",
//     date: "Yesterday",
//   },
//   {
//     id: 3,
//     title: "Course Curriculum",
//     type: "Document",
//     date: "2 days ago",
//   },
// ];

// export default function AiHelpMeWrite({ isDark }) {
//   const [content, setContent] = useState("");
//   const [showTemplateModal, setShowTemplateModal] = useState(false);
//   const [showContextModal, setShowContextModal] = useState(false);
//   const [additionalContext, setAdditionalContext] = useState("");
//   const [resourceIds, setResourceIds] = useState([]);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [copied, setCopied] = useState(false);

//   const bg = isDark ? "#0d1117" : "#f0f4f8";
//   const panelBg = isDark ? "#111827" : "#ffffff";
//   const border = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   const textPrimary = isDark ? "#f9fafb" : "#111827";
//   const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
//   const inputBg = isDark ? "#1a2233" : "#ffffff";
//   const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
//   const accentBg = isDark ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.05)";

//   const handleCopyContent = () => {
//     navigator.clipboard.writeText(content);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleClearContent = () => {
//     setContent("");
//   };

//   const handleSelectTemplate = (template) => {
//     setSelectedTemplate(template);
//     setContent(template.placeholder);
//     setShowTemplateModal(false);
//   };

//   const handleSaveContext = (data) => {
//     setAdditionalContext(data.additionalContext);
//     setResourceIds(data.resourceIds);
//   };

//   const handleOpenRecentDoc = (doc) => {
//     // Simulate loading document content
//     setContent(`Content from: ${doc.title}\n\n${doc.title} content goes here...`);
//   };

//   return (
//     <div
//       style={{
//         flex: 1,
//         display: "flex",
//         background: bg,
//         overflow: "hidden",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       {/* Main writing area */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           minHeight: 0,
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "16px 24px",
//             borderBottom: `1px solid ${border}`,
//             background: panelBg,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             flexShrink: 0,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//             <div
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 10,
//                 background: "rgba(37,99,235,0.1)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <PenLine size={18} color="#2563eb" />
//             </div>
//             <div>
//               <h2
//                 style={{
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: textPrimary,
//                   margin: 0,
//                 }}
//               >
//                 Help Me Write
//               </h2>
//               <p
//                 style={{
//                   fontSize: 11,
//                   color: textSecondary,
//                   margin: "2px 0 0 0",
//                 }}
//               >
//                 AI-powered writing assistant for your content
//               </p>
//             </div>
//           </div>

//           <div style={{ display: "flex", gap: 6 }}>
//             {content && (
//               <button
//                 onClick={handleCopyContent}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "8px 14px",
//                   borderRadius: 8,
//                   border: `1px solid ${border}`,
//                   background: "transparent",
//                   cursor: "pointer",
//                   color: copied ? "#10b981" : textSecondary,
//                   fontSize: 12,
//                   fontWeight: 600,
//                   fontFamily: "'Poppins', sans-serif",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = hoverBg)
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background = "transparent")
//                 }
//               >
//                 {copied ? <Check size={12} /> : <Copy size={12} />}
//                 {copied ? "Copied" : "Copy"}
//               </button>
//             )}
//             {content && (
//               <button
//                 onClick={handleClearContent}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                   padding: "8px 14px",
//                   borderRadius: 8,
//                   border: `1px solid ${border}`,
//                   background: "transparent",
//                   cursor: "pointer",
//                   color: textSecondary,
//                   fontSize: 12,
//                   fontWeight: 600,
//                   fontFamily: "'Poppins', sans-serif",
//                   transition: "all 0.15s",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.currentTarget.style.background = hoverBg)
//                 }
//                 onMouseLeave={(e) =>
//                   (e.currentTarget.style.background = "transparent")
//                 }
//               >
//                 <Trash2 size={12} />
//                 Clear
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Editor area */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             minHeight: 0,
//           }}
//         >
//           {/* Editor toolbar */}
//           <div
//             style={{
//               padding: "10px 16px",
//               borderBottom: `1px solid ${border}`,
//               background: isDark ? "#111827" : "#f9fafb",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//               flexWrap: "wrap",
//               flexShrink: 0,
//             }}
//           >
//             <button
//               onClick={() => setShowTemplateModal(true)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "7px 12px",
//                 borderRadius: 7,
//                 border: `1px solid ${border}`,
//                 background: "transparent",
//                 cursor: "pointer",
//                 color: textSecondary,
//                 fontSize: 12,
//                 fontWeight: 500,
//                 fontFamily: "'Poppins', sans-serif",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = accentBg;
//                 e.currentTarget.style.color = "#2563eb";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "transparent";
//                 e.currentTarget.style.color = textSecondary;
//               }}
//             >
//               <Plus size={12} />
//               Add Template
//             </button>

//             <button
//               onClick={() => setShowContextModal(true)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 padding: "7px 12px",
//                 borderRadius: 7,
//                 border: `1px solid ${
//                   additionalContext ? "#2563eb" : border
//                 }`,
//                 background: additionalContext ? accentBg : "transparent",
//                 cursor: "pointer",
//                 color: additionalContext ? "#2563eb" : textSecondary,
//                 fontSize: 12,
//                 fontWeight: 500,
//                 fontFamily: "'Poppins', sans-serif",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={(e) => {
//                 if (!additionalContext) {
//                   e.currentTarget.style.background = hoverBg;
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!additionalContext) {
//                   e.currentTarget.style.background = "transparent";
//                 }
//               }}
//             >
//               <Plus size={12} />
//               Add Context
//             </button>

//             <div style={{ flex: 1 }} />

//             {selectedTemplate && (
//               <div
//                 style={{
//                   fontSize: 11,
//                   color: textSecondary,
//                   fontFamily: "'Poppins', sans-serif",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 6,
//                 }}
//               >
//                 <span
//                   style={{
//                     padding: "3px 8px",
//                     borderRadius: 6,
//                     background: accentBg,
//                     color: "#2563eb",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {selectedTemplate.name}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Main editor */}
//           <div
//             style={{
//               flex: 1,
//               display: "flex",
//               overflow: "hidden",
//               minHeight: 0,
//             }}
//           >
//             {/* Text editor */}
//             <div
//               style={{
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 minHeight: 0,
//               }}
//             >
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="Start writing or select a template..."
//                 style={{
//                   flex: 1,
//                   padding: "20px",
//                   border: "none",
//                   background: panelBg,
//                   color: textPrimary,
//                   fontSize: 14,
//                   fontFamily: "'Poppins', sans-serif",
//                   resize: "none",
//                   outline: "none",
//                   lineHeight: 1.7,
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right sidebar */}
//       <div
//         style={{
//           width: "380px",
//           borderLeft: `1px solid ${border}`,
//           display: "flex",
//           flexDirection: "column",
//           minHeight: 0,
//           background: panelBg,
//         }}
//       >
//         {/* Recent docs header */}
//         <div
//           style={{
//             padding: "16px 16px 12px",
//             borderBottom: `1px solid ${border}`,
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               fontWeight: 600,
//               color: textSecondary,
//               letterSpacing: "0.05em",
//               textTransform: "uppercase",
//               marginBottom: 12,
//             }}
//           >
//             Recent Documents
//           </div>
//         </div>

//         {/* Recent docs list */}
//         <div
//           style={{
//             flex: 1,
//             overflowY: "auto",
//             padding: "12px",
//             display: "flex",
//             flexDirection: "column",
//             gap: 8,
//             minHeight: 0,
//           }}
//         >
//           {SAMPLE_RECENT_DOCS.map((doc) => (
//             <div
//               key={doc.id}
//               onClick={() => handleOpenRecentDoc(doc)}
//               style={{
//                 padding: "12px",
//                 borderRadius: 10,
//                 border: `1px solid ${border}`,
//                 background: hoverBg,
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = accentBg;
//                 e.currentTarget.style.borderColor = "#2563eb";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = hoverBg;
//                 e.currentTarget.style.borderColor = border;
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: 10,
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: 8,
//                     background: "rgba(37,99,235,0.1)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   <FileText size={14} color="#2563eb" />
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div
//                     style={{
//                       fontSize: 12,
//                       fontWeight: 600,
//                       color: textPrimary,
//                       marginBottom: 4,
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {doc.title}
//                   </div>
//                   <div
//                     style={{
//                       fontSize: 10,
//                       color: textSecondary,
//                     }}
//                   >
//                     {doc.type} • {doc.date}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* AI suggestions footer */}
//         <div
//           style={{
//             padding: "14px 16px",
//             borderTop: `1px solid ${border}`,
//             background: isDark ? "#111827" : "#f9fafb",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "flex-start",
//               gap: 8,
//               padding: "10px 12px",
//               borderRadius: 10,
//               background: accentBg,
//               border: "1px solid rgba(37,99,235,0.2)",
//             }}
//           >
//             <Sparkles size={14} color="#2563eb" style={{ flexShrink: 0 }} />
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontSize: 11,
//                   fontWeight: 600,
//                   color: "#2563eb",
//                   marginBottom: 2,
//                 }}
//               >
//                 AI Suggestions
//               </div>
//               <p
//                 style={{
//                   fontSize: 10,
//                   color: textSecondary,
//                   margin: 0,
//                   lineHeight: 1.4,
//                 }}
//               >
//                 Use templates and add context to get AI-powered writing suggestions.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Template modal */}
//       {showTemplateModal && (
//         <AiTemplateGalleryModal
//           isDark={isDark}
//           onSelectTemplate={handleSelectTemplate}
//           onClose={() => setShowTemplateModal(false)}
//         />
//       )}

//       {/* Context modal */}
//       {showContextModal && (
//         <AiContextResourceModal
//           isDark={isDark}
//           initialContext={additionalContext}
//           initialResourceIds={resourceIds.join(", ")}
//           onSave={handleSaveContext}
//           onClose={() => setShowContextModal(false)}
//         />
//       )}
//     </div>
//   );
// }

// src/trainer/ai-companion/AiHelpMeWrite.jsx
import { useState, useCallback } from "react";
import {
  PenLine,
  Plus,
  FileText,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Wand2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import AiTemplateGalleryModal from "./AiTemplateGalleryModal";
import AiContextResourceModal from "./AiContextResourceModal";
import { sendAiCompanionMessage } from "../../services/liveSessionService";

// Map template names to backend mode values
const TEMPLATE_MODE_MAP = {
  "Email Template": "EMAIL_TEMPLATE",
  "Report Template": "REPORT_TEMPLATE",
  "Lesson Plan": "LESSON_PLAN",
  "Meeting Notes": "MEETING_NOTES",
  "Course Syllabus": "COURSE_SYLLABUS",
  "Feedback Template": "FEEDBACK_TEMPLATE",
  "Blog Post": "HELP_ME_WRITE",
  "Project Proposal": "HELP_ME_WRITE",
};

const INITIAL_RECENT_DOCS = [
  { id: 1, title: "Q1 Training Plan", type: "Document", date: "Today" },
  {
    id: 2,
    title: "Student Feedback Summary",
    type: "Notes",
    date: "Yesterday",
  },
  { id: 3, title: "Course Curriculum", type: "Document", date: "2 days ago" },
];

export default function AiHelpMeWrite({ isDark }) {
  const [content, setContent] = useState("");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [additionalContext, setAdditionalContext] = useState("");
  const [resourceIds, setResourceIds] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copied, setCopied] = useState(false);

  const [aiOutput, setAiOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);
  const [aiError, setAiError] = useState(null);

  const [recentDocs, setRecentDocs] = useState(INITIAL_RECENT_DOCS);

  const bg = isDark ? "#0d1117" : "#f0f4f8";
  const panelBg = isDark ? "#111827" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.45)" : "#6b7280";
  const inputBg = isDark ? "#1a2233" : "#ffffff";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "#f3f4f6";
  const accentBg = isDark ? "rgba(37,99,235,0.08)" : "rgba(37,99,235,0.05)";

  const handleCopyContent = () => {
    const textToCopy = aiOutput || content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearContent = () => {
    setContent("");
    setAiOutput("");
    setAiError(null);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setContent(template.placeholder);
    setAiOutput("");
    setShowTemplateModal(false);
  };

  const handleSaveContext = (data) => {
    setAdditionalContext(data.additionalContext);
    const parsed = (Array.isArray(data.resourceIds) ? data.resourceIds : [])
      .map((id) => (typeof id === "string" ? parseInt(id, 10) : id))
      .filter((id) => !isNaN(id));
    setResourceIds(parsed);
  };

  const handleOpenRecentDoc = (doc) => {
    setContent(
      `Content from: ${doc.title}\n\n${doc.title} content goes here...`,
    );
    setAiOutput("");
  };

  const addToRecentDocs = useCallback((title, type = "Document") => {
    const truncated = title.length > 40 ? title.slice(0, 40) + "…" : title;
    setRecentDocs((prev) => [
      { id: Date.now(), title: truncated, type, date: "Just now" },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const runAiRequest = useCallback(
    async (mode, messageText, isImprove = false) => {
      setAiError(null);
      if (isImprove) setImproving(true);
      else setGenerating(true);

      try {
        const res = await sendAiCompanionMessage(
          null, // sessionId always null for Help Me Write
          mode,
          messageText,
          additionalContext || null,
          ["DOCS"],
          resourceIds,
          null,
          true,
        );

        const data = res.data || {};

        if (data.success === false) {
          setAiError(data.error || "AI generation failed. Please try again.");
          return;
        }

        const generated = data.response || data.message || data.content || "";

        if (!generated) {
          setAiError("No response received from AI. Please try again.");
          return;
        }

        setAiOutput(generated);

        // Add to recent docs
        const docTitle =
          selectedTemplate?.name ||
          (messageText ? messageText.slice(0, 40) : "Generated Document");
        addToRecentDocs(
          docTitle,
          selectedTemplate
            ? selectedTemplate.category || "Document"
            : "Document",
        );
      } catch (err) {
        console.error("Help Me Write AI error:", err);
        const errMsg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "AI service unavailable. Please try again.";
        setAiError(errMsg);
      } finally {
        setGenerating(false);
        setImproving(false);
      }
    },
    [additionalContext, resourceIds, selectedTemplate, addToRecentDocs],
  );

  const handleGenerate = () => {
    if (!content.trim()) return;
    const mode = selectedTemplate
      ? TEMPLATE_MODE_MAP[selectedTemplate.name] || "HELP_ME_WRITE"
      : "HELP_ME_WRITE";
    runAiRequest(mode, content.trim(), false);
  };

  const handleImprove = () => {
    const text = aiOutput || content;
    if (!text.trim()) return;
    runAiRequest(
      "HELP_ME_WRITE",
      `Improve this draft:\n\n${text.trim()}`,
      true,
    );
  };

  const contextLabel = (() => {
    if (additionalContext && resourceIds.length > 0)
      return `Context + ${resourceIds.length} resource${resourceIds.length > 1 ? "s" : ""}`;
    if (additionalContext) return "Context added";
    if (resourceIds.length > 0)
      return `${resourceIds.length} resource${resourceIds.length > 1 ? "s" : ""} selected`;
    return null;
  })();

  const isLoading = generating || improving;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        background: bg,
        overflow: "hidden",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Main writing area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${border}`,
            background: panelBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(37,99,235,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PenLine size={18} color="#2563eb" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: textPrimary,
                  margin: 0,
                }}
              >
                Help Me Write
              </h2>
              <p
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  margin: "2px 0 0 0",
                }}
              >
                AI-powered writing assistant for your content
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            {(content || aiOutput) && (
              <button
                onClick={handleCopyContent}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  background: "transparent",
                  cursor: "pointer",
                  color: copied ? "#10b981" : textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = hoverBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
            {(content || aiOutput) && (
              <button
                onClick={handleClearContent}
                disabled={isLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  background: "transparent",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  color: textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  opacity: isLoading ? 0.5 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Trash2 size={12} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Editor area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Editor toolbar */}
          <div
            style={{
              padding: "10px 16px",
              borderBottom: `1px solid ${border}`,
              background: isDark ? "#111827" : "#f9fafb",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setShowTemplateModal(true)}
              disabled={isLoading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 7,
                border: `1px solid ${border}`,
                background: "transparent",
                cursor: isLoading ? "not-allowed" : "pointer",
                color: textSecondary,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                opacity: isLoading ? 0.5 : 1,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = accentBg;
                  e.currentTarget.style.color = "#2563eb";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = textSecondary;
              }}
            >
              <Plus size={12} />
              Add Template
            </button>

            <button
              onClick={() => setShowContextModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 7,
                border: `1px solid ${contextLabel ? "#2563eb" : border}`,
                background: contextLabel ? accentBg : "transparent",
                cursor: "pointer",
                color: contextLabel ? "#2563eb" : textSecondary,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "'Poppins', sans-serif",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!contextLabel) e.currentTarget.style.background = hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!contextLabel)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <Plus size={12} />
              {contextLabel || "Add Context"}
            </button>

            <div style={{ flex: 1 }} />

            {selectedTemplate && (
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: accentBg,
                  color: "#2563eb",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {selectedTemplate.name}
              </span>
            )}

            {/* Improve Draft button */}
            {(aiOutput || content) && (
              <button
                onClick={handleImprove}
                disabled={isLoading || !content.trim()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 7,
                  border: `1px solid ${border}`,
                  background: "transparent",
                  cursor:
                    isLoading || !content.trim() ? "not-allowed" : "pointer",
                  color: textSecondary,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  opacity: isLoading || !content.trim() ? 0.5 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && content.trim())
                    e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {improving ? (
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      border: "2px solid rgba(107,114,128,0.3)",
                      borderTop: `2px solid ${textSecondary}`,
                      borderRadius: "50%",
                      animation: "hwSpin 0.8s linear infinite",
                      display: "inline-block",
                    }}
                  />
                ) : (
                  <RefreshCw size={11} />
                )}
                Improve Draft
              </button>
            )}

            {/* Generate with AI — primary action */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !content.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 7,
                border: "none",
                background:
                  isLoading || !content.trim()
                    ? isDark
                      ? "rgba(255,255,255,0.08)"
                      : "#e5e7eb"
                    : "#2563eb",
                cursor:
                  isLoading || !content.trim() ? "not-allowed" : "pointer",
                color: isLoading || !content.trim() ? textSecondary : "#fff",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Poppins', sans-serif",
                boxShadow:
                  !isLoading && content.trim()
                    ? "0 2px 10px rgba(37,99,235,0.3)"
                    : "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isLoading && content.trim())
                  e.currentTarget.style.background = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                if (!isLoading && content.trim())
                  e.currentTarget.style.background = "#2563eb";
              }}
            >
              {generating ? (
                <span
                  style={{
                    width: 11,
                    height: 11,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    animation: "hwSpin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
              ) : (
                <Wand2 size={11} />
              )}
              {generating ? "Generating…" : "Generate with AI"}
            </button>
          </div>

          {/* Error banner */}
          {aiError && (
            <div
              style={{
                margin: "10px 16px 0",
                padding: "9px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                fontSize: 12,
                color: "#dc2626",
                fontFamily: "'Poppins', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <AlertCircle size={13} />
              <span style={{ flex: 1 }}>{aiError}</span>
              <button
                onClick={() => setAiError(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#dc2626",
                  padding: 2,
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Main editor + output */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: aiOutput ? "column" : "column",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {/* Input editor */}
            <div
              style={{
                flex: aiOutput ? "0 0 40%" : 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                borderBottom: aiOutput ? `1px solid ${border}` : "none",
              }}
            >
              {aiOutput && (
                <div
                  style={{
                    padding: "6px 16px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: textSecondary,
                    background: isDark ? "#111827" : "#f9fafb",
                    borderBottom: `1px solid ${border}`,
                    flexShrink: 0,
                  }}
                >
                  Your Input
                </div>
              )}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing or select a template…"
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "20px",
                  border: "none",
                  background: panelBg,
                  color: textPrimary,
                  fontSize: 14,
                  fontFamily: "'Poppins', sans-serif",
                  resize: "none",
                  outline: "none",
                  lineHeight: 1.7,
                  opacity: isLoading ? 0.6 : 1,
                }}
              />
            </div>

            {/* AI Output area */}
            {aiOutput && (
              <div
                style={{
                  flex: "0 0 60%",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    padding: "6px 16px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#2563eb",
                    background: isDark ? "rgba(37,99,235,0.06)" : "#eff6ff",
                    borderBottom: `1px solid rgba(37,99,235,0.15)`,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Sparkles size={10} color="#2563eb" />
                  AI Generated
                </div>
                <textarea
                  value={aiOutput}
                  onChange={(e) => setAiOutput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "20px",
                    border: "none",
                    background: isDark ? "#0d1117" : "#f8faff",
                    color: textPrimary,
                    fontSize: 14,
                    fontFamily: "'Poppins', sans-serif",
                    resize: "none",
                    outline: "none",
                    lineHeight: 1.7,
                  }}
                />
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && !aiOutput && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark
                    ? "rgba(13,17,23,0.6)"
                    : "rgba(255,255,255,0.7)",
                  zIndex: 10,
                  gap: 10,
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "3px solid rgba(37,99,235,0.2)",
                    borderTop: "3px solid #2563eb",
                    borderRadius: "50%",
                    animation: "hwSpin 0.8s linear infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    color: "#2563eb",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {improving ? "Improving your draft…" : "Generating with AI…"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div
        style={{
          width: "300px",
          borderLeft: `1px solid ${border}`,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          background: panelBg,
        }}
      >
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: textSecondary,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Recent Documents
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minHeight: 0,
          }}
        >
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleOpenRecentDoc(doc)}
              style={{
                padding: "12px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: hoverBg,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = accentBg;
                e.currentTarget.style.borderColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.borderColor = border;
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(37,99,235,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={14} color="#2563eb" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: textPrimary,
                      marginBottom: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {doc.title}
                  </div>
                  <div style={{ fontSize: 10, color: textSecondary }}>
                    {doc.type} • {doc.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "14px 16px",
            borderTop: `1px solid ${border}`,
            background: isDark ? "#111827" : "#f9fafb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              background: accentBg,
              border: "1px solid rgba(37,99,235,0.2)",
            }}
          >
            <Sparkles size={14} color="#2563eb" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#2563eb",
                  marginBottom: 2,
                }}
              >
                AI Suggestions
              </div>
              <p
                style={{
                  fontSize: 10,
                  color: textSecondary,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Select a template, write your request, then click Generate with
                AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hwSpin { to { transform: rotate(360deg); } }
      `}</style>

      {showTemplateModal && (
        <AiTemplateGalleryModal
          isDark={isDark}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {showContextModal && (
        <AiContextResourceModal
          isDark={isDark}
          initialContext={additionalContext}
          initialResourceIds={resourceIds.join(", ")}
          onSave={handleSaveContext}
          onClose={() => setShowContextModal(false)}
        />
      )}
    </div>
  );
}
