import React, { useState, useRef } from "react";
import {
  Upload, X, Image, CheckCircle, AlertCircle,
  Loader, Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, Star, Users, Clock, Award, Tag, BookOpen,Eye 
} from "lucide-react";

// ─── Reusable Components ───────────────────────────────────────────
function Section({ icon: Icon, number, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center text-white text-sm font-bold">{number}</div>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#F97316]" />
            <span className="font-bold text-[#1E293B]">{title}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && <div className="p-6 space-y-4 bg-white">{children}</div>}
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1E293B] mb-1">
        {label} {required && <span className="text-[#F97316]">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1 text-xs">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F97316] focus:outline-none transition text-[#1E293B] placeholder-gray-400 bg-white text-sm";

// ─── Live Preview Card ─────────────────────────────────────────────
function PreviewCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-md max-w-xs">
      {/* Thumbnail */}
      <div className="w-full h-36 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        {data.thumbnailPreview
          ? <img src={data.thumbnailPreview} alt="thumb" className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Thumbnail</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex items-center justify-between">
          {data.onDemand && (
            <span className="text-xs font-bold text-[#F97316] border border-[#F97316]/40 px-2 py-0.5 rounded-full bg-orange-50">ON DEMAND</span>
          )}
          {data.featured && (
            <span className="text-xs font-bold text-[#F97316] flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#F97316]" /> Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#1E293B] text-sm leading-tight">
          {data.title || "Course Title"}
        </h3>

        {/* Tags */}
        {data.tags.filter(t => t.name).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.filter(t => t.name).map((tag, i) => (
              <span key={i} className="text-xs text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{tag.name}</span>
            ))}
          </div>
        )}

        {/* Instructors */}
        <div className="space-y-1.5">
          {data.instructors.filter(ins => ins.name).map((ins, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1E293B] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {ins.avatarInitials || ins.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600 truncate">
                {ins.name}{ins.designation ? `: ${ins.designation}` : ""}
              </span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {data.students ? `${data.students} students` : "—"}
          </span>
          <span className="flex items-center gap-1 text-[#F97316] font-semibold">
            <Star className="w-3.5 h-3.5 fill-[#F97316]" />
            {data.rating || "—"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {data.duration || "—"}
          </span>
          {data.level && (
            <span className="border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">{data.level}</span>
          )}
        </div>

        {/* Watch Now */}
        <button className="w-full py-2.5 bg-[#1E293B] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2">
          ▶ Watch Now &nbsp;›
        </button>
      </div>
    </div>
  );
}

// ─── Main Form ─────────────────────────────────────────────────────
export default function FeaturedCourseUploadForm({ onSubmit, onClose }) {
  // Badges
  const [onDemand, setOnDemand] = useState(true);
  const [featured, setFeatured] = useState(true);

  // Course Info
  const [title, setTitle] = useState("");

  // Tags
  const [tags, setTags] = useState([{ id: 1, name: "", course: "" }]);

  // Instructors
  const [instructors, setInstructors] = useState([{ id: 1, name: "", designation: "", avatarInitials: "" }]);

  // Stats
  const [students, setStudents] = useState("");
  const [rating, setRating] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("Beginner");

  // Thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // UI
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const thumbRef = useRef(null);

  // ── Tag handlers
  const addTag = () => setTags([...tags, { id: Date.now(), name: "", course: "" }]);
  const removeTag = (id) => { if (tags.length > 1) setTags(tags.filter(t => t.id !== id)); };
  const updateTag = (id, field, val) => setTags(tags.map(t => t.id === id ? { ...t, [field]: val } : t));

  // ── Instructor handlers
  const addInstructor = () => setInstructors([...instructors, { id: Date.now(), name: "", designation: "", avatarInitials: "" }]);
  const removeInstructor = (id) => { if (instructors.length > 1) setInstructors(instructors.filter(i => i.id !== id)); };
  const updateInstructor = (id, field, val) => setInstructors(instructors.map(i => i.id === id ? { ...i, [field]: val } : i));

  // ── Thumbnail
  const handleThumbnail = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setThumbnail(file);
    const reader = new FileReader();
    reader.onload = ev => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setErrorMsg("Course title zaroori hai!"); return; }
    if (!instructors[0].name.trim()) { setErrorMsg("Kam se kam ek instructor zaroori hai!"); return; }

    setStatus("uploading"); setErrorMsg("");
    const formData = new FormData();
    formData.append("onDemand", onDemand);
    formData.append("featured", featured);
    formData.append("title", title);
    formData.append("tags", JSON.stringify(tags.filter(t => t.name)));
    formData.append("instructors", JSON.stringify(instructors.filter(i => i.name)));
    formData.append("students", students);
    formData.append("rating", rating);
    formData.append("duration", duration);
    formData.append("level", level);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      await new Promise(r => setTimeout(r, 1500));
      if (onSubmit) onSubmit(formData);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Submit fail ho gaya.");
    }
  };

  const reset = () => {
    setTitle(""); setTags([{ id: 1, name: "", course: "" }]);
    setInstructors([{ id: 1, name: "", designation: "", avatarInitials: "" }]);
    setStudents(""); setRating(""); setDuration(""); setLevel("Beginner");
    setThumbnail(null); setThumbnailPreview(null);
    setOnDemand(true); setFeatured(true);
    setStatus("idle"); setErrorMsg("");
  };

  // ── Success
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F6EDE6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Course Published! 🎉</h3>
          <p className="text-gray-500 mb-8">"{title}" explore page par live ho gaya.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-orange-600 transition">Naya Course</button>
            {onClose && <button onClick={onClose} className="px-6 py-3 bg-[#1E293B] text-white rounded-xl font-semibold hover:bg-gray-800 transition">Band Karo</button>}
          </div>
        </div>
      </div>
    );
  }

  const previewData = { onDemand, featured, title, tags, instructors, students, rating, duration, level, thumbnailPreview };

  return (
    <div className="min-h-screen bg-[#F6EDE6] py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Featured Course Upload</h1>
              <p className="text-sm text-gray-500">Admin Panel • Explore Programs</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex gap-8 items-start">

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4 min-w-0">

            {errorMsg && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />{errorMsg}
              </div>
            )}

            {/* ── 1. Badges ── */}
            <Section icon={Star} number="1" title="Badges">
              <div className="grid grid-cols-2 gap-4">
                {/* ON DEMAND */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-[#1E293B] text-sm">ON DEMAND Badge</p>
                    <p className="text-xs text-gray-400">Card pe orange badge dikhao</p>
                  </div>
                  <button type="button" onClick={() => setOnDemand(!onDemand)}
                    className={`w-12 h-6 rounded-full transition-all relative ${onDemand ? "bg-[#F97316]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${onDemand ? "left-[26px]" : "left-0.5"}`} />
                  </button>
                </div>
                {/* FEATURED */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="font-semibold text-[#1E293B] text-sm">⭐ Featured Badge</p>
                    <p className="text-xs text-gray-400">Top-right mein star dikhao</p>
                  </div>
                  <button type="button" onClick={() => setFeatured(!featured)}
                    className={`w-12 h-6 rounded-full transition-all relative ${featured ? "bg-[#F97316]" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${featured ? "left-[26px]" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </Section>

            {/* ── 2. Course Title + Thumbnail ── */}
            <Section icon={BookOpen} number="2" title="Course Info">
              <Field label="Course Title" required>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Build An Agentic AI Product End to End, No Code"
                  className={inputCls} />
              </Field>

              {/* Thumbnail */}
              <Field label="Thumbnail Image" hint="optional">
                <div className="flex items-center gap-4">
                  {thumbnailPreview ? (
                    <div className="relative w-40 h-24 rounded-xl overflow-hidden border-2 border-[#F97316]/40 flex-shrink-0">
                      <img src={thumbnailPreview} alt="thumb" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => thumbRef.current?.click()}
                      className="w-40 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition flex-shrink-0">
                      <Image className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-400">Add Thumbnail</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed">JPG, PNG ya WebP<br />Recommended: 16:9<br />Min: 640×360px</p>
                </div>
                <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnail} />
              </Field>
            </Section>

            {/* ── 3. Tags ── */}
            <Section icon={Tag} number="3" title="Tags">
              <div className="space-y-3">
                {tags.map((tag, idx) => (
                  <div key={tag.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-6 h-6 bg-[#F97316] rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input value={tag.name} onChange={e => updateTag(tag.id, "name", e.target.value)}
                        placeholder="Tag name (e.g. AI Product Development)"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-xs text-[#1E293B] placeholder-gray-400" />
                      <input value={tag.course} onChange={e => updateTag(tag.id, "course", e.target.value)}
                        placeholder="Course (e.g. No-Code Tools)"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-xs text-[#1E293B] placeholder-gray-400" />
                    </div>
                    {tags.length > 1 && (
                      <button type="button" onClick={() => removeTag(tag.id)} className="text-gray-300 hover:text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTag}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition flex items-center justify-center gap-2 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Tag Add Karo
              </button>
            </Section>

            {/* ── 4. Instructors ── */}
            <Section icon={Users} number="4" title="Instructors">
              <div className="space-y-3">
                {instructors.map((ins, idx) => (
                  <div key={ins.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1E293B] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {ins.avatarInitials || (ins.name ? ins.name.slice(0, 2).toUpperCase() : `I${idx + 1}`)}
                        </div>
                        <span className="text-sm font-semibold text-[#1E293B]">Instructor {idx + 1}</span>
                      </div>
                      {instructors.length > 1 && (
                        <button type="button" onClick={() => removeInstructor(ins.id)} className="text-gray-300 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={ins.name} onChange={e => updateInstructor(ins.id, "name", e.target.value)}
                        placeholder="Full Name *"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-xs text-[#1E293B] placeholder-gray-400 col-span-2" />
                      <input value={ins.avatarInitials} onChange={e => updateInstructor(ins.id, "avatarInitials", e.target.value)}
                        placeholder="Initials (TF)"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-xs text-[#1E293B] placeholder-gray-400" maxLength={3} />
                      <input value={ins.designation} onChange={e => updateInstructor(ins.id, "designation", e.target.value)}
                        placeholder="Designation (Co-Founder AI Build Lab)"
                        className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-xs text-[#1E293B] placeholder-gray-400 col-span-3" />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addInstructor}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition flex items-center justify-center gap-2 text-sm font-semibold">
                <Plus className="w-4 h-4" /> Instructor Add Karo
              </button>
            </Section>

            {/* ── 5. Stats ── */}
            <Section icon={Award} number="5" title="Stats & Level">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Students" hint="e.g. 10,477">
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={students} onChange={e => setStudents(e.target.value)}
                      placeholder="10,477" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Rating" hint="0.0 – 5.0">
                  <div className="relative">
                    <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(e.target.value)}
                      placeholder="4.9" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Duration" hint="e.g. 6 weeks">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={duration} onChange={e => setDuration(e.target.value)}
                      placeholder="6 weeks" className={`${inputCls} pl-9`} />
                  </div>
                </Field>
                <Field label="Level" required>
                  <select value={level} onChange={e => setLevel(e.target.value)}
                    className={`${inputCls} cursor-pointer`}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </Field>
              </div>
            </Section>

            {/* ── Submit ── */}
            <div className="flex gap-3 pb-8">
              <button type="submit" disabled={status === "uploading"}
                className="flex-1 py-4 bg-[#F97316] hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-orange-200 flex items-center justify-center gap-2">
                {status === "uploading"
                  ? <><Loader className="w-5 h-5 animate-spin" /> Uploading...</>
                  : <><Upload className="w-5 h-5" /> Course Publish Karo</>
                }
              </button>
              {onClose && status !== "uploading" && (
                <button type="button" onClick={onClose}
                  className="px-6 py-4 border-2 border-gray-200 text-[#1E293B] font-semibold rounded-2xl hover:bg-gray-50 transition">
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* ── Live Preview ── */}
          <div className="hidden lg:block w-72 flex-shrink-0 sticky top-8">
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-md">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </p>
              <PreviewCard data={previewData} />
              <p className="text-xs text-gray-400 text-center mt-3">Form fill karte jao — card update hota rahega</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}