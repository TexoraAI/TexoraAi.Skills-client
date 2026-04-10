// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { getTrainerStudents } from "@/services/chatService";
// import videoService from "@/services/videoService";
// import {
//   ChevronDown,
//   ChevronRight,
//   MessageCircle,
//   Search,
//   Sparkles,
//   User,
//   Users,
//   Filter,
//   Inbox,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import DoubtsChatModal from "./DoubtsChatModal";

// /* ─────────────────── Collapsible Section ─────────────────── */
// const Section = ({ title, icon: Icon, count, defaultOpen = true, children }) => {
//   const [open, setOpen] = useState(defaultOpen);

//   return (
//     <div className="mb-3 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
//       {/* Header */}
//       <button
//         onClick={() => setOpen((p) => !p)}
//         className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
//       >
//         <div className="flex items-center gap-2.5">
//           {open ? (
//             <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//           ) : (
//             <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//           )}
//           {Icon && <Icon className="w-4 h-4 text-indigo-500" />}
//           <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
//             {title}
//           </span>
//           {count !== undefined && (
//             <span className="ml-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
//               {count}
//             </span>
//           )}
//         </div>
//       </button>

//       {/* Body */}
//       <div
//         className={`transition-all duration-300 ease-in-out overflow-hidden ${
//           open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────── Main Component ─────────────────── */
// const DoubtsManagement = () => {
//   const [batchId, setBatchId] = useState(null);
//   const [batches, setBatches] = useState([]);
//   const [doubts, setDoubts] = useState([]);
//   const [activeDoubt, setActiveDoubt] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   /* ── Load batches ── */
//   useEffect(() => {
//     const loadBatches = async () => {
//       try {
//         const res = await videoService.getTrainerBatches();
//         const list = res.data || [];
//         setBatches(list);
//         if (list.length > 0) setBatchId(list[0].id);
//       } catch (e) {
//         console.error("Failed to load batches", e);
//       }
//     };
//     loadBatches();
//   }, []);

//   /* ── Load students ── */
//   useEffect(() => {
//     if (!batchId) return;
//     const loadStudents = async () => {
//       try {
//         const res = await getTrainerStudents(batchId);
//         const students = res.data.map((email, index) => ({
//           id: index + 1,
//           student: email.split("@")[0],
//           studentEmail: email,
//           batchId,
//         }));
//         setDoubts(students);
//       } catch (e) {
//         console.error("Failed to load students", e);
//         setDoubts([]);
//       }
//     };
//     loadStudents();
//   }, [batchId]);

//   const filteredDoubts = doubts.filter((d) =>
//     d.student.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#0d0f1a] font-sans">

//       {/* ── Top Header Bar ── */}
//       <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
//         <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
//               <Inbox className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
//                 Doubts Management
//               </h1>
//               <p className="text-xs text-slate-400">Track &amp; reply to student queries</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <span className="text-xs text-slate-400 hidden sm:block">
//               {doubts.length} student{doubts.length !== 1 ? "s" : ""}
//             </span>
//             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* ── Content ── */}
//       <div className="max-w-5xl mx-auto px-6 py-6">

//         {/* ── Section 1: Batch Selection ── */}
//         <Section title="Batch Selection" icon={Filter} defaultOpen={true}>
//           <div className="space-y-1">
//             <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
//               Active Batch
//             </label>
//             <div className="relative">
//               <select
//                 value={batchId || ""}
//                 onChange={(e) => setBatchId(Number(e.target.value))}
//                 className="w-full appearance-none h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//               >
//                 <option value="">— Select a Batch —</option>
//                 {batches.map((b) => (
//                   <option key={b.id} value={b.id}>
//                     {b.name || "Batch"} (ID: {b.id})
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             </div>
//           </div>
//         </Section>

//         {/* ── Section 2: Search / Filter ── */}
//         <Section title="Search Students" icon={Search} defaultOpen={true}>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <Input
//               className="h-10 pl-9 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400"
//               placeholder="Search by student name..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </Section>

//         {/* ── Section 3: Student List ── */}
//         <Section
//           title="Students"
//           icon={Users}
//           count={filteredDoubts.length}
//           defaultOpen={true}
//         >
//           {filteredDoubts.length === 0 ? (
//             <div className="py-8 text-center text-slate-400">
//               <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
//               <p className="text-sm">
//                 {batchId ? "No students found in this batch" : "Please select a batch first"}
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-2">
//               {filteredDoubts.map((d, i) => (
//                 <div
//                   key={d.id}
//                   className="group flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:shadow-sm transition-all duration-150"
//                 >
//                   {/* Left: Avatar + Name */}
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm uppercase select-none">
//                       {d.student[0]}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
//                         {d.student}
//                       </p>
//                       <p className="text-xs text-slate-400">{d.studentEmail}</p>
//                     </div>
//                   </div>

//                   {/* Right: Reply CTA */}
//                   <Button
//                     size="sm"
//                     className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm gap-1.5 transition-all"
//                     onClick={() => setActiveDoubt(d)}
//                   >
//                     <MessageCircle className="w-3.5 h-3.5" />
//                     Reply
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Section>
//       </div>

//       {/* ── Chat Modal ── */}
//       {activeDoubt && (
//         <DoubtsChatModal
//           doubt={activeDoubt}
//           onClose={() => setActiveDoubt(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default DoubtsManagement;








































import { getTrainerStudents } from "@/services/chatService";
import videoService from "@/services/videoService";
import { ChevronDown, ChevronRight, MessageCircle, Search, Sparkles, Users, Filter, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import DoubtsChatModal from "./DoubtsChatModal";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.dm-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.dm{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);}
.dm-topbar{background:var(--card);border-bottom:1px solid var(--bd);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:var(--sh);}
.dm-topbar-l{display:flex;align-items:center;gap:12px;}
.dm-topbar-ico{width:40px;height:40px;border-radius:12px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.18);display:flex;align-items:center;justify-content:center;color:var(--c4);}
.dm-topbar-title{font-size:15px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.dm-topbar-sub{font-size:11px;color:var(--mu);margin:0;}
.dm-topbar-r{display:flex;align-items:center;gap:8px;}
.dm-cnt{font-size:12px;color:var(--mu);}
.dm-pulse{width:8px;height:8px;border-radius:50%;background:var(--c3);animation:dm-pulse 2s ease-in-out infinite;}
@keyframes dm-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.dm-body{max-width:900px;margin:0 auto;padding:24px;}
.dm-section{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);margin-bottom:14px;}
.dm-sh{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;cursor:pointer;user-select:none;transition:background .15s;}
.dm-sh:hover{background:rgba(34,211,238,.025);}
.dm-shl{display:flex;align-items:center;gap:10px;}
.dm-stitle{font-size:12px;font-weight:700;color:var(--tx);text-transform:uppercase;letter-spacing:.08em;}
.dm-scnt{padding:3px 9px;border-radius:7px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);color:var(--c4);font-size:11px;font-weight:700;}
.dm-sbody{border-top:1px solid var(--bd);padding:16px 20px;}
.dm-sel{width:100%;padding:11px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;appearance:none;cursor:pointer;transition:border-color .2s,box-shadow .2s;}
.dm-sel:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.dm-sel-wrap{position:relative;}
.dm-sel-wrap svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.dm-search{position:relative;}
.dm-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.dm-search input{width:100%;padding:11px 14px 11px 40px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.dm-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.dm-search input::placeholder{color:var(--mu);}
.dm-list{display:flex;flex-direction:column;gap:8px;}
.dm-item{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);transition:border-color .2s,box-shadow .2s;}
.dm-item:hover{border-color:rgba(167,139,250,.30);box-shadow:var(--sh);}
.dm-item-l{display:flex;align-items:center;gap:12px;}
.dm-av{width:36px;height:36px;border-radius:10px;background:rgba(167,139,250,.20);border:1px solid rgba(167,139,250,.20);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--c4);text-transform:uppercase;flex-shrink:0;}
.dm-iname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;text-transform:capitalize;}
.dm-iemail{font-size:11px;color:var(--mu);margin:0;}
.dm-rbtn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;background:var(--c4);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;flex-shrink:0;}
.dm-rbtn:hover{opacity:.87;transform:translateY(-1px);}
.dm-empty{display:flex;flex-direction:column;align-items:center;padding:40px 20px;gap:10px;text-align:center;color:var(--mu);}
.dm-eico{opacity:.35;margin-bottom:4px;}
.dm-etxt{font-size:13px;font-weight:500;}
`;
if(!document.getElementById("dm-st")){const t=document.createElement("style");t.id="dm-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const Section=({title,icon:Icon,count,defaultOpen=true,children})=>{
  const[open,setOpen]=useState(defaultOpen);
  return(
    <div className="dm-section">
      <div className="dm-sh" onClick={()=>setOpen(p=>!p)}>
        <div className="dm-shl">
          {open?<ChevronDown size={15} style={{color:"var(--mu)"}}/>:<ChevronRight size={15} style={{color:"var(--mu)"}}/>}
          {Icon&&<Icon size={14} style={{color:"var(--c4)"}}/>}
          <span className="dm-stitle">{title}</span>
          {count!==undefined&&<span className="dm-scnt">{count}</span>}
        </div>
      </div>
      {open&&<div className="dm-sbody">{children}</div>}
    </div>
  );
};

const DoubtsManagement = () => {
  const [batchId,setBatchId]=useState(null);
  const [batches,setBatches]=useState([]);
  const [doubts,setDoubts]=useState([]);
  const [activeDoubt,setActiveDoubt]=useState(null);
  const [searchQuery,setSearchQuery]=useState("");
  const [dark,setDark]=useState(isDark);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  useEffect(()=>{
    const load=async()=>{
      try{const r=await videoService.getTrainerBatches();const l=r.data||[];setBatches(l);if(l.length>0)setBatchId(l[0].id);}
      catch(e){console.error(e);}
    };
    load();
  },[]);

  useEffect(()=>{
    if(!batchId)return;
    const load=async()=>{
      try{const r=await getTrainerStudents(batchId);setDoubts(r.data.map((email,i)=>({id:i+1,student:email.split("@")[0],studentEmail:email,batchId})));}
      catch(e){console.error(e);setDoubts([]);}
    };
    load();
  },[batchId]);

  const filtered=doubts.filter(d=>d.student.toLowerCase().includes(searchQuery.toLowerCase()));

  return(
    <div className={`dm${dark?" dm-dk":""}`}>
      <div className="dm-topbar">
        <div className="dm-topbar-l">
          <div className="dm-topbar-ico"><Inbox size={20}/></div>
          <div>
            <p className="dm-topbar-title">Doubts Management</p>
            <p className="dm-topbar-sub">Track & reply to student queries</p>
          </div>
        </div>
        <div className="dm-topbar-r">
          <span className="dm-cnt">{doubts.length} student{doubts.length!==1?"s":""}</span>
          <div className="dm-pulse"/>
        </div>
      </div>

      <div className="dm-body">
        <Section title="Batch Selection" icon={Filter} defaultOpen={true}>
          <div className="dm-sel-wrap">
            <select className="dm-sel" value={batchId||""} onChange={e=>setBatchId(Number(e.target.value))}>
              <option value="">— Select a Batch —</option>
              {batches.map(b=><option key={b.id} value={b.id}>{b.name||"Batch"} (ID: {b.id})</option>)}
            </select>
            <ChevronDown size={15}/>
          </div>
        </Section>

        <Section title="Search Students" icon={Search} defaultOpen={true}>
          <div className="dm-search">
            <Search size={14}/>
            <input placeholder="Search by student name..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          </div>
        </Section>

        <Section title="Students" icon={Users} count={filtered.length} defaultOpen={true}>
          {filtered.length===0?(
            <div className="dm-empty">
              <div className="dm-eico"><Sparkles size={32} style={{color:"var(--c4)"}}/></div>
              <p className="dm-etxt">{batchId?"No students found in this batch":"Please select a batch first"}</p>
            </div>
          ):(
            <div className="dm-list">
              {filtered.map((d,i)=>(
                <div key={d.id} className="dm-item">
                  <div className="dm-item-l">
                    <div className="dm-av">{d.student[0]}</div>
                    <div>
                      <p className="dm-iname">{d.student}</p>
                      <p className="dm-iemail">{d.studentEmail}</p>
                    </div>
                  </div>
                  <button className="dm-rbtn" onClick={()=>setActiveDoubt(d)}>
                    <MessageCircle size={13}/> Reply
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      {activeDoubt&&<DoubtsChatModal doubt={activeDoubt} onClose={()=>setActiveDoubt(null)}/>}
    </div>
  );
};
export default DoubtsManagement;