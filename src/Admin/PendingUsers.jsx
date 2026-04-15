import axios from "axios";
import {
  ArrowLeft, Check, CheckCircle2, Clock, Mail,
  Search, Users, X, Sparkles, Activity, ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

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
    recentItemBg:"rgba(255,255,255,0.03)",recentItemBorder:"rgba(255,255,255,0.05)",recentItemBgHov:"rgba(255,255,255,0.06)",
    liveColor:"#34d399",liveText:"#34d399",
    inputBg:"rgba(255,255,255,0.05)",inputBorder:"rgba(255,255,255,0.1)",inputText:"#ffffff",
    skeletonBg:"rgba(255,255,255,0.07)",dropdownBg:"#1a1a1a",
  },
  light: {
    pageBg:"#f1f5f9",cardBg:"#ffffff",heroBg:"#ffffff",
    border:"#e2e8f0",borderHov:"#cbd5e1",borderHero:"#e2e8f0",
    text:"#0f172a",textSub:"#64748b",textMuted:"#94a3b8",textLabel:"#94a3b8",
    pillBg:"#f1f5f9",pillBorder:"#e2e8f0",pillText:"#94a3b8",
    actBg:"#f8fafc",actBorder:"#e2e8f0",actIcon:"#94a3b8",actBar:"#94a3b8",
    gridLine:"rgba(0,0,0,0.12)",shadow:"0 1px 8px rgba(0,0,0,0.07)",shadowHov:"0 8px 32px rgba(0,0,0,0.10)",
    emptyBorder:"#e2e8f0",emptyBg:"#f8fafc",emptyIcon:"#cbd5e1",
    recentItemBg:"#f8fafc",recentItemBorder:"#e2e8f0",recentItemBgHov:"#f1f5f9",
    liveColor:"#16a34a",liveText:"#16a34a",
    inputBg:"#f8fafc",inputBorder:"#e2e8f0",inputText:"#0f172a",
    skeletonBg:"#e2e8f0",dropdownBg:"#ffffff",
  },
};

const GRAD_COLORS = [["#a78bfa","#7c3aed"],["#22d3ee","#0891b2"],["#f43f5e","#be123c"],["#f59e0b","#b45309"],["#34d399","#059669"],["#818cf8","#4338ca"]];
const gradColor = val => GRAD_COLORS[(String(val)?.charCodeAt(0) ?? 0) % GRAD_COLORS.length];

const TABS = [
  { label:"All Users",path:"/admin/users" },{ label:"Students",path:"/admin/students" },
  { label:"Trainers",path:"/admin/trainers" },{ label:"Pending Users",path:"/admin/pending-users" },
];

const endpointMap = { students:"/admin/approval/students/pending",trainers:"/admin/approval/trainers/pending",business:"/admin/approval/business/pending",admins:"/admin/approval/admins/pending" };
const approveMap  = { students:"/admin/approval/students/approve",trainers:"/admin/approval/trainers/approve",business:"/admin/approval/business/approve",admins:"/admin/approval/admins/approve" };
const rejectMap   = { students:"/admin/approval/students/reject",trainers:"/admin/approval/trainers/reject",business:"/admin/approval/business/reject",admins:"/admin/approval/admins/reject" };
const titleMap    = { students:"Students",trainers:"Trainers",business:"Business Team",admins:"Admins" };

const ROLE_COLORS  = { students:"#22d3ee",trainers:"#a78bfa",business:"#f59e0b",admins:"#f43f5e" };

const ROLE_OPTIONS = ["students","trainers","business","admins"];

export default function PendingUsers() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["class","data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [selectedRole, setSelectedRole] = useState("students");
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState("");
  const [dropOpen, setDropOpen]         = useState(false);

  const fetchPending = async (roleKey) => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const res = await axios.get(`${API_BASE_URL}${endpointMap[roleKey]}`, { headers:{ Authorization:`Bearer ${token}` } });
      setUsers(res.data || []);
    } catch { setUsers([]); alert("Failed to load pending approvals"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPending(selectedRole); }, [selectedRole]);

  const approveUser = async (id) => {
    try { const token = authService.getToken(); await axios.put(`${API_BASE_URL}${approveMap[selectedRole]}/${id}`, {}, { headers:{ Authorization:`Bearer ${token}` } }); fetchPending(selectedRole); }
    catch { alert("Approve failed"); }
  };
  const rejectUser = async (id) => {
    try { const token = authService.getToken(); await axios.delete(`${API_BASE_URL}${rejectMap[selectedRole]}/${id}`, { headers:{ Authorization:`Bearer ${token}` } }); fetchPending(selectedRole); }
    catch { alert("Reject failed"); }
  };

  const filtered = users.filter(u => (u.name || u.email)?.toLowerCase().includes(search.toLowerCase()));
  const roleColor = ROLE_COLORS[selectedRole];

  const pill = { fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 10px",borderRadius:999,background:t.pillBg,border:`1px solid ${t.pillBorder}`,color:t.pillText,fontFamily:"'Poppins',sans-serif" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} .pfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}} .d1{animation:blink 1.6s ease infinite} .d2{animation:blink 1.6s 0.3s ease infinite} .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}} .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        .pend-row:hover{background:var(--row-hov) !important} .pend-row:hover .pname{color:#22d3ee !important} .pname{transition:color 0.15s}
        .drop-item:hover{background:var(--drop-hov)}
      `}</style>

      <div style={{ minHeight:"100vh",background:t.pageBg,color:t.text,fontFamily:"'Poppins',sans-serif",transition:"background 0.3s,color 0.3s","--row-hov":isDark?"rgba(34,211,238,0.04)":"rgba(34,211,238,0.03)","--drop-hov":isDark?"rgba(255,255,255,0.06)":"#f1f5f9" }}>
        <div style={{ maxWidth:1300,margin:"0 auto",padding:24,paddingBottom:52 }}>

          {/* HERO */}
          <div className="pfade" style={{ borderRadius:24,padding:"30px 36px",background:t.heroBg,border:`1px solid ${t.borderHero}`,position:"relative",overflow:"hidden",marginBottom:20,boxShadow:t.shadow }}>
            <div style={{ position:"absolute",inset:0,pointerEvents:"none",opacity:isDark?0.04:0.025,backgroundImage:`linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`,backgroundSize:"40px 40px" }} />
            <div style={{ position:"absolute",top:"-30%",left:"40%",width:300,height:200,background:"radial-gradient(ellipse,rgba(34,211,238,0.06),transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"absolute",bottom:"-40%",right:"10%",width:250,height:200,background:"radial-gradient(ellipse,rgba(167,139,250,0.06),transparent 70%)",pointerEvents:"none" }} />
            <div style={{ position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                  <button onClick={() => navigate("/admin/users")} style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:10,border:`1px solid ${t.borderHov}`,background:t.actBg,color:t.textSub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Poppins',sans-serif" }}><ArrowLeft size={13} /> Back</button>
                  <div style={{ display:"flex",alignItems:"center",gap:7 }}><Sparkles size={11} color={t.textSub} /><span style={{ fontSize:9,fontWeight:700,letterSpacing:"0.22em",textTransform:"uppercase",color:t.textSub,fontFamily:"'Poppins',sans-serif" }}>Admin Portal</span></div>
                </div>
                <h1 style={{ fontFamily:"'Poppins',sans-serif",fontWeight:900,fontSize:"clamp(1.6rem,3vw,2.4rem)",color:t.text,margin:0,lineHeight:1.1,letterSpacing:"-0.02em" }}>Pending Approvals</h1>
                <p style={{ fontSize:12,color:t.textSub,marginTop:7,fontWeight:500,fontFamily:"'Poppins',sans-serif" }}>Review and approve new users</p>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,background:t.actBg,border:`1px solid ${t.actBorder}`,borderRadius:12,padding:"8px 14px",fontSize:11,fontWeight:600,fontFamily:"'Poppins',sans-serif",color:t.textSub }}>
                  <Clock size={13} color="#f59e0b" /><span style={{ color:t.text,fontWeight:700 }}>{users.length}</span><span>Pending</span>
                </div>
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
          <div className="pfade" style={{ display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
            <div style={{ display:"flex",gap:4,borderRadius:14,background:t.cardBg,border:`1px solid ${t.border}`,padding:4,boxShadow:t.shadow }}>
              {TABS.map(({ label, path }) => { const isActive = typeof location !== "undefined" && location.pathname === path; return <button key={path} onClick={() => navigate(path)} style={{ padding:"7px 16px",borderRadius:10,border:"none",cursor:"pointer",fontFamily:"'Poppins',sans-serif",fontSize:11,fontWeight:600,background:isActive?"linear-gradient(135deg,#22d3ee,#3b82f6)":"transparent",color:isActive?"#fff":t.textSub,boxShadow:isActive?"0 2px 8px rgba(34,211,238,0.3)":"none",transition:"all 0.2s" }}>{label}</button>; })}
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ position:"relative" }}>
                <Search size={14} style={{ position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:t.textMuted,pointerEvents:"none" }} />
                <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft:34,paddingRight:14,height:36,width:200,borderRadius:10,border:`1px solid ${t.border}`,background:t.cardBg,color:t.text,fontSize:11,fontFamily:"'Poppins',sans-serif",outline:"none",boxShadow:t.shadow }} />
              </div>
              {/* role selector */}
              <div style={{ position:"relative" }}>
                <button onClick={() => setDropOpen(o => !o)} style={{ display:"flex",alignItems:"center",gap:8,height:36,padding:"0 14px",borderRadius:10,border:`1px solid ${t.border}`,background:t.cardBg,color:t.text,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Poppins',sans-serif",boxShadow:t.shadow,minWidth:150 }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:roleColor,display:"inline-block",flexShrink:0 }} />
                  {titleMap[selectedRole]}
                  <ChevronRight size={12} color={t.textMuted} style={{ marginLeft:"auto",transform:dropOpen?"rotate(90deg)":"none",transition:"transform 0.2s" }} />
                </button>
                {dropOpen && (
                  <div style={{ position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:t.dropdownBg,border:`1px solid ${t.border}`,borderRadius:12,boxShadow:t.shadowHov,zIndex:999 }}>
                    {ROLE_OPTIONS.map(r => (
                      <div key={r} className="drop-item" onClick={() => { setSelectedRole(r); setDropOpen(false); }} style={{ padding:"9px 14px",fontSize:12,cursor:"pointer",color:t.text,fontFamily:"'Poppins',sans-serif",display:"flex",alignItems:"center",gap:8,background:selectedRole===r?(isDark?"rgba(34,211,238,0.1)":"rgba(34,211,238,0.07)"):"transparent",fontWeight:selectedRole===r?600:400 }}>
                        <span style={{ width:7,height:7,borderRadius:"50%",background:ROLE_COLORS[r],display:"inline-block",flexShrink:0 }} />{titleMap[r]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LIST CARD */}
          <div style={{ background:t.cardBg,border:`1px solid ${t.border}`,borderRadius:20,overflow:"hidden",boxShadow:t.shadow }}>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 22px",borderBottom:`1px solid ${t.border}`,background:isDark?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.01)" }}>
              <div>
                <p style={{ fontSize:13,fontWeight:700,color:t.text,margin:0,fontFamily:"'Poppins',sans-serif" }}>Pending {titleMap[selectedRole]}</p>
                <p style={{ fontSize:10,color:t.textMuted,margin:"3px 0 0",fontFamily:"'Poppins',sans-serif" }}>{filtered.length} request{filtered.length !== 1 && "s"} awaiting review</p>
              </div>
              <span style={{ ...pill,background:`${roleColor}14`,border:`1px solid ${roleColor}33`,color:roleColor }}>{titleMap[selectedRole]}</span>
            </div>

            <div style={{ padding:16,display:"flex",flexDirection:"column",gap:10 }}>
              {/* skeleton */}
              {loading && [1,2,3].map(i => (
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",borderRadius:14,border:`1px solid ${t.border}`,padding:14,animation:"shimmer 1.5s ease infinite" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:40,height:40,borderRadius:12,background:t.skeletonBg }} />
                    <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
                      <div style={{ height:10,width:120,borderRadius:5,background:t.skeletonBg }} />
                      <div style={{ height:8,width:160,borderRadius:4,background:t.skeletonBg }} />
                    </div>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <div style={{ height:32,width:80,borderRadius:10,background:t.skeletonBg }} />
                    <div style={{ height:32,width:64,borderRadius:10,background:t.skeletonBg }} />
                  </div>
                </div>
              ))}

              {/* empty */}
              {!loading && filtered.length === 0 && (
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"52px 0",gap:12 }}>
                  <div style={{ width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",background:isDark?"rgba(52,211,153,0.08)":"rgba(22,163,74,0.07)",border:`1px solid ${isDark?"rgba(52,211,153,0.2)":"rgba(22,163,74,0.2)"}` }}>
                    <CheckCircle2 size={22} color={isDark?"#34d399":"#16a34a"} />
                  </div>
                  <p style={{ fontSize:13,fontWeight:700,color:t.text,fontFamily:"'Poppins',sans-serif",margin:0 }}>All Caught Up!</p>
                  <p style={{ fontSize:11,color:t.textMuted,fontFamily:"'Poppins',sans-serif",margin:0 }}>No pending approvals for {titleMap[selectedRole]}</p>
                </div>
              )}

              {/* rows */}
              {!loading && filtered.map(u => {
                const [c1,c2] = gradColor(u.name || u.email);
                return (
                  <div key={u.userId || u.id} className="pend-row" style={{ display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:14,borderRadius:14,border:`1px solid ${t.recentItemBorder}`,padding:"13px 16px",background:t.recentItemBg,transition:"background 0.15s",cursor:"default" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                      <div style={{ width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${c1},${c2})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:15,fontFamily:"'Poppins',sans-serif",boxShadow:`0 3px 10px ${c1}44`,flexShrink:0 }}>
                        {(u.name || u.email)?.charAt(0)?.toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <p className="pname" style={{ fontSize:13,fontWeight:700,color:t.text,margin:0,fontFamily:"'Poppins',sans-serif" }}>{u.name || "—"}</p>
                        <div style={{ display:"flex",alignItems:"center",gap:5,marginTop:3 }}><Mail size={11} color={t.textMuted} /><span style={{ fontSize:10,color:t.textMuted,fontFamily:"'Poppins',sans-serif" }}>{u.email}</span></div>
                      </div>
                    </div>
                    <div style={{ display:"flex",gap:8,flexShrink:0 }}>
                      <button onClick={() => approveUser(u.userId || u.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:10,background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.25)",color:isDark?"#34d399":"#16a34a",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif",transition:"all 0.15s" }}>
                        <Check size={13} /> Approve
                      </button>
                      <button onClick={() => rejectUser(u.userId || u.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:10,background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",color:"#f43f5e",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Poppins',sans-serif",transition:"all 0.15s" }}>
                        <X size={13} /> Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}