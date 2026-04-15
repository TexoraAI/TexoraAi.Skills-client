import axios from "axios";
import {
  ArrowLeft, BookOpen, Mail, Plus, RefreshCcw,
  Search, Shield, ShieldOff, Trash2, UserPlus, Users, X,
  Sparkles, Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE  = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("lms_token")}` });

/* ─── theme token map ─── */
const T = {
  dark: {
    pageBg:"#0a0a0a",cardBg:"#111111",heroBg:"#141414",
    border:"rgba(255,255,255,0.06)",borderHov:"rgba(255,255,255,0.14)",borderHero:"rgba(255,255,255,0.07)",
    text:"#ffffff",textSub:"rgba(255,255,255,0.3)",textMuted:"rgba(255,255,255,0.2)",textLabel:"rgba(255,255,255,0.22)",
    pillBg:"rgba(255,255,255,0.04)",pillBorder:"rgba(255,255,255,0.07)",pillText:"rgba(255,255,255,0.25)",
    actBg:"rgba(255,255,255,0.04)",actBorder:"rgba(255,255,255,0.07)",actIcon:"rgba(255,255,255,0.3)",actBar:"rgba(255,255,255,0.5)",
    gridLine:"rgba(255,255,255,0.5)",shadow:"0 4px 20px rgba(0,0,0,0.4)",shadowHov:"0 20px 60px rgba(0,0,0,0.6)",
    emptyBorder:"rgba(255,255,255,0.07)",emptyBg:"rgba(255,255,255,0.02)",emptyIcon:"rgba(255,255,255,0.12)",
    liveColor:"#34d399",liveText:"#34d399",
    inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(255,255,255,0.1)",inputText:"#ffffff",
    skeletonBg:"rgba(255,255,255,0.07)",theadBg:"rgba(255,255,255,0.03)",
  },
  light: {
    pageBg:"#f1f5f9",cardBg:"#ffffff",heroBg:"#ffffff",
    border:"#e2e8f0",borderHov:"#cbd5e1",borderHero:"#e2e8f0",
    text:"#0f172a",textSub:"#64748b",textMuted:"#94a3b8",textLabel:"#94a3b8",
    pillBg:"#f1f5f9",pillBorder:"#e2e8f0",pillText:"#94a3b8",
    actBg:"#f8fafc",actBorder:"#e2e8f0",actIcon:"#94a3b8",actBar:"#94a3b8",
    gridLine:"rgba(0,0,0,0.12)",shadow:"0 1px 8px rgba(0,0,0,0.07)",shadowHov:"0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder:"#e2e8f0",emptyBg:"#f8fafc",emptyIcon:"#cbd5e1",
    liveColor:"#16a34a",liveText:"#16a34a",
    inputBg:"#f8fafc",inputBorder:"#e2e8f0",inputText:"#0f172a",
    skeletonBg:"#e2e8f0",theadBg:"rgba(0,0,0,0.02)",
  },
};

const GRAD_COLORS = [["#a78bfa","#7c3aed"],["#22d3ee","#0891b2"],["#f43f5e","#be123c"],["#f59e0b","#b45309"],["#34d399","#059669"],["#818cf8","#4338ca"]];
const gradColor = val => GRAD_COLORS[(String(val)?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];

const CHIP_COLORS = ["#22d3ee","#a78bfa","#f59e0b","#34d399","#f43f5e"];
const chipColor = val => CHIP_COLORS[(String(val)?.charCodeAt(0) ?? 0) % CHIP_COLORS.length];

const TABS = [
  { label:"All Users",path:"/admin/users" },{ label:"Students",path:"/admin/students" },
  { label:"Trainers",path:"/admin/trainers" },{ label:"Pending Users",path:"/admin/pending-users" },
];

const TrainersAdmin = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["class","data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [trainers, setTrainers] = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [form, setForm]         = useState({ name:"", email:"", expertise:"" });
  const [panelOpen, setPanelOpen] = useState(false);

  const loadTrainers = async () => {
    try { setLoading(true); const res = await axios.get(`${API_BASE}/trainers`, { headers:authHeaders() }); const data = res?.data; setTrainers(Array.isArray(data) ? data : data?.data || []); }
    catch (err) { if (err.response?.status === 401) alert("Unauthorized. Please login again."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTrainers(); }, []);

  const addTrainer = async () => {
    if (!form.name || !form.email || !form.expertise) { alert("Fill all fields"); return; }
    try { await axios.post(`${API_BASE}/trainers`, form, { headers:authHeaders() }); setForm({ name:"", email:"", expertise:"" }); setPanelOpen(false); loadTrainers(); }
    catch (err) { alert(err.response?.data?.message || "Failed to add trainer"); }
  };
  const toggleStatus = async (id, status) => {
    const next = status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    try { await axios.put(`${API_BASE}/trainers/${id}/status`, null, { params:{ status:next }, headers:authHeaders() }); loadTrainers(); }
    catch { alert("Failed to update status"); }
  };
  const deleteTrainer = async (id) => {
    if (!window.confirm("Delete trainer?")) return;
    try { await axios.delete(`${API_BASE}/trainers/${id}`, { headers:authHeaders() }); loadTrainers(); }
    catch { alert("Failed to delete trainer"); }
  };

  const filtered = Array.isArray(trainers) ? trainers.filter(tr => tr?.name?.toLowerCase().includes(search.toLowerCase()) || tr?.email?.toLowerCase().includes(search.toLowerCase())) : [];
  const activeCount  = trainers.filter(tr => tr.status === "ACTIVE").length;
  const blockedCount = trainers.filter(tr => tr.status === "BLOCKED").length;

  const pill = { fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 10px",borderRadius:999,background:t.pillBg,border:`1px solid ${t.pillBorder}`,color:t.pillText,fontFamily:"'Poppins',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} .tfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}} .d1{animation:blink 1.6s ease infinite} .d2{animation:blink 1.6s 0.3s ease infinite} .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}} .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        .tr-row .row-actions{opacity:0;transition:opacity 0.2s} .tr-row:hover .row-actions{opacity:1} .tr-row:hover .tname{color:#22d3ee} .tname{transition:color 0.15s}
      `}</style>

      <div style={{ minHeight:"100vh",background:t.pageBg,color:t.text,fontFamily:"'Poppins',sans-serif",transition:"background 0.3s,color 0.3s" }}>
        <div style={{ maxWidth:1300,margin:"0 auto",padding:24,paddingBottom:52 }}>

          {/* HERO */}
          <div className="tfade" style={{ borderRadius:24,padding:"30px 36px",background:t.heroBg,border:`1px solid ${t.borderHero}`,position:"relative",overflow:"hidden",marginBottom:20,boxShadow:t.shadow }}>
            <div style={{ position:"absolute",inset:0,pointerEvents:"none",opacity:isDark?0.04:0.025,backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,backgroundSize:"40px 40px" }} />
            <div style={{ position:"absolute",top:"-30%",left:"40%",width:300,height:200,background:"radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"absolute",bottom:"-40%",right:"10%",width:250,height:200,background:"radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                  <button onClick={() => navigate(-1)} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:10,border:`1px solid ${t.borderHov}`,background:t.actBg,color:t.textSub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}><ArrowLeft size={13} /> Back</button>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}><Sparkles size={11} color={t.textSub} /><span style={{ fontSize:9,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:t.textSub,fontFamily:"'Poppins',sans-serif" }}>Admin Portal</span></div>
                </div>
                <h1 style={{ fontFamily:"'Poppins',sans-serif",fontWeight:900,fontSize:"clamp(1.6rem,3vw,2.4rem)",color:t.text,margin:0,lineHeight:1.1,letterSpacing:"-0.02em" }}>Trainers</h1>
                <p style={{ fontSize:12,color:t.textSub,marginTop:7,fontWeight:500,fontFamily:"'Poppins',sans-serif" }}>Manage trainers, expertise and access status</p>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                {[{ icon:Users,color:"#22d3ee",val:trainers.length,label:"Total" },{ icon:Shield,color:"#34d399",val:activeCount,label:"Active" },blockedCount>0&&{ icon:ShieldOff,color:"#f43f5e",val:blockedCount,label:"Blocked" }].filter(Boolean).map((item,i) => { const Ic=item.icon; return (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:8,background:t.actBg,border:`1px solid ${t.actBorder}`,borderRadius:12,padding:"8px 14px",fontSize:11,fontWeight:600,fontFamily:"'Poppins',sans-serif",color:t.textSub }}>
                    <Ic size={13} color={item.color} /><span style={{ color:t.text,fontWeight:700 }}>{item.val}</span><span>{item.label}</span>
                  </div>
                ); })}
                <div style={{ display:"flex",alignItems:"center",gap:8,background:t.actBg,border:`1px solid ${t.actBorder}`,borderRadius:10,padding:"8px 14px" }}>
                  <Activity size={12} color={t.actIcon} />
                  <div style={{ display:"flex",gap:3,alignItems:"flex-end",height:14 }}>
                    <span className="d1" style={{ width:3,height:10,borderRadius:2,background:t.actBar,display:"block" }} /><span className="d2" style={{ width:3,height:14,borderRadius:2,background:t.actBar,display:"block" }} /><span className="d3" style={{ width:3,height:7,borderRadius:2,background:t.actBar,display:"block" }} />
                  </div>
                </div>
                <div className="livebadge" style={{ display:"flex",alignItems:"center",gap:7,background:isDark?"rgba(52,211,153,0.08)":"rgba(22,163,74,0.08)",border:isDark?"1px solid rgba(52,211,153,0.3)":"1px solid rgba(22,163,74,0.3)",borderRadius:999,padding:"8px 18px",color:t.liveText,fontSize:11,fontWeight:700,letterSpacing:"0.1em",fontFamily:"'Poppins',sans-serif" }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:t.liveColor,display:"inline-block" }} /> LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="tfade" style={{ display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
            <div style={{ display:"flex",gap:4,borderRadius:14,background:t.cardBg,border:`1px solid ${t.border}`,padding:4,boxShadow:t.shadow }}>
              {TABS.map(({ label, path }) => { const isActive = typeof location !== "undefined" && location.pathname === path; return <button key={path} onClick={() => navigate(path)} style={{ padding:"7px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Poppins',sans-serif",fontSize:11,fontWeight:600,background:isActive?"linear-gradient(135deg,#22d3ee,#3b82f6)":"transparent",color:isActive?"#fff":t.textSub,boxShadow:isActive?"0 2px 8px rgba(34,211,238,0.3)":"none",transition:"all 0.2s" }}>{label}</button>; })}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ position:"relative" }}>
                <Search size={14} style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:t.textMuted,pointerEvents:"none" }} />
                <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34,paddingRight:14,height:36,width:220,borderRadius:10,border:`1px solid ${t.border}`,background:t.cardBg,color:t.text,fontSize:11,fontFamily:"'Poppins',sans-serif",outline:"none",boxShadow:t.shadow }} />
              </div>
              <button onClick={() => setPanelOpen(true)} style={{ display:"flex",alignItems:"center",gap:7,padding:"8px 18px",borderRadius:10,background:"linear-gradient(135deg,#3b82f6,#22d3ee)",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 14px rgba(34,211,238,0.35)",whiteSpace:"nowrap" }}>
                <Plus size={14} /> Add Trainer
              </button>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ display:"flex",gap:16,alignItems:"flex-start" }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:20,overflow:"hidden",boxShadow:t.shadow }}>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${t.border}`,background:isDark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.01)" }}>
                  <div>
                    <p style={{ fontSize:13,fontWeight:700,color:t.text,margin:0,fontFamily:"'Poppins',sans-serif" }}>Trainer List</p>
                    <p style={{ fontSize:10,color:t.textMuted,margin:"3px 0 0",fontFamily:"'Poppins',sans-serif" }}>{filtered.length} record{filtered.length !== 1 && "s"} found</p>
                  </div>
                  <span style={pill}>Trainers</span>
                </div>
                <div style={{ overflowX:"auto" }}>
                  {loading ? (
                    <div style={{ padding:16,display:"flex",flexDirection:"column",gap:10 }}>
                      {[1,2,3].map(i => <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:14,border:`1px solid ${t.border}`,padding:14,animation:"shimmer 1.5s ease infinite" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:12 }}><div style={{ width:40,height:40,borderRadius:12,background:t.skeletonBg }} /><div style={{ display:"flex",flexDirection:"column",gap:6 }}><div style={{ height:10,width:120,borderRadius:5,background:t.skeletonBg }} /><div style={{ height:8,width:160,borderRadius:4,background:t.skeletonBg }} /></div></div>
                        <div style={{ height:26,width:70,borderRadius:999,background:t.skeletonBg }} />
                      </div>)}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"52px 0",gap:12 }}>
                      <div style={{ width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",border:`1.5px dashed ${t.emptyBorder}`,background:t.emptyBg }}><Users size={22} color={t.emptyIcon} /></div>
                      <p style={{ fontSize:12,color:t.textMuted,fontWeight:500,fontFamily:"'Poppins',sans-serif",margin:0 }}>No trainers found</p>
                      <p style={{ fontSize:10,color:t.textLabel,fontFamily:"'Poppins',sans-serif",margin:0 }}>Click "Add Trainer" to get started</p>
                    </div>
                  ) : (
                    <table style={{ width:"100%",borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:t.theadBg,borderBottom:`1px solid ${t.border}` }}>
                          {["#","Trainer","Expertise","Status","Actions"].map((h,i) => <th key={i} style={{ padding:i===0?"12px 8px 12px 22px":"12px 16px",textAlign:i===4?"right":"left",fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.textMuted,fontFamily:"'Poppins',sans-serif",whiteSpace:"nowrap" }}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((tr, index) => {
                          const [c1,c2] = gradColor(tr.name);
                          const cc = chipColor(tr.expertise);
                          return (
                            <tr key={tr.id} className="tr-row" style={{ borderBottom:`1px solid ${t.border}`,transition:"background 0.15s" }}>
                              <td style={{ padding:"14px 8px 14px 22px",width:40 }}><span style={{ fontSize:11,fontWeight:600,color:t.textMuted,fontFamily:"'Poppins',sans-serif" }}>{String(index+1).padStart(2,"0")}</span></td>
                              <td style={{ padding:"14px 16px" }}>
                                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                                  <div style={{ width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13,fontFamily:"'Poppins',sans-serif",boxShadow:`0 3px 10px ${c1}44`,flexShrink:0 }}>{tr.name?.charAt(0)?.toUpperCase()}</div>
                                  <div>
                                    <p className="tname" style={{ fontSize:12,fontWeight:700,color:t.text,margin:0,fontFamily:"'Poppins',sans-serif" }}>{tr.name}</p>
                                    <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:3 }}><Mail size={11} color={t.textMuted} /><span style={{ fontSize:10,color:t.textMuted,fontFamily:"'Poppins',sans-serif" }}>{tr.email}</span></div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:999,background:`${cc}14`,border:`1px solid ${cc}33`,fontSize:10,fontWeight:700,color:cc,fontFamily:"'Poppins',sans-serif" }}>
                                  <BookOpen size={10} /> {tr.expertise}
                                </span>
                              </td>
                              <td style={{ padding:"14px 16px" }}>
                                {tr.status === "ACTIVE" ? (
                                  <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:999,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)",fontSize:10,fontWeight:700,color:isDark?"#34d399":"#16a34a",fontFamily:"'Poppins',sans-serif" }}><span style={{ width:5,height:5,borderRadius:"50%",background:isDark?"#34d399":"#16a34a",display:"inline-block",animation:"pulse 1.5s ease infinite" }} /> Active</span>
                                ) : (
                                  <span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:999,background:"rgba(244,63,94,0.1)",border:"1px solid rgba(244,63,94,0.25)",fontSize:10,fontWeight:700,color:"#f43f5e",fontFamily:"'Poppins',sans-serif" }}><span style={{ width:5,height:5,borderRadius:"50%",background:"#f43f5e",display:"inline-block" }} /> Blocked</span>
                                )}
                              </td>
                              <td style={{ padding:"14px 22px 14px 16px",textAlign:"right" }}>
                                <div className="row-actions" style={{ display:"flex",justifyContent:"flex-end",gap:6 }}>
                                  <button onClick={() => toggleStatus(tr.id,tr.status)} style={{ width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:tr.status==="ACTIVE"?"rgba(245,158,11,0.1)":"rgba(52,211,153,0.1)",border:tr.status==="ACTIVE"?"1px solid rgba(245,158,11,0.25)":"1px solid rgba(52,211,153,0.25)",color:tr.status==="ACTIVE"?"#f59e0b":isDark?"#34d399":"#16a34a",cursor:"pointer" }}><RefreshCcw size={13} /></button>
                                  <button onClick={() => deleteTrainer(tr.id)} style={{ width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",color:"#f43f5e",cursor:"pointer" }}><Trash2 size={13} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL */}
            <div style={{ flexShrink:0,width:panelOpen?384:0,opacity:panelOpen?1:0,pointerEvents:panelOpen?"auto":"none",overflow:"hidden",transition:"width 0.3s ease,opacity 0.3s ease" }}>
              <div style={{ width:384,borderRadius:20,border:`1px solid ${t.border}`,background:t.cardBg,overflow:"hidden",boxShadow:t.shadowHov }}>
                <div style={{ background:"linear-gradient(135deg,#1a56db,#06b6d4)",padding:"18px 20px" }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                      <div style={{ width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center" }}><UserPlus size={15} color="#fff" /></div>
                      <div>
                        <p style={{ fontSize:13,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Poppins',sans-serif" }}>Add Trainer</p>
                        <p style={{ fontSize:10,color:"rgba(255,255,255,0.6)",margin:"2px 0 0",fontFamily:"'Poppins',sans-serif" }}>Fill in the trainer details</p>
                      </div>
                    </div>
                    <button onClick={() => setPanelOpen(false)} style={{ width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.15)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><X size={14} color="#fff" /></button>
                  </div>
                  <div style={{ display:"flex",gap:6,marginTop:14 }}>
                    {["Trainer Info","Expertise","Done"].map((step,i) => (
                      <div key={step} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:8,background:i===0?"rgba(255,255,255,0.2)":"transparent",color:i===0?"#fff":"rgba(255,255,255,0.4)",fontSize:10,fontWeight:600,fontFamily:"'Poppins',sans-serif" }}>
                        <div style={{ width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,background:i===0?"#fff":"rgba(255,255,255,0.2)",color:i===0?"#1a56db":"rgba(255,255,255,0.6)",flexShrink:0 }}>{i+1}</div>{step}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding:20,display:"flex",flexDirection:"column",gap:14 }}>
                  {[{ label:"Full Name",key:"name",placeholder:"e.g. Arjun Sharma",type:"text" },{ label:"Email",key:"email",placeholder:"trainer@example.com",type:"email" },{ label:"Expertise",key:"expertise",placeholder:"e.g. React, Node.js",type:"text" }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:t.textMuted,fontFamily:"'Poppins',sans-serif",display:"block",marginBottom:6 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} style={{ width:"100%",height:38,borderRadius:10,border:`1px solid ${t.inputBorder}`,background:t.inputBg,color:t.inputText,fontSize:12,fontFamily:"'Poppins',sans-serif",padding:"0 12px",outline:"none",boxSizing:"border-box" }} />
                    </div>
                  ))}
                  <div style={{ display:"flex",justifyContent:"flex-end",gap:8,paddingTop:4 }}>
                    <button onClick={() => setPanelOpen(false)} style={{ padding:"8px 18px",borderRadius:10,border:`1px solid ${t.border}`,background:t.actBg,color:t.textSub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}>Cancel</button>
                    <button onClick={addTrainer} style={{ padding:"8px 20px",borderRadius:10,background:"linear-gradient(135deg,#3b82f6,#22d3ee)",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif",boxShadow:"0 4px 14px rgba(34,211,238,0.35)" }}>Add Trainer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainersAdmin;