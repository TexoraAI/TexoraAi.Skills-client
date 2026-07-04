import React, { useEffect, useState } from "react";
import { Video, Trash2, Eye, X } from "lucide-react";

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
}
.rv-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#a89fc0;--bd:rgba(255,255,255,0.07);
  --sh:0 4px 24px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);}

*{box-sizing:border-box;}
.rv{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;
  background:linear-gradient(180deg,#f6f2fc 0%,#fbf6fb 100%);color:var(--tx);padding:24px;}
.rv-dk.rv{background:var(--bg);}
.rv-inner{max-width:1320px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}

/* header — matches AllCourses gradient banner */
.rv-hdr{position:relative;overflow:hidden;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#db2777 100%);border:1px solid rgba(124,58,237,.25);border-radius:var(--r);padding:14px 18px;box-shadow:0 12px 32px rgba(124,58,237,.28);display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.rv-hdr::after{content:'';position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;}
.rv-hdr::before{content:'';position:absolute;bottom:-70px;left:12%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;}
.rv-dk .rv-hdr{background:linear-gradient(135deg,#3730a3 0%,#6d28d9 55%,#be185d 100%);box-shadow:0 12px 32px rgba(190,24,93,.35);}
.rv-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;backdrop-filter:blur(6px);position:relative;z-index:1;}
.rv-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.rv-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;letter-spacing:-.01em;word-break:break-word;}
.rv-sub{font-size:11.5px;color:rgba(255,255,255,.9);margin:0;word-break:break-word;position:relative;z-index:1;}

/* table card */
.rv-tcard{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--sh);overflow:hidden;}
.rv-tscroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
table.rv-t{width:100%;min-width:560px;border-collapse:collapse;font-size:12px;}
.rv-t thead th{padding:9px 14px;text-align:left;font-size:9.5px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);white-space:nowrap;}
.rv-t thead th:first-child{padding-left:16px;}
.rv-t thead th:last-child{text-align:right;padding-right:16px;}
.rv-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.rv-t tbody tr:last-child{border-bottom:none;}
.rv-t tbody tr:hover{background:rgba(129,140,248,.05);}
.rv-t tbody td{padding:10px 14px;vertical-align:middle;}
.rv-t tbody td:first-child{padding-left:16px;}
.rv-t tbody td:last-child{text-align:right;padding-right:16px;}
.rv-t-name{font-size:12px;font-weight:700;color:var(--tx);}
.rv-t-cell{font-size:11px;color:var(--mu);white-space:nowrap;}
.rv-actions{display:flex;justify-content:flex-end;gap:6px;}
.rv-abtn{width:28px;height:28px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.rv-abtn.view{background:rgba(129,140,248,.10);color:var(--c1b);}
.rv-abtn.view:hover{background:rgba(129,140,248,.20);}
.rv-abtn.del{background:rgba(248,113,113,.10);color:var(--cr);}
.rv-abtn.del:hover{background:rgba(248,113,113,.20);}
.rv-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 18px;min-height:180px;gap:8px;text-align:center;}
.rv-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.18);display:flex;align-items:center;justify-content:center;color:var(--c1b);}
.rv-empty-t{font-size:12px;font-weight:700;color:var(--mu);margin:0;}

/* modal */
.rv-mo{position:fixed;inset:0;z-index:50;background:rgba(30,21,51,.55);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.rv-mc{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:420px;overflow:hidden;box-shadow:var(--shl);}
.rv-mh{padding:18px 20px;background:linear-gradient(180deg,rgba(129,140,248,.08),rgba(129,140,248,.02));border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
.rv-mhl{display:flex;align-items:center;gap:10px;min-width:0;}
.rv-mico{width:36px;height:36px;border-radius:11px;background:linear-gradient(145deg,var(--c1),var(--c1b));display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 6px 16px rgba(79,70,229,.32);}
.rv-mt{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rv-ms{font-size:11px;color:var(--mu);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rv-mx{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0;}
.rv-mx:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.rv-mb{padding:20px;display:flex;flex-direction:column;gap:10px;}
.rv-mrow{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.rv-mlbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:0 0 3px;}
.rv-mval{font-size:12.5px;font-weight:700;color:var(--tx);margin:0;word-break:break-word;}
.rv-mf{padding:14px 20px;border-top:1px solid var(--bd);display:flex;justify-content:flex-end;}
.rv-close-btn{padding:9px 20px;border-radius:11px;border:1.5px solid var(--bd);background:var(--bg);color:var(--mu);font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.rv-close-btn:hover{border-color:rgba(129,140,248,.30);color:var(--c1b);}

/* ══════════ RESPONSIVE — laptop / tablet / iPad / iPad mini / iPhone / phone ══════════ */
@media (max-width:1024px){
  .rv{padding:20px;}
  .rv-hdr{padding:14px 16px;}
}
@media (max-width:834px){
  .rv-hdr{padding:12px 14px;gap:10px;}
}
@media (max-width:768px){
  .rv{padding:14px;}
  .rv-inner{gap:12px;}
  .rv-hdr{padding:12px 14px;border-radius:14px;}
  .rv-hdr-ico{width:34px;height:34px;border-radius:10px;}
  .rv-h1{font-size:15px;}
  .rv-sub{display:none;}
  .rv-tcard{border-radius:16px;}
}
@media (max-width:640px){
  .rv{padding:10px;}
  .rv-inner{gap:8px;}
  .rv-hdr{padding:10px 12px;border-radius:14px;gap:8px;}
  .rv-hdr-ico{width:32px;height:32px;border-radius:9px;}
  .rv-h1{font-size:14px;}
  .rv-bdg{font-size:8.5px;padding:2px 7px;margin-bottom:3px;}
  .rv-tcard{border-radius:14px;}
  .rv-t th:nth-child(3),.rv-t td:nth-child(3){display:none;}
}
@media (max-width:480px){
  .rv-empty{padding:18px 12px;min-height:150px;}
  .rv-empty-ico{width:40px;height:40px;}
  .rv-t th:nth-child(4),.rv-t td:nth-child(4){display:none;}
}
@media (max-width:400px){
  .rv-hdr{padding:9px 10px;}
  .rv-hdr-ico{width:28px;height:28px;}
  .rv-h1{font-size:12.5px;}
}
`;
if(!document.getElementById("rv-st")){const t=document.createElement("style");t.id="rv-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const AdminRecordedVideos=()=>{
  const[videos,setVideos]=useState([]);
  const[selectedVideo,setSelectedVideo]=useState(null);
  const[dark,setDark]=useState(isDark);

  useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  useEffect(()=>{
    const f=async()=>{try{const r=await fetch("/api/recorded-videos");if(!r.ok){setVideos([]);return;}const t=await r.text();const d=t?JSON.parse(t):[];setVideos(Array.isArray(d)?d:[]);}catch(e){console.error(e);setVideos([]);}};
    f();
  },[]);

  const handleView=v=>setSelectedVideo(v);
  const handleDelete=async id=>{if(!window.confirm("Are you sure you want to delete?"))return;try{await fetch(`/api/recorded-videos/${id}`,{method:"DELETE"});setVideos(p=>p.filter(v=>v.id!==id));}catch(e){console.error(e);}};

  return(
    <div className={`rv${dark?" rv-dk":""}`}>
      <div className="rv-inner">
        <div className="rv-hdr">
          <div className="rv-hdr-ico"><Video size={18}/></div>
          <div>
            <div className="rv-bdg"><Video size={9}/> Admin</div>
            <h1 className="rv-h1">Admin Recorded Videos</h1>
            <p className="rv-sub">Monitor and manage all recorded sessions uploaded by trainers</p>
          </div>
        </div>

        <div className="rv-tcard">
          {videos.length===0?(
            <div className="rv-empty">
              <div className="rv-empty-ico"><Video size={22}/></div>
              <p className="rv-empty-t">No videos found</p>
            </div>
          ):(
            <div className="rv-tscroll">
            <table className="rv-t">
              <thead><tr><th>Title</th><th>Trainer</th><th>Batch</th><th>Upload Date</th><th>Actions</th></tr></thead>
              <tbody>
                {videos.map(v=>(
                  <tr key={v.id}>
                    <td><span className="rv-t-name">{v.title}</span></td>
                    <td><span className="rv-t-cell">{v.trainer}</span></td>
                    <td><span className="rv-t-cell">{v.batch}</span></td>
                    <td><span className="rv-t-cell">{v.date}</span></td>
                    <td>
                      <div className="rv-actions">
                        <button className="rv-abtn view" onClick={()=>handleView(v)}><Eye size={13}/></button>
                        <button className="rv-abtn del" onClick={()=>handleDelete(v.id)}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {selectedVideo&&(
        <div className={`rv-mo${dark?" rv-dk":""}`} onClick={()=>setSelectedVideo(null)}>
          <div className="rv-mc" onClick={e=>e.stopPropagation()}>
            <div className="rv-mh">
              <div className="rv-mhl">
                <div className="rv-mico"><Video size={17}/></div>
                <div style={{minWidth:0}}><p className="rv-mt">Recorded Video Details</p><p className="rv-ms">{selectedVideo.title}</p></div>
              </div>
              <button className="rv-mx" onClick={()=>setSelectedVideo(null)}><X size={14}/></button>
            </div>
            <div className="rv-mb">
              {[["Title",selectedVideo.title],["Trainer",selectedVideo.trainer],["Batch",selectedVideo.batch],["Upload Date",selectedVideo.date]].map(([l,v])=>(
                <div key={l} className="rv-mrow">
                  <div style={{minWidth:0}}>
                    <p className="rv-mlbl">{l}</p>
                    <p className="rv-mval">{v||"—"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rv-mf">
              <button className="rv-close-btn" onClick={()=>setSelectedVideo(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminRecordedVideos;