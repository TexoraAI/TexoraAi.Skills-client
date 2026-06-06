import React, { useState, useEffect, useRef } from "react";
import { X, Star, Upload, User } from "lucide-react";

const EMPTY_FORM = {
  candidateName: "",
  designation: "",
  company: "",
  rating: 5,
  feedbackMessage: "",
  profileImage: "",
  status: "active",
  isFeatured: false,
};

const MentorDrawer = ({ isOpen, onClose, onSubmit, editData, mode, dark }) => {
  const DEFAULT_WIDTH = 440;
  const MIN_WIDTH = 360;
  const MAX_WIDTH = 700;

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef({ dragging: false, startX: 0, startW: DEFAULT_WIDTH });

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const fileRef = useRef();

  useEffect(() => {
    if (isOpen) {
      if (editData && (mode === "edit" || mode === "view")) {
        setForm({ ...EMPTY_FORM, ...editData });
        setImagePreview(editData.profileImage || "");
      } else {
        setForm(EMPTY_FORM);
        setImagePreview("");
      }
      setErrors({});
      setHoveredStar(0);
    }
  }, [isOpen, editData, mode]);

  // Drag-to-resize
  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const delta = dragRef.current.startX - e.clientX;
      const newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragRef.current.startW + delta));
      setWidth(newW);
    };
    const onUp = () => {
      if (dragRef.current.dragging) {
        dragRef.current.dragging = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const onDragStart = (e) => {
    e.preventDefault();
    dragRef.current = { dragging: true, startX: e.clientX, startW: width };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const validate = () => {
    const errs = {};
    if (!form.candidateName.trim()) errs.candidateName = "Candidate name is required";
    if (!form.designation.trim())   errs.designation   = "Designation is required";
    if (!form.company.trim())       errs.company       = "Company is required";
    if (!form.feedbackMessage.trim()) errs.feedbackMessage = "Feedback message is required";
    if (form.feedbackMessage.trim().length < 20)
      errs.feedbackMessage = "Feedback must be at least 20 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, profileImage: "Please upload a valid image file" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profileImage: "Image size must be under 2MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, profileImage: base64 }));
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({ ...form });
  };

  const isView = mode === "view";
  const title =
    mode === "add"  ? "Add Mentor Feedback"  :
    mode === "edit" ? "Edit Mentor Feedback"  :
                     "View Mentor Feedback";

  // Dark mode helpers
  const drawerBg      = dark ? "bg-[#0f0f1a]"             : "bg-white";
  const borderCls     = dark ? "border-white/[0.06]"       : "border-gray-200";
  const labelCls      = dark ? "text-slate-300"            : "text-gray-700";
  const footerBg      = dark ? "bg-[#0f0f1a]"             : "bg-gray-50";
  const inputBase     = dark
    ? "bg-white/[0.04] border-white/10 text-white placeholder-slate-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
    : "bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100";
  const inputView     = dark ? "bg-white/[0.02] text-slate-400 cursor-not-allowed" : "bg-gray-50 text-gray-600 cursor-not-allowed";
  const inputErr      = dark ? "border-red-500/50 bg-red-500/5" : "border-red-400 bg-red-50";
  const errText       = dark ? "text-red-400" : "text-red-500";
  const charCount     = dark ? "text-slate-600" : "text-gray-400";
  const starEmpty     = dark ? "text-white/10"  : "text-gray-300";
  const featuredBox   = dark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-100";
  const featuredTitle = dark ? "text-amber-300" : "text-amber-800";
  const featuredSub   = dark ? "text-amber-500" : "text-amber-600";
  const cancelBtn     = dark
    ? "border border-white/10 text-slate-300 hover:bg-white/5"
    : "border border-gray-200 text-gray-600 hover:bg-gray-100";

  // ── KEY: not fixed/absolute — this is a flex child that slides in/out ──
  // When closed: width=0, overflow hidden. When open: actual width.
  return (
    <div
      style={{ width: isOpen ? `${width}px` : 0 }}
      className={`
        relative flex-shrink-0 flex flex-col h-screen sticky top-0
        overflow-hidden
        transition-[width] duration-300 ease-in-out
        border-l ${borderCls} ${drawerBg}
      `}
    >
      {/* Inner wrapper keeps content at full width so it doesn't squish during animation */}
      <div style={{ width: `${width}px` }} className="flex flex-col h-full">

        {/* Drag handle */}
        <div
          onMouseDown={onDragStart}
          title="Drag to resize"
          className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize z-10 group transition-colors ${
            dark ? "hover:bg-violet-500/30" : "hover:bg-purple-400/25"
          }`}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1.5 flex flex-col items-center gap-[3px] opacity-0 group-hover:opacity-70 transition-opacity">
            {[...Array(6)].map((_, i) => (
              <span key={i} className={`w-[3px] h-[3px] rounded-full ${dark ? "bg-violet-400" : "bg-purple-500"}`} />
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <p className="text-purple-200 text-xs mt-0.5">Landing page testimonial card</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/25 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Profile Image */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${labelCls}`}>Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center flex-shrink-0 border-2 border-purple-100">
                {imagePreview
                  ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  : <User size={24} className="text-white" />
                }
              </div>
              {!isView && (
                <div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed rounded-xl text-sm font-medium transition-colors ${
                      dark
                        ? "border-violet-500/40 text-violet-400 hover:border-violet-400 hover:bg-violet-500/5"
                        : "border-purple-300 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    <Upload size={15} /> Upload Photo
                  </button>
                  <p className={`text-xs mt-1 ${charCount}`}>JPG, PNG up to 2MB</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              )}
            </div>
            {errors.profileImage && <p className={`text-xs mt-1 ${errText}`}>{errors.profileImage}</p>}
          </div>

          {/* Candidate Name */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelCls}`}>
              Candidate Name <span className="text-red-500">*</span>
            </label>
            <input
              name="candidateName" value={form.candidateName} onChange={handleChange}
              disabled={isView} placeholder="e.g. Priya Sharma"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.candidateName ? inputErr : inputBase} ${isView ? inputView : ""}`}
            />
            {errors.candidateName && <p className={`text-xs mt-1 ${errText}`}>{errors.candidateName}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelCls}`}>
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              name="designation" value={form.designation} onChange={handleChange}
              disabled={isView} placeholder="e.g. Product Manager"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.designation ? inputErr : inputBase} ${isView ? inputView : ""}`}
            />
            {errors.designation && <p className={`text-xs mt-1 ${errText}`}>{errors.designation}</p>}
          </div>

          {/* Company */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelCls}`}>
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              name="company" value={form.company} onChange={handleChange}
              disabled={isView} placeholder="e.g. Flipkart"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${errors.company ? inputErr : inputBase} ${isView ? inputView : ""}`}
            />
            {errors.company && <p className={`text-xs mt-1 ${errText}`}>{errors.company}</p>}
          </div>

          {/* Rating */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${labelCls}`}>
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star} type="button" disabled={isView}
                  onClick={() => !isView && setForm((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => !isView && setHoveredStar(star)}
                  onMouseLeave={() => !isView && setHoveredStar(0)}
                  className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                >
                  <Star size={28} className={`transition-colors ${star <= (hoveredStar || form.rating) ? "text-yellow-400 fill-yellow-400" : starEmpty}`} />
                </button>
              ))}
              <span className={`ml-2 text-sm font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>{form.rating} / 5</span>
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelCls}`}>
              Feedback Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="feedbackMessage" value={form.feedbackMessage} onChange={handleChange}
              disabled={isView} rows={4}
              placeholder="Write the testimonial/feedback that will appear on the landing page..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${errors.feedbackMessage ? inputErr : inputBase} ${isView ? inputView : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.feedbackMessage ? <p className={`text-xs ${errText}`}>{errors.feedbackMessage}</p> : <span />}
              <p className={`text-xs ${charCount}`}>{form.feedbackMessage.length} chars</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${labelCls}`}>Status</label>
            <select
              name="status" value={form.status} onChange={handleChange} disabled={isView}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputBase} ${isView ? inputView : ""}`}
            >
              <option value="active">Active — Visible on Landing Page</option>
              <option value="inactive">Inactive — Hidden from Landing Page</option>
            </select>
          </div>

          {/* Featured */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${featuredBox}`}>
            <div>
              <p className={`text-sm font-semibold ${featuredTitle}`}>Featured Feedback</p>
              <p className={`text-xs mt-0.5 ${featuredSub}`}>Highlight this card on the landing page</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} disabled={isView} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 peer-disabled:opacity-60 peer-disabled:cursor-not-allowed" />
            </label>
          </div>

          {/* Preview */}
          {(form.candidateName || form.feedbackMessage) && (
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-gray-400"}`}>
                Preview — Landing Page Card
              </label>
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={12} className={s <= form.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                  ))}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed italic mb-3">
                  "{form.feedbackMessage || "Your feedback message will appear here..."}"
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    {imagePreview
                      ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      : <span className="text-white text-xs font-bold">{form.candidateName?.charAt(0) || "M"}</span>
                    }
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">{form.candidateName || "Candidate Name"}</p>
                    <p className="text-gray-400 text-[10px]">{form.designation || "Designation"}{form.company ? ` @ ${form.company}` : ""}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isView && (
          <div className={`px-6 py-4 border-t flex gap-3 flex-shrink-0 border-${borderCls} ${footerBg}`}>
            <button onClick={onClose} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${cancelBtn}`}>Cancel</button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200/30"
            >
              {mode === "edit" ? "Update Feedback" : "Add Feedback"}
            </button>
          </div>
        )}
        {isView && (
          <div className={`px-6 py-4 border-t flex-shrink-0 ${footerBg}`}>
            <button onClick={onClose} className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${cancelBtn}`}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDrawer;