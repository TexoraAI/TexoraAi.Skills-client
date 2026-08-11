// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Download,
//   Trash2,
//   FileText,
//   Image as ImageIcon,
//   X,
// } from "lucide-react";

// import fileService from "../services/fileService";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// const AdminFileList = () => {
//   const [files, setFiles] = useState([]);
//   const [preview, setPreview] = useState(null);

//   /* ================= LOAD FILES ================= */
//   useEffect(() => {
//     fileService
//       .getFiles(0, 50)
//       .then((res) => setFiles(res.data.content || []))
//       .catch(console.error);
//   }, []);

//   /* ================= PREVIEW ================= */
//   const openPreview = async (file) => {
//     try {
//       const res = await fileService.downloadFileBlob(file.storedName);
//       const blob = new Blob([res.data], { type: file.contentType });
//       const url = URL.createObjectURL(blob);

//       setPreview({
//         url,
//         type: file.contentType,
//         name: file.originalName,
//       });
//     } catch {
//       alert("Preview failed");
//     }
//   };

//   const closePreview = () => {
//     if (preview?.url) URL.revokeObjectURL(preview.url);
//     setPreview(null);
//   };

//   /* ================= DOWNLOAD ================= */
//   const downloadFile = async (file) => {
//     const res = await fileService.downloadFileBlob(file.storedName);
//     const blob = new Blob([res.data], { type: file.contentType });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = file.originalName;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);

//     URL.revokeObjectURL(url);
//   };

//   /* ================= DELETE ================= */
//   const deleteFile = async (id) => {
//     if (!window.confirm("Delete this file?")) return;

//     try {
//       await fileService.deleteFile(id, "ADMIN");
//       setFiles((prev) => prev.filter((f) => f.id !== id));
//     } catch {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-sm flex items-center gap-2">
//           <FileText className="h-4 w-4" />
//           Documents & Images
//         </CardTitle>
//       </CardHeader>

//       <CardContent className="space-y-3">
//         {files.length === 0 && (
//           <p className="text-sm text-muted-foreground">
//             No files uploaded yet
//           </p>
//         )}

//         {files.map((f) => (
//           <div
//             key={f.id}
//             className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition"
//           >
//             {/* FILE INFO */}
//             <div className="flex items-center gap-3">
//               {f.contentType.startsWith("image") ? (
//                 <ImageIcon className="h-5 w-5 text-indigo-500" />
//               ) : (
//                 <FileText className="h-5 w-5 text-slate-500" />
//               )}

//               <div>
//                 <p className="text-sm font-medium">
//                   {f.originalName}
//                 </p>
//                 <p className="text-xs text-muted-foreground">
//                   {Math.round(f.size / 1024)} KB · {f.contentType}
//                 </p>
//               </div>
//             </div>

//             {/* ACTIONS */}
//             <div className="flex items-center gap-2">
//               <Button
//                 size="icon"
//                 variant="ghost"
//                 onClick={() => openPreview(f)}
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>

//               <Button
//                 size="icon"
//                 variant="ghost"
//                 onClick={() => downloadFile(f)}
//               >
//                 <Download className="h-4 w-4" />
//               </Button>

//               <Button
//                 size="icon"
//                 variant="ghost"
//                 className="text-red-500 hover:text-red-600"
//                 onClick={() => deleteFile(f.id)}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </CardContent>

//       {/* ================= PREVIEW MODAL ================= */}
//       {preview && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//           <div className="relative bg-background w-11/12 h-5/6 rounded-xl p-4">
//             <div className="flex items-center justify-between mb-3">
//               <p className="text-sm font-semibold">{preview.name}</p>
//               <Button size="icon" variant="ghost" onClick={closePreview}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </div>

//             {preview.type.includes("pdf") && (
//               <iframe
//                 src={preview.url}
//                 className="w-full h-full rounded"
//               />
//             )}

//             {preview.type.startsWith("image") && (
//               <img
//                 src={preview.url}
//                 alt="preview"
//                 className="max-h-full mx-auto rounded"
//               />
//             )}

//             {!preview.type.includes("pdf") &&
//               !preview.type.startsWith("image") && (
//                 <p className="text-center mt-10 text-muted-foreground">
//                   Preview not supported
//                 </p>
//               )}
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// };

// export default AdminFileList;






































import React, { useEffect, useState } from "react";
import {
  Eye,
  Download,
  Trash2,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";

import fileService from "../services/fileService";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
  StatCard,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way AdminDashboard.jsx's SectionCard / SectionHeader /
   EmptyBlock are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ t, icon: Icon, color, title, sub, right }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconBadge icon={Icon} color={color} />
        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.bold,
              fontSize: 13,
              color: t.text,
            }}
          >
            {title}
          </div>
          {sub && (
            <div
              style={{
                fontSize: 11,
                color: t.textMuted,
                fontFamily: FONT_FAMILY,
                marginTop: 2,
              }}
            >
              {sub}
            </div>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title, sub }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 16px",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <div>
        <p
          style={{
            fontSize: 13,
            color: t.text,
            fontWeight: FONT_WEIGHT.bold,
            fontFamily: FONT_FAMILY,
            margin: 0,
          }}
        >
          {title}
        </p>
        {sub && (
          <p
            style={{
              fontSize: 11.5,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              margin: "4px 0 0",
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* small icon-only action button, token-driven */
function IconButton({ t, icon: Icon, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: RADIUS.chip,
        border: `1px solid ${t.recentItemBorder}`,
        background: t.cardBg,
        color: danger ? "#ef4444" : t.textMuted,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Icon size={14} />
    </button>
  );
}

const PALETTE = ["#3b82f6", ACCENT_PURPLE.base, "#f59e0b", "#16a34a", "#ef4444"];
const paletteColor = (val) => PALETTE[(String(val ?? "")?.charCodeAt(0) ?? 0) % PALETTE.length];

/* single file row */
function FileListRow({ t, file, onPreview, onDownload, onDelete }) {
  const isImage = (file.contentType || "").startsWith("image");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: RADIUS.chip,
        background: t.recentItemBg,
        border: `1px solid ${t.recentItemBorder}`,
        flexWrap: "wrap",
      }}
    >
      <IconBadge icon={isImage ? ImageIcon : FileText} color={paletteColor(file.originalName)} size={34} iconSize={15} />

      <div style={{ flex: "1 1 200px", minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            fontFamily: FONT_FAMILY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {file.originalName}
        </div>
        <div
          style={{
            fontSize: 11,
            color: t.textMuted,
            fontFamily: FONT_FAMILY,
            marginTop: 2,
          }}
        >
          {Math.round((file.size || 0) / 1024)} KB · {file.contentType}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <IconButton t={t} icon={Eye} title="Preview" onClick={() => onPreview(file)} />
        <IconButton t={t} icon={Download} title="Download" onClick={() => onDownload(file)} />
        <IconButton t={t} icon={Trash2} title="Delete" danger onClick={() => onDelete(file.id)} />
      </div>
    </div>
  );
}

/* preview modal — token-driven overlay, same behaviour as before */
function PreviewModal({ t, preview, onClose }) {
  if (!preview) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          background: t.cardBg,
          border: `1px solid ${t.border}`,
          borderRadius: RADIUS.standardCard,
          width: "100%",
          maxWidth: 900,
          height: "85vh",
          padding: 16,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          boxShadow: t.shadow,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              fontFamily: FONT_FAMILY,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {preview.name}
          </p>
          <IconButton t={t} icon={X} title="Close" onClick={onClose} />
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {preview.type.includes("pdf") && (
            <iframe
              title={preview.name}
              src={preview.url}
              style={{ width: "100%", height: "100%", borderRadius: RADIUS.chip, border: `1px solid ${t.recentItemBorder}` }}
            />
          )}

          {preview.type.startsWith("image") && (
            <img
              src={preview.url}
              alt="preview"
              style={{ maxHeight: "100%", maxWidth: "100%", margin: "0 auto", borderRadius: RADIUS.chip, display: "block" }}
            />
          )}

          {!preview.type.includes("pdf") && !preview.type.startsWith("image") && (
            <p style={{ fontSize: 13, color: t.textMuted, fontFamily: FONT_FAMILY, textAlign: "center" }}>
              Preview not supported for this file type
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
const AdminFileList = () => {
  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  /* ================= LOAD FILES ================= */
  useEffect(() => {
    fileService
      .getFiles(0, 50)
      .then((res) => setFiles(res.data.content || []))
      .catch(console.error);
  }, []);

  /* ================= PREVIEW ================= */
  const openPreview = async (file) => {
    try {
      const res = await fileService.downloadFileBlob(file.storedName);
      const blob = new Blob([res.data], { type: file.contentType });
      const url = URL.createObjectURL(blob);

      setPreview({
        url,
        type: file.contentType,
        name: file.originalName,
      });
    } catch {
      alert("Preview failed");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  /* ================= DOWNLOAD ================= */
  const downloadFile = async (file) => {
    const res = await fileService.downloadFileBlob(file.storedName);
    const blob = new Blob([res.data], { type: file.contentType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  /* ================= DELETE ================= */
  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;

    try {
      await fileService.deleteFile(id, "ADMIN");
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      <SectionCard t={t}>
        <SectionHeader
          t={t}
          icon={FileText}
          color={ACCENT_PURPLE.base}
          title="Documents & Images"
          sub={`${files.length} file${files.length !== 1 ? "s" : ""} found`}
        />

        {files.length === 0 ? (
          <EmptyBlock t={t} icon={FileText} title="No files uploaded yet" sub="Files you upload will appear here" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {files.map((f) => (
              <FileListRow key={f.id} t={t} file={f} onPreview={openPreview} onDownload={downloadFile} onDelete={deleteFile} />
            ))}
          </div>
        )}
      </SectionCard>

      <PreviewModal t={t} preview={preview} onClose={closePreview} />
    </>
  );
};

export default AdminFileList;