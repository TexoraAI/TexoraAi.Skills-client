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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.af-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.af{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.af-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

.af-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.af-hdr-l{display:flex;align-items:center;gap:14px;}
.af-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.af-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.af-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.af-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.af-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.af-sub{font-size:13px;color:var(--mu);margin:0;}
.af-chips{display:flex;gap:10px;flex-wrap:wrap;}
.af-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

.af-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.af-search{position:relative;}
.af-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.af-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.af-search input::placeholder{color:var(--mu);}
.af-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}

.af-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.af-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.af-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.af-thead-sub{font-size:11px;color:var(--mu);margin:0;}

.af-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);animation:af-pulse 1.4s ease-in-out infinite;}
@keyframes af-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.af-skel-l{display:flex;align-items:center;gap:12px;}
.af-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
.af-skel-line{height:10px;border-radius:6px;background:var(--bd);}
.af-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}

.af-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
.af-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.af-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.af-empty-s{font-size:12px;color:var(--mu);margin:0;}

table.af-t{width:100%;border-collapse:collapse;font-size:13px;}
.af-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.af-t thead th:first-child{padding-left:22px;}
.af-t thead th:last-child{text-align:right;padding-right:22px;}
.af-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.af-t tbody tr:last-child{border-bottom:none;}
.af-t tbody tr:hover{background:rgba(34,211,238,.025);}
.af-t tbody td{padding:12px 14px;vertical-align:middle;}
.af-t tbody td:first-child{padding-left:22px;}
.af-t tbody td:last-child{padding-right:22px;text-align:right;}
.af-idx{font-size:12px;font-weight:700;color:var(--mu);}
.af-file-cell{display:flex;align-items:center;gap:12px;min-width:0;}
.af-file-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.af-file-text{min-width:0;}
.af-file-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;}
.af-t tbody tr:hover .af-file-name{color:var(--c1);}
.af-file-sub{font-size:11px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;margin-top:1px;}
.af-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.af-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
.af-status-pub{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
.af-status-draft{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(251,146,60,.10);border:1px solid rgba(251,146,60,.20);color:var(--c2);}
.af-status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;}
.af-size-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:12px;font-weight:600;color:var(--tx);}
`;

if (!document.getElementById("af-st")) {
  const t = document.createElement("style");
  t.id = "af-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const CAT_COLORS = [
  {
    bg: "rgba(34,211,238,.10)",
    color: "var(--c1)",
    bd: "rgba(34,211,238,.20)",
  },
  {
    bg: "rgba(167,139,250,.10)",
    color: "var(--c4)",
    bd: "rgba(167,139,250,.20)",
  },
  {
    bg: "rgba(251,146,60,.10)",
    color: "var(--c2)",
    bd: "rgba(251,146,60,.20)",
  },
  {
    bg: "rgba(52,211,153,.10)",
    color: "var(--c3)",
    bd: "rgba(52,211,153,.20)",
  },
  {
    bg: "rgba(248,113,113,.10)",
    color: "var(--cr)",
    bd: "rgba(248,113,113,.20)",
  },
];
const catColor = (val) =>
  CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#0891b2,#0e7490)",
  "linear-gradient(135deg,#be123c,#9f1239)",
  "linear-gradient(135deg,#b45309,#92400e)",
  "linear-gradient(135deg,#047857,#065f46)",
  "linear-gradient(135deg,#1d4ed8,#1e40af)",
];
const gradBg = (val) =>
  GRAD_BG[(String(val)?.charCodeAt(0) ?? 0) % GRAD_BG.length];

const formatSize = (file) => {
  const kb = Math.round((file.size || 0) / 1024);
  return `${kb} KB`;
};

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const AdminFiles = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);

  const [search, setSearch] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    setLoading(true);
    fileService
      .getAllFilesAdmin()
      .then((res) => setFiles(res.data || []))
      .catch((err) =>
        console.error(
          "Failed to load files",
          err.response?.status,
          err.response?.data,
        ),
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
  const totalSizeKB = Math.round(
    files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024,
  );

  return (
    <div className={`af${dark ? " af-dk" : ""}`}>
      <div className="af-inner">
        {/* ── Header ── */}
        <div className="af-hdr">
          <div className="af-hdr-l">
            <button className="af-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="af-hdr-ico">
              <FileText size={24} />
            </div>
            <div>
              <div className="af-bdg">
                <FileText size={10} /> File Management
              </div>
              <h1 className="af-h1">All Files</h1>
              <p className="af-sub">
                Every document uploaded by trainers across your organization
              </p>
            </div>
          </div>
          <div className="af-chips">
            <div className="af-chip">
              <FileText size={14} style={{ color: "var(--c1)" }} />
              <span style={{ fontWeight: 800, color: "var(--c1)" }}>
                {files.length}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>Files</span>
            </div>
            <div className="af-chip">
              <HardDrive size={14} style={{ color: "var(--c4)" }} />
              <span style={{ fontWeight: 800, color: "var(--c4)" }}>
                {totalSizeKB}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Storage KB
              </span>
            </div>
            <div className="af-chip">
              <HardDrive size={14} style={{ color: "var(--c3)" }} />
              <span style={{ fontWeight: 800, color: "var(--c3)" }}>
                {publishedCount}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Published
              </span>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="af-abar">
          <div className="af-search">
            <Search size={14} />
            <input
              placeholder="Search by title or trainer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="af-tcard">
          <div className="af-thead-row">
            <div>
              <p className="af-thead-title">File List</p>
              <p className="af-thead-sub">
                {filteredFiles.length} file
                {filteredFiles.length !== 1 && "s"} found
              </p>
            </div>
          </div>

          {loading &&
            [1, 2, 3].map((i) => (
              <div key={i} className="af-skel-row">
                <div className="af-skel-l">
                  <div className="af-skel-sq" />
                  <div>
                    <div
                      className="af-skel-line"
                      style={{ width: 180, marginBottom: 8 }}
                    />
                    <div className="af-skel-line" style={{ width: 110 }} />
                  </div>
                </div>
                <div className="af-skel-pill" />
              </div>
            ))}

          {!loading && filteredFiles.length === 0 && (
            <div className="af-empty">
              <div className="af-empty-ico">
                <FileText size={26} />
              </div>
              <p className="af-empty-t">No files found</p>
              <p className="af-empty-s">
                Files uploaded by trainers will appear here
              </p>
            </div>
          )}

          {!loading && filteredFiles.length > 0 && (
            <table className="af-t">
              <thead>
                <tr>
                  <th>#</th>
                  <th>File</th>
                  <th>Category</th>
                  <th>Trainer</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((f, index) => {
                  const cc = catColor(f.category);
                  const title = f.title || f.originalName || "Untitled";
                  const isPublished = f.status === "published";
                  return (
                    <tr key={f.id}>
                      <td>
                        <span className="af-idx">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td>
                        <div className="af-file-cell">
                          <div
                            className="af-file-av"
                            style={{ background: gradBg(title) }}
                          >
                            <FileText size={16} color="white" />
                          </div>
                          <div className="af-file-text">
                            <div className="af-file-name">{title}</div>
                            {f.courseId && (
                              <div className="af-file-sub">
                                <BookOpen
                                  size={9}
                                  style={{
                                    marginRight: 3,
                                    verticalAlign: "middle",
                                  }}
                                />
                                Course #{f.courseId}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="af-cat-tag"
                          style={{
                            background: cc.bg,
                            color: cc.color,
                            borderColor: cc.bd,
                          }}
                        >
                          <Tag size={11} /> {f.category || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="af-trainer-cell">
                          <Mail size={12} /> {f.trainerEmail || "—"}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--mu)",
                            fontWeight: 600,
                          }}
                        >
                          {f.batchId ?? "—"}
                        </span>
                      </td>
                      <td>
                        {isPublished ? (
                          <span className="af-status-pub">
                            <span className="af-status-dot" /> Published
                          </span>
                        ) : (
                          <span className="af-status-draft">
                            <span className="af-status-dot" /> Draft
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="af-size-cell">
                          <HardDrive size={12} style={{ color: "var(--mu)" }} />{" "}
                          {formatSize(f)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFiles;
