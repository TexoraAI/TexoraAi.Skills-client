// // src/trainer/ai-companion/AiContextResourceModal.jsx
// import { useState } from "react";
// import { X, FileText, Hash } from "lucide-react";

// export default function AiContextResourceModal({
//   isDark,
//   onSave,
//   onClose,
//   initialContext = "",
//   initialResourceIds = "",
// }) {
//   const [context, setContext] = useState(initialContext);
//   const [resourceIds, setResourceIds] = useState(initialResourceIds);

//   const bg = isDark ? "#111827" : "#ffffff";
//   const overlay = "rgba(0,0,0,0.55)";
//   const border = isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb";
//   const textPrimary = isDark ? "#f9fafb" : "#111827";
//   const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "#6b7280";
//   const inputBg = isDark ? "#1f2937" : "#f9fafb";

//   const handleSave = () => {
//     const ids = resourceIds
//       .split(",")
//       .map((s) => s.trim())
//       .filter(Boolean);
//     onSave({ additionalContext: context, resourceIds: ids });
//     onClose();
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: overlay,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 1000,
//         fontFamily: "'Poppins', sans-serif",
//       }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div
//         style={{
//           background: bg,
//           border: `1px solid ${border}`,
//           borderRadius: 16,
//           width: "100%",
//           maxWidth: 480,
//           boxShadow: isDark
//             ? "0 20px 60px rgba(0,0,0,0.6)"
//             : "0 20px 60px rgba(0,0,0,0.15)",
//           overflow: "hidden",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             padding: "18px 20px 14px",
//             borderBottom: `1px solid ${border}`,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <div
//               style={{
//                 fontSize: 15,
//                 fontWeight: 700,
//                 color: textPrimary,
//                 marginBottom: 2,
//               }}
//             >
//               Add Context & Resources
//             </div>
//             <div style={{ fontSize: 11, color: textSecondary }}>
//               Provide additional context or link resource IDs for the AI.
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               color: textSecondary,
//               padding: 4,
//               borderRadius: 6,
//             }}
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Body */}
//         <div style={{ padding: "18px 20px" }}>
//           {/* Additional context */}
//           <div style={{ marginBottom: 16 }}>
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: textSecondary,
//                 marginBottom: 8,
//                 letterSpacing: "0.04em",
//                 textTransform: "uppercase",
//               }}
//             >
//               <FileText size={12} />
//               Additional Context
//             </label>
//             <textarea
//               value={context}
//               onChange={(e) => setContext(e.target.value)}
//               placeholder="Add session notes, agenda, meeting description, or any relevant context that will help AI give better answers..."
//               rows={5}
//               style={{
//                 width: "100%",
//                 boxSizing: "border-box",
//                 padding: "10px 14px",
//                 borderRadius: 10,
//                 border: `1px solid ${border}`,
//                 background: inputBg,
//                 color: textPrimary,
//                 fontSize: 13,
//                 resize: "vertical",
//                 fontFamily: "'Poppins', sans-serif",
//                 outline: "none",
//                 lineHeight: 1.6,
//                 transition: "border-color 0.15s",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
//               onBlur={(e) => (e.target.style.borderColor = border)}
//             />
//           </div>

//           {/* Resource IDs */}
//           <div>
//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 6,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: textSecondary,
//                 marginBottom: 8,
//                 letterSpacing: "0.04em",
//                 textTransform: "uppercase",
//               }}
//             >
//               <Hash size={12} />
//               Resource IDs{" "}
//               <span style={{ fontWeight: 400, textTransform: "none" }}>
//                 (comma-separated)
//               </span>
//             </label>
//             <input
//               value={resourceIds}
//               onChange={(e) => setResourceIds(e.target.value)}
//               placeholder="e.g. 12, 45, 89"
//               style={{
//                 width: "100%",
//                 boxSizing: "border-box",
//                 padding: "10px 14px",
//                 borderRadius: 10,
//                 border: `1px solid ${border}`,
//                 background: inputBg,
//                 color: textPrimary,
//                 fontSize: 13,
//                 fontFamily: "'Poppins', sans-serif",
//                 outline: "none",
//                 transition: "border-color 0.15s",
//               }}
//               onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
//               onBlur={(e) => (e.target.style.borderColor = border)}
//             />
//             <p
//               style={{
//                 fontSize: 11,
//                 color: textSecondary,
//                 marginTop: 6,
//                 marginBottom: 0,
//               }}
//             >
//               Enter IDs of uploaded files or documents to include as reference.
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div
//           style={{
//             padding: "14px 20px",
//             borderTop: `1px solid ${border}`,
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: 10,
//           }}
//         >
//           <button
//             onClick={onClose}
//             style={{
//               padding: "8px 18px",
//               borderRadius: 8,
//               border: `1px solid ${border}`,
//               background: "transparent",
//               color: textSecondary,
//               cursor: "pointer",
//               fontSize: 13,
//               fontFamily: "'Poppins', sans-serif",
//               fontWeight: 500,
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.background = isDark
//                 ? "rgba(255,255,255,0.05)"
//                 : "#f3f4f6")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.background = "transparent")
//             }
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             style={{
//               padding: "8px 20px",
//               borderRadius: 8,
//               border: "none",
//               background: "#2563eb",
//               color: "#fff",
//               cursor: "pointer",
//               fontSize: 13,
//               fontFamily: "'Poppins', sans-serif",
//               fontWeight: 600,
//               boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
//               transition: "all 0.15s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
//             onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
//           >
//             Save & Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/trainer/ai-companion/AiContextResourceModal.jsx
import { useState } from "react";
import { X, FileText, Hash } from "lucide-react";

export default function AiContextResourceModal({
  isDark,
  onSave,
  onClose,
  initialContext = "",
  initialResourceIds = "",
}) {
  const [context, setContext] = useState(initialContext);
  const [resourceIds, setResourceIds] = useState(initialResourceIds);

  const bg = isDark ? "#111827" : "#ffffff";
  const overlay = "rgba(0,0,0,0.55)";
  const border = isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "rgba(255,255,255,0.5)" : "#6b7280";
  const inputBg = isDark ? "#1f2937" : "#f9fafb";

  const handleSave = () => {
    const ids = resourceIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({ additionalContext: context, resourceIds: ids });
    onClose();
  };

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
          maxWidth: 480,
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
                marginBottom: 2,
              }}
            >
              Add Context & Resources
            </div>
            <div style={{ fontSize: 11, color: textSecondary }}>
              Provide additional context or link resource IDs for the AI.
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
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px" }}>
          {/* Additional context */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: textSecondary,
                marginBottom: 8,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <FileText size={12} />
              Additional Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add session notes, agenda, meeting description, or any relevant context that will help AI give better answers..."
              rows={5}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 13,
                resize: "vertical",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                lineHeight: 1.6,
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
          </div>

          {/* Resource IDs */}
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: textSecondary,
                marginBottom: 8,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <Hash size={12} />
              Resource IDs{" "}
              <span style={{ fontWeight: 400, textTransform: "none" }}>
                (comma-separated)
              </span>
            </label>
            <input
              value={resourceIds}
              onChange={(e) => setResourceIds(e.target.value)}
              placeholder="e.g. 12, 45, 89"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 14px",
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 13,
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = border)}
            />
            <p
              style={{
                fontSize: 11,
                color: textSecondary,
                marginTop: 6,
                marginBottom: 0,
              }}
            >
              Enter IDs of uploaded files or documents to include as reference.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: `1px solid ${border}`,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
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
              (e.currentTarget.style.background = isDark
                ? "rgba(255,255,255,0.05)"
                : "#f3f4f6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          >
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}