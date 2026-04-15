// import React, { useEffect, useState } from "react";
// import { Video, Trash2, Eye } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const AdminRecordedVideos = () => {
//   const [videos, setVideos] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const res = await fetch("/api/recorded-videos");
//         if (!res.ok) { setVideos([]); return; }
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         setVideos(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Failed to fetch videos", error);
//         setVideos([]);
//       }
//     };

//     fetchVideos();
//   }, []);

//   const handleView = (video) => {
//     setSelectedVideo(video);
//   };

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");
//     if (!confirmDelete) return;

//     try {
//       await fetch(`/api/recorded-videos/${id}`, {
//         method: "DELETE",
//       });
//       setVideos((prev) => prev.filter((v) => v.id !== id));
//     } catch (error) {
//       console.error("Delete failed", error);
//     }
//   };

//   return (
//     <div className="p-6">

//       {/* ✅ Gradient Banner Header */}
//       <div className="mb-6">
//         <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 
//                         text-white p-6 rounded-2xl shadow-lg">
//           <div className="flex items-center gap-3">
//             <Video size={28} />
//             <div>
//               <h1 className="text-2xl font-semibold">
//                 Admin Recorded Videos
//               </h1>
//               <p className="text-sm opacity-90 mt-1">
//                 Monitor and manage all recorded sessions uploaded by trainers
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="p-4">
//           <table className="w-full text-sm">
//             <thead className="border-b">
//               <tr className="text-left">
//                 <th className="p-2">Title</th>
//                 <th className="p-2">Trainer</th>
//                 <th className="p-2">Batch</th>
//                 <th className="p-2">Upload Date</th>
//                 <th className="p-2">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {videos.map((video) => (
//                 <tr
//                   key={video.id}
//                   className="border-b hover:bg-gray-50 dark:hover:bg-white/5"
//                 >
//                   <td className="p-2">{video.title}</td>
//                   <td className="p-2">{video.trainer}</td>
//                   <td className="p-2">{video.batch}</td>
//                   <td className="p-2">{video.date}</td>
//                   <td className="p-2 flex gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => handleView(video)}
//                     >
//                       <Eye size={16} />
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleDelete(video.id)}
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>

//       {/* ✅ View Modal */}
//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl w-96 shadow-xl">
//             <h2 className="text-lg font-semibold mb-4">
//               Recorded Video Details
//             </h2>

//             <p><strong>Title:</strong> {selectedVideo.title}</p>
//             <p><strong>Trainer:</strong> {selectedVideo.trainer}</p>
//             <p><strong>Batch:</strong> {selectedVideo.batch}</p>
//             <p><strong>Upload Date:</strong> {selectedVideo.date}</p>

//             <div className="flex justify-end mt-4">
//               <Button onClick={() => setSelectedVideo(null)}>
//                 Close
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminRecordedVideos;




















import React, { useEffect, useState } from "react";
import { Video, Trash2, Eye, X } from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c4:#a78bfa;--cr:#f87171;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.rv-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);}
.rv{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.rv-inner{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.rv-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;gap:16px;}
.rv-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c4);flex-shrink:0;}
.rv-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);color:var(--c4);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.rv-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.rv-sub{font-size:13px;color:var(--mu);margin:0;}
.rv-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
table.rv-t{width:100%;border-collapse:collapse;font-size:13px;}
.rv-t thead th{padding:12px 18px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.rv-t thead th:last-child{text-align:right;padding-right:22px;}
.rv-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.rv-t tbody tr:last-child{border-bottom:none;}
.rv-t tbody tr:hover{background:rgba(167,139,250,.025);}
.rv-t tbody td{padding:13px 18px;vertical-align:middle;}
.rv-t tbody td:last-child{text-align:right;padding-right:22px;}
.rv-t-name{font-size:13px;font-weight:700;color:var(--tx);}
.rv-t-cell{font-size:12px;color:var(--mu);}
.rv-actions{display:flex;justify-content:flex-end;gap:6px;}
.rv-abtn{width:30px;height:30px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.rv-abtn.view{background:rgba(34,211,238,.10);color:var(--c1);}
.rv-abtn.view:hover{background:rgba(34,211,238,.20);}
.rv-abtn.del{background:rgba(248,113,113,.10);color:var(--cr);}
.rv-abtn.del:hover{background:rgba(248,113,113,.20);}
.rv-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;}
.rv-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(167,139,250,.08);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.rv-empty-t{font-size:13px;font-weight:700;color:var(--mu);margin:0;}
/* modal */
.rv-mo{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;}
.rv-mc{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);width:100%;max-width:420px;overflow:hidden;box-shadow:var(--shl);}
.rv-mh{padding:18px 20px;background:rgba(167,139,250,.06);border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;}
.rv-mhl{display:flex;align-items:center;gap:10px;}
.rv-mico{width:36px;height:36px;border-radius:10px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.20);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.rv-mt{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.rv-ms{font-size:11px;color:var(--mu);margin:0;}
.rv-mx{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.rv-mx:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.rv-mb{padding:20px;display:flex;flex-direction:column;gap:10px;}
.rv-mrow{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.rv-mlbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:0 0 3px;}
.rv-mval{font-size:13px;font-weight:700;color:var(--tx);margin:0;}
.rv-mf{padding:14px 20px;border-top:1px solid var(--bd);display:flex;justify-content:flex-end;}
.rv-close-btn{padding:10px 22px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
.rv-close-btn:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
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
          <div className="rv-hdr-ico"><Video size={24}/></div>
          <div>
            <div className="rv-bdg"><Video size={10}/> Admin</div>
            <h1 className="rv-h1">Admin Recorded Videos</h1>
            <p className="rv-sub">Monitor and manage all recorded sessions uploaded by trainers</p>
          </div>
        </div>

        <div className="rv-tcard">
          {videos.length===0?(
            <div className="rv-empty">
              <div className="rv-empty-ico"><Video size={24}/></div>
              <p className="rv-empty-t">No videos found</p>
            </div>
          ):(
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
          )}
        </div>
      </div>

      {selectedVideo&&(
        <div className={`rv-mo${dark?" rv-dk":""}`} onClick={()=>setSelectedVideo(null)}>
          <div className="rv-mc" onClick={e=>e.stopPropagation()}>
            <div className="rv-mh">
              <div className="rv-mhl">
                <div className="rv-mico"><Video size={17}/></div>
                <div><p className="rv-mt">Recorded Video Details</p><p className="rv-ms">{selectedVideo.title}</p></div>
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