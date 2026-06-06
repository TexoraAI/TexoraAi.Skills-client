import { useState, useRef, useEffect, useCallback } from "react";
import {
  Globe, Monitor, Handshake, Building2, Search, Trash2, Pencil, Eye,
  Plus, ChevronDown, X, Zap, CheckCircle, AlertCircle, Info,
  LayoutList, Activity, TrendingUp, ExternalLink, RefreshCw,
  SlidersHorizontal, Upload, Link2, ImagePlus, ChevronUp, MoreHorizontal,
  GripVertical, Layers, ChevronLeft, ChevronRight, ArrowRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/* ══════════════════════════════════════════════════ DATA ══════════════════════════════════════════════════ */
const LOGO_MAP = {
  Google:"https://www.google.com/favicon.ico",Microsoft:"https://www.microsoft.com/favicon.ico",
  AWS:"https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico",
  Azure:"https://azure.microsoft.com/favicon.ico",IBM:"https://www.ibm.com/favicon.ico",
  Oracle:"https://www.oracle.com/favicon.ico",SAP:"https://www.sap.com/favicon.ico",
  Salesforce:"https://www.salesforce.com/favicon.ico",GitHub:"https://github.com/favicon.ico",
  Adobe:"https://www.adobe.com/favicon.ico",NVIDIA:"https://www.nvidia.com/favicon.ico",
  Samsung:"https://www.samsung.com/favicon.ico",Sony:"https://www.sony.com/favicon.ico",
  Apple:"https://www.apple.com/favicon.ico",Amazon:"https://www.amazon.com/favicon.ico",
  Meta:"https://www.meta.com/favicon.ico",Netflix:"https://www.netflix.com/favicon.ico",
  PayPal:"https://www.paypal.com/favicon.ico",Stripe:"https://stripe.com/favicon.ico",
  Shopify:"https://www.shopify.com/favicon.ico",LinkedIn:"https://www.linkedin.com/favicon.ico",
  Uber:"https://www.uber.com/favicon.ico",Zoom:"https://zoom.us/favicon.ico",
  Dropbox:"https://www.dropbox.com/favicon.ico",
};

const BRAND_COLORS = {
  Google:"#4285F4",Microsoft:"#0078D4",AWS:"#FF9900",Azure:"#0089D6",
  IBM:"#1F70C1",Oracle:"#C74634",SAP:"#0070C0",Salesforce:"#00A1E0",
  GitHub:"#24292e",Adobe:"#FA0F00",NVIDIA:"#76B900",Samsung:"#1428A0",
  Sony:"#e50000",Apple:"#555555",Amazon:"#FF9900",Meta:"#0668E1",
  Netflix:"#E50914",PayPal:"#003087",Stripe:"#635BFF",Shopify:"#96BF48",
  LinkedIn:"#0A66C2",Uber:"#1a1a1a",Zoom:"#2D8CFF",Dropbox:"#0061FF",
  Texora:"#FF6B2B","UFS NETWORK":"#10b981",Deloitte:"#86BC25",PwC:"#D04A02",
  KPMG:"#00338D",EY:"#FFE600",Accenture:"#A100FF",McKinsey:"#001380",
  "Boston Consulting Group":"#009B4D",Bain:"#CC0000",Infosys:"#007CC3",Wipro:"#341A5A",
};

const DROPDOWN_COMPANIES = ["Google","Microsoft","AWS","Azure","IBM","Oracle","SAP","Salesforce","GitHub","Adobe"];

const SEED = [
  {id:1,name:"AWS",shortName:"AWS",category:"Technology Partner",description:"Amazon Web Services",website:"aws.amazon.com",status:"Active"},
  {id:2,name:"Google",shortName:"GGL",category:"Technology Partner",description:"Google Cloud Platform",website:"cloud.google.com",status:"Active"},
  {id:3,name:"Amazon",shortName:"AMZN",category:"Technology Partner",description:"Amazon Web Services",website:"aws.amazon.com",status:"Active"},
  {id:4,name:"Microsoft",shortName:"MSFT",category:"Technology Partner",description:"Microsoft Azure Cloud",website:"azure.microsoft.com",status:"Active"},
  {id:5,name:"IBM",shortName:"IBM",category:"Technology Partner",description:"IBM Cloud & AI Solutions",website:"ibm.com/cloud",status:"Active"},
  {id:6,name:"Oracle",shortName:"ORC",category:"Technology Partner",description:"Oracle Cloud Infrastructure",website:"oracle.com/cloud",status:"Active"},
  {id:7,name:"SAP",shortName:"SAP",category:"Technology Partner",description:"SAP Enterprise Solutions",website:"sap.com",status:"Active"},
  {id:8,name:"Salesforce",shortName:"SF",category:"Technology Partner",description:"Salesforce CRM Platform",website:"salesforce.com",status:"Active"},
  {id:9,name:"Adobe",shortName:"ADO",category:"Technology Partner",description:"Adobe Creative Cloud",website:"adobe.com",status:"Active"},
  {id:10,name:"GitHub",shortName:"GH",category:"Technology Partner",description:"GitHub Development Platform",website:"github.com",status:"Active"},
  {id:11,name:"NVIDIA",shortName:"NV",category:"Technology Partner",description:"NVIDIA AI & GPU Computing",website:"nvidia.com",status:"Active"},
  {id:12,name:"Stripe",shortName:"STR",category:"Technology Partner",description:"Stripe Payment Infrastructure",website:"stripe.com",status:"Active"},
  {id:13,name:"Texora",shortName:"TXR",category:"Business Partner",description:"AI & Digital Solutions",website:"texora.ai",status:"Active"},
  {id:14,name:"UFS NETWORK",shortName:"UFS",category:"Business Partner",description:"Unified Consultancy Services",website:"ufsnetwork.com",status:"Active"},
  {id:15,name:"Deloitte",shortName:"DEL",category:"Business Partner",description:"Global Consulting & Advisory",website:"deloitte.com",status:"Active"},
  {id:16,name:"PwC",shortName:"PWC",category:"Business Partner",description:"PricewaterhouseCoopers Advisory",website:"pwc.com",status:"Active"},
  {id:17,name:"KPMG",shortName:"KPM",category:"Business Partner",description:"Audit, Tax & Advisory",website:"kpmg.com",status:"Active"},
  {id:18,name:"Accenture",shortName:"ACC",category:"Business Partner",description:"Technology & Consulting",website:"accenture.com",status:"Active"},
  {id:19,name:"TORA CX",shortName:"TORA",category:"Texora Product",description:"Customer experience platform",website:"toracx.texora.com",status:"Active"},
  {id:20,name:"Unified CRM",shortName:"UCRM",category:"Texora Product",description:"AI-driven CRM for sales",website:"crm.texora.com",status:"Active"},
  {id:21,name:"ILM ORA",shortName:"ILM",category:"Texora Product",description:"LMS with AI learning paths",website:"ilm.ora.texora.ai",status:"Active"},
  {id:22,name:"Innovora AI",shortName:"INNO",category:"Texora Product",description:"AI-powered innovation suite",website:"innovora.texora.com",status:"Active"},
  {id:23,name:"Task Orbit",shortName:"TASK",category:"Texora Product",description:"AI-powered task management",website:"taskorbit.texora.com",status:"Active"},
];

const CARD_GRADIENTS = [
  ["#0f172a","#1e3a5f"],["#1a0a2e","#2d1b69"],["#0d1b2a","#0a3d62"],
  ["#1a1a2e","#16213e"],["#0f2027","#203a43"],["#1e3a5f","#0a3d62"],
  ["#2c1810","#4a1a00"],["#0d0d0d","#1a1a2e"],["#1a2a1a","#0d3a1a"],
  ["#1c1c3a","#2d2d6e"],["#2a1a0a","#3d2600"],["#0a1a2a","#0a2a4a"],
];

const PROD_PALETTE = ["#3b82f6","#f59e0b","#10b981","#8b5cf6","#ef4444","#0891b2","#f97316","#ec4899","#14b8a6","#6366f1"];

let _id = 100;
const uid = () => _id++;
const getBrandColor = (n) => BRAND_COLORS[n] || "#6366f1";
const getInitials = (n="") => n.split(" ").map(w=>w[0]||"").join("").toUpperCase().slice(0,2);
const getCardGrad = (id) => CARD_GRADIENTS[(id-1) % CARD_GRADIENTS.length];

/* ══════ TOAST ══════ */
function Toasts({ items }) {
  const icons  = { success:<CheckCircle size={15}/>, error:<AlertCircle size={15}/>, info:<Info size={15}/> };
  const colors = { success:"#10b981", error:"#ef4444", info:"#3b82f6" };
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {items.map(t=>(
        <div key={t.id} style={{background:colors[t.type]||colors.info,color:"#fff",
          padding:"11px 18px",borderRadius:10,fontSize:13,fontWeight:600,
          boxShadow:"0 4px 20px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:8,minWidth:220,
          animation:"toastIn 0.3s ease"}}>
          {icons[t.type]} {t.message}
        </div>
      ))}
    </div>
  );
}

/* ══════ CONFIRM DELETE ══════ */
function ConfirmModal({ company, onConfirm, onCancel, dark }) {
  if (!company) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:3000,
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div style={{
        background: dark ? "#1e293b" : "#ffffff",
        borderRadius:20, padding:32, width:380,
        boxShadow:"0 20px 60px rgba(0,0,0,0.4)", textAlign:"center",
        border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
      }}>
        <div style={{width:56,height:56,borderRadius:16,background:"rgba(239,68,68,0.15)",
          display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",
          border:"1px solid rgba(239,68,68,0.3)"}}>
          <Trash2 size={26} color="#ef4444"/>
        </div>
        <div style={{fontWeight:700,fontSize:18,color: dark ? "#f1f5f9" : "#111827",marginBottom:8}}>Delete Company?</div>
        <div style={{fontSize:14,color: dark ? "#94a3b8" : "#6b7280",marginBottom:24}}>
          Remove <strong style={{color: dark ? "#e2e8f0" : "#374151"}}>{company.name}</strong>? This cannot be undone.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:10,
            border: dark ? "1px solid #334155" : "1.5px solid #e2e8f0",
            background: dark ? "#0f172a" : "#f8fafc",
            color: dark ? "#94a3b8" : "#374151",
            fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <X size={15}/> Cancel
          </button>
          <button onClick={onConfirm} style={{flex:1,padding:"10px 0",borderRadius:10,
            border:"none",background:"#ef4444",color:"#fff",
            fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Trash2 size={15}/> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════ VIEW ALL MODAL ══════ */
function ViewAllModal({ title, items, onClose, onEdit, onDelete, onView, dark, icon, color }) {
  const [q, setQ] = useState("");
  const filtered = items.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    (c.description||"").toLowerCase().includes(q.toLowerCase())
  );
  const bg   = dark ? "#0f172a" : "#f8fafc";
  const card = dark ? "#1e293b" : "#ffffff";
  const bord = dark ? "#334155" : "#e2e8f0";
  const txt  = dark ? "#f1f5f9" : "#111827";
  const sub  = dark ? "#94a3b8" : "#6b7280";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:4000,
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:card,borderRadius:24,width:"min(860px,95vw)",maxHeight:"85vh",
        display:"flex",flexDirection:"column",overflow:"hidden",
        boxShadow:"0 30px 80px rgba(0,0,0,0.5)",border:`1px solid ${bord}`}}>
        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${bord}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${color}18`,
              display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px solid ${color}33`}}>
              <span style={{color}}>{icon}</span>
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:16,color:txt,fontFamily:"'Sora',sans-serif"}}>{title}</div>
              <div style={{fontSize:12,color:sub}}>{filtered.length} of {items.length} shown</div>
            </div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,border:`1px solid ${bord}`,
            background:bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X size={15} color={sub}/>
          </button>
        </div>
        {/* Search */}
        <div style={{padding:"12px 24px",borderBottom:`1px solid ${bord}`,flexShrink:0}}>
          <div style={{position:"relative"}}>
            <Search size={14} color={sub} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}...`}
              style={{width:"100%",padding:"9px 12px 9px 36px",borderRadius:9,
                border:`1.5px solid ${bord}`,background:bg,fontSize:13,
                color:txt,fontFamily:"inherit",boxSizing:"border-box",outline:"none"}}/>
          </div>
        </div>
        {/* Grid */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {filtered.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 0",color:sub}}>No results found</div>
          ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:14}}>
              {filtered.map(co=>(
                <div key={co.id} style={{
                  background:bg,borderRadius:14,padding:"14px 16px",
                  border:`1px solid ${bord}`,
                  borderTop:`3px solid ${getBrandColor(co.name)}`,
                  transition:"all 0.2s",cursor:"pointer",
                }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 8px 20px ${getBrandColor(co.name)}22`;e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${getBrandColor(co.name)}15`,
                      border:`1px solid ${getBrandColor(co.name)}30`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {LOGO_MAP[co.name]?(
                        <img src={LOGO_MAP[co.name]} alt="" style={{width:26,height:26,objectFit:"contain"}}
                          onError={e=>e.target.style.display="none"}/>
                      ):(
                        <span style={{fontWeight:800,fontSize:14,color:getBrandColor(co.name),fontFamily:"'Sora',sans-serif"}}>
                          {getInitials(co.name)}
                        </span>
                      )}
                    </div>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,
                      background:co.status==="Active"?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",
                      color:co.status==="Active"?"#10b981":"#ef4444",
                      border:`1px solid ${co.status==="Active"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`}}>
                      {co.status}
                    </span>
                  </div>
                  <div style={{fontWeight:700,fontSize:14,color:txt,marginBottom:3,fontFamily:"'Sora',sans-serif"}}>{co.name}</div>
                  <div style={{fontSize:12,color:sub,marginBottom:10,lineHeight:1.4}}>{co.description||"—"}</div>
                  <div style={{display:"flex",gap:6}}>
                    {[
                      {label:"View",fn:()=>{onClose();onView(co);},col:color},
                      {label:"Edit",fn:()=>{onClose();onEdit(co);},col:"#7c3aed"},
                      {label:"Del",fn:()=>{onClose();onDelete(co);},col:"#ef4444"},
                    ].map(({label,fn,col})=>(
                      <button key={label} onClick={e=>{e.stopPropagation();fn();}} style={{
                        flex:1,padding:"5px 0",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",
                        border:`1px solid ${col}30`,background:`${col}10`,color:col,
                        display:"flex",alignItems:"center",justifyContent:"center",gap:3,transition:"all 0.15s",
                      }}
                        onMouseEnter={e=>e.currentTarget.style.background=`${col}22`}
                        onMouseLeave={e=>e.currentTarget.style.background=`${col}10`}>
                        {label==="View"&&<Eye size={10}/>}
                        {label==="Edit"&&<Pencil size={10}/>}
                        {label==="Del"&&<Trash2 size={10}/>}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════ VIEW MODAL ══════ */
function ViewModal({ company, onClose, onEdit, dark }) {
  if (!company) return null;
  const color = getBrandColor(company.name);
  const [g1,g2] = getCardGrad(company.id);
  const modalBg   = dark ? "#1e293b" : "#ffffff";
  const borderCol = dark ? "#334155" : "#e2e8f0";
  const labelCol  = dark ? "#475569" : "#64748b";
  const textCol   = dark ? "#e2e8f0" : "#374151";
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:4500,
      display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:modalBg,borderRadius:24,width:460,overflow:"hidden",
        boxShadow:"0 30px 80px rgba(0,0,0,0.5)",border:`1px solid ${borderCol}`}}>
        <div style={{background:`linear-gradient(145deg,${g1},${g2})`,
          padding:"24px 24px 20px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,
            borderRadius:"50%",background:`${color}33`,filter:"blur(30px)"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:56,height:56,borderRadius:14,
                background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",
                border:"1px solid rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {LOGO_MAP[company.name]?(
                  <img src={LOGO_MAP[company.name]} alt={company.name}
                    style={{width:38,height:38,objectFit:"contain"}}
                    onError={e=>e.target.style.display="none"}/>
                ):(
                  <span style={{fontWeight:800,fontSize:20,color:"#fff",fontFamily:"'Sora',sans-serif"}}>
                    {getInitials(company.name)}
                  </span>
                )}
              </div>
              <div>
                <div style={{fontWeight:800,fontSize:20,color:"#fff",fontFamily:"'Sora',sans-serif"}}>{company.name}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.6)"}}>{company.shortName}</div>
              </div>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.15)",border:"none",
              borderRadius:8,width:30,height:30,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <X size={15} color="#fff"/>
            </button>
          </div>
        </div>
        <div style={{padding:"20px 24px 24px"}}>
          {[["Description",company.description],["Category",company.category],
            ["Status",company.status],["Website",company.website]].map(([lbl,val])=>val?(
            <div key={lbl} style={{marginBottom:10,padding:"10px 14px",
              background: dark?"rgba(255,255,255,0.04)":"#f8fafc",
              borderRadius:10,border:`1px solid ${borderCol}`}}>
              <div style={{fontSize:10,fontWeight:700,color:labelCol,marginBottom:2,
                textTransform:"uppercase",letterSpacing:"0.05em"}}>{lbl}</div>
              <div style={{fontSize:14,color:textCol,fontWeight:500,
                display:"flex",alignItems:"center",gap:6}}>
                {lbl==="Website"&&<ExternalLink size={12} color={labelCol}/>}{val}
              </div>
            </div>
          ):null)}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={onClose} style={{flex:1,padding:"10px 0",borderRadius:10,
              border:`1px solid ${borderCol}`,
              background: dark?"#0f172a":"#f8fafc",
              color: dark?"#94a3b8":"#374151",
              fontSize:14,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <X size={15}/> Close
            </button>
            <button onClick={()=>{onClose();onEdit(company);}} style={{flex:1,padding:"10px 0",
              borderRadius:10,border:"none",
              background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"#fff",
              fontSize:14,fontWeight:700,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              <Pencil size={15}/> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════ INLINE DRAWER FORM ══════ */
const EMPTY = {name:"",shortName:"",description:"",website:"",
  category:"Technology Partner",status:"Active",logoUrl:"",uploadedLogo:null};
const MIN_DRAWER = 400;
const DEFAULT_DRAWER = 520;
const MAX_DRAWER = 700;

function CompanyDrawer({ open, mode, initial, onClose, onSave, dark, drawerWidth, onDragStart }) {
  const [form, setForm] = useState(EMPTY);
  const [logoTab, setLogoTab] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const [companyDrop, setCompanyDrop] = useState(false);
  const fileRef = useRef(null);
  const dropRef = useRef(null);
  const isEdit = mode === "edit";

  useEffect(()=>{ if(open){ setForm(initial||EMPTY); setLogoTab("upload"); setCompanyDrop(false); } },[open,initial]);
  useEffect(()=>{
    const h=(e)=>{ if(dropRef.current&&!dropRef.current.contains(e.target)) setCompanyDrop(false); };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const set=(f,v)=>setForm(p=>({...p,[f]:v}));
  const handleFile=(file)=>{
    if(!file)return;
    const r=new FileReader(); r.onload=(e)=>set("uploadedLogo",e.target.result); r.readAsDataURL(file);
  };
  const pickCompany=(name)=>{
    const info=SEED.find(s=>s.name===name)||{};
    setForm(p=>({...p,name,shortName:info.shortName||name.slice(0,4).toUpperCase(),
      description:info.description||"",website:info.website||"",
      category:info.category||"Technology Partner",uploadedLogo:null,logoUrl:""}));
    setCompanyDrop(false);
  };
  const handleSave=()=>{
    if(!form.name.trim())return;
    onSave({...form,name:form.name.trim(),shortName:form.shortName||form.name.slice(0,4).toUpperCase()});
  };

  const modalBg   = dark ? "#1e293b" : "#ffffff";
  const bodyBg    = dark ? "#0f172a" : "#f8fafc";
  const borderCol = dark ? "#334155" : "#e2e8f0";
  const inputCol  = dark ? "#f1f5f9" : "#1e293b";
  const labelCol  = dark ? "#64748b" : "#475569";
  const textSub   = dark ? "#94a3b8" : "#6b7280";
  const dropHover = dark ? "#0f172a" : "#f0f9ff";
  const dropItemC = dark ? "#e2e8f0" : "#1e293b";
  const dropItemB = dark ? "transparent" : "#fff";
  const headerGrad = isEdit
    ? "linear-gradient(135deg,#7c3aed,#a855f7)"
    : "linear-gradient(135deg,#0e7490,#0891b2)";
  const INP = {
    width:"100%",padding:"10px 14px",borderRadius:8,
    border:`1px solid ${borderCol}`,fontSize:13,color:inputCol,
    background:bodyBg,outline:"none",fontFamily:"inherit",boxSizing:"border-box",
  };
  const LBL = {
    fontSize:11,fontWeight:700,color:labelCol,display:"block",
    marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em",
  };

  return (
    <div style={{
      width: open ? drawerWidth : 0,
      minWidth: open ? MIN_DRAWER : 0,
      flexShrink: 0,
      height: "100%",
      position: "relative",
      display: "flex",
      transition: open ? "none" : "width 0.3s cubic-bezier(0.4,0,0.2,1)",
      overflow: "visible",
    }}>
      {open && (
        <div onMouseDown={onDragStart} style={{
          position:"absolute",left:-6,top:0,bottom:0,width:12,
          cursor:"col-resize",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none",
        }}>
          <div style={{width:4,height:"100%",background:dark?"#334155":"#e2e8f0",borderRadius:2,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{position:"absolute",display:"flex",flexDirection:"column",alignItems:"center",gap:3,pointerEvents:"none"}}>
              <GripVertical size={16} color={dark?"#475569":"#94a3b8"}/>
            </div>
          </div>
        </div>
      )}
      <div style={{
        width:"100%",height:"100%",background:modalBg,
        borderLeft: open ? `1px solid ${borderCol}` : "none",
        display:"flex",flexDirection:"column",overflow:"hidden",
        opacity: open ? 1 : 0,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition:"opacity 0.25s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {open && <>
          <div style={{background:headerGrad,padding:"16px 20px",
            display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isEdit?<Pencil size={16} color="#fff"/>:<Plus size={18} color="#fff"/>}
              </div>
              <div>
                <div style={{fontWeight:800,fontSize:15,color:"#fff",fontFamily:"'Sora',sans-serif"}}>
                  {isEdit?"Edit Company":"Add New Company"}
                </div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1}}>
                  {isEdit?"Update company details":"Register a new company"}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:"none",
              background:"rgba(255,255,255,0.2)",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <X size={15} color="#fff"/>
            </button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={LBL}>Company Logo</label>
              <div style={{display:"flex",borderRadius:8,border:`1px solid ${borderCol}`,overflow:"hidden",marginBottom:10}}>
                {[["upload","Upload File",<Upload size={12}/>],["url","Logo URL",<Link2 size={12}/>]].map(([k,l,ic])=>(
                  <button key={k} onClick={()=>setLogoTab(k)} style={{
                    flex:1,padding:"7px 0",border:"none",cursor:"pointer",
                    background:logoTab===k?(isEdit?"#7c3aed":"#0891b2"):(dark?"#0f172a":"#f8fafc"),
                    color:logoTab===k?"#fff":(dark?"#64748b":"#64748b"),
                    fontSize:12,fontWeight:600,
                    display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.15s",
                  }}>{ic}{l}</button>
                ))}
              </div>
              {logoTab==="upload"&&(
                <div onClick={()=>fileRef.current?.click()}
                  onDragOver={e=>{e.preventDefault();setDragOver(true);}}
                  onDragLeave={()=>setDragOver(false)}
                  onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0]);}}
                  style={{
                    border:`2px dashed ${dragOver?"#0891b2":borderCol}`,borderRadius:10,padding:"16px 12px",
                    background:dragOver?(dark?"rgba(8,145,178,0.1)":"#e0f7fa"):bodyBg,
                    cursor:"pointer",textAlign:"center",transition:"all 0.2s",
                  }}>
                  {form.uploadedLogo ? (
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <img src={form.uploadedLogo} alt="logo"
                        style={{width:56,height:56,objectFit:"contain",borderRadius:10,
                          border:`1px solid ${borderCol}`,background:modalBg,padding:4}}/>
                      <span style={{fontSize:12,color:"#0891b2",fontWeight:600}}>Click to change</span>
                    </div>
                  ):(
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                      <div style={{width:38,height:38,borderRadius:10,background:"rgba(8,145,178,0.12)",
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <ImagePlus size={20} color="#0891b2"/>
                      </div>
                      <div style={{fontSize:12,fontWeight:600,color:dark?"#94a3b8":"#374151"}}>Click to browse or drag & drop</div>
                      <div style={{fontSize:11,color:dark?"#475569":"#94a3b8"}}>PNG, JPG, SVG, WebP</div>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>handleFile(e.target.files[0])}/>
                </div>
              )}
              {logoTab==="url"&&(
                <input style={INP} placeholder="https://logo.clearbit.com/company.com"
                  value={form.logoUrl} onChange={e=>set("logoUrl",e.target.value)}/>
              )}
            </div>
            <div ref={dropRef} style={{position:"relative"}}>
              <label style={LBL}>Select Existing Company</label>
              <button onClick={()=>setCompanyDrop(o=>!o)} style={{
                width:"100%",padding:"10px 14px",borderRadius:8,
                border:`1px solid ${borderCol}`,background:bodyBg,
                fontSize:13,color:form.name?(dark?"#f1f5f9":"#1e293b"):(dark?"#475569":"#94a3b8"),
                cursor:"pointer",fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"space-between",
              }}>
                <span style={{display:"flex",alignItems:"center",gap:8}}>
                  {form.name&&LOGO_MAP[form.name]&&(
                    <img src={LOGO_MAP[form.name]} alt="" style={{width:16,height:16,objectFit:"contain"}}
                      onError={e=>e.target.style.display="none"}/>
                  )}
                  {form.name||"Pick a company to auto-fill…"}
                </span>
                {companyDrop?<ChevronUp size={14} color={labelCol}/>:<ChevronDown size={14} color={labelCol}/>}
              </button>
              {companyDrop&&(
                <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:200,
                  background:modalBg,borderRadius:10,border:`1px solid ${borderCol}`,
                  boxShadow:"0 8px 30px rgba(0,0,0,0.25)",maxHeight:200,overflowY:"auto"}}>
                  {DROPDOWN_COMPANIES.map(name=>(
                    <div key={name} onClick={()=>pickCompany(name)} style={{
                      padding:"9px 14px",cursor:"pointer",fontSize:13,color:dropItemC,
                      display:"flex",alignItems:"center",gap:10,
                      borderBottom:`1px solid ${dark?"#0f172a":"#f1f5f9"}`,
                      transition:"background 0.1s",background:dropItemB,
                    }}
                      onMouseEnter={e=>e.currentTarget.style.background=dropHover}
                      onMouseLeave={e=>e.currentTarget.style.background=dropItemB}>
                      {LOGO_MAP[name]&&(
                        <img src={LOGO_MAP[name]} alt="" style={{width:16,height:16,objectFit:"contain"}}
                          onError={e=>e.target.style.display="none"}/>
                      )}
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>Company Name *</label>
                <input style={INP} placeholder="e.g. Google Cloud" value={form.name} onChange={e=>set("name",e.target.value)}/>
              </div>
              <div>
                <label style={LBL}>Short Name</label>
                <input style={INP} placeholder="e.g. GGL" value={form.shortName} onChange={e=>set("shortName",e.target.value)}/>
              </div>
            </div>
            <div>
              <label style={LBL}>Description</label>
              <textarea style={{...INP,resize:"vertical",minHeight:64}}
                placeholder="Brief description..." value={form.description} onChange={e=>set("description",e.target.value)}/>
            </div>
            <div>
              <label style={LBL}>Website</label>
              <input style={INP} placeholder="e.g. company.com" value={form.website} onChange={e=>set("website",e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={LBL}>Category</label>
                <select style={{...INP,cursor:"pointer"}} value={form.category} onChange={e=>set("category",e.target.value)}>
                  <option>Technology Partner</option>
                  <option>Business Partner</option>
                  <option>Texora Product</option>
                </select>
              </div>
              <div>
                <label style={LBL}>Status</label>
                <select style={{...INP,cursor:"pointer"}} value={form.status} onChange={e=>set("status",e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            {form.name.trim()&&(
              <div style={{padding:"12px 14px",background:bodyBg,borderRadius:12,border:`1px solid ${borderCol}`}}>
                <div style={{fontSize:10,fontWeight:700,color:labelCol,marginBottom:8,
                  textTransform:"uppercase",letterSpacing:"0.06em"}}>Preview</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,borderRadius:10,flexShrink:0,
                    background:`${getBrandColor(form.name)}22`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    border:`2px solid ${getBrandColor(form.name)}44`}}>
                    {(form.uploadedLogo||(logoTab==="url"&&form.logoUrl))?(
                      <img src={form.uploadedLogo||form.logoUrl} alt="" style={{width:32,height:32,objectFit:"contain",borderRadius:6}}
                        onError={e=>e.target.style.display="none"}/>
                    ):LOGO_MAP[form.name]?(
                      <img src={LOGO_MAP[form.name]} alt="" style={{width:26,height:26,objectFit:"contain"}}
                        onError={e=>e.target.style.display="none"}/>
                    ):(
                      <span style={{fontWeight:800,fontSize:13,color:getBrandColor(form.name),fontFamily:"'Sora',sans-serif"}}>
                        {getInitials(form.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:dark?"#f1f5f9":"#111827"}}>{form.name}</div>
                    <div style={{fontSize:12,color:textSub}}>{form.description||"No description"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{padding:"12px 20px",borderTop:`1px solid ${borderCol}`,
            display:"flex",gap:10,background:modalBg,flexShrink:0}}>
            <button onClick={onClose} style={{flex:1,padding:"10px 0",borderRadius:10,
              border:`1px solid ${borderCol}`,background:dark?"#0f172a":"#f8fafc",
              color:dark?"#94a3b8":"#374151",fontSize:13,fontWeight:600,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <X size={14}/> Cancel
            </button>
            <button onClick={handleSave} disabled={!form.name.trim()} style={{
              flex:2,padding:"10px 0",borderRadius:10,border:"none",
              background:form.name.trim()?headerGrad:(dark?"#1e293b":"#e5e7eb"),
              color:form.name.trim()?"#fff":(dark?"#475569":"#9ca3af"),
              fontSize:13,fontWeight:700,cursor:form.name.trim()?"pointer":"not-allowed",
              display:"flex",alignItems:"center",justifyContent:"center",gap:7,
              transition:"all 0.2s",opacity:form.name.trim()?1:0.6,
            }}>
              {isEdit?<><RefreshCw size={14}/> Update Company</>:<><Plus size={14}/> Add Company</>}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ══════ SWIPER CAROUSEL SECTION ══════ */
function CarouselSection({
  title, subtitle, icon, color, badgeBg, badgeColor, items,
  onEdit, onDelete, onView, onAdd, openViewAll, dark,
  renderCard, slidesPerView = { mobile: 1, tablet: 3, desktop: 5 }
}) {
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [swiperInst, setSwiperInst] = useState(null);
  const containerRef = useRef(null);

  const card = dark ? "#1e293b" : "#ffffff";
  const bord = dark ? "#334155" : "#e2e8f0";
  const txt  = dark ? "#f1f5f9" : "#111827";
  const sub  = dark ? "#94a3b8" : "#6b7280";

  useEffect(() => {
    if (!swiperRef.current) return;
    // Dynamic import-like using global Swiper from CDN loaded in parent
    const sw = new window.Swiper(swiperRef.current, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: items.length > 5,
      autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: swiperRef.current.querySelector(".swiper-pagination"), clickable: true },
      navigation: {
        prevEl: prevRef.current,
        nextEl: nextRef.current,
      },
      on: {
        slideChange(s) { setActiveIdx(s.realIndex); },
      },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 14 },
        768: { slidesPerView: slidesPerView.tablet || 3, spaceBetween: 14 },
        1200: { slidesPerView: slidesPerView.desktop || 5, spaceBetween: 16 },
      },
    });
    setSwiperInst(sw);
    return () => { try { sw.destroy(true, true); } catch(e) {} };
  }, [items.length]);

  const totalPages = Math.ceil(items.length / (slidesPerView.desktop || 5));

  return (
    <div ref={containerRef} style={{
      background: card,
      borderRadius: 20,
      border: `1px solid ${bord}`,
      padding: "24px 24px 20px",
      marginBottom: 20,
      boxShadow: dark ? "none" : "0 2px 12px rgba(0,0,0,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative glow */}
      <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,
        borderRadius:"50%",background:`${color}10`,filter:"blur(40px)",pointerEvents:"none"}}/>

      {/* Section Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:`${color}15`,
            border:`1.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color,display:"flex"}}>{icon}</span>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,color}}>{title}</span>
              <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:badgeBg,color:badgeColor}}>
                {items.length}+ {subtitle}
              </span>
            </div>
            <div style={{fontSize:12,color:sub,marginTop:2}}>
              Swipe or use arrows to navigate all partners
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={openViewAll} style={{
            padding:"7px 14px",borderRadius:9,border:`1.5px solid ${color}40`,
            background:`${color}10`,color,fontSize:12,fontWeight:700,cursor:"pointer",
            display:"flex",alignItems:"center",gap:5,transition:"all 0.15s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${color}20`;}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${color}10`;}}>
            View All <ArrowRight size={13}/>
          </button>
          <button onClick={onAdd} style={{
            padding:"7px 12px",borderRadius:9,border:"none",
            background:`linear-gradient(135deg,${color},${color}cc)`,
            color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",
            display:"flex",alignItems:"center",gap:5,
          }}>
            <Plus size={13}/> Add
          </button>
        </div>
      </div>

      {/* Swiper */}
      <div style={{position:"relative"}}>
        {/* Prev/Next Arrows */}
        <button ref={prevRef} style={{
          position:"absolute",left:-14,top:"50%",transform:"translateY(-50%)",
          zIndex:10,width:34,height:34,borderRadius:"50%",
          border:`1.5px solid ${bord}`,background:card,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 12px rgba(0,0,0,0.15)",transition:"all 0.15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.borderColor=color;e.currentTarget.querySelector("svg").style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background=card;e.currentTarget.style.borderColor=bord;}}>
          <ChevronLeft size={16} color={sub} style={{transition:"color 0.15s"}}/>
        </button>
        <button ref={nextRef} style={{
          position:"absolute",right:-14,top:"50%",transform:"translateY(-50%)",
          zIndex:10,width:34,height:34,borderRadius:"50%",
          border:`1.5px solid ${bord}`,background:card,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 12px rgba(0,0,0,0.15)",transition:"all 0.15s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background=color;e.currentTarget.style.borderColor=color;}}
          onMouseLeave={e=>{e.currentTarget.style.background=card;e.currentTarget.style.borderColor=bord;}}>
          <ChevronRight size={16} color={sub}/>
        </button>

        <div ref={swiperRef} className="swiper" style={{overflow:"hidden",padding:"4px 2px 32px"}}>
          <div className="swiper-wrapper">
            {items.map((item, idx) => (
              <div key={item.id} className="swiper-slide" style={{height:"auto"}}>
                {renderCard(item, idx)}
              </div>
            ))}
          </div>
          <div className="swiper-pagination" style={{bottom:4}}/>
        </div>
      </div>
    </div>
  );
}

/* ══════ PARTNER CARD (light) ══════ */
function PartnerCard({ company, onEdit, onDelete, onView, dark }) {
  const [hov, setHov] = useState(false);
  const color = getBrandColor(company.name);
  const card = dark ? "#0f172a" : "#f8fafc";
  const bord = dark ? "#1e293b" : "#e2e8f0";
  const txt  = dark ? "#f1f5f9" : "#111827";
  const sub  = dark ? "#64748b" : "#94a3b8";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background: card,
      borderRadius: 14,
      padding: "16px 14px",
      border: `1.5px solid ${hov ? color+"55" : bord}`,
      borderTop: `3px solid ${color}`,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      cursor: "pointer",
      transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
      transform: hov ? "translateY(-3px)" : "none",
      boxShadow: hov ? `0 12px 24px ${color}20` : "none",
      position: "relative",
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{position:"absolute",top:-16,right:-16,width:64,height:64,
        borderRadius:"50%",background:`${color}12`,filter:"blur(16px)",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{width:44,height:44,borderRadius:10,
          background:`${color}15`,border:`1.5px solid ${color}30`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {LOGO_MAP[company.name]?(
            <img src={LOGO_MAP[company.name]} alt={company.name}
              style={{width:28,height:28,objectFit:"contain"}}
              onError={e=>e.target.style.display="none"}/>
          ):(
            <span style={{fontWeight:800,fontSize:15,color,fontFamily:"'Sora',sans-serif"}}>
              {getInitials(company.name)}
            </span>
          )}
        </div>
        <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,
          background:company.status==="Active"?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",
          color:company.status==="Active"?"#10b981":"#ef4444",
          border:`1px solid ${company.status==="Active"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`}}>
          {company.status}
        </span>
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:13,color,fontFamily:"'Sora',sans-serif",marginBottom:2}}>{company.name}</div>
        <div style={{fontSize:11,color:sub,lineHeight:1.4,
          overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {company.description||company.shortName||"Partner"}
        </div>
        {company.website&&(
          <div style={{fontSize:10,color:sub,marginTop:4,display:"flex",alignItems:"center",gap:3}}>
            <ExternalLink size={9}/>{company.website}
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:5,borderTop:`1px solid ${dark?"rgba(255,255,255,0.05)":bord}`,paddingTop:8}}>
        {[
          {label:"View",icon:<Eye size={10}/>,col:color,fn:()=>onView(company)},
          {label:"Edit",icon:<Pencil size={10}/>,col:"#7c3aed",fn:()=>onEdit(company)},
          {label:"Del",icon:<Trash2 size={10}/>,col:"#ef4444",fn:()=>onDelete(company)},
        ].map(({label,icon,col,fn})=>(
          <button key={label} onClick={e=>{e.stopPropagation();fn();}} style={{
            flex:1,padding:"5px 0",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",
            border:`1px solid ${col}25`,background:`${col}0d`,color:col,
            display:"flex",alignItems:"center",justifyContent:"center",gap:3,transition:"all 0.12s",
          }}
            onMouseEnter={e=>e.currentTarget.style.background=`${col}22`}
            onMouseLeave={e=>e.currentTarget.style.background=`${col}0d`}>
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════ PRODUCT CARD ══════ */
function ProductCard({ prod, idx, onEdit, onDelete, onView, dark }) {
  const [hov, setHov] = useState(false);
  const prodColor = BRAND_COLORS[prod.name] || PROD_PALETTE[idx % PROD_PALETTE.length];
  const logoSrc = prod.uploadedLogo || (prod.logoUrl) || LOGO_MAP[prod.name];
  const card = dark ? "#0f172a" : "#f8fafc";
  const bord = dark ? "#1e293b" : "#e2e8f0";
  const txt  = dark ? "#f1f5f9" : "#111827";
  const sub  = dark ? "#64748b" : "#94a3b8";
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background: card,
      borderRadius: 14,
      padding: "16px 14px",
      border: `1.5px solid ${hov ? prodColor+"55" : bord}`,
      borderTop: `3px solid ${prodColor}`,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      cursor: "pointer",
      transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
      transform: hov ? "translateY(-3px)" : "none",
      boxShadow: hov ? `0 12px 24px ${prodColor}20` : "none",
      position: "relative",
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{position:"absolute",top:-16,right:-16,width:64,height:64,
        borderRadius:"50%",background:`${prodColor}12`,filter:"blur(16px)",pointerEvents:"none"}}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{width:44,height:44,borderRadius:10,
          background:`${prodColor}15`,border:`1.5px solid ${prodColor}30`,
          display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {logoSrc ? (
            <img src={logoSrc} alt={prod.name} style={{width:28,height:28,objectFit:"contain",borderRadius:6}}
              onError={e=>e.target.style.display="none"}/>
          ):(
            <span style={{fontWeight:800,fontSize:15,color:prodColor,fontFamily:"'Sora',sans-serif"}}>
              {getInitials(prod.name)}
            </span>
          )}
        </div>
        <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,
          background:prod.status==="Active"?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)",
          color:prod.status==="Active"?"#10b981":"#ef4444",
          border:`1px solid ${prod.status==="Active"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`}}>
          {prod.status}
        </span>
      </div>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,fontSize:13,color:prodColor,fontFamily:"'Sora',sans-serif",marginBottom:2}}>{prod.name}</div>
        <div style={{fontSize:11,color:sub,lineHeight:1.4,
          overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
          {prod.description||prod.shortName||"Texora Product"}
        </div>
        {prod.website&&(
          <div style={{fontSize:10,color:sub,marginTop:4,display:"flex",alignItems:"center",gap:3}}>
            <ExternalLink size={9}/>{prod.website}
          </div>
        )}
      </div>
      <button onClick={e=>{e.stopPropagation();onView(prod);}} style={{
        width:"100%",padding:"6px 0",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",
        border:`1.5px solid ${prodColor}40`,background:`${prodColor}12`,color:prodColor,
        display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.15s",
      }}
        onMouseEnter={e=>e.currentTarget.style.background=`${prodColor}25`}
        onMouseLeave={e=>e.currentTarget.style.background=`${prodColor}12`}>
        Explore <ArrowRight size={11}/>
      </button>
      <div style={{display:"flex",gap:5,borderTop:`1px solid ${dark?"rgba(255,255,255,0.05)":bord}`,paddingTop:6}}>
        {[
          {label:"Edit",icon:<Pencil size={10}/>,col:"#7c3aed",fn:()=>onEdit(prod)},
          {label:"Del",icon:<Trash2 size={10}/>,col:"#ef4444",fn:()=>onDelete(prod)},
        ].map(({label,icon,col,fn})=>(
          <button key={label} onClick={e=>{e.stopPropagation();fn();}} style={{
            flex:1,padding:"5px 0",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",
            border:`1px solid ${col}25`,background:`${col}0d`,color:col,
            display:"flex",alignItems:"center",justifyContent:"center",gap:3,transition:"all 0.12s",
          }}
            onMouseEnter={e=>e.currentTarget.style.background=`${col}22`}
            onMouseLeave={e=>e.currentTarget.style.background=`${col}0d`}>
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════ MAIN PAGE ══════ */
export default function TopGlobalCompanies() {
  const { dark } = useTheme();

  const [companies, setCompanies]   = useState(SEED);
  const [search, setSearch]         = useState("");
  const [catFilter, setCatFilter]   = useState("All");
  const [statFilter, setStatFilter] = useState("All");
  const [drawer, setDrawer]         = useState({open:false,mode:"add",initial:null});
  const [viewCo, setViewCo]         = useState(null);
  const [deleteCo, setDeleteCo]     = useState(null);
  const [toasts, setToasts]         = useState([]);
  const [quickName, setQuickName]   = useState("");
  const [dropOpen, setDropOpen]     = useState(false);
  const [viewAllModal, setViewAllModal] = useState(null); // {title,items,icon,color}
  const [drawerWidth, setDrawerWidth] = useState(DEFAULT_DRAWER);
  const [swiperLoaded, setSwiperLoaded] = useState(false);

  const isResizing = useRef(false);
  const startX     = useRef(0);
  const startW     = useRef(DEFAULT_DRAWER);
  const dropRef    = useRef(null);

  const pageBg    = dark ? "#0b1120" : "#f1f5f9";
  const cardBg    = dark ? "#1e293b" : "#ffffff";
  const borderCol = dark ? "#334155" : "#e2e8f0";
  const titleText = dark ? "#f1f5f9" : "#111827";
  const subText   = dark ? "#94a3b8" : "#6b7280";
  const mutedText = dark ? "#475569" : "#9ca3af";
  const inputBg   = dark ? "#0f172a" : "#f8fafc";
  const inputText = dark ? "#f1f5f9" : "#111827";

  // Load Swiper from CDN
  useEffect(() => {
    if (window.Swiper) { setSwiperLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
    script.onload = () => setSwiperLoaded(true);
    document.head.appendChild(script);
  }, []);

  /* Resize logic */
  const handleDragStart = useCallback((e) => {
    isResizing.current = true;
    startX.current = e.clientX;
    startW.current = drawerWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [drawerWidth]);

  useEffect(() => {
    const onMove = (e) => {
      if (!isResizing.current) return;
      const delta = startX.current - e.clientX;
      const newW = Math.min(MAX_DRAWER, Math.max(MIN_DRAWER, startW.current + delta));
      setDrawerWidth(newW);
    };
    const onUp = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  useEffect(()=>{
    const h=(e)=>{if(dropRef.current&&!dropRef.current.contains(e.target))setDropOpen(false);};
    document.addEventListener("mousedown",h); return()=>document.removeEventListener("mousedown",h);
  },[]);

  const toast=(message,type="success")=>{
    const id=Date.now(); setToasts(t=>[...t,{id,message,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  };

  const openAdd   = ()   => setDrawer({open:true,mode:"add",initial:null});
  const openEdit  = (co) => setDrawer({open:true,mode:"edit",initial:{...co}});
  const closeDrawer = () => setDrawer(d=>({...d,open:false}));

  const handleSave=(form)=>{
    if(drawer.mode==="edit"){
      setCompanies(c=>c.map(x=>x.id===form.id?{...x,...form}:x));
      toast(`${form.name} updated!`,"success");
    } else {
      setCompanies(c=>[{...form,id:uid()},...c]);
      toast(`${form.name} added!`,"success");
    }
    closeDrawer();
  };

  const handleQuickAdd=()=>{
    if(!quickName.trim())return;
    const co={id:uid(),name:quickName.trim(),
      shortName:quickName.trim().slice(0,4).toUpperCase(),
      category:"Business Partner",description:"",website:"",status:"Active"};
    setCompanies(c=>[co,...c]); setQuickName(""); setDropOpen(false);
    toast(`${co.name} added!`,"success");
  };

  const techPartners = companies.filter(c=>c.category==="Technology Partner");
  const bizPartners  = companies.filter(c=>c.category==="Business Partner");
  const texProds     = companies.filter(c=>c.category==="Texora Product");

  const statCards=[
    {label:"Total Companies",    val:companies.length,       icon:<Building2 size={18}/>, color:"#0891b2"},
    {label:"Tech Partners",      val:techPartners.length,    icon:<Monitor size={18}/>,   color:"#7c3aed"},
    {label:"Business Partners",  val:bizPartners.length,     icon:<Handshake size={18}/>, color:"#059669"},
    {label:"Texora Products",    val:texProds.length,        icon:<Layers size={18}/>,    color:"#8b5cf6"},
    {label:"Active",             val:companies.filter(c=>c.status==="Active").length, icon:<Activity size={18}/>, color:"#10b981"},
  ];

  const fpill=(active,col="#0891b2")=>({
    padding:"7px 13px",borderRadius:8,border:`1.5px solid ${active?col:(dark?"rgba(255,255,255,0.1)":"#e2e8f0")}`,
    fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",
    background:active?col:(dark?"rgba(255,255,255,0.05)":"#fff"),
    color:active?"#fff":(dark?"#94a3b8":"#374151"),
    display:"inline-flex",alignItems:"center",gap:5,
  });

  const openViewAllTech = () => setViewAllModal({
    title:"Technology Partners", items:techPartners,
    icon:<Monitor size={18}/>, color:"#0891b2",
  });
  const openViewAllBiz = () => setViewAllModal({
    title:"Business Partners", items:bizPartners,
    icon:<Handshake size={18}/>, color:"#a855f7",
  });
  const openViewAllProd = () => setViewAllModal({
    title:"Texora Products", items:texProds,
    icon:<Layers size={18}/>, color:"#8b5cf6",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes toastIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        .tgc-input:focus{border-color:#0891b2!important;box-shadow:0 0 0 3px rgba(8,145,178,0.18)!important;outline:none!important;}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${dark?"#0f172a":"#f1f5f9"}}
        ::-webkit-scrollbar-thumb{background:${dark?"#334155":"#cbd5e1"};border-radius:4px}
        .swiper-pagination-bullet{background:${dark?"#334155":"#cbd5e1"}!important;opacity:1!important;width:6px!important;height:6px!important}
        .swiper-pagination-bullet-active{background:#0891b2!important;width:18px!important;border-radius:3px!important}
        .swiper-button-disabled{opacity:0.35!important}
      `}</style>

      <div style={{
        minHeight:"100vh",background:pageBg,display:"flex",flexDirection:"row",
        fontFamily:"'DM Sans',sans-serif",overflow:"hidden",position:"relative",
      }}>
        {/* ── Left: Main Content ── */}
        <div style={{flex:1,minWidth:0,overflowY:"auto",overflowX:"hidden",padding:"24px 28px",
          transition:"all 0.3s cubic-bezier(0.4,0,0.2,1)"}}>

          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
            marginBottom:20,flexWrap:"wrap",gap:14}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#0891b2",letterSpacing:"0.1em",
                textTransform:"uppercase",marginBottom:4}}>TRUSTED BY PROFESSIONALS AT</div>
              <h1 style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:26,
                color:titleText,display:"flex",alignItems:"center",gap:4,margin:0,lineHeight:1.2}}>
                Top Global{" "}
                <span style={{background:"linear-gradient(135deg,#f97316,#f59e0b)",
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Companies</span>
              </h1>
              <p style={{color:subText,fontSize:13,marginTop:6,margin:"6px 0 0",maxWidth:480}}>
                We collaborate with leading technology providers and business organizations to deliver innovative digital solutions.
              </p>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              {/* Quick Add */}
              <div ref={dropRef} style={{position:"relative"}}>
                <button onClick={()=>setDropOpen(o=>!o)} style={{
                  padding:"9px 16px",borderRadius:10,border:`1px solid ${borderCol}`,
                  background:cardBg,color:dark?"#94a3b8":"#374151",
                  fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7,
                }}>
                  <Zap size={15} color="#f59e0b"/> Quick Add <ChevronDown size={14}/>
                </button>
                {dropOpen&&(
                  <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,
                    background:cardBg,borderRadius:14,border:`1px solid ${borderCol}`,
                    padding:16,width:280,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",zIndex:500}}>
                    <div style={{fontSize:11,fontWeight:700,color:mutedText,marginBottom:8,
                      textTransform:"uppercase",letterSpacing:"0.05em"}}>Quick Add Company</div>
                    <div style={{display:"flex",gap:8,marginBottom:10}}>
                      <input className="tgc-input" value={quickName} onChange={e=>setQuickName(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&handleQuickAdd()}
                        placeholder="Company name..." style={{
                          flex:1,padding:"9px 12px",borderRadius:8,
                          border:`1px solid ${borderCol}`,fontSize:13,
                          background:inputBg,color:inputText,fontFamily:"inherit",
                        }}/>
                      <button onClick={handleQuickAdd} style={{
                        width:36,height:36,borderRadius:8,border:"none",
                        background:"linear-gradient(135deg,#0891b2,#06b6d4)",
                        color:"#fff",cursor:"pointer",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                      }}><Plus size={18} color="#fff"/></button>
                    </div>
                    <button onClick={()=>{setDropOpen(false);openAdd();}} style={{
                      width:"100%",padding:"9px 0",borderRadius:8,border:`1px solid ${borderCol}`,
                      background:dark?"#0f172a":"#f8fafc",color:dark?"#94a3b8":"#374151",
                      fontSize:13,fontWeight:600,cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:7,
                    }}>
                      <LayoutList size={14}/> Full Details Form
                    </button>
                  </div>
                )}
              </div>
              <button onClick={openAdd} style={{
                padding:"9px 20px",borderRadius:10,border:"none",
                background:"linear-gradient(135deg,#0e7490,#0891b2)",color:"#fff",
                fontSize:13,fontWeight:700,cursor:"pointer",
                boxShadow:"0 4px 14px rgba(8,145,178,0.35)",
                display:"flex",alignItems:"center",gap:7,
              }}>
                <Plus size={16} color="#fff"/> Add Company
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:20}}>
            {statCards.map(s=>(
              <div key={s.label} style={{
                background:cardBg,borderRadius:14,padding:"14px 16px",
                border:`1px solid ${borderCol}`,borderLeft:`4px solid ${s.color}`,
                boxShadow:dark?"none":"0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{width:34,height:34,borderRadius:9,background:`${s.color}15`,
                  display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8,color:s.color}}>
                  {s.icon}
                </div>
                <div style={{fontWeight:800,fontSize:22,color:titleText,fontFamily:"'Sora',sans-serif"}}>{s.val}</div>
                <div style={{fontSize:11,color:subText,fontWeight:500}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{
            background:cardBg,borderRadius:14,padding:"12px 16px",marginBottom:20,
            display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",
            border:`1px solid ${borderCol}`,
          }}>
            <SlidersHorizontal size={15} color={mutedText}/>
            <div style={{position:"relative",flex:1,minWidth:160}}>
              <Search size={14} color={mutedText} style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}}/>
              <input className="tgc-input" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search companies..." style={{
                  width:"100%",padding:"8px 12px 8px 34px",borderRadius:9,
                  border:`1.5px solid ${borderCol}`,background:inputBg,
                  fontSize:12,fontFamily:"inherit",color:inputText,boxSizing:"border-box",
                }}/>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {["All","Technology Partner","Business Partner","Texora Product"].map(cat=>(
                <button key={cat} onClick={()=>setCatFilter(cat)} style={fpill(catFilter===cat,"#0891b2")}>
                  {cat==="Technology Partner"&&<Monitor size={11}/>}
                  {cat==="Business Partner"&&<Handshake size={11}/>}
                  {cat==="All"&&<Globe size={11}/>}
                  {cat==="Texora Product"&&<Layers size={11}/>}
                  {cat==="All"?"All":cat.split(" ")[0]}
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:5}}>
              {["All","Active","Inactive"].map(st=>(
                <button key={st} onClick={()=>setStatFilter(st)} style={fpill(statFilter===st,"#10b981")}>
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* ── Technology Partners Carousel ── */}
          {(catFilter==="All"||catFilter==="Technology Partner") && swiperLoaded && (
            <CarouselSection
              title="Technology Partners"
              subtitle="Partners"
              icon={<Monitor size={20}/>}
              color="#0891b2"
              badgeBg={dark?"rgba(56,189,248,0.15)":"#dbeafe"}
              badgeColor={dark?"#38bdf8":"#1d4ed8"}
              items={techPartners.filter(c=>{
                const q=search.toLowerCase();
                return(c.name.toLowerCase().includes(q)||(c.description||"").toLowerCase().includes(q))&&
                  (statFilter==="All"||c.status===statFilter);
              })}
              onEdit={openEdit}
              onDelete={setDeleteCo}
              onView={setViewCo}
              onAdd={openAdd}
              openViewAll={openViewAllTech}
              dark={dark}
              slidesPerView={{mobile:1,tablet:3,desktop:5}}
              renderCard={(item)=>(
                <PartnerCard company={item} onEdit={openEdit} onDelete={setDeleteCo} onView={setViewCo} dark={dark}/>
              )}
            />
          )}

          {/* ── Business Partners Carousel ── */}
          {(catFilter==="All"||catFilter==="Business Partner") && swiperLoaded && (
            <CarouselSection
              title="Business Partners"
              subtitle="Partners"
              icon={<Handshake size={20}/>}
              color="#a855f7"
              badgeBg={dark?"rgba(192,132,252,0.15)":"#ede9fe"}
              badgeColor={dark?"#c084fc":"#7c3aed"}
              items={bizPartners.filter(c=>{
                const q=search.toLowerCase();
                return(c.name.toLowerCase().includes(q)||(c.description||"").toLowerCase().includes(q))&&
                  (statFilter==="All"||c.status===statFilter);
              })}
              onEdit={openEdit}
              onDelete={setDeleteCo}
              onView={setViewCo}
              onAdd={openAdd}
              openViewAll={openViewAllBiz}
              dark={dark}
              slidesPerView={{mobile:1,tablet:3,desktop:5}}
              renderCard={(item)=>(
                <PartnerCard company={item} onEdit={openEdit} onDelete={setDeleteCo} onView={setViewCo} dark={dark}/>
              )}
            />
          )}

          {/* ── Texora Product Ecosystem Carousel ── */}
          {(catFilter==="All"||catFilter==="Texora Product") && swiperLoaded && (
            <div style={{
              background:cardBg,borderRadius:20,border:`1px solid ${borderCol}`,
              padding:"24px 24px 20px",marginBottom:20,
              boxShadow:dark?"none":"0 2px 12px rgba(0,0,0,0.06)",
              position:"relative",overflow:"hidden",
            }}>
              <div style={{position:"absolute",top:-40,right:-40,width:160,height:160,
                borderRadius:"50%",background:"rgba(139,92,246,0.08)",filter:"blur(40px)",pointerEvents:"none"}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,position:"relative"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"rgba(139,92,246,0.15)",
                    border:"1.5px solid rgba(139,92,246,0.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Layers size={20} color="#8b5cf6"/>
                  </div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:15,color:"#8b5cf6"}}>
                        Texora Product Ecosystem
                      </span>
                      <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,
                        background:dark?"rgba(167,139,250,0.15)":"#ede9fe",
                        color:dark?"#a78bfa":"#7c3aed"}}>
                        {texProds.length}+ Products
                      </span>
                    </div>
                    <div style={{fontSize:12,color:subText,marginTop:2}}>Internal products powering Texora's platform</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={openViewAllProd} style={{
                    padding:"7px 14px",borderRadius:9,border:"1.5px solid rgba(139,92,246,0.4)",
                    background:"rgba(139,92,246,0.1)",color:"#8b5cf6",fontSize:12,fontWeight:700,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:5,transition:"all 0.15s",
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(139,92,246,0.2)"}
                    onMouseLeave={e=>e.currentTarget.style.background="rgba(139,92,246,0.1)"}>
                    View All <ArrowRight size={13}/>
                  </button>
                  <button onClick={openAdd} style={{
                    padding:"7px 12px",borderRadius:9,border:"none",
                    background:"linear-gradient(135deg,#7c3aed,#a855f7)",
                    color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",
                    display:"flex",alignItems:"center",gap:5,
                  }}>
                    <Plus size={13}/> Add Product
                  </button>
                </div>
              </div>
              <ProductCarousel
                items={texProds.filter(c=>{
                  const q=search.toLowerCase();
                  return(c.name.toLowerCase().includes(q)||(c.description||"").toLowerCase().includes(q))&&
                    (statFilter==="All"||c.status===statFilter);
                })}
                onEdit={openEdit}
                onDelete={setDeleteCo}
                onView={setViewCo}
                dark={dark}
              />
            </div>
          )}

          {/* Empty state */}
          {!swiperLoaded && (
            <div style={{textAlign:"center",padding:"60px 20px",color:subText}}>
              <div style={{fontSize:14}}>Loading carousel...</div>
            </div>
          )}
        </div>

        {/* ── Right: Inline Drawer ── */}
        <CompanyDrawer
          open={drawer.open}
          mode={drawer.mode}
          initial={drawer.initial}
          onClose={closeDrawer}
          onSave={handleSave}
          dark={dark}
          drawerWidth={drawerWidth}
          onDragStart={handleDragStart}
        />
      </div>

      {/* View All Modal */}
      {viewAllModal && (
        <ViewAllModal
          title={viewAllModal.title}
          items={viewAllModal.items}
          icon={viewAllModal.icon}
          color={viewAllModal.color}
          onClose={()=>setViewAllModal(null)}
          onEdit={openEdit}
          onDelete={setDeleteCo}
          onView={setViewCo}
          dark={dark}
        />
      )}

      {viewCo&&<ViewModal company={viewCo} onClose={()=>setViewCo(null)} onEdit={openEdit} dark={dark}/>}

      {deleteCo&&<ConfirmModal company={deleteCo} dark={dark}
        onConfirm={()=>{
          setCompanies(c=>c.filter(x=>x.id!==deleteCo.id));
          toast(`${deleteCo.name} deleted`,"error");
          setDeleteCo(null);
        }}
        onCancel={()=>setDeleteCo(null)}/>}

      <Toasts items={toasts}/>
    </>
  );
}

/* ══════ PRODUCT CAROUSEL (separate so hooks are clean) ══════ */
function ProductCarousel({ items, onEdit, onDelete, onView, dark }) {
  const swiperRef = useRef(null);
  const prevRef   = useRef(null);
  const nextRef   = useRef(null);
  const card = dark ? "#1e293b" : "#ffffff";
  const bord = dark ? "#334155" : "#e2e8f0";
  const sub  = dark ? "#94a3b8" : "#6b7280";

  useEffect(() => {
    if (!swiperRef.current || !window.Swiper) return;
    const sw = new window.Swiper(swiperRef.current, {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: items.length > 5,
      autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: swiperRef.current.querySelector(".swiper-pagination"), clickable: true },
      navigation: { prevEl: prevRef.current, nextEl: nextRef.current },
      breakpoints: {
        480: { slidesPerView: 2, spaceBetween: 14 },
        768: { slidesPerView: 3, spaceBetween: 14 },
        1200: { slidesPerView: 5, spaceBetween: 16 },
      },
    });
    return () => { try { sw.destroy(true, true); } catch(e) {} };
  }, [items.length]);

  return (
    <div style={{position:"relative"}}>
      <button ref={prevRef} style={{
        position:"absolute",left:-14,top:"50%",transform:"translateY(-50%)",
        zIndex:10,width:34,height:34,borderRadius:"50%",
        border:`1.5px solid ${bord}`,background:card,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <ChevronLeft size={16} color={sub}/>
      </button>
      <button ref={nextRef} style={{
        position:"absolute",right:-14,top:"50%",transform:"translateY(-50%)",
        zIndex:10,width:34,height:34,borderRadius:"50%",
        border:`1.5px solid ${bord}`,background:card,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 4px 12px rgba(0,0,0,0.15)",
      }}>
        <ChevronRight size={16} color={sub}/>
      </button>
      <div ref={swiperRef} className="swiper" style={{overflow:"hidden",padding:"4px 2px 32px"}}>
        <div className="swiper-wrapper">
          {items.map((prod, idx) => (
            <div key={prod.id} className="swiper-slide" style={{height:"auto"}}>
              <ProductCard prod={prod} idx={idx} onEdit={onEdit} onDelete={onDelete} onView={onView} dark={dark}/>
            </div>
          ))}
        </div>
        <div className="swiper-pagination" style={{bottom:4}}/>
      </div>
    </div>
  );
}