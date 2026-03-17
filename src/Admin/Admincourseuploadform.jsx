import React, { useState, useRef } from "react";
import {
  Upload, X, Film, Image, CheckCircle, AlertCircle,
  Loader, Plus, Trash2, ChevronDown, ChevronUp,
  Sparkles, User, BookOpen, Tag, Eye, EyeOff
} from "lucide-react";

// ─── Section Wrapper ───────────────────────────────────────────────
function Section({ icon: Icon, number, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-2 border-gray-100 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center text-white text-sm font-bold">
            {number}
          </div>
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

// ─── Field ─────────────────────────────────────────────────────────
function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1E293B] mb-1">
        {label} {required && <span className="text-[#F97316]">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F97316] focus:outline-none transition text-[#1E293B] placeholder-gray-400 disabled:opacity-50 bg-white";

// ─── Main Component ─────────────────────────────────────────────────
export default function AdminCourseUploadForm({ onSubmit, onClose }) {
  // ── 1. Top Section
  const [platformName, setPlatformName] = useState("TexoraAI.skills");
  const [featuredTag, setFeaturedTag] = useState("Featured Course");
  const [hostedBy, setHostedBy] = useState("");

  // ── 2. Video Card
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [showInstructorLive, setShowInstructorLive] = useState(true);
  const [learnersCount, setLearnersCount] = useState("");
  const [publishDate, setPublishDate] = useState("");

  // ── 3. Instructor Card
  const [instructorName, setInstructorName] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [experience, setExperience] = useState("");
  const [studentCount, setStudentCount] = useState("");

  // ── 4. Description
  const [description, setDescription] = useState("");
  const [showMoreEnabled, setShowMoreEnabled] = useState(true);

  // ── 5. What You'll Learn
  const [learnPoints, setLearnPoints] = useState([
    { id: 1, title: "", desc: "" },
  ]);

  // ── UI State
  const [status, setStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  // ── Handlers
  const handleVideoSelect = (file) => {
    if (!file) return;
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!allowed.includes(file.type)) { setErrorMsg("Only MP4, WebM, or MOV files are allowed"); return; }
    if (file.size > 500 * 1024 * 1024) { setErrorMsg("Max 500MB allowed!"); return; }
    setErrorMsg(""); setVideoFile(file); setVideoUrl("");
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
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
    if (!videoTitle.trim()) { 
      setErrorMsg("Please enter a video title"); 
      return; 
    }
    
    if (!videoFile && !videoUrl.trim()) { 
      setErrorMsg("Please provide a video file or URL"); 
      return; 
    }
    
    if (!instructorName.trim()) { 
      setErrorMsg("Please enter the instructor name"); 
      return; 
    }

    setStatus("uploading"); setErrorMsg("");
    const formData = new FormData();

    // Top
    formData.append("platformName", platformName);
    formData.append("featuredTag", featuredTag);
    formData.append("hostedBy", hostedBy);

    // Video
    formData.append("videoTitle", videoTitle);
    if (videoFile) formData.append("video", videoFile);
    else formData.append("videoUrl", videoUrl);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("showInstructorLive", showInstructorLive);
    formData.append("learnersCount", learnersCount);
    formData.append("publishDate", publishDate);

    // Instructor
    formData.append("instructorName", instructorName);
    formData.append("instructorRole", instructorRole);
    formData.append("experience", experience);
    formData.append("studentCount", studentCount);

    // Description
    formData.append("description", description);
    formData.append("showMoreEnabled", showMoreEnabled);

    // Learn Points
    formData.append("learnPoints", JSON.stringify(learnPoints.filter(p => p.title.trim())));

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(r => setTimeout(r, 120));
        setUploadProgress(i);
      }
      // Replace with: await videoService.uploadVideo(formData, setUploadProgress);
      if (onSubmit) onSubmit(formData);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  };

  const reset = () => {
    setVideoTitle(""); setVideoUrl(""); setVideoFile(null);
    setThumbnail(null); setThumbnailPreview(null);
    setHostedBy(""); setInstructorName(""); setInstructorRole("");
    setExperience(""); setStudentCount(""); setDescription("");
    setLearnPoints([{ id: 1, title: "", desc: "" }]);
    setUploadProgress(0); setStatus("idle"); setErrorMsg("");
  };

  // ── Success Screen
  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F6EDE6] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Course is Live! 🎉</h3>
          <p className="text-gray-500 mb-8">"{videoTitle}"  has been successfully published.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="px-6 py-3 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-orange-600 transition">
            Create New Course
            </button>
            {onClose && (
              <button onClick={onClose} className="px-6 py-3 bg-[#1E293B] text-white rounded-xl font-semibold hover:bg-gray-800 transition">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6EDE6] py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Course Upload</h1>
              <p className="text-sm text-gray-500">Admin Panel • Course Management</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Error */}
          {errorMsg && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />{errorMsg}
            </div>
          )}

          {/* ── Section 1: Top Section ── */}
          <Section icon={Tag} number="1" title="Top Section">
            <Field label="Platform Name" hint="optional">
              <input value={platformName} onChange={e => setPlatformName(e.target.value)}
                placeholder="TexoraAI.skills" className={inputCls} />
            </Field>
            <Field label="Featured Tag" hint="optional">
              <input value={featuredTag} onChange={e => setFeaturedTag(e.target.value)}
                placeholder="Featured Course" className={inputCls} />
            </Field>
            <Field label="Hosted By (Instructor Name)">
              <input value={hostedBy} onChange={e => setHostedBy(e.target.value)}
                placeholder="e.g. Arjay McCandless" className={inputCls} />
            </Field>
          </Section>

          {/* ── Section 2: Video Card ── */}
          <Section icon={Film} number="2" title="Main Video Card">
            <Field label="Video Title" required>
              <input value={videoTitle} onChange={e => setVideoTitle(e.target.value)}
                placeholder="e.g. System Design for Velocity Coders" className={inputCls} />
            </Field>

            {/* Video Upload OR URL */}
            <Field label="Video File" required hint="Upload a file or provide a URL — choose one">
              <div className="space-y-3">
                {/* File Upload */}
                {!videoFile ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleVideoSelect(e.dataTransfer.files[0]); }}
                    onClick={() => videoInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${dragOver ? "border-[#F97316] bg-orange-50" : "border-gray-300 hover:border-[#F97316] hover:bg-orange-50/30"}`}
                  >
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${dragOver ? "text-[#F97316]" : "text-gray-400"}`} />
                    <p className="font-semibold text-[#1E293B] text-sm">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">MP4, WebM, MOV • Max 500MB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 bg-orange-50 border-2 border-[#F97316]/40 rounded-2xl">
                    <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Film className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1E293B] truncate text-sm">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">{formatSize(videoFile.size)}</p>
                    </div>
                    <button type="button" onClick={() => setVideoFile(null)} className="text-gray-400 hover:text-red-500 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleVideoSelect(e.target.files[0])} />

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-semibold">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <input value={videoUrl} onChange={e => { setVideoUrl(e.target.value); if (e.target.value) setVideoFile(null); }}
                  placeholder="Paste video URL(https://...)" className={inputCls}
                  disabled={!!videoFile} />
              </div>
            </Field>

            {/* Thumbnail */}
            <Field label="Thumbnail Image" hint="optional">
              <div className="flex items-center gap-4">
                {thumbnailPreview ? (
                  <div className="relative w-36 h-20 rounded-xl overflow-hidden border-2 border-[#F97316]/40 flex-shrink-0">
                    <img src={thumbnailPreview} alt="thumb" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => thumbInputRef.current?.click()}
                    className="w-36 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#F97316] hover:bg-orange-50/30 transition flex-shrink-0">
                    <Image className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Add Image</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">JPG, PNG or WebP<br />Recommended: 16:9 ratio</p>
              </div>
              <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
            </Field>

            {/* Instructor Live Badge Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-[#1E293B] text-sm">Instructor Live Badge</p>
                <p className="text-xs text-gray-400">Show a badge at the top-right corner of the video player</p>
              </div>
              <button type="button" onClick={() => setShowInstructorLive(!showInstructorLive)}
                className={`w-12 h-6 rounded-full transition-all relative ${showInstructorLive ? "bg-[#F97316]" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showInstructorLive ? "left-[26px]" : "left-0.5"}`} />
              </button>
            </div>

            {/* Learners + Date */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Learners Count" hint="e.g. 200">
                <input type="number" value={learnersCount} onChange={e => setLearnersCount(e.target.value)}
                  placeholder="200" className={inputCls} />
              </Field>
              <Field label="Publish Date">
                <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)}
                  className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Section 3: Instructor Card ── */}
          <Section icon={User} number="3" title="Instructor Card">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Instructor Name" required>
                <input value={instructorName} onChange={e => setInstructorName(e.target.value)}
                  placeholder="e.g. Arjay McCandless" className={inputCls} />
              </Field>
              <Field label="Instructor Role">
                <input value={instructorRole} onChange={e => setInstructorRole(e.target.value)}
                  placeholder="e.g. Software Engineer & Instructor" className={inputCls} />
              </Field>
              <Field label="Experience" hint="e.g. 10+ years">
                <input value={experience} onChange={e => setExperience(e.target.value)}
                  placeholder="10+ years experience" className={inputCls} />
              </Field>
              <Field label="Student Count" hint="e.g. 200+">
                <input value={studentCount} onChange={e => setStudentCount(e.target.value)}
                  placeholder="200+ students" className={inputCls} />
              </Field>
            </div>
          </Section>

          {/* ── Section 4: Description ── */}
          <Section icon={BookOpen} number="4" title="Description Section">
            <Field label="Full Description">
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Write about the course..."
                rows={5} className={`${inputCls} resize-none`} />
            </Field>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-[#1E293B] text-sm">"Show More" Toggle</p>
                <p className="text-xs text-gray-400">Show a "Show more" button below the description</p>
              </div>
              <button type="button" onClick={() => setShowMoreEnabled(!showMoreEnabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${showMoreEnabled ? "bg-[#F97316]" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${showMoreEnabled ? "left-[26px]" : "left-0.5"}`} />
              </button>
            </div>
          </Section>

          {/* ── Section 5: What You'll Learn ── */}
          <Section icon={BookOpen} number="5" title="What You'll Learn">
            <div className="space-y-3">
              {learnPoints.map((point, idx) => (
                <div key={point.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      value={point.title}
                      onChange={e => updateLearnPoint(point.id, "title", e.target.value)}
                      placeholder={`Point ${idx + 1} Title...`}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-sm font-semibold text-[#1E293B] placeholder-gray-400"
                    />
                    <input
                      value={point.desc}
                      onChange={e => updateLearnPoint(point.id, "desc", e.target.value)}
                      placeholder="Short description (optional)..."
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#F97316] focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                    />
                  </div>
                  {learnPoints.length > 1 && (
                    <button type="button" onClick={() => removeLearnPoint(point.id)}
                      className="text-gray-300 hover:text-red-500 transition mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addLearnPoint}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition flex items-center justify-center gap-2 font-semibold text-sm">
              <Plus className="w-4 h-4" /> Add Another Point
            </button>
          </Section>

          {/* ── Progress Bar ── */}
          {status === "uploading" && (
            <div className="bg-white rounded-2xl p-6 border-2 border-[#F97316]/20">
              <div className="flex justify-between text-sm font-semibold text-[#1E293B] mb-3">
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-[#F97316]" /> Uploading...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#F97316] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {/* ── Submit Buttons ── */}
          <div className="flex gap-3 pb-8">
            <button type="submit" disabled={status === "uploading"}
              className="flex-1 py-4 bg-[#F97316] hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-orange-200 flex items-center justify-center gap-2">
              {status === "uploading"
                ? <><Loader className="w-5 h-5 animate-spin" /> Uploading...</>
                : <><Upload className="w-5 h-5" />  Publish Course</>
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
      </div>
    </div>
  );
}