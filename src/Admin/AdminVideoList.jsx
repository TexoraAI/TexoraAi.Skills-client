import React, { useEffect, useState } from "react";
import { Play, Pause, Trash2, Video, HardDrive, Film } from "lucide-react";
import videoService from "../services/videoService";

/* ─── Styles (matches AdminVideos design system) ─────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:16px;
  --grad:linear-gradient(120deg,#22d3ee 0%,#38bdf8 45%,#a78bfa 100%);}
.avl-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}

.avl{font-family:'Poppins',sans-serif;min-height:100%;background:var(--bg);color:var(--tx);padding:16px;box-sizing:border-box;}
.avl-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:14px;}

/* header */
.avl-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.avl-hdr-grad{background:var(--grad);padding:14px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.avl-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.avl-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.avl-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;}
.avl-sub{font-size:11.5px;color:rgba(255,255,255,.85);margin:0;}
.avl-hdr-body{padding:14px 18px;box-sizing:border-box;}
.avl-chips{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.avl-chip{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:2px;padding:14px 16px;border-radius:14px;color:#fff;min-height:78px;box-shadow:0 6px 16px rgba(0,0,0,.10);}
.avl-chip::after{content:"";position:absolute;top:-16px;right:-16px;width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.14);}
.avl-chip-1{background:linear-gradient(135deg,#22d3ee,#0891b2);}
.avl-chip-2{background:linear-gradient(135deg,#a78bfa,#7c3aed);}
.avl-chip-ico{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;margin-bottom:2px;}
.avl-chip-num{font-size:20px;font-weight:800;line-height:1;}
.avl-chip-lbl{font-size:11px;font-weight:600;color:rgba(255,255,255,.90);}

/* list card */
.avl-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.avl-thead-row{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.avl-thead-title{font-size:12px;font-weight:700;color:var(--tx);margin:0 0 1px;}
.avl-thead-sub{font-size:10.5px;color:var(--mu);margin:0;}

/* empty */
.avl-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 20px;gap:10px;text-align:center;}
.avl-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.avl-empty-t{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.avl-empty-s{font-size:11px;color:var(--mu);margin:0;}

/* row */
.avl-row{border-bottom:1px solid var(--bd);transition:background .15s;}
.avl-row:last-child{border-bottom:none;}
.avl-row:hover{background:rgba(34,211,238,.025);}
.avl-row-main{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;flex-wrap:wrap;}
.avl-video-cell{display:flex;align-items:center;gap:10px;min-width:0;flex:1 1 auto;}
.avl-video-av{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.avl-video-text{min-width:0;}
.avl-video-name{font-size:12px;font-weight:700;color:var(--tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:320px;}
.avl-row:hover .avl-video-name{color:var(--c1);}
.avl-video-sub{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--mu);margin-top:1px;}
.avl-actions{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.avl-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:11px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap;}
.avl-btn-play{background:var(--c1);border-color:var(--c1);color:#0a0a0a;}
.avl-btn-play:hover{background:#0891b2;border-color:#0891b2;color:#fff;}
.avl-btn-icon{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--cr);cursor:pointer;transition:all .15s;flex-shrink:0;}
.avl-btn-icon:hover{background:rgba(248,113,113,.10);border-color:rgba(248,113,113,.30);}
.avl-player-wrap{padding:0 16px 12px;}
.avl-player{width:100%;border-radius:12px;border:1px solid var(--bd);display:block;max-height:360px;background:#000;}

/* ── responsive ── */
@media (max-width:900px){
  .avl{padding:12px;}
  .avl-inner{gap:12px;}
}
@media (max-width:640px){
  .avl-hdr-grad{padding:12px 14px;}
  .avl-hdr-body{padding:10px 14px;}
  .avl-h1{font-size:15px;}
  .avl-sub{display:none;}
  .avl-chips{grid-template-columns:repeat(2,1fr);gap:8px;}
  .avl-chip{padding:10px 10px;min-height:66px;border-radius:12px;}
  .avl-chip-num{font-size:16px;}
  .avl-chip-lbl{font-size:9.5px;}
  .avl-chip-ico{width:22px;height:22px;}
  .avl-row-main{padding:9px 14px;}
  .avl-video-name{max-width:150px;}
  .avl-btn span{display:none;}
  .avl-btn{padding:6px 9px;}
}
@media (max-width:380px){
  .avl-chip-lbl{display:none;}
  .avl-chip{min-height:52px;}
  .avl-video-name{max-width:110px;}
}
`;

if (!document.getElementById("avl-st")) {
  const t = document.createElement("style");
  t.id = "avl-st";
  t.textContent = STYLES;
  document.head.appendChild(t);
}

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

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

const AdminVideoList = () => {
  const [dark, setDark] = useState(isDark);
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  /* ================= LOAD VIDEOS ================= */
  useEffect(() => {
    videoService
      .getAllVideos()
      .then((res) => setVideos(res.data || []))
      .catch(console.error);
  }, []);

  /* ================= PLAY ================= */
  const playVideo = async (video) => {
    if (!videoUrls[video.id]) {
      const res = await videoService.getVideoBlob(video.storedFileName);
      const blobUrl = URL.createObjectURL(res.data);

      setVideoUrls((prev) => ({
        ...prev,
        [video.id]: blobUrl,
      }));
    }

    setPlayingId(video.id);
  };

  /* ================= DELETE ================= */
  const deleteVideo = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await videoService.deleteVideo(id);

      setVideos((prev) => prev.filter((v) => v.id !== id));

      if (videoUrls[id]) {
        URL.revokeObjectURL(videoUrls[id]);
      }
    } catch {
      alert("Delete failed");
    }
  };

  const totalSizeMB = Math.round(
    videos.reduce((sum, v) => sum + (v.size || 0), 0) / 1024 / 1024
  );

  return (
    <div className={`avl${dark ? " avl-dk" : ""}`}>
      <div className="avl-inner">
        {/* ── Header ── */}
        <div className="avl-hdr">
          <div className="avl-hdr-grad">
            <div className="avl-hdr-ico">
              <Video size={18} />
            </div>
            <div>
              <div className="avl-bdg">
                <Video size={9} /> Video Management
              </div>
              <h1 className="avl-h1">Uploaded Videos</h1>
              <p className="avl-sub">
                Preview and manage your uploaded video files
              </p>
            </div>
          </div>
          <div className="avl-hdr-body">
            <div className="avl-chips">
              <div className="avl-chip avl-chip-1">
                <div className="avl-chip-ico">
                  <Film size={14} />
                </div>
                <span className="avl-chip-num">{videos.length}</span>
                <span className="avl-chip-lbl">Videos</span>
              </div>
              <div className="avl-chip avl-chip-2">
                <div className="avl-chip-ico">
                  <HardDrive size={14} />
                </div>
                <span className="avl-chip-num">{totalSizeMB} MB</span>
                <span className="avl-chip-lbl">Total Size</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── List card ── */}
        <div className="avl-tcard">
          <div className="avl-thead-row">
            <div>
              <p className="avl-thead-title">Video List</p>
              <p className="avl-thead-sub">
                {videos.length} video{videos.length !== 1 && "s"} found
              </p>
            </div>
          </div>

          {videos.length === 0 && (
            <div className="avl-empty">
              <div className="avl-empty-ico">
                <Video size={22} />
              </div>
              <p className="avl-empty-t">No videos uploaded yet</p>
              <p className="avl-empty-s">
                Videos you upload will appear here
              </p>
            </div>
          )}

          {videos.map((v) => {
            const isPlaying = playingId === v.id;
            const sizeMB = Math.round((v.size || 0) / 1024 / 1024);
            return (
              <div key={v.id} className="avl-row">
                <div className="avl-row-main">
                  <div className="avl-video-cell">
                    <div
                      className="avl-video-av"
                      style={{ background: gradBg(v.originalFileName) }}
                    >
                      <Film size={14} color="white" />
                    </div>
                    <div className="avl-video-text">
                      <div className="avl-video-name">
                        {v.originalFileName}
                      </div>
                      <div className="avl-video-sub">
                        <HardDrive size={9} /> {sizeMB} MB
                      </div>
                    </div>
                  </div>

                  <div className="avl-actions">
                    <button
                      className="avl-btn avl-btn-play"
                      onClick={() => playVideo(v)}
                    >
                      {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                      <span>{isPlaying ? "Playing" : "Play"}</span>
                    </button>
                    <button
                      className="avl-btn-icon"
                      onClick={() => deleteVideo(v.id)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {isPlaying && videoUrls[v.id] && (
                  <div className="avl-player-wrap">
                    <video
                      className="avl-player"
                      controls
                      src={videoUrls[v.id]}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminVideoList;