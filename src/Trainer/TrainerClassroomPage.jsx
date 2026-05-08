// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getTrainerBatchStudents } from "../services/batchService";
// import { ChevronDown, Users, GraduationCap, Search, Mail } from "lucide-react";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .cp-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
// .cp{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .cp-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
// .cp-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
// .cp-hdr-l{display:flex;align-items:center;gap:16px;}
// .cp-ico{width:52px;height:52px;border-radius:14px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c4);flex-shrink:0;}
// .cp-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);color:var(--c4);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .cp-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .cp-sub{font-size:13px;color:var(--mu);margin:0;}
// .cp-chip{padding:10px 20px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;color:var(--c4);white-space:nowrap;box-shadow:var(--sh);}
// .cp-panel{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
// .cp-phead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 24px;border-bottom:1px solid var(--bd);flex-wrap:wrap;}
// .cp-phl{display:flex;align-items:center;gap:10px;}
// .cp-ptitle{font-size:14px;font-weight:700;color:var(--tx);}
// .cp-cnt{padding:4px 10px;border-radius:8px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);color:var(--c4);font-size:11px;font-weight:700;}
// .cp-phr{display:flex;align-items:center;gap:10px;}
// .cp-search{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);}
// .cp-search input{background:transparent;border:none;outline:none;font-family:'Poppins',sans-serif;font-size:12px;color:var(--tx);width:140px;}
// .cp-search input::placeholder{color:var(--mu);}
// .cp-chev-btn{width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .2s,color .2s;color:var(--mu);}
// .cp-chev-btn:hover{border-color:rgba(167,139,250,.30);color:var(--c4);}
// .cp-body{padding:20px;}
// .cp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;}
// .cp-card{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:1px solid var(--bd);background:var(--bg);transition:border-color .2s,box-shadow .2s;}
// .cp-card:hover{border-color:rgba(167,139,250,.30);box-shadow:var(--sh);}
// .cp-av{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#0a0a0a;flex-shrink:0;}
// .cp-cname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;text-transform:capitalize;}
// .cp-cemail{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--mu);}
// .cp-idx{margin-left:auto;font-size:11px;color:var(--mu);font-weight:700;flex-shrink:0;font-family:monospace;}
// .cp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:12px;text-align:center;}
// .cp-eico{width:52px;height:52px;border-radius:15px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c4);}
// .cp-et{font-size:15px;font-weight:700;color:var(--tx);margin:0 0 4px;}
// .cp-es{font-size:12px;color:var(--mu);margin:0;}
// .cp-footer{padding:14px 24px;border-top:1px solid var(--bd);font-size:11px;color:var(--mu);font-weight:500;}
// `;
// if(!document.getElementById("cp-st")){const t=document.createElement("style");t.id="cp-st";t.textContent=STYLES;document.head.appendChild(t);}
// const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

// const AVATARS=["rgba(34,211,238,.8)","rgba(167,139,250,.8)","rgba(52,211,153,.8)","rgba(251,146,60,.8)","rgba(248,113,113,.8)","rgba(34,211,238,.6)","rgba(52,211,153,.6)","rgba(167,139,250,.6)"];

// const TrainerClassroomPage = () => {
//   const { batchId } = useParams();
//   const [students, setStudents] = useState([]);
//   const [isOpen, setIsOpen] = useState(true);
//   const [search, setSearch] = useState("");
//   const [dark, setDark] = useState(isDark);

//   useEffect(()=>{
//     const load=async()=>{const res=await getTrainerBatchStudents(batchId);setStudents(res.data||[]);};
//     load();
//   },[batchId]);

//   useEffect(()=>{
//     const o=new MutationObserver(()=>setDark(isDark()));
//     o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
//     o.observe(document.body,{attributes:true,attributeFilter:["class"]});
//     return()=>o.disconnect();
//   },[]);

//   const filtered=students.filter(e=>e.toLowerCase().includes(search.toLowerCase()));

//   return(
//     <div className={`cp${dark?" cp-dk":""}`}>
//       <div className="cp-in">
//         <div className="cp-hdr">
//           <div className="cp-hdr-l">
//             <div className="cp-ico"><GraduationCap size={24}/></div>
//             <div>
//               <div className="cp-bdg"><GraduationCap size={10}/> Classroom</div>
//               <h1 className="cp-h1">Classroom Students</h1>
//               <p className="cp-sub">Batch ID: {batchId}</p>
//             </div>
//           </div>
//           <div className="cp-chip">{students.length} Student{students.length!==1?"s":""}</div>
//         </div>

//         <div className="cp-panel">
//           <div className="cp-phead">
//             <div className="cp-phl">
//               <Users size={16} style={{color:"var(--c4)"}}/>
//               <span className="cp-ptitle">Enrolled Students</span>
//               <span className="cp-cnt">{students.length}</span>
//             </div>
//             <div className="cp-phr">
//               <div className="cp-search">
//                 <Search size={13} style={{color:"var(--mu)"}}/>
//                 <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..."/>
//               </div>
//               <button className="cp-chev-btn" onClick={()=>setIsOpen(p=>!p)}>
//                 <ChevronDown size={15} style={{transform:isOpen?"rotate(0)":"rotate(-90deg)",transition:"transform .3s"}}/>
//               </button>
//             </div>
//           </div>

//           {isOpen&&(
//             <div className="cp-body">
//               {students.length===0?(
//                 <div className="cp-empty">
//                   <div className="cp-eico"><Users size={26}/></div>
//                   <p className="cp-et">No students yet</p>
//                   <p className="cp-es">Students assigned to this batch will appear here.</p>
//                 </div>
//               ):filtered.length===0?(
//                 <div className="cp-empty"><p style={{fontSize:13,color:"var(--mu)"}}>No students match "{search}"</p></div>
//               ):(
//                 <>
//                   <div className="cp-grid">
//                     {filtered.map((email,i)=>{
//                       const name=email.split("@")[0];
//                       const initials=name.split(/[._-]/).map(p=>p[0]?.toUpperCase()??"").slice(0,2).join("");
//                       const bg=AVATARS[i%AVATARS.length];
//                       return(
//                         <div key={email} className="cp-card">
//                           <div className="cp-av" style={{background:bg}}>{initials||name[0]?.toUpperCase()}</div>
//                           <div style={{minWidth:0}}>
//                             <p className="cp-cname">{name.replace(/[._-]/g," ")}</p>
//                             <div className="cp-cemail"><Mail size={11}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span></div>
//                           </div>
//                           <span className="cp-idx">#{String(i+1).padStart(2,"0")}</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="cp-footer" style={{marginTop:14}}>Showing {filtered.length} of {students.length} students</div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default TrainerClassroomPage;
























import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainerBatchStudents } from "../services/batchService";
import { ChevronDown, Users, GraduationCap, Search, Mail } from "lucide-react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{
  --bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;
}
.cp-dk{
  --bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);
}

/* ── Base: full page ── */
.cp{
  font-family:'Poppins',sans-serif;
  min-height:100vh;
  width:100%;
  background:var(--bg);
  color:var(--tx);
  padding:16px;
  box-sizing:border-box;
  display:block;
  margin:0;
}
.cp-in{
  width:100%;
  max-width:100%;
  display:flex;
  flex-direction:column;
  gap:16px;
  box-sizing:border-box;
}

/* ── Hero Header ── */
.cp-hdr{
  background:var(--card);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:20px 16px;
  box-shadow:var(--sh);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
  width:100%;
  box-sizing:border-box;
}
.cp-hdr-l{display:flex;align-items:center;gap:14px;min-width:0;flex:1;}
.cp-ico{
  width:48px;height:48px;border-radius:14px;
  background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);
  display:flex;align-items:center;justify-content:center;color:var(--c4);flex-shrink:0;
}
.cp-bdg{
  display:inline-flex;align-items:center;gap:6px;padding:3px 10px;
  border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);
  color:var(--c4);font-size:9px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;margin-bottom:6px;
}

/* ── Gradient Title ── */
.cp-h1{
  font-family:'Poppins',sans-serif;
  font-weight:800;
  font-size:clamp(1.4rem,3.5vw,2.2rem);
  margin:0 0 2px;
  line-height:1.1;
  letter-spacing:-0.02em;
  color:var(--tx);
}
.cp-h1-plain{color:var(--tx);}
.cp-h1-grad{
  background:linear-gradient(135deg,#a78bfa,#22d3ee);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}

.cp-sub{font-size:12px;color:var(--mu);margin:0;}
.cp-chip{
  padding:8px 16px;border-radius:13px;background:var(--bg);
  border:1px solid var(--bd);font-size:12px;font-weight:700;
  color:var(--c4);white-space:nowrap;box-shadow:var(--sh);flex-shrink:0;
}

/* ── Panel ── */
.cp-panel{
  background:var(--card);border:1px solid var(--bd);
  border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;
  width:100%;box-sizing:border-box;
}
.cp-phead{
  display:flex;align-items:center;justify-content:space-between;
  gap:10px;padding:14px 16px;border-bottom:1px solid var(--bd);flex-wrap:wrap;
}
.cp-phl{display:flex;align-items:center;gap:10px;}
.cp-ptitle{font-size:13px;font-weight:700;color:var(--tx);}
.cp-cnt{
  padding:3px 9px;border-radius:8px;background:rgba(167,139,250,.10);
  border:1px solid rgba(167,139,250,.15);color:var(--c4);font-size:11px;font-weight:700;
}
.cp-phr{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.cp-search{
  display:flex;align-items:center;gap:7px;padding:8px 12px;
  border-radius:12px;border:1px solid var(--bd);background:var(--bg);
  min-width:0;
}
.cp-search input{
  background:transparent;border:none;outline:none;
  font-family:'Poppins',sans-serif;font-size:12px;color:var(--tx);
  width:120px;min-width:0;
}
.cp-search input::placeholder{color:var(--mu);}
.cp-chev-btn{
  width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);
  background:var(--bg);display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:border-color .2s,color .2s;color:var(--mu);flex-shrink:0;
}
.cp-chev-btn:hover{border-color:rgba(167,139,250,.30);color:var(--c4);}

/* ── Body & Grid ── */
.cp-body{padding:16px;}
.cp-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
  gap:10px;
}
.cp-card{
  display:flex;align-items:center;gap:12px;padding:12px 14px;
  border-radius:14px;border:1px solid var(--bd);background:var(--bg);
  transition:border-color .2s,box-shadow .2s;
}
.cp-card:hover{border-color:rgba(167,139,250,.30);box-shadow:var(--sh);}
.cp-av{
  width:40px;height:40px;border-radius:11px;
  display:flex;align-items:center;justify-content:center;
  font-size:13px;font-weight:800;color:#0a0a0a;flex-shrink:0;
}
.cp-cname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;text-transform:capitalize;}
.cp-cemail{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--mu);}
.cp-cemail span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cp-idx{margin-left:auto;font-size:11px;color:var(--mu);font-weight:700;flex-shrink:0;font-family:monospace;}

/* ── Empty ── */
.cp-empty{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:50px 20px;gap:12px;text-align:center;
}
.cp-eico{
  width:52px;height:52px;border-radius:15px;background:rgba(167,139,250,.10);
  border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;
  justify-content:center;color:var(--c4);
}
.cp-et{font-size:15px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.cp-es{font-size:12px;color:var(--mu);margin:0;}
.cp-footer{padding:12px 16px;border-top:1px solid var(--bd);font-size:11px;color:var(--mu);font-weight:500;}

/* ── RESPONSIVE ── */

/* Tablet (≥ 640px) */
@media (min-width:640px){
  .cp{padding:24px;}
  .cp-hdr{padding:24px 28px;}
  .cp-ico{width:52px;height:52px;}
  .cp-phead{padding:16px 22px;}
  .cp-body{padding:20px;}
  .cp-search input{width:150px;}
  .cp-chip{font-size:13px;}
}

/* Desktop (≥ 1024px) */
@media (min-width:1024px){
  .cp{padding:32px;}
  .cp-hdr{padding:28px 36px;}
  .cp-in{gap:20px;}
  .cp-phead{padding:18px 24px;}
  .cp-body{padding:20px 24px;}
  .cp-grid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));}
  .cp-footer{padding:14px 24px;}
  .cp-search input{width:160px;}
}

/* Phone only (≤ 480px) */
@media (max-width:480px){
  .cp{padding:12px;}
  .cp-hdr{padding:16px 14px;gap:12px;}
  .cp-hdr-l{gap:10px;}
  .cp-ico{width:40px;height:40px;}
  .cp-chip{font-size:11px;padding:7px 12px;}
  .cp-phead{flex-direction:column;align-items:flex-start;gap:10px;padding:12px 14px;}
  .cp-phr{width:100%;}
  .cp-search{flex:1;}
  .cp-search input{width:100%;flex:1;}
  .cp-body{padding:12px;}
  .cp-grid{grid-template-columns:1fr;}
  .cp-footer{padding:10px 14px;}
}

/* Very small (≤ 360px) */
@media (max-width:360px){
  .cp-chip{display:none;}
}
`;

if(!document.getElementById("cp-st")){
  const t=document.createElement("style");
  t.id="cp-st";
  t.textContent=STYLES;
  document.head.appendChild(t);
}

const isDark=()=>
  document.documentElement.classList.contains("dark")||
  document.body.classList.contains("dark")||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const AVATARS=[
  "rgba(34,211,238,.8)","rgba(167,139,250,.8)","rgba(52,211,153,.8)",
  "rgba(251,146,60,.8)","rgba(248,113,113,.8)","rgba(34,211,238,.6)",
  "rgba(52,211,153,.6)","rgba(167,139,250,.6)"
];

const TrainerClassroomPage = () => {
  const { batchId } = useParams();
  const [students, setStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(isDark);

  useEffect(()=>{
    const load=async()=>{const res=await getTrainerBatchStudents(batchId);setStudents(res.data||[]);};
    load();
  },[batchId]);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  const filtered=students.filter(e=>e.toLowerCase().includes(search.toLowerCase()));

  return(
    <div className={`cp${dark?" cp-dk":""}`}>
      <div className="cp-in">

        {/* ════════════ HERO HEADER ════════════ */}
        <div className="cp-hdr">
          <div className="cp-hdr-l">
            <div className="cp-ico"><GraduationCap size={24}/></div>
            <div style={{minWidth:0}}>
              <div className="cp-bdg"><GraduationCap size={9}/> Classroom</div>
              <h1 className="cp-h1">
                <span className="cp-h1-plain">Classroom </span>
                <span className="cp-h1-grad">Students</span>
              </h1>
              <p className="cp-sub">Batch ID: {batchId}</p>
            </div>
          </div>
          <div className="cp-chip">{students.length} Student{students.length!==1?"s":""}</div>
        </div>

        {/* ════════════ PANEL ════════════ */}
        <div className="cp-panel">
          <div className="cp-phead">
            <div className="cp-phl">
              <Users size={16} style={{color:"var(--c4)"}}/>
              <span className="cp-ptitle">Enrolled Students</span>
              <span className="cp-cnt">{students.length}</span>
            </div>
            <div className="cp-phr">
              <div className="cp-search">
                <Search size={13} style={{color:"var(--mu)"}}/>
                <input
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search student..."
                />
              </div>
              <button className="cp-chev-btn" onClick={()=>setIsOpen(p=>!p)}>
                <ChevronDown
                  size={15}
                  style={{transform:isOpen?"rotate(0)":"rotate(-90deg)",transition:"transform .3s"}}
                />
              </button>
            </div>
          </div>

          {isOpen&&(
            <div className="cp-body">
              {students.length===0?(
                <div className="cp-empty">
                  <div className="cp-eico"><Users size={26}/></div>
                  <p className="cp-et">No students yet</p>
                  <p className="cp-es">Students assigned to this batch will appear here.</p>
                </div>
              ):filtered.length===0?(
                <div className="cp-empty">
                  <p style={{fontSize:13,color:"var(--mu)"}}>No students match "{search}"</p>
                </div>
              ):(
                <>
                  <div className="cp-grid">
                    {filtered.map((email,i)=>{
                      const name=email.split("@")[0];
                      const initials=name.split(/[._-]/).map(p=>p[0]?.toUpperCase()??"").slice(0,2).join("");
                      const bg=AVATARS[i%AVATARS.length];
                      return(
                        <div key={email} className="cp-card">
                          <div className="cp-av" style={{background:bg}}>{initials||name[0]?.toUpperCase()}</div>
                          <div style={{minWidth:0}}>
                            <p className="cp-cname">{name.replace(/[._-]/g," ")}</p>
                            <div className="cp-cemail">
                              <Mail size={11}/>
                              <span>{email}</span>
                            </div>
                          </div>
                          <span className="cp-idx">#{String(i+1).padStart(2,"0")}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cp-footer" style={{marginTop:12}}>
                    Showing {filtered.length} of {students.length} students
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TrainerClassroomPage;