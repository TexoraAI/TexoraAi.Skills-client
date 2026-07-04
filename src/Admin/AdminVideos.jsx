import videoService from "@/services/videoService";
import {
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

/* ─── Styles (matched to AllCourses.jsx: font, colors, padding, sizes) ─── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap');
:root{
  --bg:#f6f3fb;--card:#ffffff;--tx:#1e1533;--mu:#6b6180;--bd:#e9e2f5;
  --blue:#7c3aed;--blue2:#db2777;
  --c1:#818cf8;--c1b:#4f46e5;
  --c2:#fbbf24;--c2b:#d97706;
  --c3:#34d399;--c3b:#059669;
  --c4:#f472b6;--c4b:#db2777;
  --c5:#60a5fa;--c5b:#2563eb;
  --cr:#f87171;
  --sh:0 4px 20px rgba(30,21,51,.07);--shl:0 10px 40px rgba(30,21,51,.14);--r:20px;--r-sm:14px;
  --grad:linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#db2777 100%);
}
.av-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#a89fc0;--bd:rgba(255,255,255,0.07);
  --sh:0 4px 24px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);}

*{box-sizing:border-box;}
.av{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;
  background:linear-gradient(180deg,#f6f2fc 0%,#fbf6fb 100%);color:var(--tx);padding:24px;}
.av-dk.av{background:var(--bg);}
.av-inner{max-width:1320px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}

/* header (white card, gradient banner strip) — matches AllCourses */
.av-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.av-hdr-grad{position:relative;overflow:hidden;background:var(--grad);padding:14px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:0 12px 32px rgba(124,58,237,.28);}
.av-hdr-grad::after{content:'';position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;}
.av-hdr-grad::before{content:'';position:absolute;bottom:-70px;left:12%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;}
.av-dk .av-hdr-grad{background:linear-gradient(135deg,#3730a3 0%,#6d28d9 55%,#be185d 100%);}
.av-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.35);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;position:relative;z-index:1;}
.av-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.av-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;letter-spacing:-.01em;}
.av-sub{font-size:11.5px;color:rgba(255,255,255,.9);margin:0;position:relative;z-index:1;}
.av-hdr-body{padding:14px 18px;box-sizing:border-box;}
.av-chips{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.av-chip{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:14px 16px;border-radius:14px;color:#fff;min-height:78px;box-shadow:var(--sh);}
.av-chip::after{content:"";position:absolute;top:-30px;right:-30px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.12);}
.av-chip-1{background:linear-gradient(135deg,var(--c1),var(--c1b));}
.av-chip-2{background:linear-gradient(135deg,var(--c4),var(--c4b));}
.av-chip-3{background:linear-gradient(135deg,var(--c3),var(--c3b));}
.av-chip-ico{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.20);display:flex;align-items:center;justify-content:center;position:relative;z-index:1;}
.av-chip-num{font-size:20px;font-weight:800;line-height:1;margin-top:6px;position:relative;z-index:1;}
.av-chip-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.9;margin-top:3px;position:relative;z-index:1;}

/* action bar — matches AllCourses search + tabs row */
.av-abar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px;box-shadow:var(--sh);}
.av-search{position:relative;width:100%;max-width:280px;}
.av-search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.av-search input{padding:8px 12px 8px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:500;outline:none;width:100%;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.av-search input::placeholder{color:var(--mu);}
.av-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(129,140,248,.14);}
.av-tabs{display:flex;gap:5px;flex-wrap:wrap;}
.av-tab{padding:8px 14px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:5px;white-space:nowrap;}
.av-tab:hover{border-color:rgba(124,58,237,.30);color:var(--blue);}
.av-tab.active{background:linear-gradient(135deg,var(--c1),var(--c1b));border-color:transparent;color:#fff;box-shadow:0 6px 18px rgba(79,70,229,.30);}

/* table card */
.av-tcard{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--sh);overflow:hidden;}
.av-thead-row{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.av-thead-title{font-size:12px;font-weight:700;color:var(--tx);margin:0 0 1px;}
.av-thead-sub{font-size:10.5px;color:var(--mu);margin:0;}

/* skeleton */
.av-skel-row{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--bd);animation:av-pulse 1.4s ease-in-out infinite;}
@keyframes av-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.av-skel-l{display:flex;align-items:center;gap:10px;}
.av-skel-sq{width:32px;height:32px;border-radius:10px;background:var(--bd);}
.av-skel-line{height:9px;border-radius:6px;background:var(--bd);}
.av-skel-pill{height:20px;width:70px;border-radius:30px;background:var(--bd);}

/* empty */
.av-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 18px;min-height:180px;gap:8px;text-align:center;}
.av-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.18);display:flex;align-items:center;justify-content:center;color:var(--c1b);}
.av-empty-t{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.av-empty-s{font-size:11px;color:var(--mu);margin:0;}

/* table */
.av-tscroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
table.av-t{width:100%;border-collapse:collapse;font-size:12px;min-width:720px;}
.av-t thead th{padding:9px 12px;text-align:left;font-size:9.5px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);white-space:nowrap;}
.av-t thead th:first-child{padding-left:16px;}
.av-t thead th:last-child{text-align:right;padding-right:16px;}
.av-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.av-t tbody tr:last-child{border-bottom:none;}
.av-t tbody tr:hover{background:rgba(129,140,248,.05);}
.av-t tbody td{padding:10px 12px;vertical-align:middle;}
.av-t tbody td:first-child{padding-left:16px;}
.av-t tbody td:last-child{padding-right:16px;text-align:right;}
.av-idx{font-size:11px;font-weight:700;color:var(--mu);}
.av-video-cell{display:flex;align-items:center;gap:10px;min-width:0;}
.av-video-av{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.av-video-text{min-width:0;}
.av-video-name{font-size:12px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;}
.av-t tbody tr:hover .av-video-name{color:var(--c1b);}
.av-video-sub{font-size:10px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px;margin-top:1px;}
.av-cat-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;white-space:nowrap;}
.av-trainer-cell{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);white-space:nowrap;}
.av-type-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;white-space:nowrap;}
.av-status-pub{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:rgba(52,211,153,.10);border:1px solid rgba(52,211,153,.22);color:var(--c3b);white-space:nowrap;}
.av-status-draft{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:rgba(251,191,36,.10);border:1px solid rgba(251,191,36,.22);color:var(--c2b);white-space:nowrap;}
.av-status-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}
.av-size-cell{display:flex;align-items:center;justify-content:flex-end;gap:4px;font-size:11px;font-weight:600;color:var(--tx);white-space:nowrap;}

/* ══════════ RESPONSIVE — laptop / tablet / iPad / iPad mini / iPhone / phone ══════════ */
@media (max-width:1200px){
  .av-chips{grid-template-columns:repeat(3,1fr);}
}
@media (max-width:1024px){
  .av{padding:20px;}
}
@media (max-width:900px){
  .av{padding:14px;}
  .av-inner{gap:12px;}
}
@media (max-width:834px){
  .av-hdr-grad{padding:12px 14px;}
  .av-abar{flex-direction:column;align-items:stretch;}
  .av-search{max-width:none;}
}
@media (max-width:768px){
  .av-video-name{max-width:180px;}
  .av-video-sub{max-width:180px;}
  .av-hdr-ico{width:34px;height:34px;border-radius:10px;}
  .av-h1{font-size:15px;}
  .av-tcard{border-radius:16px;}
  .av-thead-row{padding:9px 12px;}
}
@media (max-width:640px){
  .av{padding:10px;}
  .av-inner{gap:8px;}
  .av-hdr-grad{padding:10px 12px;gap:8px;}
  .av-hdr-ico{width:32px;height:32px;border-radius:9px;}
  .av-hdr-body{padding:10px 12px;}
  .av-h1{font-size:14px;}
  .av-bdg{font-size:8.5px;padding:2px 7px;margin-bottom:3px;}
  .av-sub{display:none;}
  .av-chips{grid-template-columns:repeat(3,1fr);gap:6px;}
  .av-chip{padding:8px 8px;min-height:56px;border-radius:11px;}
  .av-chip-ico{width:20px;height:20px;border-radius:7px;}
  .av-chip-num{font-size:15px;margin-top:2px;}
  .av-chip-lbl{font-size:8.5px;margin-top:1px;}

  .av-abar{
    flex-direction:column;
    align-items:stretch;
    padding:8px 10px;
    gap:8px;
    overflow:hidden;
  }
  .av-search{max-width:none;flex-shrink:0;}
  .av-search input{padding:7px 10px 7px 32px;border-radius:10px;font-size:11.5px;}

  /* tabs: single line, horizontal scroll, compact size — the fix is
     min-width:0 + width:100% so the flex item can actually shrink
     below its content size and let overflow-x trigger the scroll,
     instead of the row silently clipping the last tab(s). */
  .av-tabs{
    display:flex;
    flex-wrap:nowrap;
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
    scrollbar-width:none;
    -ms-overflow-style:none;
    gap:6px;
    padding:2px 10px 6px;
    margin:0 -10px;
    width:auto;
    min-width:0;
    max-width:calc(100% + 20px);
    flex-shrink:1;
  }
  .av-tabs::-webkit-scrollbar{display:none;height:0;}
  .av-tab{
    flex:0 0 auto;
    flex-shrink:0;
    font-size:10px;
    padding:7px 10px;
    border-radius:9px;
    white-space:nowrap;
  }
  .av-tcard{border-radius:14px;}
  .av-thead-row{padding:8px 10px;}
}
@media (max-width:480px){
  .av-video-name{max-width:130px;}
  .av-video-sub{max-width:130px;}
  .av-empty{padding:18px 12px;min-height:150px;}
  .av-empty-ico{width:40px;height:40px;}
}
@media (max-width:400px){
  .av-hdr-grad{padding:9px 10px;}
  .av-hdr-ico{width:28px;height:28px;}
  .av-h1{font-size:12.5px;}
}
@media (max-width:380px){
  .av-chip-lbl{display:none;}
  .av-chip{min-height:44px;}
  .av-tab{font-size:9.5px;padding:6px 9px;}
  .av-video-name{max-width:100px;}
  .av-video-sub{max-width:100px;}
}
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
  { bg: "rgba(129,140,248,.10)", color: "var(--c1b)", bd: "rgba(129,140,248,.20)" },
  { bg: "rgba(244,114,182,.10)", color: "var(--c4b)", bd: "rgba(244,114,182,.20)" },
  { bg: "rgba(251,191,36,.10)", color: "var(--c2b)", bd: "rgba(251,191,36,.20)" },
  { bg: "rgba(52,211,153,.10)", color: "var(--c3b)", bd: "rgba(52,211,153,.20)" },
  { bg: "rgba(96,165,250,.10)", color: "var(--c5b)", bd: "rgba(96,165,250,.20)" },
];
const catColor = (val) =>
  CAT_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CAT_COLORS.length];

/* ── avatar gradients ── */
const GRAD_BG = [
  "linear-gradient(135deg,#6d28d9,#4338ca)",
  "linear-gradient(135deg,#db2777,#9d174d)",
  "linear-gradient(135deg,#d97706,#92400e)",
  "linear-gradient(135deg,#059669,#065f46)",
  "linear-gradient(135deg,#2563eb,#1e40af)",
  "linear-gradient(135deg,#7c3aed,#5b21b6)",
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
    bg: "rgba(129,140,248,.10)",
    color: "var(--c1b)",
    bd: "rgba(129,140,248,.20)",
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
    bg: "rgba(244,114,182,.10)",
    color: "var(--c4b)",
    bd: "rgba(244,114,182,.20)",
  },
  DIRECT_URL: {
    label: "Direct URL",
    Icon: LinkIcon,
    bg: "rgba(251,191,36,.10)",
    color: "var(--c2b)",
    bd: "rgba(251,191,36,.20)",
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
        {/* ── Header (white card, gradient banner) ── */}
        <div className="av-hdr">
          <div className="av-hdr-grad">
            <div className="av-hdr-ico">
              <Film size={18} />
            </div>
            <div>
              <div className="av-bdg">
                <Film size={9} /> Video Management
              </div>
              <h1 className="av-h1">All Videos</h1>
              <p className="av-sub">
                Every lecture uploaded by trainers across your organization
              </p>
            </div>
          </div>
          <div className="av-hdr-body">
            <div className="av-chips">
              <div className="av-chip av-chip-1">
                <div className="av-chip-ico">
                  <VideoIcon size={14} />
                </div>
                <div>
                  <div className="av-chip-num">{videos.length}</div>
                  <div className="av-chip-lbl">Videos</div>
                </div>
              </div>
              <div className="av-chip av-chip-2">
                <div className="av-chip-ico">
                  <UploadCloud size={14} />
                </div>
                <div>
                  <div className="av-chip-num">{uploadedFileCount}</div>
                  <div className="av-chip-lbl">Uploaded Files</div>
                </div>
              </div>
              <div className="av-chip av-chip-3">
                <div className="av-chip-ico">
                  <HardDrive size={14} />
                </div>
                <div>
                  <div className="av-chip-num">{publishedCount}</div>
                  <div className="av-chip-lbl">Published</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="av-abar">
          <div className="av-search">
            <Search size={13} />
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
                      style={{ width: 160, marginBottom: 7 }}
                    />
                    <div className="av-skel-line" style={{ width: 100 }} />
                  </div>
                </div>
                <div className="av-skel-pill" />
              </div>
            ))}

          {/* empty */}
          {!loading && filteredVideos.length === 0 && (
            <div className="av-empty">
              <div className="av-empty-ico">
                <Film size={22} />
              </div>
              <p className="av-empty-t">No videos found</p>
              <p className="av-empty-s">
                Videos uploaded by trainers will appear here
              </p>
            </div>
          )}

          {/* table (horizontal scroll on small screens) */}
          {!loading && filteredVideos.length > 0 && (
            <div className="av-tscroll">
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
                              <Film size={14} color="white" />
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
                            <Tag size={10} /> {v.category || "—"}
                          </span>
                        </td>
                        <td>
                          <div className="av-trainer-cell">
                            <Mail size={11} /> {v.uploadedBy || "—"}
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
                            <tm.Icon size={10} /> {tm.label}
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
                            <HardDrive
                              size={11}
                              style={{ color: "var(--mu)" }}
                            />{" "}
                            {formatSize(v)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVideos;