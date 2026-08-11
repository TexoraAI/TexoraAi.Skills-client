
// // CertificatesAdmin.jsx
// import axios from "axios";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Award, BookOpen, ChevronRight, FileText, Palette, Plus, Search, Upload, X, Zap } from "lucide-react";

// const STYLES_CERT = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;--c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;--sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
// .ce-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);--sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
// .ce{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);padding:24px;box-sizing:border-box;}
// .ce-inner{max-width:1300px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
// .ce-hdr{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);padding:24px 28px;box-shadow:var(--sh);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
// .ce-hdr-l{display:flex;align-items:center;gap:14px;}
// .ce-back{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s;flex-shrink:0;}
// .ce-back:hover{border-color:rgba(34,211,238,.35);color:var(--c1);}
// .ce-hdr-ico{width:52px;height:52px;border-radius:14px;background:rgba(251,146,60,.10);border:1px solid rgba(251,146,60,.18);display:flex;align-items:center;justify-content:center;color:var(--c2);flex-shrink:0;}
// .ce-bdg{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:50px;border:1px solid var(--bd);background:rgba(251,146,60,.08);color:var(--c2);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;}
// .ce-h1{font-size:22px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ce-sub{font-size:13px;color:var(--mu);margin:0;}
// .ce-chip{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:var(--bg);border:1px solid var(--bd);font-size:13px;font-weight:700;white-space:nowrap;box-shadow:var(--sh);}
// .ce-abar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
// .ce-sw{position:relative;}
// .ce-sw svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
// .ce-sw input{padding:10px 14px 10px 38px;border-radius:13px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;width:260px;transition:border-color .2s,box-shadow .2s;}
// .ce-sw input::placeholder{color:var(--mu);}
// .ce-sw input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ce-issue-btn{display:inline-flex;align-items:center;gap:6px;padding:10px 20px;border-radius:13px;border:none;background:var(--c2);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ce-issue-btn:hover{opacity:.87;transform:translateY(-1px);}
// .ce-main{display:flex;gap:18px;align-items:flex-start;}
// .ce-grid{display:grid;gap:16px;transition:all .3s;}
// .ce-tpl{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;transition:all .2s;}
// .ce-tpl:hover{box-shadow:var(--shl);border-color:rgba(251,146,60,.25);}
// .ce-tpl-preview{height:110px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
// .ce-tpl-preview::before{content:"";position:absolute;right:-16px;top:-16px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.12);}
// .ce-tpl-type{position:absolute;top:10px;right:10px;padding:3px 9px;border-radius:7px;background:rgba(0,0,0,.30);font-size:10px;font-weight:800;color:rgba(255,255,255,.9);backdrop-filter:blur(4px);}
// .ce-tpl-body{padding:16px;}
// .ce-tpl-name{font-size:13px;font-weight:800;color:var(--tx);margin:0 0 10px;transition:color .15s;}
// .ce-tpl:hover .ce-tpl-name{color:var(--c2);}
// .ce-tpl-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
// .ce-tpl-theme{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--mu);font-family:monospace;}
// .ce-tpl-font{padding:3px 8px;border-radius:6px;background:var(--bg);border:1px solid var(--bd);font-size:11px;color:var(--mu);}
// .ce-tpl-courses{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mu);margin-bottom:12px;}
// .ce-tpl-divider{height:1px;background:var(--bd);margin-bottom:12px;}
// .ce-now-btn{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:12px;border:none;background:var(--c2);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ce-now-btn:hover{opacity:.87;transform:translateY(-1px);}
// .ce-empty-grid{display:flex;flex-direction:column;align-items:center;padding:60px 20px;gap:10px;}
// .ce-empty-ico{width:52px;height:52px;border-radius:15px;background:rgba(251,146,60,.08);border:1px solid rgba(251,146,60,.15);display:flex;align-items:center;justify-content:center;color:var(--c2);}
// /* panel */
// .ce-panel{flex-shrink:0;background:var(--card);border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--shl);overflow:hidden;width:320px;transition:all .3s;}
// .ce-ph{padding:18px 20px;background:rgba(34,211,238,.06);border-bottom:1px solid var(--bd);}
// .ce-ph-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
// .ce-ph-l{display:flex;align-items:center;gap:10px;}
// .ce-ph-ico{width:36px;height:36px;border-radius:10px;background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.20);display:flex;align-items:center;justify-content:center;color:var(--c1);}
// .ce-ph-title{font-size:14px;font-weight:800;color:var(--tx);margin:0 0 2px;}
// .ce-ph-sub{font-size:11px;color:var(--mu);margin:0;}
// .ce-xbtn{width:30px;height:30px;border-radius:9px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
// .ce-xbtn:hover{border-color:rgba(248,113,113,.30);color:var(--cr);}
// .ce-steps{display:flex;gap:4px;}
// .ce-step{display:flex;align-items:center;gap:5px;padding:6px 10px;border-radius:9px;font-family:'Poppins',sans-serif;font-size:11px;font-weight:600;}
// .ce-step.on{background:rgba(34,211,238,.12);border:1px solid rgba(34,211,238,.22);color:var(--c1);}
// .ce-step.off{color:var(--mu);}
// .ce-step-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;}
// .ce-step.on .ce-step-num{background:var(--c1);color:#0a0a0a;}
// .ce-step.off .ce-step-num{background:var(--bd);color:var(--mu);}
// .ce-pb{padding:18px 20px;display:flex;flex-direction:column;gap:13px;overflow-y:auto;max-height:calc(100vh - 320px);}
// .ce-mode-toggle{display:flex;gap:4px;background:var(--bg);border-radius:12px;padding:4px;}
// .ce-mtab{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;border-radius:8px;border:none;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
// .ce-mtab.on{background:var(--card);color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.08);}
// .ce-mtab.off{background:transparent;color:var(--mu);}
// .ce-field label{display:block;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);margin-bottom:5px;}
// .ce-inp{width:100%;padding:9px 12px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
// .ce-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .ce-inp::placeholder{color:var(--mu);}
// .ce-type-btn{width:100%;display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:12px;border:1px solid var(--bd);background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:left;margin-bottom:6px;}
// .ce-type-btn.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.06);color:var(--c1);}
// .ce-type-btn:not(.on){color:var(--mu);}
// .ce-type-btn:not(.on):hover{border-color:rgba(34,211,238,.25);}
// .ce-type-ico{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
// .ce-pf{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--bd);}
// .ce-cancel{padding:9px 16px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;}
// .ce-cancel:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
// .ce-submit{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:11px;border:none;background:var(--c1);color:#0a0a0a;font-family:'Poppins',sans-serif;font-size:12px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
// .ce-submit:hover{opacity:.87;transform:translateY(-1px);}
// .ce-submit:disabled{opacity:.5;cursor:not-allowed;transform:none;}
// `;
// if(!document.getElementById("ce-st")){const t=document.createElement("style");t.id="ce-st";t.textContent=STYLES_CERT;document.head.appendChild(t);}
// const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;
// const API_GATEWAY="http://localhost:9000";
// const templates=[
//   {id:1,name:"Completion Certificate",grad:"linear-gradient(135deg,#6d28d9,#4338ca)",font:"Serif",theme:"#7C3AED",linkedCourses:4,type:"COMPLETION"},
//   {id:2,name:"Excellence Certificate",grad:"linear-gradient(135deg,#1e293b,#0f172a)",font:"Sans",theme:"#0F172A",linkedCourses:2,type:"EXCELLENCE"},
//   {id:3,name:"Internship Certificate",grad:"linear-gradient(135deg,#b45309,#92400e)",font:"Serif",theme:"#F59E0B",linkedCourses:3,type:"INTERNSHIP"},
// ];

// const CertificatesAdmin=()=>{
//   const navigate=useNavigate();
//   const[dark,setDark]=useState(isDark);
//   const[search,setSearch]=useState("");
//   const[panelOpen,setPanelOpen]=useState(false);
//   const[mode,setMode]=useState("GENERATE");
//   const[studentEmail,setStudentEmail]=useState("");
//   const[studentName,setStudentName]=useState("");
//   const[courseName,setCourseName]=useState("");
//   const[certificateType,setCertificateType]=useState("COMPLETION");
//   const[file,setFile]=useState(null);
//   const[loading,setLoading]=useState(false);

//   React.useEffect(()=>{const o=new MutationObserver(()=>setDark(isDark()));o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});o.observe(document.body,{attributes:true,attributeFilter:["class"]});return()=>o.disconnect();},[]);

//   const filtered=templates.filter(t=>t.name.toLowerCase().includes(search.toLowerCase()));
//   const resetForm=()=>{setStudentEmail("");setStudentName("");setCourseName("");setFile(null);setMode("GENERATE");setCertificateType("COMPLETION");};
//   const openPanel=(type="COMPLETION")=>{setCertificateType(type);setPanelOpen(true);};

//   const handleSubmit=async()=>{
//     if(!studentEmail||!courseName){alert("Student email & course name required");return;}
//     try{
//       setLoading(true);
//       if(mode==="GENERATE"){
//         if(!studentName){alert("Student name required");return;}
//         await axios.post(`${API_GATEWAY}/api/files/certificates/generate`,null,{params:{email:studentEmail,studentName,courseName,type:certificateType},headers:{Authorization:`Bearer ${localStorage.getItem("lms_token")}`}});
//       }else{
//         if(!file){alert("Please select certificate file");return;}
//         const fd=new FormData();fd.append("file",file);fd.append("email",studentEmail);fd.append("courseName",courseName);
//         await axios.post(`${API_GATEWAY}/api/files/certificates/upload`,fd,{headers:{Authorization:`Bearer ${localStorage.getItem("lms_token")}`}});
//       }
//       alert("Certificate processed successfully");setPanelOpen(false);resetForm();
//     }catch{alert("Operation failed");}
//     finally{setLoading(false);}
//   };

//   return(
//     <div className={`ce${dark?" ce-dk":""}`}>
//       <div className="ce-inner">
//         <div className="ce-hdr">
//           <div className="ce-hdr-l">
//             <button className="ce-back" onClick={()=>navigate(-1)}><ArrowLeft size={14}/> Back</button>
//             <div className="ce-hdr-ico"><Award size={24}/></div>
//             <div>
//               <div className="ce-bdg"><Award size={10}/> Certificates</div>
//               <h1 className="ce-h1">Certificates</h1>
//               <p className="ce-sub">Issue or upload certificates for students</p>
//             </div>
//           </div>
//           <div className="ce-chip"><Award size={14} style={{color:"var(--c2)"}}/><span style={{fontWeight:800,color:"var(--c2)"}}>{templates.length}</span><span style={{color:"var(--mu)",fontWeight:500}}>Templates</span></div>
//         </div>

//         <div className="ce-abar">
//           <div className="ce-sw"><Search size={14}/><input placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
//           <button className="ce-issue-btn" onClick={()=>openPanel()}><Plus size={15}/> Issue Certificate</button>
//         </div>

//         <div className="ce-main">
//           <div style={{flex:1,minWidth:0}}>
//             {filtered.length===0?(
//               <div className="ce-empty-grid"><div className="ce-empty-ico"><Award size={24}/></div><p style={{fontSize:13,fontWeight:700,color:"var(--mu)",margin:0}}>No templates found</p></div>
//             ):(
//               <div className="ce-grid" style={{gridTemplateColumns:panelOpen?"repeat(auto-fill,minmax(240px,1fr))":"repeat(auto-fill,minmax(280px,1fr))"}}>
//                 {filtered.map(tpl=>(
//                   <div key={tpl.id} className="ce-tpl">
//                     <div className="ce-tpl-preview" style={{background:tpl.grad}}>
//                       <Award size={36} color="rgba(255,255,255,.9)"/>
//                       <span className="ce-tpl-type">{tpl.type}</span>
//                     </div>
//                     <div className="ce-tpl-body">
//                       <p className="ce-tpl-name">{tpl.name}</p>
//                       <div className="ce-tpl-meta">
//                         <div className="ce-tpl-theme"><Palette size={12}/>{tpl.theme}</div>
//                         <span className="ce-tpl-font">{tpl.font}</span>
//                       </div>
//                       <div className="ce-tpl-courses"><BookOpen size={13}/>{tpl.linkedCourses} linked courses</div>
//                       <div className="ce-tpl-divider"/>
//                       <button className="ce-now-btn" onClick={()=>openPanel(tpl.type)}><Zap size={13}/> Issue Now</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {panelOpen&&(
//             <div className="ce-panel">
//               <div className="ce-ph">
//                 <div className="ce-ph-row">
//                   <div className="ce-ph-l">
//                     <div className="ce-ph-ico"><Award size={17}/></div>
//                     <div><p className="ce-ph-title">Issue Certificate</p><p className="ce-ph-sub">Generate or upload a certificate</p></div>
//                   </div>
//                   <button className="ce-xbtn" onClick={()=>{setPanelOpen(false);resetForm();}}><X size={14}/></button>
//                 </div>
//                 <div className="ce-steps">
//                   {["Student Info","Certificate"].map((s,i)=>(
//                     <div key={s} className={`ce-step${i===0?" on":" off"}`}>
//                       <div className="ce-step-num">{i+1}</div>{s}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div className="ce-pb">
//                 <div className="ce-mode-toggle">
//                   {["GENERATE","UPLOAD"].map(m=>(
//                     <button key={m} className={`ce-mtab${mode===m?" on":" off"}`} onClick={()=>setMode(m)}>
//                       {m==="GENERATE"?<><Zap size={12}/> Generate</>:<><Upload size={12}/> Upload</>}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="ce-field"><label>Student Email</label><input className="ce-inp" placeholder="student@example.com" value={studentEmail} onChange={e=>setStudentEmail(e.target.value)}/></div>
//                 {mode==="GENERATE"&&<div className="ce-field"><label>Student Name</label><input className="ce-inp" placeholder="e.g. Raghib Khan" value={studentName} onChange={e=>setStudentName(e.target.value)}/></div>}
//                 <div className="ce-field"><label>Course Name</label><input className="ce-inp" placeholder="e.g. React for Beginners" value={courseName} onChange={e=>setCourseName(e.target.value)}/></div>
//                 {mode==="GENERATE"&&(
//                   <div className="ce-field">
//                     <label>Certificate Type</label>
//                     {["COMPLETION","EXCELLENCE","INTERNSHIP"].map(type=>(
//                       <button key={type} className={`ce-type-btn${certificateType===type?" on":""}`} onClick={()=>setCertificateType(type)}>
//                         <div className="ce-type-ico" style={{background:certificateType===type?"rgba(34,211,238,.15)":"var(--bg)"}}><Award size={14} style={{color:certificateType===type?"var(--c1)":"var(--mu)"}}/></div>
//                         {type}
//                         {certificateType===type&&<ChevronRight size={14} style={{marginLeft:"auto",color:"var(--c1)"}}/>}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//                 {mode==="UPLOAD"&&<div className="ce-field"><label>Certificate File</label><input className="ce-inp" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e=>setFile(e.target.files[0])}/></div>}
//               </div>
//               <div className="ce-pf">
//                 <button className="ce-cancel" onClick={()=>{setPanelOpen(false);resetForm();}}>Cancel</button>
//                 <button className="ce-submit" onClick={handleSubmit} disabled={loading}>
//                   {loading?<><span style={{width:13,height:13,borderRadius:"50%",border:"2px solid rgba(0,0,0,.2)",borderTopColor:"#0a0a0a",animation:"ce-spin .8s linear infinite",display:"inline-block"}}/> Processing…</>:mode==="UPLOAD"?<><Upload size={13}/> Upload</>:<><Zap size={13}/> Issue</>}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <style>{`@keyframes ce-spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );
// };
// export default CertificatesAdmin;








































import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  BookOpen,
  ChevronRight,
  Palette,
  Plus,
  Search,
  Upload,
  X,
  Zap,
} from "lucide-react";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see
// AdminDashboard.jsx, the Golden Reference, which this page now visually
// matches).
import {
  T,
  FONT_FAMILY,
  FONT_WEIGHT,
  FONT_SIZE,
  LINE_HEIGHT,
  LETTER_SPACING,
  RADIUS,
  CARD_PADDING,
  ACCENT_PURPLE,
  PageContainer,
  Hero,
} from "@/design-system";

/* ─────────────────────────────────────────────────────────────────────────
   Page-local layout helpers only — no color/spacing/radius values are
   invented here, everything is sourced from the theme token object (t)
   or the shared FONT_FAMILY / FONT_WEIGHT / RADIUS / CARD_PADDING tokens,
   exactly the same way AdminDashboard.jsx's SectionCard / SectionHeader /
   EmptyBlock are page-local but token-driven.
───────────────────────────────────────────────────────────────────────── */

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark";

const API_GATEWAY = "http://localhost:9000";

const templates = [
  { id: 1, name: "Completion Certificate", grad: "linear-gradient(135deg,#6d28d9,#4338ca)", font: "Serif", theme: "#7C3AED", linkedCourses: 4, type: "COMPLETION" },
  { id: 2, name: "Excellence Certificate", grad: "linear-gradient(135deg,#1e293b,#0f172a)", font: "Sans", theme: "#0F172A", linkedCourses: 2, type: "EXCELLENCE" },
  { id: 3, name: "Internship Certificate", grad: "linear-gradient(135deg,#b45309,#92400e)", font: "Serif", theme: "#F59E0B", linkedCourses: 3, type: "INTERNSHIP" },
];

function IconBadge({ icon: Icon, color, size = 34, iconSize = 15 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: RADIUS.chip,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${color}18`,
        border: `1px solid ${color}30`,
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} />
    </div>
  );
}

function SectionCard({ t, children, style }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        padding: CARD_PADDING.standardCard,
        boxShadow: t.shadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyBlock({ t, icon: Icon, title }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px", gap: 12, textAlign: "center" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1.5px dashed ${t.emptyBorder}`,
          background: t.emptyBg,
        }}
      >
        <Icon size={20} color={t.emptyIcon} />
      </div>
      <p style={{ fontSize: 13, color: t.text, fontWeight: FONT_WEIGHT.bold, fontFamily: FONT_FAMILY, margin: 0 }}>{title}</p>
    </div>
  );
}

/* ── template card ── */
function TemplateCard({ t, tpl, onIssue }) {
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        boxShadow: t.shadow,
        overflow: "hidden",
      }}
    >
      <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", background: tpl.grad }}>
        <Award size={36} color="rgba(255,255,255,.9)" />
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "3px 9px",
            borderRadius: 7,
            background: "rgba(0,0,0,.30)",
            fontSize: 10,
            fontWeight: FONT_WEIGHT.bold,
            color: "rgba(255,255,255,.9)",
            fontFamily: FONT_FAMILY,
            backdropFilter: "blur(4px)",
          }}
        >
          {tpl.type}
        </span>
      </div>

      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY, margin: "0 0 10px" }}>{tpl.name}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: t.textMuted, fontFamily: "monospace" }}>
            <Palette size={12} /> {tpl.theme}
          </div>
          <span style={{ padding: "3px 8px", borderRadius: 6, background: t.recentItemBg, border: `1px solid ${t.recentItemBorder}`, fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY }}>
            {tpl.font}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 12 }}>
          <BookOpen size={13} /> {tpl.linkedCourses} linked courses
        </div>

        <div style={{ height: 1, background: t.border, marginBottom: 12 }} />

        <button
          onClick={() => onIssue(tpl.type)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: 10,
            borderRadius: RADIUS.chip,
            border: "none",
            background: ACCENT_PURPLE.base,
            color: "#ffffff",
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            cursor: "pointer",
          }}
        >
          <Zap size={13} /> Issue Now
        </button>
      </div>
    </div>
  );
}

/* ── issue panel ── */
function IssuePanel({
  t,
  mode,
  setMode,
  studentEmail,
  setStudentEmail,
  studentName,
  setStudentName,
  courseName,
  setCourseName,
  certificateType,
  setCertificateType,
  setFile,
  loading,
  onSubmit,
  onClose,
}) {
  const steps = ["Student Info", "Certificate"];

  return (
    <div style={{ width: 320, flexShrink: 0, background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: RADIUS.standardCard, boxShadow: t.shadow, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", background: `${ACCENT_PURPLE.base}0d`, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBadge icon={Award} color={ACCENT_PURPLE.base} size={36} iconSize={17} />
            <div>
              <p style={{ fontSize: 14, fontWeight: FONT_WEIGHT.bold, color: t.text, fontFamily: FONT_FAMILY, margin: "0 0 2px" }}>Issue Certificate</p>
              <p style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_FAMILY, margin: 0 }}>Generate or upload a certificate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 9, border: `1px solid ${t.recentItemBorder}`, background: t.recentItemBg, color: t.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {steps.map((s, i) => (
            <div
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                borderRadius: 9,
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.semibold,
                background: i === 0 ? `${ACCENT_PURPLE.base}18` : "transparent",
                border: i === 0 ? `1px solid ${ACCENT_PURPLE.base}30` : "1px solid transparent",
                color: i === 0 ? ACCENT_PURPLE.base : t.textMuted,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: FONT_WEIGHT.bold,
                  flexShrink: 0,
                  background: i === 0 ? ACCENT_PURPLE.base : t.recentItemBorder,
                  color: i === 0 ? "#ffffff" : t.textMuted,
                }}
              >
                {i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 13, overflowY: "auto", maxHeight: "calc(100vh - 320px)" }}>
        <div style={{ display: "flex", gap: 4, background: t.recentItemBg, borderRadius: RADIUS.chip, padding: 4 }}>
          {["GENERATE", "UPLOAD"].map((m) => {
            const on = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  padding: 8,
                  borderRadius: 8,
                  border: "none",
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  fontWeight: FONT_WEIGHT.bold,
                  cursor: "pointer",
                  background: on ? t.cardBg : "transparent",
                  color: on ? t.text : t.textMuted,
                  boxShadow: on ? t.shadow : "none",
                }}
              >
                {m === "GENERATE" ? (
                  <>
                    <Zap size={12} /> Generate
                  </>
                ) : (
                  <>
                    <Upload size={12} /> Upload
                  </>
                )}
              </button>
            );
          })}
        </div>

        <Field t={t} label="Student Email">
          <input
            style={inputStyle(t)}
            placeholder="student@example.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
        </Field>

        {mode === "GENERATE" && (
          <Field t={t} label="Student Name">
            <input
              style={inputStyle(t)}
              placeholder="e.g. Raghib Khan"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </Field>
        )}

        <Field t={t} label="Course Name">
          <input
            style={inputStyle(t)}
            placeholder="e.g. React for Beginners"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </Field>

        {mode === "GENERATE" && (
          <Field t={t} label="Certificate Type">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["COMPLETION", "EXCELLENCE", "INTERNSHIP"].map((type) => {
                const on = certificateType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setCertificateType(type)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 13px",
                      borderRadius: RADIUS.chip,
                      border: on ? `1px solid ${ACCENT_PURPLE.base}40` : `1px solid ${t.recentItemBorder}`,
                      background: on ? `${ACCENT_PURPLE.base}0f` : "transparent",
                      fontFamily: FONT_FAMILY,
                      fontSize: 12,
                      fontWeight: FONT_WEIGHT.semibold,
                      cursor: "pointer",
                      textAlign: "left",
                      color: on ? ACCENT_PURPLE.base : t.textMuted,
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: on ? `${ACCENT_PURPLE.base}20` : t.recentItemBg,
                      }}
                    >
                      <Award size={14} color={on ? ACCENT_PURPLE.base : t.textMuted} />
                    </div>
                    {type}
                    {on && <ChevronRight size={14} style={{ marginLeft: "auto", color: ACCENT_PURPLE.base }} />}
                  </button>
                );
              })}
            </div>
          </Field>
        )}

        {mode === "UPLOAD" && (
          <Field t={t} label="Certificate File">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setFile(e.target.files[0])}
              style={inputStyle(t)}
            />
          </Field>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: `1px solid ${t.border}` }}>
        <button
          onClick={onClose}
          style={{ padding: "9px 16px", borderRadius: RADIUS.chip, border: `1px solid ${t.recentItemBorder}`, background: t.recentItemBg, color: t.textMuted, fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: FONT_WEIGHT.bold, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 20px",
            borderRadius: RADIUS.chip,
            border: "none",
            background: ACCENT_PURPLE.base,
            color: "#ffffff",
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: FONT_WEIGHT.bold,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <>
              <span style={{ width: 13, height: 13, borderRadius: "50%", border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", display: "inline-block", animation: "ce-spin .8s linear infinite" }} />
              Processing…
            </>
          ) : mode === "UPLOAD" ? (
            <>
              <Upload size={13} /> Upload
            </>
          ) : (
            <>
              <Zap size={13} /> Issue
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({ t, label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: FONT_WEIGHT.bold, textTransform: "uppercase", letterSpacing: LETTER_SPACING.eyebrowWide, color: t.textMuted, fontFamily: FONT_FAMILY, marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = (t) => ({
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  borderRadius: RADIUS.chip,
  border: `1px solid ${t.recentItemBorder}`,
  background: t.recentItemBg,
  color: t.text,
  fontFamily: FONT_FAMILY,
  fontSize: 13,
  outline: "none",
});

/* ══ MAIN ══ */
const CertificatesAdmin = () => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(isDark);
  useEffect(() => {
    setDark(isDark());
    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = dark ? T.dark : T.light;

  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState("GENERATE");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [certificateType, setCertificateType] = useState("COMPLETION");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = templates.filter((tpl) => tpl.name.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setStudentEmail("");
    setStudentName("");
    setCourseName("");
    setFile(null);
    setMode("GENERATE");
    setCertificateType("COMPLETION");
  };

  const openPanel = (type = "COMPLETION") => {
    setCertificateType(type);
    setPanelOpen(true);
  };

  const handleSubmit = async () => {
    if (!studentEmail || !courseName) {
      alert("Student email & course name required");
      return;
    }
    try {
      setLoading(true);
      if (mode === "GENERATE") {
        if (!studentName) {
          alert("Student name required");
          return;
        }
        await axios.post(`${API_GATEWAY}/api/files/certificates/generate`, null, {
          params: { email: studentEmail, studentName, courseName, type: certificateType },
          headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
        });
      } else {
        if (!file) {
          alert("Please select certificate file");
          return;
        }
        const fd = new FormData();
        fd.append("file", file);
        fd.append("email", studentEmail);
        fd.append("courseName", courseName);
        await axios.post(`${API_GATEWAY}/api/files/certificates/upload`, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` },
        });
      }
      alert("Certificate processed successfully");
      setPanelOpen(false);
      resetForm();
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      <style>{`
        @keyframes ce-spin{to{transform:rotate(360deg)}}
        .ce-search{max-width:300px;}
        @media (max-width:1024px){
          .ce-main{flex-direction:column !important;}
          .ce-panel-wrap{width:100% !important;}
        }
        @media (max-width:640px){
          .ce-abar{flex-direction:column;align-items:stretch;}
          .ce-search{max-width:none !important;}
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: RADIUS.pill,
                border: `1px solid ${t.pillBorder}`,
                background: t.pillBg,
                color: t.pillText,
                fontFamily: FONT_FAMILY,
                fontSize: 11,
                fontWeight: FONT_WEIGHT.bold,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span style={{ fontSize: FONT_SIZE.eyebrow, fontWeight: FONT_WEIGHT.bold, letterSpacing: LETTER_SPACING.eyebrowWide, textTransform: "uppercase", color: t.textSub, fontFamily: FONT_FAMILY }}>
              Certificates
            </span>
          </div>
          <h1 style={{ fontFamily: FONT_FAMILY, fontWeight: FONT_WEIGHT.heroTitle, fontSize: FONT_SIZE.heroTitle, color: ACCENT_PURPLE.base, margin: "0 0 6px", lineHeight: LINE_HEIGHT.heroTitle, letterSpacing: LETTER_SPACING.heroTitle }}>
            Certificates
          </h1>
          <p style={{ fontSize: FONT_SIZE.bodySmall, color: t.textSub, margin: 0, fontWeight: FONT_WEIGHT.medium, fontFamily: FONT_FAMILY }}>
            Issue or upload certificates for students
          </p>
        </div>

        <div className="hero-badges">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: t.actBg,
              border: `1px solid ${t.actBorder}`,
              borderRadius: RADIUS.chip,
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: FONT_WEIGHT.semibold,
              fontFamily: FONT_FAMILY,
              color: t.textSub,
            }}
          >
            <span>{templates.length} templates</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: RADIUS.pill,
              padding: "8px 18px",
              color: ACCENT_PURPLE.base,
              fontSize: 11,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base, display: "inline-block" }} />
            LIVE
          </div>
        </div>
      </Hero>

      {/* ═══ ACTION BAR ═══ */}
      <SectionCard t={t} style={{ marginBottom: 14 }}>
        <div className="ce-abar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div className="ce-search" style={{ position: "relative", width: "100%" }}>
            <Search size={14} color={t.textMuted} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px 9px 34px",
                borderRadius: RADIUS.chip,
                border: `1px solid ${t.recentItemBorder}`,
                background: t.recentItemBg,
                color: t.text,
                fontFamily: FONT_FAMILY,
                fontSize: 12.5,
                fontWeight: FONT_WEIGHT.medium,
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => openPanel()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: RADIUS.chip,
              border: "none",
              background: ACCENT_PURPLE.base,
              color: "#ffffff",
              fontFamily: FONT_FAMILY,
              fontSize: 13,
              fontWeight: FONT_WEIGHT.bold,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <Plus size={15} /> Issue Certificate
          </button>
        </div>
      </SectionCard>

      {/* ═══ MAIN: template grid + issue panel ═══ */}
      <div className="ce-main" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <SectionCard t={t}>
              <EmptyBlock t={t} icon={Award} title="No templates found" />
            </SectionCard>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: panelOpen ? "repeat(auto-fill,minmax(240px,1fr))" : "repeat(auto-fill,minmax(280px,1fr))",
              }}
            >
              {filtered.map((tpl) => (
                <TemplateCard key={tpl.id} t={t} tpl={tpl} onIssue={openPanel} />
              ))}
            </div>
          )}
        </div>

        {panelOpen && (
          <div className="ce-panel-wrap">
            <IssuePanel
              t={t}
              mode={mode}
              setMode={setMode}
              studentEmail={studentEmail}
              setStudentEmail={setStudentEmail}
              studentName={studentName}
              setStudentName={setStudentName}
              courseName={courseName}
              setCourseName={setCourseName}
              certificateType={certificateType}
              setCertificateType={setCertificateType}
              setFile={setFile}
              loading={loading}
              onSubmit={handleSubmit}
              onClose={() => {
                setPanelOpen(false);
                resetForm();
              }}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default CertificatesAdmin;