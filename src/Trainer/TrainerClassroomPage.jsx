// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getTrainerBatchStudents } from "../services/batchService";
// import { Card, CardContent } from "@/components/ui/card";
// import { ChevronDown, Users, GraduationCap, Search, Mail } from "lucide-react";

// const TrainerClassroomPage = () => {
//   const { batchId } = useParams();
//   const [students, setStudents] = useState([]);

//   // ── UI-only state ──────────────────────────────────────
//   const [isOpen, setIsOpen] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       const res = await getTrainerBatchStudents(batchId);
//       setStudents(res.data || []);
//     };
//     load();
//   }, [batchId]);

//   // UI-only derived value — no logic change
//   const filtered = students.filter((email) =>
//     email.toLowerCase().includes(search.toLowerCase()),
//   );

//   // Unique avatar color per student (UI only)
//   const avatarColors = [
//     "from-violet-500 to-purple-600",
//     "from-blue-500 to-cyan-600",
//     "from-emerald-500 to-teal-600",
//     "from-orange-500 to-amber-600",
//     "from-pink-500 to-rose-600",
//     "from-indigo-500 to-blue-600",
//     "from-teal-500 to-green-600",
//     "from-red-500 to-orange-600",
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] p-6">
//       {/* ── HERO HEADER ─────────────────────────────────── */}
//       <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl">
//         {/* decorative blobs */}
//         <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
//         <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

//         <div className="relative px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
//               <GraduationCap size={28} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Classroom Students
//               </h1>
//               <p className="text-sm text-blue-100 mt-0.5">
//                 Batch ID: {batchId}
//               </p>
//             </div>
//           </div>

//           {/* stat pill */}
//           <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 w-fit">
//             <Users size={16} />
//             <span className="text-sm font-semibold">
//               {students.length} Student{students.length !== 1 ? "s" : ""}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ── STUDENTS CARD ───────────────────────────────── */}
//       <Card className="shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-[#111827]">
//         <CardContent className="p-0">
//           {/* Card header */}
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
//             <div className="flex items-center gap-2">
//               <Users size={18} className="text-indigo-500" />
//               <h2 className="font-semibold text-gray-800 dark:text-white">
//                 Enrolled Students
//               </h2>
//               <span className="ml-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 rounded-full px-2.5 py-0.5">
//                 {students.length}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               {/* Search — UI only */}
//               <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1F2937] rounded-xl px-3 py-1.5 text-sm">
//                 <Search size={13} className="text-gray-400" />
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search student..."
//                   className="bg-transparent outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 w-36"
//                 />
//               </div>

//               {/* Collapse / Expand arrow — UI only */}
//               <button
//                 onClick={() => setIsOpen((prev) => !prev)}
//                 title={isOpen ? "Collapse" : "Expand"}
//                 className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 <ChevronDown
//                   size={15}
//                   className={`text-gray-500 transition-transform duration-300 ${
//                     isOpen ? "rotate-0" : "-rotate-90"
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           {/* Student list — collapses/expands */}
//           {isOpen && (
//             <div className="p-4">
//               {students.length === 0 ? (
//                 /* Empty state */
//                 <div className="flex flex-col items-center justify-center py-20 text-center">
//                   <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
//                     <Users size={30} className="text-indigo-400" />
//                   </div>
//                   <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">
//                     No students yet
//                   </p>
//                   <p className="text-sm text-gray-400 mt-1">
//                     Students assigned to this batch will appear here.
//                   </p>
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div className="py-12 text-center text-gray-400 text-sm">
//                   No students match "{search}"
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//                   {filtered.map((email, i) => {
//                     const name = email.split("@")[0];
//                     const initials = name
//                       .split(/[._-]/)
//                       .map((p) => p[0]?.toUpperCase() ?? "")
//                       .slice(0, 2)
//                       .join("");
//                     const colorClass =
//                       avatarColors[i % avatarColors.length];

//                     return (
//                       <div
//                         key={email}
//                         className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1F2937] hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group"
//                       >
//                         {/* Avatar */}
//                         <div
//                           className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}
//                         >
//                           {initials || name[0]?.toUpperCase()}
//                         </div>

//                         {/* Info */}
//                         <div className="min-w-0">
//                           <p className="font-semibold text-gray-800 dark:text-white capitalize truncate text-sm">
//                             {name.replace(/[._-]/g, " ")}
//                           </p>
//                           <p className="flex items-center gap-1 text-xs text-gray-400 truncate mt-0.5">
//                             <Mail size={11} />
//                             {email}
//                           </p>
//                         </div>

//                         {/* Index badge */}
//                         <span className="ml-auto text-xs text-gray-300 dark:text-gray-600 font-mono flex-shrink-0">
//                           #{String(i + 1).padStart(2, "0")}
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Footer count */}
//               {filtered.length > 0 && (
//                 <p className="text-xs text-gray-400 mt-4 px-1">
//                   Showing {filtered.length} of {students.length} students
//                 </p>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
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
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.cp-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.cp{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.cp-in{max-width:1200px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
.cp-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:28px 32px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.cp-hdr-l{display:flex;align-items:center;gap:16px;}
.cp-ico{width:52px;height:52px;border-radius:14px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c4);flex-shrink:0;}
.cp-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(167,139,250,.08);color:var(--c4);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.cp-h1{font-size:24px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.cp-sub{font-size:13px;color:var(--mu);margin:0;}
.cp-chip{padding:10px 20px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;color:var(--c4);white-space:nowrap;box-shadow:var(--sh);}
.cp-panel{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.cp-phead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 24px;border-bottom:1px solid var(--bd);flex-wrap:wrap;}
.cp-phl{display:flex;align-items:center;gap:10px;}
.cp-ptitle{font-size:14px;font-weight:700;color:var(--tx);}
.cp-cnt{padding:4px 10px;border-radius:8px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);color:var(--c4);font-size:11px;font-weight:700;}
.cp-phr{display:flex;align-items:center;gap:10px;}
.cp-search{display:flex;align-items:center;gap:8px;padding:9px 13px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);}
.cp-search input{background:transparent;border:none;outline:none;font-family:'Poppins',sans-serif;font-size:12px;color:var(--tx);width:140px;}
.cp-search input::placeholder{color:var(--mu);}
.cp-chev-btn{width:32px;height:32px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .2s,color .2s;color:var(--mu);}
.cp-chev-btn:hover{border-color:rgba(167,139,250,.30);color:var(--c4);}
.cp-body{padding:20px;}
.cp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;}
.cp-card{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:1px solid var(--bd);background:var(--bg);transition:border-color .2s,box-shadow .2s;}
.cp-card:hover{border-color:rgba(167,139,250,.30);box-shadow:var(--sh);}
.cp-av{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#0a0a0a;flex-shrink:0;}
.cp-cname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 3px;text-transform:capitalize;}
.cp-cemail{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--mu);}
.cp-idx{margin-left:auto;font-size:11px;color:var(--mu);font-weight:700;flex-shrink:0;font-family:monospace;}
.cp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:12px;text-align:center;}
.cp-eico{width:52px;height:52px;border-radius:15px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.cp-et{font-size:15px;font-weight:700;color:var(--tx);margin:0 0 4px;}
.cp-es{font-size:12px;color:var(--mu);margin:0;}
.cp-footer{padding:14px 24px;border-top:1px solid var(--bd);font-size:11px;color:var(--mu);font-weight:500;}
`;
if(!document.getElementById("cp-st")){const t=document.createElement("style");t.id="cp-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const AVATARS=["rgba(34,211,238,.8)","rgba(167,139,250,.8)","rgba(52,211,153,.8)","rgba(251,146,60,.8)","rgba(248,113,113,.8)","rgba(34,211,238,.6)","rgba(52,211,153,.6)","rgba(167,139,250,.6)"];

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
        <div className="cp-hdr">
          <div className="cp-hdr-l">
            <div className="cp-ico"><GraduationCap size={24}/></div>
            <div>
              <div className="cp-bdg"><GraduationCap size={10}/> Classroom</div>
              <h1 className="cp-h1">Classroom Students</h1>
              <p className="cp-sub">Batch ID: {batchId}</p>
            </div>
          </div>
          <div className="cp-chip">{students.length} Student{students.length!==1?"s":""}</div>
        </div>

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
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search student..."/>
              </div>
              <button className="cp-chev-btn" onClick={()=>setIsOpen(p=>!p)}>
                <ChevronDown size={15} style={{transform:isOpen?"rotate(0)":"rotate(-90deg)",transition:"transform .3s"}}/>
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
                <div className="cp-empty"><p style={{fontSize:13,color:"var(--mu)"}}>No students match "{search}"</p></div>
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
                            <div className="cp-cemail"><Mail size={11}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{email}</span></div>
                          </div>
                          <span className="cp-idx">#{String(i+1).padStart(2,"0")}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cp-footer" style={{marginTop:14}}>Showing {filtered.length} of {students.length} students</div>
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