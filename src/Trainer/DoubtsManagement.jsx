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
.dm-body{
  width:100%;
  padding:24px;
}
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