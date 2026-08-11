// import fileService from "@/services/fileService";
// import {
//   ArrowLeft,
//   BookOpen,
//   FileText,
//   HardDrive,
//   Mail,
//   Search,
//   Tag,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// /* ─── Styles ─────────────────────────────────────────────────────── */
// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .af-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

// .af{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .af-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

// .af-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
// .af-hdr-l{display:flex;align-items:center;gap:14px;}
// .af-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
// .af-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
// .af-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
// .af-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .af-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .af-sub{font-size:13px;color:var(--mu);margin:0;}
// .af-chips{display:flex;gap:10px;flex-wrap:wrap;}
// .af-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

// .af-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
// .af-search{position:relative;}
// .af-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
// .af-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
// .af-search input::placeholder{color:var(--mu);}
// .af-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}

// .af-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .af-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
// .af-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
// .af-thead-sub{font-size:11px;color:var(--mu);margin:0;}

// .af-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);animation:af-pulse 1.4s ease-in-out infinite;}
// @keyframes af-pulse{0%,100%{opacity:1}50%{opacity:.45}}
// .af-skel-l{display:flex;align-items:center;gap:12px;}
// .af-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
// .af-skel-line{height:10px;border-radius:6px;background:var(--bd);}
// .af-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}

// .af-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
// .af-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .af-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
// .af-empty-s{font-size:12px;color:var(--mu);margin:0;}

// table.af-t{width:100%;border-collapse:collapse;font-size:13px;}
// .af-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
// .af-t thead th:first-child{padding-left:22px;}
// .af-t thead th:last-child{text-align:right;padding-right:22px;}
// .af-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
// .af-t tbody tr:last-child{border-bottom:none;}
// .af-t tbody tr:hover{background:rgba(34,211,238,.025);}
// .af-t tbody td{padding:12px 14px;vertical-align:middle;}
// .af-t tbody td:first-child{padding-left:22px;}
// .af-t tbody td:last-child{padding-right:22px;text-align:right;}
// .af-idx{font-size:12px;font-weight:700;color:var(--mu);}
// .af-file-cell{display:flex;align-items:center;gap:12px;min-width:0;}
// .af-file-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .af-file-text{min-width:0;}
// .af-file-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;}
// .af-t tbody tr:hover .af-file-name{color:var(--c1);}
// .af-file-sub{font-size:11px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;margin-top:1px;}
// .af-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
// .af-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
// .af-status-pub{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
// .af-status-draft{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(251,146,60,.10);border:1px solid rgba(251,146,60,.20);color:var(--c2);}
// .af-status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;}
// .af-size-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:12px;font-weight:600;color:var(--tx);}
// `;

// if (!document.getElementById("af-st")) {
//   const t = document.createElement("style");
//   t.id = "af-st";
//   t.textContent = STYLES;
//   document.head.appendChild(t);
// }

// const isDark = () =>
//   document.documentElement.classList.contains("dark") ||
//   document.body.classList.contains("dark") ||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const CAT_COLORS = [
//   {
//     bg: "rgba(34,211,238,.10)",
//     color: "var(--c1)",
//     bd: "rgba(34,211,238,.20)",
//   },
//   {
//     bg: "rgba(167,139,250,.10)",
//     color: "var(--c4)",
//     bd: "rgba(167,139,250,.20)",
//   },
//   {
//     bg: "rgba(251,146,60,.10)",
//     color: "var(--c2)",
//     bd: "rgba(251,146,60,.20)",
//   },
//   {
//     bg: "rgba(52,211,153,.10)",
//     color: "var(--c3)",
//     bd: "rgba(52,211,153,.20)",
//   },
//   {
//     bg: "rgba(248,113,113,.10)",
//     color: "var(--cr)",
//     bd: "rgba(248,113,113,.20)",
//   },
// ];
// const catColor = (val) =>
//   CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

// const GRAD_BG = [
//   "linear-gradient(135deg,#6d28d9,#4338ca)",
//   "linear-gradient(135deg,#0891b2,#0e7490)",
//   "linear-gradient(135deg,#be123c,#9f1239)",
//   "linear-gradient(135deg,#b45309,#92400e)",
//   "linear-gradient(135deg,#047857,#065f46)",
//   "linear-gradient(135deg,#1d4ed8,#1e40af)",
// ];
// const gradBg = (val) =>
//   GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

// const formatSize = (file) => {
//   const kb = Math.round((file.size || 0) / 1024);
//   return `${kb} KB`;
// };

// /* ════════════════════════════════════════════════════════════════════
//    MAIN
// ════════════════════════════════════════════════════════════════════ */
// const AdminFiles = () => {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(isDark);

//   const [search, setSearch] = useState("");
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const o = new MutationObserver(() => setDark(isDark()));
//     o.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => o.disconnect();
//   }, []);

//   useEffect(() => {
//     loadFiles();
//   }, []);

//   const loadFiles = () => {
//     setLoading(true);
//     fileService
//       .getAllFilesAdmin()
//       .then((res) => setFiles(res.data || []))
//       .catch((err) =>
//         console.error(
//           "Failed to load files",
//           err.response?.status,
//           err.response?.data,
//         ),
//       )
//       .finally(() => setLoading(false));
//   };

//   const filteredFiles = files.filter((f) => {
//     const q = search.toLowerCase();
//     if (!q) return true;
//     const title = (f.title || f.originalName || "").toLowerCase();
//     const trainer = (f.trainerEmail || "").toLowerCase();
//     return title.includes(q) || trainer.includes(q);
//   });

//   const publishedCount = files.filter((f) => f.status === "published").length;
//   const totalSizeKB = Math.round(
//     files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024,
//   );

//   return (
//     <div className={`af${dark ? " af-dk" : ""}`}>
//       <div className="af-inner">
//         {/* ── Header ── */}
//         <div className="af-hdr">
//           <div className="af-hdr-l">
//             <button className="af-back" onClick={() => navigate(-1)}>
//               <ArrowLeft size={14} /> Back
//             </button>
//             <div className="af-hdr-ico">
//               <FileText size={24} />
//             </div>
//             <div>
//               <div className="af-bdg">
//                 <FileText size={10} /> File Management
//               </div>
//               <h1 className="af-h1">All Files</h1>
//               <p className="af-sub">
//                 Every document uploaded by trainers across your organization
//               </p>
//             </div>
//           </div>
//           <div className="af-chips">
//             <div className="af-chip">
//               <FileText size={14} style={{ color: "var(--c1)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c1)" }}>
//                 {files.length}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>Files</span>
//             </div>
//             <div className="af-chip">
//               <HardDrive size={14} style={{ color: "var(--c4)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c4)" }}>
//                 {totalSizeKB}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Storage KB
//               </span>
//             </div>
//             <div className="af-chip">
//               <HardDrive size={14} style={{ color: "var(--c3)" }} />
//               <span style={{ fontWeight: 800, color: "var(--c3)" }}>
//                 {publishedCount}
//               </span>
//               <span style={{ color: "var(--mu)", fontWeight: 500 }}>
//                 Published
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* ── Action bar ── */}
//         <div className="af-abar">
//           <div className="af-search">
//             <Search size={14} />
//             <input
//               placeholder="Search by title or trainer…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* ── Table card ── */}
//         <div className="af-tcard">
//           <div className="af-thead-row">
//             <div>
//               <p className="af-thead-title">File List</p>
//               <p className="af-thead-sub">
//                 {filteredFiles.length} file
//                 {filteredFiles.length !== 1 && "s"} found
//               </p>
//             </div>
//           </div>

//           {loading &&
//             [1, 2, 3].map((i) => (
//               <div key={i} className="af-skel-row">
//                 <div className="af-skel-l">
//                   <div className="af-skel-sq" />
//                   <div>
//                     <div
//                       className="af-skel-line"
//                       style={{ width: 180, marginBottom: 8 }}
//                     />
//                     <div className="af-skel-line" style={{ width: 110 }} />
//                   </div>
//                 </div>
//                 <div className="af-skel-pill" />
//               </div>
//             ))}

//           {!loading && filteredFiles.length === 0 && (
//             <div className="af-empty">
//               <div className="af-empty-ico">
//                 <FileText size={26} />
//               </div>
//               <p className="af-empty-t">No files found</p>
//               <p className="af-empty-s">
//                 Files uploaded by trainers will appear here
//               </p>
//             </div>
//           )}

//           {!loading && filteredFiles.length > 0 && (
//             <table className="af-t">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>File</th>
//                   <th>Category</th>
//                   <th>Trainer</th>
//                   <th>Batch</th>
//                   <th>Status</th>
//                   <th>Size</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredFiles.map((f, index) => {
//                   const cc = catColor(f.category);
//                   const title = f.title || f.originalName || "Untitled";
//                   const isPublished = f.status === "published";
//                   return (
//                     <tr key={f.id}>
//                       <td>
//                         <span className="af-idx">
//                           {String(index + 1).padStart(2, "0")}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="af-file-cell">
//                           <div
//                             className="af-file-av"
//                             style={{ background: gradBg(title) }}
//                           >
//                             <FileText size={16} color="white" />
//                           </div>
//                           <div className="af-file-text">
//                             <div className="af-file-name">{title}</div>
//                             {f.courseId && (
//                               <div className="af-file-sub">
//                                 <BookOpen
//                                   size={9}
//                                   style={{
//                                     marginRight: 3,
//                                     verticalAlign: "middle",
//                                   }}
//                                 />
//                                 Course #{f.courseId}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td>
//                         <span
//                           className="af-cat-tag"
//                           style={{
//                             background: cc.bg,
//                             color: cc.color,
//                             borderColor: cc.bd,
//                           }}
//                         >
//                           <Tag size={11} /> {f.category || "—"}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="af-trainer-cell">
//                           <Mail size={12} /> {f.trainerEmail || "—"}
//                         </div>
//                       </td>
//                       <td>
//                         <span
//                           style={{
//                             fontSize: 12,
//                             color: "var(--mu)",
//                             fontWeight: 600,
//                           }}
//                         >
//                           {f.batchId ?? "—"}
//                         </span>
//                       </td>
//                       <td>
//                         {isPublished ? (
//                           <span className="af-status-pub">
//                             <span className="af-status-dot" /> Published
//                           </span>
//                         ) : (
//                           <span className="af-status-draft">
//                             <span className="af-status-dot" /> Draft
//                           </span>
//                         )}
//                       </td>
//                       <td>
//                         <div className="af-size-cell">
//                           <HardDrive size={12} style={{ color: "var(--mu)" }} />{" "}
//                           {formatSize(f)}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminFiles;









































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fileService from "@/services/fileService";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  HardDrive,
  Mail,
  Search,
  Tag,
} from "lucide-react";

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

function RowSkeleton({ t }) {
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
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: RADIUS.chip, background: t.barBg, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div style={{ height: 10, borderRadius: 5, background: t.barBg, width: "45%" }} />
        <div style={{ height: 8, borderRadius: 4, background: t.barBg, width: "25%" }} />
      </div>
      <div style={{ height: 20, width: 78, borderRadius: RADIUS.pill, background: t.barBg, flexShrink: 0 }} />
    </div>
  );
}

/* ── colour lookup, drawn from the same accent palette used across the
   design system's StatCard colorKeys (blue / green / amber / purple / red) ── */
const PALETTE = ["#3b82f6", ACCENT_PURPLE.base, "#f59e0b", "#16a34a", "#ef4444"];
const paletteColor = (val) => PALETTE[(String(val ?? "")?.charCodeAt(0) ?? 0) % PALETTE.length];

const formatSize = (file) => {
  const kb = Math.round((file.size || 0) / 1024);
  return `${kb} KB`;
};

function Badge({ color, Icon, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: RADIUS.pill,
        fontSize: 11,
        fontWeight: FONT_WEIGHT.bold,
        fontFamily: FONT_FAMILY,
        color,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  );
}

/* single file row */
function FileRow({ t, file, index }) {
  const title = file.title || file.originalName || "Untitled";
  const isPublished = file.status === "published";
  const catColor = paletteColor(file.category);

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
      <span
        style={{
          fontSize: 11,
          fontWeight: FONT_WEIGHT.bold,
          color: t.textMuted,
          fontFamily: FONT_FAMILY,
          width: 20,
          flexShrink: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <IconBadge icon={FileText} color={paletteColor(title)} size={34} iconSize={15} />

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
          {title}
        </div>
        {file.courseId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: t.textMuted,
              fontFamily: FONT_FAMILY,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <BookOpen size={10} /> Course #{file.courseId}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            color: t.textMuted,
            fontFamily: FONT_FAMILY,
            marginTop: 2,
          }}
        >
          <Mail size={10} /> {file.trainerEmail || "—"}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
        <Badge color={catColor} Icon={Tag}>
          {file.category || "—"}
        </Badge>
        <span
          style={{
            fontSize: 11,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.textMuted,
            fontFamily: FONT_FAMILY,
            whiteSpace: "nowrap",
          }}
        >
          Batch {file.batchId ?? "—"}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: RADIUS.pill,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.bold,
            fontFamily: FONT_FAMILY,
            color: isPublished ? "#16a34a" : "#f59e0b",
            background: isPublished ? "#16a34a18" : "#f59e0b18",
            border: `1px solid ${isPublished ? "#16a34a30" : "#f59e0b30"}`,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          {isPublished ? "Published" : "Draft"}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: FONT_WEIGHT.semibold,
            color: t.text,
            fontFamily: FONT_FAMILY,
            whiteSpace: "nowrap",
          }}
        >
          <HardDrive size={11} color={t.textMuted} /> {formatSize(file)}
        </span>
      </div>
    </div>
  );
}

/* ══ MAIN ══ */
const AdminFiles = () => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    setLoading(true);
    fileService
      .getAllFilesAdmin()
      .then((res) => setFiles(res.data || []))
      .catch((err) =>
        console.error("Failed to load files", err.response?.status, err.response?.data),
      )
      .finally(() => setLoading(false));
  };

  const filteredFiles = files.filter((f) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const title = (f.title || f.originalName || "").toLowerCase();
    const trainer = (f.trainerEmail || "").toLowerCase();
    return title.includes(q) || trainer.includes(q);
  });

  const publishedCount = files.filter((f) => f.status === "published").length;
  const totalSizeKB = Math.round(files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024);

  const stats = [
    { label: "Total Files", numericValue: files.length, icon: FileText, colorKey: "blue", change: "All uploaded documents" },
    { label: "Storage Used", numericValue: totalSizeKB, icon: HardDrive, colorKey: "purple", change: "Total size, in KB" },
    { label: "Published", numericValue: publishedCount, icon: HardDrive, colorKey: "green", change: "Live for students" },
  ];

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @media (max-width:640px){
          .af-search{max-width:none !important;}
        }
      `}</style>

      {/* ═══ HERO — shared <Hero> component, matches Admin Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: RADIUS.pill,
                border: `1px solid ${t.pillBorder}`,
                background: t.pillBg,
                color: t.pillText,
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              File Management
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              color: ACCENT_PURPLE.base,
              margin: "0 0 6px",
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
            }}
          >
            All Files
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Every document uploaded by trainers across your organization
          </p>
        </div>

        <div className="hero-badges">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: RADIUS.chip,
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.semibold,
              fontFamily: FONT_FAMILY,
              color: t.textSub,
              flexWrap: "wrap",
            }}
          >
            <span>{files.length} files</span>
            <span style={{ width: 1, height: 14, background: t.actBorder }} />
            <span>{publishedCount} published</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ STAT CARDS — shared <StatCard>, via the shared .stat-grid class ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={loading} mode={dark ? "dark" : "light"} />
        ))}
      </div>

      {/* ═══ SEARCH BAR ═══ */}
      <SectionCard t={t} style={{ marginBottom: 14 }}>
        <div className="af-search" style={{ position: "relative", width: "100%", maxWidth: 300 }}>
          <Search size={14} color={t.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            placeholder="Search by title or trainer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px 9px 34px",
              borderRadius: RADIUS.chip,
              border: `1px solid ${t.recentItemBorder}`,
              background: t.recentItemBg,
              color: t.text,
              fontFamily: FONT_FAMILY,
              fontSize: 12.5,
              fontWeight: FONT_WEIGHT.medium,
              outline: "none",
            }}
          />
        </div>
      </SectionCard>

      {/* ═══ FILE LIST ═══ */}
      <SectionCard t={t}>
        <SectionHeader
          t={t}
          icon={FileText}
          color={ACCENT_PURPLE.base}
          title="File List"
          sub={`${filteredFiles.length} file${filteredFiles.length !== 1 ? "s" : ""} found`}
        />

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <RowSkeleton key={i} t={t} />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <EmptyBlock t={t} icon={FileText} title="No files found" sub="Files uploaded by trainers will appear here" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredFiles.map((f, index) => (
              <FileRow key={f.id} t={t} file={f} index={index} />
            ))}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
};

export default AdminFiles;