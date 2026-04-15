import React, { useState, useEffect, useRef } from "react";
import {
  Upload, X, Film, Image, CheckCircle, AlertCircle, Loader,
  Plus, Trash2, ChevronDown, ChevronUp, Sparkles, User,
  BookOpen, Tag, List, ArrowLeft, Activity, Star,
} from "lucide-react";
import videoService from "../services/videoService";
import { useNavigate } from "react-router-dom";

/* ─── theme token map — same as AdminDashboard ─── */
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
    sectionBg:"rgba(255,255,255,0.02)",sectionHeaderBg:"rgba(255,255,255,0.03)",
    inputBg:"rgba(255,255,255,0.06)",inputBorder:"rgba(255,255,255,0.12)",inputText:"#ffffff",
    toggleOff:"rgba(255,255,255,0.15)",skeletonBg:"rgba(255,255,255,0.07)",
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
    sectionBg:"#ffffff",sectionHeaderBg:"#f8fafc",
    inputBg:"#f8fafc",inputBorder:"#e2e8f0",inputText:"#0f172a",
    toggleOff:"#cbd5e1",skeletonBg:"#e2e8f0",
  },
};

/* ─── Panel / Section component ─── */
function Panel({ t, isDark, icon: Icon, number, title, children, defaultOpen = true, accent = "#f97316" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden",
      background: t.sectionBg, marginBottom: 10,
    }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 16px", background: t.sectionHeaderBg,
        borderBottom: open ? `1px solid ${t.border}` : "none",
        cursor: "pointer", border: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: `linear-gradient(135deg,${accent},${accent}cc)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Poppins',sans-serif",
          }}>{number}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icon size={13} color={accent} />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{title}</span>
          </div>
        </div>
        {open
          ? <ChevronUp size={15} color={t.textMuted} />
          : <ChevronDown size={15} color={t.textMuted} />}
      </button>
      {open && (
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Field ─── */
function Field({ t, label, required, hint, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: t.textMuted, fontFamily: "'Poppins',sans-serif", marginBottom: 5 }}>
        {label} {required && <span style={{ color: "#f97316" }}>*</span>}
        {hint && <span style={{ color: t.textLabel, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> ({hint})</span>}
      </label>
      {children}
    </div>
  );
}

/* ─── Input style ─── */
const iStyle = (t) => ({
  width: "100%", padding: "8px 12px", borderRadius: 9,
  border: `1px solid ${t.inputBorder}`, background: t.inputBg,
  color: t.inputText, fontSize: 12, fontFamily: "'Poppins',sans-serif",
  outline: "none", boxSizing: "border-box",
});

/* ─── Toggle ─── */
function Toggle({ t, value, onChange }) {
  return (
    <button type="button" onClick={onChange} style={{
      width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
      background: value ? "#f97316" : t.toggleOff, position: "relative", flexShrink: 0, transition: "background 0.2s",
    }}>
      <span style={{
        position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        left: value ? 21 : 3, transition: "left 0.2s",
      }} />
    </button>
  );
}

/* ─── Courses List ─── */
function CoursesList({ t, isDark, onBack }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try { setLoading(true); setError(""); const res = await videoService.getAllAdminCourses(); setCourses(res.data || []); }
    catch { setError("Failed to load courses. Please try again."); }
    finally { setLoading(false); }
  };

  const handleDelete = async (courseId) => {
    try {
      setDeletingId(courseId);
      await videoService.deleteAdminCourse(courseId);
      setCourses(prev => prev.filter(c => c.courseId !== courseId && c.id !== courseId));
      setConfirmId(null);
    } catch { setError("Failed to delete course."); }
    finally { setDeletingId(null); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif", margin: 0 }}>
          Uploaded Courses <span style={{ color: t.textMuted, fontWeight: 400 }}>({courses.length})</span>
        </p>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
          <ArrowLeft size={12} /> Upload New
        </button>
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#f43f5e", fontSize: 12, fontFamily: "'Poppins',sans-serif" }}>
          <AlertCircle size={14} />{error}
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Loader size={24} color="#f97316" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {!loading && courses.length === 0 && !error && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 10 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Film size={20} color={t.emptyIcon} />
          </div>
          <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No courses uploaded yet</p>
        </div>
      )}

      {!loading && courses.map(course => {
        const id = course.courseId ?? course.id;
        const isDeleting = deletingId === id;
        const isConfirming = confirmId === id;
        return (
          <div key={id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.recentItemBorder}`, background: t.recentItemBg, transition: "background 0.15s" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Film size={16} color="#f97316" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title || "Untitled Course"}</p>
              <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>{course.instructorName || "—"}{course.instructorRole ? ` • ${course.instructorRole}` : ""}</p>
              <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                {course.learnersCount != null && (
                  <span style={{ fontSize: 9, background: "rgba(249,115,22,0.1)", color: "#f97316", padding: "2px 8px", borderRadius: 999, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>{course.learnersCount}+ learners</span>
                )}
                {course.featuredTag && (
                  <span style={{ fontSize: 9, background: t.actBg, color: t.textSub, padding: "2px 8px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{course.featuredTag}</span>
                )}
              </div>
            </div>
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
              {!isConfirming ? (
                <button onClick={() => setConfirmId(id)} disabled={isDeleting} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(244,63,94,0.2)", background: "rgba(244,63,94,0.06)", color: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Trash2 size={13} />
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>Delete?</span>
                  <button onClick={() => handleDelete(id)} disabled={isDeleting} style={{ padding: "4px 10px", background: "#f43f5e", color: "#fff", borderRadius: 6, border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                    {isDeleting ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} /> : "Yes"}
                  </button>
                  <button onClick={() => setConfirmId(null)} style={{ padding: "4px 10px", background: t.actBg, color: t.textSub, borderRadius: 6, border: `1px solid ${t.border}`, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>No</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════ MAIN ══════════ */
export default function AdminCourseUploadForm({ onSubmit, onClose }) {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    )
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [view, setView] = useState("form");

  // form state
  const [platformName, setPlatformName] = useState("TexoraAI.skills");
  const [featuredTag, setFeaturedTag] = useState("Featured Course");
  const [hostedBy, setHostedBy] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [showInstructorLive, setShowInstructorLive] = useState(true);
  const [learnersCount, setLearnersCount] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [experience, setExperience] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [description, setDescription] = useState("");
  const [showMoreEnabled, setShowMoreEnabled] = useState(true);
  const [learnPoints, setLearnPoints] = useState([{ id: 1, title: "", desc: "" }]);
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  if (view === "list") return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20, boxShadow: t.shadow }}>
          <CoursesList t={t} isDark={isDark} onBack={() => setView("form")} />
        </div>
      </div>
    </div>
  );

  const handleVideoSelect = (file) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!allowed.includes(file.type)) { setErrorMsg("Only MP4, WebM, or MOV files are allowed"); return; }
    if (file.size > 500 * 1024 * 1024) { setErrorMsg("Max 500MB allowed!"); return; }
    setErrorMsg(""); setVideoFile(file); setVideoUrl("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const addLearnPoint = () => setLearnPoints([...learnPoints, { id: Date.now(), title: "", desc: "" }]);
  const removeLearnPoint = (id) => { if (learnPoints.length > 1) setLearnPoints(learnPoints.filter(p => p.id !== id)); };
  const updateLearnPoint = (id, field, value) => setLearnPoints(learnPoints.map(p => p.id === id ? { ...p, [field]: value } : p));
  const formatSize = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim()) { setErrorMsg("Please enter a video title"); return; }
    if (!videoFile && !videoUrl.trim()) { setErrorMsg("Please provide a video file or URL"); return; }
    if (!instructorName.trim()) { setErrorMsg("Please enter the instructor name"); return; }
    setStatus("uploading"); setErrorMsg(""); setUploadProgress(0);
    const formData = new FormData();
    formData.append("platformName", platformName);
    formData.append("featuredTag", featuredTag);
    formData.append("hostedBy", hostedBy);
    formData.append("title", videoTitle);
    if (videoFile) formData.append("video", videoFile);
    else formData.append("videoUrl", videoUrl);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("showInstructorLive", String(showInstructorLive));
    formData.append("learnersCount", learnersCount);
    formData.append("publishDate", publishDate);
    formData.append("instructorName", instructorName);
    formData.append("instructorRole", instructorRole);
    formData.append("experience", experience);
    formData.append("studentCount", studentCount);
    formData.append("description", description);
    formData.append("showMoreEnabled", String(showMoreEnabled));
    formData.append("learnPoints", JSON.stringify(learnPoints.filter(p => p.title.trim())));
    try {
      await videoService.uploadAdminCourse(formData, (pct) => setUploadProgress(pct));
      setUploadProgress(100); setStatus("success");
      if (onSubmit) onSubmit(formData);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || "Something went wrong.";
      setErrorMsg(typeof msg === "string" ? msg : "Upload failed.");
      setStatus("error");
    }
  };

  const reset = () => {
    setVideoTitle(""); setVideoUrl(""); setVideoFile(null); setThumbnail(null); setThumbnailPreview(null);
    setHostedBy(""); setInstructorName(""); setInstructorRole(""); setExperience(""); setStudentCount("");
    setDescription(""); setLearnPoints([{ id: 1, title: "", desc: "" }]);
    setUploadProgress(0); setStatus("idle"); setErrorMsg("");
  };

  const inp = iStyle(t);

  if (status === "success") return (
    <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');`}</style>
      <div style={{ background: t.cardBg, borderRadius: 24, padding: "48px 40px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: t.shadowHov, border: `1px solid ${t.border}` }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <CheckCircle size={30} color={isDark ? "#34d399" : "#16a34a"} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: "0 0 8px", fontFamily: "'Poppins',sans-serif" }}>Course is Live! 🎉</h3>
        <p style={{ fontSize: 12, color: t.textSub, marginBottom: 24, fontFamily: "'Poppins',sans-serif" }}>"{videoTitle}" has been successfully published.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} style={{ padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ea580c)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Create New</button>
          <button onClick={() => setView("list")} style={{ padding: "9px 20px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>View Courses</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .cfade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        .d1{animation:blink 1.6s ease infinite}.d2{animation:blink 1.6s 0.3s ease infinite}.d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}}
        .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{animation:spin 1s linear infinite}
        input:focus,textarea:focus,select:focus{border-color:#f97316 !important;box-shadow:0 0 0 3px rgba(249,115,22,0.1)}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
      <div style={{ width: "100%", padding: "24px 40px" }}>

          {/* ═══ HERO ═══ */}
          <div className="cfade" style={{ borderRadius: 24, padding: "26px 30px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 18, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(249,115,22,0.07),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.05),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1px solid ${t.borderHov}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                    <ArrowLeft size={12} /> Back
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={10} color={t.textSub} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Admin Portal</span>
                  </div>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Course Upload</h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 5, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Admin Panel • Course Management</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Upload Featured Course button */}
                <button
  type="button"
  onClick={() => navigate("/admin/featured-course-upload")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    borderRadius: 10,
    background: "linear-gradient(135deg,#f97316,#ea580c)",
    border: "none",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Poppins',sans-serif",
    boxShadow: "0 4px 14px rgba(249,115,22,0.4)",
    whiteSpace: "nowrap"
  }}
>
  <Star size={13} /> Upload Featured Course
</button>

                {/* My Courses */}
                <button type="button" onClick={() => setView("list")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.4)", background: "rgba(249,115,22,0.08)", color: "#f97316", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                  <List size={13} /> My Courses
                </button>

                {/* Live badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: t.actBg, border: `1px solid ${t.actBorder}`, borderRadius: 10, padding: "7px 12px" }}>
                  <Activity size={11} color={t.actIcon} />
                  <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 12 }}>
                    <span className="d1" style={{ width: 3, height: 8, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d2" style={{ width: 3, height: 12, borderRadius: 2, background: t.actBar, display: "block" }} />
                    <span className="d3" style={{ width: 3, height: 6, borderRadius: 2, background: t.actBar, display: "block" }} />
                  </div>
                </div>

                <div className="livebadge" style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "rgba(52,211,153,0.08)" : "rgba(22,163,74,0.08)", border: isDark ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(22,163,74,0.3)", borderRadius: 999, padding: "7px 14px", color: t.liveText, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins',sans-serif" }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.liveColor, display: "inline-block" }} /> LIVE
                </div>
              </div>
            </div>
          </div>

          {/* ═══ FORM CARD ═══ */}
          <div className="cfade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20, boxShadow: t.shadow }}>

            {/* Error banner */}
            {errorMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#f43f5e", fontSize: 12, fontFamily: "'Poppins',sans-serif", marginBottom: 14 }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />{errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

              {/* ── Panel 1: Top Section ── */}
              <Panel t={t} isDark={isDark} icon={Tag} number="1" title="Top Section">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field t={t} label="Platform Name" hint="optional">
                    <input value={platformName} onChange={e => setPlatformName(e.target.value)} placeholder="TexoraAI.skills" style={inp} />
                  </Field>
                  <Field t={t} label="Featured Tag" hint="optional">
                    <input value={featuredTag} onChange={e => setFeaturedTag(e.target.value)} placeholder="Featured Course" style={inp} />
                  </Field>
                </div>
                <Field t={t} label="Hosted By">
                  <input value={hostedBy} onChange={e => setHostedBy(e.target.value)} placeholder="e.g. Arjay McCandless" style={inp} />
                </Field>
              </Panel>

              {/* ── Panel 2: Video Card ── */}
              <Panel t={t} isDark={isDark} icon={Film} number="2" title="Main Video Card">
                <Field t={t} label="Video Title" required>
                  <input value={videoTitle} onChange={e => setVideoTitle(e.target.value)} placeholder="e.g. System Design for Velocity Coders" style={inp} />
                </Field>

                <Field t={t} label="Video File" required hint="Upload file or paste URL">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {!videoFile ? (
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); handleVideoSelect(e.dataTransfer.files[0]); }}
                        onClick={() => videoInputRef.current?.click()}
                        style={{
                          border: `1.5px dashed ${dragOver ? "#f97316" : t.inputBorder}`,
                          borderRadius: 10, padding: "20px 16px", textAlign: "center", cursor: "pointer",
                          background: dragOver ? "rgba(249,115,22,0.06)" : t.inputBg, transition: "all 0.2s",
                        }}
                      >
                        <Upload size={20} color={dragOver ? "#f97316" : t.textMuted} style={{ margin: "0 auto 6px" }} />
                        <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Drag & drop or click to upload</p>
                        <p style={{ fontSize: 10, color: t.textMuted, margin: "3px 0 0", fontFamily: "'Poppins',sans-serif" }}>MP4, WebM, MOV • Max 500MB</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)", borderRadius: 10 }}>
                        <div style={{ width: 32, height: 32, background: "#f97316", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Film size={15} color="#fff" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{videoFile.name}</p>
                          <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{formatSize(videoFile.size)}</p>
                        </div>
                        <button type="button" onClick={() => setVideoFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2 }}><X size={14} /></button>
                      </div>
                    )}
                    <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => handleVideoSelect(e.target.files[0])} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 1, background: t.border }} />
                      <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>OR</span>
                      <div style={{ flex: 1, height: 1, background: t.border }} />
                    </div>
                    <input value={videoUrl} onChange={e => { setVideoUrl(e.target.value); if (e.target.value) setVideoFile(null); }} placeholder="Paste video URL (https://...)" style={{ ...inp, opacity: videoFile ? 0.4 : 1 }} disabled={!!videoFile} />
                  </div>
                </Field>

                {/* Thumbnail */}
                <Field t={t} label="Thumbnail" hint="optional">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {thumbnailPreview ? (
                      <div style={{ position: "relative", width: 100, height: 60, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(249,115,22,0.3)", flexShrink: 0 }}>
                        <img src={thumbnailPreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }} style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, background: "rgba(0,0,0,0.6)", borderRadius: "50%", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div onClick={() => thumbInputRef.current?.click()} style={{ width: 100, height: 60, border: `1.5px dashed ${t.inputBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: t.inputBg, flexShrink: 0, transition: "all 0.2s" }}>
                        <Image size={16} color={t.textMuted} />
                        <span style={{ fontSize: 9, color: t.textMuted, marginTop: 3, fontFamily: "'Poppins',sans-serif" }}>Add Image</span>
                      </div>
                    )}
                    <p style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1.6 }}>JPG, PNG or WebP<br />Recommended: 16:9</p>
                  </div>
                  <input ref={thumbInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnailChange} />
                </Field>

                {/* Instructor Live Badge toggle */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>Instructor Live Badge</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>Show badge at top-right of video player</p>
                  </div>
                  <Toggle t={t} value={showInstructorLive} onChange={() => setShowInstructorLive(!showInstructorLive)} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field t={t} label="Learners Count" hint="e.g. 200">
                    <input type="number" value={learnersCount} onChange={e => setLearnersCount(e.target.value)} placeholder="200" style={inp} />
                  </Field>
                  <Field t={t} label="Publish Date">
                    <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} style={inp} />
                  </Field>
                </div>
              </Panel>

              {/* ── Panel 3: Instructor + Description + Learn Points combined ── */}
              <Panel t={t} isDark={isDark} icon={User} number="3" title="Instructor Card">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Field t={t} label="Instructor Name" required>
                    <input value={instructorName} onChange={e => setInstructorName(e.target.value)} placeholder="e.g. Arjay McCandless" style={inp} />
                  </Field>
                  <Field t={t} label="Instructor Role">
                    <input value={instructorRole} onChange={e => setInstructorRole(e.target.value)} placeholder="e.g. Software Engineer" style={inp} />
                  </Field>
                  <Field t={t} label="Experience" hint="e.g. 10+ years">
                    <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="10+ years" style={inp} />
                  </Field>
                  <Field t={t} label="Student Count" hint="e.g. 200+">
                    <input value={studentCount} onChange={e => setStudentCount(e.target.value)} placeholder="200+ students" style={inp} />
                  </Field>
                </div>
              </Panel>

              <Panel t={t} isDark={isDark} icon={BookOpen} number="4" title="Description Section" defaultOpen={false}>
                <Field t={t} label="Full Description">
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Write about the course..." rows={4} style={{ ...inp, resize: "none" }} />
                </Field>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>"Show More" Toggle</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>Show a "Show more" button below description</p>
                  </div>
                  <Toggle t={t} value={showMoreEnabled} onChange={() => setShowMoreEnabled(!showMoreEnabled)} />
                </div>
              </Panel>

              <Panel t={t} isDark={isDark} icon={BookOpen} number="5" title="What You'll Learn" defaultOpen={false}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {learnPoints.map((point, idx) => (
                    <div key={point.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800, fontFamily: "'Poppins',sans-serif", flexShrink: 0, marginTop: 1 }}>{idx + 1}</div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                        <input value={point.title} onChange={e => updateLearnPoint(point.id, "title", e.target.value)} placeholder={`Point ${idx + 1} Title...`} style={{ ...inp, fontWeight: 600 }} />
                        <input value={point.desc} onChange={e => updateLearnPoint(point.id, "desc", e.target.value)} placeholder="Short description (optional)..." style={inp} />
                      </div>
                      {learnPoints.length > 1 && (
                        <button type="button" onClick={() => removeLearnPoint(point.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2, marginTop: 2 }}><Trash2 size={13} /></button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addLearnPoint} style={{ width: "100%", padding: "9px", border: `1.5px dashed ${t.inputBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}>
                  <Plus size={13} /> Add Another Point
                </button>
              </Panel>

              {/* Progress bar */}
              {status === "uploading" && (
                <div style={{ background: t.sectionHeaderBg, borderRadius: 12, padding: "14px 16px", border: `1px solid rgba(249,115,22,0.2)`, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif", marginBottom: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Loader size={13} color="#f97316" className="spin" /> Uploading...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: t.border, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,#f97316,#fb923c)", borderRadius: 99, width: `${uploadProgress}%`, transition: "width 0.3s" }} />
                  </div>
                </div>
              )}

              {/* Submit */}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="submit" disabled={status === "uploading"} style={{
                  flex: 1, padding: "12px 20px", borderRadius: 12,
                  background: status === "uploading" ? t.actBg : "linear-gradient(135deg,#f97316,#ea580c)",
                  border: status === "uploading" ? `1px solid ${t.border}` : "none",
                  color: status === "uploading" ? t.textMuted : "#fff",
                  fontSize: 13, fontWeight: 700, cursor: status === "uploading" ? "not-allowed" : "pointer",
                  fontFamily: "'Poppins',sans-serif",
                  boxShadow: status !== "uploading" ? "0 4px 14px rgba(249,115,22,0.4)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
                }}>
                  {status === "uploading"
                    ? <><Loader size={15} className="spin" /> Uploading...</>
                    : <><Upload size={15} /> Publish Course</>}
                </button>
                {onClose && status !== "uploading" && (
                  <button type="button" onClick={onClose} style={{ padding: "12px 20px", borderRadius: 12, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}