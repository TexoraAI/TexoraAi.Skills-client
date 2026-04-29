import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Calendar, CheckCircle2, Clock, Eye,
  GripVertical, Layers, Pencil, PlayCircle, Radio,
  Save, StopCircle, Trash2, UserCheck, Video, X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Styles ─────────────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.al-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.al{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
.al-inner{max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
/* header */
.al-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.al-hdr-l{display:flex;align-items:center;gap:14px;}
.al-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
.al-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
.al-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.al-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(34,211,238,.08);color:var(--c1);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
.al-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.al-sub{font-size:13px;color:var(--mu);margin:0;}
.al-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
/* tabs */
.al-tabs{display:flex;gap:4px;padding:4px;background:var(--card);border:1px solid var(--bd);border-radius:14px;box-shadow:var(--sh);width:fit-content;}
.al-tab{display:flex;align-items:center;gap:6px;padding:9px 20px;border-radius:10px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap;}
.al-tab.on{background:var(--c1);color:#0a0a0a;}
.al-tab:not(.on){background:transparent;color:var(--mu);}
.al-tab:not(.on):hover{background:rgba(34,211,238,.06);color:var(--c1);}
/* stat cards */
.al-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;}
.al-stat{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:20px;box-shadow:var(--sh);display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;}
.al-stat::before{content:"";position:absolute;right:-10px;top:-10px;width:56px;height:56px;border-radius:50%;opacity:.08;background:var(--stat-color);}
.al-stat-ico{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-stat-val{font-size:22px;font-weight:800;line-height:1;margin-bottom:3px;color:var(--tx);}
.al-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
/* search bar */
.al-sbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.al-sw{position:relative;}
.al-sw svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.al-sw input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
.al-sw input::placeholder{color:var(--mu);}
.al-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.al-drag-hint{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);}
/* main layout */
.al-main{display:flex;gap:0;align-items:flex-start;}
/* table card */
.al-tcard{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;flex:1;min-width:0;}
.al-thead-row{display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid var(--bd);background:var(--bg);}
.al-thead-title{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;}
.al-thead-sub{font-size:11px;color:var(--mu);margin:0;}
table.al-t{width:100%;border-collapse:collapse;font-size:13px;}
.al-t thead th{padding:11px 12px;text-align:left;font-size:10px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.07em;background:var(--bg);border-bottom:1px solid var(--bd);}
.al-t thead th:first-child{padding-left:16px;width:36px;}
.al-t thead th:last-child{text-align:right;padding-right:20px;}
.al-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.al-t tbody tr:last-child{border-bottom:none;}
.al-t tbody tr:hover{background:rgba(34,211,238,.025);}
.al-t tbody tr.is-drag{opacity:.4;transform:scale(.98);}
.al-t tbody tr.is-over{background:rgba(34,211,238,.06);box-shadow:inset 0 2px 0 var(--c1);}
.al-t tbody tr.is-sel{background:rgba(34,211,238,.04);}
.al-t tbody td{padding:12px;vertical-align:middle;}
.al-t tbody td:first-child{padding-left:16px;}
.al-t tbody td:last-child{padding-right:20px;text-align:right;}
.al-grip{opacity:0;transition:opacity .15s;cursor:grab;padding:4px;border-radius:8px;color:var(--mu);}
.al-t tbody tr:hover .al-grip{opacity:1;}
.al-idx{font-size:12px;font-weight:700;color:var(--mu);}
.al-sess-cell{display:flex;align-items:center;gap:10px;}
.al-av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;}
.al-av-sm{width:28px;height:28px;border-radius:8px;font-size:11px;font-weight:800;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-sess-name{font-size:13px;font-weight:700;color:var(--tx);transition:color .15s;}
.al-t tbody tr:hover .al-sess-name{color:var(--c1);}
.al-trainer-cell{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mu);}
.al-batch-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:11px;font-weight:700;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.18);color:var(--c1);}
.al-status-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.al-actions{display:flex;justify-content:flex-end;gap:5px;opacity:0;transition:opacity .15s;}
.al-t tbody tr:hover .al-actions{opacity:1;}
.al-abtn{width:30px;height:30px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
/* empty */
.al-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;text-align:center;}
.al-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.15);display:flex;align-items:center;justify-content:center;color:var(--c1);}
.al-empty-t{font-size:13px;font-weight:700;color:var(--mu);margin:0;}
/* resize handle */
.al-resize{flex-shrink:0;width:12px;margin:0 2px;display:flex;align-items:center;justify-content:center;cursor:col-resize;}
.al-resize-pill{width:3px;height:48px;border-radius:4px;background:var(--bd);transition:background .2s;}
.al-resize:hover .al-resize-pill{background:var(--c1);}
/* side panel */
.al-panel{flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--shl);overflow:hidden;}
.al-panel-head{padding:18px 20px;border-bottom:1px solid var(--bd);}
.al-panel-head.view{background:rgba(34,211,238,.06);}
.al-panel-head.edit{background:rgba(167,139,250,.06);}
.al-panel-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.al-panel-head-l{display:flex;align-items:center;gap:10px;}
.al-panel-av{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:white;flex-shrink:0;}
.al-panel-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
.al-panel-sub{font-size:11px;color:var(--mu);margin:0;}
.al-panel-actions{display:flex;gap:5px;}
.al-panel-ico-btn{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.al-panel-ico-btn:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.al-panel-ico-btn.del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.al-mode-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid;}
.al-mode-view{background:rgba(34,211,238,.08);color:var(--c1);border-color:rgba(34,211,238,.20);}
.al-mode-edit{background:rgba(167,139,250,.08);color:var(--c4);border-color:rgba(167,139,250,.20);}
.al-panel-body{padding:18px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;}
.al-detail-row{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.al-detail-ico{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(34,211,238,.10);color:var(--c1);}
.al-detail-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:0 0 3px;}
.al-detail-val{font-size:13px;font-weight:700;color:var(--tx);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.al-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.al-inp{width:100%;padding:9px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.al-inp:focus{border-color:var(--c4);box-shadow:0 0 0 3px rgba(167,139,250,.12);}
.al-inp::placeholder{color:var(--mu);}
.al-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--bd);}
.al-foot-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:12px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;}
.al-foot-btn:hover{opacity:.87;transform:translateY(-1px);}
.al-foot-btn.cancel{background:var(--bg);border:1px solid var(--bd)!important;color:var(--mu);}
.al-foot-btn.cancel:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.al-foot-btn.save{background:var(--c4);color:#0a0a0a;}
.al-foot-btn.del-btn{background:rgba(248,113,113,.10);border:1px solid rgba(248,113,113,.20)!important;color:var(--cr);}
.al-foot-btn.del-btn:hover{background:rgba(248,113,113,.18);}
`;
if(!document.getElementById("al-st")){const t=document.createElement("style");t.id="al-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const STATUS_CFG={
  Active:   {bg:"rgba(52,211,153,.10)", color:"var(--c3)", bd:"rgba(52,211,153,.20)", dot:"#34d399"},
  Completed:{bg:"rgba(34,211,238,.10)", color:"var(--c1)", bd:"rgba(34,211,238,.20)", dot:"#22d3ee"},
  Scheduled:{bg:"rgba(251,146,60,.10)", color:"var(--c2)", bd:"rgba(251,146,60,.20)", dot:"#fb923c"},
  Ended:    {bg:"rgba(100,116,139,.10)",color:"var(--mu)", bd:"var(--bd)",            dot:"#64748b"},
};
const GRAD_BG=["linear-gradient(135deg,#6d28d9,#4338ca)","linear-gradient(135deg,#0891b2,#0e7490)","linear-gradient(135deg,#be123c,#9f1239)","linear-gradient(135deg,#b45309,#92400e)","linear-gradient(135deg,#047857,#065f46)","linear-gradient(135deg,#1d4ed8,#1e40af)"];
const gradBg=n=>GRAD_BG[(n?.charCodeAt(0)??0)%GRAD_BG.length];

function useDragList(items,setItems){
  const dI=useRef(null),oI=useRef(null);
  const[active,setActive]=useState(null),[over,setOver]=useState(null);
  const handlers=i=>({draggable:true,onDragStart:()=>{dI.current=i;setActive(i);},onDragOver:e=>{e.preventDefault();oI.current=i;setOver(i);},onDrop:()=>{const f=dI.current,t=oI.current;if(f!==null&&t!==null&&f!==t){const n=[...items];const[m]=n.splice(f,1);n.splice(t,0,m);setItems(n);}dI.current=null;oI.current=null;setActive(null);setOver(null);},onDragEnd:()=>{dI.current=null;oI.current=null;setActive(null);setOver(null);}});
  return{handlers,active,over};
}
function useResize(init=320,min=220,max=560){
  const[width,setWidth]=useState(init);const dragging=useRef(false);const startX=useRef(0);const startW=useRef(init);
  const onMouseDown=useCallback(e=>{dragging.current=true;startX.current=e.clientX;startW.current=width;document.body.style.cursor="col-resize";document.body.style.userSelect="none";},[width]);
  useEffect(()=>{const onMove=e=>{if(!dragging.current)return;const d=startX.current-e.clientX;setWidth(Math.min(max,Math.max(min,startW.current+d)));};const onUp=()=>{dragging.current=false;document.body.style.cursor="";document.body.style.userSelect="";};window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);};},[min,max]);
  return{width,onMouseDown};
}

const AdminLiveSessions=()=>{
  const navigate=useNavigate();
  const[dark,setDark]=useState(isDark);
  const[tab,setTab]=useState("live");
  const[sessions,setSessions]=useState([]);
  const[search,setSearch]=useState("");
  const[panelOpen,setPanelOpen]=useState(false);
  const[panelMode,setPanelMode]=useState("view");
  const[selectedSession,setSelectedSession]=useState(null);
  const[editForm,setEditForm]=useState({title:"",trainer:"",batch:"",status:"Active"});
  const[videos,setVideos]=useState([]);
  const[videoSearch,setVideoSearch]=useState("");
  const[videoPanelOpen,setVideoPanelOpen]=useState(false);
  const[videoPanelMode,setVideoPanelMode]=useState("view");
  const[selectedVideo,setSelectedVideo]=useState(null);
  const[videoEditForm,setVideoEditForm]=useState({title:"",trainer:"",batch:"",date:""});
  const{width:panelW,onMouseDown:startResize}=useResize(320);

  useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

  useEffect(()=>{const f=async()=>{try{const r=await fetch("/api/live-sessions");const t=await r.text();const d=t?JSON.parse(t):[];setSessions(Array.isArray(d)?d:[]);}catch(e){console.error(e);setSessions([]); }};f();},[]);
  useEffect(()=>{const f=async()=>{try{const r=await fetch("/api/recorded-videos");if(!r.ok){setVideos([]);return;}const t=await r.text();const d=t?JSON.parse(t):[];setVideos(Array.isArray(d)?d:[]);}catch(e){console.error(e);setVideos([]);}};f();},[]);

  const handleView=s=>{setSelectedSession(s);setPanelMode("view");setPanelOpen(true);};
  const handleEdit=s=>{setSelectedSession(s);setEditForm({title:s.title,trainer:s.trainer,batch:s.batch,status:s.status});setPanelMode("edit");setPanelOpen(true);};
  const handleSaveEdit=async()=>{try{const r=await fetch(`/api/live-sessions/${selectedSession.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editForm)});const u=await r.json();setSessions(p=>p.map(s=>s.id===selectedSession.id?{...s,...u}:s));setSelectedSession(p=>({...p,...u}));setPanelMode("view");}catch(e){console.error(e);}};
  const handleDelete=async id=>{if(!window.confirm("Delete this session?"))return;try{await fetch(`/api/live-sessions/${id}`,{method:"DELETE"});setSessions(p=>p.filter(s=>s.id!==id));if(selectedSession?.id===id)closePanel();}catch(e){console.error(e);}};
  const closePanel=()=>{setPanelOpen(false);setSelectedSession(null);setPanelMode("view");};
  const handleVideoView=v=>{setSelectedVideo(v);setVideoPanelMode("view");setVideoPanelOpen(true);};
  const handleVideoEdit=v=>{setSelectedVideo(v);setVideoEditForm({title:v.title,trainer:v.trainer,batch:v.batch,date:v.date});setVideoPanelMode("edit");setVideoPanelOpen(true);};
  const handleVideoSave=async()=>{try{const r=await fetch(`/api/recorded-videos/${selectedVideo.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(videoEditForm)});const u=await r.json();setVideos(p=>p.map(v=>v.id===selectedVideo.id?{...v,...u}:v));setSelectedVideo(p=>({...p,...u}));setVideoPanelMode("view");}catch(e){console.error(e);}};
  const handleVideoDelete=async id=>{if(!window.confirm("Delete this video?"))return;try{await fetch(`/api/recorded-videos/${id}`,{method:"DELETE"});setVideos(p=>p.filter(v=>v.id!==id));if(selectedVideo?.id===id)closeVideoPanel();}catch(e){console.error(e);}};
  const closeVideoPanel=()=>{setVideoPanelOpen(false);setSelectedVideo(null);setVideoPanelMode("view");};

  const filteredSessions=sessions.filter(s=>s.title.toLowerCase().includes(search.toLowerCase())||s.trainer.toLowerCase().includes(search.toLowerCase()));
  const filteredVideos=videos.filter(v=>v.title.toLowerCase().includes(videoSearch.toLowerCase())||v.trainer.toLowerCase().includes(videoSearch.toLowerCase()));
  const{handlers:dragS,active:dSA,over:dSO}=useDragList(sessions,setSessions);
  const{handlers:dragV,active:dVA,over:dVO}=useDragList(videos,setVideos);
  const anyPanelOpen=tab==="live"?panelOpen:videoPanelOpen;
  const counts={Active:sessions.filter(s=>s.status==="Active").length,Completed:sessions.filter(s=>s.status==="Completed").length,Scheduled:sessions.filter(s=>s.status==="Scheduled").length,Ended:sessions.filter(s=>s.status==="Ended").length};

  const statCards=[
    {label:"Active",   count:counts.Active,    icon:<PlayCircle size={18}/>,   accent:"var(--c3)", bg:"rgba(52,211,153,.10)"},
    {label:"Scheduled",count:counts.Scheduled, icon:<Clock size={18}/>,        accent:"var(--c2)", bg:"rgba(251,146,60,.10)"},
    {label:"Completed",count:counts.Completed, icon:<CheckCircle2 size={18}/>, accent:"var(--c1)", bg:"rgba(34,211,238,.10)"},
    {label:"Ended",    count:counts.Ended,     icon:<StopCircle size={18}/>,   accent:"var(--mu)", bg:"rgba(100,116,139,.10)"},
  ];

  const renderTable=(rows,isVideo)=>{
    const cols=isVideo?["#","Video","Trainer","Batch","Upload Date","Actions"]:["#","Session","Trainer","Batch","Status","Actions"];
    const dh=isVideo?dragV:dragS;const dA=isVideo?dVA:dSA;const dO=isVideo?dVO:dSO;
    const selId=isVideo?selectedVideo?.id:selectedSession?.id;const panOpen=isVideo?videoPanelOpen:panelOpen;
    return(
      <table className="al-t">
        <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length===0?(
            <tr><td colSpan={6}>
              <div className="al-empty">
                <div className="al-empty-ico">{isVideo?<Video size={24}/>:<Radio size={24}/>}</div>
                <p className="al-empty-t">No {isVideo?"videos":"sessions"} found</p>
              </div>
            </td></tr>
          ):rows.map((item,i)=>{
            const handlers=dh(i);const isDrag=dA===i;const isOver=dO===i&&dA!==i;const isSel=selId===item.id&&panOpen;
            const st=STATUS_CFG[item.status]||STATUS_CFG.Ended;
            return(
              <tr key={item.id}{...handlers} className={`${isDrag?"is-drag":""}${isOver?" is-over":""}${isSel?" is-sel":""}`}>
                <td><div className="al-grip"><GripVertical size={15}/></div></td>
                <td><span className="al-idx">{String(i+1).padStart(2,"0")}</span></td>
                <td>
                  <div className="al-sess-cell">
                    <div className="al-av" style={{background:gradBg(item.title)}}>{item.title.charAt(0)}</div>
                    <span className="al-sess-name">{item.title}</span>
                  </div>
                </td>
                <td>
                  <div className="al-trainer-cell">
                    <div className="al-av-sm" style={{background:gradBg(item.trainer)}}>{item.trainer.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    {item.trainer}
                  </div>
                </td>
                <td><span className="al-batch-tag"><Layers size={11}/>{item.batch}</span></td>
                {!isVideo?(
                  <td><span className="al-status-tag" style={{background:st.bg,color:st.color,borderColor:st.bd}}><span style={{width:6,height:6,borderRadius:"50%",background:st.dot,display:"inline-block",animation:item.status==="Active"?"al-blink 1.4s infinite":""}}/>  {item.status}</span></td>
                ):(
                  <td><div style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:"var(--mu)"}}><Calendar size={12}/>{item.date}</div></td>
                )}
                <td>
                  <div className="al-actions">
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"var(--c1)":"rgba(34,211,238,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"#0a0a0a":"var(--c1)"}} onClick={()=>isVideo?handleVideoView(item):handleView(item)}><Eye size={13}/></button>
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"var(--c4)":"rgba(167,139,250,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"#0a0a0a":"var(--c4)"}} onClick={()=>isVideo?handleVideoEdit(item):handleEdit(item)}><Pencil size={13}/></button>
                    <button className="al-abtn" style={{background:"rgba(248,113,113,.10)",color:"var(--cr)"}} onClick={()=>isVideo?handleVideoDelete(item.id):handleDelete(item.id)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderPanel=(sel,mode,setMode,form,setForm,onSave,onClose,onDel,isVideo)=>{
    if(!sel)return null;
    const isEdit=mode==="edit";
    const fields=isVideo?[{k:"title",l:"Video Title",ico:Video},{k:"trainer",l:"Trainer",ico:UserCheck},{k:"batch",l:"Batch",ico:Layers},{k:"date",l:"Upload Date",ico:Calendar,type:"date"}]:[{k:"title",l:"Session Title",ico:Radio},{k:"trainer",l:"Trainer",ico:UserCheck},{k:"batch",l:"Batch",ico:Layers}];
    return(
      <div className="al-panel" style={{width:panelW}}>
        <div className={`al-panel-head ${isEdit?"edit":"view"}`}>
          <div className="al-panel-head-row">
            <div className="al-panel-head-l">
              <div className="al-panel-av" style={{background:gradBg(sel.title)}}>{sel.title.charAt(0)}</div>
              <div>
                <p className="al-panel-title">{isEdit?`Edit ${isVideo?"Video":"Session"}`:sel.title}</p>
                <p className="al-panel-sub">{isEdit?"Update details":"Details"}</p>
              </div>
            </div>
            <div className="al-panel-actions">
              {!isEdit&&<button className="al-panel-ico-btn" onClick={()=>{setForm(isVideo?{title:sel.title,trainer:sel.trainer,batch:sel.batch,date:sel.date}:{title:sel.title,trainer:sel.trainer,batch:sel.batch,status:sel.status});setMode("edit");}}><Pencil size={13}/></button>}
              <button className="al-panel-ico-btn del" onClick={onClose}><X size={14}/></button>
            </div>
          </div>
          <span className={`al-mode-tag ${isEdit?"al-mode-edit":"al-mode-view"}`}>{isEdit?<Pencil size={11}/>:<Eye size={11}/>}{isEdit?"Edit Mode":"View Mode"}</span>
        </div>
        <div className="al-panel-body" style={{maxHeight:"calc(100vh - 360px)"}}>
          {!isEdit?(
            fields.map(({k,l,ico:Icon})=>(
              <div key={k} className="al-detail-row">
                <div className="al-detail-ico"><Icon size={15}/></div>
                <div style={{minWidth:0}}><p className="al-detail-lbl">{l}</p><p className="al-detail-val">{sel[k]||"—"}</p></div>
              </div>
            ))
          ):(
            <>
              {fields.map(({k,l,ico:Icon,type="text"})=>(
                <div key={k} className="al-field">
                  <label><Icon size={11}/>{l}</label>
                  <input className="al-inp" type={type} value={form[k]||""} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} placeholder={l}/>
                </div>
              ))}
              {!isVideo&&(
                <div className="al-field">
                  <label><CheckCircle2 size={11}/>Status</label>
                  <select className="al-inp" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                    {["Active","Scheduled","Completed","Ended"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
        <div className="al-panel-foot">
          {!isEdit?(
            <>
              <button className="al-foot-btn cancel" onClick={onClose}>Close</button>
              <button className="al-foot-btn del-btn" onClick={()=>onDel(sel.id)}><Trash2 size={13}/>Delete</button>
            </>
          ):(
            <>
              <button className="al-foot-btn cancel" onClick={()=>setMode("view")}>Cancel</button>
              <button className="al-foot-btn save" onClick={onSave}><Save size={13}/>Save Changes</button>
            </>
          )}
        </div>
      </div>
    );
  };

  return(
    <div className={`al${dark?" al-dk":""}`}>
      <style>{`@keyframes al-blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      <div className="al-inner">
        {/* header */}
        <div className="al-hdr">
          <div className="al-hdr-l">
            <button className="al-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
            <div className="al-hdr-ico">{tab==="live"?<Radio size={24}/>:<Video size={24}/>}</div>
            <div>
              <div className="al-bdg">{tab==="live"?<Radio size={10}/>:<Video size={10}/>} {tab==="live"?"Live Sessions":"Recorded Videos"}</div>
              <h1 className="al-h1">{tab==="live"?"Admin Live Sessions":"Admin Recorded Videos"}</h1>
              <p className="al-sub">{tab==="live"?"Monitor and manage all live sessions conducted by trainers":"Monitor and manage all recorded sessions uploaded by trainers"}</p>
            </div>
          </div>
          <div className="al-chip">
            {tab==="live"?<Radio size={14} style={{color:"var(--cr)"}}/>:<Video size={14} style={{color:"var(--c4)"}}/>}
            <span style={{fontWeight:800,color:tab==="live"?"var(--cr)":"var(--c4)"}}>{tab==="live"?sessions.length:videos.length}</span>
            <span style={{color:"var(--mu)",fontWeight:500}}>{tab==="live"?"Sessions":"Videos"}</span>
          </div>
        </div>

        {/* tabs */}
        <div className="al-tabs">
          <button className={`al-tab${tab==="live"?" on":""}`} onClick={()=>setTab("live")}><Radio size={13}/> Admin Live Sessions</button>
          <button className={`al-tab${tab==="recorded"?" on":""}`} onClick={()=>setTab("recorded")}><Video size={13}/> Admin Recorded Videos</button>
        </div>

        {/* stat cards (live only) */}
        {tab==="live"&&(
          <div className="al-stats">
            {statCards.map(s=>(
              <div key={s.label} className="al-stat">
                <div className="al-stat-ico" style={{background:s.bg,color:s.accent}}>{s.icon}</div>
                <div><div className="al-stat-val" style={{color:s.accent}}>{s.count}</div><div className="al-stat-lbl">{s.label}</div></div>
              </div>
            ))}
          </div>
        )}

        {/* search */}
        <div className="al-sbar">
          <div className="al-sw">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder={tab==="live"?"Search sessions or trainers…":"Search videos or trainers…"} value={tab==="live"?search:videoSearch} onChange={e=>tab==="live"?setSearch(e.target.value):setVideoSearch(e.target.value)}/>
          </div>
          <div className="al-drag-hint"><GripVertical size={13}/> Drag rows to reorder</div>
        </div>

        {/* main */}
        <div className="al-main">
          <div className="al-tcard">
            <div className="al-thead-row">
              <div>
                <p className="al-thead-title">{tab==="live"?"All Live Sessions":"All Recorded Videos"}</p>
                <p className="al-thead-sub">{(tab==="live"?filteredSessions:filteredVideos).length} record{(tab==="live"?filteredSessions:filteredVideos).length!==1&&"s"} found</p>
              </div>
            </div>
            {tab==="live"?renderTable(filteredSessions,false):renderTable(filteredVideos,true)}
          </div>

          {anyPanelOpen&&(
            <div className="al-resize" onMouseDown={startResize}><div className="al-resize-pill"/></div>
          )}

          {anyPanelOpen&&(
            <div style={{flexShrink:0}}>
              {tab==="live"&&renderPanel(selectedSession,panelMode,setPanelMode,editForm,setEditForm,handleSaveEdit,closePanel,handleDelete,false)}
              {tab==="recorded"&&renderPanel(selectedVideo,videoPanelMode,setVideoPanelMode,videoEditForm,setVideoEditForm,handleVideoSave,closeVideoPanel,handleVideoDelete,true)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AdminLiveSessions;