import axios from "axios";
import {
  BookOpen, CheckCircle, Clock, Download,
  Edit2, Eye, GraduationCap, Plus, Search, Star,
  Trash2, Users, X, ChevronLeft, ChevronRight, Layers,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "@/services/batchService";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
:root{--bg:#f1f5f9;--card:#ffffff;--tx:#0f172a;--mu:#64748b;--bd:#e2e8f0;
  --c1:#22d3ee;--c2:#fb923c;--c3:#34d399;--c4:#a78bfa;--cr:#f87171;
  --sh:0 4px 24px rgba(0,0,0,0.06);--shl:0 8px 40px rgba(0,0,0,0.10);--r:20px;}
.tc-dk{--bg:#0a0a0a;--card:#111111;--tx:#ffffff;--mu:#94a3b8;--bd:rgba(255,255,255,0.06);
  --sh:0 4px 24px rgba(0,0,0,0.40);--shl:0 8px 40px rgba(0,0,0,0.60);}
.tc{font-family:'Poppins',sans-serif;min-height:100vh;background:var(--bg);color:var(--tx);display:flex;flex-direction:column;}
.tc-top{padding:20px 24px;}
.tc-toprow{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.tc-tl{display:flex;align-items:center;gap:12px;}
.tc-tl-ico{width:44px;height:44px;border-radius:13px;background:rgba(34,211,238,.10);border:1px solid rgba(34,211,238,.18);display:flex;align-items:center;justify-content:center;color:var(--c1);flex-shrink:0;}
.tc-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:3px;}
.tc-h1{font-size:20px;font-weight:800;color:var(--tx);margin:0;}
.tc-tr{display:flex;align-items:center;gap:8px;}
.tc-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:12px;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .2s,transform .15s;border:none;white-space:nowrap;}
.tc-btn:hover{opacity:.87;transform:translateY(-1px);}
.tc-btn-out{background:var(--card);border:1px solid var(--bd)!important;color:var(--mu);}
.tc-btn-out:hover{border-color:rgba(34,211,238,.30)!important;color:var(--c1);}
.tc-btn-green{background:var(--c3);color:#0a0a0a;}
.tc-toast{padding:11px 16px;border-radius:13px;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.20);display:flex;align-items:center;gap:8px;color:var(--c3);font-size:13px;font-weight:600;}
.tc-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 16px;}
.tc-stat{border-radius:var(--r);padding:18px 20px;color:#fff;position:relative;overflow:hidden;box-shadow:var(--sh);}
.tc-stat::before{content:"";position:absolute;right:-12px;top:-12px;width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.10);}
.tc-sico{width:30px;height:30px;border-radius:9px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;}
.tc-sv{font-size:26px;font-weight:800;margin-bottom:3px;}
.tc-sl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;opacity:.65;}
.tc-panels{display:flex;flex:1;margin:0 24px 24px;border-radius:var(--r);border:1px solid var(--bd);background:var(--card);box-shadow:var(--shl);overflow:hidden;}
.tc-p1{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--bd);transition:width .3s;}
.tc-p1-head{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-p1-title{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--mu);}
.tc-p1-list{flex:1;overflow-y:auto;padding:8px;}
.tc-cat-btn{width:100%;text-align:left;padding:9px 12px;border-radius:11px;border:none;background:transparent;font-family:'Poppins',sans-serif;font-size:12px;font-weight:700;color:var(--mu);cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s;}
.tc-cat-btn:hover{background:rgba(34,211,238,.06);color:var(--c1);}
.tc-cat-btn.on{color:white;}
.tc-resize{width:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:col-resize;background:var(--bg);border-left:1px solid var(--bd);border-right:1px solid var(--bd);transition:background .2s;}
.tc-resize:hover{background:rgba(34,211,238,.08);}
.tc-resize-pill{width:3px;height:40px;border-radius:4px;background:var(--bd);transition:background .2s;}
.tc-resize:hover .tc-resize-pill{background:var(--c1);}
.tc-p2{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.tc-p2-search{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-sinput{position:relative;flex:1;}
.tc-sinput svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--mu);pointer-events:none;}
.tc-sinput input{width:100%;padding:9px 12px 9px 34px;border-radius:11px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-family:'Poppins',sans-serif;font-size:12px;outline:none;box-sizing:border-box;transition:border-color .2s;}
.tc-sinput input:focus{border-color:var(--c1);}
.tc-sinput input::placeholder{color:var(--mu);}
.tc-found{font-size:11px;font-weight:700;color:var(--mu);white-space:nowrap;}
.tc-p2-grid{flex:1;overflow-y:auto;padding:16px;}
.tc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
.tc-cc{border-radius:16px;border:1px solid var(--bd);background:var(--bg);padding:18px;display:flex;flex-direction:column;gap:0;transition:all .2s;}
.tc-cc:hover{border-color:rgba(34,211,238,.25);box-shadow:var(--sh);}
.tc-cc.on{border-color:rgba(34,211,238,.40);background:rgba(34,211,238,.03);box-shadow:var(--sh);}
.tc-cc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.tc-pub-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;background:rgba(52,211,153,.10);color:var(--c3);border:1px solid rgba(52,211,153,.15);}
.tc-cat-tag{display:inline-flex;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;}
.tc-ct{font-size:13px;font-weight:800;color:var(--tx);line-height:1.35;margin:0 0 4px;}
.tc-cc:hover .tc-ct{color:var(--c1);}
.tc-ce{font-size:11px;color:var(--mu);display:flex;align-items:center;gap:4px;margin:0 0 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.tc-meta{display:flex;align-items:center;gap:10px;font-size:11px;color:var(--mu);padding:10px 0;border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);margin-bottom:10px;}
.tc-mi{display:flex;align-items:center;gap:4px;}
.tc-desc{font-size:11px;color:var(--mu);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px;}
.tc-3btn{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:6px;}
.tc-ab{display:flex;align-items:center;justify-content:center;gap:4px;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
.tc-ab:hover{border-color:rgba(34,211,238,.30);color:var(--c1);background:rgba(34,211,238,.04);}
.tc-del{display:flex;align-items:center;justify-content:center;gap:4px;width:100%;padding:7px;border-radius:9px;border:1px solid var(--bd);background:var(--card);color:var(--mu);font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;cursor:pointer;transition:all .15s;}
.tc-del:hover{border-color:rgba(248,113,113,.30);color:var(--cr);background:rgba(248,113,113,.04);}
.tc-p3{flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;border-left:1px solid var(--bd);}
.tc-p3-head{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;border-bottom:1px solid var(--bd);background:var(--bg);}
.tc-p3-title-row{display:flex;align-items:center;gap:8px;}
.tc-p3-ico{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.tc-p3-title{font-size:13px;font-weight:800;color:var(--tx);}
.tc-xbtn{width:28px;height:28px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.tc-xbtn:hover{background:rgba(248,113,113,.10);color:var(--cr);}
.tc-p3-body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:14px;}
.tc-field label{display:block;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:var(--mu);margin-bottom:6px;}
.tc-field label span{color:var(--cr);}
.tc-inp{width:100%;padding:10px 13px;border-radius:11px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font-family:'Poppins',sans-serif;font-size:13px;outline:none;box-sizing:border-box;transition:border-color .2s,box-shadow .2s;}
.tc-inp:focus{border-color:var(--c1);box-shadow:0 0 0 3px rgba(34,211,238,.12);}
.tc-inp::placeholder{color:var(--mu);}
.tc-submit-row{display:flex;gap:8px;}
.tc-sub{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;border-radius:12px;border:none;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:800;cursor:pointer;transition:opacity .2s,transform .15s;}
.tc-sub:hover{opacity:.87;transform:translateY(-1px);}
.tc-can{padding:11px 16px;border-radius:12px;border:1px solid var(--bd);background:var(--bg);color:var(--mu);font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .15s;}
.tc-can:hover{border-color:rgba(34,211,238,.30);color:var(--c1);}
.tc-prev-hero{border-radius:16px;padding:20px;color:white;margin-bottom:14px;}
.tc-prev-type{display:inline-flex;padding:3px 9px;border-radius:6px;font-size:10px;font-weight:800;text-transform:uppercase;margin-bottom:8px;}
.tc-prev-h2{font-size:17px;font-weight:800;margin:0 0 6px;line-height:1.3;}
.tc-prev-sub{font-size:11px;opacity:.65;display:flex;align-items:center;gap:4px;margin:0;}
.tc-prev-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}
.tc-prev-mc{border-radius:12px;padding:12px;text-align:center;background:var(--bg);border:1px solid var(--bd);}
.tc-prev-mv{font-size:14px;font-weight:800;color:var(--tx);margin-bottom:3px;}
.tc-prev-ml{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--mu);}
.tc-prev-about{border-radius:12px;padding:14px;background:var(--bg);border:1px solid var(--bd);margin-bottom:14px;}
.tc-prev-at{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--mu);margin:0 0 6px;}
.tc-prev-ad{font-size:13px;color:var(--mu);line-height:1.6;margin:0;}
.tc-spin{width:20px;height:20px;border:2px solid rgba(0,0,0,.2);border-top-color:rgba(0,0,0,.7);border-radius:50%;animation:tc-spin .8s linear infinite;}
@keyframes tc-spin{to{transform:rotate(360deg)}}
.tc-loader{display:flex;align-items:center;justify-content:center;padding:60px;}
.tc-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:10px;text-align:center;color:var(--mu);font-size:13px;}
.tc-empty-ico{width:52px;height:52px;border-radius:15px;background:var(--bg);border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;color:var(--mu);}
`;
if(!document.getElementById("tc-st")){const t=document.createElement("style");t.id="tc-st";t.textContent=STYLES;document.head.appendChild(t);}
const isDark=()=>document.documentElement.classList.contains("dark")||document.body.classList.contains("dark")||window.matchMedia("(prefers-color-scheme: dark)").matches;

const CAT_COLORS={
  Product:{bg:"rgba(167,139,250,.10)",color:"var(--c4)"},
  Design:{bg:"rgba(251,146,60,.10)",color:"var(--c2)"},
  "Growth & Marketing":{bg:"rgba(34,211,238,.10)",color:"var(--c1)"},
  Development:{bg:"rgba(52,211,153,.10)",color:"var(--c3)"},
  Business:{bg:"rgba(248,113,113,.10)",color:"var(--cr)"},
  _d:{bg:"rgba(100,116,139,.10)",color:"var(--mu)"},
};
const catStyle=c=>CAT_COLORS[c]||CAT_COLORS._d;

const STAT_GRADS=["linear-gradient(135deg,#064e3b,#059669)","linear-gradient(135deg,#1e3a8a,#2563eb)","linear-gradient(135deg,#78350f,#d97706)"];

const TrainerCourseManagement = () => {
  const navigate = useNavigate();
  const [searchQuery,setSearchQuery]=useState("");
  const [selectedCategory,setSelectedCategory]=useState("All");
  const [courses,setCourses]=useState([]);
  const [loading,setLoading]=useState(true);
  const [batches,setBatches]=useState([]);
  const [editingCourse,setEditingCourse]=useState(null);
  const [editForm,setEditForm]=useState({title:"",category:"",description:""});
  const [createForm,setCreateForm]=useState({title:"",category:"",description:"",batchId:""});
  const [showSuccess,setShowSuccess]=useState(false);
  const [successMessage,setSuccessMessage]=useState("");
  const [previewCourseId,setPreviewCourseId]=useState(null);
  const [leftCollapsed,setLeftCollapsed]=useState(false);
  const [rightOpen,setRightOpen]=useState(false);
  const [rightMode,setRightMode]=useState("create");
  const [rightWidth,setRightWidth]=useState(320);
  const [dark,setDark]=useState(isDark);
  const isDragging=useRef(false);
  const containerRef=useRef(null);

  useEffect(()=>{
    const o=new MutationObserver(()=>setDark(isDark()));
    o.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    o.observe(document.body,{attributes:true,attributeFilter:["class"]});
    return()=>o.disconnect();
  },[]);

  const onMouseDown=useCallback(()=>{isDragging.current=true;document.body.style.cursor="col-resize";document.body.style.userSelect="none";},[]);
  const onMouseMove=useCallback(e=>{
    if(!isDragging.current||!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const fr=rect.right-e.clientX;
    if(fr>240&&fr<560)setRightWidth(fr);
  },[]);
  const onMouseUp=useCallback(()=>{isDragging.current=false;document.body.style.cursor="";document.body.style.userSelect="";},[]);
  useEffect(()=>{
    window.addEventListener("mousemove",onMouseMove);window.addEventListener("mouseup",onMouseUp);
    return()=>{window.removeEventListener("mousemove",onMouseMove);window.removeEventListener("mouseup",onMouseUp);};
  },[onMouseMove,onMouseUp]);

  const authHeader=()=>({Authorization:`Bearer ${localStorage.getItem("lms_token")}`});

  useEffect(()=>{
    fetchCourses();
    (async()=>{try{const r=await getTrainerBatches();setBatches(r||[]);}catch(e){console.error(e);}})();
  },[]);

  const fetchCourses=async()=>{
    try{const r=await axios.get(`${API}/courses/my`,{headers:authHeader()});setCourses(r.data);}
    catch(e){console.error(e);}finally{setLoading(false);}
  };

  const showNotif=msg=>{setSuccessMessage(msg);setShowSuccess(true);setTimeout(()=>setShowSuccess(false),3000);};

  const createCourse=async e=>{
    e.preventDefault();
    if(!createForm.title||!createForm.category||!createForm.batchId){alert("Please fill in all required fields");return;}
    try{await axios.post(`${API}/courses`,createForm,{headers:authHeader()});setCreateForm({title:"",category:"",description:"",batchId:""});setRightOpen(false);fetchCourses();showNotif("Course created successfully!");}
    catch{alert("Failed to create course");}
  };

  const handleDelete=async id=>{
    if(!window.confirm("Delete this course?"))return;
    try{await axios.delete(`${API}/courses/${id}`,{headers:authHeader()});setCourses(p=>p.filter(c=>c.id!==id));if(editingCourse?.id===id){setEditingCourse(null);setRightOpen(false);}if(previewCourseId===id)setPreviewCourseId(null);showNotif("Course deleted.");}
    catch{alert("Delete failed");}
  };

  const openEdit=course=>{setEditingCourse(course);setEditForm({title:course.title,category:course.category,description:course.description||""});setRightMode("edit");setRightOpen(true);setPreviewCourseId(null);};

  const saveEdit=async()=>{
    try{await axios.put(`${API}/courses/${editingCourse.id}`,editForm,{headers:authHeader()});setEditingCourse(null);setRightOpen(false);fetchCourses();showNotif("Course updated!");}
    catch{alert("Update failed");}
  };

  const categories=["All","Product","Design","Growth & Marketing","Development","Business"];
  const filteredCourses=courses.filter(c=>{
    const ms=c.title.toLowerCase().includes(searchQuery.toLowerCase())||c.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const mc=selectedCategory==="All"||c.category===selectedCategory;
    return ms&&mc;
  });

  const totalCourses=courses.length;
  const totalStudents=courses.reduce((a,c)=>a+(c.enrolledCount||0),0);
  const avgRating=courses.length?(courses.reduce((a,c)=>a+(c.rating||4.8),0)/courses.length).toFixed(1):"—";

  const statCards=[
    {icon:<BookOpen size={16}/>,value:totalCourses,label:"Total Courses",grad:STAT_GRADS[0]},
    {icon:<Users size={16}/>,value:totalStudents,label:"Enrollments",grad:STAT_GRADS[1]},
    {icon:<Star size={16}/>,value:avgRating,label:"Avg Rating",grad:STAT_GRADS[2]},
  ];

  const rightModeColor=rightMode==="create"?"var(--c3)":rightMode==="edit"?"var(--c1)":"var(--c4)";

  return(
    <div className={`tc${dark?" tc-dk":""}`}>
      <div className="tc-top">
        <div className="tc-toprow">
          <div className="tc-tl">
            <div className="tc-tl-ico"><GraduationCap size={22}/></div>
            <div>
              <div className="tc-label">Learning Management</div>
              <h1 className="tc-h1">Course Management</h1>
            </div>
          </div>
          <div className="tc-tr">
            <button className="tc-btn tc-btn-out"><Download size={13}/> Export</button>
            <button className="tc-btn tc-btn-green" onClick={()=>{setRightMode("create");setRightOpen(true);setEditingCourse(null);setPreviewCourseId(null);}}>
              <Plus size={13}/> New Course
            </button>
          </div>
        </div>
        {showSuccess&&<div className="tc-toast"><CheckCircle size={15}/>{successMessage}</div>}
      </div>

      <div className="tc-stats">
        {statCards.map((s,i)=>(
          <div key={i} className="tc-stat" style={{background:s.grad}}>
            <div className="tc-sico">{s.icon}</div>
            <div className="tc-sv">{s.value}</div>
            <div className="tc-sl">{s.label}</div>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="tc-panels" style={{height:"calc(100vh - 280px)",minHeight:380}}>

        {/* Panel 1 - filters */}
        <div className="tc-p1" style={{width:leftCollapsed?0:196}}>
          <div className="tc-p1-head">
            <Layers size={13} style={{color:"var(--c1)",flexShrink:0}}/>
            <span className="tc-p1-title">Categories</span>
          </div>
          <div className="tc-p1-list">
            {categories.map(cat=>(
              <button key={cat} className={`tc-cat-btn${selectedCategory===cat?" on":""}`}
                style={selectedCategory===cat?{background:"linear-gradient(135deg,#1e3a8a,#2563eb)"}:{}}
                onClick={()=>setSelectedCategory(cat)}>
                <span>{cat}</span>
                {selectedCategory===cat&&<span style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.7)"}}/>}
              </button>
            ))}
          </div>
        </div>

        {/* Resize 1 */}
        <div className="tc-resize" style={{cursor:"pointer"}} onClick={()=>setLeftCollapsed(p=>!p)}>
          <div className="tc-resize-pill"/>
        </div>

        {/* Panel 2 - course list */}
        <div className="tc-p2">
          <div className="tc-p2-search">
            <div className="tc-sinput">
              <Search size={13}/>
              <input placeholder="Search courses..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
            </div>
            <span className="tc-found">{filteredCourses.length} found</span>
          </div>
          <div className="tc-p2-grid">
            {loading?(
              <div className="tc-loader"><div className="tc-spin"/></div>
            ):filteredCourses.length===0?(
              <div className="tc-empty-state">
                <div className="tc-empty-ico"><BookOpen size={24}/></div>
                <span>{searchQuery||selectedCategory!=="All"?"No courses match your filters":"No courses yet — create your first!"}</span>
              </div>
            ):(
              <div className="tc-grid">
                {filteredCourses.map(course=>{
                  const cs=catStyle(course.category);
                  const isActive=editingCourse?.id===course.id||previewCourseId===course.id;
                  return(
                    <div key={course.id} className={`tc-cc${isActive?" on":""}`}>
                      <div className="tc-cc-head">
                        <span className="tc-pub-tag"><CheckCircle size={10}/> Published</span>
                        <span className="tc-cat-tag" style={{background:cs.bg,color:cs.color}}>{course.category}</span>
                      </div>
                      <p className="tc-ct">{course.title}</p>
                      <p className="tc-ce"><GraduationCap size={11}/>{course.ownerEmail}</p>
                      <div className="tc-meta">
                        <span className="tc-mi"><Clock size={11}/>8w</span>
                        <span className="tc-mi"><Users size={11}/>{course.enrolledCount||0}</span>
                        <span className="tc-mi"><Star size={11} style={{color:"var(--c2)",fill:"var(--c2)"}}/>{course.rating||4.8}</span>
                      </div>
                      {course.description&&<p className="tc-desc">{course.description}</p>}
                      <div className="tc-3btn">
                        <button className="tc-ab" onClick={()=>openEdit(course)}><Edit2 size={11}/> Edit</button>
                        <button className="tc-ab" onClick={()=>navigate(`/trainer/course/${course.id}/modules`)}><BookOpen size={11}/> Modules</button>
                        <button className="tc-ab" onClick={()=>{setPreviewCourseId(course.id);setRightMode("preview");setRightOpen(true);setEditingCourse(null);}}><Eye size={11}/> Preview</button>
                      </div>
                      <button className="tc-del" onClick={()=>handleDelete(course.id)}><Trash2 size={11}/> Delete Course</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Resize 2 */}
        {rightOpen?(
          <div className="tc-resize" onMouseDown={onMouseDown}><div className="tc-resize-pill"/></div>
        ):(
          <div className="tc-resize" style={{cursor:"pointer"}} onClick={()=>{setRightMode("create");setRightOpen(true);setEditingCourse(null);setPreviewCourseId(null);}}>
            <div className="tc-resize-pill"/>
          </div>
        )}

        {/* Panel 3 */}
        {rightOpen&&(
          <div className="tc-p3" style={{width:rightWidth}}>
            <div className="tc-p3-head">
              <div className="tc-p3-title-row">
                <div className="tc-p3-ico" style={{background:`rgba(${rightMode==="create"?"52,211,153":rightMode==="edit"?"34,211,238":"167,139,250"},.15)`,color:rightModeColor}}>
                  {rightMode==="create"?<Plus size={14}/>:rightMode==="edit"?<Edit2 size={14}/>:<Eye size={14}/>}
                </div>
                <span className="tc-p3-title">{rightMode==="create"?"New Course":rightMode==="edit"?"Edit Course":"Course Preview"}</span>
              </div>
              <button className="tc-xbtn" onClick={()=>{setRightOpen(false);setEditingCourse(null);setPreviewCourseId(null);}}><X size={13}/></button>
            </div>

            <div className="tc-p3-body">
              {rightMode==="preview"&&previewCourseId&&(()=>{
                const c=courses.find(x=>x.id===previewCourseId);
                if(!c)return null;
                const cs=catStyle(c.category);
                return(
                  <>
                    <div className="tc-prev-hero" style={{background:"linear-gradient(135deg,#312e81,#6366f1)"}}>
                      <span className="tc-prev-type" style={{background:"rgba(255,255,255,.15)",color:"white"}}>{c.category}</span>
                      <h2 className="tc-prev-h2">{c.title}</h2>
                      <p className="tc-prev-sub"><GraduationCap size={12}/> {c.ownerEmail}</p>
                    </div>
                    <div className="tc-prev-meta">
                      {[{icon:<Clock size={13}/>,val:"8 weeks",lbl:"Duration"},{icon:<Users size={13}/>,val:c.enrolledCount||0,lbl:"Enrolled"},{icon:<Star size={13} style={{color:"var(--c2)",fill:"var(--c2)"}}/>,val:c.rating||4.8,lbl:"Rating"}].map((m,i)=>(
                        <div key={i} className="tc-prev-mc">
                          <div style={{display:"flex",justifyContent:"center",color:"var(--mu)",marginBottom:6}}>{m.icon}</div>
                          <div className="tc-prev-mv">{m.val}</div>
                          <div className="tc-prev-ml">{m.lbl}</div>
                        </div>
                      ))}
                    </div>
                    {c.description&&<div className="tc-prev-about"><p className="tc-prev-at">About</p><p className="tc-prev-ad">{c.description}</p></div>}
                    <button className="tc-btn" style={{width:"100%",justifyContent:"center",marginBottom:8,background:"var(--c1)",color:"#0a0a0a"}} onClick={()=>openEdit(c)}><Edit2 size={14}/> Edit This Course</button>
                    <button className="tc-btn" style={{width:"100%",justifyContent:"center",background:"var(--c4)",color:"#0a0a0a"}} onClick={()=>navigate(`/trainer/course/${c.id}/modules`)}><BookOpen size={14}/> Manage Modules</button>
                  </>
                );
              })()}

              {(rightMode==="create"||rightMode==="edit")&&(
                <>
                  {rightMode==="create"&&(
                    <div className="tc-field">
                      <label>Batch <span>*</span></label>
                      <select className="tc-inp" value={createForm.batchId} onChange={e=>setCreateForm({...createForm,batchId:e.target.value})}>
                        <option value="">Select Batch…</option>
                        {batches.map(b=><option key={b.id} value={b.id}>Batch {b.id}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="tc-field">
                    <label>Course Title <span>*</span></label>
                    <input className="tc-inp" placeholder="e.g., Advanced React Development"
                      value={rightMode==="create"?createForm.title:editForm.title}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,title:e.target.value}):setEditForm({...editForm,title:e.target.value})}/>
                  </div>
                  <div className="tc-field">
                    <label>Category <span>*</span></label>
                    <input className="tc-inp" placeholder="e.g., Development"
                      value={rightMode==="create"?createForm.category:editForm.category}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,category:e.target.value}):setEditForm({...editForm,category:e.target.value})}/>
                  </div>
                  <div className="tc-field">
                    <label>Description</label>
                    <textarea className="tc-inp" rows={5} style={{resize:"none"}} placeholder="Describe what students will learn…"
                      value={rightMode==="create"?createForm.description:editForm.description}
                      onChange={e=>rightMode==="create"?setCreateForm({...createForm,description:e.target.value}):setEditForm({...editForm,description:e.target.value})}/>
                  </div>
                  <div className="tc-submit-row">
                    <button className="tc-sub" style={{background:rightMode==="create"?"var(--c3)":"var(--c1)",color:"#0a0a0a"}}
                      onClick={rightMode==="create"?createCourse:saveEdit}>
                      <CheckCircle size={15}/>{rightMode==="create"?"Create Course":"Save Changes"}
                    </button>
                    <button className="tc-can" onClick={()=>{setRightOpen(false);setEditingCourse(null);}}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TrainerCourseManagement;