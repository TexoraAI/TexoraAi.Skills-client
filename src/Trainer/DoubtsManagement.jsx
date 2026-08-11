// import { getTrainerStudents } from "@/services/chatService";
// import videoService from "@/services/videoService";
// import { ChevronDown, ChevronRight, MessageCircle, Search, Sparkles, Users, Filter, Inbox } from "lucide-react";
// import { useEffect, useState } from "react";
// import DoubtsChatModal from "./DoubtsChatModal";

// const STYLES = `
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
// :root{
//   --bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
//   --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;
//   --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;
// }
// .dm-dk{
//   --bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
//   --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);
// }
// *{box-sizing:border-box;}
// .dm{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);}

// /* ── TOPBAR ── */
// .dm-topbar{
//   background:var(--card);border-bottom:1px solid var(--bd);
//   padding:14px 20px;display:flex;align-items:center;
//   justify-content:space-between;box-shadow:var(--sh);
//   flex-wrap:wrap;gap:10px;
// }
// .dm-topbar-l{display:flex;align-items:center;gap:12px;min-width:0;}
// .dm-topbar-ico{
//   width:40px;height:40px;flex-shrink:0;border-radius:12px;
//   background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.18);
//   display:flex;align-items:center;justify-content:center;color:var(--c4);
// }
// .dm-topbar-title{
//   font-size:clamp(13px,2.5vw,15px);font-weight:800;color:var(--tx);
//   margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
// }
// .dm-topbar-sub{font-size:clamp(10px,1.8vw,11px);color:var(--mu);margin:0;}
// .dm-topbar-r{display:flex;align-items:center;gap:8px;flex-shrink:0;}
// .dm-cnt{font-size:12px;color:var(--mu);white-space:nowrap;}
// .dm-pulse{width:8px;height:8px;flex-shrink:0;border-radius:50%;background:var(--c3);animation:dm-pulse 2s ease-in-out infinite;}
// @keyframes dm-pulse{0%,100%{opacity:1}50%{opacity:.4}}

// /* ── HERO ── */
// .dm-hero{
//   background:var(--card);border-bottom:1px solid var(--bd);
//   padding:clamp(20px,4vw,36px) clamp(16px,4vw,32px);
//   display:flex;align-items:flex-start;justify-content:space-between;
//   flex-wrap:wrap;gap:16px;
// }
// .dm-hero-l{display:flex;flex-direction:column;gap:8px;min-width:0;}
// .dm-hero-title{
//   font-family:'Poppins',sans-serif;font-weight:650;
//   font-size:clamp(1.4rem,3vw,2.4rem);
//   margin:0;line-height:1.1;letter-spacing:-0.02em;
// }
// .dm-hero-grad{
//   background:linear-gradient(135deg,#a78bfa,#22d3ee);
//   -webkit-background-clip:text;-webkit-text-fill-color:transparent;
//   background-clip:text;
// }
// .dm-hero-sub{font-size:clamp(12px,2vw,14px);color:var(--mu);margin:0;line-height:1.5;}
// .dm-hero-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;}
// .dm-badge{
//   display:inline-flex;align-items:center;gap:5px;
//   padding:5px 11px;border-radius:20px;font-size:11px;font-weight:700;
//   border:1px solid;
// }
// .dm-badge-purple{background:rgba(167,139,250,.10);border-color:rgba(167,139,250,.20);color:var(--c4);}
// .dm-badge-cyan{background:rgba(34,211,238,.10);border-color:rgba(34,211,238,.20);color:var(--c1);}
// .dm-badge-green{background:rgba(52,211,153,.10);border-color:rgba(52,211,153,.20);color:var(--c3);}
// .dm-hero-stat{
//   display:flex;flex-direction:column;align-items:flex-end;gap:4px;
//   flex-shrink:0;
// }
// @media(max-width:480px){
//   .dm-hero{flex-direction:column;}
//   .dm-hero-stat{align-items:flex-start;}
// }
// .dm-hero-num{font-size:clamp(28px,6vw,44px);font-weight:800;color:var(--tx);line-height:1;}
// .dm-hero-numlabel{font-size:11px;color:var(--mu);font-weight:600;text-align:right;}
// @media(max-width:480px){.dm-hero-numlabel{text-align:left;}}

// /* ── BODY ── */
// .dm-body{
//   width:100%;
//   padding:clamp(12px,3vw,24px);
//   display:flex;flex-direction:column;gap:14px;
// }

// /* ── SECTIONS ── */
// .dm-section{background:var(--card);border:1px solid var(--bd);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh);}
// .dm-sh{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;cursor:pointer;user-select:none;transition:background .15s;}
// .dm-sh:hover{background:rgba(34,211,238,.025);}
// .dm-shl{display:flex;align-items:center;gap:10px;}
// .dm-stitle{font-size:12px;font-weight:700;color:var(--tx);text-transform:uppercase;letter-spacing:.08em;}
// .dm-scnt{padding:3px 9px;border-radius:7px;background:rgba(167,139,250,.10);border:1px solid rgba(167,139,250,.15);color:var(--c4);font-size:11px;font-weight:700;}
// .dm-sbody{border-top:1px solid var(--bd);padding:clamp(12px,2.5vw,16px) clamp(14px,3vw,20px);}

// /* ── SELECT ── */
// .dm-sel{width:100%;padding:11px 38px 11px 14px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;appearance:none;cursor:pointer;transition:border-color .2s,box-shadow .2s;}
// .dm-sel:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .dm-sel-wrap{position:relative;}
// .dm-sel-wrap svg{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}

// /* ── SEARCH ── */
// .dm-search{position:relative;}
// .dm-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mu);}
// .dm-search input{width:100%;padding:11px 14px 11px 40px;border-radius:13px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;font-weight:500;outline:none;transition:border-color .2s,box-shadow .2s;}
// .dm-search input:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
// .dm-search input::placeholder{color:var(--mu);}

// /* ── LIST ── */
// .dm-list{display:flex;flex-direction:column;gap:8px;}
// .dm-item{
//   display:flex;align-items:center;justify-content:space-between;
//   padding:12px 14px;border-radius:13px;border:1px solid var(--bd);
//   background:var(--bg);transition:border-color .2s,box-shadow .2s;
//   flex-wrap:wrap;gap:10px;
// }
// .dm-item:hover{border-color:rgba(167,139,250,.30);box-shadow:var(--sh);}
// .dm-item-l{display:flex;align-items:center;gap:12px;min-width:0;flex:1;}
// .dm-av{
//   width:36px;height:36px;flex-shrink:0;border-radius:10px;
//   background:rgba(167,139,250,.20);border:1px solid rgba(167,139,250,.20);
//   display:flex;align-items:center;justify-content:center;
//   font-size:13px;font-weight:800;color:var(--c4);text-transform:uppercase;
// }
// .dm-iname{font-size:13px;font-weight:700;color:var(--tx);margin:0 0 2px;text-transform:capitalize;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
// .dm-iemail{font-size:11px;color:var(--mu);margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
// @media(max-width:360px){.dm-iemail{max-width:140px;}}
// .dm-iinfo{min-width:0;flex:1;}

// /* ── REPLY BTN ── */
// .dm-rbtn{
//   display:inline-flex;align-items:center;gap:6px;
//   padding:9px 16px;border-radius:11px;border:none;
//   background:var(--c4);color:#0a0a0a;
//   font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;
//   cursor:pointer;transition:opacity .2s,transform .15s;
//   flex-shrink:0;white-space:nowrap;
// }
// .dm-rbtn:hover{opacity:.87;transform:translateY(-1px);}
// @media(max-width:400px){
//   .dm-rbtn span{display:none;}
// }

// /* ── EMPTY ── */
// .dm-empty{display:flex;flex-direction:column;align-items:center;padding:40px 20px;gap:10px;text-align:center;color:var(--mu);}
// .dm-eico{opacity:.35;margin-bottom:4px;}
// .dm-etxt{font-size:13px;font-weight:500;}
// `;

// if(!document.getElementById("dm-st")){
//   const t=document.createElement("style");
//   t.id="dm-st";t.textContent=STYLES;document.head.appendChild(t);
// }

// const isDark=()=>
//   document.documentElement.classList.contains("dark")||
//   document.body.classList.contains("dark")||
//   window.matchMedia("(prefers-color-scheme: dark)").matches;

// const Section=({title,icon:Icon,count,defaultOpen=true,children})=>{
//   const[open,setOpen]=useState(defaultOpen);
//   return(
//     <div className="dm-section">
//       <div className="dm-sh" onClick={()=>setOpen(p=>!p)}>
//         <div className="dm-shl">
//           {open
//             ?<ChevronDown size={15} style={{color:"var(--mu)"}}/>
//             :<ChevronRight size={15} style={{color:"var(--mu)"}}/>
//           }
//           {Icon&&<Icon size={14} style={{color:"var(--c4)"}}/>}
//           <span className="dm-stitle">{title}</span>
//           {count!==undefined&&<span className="dm-scnt">{count}</span>}
//         </div>
//       </div>
//       {open&&<div className="dm-sbody">{children}</div>}
//     </div>
//   );
// };

// const DoubtsManagement=()=>{
//   const[batchId,setBatchId]=useState(null);
//   const[batches,setBatches]=useState([]);
//   const[doubts,setDoubts]=useState([]);
//   const[activeDoubt,setActiveDoubt]=useState(null);
//   const[searchQuery,setSearchQuery]=useState("");
//   const[dark,setDark]=useState(isDark);

//   useEffect(()=>{
//     const o=new MutationObserver(()=>setDark(isDark()));
//     o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
//     o.observe(document.body,{attributes:true,attributeFilter:["class"]});
//     return()=>o.disconnect();
//   },[]);

//   useEffect(()=>{
//     const load=async()=>{
//       try{
//         const r=await videoService.getTrainerBatches();
//         const l=r.data||[];
//         setBatches(l);
//         if(l.length>0)setBatchId(l[0].id);
//       }catch(e){console.error(e);}
//     };
//     load();
//   },[]);

//   useEffect(()=>{
//     if(!batchId)return;
//     const load=async()=>{
//       try{
//         const r=await getTrainerStudents(batchId);
//         setDoubts(r.data.map((email,i)=>({
//           id:i+1,
//           student:email.split("@")[0],
//           studentEmail:email,
//           batchId
//         })));
//       }catch(e){console.error(e);setDoubts([]);}
//     };
//     load();
//   },[batchId]);

//   const filtered=doubts.filter(d=>
//     d.student.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return(
//     <div className={`dm${dark?" dm-dk":""}`}>
//       {/* ── HERO ── */}
//       <div className="dm-hero">
//         <div className="dm-hero-l">
//           <h1 className="dm-hero-title">
//             Doubts{" "}
//             <span className="dm-hero-grad">Management</span>
//           </h1>
//           <p className="dm-hero-sub">
//             Review, track, and reply to every student query — all in one place.
//           </p>
//           <div className="dm-hero-badges">
//             <span className="dm-badge dm-badge-purple">
//               <Users size={11}/> Students
//             </span>
//             <span className="dm-badge dm-badge-cyan">
//               <MessageCircle size={11}/> Live Chat
//             </span>
//             <span className="dm-badge dm-badge-green">
//               <Sparkles size={11}/> AI Assist
//             </span>
//           </div>
//         </div>
//         <div className="dm-hero-stat">
//           <span className="dm-hero-num">{doubts.length}</span>
//           <span className="dm-hero-numlabel">Total Students</span>
//         </div>
//       </div>

//       {/* ── BODY ── */}
//       <div className="dm-body">

//         <Section title="Batch Selection" icon={Filter} defaultOpen={true}>
//           <div className="dm-sel-wrap">
//             <select
//               className="dm-sel"
//               value={batchId||""}
//               onChange={e=>setBatchId(Number(e.target.value))}
//             >
//               <option value="">— Select a Batch —</option>
//               {batches.map(b=>(
//                 <option key={b.id} value={b.id}>
//                   {b.name||"Batch"} (ID: {b.id})
//                 </option>
//               ))}
//             </select>
//             <ChevronDown size={15}/>
//           </div>
//         </Section>

//         <Section title="Search Students" icon={Search} defaultOpen={true}>
//           <div className="dm-search">
//             <Search size={14}/>
//             <input
//               placeholder="Search by student name..."
//               value={searchQuery}
//               onChange={e=>setSearchQuery(e.target.value)}
//             />
//           </div>
//         </Section>

//         <Section title="Students" icon={Users} count={filtered.length} defaultOpen={true}>
//           {filtered.length===0?(
//             <div className="dm-empty">
//               <div className="dm-eico">
//                 <Sparkles size={32} style={{color:"var(--c4)"}}/>
//               </div>
//               <p className="dm-etxt">
//                 {batchId?"No students found in this batch":"Please select a batch first"}
//               </p>
//             </div>
//           ):(
//             <div className="dm-list">
//               {filtered.map(d=>(
//                 <div key={d.id} className="dm-item">
//                   <div className="dm-item-l">
//                     <div className="dm-av">{d.student[0]}</div>
//                     <div className="dm-iinfo">
//                       <p className="dm-iname">{d.student}</p>
//                       <p className="dm-iemail">{d.studentEmail}</p>
//                     </div>
//                   </div>
//                   <button className="dm-rbtn" onClick={()=>setActiveDoubt(d)}>
//                     <MessageCircle size={13}/>
//                     <span>Reply</span>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Section>

//       </div>

//       {activeDoubt&&(
//         <DoubtsChatModal doubt={activeDoubt} onClose={()=>setActiveDoubt(null)}/>
//       )}
//     </div>
//   );
// };

// export default DoubtsManagement;




































import { getTrainerStudents } from "@/services/chatService";
import videoService from "@/services/videoService";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Search,
  Sparkles,
  Users,
  Filter,
  Inbox,
} from "lucide-react";
import { useEffect, useState } from "react";
import DoubtsChatModal from "./DoubtsChatModal";

// ─── Global Design System — single source of truth for colors, type,
// spacing, radius, StatCard, PageContainer and Hero. This page must not
// redeclare tokens or components that already live there (see Trainer
// Dashboard, the Golden Reference, which this page now visually matches).
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

const isDark = () =>
  document.documentElement.classList.contains("dark") ||
  document.documentElement.getAttribute("data-theme") === "dark" ||
  document.body.classList.contains("dark") ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/* ─────────────────────────────────────────────────────────────────────────
   Page-local, token-driven helpers — same pattern as Dashboard.jsx's
   MiniCalendar / RecentPanel / RecentRow: no colors, radii, or font sizes
   are invented here, everything comes from the theme object (t) or the
   shared FONT_FAMILY / FONT_WEIGHT / FONT_SIZE / LINE_HEIGHT /
   LETTER_SPACING / RADIUS / CARD_PADDING tokens.
───────────────────────────────────────────────────────────────────────── */

function Badge({ color, icon: Icon, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 11px",
        borderRadius: RADIUS.pill,
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.bold,
        border: `1px solid ${color}33`,
        background: `${color}18`,
        color,
        fontFamily: FONT_FAMILY,
        letterSpacing: LETTER_SPACING.base,
      }}
    >
      <Icon size={11} /> {children}
    </span>
  );
}

function AccordionSection({ t, title, icon: Icon, count, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: t.cardBg,
        border: `1px solid ${t.border}`,
        borderRadius: RADIUS.standardCard,
        overflow: "hidden",
        boxShadow: t.shadow,
      }}
    >
      <div
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {open ? <ChevronDown size={15} color={t.textMuted} /> : <ChevronRight size={15} color={t.textMuted} />}
          {Icon && <Icon size={14} color={ACCENT_PURPLE.base} />}
          <span
            style={{
              fontSize: FONT_SIZE.sectionTitle,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              textTransform: "uppercase",
              letterSpacing: LETTER_SPACING.eyebrowWide,
              fontFamily: FONT_FAMILY,
            }}
          >
            {title}
          </span>
          {count !== undefined && (
            <span
              style={{
                padding: "3px 9px",
                borderRadius: 7,
                background: `${ACCENT_PURPLE.base}18`,
                border: `1px solid ${ACCENT_PURPLE.base}26`,
                color: ACCENT_PURPLE.base,
                fontSize: FONT_SIZE.caption,
                fontWeight: FONT_WEIGHT.bold,
                fontFamily: FONT_FAMILY,
              }}
            >
              {count}
            </span>
          )}
        </div>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${t.border}`, padding: CARD_PADDING.standardCard }}>
          {children}
        </div>
      )}
    </div>
  );
}

const selectStyle = (t) => ({
  width: "100%",
  padding: "11px 38px 11px 14px",
  borderRadius: RADIUS.button,
  border: `1px solid ${t.border}`,
  background: t.pillBg,
  color: t.text,
  fontFamily: FONT_FAMILY,
  fontSize: FONT_SIZE.body,
  fontWeight: FONT_WEIGHT.medium,
  outline: "none",
  appearance: "none",
  cursor: "pointer",
  boxSizing: "border-box",
});

function StudentRow({ t, name, email, onReply }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 14px",
        borderRadius: RADIUS.chip,
        border: `1px solid ${t.border}`,
        background: t.pillBg,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: RADIUS.chip,
            background: `${ACCENT_PURPLE.base}22`,
            border: `1px solid ${ACCENT_PURPLE.base}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: FONT_SIZE.body,
            fontWeight: FONT_WEIGHT.extrabold,
            color: ACCENT_PURPLE.base,
            textTransform: "uppercase",
            fontFamily: FONT_FAMILY,
          }}
        >
          {name[0]}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: FONT_SIZE.body,
              fontWeight: FONT_WEIGHT.bold,
              color: t.text,
              margin: "0 0 2px",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: FONT_FAMILY,
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontSize: FONT_SIZE.caption,
              color: t.textMuted,
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 220,
              fontFamily: FONT_FAMILY,
            }}
          >
            {email}
          </p>
        </div>
      </div>
      <button
        onClick={onReply}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 16px",
          borderRadius: RADIUS.chip,
          border: "none",
          background: ACCENT_PURPLE.base,
          color: "#0a0a0a",
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZE.bodySmall,
          fontWeight: FONT_WEIGHT.bold,
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: "opacity .2s, transform .15s",
        }}
      >
        <MessageCircle size={13} /> Reply
      </button>
    </div>
  );
}

const DoubtsManagement = () => {
  const [batchId, setBatchId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const o = new MutationObserver(() => setDark(isDark()));
    o.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    o.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await videoService.getTrainerBatches();
        const l = r.data || [];
        setBatches(l);
        if (l.length > 0) setBatchId(l[0].id);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!batchId) return;
    const load = async () => {
      try {
        const r = await getTrainerStudents(batchId);
        setDoubts(
          r.data.map((email, i) => ({
            id: i + 1,
            student: email.split("@")[0],
            studentEmail: email,
            batchId,
          })),
        );
      } catch (e) {
        console.error(e);
        setDoubts([]);
      }
    };
    load();
  }, [batchId]);

  const filtered = doubts.filter((d) =>
    d.student.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const t = dark ? T.dark : T.light;

  return (
    <PageContainer mode={dark ? "dark" : "light"} pageBg={t.pageBg} textColor={t.text}>
      {/* ═══ HERO — shared <Hero> component, matches Trainer Dashboard exactly ═══ */}
      <Hero borderHero={t.borderHero}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_PURPLE.base }} />
            <span
              style={{
                fontSize: FONT_SIZE.eyebrow,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: LETTER_SPACING.eyebrowWide,
                textTransform: "uppercase",
                color: t.textSub,
                fontFamily: FONT_FAMILY,
              }}
            >
              Trainer Portal
            </span>
          </div>
          <h1
            style={{
              fontFamily: FONT_FAMILY,
              fontWeight: FONT_WEIGHT.heroTitle,
              fontSize: FONT_SIZE.heroTitle,
              lineHeight: LINE_HEIGHT.heroTitle,
              letterSpacing: LETTER_SPACING.heroTitle,
              color: t.text,
              margin: "0 0 6px",
            }}
          >
            Doubts <span style={{ color: ACCENT_PURPLE.base }}>Management</span>
          </h1>
          <p
            style={{
              fontSize: FONT_SIZE.bodySmall,
              color: t.textSub,
              margin: 0,
              fontWeight: FONT_WEIGHT.medium,
              fontFamily: FONT_FAMILY,
              lineHeight: LINE_HEIGHT.body,
            }}
          >
            Review, track, and reply to every student query — all in one place.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            <Badge color={ACCENT_PURPLE.base} icon={Users}>Students</Badge>
            <Badge color="#22d3ee" icon={MessageCircle}>Live Chat</Badge>
            <Badge color="#34d399" icon={Sparkles}>AI Assist</Badge>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 4,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: FONT_SIZE.cardValue,
              fontWeight: FONT_WEIGHT.extrabold,
              color: t.text,
              lineHeight: LINE_HEIGHT.tight,
              fontFamily: FONT_FAMILY,
            }}
          >
            {doubts.length}
          </span>
          <span
            style={{
              fontSize: FONT_SIZE.caption,
              color: t.textMuted,
              fontWeight: FONT_WEIGHT.semibold,
              textAlign: "right",
              fontFamily: FONT_FAMILY,
            }}
          >
            Total Students
          </span>
        </div>
      </Hero>

      {/* ═══ BODY ═══ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
        <AccordionSection t={t} title="Batch Selection" icon={Filter} defaultOpen>
          <div style={{ position: "relative" }}>
            <select
              style={selectStyle(t)}
              value={batchId || ""}
              onChange={(e) => setBatchId(Number(e.target.value))}
            >
              <option value="">— Select a Batch —</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: t.textMuted }}
            />
          </div>
        </AccordionSection>

        <AccordionSection t={t} title="Search Students" icon={Search} defaultOpen>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: t.textMuted }} />
            <input
              placeholder="Search by student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px 11px 40px",
                borderRadius: RADIUS.button,
                border: `1px solid ${t.border}`,
                background: t.pillBg,
                color: t.text,
                fontFamily: FONT_FAMILY,
                fontSize: FONT_SIZE.body,
                fontWeight: FONT_WEIGHT.medium,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </AccordionSection>

        <AccordionSection t={t} title="Students" icon={Users} count={filtered.length} defaultOpen>
          {filtered.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "40px 20px",
                gap: 10,
                textAlign: "center",
              }}
            >
              <div style={{ opacity: 0.35, marginBottom: 4 }}>
                <Sparkles size={32} color={ACCENT_PURPLE.base} />
              </div>
              <p style={{ fontSize: FONT_SIZE.body, fontWeight: FONT_WEIGHT.medium, color: t.textMuted, fontFamily: FONT_FAMILY, margin: 0 }}>
                {batchId ? "No students found in this batch" : "Please select a batch first"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map((d) => (
                <StudentRow
                  key={d.id}
                  t={t}
                  name={d.student}
                  email={d.studentEmail}
                  onReply={() => setActiveDoubt(d)}
                />
              ))}
            </div>
          )}
        </AccordionSection>
      </div>

      {activeDoubt && (
        <DoubtsChatModal doubt={activeDoubt} onClose={() => setActiveDoubt(null)} />
      )}
    </PageContainer>
  );
};

export default DoubtsManagement;