import React, { useState, useRef, useEffect } from "react";

// ── Mock people data ──────────────────────────────────────────
const PEOPLE = [
  { id: "s1",  name: "Arjun Mehta",       role: "Student",  email: "arjun@example.com",   org: "Innovate Labs"    },
  { id: "s2",  name: "Priya Sharma",      role: "Student",  email: "priya@example.com",   org: "EduZone Academy"  },
  { id: "s3",  name: "Rahul Verma",       role: "Student",  email: "rahul@example.com",   org: "TechVenture Inc." },
  { id: "s4",  name: "Sneha Patel",       role: "Student",  email: "sneha@example.com",   org: "Innovate Labs"    },
  { id: "s5",  name: "Karan Singh",       role: "Student",  email: "karan@example.com",   org: "EduZone Academy"  },
  { id: "t1",  name: "Meera Joshi",       role: "Trainer",  email: "meera@example.com",   org: "Innovate Labs"    },
  { id: "t2",  name: "Vikram Nair",       role: "Trainer",  email: "vikram@example.com",  org: "TechVenture Inc." },
  { id: "t3",  name: "Deepa Rao",         role: "Trainer",  email: "deepa@example.com",   org: "EduZone Academy"  },
  { id: "a1",  name: "Suresh Kumar",      role: "Admin",    email: "suresh@example.com",  org: "Innovate Labs"    },
  { id: "a2",  name: "Anita Desai",       role: "Admin",    email: "anita@example.com",   org: "TechVenture Inc." },
];

const SAVED_GROUPS = [
  { id: "g1", name: "Frontend Batch A", members: ["s1", "s2", "t1"], color: "#6366f1" },
  { id: "g2", name: "Advanced Trainers", members: ["t1", "t2", "t3"], color: "#ec4899" },
];

const templates = [
  { id: 1, name: "Welcome New Organisation", subject: "Welcome to IlmOra! 🎉",               preview: "Congratulations on joining our platform...",               category: "Welcome",    color: "#6366f1", usedCount: 48  },
  { id: 2, name: "Password Reset",           subject: "Your Password Reset Request",          preview: "You have requested to reset your password...",             category: "Security",   color: "#ef4444", usedCount: 124 },
  { id: 3, name: "Monthly Report Summary",   subject: "Your Monthly Performance Report",      preview: "Here is a summary of your organisation's performance...", category: "Reports",    color: "#f59e0b", usedCount: 89  },
  { id: 4, name: "Course Completion",        subject: "Congratulations! Course Completed 🏆", preview: "You have successfully completed the course...",            category: "Onboarding", color: "#10b981", usedCount: 67  },
  { id: 5, name: "Subscription Renewal",     subject: "Your Subscription Renews Soon",        preview: "Your subscription plan is set to renew on...",             category: "Business",   color: "#8b5cf6", usedCount: 34  },
  { id: 6, name: "System Maintenance",       subject: "Scheduled Maintenance Notification",   preview: "We will be performing scheduled maintenance on...",        category: "Support",    color: "#06b6d4", usedCount: 12  },
];

const sentHistory = [
  { id: 1, subject: "Welcome to IlmOra! 🎉",     to: "Innovate Labs Team",    type: "Single",   sentAt: "Feb 03, 2026 10:30", status: "Delivered", opens: 12,  clicks: 4  },
  { id: 2, subject: "Monthly Performance Report", to: "All Organisations (8)", type: "Campaign", sentAt: "Feb 01, 2026 09:00", status: "Delivered", opens: 45,  clicks: 18 },
  { id: 3, subject: "Subscription Renews Soon",   to: "Future Skills Hub",     type: "Single",   sentAt: "Jan 30, 2026 14:15", status: "Delivered", opens: 3,   clicks: 1  },
  { id: 4, subject: "System Maintenance Alert",   to: "All Users (364)",       type: "Campaign", sentAt: "Jan 28, 2026 08:00", status: "Delivered", opens: 198, clicks: 0  },
  { id: 5, subject: "Password Reset Request",     to: "Arjun Mehta",           type: "Single",   sentAt: "Jan 27, 2026 16:45", status: "Failed",    opens: 0,   clicks: 0  },
  { id: 6, subject: "Course Completion Notice",   to: "Rahul Verma",           type: "Single",   sentAt: "Jan 25, 2026 11:20", status: "Delivered", opens: 1,   clicks: 1  },
];

const recipientOptions = [
  { label: "All Organisations",  value: "all-orgs",     count: 8     },
  { label: "All Admins",         value: "all-admins",   count: 364   },
  { label: "All Trainers",       value: "all-trainers", count: 892   },
  { label: "All Students",       value: "all-students", count: 12458 },
  { label: "Innovate Labs",      value: "org-1",        count: 48    },
  { label: "TechVenture Inc.",   value: "org-2",        count: 36    },
  { label: "EduZone Academy",    value: "org-3",        count: 52    },
  { label: "Active Subscribers", value: "active-subs",  count: 312   },
];

const ROLE_COLORS = { Student: "#6366f1", Trainer: "#10b981", Admin: "#f59e0b" };
const ROLE_BG    = { Student: "rgba(99,102,241,.1)", Trainer: "rgba(16,185,129,.1)", Admin: "rgba(245,158,11,.1)" };
const INITIAL_CATEGORIES = ["All","Welcome","Onboarding","Security","Reports","Business","Support"];
const LABEL_COLORS = ["#6366f1","#22c55e","#f59e0b","#8b5cf6","#ec4899","#3b82f6","#ef4444","#10b981","#000"];

// ── Helpers ───────────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} style={{ width:42,height:24,borderRadius:12,background:value?"#6366f1":"#e5e7eb",position:"relative",cursor:"pointer",transition:"background .25s",flexShrink:0 }}>
    <div style={{ width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:value?21:3,transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.22)" }} />
  </div>
);

const StatusBadge = ({ status }) => {
  const map = { Delivered:["rgba(16,185,129,.12)","#10b981"], Pending:["rgba(245,158,11,.12)","#d97706"], Failed:["rgba(239,68,68,.12)","#ef4444"] };
  const [bg,color] = map[status]||map.Pending;
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,padding:"4px 10px",borderRadius:6,background:bg,color }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:color,display:"inline-block" }} />{status}
    </span>
  );
};

const Field = ({ label, children }) => (
  <div>
    {label && <label style={{ fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:5 }}>{label}</label>}
    {children}
  </div>
);

const inputStyle = { width:"100%",padding:"9px 12px",borderRadius:8,border:"1px solid #e5e7eb",fontSize:13.5,color:"#111827",outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"#fff" };

// ── Recipient Tag Chip ────────────────────────────────────────
const RecipientChip = ({ person, onRemove }) => (
  <div style={{ display:"inline-flex",alignItems:"center",gap:6,padding:"3px 8px 3px 6px",borderRadius:20,background:ROLE_BG[person.role]||"#f3f4f6",border:`1px solid ${ROLE_COLORS[person.role]||"#e5e7eb"}30` }}>
    <div style={{ width:20,height:20,borderRadius:"50%",background:`linear-gradient(135deg,${ROLE_COLORS[person.role]},${ROLE_COLORS[person.role]}99)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:"#fff",flexShrink:0 }}>
      {person.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
    </div>
    <span style={{ fontSize:12.5,fontWeight:600,color:ROLE_COLORS[person.role]||"#374151",whiteSpace:"nowrap" }}>{person.name}</span>
    <span style={{ fontSize:10,color:"#9ca3af",background:"rgba(0,0,0,.06)",padding:"1px 5px",borderRadius:8 }}>{person.role}</span>
    <button onClick={()=>onRemove(person.id)} style={{ background:"none",border:"none",cursor:"pointer",color:"#9ca3af",padding:0,display:"flex",alignItems:"center",fontSize:13,lineHeight:1 }}>×</button>
  </div>
);

// ── People Search Dropdown ────────────────────────────────────
const PeopleSearchInput = ({ selected, onChange, placeholder="Search people..." }) => {
  const [query, setQuery] = useState("");
  const [open,  setOpen]  = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = query.length > 0
    ? PEOPLE.filter(p =>
        !selected.find(s=>s.id===p.id) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
         p.email.toLowerCase().includes(query.toLowerCase()) ||
         p.role.toLowerCase().includes(query.toLowerCase()))
      ).slice(0,6)
    : [];

  const add = (person) => { onChange([...selected, person]); setQuery(""); setOpen(false); };
  const remove = (id)  => onChange(selected.filter(p=>p.id!==id));

  return (
    <div ref={ref} style={{ position:"relative" }}>
      {/* Tag container */}
      <div
        style={{ minHeight:42,padding:"6px 10px",borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",display:"flex",flexWrap:"wrap",gap:5,alignItems:"center",cursor:"text",transition:"border-color .15s" }}
        onClick={()=>{ setOpen(true); ref.current?.querySelector("input")?.focus(); }}
      >
        {selected.map(p=>(
          <RecipientChip key={p.id} person={p} onRemove={remove} />
        ))}
        <input
          value={query}
          onChange={e=>{ setQuery(e.target.value); setOpen(true); }}
          onFocus={()=>setOpen(true)}
          placeholder={selected.length===0?placeholder:""}
          style={{ border:"none",outline:"none",fontSize:13.5,color:"#111827",flex:1,minWidth:120,background:"transparent",fontFamily:"inherit",padding:"2px 0" }}
        />
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={{ position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:999,overflow:"hidden" }}>
          {results.map(p=>(
            <div
              key={p.id}
              onMouseDown={()=>add(p)}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",transition:"background .1s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#f5f3ff"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${ROLE_COLORS[p.role]},${ROLE_COLORS[p.role]}80)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff",flexShrink:0 }}>
                {p.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13.5,fontWeight:600,color:"#111827" }}>{p.name}</div>
                <div style={{ fontSize:11.5,color:"#9ca3af",marginTop:1 }}>{p.email}</div>
              </div>
              <span style={{ fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:ROLE_BG[p.role],color:ROLE_COLORS[p.role] }}>{p.role}</span>
            </div>
          ))}
        </div>
      )}
      {open && query.length > 0 && results.length === 0 && (
        <div style={{ position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",boxShadow:"0 8px 24px rgba(0,0,0,.12)",zIndex:999,padding:"14px",textAlign:"center",fontSize:13,color:"#9ca3af" }}>
          No results for "{query}"
        </div>
      )}
    </div>
  );
};

// ── Custom Group Builder ──────────────────────────────────────
const GroupBuilder = ({ onClose, onSave }) => {
  const [groupName,    setGroupName]    = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupColor,   setGroupColor]   = useState("#6366f1");
  const [saved,        setSaved]        = useState(false);

  const handleSave = () => {
    if (!groupName.trim() || groupMembers.length === 0) return;
    onSave({ id: `g${Date.now()}`, name: groupName.trim(), members: groupMembers.map(m=>m.id), color: groupColor, memberObjects: groupMembers });
    setSaved(true);
    setTimeout(()=>{ setSaved(false); onClose(); }, 1200);
  };

  const roleCount = (role) => groupMembers.filter(m=>m.role===role).length;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(4px)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ background:"#fff",borderRadius:16,width:"100%",maxWidth:560,boxShadow:"0 24px 60px rgba(0,0,0,.2)",overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1e3a8a,#4f46e5)",padding:"18px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16,fontWeight:700,color:"#fff" }}>Create Custom Group</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,.65)",marginTop:2 }}>Mix students, trainers & admins into one group</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",fontSize:18 }}>×</button>
        </div>

        <div style={{ padding:24,display:"flex",flexDirection:"column",gap:18 }}>
          {/* Group name */}
          <Field label="GROUP NAME *">
            <input
              placeholder="e.g. Frontend Batch A"
              value={groupName}
              onChange={e=>setGroupName(e.target.value)}
              style={inputStyle}
              onFocus={e=>e.target.style.borderColor="#6366f1"}
              onBlur={e=>e.target.style.borderColor="#e5e7eb"}
            />
          </Field>

          {/* Members */}
          <Field label={`ADD MEMBERS * — ${groupMembers.length} added`}>
            <PeopleSearchInput selected={groupMembers} onChange={setGroupMembers} placeholder="Search by name, email, or role..." />
          </Field>

          {/* Composition bar */}
          {groupMembers.length > 0 && (
            <div style={{ padding:"12px 14px",borderRadius:9,background:"#f8fafc",border:"1px solid #e5e7eb" }}>
              <div style={{ fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em" }}>Group Composition</div>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {["Student","Trainer","Admin"].map(role=>{
                  const cnt = roleCount(role);
                  if (!cnt) return null;
                  return (
                    <div key={role} style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 11px",borderRadius:20,background:ROLE_BG[role],border:`1px solid ${ROLE_COLORS[role]}25` }}>
                      <span style={{ width:8,height:8,borderRadius:"50%",background:ROLE_COLORS[role],display:"inline-block" }} />
                      <span style={{ fontSize:12.5,fontWeight:700,color:ROLE_COLORS[role] }}>{cnt} {role}{cnt>1?"s":""}</span>
                    </div>
                  );
                })}
              </div>
              {/* visual bar */}
              <div style={{ display:"flex",height:4,borderRadius:4,overflow:"hidden",marginTop:10,gap:2 }}>
                {["Student","Trainer","Admin"].map(role=>{
                  const pct = (roleCount(role)/groupMembers.length)*100;
                  if (!pct) return null;
                  return <div key={role} style={{ flex:pct,background:ROLE_COLORS[role],borderRadius:4 }} />;
                })}
              </div>
            </div>
          )}

          {/* Color */}
          <Field label="GROUP COLOR">
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:2 }}>
              {LABEL_COLORS.map(c=>(
                <button key={c} onClick={()=>setGroupColor(c)} style={{ width:26,height:26,borderRadius:"50%",background:c,border:groupColor===c?"3px solid #6366f1":"3px solid transparent",cursor:"pointer",outline:groupColor===c?"2px solid #fff":"none",outlineOffset:1,transition:"all .15s" }} />
              ))}
            </div>
          </Field>

          {/* Actions */}
          <div style={{ display:"flex",gap:10,paddingTop:4 }}>
            <button onClick={onClose} style={{ flex:1,padding:"10px",borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",fontSize:13.5,fontWeight:600,color:"#374151",cursor:"pointer" }}>Cancel</button>
            <button
              onClick={handleSave}
              disabled={!groupName.trim()||groupMembers.length===0}
              style={{ flex:2,padding:"10px",borderRadius:9,border:"none",background:(!groupName.trim()||groupMembers.length===0)?"#e5e7eb":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:(!groupName.trim()||groupMembers.length===0)?"#9ca3af":"#fff",fontSize:13.5,fontWeight:700,cursor:(!groupName.trim()||groupMembers.length===0)?"not-allowed":"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:(!groupName.trim()||groupMembers.length===0)?"none":"0 3px 12px rgba(99,102,241,.3)" }}
            >
              {saved ? (
                <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>
              ) : (
                <><svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> Save Group</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
export default function SendEmail() {
  const [activeTab,        setActiveTab]        = useState("compose");
  const [activeCat,        setActiveCat]        = useState("All");
  const [searchQ,          setSearchQ]          = useState("");
  const [sortBy,           setSortBy]           = useState("Most Recent");
  const [showNewTemplate,  setShowNewTemplate]  = useState(false);
  const [selectedLabel,    setSelectedLabel]    = useState(LABEL_COLORS[0]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [sentSuccess,      setSentSuccess]      = useState(false);
  const [showGroupBuilder, setShowGroupBuilder] = useState(false);
  const [savedGroups,      setSavedGroups]      = useState(SAVED_GROUPS);
  const [categories,       setCategories]       = useState(INITIAL_CATEGORIES);
  const [customCatMode,    setCustomCatMode]    = useState(false);
  const [customCatInput,   setCustomCatInput]   = useState("");
  const [selectedGroupId,  setSelectedGroupId]  = useState(null); // for campaign

  // Compose individual recipients
  const [composeRecipients, setComposeRecipients] = useState([]);
  const [composeData,  setComposeData]  = useState({ subject:"", body:"", schedule:false });
  const [campaignData, setCampaignData] = useState({ subject:"", body:"", schedule:false });
  const [newTpl, setNewTpl] = useState({ name:"", subject:"", category:"Welcome", whenToUse:"" });

  const filtered = templates.filter(t =>
    (activeCat==="All"||t.category===activeCat) &&
    (t.name.toLowerCase().includes(searchQ.toLowerCase())||t.subject.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const totalBulkRecipients = recipientOptions
    .filter(r=>selectedRecipients.includes(r.value))
    .reduce((a,r)=>a+r.count,0);

  const fire = (reset) => { setSentSuccess(true); reset(); setTimeout(()=>setSentSuccess(false),3000); };

  const handleAddCategory = () => {
    const name = customCatInput.trim();
    if (!name) return;
    if (!categories.includes(name)) setCategories(prev=>[...prev,name]);
    setNewTpl(p=>({...p,category:name}));
    setCustomCatInput(""); setCustomCatMode(false);
  };

  const handleSaveGroup = (group) => {
    setSavedGroups(prev=>[...prev,group]);
  };

  const NAV = [
    { id:"compose",   label:"Compose",      icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { id:"campaign",  label:"Campaign",     icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68 2 2 0 011.99-2.18h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9a16 16 0 006.29 6.29l1.13-1.13a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg> },
    { id:"templates", label:"Templates",    icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={7} height={7}/><rect x={14} y={3} width={7} height={7}/><rect x={14} y={14} width={7} height={7}/><rect x={3} y={14} width={7} height={7}/></svg> },
    { id:"history",   label:"Sent History", icon:<svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  ];

  // ── NEW TEMPLATE BUILDER ──────────────────────────────────
  if (showNewTemplate) {
    return (
      <div style={{ minHeight:"100vh",background:"#f8fafc" }}>
        <div style={{ background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>setShowNewTemplate(false)} style={{ display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:"#6b7280",background:"none",cursor:"pointer",padding:"6px 10px",borderRadius:7,border:"1px solid #e5e7eb" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Back
            </button>
            <div>
              <div style={{ fontSize:16,fontWeight:700,color:"#111827" }}>New Email Template</div>
              <div style={{ fontSize:12,color:"#9ca3af" }}>Design your email with drag & drop blocks</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={()=>setShowNewTemplate(false)} style={{ padding:"8px 20px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",fontSize:13.5,fontWeight:600,color:"#374151",cursor:"pointer" }}>Cancel</button>
            <button onClick={()=>setShowNewTemplate(false)} style={{ padding:"8px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:13.5,fontWeight:600,cursor:"pointer",boxShadow:"0 3px 10px rgba(99,102,241,.3)" }}>+ Save Template</button>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"340px 1fr 240px",height:"calc(100vh - 61px)",overflow:"hidden" }}>
          <div style={{ background:"#fff",borderRight:"1px solid #e5e7eb",overflowY:"auto" }}>
            <div style={{ background:"linear-gradient(135deg,#1e3a8a,#3730a3)",padding:"14px 20px" }}>
              <div style={{ fontSize:13,fontWeight:700,color:"#93c5fd" }}>Template Details</div>
              <div style={{ fontSize:11,color:"#93c5fd",opacity:.7 }}>Fill in template info</div>
            </div>
            <div style={{ padding:20,display:"flex",flexDirection:"column",gap:16 }}>
              <Field label="TEMPLATE NAME *">
                <input placeholder="e.g. Post-Demo Follow-up" value={newTpl.name} onChange={e=>setNewTpl(p=>({...p,name:e.target.value}))} style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
              </Field>
              <Field label="EMAIL SUBJECT *">
                <input placeholder="e.g. Following up on our demo" value={newTpl.subject} onChange={e=>setNewTpl(p=>({...p,subject:e.target.value}))} style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
              </Field>
              <Field label="CATEGORY">
                {!customCatMode?(
                  <select value={newTpl.category} onChange={e=>{ if(e.target.value==="__add__") setCustomCatMode(true); else setNewTpl(p=>({...p,category:e.target.value})); }} style={{ ...inputStyle,background:"#f9fafb" }}>
                    {categories.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
                    <option disabled>──────────</option>
                    <option value="__add__" style={{ color:"#6366f1",fontWeight:700 }}>＋ Add New Category</option>
                  </select>
                ):(
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    <div style={{ display:"flex",gap:7 }}>
                      <input autoFocus placeholder="New category name..." value={customCatInput} onChange={e=>setCustomCatInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") handleAddCategory(); if(e.key==="Escape"){setCustomCatMode(false);setCustomCatInput("");} }} style={{ ...inputStyle,flex:1,borderColor:"#6366f1",boxShadow:"0 0 0 3px rgba(99,102,241,.1)" }} />
                      <button onClick={handleAddCategory} style={{ flexShrink:0,padding:"8px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer" }}>Save</button>
                      <button onClick={()=>{setCustomCatMode(false);setCustomCatInput("");}} style={{ flexShrink:0,padding:"8px 10px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:13,cursor:"pointer" }}>✕</button>
                    </div>
                    <div style={{ fontSize:11,color:"#9ca3af" }}>Press Enter to save · Esc to cancel</div>
                  </div>
                )}
              </Field>
              <Field label="WHEN TO USE">
                <textarea placeholder="e.g. Send after a product demo call" value={newTpl.whenToUse} onChange={e=>setNewTpl(p=>({...p,whenToUse:e.target.value}))} rows={3} style={{ ...inputStyle,resize:"vertical",lineHeight:1.5 }} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
              </Field>
              <Field label="LABEL COLOR">
                <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginTop:4 }}>
                  {LABEL_COLORS.map(c=>(
                    <button key={c} onClick={()=>setSelectedLabel(c)} style={{ width:24,height:24,borderRadius:"50%",background:c,border:selectedLabel===c?"3px solid #6366f1":"3px solid transparent",cursor:"pointer",outline:selectedLabel===c?"2px solid #fff":"none",outlineOffset:1 }} />
                  ))}
                </div>
              </Field>
            </div>
          </div>
          <div style={{ background:"#f1f5f9",display:"flex",flexDirection:"column" }}>
            <div style={{ padding:"10px 16px",background:"#fff",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:12 }}>
              <span style={{ display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600,color:"#10b981" }}>
                <span style={{ width:8,height:8,borderRadius:"50%",background:"#10b981",display:"inline-block" }} />Drag & Drop Editor · Ready
              </span>
            </div>
            <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:32 }}>
              <div style={{ width:"100%",maxWidth:520,background:"#fff",borderRadius:8,border:"2px dashed #cbd5e1",minHeight:340,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10 }}>
                <div style={{ fontSize:13,color:"#94a3b8" }}>No content here. Drag content from right.</div>
                <div style={{ fontSize:12,color:"#cbd5e1" }}>Drop blocks to start building your email</div>
              </div>
            </div>
          </div>
          <div style={{ background:"#fff",borderLeft:"1px solid #e5e7eb",overflowY:"auto" }}>
            {[
              { label:"Content",items:[{name:"Columns",icon:"⬛"},{name:"Button",icon:"🔲"},{name:"Divider",icon:"➖"},{name:"Blocks",icon:"⊞"}] },
              { label:"",      items:[{name:"Heading",icon:"H"},{name:"Paragraph",icon:"¶"},{name:"Image",icon:"🖼"},{name:"Body",icon:"▭"}] },
              { label:"",      items:[{name:"Social",icon:"👤"},{name:"Menu",icon:"☰"},{name:"HTML",icon:"</>"}] },
            ].map((section,si)=>(
              <div key={si}>
                {section.label&&<div style={{ padding:"14px 16px 6px",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>{section.label}</div>}
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"8px 12px" }}>
                  {section.items.map(item=>(
                    <button key={item.name} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 8px",borderRadius:8,border:"1px solid #e5e7eb",background:"#f9fafb",cursor:"grab",fontSize:11,color:"#374151",fontWeight:600,transition:"all .15s" }} onMouseEnter={e=>{e.currentTarget.style.background="#eef2ff";e.currentTarget.style.borderColor="#a5b4fc";}} onMouseLeave={e=>{e.currentTarget.style.background="#f9fafb";e.currentTarget.style.borderColor="#e5e7eb";}}>
                      <span style={{ fontSize:18 }}>{item.icon}</span>{item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN PAGE ──────────────────────────────────────────────
  return (
    <div style={{ display:"flex",gap:0,minHeight:"calc(100vh - 96px)",background:"#f8fafc" }}>
      {showGroupBuilder && <GroupBuilder onClose={()=>setShowGroupBuilder(false)} onSave={handleSaveGroup} />}

      {/* Sidebar */}
      <div style={{ width:220,flexShrink:0,background:"#fff",borderRight:"1px solid #e5e7eb",borderRadius:"12px 0 0 12px",overflow:"hidden" }}>
        <div style={{ padding:"20px 16px 12px" }}>
          <div style={{ fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:8 }}>Email Tools</div>
          {NAV.map(n=>{
            const isActive = activeTab===n.id;
            return (
              <button key={n.id} onClick={()=>setActiveTab(n.id)} style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:"none",background:isActive?"rgba(99,102,241,.09)":"transparent",color:isActive?"#6366f1":"#6b7280",fontSize:13.5,fontWeight:isActive?700:500,cursor:"pointer",textAlign:"left",marginBottom:2,borderLeft:isActive?"3px solid #6366f1":"3px solid transparent",transition:"all .15s" }}>
                {n.icon}{n.label}
              </button>
            );
          })}
        </div>
        {activeTab==="templates"&&(
          <div style={{ padding:"0 16px 16px" }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.09em",margin:"10px 0 8px" }}>Categories</div>
            {categories.map(cat=>{
              const count = cat==="All"?templates.length:templates.filter(t=>t.category===cat).length;
              const isActive = activeCat===cat;
              return (
                <button key={cat} onClick={()=>setActiveCat(cat)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",borderRadius:7,border:"none",background:isActive?"rgba(99,102,241,.09)":"transparent",color:isActive?"#6366f1":"#6b7280",fontSize:13,fontWeight:isActive?700:500,cursor:"pointer",textAlign:"left",marginBottom:1,transition:"all .15s" }}>
                  <span>{cat}</span>
                  <span style={{ fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:999,background:isActive?"rgba(99,102,241,.15)":"#f3f4f6",color:isActive?"#6366f1":"#9ca3af" }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
        {/* Saved groups in sidebar when campaign tab */}
        {activeTab==="campaign"&&(
          <div style={{ padding:"0 16px 16px" }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.09em",margin:"10px 0 8px" }}>Saved Groups</div>
            {savedGroups.map(g=>(
              <button key={g.id} onClick={()=>setSelectedGroupId(g.id===selectedGroupId?null:g.id)} style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",borderRadius:7,border:"none",background:selectedGroupId===g.id?"rgba(99,102,241,.09)":"transparent",color:selectedGroupId===g.id?"#6366f1":"#6b7280",fontSize:13,fontWeight:selectedGroupId===g.id?700:500,cursor:"pointer",textAlign:"left",marginBottom:1,transition:"all .15s" }}>
                <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:g.color,display:"inline-block",flexShrink:0 }} />
                  <span style={{ fontSize:12.5 }}>{g.name}</span>
                </div>
                <span style={{ fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:999,background:"#f3f4f6",color:"#9ca3af" }}>{g.members.length}</span>
              </button>
            ))}
            <button onClick={()=>setShowGroupBuilder(true)} style={{ width:"100%",marginTop:6,padding:"7px 10px",borderRadius:7,border:"1.5px dashed #d1d5db",background:"transparent",color:"#9ca3af",fontSize:12.5,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor="#6366f1";e.currentTarget.style.color="#6366f1";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#d1d5db";e.currentTarget.style.color="#9ca3af";}}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg> New Group
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#1e3a8a 0%,#3730a3 60%,#4f46e5 100%)",padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:44,height:44,borderRadius:12,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:18,fontWeight:700,color:"#fff" }}>
                {{compose:"Compose Email",campaign:"Email Campaign",templates:"Email Templates",history:"Sent History"}[activeTab]}
              </div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,.65)",marginTop:1 }}>
                {{compose:"Send to specific individuals",campaign:"Bulk emails to multiple recipient groups",templates:"Drag & drop designer · Variables · Reusable",history:"Track all sent emails and their performance"}[activeTab]}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",gap:10 }}>
            {[{label:"Total",value:templates.length},{label:"Categories",value:categories.length-1},{label:"Most Used",value:`${Math.max(...templates.map(t=>t.usedCount))}×`}].map(s=>(
              <div key={s.label} style={{ background:"rgba(255,255,255,.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.18)",borderRadius:10,padding:"10px 16px",textAlign:"center",minWidth:70 }}>
                <div style={{ fontSize:18,fontWeight:800,color:"#fff",lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:10,color:"rgba(255,255,255,.65)",marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1,overflowY:"auto",padding:24 }}>
          {sentSuccess&&(
            <div style={{ marginBottom:16,padding:"12px 16px",borderRadius:10,background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.2)",display:"flex",alignItems:"center",gap:10 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize:14,fontWeight:600,color:"#10b981" }}>Email sent successfully! 🎉</span>
            </div>
          )}

          {/* ═══ COMPOSE ═══ */}
          {activeTab==="compose"&&(
            <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:20 }}>
              <div style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",overflow:"hidden" }}>
                <div style={{ padding:"16px 22px",borderBottom:"1px solid #f0f1f3",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div style={{ fontSize:15,fontWeight:700,color:"#111827" }}>New Email</div>
                  <div style={{ fontSize:12,color:"#9ca3af" }}>Search & add specific recipients</div>
                </div>
                <div style={{ padding:22,display:"flex",flexDirection:"column",gap:16 }}>

                  {/* ── Individual recipient search ── */}
                  <Field label="To — Search People">
                    <PeopleSearchInput
                      selected={composeRecipients}
                      onChange={setComposeRecipients}
                      placeholder="Type a name, email or role..."
                    />
                    {composeRecipients.length>0&&(
                      <div style={{ marginTop:8,padding:"8px 12px",borderRadius:8,background:"rgba(99,102,241,.04)",border:"1px solid rgba(99,102,241,.12)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                        <span style={{ fontSize:12.5,color:"#6b7280" }}>{composeRecipients.length} recipient{composeRecipients.length>1?"s":""} selected</span>
                        <button onClick={()=>setComposeRecipients([])} style={{ fontSize:11.5,color:"#ef4444",background:"none",border:"none",cursor:"pointer",fontWeight:600 }}>Clear all</button>
                      </div>
                    )}
                  </Field>

                  <Field label="Subject">
                    <input placeholder="Enter email subject..." value={composeData.subject} onChange={e=>setComposeData(p=>({...p,subject:e.target.value}))} style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
                  </Field>
                  <Field label="Message Body">
                    <textarea placeholder="Write your email message here..." value={composeData.body} onChange={e=>setComposeData(p=>({...p,body:e.target.value}))} rows={8} style={{ ...inputStyle,resize:"vertical",lineHeight:1.6 }} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
                  </Field>
                  <div style={{ display:"flex",alignItems:"center",gap:12,padding:12,background:"#f7f8fa",borderRadius:9,border:"1px solid #eef0f2" }}>
                    <Toggle value={composeData.schedule} onChange={v=>setComposeData(p=>({...p,schedule:v}))} />
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:"#374151" }}>Schedule Send</div>
                      <div style={{ fontSize:11,color:"#9ca3af" }}>Set a specific date & time</div>
                    </div>
                  </div>
                  {composeData.schedule&&(
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                      <Field label="Date"><input type="date" style={inputStyle} /></Field>
                      <Field label="Time"><input type="time" style={inputStyle} /></Field>
                    </div>
                  )}
                  <div style={{ display:"flex",gap:10,paddingTop:4 }}>
                    <button style={{ flex:1,padding:10,borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",fontSize:13.5,fontWeight:600,color:"#374151",cursor:"pointer" }}>Save Draft</button>
                    <button
                      onClick={()=>fire(()=>{ setComposeData({subject:"",body:"",schedule:false}); setComposeRecipients([]); })}
                      disabled={composeRecipients.length===0||!composeData.subject}
                      style={{ flex:2,padding:10,borderRadius:9,border:"none",background:(composeRecipients.length===0||!composeData.subject)?"#e5e7eb":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:(composeRecipients.length===0||!composeData.subject)?"#9ca3af":"#fff",fontSize:13.5,fontWeight:700,cursor:(composeRecipients.length===0||!composeData.subject)?"not-allowed":"pointer",boxShadow:(composeRecipients.length===0||!composeData.subject)?"none":"0 3px 12px rgba(99,102,241,.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s" }}
                    >
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={22} y1={2} x2={11} y2={13}/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      {composeData.schedule?"Schedule Email":"Send Now"}
                    </button>
                  </div>
                </div>
              </div>
              {/* Right panel */}
              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                {/* Quick role select */}
                <div style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",padding:18 }}>
                  <div style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:12 }}>⚡ Quick Add by Role</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                    {["Student","Trainer","Admin"].map(role=>{
                      const rolePeople = PEOPLE.filter(p=>p.role===role);
                      const alreadyAll = rolePeople.every(p=>composeRecipients.find(r=>r.id===p.id));
                      return (
                        <button key={role} onClick={()=>{ if(alreadyAll){ setComposeRecipients(prev=>prev.filter(p=>p.role!==role)); } else { const toAdd=rolePeople.filter(p=>!composeRecipients.find(r=>r.id===p.id)); setComposeRecipients(prev=>[...prev,...toAdd]); } }} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,border:alreadyAll?`1.5px solid ${ROLE_COLORS[role]}`:"1px solid #eef0f2",background:alreadyAll?ROLE_BG[role]:"#fff",cursor:"pointer",transition:"all .15s" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <span style={{ width:8,height:8,borderRadius:"50%",background:ROLE_COLORS[role],display:"inline-block" }} />
                            <span style={{ fontSize:13,fontWeight:600,color:alreadyAll?ROLE_COLORS[role]:"#374151" }}>All {role}s</span>
                          </div>
                          <span style={{ fontSize:11,fontWeight:700,color:"#9ca3af" }}>{rolePeople.length}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {[
                  { title:"📊 Email Stats",rows:[{label:"Sent Today",val:"3"},{label:"Avg Open Rate",val:"68%"},{label:"Avg Click Rate",val:"22%"}] },
                  { title:"💡 Best Practices",tips:["Keep subject under 60 characters","Personalise with recipient name","Include a clear call-to-action","Test before sending to large groups"] },
                ].map((panel,pi)=>(
                  <div key={pi} style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",padding:18 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:"#111827",marginBottom:12 }}>{panel.title}</div>
                    {panel.rows&&panel.rows.map((r,ri)=>(
                      <div key={ri} style={{ display:"flex",justifyContent:"space-between",marginBottom:ri<panel.rows.length-1?10:0 }}>
                        <span style={{ fontSize:13,color:"#6b7280" }}>{r.label}</span>
                        <span style={{ fontSize:13,fontWeight:700,color:"#111827" }}>{r.val}</span>
                      </div>
                    ))}
                    {panel.tips&&panel.tips.map((tip,ti)=>(
                      <div key={ti} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:ti<panel.tips.length-1?10:0 }}>
                        <div style={{ width:18,height:18,borderRadius:5,background:"rgba(16,185,129,.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1 }}>
                          <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:13,color:"#6b7280" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ CAMPAIGN ═══ */}
          {activeTab==="campaign"&&(
            <div style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:20 }}>
              <div style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",overflow:"hidden" }}>
                <div style={{ padding:"16px 22px",borderBottom:"1px solid #f0f1f3",display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:38,height:38,borderRadius:10,background:"rgba(236,72,153,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📣</div>
                  <div>
                    <div style={{ fontSize:15,fontWeight:700,color:"#111827" }}>Email Campaign</div>
                    <div style={{ fontSize:12,color:"#9ca3af" }}>Send bulk emails to groups or custom segments</div>
                  </div>
                </div>
                <div style={{ padding:22,display:"flex",flexDirection:"column",gap:16 }}>
                  <Field label="Campaign Subject">
                    <input placeholder="e.g. Monthly Newsletter - Feb 2026" value={campaignData.subject} onChange={e=>setCampaignData(p=>({...p,subject:e.target.value}))} style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
                  </Field>
                  <Field label="Campaign Message">
                    <textarea placeholder="Write your campaign message..." value={campaignData.body} onChange={e=>setCampaignData(p=>({...p,body:e.target.value}))} rows={7} style={{ ...inputStyle,resize:"vertical",lineHeight:1.6 }} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e5e7eb"} />
                  </Field>
                  <div style={{ display:"flex",alignItems:"center",gap:12,padding:12,background:"#f7f8fa",borderRadius:9,border:"1px solid #eef0f2" }}>
                    <Toggle value={campaignData.schedule} onChange={v=>setCampaignData(p=>({...p,schedule:v}))} />
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:"#374151" }}>Schedule Campaign</div>
                      <div style={{ fontSize:11,color:"#9ca3af" }}>Emails will be sent at the specified time</div>
                    </div>
                  </div>
                  {campaignData.schedule&&(
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                      <Field label="Date"><input type="date" style={inputStyle} /></Field>
                      <Field label="Time"><input type="time" style={inputStyle} /></Field>
                    </div>
                  )}

                  {/* Selected group preview */}
                  {selectedGroupId&&(()=>{
                    const grp = savedGroups.find(g=>g.id===selectedGroupId);
                    if(!grp) return null;
                    return (
                      <div style={{ padding:"12px 14px",borderRadius:9,background:"rgba(99,102,241,.04)",border:"1px solid rgba(99,102,241,.15)" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                          <span style={{ width:10,height:10,borderRadius:"50%",background:grp.color,display:"inline-block" }} />
                          <span style={{ fontSize:13.5,fontWeight:700,color:"#111827" }}>{grp.name}</span>
                          <span style={{ fontSize:11,color:"#9ca3af",marginLeft:"auto" }}>{grp.members.length} members</span>
                        </div>
                        <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                          {(grp.memberObjects||PEOPLE.filter(p=>grp.members.includes(p.id))).map(m=>(
                            <span key={m.id} style={{ fontSize:11.5,padding:"2px 8px",borderRadius:12,background:ROLE_BG[m.role],color:ROLE_COLORS[m.role],fontWeight:600 }}>{m.name}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ padding:"11px 14px",borderRadius:9,background:selectedRecipients.length>0||selectedGroupId?"rgba(99,102,241,.06)":"#f7f8fa",border:`1px solid ${selectedRecipients.length>0||selectedGroupId?"rgba(99,102,241,.2)":"#eef0f2"}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <span style={{ fontSize:14,fontWeight:600,color:"#374151" }}>
                      Total Recipients: <span style={{ color:"#6366f1" }}>{
                        selectedGroupId
                          ? (savedGroups.find(g=>g.id===selectedGroupId)?.members.length||0) + totalBulkRecipients
                          : totalBulkRecipients
                      }</span>
                    </span>
                    <span style={{ fontSize:12,color:"#9ca3af" }}>{selectedRecipients.length} group(s){selectedGroupId?" + 1 custom":""}</span>
                  </div>
                  <div style={{ display:"flex",gap:10 }}>
                    <button style={{ flex:1,padding:10,borderRadius:9,border:"1px solid #e5e7eb",background:"#fff",fontSize:13.5,fontWeight:600,color:"#374151",cursor:"pointer" }}>Save Draft</button>
                    <button onClick={()=>fire(()=>{ setSelectedRecipients([]); setSelectedGroupId(null); setCampaignData({subject:"",body:"",schedule:false}); })} style={{ flex:2,padding:10,borderRadius:9,border:"none",background:"linear-gradient(135deg,#ec4899,#db2777)",color:"#fff",fontSize:13.5,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 12px rgba(236,72,153,.3)",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={22} y1={2} x2={11} y2={13}/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      {campaignData.schedule?"Schedule Campaign":"Launch Campaign"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Recipients panel */}
              <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
                {/* Bulk groups */}
                <div style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",overflow:"hidden" }}>
                  <div style={{ padding:"14px 18px",borderBottom:"1px solid #f0f1f3" }}>
                    <div style={{ fontSize:14,fontWeight:700,color:"#111827" }}>👥 Bulk Groups</div>
                    <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>Select one or more system groups</div>
                  </div>
                  <div style={{ padding:"10px 12px",display:"flex",flexDirection:"column",gap:6 }}>
                    {recipientOptions.map(r=>{
                      const sel=selectedRecipients.includes(r.value);
                      return (
                        <button key={r.value} onClick={()=>setSelectedRecipients(prev=>sel?prev.filter(v=>v!==r.value):[...prev,r.value])} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:9,border:sel?"2px solid #6366f1":"1px solid #eef0f2",background:sel?"rgba(99,102,241,.06)":"#fff",cursor:"pointer",transition:"all .15s",width:"100%",textAlign:"left" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                            <div style={{ width:18,height:18,borderRadius:5,border:sel?"none":"2px solid #d1d5db",background:sel?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                              {sel&&<svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <span style={{ fontSize:13,fontWeight:600,color:sel?"#6366f1":"#374151" }}>{r.label}</span>
                          </div>
                          <span style={{ fontSize:11,fontWeight:600,color:"#9ca3af",background:"#f3f4f6",padding:"2px 7px",borderRadius:8 }}>{r.count.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Create custom group CTA */}
                <button onClick={()=>setShowGroupBuilder(true)} style={{ padding:"13px 16px",borderRadius:12,border:"2px dashed #c7d2fe",background:"rgba(99,102,241,.03)",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s",textAlign:"left" }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(99,102,241,.07)";e.currentTarget.style.borderColor="#818cf8";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(99,102,241,.03)";e.currentTarget.style.borderColor="#c7d2fe";}}>
                  <div style={{ width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx={9} cy={7} r={4}/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:13.5,fontWeight:700,color:"#6366f1" }}>Create Custom Group</div>
                    <div style={{ fontSize:11.5,color:"#9ca3af",marginTop:1 }}>Mix 2 students + 1 trainer or any combo</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ═══ TEMPLATES ═══ */}
          {activeTab==="templates"&&(
            <>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:20 }}>
                <button onClick={()=>setShowNewTemplate(true)} style={{ display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",fontSize:13.5,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px rgba(99,102,241,.3)",whiteSpace:"nowrap" }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1={12} y1={5} x2={12} y2={19}/><line x1={5} y1={12} x2={19} y2={12}/></svg>New Template
                </button>
                <div style={{ flex:1,position:"relative" }}>
                  <svg style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9ca3af" }} width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx={11} cy={11} r={8}/><path d="m21 21-4.35-4.35"/></svg>
                  <input placeholder="Search templates..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{ ...inputStyle,paddingLeft:34,paddingRight:12,background:"#fff",border:"1px solid #e5e7eb",borderRadius:9 }} />
                </div>
                <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:"9px 12px",borderRadius:9,border:"1px solid #e5e7eb",fontSize:13,color:"#374151",outline:"none",background:"#fff",fontFamily:"inherit" }}>
                  {["Most Recent","Most Used","A → Z"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              {filtered.length===0?(
                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 0",gap:14 }}>
                  <div style={{ fontSize:48 }}>📭</div>
                  <div style={{ fontSize:17,fontWeight:700,color:"#111827" }}>No Templates Found</div>
                  <div style={{ fontSize:13,color:"#9ca3af" }}>Try a different search or category</div>
                </div>
              ):(
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
                  {filtered.map(tpl=>(
                    <div key={tpl.id} style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",overflow:"hidden",transition:"transform .2s, box-shadow .2s",cursor:"pointer" }} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.09)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none";}}>
                      <div style={{ height:4,background:tpl.color }} />
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10 }}>
                          <span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:5,background:`${tpl.color}18`,color:tpl.color }}>{tpl.category}</span>
                          <span style={{ fontSize:11,color:"#9ca3af" }}>Used {tpl.usedCount}×</span>
                        </div>
                        <div style={{ fontSize:15,fontWeight:700,color:"#111827",marginBottom:3 }}>{tpl.name}</div>
                        <div style={{ fontSize:12.5,color:tpl.color,fontWeight:600,marginBottom:6 }}>{tpl.subject}</div>
                        <div style={{ fontSize:12.5,color:"#9ca3af",lineHeight:1.45,marginBottom:14 }}>{tpl.preview}</div>
                        <div style={{ display:"flex",gap:8 }}>
                          <button onClick={()=>setActiveTab("compose")} style={{ flex:1,padding:"7px 0",borderRadius:8,border:`1.5px solid ${tpl.color}`,background:"transparent",color:tpl.color,fontSize:12.5,fontWeight:700,cursor:"pointer" }}>Use Template</button>
                          <button onClick={()=>setShowNewTemplate(true)} style={{ padding:"7px 14px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",fontSize:12.5,fontWeight:600,cursor:"pointer" }}>Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ HISTORY ═══ */}
          {activeTab==="history"&&(
            <div style={{ background:"#fff",borderRadius:12,border:"1px solid #eef0f2",overflow:"hidden" }}>
              <div style={{ padding:"16px 22px",borderBottom:"1px solid #f0f1f3",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:15,fontWeight:700,color:"#111827" }}>Sent Email History</div>
                  <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>Track all sent emails and their performance</div>
                </div>
                <button style={{ padding:"7px 16px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",fontSize:12.5,fontWeight:600,color:"#374151",cursor:"pointer" }}>Export</button>
              </div>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#fafafa" }}>
                      {["Subject","Sent To","Type","Sent At","Opens","Clicks","Status"].map(h=>(
                        <th key={h} style={{ padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:"1px solid #f0f1f3",whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sentHistory.map(email=>(
                      <tr key={email.id} style={{ borderBottom:"1px solid #f5f6f7" }} onMouseEnter={e=>e.currentTarget.style.background="#fafbfc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"12px 16px",fontSize:13.5,fontWeight:600,color:"#111827" }}>{email.subject}</td>
                        <td style={{ padding:"12px 16px",fontSize:13,color:"#6b7280" }}>{email.to}</td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontSize:11.5,fontWeight:600,padding:"3px 9px",borderRadius:5,background:email.type==="Campaign"?"rgba(236,72,153,.1)":"rgba(99,102,241,.1)",color:email.type==="Campaign"?"#ec4899":"#6366f1" }}>{email.type}</span>
                        </td>
                        <td style={{ padding:"12px 16px",fontSize:13,color:"#6b7280",whiteSpace:"nowrap" }}>{email.sentAt}</td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ display:"flex",alignItems:"center",gap:5,fontSize:13.5,fontWeight:600,color:"#111827" }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>{email.opens}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ display:"flex",alignItems:"center",gap:5,fontSize:13.5,fontWeight:600,color:"#111827" }}>
                            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>{email.clicks}
                          </span>
                        </td>
                        <td style={{ padding:"12px 16px" }}><StatusBadge status={email.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}