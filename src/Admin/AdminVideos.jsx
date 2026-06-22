import videoService from "@/services/videoService";
import {
    ArrowLeft,
    BookOpen,
    Film,
    HardDrive,
    Link as LinkIcon,
    Mail,
    Search,
    Tag,
    UploadCloud,
    Video as VideoIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.av-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.av{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.av-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}

/* header */
.av-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.av-hdr-l{display:flex;align-items:center;gap:14px;}
.av-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.av-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.av-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.av-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.av-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.av-sub{font-size:13px;color:var(--mu);margin:0;}
.av-chips{display:flex;gap:10px;flex-wrap:wrap;}
.av-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}

/* action bar */
.av-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.av-search{position:relative;}
.av-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.av-search input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.av-search input::placeholder{color:var(--mu);}
.av-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.av-tabs{display:flex;gap:6px;flex-wrap:wrap;}
.av-tab{padding:8px 14px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;}
.av-tab:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.av-tab.active{background:var(--c1);border-color:var(--c1);color:#0a0a0a;}

/* table card */
.av-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.av-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.av-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.av-thead-sub{font-size:11px;color:var(--mu);margin:0;}

/* skeleton */
.av-skel-row{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid var(--bd);animation:av-pulse 1.4s ease-in-out infinite;}
@keyframes av-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.av-skel-l{display:flex;align-items:center;gap:12px;}
.av-skel-sq{width:38px;height:38px;border-radius:12px;background:var(--bd);}
.av-skel-line{height:10px;border-radius:6px;background:var(--bd);}
.av-skel-pill{height:22px;width:80px;border-radius:30px;background:var(--bd);}

/* empty */
.av-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:64px 20px;gap:12px;text-align:center;}
.av-empty-ico{width:56px;height:56px;border-radius:16px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.av-empty-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.av-empty-s{font-size:12px;color:var(--mu);margin:0;}

/* table */
table.av-t{width:100%;border-collapse:collapse;font-size:13px;}
.av-t thead th{padding:11px 14px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.av-t thead th:first-child{padding-left:22px;}
.av-t thead th:last-child{text-align:right;padding-right:22px;}
.av-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.av-t tbody tr:last-child{border-bottom:none;}
.av-t tbody tr:hover{background:rgba(34,211,238,.025);}
.av-t tbody td{padding:12px 14px;vertical-align:middle;}
.av-t tbody td:first-child{padding-left:22px;}
.av-t tbody td:last-child{padding-right:22px;text-align:right;}
.av-idx{font-size:12px;font-weight:700;color:var(--mu);}
.av-video-cell{display:flex;align-items:center;gap:12px;min-width:0;}
.av-video-av{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.av-video-text{min-width:0;}
.av-video-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;}
.av-t tbody tr:hover .av-video-name{color:var(--c1);}
.av-video-sub{font-size:11px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:260px;margin-top:1px;}
.av-cat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.av-trainer-cell{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
.av-type-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;white-space:nowrap;}
.av-status-pub{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.20);color:var(--c3);}
.av-status-draft{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(251,146,60,.10);border:1px solid rgba(251,146,60,.20);color:var(--c2);}
.av-status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;}
.av-size-cell{display:flex;align-items:center;justify-content:flex-end;gap:5px;font-size:12px;font-weight:600;color:var(--tx);}
`;

if (!document.getElementById("av-st")) {
  const t = document.createElement("style");
  t.id = "av-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ── category tag colours (same palette as AllCourses) ── */
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

/* ── avatar gradients ── */
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

/* ── video type → icon / label / colour ──
   Reads the backend's computed `videoType` field when present, with a
   client-side fallback (in case an older cached payload doesn't have it
   yet) so the page never breaks on missing data. */
const TYPE_META = {
  UPLOADED_FILE: {
    label: "Uploaded File",
    Icon: UploadCloud,
    bg: "rgba(34,211,238,.10)",
    color: "var(--c1)",
    bd: "rgba(34,211,238,.20)",
  },
  YOUTUBE: {
    label: "YouTube",
    Icon: LinkIcon,
    bg: "rgba(248,113,113,.10)",
    color: "var(--cr)",
    bd: "rgba(248,113,113,.20)",
  },
  VIMEO: {
    label: "Vimeo",
    Icon: LinkIcon,
    bg: "rgba(167,139,250,.10)",
    color: "var(--c4)",
    bd: "rgba(167,139,250,.20)",
  },
  DIRECT_URL: {
    label: "Direct URL",
    Icon: LinkIcon,
    bg: "rgba(251,146,60,.10)",
    color: "var(--c2)",
    bd: "rgba(251,146,60,.20)",
  },
};

const resolveVideoType = (v) => {
  if (v.videoType && TYPE_META[v.videoType]) return v.videoType;
  // fallback for any payload missing the computed field
  const url = (v.videoUrl || "").toLowerCase();
  if (!url) return "UPLOADED_FILE";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YOUTUBE";
  if (url.includes("vimeo.com")) return "VIMEO";
  return "DIRECT_URL";
};

const TYPE_TABS = [
  { key: "ALL", label: "All Videos" },
  { key: "UPLOADED_FILE", label: "Uploaded Files" },
  { key: "YOUTUBE", label: "YouTube" },
  { key: "VIMEO", label: "Vimeo" },
  { key: "DIRECT_URL", label: "Direct URL" },
];

const formatSize = (video) => {
  const type = resolveVideoType(video);
  if (type !== "UPLOADED_FILE") return "External";
  const mb = Math.round((video.size || 0) / 1024 / 1024);
  return `${mb} MB`;
};

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
const AdminVideos = () => {
  const navigate = useNavigate();
  const [dark, setDark] = useState(isDark);

  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("ALL");
  const [videos, setVideos] = useState([]);
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
    loadVideos(activeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const loadVideos = (type) => {
    setLoading(true);
    videoService
      .getAllVideos(type)
      .then((res) => setVideos(res.data || []))
      .catch((err) => console.error("Failed to load videos", err))
      .finally(() => setLoading(false));
  };

  const filteredVideos = videos.filter((v) => {
    const q = search.toLowerCase();
    if (!q) return true;
    const title = (v.title || v.originalFileName || "").toLowerCase();
    const trainer = (v.uploadedBy || "").toLowerCase();
    return title.includes(q) || trainer.includes(q);
  });

  const publishedCount = videos.filter((v) => v.status === "published").length;
  const uploadedFileCount = videos.filter(
    (v) => resolveVideoType(v) === "UPLOADED_FILE",
  ).length;

  return (
    <div className={`av${dark ? " av-dk" : ""}`}>
      <div className="av-inner">
        {/* ── Header ── */}
        <div className="av-hdr">
          <div className="av-hdr-l">
            <button className="av-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="av-hdr-ico">
              <Film size={24} />
            </div>
            <div>
              <div className="av-bdg">
                <Film size={10} /> Video Management
              </div>
              <h1 className="av-h1">All Videos</h1>
              <p className="av-sub">
                Every lecture uploaded by trainers across your organization
              </p>
            </div>
          </div>
          <div className="av-chips">
            <div className="av-chip">
              <VideoIcon size={14} style={{ color: "var(--c1)" }} />
              <span style={{ fontWeight: 800, color: "var(--c1)" }}>
                {videos.length}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Videos
              </span>
            </div>
            <div className="av-chip">
              <UploadCloud size={14} style={{ color: "var(--c4)" }} />
              <span style={{ fontWeight: 800, color: "var(--c4)" }}>
                {uploadedFileCount}
              </span>
              <span style={{ color: "var(--mu)", fontWeight: 500 }}>
                Uploaded Files
              </span>
            </div>
            <div className="av-chip">
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
        <div className="av-abar">
          <div className="av-search">
            <Search size={14} />
            <input
              placeholder="Search by title or trainer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="av-tabs">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`av-tab${activeType === tab.key ? " active" : ""}`}
                onClick={() => setActiveType(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="av-tcard">
          <div className="av-thead-row">
            <div>
              <p className="av-thead-title">Video List</p>
              <p className="av-thead-sub">
                {filteredVideos.length} video
                {filteredVideos.length !== 1 && "s"} found
              </p>
            </div>
          </div>

          {/* skeleton */}
          {loading &&
            [1, 2, 3].map((i) => (
              <div key={i} className="av-skel-row">
                <div className="av-skel-l">
                  <div className="av-skel-sq" />
                  <div>
                    <div
                      className="av-skel-line"
                      style={{ width: 180, marginBottom: 8 }}
                    />
                    <div className="av-skel-line" style={{ width: 110 }} />
                  </div>
                </div>
                <div className="av-skel-pill" />
              </div>
            ))}

          {/* empty */}
          {!loading && filteredVideos.length === 0 && (
            <div className="av-empty">
              <div className="av-empty-ico">
                <Film size={26} />
              </div>
              <p className="av-empty-t">No videos found</p>
              <p className="av-empty-s">
                Videos uploaded by trainers will appear here
              </p>
            </div>
          )}

          {/* table */}
          {!loading && filteredVideos.length > 0 && (
            <table className="av-t">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Video</th>
                  <th>Category</th>
                  <th>Trainer</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Size / Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((v, index) => {
                  const cc = catColor(v.category);
                  const type = resolveVideoType(v);
                  const tm = TYPE_META[type];
                  const title = v.title || v.originalFileName || "Untitled";
                  const isPublished = v.status === "published";
                  return (
                    <tr key={v.id}>
                      <td>
                        <span className="av-idx">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </td>
                      <td>
                        <div className="av-video-cell">
                          <div
                            className="av-video-av"
                            style={{ background: gradBg(title) }}
                          >
                            <Film size={16} color="white" />
                          </div>
                          <div className="av-video-text">
                            <div className="av-video-name">{title}</div>
                            {v.course && (
                              <div className="av-video-sub">
                                <BookOpen
                                  size={9}
                                  style={{
                                    marginRight: 3,
                                    verticalAlign: "middle",
                                  }}
                                />
                                {v.course}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="av-cat-tag"
                          style={{
                            background: cc.bg,
                            color: cc.color,
                            borderColor: cc.bd,
                          }}
                        >
                          <Tag size={11} /> {v.category || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="av-trainer-cell">
                          <Mail size={12} /> {v.uploadedBy || "—"}
                        </div>
                      </td>
                      <td>
                        <span
                          className="av-type-badge"
                          style={{
                            background: tm.bg,
                            color: tm.color,
                            borderColor: tm.bd,
                          }}
                        >
                          <tm.Icon size={11} /> {tm.label}
                        </span>
                      </td>
                      <td>
                        {isPublished ? (
                          <span className="av-status-pub">
                            <span className="av-status-dot" /> Published
                          </span>
                        ) : (
                          <span className="av-status-draft">
                            <span className="av-status-dot" /> Draft
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="av-size-cell">
                          <HardDrive size={12} style={{ color: "var(--mu)" }} />{" "}
                          {formatSize(v)}
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

export default AdminVideos;
