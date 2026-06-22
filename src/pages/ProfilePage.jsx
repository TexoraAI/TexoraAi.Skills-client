// export default ProfilePage;
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  IdCard,
  Lock,
  LogOut,
  Layers,
  Shield,
  CreditCard,
  Award,
  CheckCircle,
  Edit3,
  Save,
  X,
  Zap,
  Building2,
  GraduationCap,
  GitBranch,
  BadgeCheck,
  Upload,
  Camera,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  BookOpen,
  Globe,
  TrendingUp,
  Users,
} from "lucide-react";

import { useAvatarContext } from "../context/AvatarContext";
import authService from "../services/authService";
import userService from "@/services/userService";
import { getOrgSummary } from "../services/batchService";
/* ── Mark the profile as complete — both locally and on the backend ──
   Call this right after ANY of the 4 Details/Org tabs saves successfully.
   It doesn't matter which service stored the actual fields — this always
   hits the Auth Service, which is the single source of truth the dashboard
   gate reads at login. Requires authService.markProfileCompleted() — see
   note below if you haven't added it yet. */
const syncProfileCompleted = (value) => {
  try {
    const cached = JSON.parse(localStorage.getItem("lms_user") || "{}");
    localStorage.setItem(
      "lms_user",
      JSON.stringify({ ...cached, profileCompleted: !!value }),
    );
  } catch {
    localStorage.setItem(
      "lms_user",
      JSON.stringify({ profileCompleted: !!value }),
    );
  }
  if (value) {
    authService
      .markProfileCompleted()
      .catch((err) =>
        console.error("Failed to sync profileCompleted with backend:", err),
      );
  }
};
/* ══════════════════════════════════════════════════════════════
   AVATAR COMPONENT  — UNCHANGED
══════════════════════════════════════════════════════════════ */
export const Avatar = ({
  initials = "U",
  size = 40,
  editable = false,
  online = false,
  shape = "circle",
  className = "",
}) => {
  const ctx = useAvatarContext();
  const profileImage = ctx?.profileImage ?? null;
  const uploadImage = ctx?.uploadImage ?? (() => {});
  const removeImage = ctx?.removeImage ?? (() => {});
  const fileRef = useRef(null);
  const radius = shape === "circle" ? "9999px" : "14px";
  const dotSize = Math.max(10, Math.round(size * 0.22));
  const dotOffset = Math.round(size * 0.04);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png"))
      uploadImage(file);
    e.target.value = "";
  };

  return (
    <div
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        onClick={editable ? () => fileRef.current?.click() : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          overflow: "hidden",
          border: "2.5px solid rgba(255,255,255,0.40)",
          boxShadow: "0 0 0 2px rgba(123,47,247,0.30)",
          background: profileImage
            ? "transparent"
            : "linear-gradient(135deg,#7B2FF7,#C030A0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: editable ? "pointer" : "default",
          transition: "transform 0.2s, box-shadow 0.2s",
          position: "relative",
        }}
        className={editable ? "group hover:scale-105" : ""}
        title={editable ? "Click to change photo" : undefined}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: Math.max(11, Math.round(size * 0.38)),
              letterSpacing: "-0.5px",
              userSelect: "none",
            }}
          >
            {initials}
          </span>
        )}
        {editable && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ borderRadius: radius }}
          >
            <Camera
              style={{
                width: Math.round(size * 0.32),
                height: Math.round(size * 0.32),
                color: "#fff",
              }}
            />
          </div>
        )}
      </div>

      {online && (
        <span
          style={{
            position: "absolute",
            bottom: dotOffset,
            right: dotOffset,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: "#22c55e",
            border: "2px solid white",
            boxShadow: "0 0 0 1px rgba(34,197,94,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="animate-ping"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "#22c55e",
              opacity: 0.6,
            }}
          />
        </span>
      )}

      {editable && profileImage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeImage();
          }}
          title="Remove photo"
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#ef4444",
            border: "2px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            padding: 0,
          }}
          className="hover:bg-red-600 transition-colors"
        >
          <X style={{ width: 10, height: 10, color: "#fff", strokeWidth: 3 }} />
        </button>
      )}

      {editable && (
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   ROLE CONFIG  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const ROLE_CONFIG = {
  student: {
    label: "Student",
    id: "STU-0012",
    name: "Student User",
    email: "student@example.com",
    joined: "—",
    lastLogin: "—",
    avatar: "S",
    heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
    accent: "violet",
    plan: "Student Pro",
    planPrice: "₹499/mo",
  },
  trainer: {
    label: "Trainer",
    id: "TRN-0005",
    name: "Trainer User",
    email: "trainer@example.com",
    joined: "—",
    lastLogin: "—",
    avatar: "T",
    heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
    accent: "emerald",
    plan: "Trainer Elite",
    planPrice: "₹1,299/mo",
  },
  admin: {
    label: "Admin",
    id: "ADM-0001",
    name: "Admin User",
    email: "admin@example.com",
    joined: "—",
    lastLogin: "—",
    avatar: "A",
    heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
    accent: "rose",
    plan: "Enterprise",
    planPrice: "₹4,999/mo",
  },
  business: {
    label: "Business",
    id: "BUS-0003",
    name: "Business User",
    email: "business@example.com",
    joined: "—",
    lastLogin: "—",
    avatar: "B",
    heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
    accent: "amber",
    plan: "Business Pro",
    planPrice: "₹8,999/mo",
  },
};

/* ══════════════════════════════════════════════════════════════
   ACCENT MAP  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const ACCENT = {
  violet: {
    btn: "bg-violet-600 hover:bg-violet-700",
    text: "text-violet-600 dark:text-violet-400",
    badge:
      "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30",
    bar: "bg-violet-500",
    ring: "focus:ring-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/20",
  },
  emerald: {
    btn: "bg-emerald-600 hover:bg-emerald-700",
    text: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    bar: "bg-emerald-500",
    ring: "focus:ring-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
  },
  rose: {
    btn: "bg-rose-600 hover:bg-rose-700",
    text: "text-rose-600 dark:text-rose-400",
    badge:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
    bar: "bg-rose-500",
    ring: "focus:ring-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-500/20",
  },
  amber: {
    btn: "bg-amber-500 hover:bg-amber-600",
    text: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    bar: "bg-amber-500",
    ring: "focus:ring-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
  },
};

/* ══════════════════════════════════════════════════════════════
   TAB BUTTON  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const TabButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-gray-900 dark:bg-white/10 text-white border border-gray-700 dark:border-white/20 shadow"
        : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

/* ══════════════════════════════════════════════════════════════
   TOAST COMPONENT  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400";

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl text-sm font-medium animate-fade-in ${colors}`}
      style={{ animation: "slideIn 0.3s ease" }}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <X className="w-4 h-4 shrink-0" />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PROFILE INFO TAB  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const ProfileInfoTab = ({ user, accent, onProfileUpdate, returnTo }) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [toast, setToast] = useState(null);
  const { uploadImage, removeImage, profileImage } = useAvatarContext();
  const fileInputRef = useRef(null);
  const ac = ACCENT[accent];

  useEffect(() => {
    if (!editing) setName(user.name);
  }, [user.name, editing]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    setSaving(true);
    try {
      await userService.updateMyProfile({ displayName: name.trim() });

      if (onProfileUpdate) onProfileUpdate({ name: name.trim() });

      setEditing(false);
      showToast("Profile updated successfully");

      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 900);
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Personal Information
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Manage your profile details
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Photo Upload Panel */}
      <div className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <Avatar
          initials={user.avatar}
          size={72}
          editable
          online
          shape="rounded"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
            Profile Photo
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-400 mb-3">
            JPG or PNG · Saved locally · Updates Navbar & Sidebar instantly
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white ${ac.btn} transition-colors`}
            >
              <Upload className="w-3 h-3" /> Upload Photo
            </button>
            {profileImage && (
              <button
                onClick={removeImage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <X className="w-3 h-3" /> Remove Photo
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f && (f.type === "image/jpeg" || f.type === "image/png"))
                uploadImage(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
            />
          ) : (
            <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85">
              {name || "—"}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
            <IdCard className="w-3.5 h-3.5" /> Role
          </label>
          <div className="relative">
            <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none">
              {user.label}
            </p>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
              Locked
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
            Role cannot be changed from this page
          </p>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" /> Email Address
          </label>
          <div className="relative">
            <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none">
              {user.email}
            </p>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
              Locked
            </span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
            Email cannot be changed from this page
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COUNTRY CODES
══════════════════════════════════════════════════════════════ */
const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 +91  India" },
  { code: "+1", label: "🇺🇸 +1   USA / Canada" },
  { code: "+44", label: "🇬🇧 +44  UK" },
  { code: "+61", label: "🇦🇺 +61  Australia" },
  { code: "+971", label: "🇦🇪 +971 UAE" },
  { code: "+65", label: "🇸🇬 +65  Singapore" },
  { code: "+60", label: "🇲🇾 +60  Malaysia" },
  { code: "+49", label: "🇩🇪 +49  Germany" },
  { code: "+33", label: "🇫🇷 +33  France" },
  { code: "+81", label: "🇯🇵 +81  Japan" },
  { code: "+86", label: "🇨🇳 +86  China" },
  { code: "+7", label: "🇷🇺 +7   Russia" },
  { code: "+55", label: "🇧🇷 +55  Brazil" },
  { code: "+27", label: "🇿🇦 +27  South Africa" },
  { code: "+92", label: "🇵🇰 +92  Pakistan" },
  { code: "+880", label: "🇧🇩 +880 Bangladesh" },
  { code: "+94", label: "🇱🇰 +94  Sri Lanka" },
  { code: "+977", label: "🇳🇵 +977 Nepal" },
];

/* ══════════════════════════════════════════════════════════════
   DETAILS TAB HELPERS — defined at MODULE level (NOT inside DetailsTab)
══════════════════════════════════════════════════════════════ */
const LABEL_CLS =
  "flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1.5";

const STATIC_CLS =
  "px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85 min-h-[42px]";

const DetailField = ({ icon: Icon, label, children }) => (
  <div className="space-y-1.5">
    <label className={LABEL_CLS}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

const StaticVal = ({ val }) => <p className={STATIC_CLS}>{val || "—"}</p>;

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <X className="w-3 h-3" /> {msg}
    </p>
  ) : null;

const PLATFORMS_LIST = [
  "Blog",
  "YouTube",
  "Podcast",
  "LinkedIn",
  "Instagram",
  "Twitter/X",
  "Newsletter",
  "TikTok",
  "Other",
];

const ADMIN_TYPES = [
  "Super Admin",
  "Content Admin",
  "Support Admin",
  "Finance Admin",
];
const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Operations",
  "HR",
  "Finance",
  "Content",
  "Support",
];

const INDUSTRIES = [
  "EdTech",
  "FinTech",
  "HealthTech",
  "E-Commerce",
  "Consulting",
  "Manufacturing",
  "Retail",
  "Logistics",
  "Real Estate",
  "Media",
  "Government",
  "NGO",
  "Other",
];

/* ── STUDENT DETAILS TAB ── */
const StudentDetailsTab = ({ accent, returnTo }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const empty = {
    dialCode: "+91",
    localNumber: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    state: "",
    country: "",
    qualification: "",
    collegeName: "",
    yearOfPassing: "",
    domain: "",
    experience: "",
  };
  const [form, setForm] = useState(empty);
  const [draft, setDraft] = useState(empty);

  const parseMobile = useCallback((raw = "") => {
    if (!raw) return { dialCode: "+91", localNumber: "" };
    const match = COUNTRY_CODES.find((c) => raw.startsWith(c.code));
    return match
      ? {
          dialCode: match.code,
          localNumber: raw.slice(match.code.length).trim(),
        }
      : { dialCode: "+91", localNumber: raw };
  }, []);

  useEffect(() => {
    userService
      .getStudentProfile()
      .then((res) => {
        const d = res.data || {};
        const { dialCode, localNumber } = parseMobile(d.mobileNumber);
        const loaded = {
          dialCode,
          localNumber,
          dateOfBirth: d.dateOfBirth || "",
          gender: d.gender || "",
          city: d.city || "",
          state: d.state || "",
          country: d.country || "",
          qualification: d.qualification || "",
          collegeName: d.collegeName || "",
          yearOfPassing: d.yearOfPassing || "",
          domain: d.domain || "",
          experience: d.experience || "",
        };
        setForm(loaded);
        setDraft(loaded);
      })
      .catch(() => {});
  }, [parseMobile]);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const startEdit = () => {
    setDraft({ ...form });
    setErrors({});
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft({ ...form });
    setErrors({});
    setEditing(false);
  };
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  }, []);

  const validate = (d) => {
    const errs = {};
    if (d.localNumber && !/^\d{6,15}$/.test(d.localNumber.trim()))
      errs.localNumber = "Enter 6–15 digits only";
    if (d.yearOfPassing) {
      const y = Number(d.yearOfPassing),
        cur = new Date().getFullYear();
      if (!/^\d{4}$/.test(d.yearOfPassing) || y < 1980 || y > cur + 5)
        errs.yearOfPassing = `Valid year between 1980–${cur + 5}`;
    }
    if (d.dateOfBirth) {
      const dob = new Date(d.dateOfBirth);
      if (dob >= new Date()) errs.dateOfBirth = "Must be in the past";
      else if (new Date().getFullYear() - dob.getFullYear() < 10)
        errs.dateOfBirth = "Age must be at least 10";
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast("Fix errors first", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        mobileNumber: draft.localNumber.trim()
          ? `${draft.dialCode}${draft.localNumber.trim()}`
          : "",
        dateOfBirth: draft.dateOfBirth,
        gender: draft.gender,
        city: draft.city,
        state: draft.state,
        country: draft.country,
        qualification: draft.qualification,
        collegeName: draft.collegeName,
        yearOfPassing: draft.yearOfPassing,
        domain: draft.domain,
        experience: draft.experience,
      };
      await userService.updateStudentProfile(payload);
      setForm({ ...draft });
      setEditing(false);
      showToast("Details saved successfully");
      syncProfileCompleted(true);
      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 900);
      }
    } catch {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (f) =>
    `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${
      errors[f]
        ? "border-red-400 focus:ring-red-400"
        : `border-gray-300 dark:border-white/20 focus:ring-2 ${ac.ring}`
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none`;

  const displayMobile = form.localNumber
    ? `${form.dialCode} ${form.localNumber}`
    : "";

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Profile Details
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Personal, location and education details
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Details
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <User className="w-3.5 h-3.5" /> Personal Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <DetailField icon={Phone} label="Mobile Number">
            {editing ? (
              <div className="space-y-1">
                <div className="flex gap-2">
                  <select
                    name="dialCode"
                    value={draft.dialCode}
                    onChange={handleChange}
                    className={`shrink-0 w-36 px-2 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${ac.ring}`}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="localNumber"
                    placeholder="9876543210"
                    value={draft.localNumber}
                    onChange={handleChange}
                    maxLength={15}
                    className={inputCls("localNumber")}
                  />
                </div>
                <ErrorMsg msg={errors.localNumber} />
              </div>
            ) : (
              <StaticVal val={displayMobile} />
            )}
          </DetailField>
          <DetailField icon={Calendar} label="Date of Birth">
            {editing ? (
              <div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={draft.dateOfBirth}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={inputCls("dateOfBirth")}
                />
                <ErrorMsg msg={errors.dateOfBirth} />
              </div>
            ) : (
              <StaticVal val={form.dateOfBirth} />
            )}
          </DetailField>
          <DetailField icon={Users} label="Gender">
            {editing ? (
              <select
                name="gender"
                value={draft.gender}
                onChange={handleChange}
                className={inputCls("gender")}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            ) : (
              <StaticVal val={form.gender} />
            )}
          </DetailField>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Location
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            ["city", "City", "e.g. Hyderabad"],
            ["state", "State", "e.g. Telangana"],
            ["country", "Country", "e.g. India"],
          ].map(([name, label, ph]) => (
            <DetailField key={name} icon={MapPin} label={label}>
              {editing ? (
                <input
                  type="text"
                  name={name}
                  placeholder={ph}
                  value={draft[name]}
                  onChange={handleChange}
                  className={inputCls(name)}
                />
              ) : (
                <StaticVal val={form[name]} />
              )}
            </DetailField>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5" /> Education & Professional
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField icon={BookOpen} label="Qualification">
            {editing ? (
              <input
                type="text"
                name="qualification"
                placeholder="e.g. B.Tech"
                value={draft.qualification}
                onChange={handleChange}
                className={inputCls("qualification")}
              />
            ) : (
              <StaticVal val={form.qualification} />
            )}
          </DetailField>
          <DetailField icon={Building2} label="College / Institute">
            {editing ? (
              <input
                type="text"
                name="collegeName"
                placeholder="e.g. JNTU"
                value={draft.collegeName}
                onChange={handleChange}
                className={inputCls("collegeName")}
              />
            ) : (
              <StaticVal val={form.collegeName} />
            )}
          </DetailField>
          <DetailField icon={Calendar} label="Year of Passing">
            {editing ? (
              <div>
                <input
                  type="text"
                  name="yearOfPassing"
                  placeholder={`${new Date().getFullYear()}`}
                  value={draft.yearOfPassing}
                  onChange={handleChange}
                  maxLength={4}
                  className={inputCls("yearOfPassing")}
                />
                <ErrorMsg msg={errors.yearOfPassing} />
              </div>
            ) : (
              <StaticVal val={form.yearOfPassing} />
            )}
          </DetailField>
          <DetailField icon={Briefcase} label="Domain / Area of Interest">
            {editing ? (
              <input
                type="text"
                name="domain"
                placeholder="e.g. Full Stack"
                value={draft.domain}
                onChange={handleChange}
                className={inputCls("domain")}
              />
            ) : (
              <StaticVal val={form.domain} />
            )}
          </DetailField>
          <div className="sm:col-span-2">
            <DetailField icon={TrendingUp} label="Experience">
              {editing ? (
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g. Fresher, 2 years"
                  value={draft.experience}
                  onChange={handleChange}
                  className={inputCls("experience")}
                />
              ) : (
                <StaticVal val={form.experience} />
              )}
            </DetailField>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── TRAINER DETAILS TAB ── */
const TrainerDetailsTab = ({ accent, returnTo }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const empty = {
    linkedinUrl: "",
    country: "",
    audienceSize: "",
    fullTimeRole: "",
    courseTopic: "",
    platforms: [],
  };
  const [form, setForm] = useState(empty);
  const [draft, setDraft] = useState(empty);

  // useEffect(() => {
  //   userService
  //     .getTrainerProfile()
  //     .then((res) => {
  //       const d = res.data || {};
  //       const loaded = {
  //         linkedinUrl: d.linkedinUrl || "",
  //         country: d.country || "",
  //         audienceSize: d.audienceSize || "",
  //         fullTimeRole: d.fullTimeRole || "",
  //         courseTopic: d.courseTopic || "",
  //         platforms: d.platforms || [],
  //       };
  //       setForm(loaded);
  //       setDraft(loaded);
  //     })
  //     .catch(() => {});
  // }, []);
  useEffect(() => {
    userService
      .getTrainerProfile()
      .then((res) => {
        const d = res.data || {};
        const loaded = {
          linkedinUrl: d.linkedinUrl || "",
          country: d.country || "",
          audienceSize: d.audienceSize || "",
          fullTimeRole: d.fullTimeRole || "",
          courseTopic: d.courseTopic || "",
          platforms: Array.isArray(d.platforms)
            ? d.platforms
            : d.platforms
              ? d.platforms
                  .split(",")
                  .map((p) => p.trim())
                  .filter(Boolean)
              : [],
        };
        setForm(loaded);
        setDraft(loaded);
      })
      .catch(() => {});
  }, []);
  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const startEdit = () => {
    setDraft({ ...form, platforms: [...(form.platforms || [])] });
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft({ ...form, platforms: [...(form.platforms || [])] });
    setEditing(false);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  }, []);

  const togglePlatform = useCallback((platform) => {
    setDraft((p) => ({
      ...p,
      platforms: p.platforms.includes(platform)
        ? p.platforms.filter((x) => x !== platform)
        : [...p.platforms, platform],
    }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateTrainerProfile(draft);
      setForm({ ...draft });
      setEditing(false);
      showToast("Trainer profile saved");
      syncProfileCompleted(true);
      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 900);
      }
    } catch {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Trainer Profile
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your training background and platform details
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Profile
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> Basic Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField icon={Globe} label="LinkedIn URL">
            {editing ? (
              <input
                type="url"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/..."
                value={draft.linkedinUrl}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.linkedinUrl} />
            )}
          </DetailField>
          <DetailField icon={MapPin} label="Country">
            {editing ? (
              <input
                type="text"
                name="country"
                placeholder="e.g. India"
                value={draft.country}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.country} />
            )}
          </DetailField>
          <DetailField icon={BookOpen} label="Course Topic">
            {editing ? (
              <input
                type="text"
                name="courseTopic"
                placeholder="e.g. React, Python, AWS"
                value={draft.courseTopic}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.courseTopic} />
            )}
          </DetailField>
          <DetailField icon={Users} label="Audience Size">
            {editing ? (
              <select
                name="audienceSize"
                value={draft.audienceSize}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select range</option>
                <option>0–1K</option>
                <option>1K–10K</option>
                <option>10K–100K</option>
                <option>100K+</option>
              </select>
            ) : (
              <StaticVal val={form.audienceSize} />
            )}
          </DetailField>
          <DetailField icon={Briefcase} label="Full-Time Role?">
            {editing ? (
              <select
                name="fullTimeRole"
                value={draft.fullTimeRole}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <StaticVal val={form.fullTimeRole} />
            )}
          </DetailField>
        </div>
      </div>

      {/* Platforms */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Platforms
        </p>
        {editing ? (
          <div className="flex flex-wrap gap-3">
            {PLATFORMS_LIST.map((p) => {
              const checked = draft.platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    checked
                      ? `${ac.badge} border-current`
                      : "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60"
                  }`}
                >
                  {checked ? (
                    <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />
                  ) : null}
                  {p}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(form.platforms || []).length === 0 ? (
              <p className={STATIC_CLS}>—</p>
            ) : (
              (form.platforms || []).map((p) => (
                <span
                  key={p}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${ac.badge}`}
                >
                  {p}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// /* ── ADMIN DETAILS TAB ── */
// const AdminDetailsTab = ({ accent }) => {
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);

//   const empty = {
//     organizationName: "",
//     domain: "",
//     contactEmail: "",
//     location: "",
//     industry: "",
//     description: "",
//     mobileNumber: "",
//     plan: "",
//     status: "",
//     planExpiryDate: "",
//     maxStudents: "",
//     maxTrainers: "",
//   };
//   const [form, setForm] = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   useEffect(() => {
//     userService
//       .getAdminProfile()
//       .then((res) => {
//         const d = res.data || {};
//         const loaded = {
//           organizationName: d.organizationName || "",
//           domain: d.domain || "",
//           contactEmail: d.contactEmail || "",
//           location: d.location || "",
//           industry: d.industry || "",
//           description: d.description || "",
//           mobileNumber: d.mobileNumber || "",
//           plan: d.plan || "",
//           status: d.status || "",
//           planExpiryDate: d.planExpiryDate || "",
//           maxStudents: d.maxStudents || "",
//           maxTrainers: d.maxTrainers || "",
//         };
//         setForm(loaded);
//         setDraft(loaded);
//       })
//       .catch(() => {});
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit = () => {
//     setDraft({ ...form });
//     setEditing(true);
//   };
//   const cancelEdit = () => {
//     setDraft({ ...form });
//     setEditing(false);
//   };

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setDraft((p) => ({ ...p, [name]: value }));
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const payload = {
//         organizationName: draft.organizationName,
//         domain: draft.domain,
//         contactEmail: draft.contactEmail,
//         location: draft.location,
//         industry: draft.industry,
//         description: draft.description,
//         mobileNumber: draft.mobileNumber,
//       };
//       await userService.updateAdminProfile(payload);
//       setForm({ ...form, ...payload });
//       setEditing(false);
//       showToast("Organization details saved");
//     } catch {
//       showToast("Failed to save. Try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

//   return (
//     <div className="space-y-8">
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//             Organization Details
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Your organization information
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {editing ? (
//             <>
//               <button
//                 onClick={cancelEdit}
//                 disabled={saving}
//                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
//               >
//                 <X className="w-3.5 h-3.5" /> Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
//               >
//                 {saving ? (
//                   <>
//                     <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
//                     Saving…
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-3.5 h-3.5" /> Save Details
//                   </>
//                 )}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={startEdit}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
//             >
//               <Edit3 className="w-3.5 h-3.5" /> Edit Details
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Editable Section */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <Building2 className="w-3.5 h-3.5" /> Organization Info
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <DetailField icon={Building2} label="Organization Name">
//             {editing ? (
//               <input
//                 type="text"
//                 name="organizationName"
//                 placeholder="e.g. Texora AI"
//                 value={draft.organizationName}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.organizationName} />
//             )}
//           </DetailField>
//           <DetailField icon={Globe} label="Domain">
//             {editing ? (
//               <input
//                 type="text"
//                 name="domain"
//                 placeholder="e.g. texora.ai"
//                 value={draft.domain}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.domain} />
//             )}
//           </DetailField>
//           <DetailField icon={Mail} label="Contact Email">
//             {editing ? (
//               <input
//                 type="email"
//                 name="contactEmail"
//                 placeholder="e.g. admin@texora.ai"
//                 value={draft.contactEmail}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.contactEmail} />
//             )}
//           </DetailField>
//           <DetailField icon={MapPin} label="Location">
//             {editing ? (
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="e.g. Hyderabad, India"
//                 value={draft.location}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.location} />
//             )}
//           </DetailField>
//           <DetailField icon={Briefcase} label="Industry">
//             {editing ? (
//               <select
//                 name="industry"
//                 value={draft.industry}
//                 onChange={handleChange}
//                 className={inputCls}
//               >
//                 <option value="">Select industry</option>
//                 {INDUSTRIES.map((i) => (
//                   <option key={i}>{i}</option>
//                 ))}
//               </select>
//             ) : (
//               <StaticVal val={form.industry} />
//             )}
//           </DetailField>
//           <DetailField icon={Phone} label="Mobile Number">
//             {editing ? (
//               <input
//                 type="tel"
//                 name="mobileNumber"
//                 placeholder="+91 9876543210"
//                 value={draft.mobileNumber}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.mobileNumber} />
//             )}
//           </DetailField>
//           <div className="sm:col-span-2">
//             <DetailField icon={BookOpen} label="Description">
//               {editing ? (
//                 <textarea
//                   name="description"
//                   placeholder="Brief description of your organization"
//                   value={draft.description}
//                   onChange={handleChange}
//                   rows={3}
//                   className={`${inputCls} resize-none`}
//                 />
//               ) : (
//                 <StaticVal val={form.description} />
//               )}
//             </DetailField>
//           </div>
//         </div>
//       </div>

//       {/* Locked Section */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <Lock className="w-3.5 h-3.5" /> Plan & Limits
//           <span className="ml-1 text-xs font-normal normal-case text-gray-400 dark:text-slate-500">
//             — managed by SuperAdmin
//           </span>
//         </p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//           {[
//             { icon: CreditCard, label: "Plan", val: form.plan },
//             { icon: Shield, label: "Status", val: form.status },
//             { icon: Calendar, label: "Plan Expiry", val: form.planExpiryDate },
//             { icon: Users, label: "Max Students", val: form.maxStudents },
//             { icon: Users, label: "Max Trainers", val: form.maxTrainers },
//           ].map(({ icon: Ic, label, val }) => (
//             <div key={label} className="space-y-1.5">
//               <label className={LABEL_CLS}>
//                 <Ic className="w-3.5 h-3.5" /> {label}
//               </label>
//               <div className="relative">
//                 <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none pr-16">
//                   {val || "—"}
//                 </p>
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
//                   Locked
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
/* ── ADMIN DETAILS TAB ── */
const AdminDetailsTab = ({ accent, returnTo }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const empty = {
    organizationName: "",
    domain: "",
    contactEmail: "",
    location: "",
    industry: "",
    description: "",
    mobileNumber: "",
    // locked — read only
    plan: "",
    status: "",
    planExpiryDate: "",
    maxStudents: "",
    maxTrainers: "",
    currentStudents: "",
    currentTrainers: "",
    maxDepartments: "",
    maxBranchesPerDept: "",
    maxBatchesPerBranch: "",
    currentDepartments: "",
    currentBranches: "",
    currentBatches: "",
  };
  const [form, setForm] = useState(empty);
  const [draft, setDraft] = useState(empty);

  // ── Load from auth-service org capacity endpoint ──
  useEffect(() => {
    const orgId = localStorage.getItem("organizationId");
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    authService
      .getOrgCapacity(orgId)
      .then((capacityData) => {
        // getOrgSummary is non-critical — if it 403s, default to zeros
        return getOrgSummary()
          .catch(() => ({
            currentDepartments: 0,
            currentBranches: 0,
            currentBatches: 0,
          }))
          .then((summaryData) => {
            const loaded = {
              organizationName: capacityData.organizationName || "",
              domain: capacityData.domain || "",
              contactEmail: capacityData.contactEmail || "",
              location: capacityData.location || "",
              industry: capacityData.industry || "",
              description: capacityData.description || "",
              mobileNumber: capacityData.mobileNumber || "",
              plan: capacityData.plan || "",
              status: capacityData.status || "",
              planExpiryDate: capacityData.planExpiryDate || "",
              maxStudents:
                capacityData.maxStudents != null
                  ? String(capacityData.maxStudents)
                  : "",
              maxTrainers:
                capacityData.maxTrainers != null
                  ? String(capacityData.maxTrainers)
                  : "",
              currentStudents:
                capacityData.currentStudents != null
                  ? String(capacityData.currentStudents)
                  : "",
              currentTrainers:
                capacityData.currentTrainers != null
                  ? String(capacityData.currentTrainers)
                  : "",
              maxDepartments:
                capacityData.maxDepartments != null
                  ? String(capacityData.maxDepartments)
                  : "",
              maxBranchesPerDept:
                capacityData.maxBranchesPerDept != null
                  ? String(capacityData.maxBranchesPerDept)
                  : "",
              maxBatchesPerBranch:
                capacityData.maxBatchesPerBranch != null
                  ? String(capacityData.maxBatchesPerBranch)
                  : "",
              currentDepartments:
                summaryData.currentDepartments != null
                  ? String(summaryData.currentDepartments)
                  : "0",
              currentBranches:
                summaryData.currentBranches != null
                  ? String(summaryData.currentBranches)
                  : "0",
              currentBatches:
                summaryData.currentBatches != null
                  ? String(summaryData.currentBatches)
                  : "0",
            };
            setForm(loaded);
            setDraft(loaded);
          });
      })
      .catch(() => {
        // silently fail — form stays empty
      })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });

  const startEdit = () => {
    setDraft({ ...form });
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      const payload = {
        organizationName: draft.organizationName,
        domain: draft.domain,
        contactEmail: draft.contactEmail,
        location: draft.location,
        industry: draft.industry,
        description: draft.description,
        mobileNumber: draft.mobileNumber,
        // maxStudents, maxTrainers, plan, status — NOT sent ✅
      };
      await authService.updateAdminOrgProfile(orgId, payload);

      // Update form with saved editable fields, keep locked fields as-is
      setForm((prev) => ({ ...prev, ...payload }));

      setEditing(false);
      showToast("Organization details saved");
      syncProfileCompleted(true);

      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 900);
      }
    } catch {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-xl bg-gray-200 dark:bg-white/10"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Organization Details
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your organization information
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Details
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      {/* ── Editable: Organization Info ── */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" /> Organization Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField icon={Building2} label="Organization Name">
            {editing ? (
              <input
                type="text"
                name="organizationName"
                placeholder="e.g. Texora AI"
                value={draft.organizationName}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.organizationName} />
            )}
          </DetailField>

          <DetailField icon={Globe} label="Domain">
            {editing ? (
              <input
                type="text"
                name="domain"
                placeholder="e.g. texora.ai"
                value={draft.domain}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.domain} />
            )}
          </DetailField>

          <DetailField icon={Mail} label="Contact Email">
            {editing ? (
              <input
                type="email"
                name="contactEmail"
                placeholder="e.g. admin@texora.ai"
                value={draft.contactEmail}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.contactEmail} />
            )}
          </DetailField>

          <DetailField icon={MapPin} label="Location">
            {editing ? (
              <input
                type="text"
                name="location"
                placeholder="e.g. Hyderabad, India"
                value={draft.location}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.location} />
            )}
          </DetailField>

          <DetailField icon={Briefcase} label="Industry">
            {editing ? (
              <select
                name="industry"
                value={draft.industry}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            ) : (
              <StaticVal val={form.industry} />
            )}
          </DetailField>

          <DetailField icon={Phone} label="Mobile Number">
            {editing ? (
              <input
                type="tel"
                name="mobileNumber"
                placeholder="+91 9876543210"
                value={draft.mobileNumber}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.mobileNumber} />
            )}
          </DetailField>

          <div className="sm:col-span-2">
            <DetailField icon={BookOpen} label="Description">
              {editing ? (
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief description of your organization"
                  value={draft.description}
                  onChange={handleChange}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <StaticVal val={form.description} />
              )}
            </DetailField>
          </div>
        </div>
      </div>

      {/* ── Locked: Plan & Limits ── */}
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> Plan & Limits
          <span className="ml-1 text-xs font-normal normal-case text-gray-400 dark:text-slate-500">
            — managed by SuperAdmin
          </span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: CreditCard, label: "Plan", val: form.plan },
            { icon: Shield, label: "Status", val: form.status },
            { icon: Calendar, label: "Plan Expiry", val: form.planExpiryDate },
            { icon: Users, label: "Max Students", val: form.maxStudents },
            { icon: Users, label: "Max Trainers", val: form.maxTrainers },
            {
              icon: Building2,
              label: "Max Departments",
              val: form.maxDepartments,
            },
            {
              icon: GitBranch,
              label: "Max Branches / Dept",
              val: form.maxBranchesPerDept,
            },
            {
              icon: Layers,
              label: "Max Batches / Branch",
              val: form.maxBatchesPerBranch,
            },
          ].map(({ icon: Ic, label, val }) => (
            <div key={label} className="space-y-1.5">
              <label className={LABEL_CLS}>
                <Ic className="w-3.5 h-3.5" /> {label}
              </label>
              <div className="relative">
                <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none pr-16">
                  {val || "—"}
                </p>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
                  Locked
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Live usage counts ── */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[
            {
              icon: Users,
              label: "Current Students",
              val: form.currentStudents,
            },
            {
              icon: Users,
              label: "Current Trainers",
              val: form.currentTrainers,
            },
            {
              icon: Building2,
              label: "Current Departments",
              val: form.currentDepartments,
            },
            {
              icon: GitBranch,
              label: "Current Branches",
              val: form.currentBranches,
            },
            {
              icon: Layers,
              label: "Current Batches",
              val: form.currentBatches,
            },
          ].map(({ icon: Ic, label, val }) => (
            <div key={label} className="space-y-1.5">
              <label className={LABEL_CLS}>
                <Ic className="w-3.5 h-3.5" /> {label}
              </label>
              <p
                className={`${STATIC_CLS} text-emerald-600 dark:text-emerald-400 font-semibold`}
              >
                {val || "0"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
/* ── BUSINESS DETAILS TAB ── */
const BusinessDetailsTab = ({ accent, returnTo }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const empty = {
    companyName: "",
    industry: "",
    location: "",
    website: "",
    contactEmail: "",
    mobileNumber: "",
    description: "",
  };
  const [form, setForm] = useState(empty);
  const [draft, setDraft] = useState(empty);

  useEffect(() => {
    userService
      .getBusinessProfile()
      .then((res) => {
        const d = res.data || {};
        const loaded = {
          companyName: d.companyName || "",
          industry: d.industry || "",
          location: d.location || "",
          website: d.website || "",
          contactEmail: d.contactEmail || "",
          mobileNumber: d.mobileNumber || "",
          description: d.description || "",
        };
        setForm(loaded);
        setDraft(loaded);
      })
      .catch(() => {});
  }, []);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const startEdit = () => {
    setDraft({ ...form });
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft({ ...form });
    setEditing(false);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((p) => ({ ...p, [name]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateBusinessProfile(draft);

      setForm({ ...draft });
      setEditing(false);

      showToast("Business details saved");
      syncProfileCompleted(true);

      if (returnTo) {
        setTimeout(() => {
          navigate(returnTo);
        }, 900);
      }
    } catch {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Business Details
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your company and contact information
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
              >
                {saving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Details
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" /> Company Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DetailField icon={Building2} label="Company Name">
            {editing ? (
              <input
                type="text"
                name="companyName"
                placeholder="e.g. Acme Corp"
                value={draft.companyName}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.companyName} />
            )}
          </DetailField>
          <DetailField icon={Briefcase} label="Industry">
            {editing ? (
              <select
                name="industry"
                value={draft.industry}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            ) : (
              <StaticVal val={form.industry} />
            )}
          </DetailField>
          <DetailField icon={MapPin} label="Location">
            {editing ? (
              <input
                type="text"
                name="location"
                placeholder="e.g. Mumbai, India"
                value={draft.location}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.location} />
            )}
          </DetailField>
          <DetailField icon={Globe} label="Website">
            {editing ? (
              <input
                type="url"
                name="website"
                placeholder="https://example.com"
                value={draft.website}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.website} />
            )}
          </DetailField>
          <DetailField icon={Mail} label="Contact Email">
            {editing ? (
              <input
                type="email"
                name="contactEmail"
                placeholder="e.g. contact@company.com"
                value={draft.contactEmail}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.contactEmail} />
            )}
          </DetailField>
          <DetailField icon={Phone} label="Mobile Number">
            {editing ? (
              <input
                type="tel"
                name="mobileNumber"
                placeholder="+91 9876543210"
                value={draft.mobileNumber}
                onChange={handleChange}
                className={inputCls}
              />
            ) : (
              <StaticVal val={form.mobileNumber} />
            )}
          </DetailField>
          <div className="sm:col-span-2">
            <DetailField icon={BookOpen} label="Description">
              {editing ? (
                <textarea
                  name="description"
                  placeholder="Brief description of your business"
                  value={draft.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              ) : (
                <StaticVal val={form.description} />
              )}
            </DetailField>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── DETAILS TAB ROUTER ── */
const DetailsTab = ({ accent, roleKey, returnTo }) => {
  if (roleKey === "trainer")
    return <TrainerDetailsTab accent={accent} returnTo={returnTo} />;

  if (roleKey === "admin")
    return <AdminDetailsTab accent={accent} returnTo={returnTo} />;

  if (roleKey === "business")
    return <BusinessDetailsTab accent={accent} returnTo={returnTo} />;

  return <StudentDetailsTab accent={accent} returnTo={returnTo} />;
};

/* ══════════════════════════════════════════════════════════════
   SECURITY TAB  — UNCHANGED (restored from old code)
══════════════════════════════════════════════════════════════ */
const SecurityTab = ({ accent }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const ac = ACCENT[accent];

  const showToast = (message, type = "success") => setToast({ message, type });

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("Both fields are required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(newPassword, confirmPassword);
      showToast("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to update password. Please try again.";
      showToast(
        typeof msg === "string" ? msg : "Failed to update password",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
            Change Password
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Choose a strong password with at least 6 characters
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" /> New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" /> Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
            />
          </div>

          {confirmPassword && (
            <p
              className={`text-xs flex items-center gap-1.5 ${
                newPassword === confirmPassword
                  ? "text-emerald-500"
                  : "text-red-500"
              }`}
            >
              {newPassword === confirmPassword ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" /> Passwords do not match
                </>
              )}
            </p>
          )}
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className={`mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium ${ac.btn} shadow transition-colors disabled:opacity-60`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating…
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" />
              Update Password
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
          Password Tips
        </h4>
        <ul className="space-y-2">
          {[
            "Use at least 8 characters",
            "Mix uppercase, lowercase, numbers & symbols",
            "Avoid using personal info like your name or birthday",
            "Don't reuse passwords from other sites",
          ].map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400"
            >
              <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400 dark:text-slate-500" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   BILLING TAB  — UNCHANGED (restored from old code)
══════════════════════════════════════════════════════════════ */
const BillingTab = ({ user, accent }) => {
  const ac = ACCENT[accent];
  const history = [
    {
      date: "Apr 1, 2025",
      amount: user.planPrice,
      status: "Paid",
      inv: "INV-0048",
    },
    {
      date: "Mar 1, 2025",
      amount: user.planPrice,
      status: "Paid",
      inv: "INV-0041",
    },
    {
      date: "Feb 1, 2025",
      amount: user.planPrice,
      status: "Paid",
      inv: "INV-0033",
    },
    {
      date: "Jan 1, 2025",
      amount: user.planPrice,
      status: "Paid",
      inv: "INV-0025",
    },
  ];

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${user.heroGradient} shadow-xl`}
      >
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-white/80" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">
                Current Plan
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{user.plan}</h3>
            <p className="text-white/70 text-sm mt-1">
              {user.planPrice} · Billed monthly
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <BadgeCheck className="w-4 h-4 text-white/80" />
              <span className="text-xs text-white/80">
                Renews on May 1, 2025
              </span>
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Payment Method
          </h3>
          <button className={`text-xs ${ac.text} hover:underline`}>
            Change
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
          <div className={`p-2.5 rounded-xl ${ac.iconBg}`}>
            <CreditCard className={`w-5 h-5 ${ac.text}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Visa ending in 4242
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-400">
              Expires 08/2027
            </p>
          </div>
          <span
            className={`ml-auto text-xs px-2 py-1 rounded-full border ${ac.badge}`}
          >
            Default
          </span>
        </div>
      </div>

      <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Payment History
        </h3>
        <div className="space-y-1">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-800 dark:text-white/90">
                    {h.inv}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {h.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {h.amount}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                  {h.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SKELETON  — UNCHANGED
══════════════════════════════════════════════════════════════ */
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-8 space-y-6 animate-pulse">
    <div className="h-48 rounded-3xl bg-gray-200 dark:bg-white/5" />
    <div className="h-64 rounded-3xl bg-gray-200 dark:bg-white/5" />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   PROFILE PAGE — MAIN
══════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReturnBanner, setShowReturnBanner] = useState(!!returnTo);

  const roleKey = pathname.startsWith("/trainer")
    ? "trainer"
    : pathname.startsWith("/admin")
      ? "admin"
      : pathname.startsWith("/business")
        ? "business"
        : "student";

  const [user, setUser] = useState({ ...ROLE_CONFIG[roleKey] });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    userService
      .getMyProfile()
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        const roleLabel = (() => {
          if (!data?.roles) return ROLE_CONFIG[roleKey].label;
          const r = data.roles.toString().toLowerCase();
          return r.charAt(0).toUpperCase() + r.slice(1);
        })();
        const apiName = data?.displayName || ROLE_CONFIG[roleKey].name;
        const apiEmail = data?.email || ROLE_CONFIG[roleKey].email;
        const apiId = data?.userId || ROLE_CONFIG[roleKey].id;
        const initial = apiName.charAt(0).toUpperCase();

        setUser((prev) => ({
          ...prev,
          name: apiName,
          email: apiEmail,
          id: apiId,
          label: roleLabel,
          avatar: initial,
        }));
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Profile fetch failed:", err);
          setError("Could not load profile — showing cached data.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const handleProfileUpdate = (updatedForm) => {
    setUser((prev) => ({
      ...prev,
      name: updatedForm.name,
      avatar: updatedForm.name.charAt(0).toUpperCase(),
    }));
  };

  // const tabs = [
  //   { id: "profile", label: "Profile Info", icon: User },
  //   { id: "details", label: "Details", icon: GraduationCap },
  //   { id: "security", label: "Security", icon: Shield },
  //   { id: "billing", label: "Billing", icon: CreditCard },
  // ];
  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    {
      id: "details",
      label: roleKey === "admin" ? "Organization Details" : "Details",
      icon: roleKey === "admin" ? Building2 : GraduationCap,
    },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {showReturnBanner && (
          <div className="px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 text-sm flex items-center justify-between gap-3">
            <span>
              Complete your profile below to continue to your dashboard.
            </span>
            <button
              onClick={() => setShowReturnBanner(false)}
              className="text-xs underline opacity-70 hover:opacity-100 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* HERO BANNER */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${user.heroGradient} p-8 shadow-2xl`}
        >
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              initials={user.avatar}
              size={96}
              editable
              online
              shape="rounded"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/30 uppercase tracking-wider">
                  {user.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/70 mt-2">
                <span className="flex items-center gap-1.5">
                  <IdCard className="w-3.5 h-3.5" /> {user.id}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                authService.logout();
                navigate("/");
              }}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-medium hover:bg-white/25 transition-all backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10">
          <div className="flex gap-1 p-2 overflow-x-auto bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
          <div className="p-6">
            {activeTab === "profile" && (
              <ProfileInfoTab
                user={user}
                accent={user.accent}
                onProfileUpdate={handleProfileUpdate}
                returnTo={returnTo}
              />
            )}
            {activeTab === "details" && (
              <DetailsTab
                accent={user.accent}
                roleKey={roleKey}
                returnTo={returnTo}
              />
            )}
            {activeTab === "security" && <SecurityTab accent={user.accent} />}
            {activeTab === "billing" && (
              <BillingTab user={user} accent={user.accent} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
