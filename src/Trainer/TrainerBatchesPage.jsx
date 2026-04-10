// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getTrainerBatches } from "../services/batchService";
// import { ChevronDown, ChevronUp, Users, BookOpen, Hash } from "lucide-react";

// const TrainerBatchesPage = () => {
//   const [batches, setBatches] = useState([]);
//   const [expanded, setExpanded] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const load = async () => {
//       const res = await getTrainerBatches();
//       setBatches(res || []);
//     };
//     load();
//   }, []);

//   const toggleExpand = (id) => {
//     setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   return (
//     <div style={{ padding: "24px", maxWidth: "800px" }}>
//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
//         <div style={{
//           background: "#2563eb",
//           color: "#fff",
//           borderRadius: "10px",
//           padding: "8px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center"
//         }}>
//           <Users size={20} />
//         </div>
//         <div>
//           <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 }}>
//             My Batches
//           </h1>
//           <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
//             {batches.length} batch{batches.length !== 1 ? "es" : ""} assigned
//           </p>
//         </div>
//       </div>

//       {/* Batch Cards */}
//       <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//         {batches.map((b) => {
//           const isOpen = expanded[b.id];
//           return (
//             <div
//               key={b.id}
//               style={{
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "14px",
//                 overflow: "hidden",
//                 background: "#fff",
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//                 transition: "box-shadow 0.2s",
//               }}
//             >
//               {/* Collapsed Row */}
//               <div
//                 onClick={() => toggleExpand(b.id)}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   padding: "16px 20px",
//                   cursor: "pointer",
//                   background: isOpen ? "#f8fafc" : "#fff",
//                   transition: "background 0.15s",
//                   userSelect: "none",
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
//                 onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#f8fafc" : "#fff"}
//               >
//                 {/* Left */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
//                   <div style={{
//                     background: "#eff6ff",
//                     color: "#2563eb",
//                     borderRadius: "10px",
//                     padding: "8px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center"
//                   }}>
//                     <BookOpen size={18} />
//                   </div>
//                   <div>
//                     <p style={{ fontWeight: "600", fontSize: "15px", color: "#1e293b", margin: 0 }}>
//                       {b.batchName}
//                     </p>
//                     <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
//                       <Hash size={11} color="#94a3b8" />
//                       <span style={{ fontSize: "12px", color: "#94a3b8" }}>Batch ID: {b.id}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right: chevron */}
//                 <div style={{ color: "#94a3b8", display: "flex" }}>
//                   {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                 </div>
//               </div>

//               {/* Expanded Content */}
//               {isOpen && (
//                 <div style={{
//                   padding: "14px 20px 18px",
//                   borderTop: "1px solid #f1f5f9",
//                   background: "#f8fafc",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   gap: "12px",
//                   flexWrap: "wrap"
//                 }}>
//                   <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
//                     Click <strong style={{ color: "#334155" }}>Open Classroom</strong> to manage
//                     students, content, and more for this batch.
//                   </p>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate(`/trainer/batches/${b.id}/students`);
//                     }}
//                     style={{
//                       background: "#2563eb",
//                       color: "#fff",
//                       border: "none",
//                       borderRadius: "8px",
//                       padding: "9px 20px",
//                       fontSize: "13px",
//                       fontWeight: "600",
//                       cursor: "pointer",
//                       whiteSpace: "nowrap",
//                       transition: "background 0.15s",
//                     }}
//                     onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
//                     onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
//                   >
//                     Open Classroom
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {batches.length === 0 && (
//         <div style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "80px 0",
//           color: "#cbd5e1"
//         }}>
//           <Users size={44} style={{ marginBottom: "12px", opacity: 0.3 }} />
//           <p style={{ fontSize: "15px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>
//             No batches assigned yet
//           </p>
//           <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "6px" }}>
//             Your batches will appear here once assigned.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerBatchesPage;





















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "../services/batchService";
import { ChevronDown, ChevronUp, Users, BookOpen, Hash } from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.tb-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.tb{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.tb-in{max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.tb-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;gap:16px;}
.tb-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.tb-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.tb-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.tb-sub{font-size:13px;color:var(--mu);margin:0;}
.tb-list{display:flex;flex-direction:column;gap:12px;}
.tb-card{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);transition:box-shadow .2s,border-color .2s;}
.tb-card:hover{box-shadow:var(--shl);border-color:rgba(34,211,238,.20);}
.tb-row{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;cursor:pointer;user-select:none;transition:background .15s;}
.tb-row:hover{background:rgba(34,211,238,.03);}
.tb-row.open{background:rgba(34,211,238,.04);}
.tb-rl{display:flex;align-items:center;gap:14px;}
.tb-bico{width:42px;height:42px;border-radius:12px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.tb-bname{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 3px;}
.tb-bid{display:flex;align-items:center;gap:3px;font-size:11px;color:var(--mu);}
.tb-chev{color:var(--mu);}
.tb-exp{padding:16px 24px;border-top:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:rgba(34,211,238,.025);}
.tb-etxt{font-size:13px;color:var(--mu);}
.tb-etxt strong{color:var(--tx);}
.tb-obtn{padding:10px 22px;border-radius:12px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:opacity .2s,transform .15s;}
.tb-obtn:hover{opacity:.87;transform:translateY(-1px);}
.tb-empty{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:80px 20px;text-align:center;box-shadow:var(--sh);}
.tb-ei{opacity:.35;margin-bottom:14px;}
.tb-et{font-size:15px;font-weight:700;color:var(--mu);margin:0 0 6px;}
.tb-es{font-size:13px;color:var(--mu);margin:0;}
`;
if(!document.getElementById("tb-st")){const t=document.createElement("style");t.id="tb-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const TrainerBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [dark, setDark] = useState(isDark);
  const navigate = useNavigate();

  useEffect(()=>{
    const load=async()=>{const res=await getTrainerBatches();setBatches(res||[]);};
    load();
  },[]);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  const toggle=id=>setExpanded(p=>({...p,[id]:!p[id]}));

  return(
    <div className={`tb${dark?" tb-dk":""}`}>
      <div className="tb-in">
        <div className="tb-hdr">
          <div className="tb-ico"><Users size={24}/></div>
          <div>
            <div className="tb-bdg"><Users size={10}/> Batch Management</div>
            <h1 className="tb-h1">My Batches</h1>
            <p className="tb-sub">{batches.length} batch{batches.length!==1?"es":""} assigned</p>
          </div>
        </div>

        <div className="tb-list">
          {batches.map(b=>{
            const isOpen=expanded[b.id];
            return(
              <div key={b.id} className="tb-card">
                <div className={`tb-row${isOpen?" open":""}`} onClick={()=>toggle(b.id)}>
                  <div className="tb-rl">
                    <div className="tb-bico"><BookOpen size={18}/></div>
                    <div>
                      <p className="tb-bname">{b.batchName}</p>
                      <div className="tb-bid"><Hash size={11}/><span>Batch ID: {b.id}</span></div>
                    </div>
                  </div>
                  <div className="tb-chev">{isOpen?<ChevronUp size={18}/>:<ChevronDown size={18}/>}</div>
                </div>
                {isOpen&&(
                  <div className="tb-exp">
                    <p className="tb-etxt">Click <strong>Open Classroom</strong> to manage students, content, and more for this batch.</p>
                    <button className="tb-obtn" onClick={e=>{e.stopPropagation();navigate(`/trainer/batches/${b.id}/students`);}}>
                      Open Classroom
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {batches.length===0&&(
          <div className="tb-empty">
            <div className="tb-ei"><Users size={44} style={{color:"var(--mu)"}}/></div>
            <p className="tb-et">No batches assigned yet</p>
            <p className="tb-es">Your batches will appear here once assigned.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrainerBatchesPage;