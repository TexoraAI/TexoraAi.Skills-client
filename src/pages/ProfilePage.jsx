// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { User, Mail, IdCard, Edit, Lock, LogOut } from "lucide-react";
// import userService from "../services/userService";

// const ProfilePage = () => {
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const isStudent = pathname.startsWith("/student");
//   const isTrainer = pathname.startsWith("/trainer");
//   const isAdmin = pathname.startsWith("/admin");
//   const isBusiness = pathname.startsWith("/business");

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await userService.getMyProfile();
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//         setError("Failed to load profile. Please login again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [pathname]); // re-fetches if pathname changes (e.g. after navigate back)

//   const handleEditProfile = () => {
//     if (isStudent) navigate("/student/edit-profile");
//     else if (isTrainer) navigate("/trainer/edit-profile");
//     else if (isAdmin) navigate("/admin/edit-profile");
//     else if (isBusiness) navigate("/business/edit-profile");
//     else navigate("/edit-profile");
//   };

//   const handleChangePassword = () => {
//     navigate("/reset-password");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("lms_token");
//     navigate("/login");
//   };

//   const getRoleLabel = () => {
//     if (!profile?.roles) return "User";
//     const r = profile.roles.toString().toLowerCase();
//     return r.charAt(0).toUpperCase() + r.slice(1);
//   };

//   const getInitial = () => {
//     return profile?.displayName?.charAt(0)?.toUpperCase() || "?";
//   };

//   const getSubtitle = () => {
//     if (isStudent) return "Student account information for LMS.";
//     if (isTrainer) return "Trainer account information for LMS.";
//     if (isAdmin) return "Admin account information and controls.";
//     if (isBusiness) return "Business team account information.";
//     return "User account information.";
//   };

//   // ── Loading state ──
//   if (loading) {
//     return (
//       <div className="space-y-6 max-w-4xl animate-pulse">
//         <div className="h-32 rounded-2xl bg-gray-200 dark:bg-slate-800" />
//         <div className="h-48 rounded-2xl bg-gray-200 dark:bg-slate-800" />
//       </div>
//     );
//   }

//   // ── Error state ──
//   if (error) {
//     return (
//       <div className="max-w-4xl p-6 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
//         <p className="font-medium">{error}</p>
//         <button
//           onClick={() => navigate("/login")}
//           className="mt-3 text-sm underline"
//         >
//           Go to Login
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-4xl">
//       {/* HEADER WITH AVATAR */}
//       <div className="flex items-center gap-5 p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg">
//         <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-3xl font-bold text-white shadow-xl overflow-hidden">
//           {profile?.photoUrl ? (
//             <img
//               src={profile.photoUrl}
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             getInitial()
//           )}
//         </div>

//         <div className="flex-1">
//           <h1 className="text-2xl font-bold text-white">
//             {profile?.displayName || "—"}
//           </h1>
//           <div className="flex items-center gap-2 mt-1">
//             <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium text-white">
//               {getRoleLabel()}
//             </span>
//             {profile?.userId && (
//               <span className="text-sm text-white/80">
//                 ID: {profile.userId}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ACCOUNT DETAILS CARD */}
//       <div className="rounded-2xl border border-gray-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 shadow-sm p-6 space-y-6">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-200">
//             Account Details
//           </h2>
//           <p className="mt-1 text-sm text-gray-600 dark:text-slate-500">
//             {getSubtitle()}
//           </p>
//         </div>

//         {/* INFO GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
//               <User className="w-4 h-4" />
//               <p className="text-xs font-medium uppercase tracking-wide">
//                 Full Name
//               </p>
//             </div>
//             <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
//               {profile?.displayName || "—"}
//             </p>
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
//               <IdCard className="w-4 h-4" />
//               <p className="text-xs font-medium uppercase tracking-wide">
//                 Role
//               </p>
//             </div>
//             <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
//               {getRoleLabel()}
//             </p>
//           </div>

//           <div className="md:col-span-2 space-y-2">
//             <div className="flex items-center gap-2 text-gray-600 dark:text-slate-500">
//               <Mail className="w-4 h-4" />
//               <p className="text-xs font-medium uppercase tracking-wide">
//                 Email Address
//               </p>
//             </div>
//             <p className="text-sm font-medium text-gray-900 dark:text-slate-100 pl-6">
//               {profile?.email || "—"}
//             </p>
//           </div>
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="pt-4 flex flex-wrap gap-3">
//           <button
//             onClick={handleEditProfile}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white shadow-sm transition-colors"
//           >
//             <Edit className="w-4 h-4" />
//             Edit Profile
//           </button>

//           <button
//             onClick={handleChangePassword}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium text-gray-700 dark:text-slate-200 transition-colors"
//           >
//             <Lock className="w-4 h-4" />
//             Change Password
//           </button>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-600 dark:text-red-400 transition-colors ml-auto"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

/**
 * ProfilePage.jsx  (Fixed)
 *
 * ✅ Fix 1: Stats card grid section REMOVED
 * ✅ Fix 2: Name change bug fixed — useEffect now depends on user.name
 *           so local name state re-syncs when parent state updates
 */
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  IdCard,
  Lock,
  LogOut,
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
  BadgeCheck,
  Upload,
  Camera,
} from "lucide-react";

import { useAvatarContext } from "../context/AvatarContext";
import authService from "../services/authService";
import userService from "@/services/userService";

/* ══════════════════════════════════════════════════════════════
   AVATAR COMPONENT
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
   ROLE CONFIG
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
   ACCENT MAP
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
   TAB BUTTON
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
   TOAST COMPONENT — replaces alert()
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
   PROFILE INFO TAB
══════════════════════════════════════════════════════════════ */
const ProfileInfoTab = ({ user, accent, onProfileUpdate }) => {
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
        {/* Full Name — editable */}
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

        {/* Role — locked */}
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

        {/* Email — locked */}
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
   SECURITY TAB — FIXED: no alert(), correct token from
   authService.getToken(), proper error handling
══════════════════════════════════════════════════════════════ */
const SecurityTab = ({ accent }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const ac = ACCENT[accent];

  const showToast = (message, type = "success") => setToast({ message, type });

  const handlePasswordChange = async () => {
    // — Validate inputs
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
      // authService.changePassword already attaches the Bearer token
      // via the Authorization header using authService.getToken()
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

          {/* Password match indicator */}
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

      {/* Security tips */}
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
   BILLING TAB
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
      {/* Current Plan Card */}
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

      {/* Payment Method */}
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

      {/* Payment History */}
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
   SKELETON
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
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
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
