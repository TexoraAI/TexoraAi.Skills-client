import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import { progressService } from "../services/progressService";
import {
  CheckCircle,
  Eye,
  File,
  FileText,
  Image as ImageIcon,
  TrendingUp,
  X,
} from "lucide-react";

// ── Same Global Design System the Dashboard (Golden Reference),
// MyCourses, StudentCourseView, and VideoLectures use. Tokens,
// StatCard, and PageContainer are the single source of truth — the
// old dc-* CSS injection and its own indigo palette are gone.
import { T, StatCard, PageContainer, FONT_FAMILY, FONT_WEIGHT, FONT_SIZE, LETTER_SPACING, LINE_HEIGHT } from "@/design-system";

/* ─── Scoped CSS — kept ONLY for things inline styles genuinely can't
   reach: the mammoth-generated DOCX markup (dangerouslySetInnerHTML,
   so its <table>/<td> tags have no style props to hook into), the
   XLSX grid's sticky header + zebra/hover rows, the sheet tabs, and
   the loading spinner keyframe. Everything else below is inline + t.
   Office documents render on a fixed white "paper" background
   regardless of app theme — intentional, same as the original. ─── */
const DOC_VIEWER_CSS = `
  @keyframes docprev-spin { to { transform: rotate(360deg); } }
  .docprev-spinner {
    width: 36px; height: 36px; border-radius: 50%;
    border: 3px solid #e2e8f0; border-top-color: #6366f1;
    animation: docprev-spin 0.7s linear infinite;
  }
  .docprev-docx-content table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  .docprev-docx-content table td, .docprev-docx-content table th { border: 1px solid #d1d5db; padding: 8px 12px; font-size: 13px; }
  .docprev-docx-content table th { background: #f3f4f6; font-weight: ${FONT_WEIGHT.bold}; }
  .docprev-xlsx-table { border-collapse: collapse; font-size: ${FONT_SIZE.bodySmall}px; font-family: ${FONT_FAMILY}; white-space: nowrap; }
  .docprev-xlsx-table th { background: #6366f1; color: #fff; padding: 8px 14px; font-weight: ${FONT_WEIGHT.bold}; border: 1px solid #4f46e5; position: sticky; top: 0; }
  .docprev-xlsx-table td { padding: 7px 14px; border: 1px solid #e2e8f0; color: #1a1a1a; }
  .docprev-xlsx-table tr:nth-child(even) td { background: #f8fafc; }
  .docprev-xlsx-table tr:hover td { background: #ede9fe; }
  .docprev-xlsx-tab { padding: 6px 14px; border-radius: 8px 8px 0 0; font-size: ${FONT_SIZE.bodySmall}px; font-weight: ${FONT_WEIGHT.semibold}; cursor: pointer; border: none; font-family: ${FONT_FAMILY}; transition: all 0.15s; }
  .docprev-xlsx-tab.active { background: #6366f1; color: #fff; }
  .docprev-xlsx-tab:not(.active) { background: #e2e8f0; color: #64748b; }
  .docprev-xlsx-tab:not(.active):hover { background: #c7d2fe; color: #4338ca; }
`;

if (typeof document !== "undefined" && !document.getElementById("doc-viewer-styles")) {
  const tag = document.createElement("style");
  tag.id = "doc-viewer-styles";
  tag.textContent = DOC_VIEWER_CSS;
  document.head.appendChild(tag);
}

/* ─── Load scripts dynamically (unchanged) ─────────────────────── */
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });

/* ─── Helpers (unchanged) ─────────────────────────────────────── */
const getEmailFromToken = () => {
  try {
    const token = localStorage.getItem("lms_token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch { return null; }
};

const getViewMode = (originalName = "", contentType = "") => {
  const name = originalName.toLowerCase();
  const type = contentType.toLowerCase();
  if (name.endsWith(".pdf") || type.includes("pdf")) return "pdf";
  if (name.match(/\.(png|jpg|jpeg|gif|webp)$/) || type.startsWith("image")) return "image";
  if (name.endsWith(".txt") || type.includes("text/plain")) return "text";
  if (name.match(/\.(docx|doc)$/)) return "docx";
  if (name.match(/\.(xlsx|xls)$/)) return "xlsx";
  if (name.match(/\.(pptx|ppt)$/)) return "pptx";
  return "none";
};

const fileIconInfo = (originalName = "", contentType = "") => {
  const name = originalName.toLowerCase();
  const type = contentType.toLowerCase();
  if (name.endsWith(".pdf") || type.includes("pdf"))
    return { Icon: FileText, bg: "rgba(251,146,60,0.10)", color: "#fb923c" };
  if (type.startsWith("image") || name.match(/\.(png|jpg|jpeg|gif|webp)$/))
    return { Icon: ImageIcon, bg: "rgba(52,211,153,0.10)", color: "#34d399" };
  return { Icon: File, bg: "rgba(34,211,238,0.10)", color: "#22d3ee" };
};

/* ─── DOCX Viewer (logic unchanged, markup restyled) ───────────── */
const DocxViewer = ({ arrayBuffer }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js");
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        setHtml(result.value || "<p>No content found.</p>");
      } catch (e) {
        console.error("DOCX render error:", e);
        setError("Could not render this Word document.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontFamily: FONT_FAMILY, textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.35 }}>📄</div>
      <p style={{ fontWeight: FONT_WEIGHT.bold, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );

  if (!html) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
      <div className="docprev-spinner" />Rendering document…
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#ffffff", padding: 40, boxSizing: "border-box" }}>
      <div className="docprev-docx-content" style={{ maxWidth: 860, margin: "0 auto", fontFamily: "'Calibri','Segoe UI',sans-serif", fontSize: 14, lineHeight: 1.7, color: "#1a1a1a" }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

/* ─── XLSX Viewer (logic unchanged, markup restyled) ───────────── */
const XlsxViewer = ({ arrayBuffer }) => {
  const [sheets, setSheets] = useState({});
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
        const workbook = window.XLSX.read(arrayBuffer, { type: "array" });
        const names = workbook.SheetNames;
        const parsed = {};
        names.forEach((name) => {
          parsed[name] = window.XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
        });
        setSheets(parsed); setSheetNames(names); setActiveSheet(names[0] || "");
      } catch (e) {
        console.error("XLSX render error:", e);
        setError("Could not render this spreadsheet.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontFamily: FONT_FAMILY, textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.35 }}>📊</div>
      <p style={{ fontWeight: FONT_WEIGHT.bold, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );

  if (!activeSheet) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
      <div className="docprev-spinner" />Rendering spreadsheet…
    </div>
  );

  const rows = sheets[activeSheet] || [];
  const headers = rows[0] || [];
  const dataRows = rows.slice(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {sheetNames.length > 1 && (
        <div style={{ display: "flex", gap: 6, padding: "12px 24px 0", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", flexShrink: 0, flexWrap: "wrap" }}>
          {sheetNames.map((name) => (
            <button key={name} className={`docprev-xlsx-tab${activeSheet === name ? " active" : ""}`} onClick={() => setActiveSheet(name)}>{name}</button>
          ))}
        </div>
      )}
      <div style={{ flex: 1, overflow: "auto", background: "#ffffff", padding: 24 }}>
        <table className="docprev-xlsx-table">
          <thead><tr>{headers.map((h, i) => <th key={i}>{h !== undefined && h !== null ? String(h) : ""}</th>)}</tr></thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>{headers.map((_, ci) => <td key={ci}>{row[ci] !== undefined && row[ci] !== null ? String(row[ci]) : ""}</td>)}</tr>
            ))}
          </tbody>
        </table>
        {dataRows.length === 0 && <p style={{ color: "#64748b", fontFamily: FONT_FAMILY, fontSize: 13, textAlign: "center", marginTop: 24 }}>This sheet is empty.</p>}
      </div>
    </div>
  );
};

/* ─── PPTX Viewer (logic unchanged, already inline-styled) ─────── */
const PptxViewer = ({ arrayBuffer }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const slideFiles = Object.keys(zip.files)
          .filter((f) => f.match(/^ppt\/slides\/slide\d+\.xml$/))
          .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

        if (slideFiles.length === 0) { setError("No slides found in this presentation."); return; }

        const parsedSlides = await Promise.all(
          slideFiles.map(async (slideFile) => {
            const xmlStr = await zip.files[slideFile].async("string");
            const xmlDoc = new DOMParser().parseFromString(xmlStr, "application/xml");
            const texts = [];
            xmlDoc.querySelectorAll("t").forEach((el) => { const tx = el.textContent?.trim(); if (tx) texts.push(tx); });
            return texts;
          }),
        );
        setSlides(parsedSlides); setCurrentSlide(0);
      } catch (e) {
        console.error("PPTX render error:", e);
        setError("Could not render this presentation.");
      }
    })();
  }, [arrayBuffer]);

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontFamily: FONT_FAMILY, textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 44, opacity: 0.35 }}>📊</div>
      <p style={{ fontWeight: FONT_WEIGHT.bold, margin: "0 0 6px", color: "#0f172a" }}>{error}</p>
    </div>
  );
  if (slides.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: "#64748b", fontSize: 14, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
      <div className="docprev-spinner" />Rendering presentation…
    </div>
  );

  const slide = slides[currentSlide] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#1e1e2e" }}>
      <div style={{ flex: 1, overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 720, minHeight: 380, background: "#ffffff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.4)", padding: "40px 48px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 11, fontWeight: FONT_WEIGHT.bold, color: "#6366f1", fontFamily: FONT_FAMILY, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Slide {currentSlide + 1} / {slides.length}
          </div>
          {slide.length === 0 ? (
            <p style={{ color: "#94a3b8", fontFamily: FONT_FAMILY, fontSize: 14 }}>(Empty slide or image-only content)</p>
          ) : (
            slide.map((text, i) => (
              <p key={i} style={{ margin: 0, fontSize: i === 0 ? 20 : 14, fontWeight: i === 0 ? FONT_WEIGHT.bold : FONT_WEIGHT.regular, color: i === 0 ? "#1e1b4b" : "#374151", fontFamily: FONT_FAMILY, lineHeight: 1.6 }}>
                {i === 0 ? text : `• ${text}`}
              </p>
            ))
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "12px 20px", background: "rgba(0,0,0,0.4)", flexShrink: 0 }}>
        <button onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))} disabled={currentSlide === 0}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: currentSlide === 0 ? "rgba(255,255,255,0.1)" : "#6366f1", color: currentSlide === 0 ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: FONT_FAMILY, fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.bold, cursor: currentSlide === 0 ? "not-allowed" : "pointer" }}>
          ← Prev
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              style={{ width: i === currentSlide ? 24 : 8, height: 8, borderRadius: 4, border: "none", background: i === currentSlide ? "#6366f1" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />
          ))}
        </div>
        <button onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))} disabled={currentSlide === slides.length - 1}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.1)" : "#6366f1", color: currentSlide === slides.length - 1 ? "rgba(255,255,255,0.3)" : "#fff", fontFamily: FONT_FAMILY, fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.bold, cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer" }}>
          Next →
        </button>
      </div>
    </div>
  );
};

/* ═══════════ MAIN COMPONENT ═══════════
   All fetch/preview/progress logic below is unchanged from the
   original; only the JSX/markup was migrated to the shared design
   system. ═══════════ */
const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [preview, setPreview] = useState(null);
  const [downloadedFileIds, setDownloadedFileIds] = useState([]);
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const studentEmail = getEmailFromToken();

  /* ── dark mode detection identical to the rest of the app ── */
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      (document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark"),
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setIsDark(
        document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark",
      );
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);

  const t = isDark ? T.dark : T.light;

  useEffect(() => {
    fileService.getStudentFiles().then(async (res) => {
      const data = res.data || [];
      setDocs(data);
      if (data.length > 0 && studentEmail) {
        try {
          const prog = await progressService.getFileProgress(studentEmail, data[0].batchId);
          setDownloadedFileIds(prog.data.downloadedFileIds || []);
          setDownloadPercentage(prog.data.downloadPercentage || 0);
        } catch {
          setDownloadedFileIds([]); setDownloadPercentage(0);
        }
      }
    }).catch(console.error);
  }, []);

  const openPreview = async (file) => {
    try {
      const res = await fileService.viewFileBlob(file.id);
      const contentType = res.headers["content-type"] || "application/octet-stream";
      const mode = getViewMode(file.originalName, contentType);

      if (studentEmail && file.batchId) {
        try {
          const prog = await progressService.markFileDownloaded(studentEmail, file.batchId, file.id, docs.length);
          setDownloadedFileIds(prog.data.downloadedFileIds || []);
          setDownloadPercentage(prog.data.downloadPercentage || 0);
        } catch (err) { console.error("Mark progress failed", err); }
      }

      if (["docx", "xlsx", "pptx"].includes(mode)) {
        setPreview({ mode, arrayBuffer: res.data, name: file.originalName });
        return;
      }

      const blob = new Blob([res.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      setPreview({ mode, url, name: file.originalName });
    } catch { alert("Could not open file. Please try again."); }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const totalSizeKB = Math.round(docs.reduce((acc, d) => acc + (d.size || 0), 0) / 1024);

  /* stat cards — same StatCard component + colorKey scheme as the rest of the app */
  const stats = [
    { label: "Total Files", numericValue: docs.length, change: `${totalSizeKB} KB total`, trend: "up", icon: FileText, colorKey: "blue" },
    { label: "Previewed", numericValue: downloadedFileIds.length, change: `${Math.max(docs.length - downloadedFileIds.length, 0)} remaining`, trend: "up", icon: CheckCircle, colorKey: "green" },
    { label: "Progress", numericValue: downloadPercentage, isPercent: true, change: downloadPercentage >= 100 ? "All done!" : "Keep going", trend: downloadPercentage >= 50 ? "up" : "down", icon: TrendingUp, colorKey: "purple" },
  ];

  return (
    <PageContainer mode={isDark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — same band as every other page ═══ */}
      <div
        className="dfade"
        style={{
          padding: "8px 0 24px",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${t.borderHero}`,
          marginBottom: 20,
          boxShadow: "none",
        }}
      >
        <div className="hero-flex">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed" }} className="d1" />
              <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
                Student Portal
              </span>
            </div>
            <h1
              style={{
                fontFamily: FONT_FAMILY,
                fontWeight: FONT_WEIGHT.heroTitle,
                fontSize: FONT_SIZE.heroTitle,
                color: "#3B82F6",
                margin: "0 0 6px",
                lineHeight: LINE_HEIGHT.heroTitle,
                letterSpacing: LETTER_SPACING.heroTitle,
              }}
            >
              Documents
            </h1>
            <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
              Access all study materials shared by your trainers
            </p>
          </div>

          <div className="hero-badges">
            <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 999, padding: "8px 18px", color: "#7c3aed", fontSize: 11, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, fontFamily: FONT_FAMILY }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
              LIVE
            </div>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} loading={false} />
        ))}
      </div>

      {/* ═══ UNLOCK BANNER — reuses Dashboard's amber "new" tokens ═══ */}
      {docs.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, background: t.newBadgeBg, border: `1px solid ${t.newBadgeBorder}`, fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.semibold, color: t.newBadgeText, fontFamily: FONT_FAMILY, marginBottom: 16 }}>
          🔓 Files are unlocked sequentially — preview each file to unlock the next one
        </div>
      )}

      {/* ═══ LIST ═══ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {docs.map((d, index) => {
          const { Icon, bg, color } = fileIconInfo(d.originalName, d.contentType || "");
          const isPreviewed = downloadedFileIds.includes(d.id);
          const prevPreviewed = index === 0 || downloadedFileIds.includes(docs[index - 1]?.id);
          const isLocked = !isPreviewed && !prevPreviewed;
          const btnLabel = isLocked ? "🔒 Locked" : isPreviewed ? "View Again" : "View";

          let itemBg = t.cardBg;
          let itemBorder = t.border;
          if (isPreviewed) { itemBg = t.statusCompletedBg; itemBorder = "#34d39940"; }

          return (
            <div
              key={d.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "16px 20px", background: itemBg, border: `1px solid ${itemBorder}`,
                borderRadius: 16, boxShadow: t.shadow, opacity: isLocked ? 0.45 : 1,
                transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => { if (!isLocked) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.shadowHov; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.shadow; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: bg, color, flexShrink: 0 }}>
                  <Icon size={17} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.semibold, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: "0 0 3px", fontFamily: FONT_FAMILY }}>
                    {index + 1}. {d.originalName}
                  </p>
                  <div style={{ display: "flex", gap: 8, fontSize: 11, color: t.textMuted, alignItems: "center", flexWrap: "wrap", fontFamily: FONT_FAMILY }}>
                    <span style={{ padding: "2px 7px", borderRadius: 6, background: t.pillBg, border: `1px solid ${t.pillBorder}` }}>
                      {d.contentType || d.originalName?.split(".").pop()?.toUpperCase() || "FILE"}
                    </span>
                    <span style={{ padding: "2px 7px", borderRadius: 6, background: t.pillBg, border: `1px solid ${t.pillBorder}` }}>
                      {Math.round((d.size || 0) / 1024)} KB
                    </span>
                    {d.category && (
                      <span style={{ padding: "2px 7px", borderRadius: 6, fontWeight: FONT_WEIGHT.bold, color: "#7c3aed", background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.18)" }}>
                        {d.category}
                      </span>
                    )}
                    {isPreviewed && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: FONT_WEIGHT.bold, color: t.statusCompletedText }}>
                        <CheckCircle size={10} /> Previewed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => !isLocked && openPreview(d)}
                disabled={isLocked}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "9px 18px", borderRadius: 10, border: "none",
                  fontFamily: FONT_FAMILY, fontSize: FONT_SIZE.bodySmall, fontWeight: FONT_WEIGHT.bold,
                  cursor: isLocked ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "opacity 0.2s, transform 0.15s",
                  background: isLocked ? t.barBg : isPreviewed ? "#34d399" : "#a78bfa",
                  color: isLocked ? t.textMuted : "#0a0a0a",
                }}
                onMouseEnter={(e) => { if (!isLocked) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                <Eye size={13} />
                {btnLabel}
              </button>
            </div>
          );
        })}

        {docs.length === 0 && (
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "60px 20px", textAlign: "center", boxShadow: t.shadow }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={28} color={t.emptyIcon} />
            </div>
            <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.medium, color: t.textMuted, margin: 0, fontFamily: FONT_FAMILY }}>No documents available</p>
          </div>
        )}
      </div>

      {/* ═══ MODAL ═══ */}
      {preview && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, width: "90vw", height: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: t.shadowHov }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
              <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0, fontFamily: FONT_FAMILY }}>{preview.name}</p>
              <button
                onClick={closePreview}
                style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: t.actBg, color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, transition: "background 0.2s, color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = t.actBg; e.currentTarget.style.color = t.textMuted; }}
              >
                <X size={14} />
              </button>
            </div>

            {preview.mode === "pdf" && (
              <div style={{ flex: 1, overflow: "hidden", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iframe src={preview.url} title="PDF" style={{ width: "100%", height: "100%", border: "none" }} />
              </div>
            )}
            {preview.mode === "image" && (
              <div style={{ flex: 1, overflow: "hidden", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={preview.url} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
              </div>
            )}
            {preview.mode === "text" && (
              <div style={{ flex: 1, overflow: "hidden", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <iframe src={preview.url} title="Text" style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} />
              </div>
            )}
            {preview.mode === "docx" && <DocxViewer arrayBuffer={preview.arrayBuffer} />}
            {preview.mode === "xlsx" && <XlsxViewer arrayBuffer={preview.arrayBuffer} />}
            {preview.mode === "pptx" && <PptxViewer arrayBuffer={preview.arrayBuffer} fileName={preview.name} />}
            {preview.mode === "none" && (
              <div style={{ flex: 1, overflow: "hidden", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, color: t.textMuted, fontSize: 14, fontFamily: FONT_FAMILY, textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 44, opacity: 0.35 }}>📦</div>
                  <p style={{ fontWeight: FONT_WEIGHT.bold, margin: "0 0 6px", color: t.text }}>Preview not available</p>
                  <p style={{ margin: 0, fontSize: FONT_SIZE.bodySmall }}>This file type cannot be viewed in the browser.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default Documents;