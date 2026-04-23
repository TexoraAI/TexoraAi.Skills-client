import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, BookOpen, Calendar, CheckSquare, Clock, Code, Code2,
  Copy, Download, Edit3, FileText, Folder, Hash, Link, List,
  ListOrdered, Minus, Plus, Quote, Save, Search, Share2,
  Strikethrough, Table, Tag, Trash2, X, BookMarked,
  Bold, Italic, Underline,
} from "lucide-react";

const INJECT_ID = "snb-styles-v5";
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Poppins:wght@400;500;600;700;800&display=swap');
  .snb-root *, .snb-root *::before, .snb-root *::after { box-sizing: border-box; }
  @keyframes snb-toast-in  { from{opacity:0;transform:translateY(8px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes snb-blink     { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes snb-slide-in  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes snb-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes snb-pop       { 0%{transform:scale(.92);opacity:0} 100%{transform:scale(1);opacity:1} }

  .snb-scroll::-webkit-scrollbar       { width:4px; height:4px; }
  .snb-scroll::-webkit-scrollbar-track { background:transparent; }
  .snb-scroll::-webkit-scrollbar-thumb { border-radius:4px; background:rgba(128,128,128,.25); }

  .snb-toolbar { display:flex; align-items:center; gap:2px; padding:5px 10px; flex-wrap:wrap; flex-shrink:0; }
  .snb-toolbar-sep { width:1px; height:18px; margin:0 3px; flex-shrink:0; }

  .snb-tbtn {
    display:inline-flex; align-items:center; justify-content:center;
    width:27px; height:27px; border-radius:6px;
    border:none; background:transparent; cursor:pointer;
    transition:background .12s,transform .1s; flex-shrink:0; padding:0;
    font-family:'Poppins',sans-serif;
  }
  .snb-tbtn:hover  { transform:translateY(-1px); }
  .snb-tbtn:active { transform:scale(.93); }

  .snb-heading-sel {
    height:27px; border-radius:6px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    padding:0 6px; cursor:pointer; outline:none;
  }

  .snb-ta {
    width:100%; flex:1; resize:none; border:none; outline:none;
    font-family:'Lora',Georgia,serif;
    font-size:14px; line-height:1.88; letter-spacing:.012em;
    background:transparent; padding:0;
    white-space:pre-wrap;
  }
  .snb-ta::placeholder { opacity:.28; font-style:italic; }

  .snb-save-btn {
    display:inline-flex; align-items:center; gap:6px;
    padding:7px 13px; border:none; border-radius:8px;
    font-family:'Poppins',sans-serif; font-size:12px; font-weight:700;
    cursor:pointer;
    background:linear-gradient(135deg,#7c3aed,#a855f7); color:#fff;
    box-shadow:0 3px 12px rgba(124,58,237,.35);
    transition:transform .15s,box-shadow .15s;
  }
  .snb-save-btn:hover  { transform:translateY(-1px); box-shadow:0 5px 16px rgba(124,58,237,.45); }
  .snb-save-btn:active { transform:scale(.97); }

  .snb-ghost-btn {
    display:inline-flex; align-items:center; gap:5px;
    padding:6px 11px; border-radius:7px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    cursor:pointer; transition:opacity .15s;
  }
  .snb-ghost-btn:hover:not(:disabled) { opacity:.72; }
  .snb-ghost-btn:disabled { opacity:.32; cursor:not-allowed; }

  .snb-wbadge {
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    padding:3px 9px; border-radius:20px;
  }

  .snb-nb-card {
    border-radius:12px; overflow:hidden; cursor:pointer;
    transition:box-shadow .2s,transform .2s;
  }
  .snb-nb-card:hover { transform:translateY(-2px); }

  .snb-sec-tab {
    display:flex; align-items:center; gap:5px;
    padding:6px 11px; border-radius:7px 7px 0 0;
    cursor:pointer; border:none;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    transition:background .13s; white-space:nowrap;
  }
  .snb-pg-item {
    display:flex; align-items:center; gap:7px;
    padding:6px 10px; cursor:pointer; border:none; width:100%;
    text-align:left; transition:background .12s; background:transparent;
    font-family:'Poppins',sans-serif; font-size:11px;
    border-left:2px solid transparent;
  }
  .snb-pg-item:hover { background:rgba(124,58,237,.05); }

  .snb-overlay {
    position:fixed; inset:0; z-index:999;
    background:rgba(0,0,0,.5);
    display:flex; align-items:center; justify-content:center;
    animation:snb-fade-in .15s ease;
  }
  .snb-modal {
    border-radius:14px; padding:22px; width:296px;
    box-shadow:0 20px 60px rgba(0,0,0,.3);
    animation:snb-pop .2s ease;
    font-family:'Poppins',sans-serif;
  }
  .snb-inp {
    width:100%; padding:8px 11px; border-radius:8px;
    font-family:'Poppins',sans-serif; font-size:13px; outline:none;
    transition:border-color .2s; display:block;
  }
  .snb-inp:focus { border-color:#7c3aed !important; }

  .snb-search-inp {
    width:100%; border:none; outline:none;
    font-family:'Poppins',sans-serif; font-size:12px; background:transparent;
  }

  .snb-tt { position:relative; }
  .snb-tt-text {
    position:absolute; bottom:110%; left:50%; transform:translateX(-50%);
    background:#1e293b; color:#f8fafc;
    font-size:10px; font-weight:600; padding:3px 7px; border-radius:5px;
    white-space:nowrap; pointer-events:none; opacity:0; transition:opacity .15s;
    font-family:'Poppins',sans-serif; z-index:60;
  }
  .snb-tt:hover .snb-tt-text { opacity:1; }

  .snb-tag-opt {
    display:flex; align-items:center; gap:7px;
    width:100%; background:transparent; border:none; cursor:pointer;
    padding:5px 7px; border-radius:6px;
    font-family:'Poppins',sans-serif; font-size:11px; font-weight:600;
    transition:background .12s;
  }
`;

const injectStyles = () => {
  if (document.getElementById(INJECT_ID)) return;
  const t = document.createElement("style");
  t.id = INJECT_ID; t.textContent = GLOBAL_CSS;
  document.head.appendChild(t);
};

/* ── Detect dark mode reliably ── */
const detectDark = () => {
  // Check explicit dark class on html or body
  if (document.documentElement.classList.contains("dark")) return true;
  if (document.body.classList.contains("dark")) return true;
  // Check data-theme attribute
  const theme = document.documentElement.getAttribute("data-theme") || document.body.getAttribute("data-theme");
  if (theme === "dark") return true;
  // Check CSS variable --bg color (if app sets it)
  // Fall back to system preference ONLY if no class is set
  const hasLightClass =
    document.documentElement.classList.contains("light") ||
    document.body.classList.contains("light") ||
    document.documentElement.getAttribute("data-theme") === "light";
  if (hasLightClass) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

/* ── Toast ── */
function useToast() {
  const [toast, setToast] = useState(null);
  const tmr = useRef(null);
  const show = useCallback((msg) => {
    clearTimeout(tmr.current);
    setToast({ msg, key: Date.now() });
    tmr.current = setTimeout(() => setToast(null), 2200);
  }, []);
  return [toast, show];
}

/* ── Constants ── */
const NB_COLORS  = ["#7c3aed","#2563eb","#0891b2","#059669","#d97706","#dc2626","#db2777","#9333ea"];
const SEC_COLORS = ["#7c3aed","#2563eb","#0891b2","#059669","#d97706","#dc2626","#db2777","#16a34a"];
const TAG_OPTIONS = [
  { label:"Important",  icon:"⭐", color:"#f59e0b", bg:"rgba(245,158,11,.1)"  },
  { label:"Question",   icon:"❓", color:"#3b82f6", bg:"rgba(59,130,246,.1)"  },
  { label:"To Do",      icon:"✅", color:"#22c55e", bg:"rgba(34,197,94,.1)"   },
  { label:"Idea",       icon:"💡", color:"#a855f7", bg:"rgba(168,85,247,.1)"  },
  { label:"Remember",   icon:"🔖", color:"#ef4444", bg:"rgba(239,68,68,.1)"   },
  { label:"Definition", icon:"📌", color:"#0891b2", bg:"rgba(8,145,178,.1)"   },
];

const uid    = () => `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const mkPage = (title="Page 1", content="") => ({ id:uid(), title, content, createdAt:new Date().toISOString() });
const mkSect = (title, color, pages) => ({ id:uid(), title, color, pages: pages ?? [mkPage()] });
const mkNB   = (title, color, sections) => ({ id:uid(), title, color, sections: sections ?? [mkSect("General",color)] });

const DEFAULT_NBS = [
  mkNB("My Lecture Notes","#7c3aed",[
    mkSect("Chapter 1","#2563eb",[mkPage("Overview","# Overview\n\nStart writing here…"),mkPage("Key Points")]),
    mkSect("Chapter 2","#0891b2",[mkPage("Summary")]),
  ]),
  mkNB("Assignments","#059669"),
  mkNB("Quick Notes","#d97706"),
];

const LS_KEY  = "snb_nbs_v4";
const loadNBs = () => { try{ const d=localStorage.getItem(LS_KEY); return d?JSON.parse(d):DEFAULT_NBS; }catch{ return DEFAULT_NBS; } };
const saveNBs = (nbs) => { try{ localStorage.setItem(LS_KEY,JSON.stringify(nbs)); }catch{} };

/* ── Editor helpers (unchanged) ── */
function toggleInline(ta, marker, val, set) {
  const s=ta.selectionStart,e=ta.selectionEnd,sel=val.slice(s,e),m=marker.length;
  if(val.slice(s-m,s)===marker&&val.slice(e,e+m)===marker){
    const n=val.slice(0,s-m)+sel+val.slice(e+m); set(n);
    requestAnimationFrame(()=>{ ta.selectionStart=s-m; ta.selectionEnd=e-m; ta.focus(); }); return;
  }
  const n=val.slice(0,s)+marker+sel+marker+val.slice(e); set(n);
  requestAnimationFrame(()=>{ ta.selectionStart=s+m; ta.selectionEnd=e+m; ta.focus(); });
}
function togglePrefix(ta, pfx, val, set) {
  const s=ta.selectionStart,e=ta.selectionEnd;
  const ls=val.slice(0,s).lastIndexOf("\n")+1;
  const block=val.slice(ls,e),lines=block.split("\n");
  const all=lines.every(l=>l.startsWith(pfx));
  const nb=lines.map(l=>all?l.slice(pfx.length):(l.startsWith(pfx)?l:pfx+l)).join("\n");
  const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
  requestAnimationFrame(()=>{ ta.selectionStart=ls; ta.selectionEnd=e+diff; ta.focus(); });
}
function applyHeading(ta, pfx, val, set) {
  const HR=/^(#{1,6} )/,s=ta.selectionStart,e=ta.selectionEnd;
  const ls=val.slice(0,s).lastIndexOf("\n")+1;
  const block=val.slice(ls,e);
  const nb=block.split("\n").map(l=>{const st=l.replace(HR,""); return pfx?pfx+st:st;}).join("\n");
  const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
  requestAnimationFrame(()=>{ ta.selectionStart=s+diff; ta.selectionEnd=e+diff; ta.focus(); });
}
function insertAt(ta, text, val, set) {
  const s=ta.selectionStart; set(val.slice(0,s)+text+val.slice(s));
  requestAnimationFrame(()=>{ ta.selectionStart=ta.selectionEnd=s+text.length; ta.focus(); });
}
function insertLink(ta, val, set) {
  const s=ta.selectionStart,e=ta.selectionEnd,sel=val.slice(s,e)||"Link Text";
  const lnk=`[${sel}](https://)`; set(val.slice(0,s)+lnk+val.slice(e));
  requestAnimationFrame(()=>{ ta.selectionStart=s; ta.selectionEnd=s+lnk.length; ta.focus(); });
}
function numberedList(ta, val, set) {
  const s=ta.selectionStart,e=ta.selectionEnd;
  const ls=val.slice(0,s).lastIndexOf("\n")+1;
  const block=val.slice(ls,e),lines=block.split("\n");
  const all=lines.every(l=>/^\d+\. /.test(l));
  const nb=lines.map((l,i)=>all?l.replace(/^\d+\. /,""):/^\d+\. /.test(l)?l:`${i+1}. ${l}`).join("\n");
  const diff=nb.length-block.length; set(val.slice(0,ls)+nb+val.slice(e));
  requestAnimationFrame(()=>{ ta.selectionStart=ls; ta.selectionEnd=e+diff; ta.focus(); });
}

/* ════════════════════════════
   COMPONENT
════════════════════════════ */
const StudentNotebook = ({ lectureId="default", lectureTitle="Current Lecture", isDark: isDarkProp }) => {
  useEffect(()=>{ injectStyles(); },[]);

  /* ── Self-detecting dark mode (overrides prop if needed) ── */
  const [isDark, setIsDark] = useState(() => {
    // If prop is explicitly passed (not undefined), use it
    if (isDarkProp !== undefined) return isDarkProp;
    return detectDark();
  });

  useEffect(() => {
    // Always sync from DOM — more reliable than prop
    const sync = () => setIsDark(detectDark());
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class","data-theme"] });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class","data-theme"] });
    // Also listen to system preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => { obs.disconnect(); mq.removeEventListener("change", sync); };
  }, []);

  // Keep prop in sync too (for VideoLectures passing isDark)
  useEffect(() => {
    if (isDarkProp !== undefined) setIsDark(isDarkProp);
  }, [isDarkProp]);

  const [notebooks,    setNotebooks]    = useState(loadNBs);
  const [activeNBId,   setActiveNBId]   = useState(()=>loadNBs()[0]?.id??null);
  const [activeSectId, setActiveSectId] = useState(null);
  const [activePageId, setActivePageId] = useState(null);
  const [view,         setView]         = useState("notebooks");

  const [localText, setLocalText] = useState("");
  const localRef   = useRef("");
  const flushRef   = useRef(null);

  const [searchQ,          setSearchQ]          = useState("");
  const [showSearch,       setShowSearch]        = useState(false);
  const [showTagMenu,      setShowTagMenu]       = useState(false);
  const [showShareModal,   setShowShareModal]    = useState(false);
  const [showNewNBModal,   setShowNewNBModal]    = useState(false);
  const [showNewSectModal, setShowNewSectModal]  = useState(false);
  const [showNewPageModal, setShowNewPageModal]  = useState(false);
  const [newTitle,  setNewTitle]  = useState("");
  const [newColor,  setNewColor]  = useState(NB_COLORS[0]);
  const [shareEmail,setShareEmail]= useState("");
  const [saving,    setSaving]    = useState(false);
  const [toast,     showToast]    = useToast();

  const taRef = useRef(null);

  const activeNB   = notebooks.find(n=>n.id===activeNBId);
  const activeSect = activeNB?.sections.find(s=>s.id===activeSectId) ?? activeNB?.sections[0];
  const activePage = activeSect?.pages.find(p=>p.id===activePageId) ?? activeSect?.pages[0];

  useEffect(()=>{
    const v=activePage?.content??"";
    setLocalText(v); localRef.current=v;
  },[activePageId,activeSectId,activeNBId]);

  useEffect(()=>{
    if(activeNB){ setActiveSectId(activeNB.sections[0]?.id??null); setActivePageId(activeNB.sections[0]?.pages[0]?.id??null); }
  },[activeNBId]);
  useEffect(()=>{
    if(activeSect) setActivePageId(activeSect.pages[0]?.id??null);
  },[activeSectId]);

  useEffect(()=>{ saveNBs(notebooks); },[notebooks]);
  useEffect(()=>()=>clearTimeout(flushRef.current),[]);

  const handleChange = useCallback((e)=>{
    const v=e.target.value;
    setLocalText(v); localRef.current=v;
    setSaving(true);
    clearTimeout(flushRef.current);
    flushRef.current=setTimeout(()=>{
      const txt=localRef.current;
      setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{
        ...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{
          ...s,pages:s.pages.map(p=>p.id!==activePage?.id?p:{...p,content:txt})
        })
      }));
      setSaving(false);
    },900);
  },[activeNBId,activeSect?.id,activePage?.id]);

  const doSave=()=>{
    clearTimeout(flushRef.current);
    const txt=localRef.current;
    setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{
      ...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{
        ...s,pages:s.pages.map(p=>p.id!==activePage?.id?p:{...p,content:txt})
      })
    }));
    setSaving(false); showToast("Notes saved");
  };

  const ta=()=>taRef.current;
  const upd=(v)=>{ setLocalText(v); localRef.current=v; };
  const bold   =()=>ta()&&toggleInline(ta(),"**",localText,upd);
  const italic =()=>ta()&&toggleInline(ta(),"_", localText,upd);
  const under  =()=>ta()&&toggleInline(ta(),"__",localText,upd);
  const strike =()=>ta()&&toggleInline(ta(),"~~",localText,upd);
  const icode  =()=>ta()&&toggleInline(ta(),"`", localText,upd);
  const blist  =()=>ta()&&togglePrefix(ta(),"• ",localText,upd);
  const nlist  =()=>ta()&&numberedList(ta(),localText,upd);
  const bq     =()=>ta()&&togglePrefix(ta(),"> ",localText,upd);
  const cblk   =()=>ta()&&togglePrefix(ta(),"    ",localText,upd);
  const hRule  =()=>ta()&&insertAt(ta(),"\n---\n",localText,upd);
  const chkbox =()=>ta()&&insertAt(ta(),"☐ ",localText,upd);
  const tbl    =()=>ta()&&insertAt(ta(),"\n| Col 1 | Col 2 | Col 3 |\n|-------|-------|-------|\n| Cell  | Cell  | Cell  |\n",localText,upd);
  const lnk    =()=>ta()&&insertLink(ta(),localText,upd);
  const dstamp =()=>ta()&&insertAt(ta(),`📅 ${new Date().toLocaleDateString("en-IN",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}\n`,localText,upd);
  const onHdg  =(e)=>{ ta()&&applyHeading(ta(),e.target.value,localText,upd); requestAnimationFrame(()=>{ e.target.value=""; }); };
  const inTag  =(tag)=>{ ta()&&insertAt(ta(),`[${tag.icon} ${tag.label}] `,localText,upd); setShowTagMenu(false); };

  const addNB=()=>{ if(!newTitle.trim())return; const nb=mkNB(newTitle.trim(),newColor); setNotebooks(n=>[...n,nb]); setActiveNBId(nb.id); setView("editor"); setShowNewNBModal(false); setNewTitle(""); setNewColor(NB_COLORS[0]); showToast(`"${nb.title}" created`); };
  const delNB=(id)=>{ if(notebooks.length<=1){showToast("Can't delete last notebook");return;} if(!window.confirm("Delete this notebook?"))return; const nbs=notebooks.filter(n=>n.id!==id); setNotebooks(nbs); setActiveNBId(nbs[0].id); showToast("Deleted"); };
  const addSect=()=>{ if(!newTitle.trim()||!activeNB)return; const s=mkSect(newTitle.trim(),newColor); setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:[...nb.sections,s]})); setActiveSectId(s.id); setShowNewSectModal(false); setNewTitle(""); setNewColor(SEC_COLORS[0]); showToast("Section created"); };
  const delSect=(id)=>{ if((activeNB?.sections.length??0)<=1){showToast("Can't delete last section");return;} if(!window.confirm("Delete section?"))return; setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.filter(s=>s.id!==id)})); showToast("Deleted"); };
  const addPg=()=>{ if(!activeSect)return; const p=mkPage(newTitle.trim()||`Page ${activeSect.pages.length+1}`); setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.map(s=>s.id!==activeSect.id?s:{...s,pages:[...s.pages,p]})})); setActivePageId(p.id); setShowNewPageModal(false); setNewTitle(""); showToast("Page added"); };
  const delPg=(id)=>{ if((activeSect?.pages.length??0)<=1){showToast("Can't delete last page");return;} if(!window.confirm("Delete page?"))return; setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{...s,pages:s.pages.filter(p=>p.id!==id)})})); showToast("Deleted"); };
  const renPg=(id)=>{ const t=window.prompt("Rename:",activeSect?.pages.find(p=>p.id===id)?.title??""); if(!t?.trim())return; setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{...s,pages:s.pages.map(p=>p.id!==id?p:{...p,title:t.trim()})})})); showToast("Renamed"); };
  const doClear=()=>{ if(!localText.trim())return; if(!window.confirm("Clear page?"))return; upd(""); setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{...s,pages:s.pages.map(p=>p.id!==activePage?.id?p:{...p,content:""})})})); showToast("Cleared"); };
  const doExport=()=>{ const b=new Blob([localText],{type:"text/plain"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${activePage?.title??"notes"}.md`; a.click(); URL.revokeObjectURL(u); showToast("Exported"); };
  const doCopy=()=>{ navigator.clipboard.writeText(localText).then(()=>showToast("Copied")); };
  const doShare=()=>{ if(!shareEmail.trim())return; showToast(`Shared with ${shareEmail}`); setShareEmail(""); setShowShareModal(false); };

  const searchRes = searchQ.length>1
    ? notebooks.flatMap(nb=>nb.sections.flatMap(s=>s.pages.filter(p=>
        p.title.toLowerCase().includes(searchQ.toLowerCase())||p.content.toLowerCase().includes(searchQ.toLowerCase())
      ).map(p=>({nb,section:s,page:p}))))
    : [];

  const wc = localText.trim() ? localText.trim().split(/\s+/).length : 0;
  const cc = localText.length;
  const totalPg = notebooks.reduce((a,nb)=>a+nb.sections.reduce((b,s)=>b+s.pages.length,0),0);

  /* ── THEMES — fully corrected ── */
  const T = isDark ? {
    /* ══ DARK THEME ══ */
    root:       { display:"flex",flexDirection:"column",height:"100%",minHeight:480,background:"#0f1117",border:"1px solid rgba(255,255,255,.07)",borderRadius:18,overflow:"hidden",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 28px rgba(0,0,0,.5)",position:"relative" },
    toast:      { position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#f1f5f9",color:"#0f172a",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,zIndex:99,boxShadow:"0 4px 16px rgba(0,0,0,.5)",animation:"snb-toast-in .25s ease",whiteSpace:"nowrap",fontFamily:"'Poppins',sans-serif" },
    tc:         "#e2e8f0",
    bg:         "#0f1117",
    bg2:        "#161b22",
    bg3:        "#1c2230",
    border:     "rgba(255,255,255,.08)",
    muted:      "#64748b",
    toolbar:    { background:"rgba(255,255,255,.025)" },
    tbtn:       { color:"#94a3b8" },
    sep:        { background:"rgba(255,255,255,.09)" },
    headSel:    { background:"rgba(255,255,255,.07)",color:"#94a3b8",border:"1px solid rgba(255,255,255,.10)" },
    ta:         { color:"#cbd5e1" },
    footer:     { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 13px 11px",borderTop:"1px solid rgba(255,255,255,.06)",background:"rgba(0,0,0,.2)",flexShrink:0 },
    wbadge:     { background:"rgba(255,255,255,.07)",color:"#64748b" },
    clearBtn:   { background:"transparent",border:"1px solid rgba(255,255,255,.1)",color:"#64748b" },
    statusPill: { display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:20,padding:"3px 9px",flexShrink:0 },
    dot:        { width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block" },
    stText:     { fontSize:10,fontWeight:600,color:"#64748b",fontFamily:"'Poppins',sans-serif" },
    modal:      { background:"#1e293b",border:"1px solid rgba(255,255,255,.1)" },
    inp:        { background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.12)",color:"#e2e8f0" },
    cancelBtn:  { padding:"7px 13px",borderRadius:7,border:"1px solid rgba(255,255,255,.1)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontFamily:"'Poppins',sans-serif",fontSize:12,fontWeight:600 },
    searchBox:  { background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)" },
    searchList: { border:"1px solid rgba(255,255,255,.08)",borderRadius:8,overflow:"hidden" },
    searchItem: { borderBottom:"1px solid rgba(255,255,255,.05)" },
    headerBg:   "rgba(255,255,255,.02)",
    divider:    "rgba(255,255,255,.06)",
    cardBg:     "rgba(255,255,255,.03)",
    cardBorder: "rgba(255,255,255,.08)",
    hoverBg:    "rgba(124,58,237,.08)",
    pgActiveBg: "rgba(255,255,255,.04)",
    titleDate:  "#374151",
  } : {
    /* ══ LIGHT THEME ══ */
    root:       { display:"flex",flexDirection:"column",height:"100%",minHeight:480,background:"#ffffff",border:"1px solid #e8e3d9",borderRadius:18,overflow:"hidden",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 24px rgba(0,0,0,.07)",position:"relative" },
    toast:      { position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#1e293b",color:"#f8fafc",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,zIndex:99,boxShadow:"0 4px 16px rgba(0,0,0,.2)",animation:"snb-toast-in .25s ease",whiteSpace:"nowrap",fontFamily:"'Poppins',sans-serif" },
    tc:         "#1e293b",
    bg:         "#ffffff",
    bg2:        "#f8f9fb",
    bg3:        "#f1f5f9",
    border:     "#e2e8f0",
    muted:      "#94a3b8",
    toolbar:    { background:"#faf8f3" },
    tbtn:       { color:"#475569" },
    sep:        { background:"#e2e8f0" },
    headSel:    { background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0" },
    ta:         { color:"#334155" },
    footer:     { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 13px 11px",borderTop:"1px solid #f0ebe0",background:"#fafaf7",flexShrink:0 },
    wbadge:     { background:"#f1f5f9",color:"#94a3b8" },
    clearBtn:   { background:"transparent",border:"1px solid #e2e8f0",color:"#94a3b8" },
    statusPill: { display:"flex",alignItems:"center",gap:4,background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:20,padding:"3px 9px",flexShrink:0 },
    dot:        { width:6,height:6,borderRadius:"50%",background:"#22c55e",display:"inline-block" },
    stText:     { fontSize:10,fontWeight:600,color:"#64748b",fontFamily:"'Poppins',sans-serif" },
    modal:      { background:"#ffffff",border:"1px solid #e8e3d9" },
    inp:        { background:"#f8f9fa",border:"1px solid #e2e8f0",color:"#1e293b" },
    cancelBtn:  { padding:"7px 13px",borderRadius:7,border:"1px solid #e2e8f0",background:"transparent",color:"#64748b",cursor:"pointer",fontFamily:"'Poppins',sans-serif",fontSize:12,fontWeight:600 },
    searchBox:  { background:"#f1f5f9",border:"1px solid #e2e8f0" },
    searchList: { border:"1px solid #e2e8f0",borderRadius:8,overflow:"hidden" },
    searchItem: { borderBottom:"1px solid #f1f5f9" },
    headerBg:   "#fafafa",
    divider:    "#f0ebe0",
    cardBg:     "#ffffff",
    cardBorder: "#e8e3d9",
    hoverBg:    "rgba(124,58,237,.04)",
    pgActiveBg: "rgba(124,58,237,.04)",
    titleDate:  "#d1d5db",
  };

  const TBtn = ({ icon:Icon, tip, onClick, active=false, sz=14 }) => (
    <button className="snb-tbtn snb-tt" style={{...T.tbtn,...(active?{background:"rgba(124,58,237,.14)",color:"#7c3aed"}:{})}} onClick={onClick}>
      <Icon size={sz} strokeWidth={2.2}/>
      {tip && <span className="snb-tt-text">{tip}</span>}
    </button>
  );

  /* ══════════════════════════
     NOTEBOOKS VIEW
  ══════════════════════════ */
  if(view==="notebooks") return (
    <div className="snb-root" style={{...T.root,minHeight:460}}>
      {toast && <div key={toast.key} style={T.toast}>{toast.msg}</div>}

      {/* header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",gap:8,background:T.headerBg,borderBottom:`1px solid ${T.divider}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <BookMarked size={17} color="#7c3aed" strokeWidth={2.2}/>
          </div>
          <div>
            <p style={{margin:0,fontSize:9,fontWeight:700,letterSpacing:".18em",color:T.muted,fontFamily:"'Poppins',sans-serif"}}>STUDENT NOTEBOOK</p>
            <h3 style={{margin:0,fontSize:14,fontWeight:800,color:T.tc,fontFamily:"'Poppins',sans-serif"}}>My Notebooks</h3>
          </div>
        </div>
        <div style={{display:"flex",gap:5}}>
          <TBtn icon={Search} tip="Search" onClick={()=>setShowSearch(v=>!v)} active={showSearch}/>
          <button style={{display:"inline-flex",alignItems:"center",gap:5,padding:"6px 11px",borderRadius:8,border:"none",background:"rgba(124,58,237,.12)",color:"#7c3aed",fontFamily:"'Poppins',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}
            onClick={()=>{setNewTitle("");setShowNewNBModal(true);}}>
            <Plus size={13} strokeWidth={2.5}/> New
          </button>
        </div>
      </div>

      {/* search */}
      {showSearch && (
        <div style={{padding:"8px 12px 10px",background:T.bg2,borderBottom:`1px solid ${T.divider}`,animation:"snb-slide-in .2s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",borderRadius:8,...T.searchBox}}>
            <Search size={13} color={T.muted} strokeWidth={2}/>
            <input className="snb-search-inp" style={{color:T.tc}} placeholder="Search all notes…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} autoFocus/>
            {searchQ&&<button onClick={()=>setSearchQ("")} style={{background:"transparent",border:"none",cursor:"pointer",color:T.muted,display:"flex",padding:0}}><X size={13}/></button>}
          </div>
          {searchRes.length>0 && (
            <div style={{marginTop:7,...T.searchList}}>
              {searchRes.slice(0,5).map(({nb,section,page})=>(
                <button key={page.id} onClick={()=>{setActiveNBId(nb.id);setActiveSectId(section.id);setActivePageId(page.id);setView("editor");setShowSearch(false);setSearchQ("");}}
                  style={{...T.searchItem,display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"transparent",border:"none",width:"100%",cursor:"pointer",fontFamily:"'Poppins',sans-serif"}}>
                  <FileText size={12} color={T.muted} strokeWidth={2}/>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:12,fontWeight:600,color:T.tc}}>{page.title}</div>
                    <div style={{fontSize:10,color:T.muted}}>{nb.title} › {section.title}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {searchQ.length>1&&searchRes.length===0&&<p style={{fontSize:12,color:T.muted,padding:"7px 0",fontFamily:"'Poppins',sans-serif"}}>No results.</p>}
        </div>
      )}

      {/* stats */}
      <div style={{display:"flex",gap:7,padding:"9px 12px 6px",background:T.bg,flexWrap:"wrap"}}>
        {[{I:BookOpen,v:notebooks.length,l:"Notebooks"},{I:Folder,v:notebooks.reduce((a,n)=>a+n.sections.length,0),l:"Sections"},{I:FileText,v:totalPg,l:"Pages"}].map(({I,v,l})=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 9px",borderRadius:7,background:"rgba(124,58,237,.07)",border:"1px solid rgba(124,58,237,.13)"}}>
            <I size={11} color="#7c3aed" strokeWidth={2.2}/>
            <span style={{fontFamily:"'Poppins',sans-serif",fontSize:11,fontWeight:700,color:"#7c3aed"}}>{v}</span>
            <span style={{fontFamily:"'Poppins',sans-serif",fontSize:10,color:T.muted}}>{l}</span>
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="snb-scroll" style={{flex:1,overflowY:"auto",padding:"6px 12px 14px",background:T.bg}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {notebooks.map(nb=>(
            <div key={nb.id} className="snb-nb-card"
              style={{border:`1px solid ${T.cardBorder}`,background:T.cardBg}}
              onClick={()=>{setActiveNBId(nb.id);setView("editor");}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow=`0 6px 20px ${nb.color}22`}
              onMouseLeave={e=>e.currentTarget.style.boxShadow=""}>
              <div style={{height:5,background:nb.color}}/>
              <div style={{padding:"10px 11px"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:7}}>
                  <div style={{width:30,height:30,borderRadius:8,background:`${nb.color}18`,border:`1px solid ${nb.color}28`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <BookOpen size={14} color={nb.color} strokeWidth={2.2}/>
                  </div>
                  <button onClick={e=>{e.stopPropagation();delNB(nb.id);}} style={{background:"transparent",border:"none",cursor:"pointer",opacity:.3,padding:2,borderRadius:4,display:"flex",color:T.tc}}>
                    <Trash2 size={12} strokeWidth={2}/>
                  </button>
                </div>
                <p style={{margin:"0 0 2px",fontSize:12,fontWeight:700,color:T.tc,fontFamily:"'Poppins',sans-serif",lineHeight:1.3}}>{nb.title}</p>
                <p style={{margin:0,fontSize:10,color:T.muted,fontFamily:"'Poppins',sans-serif"}}>
                  {nb.sections.length} section{nb.sections.length!==1?"s":""} · {nb.sections.reduce((a,s)=>a+s.pages.length,0)} page{nb.sections.reduce((a,s)=>a+s.pages.length,0)!==1?"s":""}
                </p>
              </div>
            </div>
          ))}
          {/* add card */}
          <div style={{borderRadius:12,border:`2px dashed ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:5,padding:"18px 10px",cursor:"pointer",transition:"border-color .2s,background .2s",minHeight:80,background:"transparent"}}
            onClick={()=>{setNewTitle("");setShowNewNBModal(true);}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#7c3aed";e.currentTarget.style.background="rgba(124,58,237,.04)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background="transparent";}}>
            <Plus size={18} color={T.muted} strokeWidth={2}/>
            <span style={{fontFamily:"'Poppins',sans-serif",fontSize:10,fontWeight:600,color:T.muted}}>New Notebook</span>
          </div>
        </div>
      </div>

      {/* New NB modal */}
      {showNewNBModal&&(
        <div className="snb-overlay" onClick={()=>setShowNewNBModal(false)}>
          <div className="snb-modal" style={T.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <BookOpen size={15} color="#7c3aed" strokeWidth={2.2}/>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:T.tc}}>New Notebook</h3>
            </div>
            <input className="snb-inp" style={T.inp} value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Notebook name…" onKeyDown={e=>e.key==="Enter"&&addNB()} autoFocus/>
            <p style={{margin:"11px 0 6px",fontSize:10,fontWeight:700,letterSpacing:".1em",color:T.muted,fontFamily:"'Poppins',sans-serif"}}>COLOR</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
              {NB_COLORS.map(c=><button key={c} onClick={()=>setNewColor(c)} style={{width:22,height:22,borderRadius:5,background:c,border:newColor===c?"3px solid white":"2px solid transparent",outline:newColor===c?`2px solid ${c}`:"none",cursor:"pointer"}}/>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowNewNBModal(false)} style={T.cancelBtn}>Cancel</button>
              <button className="snb-save-btn" onClick={addNB} style={{flex:1}}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ══════════════════════════
     EDITOR VIEW
  ══════════════════════════ */
  return (
    <div className="snb-root" style={{...T.root,minHeight:520}}>
      {toast && <div key={toast.key} style={T.toast}>{toast.msg}</div>}

      {/* top bar */}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px",background:T.headerBg,borderBottom:`1px solid ${T.divider}`,flexWrap:"wrap",flexShrink:0}}>
        <button className="snb-tbtn snb-tt" style={{...T.tbtn,width:28,height:28,borderRadius:7,border:`1px solid ${T.border}`}} onClick={()=>setView("notebooks")}>
          <ArrowLeft size={14} strokeWidth={2.2}/><span className="snb-tt-text">All Notebooks</span>
        </button>
        <div style={{width:8,height:8,borderRadius:"50%",background:activeNB?.color??"#7c3aed",flexShrink:0}}/>
        <span style={{fontFamily:"'Poppins',sans-serif",fontSize:11,fontWeight:700,color:T.tc,maxWidth:80,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeNB?.title}</span>
        <span style={{color:T.border,fontSize:11}}>›</span>
        <span style={{fontFamily:"'Poppins',sans-serif",fontSize:10,color:T.muted,maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{activeSect?.title}</span>
        <div style={{display:"flex",gap:4,marginLeft:"auto",alignItems:"center"}}>
          <TBtn icon={Search}   tip="Search"     onClick={()=>setShowSearch(v=>!v)} active={showSearch}/>
          <TBtn icon={Share2}   tip="Share"      onClick={()=>setShowShareModal(true)}/>
          <TBtn icon={Download} tip="Export .md" onClick={doExport}/>
          <TBtn icon={Copy}     tip="Copy all"   onClick={doCopy}/>
          <div style={T.statusPill}>
            {saving
              ? <><span style={{...T.dot,animation:"snb-blink .8s infinite"}}/><span style={T.stText}>Saving…</span></>
              : <><span style={{...T.dot,background:"#22c55e"}}/><span style={T.stText}>Saved</span></>}
          </div>
        </div>
      </div>

      {/* search bar */}
      {showSearch&&(
        <div style={{padding:"6px 10px 8px",background:T.bg2,borderBottom:`1px solid ${T.divider}`,animation:"snb-slide-in .2s ease"}}>
          <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",borderRadius:8,...T.searchBox}}>
            <Search size={12} color={T.muted} strokeWidth={2}/>
            <input className="snb-search-inp" style={{color:T.tc}} placeholder="Search notes…" value={searchQ} onChange={e=>setSearchQ(e.target.value)} autoFocus/>
            {searchQ&&<button onClick={()=>setSearchQ("")} style={{background:"transparent",border:"none",cursor:"pointer",display:"flex",color:T.muted,padding:0}}><X size={12}/></button>}
          </div>
          {searchRes.length>0&&(
            <div style={{marginTop:6,...T.searchList}}>
              {searchRes.slice(0,4).map(({nb,section,page})=>(
                <button key={page.id} onClick={()=>{setActiveNBId(nb.id);setActiveSectId(section.id);setActivePageId(page.id);setShowSearch(false);setSearchQ("");}}
                  style={{...T.searchItem,display:"flex",alignItems:"center",gap:8,padding:"7px 11px",background:"transparent",border:"none",width:"100%",cursor:"pointer",fontFamily:"'Poppins',sans-serif"}}>
                  <FileText size={11} color={T.muted} strokeWidth={2}/>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:600,color:T.tc}}>{page.title}</div>
                    <div style={{fontSize:10,color:T.muted}}>{nb.title} › {section.title}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* section tabs */}
      <div style={{display:"flex",alignItems:"flex-end",gap:2,padding:"0 10px",borderBottom:`1px solid ${T.divider}`,background:T.bg2,overflowX:"auto",flexShrink:0}}>
        {activeNB?.sections.map(s=>{
          const act=s.id===activeSect?.id;
          return (
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:1}}>
              <button className="snb-sec-tab"
                style={{background:act?T.bg:"transparent",color:act?s.color:T.muted,borderBottom:act?`2px solid ${s.color}`:"2px solid transparent",marginBottom:act?-1:0,fontWeight:act?700:500}}
                onClick={()=>setActiveSectId(s.id)}>
                <div style={{width:6,height:6,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                {s.title}
              </button>
              {act&&<button onClick={()=>delSect(s.id)} style={{background:"transparent",border:"none",cursor:"pointer",opacity:.3,padding:"0 2px",display:"flex",color:T.tc}}><X size={10}/></button>}
            </div>
          );
        })}
        <button className="snb-sec-tab" style={{color:T.muted,borderBottom:"2px solid transparent",background:"transparent",display:"flex",alignItems:"center",gap:4}}
          onClick={()=>{setNewTitle("");setNewColor(SEC_COLORS[(activeNB?.sections.length??0)%SEC_COLORS.length]);setShowNewSectModal(true);}}>
          <Plus size={11} strokeWidth={2.5}/> Add
        </button>
      </div>

      {/* body */}
      <div style={{display:"flex",flex:1,minHeight:0,overflow:"hidden",background:T.bg}}>

        {/* page list */}
        <div className="snb-scroll" style={{width:118,flexShrink:0,borderRight:`1px solid ${T.divider}`,overflowY:"auto",padding:"5px 0",background:T.bg2}}>
          {activeSect?.pages.map(p=>{
            const act=p.id===activePage?.id;
            return (
              <div key={p.id} style={{position:"relative"}}
                onMouseEnter={e=>{const el=e.currentTarget.querySelector(".pg-btns"); if(el)el.style.opacity="1";}}
                onMouseLeave={e=>{const el=e.currentTarget.querySelector(".pg-btns"); if(el)el.style.opacity="0";}}>
                <button className="snb-pg-item"
                  style={{borderLeftColor:act?(activeSect?.color??"#7c3aed"):"transparent",background:act?T.pgActiveBg:"transparent",color:act?T.tc:T.muted,fontWeight:act?600:400}}
                  onClick={()=>setActivePageId(p.id)}>
                  <FileText size={11} strokeWidth={2} style={{flexShrink:0}}/>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{p.title}</span>
                </button>
                <div className="pg-btns" style={{position:"absolute",right:3,top:"50%",transform:"translateY(-50%)",display:"flex",gap:1,opacity:0,transition:"opacity .15s",background:T.bg2,borderRadius:5,padding:2}}>
                  <button onClick={()=>renPg(p.id)} style={{background:"transparent",border:"none",cursor:"pointer",padding:2,display:"flex",color:T.muted}}><Edit3 size={9} strokeWidth={2}/></button>
                  <button onClick={()=>delPg(p.id)} style={{background:"transparent",border:"none",cursor:"pointer",padding:2,display:"flex",color:T.muted}}><Trash2 size={9} strokeWidth={2}/></button>
                </div>
              </div>
            );
          })}
          <button className="snb-pg-item" style={{color:T.muted,fontWeight:500}} onClick={()=>{setNewTitle("");setShowNewPageModal(true);}}>
            <Plus size={11} strokeWidth={2.5} style={{flexShrink:0}}/><span>Add page</span>
          </button>
        </div>

        {/* editor column */}
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg}}>

          {/* page title */}
          <div style={{padding:"7px 13px 4px",borderBottom:`1px solid ${T.divider}`,flexShrink:0,background:T.bg}}>
            <input
              style={{width:"100%",border:"none",outline:"none",fontFamily:"'Poppins',sans-serif",fontSize:14,fontWeight:700,background:"transparent",color:T.tc,padding:0}}
              value={activePage?.title??""}
              onChange={e=>{
                setNotebooks(nbs=>nbs.map(nb=>nb.id!==activeNBId?nb:{...nb,sections:nb.sections.map(s=>s.id!==activeSect?.id?s:{...s,pages:s.pages.map(p=>p.id!==activePage?.id?p:{...p,title:e.target.value})})}));
              }}
              placeholder="Page title…"
            />
            <div style={{display:"flex",alignItems:"center",gap:5,marginTop:1}}>
              <Clock size={9} color={T.titleDate} strokeWidth={2}/>
              <span style={{fontFamily:"'Poppins',sans-serif",fontSize:9,color:T.titleDate}}>
                {activePage?.createdAt?new Date(activePage.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):""}
              </span>
            </div>
          </div>

          {/* toolbar */}
          <div style={{borderBottom:`1px solid ${T.divider}`,flexShrink:0}}>
            <div className="snb-toolbar" style={T.toolbar}>
              <select className="snb-heading-sel" style={T.headSel} defaultValue="" onChange={onHdg}>
                <option value="" disabled>¶</option>
                <option value="# ">H1</option>
                <option value="## ">H2</option>
                <option value="### ">H3</option>
                <option value="">Normal</option>
              </select>
              <div className="snb-toolbar-sep" style={T.sep}/>
              <TBtn icon={Bold}          tip="Bold"          onClick={bold}/>
              <TBtn icon={Italic}        tip="Italic"        onClick={italic}/>
              <TBtn icon={Underline}     tip="Underline"     onClick={under}/>
              <TBtn icon={Strikethrough} tip="Strikethrough" onClick={strike}/>
              <TBtn icon={Code}          tip="Inline code"   onClick={icode}/>
              <div className="snb-toolbar-sep" style={T.sep}/>
              <TBtn icon={List}          tip="Bullet list"   onClick={blist}/>
              <TBtn icon={ListOrdered}   tip="Numbered list" onClick={nlist}/>
              <TBtn icon={CheckSquare}   tip="Checkbox"      onClick={chkbox}/>
              <TBtn icon={Quote}         tip="Blockquote"    onClick={bq}/>
              <div className="snb-toolbar-sep" style={T.sep}/>
              <TBtn icon={Code2}         tip="Code block"    onClick={cblk}/>
              <TBtn icon={Table}         tip="Table"         onClick={tbl}/>
              <TBtn icon={Link}          tip="Link"          onClick={lnk}/>
              <TBtn icon={Minus}         tip="Divider"       onClick={hRule}/>
              <TBtn icon={Calendar}      tip="Date stamp"    onClick={dstamp}/>
              <div className="snb-toolbar-sep" style={T.sep}/>
              <div style={{position:"relative"}}>
                <TBtn icon={Tag} tip="Insert tag" onClick={()=>setShowTagMenu(v=>!v)} active={showTagMenu}/>
                {showTagMenu&&(
                  <div style={{position:"absolute",top:"110%",left:0,zIndex:50,background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:7,width:148,boxShadow:"0 8px 24px rgba(0,0,0,.15)",animation:"snb-pop .15s ease"}}>
                    {TAG_OPTIONS.map(tag=>(
                      <button key={tag.label} className="snb-tag-opt" style={{color:tag.color}}
                        onClick={()=>inTag(tag)}
                        onMouseEnter={e=>e.currentTarget.style.background=tag.bg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <span style={{fontSize:12}}>{tag.icon}</span>{tag.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* textarea */}
          <div style={{flex:1,display:"flex",flexDirection:"column",padding:"11px 14px",overflow:"hidden",background:T.bg}}>
            <textarea
              ref={taRef}
              className="snb-ta snb-scroll"
              style={{...T.ta,height:"100%"}}
              value={localText}
              onChange={handleChange}
              placeholder={`Write notes for "${activePage?.title??"this page"}"…\n\nUse the toolbar to format.`}
              spellCheck
            />
          </div>

          {/* footer */}
          <div style={T.footer}>
            <div style={{display:"flex",gap:5,alignItems:"center"}}>
              <span className="snb-wbadge" style={T.wbadge}>{wc}w</span>
              <span className="snb-wbadge" style={{...T.wbadge}}>{cc}c</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button className="snb-ghost-btn" style={T.clearBtn} onClick={doClear} disabled={!localText.trim()}>
                <Trash2 size={11} strokeWidth={2}/> Clear
              </button>
              <button className="snb-save-btn" onClick={doSave}>
                <Save size={12} strokeWidth={2.2}/> Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* new section modal */}
      {showNewSectModal&&(
        <div className="snb-overlay" onClick={()=>setShowNewSectModal(false)}>
          <div className="snb-modal" style={T.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
              <Folder size={14} color="#7c3aed" strokeWidth={2.2}/>
              <h3 style={{margin:0,fontSize:13,fontWeight:700,color:T.tc}}>New Section</h3>
            </div>
            <input className="snb-inp" style={T.inp} value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Section name…" onKeyDown={e=>e.key==="Enter"&&addSect()} autoFocus/>
            <p style={{margin:"10px 0 5px",fontSize:10,fontWeight:700,letterSpacing:".1em",color:T.muted,fontFamily:"'Poppins',sans-serif"}}>COLOR</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
              {SEC_COLORS.map(c=><button key={c} onClick={()=>setNewColor(c)} style={{width:21,height:21,borderRadius:5,background:c,border:newColor===c?"3px solid white":"2px solid transparent",outline:newColor===c?`2px solid ${c}`:"none",cursor:"pointer"}}/>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowNewSectModal(false)} style={T.cancelBtn}>Cancel</button>
              <button className="snb-save-btn" onClick={addSect} style={{flex:1}}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* new page modal */}
      {showNewPageModal&&(
        <div className="snb-overlay" onClick={()=>setShowNewPageModal(false)}>
          <div className="snb-modal" style={T.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
              <FileText size={14} color="#7c3aed" strokeWidth={2.2}/>
              <h3 style={{margin:0,fontSize:13,fontWeight:700,color:T.tc}}>New Page</h3>
            </div>
            <input className="snb-inp" style={T.inp} value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Page title (optional)…" onKeyDown={e=>e.key==="Enter"&&addPg()} autoFocus/>
            <div style={{display:"flex",gap:8,marginTop:13}}>
              <button onClick={()=>setShowNewPageModal(false)} style={T.cancelBtn}>Cancel</button>
              <button className="snb-save-btn" onClick={addPg} style={{flex:1}}>Add Page</button>
            </div>
          </div>
        </div>
      )}

      {/* share modal */}
      {showShareModal&&(
        <div className="snb-overlay" onClick={()=>setShowShareModal(false)}>
          <div className="snb-modal" style={T.modal} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:13}}>
              <Share2 size={14} color="#7c3aed" strokeWidth={2.2}/>
              <h3 style={{margin:0,fontSize:13,fontWeight:700,color:T.tc}}>Share Notebook</h3>
            </div>
            <p style={{margin:"0 0 10px",fontFamily:"'Poppins',sans-serif",fontSize:12,color:T.muted}}>
              Sharing: <b style={{color:T.tc}}>{activeNB?.title}</b>
            </p>
            <input className="snb-inp" style={T.inp} type="email" value={shareEmail} onChange={e=>setShareEmail(e.target.value)} placeholder="Enter email address…" onKeyDown={e=>e.key==="Enter"&&doShare()} autoFocus/>
            <div style={{marginTop:10,padding:"7px 11px",borderRadius:7,background:"rgba(124,58,237,.08)",border:"1px solid rgba(124,58,237,.2)"}}>
              <p style={{margin:0,fontFamily:"'Poppins',sans-serif",fontSize:11,color:"#7c3aed",display:"flex",alignItems:"center",gap:5}}>
                <Hash size={11} strokeWidth={2}/> Shared notebooks are visible to invited users.
              </p>
            </div>
            <div style={{display:"flex",gap:8,marginTop:13}}>
              <button onClick={()=>setShowShareModal(false)} style={T.cancelBtn}>Cancel</button>
              <button className="snb-save-btn" onClick={doShare} style={{flex:1}}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotebook;