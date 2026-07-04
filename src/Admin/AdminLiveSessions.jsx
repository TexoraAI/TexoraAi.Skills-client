import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Calendar, CheckCircle2, Clock, Eye,
  GripVertical, Layers, Pencil, PlayCircle, Radio,
  Save, StopCircle, Trash2, UserCheck, Video, X,
} from "lucide-react";

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
}
.al-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#a89fc0;--bd:rgba(255,255,255,0.07);
  --sh:0 4px 24px rgba(0,0,0,.45);--shl:0 10px 40px rgba(0,0,0,.6);}

*{box-sizing:border-box;}
.al{font-family:'Plus Jakarta Sans','Poppins',sans-serif;min-height:100vh;
  background:linear-gradient(180deg,#f6f2fc 0%,#fbf6fb 100%);color:var(--tx);padding:24px;}
.al-dk.al{background:var(--bg);}
.al-inner{max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:18px;}

/* header — matches AllCourses gradient banner */
.al-hdr{position:relative;overflow:hidden;background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 55%,#db2777 100%);border:1px solid rgba(124,58,237,.25);border-radius:var(--r);padding:14px 18px;box-shadow:0 12px 32px rgba(124,58,237,.28);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.al-hdr::after{content:'';position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.10);pointer-events:none;}
.al-hdr::before{content:'';position:absolute;bottom:-70px;left:12%;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none;}
.al-dk .al-hdr{background:linear-gradient(135deg,#3730a3 0%,#6d28d9 55%,#be185d 100%);box-shadow:0 12px 32px rgba(190,24,93,.35);}
.al-hdr-l{display:flex;align-items:center;gap:12px;min-width:0;position:relative;z-index:1;flex-wrap:wrap;}
.al-back{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.16);color:#fff;font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s,background .2s;flex-shrink:0;backdrop-filter:blur(6px);}
.al-back:hover{border-color:rgba(255,255,255,.6);background:rgba(255,255,255,.28);color:#fff;}
.al-hdr-ico{width:38px;height:38px;border-radius:11px;background:rgba(255,255,255,.20);border:1px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;backdrop-filter:blur(6px);}
.al-bdg{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:50px;background:rgba(255,255,255,.22);color:#fff;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
.al-h1{font-size:17px;font-weight:800;color:#fff;margin:0 0 1px;letter-spacing:-.01em;word-break:break-word;}
.al-sub{font-size:11.5px;color:rgba(255,255,255,.9);margin:0;word-break:break-word;}
.al-chip{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.95);border:1px solid rgba(255,255,255,.5);box-shadow:0 4px 14px rgba(30,21,51,.12);font-size:11.5px;font-weight:700;white-space:nowrap;position:relative;z-index:1;}
.al-dk .al-chip{background:rgba(17,17,17,.85);border-color:rgba(255,255,255,.15);}

/* tabs */
.al-tabs{display:flex;gap:4px;padding:4px;background:var(--card);border:1px solid var(--bd);border-radius:13px;box-shadow:var(--sh);width:fit-content;max-width:100%;overflow-x:auto;}
.al-tab{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;border:none;font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap;}
.al-tab.on{background:linear-gradient(135deg,var(--c1),var(--c1b));color:#fff;box-shadow:0 6px 16px rgba(79,70,229,.28);}
.al-tab:not(.on){background:transparent;color:var(--mu);}
.al-tab:not(.on):hover{background:rgba(129,140,248,.08);color:var(--c1b);}

/* stat cards — matches AllCourses sizing */
.al-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;}
.al-stat{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px 16px;box-shadow:var(--sh);display:flex;align-items:center;gap:12px;position:relative;overflow:hidden;min-height:78px;}
.al-stat::before{content:"";position:absolute;right:-16px;top:-16px;width:64px;height:64px;border-radius:50%;opacity:.10;background:var(--stat-color);}
.al-stat-ico{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-stat-val{font-size:19px;font-weight:800;line-height:1;margin-bottom:3px;color:var(--tx);}
.al-stat-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);}

/* search bar — matches AllCourses action bar */
.al-sbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:10px 12px;box-shadow:var(--sh);}
.al-sw{position:relative;flex:1 1 260px;min-width:0;max-width:280px;}
.al-sw svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
.al-sw input{width:100%;box-sizing:border-box;padding:8px 12px 8px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
.al-sw input::placeholder{color:var(--mu);}
.al-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(129,140,248,.14);}
.al-drag-hint{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);white-space:nowrap;}

/* main layout */
.al-main{display:flex;gap:0;align-items:flex-start;}

/* table card */
.al-tcard{background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--sh);overflow:hidden;flex:1;min-width:0;}
.al-thead-row{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.al-thead-title{font-size:12px;font-weight:700;color:var(--tx);margin:0 0 1px;}
.al-thead-sub{font-size:10.5px;color:var(--mu);margin:0;}
.al-tscroll{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
table.al-t{width:100%;min-width:640px;border-collapse:collapse;font-size:12px;}
.al-t thead th{padding:9px 12px;text-align:left;font-size:9.5px;font-weight:700;color:var(--mu);text-transform:uppercase;letter-spacing:.06em;background:var(--bg);border-bottom:1px solid var(--bd);white-space:nowrap;}
.al-t thead th:first-child{padding-left:16px;width:32px;}
.al-t thead th:last-child{text-align:right;padding-right:16px;}
.al-t tbody tr{border-bottom:1px solid var(--bd);transition:background .15s;}
.al-t tbody tr:last-child{border-bottom:none;}
.al-t tbody tr:hover{background:rgba(129,140,248,.05);}
.al-t tbody tr.is-drag{opacity:.4;transform:scale(.98);}
.al-t tbody tr.is-over{background:rgba(129,140,248,.08);box-shadow:inset 0 2px 0 var(--c1);}
.al-t tbody tr.is-sel{background:rgba(129,140,248,.05);}
.al-t tbody td{padding:10px 12px;vertical-align:middle;}
.al-t tbody td:first-child{padding-left:16px;}
.al-t tbody td:last-child{padding-right:16px;text-align:right;}
.al-grip{opacity:0;transition:opacity .15s;cursor:grab;padding:4px;border-radius:8px;color:var(--mu);}
.al-t tbody tr:hover .al-grip{opacity:1;}
.al-idx{font-size:11px;font-weight:700;color:var(--mu);}
.al-sess-cell{display:flex;align-items:center;gap:10px;}
.al-av{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0;}
.al-av-sm{width:26px;height:26px;border-radius:8px;font-size:10.5px;font-weight:800;color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.al-sess-name{font-size:12px;font-weight:700;color:var(--tx);transition:color .15s;white-space:nowrap;}
.al-t tbody tr:hover .al-sess-name{color:var(--c1b);}
.al-trainer-cell{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--mu);white-space:nowrap;}
.al-batch-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.20);color:var(--c1b);white-space:nowrap;}
.al-status-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;white-space:nowrap;}
.al-actions{display:flex;justify-content:flex-end;gap:5px;opacity:0;transition:opacity .15s;}
.al-t tbody tr:hover .al-actions{opacity:1;}
.al-abtn{width:28px;height:28px;border-radius:9px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}

/* empty */
.al-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px 18px;min-height:180px;gap:8px;text-align:center;}
.al-empty-ico{width:46px;height:46px;border-radius:14px;background:rgba(129,140,248,.10);border:1px solid rgba(129,140,248,.18);display:flex;align-items:center;justify-content:center;color:var(--c1b);}
.al-empty-t{font-size:12px;font-weight:700;color:var(--mu);margin:0;}

/* resize handle */
.al-resize{flex-shrink:0;width:12px;margin:0 2px;display:flex;align-items:center;justify-content:center;cursor:col-resize;}
.al-resize-pill{width:3px;height:44px;border-radius:4px;background:var(--bd);transition:background .2s;}
.al-resize:hover .al-resize-pill{background:var(--c1);}

/* side panel — matches AllCourses drawer styling */
.al-panel{flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:16px;box-shadow:var(--shl);overflow:hidden;}
.al-panel-head{padding:16px 18px;border-bottom:1px solid var(--bd);}
.al-panel-head.view{background:linear-gradient(180deg,rgba(129,140,248,.08),rgba(129,140,248,.02));}
.al-panel-head.edit{background:linear-gradient(180deg,rgba(244,114,182,.08),rgba(244,114,182,.02));}
.al-panel-head-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;}
.al-panel-head-l{display:flex;align-items:center;gap:10px;min-width:0;}
.al-panel-av{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0;box-shadow:0 6px 16px rgba(79,70,229,.28);}
.al-panel-title{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.al-panel-sub{font-size:10.5px;color:var(--mu);margin:0;}
.al-panel-actions{display:flex;gap:5px;flex-shrink:0;}
.al-panel-ico-btn{width:28px;height:28px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0;}
.al-panel-ico-btn:hover{border-color:rgba(129,140,248,.30);color:var(--c1b);}
.al-panel-ico-btn.del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
.al-mode-tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:8px;font-size:10.5px;font-weight:700;border:1px solid;}
.al-mode-view{background:rgba(129,140,248,.08);color:var(--c1b);border-color:rgba(129,140,248,.20);}
.al-mode-edit{background:rgba(244,114,182,.08);color:var(--c4b);border-color:rgba(244,114,182,.20);}
.al-panel-body{padding:16px 18px;overflow-y:auto;display:flex;flex-direction:column;gap:9px;}
.al-detail-row{display:flex;align-items:flex-start;gap:10px;padding:11px 13px;border-radius:12px;background:var(--bg);border:1px solid var(--bd);}
.al-detail-ico{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:rgba(129,140,248,.10);color:var(--c1b);}
.al-detail-lbl{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--mu);margin:0 0 3px;}
.al-detail-val{font-size:12.5px;font-weight:700;color:var(--tx);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.al-field label{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);margin-bottom:6px;}
.al-inp{width:100%;padding:9px 12px;border-radius:11px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx);font-family:inherit;font-size:12.5px;outline:none;box-sizing:border-box;transition:border-color .18s,box-shadow .18s,background .18s;}
.al-inp:focus{border-color:var(--c1);box-shadow:0 0 0 4px rgba(129,140,248,.12);background:var(--card);}
.al-inp::placeholder{color:var(--mu);}
.al-panel-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;border-top:1px solid var(--bd);gap:8px;}
.al-foot-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 15px;border-radius:11px;border:none;font-family:inherit;font-size:11.5px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s,box-shadow .2s;white-space:nowrap;}
.al-foot-btn:hover{opacity:.92;transform:translateY(-1px);}
.al-foot-btn.cancel{background:var(--bg);border:1.5px solid var(--bd)!important;color:var(--mu);}
.al-foot-btn.cancel:hover{border-color:rgba(129,140,248,.30)!important;color:var(--c1b);}
.al-foot-btn.save{background:linear-gradient(135deg,var(--c4),var(--c4b));color:#fff;box-shadow:0 6px 18px rgba(219,39,119,.28);}
.al-foot-btn.del-btn{background:rgba(248,113,113,.10);border:1px solid rgba(248,113,113,.20)!important;color:var(--cr);}
.al-foot-btn.del-btn:hover{background:rgba(248,113,113,.18);}

/* ══════════ RESPONSIVE — laptop / tablet / iPad / iPad mini / iPhone / phone ══════════ */
@media (max-width:1200px){
  .al-stats{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));}
}
@media (max-width:1024px){
  .al{padding:20px;}
  .al-hdr{padding:14px 16px;}
  .al-main{flex-direction:column;}
  .al-resize{display:none;}
  .al-panel{width:100%!important;border-radius:16px;}
}
@media (max-width:834px){
  .al-hdr{flex-direction:column;align-items:flex-start;padding:12px 14px;gap:10px;}
  .al-hdr-l{flex-wrap:wrap;}
  .al-stats{grid-template-columns:repeat(2,1fr);gap:8px;}
  .al-sbar{flex-direction:column;align-items:stretch;gap:8px;}
  .al-sw{max-width:none;}
  .al-tabs{width:100%;}
  .al-tab{flex:1;justify-content:center;}
}
@media (max-width:768px){
  .al{padding:14px;}
  .al-inner{gap:12px;}
  .al-hdr{padding:12px 14px;border-radius:14px;}
  .al-hdr-ico{width:34px;height:34px;border-radius:10px;}
  .al-h1{font-size:15px;}
  .al-sub{display:none;}
  .al-stats{grid-template-columns:repeat(2,1fr);gap:8px;}
  .al-stat{padding:10px 10px;min-height:66px;border-radius:12px;}
  .al-stat-ico{width:26px;height:26px;}
  .al-stat-val{font-size:16px;}
  .al-stat-lbl{font-size:9px;}
  .al-tcard{border-radius:16px;}
  .al-thead-row{padding:9px 12px;}
  .al-t th:nth-child(1),.al-t td:nth-child(1){display:none;}
}
@media (max-width:640px){
  .al{padding:10px;}
  .al-inner{gap:8px;}
  .al-hdr{padding:10px 12px;border-radius:14px;gap:8px;}
  .al-hdr-l{gap:8px;}
  .al-hdr-ico{width:32px;height:32px;border-radius:9px;}
  .al-h1{font-size:14px;}
  .al-bdg{font-size:8.5px;padding:2px 7px;margin-bottom:3px;}
  .al-back{padding:6px 9px;font-size:10px;}
  .al-stats{grid-template-columns:repeat(2,1fr);gap:6px;}
  .al-stat{padding:8px 8px;min-height:56px;border-radius:11px;}
  .al-stat-ico{width:22px;height:22px;border-radius:7px;}
  .al-stat-val{font-size:15px;}
  .al-stat-lbl{font-size:8.5px;}
  .al-tcard{border-radius:14px;}
  .al-thead-row{padding:8px 10px;}
  .al-t th:nth-child(1),.al-t td:nth-child(1),
  .al-t th:nth-child(4),.al-t td:nth-child(4){display:none;}
  .al-drag-hint{display:none;}
  .al-panel-foot{flex-direction:column-reverse;gap:7px;}
  .al-panel-foot .al-foot-btn{width:100%;justify-content:center;}
}
@media (max-width:480px){
  .al-stats{grid-template-columns:repeat(2,1fr);gap:5px;}
  .al-stat{padding:7px 7px;min-height:50px;border-radius:10px;}
  .al-stat-val{font-size:13px;}
  .al-stat-lbl{font-size:7.5px;}
  .al-empty{padding:18px 12px;min-height:150px;}
  .al-empty-ico{width:40px;height:40px;}
}
@media (max-width:400px){
  .al-hdr{padding:9px 10px;}
  .al-hdr-ico{width:28px;height:28px;}
  .al-h1{font-size:12.5px;}
  .al-back span{display:none;}
  .al-tab{font-size:10px;padding:7px 10px;}
}
`;
if(!document.getElementById("al-st")){const t=document.createElement("style");t.id="al-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const STATUS_CFG={
  Active:   {bg:"rgba(52,211,153,.10)", color:"var(--c3b)", bd:"rgba(52,211,153,.22)", dot:"#34d399"},
  Completed:{bg:"rgba(129,140,248,.10)", color:"var(--c1b)", bd:"rgba(129,140,248,.20)", dot:"#818cf8"},
  Scheduled:{bg:"rgba(251,191,36,.10)", color:"var(--c2b)", bd:"rgba(251,191,36,.20)", dot:"#fbbf24"},
  Ended:    {bg:"rgba(107,97,128,.10)",color:"var(--mu)", bd:"var(--bd)",            dot:"#6b6180"},
};
const GRAD_BG=["linear-gradient(135deg,#6d28d9,#4338ca)","linear-gradient(135deg,#db2777,#9d174d)","linear-gradient(135deg,#d97706,#92400e)","linear-gradient(135deg,#059669,#065f46)","linear-gradient(135deg,#2563eb,#1e40af)","linear-gradient(135deg,#7c3aed,#5b21b6)"];
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
    {label:"Active",   count:counts.Active,    icon:<PlayCircle size={16}/>,   accent:"var(--c3b)", bg:"rgba(52,211,153,.10)"},
    {label:"Scheduled",count:counts.Scheduled, icon:<Clock size={16}/>,        accent:"var(--c2b)", bg:"rgba(251,191,36,.10)"},
    {label:"Completed",count:counts.Completed, icon:<CheckCircle2 size={16}/>, accent:"var(--c1b)", bg:"rgba(129,140,248,.10)"},
    {label:"Ended",    count:counts.Ended,     icon:<StopCircle size={16}/>,   accent:"var(--mu)", bg:"rgba(107,97,128,.10)"},
  ];

  const renderTable=(rows,isVideo)=>{
    const cols=isVideo?["#","Video","Trainer","Batch","Upload Date","Actions"]:["#","Session","Trainer","Batch","Status","Actions"];
    const dh=isVideo?dragV:dragS;const dA=isVideo?dVA:dSA;const dO=isVideo?dVO:dSO;
    const selId=isVideo?selectedVideo?.id:selectedSession?.id;const panOpen=isVideo?videoPanelOpen:panelOpen;
    return(
      <div className="al-tscroll">
      <table className="al-t">
        <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length===0?(
            <tr><td colSpan={6}>
              <div className="al-empty">
                <div className="al-empty-ico">{isVideo?<Video size={22}/>:<Radio size={22}/>}</div>
                <p className="al-empty-t">No {isVideo?"videos":"sessions"} found</p>
              </div>
            </td></tr>
          ):rows.map((item,i)=>{
            const handlers=dh(i);const isDrag=dA===i;const isOver=dO===i&&dA!==i;const isSel=selId===item.id&&panOpen;
            const st=STATUS_CFG[item.status]||STATUS_CFG.Ended;
            return(
              <tr key={item.id}{...handlers} className={`${isDrag?"is-drag":""}${isOver?" is-over":""}${isSel?" is-sel":""}`}>
                <td><div className="al-grip"><GripVertical size={14}/></div></td>
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
                  <td><div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--mu)"}}><Calendar size={12}/>{item.date}</div></td>
                )}
                <td>
                  <div className="al-actions">
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"var(--c1)":"rgba(129,140,248,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="view"?"#fff":"var(--c1b)"}} onClick={()=>isVideo?handleVideoView(item):handleView(item)}><Eye size={13}/></button>
                    <button className="al-abtn" style={{background:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"var(--c4)":"rgba(244,114,182,.10)",color:isSel&&(isVideo?videoPanelMode:panelMode)==="edit"?"#fff":"var(--c4b)"}} onClick={()=>isVideo?handleVideoEdit(item):handleEdit(item)}><Pencil size={13}/></button>
                    <button className="al-abtn" style={{background:"rgba(248,113,113,.10)",color:"var(--cr)"}} onClick={()=>isVideo?handleVideoDelete(item.id):handleDelete(item.id)}><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
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
              <div style={{minWidth:0}}>
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
                <div className="al-detail-ico"><Icon size={14}/></div>
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
            <div className="al-hdr-ico">{tab==="live"?<Radio size={18}/>:<Video size={18}/>}</div>
            <div>
              <div className="al-bdg">{tab==="live"?<Radio size={9}/>:<Video size={9}/>} {tab==="live"?"Live Sessions":"Recorded Videos"}</div>
              <h1 className="al-h1">{tab==="live"?"Admin Live Sessions":"Admin Recorded Videos"}</h1>
              <p className="al-sub">{tab==="live"?"Monitor and manage all live sessions conducted by trainers":"Monitor and manage all recorded sessions uploaded by trainers"}</p>
            </div>
          </div>
          <div className="al-chip">
            {tab==="live"?<Radio size={13} style={{color:"var(--c4b)"}}/>:<Video size={13} style={{color:"var(--c1b)"}}/>}
            <span style={{fontWeight:800,color:tab==="live"?"var(--c4b)":"var(--c1b)"}}>{tab==="live"?sessions.length:videos.length}</span>
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder={tab==="live"?"Search sessions or trainers…":"Search videos or trainers…"} value={tab==="live"?search:videoSearch} onChange={e=>tab==="live"?setSearch(e.target.value):setVideoSearch(e.target.value)}/>
          </div>
          <div className="al-drag-hint"><GripVertical size={12}/> Drag rows to reorder</div>
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