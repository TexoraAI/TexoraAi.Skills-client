import React, { useState, useRef, useEffect } from "react";
import { courseService } from "@/services/courseService";
import {
  Upload, X, Image, CheckCircle, AlertCircle, Loader,
  Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Star,
  Users, Clock, Award, Tag, BookOpen, Eye, List,
  PlusCircle, RefreshCw, Pencil, Save, XCircle, Activity, ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    sectionBg:"rgba(255,255,255,0.02)",sectionHeaderBg:"rgba(255,255,255,0.03)",
    inputBg:"rgba(255,255,255,0.06)",inputBorder:"rgba(255,255,255,0.12)",inputText:"#ffffff",
    toggleOff:"rgba(255,255,255,0.15)",skeletonBg:"rgba(255,255,255,0.07)",
    previewBg:"rgba(255,255,255,0.04)",
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
    previewBg:"#f8fafc",
  },
};

/* ─── Panel ─── */
function Panel({ t, icon: Icon, number, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", background: t.sectionBg, marginBottom: 10 }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: t.sectionHeaderBg, borderBottom: open ? `1px solid ${t.border}` : "none", cursor: "pointer", border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>{number}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icon size={13} color="#f97316" />
            <span style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>{title}</span>
          </div>
        </div>
        {open ? <ChevronUp size={15} color={t.textMuted} /> : <ChevronDown size={15} color={t.textMuted} />}
      </button>
      {open && <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>}
    </div>
  );
}

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

const iStyle = (t) => ({ width: "100%", padding: "8px 12px", borderRadius: 9, border: `1px solid ${t.inputBorder}`, background: t.inputBg, color: t.inputText, fontSize: 12, fontFamily: "'Poppins',sans-serif", outline: "none", boxSizing: "border-box" });

function Toggle({ t, value, onChange }) {
  return (
    <button type="button" onClick={onChange} style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: value ? "#f97316" : t.toggleOff, position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
      <span style={{ position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", left: value ? 21 : 3, transition: "left 0.2s" }} />
    </button>
  );
}

function safeArr(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") { try { return JSON.parse(val); } catch { return val.split(",").map(s => s.trim()).filter(Boolean); } }
  return [];
}

/* ─── Live Preview Card ─── */
function PreviewCard({ t, isDark, data }) {
  return (
    <div style={{ background: t.cardBg, borderRadius: 14, border: `1px solid rgba(249,115,22,0.3)`, overflow: "hidden", boxShadow: t.shadow }}>
      <div style={{ width: "100%", height: 100, background: "linear-gradient(135deg,#1e293b,#0f172a)", position: "relative", overflow: "hidden" }}>
        {data.thumbnailPreview
          ? <img src={data.thumbnailPreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#64748b", fontFamily: "'Poppins',sans-serif" }}>No Thumbnail</div>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.4),transparent)" }} />
      </div>
      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {data.onDemand && <span style={{ fontSize: 9, fontWeight: 800, color: "#f97316", border: "1px solid rgba(249,115,22,0.4)", padding: "1px 7px", borderRadius: 999, background: "rgba(249,115,22,0.08)", fontFamily: "'Poppins',sans-serif" }}>ON DEMAND</span>}
          {data.featured && <span style={{ fontSize: 9, fontWeight: 800, color: "#f59e0b", display: "flex", alignItems: "center", gap: 2, fontFamily: "'Poppins',sans-serif" }}><Star size={9} style={{ fill: "#f59e0b" }} /> Featured</span>}
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif", lineHeight: 1.3 }}>{data.title || "Course Title"}</p>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {data.tags.filter(tg => tg.name).slice(0, 2).map((tag, i) => (
            <span key={i} style={{ fontSize: 9, color: t.textSub, border: `1px solid ${t.border}`, padding: "1px 7px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>{tag.name}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={10} />{data.students || "—"}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#f59e0b", fontWeight: 700 }}><Star size={10} style={{ fill: "#f59e0b" }} />{data.rating || "—"}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Course Form ─── */
function EditCourseForm({ t, isDark, course, onCancel, onSaved }) {
  const id = course._id || course.id;
  const inp = iStyle(t);
  const [onDemand, setOnDemand] = useState(course.onDemand ?? true);
  const [featured, setFeatured] = useState(course.featured ?? true);
  const [title, setTitle] = useState(course.title || "");
  const [students, setStudents] = useState(course.students || "");
  const [rating, setRating] = useState(course.rating ? String(course.rating) : "");
  const [duration, setDuration] = useState(course.duration || "");
  const [level, setLevel] = useState(course.level || "Beginner");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(course.thumbnail || null);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const thumbRef = useRef(null);
  const parsedTags = safeArr(course.tags || course.topics);
  const [tags, setTags] = useState(parsedTags.length > 0 ? parsedTags.map((tg, i) => ({ id: i + 1, name: typeof tg === "object" ? tg.name || "" : tg, course: typeof tg === "object" ? tg.course || "" : "" })) : [{ id: 1, name: "", course: "" }]);
  const parsedInstructors = safeArr(course.instructors);
  const [instructors, setInstructors] = useState(parsedInstructors.length > 0 ? parsedInstructors.map((ins, i) => ({ id: i + 1, name: typeof ins === "object" ? ins.name || "" : ins, designation: typeof ins === "object" ? ins.designation || "" : "", avatarInitials: typeof ins === "object" ? ins.avatarInitials || "" : "" })) : [{ id: 1, name: "", designation: "", avatarInitials: "" }]);

  const addTag = () => setTags([...tags, { id: Date.now(), name: "", course: "" }]);
  const removeTag = (tid) => { if (tags.length > 1) setTags(tags.filter(tg => tg.id !== tid)); };
  const updateTag = (tid, field, val) => setTags(tags.map(tg => tg.id === tid ? { ...tg, [field]: val } : tg));
  const addInstructor = () => setInstructors([...instructors, { id: Date.now(), name: "", designation: "", avatarInitials: "" }]);
  const removeInstructor = (iid) => { if (instructors.length > 1) setInstructors(instructors.filter(i => i.id !== iid)); };
  const updateInstructor = (iid, field, val) => setInstructors(instructors.map(i => i.id === iid ? { ...i, [field]: val } : i));
  const handleThumbnail = (e) => { const file = e.target.files[0]; if (!file) return; setThumbnail(file); const reader = new FileReader(); reader.onload = ev => setThumbnailPreview(ev.target.result); reader.readAsDataURL(file); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setErrorMsg("Course title is required."); return; }
    if (!instructors[0].name.trim()) { setErrorMsg("At least one instructor name is required."); return; }
    setStatus("uploading"); setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim()); formData.append("onDemand", onDemand); formData.append("featured", featured);
      formData.append("level", level); formData.append("duration", duration.trim() || ""); formData.append("rating", rating !== "" ? rating : "");
      formData.append("students", students.trim() || "");
      formData.append("tags", JSON.stringify(tags.filter(tg => tg.name.trim()).map(({ name, course }) => ({ name, course }))));
      formData.append("instructors", JSON.stringify(instructors.filter(i => i.name.trim()).map(({ name, designation, avatarInitials }) => ({ name, designation, avatarInitials }))));
      if (thumbnail) formData.append("thumbnail", thumbnail);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"}/featured-courses/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` }, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Update failed");
      setStatus("success"); onSaved(data);
    } catch (err) { setErrorMsg("Update failed. Please try again."); setStatus("error"); }
  };

  const previewData = { onDemand, featured, title, tags, instructors, students, rating, duration, level, thumbnailPreview };

  return (
    <div style={{ marginTop: 10, border: `1px solid rgba(249,115,22,0.3)`, borderRadius: 14, overflow: "hidden", background: isDark ? "rgba(249,115,22,0.03)" : "#fff8f3" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "rgba(249,115,22,0.08)", borderBottom: `1px solid rgba(249,115,22,0.15)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Pencil size={12} color="#f97316" />
          <span style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Editing: <span style={{ color: "#f97316" }}>{course.title}</span></span>
        </div>
        <button type="button" onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: t.textMuted, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
          <XCircle size={13} /> Cancel
        </button>
      </div>
      <div style={{ padding: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
        <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0, minWidth: 0 }}>
          {errorMsg && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#f43f5e", fontSize: 12, fontFamily: "'Poppins',sans-serif", marginBottom: 10 }}><AlertCircle size={13} />{errorMsg}</div>}

          <Panel t={t} icon={Star} number="1" title="Badges">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[{ label: "ON DEMAND Badge", desc: "Show orange badge", val: onDemand, set: setOnDemand }, { label: "⭐ Featured Badge", desc: "Show star badge", val: featured, set: setFeatured }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{item.desc}</p>
                  </div>
                  <Toggle t={t} value={item.val} onChange={() => item.set(!item.val)} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel t={t} icon={BookOpen} number="2" title="Course Info">
            <Field t={t} label="Course Title" required>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Course title..." style={inp} />
            </Field>
            <Field t={t} label="Thumbnail" hint="leave empty to keep existing">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {thumbnailPreview ? (
                  <div style={{ position: "relative", width: 90, height: 54, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(249,115,22,0.3)", flexShrink: 0 }}>
                    <img src={thumbnailPreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }} style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, background: "rgba(0,0,0,0.6)", borderRadius: "50%", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={9} /></button>
                  </div>
                ) : (
                  <div onClick={() => thumbRef.current?.click()} style={{ width: 90, height: 54, border: `1.5px dashed ${t.inputBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: t.inputBg, flexShrink: 0 }}>
                    <Image size={14} color={t.textMuted} />
                    <span style={{ fontSize: 9, color: t.textMuted, marginTop: 2, fontFamily: "'Poppins',sans-serif" }}>Change</span>
                  </div>
                )}
                <p style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5 }}>JPG, PNG or WebP<br />16:9 recommended</p>
              </div>
              <input ref={thumbRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnail} />
            </Field>
          </Panel>

          <Panel t={t} icon={Tag} number="3" title="Tags" defaultOpen={false}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tags.map((tag, idx) => (
                <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>{idx + 1}</div>
                  <input value={tag.name} onChange={e => updateTag(tag.id, "name", e.target.value)} placeholder="Tag name" style={{ ...inp, flex: 1 }} />
                  <input value={tag.course} onChange={e => updateTag(tag.id, "course", e.target.value)} placeholder="Course" style={{ ...inp, flex: 1 }} />
                  {tags.length > 1 && <button type="button" onClick={() => removeTag(tag.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2 }}><Trash2 size={13} /></button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={addTag} style={{ width: "100%", padding: "8px", border: `1.5px dashed ${t.inputBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Plus size={12} /> Add Tag
            </button>
          </Panel>

          <Panel t={t} icon={Users} number="4" title="Instructors" defaultOpen={false}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {instructors.map((ins, idx) => (
                <div key={ins.id} style={{ padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>{ins.avatarInitials || (ins.name ? ins.name.slice(0, 2).toUpperCase() : `I${idx + 1}`)}</div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Instructor {idx + 1}</span>
                    </div>
                    {instructors.length > 1 && <button type="button" onClick={() => removeInstructor(ins.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2 }}><Trash2 size={12} /></button>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 6 }}>
                    <input value={ins.name} onChange={e => updateInstructor(ins.id, "name", e.target.value)} placeholder="Full Name *" style={inp} />
                    <input value={ins.avatarInitials} onChange={e => updateInstructor(ins.id, "avatarInitials", e.target.value)} placeholder="Initials" maxLength={3} style={inp} />
                  </div>
                  <input value={ins.designation} onChange={e => updateInstructor(ins.id, "designation", e.target.value)} placeholder="Designation" style={inp} />
                </div>
              ))}
            </div>
            <button type="button" onClick={addInstructor} style={{ width: "100%", padding: "8px", border: `1.5px dashed ${t.inputBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Plus size={12} /> Add Instructor
            </button>
          </Panel>

          <Panel t={t} icon={Award} number="5" title="Stats & Level">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field t={t} label="Total Students"><input value={students} onChange={e => setStudents(e.target.value)} placeholder="10,477" style={inp} /></Field>
              <Field t={t} label="Rating" hint="0–5"><input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(e.target.value)} placeholder="4.9" style={inp} /></Field>
              <Field t={t} label="Duration"><input value={duration} onChange={e => setDuration(e.target.value)} placeholder="6 weeks" style={inp} /></Field>
              <Field t={t} label="Level" required>
                <select value={level} onChange={e => setLevel(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </Field>
            </div>
          </Panel>

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button type="submit" disabled={status === "uploading"} style={{ flex: 1, padding: "11px 16px", borderRadius: 10, background: "linear-gradient(135deg,#f97316,#ea580c)", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", boxShadow: "0 4px 14px rgba(249,115,22,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {status === "uploading" ? <><Loader size={14} className="spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
            </button>
            <button type="button" onClick={onCancel} style={{ padding: "11px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Cancel</button>
          </div>
        </form>

        {/* Live Preview */}
        <div style={{ width: 180, flexShrink: 0, display: "none" }} className="lg-preview">
          <div style={{ background: t.previewBg, borderRadius: 12, padding: "12px", border: `1px solid ${t.border}` }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 5 }}><Eye size={11} /> Live Preview</p>
            <PreviewCard t={t} isDark={isDark} data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Courses List ─── */
function FeaturedCoursesList({ t, isDark }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchCourses = async () => {
    try { setLoading(true); setError(null); const res = await courseService.getAllFeaturedCourses(); const data = res.data?.data || res.data || []; setCourses(Array.isArray(data) ? data : []); }
    catch { setError("Failed to load courses."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchCourses(); }, []);

  const handleDelete = async (id) => {
    try { setDeletingId(id); await courseService.deleteFeaturedCourse(id); setCourses(prev => prev.filter(c => (c._id || c.id) !== id)); setConfirmDeleteId(null); }
    catch { setError("Failed to delete course."); }
    finally { setDeletingId(null); }
  };

  const handleSaved = (updatedCourse) => { setCourses(prev => prev.map(c => (c._id || c.id) === (updatedCourse._id || updatedCourse.id) ? updatedCourse : c)); setEditingId(null); };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${t.border}`, background: t.recentItemBg, animation: "shimmer 1.5s ease infinite" }}>
          <div style={{ width: 80, height: 56, borderRadius: 8, background: t.skeletonBg, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ height: 10, width: "60%", borderRadius: 5, background: t.skeletonBg }} />
            <div style={{ height: 8, width: "40%", borderRadius: 4, background: t.skeletonBg }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "30px 0" }}>
      <AlertCircle size={28} color="#f43f5e" style={{ margin: "0 auto 10px" }} />
      <p style={{ color: "#f43f5e", fontSize: 12, fontFamily: "'Poppins',sans-serif", marginBottom: 12 }}>{error}</p>
      <button onClick={fetchCourses} style={{ padding: "8px 18px", borderRadius: 9, background: "#f97316", border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Retry</button>
    </div>
  );

  if (courses.length === 0) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 0", gap: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, border: `1.5px dashed ${t.emptyBorder}`, background: t.emptyBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BookOpen size={20} color={t.emptyIcon} />
      </div>
      <p style={{ fontSize: 12, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0 }}>No featured courses yet</p>
      <p style={{ fontSize: 10, color: t.textLabel, fontFamily: "'Poppins',sans-serif", margin: 0 }}>Switch to Create tab to add one</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={fetchCourses} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      {courses.map(course => {
        const id = course._id || course.id;
        const isDeleting = deletingId === id;
        const isConfirming = confirmDeleteId === id;
        const isEditing = editingId === id;
        const instructors = safeArr(course.instructors);
        const tags = safeArr(course.tags || course.topics);

        return (
          <div key={id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1px solid ${isEditing ? "rgba(249,115,22,0.4)" : t.recentItemBorder}`, background: isEditing ? (isDark ? "rgba(249,115,22,0.04)" : "#fff8f3") : t.recentItemBg, transition: "all 0.15s" }}>
              {/* Thumbnail */}
              <div style={{ width: 80, height: 56, borderRadius: 8, overflow: "hidden", background: "#1e293b", flexShrink: 0, position: "relative" }}>
                {course.thumbnail ? <img src={course.thumbnail} alt={course.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Image size={16} color="#475569" /></div>}
                {(course.onDemand || course.status === "ON DEMAND") && <span style={{ position: "absolute", top: 3, left: 3, fontSize: 8, fontWeight: 800, color: "#fff", background: "#f97316", padding: "1px 5px", borderRadius: 999, fontFamily: "'Poppins',sans-serif" }}>ON DEMAND</span>}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: t.text, margin: "0 0 4px", fontFamily: "'Poppins',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
                  {tags.slice(0, 2).map((tag, i) => <span key={i} style={{ fontSize: 9, background: "rgba(249,115,22,0.1)", color: "#f97316", padding: "1px 7px", borderRadius: 999, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>{typeof tag === "object" ? tag.name : tag}</span>)}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif" }}>
                  {course.students && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={10} color="#f97316" />{course.students}</span>}
                  {course.rating && <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#f59e0b", fontWeight: 700 }}><Star size={10} style={{ fill: "#f59e0b" }} />{course.rating}</span>}
                  {course.duration && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} color="#f97316" />{course.duration}</span>}
                  {course.level && <span style={{ border: `1px solid ${t.border}`, padding: "0 6px", borderRadius: 999 }}>{course.level}</span>}
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, flexShrink: 0 }}>
                <button onClick={() => setEditingId(isEditing ? null : id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", fontSize: 10, fontWeight: 600, borderRadius: 8, border: isEditing ? "none" : "1px solid rgba(249,115,22,0.35)", background: isEditing ? "#f97316" : "rgba(249,115,22,0.08)", color: isEditing ? "#fff" : "#f97316", cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                  <Pencil size={11} />{isEditing ? "Editing…" : "Edit"}
                </button>
                {!isConfirming ? (
                  <button onClick={() => setConfirmDeleteId(id)} disabled={isDeleting} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", fontSize: 10, fontWeight: 600, color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)", background: "rgba(244,63,94,0.06)", borderRadius: 8, cursor: "pointer", fontFamily: "'Poppins',sans-serif", whiteSpace: "nowrap" }}>
                    <Trash2 size={11} /> Delete
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                    <p style={{ fontSize: 9, color: t.textMuted, fontFamily: "'Poppins',sans-serif", margin: 0, fontWeight: 700 }}>Sure?</p>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setConfirmDeleteId(null)} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>No</button>
                      <button onClick={() => handleDelete(id)} disabled={isDeleting} style={{ padding: "3px 8px", borderRadius: 6, background: "#f43f5e", border: "none", color: "#fff", fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", gap: 3 }}>
                        {isDeleting ? <Loader size={9} className="spin" /> : <Trash2 size={9} />} Yes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isEditing && <EditCourseForm t={t} isDark={isDark} course={course} onCancel={() => setEditingId(null)} onSaved={handleSaved} />}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Create Course Form ─── */
function CreateCourseForm({ t, isDark, onSubmit, onClose }) {
  const inp = iStyle(t);
  const [onDemand, setOnDemand] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([{ id: 1, name: "", course: "" }]);
  const [instructors, setInstructors] = useState([{ id: 1, name: "", designation: "", avatarInitials: "" }]);
  const [students, setStudents] = useState(""); const [rating, setRating] = useState(""); const [duration, setDuration] = useState(""); const [level, setLevel] = useState("Beginner");
  const [thumbnail, setThumbnail] = useState(null); const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [status, setStatus] = useState("idle"); const [errorMsg, setErrorMsg] = useState("");
  const thumbRef = useRef(null);

  const addTag = () => setTags([...tags, { id: Date.now(), name: "", course: "" }]);
  const removeTag = (id) => { if (tags.length > 1) setTags(tags.filter(tg => tg.id !== id)); };
  const updateTag = (id, field, val) => setTags(tags.map(tg => tg.id === id ? { ...tg, [field]: val } : tg));
  const addInstructor = () => setInstructors([...instructors, { id: Date.now(), name: "", designation: "", avatarInitials: "" }]);
  const removeInstructor = (id) => { if (instructors.length > 1) setInstructors(instructors.filter(i => i.id !== id)); };
  const updateInstructor = (id, field, val) => setInstructors(instructors.map(i => i.id === id ? { ...i, [field]: val } : i));
  const handleThumbnail = (e) => { const file = e.target.files[0]; if (!file) return; setThumbnail(file); const reader = new FileReader(); reader.onload = ev => setThumbnailPreview(ev.target.result); reader.readAsDataURL(file); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setErrorMsg("Course title is required."); return; }
    if (!instructors[0].name.trim()) { setErrorMsg("At least one instructor name is required."); return; }
    setStatus("uploading"); setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim()); formData.append("onDemand", onDemand); formData.append("featured", featured);
      formData.append("level", level); formData.append("duration", duration.trim() || ""); formData.append("rating", rating !== "" ? rating : "");
      formData.append("students", students.trim() || "");
      formData.append("tags", JSON.stringify(tags.filter(tg => tg.name.trim()).map(({ name, course }) => ({ name, course }))));
      formData.append("instructors", JSON.stringify(instructors.filter(i => i.name.trim()).map(({ name, designation, avatarInitials }) => ({ name, designation, avatarInitials }))));
      if (thumbnail) formData.append("thumbnail", thumbnail);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api"}/featured-courses/upload`, { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("lms_token")}` }, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Upload failed");
      if (onSubmit) onSubmit(data);
      setStatus("success");
    } catch { setErrorMsg("Submission failed. Please try again."); setStatus("error"); }
  };

  const reset = () => { setTitle(""); setTags([{ id: 1, name: "", course: "" }]); setInstructors([{ id: 1, name: "", designation: "", avatarInitials: "" }]); setStudents(""); setRating(""); setDuration(""); setLevel("Beginner"); setThumbnail(null); setThumbnailPreview(null); setOnDemand(true); setFeatured(true); setStatus("idle"); setErrorMsg(""); };

  const previewData = { onDemand, featured, title, tags, instructors, students, rating, duration, level, thumbnailPreview };

  if (status === "success") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <CheckCircle size={28} color={isDark ? "#34d399" : "#16a34a"} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: t.text, margin: "0 0 8px", fontFamily: "'Poppins',sans-serif" }}>Course Published! 🎉</h3>
      <p style={{ fontSize: 12, color: t.textSub, marginBottom: 20, fontFamily: "'Poppins',sans-serif" }}>"{title}" is now live.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={reset} style={{ padding: "9px 20px", borderRadius: 10, background: "#f97316", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Create New</button>
        {onClose && <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Close</button>}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 0 }}>
        {errorMsg && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, color: "#f43f5e", fontSize: 12, fontFamily: "'Poppins',sans-serif", marginBottom: 10 }}><AlertCircle size={13} />{errorMsg}</div>}

        <Panel t={t} icon={Star} number="1" title="Badges">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[{ label: "ON DEMAND Badge", desc: "Show orange badge", val: onDemand, set: setOnDemand }, { label: "⭐ Featured Badge", desc: "Show star badge", val: featured, set: setFeatured }].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: t.text, margin: 0, fontFamily: "'Poppins',sans-serif" }}>{item.label}</p>
                  <p style={{ fontSize: 10, color: t.textMuted, margin: "2px 0 0", fontFamily: "'Poppins',sans-serif" }}>{item.desc}</p>
                </div>
                <Toggle t={t} value={item.val} onChange={() => item.set(!item.val)} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel t={t} icon={BookOpen} number="2" title="Course Info">
          <Field t={t} label="Course Title" required>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Build An Agentic AI Product End to End, No Code" style={inp} />
          </Field>
          <Field t={t} label="Thumbnail" hint="optional">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {thumbnailPreview ? (
                <div style={{ position: "relative", width: 90, height: 54, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(249,115,22,0.3)", flexShrink: 0 }}>
                  <img src={thumbnailPreview} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }} style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, background: "rgba(0,0,0,0.6)", borderRadius: "50%", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={9} /></button>
                </div>
              ) : (
                <div onClick={() => thumbRef.current?.click()} style={{ width: 90, height: 54, border: `1.5px dashed ${t.inputBorder}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", background: t.inputBg, flexShrink: 0 }}>
                  <Image size={14} color={t.textMuted} />
                  <span style={{ fontSize: 9, color: t.textMuted, marginTop: 2, fontFamily: "'Poppins',sans-serif" }}>Add Thumbnail</span>
                </div>
              )}
              <p style={{ fontSize: 10, color: t.textMuted, fontFamily: "'Poppins',sans-serif", lineHeight: 1.5 }}>JPG, PNG or WebP<br />Recommended: 16:9<br />Min: 640×360px</p>
            </div>
            <input ref={thumbRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnail} />
          </Field>
        </Panel>

        <Panel t={t} icon={Tag} number="3" title="Tags" defaultOpen={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tags.map((tag, idx) => (
              <div key={tag.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: "'Poppins',sans-serif", flexShrink: 0 }}>{idx + 1}</div>
                <input value={tag.name} onChange={e => updateTag(tag.id, "name", e.target.value)} placeholder="Tag name" style={{ ...inp, flex: 1 }} />
                <input value={tag.course} onChange={e => updateTag(tag.id, "course", e.target.value)} placeholder="Course" style={{ ...inp, flex: 1 }} />
                {tags.length > 1 && <button type="button" onClick={() => removeTag(tag.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2 }}><Trash2 size={13} /></button>}
              </div>
            ))}
          </div>
          <button type="button" onClick={addTag} style={{ width: "100%", padding: "8px", border: `1.5px dashed ${t.inputBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Plus size={12} /> Add Tag
          </button>
        </Panel>

        <Panel t={t} icon={Users} number="4" title="Instructors">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {instructors.map((ins, idx) => (
              <div key={ins.id} style={{ padding: "10px 12px", background: t.sectionHeaderBg, borderRadius: 9, border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 9, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>{ins.avatarInitials || (ins.name ? ins.name.slice(0, 2).toUpperCase() : `I${idx + 1}`)}</div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.text, fontFamily: "'Poppins',sans-serif" }}>Instructor {idx + 1}</span>
                  </div>
                  {instructors.length > 1 && <button type="button" onClick={() => removeInstructor(ins.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: 2 }}><Trash2 size={12} /></button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 6, marginBottom: 6 }}>
                  <input value={ins.name} onChange={e => updateInstructor(ins.id, "name", e.target.value)} placeholder="Full Name *" style={inp} />
                  <input value={ins.avatarInitials} onChange={e => updateInstructor(ins.id, "avatarInitials", e.target.value)} placeholder="Initials" maxLength={3} style={inp} />
                </div>
                <input value={ins.designation} onChange={e => updateInstructor(ins.id, "designation", e.target.value)} placeholder="Designation" style={inp} />
              </div>
            ))}
          </div>
          <button type="button" onClick={addInstructor} style={{ width: "100%", padding: "8px", border: `1.5px dashed ${t.inputBorder}`, borderRadius: 9, background: "transparent", color: t.textMuted, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Plus size={12} /> Add Instructor
          </button>
        </Panel>

        <Panel t={t} icon={Award} number="5" title="Stats & Level">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field t={t} label="Total Students"><input value={students} onChange={e => setStudents(e.target.value)} placeholder="10,477" style={inp} /></Field>
            <Field t={t} label="Rating" hint="0–5"><input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(e.target.value)} placeholder="4.9" style={inp} /></Field>
            <Field t={t} label="Duration"><input value={duration} onChange={e => setDuration(e.target.value)} placeholder="6 weeks" style={inp} /></Field>
            <Field t={t} label="Level" required>
              <select value={level} onChange={e => setLevel(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </Field>
          </div>
        </Panel>

        <div style={{ display: "flex", gap: 8, marginTop: 4, paddingBottom: 8 }}>
          <button type="submit" disabled={status === "uploading"} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg,#f97316,#ea580c)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins',sans-serif", boxShadow: "0 4px 14px rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            {status === "uploading" ? <><Loader size={15} className="spin" /> Uploading...</> : <><Upload size={15} /> Publish Course</>}
          </button>
          {onClose && status !== "uploading" && (
            <button type="button" onClick={onClose} style={{ padding: "12px 16px", borderRadius: 12, border: `1px solid ${t.border}`, background: t.actBg, color: t.textSub, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>Cancel</button>
          )}
        </div>
      </form>

      {/* Live Preview — compact */}
      <div style={{ width: 190, flexShrink: 0, position: "sticky", top: 20 }}>
        <div style={{ background: t.previewBg, borderRadius: 12, padding: "12px", border: `1px solid ${t.border}` }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: t.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Poppins',sans-serif", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 5 }}><Eye size={10} /> Live Preview</p>
          <PreviewCard t={t} isDark={isDark} data={previewData} />
          <p style={{ fontSize: 9, color: t.textLabel, textAlign: "center", marginTop: 8, fontFamily: "'Poppins',sans-serif" }}>Updates in real time</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════ ROOT ══════════ */
export default function FeaturedCourseUploadForm({ onSubmit, onClose }) {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    () => typeof document !== "undefined" && (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  const t = isDark ? T.dark : T.light;

  const [activeTab, setActiveTab] = useState("create");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} .ffade{animation:fadeUp 0.45s ease both}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}} .d1{animation:blink 1.6s ease infinite} .d2{animation:blink 1.6s 0.3s ease infinite} .d3{animation:blink 1.6s 0.6s ease infinite}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}70%{box-shadow:0 0 0 8px rgba(52,211,153,0)}100%{box-shadow:0 0 0 0 rgba(52,211,153,0)}} .livebadge{animation:pulse-ring 2.2s ease-out infinite}
        @keyframes spin{to{transform:rotate(360deg)}} .spin{animation:spin 1s linear infinite}
        @keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.4}}
        input:focus,textarea:focus,select:focus{border-color:#f97316 !important;box-shadow:0 0 0 3px rgba(249,115,22,0.1)}
      `}</style>

      <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Poppins',sans-serif", transition: "background 0.3s,color 0.3s" }}>
      <div style={{
  width: "100%",
  padding: "24px 32px",
  boxSizing: "border-box"
}}>

          {/* ═══ HERO ═══ */}
          <div className="ffade" style={{ borderRadius: 24, padding: "26px 30px", background: t.heroBg, border: `1px solid ${t.borderHero}`, position: "relative", overflow: "hidden", marginBottom: 18, boxShadow: t.shadow }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: isDark ? 0.04 : 0.025, backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: "40px 40px" }} />
            <div style={{ position: "absolute", top: "-30%", left: "40%", width: 300, height: 200, background: "radial-gradient(ellipse,rgba(249,115,22,0.07),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40%", right: "10%", width: 250, height: 200, background: "radial-gradient(ellipse,rgba(34,211,238,0.05),transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <button onClick={() => navigate("/admin/course-upload")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1px solid ${t.borderHov}`, background: t.actBg, color: t.textSub, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>
                    <ArrowLeft size={12} /> Upload Course
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={10} color={t.textSub} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: t.textSub, fontFamily: "'Poppins',sans-serif" }}>Admin Portal</span>
                  </div>
                </div>
                <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: t.text, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em" }}>Featured Courses</h1>
                <p style={{ fontSize: 12, color: t.textSub, marginTop: 5, fontWeight: 500, fontFamily: "'Poppins',sans-serif" }}>Admin Panel • Explore Programs</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                {onClose && <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.actBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={14} color={t.textMuted} /></button>}
              </div>
            </div>
          </div>

          {/* ═══ TABS ═══ */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: 4, width: "fit-content", boxShadow: t.shadow }}>
            {[{ id: "create", label: "Create Course", icon: PlusCircle }, { id: "list", label: "All Courses", icon: List }].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 700, background: activeTab === tab.id ? "linear-gradient(135deg,#f97316,#ea580c)" : "transparent", color: activeTab === tab.id ? "#fff" : t.textSub, boxShadow: activeTab === tab.id ? "0 3px 10px rgba(249,115,22,0.4)" : "none", transition: "all 0.2s" }}>
                  <Icon size={13} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* ═══ CONTENT CARD ═══ */}
          <div className="ffade" style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 20, boxShadow: t.shadow }}>
            {activeTab === "create" && <CreateCourseForm t={t} isDark={isDark} onSubmit={onSubmit} onClose={onClose} />}
            {activeTab === "list" && <FeaturedCoursesList t={t} isDark={isDark} />}
          </div>
        </div>
      </div>
    </>
  );
}
























