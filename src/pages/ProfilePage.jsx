// // export default ProfilePage;
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   User,
//   Mail,
//   IdCard,
//   Lock,
//   LogOut,
//   Layers,
//   Shield,
//   CreditCard,
//   Award,
//   CheckCircle,
//   Edit3,
//   Save,
//   X,
//   Zap,
//   Building2,
//   GraduationCap,
//   GitBranch,
//   BadgeCheck,
//   Upload,
//   Camera,
//   Phone,
//   MapPin,
//   Calendar,
//   Briefcase,
//   BookOpen,
//   Globe,
//   TrendingUp,
//   Users,
// } from "lucide-react";

// import { useAvatarContext } from "../context/AvatarContext";
// import authService from "../services/authService";
// import userService from "@/services/userService";
// import { getOrgSummary } from "../services/batchService";
// /* ── Mark the profile as complete — both locally and on the backend ──
//    Call this right after ANY of the 4 Details/Org tabs saves successfully.
//    It doesn't matter which service stored the actual fields — this always
//    hits the Auth Service, which is the single source of truth the dashboard
//    gate reads at login. Requires authService.markProfileCompleted() — see
//    note below if you haven't added it yet. */
// const syncProfileCompleted = (value) => {
//   try {
//     const cached = JSON.parse(localStorage.getItem("lms_user") || "{}");
//     localStorage.setItem(
//       "lms_user",
//       JSON.stringify({ ...cached, profileCompleted: !!value }),
//     );
//   } catch {
//     localStorage.setItem(
//       "lms_user",
//       JSON.stringify({ profileCompleted: !!value }),
//     );
//   }
//   if (value) {
//     authService
//       .markProfileCompleted()
//       .catch((err) =>
//         console.error("Failed to sync profileCompleted with backend:", err),
//       );
//   }
// };
// /* ══════════════════════════════════════════════════════════════
//    AVATAR COMPONENT  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// export const Avatar = ({
//   initials = "U",
//   size = 40,
//   editable = false,
//   online = false,
//   shape = "circle",
//   className = "",
// }) => {
//   const ctx = useAvatarContext();
//   const profileImage = ctx?.profileImage ?? null;
//   const uploadImage = ctx?.uploadImage ?? (() => {});
//   const removeImage = ctx?.removeImage ?? (() => {});
//   const fileRef = useRef(null);
//   const radius = shape === "circle" ? "9999px" : "14px";
//   const dotSize = Math.max(10, Math.round(size * 0.22));
//   const dotOffset = Math.round(size * 0.04);

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (file && (file.type === "image/jpeg" || file.type === "image/png"))
//       uploadImage(file);
//     e.target.value = "";
//   };

//   return (
//     <div
//       className={`relative inline-flex shrink-0 ${className}`}
//       style={{ width: size, height: size }}
//     >
//       <div
//         onClick={editable ? () => fileRef.current?.click() : undefined}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: radius,
//           overflow: "hidden",
//           border: "2.5px solid rgba(255,255,255,0.40)",
//           boxShadow: "0 0 0 2px rgba(123,47,247,0.30)",
//           background: profileImage
//             ? "transparent"
//             : "linear-gradient(135deg,#7B2FF7,#C030A0)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           cursor: editable ? "pointer" : "default",
//           transition: "transform 0.2s, box-shadow 0.2s",
//           position: "relative",
//         }}
//         className={editable ? "group hover:scale-105" : ""}
//         title={editable ? "Click to change photo" : undefined}
//       >
//         {profileImage ? (
//           <img
//             src={profileImage}
//             alt="Profile"
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         ) : (
//           <span
//             style={{
//               color: "#fff",
//               fontWeight: 800,
//               fontSize: Math.max(11, Math.round(size * 0.38)),
//               letterSpacing: "-0.5px",
//               userSelect: "none",
//             }}
//           >
//             {initials}
//           </span>
//         )}
//         {editable && (
//           <div
//             className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//             style={{ borderRadius: radius }}
//           >
//             <Camera
//               style={{
//                 width: Math.round(size * 0.32),
//                 height: Math.round(size * 0.32),
//                 color: "#fff",
//               }}
//             />
//           </div>
//         )}
//       </div>

//       {online && (
//         <span
//           style={{
//             position: "absolute",
//             bottom: dotOffset,
//             right: dotOffset,
//             width: dotSize,
//             height: dotSize,
//             borderRadius: "50%",
//             background: "#22c55e",
//             border: "2px solid white",
//             boxShadow: "0 0 0 1px rgba(34,197,94,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <span
//             className="animate-ping"
//             style={{
//               position: "absolute",
//               inset: 0,
//               borderRadius: "50%",
//               background: "#22c55e",
//               opacity: 0.6,
//             }}
//           />
//         </span>
//       )}

//       {editable && profileImage && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             removeImage();
//           }}
//           title="Remove photo"
//           style={{
//             position: "absolute",
//             top: -6,
//             right: -6,
//             width: 20,
//             height: 20,
//             borderRadius: "50%",
//             background: "#ef4444",
//             border: "2px solid white",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             cursor: "pointer",
//             zIndex: 10,
//             padding: 0,
//           }}
//           className="hover:bg-red-600 transition-colors"
//         >
//           <X style={{ width: 10, height: 10, color: "#fff", strokeWidth: 3 }} />
//         </button>
//       )}

//       {editable && (
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/jpeg,image/png"
//           style={{ display: "none" }}
//           onChange={handleFile}
//         />
//       )}
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    ROLE CONFIG  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const ROLE_CONFIG = {
//   student: {
//     label: "Student",
//     id: "STU-0012",
//     name: "Student User",
//     email: "student@example.com",
//     joined: "—",
//     lastLogin: "—",
//     avatar: "S",
//     heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
//     accent: "violet",
//     plan: "Student Pro",
//     planPrice: "₹499/mo",
//   },
//   trainer: {
//     label: "Trainer",
//     id: "TRN-0005",
//     name: "Trainer User",
//     email: "trainer@example.com",
//     joined: "—",
//     lastLogin: "—",
//     avatar: "T",
//     heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
//     accent: "emerald",
//     plan: "Trainer Elite",
//     planPrice: "₹1,299/mo",
//   },
//   admin: {
//     label: "Admin",
//     id: "ADM-0001",
//     name: "Admin User",
//     email: "admin@example.com",
//     joined: "—",
//     lastLogin: "—",
//     avatar: "A",
//     heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
//     accent: "rose",
//     plan: "Enterprise",
//     planPrice: "₹4,999/mo",
//   },
//   business: {
//     label: "Business",
//     id: "BUS-0003",
//     name: "Business User",
//     email: "business@example.com",
//     joined: "—",
//     lastLogin: "—",
//     avatar: "B",
//     heroGradient: "from-[#7B2FF7] via-[#C030A0] to-[#F4962A]",
//     accent: "amber",
//     plan: "Business Pro",
//     planPrice: "₹8,999/mo",
//   },
// };

// /* ══════════════════════════════════════════════════════════════
//    ACCENT MAP  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const ACCENT = {
//   violet: {
//     btn: "bg-violet-600 hover:bg-violet-700",
//     text: "text-violet-600 dark:text-violet-400",
//     badge:
//       "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30",
//     bar: "bg-violet-500",
//     ring: "focus:ring-violet-400",
//     iconBg: "bg-violet-100 dark:bg-violet-500/20",
//   },
//   emerald: {
//     btn: "bg-emerald-600 hover:bg-emerald-700",
//     text: "text-emerald-600 dark:text-emerald-400",
//     badge:
//       "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
//     bar: "bg-emerald-500",
//     ring: "focus:ring-emerald-400",
//     iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
//   },
//   rose: {
//     btn: "bg-rose-600 hover:bg-rose-700",
//     text: "text-rose-600 dark:text-rose-400",
//     badge:
//       "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
//     bar: "bg-rose-500",
//     ring: "focus:ring-rose-400",
//     iconBg: "bg-rose-100 dark:bg-rose-500/20",
//   },
//   amber: {
//     btn: "bg-amber-500 hover:bg-amber-600",
//     text: "text-amber-600 dark:text-amber-400",
//     badge:
//       "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
//     bar: "bg-amber-500",
//     ring: "focus:ring-amber-400",
//     iconBg: "bg-amber-100 dark:bg-amber-500/20",
//   },
// };

// /* ══════════════════════════════════════════════════════════════
//    TAB BUTTON  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const TabButton = ({ label, icon: Icon, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
//       active
//         ? "bg-gray-900 dark:bg-white/10 text-white border border-gray-700 dark:border-white/20 shadow"
//         : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
//     }`}
//   >
//     <Icon className="w-4 h-4" />
//     {label}
//   </button>
// );

// /* ══════════════════════════════════════════════════════════════
//    TOAST COMPONENT  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   const colors =
//     type === "success"
//       ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
//       : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400";

//   return (
//     <div
//       className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl text-sm font-medium animate-fade-in ${colors}`}
//       style={{ animation: "slideIn 0.3s ease" }}
//     >
//       {type === "success" ? (
//         <CheckCircle className="w-4 h-4 shrink-0" />
//       ) : (
//         <X className="w-4 h-4 shrink-0" />
//       )}
//       {message}
//       <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
//         <X className="w-3.5 h-3.5" />
//       </button>
//       <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    PROFILE INFO TAB  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const ProfileInfoTab = ({ user, accent, onProfileUpdate, returnTo }) => {
//   const navigate = useNavigate();
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [name, setName] = useState(user.name);
//   const [toast, setToast] = useState(null);
//   const { uploadImage, removeImage, profileImage } = useAvatarContext();
//   const fileInputRef = useRef(null);
//   const ac = ACCENT[accent];

//   useEffect(() => {
//     if (!editing) setName(user.name);
//   }, [user.name, editing]);

//   const showToast = (message, type = "success") => setToast({ message, type });

//   const handleSave = async () => {
//     if (!name.trim()) {
//       showToast("Name cannot be empty", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       await userService.updateMyProfile({ displayName: name.trim() });

//       if (onProfileUpdate) onProfileUpdate({ name: name.trim() });

//       setEditing(false);
//       showToast("Profile updated successfully");

//       if (returnTo) {
//         setTimeout(() => {
//           navigate(returnTo);
//         }, 900);
//       }
//     } catch (err) {
//       console.error("Save failed:", err);
//       showToast("Failed to update profile. Please try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
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
//             Personal Information
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Manage your profile details
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {editing ? (
//             <>
//               <button
//                 onClick={() => setEditing(false)}
//                 disabled={saving}
//                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
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
//                     <Save className="w-3.5 h-3.5" /> Save Changes
//                   </>
//                 )}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setEditing(true)}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
//             >
//               <Edit3 className="w-3.5 h-3.5" /> Edit Profile
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Photo Upload Panel */}
//       <div className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
//         <Avatar
//           initials={user.avatar}
//           size={72}
//           editable
//           online
//           shape="rounded"
//         />
//         <div>
//           <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
//             Profile Photo
//           </p>
//           <p className="text-xs text-gray-400 dark:text-slate-400 mb-3">
//             JPG or PNG · Saved locally · Updates Navbar & Sidebar instantly
//           </p>
//           <div className="flex gap-2 flex-wrap">
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white ${ac.btn} transition-colors`}
//             >
//               <Upload className="w-3 h-3" /> Upload Photo
//             </button>
//             {profileImage && (
//               <button
//                 onClick={removeImage}
//                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
//               >
//                 <X className="w-3 h-3" /> Remove Photo
//               </button>
//             )}
//           </div>
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/jpeg,image/png"
//             className="hidden"
//             onChange={(e) => {
//               const f = e.target.files?.[0];
//               if (f && (f.type === "image/jpeg" || f.type === "image/png"))
//                 uploadImage(f);
//               e.target.value = "";
//             }}
//           />
//         </div>
//       </div>

//       {/* Fields */}
//       <div className="space-y-4">
//         {/* Full Name */}
//         <div className="space-y-1.5">
//           <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
//             <User className="w-3.5 h-3.5" /> Full Name
//           </label>
//           {editing ? (
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
//             />
//           ) : (
//             <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85">
//               {name || "—"}
//             </p>
//           )}
//         </div>

//         {/* Role */}
//         <div className="space-y-1.5">
//           <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
//             <IdCard className="w-3.5 h-3.5" /> Role
//           </label>
//           <div className="relative">
//             <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none">
//               {user.label}
//             </p>
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
//               Locked
//             </span>
//           </div>
//           <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
//             Role cannot be changed from this page
//           </p>
//         </div>

//         {/* Email */}
//         <div className="space-y-1.5">
//           <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
//             <Mail className="w-3.5 h-3.5" /> Email Address
//           </label>
//           <div className="relative">
//             <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none">
//               {user.email}
//             </p>
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
//               Locked
//             </span>
//           </div>
//           <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
//             Email cannot be changed from this page
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    COUNTRY CODES
// ══════════════════════════════════════════════════════════════ */
// const COUNTRY_CODES = [
//   { code: "+91", label: "🇮🇳 +91  India" },
//   { code: "+1", label: "🇺🇸 +1   USA / Canada" },
//   { code: "+44", label: "🇬🇧 +44  UK" },
//   { code: "+61", label: "🇦🇺 +61  Australia" },
//   { code: "+971", label: "🇦🇪 +971 UAE" },
//   { code: "+65", label: "🇸🇬 +65  Singapore" },
//   { code: "+60", label: "🇲🇾 +60  Malaysia" },
//   { code: "+49", label: "🇩🇪 +49  Germany" },
//   { code: "+33", label: "🇫🇷 +33  France" },
//   { code: "+81", label: "🇯🇵 +81  Japan" },
//   { code: "+86", label: "🇨🇳 +86  China" },
//   { code: "+7", label: "🇷🇺 +7   Russia" },
//   { code: "+55", label: "🇧🇷 +55  Brazil" },
//   { code: "+27", label: "🇿🇦 +27  South Africa" },
//   { code: "+92", label: "🇵🇰 +92  Pakistan" },
//   { code: "+880", label: "🇧🇩 +880 Bangladesh" },
//   { code: "+94", label: "🇱🇰 +94  Sri Lanka" },
//   { code: "+977", label: "🇳🇵 +977 Nepal" },
// ];

// /* ══════════════════════════════════════════════════════════════
//    DETAILS TAB HELPERS — defined at MODULE level (NOT inside DetailsTab)
// ══════════════════════════════════════════════════════════════ */
// const LABEL_CLS =
//   "flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest mb-1.5";

// const STATIC_CLS =
//   "px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85 min-h-[42px]";

// const DetailField = ({ icon: Icon, label, children }) => (
//   <div className="space-y-1.5">
//     <label className={LABEL_CLS}>
//       {Icon && <Icon className="w-3.5 h-3.5" />}
//       {label}
//     </label>
//     {children}
//   </div>
// );

// const StaticVal = ({ val }) => <p className={STATIC_CLS}>{val || "—"}</p>;

// const ErrorMsg = ({ msg }) =>
//   msg ? (
//     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//       <X className="w-3 h-3" /> {msg}
//     </p>
//   ) : null;

// const PLATFORMS_LIST = [
//   "Blog",
//   "YouTube",
//   "Podcast",
//   "LinkedIn",
//   "Instagram",
//   "Twitter/X",
//   "Newsletter",
//   "TikTok",
//   "Other",
// ];

// const ADMIN_TYPES = [
//   "Super Admin",
//   "Content Admin",
//   "Support Admin",
//   "Finance Admin",
// ];
// const DEPARTMENTS = [
//   "Engineering",
//   "Marketing",
//   "Operations",
//   "HR",
//   "Finance",
//   "Content",
//   "Support",
// ];

// const INDUSTRIES = [
//   "EdTech",
//   "FinTech",
//   "HealthTech",
//   "E-Commerce",
//   "Consulting",
//   "Manufacturing",
//   "Retail",
//   "Logistics",
//   "Real Estate",
//   "Media",
//   "Government",
//   "NGO",
//   "Other",
// ];

// /* ── STUDENT DETAILS TAB ── */
// const StudentDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);
//   const [errors, setErrors] = useState({});

//   const empty = {
//     dialCode: "+91",
//     localNumber: "",
//     dateOfBirth: "",
//     gender: "",
//     city: "",
//     state: "",
//     country: "",
//     qualification: "",
//     collegeName: "",
//     yearOfPassing: "",
//     domain: "",
//     experience: "",
//   };
//   const [form, setForm] = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   const parseMobile = useCallback((raw = "") => {
//     if (!raw) return { dialCode: "+91", localNumber: "" };
//     const match = COUNTRY_CODES.find((c) => raw.startsWith(c.code));
//     return match
//       ? {
//           dialCode: match.code,
//           localNumber: raw.slice(match.code.length).trim(),
//         }
//       : { dialCode: "+91", localNumber: raw };
//   }, []);

//   useEffect(() => {
//     userService
//       .getStudentProfile()
//       .then((res) => {
//         const d = res.data || {};
//         const { dialCode, localNumber } = parseMobile(d.mobileNumber);
//         const loaded = {
//           dialCode,
//           localNumber,
//           dateOfBirth: d.dateOfBirth || "",
//           gender: d.gender || "",
//           city: d.city || "",
//           state: d.state || "",
//           country: d.country || "",
//           qualification: d.qualification || "",
//           collegeName: d.collegeName || "",
//           yearOfPassing: d.yearOfPassing || "",
//           domain: d.domain || "",
//           experience: d.experience || "",
//         };
//         setForm(loaded);
//         setDraft(loaded);
//       })
//       .catch(() => {});
//   }, [parseMobile]);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit = () => {
//     setDraft({ ...form });
//     setErrors({});
//     setEditing(true);
//   };
//   const cancelEdit = () => {
//     setDraft({ ...form });
//     setErrors({});
//     setEditing(false);
//   };
//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setDraft((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: "" }));
//   }, []);

//   const validate = (d) => {
//     const errs = {};
//     if (d.localNumber && !/^\d{6,15}$/.test(d.localNumber.trim()))
//       errs.localNumber = "Enter 6–15 digits only";
//     if (d.yearOfPassing) {
//       const y = Number(d.yearOfPassing),
//         cur = new Date().getFullYear();
//       if (!/^\d{4}$/.test(d.yearOfPassing) || y < 1980 || y > cur + 5)
//         errs.yearOfPassing = `Valid year between 1980–${cur + 5}`;
//     }
//     if (d.dateOfBirth) {
//       const dob = new Date(d.dateOfBirth);
//       if (dob >= new Date()) errs.dateOfBirth = "Must be in the past";
//       else if (new Date().getFullYear() - dob.getFullYear() < 10)
//         errs.dateOfBirth = "Age must be at least 10";
//     }
//     return errs;
//   };

//   const handleSave = async () => {
//     const errs = validate(draft);
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       showToast("Fix errors first", "error");
//       return;
//     }
//     setSaving(true);
//     try {
//       const payload = {
//         mobileNumber: draft.localNumber.trim()
//           ? `${draft.dialCode}${draft.localNumber.trim()}`
//           : "",
//         dateOfBirth: draft.dateOfBirth,
//         gender: draft.gender,
//         city: draft.city,
//         state: draft.state,
//         country: draft.country,
//         qualification: draft.qualification,
//         collegeName: draft.collegeName,
//         yearOfPassing: draft.yearOfPassing,
//         domain: draft.domain,
//         experience: draft.experience,
//       };
//       await userService.updateStudentProfile(payload);
//       setForm({ ...draft });
//       setEditing(false);
//       showToast("Details saved successfully");
//       syncProfileCompleted(true);
//       if (returnTo) {
//         setTimeout(() => {
//           navigate(returnTo);
//         }, 900);
//       }
//     } catch {
//       showToast("Failed to save. Try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputCls = (f) =>
//     `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${
//       errors[f]
//         ? "border-red-400 focus:ring-red-400"
//         : `border-gray-300 dark:border-white/20 focus:ring-2 ${ac.ring}`
//     } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none`;

//   const displayMobile = form.localNumber
//     ? `${form.dialCode} ${form.localNumber}`
//     : "";

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
//             Profile Details
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Personal, location and education details
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {editing ? (
//             <>
//               <button
//                 onClick={cancelEdit}
//                 disabled={saving}
//                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
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
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
//             >
//               <Edit3 className="w-3.5 h-3.5" /> Edit Details
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Personal Info */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <User className="w-3.5 h-3.5" /> Personal Info
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//           <DetailField icon={Phone} label="Mobile Number">
//             {editing ? (
//               <div className="space-y-1">
//                 <div className="flex gap-2">
//                   <select
//                     name="dialCode"
//                     value={draft.dialCode}
//                     onChange={handleChange}
//                     className={`shrink-0 w-36 px-2 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${ac.ring}`}
//                   >
//                     {COUNTRY_CODES.map((c) => (
//                       <option key={c.code} value={c.code}>
//                         {c.label}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="tel"
//                     name="localNumber"
//                     placeholder="9876543210"
//                     value={draft.localNumber}
//                     onChange={handleChange}
//                     maxLength={15}
//                     className={inputCls("localNumber")}
//                   />
//                 </div>
//                 <ErrorMsg msg={errors.localNumber} />
//               </div>
//             ) : (
//               <StaticVal val={displayMobile} />
//             )}
//           </DetailField>
//           <DetailField icon={Calendar} label="Date of Birth">
//             {editing ? (
//               <div>
//                 <input
//                   type="date"
//                   name="dateOfBirth"
//                   value={draft.dateOfBirth}
//                   onChange={handleChange}
//                   max={new Date().toISOString().split("T")[0]}
//                   className={inputCls("dateOfBirth")}
//                 />
//                 <ErrorMsg msg={errors.dateOfBirth} />
//               </div>
//             ) : (
//               <StaticVal val={form.dateOfBirth} />
//             )}
//           </DetailField>
//           <DetailField icon={Users} label="Gender">
//             {editing ? (
//               <select
//                 name="gender"
//                 value={draft.gender}
//                 onChange={handleChange}
//                 className={inputCls("gender")}
//               >
//                 <option value="">Select gender</option>
//                 <option>Male</option>
//                 <option>Female</option>
//                 <option>Other</option>
//                 <option>Prefer not to say</option>
//               </select>
//             ) : (
//               <StaticVal val={form.gender} />
//             )}
//           </DetailField>
//         </div>
//       </div>

//       {/* Location */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <MapPin className="w-3.5 h-3.5" /> Location
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
//           {[
//             ["city", "City", "e.g. Hyderabad"],
//             ["state", "State", "e.g. Telangana"],
//             ["country", "Country", "e.g. India"],
//           ].map(([name, label, ph]) => (
//             <DetailField key={name} icon={MapPin} label={label}>
//               {editing ? (
//                 <input
//                   type="text"
//                   name={name}
//                   placeholder={ph}
//                   value={draft[name]}
//                   onChange={handleChange}
//                   className={inputCls(name)}
//                 />
//               ) : (
//                 <StaticVal val={form[name]} />
//               )}
//             </DetailField>
//           ))}
//         </div>
//       </div>

//       {/* Education */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <GraduationCap className="w-3.5 h-3.5" /> Education & Professional
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <DetailField icon={BookOpen} label="Qualification">
//             {editing ? (
//               <input
//                 type="text"
//                 name="qualification"
//                 placeholder="e.g. B.Tech"
//                 value={draft.qualification}
//                 onChange={handleChange}
//                 className={inputCls("qualification")}
//               />
//             ) : (
//               <StaticVal val={form.qualification} />
//             )}
//           </DetailField>
//           <DetailField icon={Building2} label="College / Institute">
//             {editing ? (
//               <input
//                 type="text"
//                 name="collegeName"
//                 placeholder="e.g. JNTU"
//                 value={draft.collegeName}
//                 onChange={handleChange}
//                 className={inputCls("collegeName")}
//               />
//             ) : (
//               <StaticVal val={form.collegeName} />
//             )}
//           </DetailField>
//           <DetailField icon={Calendar} label="Year of Passing">
//             {editing ? (
//               <div>
//                 <input
//                   type="text"
//                   name="yearOfPassing"
//                   placeholder={`${new Date().getFullYear()}`}
//                   value={draft.yearOfPassing}
//                   onChange={handleChange}
//                   maxLength={4}
//                   className={inputCls("yearOfPassing")}
//                 />
//                 <ErrorMsg msg={errors.yearOfPassing} />
//               </div>
//             ) : (
//               <StaticVal val={form.yearOfPassing} />
//             )}
//           </DetailField>
//           <DetailField icon={Briefcase} label="Domain / Area of Interest">
//             {editing ? (
//               <input
//                 type="text"
//                 name="domain"
//                 placeholder="e.g. Full Stack"
//                 value={draft.domain}
//                 onChange={handleChange}
//                 className={inputCls("domain")}
//               />
//             ) : (
//               <StaticVal val={form.domain} />
//             )}
//           </DetailField>
//           <div className="sm:col-span-2">
//             <DetailField icon={TrendingUp} label="Experience">
//               {editing ? (
//                 <input
//                   type="text"
//                   name="experience"
//                   placeholder="e.g. Fresher, 2 years"
//                   value={draft.experience}
//                   onChange={handleChange}
//                   className={inputCls("experience")}
//                 />
//               ) : (
//                 <StaticVal val={form.experience} />
//               )}
//             </DetailField>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ── TRAINER DETAILS TAB ── */
// const TrainerDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);

//   const empty = {
//     linkedinUrl: "",
//     country: "",
//     audienceSize: "",
//     fullTimeRole: "",
//     courseTopic: "",
//     platforms: [],
//   };
//   const [form, setForm] = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   // useEffect(() => {
//   //   userService
//   //     .getTrainerProfile()
//   //     .then((res) => {
//   //       const d = res.data || {};
//   //       const loaded = {
//   //         linkedinUrl: d.linkedinUrl || "",
//   //         country: d.country || "",
//   //         audienceSize: d.audienceSize || "",
//   //         fullTimeRole: d.fullTimeRole || "",
//   //         courseTopic: d.courseTopic || "",
//   //         platforms: d.platforms || [],
//   //       };
//   //       setForm(loaded);
//   //       setDraft(loaded);
//   //     })
//   //     .catch(() => {});
//   // }, []);
//   useEffect(() => {
//     userService
//       .getTrainerProfile()
//       .then((res) => {
//         const d = res.data || {};
//         const loaded = {
//           linkedinUrl: d.linkedinUrl || "",
//           country: d.country || "",
//           audienceSize: d.audienceSize || "",
//           fullTimeRole: d.fullTimeRole || "",
//           courseTopic: d.courseTopic || "",
//           platforms: Array.isArray(d.platforms)
//             ? d.platforms
//             : d.platforms
//               ? d.platforms
//                   .split(",")
//                   .map((p) => p.trim())
//                   .filter(Boolean)
//               : [],
//         };
//         setForm(loaded);
//         setDraft(loaded);
//       })
//       .catch(() => {});
//   }, []);
//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit = () => {
//     setDraft({ ...form, platforms: [...(form.platforms || [])] });
//     setEditing(true);
//   };
//   const cancelEdit = () => {
//     setDraft({ ...form, platforms: [...(form.platforms || [])] });
//     setEditing(false);
//   };

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setDraft((p) => ({ ...p, [name]: value }));
//   }, []);

//   const togglePlatform = useCallback((platform) => {
//     setDraft((p) => ({
//       ...p,
//       platforms: p.platforms.includes(platform)
//         ? p.platforms.filter((x) => x !== platform)
//         : [...p.platforms, platform],
//     }));
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await userService.updateTrainerProfile(draft);
//       setForm({ ...draft });
//       setEditing(false);
//       showToast("Trainer profile saved");
//       syncProfileCompleted(true);
//       if (returnTo) {
//         setTimeout(() => {
//           navigate(returnTo);
//         }, 900);
//       }
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
//             Trainer Profile
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Your training background and platform details
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
//                     <Save className="w-3.5 h-3.5" /> Save Profile
//                   </>
//                 )}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={startEdit}
//               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
//             >
//               <Edit3 className="w-3.5 h-3.5" /> Edit Profile
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Basic Info */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <Globe className="w-3.5 h-3.5" /> Basic Info
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <DetailField icon={Globe} label="LinkedIn URL">
//             {editing ? (
//               <input
//                 type="url"
//                 name="linkedinUrl"
//                 placeholder="https://linkedin.com/in/..."
//                 value={draft.linkedinUrl}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.linkedinUrl} />
//             )}
//           </DetailField>
//           <DetailField icon={MapPin} label="Country">
//             {editing ? (
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="e.g. India"
//                 value={draft.country}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.country} />
//             )}
//           </DetailField>
//           <DetailField icon={BookOpen} label="Course Topic">
//             {editing ? (
//               <input
//                 type="text"
//                 name="courseTopic"
//                 placeholder="e.g. React, Python, AWS"
//                 value={draft.courseTopic}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.courseTopic} />
//             )}
//           </DetailField>
//           <DetailField icon={Users} label="Audience Size">
//             {editing ? (
//               <select
//                 name="audienceSize"
//                 value={draft.audienceSize}
//                 onChange={handleChange}
//                 className={inputCls}
//               >
//                 <option value="">Select range</option>
//                 <option>0–1K</option>
//                 <option>1K–10K</option>
//                 <option>10K–100K</option>
//                 <option>100K+</option>
//               </select>
//             ) : (
//               <StaticVal val={form.audienceSize} />
//             )}
//           </DetailField>
//           <DetailField icon={Briefcase} label="Full-Time Role?">
//             {editing ? (
//               <select
//                 name="fullTimeRole"
//                 value={draft.fullTimeRole}
//                 onChange={handleChange}
//                 className={inputCls}
//               >
//                 <option value="">Select</option>
//                 <option value="Yes">Yes</option>
//                 <option value="No">No</option>
//               </select>
//             ) : (
//               <StaticVal val={form.fullTimeRole} />
//             )}
//           </DetailField>
//         </div>
//       </div>

//       {/* Platforms */}
//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <TrendingUp className="w-3.5 h-3.5" /> Platforms
//         </p>
//         {editing ? (
//           <div className="flex flex-wrap gap-3">
//             {PLATFORMS_LIST.map((p) => {
//               const checked = draft.platforms.includes(p);
//               return (
//                 <button
//                   key={p}
//                   type="button"
//                   onClick={() => togglePlatform(p)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
//                     checked
//                       ? `${ac.badge} border-current`
//                       : "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60"
//                   }`}
//                 >
//                   {checked ? (
//                     <CheckCircle className="w-3.5 h-3.5 inline mr-1.5" />
//                   ) : null}
//                   {p}
//                 </button>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="flex flex-wrap gap-2">
//             {(form.platforms || []).length === 0 ? (
//               <p className={STATIC_CLS}>—</p>
//             ) : (
//               (form.platforms || []).map((p) => (
//                 <span
//                   key={p}
//                   className={`px-3 py-1 rounded-full text-xs font-semibold border ${ac.badge}`}
//                 >
//                   {p}
//                 </span>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // /* ── ADMIN DETAILS TAB ── */
// // const AdminDetailsTab = ({ accent }) => {
// //   const ac = ACCENT[accent];
// //   const [editing, setEditing] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [toast, setToast] = useState(null);

// //   const empty = {
// //     organizationName: "",
// //     domain: "",
// //     contactEmail: "",
// //     location: "",
// //     industry: "",
// //     description: "",
// //     mobileNumber: "",
// //     plan: "",
// //     status: "",
// //     planExpiryDate: "",
// //     maxStudents: "",
// //     maxTrainers: "",
// //   };
// //   const [form, setForm] = useState(empty);
// //   const [draft, setDraft] = useState(empty);

// //   useEffect(() => {
// //     userService
// //       .getAdminProfile()
// //       .then((res) => {
// //         const d = res.data || {};
// //         const loaded = {
// //           organizationName: d.organizationName || "",
// //           domain: d.domain || "",
// //           contactEmail: d.contactEmail || "",
// //           location: d.location || "",
// //           industry: d.industry || "",
// //           description: d.description || "",
// //           mobileNumber: d.mobileNumber || "",
// //           plan: d.plan || "",
// //           status: d.status || "",
// //           planExpiryDate: d.planExpiryDate || "",
// //           maxStudents: d.maxStudents || "",
// //           maxTrainers: d.maxTrainers || "",
// //         };
// //         setForm(loaded);
// //         setDraft(loaded);
// //       })
// //       .catch(() => {});
// //   }, []);

// //   const showToast = (msg, type = "success") => setToast({ message: msg, type });
// //   const startEdit = () => {
// //     setDraft({ ...form });
// //     setEditing(true);
// //   };
// //   const cancelEdit = () => {
// //     setDraft({ ...form });
// //     setEditing(false);
// //   };

// //   const handleChange = useCallback((e) => {
// //     const { name, value } = e.target;
// //     setDraft((p) => ({ ...p, [name]: value }));
// //   }, []);

// //   const handleSave = async () => {
// //     setSaving(true);
// //     try {
// //       const payload = {
// //         organizationName: draft.organizationName,
// //         domain: draft.domain,
// //         contactEmail: draft.contactEmail,
// //         location: draft.location,
// //         industry: draft.industry,
// //         description: draft.description,
// //         mobileNumber: draft.mobileNumber,
// //       };
// //       await userService.updateAdminProfile(payload);
// //       setForm({ ...form, ...payload });
// //       setEditing(false);
// //       showToast("Organization details saved");
// //     } catch {
// //       showToast("Failed to save. Try again.", "error");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

// //   return (
// //     <div className="space-y-8">
// //       {toast && (
// //         <Toast
// //           message={toast.message}
// //           type={toast.type}
// //           onClose={() => setToast(null)}
// //         />
// //       )}

// //       {/* Header */}
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h3 className="text-lg font-bold text-gray-900 dark:text-white">
// //             Organization Details
// //           </h3>
// //           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
// //             Your organization information
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           {editing ? (
// //             <>
// //               <button
// //                 onClick={cancelEdit}
// //                 disabled={saving}
// //                 className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
// //               >
// //                 <X className="w-3.5 h-3.5" /> Cancel
// //               </button>
// //               <button
// //                 onClick={handleSave}
// //                 disabled={saving}
// //                 className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
// //               >
// //                 {saving ? (
// //                   <>
// //                     <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
// //                     Saving…
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Save className="w-3.5 h-3.5" /> Save Details
// //                   </>
// //                 )}
// //               </button>
// //             </>
// //           ) : (
// //             <button
// //               onClick={startEdit}
// //               className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
// //             >
// //               <Edit3 className="w-3.5 h-3.5" /> Edit Details
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Editable Section */}
// //       <div>
// //         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
// //           <Building2 className="w-3.5 h-3.5" /> Organization Info
// //         </p>
// //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
// //           <DetailField icon={Building2} label="Organization Name">
// //             {editing ? (
// //               <input
// //                 type="text"
// //                 name="organizationName"
// //                 placeholder="e.g. Texora AI"
// //                 value={draft.organizationName}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               />
// //             ) : (
// //               <StaticVal val={form.organizationName} />
// //             )}
// //           </DetailField>
// //           <DetailField icon={Globe} label="Domain">
// //             {editing ? (
// //               <input
// //                 type="text"
// //                 name="domain"
// //                 placeholder="e.g. texora.ai"
// //                 value={draft.domain}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               />
// //             ) : (
// //               <StaticVal val={form.domain} />
// //             )}
// //           </DetailField>
// //           <DetailField icon={Mail} label="Contact Email">
// //             {editing ? (
// //               <input
// //                 type="email"
// //                 name="contactEmail"
// //                 placeholder="e.g. admin@texora.ai"
// //                 value={draft.contactEmail}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               />
// //             ) : (
// //               <StaticVal val={form.contactEmail} />
// //             )}
// //           </DetailField>
// //           <DetailField icon={MapPin} label="Location">
// //             {editing ? (
// //               <input
// //                 type="text"
// //                 name="location"
// //                 placeholder="e.g. Hyderabad, India"
// //                 value={draft.location}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               />
// //             ) : (
// //               <StaticVal val={form.location} />
// //             )}
// //           </DetailField>
// //           <DetailField icon={Briefcase} label="Industry">
// //             {editing ? (
// //               <select
// //                 name="industry"
// //                 value={draft.industry}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               >
// //                 <option value="">Select industry</option>
// //                 {INDUSTRIES.map((i) => (
// //                   <option key={i}>{i}</option>
// //                 ))}
// //               </select>
// //             ) : (
// //               <StaticVal val={form.industry} />
// //             )}
// //           </DetailField>
// //           <DetailField icon={Phone} label="Mobile Number">
// //             {editing ? (
// //               <input
// //                 type="tel"
// //                 name="mobileNumber"
// //                 placeholder="+91 9876543210"
// //                 value={draft.mobileNumber}
// //                 onChange={handleChange}
// //                 className={inputCls}
// //               />
// //             ) : (
// //               <StaticVal val={form.mobileNumber} />
// //             )}
// //           </DetailField>
// //           <div className="sm:col-span-2">
// //             <DetailField icon={BookOpen} label="Description">
// //               {editing ? (
// //                 <textarea
// //                   name="description"
// //                   placeholder="Brief description of your organization"
// //                   value={draft.description}
// //                   onChange={handleChange}
// //                   rows={3}
// //                   className={`${inputCls} resize-none`}
// //                 />
// //               ) : (
// //                 <StaticVal val={form.description} />
// //               )}
// //             </DetailField>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Locked Section */}
// //       <div>
// //         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
// //           <Lock className="w-3.5 h-3.5" /> Plan & Limits
// //           <span className="ml-1 text-xs font-normal normal-case text-gray-400 dark:text-slate-500">
// //             — managed by SuperAdmin
// //           </span>
// //         </p>
// //         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
// //           {[
// //             { icon: CreditCard, label: "Plan", val: form.plan },
// //             { icon: Shield, label: "Status", val: form.status },
// //             { icon: Calendar, label: "Plan Expiry", val: form.planExpiryDate },
// //             { icon: Users, label: "Max Students", val: form.maxStudents },
// //             { icon: Users, label: "Max Trainers", val: form.maxTrainers },
// //           ].map(({ icon: Ic, label, val }) => (
// //             <div key={label} className="space-y-1.5">
// //               <label className={LABEL_CLS}>
// //                 <Ic className="w-3.5 h-3.5" /> {label}
// //               </label>
// //               <div className="relative">
// //                 <p className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none pr-16">
// //                   {val || "—"}
// //                 </p>
// //                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
// //                   Locked
// //                 </span>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };
// /* ── ADMIN DETAILS TAB ── */
// const AdminDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast] = useState(null);

//   const empty = {
//     organizationName: "",
//     domain: "",
//     contactEmail: "",
//     location: "",
//     industry: "",
//     description: "",
//     mobileNumber: "",
//     // locked — read only
//     plan: "",
//     status: "",
//     planExpiryDate: "",
//     maxStudents: "",
//     maxTrainers: "",
//     currentStudents: "",
//     currentTrainers: "",
//     maxDepartments: "",
//     maxBranchesPerDept: "",
//     maxBatchesPerBranch: "",
//     currentDepartments: "",
//     currentBranches: "",
//     currentBatches: "",
//   };
//   const [form, setForm] = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   // ── Load from auth-service org capacity endpoint ──
//   useEffect(() => {
//     const orgId = localStorage.getItem("organizationId");
//     if (!orgId) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);

//     authService
//       .getOrgCapacity(orgId)
//       .then((capacityData) => {
//         // getOrgSummary is non-critical — if it 403s, default to zeros
//         return getOrgSummary()
//           .catch(() => ({
//             currentDepartments: 0,
//             currentBranches: 0,
//             currentBatches: 0,
//           }))
//           .then((summaryData) => {
//             const loaded = {
//               organizationName: capacityData.organizationName || "",
//               domain: capacityData.domain || "",
//               contactEmail: capacityData.contactEmail || "",
//               location: capacityData.location || "",
//               industry: capacityData.industry || "",
//               description: capacityData.description || "",
//               mobileNumber: capacityData.mobileNumber || "",
//               plan: capacityData.plan || "",
//               status: capacityData.status || "",
//               planExpiryDate: capacityData.planExpiryDate || "",
//               maxStudents:
//                 capacityData.maxStudents != null
//                   ? String(capacityData.maxStudents)
//                   : "",
//               maxTrainers:
//                 capacityData.maxTrainers != null
//                   ? String(capacityData.maxTrainers)
//                   : "",
//               currentStudents:
//                 capacityData.currentStudents != null
//                   ? String(capacityData.currentStudents)
//                   : "",
//               currentTrainers:
//                 capacityData.currentTrainers != null
//                   ? String(capacityData.currentTrainers)
//                   : "",
//               maxDepartments:
//                 capacityData.maxDepartments != null
//                   ? String(capacityData.maxDepartments)
//                   : "",
//               maxBranchesPerDept:
//                 capacityData.maxBranchesPerDept != null
//                   ? String(capacityData.maxBranchesPerDept)
//                   : "",
//               maxBatchesPerBranch:
//                 capacityData.maxBatchesPerBranch != null
//                   ? String(capacityData.maxBatchesPerBranch)
//                   : "",
//               currentDepartments:
//                 summaryData.currentDepartments != null
//                   ? String(summaryData.currentDepartments)
//                   : "0",
//               currentBranches:
//                 summaryData.currentBranches != null
//                   ? String(summaryData.currentBranches)
//                   : "0",
//               currentBatches:
//                 summaryData.currentBatches != null
//                   ? String(summaryData.currentBatches)
//                   : "0",
//             };
//             setForm(loaded);
//             setDraft(loaded);
//           });
//       })
//       .catch(() => {
//         // silently fail — form stays empty
//       })
//       .finally(() => setLoading(false));
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
//       const orgId = localStorage.getItem("organizationId");
//       const payload = {
//         organizationName: draft.organizationName,
//         domain: draft.domain,
//         contactEmail: draft.contactEmail,
//         location: draft.location,
//         industry: draft.industry,
//         description: draft.description,
//         mobileNumber: draft.mobileNumber,
//         // maxStudents, maxTrainers, plan, status — NOT sent ✅
//       };
//       await authService.updateAdminOrgProfile(orgId, payload);

//       // Update form with saved editable fields, keep locked fields as-is
//       setForm((prev) => ({ ...prev, ...payload }));

//       setEditing(false);
//       showToast("Organization details saved");
//       syncProfileCompleted(true);

//       if (returnTo) {
//         setTimeout(() => {
//           navigate(returnTo);
//         }, 900);
//       }
//     } catch {
//       showToast("Failed to save. Try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

//   if (loading) {
//     return (
//       <div className="space-y-4 animate-pulse">
//         <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-white/10" />
//         <div className="grid grid-cols-2 gap-4">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="h-12 rounded-xl bg-gray-200 dark:bg-white/10"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

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
//                     <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

//       {/* ── Editable: Organization Info ── */}
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
//                   rows={3}
//                   placeholder="Brief description of your organization"
//                   value={draft.description}
//                   onChange={handleChange}
//                   className={`${inputCls} resize-none`}
//                 />
//               ) : (
//                 <StaticVal val={form.description} />
//               )}
//             </DetailField>
//           </div>
//         </div>
//       </div>

//       {/* ── Locked: Plan & Limits ── */}
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
//             {
//               icon: Building2,
//               label: "Max Departments",
//               val: form.maxDepartments,
//             },
//             {
//               icon: GitBranch,
//               label: "Max Branches / Dept",
//               val: form.maxBranchesPerDept,
//             },
//             {
//               icon: Layers,
//               label: "Max Batches / Branch",
//               val: form.maxBatchesPerBranch,
//             },
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

//         {/* ── Live usage counts ── */}
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           {[
//             {
//               icon: Users,
//               label: "Current Students",
//               val: form.currentStudents,
//             },
//             {
//               icon: Users,
//               label: "Current Trainers",
//               val: form.currentTrainers,
//             },
//             {
//               icon: Building2,
//               label: "Current Departments",
//               val: form.currentDepartments,
//             },
//             {
//               icon: GitBranch,
//               label: "Current Branches",
//               val: form.currentBranches,
//             },
//             {
//               icon: Layers,
//               label: "Current Batches",
//               val: form.currentBatches,
//             },
//           ].map(({ icon: Ic, label, val }) => (
//             <div key={label} className="space-y-1.5">
//               <label className={LABEL_CLS}>
//                 <Ic className="w-3.5 h-3.5" /> {label}
//               </label>
//               <p
//                 className={`${STATIC_CLS} text-emerald-600 dark:text-emerald-400 font-semibold`}
//               >
//                 {val || "0"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };
// /* ── BUSINESS DETAILS TAB ── */
// const BusinessDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState(null);

//   const empty = {
//     companyName: "",
//     industry: "",
//     location: "",
//     website: "",
//     contactEmail: "",
//     mobileNumber: "",
//     description: "",
//   };
//   const [form, setForm] = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   useEffect(() => {
//     userService
//       .getBusinessProfile()
//       .then((res) => {
//         const d = res.data || {};
//         const loaded = {
//           companyName: d.companyName || "",
//           industry: d.industry || "",
//           location: d.location || "",
//           website: d.website || "",
//           contactEmail: d.contactEmail || "",
//           mobileNumber: d.mobileNumber || "",
//           description: d.description || "",
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
//       await userService.updateBusinessProfile(draft);

//       setForm({ ...draft });
//       setEditing(false);

//       showToast("Business details saved");
//       syncProfileCompleted(true);

//       if (returnTo) {
//         setTimeout(() => {
//           navigate(returnTo);
//         }, 900);
//       }
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
//             Business Details
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Your company and contact information
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

//       <div>
//         <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//           <Building2 className="w-3.5 h-3.5" /> Company Info
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//           <DetailField icon={Building2} label="Company Name">
//             {editing ? (
//               <input
//                 type="text"
//                 name="companyName"
//                 placeholder="e.g. Acme Corp"
//                 value={draft.companyName}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.companyName} />
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
//           <DetailField icon={MapPin} label="Location">
//             {editing ? (
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="e.g. Mumbai, India"
//                 value={draft.location}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.location} />
//             )}
//           </DetailField>
//           <DetailField icon={Globe} label="Website">
//             {editing ? (
//               <input
//                 type="url"
//                 name="website"
//                 placeholder="https://example.com"
//                 value={draft.website}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.website} />
//             )}
//           </DetailField>
//           <DetailField icon={Mail} label="Contact Email">
//             {editing ? (
//               <input
//                 type="email"
//                 name="contactEmail"
//                 placeholder="e.g. contact@company.com"
//                 value={draft.contactEmail}
//                 onChange={handleChange}
//                 className={inputCls}
//               />
//             ) : (
//               <StaticVal val={form.contactEmail} />
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
//                   placeholder="Brief description of your business"
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
//     </div>
//   );
// };

// /* ── DETAILS TAB ROUTER ── */
// const DetailsTab = ({ accent, roleKey, returnTo }) => {
//   if (roleKey === "trainer")
//     return <TrainerDetailsTab accent={accent} returnTo={returnTo} />;

//   if (roleKey === "admin")
//     return <AdminDetailsTab accent={accent} returnTo={returnTo} />;

//   if (roleKey === "business")
//     return <BusinessDetailsTab accent={accent} returnTo={returnTo} />;

//   return <StudentDetailsTab accent={accent} returnTo={returnTo} />;
// };

// /* ══════════════════════════════════════════════════════════════
//    SECURITY TAB  — UNCHANGED (restored from old code)
// ══════════════════════════════════════════════════════════════ */
// const SecurityTab = ({ accent }) => {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);
//   const ac = ACCENT[accent];

//   const showToast = (message, type = "success") => setToast({ message, type });

//   const handlePasswordChange = async () => {
//     if (!newPassword || !confirmPassword) {
//       showToast("Both fields are required", "error");
//       return;
//     }
//     if (newPassword.length < 6) {
//       showToast("Password must be at least 6 characters", "error");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       showToast("Passwords do not match", "error");
//       return;
//     }
//     setLoading(true);
//     try {
//       await authService.changePassword(newPassword, confirmPassword);
//       showToast("Password updated successfully");
//       setNewPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       console.error("Change password error:", err);
//       const msg =
//         err?.response?.data?.message ||
//         err?.response?.data ||
//         "Failed to update password. Please try again.";
//       showToast(
//         typeof msg === "string" ? msg : "Failed to update password",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}

//       <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
//         <div className="mb-5">
//           <h3 className="font-bold text-gray-900 dark:text-white text-lg">
//             Change Password
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
//             Choose a strong password with at least 6 characters
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div className="space-y-1.5">
//             <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
//               <Lock className="w-3.5 h-3.5" /> New Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
//             />
//           </div>

//           <div className="space-y-1.5">
//             <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
//               <Lock className="w-3.5 h-3.5" /> Confirm New Password
//             </label>
//             <input
//               type="password"
//               placeholder="Confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className={`w-full px-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
//             />
//           </div>

//           {confirmPassword && (
//             <p
//               className={`text-xs flex items-center gap-1.5 ${
//                 newPassword === confirmPassword
//                   ? "text-emerald-500"
//                   : "text-red-500"
//               }`}
//             >
//               {newPassword === confirmPassword ? (
//                 <>
//                   <CheckCircle className="w-3.5 h-3.5" /> Passwords match
//                 </>
//               ) : (
//                 <>
//                   <X className="w-3.5 h-3.5" /> Passwords do not match
//                 </>
//               )}
//             </p>
//           )}
//         </div>

//         <button
//           onClick={handlePasswordChange}
//           disabled={loading}
//           className={`mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium ${ac.btn} shadow transition-colors disabled:opacity-60`}
//         >
//           {loading ? (
//             <>
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Updating…
//             </>
//           ) : (
//             <>
//               <Shield className="w-4 h-4" />
//               Update Password
//             </>
//           )}
//         </button>
//       </div>

//       <div className="rounded-2xl p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
//         <h4 className="text-sm font-semibold text-gray-700 dark:text-white/80 mb-3">
//           Password Tips
//         </h4>
//         <ul className="space-y-2">
//           {[
//             "Use at least 8 characters",
//             "Mix uppercase, lowercase, numbers & symbols",
//             "Avoid using personal info like your name or birthday",
//             "Don't reuse passwords from other sites",
//           ].map((tip, i) => (
//             <li
//               key={i}
//               className="flex items-start gap-2 text-xs text-gray-500 dark:text-slate-400"
//             >
//               <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400 dark:text-slate-500" />
//               {tip}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    BILLING TAB  — UNCHANGED (restored from old code)
// ══════════════════════════════════════════════════════════════ */
// const BillingTab = ({ user, accent }) => {
//   const ac = ACCENT[accent];
//   const history = [
//     {
//       date: "Apr 1, 2025",
//       amount: user.planPrice,
//       status: "Paid",
//       inv: "INV-0048",
//     },
//     {
//       date: "Mar 1, 2025",
//       amount: user.planPrice,
//       status: "Paid",
//       inv: "INV-0041",
//     },
//     {
//       date: "Feb 1, 2025",
//       amount: user.planPrice,
//       status: "Paid",
//       inv: "INV-0033",
//     },
//     {
//       date: "Jan 1, 2025",
//       amount: user.planPrice,
//       status: "Paid",
//       inv: "INV-0025",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div
//         className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${user.heroGradient} shadow-xl`}
//       >
//         <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative flex items-start justify-between">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <Zap className="w-4 h-4 text-white/80" />
//               <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">
//                 Current Plan
//               </span>
//             </div>
//             <h3 className="text-2xl font-bold text-white">{user.plan}</h3>
//             <p className="text-white/70 text-sm mt-1">
//               {user.planPrice} · Billed monthly
//             </p>
//             <div className="flex items-center gap-1.5 mt-3">
//               <BadgeCheck className="w-4 h-4 text-white/80" />
//               <span className="text-xs text-white/80">
//                 Renews on May 1, 2025
//               </span>
//             </div>
//           </div>
//           <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
//             Upgrade Plan
//           </button>
//         </div>
//       </div>

//       <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-semibold text-gray-900 dark:text-white">
//             Payment Method
//           </h3>
//           <button className={`text-xs ${ac.text} hover:underline`}>
//             Change
//           </button>
//         </div>
//         <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
//           <div className={`p-2.5 rounded-xl ${ac.iconBg}`}>
//             <CreditCard className={`w-5 h-5 ${ac.text}`} />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900 dark:text-white">
//               Visa ending in 4242
//             </p>
//             <p className="text-xs text-gray-400 dark:text-slate-400">
//               Expires 08/2027
//             </p>
//           </div>
//           <span
//             className={`ml-auto text-xs px-2 py-1 rounded-full border ${ac.badge}`}
//           >
//             Default
//           </span>
//         </div>
//       </div>

//       <div className="rounded-2xl p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
//         <h3 className="font-semibold text-gray-900 dark:text-white">
//           Payment History
//         </h3>
//         <div className="space-y-1">
//           {history.map((h, i) => (
//             <div
//               key={i}
//               className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10">
//                   <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-800 dark:text-white/90">
//                     {h.inv}
//                   </p>
//                   <p className="text-xs text-gray-400 dark:text-slate-500">
//                     {h.date}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-semibold text-gray-900 dark:text-white">
//                   {h.amount}
//                 </span>
//                 <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
//                   {h.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════
//    SKELETON  — UNCHANGED
// ══════════════════════════════════════════════════════════════ */
// const Skeleton = () => (
//   <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-8 space-y-6 animate-pulse">
//     <div className="h-48 rounded-3xl bg-gray-200 dark:bg-white/5" />
//     <div className="h-64 rounded-3xl bg-gray-200 dark:bg-white/5" />
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════
//    PROFILE PAGE — MAIN
// ══════════════════════════════════════════════════════════════ */
// const ProfilePage = () => {
//   const location = useLocation();
//   const { pathname } = location;
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const returnTo = searchParams.get("returnTo");
//   const [activeTab, setActiveTab] = useState("profile");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showReturnBanner, setShowReturnBanner] = useState(!!returnTo);

//   const roleKey = pathname.startsWith("/trainer")
//     ? "trainer"
//     : pathname.startsWith("/admin")
//       ? "admin"
//       : pathname.startsWith("/business")
//         ? "business"
//         : "student";

//   const [user, setUser] = useState({ ...ROLE_CONFIG[roleKey] });

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setError("");

//     userService
//       .getMyProfile()
//       .then((res) => {
//         if (cancelled) return;
//         const data = res.data;
//         const roleLabel = (() => {
//           if (!data?.roles) return ROLE_CONFIG[roleKey].label;
//           const r = data.roles.toString().toLowerCase();
//           return r.charAt(0).toUpperCase() + r.slice(1);
//         })();
//         const apiName = data?.displayName || ROLE_CONFIG[roleKey].name;
//         const apiEmail = data?.email || ROLE_CONFIG[roleKey].email;
//         const apiId = data?.userId || ROLE_CONFIG[roleKey].id;
//         const initial = apiName.charAt(0).toUpperCase();

//         setUser((prev) => ({
//           ...prev,
//           name: apiName,
//           email: apiEmail,
//           id: apiId,
//           label: roleLabel,
//           avatar: initial,
//         }));
//       })
//       .catch((err) => {
//         if (!cancelled) {
//           console.error("Profile fetch failed:", err);
//           setError("Could not load profile — showing cached data.");
//         }
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [pathname]);

//   const handleProfileUpdate = (updatedForm) => {
//     setUser((prev) => ({
//       ...prev,
//       name: updatedForm.name,
//       avatar: updatedForm.name.charAt(0).toUpperCase(),
//     }));
//   };

//   // const tabs = [
//   //   { id: "profile", label: "Profile Info", icon: User },
//   //   { id: "details", label: "Details", icon: GraduationCap },
//   //   { id: "security", label: "Security", icon: Shield },
//   //   { id: "billing", label: "Billing", icon: CreditCard },
//   // ];
//   const tabs = [
//     { id: "profile", label: "Profile Info", icon: User },
//     {
//       id: "details",
//       label: roleKey === "admin" ? "Organization Details" : "Details",
//       icon: roleKey === "admin" ? Building2 : GraduationCap,
//     },
//     { id: "security", label: "Security", icon: Shield },
//     { id: "billing", label: "Billing", icon: CreditCard },
//   ];

//   if (loading) return <Skeleton />;

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] transition-colors duration-300">
//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
//         {error && (
//           <div className="px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
//             {error}
//           </div>
//         )}

//         {showReturnBanner && (
//           <div className="px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 text-sm flex items-center justify-between gap-3">
//             <span>
//               Complete your profile below to continue to your dashboard.
//             </span>
//             <button
//               onClick={() => setShowReturnBanner(false)}
//               className="text-xs underline opacity-70 hover:opacity-100 shrink-0"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}

//         {/* HERO BANNER */}
//         <div
//           className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${user.heroGradient} p-8 shadow-2xl`}
//         >
//           <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
//           <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />
//           <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
//             <Avatar
//               initials={user.avatar}
//               size={96}
//               editable
//               online
//               shape="rounded"
//             />
//             <div className="flex-1 min-w-0">
//               <div className="flex flex-wrap items-center gap-2 mb-1">
//                 <h1 className="text-3xl font-black text-white tracking-tight">
//                   {user.name}
//                 </h1>
//                 <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white border border-white/30 uppercase tracking-wider">
//                   {user.label}
//                 </span>
//               </div>
//               <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/70 mt-2">
//                 <span className="flex items-center gap-1.5">
//                   <IdCard className="w-3.5 h-3.5" /> {user.id}
//                 </span>
//                 <span className="flex items-center gap-1.5">
//                   <Mail className="w-3.5 h-3.5" /> {user.email}
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 authService.logout();
//                 navigate("/");
//               }}
//               className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 border border-white/30 text-white text-sm font-medium hover:bg-white/25 transition-all backdrop-blur-sm"
//             >
//               <LogOut className="w-4 h-4" /> Logout
//             </button>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10">
//           <div className="flex gap-1 p-2 overflow-x-auto bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
//             {tabs.map((tab) => (
//               <TabButton
//                 key={tab.id}
//                 label={tab.label}
//                 icon={tab.icon}
//                 active={activeTab === tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//               />
//             ))}
//           </div>
//           <div className="p-6">
//             {activeTab === "profile" && (
//               <ProfileInfoTab
//                 user={user}
//                 accent={user.accent}
//                 onProfileUpdate={handleProfileUpdate}
//                 returnTo={returnTo}
//               />
//             )}
//             {activeTab === "details" && (
//               <DetailsTab
//                 accent={user.accent}
//                 roleKey={roleKey}
//                 returnTo={returnTo}
//               />
//             )}
//             {activeTab === "security" && <SecurityTab accent={user.accent} />}
//             {activeTab === "billing" && (
//               <BillingTab user={user} accent={user.accent} />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
























































































// // ProfilePage.jsx — Enterprise Redesign + Validation Hardening
// // NO API CHANGES · NO ROUTING CHANGES · NO LOGIC CHANGES
// // Only validation strengthened per spec.

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import {
//   User, Mail, IdCard, Lock, LogOut, Layers, Shield, CreditCard, Award,
//   CheckCircle, Edit3, Save, X, Zap, Building2, GraduationCap, GitBranch,
//   BadgeCheck, Upload, Camera, Phone, MapPin, Calendar, Briefcase, BookOpen,
//   Globe, TrendingUp, Users, ChevronDown, Search, Plus, AlertCircle,
// } from "lucide-react";

// import { useAvatarContext } from "../context/AvatarContext";
// import authService from "../services/authService";
// import userService from "@/services/userService";
// import { getOrgSummary } from "../services/batchService";

// /* ═════════════════════════════════════════════════════════════
//    VALIDATION ENGINE — shared across all tabs
// ═════════════════════════════════════════════════════════════ */

// /** Strip all HTML, script tags, and XSS vectors from a string. */
// const sanitize = (str) =>
//   (str || "")
//     .replace(/<[^>]*>/g, "")
//     .replace(/[<>"'`]/g, "")
//     .replace(/javascript:/gi, "")
//     .replace(/on\w+\s*=/gi, "")
//     .trim();

// /** Returns true if the value is obviously fake / garbage / spam. */
// function isSpam(val) {
//   if (!val) return false;
//   const v = val.toLowerCase().trim();

//   if (/^(.)\1{3,}$/.test(v)) return true; // aaaa, 1111, $$$$

//   const throwaway = [
//     "test","dummy","hello","foo","bar","baz","qwerty","asdf","zxcv",
//     "abc","xyz","aaa","zzz","xxx","yyy","na","n/a","none","null",
//     "undefined","fake","random","sample","example","temp","placeholder",
//     "spam","junk","garbage","blah","lol","lmao",
//   ];
//   if (throwaway.includes(v)) return true;

//   if (/^(0123|1234|2345|3456|4567|5678|6789|abcde|bcdef)/.test(v)) return true;
//   if (/(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bunion\b|--|\/\*)/i.test(v)) return true;
//   if (/<(script|svg|img|iframe|object|embed|style|link)/i.test(v)) return true;
//   if (/^[^a-zA-Z0-9\s]+$/.test(v)) return true;

//   return false;
// }

// /** Validate a mobile/phone number. */
// function validateMobile(val) {
//   if (!val || !val.trim()) return null;
//   const v = val.replace(/\s+/g, "");
//   if (/[^+\d]/.test(v)) return "Please enter a valid mobile number.";
//   if (/^(\d)\1{5,}$/.test(v)) return "Please enter a valid mobile number.";

//   if (v.startsWith("+91")) {
//     const local = v.slice(3);
//     if (!/^\d{10}$/.test(local)) return "Please enter a valid 10-digit Indian mobile number.";
//     if (/^(\d)\1{9}$/.test(local)) return "Please enter a valid mobile number.";
//     if (/^[01234]/.test(local)) return "Please enter a valid mobile number.";
//     return null;
//   }
//   if (v.startsWith("+")) {
//     const rest = v.replace(/^\+\d{1,4}/, "");
//     if (!/^\d{6,14}$/.test(rest)) return "Please enter a valid mobile number.";
//     return null;
//   }
//   if (!/^\d{10}$/.test(v)) return "Please enter a valid 10-digit mobile number.";
//   if (/^(\d)\1{9}$/.test(v)) return "Please enter a valid mobile number.";
//   if (/^[01234]/.test(v)) return "Please enter a valid mobile number.";
//   return null;
// }

// /** Validate the local part of a mobile (digits only, no country code). */
// function validateLocalNumber(val) {
//   if (!val || !val.trim()) return null;
//   if (!/^\d{6,15}$/.test(val.trim())) return "Enter 6–15 digits only.";
//   if (/^(\d)\1{5,}$/.test(val.trim())) return "Please enter a valid mobile number.";
//   return null;
// }

// /** Validate an email address. */
// function validateEmail(val) {
//   if (!val || !val.trim()) return null;
//   const v = val.trim();
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
//   if (isSpam(v.split("@")[0])) return "Please enter a valid email address.";
//   return null;
// }

// /** Validate a URL (https:// required). */
// function validateUrl(val) {
//   if (!val || !val.trim()) return null;
//   try {
//     const u = new URL(val.trim());
//     if (!["http:", "https:"].includes(u.protocol)) return "URL must start with https://.";
//     if (!u.hostname.includes(".")) return "Please enter a valid URL.";
//     return null;
//   } catch {
//     return "Please enter a valid URL (e.g. https://example.com).";
//   }
// }

// /** Validate name-like text: org name, college, course topic. */
// function validateName(val, fieldLabel) {
//   if (!val || !val.trim()) return null;
//   const v = sanitize(val).trim();
//   if (v.length < 2) return `${fieldLabel} must be at least 2 characters.`;
//   if (v.length > 100) return `${fieldLabel} must be under 100 characters.`;
//   if (/^\d+$/.test(v)) return `${fieldLabel} cannot be numbers only.`;
//   if (!/[a-zA-Z]/.test(v)) return `${fieldLabel} must contain at least one letter.`;
//   if (isSpam(v)) return `Please enter a valid ${fieldLabel.toLowerCase()}.`;
//   return null;
// }

// /** Validate location fields: city, state, country. */
// function validateLocation(val, fieldLabel) {
//   if (!val || !val.trim()) return null;
//   const v = sanitize(val).trim();
//   if (v.length < 2) return `${fieldLabel} must be at least 2 characters.`;
//   if (/^\d+$/.test(v)) return `${fieldLabel} cannot be numbers only.`;
//   if (!/[a-zA-Z]/.test(v)) return `${fieldLabel} must contain letters.`;
//   if (isSpam(v)) return `Please enter a valid ${fieldLabel.toLowerCase()}.`;
//   return null;
// }

// /** Validate year of passing. */
// function validateYear(val) {
//   if (!val || !val.trim()) return null;
//   const v = val.trim();
//   if (!/^\d{4}$/.test(v)) return "Please enter a valid 4-digit year.";
//   const y = Number(v);
//   const cur = new Date().getFullYear();
//   if (y < 1980 || y > cur + 5) return `Year must be between 1980 and ${cur + 5}.`;
//   return null;
// }

// /** Validate date of birth. */
// function validateDob(val) {
//   if (!val) return null;
//   const dob = new Date(val);
//   const now = new Date();
//   if (dob >= now) return "Date of birth cannot be in the future.";
//   const ageYears = (now - dob) / (365.25 * 24 * 60 * 60 * 1000);
//   if (ageYears < 10) return "Age must be at least 10 years.";
//   return null;
// }

// /** Validate free-text description field. */
// function validateDescription(val) {
//   if (!val || !val.trim()) return null;
//   const v = sanitize(val).trim();
//   if (v.length < 10) return "Description must be at least 10 characters.";
//   if (v.length > 1000) return "Description must be under 1000 characters.";
//   if (isSpam(v)) return "Please enter a meaningful description.";
//   return null;
// }

// /* ─────────────────────────────────────────────────────────────
//    SYNC PROFILE COMPLETED — unchanged
// ───────────────────────────────────────────────────────────── */
// const syncProfileCompleted = (value) => {
//   try {
//     const cached = JSON.parse(localStorage.getItem("lms_user") || "{}");
//     localStorage.setItem("lms_user", JSON.stringify({ ...cached, profileCompleted: !!value }));
//   } catch {
//     localStorage.setItem("lms_user", JSON.stringify({ profileCompleted: !!value }));
//   }
//   if (value) {
//     authService.markProfileCompleted().catch((err) =>
//       console.error("Failed to sync profileCompleted with backend:", err)
//     );
//   }
// };

// /* ─────────────────────────────────────────────────────────────
//    DESIGN TOKENS
// ───────────────────────────────────────────────────────────── */
// const TOKEN = {
//   orange:    "#F97316",
//   green:     "#16A34A",
//   orangeSoft:"rgba(249,115,22,0.10)",
//   greenSoft: "rgba(22,163,74,0.10)",
//   surface:   "#FFFFFF",
//   bg:        "#F8FAFC",
//   border:    "#E2E8F0",
//   text:      "#0F172A",
//   muted:     "#64748B",
//   subtle:    "#F1F5F9",
//   error:     "#EF4444",
//   errorSoft: "#FEF2F2",
//   errorBorder:"#FECACA",
// };

// /* ─────────────────────────────────────────────────────────────
//    GLOBAL STYLES
// ───────────────────────────────────────────────────────────── */
// const GLOBAL_STYLES = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap');

//   .pp-root *, .pp-root *::before, .pp-root *::after { box-sizing: border-box; }
//   .pp-root { font-family: 'Plus Jakarta Sans', sans-serif; }

//   .pp-scroll::-webkit-scrollbar { width: 4px; }
//   .pp-scroll::-webkit-scrollbar-track { background: transparent; }
//   .pp-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }

//   @keyframes ppFadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
//   .pp-fade { animation: ppFadeIn .28s ease both; }

//   @keyframes ppSpin { to { transform: rotate(360deg); } }

//   @keyframes ppDropOpen { from { opacity:0; transform:translateY(-6px) scale(0.98); } to { opacity:1; transform:none; } }
//   .pp-drop-open { animation: ppDropOpen .18s ease both; }

//   @keyframes ppPing { 75%,100% { transform:scale(2); opacity:0; } }
//   .pp-ping { animation: ppPing 1.4s cubic-bezier(0,0,0.2,1) infinite; }

//   .pp-btn { transition: all .18s; }
//   .pp-btn:hover:not(:disabled) { transform: translateY(-1px); }
//   .pp-btn:active:not(:disabled) { transform: translateY(0); }

//   .pp-chip { transition: all .15s; }
//   .pp-chip:hover { transform: translateY(-1px); }

//   .pp-card-hover { transition: box-shadow .2s, transform .2s; }
//   .pp-card-hover:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-1px); }

//   @keyframes ppToast { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:none; } }
//   .pp-toast { animation: ppToast .28s ease both; }

//   /* Input focus glow — override per accent */
//   .pp-input:focus { outline:none; }
//   .pp-input { transition: border-color .2s, box-shadow .2s; }
// `;

// function injectStyles() {
//   if (document.getElementById("pp-styles")) return;
//   const el = document.createElement("style");
//   el.id = "pp-styles";
//   el.textContent = GLOBAL_STYLES;
//   document.head.appendChild(el);
// }

// /* ─────────────────────────────────────────────────────────────
//    ROLE CONFIG — unchanged
// ───────────────────────────────────────────────────────────── */
// const ROLE_CONFIG = {
//   student:  { label: "Student",  id: "STU-0012", name: "Student User",  email: "student@example.com",  joined: "—", lastLogin: "—", avatar: "S", heroGradient: "linear-gradient(135deg, #7B2FF7 0%, #C030A0 50%, #F4962A 100%)", accent: "violet",  plan: "Student Pro",    planPrice: "₹499/mo" },
//   trainer:  { label: "Trainer",  id: "TRN-0005", name: "Trainer User",  email: "trainer@example.com",  joined: "—", lastLogin: "—", avatar: "T", heroGradient: "linear-gradient(135deg, #7B2FF7 0%, #C030A0 50%, #F4962A 100%)", accent: "emerald",  plan: "Trainer Elite",  planPrice: "₹1,299/mo" },
//   admin:    { label: "Admin",    id: "ADM-0001", name: "Admin User",    email: "admin@example.com",    joined: "—", lastLogin: "—", avatar: "A", heroGradient: "linear-gradient(135deg, #7B2FF7 0%, #C030A0 50%, #F4962A 100%)", accent: "rose",     plan: "Enterprise",     planPrice: "₹4,999/mo" },
//   business: { label: "Business", id: "BUS-0003", name: "Business User", email: "business@example.com", joined: "—", lastLogin: "—", avatar: "B", heroGradient: "linear-gradient(135deg, #7B2FF7 0%, #C030A0 50%, #F4962A 100%)", accent: "amber",    plan: "Business Pro",   planPrice: "₹8,999/mo" },
// };

// const ACCENT = {
//   violet:  { primary: "#7C3AED", soft: "rgba(124,58,237,0.1)",  btn: "#7C3AED", ring: "#7C3AED" },
//   emerald: { primary: "#059669", soft: "rgba(5,150,105,0.1)",   btn: "#059669", ring: "#059669" },
//   rose:    { primary: "#E11D48", soft: "rgba(225,29,72,0.1)",   btn: "#E11D48", ring: "#E11D48" },
//   amber:   { primary: "#D97706", soft: "rgba(217,119,6,0.1)",   btn: "#D97706", ring: "#D97706" },
// };

// /* ─────────────────────────────────────────────────────────────
//    COUNTRY CODES
// ───────────────────────────────────────────────────────────── */
// const COUNTRY_CODES = [
//   { code: "+91",  label: "🇮🇳 +91  India" },
//   { code: "+1",   label: "🇺🇸 +1   USA / Canada" },
//   { code: "+44",  label: "🇬🇧 +44  UK" },
//   { code: "+61",  label: "🇦🇺 +61  Australia" },
//   { code: "+971", label: "🇦🇪 +971 UAE" },
//   { code: "+65",  label: "🇸🇬 +65  Singapore" },
//   { code: "+60",  label: "🇲🇾 +60  Malaysia" },
//   { code: "+49",  label: "🇩🇪 +49  Germany" },
//   { code: "+33",  label: "🇫🇷 +33  France" },
//   { code: "+81",  label: "🇯🇵 +81  Japan" },
//   { code: "+86",  label: "🇨🇳 +86  China" },
//   { code: "+7",   label: "🇷🇺 +7   Russia" },
//   { code: "+55",  label: "🇧🇷 +55  Brazil" },
//   { code: "+27",  label: "🇿🇦 +27  South Africa" },
//   { code: "+92",  label: "🇵🇰 +92  Pakistan" },
//   { code: "+880", label: "🇧🇩 +880 Bangladesh" },
//   { code: "+94",  label: "🇱🇰 +94  Sri Lanka" },
//   { code: "+977", label: "🇳🇵 +977 Nepal" },
// ];

// const INDUSTRIES = ["EdTech","FinTech","HealthTech","E-Commerce","Consulting","Manufacturing","Retail","Logistics","Real Estate","Media","Government","NGO","Other"];

// const PLATFORMS_LIST = ["Blog","YouTube","Podcast","LinkedIn","Instagram","Twitter/X","Newsletter","TikTok","Other"];

// /* ─────────────────────────────────────────────────────────────
//    SEARCHABLE DROPDOWN COMPONENT
// ───────────────────────────────────────────────────────────── */
// const SearchableDropdown = ({
//   value, onChange, options, placeholder = "Select…",
//   accentColor = TOKEN.orange, allowAddNew = false, disabled = false,
// }) => {
//   const [open, setOpen]             = useState(false);
//   const [query, setQuery]           = useState("");
//   const [localOptions, setLocalOptions] = useState(options || []);
//   const [addNewMode, setAddNewMode] = useState(false);
//   const [newVal, setNewVal]         = useState("");
//   const [addErr, setAddErr]         = useState("");
//   const ref = useRef(null);

//   useEffect(() => { setLocalOptions(options || []); }, [options]);

//   useEffect(() => {
//     const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const filtered = localOptions.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

//   const select = (opt) => { onChange(opt); setOpen(false); setQuery(""); };
//   const clear = (e) => { e.stopPropagation(); onChange(""); };

//   /** Validate custom option with the hardened validator before adding. */
//   const handleAddNew = () => {
//     const v = sanitize(newVal).trim();
//     if (v.length < 2) { setAddErr("Minimum 2 characters required."); return; }
//     if (v.length > 80) { setAddErr("Maximum 80 characters allowed."); return; }
//     if (/^\d+$/.test(v)) { setAddErr("Numbers-only values are not allowed."); return; }
//     if (!/[a-zA-Z]/.test(v)) { setAddErr("Must contain at least one letter."); return; }
//     if (isSpam(v)) { setAddErr("Please enter a meaningful value."); return; }
//     if (localOptions.map((o) => o.toLowerCase()).includes(v.toLowerCase())) {
//       setAddErr("This option already exists."); return;
//     }
//     const capitalized = v.charAt(0).toUpperCase() + v.slice(1);
//     setLocalOptions((prev) => [...prev, capitalized]);
//     onChange(capitalized);
//     setAddNewMode(false); setNewVal(""); setAddErr(""); setOpen(false); setQuery("");
//   };

//   return (
//     <div ref={ref} style={{ position: "relative" }}>
//       <button
//         type="button" disabled={disabled}
//         onClick={() => { if (!disabled) setOpen((p) => !p); }}
//         style={{
//           width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
//           padding: "10px 14px", borderRadius: 10,
//           border: `1.5px solid ${open ? accentColor : TOKEN.border}`,
//           background: disabled ? TOKEN.subtle : TOKEN.surface,
//           cursor: disabled ? "not-allowed" : "pointer",
//           boxShadow: open ? `0 0 0 3px ${accentColor}22` : "none",
//           transition: "all .18s", fontFamily: "'Plus Jakarta Sans', sans-serif",
//           fontSize: 13.5, color: value ? TOKEN.text : TOKEN.muted,
//         }}
//       >
//         <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//           {value || placeholder}
//         </span>
//         <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
//           {value && !disabled && (
//             <X onClick={clear} style={{ width: 13, height: 13, color: TOKEN.muted, cursor: "pointer" }} />
//           )}
//           <ChevronDown style={{ width: 14, height: 14, color: TOKEN.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
//         </span>
//       </button>

//       {open && (
//         <div className="pp-drop-open" style={{
//           position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 999,
//           background: TOKEN.surface, border: `1.5px solid ${TOKEN.border}`,
//           borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden",
//         }}>
//           <div style={{ padding: "10px 10px 6px", borderBottom: `1px solid ${TOKEN.border}` }}>
//             <div style={{ position: "relative" }}>
//               <Search style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: TOKEN.muted }} />
//               <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
//                 style={{ width: "100%", padding: "7px 10px 7px 28px", border: `1px solid ${TOKEN.border}`, borderRadius: 8, fontSize: 12.5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: TOKEN.text, background: TOKEN.subtle, outline: "none" }} />
//             </div>
//           </div>

//           <div className="pp-scroll" style={{ maxHeight: 200, overflowY: "auto" }}>
//             {filtered.length === 0 && !addNewMode && (
//               <p style={{ padding: "12px 14px", color: TOKEN.muted, fontSize: 12.5, textAlign: "center" }}>No results</p>
//             )}
//             {filtered.map((opt) => (
//               <button key={opt} type="button" onClick={() => select(opt)} style={{
//                 width: "100%", textAlign: "left", padding: "9px 14px",
//                 background: value === opt ? `${accentColor}12` : "transparent",
//                 border: "none", cursor: "pointer", fontSize: 13,
//                 color: value === opt ? accentColor : TOKEN.text,
//                 fontWeight: value === opt ? 600 : 400,
//                 fontFamily: "'Plus Jakarta Sans', sans-serif",
//                 display: "flex", alignItems: "center", gap: 8, transition: "background .12s",
//               }}
//                 onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = TOKEN.subtle; }}
//                 onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = "transparent"; }}
//               >
//                 {value === opt && <CheckCircle style={{ width: 13, height: 13, color: accentColor, flexShrink: 0 }} />}
//                 {opt}
//               </button>
//             ))}
//           </div>

//           {allowAddNew && (
//             <div style={{ borderTop: `1px solid ${TOKEN.border}`, padding: "8px 10px" }}>
//               {!addNewMode ? (
//                 <button type="button" onClick={() => setAddNewMode(true)} style={{
//                   display: "flex", alignItems: "center", gap: 6, padding: "7px 10px",
//                   border: `1.5px dashed ${accentColor}`, borderRadius: 8, background: `${accentColor}08`,
//                   color: accentColor, fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%",
//                   fontFamily: "'Plus Jakarta Sans', sans-serif",
//                 }}>
//                   <Plus style={{ width: 13, height: 13 }} /> Add New Option
//                 </button>
//               ) : (
//                 <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
//                   <div style={{ display: "flex", gap: 6 }}>
//                     <input autoFocus value={newVal} onChange={(e) => { setNewVal(e.target.value); setAddErr(""); }}
//                       placeholder="Type new option…" onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
//                       style={{ flex: 1, padding: "7px 10px", border: `1.5px solid ${addErr ? TOKEN.error : TOKEN.border}`, borderRadius: 8, fontSize: 12.5, fontFamily: "'Plus Jakarta Sans', sans-serif", color: TOKEN.text, outline: "none" }} />
//                     <button type="button" onClick={handleAddNew} style={{ padding: "7px 12px", background: accentColor, border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
//                     <button type="button" onClick={() => { setAddNewMode(false); setNewVal(""); setAddErr(""); }} style={{ padding: "7px 10px", background: TOKEN.subtle, border: `1px solid ${TOKEN.border}`, borderRadius: 8, fontSize: 12, cursor: "pointer", color: TOKEN.muted }}>✕</button>
//                   </div>
//                   {addErr && (
//                     <p style={{ fontSize: 11, color: TOKEN.error, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
//                       <AlertCircle style={{ width: 11, height: 11 }} />{addErr}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    MULTI-CHIP SELECTOR — deduplication enforced
// ───────────────────────────────────────────────────────────── */
// const MultiChipSelector = ({ values = [], onChange, options = [], accentColor }) => {
//   const toggle = (opt) => {
//     const unique = [...new Set(values)]; // always deduplicate
//     onChange(unique.includes(opt) ? unique.filter((v) => v !== opt) : [...unique, opt]);
//   };
//   return (
//     <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//       {options.map((opt) => {
//         const on = values.includes(opt);
//         return (
//           <button key={opt} type="button" onClick={() => toggle(opt)} className="pp-chip" style={{
//             padding: "6px 14px", borderRadius: 20,
//             border: `1.5px solid ${on ? accentColor : TOKEN.border}`,
//             background: on ? `${accentColor}14` : TOKEN.surface,
//             color: on ? accentColor : TOKEN.muted,
//             fontSize: 12.5, fontWeight: on ? 700 : 500, cursor: "pointer",
//             fontFamily: "'Plus Jakarta Sans', sans-serif",
//             display: "flex", alignItems: "center", gap: 5,
//           }}>
//             {on && <CheckCircle style={{ width: 12, height: 12 }} />}
//             {opt}
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SHARED FORM PRIMITIVES
// ───────────────────────────────────────────────────────────── */
// const FieldLabel = ({ icon: Icon, label, required }) => (
//   <label style={{
//     display: "flex", alignItems: "center", gap: 6, fontSize: 11.5,
//     fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
//     color: TOKEN.muted, marginBottom: 6,
//   }}>
//     {Icon && <Icon style={{ width: 13, height: 13 }} />}
//     {label}{required && <span style={{ color: TOKEN.error }}>*</span>}
//   </label>
// );

// /** Text input with error-aware border. */
// const TextInput = ({ name, value, onChange, placeholder, type = "text", disabled, error, accentColor = TOKEN.orange, onFocus, onBlur }) => (
//   <input
//     className="pp-input" type={type} name={name} value={value}
//     onChange={onChange} placeholder={placeholder} disabled={disabled}
//     onFocus={onFocus} onBlur={onBlur}
//     style={{
//       width: "100%", padding: "10px 14px", borderRadius: 10,
//       border: `1.5px solid ${error ? TOKEN.error : TOKEN.border}`,
//       background: disabled ? TOKEN.subtle : TOKEN.surface,
//       fontSize: 13.5, color: TOKEN.text,
//       fontFamily: "'Plus Jakarta Sans', sans-serif",
//       boxShadow: error ? `0 0 0 3px ${TOKEN.errorSoft}` : "none",
//       transition: "border-color .2s, box-shadow .2s",
//     }}
//   />
// );

// const StaticField = ({ value }) => (
//   <div style={{
//     padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`,
//     background: TOKEN.subtle, fontSize: 13.5, color: value ? TOKEN.text : TOKEN.muted,
//     minHeight: 42, display: "flex", alignItems: "center",
//   }}>
//     {value || "—"}
//   </div>
// );

// const LockedField = ({ icon: Icon, label, value }) => (
//   <div>
//     <FieldLabel icon={Icon} label={label} />
//     <div style={{ position: "relative" }}>
//       <StaticField value={value} />
//       <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, padding: "2px 8px", borderRadius: 20, background: TOKEN.subtle, border: `1px solid ${TOKEN.border}`, color: TOKEN.muted, fontWeight: 600, letterSpacing: "0.04em" }}>LOCKED</span>
//     </div>
//   </div>
// );

// /** Inline field-level error message. */
// const ErrorMsg = ({ msg }) => msg ? (
//   <p style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: TOKEN.error, marginTop: 5, fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//     <AlertCircle style={{ width: 11, height: 11, flexShrink: 0 }} />{msg}
//   </p>
// ) : null;

// const SectionHeader = ({ icon: Icon, title }) => (
//   <div style={{
//     display: "flex", alignItems: "center", gap: 8,
//     fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
//     color: TOKEN.muted, marginBottom: 16, paddingBottom: 10, borderBottom: `1.5px solid ${TOKEN.border}`,
//   }}>
//     {Icon && <div style={{ width: 22, height: 22, borderRadius: 6, background: TOKEN.subtle, display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <Icon style={{ width: 12, height: 12, color: TOKEN.orange }} />
//     </div>}
//     {title}
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────
//    TOAST
// ───────────────────────────────────────────────────────────── */
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
//   const isOk = type === "success";
//   return (
//     <div className="pp-toast" style={{
//       position: "fixed", top: 20, right: 20, zIndex: 9999,
//       display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
//       borderRadius: 12, border: `1.5px solid ${isOk ? "#BBF7D0" : TOKEN.errorBorder}`,
//       background: isOk ? "#F0FDF4" : TOKEN.errorSoft,
//       boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxWidth: 340,
//       fontSize: 13.5, fontWeight: 600,
//       color: isOk ? "#15803D" : "#DC2626",
//       fontFamily: "'Plus Jakarta Sans', sans-serif",
//     }}>
//       {isOk
//         ? <CheckCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
//         : <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
//       }
//       <span style={{ flex: 1 }}>{message}</span>
//       <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit", opacity: 0.6 }}>
//         <X style={{ width: 13, height: 13 }} />
//       </button>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    AVATAR — unchanged
// ───────────────────────────────────────────────────────────── */
// export const Avatar = ({
//   initials = "U", size = 40, editable = false,
//   online = false, shape = "circle", className = "",
// }) => {
//   const ctx = useAvatarContext();
//   const profileImage = ctx?.profileImage ?? null;
//   const uploadImage  = ctx?.uploadImage  ?? (() => {});
//   const removeImage  = ctx?.removeImage  ?? (() => {});
//   const fileRef = useRef(null);
//   const radius = shape === "circle" ? "9999px" : "14px";
//   const dotSize   = Math.max(10, Math.round(size * 0.22));
//   const dotOffset = Math.round(size * 0.04);

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (file && (file.type === "image/jpeg" || file.type === "image/png")) uploadImage(file);
//     e.target.value = "";
//   };

//   return (
//     <div className={`relative inline-flex shrink-0 ${className}`} style={{ width: size, height: size }}>
//       <div
//         onClick={editable ? () => fileRef.current?.click() : undefined}
//         style={{
//           width: size, height: size, borderRadius: radius, overflow: "hidden",
//           border: "2.5px solid rgba(255,255,255,0.45)",
//           boxShadow: "0 0 0 3px rgba(249,115,22,0.25), 0 4px 16px rgba(0,0,0,0.15)",
//           background: profileImage ? "transparent" : "linear-gradient(135deg,#7B2FF7,#C030A0)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           cursor: editable ? "pointer" : "default",
//           transition: "transform 0.2s, box-shadow 0.2s", position: "relative",
//         }}
//         className={editable ? "group hover:scale-105" : ""}
//         title={editable ? "Click to change photo" : undefined}
//       >
//         {profileImage
//           ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//           : <span style={{ color: "#fff", fontWeight: 800, fontSize: Math.max(11, Math.round(size * 0.38)), letterSpacing: "-0.5px", userSelect: "none", fontFamily: "'Sora', sans-serif" }}>{initials}</span>
//         }
//         {editable && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ borderRadius: radius }}>
//             <Camera style={{ width: Math.round(size * 0.32), height: Math.round(size * 0.32), color: "#fff" }} />
//           </div>
//         )}
//       </div>

//       {online && (
//         <span style={{ position: "absolute", bottom: dotOffset, right: dotOffset, width: dotSize, height: dotSize, borderRadius: "50%", background: "#22c55e", border: "2px solid white", boxShadow: "0 0 0 1px rgba(34,197,94,0.4)" }}>
//           <span className="pp-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22c55e", opacity: 0.6 }} />
//         </span>
//       )}

//       {editable && profileImage && (
//         <button onClick={(e) => { e.stopPropagation(); removeImage(); }} style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, padding: 0 }}>
//           <X style={{ width: 10, height: 10, color: "#fff", strokeWidth: 3 }} />
//         </button>
//       )}

//       {editable && (
//         <input ref={fileRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handleFile} />
//       )}
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    SHARED EDIT/SAVE BUTTON PAIR
// ───────────────────────────────────────────────────────────── */
// const EditSaveButtons = ({ editing, saving, onEdit, onSave, onCancel, accentColor, saveLabel = "Save Changes" }) => (
//   <div style={{ display: "flex", gap: 8 }}>
//     {editing ? (
//       <>
//         <button onClick={onCancel} disabled={saving} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`, background: TOKEN.surface, fontSize: 13, fontWeight: 600, color: TOKEN.muted, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//           <X style={{ width: 14, height: 14 }} /> Cancel
//         </button>
//         <button onClick={onSave} disabled={saving} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 10, border: "none", background: accentColor, color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.65 : 1, boxShadow: `0 4px 14px ${accentColor}40`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//           {saving
//             ? <><span style={{ display: "inline-block", width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "ppSpin .7s linear infinite" }} /> Saving…</>
//             : <><Save style={{ width: 14, height: 14 }} /> {saveLabel}</>
//           }
//         </button>
//       </>
//     ) : (
//       <button onClick={onEdit} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`, background: TOKEN.surface, fontSize: 13, fontWeight: 600, color: TOKEN.text, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//         <Edit3 style={{ width: 14, height: 14 }} /> Edit
//       </button>
//     )}
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────
//    SECTION CARD
// ───────────────────────────────────────────────────────────── */
// const SectionCard = ({ children, style }) => (
//   <div className="pp-card-hover" style={{ background: TOKEN.surface, borderRadius: 16, padding: "22px 24px", border: `1.5px solid ${TOKEN.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", ...style }}>
//     {children}
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────
//    PROFILE INFO TAB — validation added for name field
// ───────────────────────────────────────────────────────────── */
// const ProfileInfoTab = ({ user, accent, onProfileUpdate, returnTo }) => {
//   const navigate = useNavigate();
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [name, setName]       = useState(user.name);
//   const [nameErr, setNameErr] = useState("");
//   const [toast, setToast]     = useState(null);
//   const { uploadImage, removeImage, profileImage } = useAvatarContext();
//   const fileInputRef = useRef(null);
//   const ac = ACCENT[accent];

//   useEffect(() => { if (!editing) setName(user.name); }, [user.name, editing]);

//   const showToast = (message, type = "success") => setToast({ message, type });

//   const handleSave = async () => {
//     if (!name || !name.trim()) { setNameErr("Name cannot be empty."); return; }
//     const nameValidation = validateName(name, "Full name");
//     if (nameValidation) { setNameErr(nameValidation); return; }

//     setSaving(true);
//     try {
//       await userService.updateMyProfile({ displayName: sanitize(name.trim()) });
//       if (onProfileUpdate) onProfileUpdate({ name: sanitize(name.trim()) });
//       setEditing(false); setNameErr("");
//       showToast("Profile updated successfully");
//       if (returnTo) setTimeout(() => navigate(returnTo), 900);
//     } catch (err) {
//       console.error("Save failed:", err);
//       showToast("Failed to update profile. Please try again.", "error");
//     } finally { setSaving(false); }
//   };

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
//         <div>
//           <h3 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.text, fontFamily: "'Sora', sans-serif", margin: 0 }}>Personal Information</h3>
//           <p style={{ fontSize: 13, color: TOKEN.muted, marginTop: 3 }}>Manage your profile details and photo</p>
//         </div>
//         <EditSaveButtons editing={editing} saving={saving} onEdit={() => { setEditing(true); setNameErr(""); }} onSave={handleSave} onCancel={() => { setEditing(false); setNameErr(""); }} accentColor={ac.primary} saveLabel="Save Profile" />
//       </div>

//       {/* Photo card */}
//       <SectionCard style={{ display: "flex", alignItems: "center", gap: 20, background: `linear-gradient(135deg, ${ac.primary}08 0%, ${TOKEN.surface} 100%)`, border: `1.5px solid ${ac.primary}22` }}>
//         <Avatar initials={user.avatar} size={80} editable online shape="rounded" />
//         <div style={{ flex: 1 }}>
//           <p style={{ fontSize: 14, fontWeight: 700, color: TOKEN.text, marginBottom: 4 }}>Profile Photo</p>
//           <p style={{ fontSize: 11.5, color: TOKEN.muted, marginBottom: 12 }}>JPG or PNG · Saved locally · Updates Navbar & Sidebar instantly</p>
//           <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//             <button onClick={() => fileInputRef.current?.click()} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "none", background: ac.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//               <Upload style={{ width: 12, height: 12 }} /> Upload Photo
//             </button>
//             {profileImage && (
//               <button onClick={removeImage} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${TOKEN.errorBorder}`, background: TOKEN.errorSoft, color: "#DC2626", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//                 <X style={{ width: 12, height: 12 }} /> Remove Photo
//               </button>
//             )}
//           </div>
//           <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" style={{ display: "none" }}
//             onChange={(e) => { const f = e.target.files?.[0]; if (f && (f.type === "image/jpeg" || f.type === "image/png")) uploadImage(f); e.target.value = ""; }} />
//         </div>
//       </SectionCard>

//       <SectionCard>
//         <SectionHeader icon={User} title="Account Details" />
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           <div>
//             <FieldLabel icon={User} label="Full Name" />
//             {editing ? (
//               <>
//                 <TextInput name="name" value={name} onChange={(e) => { setName(e.target.value); setNameErr(""); }} placeholder="Your full name" error={!!nameErr} accentColor={ac.primary}
//                   onFocus={(e) => { e.target.style.borderColor = nameErr ? TOKEN.error : ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; }}
//                   onBlur={(e) => { e.target.style.borderColor = nameErr ? TOKEN.error : TOKEN.border; e.target.style.boxShadow = nameErr ? `0 0 0 3px ${TOKEN.errorSoft}` : "none"; }}
//                 />
//                 <ErrorMsg msg={nameErr} />
//               </>
//             ) : <StaticField value={name} />}
//           </div>
//           <LockedField icon={IdCard} label="Role" value={user.label} />
//           <LockedField icon={Mail} label="Email Address" value={user.email} />
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    OPTION LISTS
// ───────────────────────────────────────────────────────────── */
// const INDIAN_STATES_LIST = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi (NCT)","Jammu and Kashmir","Chandigarh","Puducherry","Ladakh","Andaman and Nicobar Islands"];
// const INDIAN_CITIES_LIST = ["Mumbai","Delhi","Bengaluru","Hyderabad","Ahmedabad","Chennai","Kolkata","Pune","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Thane","Bhopal","Visakhapatnam","Patna","Vadodara","Ghaziabad","Ludhiana","Agra","Nashik","Faridabad","Meerut","Rajkot","Varanasi","Amritsar","Ranchi","Chandigarh","Coimbatore","Kochi","Guwahati"];
// const COUNTRIES_LIST = ["India","United States","United Kingdom","Canada","Australia","UAE","Singapore","Germany","France","Japan","China","Malaysia","Indonesia","Philippines","Thailand","Vietnam","Pakistan","Bangladesh","Sri Lanka","Nepal","Russia","Brazil","Mexico","South Africa","Nigeria","Egypt","Turkey","Poland","Netherlands","Spain","Italy","Sweden","Switzerland","Ireland","New Zealand"];
// const QUALIFICATIONS_LIST = ["10th / Secondary","12th / Senior Secondary","Diploma","B.Tech / B.E","B.Sc / B.A / B.Com","M.Tech / M.Sc","MBA / M.A","PhD / Doctorate","ITI / Vocational Training"];
// const DOMAINS_LIST = ["Web Development","Full Stack Development","Data Science","AI / Machine Learning","Mobile App Development","Cloud Computing","DevOps","Cybersecurity","UI / UX Design","Digital Marketing","Business Analytics"];
// const EXPERIENCE_LIST = ["Fresher / No experience","0–1 year","1–2 years","2–5 years","5–10 years","10+ years"];
// const CURRENT_YEAR = new Date().getFullYear();
// const YEAR_OPTIONS = Array.from({ length: 35 }, (_, i) => String(CURRENT_YEAR + 2 - i));

// /* ─────────────────────────────────────────────────────────────
//    STUDENT DETAILS TAB — full validation hardening
// ───────────────────────────────────────────────────────────── */
// const StudentDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [toast, setToast]     = useState(null);
//   const [errors, setErrors]   = useState({});

//   const empty = { dialCode: "+91", localNumber: "", dateOfBirth: "", gender: "", city: "", state: "", country: "", qualification: "", collegeName: "", yearOfPassing: "", domain: "", experience: "" };
//   const [form, setForm]   = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   const parseMobile = useCallback((raw = "") => {
//     if (!raw) return { dialCode: "+91", localNumber: "" };
//     const match = COUNTRY_CODES.find((c) => raw.startsWith(c.code));
//     return match
//       ? { dialCode: match.code, localNumber: raw.slice(match.code.length).trim() }
//       : { dialCode: "+91", localNumber: raw };
//   }, []);

//   useEffect(() => {
//     userService.getStudentProfile().then((res) => {
//       const d = res.data || {};
//       const { dialCode, localNumber } = parseMobile(d.mobileNumber);
//       const loaded = { dialCode, localNumber, dateOfBirth: d.dateOfBirth || "", gender: d.gender || "", city: d.city || "", state: d.state || "", country: d.country || "", qualification: d.qualification || "", collegeName: d.collegeName || "", yearOfPassing: d.yearOfPassing || "", domain: d.domain || "", experience: d.experience || "" };
//       setForm(loaded); setDraft(loaded);
//     }).catch(() => {});
//   }, [parseMobile]);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit = () => { setDraft({ ...form }); setErrors({}); setEditing(true); };
//   const cancelEdit = () => { setDraft({ ...form }); setErrors({}); setEditing(false); };

//   const handleChange = useCallback((e) => {
//     const { name, value } = e.target;
//     setDraft((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: "" }));
//   }, []);

//   /* ── Full validation for StudentDetailsTab ── */
//   const validate = (d) => {
//     const errs = {};

//     const mobileErr = validateLocalNumber(d.localNumber);
//     if (mobileErr) errs.localNumber = mobileErr;

//     const dobErr = validateDob(d.dateOfBirth);
//     if (dobErr) errs.dateOfBirth = dobErr;

//     const yearErr = validateYear(d.yearOfPassing);
//     if (yearErr) errs.yearOfPassing = yearErr;

//     const collegeErr = validateName(d.collegeName, "College name");
//     if (collegeErr) errs.collegeName = collegeErr;

//     const cityErr = validateLocation(d.city, "City");
//     if (cityErr) errs.city = cityErr;

//     const stateErr = validateLocation(d.state, "State");
//     if (stateErr) errs.state = stateErr;

//     const countryErr = validateLocation(d.country, "Country");
//     if (countryErr) errs.country = countryErr;

//     if (d.qualification && isSpam(d.qualification)) errs.qualification = "Please enter a valid qualification.";
//     if (d.domain && isSpam(d.domain)) errs.domain = "Please enter a valid domain.";
//     if (d.experience && isSpam(d.experience)) errs.experience = "Please enter a valid experience value.";

//     return errs;
//   };

//   const handleSave = async () => {
//     const errs = validate(draft);
//     if (Object.keys(errs).length) {
//       setErrors(errs);
//       showToast("Please fix the errors below.", "error");
//       return; // DO NOT save
//     }
//     setSaving(true);
//     try {
//       const payload = {
//         mobileNumber: draft.localNumber.trim() ? `${draft.dialCode}${draft.localNumber.trim()}` : "",
//         dateOfBirth:  draft.dateOfBirth,
//         gender:       draft.gender,
//         city:         sanitize(draft.city),
//         state:        sanitize(draft.state),
//         country:      sanitize(draft.country),
//         qualification: sanitize(draft.qualification),
//         collegeName:  sanitize(draft.collegeName),
//         yearOfPassing: draft.yearOfPassing,
//         domain:       sanitize(draft.domain),
//         experience:   draft.experience,
//       };
//       await userService.updateStudentProfile(payload);
//       setForm({ ...draft }); setEditing(false);
//       showToast("Details saved successfully");
//       syncProfileCompleted(true);
//       if (returnTo) setTimeout(() => navigate(returnTo), 900);
//     } catch { showToast("Failed to save. Try again.", "error"); }
//     finally { setSaving(false); }
//   };

//   const displayMobile = form.localNumber ? `${form.dialCode} ${form.localNumber}` : "";

//   const inp = (fieldKey) => ({
//     style: {
//       width: "100%", padding: "10px 14px", borderRadius: 10,
//       border: `1.5px solid ${errors[fieldKey] ? TOKEN.error : TOKEN.border}`,
//       fontSize: 13.5, color: TOKEN.text,
//       fontFamily: "'Plus Jakarta Sans', sans-serif",
//       background: TOKEN.surface, outline: "none",
//       boxShadow: errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none",
//       transition: "border-color .2s, box-shadow .2s",
//     },
//     onFocus: (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; },
//     onBlur:  (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : TOKEN.border; e.target.style.boxShadow = errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none"; },
//   });

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//         <div>
//           <h3 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.text, fontFamily: "'Sora', sans-serif", margin: 0 }}>Profile Details</h3>
//           <p style={{ fontSize: 13, color: TOKEN.muted, marginTop: 3 }}>Personal, location and education information</p>
//         </div>
//         <EditSaveButtons editing={editing} saving={saving} onEdit={startEdit} onSave={handleSave} onCancel={cancelEdit} accentColor={ac.primary} saveLabel="Save Details" />
//       </div>

//       {/* Personal Info */}
//       <SectionCard>
//         <SectionHeader icon={User} title="Personal Info" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
//           {/* Mobile */}
//           <div>
//             <FieldLabel icon={Phone} label="Mobile Number" />
//             {editing ? (
//               <>
//                 <div style={{ display: "flex", gap: 8 }}>
//                   <select name="dialCode" value={draft.dialCode} onChange={handleChange}
//                     style={{ width: 130, padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif", color: TOKEN.text, background: TOKEN.surface, cursor: "pointer" }}>
//                     {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
//                   </select>
//                   <div style={{ flex: 1 }}>
//                     <input type="tel" name="localNumber" value={draft.localNumber}
//                       onChange={(e) => { handleChange(e); }}
//                       placeholder="9876543210" maxLength={15}
//                       {...inp("localNumber")}
//                     />
//                   </div>
//                 </div>
//                 <ErrorMsg msg={errors.localNumber} />
//               </>
//             ) : <StaticField value={displayMobile} />}
//           </div>

//           {/* DOB */}
//           <div>
//             <FieldLabel icon={Calendar} label="Date of Birth" />
//             {editing ? (
//               <>
//                 <input type="date" name="dateOfBirth" value={draft.dateOfBirth}
//                   onChange={(e) => { setDraft((p) => ({ ...p, dateOfBirth: e.target.value })); setErrors((p) => ({ ...p, dateOfBirth: "" })); }}
//                   max={new Date().toISOString().split("T")[0]}
//                   {...inp("dateOfBirth")}
//                 />
//                 <ErrorMsg msg={errors.dateOfBirth} />
//               </>
//             ) : <StaticField value={form.dateOfBirth} />}
//           </div>

//           {/* Gender */}
//           <div>
//             <FieldLabel icon={Users} label="Gender" />
//             {editing
//               ? <SearchableDropdown value={draft.gender} onChange={(v) => setDraft((p) => ({ ...p, gender: v }))} options={["Male","Female","Other","Prefer not to say"]} placeholder="Select gender" accentColor={ac.primary} />
//               : <StaticField value={form.gender} />
//             }
//           </div>
//         </div>
//       </SectionCard>

//       {/* Location */}
//       <SectionCard>
//         <SectionHeader icon={MapPin} title="Location" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
//           {[
//             { key: "city",    label: "City",    list: INDIAN_CITIES_LIST,  ph: "Select city"    },
//             { key: "state",   label: "State",   list: INDIAN_STATES_LIST,  ph: "Select state"   },
//             { key: "country", label: "Country", list: COUNTRIES_LIST,      ph: "Select country" },
//           ].map(({ key, label, list, ph }) => (
//             <div key={key}>
//               <FieldLabel icon={MapPin} label={label} />
//               {editing ? (
//                 <>
//                   <SearchableDropdown value={draft[key]} onChange={(v) => { setDraft((p) => ({ ...p, [key]: v })); setErrors((p) => ({ ...p, [key]: "" })); }} options={list} placeholder={ph} accentColor={ac.primary} allowAddNew />
//                   <ErrorMsg msg={errors[key]} />
//                 </>
//               ) : <StaticField value={form[key]} />}
//             </div>
//           ))}
//         </div>
//       </SectionCard>

//       {/* Education */}
//       <SectionCard>
//         <SectionHeader icon={GraduationCap} title="Education & Professional" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
//           <div>
//             <FieldLabel icon={BookOpen} label="Qualification" />
//             {editing ? (
//               <>
//                 <SearchableDropdown value={draft.qualification} onChange={(v) => { setDraft((p) => ({ ...p, qualification: v })); setErrors((p) => ({ ...p, qualification: "" })); }} options={QUALIFICATIONS_LIST} placeholder="Select qualification" accentColor={ac.primary} allowAddNew />
//                 <ErrorMsg msg={errors.qualification} />
//               </>
//             ) : <StaticField value={form.qualification} />}
//           </div>

//           <div>
//             <FieldLabel icon={Building2} label="College / Institute" />
//             {editing ? (
//               <>
//                 <input type="text" name="collegeName" value={draft.collegeName}
//                   onChange={(e) => { handleChange(e); }}
//                   placeholder="e.g. IIT Delhi"
//                   {...inp("collegeName")}
//                 />
//                 <ErrorMsg msg={errors.collegeName} />
//               </>
//             ) : <StaticField value={form.collegeName} />}
//           </div>

//           <div>
//             <FieldLabel icon={Calendar} label="Year of Passing" />
//             {editing ? (
//               <>
//                 <SearchableDropdown value={draft.yearOfPassing} onChange={(v) => { setDraft((p) => ({ ...p, yearOfPassing: v })); setErrors((p) => ({ ...p, yearOfPassing: "" })); }} options={YEAR_OPTIONS} placeholder="Select year" accentColor={ac.primary} />
//                 <ErrorMsg msg={errors.yearOfPassing} />
//               </>
//             ) : <StaticField value={form.yearOfPassing} />}
//           </div>

//           <div>
//             <FieldLabel icon={Briefcase} label="Domain / Area of Interest" />
//             {editing ? (
//               <>
//                 <SearchableDropdown value={draft.domain} onChange={(v) => { setDraft((p) => ({ ...p, domain: v })); setErrors((p) => ({ ...p, domain: "" })); }} options={DOMAINS_LIST} placeholder="Select domain" accentColor={ac.primary} allowAddNew />
//                 <ErrorMsg msg={errors.domain} />
//               </>
//             ) : <StaticField value={form.domain} />}
//           </div>

//           <div>
//             <FieldLabel icon={TrendingUp} label="Experience" />
//             {editing ? (
//               <>
//                 <SearchableDropdown value={draft.experience} onChange={(v) => { setDraft((p) => ({ ...p, experience: v })); setErrors((p) => ({ ...p, experience: "" })); }} options={EXPERIENCE_LIST} placeholder="Select experience" accentColor={ac.primary} />
//                 <ErrorMsg msg={errors.experience} />
//               </>
//             ) : <StaticField value={form.experience} />}
//           </div>
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    TRAINER DETAILS TAB — validation hardening
// ───────────────────────────────────────────────────────────── */
// const TrainerDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [toast, setToast]     = useState(null);
//   const [errors, setErrors]   = useState({});

//   const empty = { linkedinUrl: "", country: "", audienceSize: "", fullTimeRole: "", courseTopic: "", platforms: [] };
//   const [form, setForm]   = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   useEffect(() => {
//     userService.getTrainerProfile().then((res) => {
//       const d = res.data || {};
//       const loaded = {
//         linkedinUrl:  d.linkedinUrl  || "",
//         country:      d.country      || "",
//         audienceSize: d.audienceSize || "",
//         fullTimeRole: d.fullTimeRole || "",
//         courseTopic:  d.courseTopic  || "",
//         platforms: Array.isArray(d.platforms)
//           ? d.platforms
//           : d.platforms ? d.platforms.split(",").map((p) => p.trim()).filter(Boolean) : [],
//       };
//       setForm(loaded); setDraft(loaded);
//     }).catch(() => {});
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit = () => { setDraft({ ...form, platforms: [...(form.platforms || [])] }); setErrors({}); setEditing(true); };
//   const cancelEdit = () => { setDraft({ ...form, platforms: [...(form.platforms || [])] }); setErrors({}); setEditing(false); };
//   const handleChange = useCallback((e) => { const { name, value } = e.target; setDraft((p) => ({ ...p, [name]: value })); setErrors((p) => ({ ...p, [name]: "" })); }, []);

//   const validate = (d) => {
//     const errs = {};
//     const linkedinErr = validateUrl(d.linkedinUrl);
//     if (linkedinErr) errs.linkedinUrl = linkedinErr;
//     const countryErr = validateLocation(d.country, "Country");
//     if (countryErr) errs.country = countryErr;
//     const topicErr = validateName(d.courseTopic, "Course topic");
//     if (topicErr) errs.courseTopic = topicErr;
//     return errs;
//   };

//   const handleSave = async () => {
//     const errs = validate(draft);
//     if (Object.keys(errs).length) { setErrors(errs); showToast("Please fix the errors below.", "error"); return; }
//     setSaving(true);
//     try {
//       const payload = {
//         ...draft,
//         linkedinUrl:  sanitize(draft.linkedinUrl),
//         country:      sanitize(draft.country),
//         courseTopic:  sanitize(draft.courseTopic),
//         platforms:    [...new Set(draft.platforms)], // unique only
//       };
//       await userService.updateTrainerProfile(payload);
//       setForm({ ...draft }); setEditing(false);
//       showToast("Trainer profile saved");
//       syncProfileCompleted(true);
//       if (returnTo) setTimeout(() => navigate(returnTo), 900);
//     } catch { showToast("Failed to save. Try again.", "error"); }
//     finally { setSaving(false); }
//   };

//   const inp = (fieldKey) => ({
//     style: {
//       width: "100%", padding: "10px 14px", borderRadius: 10,
//       border: `1.5px solid ${errors[fieldKey] ? TOKEN.error : TOKEN.border}`,
//       fontSize: 13.5, color: TOKEN.text, fontFamily: "'Plus Jakarta Sans', sans-serif",
//       background: TOKEN.surface, outline: "none",
//       boxShadow: errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none",
//       transition: "border-color .2s, box-shadow .2s",
//     },
//     onFocus: (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; },
//     onBlur:  (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : TOKEN.border; e.target.style.boxShadow = errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none"; },
//   });

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//         <div>
//           <h3 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.text, fontFamily: "'Sora', sans-serif", margin: 0 }}>Trainer Profile</h3>
//           <p style={{ fontSize: 13, color: TOKEN.muted, marginTop: 3 }}>Your training background and platform details</p>
//         </div>
//         <EditSaveButtons editing={editing} saving={saving} onEdit={startEdit} onSave={handleSave} onCancel={cancelEdit} accentColor={ac.primary} saveLabel="Save Profile" />
//       </div>

//       <SectionCard>
//         <SectionHeader icon={Globe} title="Basic Info" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
//           <div>
//             <FieldLabel icon={Globe} label="LinkedIn URL" />
//             {editing ? (
//               <>
//                 <input type="url" name="linkedinUrl" value={draft.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/…" {...inp("linkedinUrl")} />
//                 <ErrorMsg msg={errors.linkedinUrl} />
//               </>
//             ) : <StaticField value={form.linkedinUrl} />}
//           </div>

//           <div>
//             <FieldLabel icon={MapPin} label="Country" />
//             {editing ? (
//               <>
//                 <SearchableDropdown value={draft.country} onChange={(v) => { setDraft((p) => ({ ...p, country: v })); setErrors((p) => ({ ...p, country: "" })); }} options={COUNTRIES_LIST} placeholder="Select country" accentColor={ac.primary} allowAddNew />
//                 <ErrorMsg msg={errors.country} />
//               </>
//             ) : <StaticField value={form.country} />}
//           </div>

//           <div>
//             <FieldLabel icon={BookOpen} label="Course Topic" />
//             {editing ? (
//               <>
//                 <input type="text" name="courseTopic" value={draft.courseTopic} onChange={handleChange} placeholder="e.g. React, Python, AWS" {...inp("courseTopic")} />
//                 <ErrorMsg msg={errors.courseTopic} />
//               </>
//             ) : <StaticField value={form.courseTopic} />}
//           </div>

//           <div>
//             <FieldLabel icon={Users} label="Audience Size" />
//             {editing ? (
//               <SearchableDropdown value={draft.audienceSize} onChange={(v) => setDraft((p) => ({ ...p, audienceSize: v }))} options={["0–1K","1K–10K","10K–100K","100K+"]} placeholder="Select range" accentColor={ac.primary} />
//             ) : <StaticField value={form.audienceSize} />}
//           </div>

//           <div>
//             <FieldLabel icon={Briefcase} label="Full-Time Role?" />
//             {editing ? (
//               <SearchableDropdown value={draft.fullTimeRole} onChange={(v) => setDraft((p) => ({ ...p, fullTimeRole: v }))} options={["Yes","No"]} placeholder="Select" accentColor={ac.primary} />
//             ) : <StaticField value={form.fullTimeRole} />}
//           </div>
//         </div>
//       </SectionCard>

//       <SectionCard>
//         <SectionHeader icon={TrendingUp} title="Platforms" />
//         {editing ? (
//           <MultiChipSelector values={draft.platforms} onChange={(vals) => setDraft((p) => ({ ...p, platforms: vals }))} options={PLATFORMS_LIST} accentColor={ac.primary} />
//         ) : (
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//             {(form.platforms || []).length === 0
//               ? <StaticField value="" />
//               : (form.platforms || []).map((p) => (
//                   <span key={p} style={{ padding: "5px 14px", borderRadius: 20, background: `${ac.primary}14`, border: `1.5px solid ${ac.primary}30`, color: ac.primary, fontSize: 12.5, fontWeight: 700 }}>{p}</span>
//                 ))
//             }
//           </div>
//         )}
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    ADMIN DETAILS TAB — validation hardening
// ───────────────────────────────────────────────────────────── */
// const AdminDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [toast, setToast]     = useState(null);
//   const [errors, setErrors]   = useState({});

//   const empty = { organizationName: "", domain: "", contactEmail: "", location: "", industry: "", description: "", mobileNumber: "", plan: "", status: "", planExpiryDate: "", maxStudents: "", maxTrainers: "", currentStudents: "", currentTrainers: "", maxDepartments: "", maxBranchesPerDept: "", maxBatchesPerBranch: "", currentDepartments: "", currentBranches: "", currentBatches: "" };
//   const [form, setForm]   = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   useEffect(() => {
//     const orgId = localStorage.getItem("organizationId");
//     if (!orgId) { setLoading(false); return; }
//     setLoading(true);
//     authService.getOrgCapacity(orgId)
//       .then((cap) =>
//         getOrgSummary().catch(() => ({ currentDepartments: 0, currentBranches: 0, currentBatches: 0 }))
//           .then((sum) => {
//             const s = (v) => v != null ? String(v) : "";
//             const loaded = { organizationName: cap.organizationName || "", domain: cap.domain || "", contactEmail: cap.contactEmail || "", location: cap.location || "", industry: cap.industry || "", description: cap.description || "", mobileNumber: cap.mobileNumber || "", plan: cap.plan || "", status: cap.status || "", planExpiryDate: cap.planExpiryDate || "", maxStudents: s(cap.maxStudents), maxTrainers: s(cap.maxTrainers), currentStudents: s(cap.currentStudents), currentTrainers: s(cap.currentTrainers), maxDepartments: s(cap.maxDepartments), maxBranchesPerDept: s(cap.maxBranchesPerDept), maxBatchesPerBranch: s(cap.maxBatchesPerBranch), currentDepartments: s(sum.currentDepartments) || "0", currentBranches: s(sum.currentBranches) || "0", currentBatches: s(sum.currentBatches) || "0" };
//             setForm(loaded); setDraft(loaded);
//           })
//       )
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit  = () => { setDraft({ ...form }); setErrors({}); setEditing(true); };
//   const cancelEdit = () => { setDraft({ ...form }); setErrors({}); setEditing(false); };
//   const handleChange = useCallback((e) => { const { name, value } = e.target; setDraft((p) => ({ ...p, [name]: value })); setErrors((p) => ({ ...p, [name]: "" })); }, []);

//   const validate = (d) => {
//     const errs = {};
//     if (!d.organizationName || !d.organizationName.trim()) { errs.organizationName = "Organization name is required."; }
//     else { const e = validateName(d.organizationName, "Organization name"); if (e) errs.organizationName = e; }
//     const domainErr = validateUrl(d.domain);
//     if (domainErr) errs.domain = domainErr;
//     const emailErr = validateEmail(d.contactEmail);
//     if (emailErr) errs.contactEmail = emailErr;
//     const locationErr = validateLocation(d.location, "Location");
//     if (locationErr) errs.location = locationErr;
//     const mobileErr = validateMobile(d.mobileNumber);
//     if (mobileErr) errs.mobileNumber = mobileErr;
//     const descErr = validateDescription(d.description);
//     if (descErr) errs.description = descErr;
//     return errs;
//   };

//   const handleSave = async () => {
//     const errs = validate(draft);
//     if (Object.keys(errs).length) { setErrors(errs); showToast("Please fix the errors below.", "error"); return; }
//     setSaving(true);
//     try {
//       const orgId = localStorage.getItem("organizationId");
//       const payload = { organizationName: sanitize(draft.organizationName), domain: sanitize(draft.domain), contactEmail: sanitize(draft.contactEmail), location: sanitize(draft.location), industry: draft.industry, description: sanitize(draft.description), mobileNumber: sanitize(draft.mobileNumber) };
//       await authService.updateAdminOrgProfile(orgId, payload);
//       setForm((prev) => ({ ...prev, ...payload }));
//       setEditing(false);
//       showToast("Organization details saved");
//       syncProfileCompleted(true);
//       if (returnTo) setTimeout(() => navigate(returnTo), 900);
//     } catch { showToast("Failed to save. Try again.", "error"); }
//     finally { setSaving(false); }
//   };

//   const inp = (fieldKey) => ({
//     style: {
//       width: "100%", padding: "10px 14px", borderRadius: 10,
//       border: `1.5px solid ${errors[fieldKey] ? TOKEN.error : TOKEN.border}`,
//       fontSize: 13.5, color: TOKEN.text, fontFamily: "'Plus Jakarta Sans', sans-serif",
//       background: TOKEN.surface, outline: "none",
//       boxShadow: errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none",
//       transition: "border-color .2s, box-shadow .2s",
//     },
//     onFocus: (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; },
//     onBlur:  (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : TOKEN.border; e.target.style.boxShadow = errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none"; },
//   });

//   if (loading) return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//       {[100, 200, 100, 160].map((h, i) => <div key={i} style={{ height: h, borderRadius: 16, background: TOKEN.subtle }} />)}
//     </div>
//   );

//   const lockedFields = [
//     { icon: CreditCard, label: "Plan",                val: form.plan },
//     { icon: Shield,     label: "Status",              val: form.status },
//     { icon: Calendar,   label: "Plan Expiry",         val: form.planExpiryDate },
//     { icon: Users,      label: "Max Students",        val: form.maxStudents },
//     { icon: Users,      label: "Max Trainers",        val: form.maxTrainers },
//     { icon: Building2,  label: "Max Departments",     val: form.maxDepartments },
//     { icon: GitBranch,  label: "Max Branches / Dept", val: form.maxBranchesPerDept },
//     { icon: Layers,     label: "Max Batches / Branch",val: form.maxBatchesPerBranch },
//   ];
//   const liveFields = [
//     { icon: Users,     label: "Current Students",    val: form.currentStudents },
//     { icon: Users,     label: "Current Trainers",    val: form.currentTrainers },
//     { icon: Building2, label: "Current Departments", val: form.currentDepartments },
//     { icon: GitBranch, label: "Current Branches",    val: form.currentBranches },
//     { icon: Layers,    label: "Current Batches",     val: form.currentBatches },
//   ];

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//         <div>
//           <h3 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.text, fontFamily: "'Sora', sans-serif", margin: 0 }}>Organization Details</h3>
//           <p style={{ fontSize: 13, color: TOKEN.muted, marginTop: 3 }}>Your organization information and plan status</p>
//         </div>
//         <EditSaveButtons editing={editing} saving={saving} onEdit={startEdit} onSave={handleSave} onCancel={cancelEdit} accentColor={ac.primary} saveLabel="Save Details" />
//       </div>

//       <SectionCard>
//         <SectionHeader icon={Building2} title="Organization Info" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
//           {[
//             { name: "organizationName", label: "Organization Name", type: "text",  ph: "e.g. Texora AI",         icon: Building2, req: true },
//             { name: "domain",           label: "Domain / Website",  type: "url",   ph: "https://texora.ai",      icon: Globe },
//             { name: "contactEmail",     label: "Contact Email",     type: "email", ph: "admin@texora.ai",         icon: Mail },
//             { name: "location",         label: "Location",          type: "text",  ph: "e.g. Hyderabad, India",  icon: MapPin },
//             { name: "mobileNumber",     label: "Mobile Number",     type: "tel",   ph: "+91 9876543210",         icon: Phone },
//           ].map(({ name, label, type, ph, icon: Ic, req }) => (
//             <div key={name}>
//               <FieldLabel icon={Ic} label={label} required={req} />
//               {editing ? (
//                 <>
//                   <input type={type} name={name} value={draft[name]} onChange={handleChange} placeholder={ph} {...inp(name)} />
//                   <ErrorMsg msg={errors[name]} />
//                 </>
//               ) : <StaticField value={form[name]} />}
//             </div>
//           ))}

//           <div>
//             <FieldLabel icon={Briefcase} label="Industry" />
//             {editing
//               ? <SearchableDropdown value={draft.industry} onChange={(v) => setDraft((p) => ({ ...p, industry: v }))} options={INDUSTRIES} placeholder="Select industry" accentColor={ac.primary} />
//               : <StaticField value={form.industry} />
//             }
//           </div>

//           <div style={{ gridColumn: "1 / -1" }}>
//             <FieldLabel icon={BookOpen} label="Description" />
//             {editing ? (
//               <>
//                 <textarea name="description" value={draft.description} onChange={(e) => { handleChange(e); }} rows={3} placeholder="Brief description of your organization"
//                   style={{ ...inp("description").style, resize: "none", minHeight: 80 }}
//                   onFocus={inp("description").onFocus} onBlur={inp("description").onBlur}
//                 />
//                 <ErrorMsg msg={errors.description} />
//               </>
//             ) : <StaticField value={form.description} />}
//           </div>
//         </div>
//       </SectionCard>

//       {/* Plan & Limits — locked, no validation needed */}
//       <SectionCard style={{ background: `linear-gradient(135deg, ${TOKEN.subtle} 0%, ${TOKEN.surface} 100%)` }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
//           <Lock style={{ width: 14, height: 14, color: TOKEN.muted }} />
//           <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: TOKEN.muted }}>Plan & Limits</span>
//           <span style={{ fontSize: 11, color: TOKEN.muted, fontWeight: 400 }}>— managed by SuperAdmin</span>
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
//           {lockedFields.map(({ icon: Ic, label, val }) => (
//             <div key={label}>
//               <FieldLabel icon={Ic} label={label} />
//               <div style={{ position: "relative" }}>
//                 <div style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`, background: TOKEN.subtle, fontSize: 13, color: TOKEN.muted, paddingRight: 60 }}>{val || "—"}</div>
//                 <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 9, padding: "2px 7px", borderRadius: 20, background: "#E2E8F0", color: TOKEN.muted, fontWeight: 700, letterSpacing: "0.04em" }}>LOCKED</span>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1.5px solid ${TOKEN.border}` }}>
//           <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: TOKEN.muted, marginBottom: 12 }}>Live Usage</p>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
//             {liveFields.map(({ icon: Ic, label, val }) => (
//               <div key={label}>
//                 <FieldLabel icon={Ic} label={label} />
//                 <div style={{ padding: "9px 14px", borderRadius: 10, border: "1.5px solid #BBF7D0", background: "#F0FDF4", fontSize: 15, color: TOKEN.green, fontWeight: 800 }}>{val || "0"}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    BUSINESS DETAILS TAB — validation hardening
// ───────────────────────────────────────────────────────────── */
// const BusinessDetailsTab = ({ accent, returnTo }) => {
//   const navigate = useNavigate();
//   const ac = ACCENT[accent];
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving]   = useState(false);
//   const [toast, setToast]     = useState(null);
//   const [errors, setErrors]   = useState({});

//   const empty = { companyName: "", industry: "", location: "", website: "", contactEmail: "", mobileNumber: "", description: "" };
//   const [form, setForm]   = useState(empty);
//   const [draft, setDraft] = useState(empty);

//   useEffect(() => {
//     userService.getBusinessProfile().then((res) => {
//       const d = res.data || {};
//       const loaded = { companyName: d.companyName || "", industry: d.industry || "", location: d.location || "", website: d.website || "", contactEmail: d.contactEmail || "", mobileNumber: d.mobileNumber || "", description: d.description || "" };
//       setForm(loaded); setDraft(loaded);
//     }).catch(() => {});
//   }, []);

//   const showToast = (msg, type = "success") => setToast({ message: msg, type });
//   const startEdit  = () => { setDraft({ ...form }); setErrors({}); setEditing(true); };
//   const cancelEdit = () => { setDraft({ ...form }); setErrors({}); setEditing(false); };
//   const handleChange = useCallback((e) => { const { name, value } = e.target; setDraft((p) => ({ ...p, [name]: value })); setErrors((p) => ({ ...p, [name]: "" })); }, []);

//   const validate = (d) => {
//     const errs = {};
//     const companyErr = validateName(d.companyName, "Company name");
//     if (companyErr) errs.companyName = companyErr;
//     const websiteErr = validateUrl(d.website);
//     if (websiteErr) errs.website = websiteErr;
//     const emailErr = validateEmail(d.contactEmail);
//     if (emailErr) errs.contactEmail = emailErr;
//     const mobileErr = validateMobile(d.mobileNumber);
//     if (mobileErr) errs.mobileNumber = mobileErr;
//     const locationErr = validateLocation(d.location, "Location");
//     if (locationErr) errs.location = locationErr;
//     const descErr = validateDescription(d.description);
//     if (descErr) errs.description = descErr;
//     return errs;
//   };

//   const handleSave = async () => {
//     const errs = validate(draft);
//     if (Object.keys(errs).length) { setErrors(errs); showToast("Please fix the errors below.", "error"); return; }
//     setSaving(true);
//     try {
//       const payload = { companyName: sanitize(draft.companyName), industry: draft.industry, location: sanitize(draft.location), website: sanitize(draft.website), contactEmail: sanitize(draft.contactEmail), mobileNumber: sanitize(draft.mobileNumber), description: sanitize(draft.description) };
//       await userService.updateBusinessProfile(payload);
//       setForm({ ...draft }); setEditing(false);
//       showToast("Business details saved");
//       syncProfileCompleted(true);
//       if (returnTo) setTimeout(() => navigate(returnTo), 900);
//     } catch { showToast("Failed to save. Try again.", "error"); }
//     finally { setSaving(false); }
//   };

//   const inp = (fieldKey) => ({
//     style: {
//       width: "100%", padding: "10px 14px", borderRadius: 10,
//       border: `1.5px solid ${errors[fieldKey] ? TOKEN.error : TOKEN.border}`,
//       fontSize: 13.5, color: TOKEN.text, fontFamily: "'Plus Jakarta Sans', sans-serif",
//       background: TOKEN.surface, outline: "none",
//       boxShadow: errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none",
//       transition: "border-color .2s, box-shadow .2s",
//     },
//     onFocus: (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; },
//     onBlur:  (e) => { e.target.style.borderColor = errors[fieldKey] ? TOKEN.error : TOKEN.border; e.target.style.boxShadow = errors[fieldKey] ? `0 0 0 3px ${TOKEN.errorSoft}` : "none"; },
//   });

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
//         <div>
//           <h3 style={{ fontSize: 18, fontWeight: 800, color: TOKEN.text, fontFamily: "'Sora', sans-serif", margin: 0 }}>Business Details</h3>
//           <p style={{ fontSize: 13, color: TOKEN.muted, marginTop: 3 }}>Your company and contact information</p>
//         </div>
//         <EditSaveButtons editing={editing} saving={saving} onEdit={startEdit} onSave={handleSave} onCancel={cancelEdit} accentColor={ac.primary} saveLabel="Save Details" />
//       </div>

//       <SectionCard>
//         <SectionHeader icon={Building2} title="Company Info" />
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
//           {[
//             { name: "companyName",  label: "Company Name",  type: "text",  ph: "e.g. Acme Corp",           icon: Building2 },
//             { name: "location",     label: "Location",      type: "text",  ph: "e.g. Mumbai, India",        icon: MapPin },
//             { name: "website",      label: "Website",       type: "url",   ph: "https://example.com",       icon: Globe },
//             { name: "contactEmail", label: "Contact Email", type: "email", ph: "contact@company.com",       icon: Mail },
//             { name: "mobileNumber", label: "Mobile Number", type: "tel",   ph: "+91 9876543210",            icon: Phone },
//           ].map(({ name, label, type, ph, icon: Ic }) => (
//             <div key={name}>
//               <FieldLabel icon={Ic} label={label} />
//               {editing ? (
//                 <>
//                   <input type={type} name={name} value={draft[name]} onChange={handleChange} placeholder={ph} {...inp(name)} />
//                   <ErrorMsg msg={errors[name]} />
//                 </>
//               ) : <StaticField value={form[name]} />}
//             </div>
//           ))}

//           <div>
//             <FieldLabel icon={Briefcase} label="Industry" />
//             {editing
//               ? <SearchableDropdown value={draft.industry} onChange={(v) => setDraft((p) => ({ ...p, industry: v }))} options={INDUSTRIES} placeholder="Select industry" accentColor={ac.primary} />
//               : <StaticField value={form.industry} />
//             }
//           </div>

//           <div style={{ gridColumn: "1 / -1" }}>
//             <FieldLabel icon={BookOpen} label="Description" />
//             {editing ? (
//               <>
//                 <textarea name="description" value={draft.description} onChange={(e) => { handleChange(e); }} rows={3} placeholder="Brief description of your business"
//                   style={{ ...inp("description").style, resize: "none", minHeight: 80 }}
//                   onFocus={inp("description").onFocus} onBlur={inp("description").onBlur}
//                 />
//                 <ErrorMsg msg={errors.description} />
//               </>
//             ) : <StaticField value={form.description} />}
//           </div>
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    DETAILS TAB ROUTER — unchanged
// ───────────────────────────────────────────────────────────── */
// const DetailsTab = ({ accent, roleKey, returnTo }) => {
//   if (roleKey === "trainer")  return <TrainerDetailsTab accent={accent} returnTo={returnTo} />;
//   if (roleKey === "admin")    return <AdminDetailsTab   accent={accent} returnTo={returnTo} />;
//   if (roleKey === "business") return <BusinessDetailsTab accent={accent} returnTo={returnTo} />;
//   return <StudentDetailsTab accent={accent} returnTo={returnTo} />;
// };

// /* ─────────────────────────────────────────────────────────────
//    SECURITY TAB — unchanged logic, password validation present
// ───────────────────────────────────────────────────────────── */
// const SecurityTab = ({ accent }) => {
//   const [newPassword, setNewPassword]         = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading]                 = useState(false);
//   const [toast, setToast]                     = useState(null);
//   const ac = ACCENT[accent];

//   const showToast = (message, type = "success") => setToast({ message, type });

//   const handlePasswordChange = async () => {
//     if (!newPassword || !confirmPassword) { showToast("Both fields are required", "error"); return; }
//     if (newPassword.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
//     if (newPassword !== confirmPassword) { showToast("Passwords do not match", "error"); return; }
//     setLoading(true);
//     try {
//       await authService.changePassword(newPassword, confirmPassword);
//       showToast("Password updated successfully");
//       setNewPassword(""); setConfirmPassword("");
//     } catch (err) {
//       const msg = err?.response?.data?.message || err?.response?.data || "Failed to update password.";
//       showToast(typeof msg === "string" ? msg : "Failed to update password", "error");
//     } finally { setLoading(false); }
//   };

//   const match   = confirmPassword && newPassword === confirmPassword;
//   const noMatch = confirmPassword && newPassword !== confirmPassword;

//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <SectionCard>
//         <SectionHeader icon={Lock} title="Change Password" />
//         <p style={{ fontSize: 13, color: TOKEN.muted, marginBottom: 20 }}>Choose a strong password with at least 6 characters</p>
//         <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
//           <div>
//             <FieldLabel icon={Lock} label="New Password" />
//             <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pp-input"
//               style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${TOKEN.border}`, fontSize: 13.5, color: TOKEN.text, fontFamily: "'Plus Jakarta Sans', sans-serif", background: TOKEN.surface }}
//               onFocus={(e) => { e.target.style.borderColor = ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; }}
//               onBlur={(e) => { e.target.style.borderColor = TOKEN.border; e.target.style.boxShadow = "none"; }}
//             />
//           </div>
//           <div>
//             <FieldLabel icon={Lock} label="Confirm New Password" />
//             <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pp-input"
//               style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${noMatch ? TOKEN.error : match ? TOKEN.green : TOKEN.border}`, fontSize: 13.5, color: TOKEN.text, fontFamily: "'Plus Jakarta Sans', sans-serif", background: TOKEN.surface }}
//               onFocus={(e) => { e.target.style.borderColor = ac.primary; e.target.style.boxShadow = `0 0 0 3px ${ac.primary}22`; }}
//               onBlur={(e) => { e.target.style.borderColor = noMatch ? TOKEN.error : match ? TOKEN.green : TOKEN.border; e.target.style.boxShadow = "none"; }}
//             />
//             {confirmPassword && (
//               <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, marginTop: 6, color: match ? "#15803D" : "#DC2626", fontWeight: 600 }}>
//                 {match ? <CheckCircle style={{ width: 13, height: 13 }} /> : <X style={{ width: 13, height: 13 }} />}
//                 {match ? "Passwords match" : "Passwords do not match"}
//               </p>
//             )}
//           </div>
//           <button onClick={handlePasswordChange} disabled={loading} className="pp-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: ac.primary, color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, width: "fit-content", boxShadow: `0 4px 14px ${ac.primary}40`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//             {loading
//               ? <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "ppSpin .7s linear infinite" }} /> Updating…</>
//               : <><Shield style={{ width: 15, height: 15 }} /> Update Password</>
//             }
//           </button>
//         </div>
//       </SectionCard>

//       <SectionCard style={{ background: `linear-gradient(135deg, ${TOKEN.subtle} 0%, ${TOKEN.surface} 100%)` }}>
//         <h4 style={{ fontSize: 13.5, fontWeight: 700, color: TOKEN.text, marginBottom: 14 }}>Password Tips</h4>
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {["Use at least 8 characters","Mix uppercase, lowercase, numbers & symbols","Avoid personal info like your name or birthday","Don't reuse passwords from other sites"].map((tip, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
//               <CheckCircle style={{ width: 14, height: 14, color: TOKEN.green, flexShrink: 0, marginTop: 1 }} />
//               <span style={{ fontSize: 12.5, color: TOKEN.muted }}>{tip}</span>
//             </div>
//           ))}
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    BILLING TAB — unchanged
// ───────────────────────────────────────────────────────────── */
// const BillingTab = ({ user, accent }) => {
//   const ac = ACCENT[accent];
//   const history = [
//     { date: "Apr 1, 2025", amount: user.planPrice, status: "Paid", inv: "INV-0048" },
//     { date: "Mar 1, 2025", amount: user.planPrice, status: "Paid", inv: "INV-0041" },
//     { date: "Feb 1, 2025", amount: user.planPrice, status: "Paid", inv: "INV-0033" },
//     { date: "Jan 1, 2025", amount: user.planPrice, status: "Paid", inv: "INV-0025" },
//   ];
//   return (
//     <div className="pp-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
//       <div style={{ borderRadius: 16, padding: "24px 28px", background: user.heroGradient, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.16)" }}>
//         <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)", filter: "blur(20px)" }} />
//         <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
//           <div>
//             <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
//               <Zap style={{ width: 15, height: 15, color: "rgba(255,255,255,0.8)" }} />
//               <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Current Plan</span>
//             </div>
//             <h3 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Sora', sans-serif" }}>{user.plan}</h3>
//             <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5, marginTop: 4 }}>{user.planPrice} · Billed monthly</p>
//             <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
//               <BadgeCheck style={{ width: 15, height: 15, color: "rgba(255,255,255,0.8)" }} />
//               <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Renews on May 1, 2025</span>
//             </div>
//           </div>
//           <button style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upgrade Plan</button>
//         </div>
//       </div>

//       <SectionCard>
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//           <h3 style={{ fontSize: 15, fontWeight: 700, color: TOKEN.text, margin: 0 }}>Payment Method</h3>
//           <button style={{ fontSize: 12.5, color: ac.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Change</button>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: TOKEN.subtle, border: `1.5px solid ${TOKEN.border}` }}>
//           <div style={{ width: 42, height: 42, borderRadius: 10, background: `${ac.primary}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//             <CreditCard style={{ width: 20, height: 20, color: ac.primary }} />
//           </div>
//           <div style={{ flex: 1 }}>
//             <p style={{ fontSize: 14, fontWeight: 600, color: TOKEN.text, marginBottom: 2 }}>Visa ending in 4242</p>
//             <p style={{ fontSize: 12, color: TOKEN.muted }}>Expires 08/2027</p>
//           </div>
//           <span style={{ padding: "4px 12px", borderRadius: 20, background: `${ac.primary}14`, border: `1.5px solid ${ac.primary}30`, color: ac.primary, fontSize: 11, fontWeight: 700 }}>Default</span>
//         </div>
//       </SectionCard>

//       <SectionCard>
//         <h3 style={{ fontSize: 15, fontWeight: 700, color: TOKEN.text, marginBottom: 16 }}>Payment History</h3>
//         <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
//           {history.map((h, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, transition: "background .15s", cursor: "default" }}
//               onMouseEnter={(e) => e.currentTarget.style.background = TOKEN.subtle}
//               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <CheckCircle style={{ width: 15, height: 15, color: "#16A34A" }} />
//                 </div>
//                 <div>
//                   <p style={{ fontSize: 13.5, fontWeight: 600, color: TOKEN.text, marginBottom: 2 }}>{h.inv}</p>
//                   <p style={{ fontSize: 11.5, color: TOKEN.muted }}>{h.date}</p>
//                 </div>
//               </div>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <span style={{ fontSize: 14, fontWeight: 700, color: TOKEN.text }}>{h.amount}</span>
//                 <span style={{ padding: "3px 10px", borderRadius: 20, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", fontSize: 11, fontWeight: 700 }}>Paid</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </SectionCard>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    TAB BUTTON
// ───────────────────────────────────────────────────────────── */
// const TabButton = ({ label, icon: Icon, active, onClick, accentColor }) => (
//   <button onClick={onClick} style={{
//     display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
//     borderRadius: 10, border: "none",
//     background: active ? TOKEN.surface : "transparent",
//     boxShadow: active ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
//     color: active ? TOKEN.text : TOKEN.muted,
//     fontWeight: active ? 700 : 500, fontSize: 13.5,
//     cursor: "pointer", whiteSpace: "nowrap",
//     fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all .18s",
//     borderBottom: active ? `2.5px solid ${accentColor || TOKEN.orange}` : "2.5px solid transparent",
//   }}>
//     <Icon style={{ width: 15, height: 15, color: active ? (accentColor || TOKEN.orange) : TOKEN.muted }} />
//     {label}
//   </button>
// );

// /* ─────────────────────────────────────────────────────────────
//    SKELETON
// ───────────────────────────────────────────────────────────── */
// const Skeleton = () => (
//   <div style={{ minHeight: "100vh", background: TOKEN.bg, padding: 32 }}>
//     {[240, 80, 400].map((h, i) => (
//       <div key={i} style={{ height: h, borderRadius: 16, background: "#E2E8F0", marginBottom: 16 }} />
//     ))}
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────
//    PROFILE PAGE MAIN — routing & state unchanged
// ───────────────────────────────────────────────────────────── */
// const ProfilePage = () => {
//   useEffect(() => { injectStyles(); }, []);

//   const location = useLocation();
//   const { pathname } = location;
//   const navigate = useNavigate();
//   const [searchParams]   = useSearchParams();
//   const returnTo         = searchParams.get("returnTo");
//   const [activeTab, setActiveTab]           = useState("profile");
//   const [loading, setLoading]               = useState(true);
//   const [error, setError]                   = useState("");
//   const [showReturnBanner, setShowReturnBanner] = useState(!!returnTo);

//   const roleKey = pathname.startsWith("/trainer")  ? "trainer"
//                 : pathname.startsWith("/admin")    ? "admin"
//                 : pathname.startsWith("/business") ? "business"
//                 : "student";

//   const [user, setUser] = useState({ ...ROLE_CONFIG[roleKey] });

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true); setError("");
//     userService.getMyProfile().then((res) => {
//       if (cancelled) return;
//       const data = res.data;
//       const roleLabel = (() => { if (!data?.roles) return ROLE_CONFIG[roleKey].label; const r = data.roles.toString().toLowerCase(); return r.charAt(0).toUpperCase() + r.slice(1); })();
//       const apiName  = data?.displayName || ROLE_CONFIG[roleKey].name;
//       const apiEmail = data?.email       || ROLE_CONFIG[roleKey].email;
//       const apiId    = data?.userId      || ROLE_CONFIG[roleKey].id;
//       setUser((prev) => ({ ...prev, name: apiName, email: apiEmail, id: apiId, label: roleLabel, avatar: apiName.charAt(0).toUpperCase() }));
//     }).catch((err) => { if (!cancelled) { console.error("Profile fetch failed:", err); setError("Could not load profile — showing cached data."); } })
//     .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [pathname]);

//   const handleProfileUpdate = (updatedForm) => {
//     setUser((prev) => ({ ...prev, name: updatedForm.name, avatar: updatedForm.name.charAt(0).toUpperCase() }));
//   };

//   const ac = ACCENT[user.accent];

//   const tabs = [
//     { id: "profile",  label: "Profile Info",  icon: User },
//     { id: "details",  label: roleKey === "admin" ? "Organization" : "Details", icon: roleKey === "admin" ? Building2 : GraduationCap },
//     { id: "security", label: "Security",       icon: Shield },
//     { id: "billing",  label: "Billing",        icon: CreditCard },
//   ];

//   if (loading) return <Skeleton />;

//   return (
//     <div className="pp-root" style={{ minHeight: "100vh", background: TOKEN.bg }}>
//       <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 16px", display: "flex", flexDirection: "column", gap: 20 }}>

//         {error && (
//           <div style={{ padding: "12px 18px", borderRadius: 12, background: TOKEN.errorSoft, border: `1.5px solid ${TOKEN.errorBorder}`, color: "#DC2626", fontSize: 13 }}>{error}</div>
//         )}

//         {showReturnBanner && (
//           <div style={{ padding: "12px 18px", borderRadius: 12, background: "#FFF7ED", border: "1.5px solid #FED7AA", color: "#9A3412", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
//             <span>Complete your profile below to continue to your dashboard.</span>
//             <button onClick={() => setShowReturnBanner(false)} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "inherit", opacity: 0.7, textDecoration: "underline" }}>Dismiss</button>
//           </div>
//         )}

//         {/* Hero Banner */}
//         <div style={{ borderRadius: 20, background: user.heroGradient, padding: "28px 32px", boxShadow: "0 12px 48px rgba(0,0,0,0.18)", position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)", filter: "blur(30px)" }} />
//           <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,0,0,0.08)", filter: "blur(20px)" }} />
//           <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
//             <Avatar initials={user.avatar} size={96} editable online shape="rounded" />
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
//                 <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0, fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px" }}>{user.name}</h1>
//                 <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>{user.label}</span>
//               </div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 12.5, color: "rgba(255,255,255,0.75)" }}>
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}><IdCard style={{ width: 13, height: 13 }} />{user.id}</span>
//                 <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail style={{ width: 13, height: 13 }} />{user.email}</span>
//               </div>
//             </div>
//             <button onClick={() => { authService.logout(); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "background .18s" }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
//             >
//               <LogOut style={{ width: 15, height: 15 }} /> Logout
//             </button>
//           </div>
//         </div>

//         {/* Tabs + Content */}
//         <div style={{ borderRadius: 20, background: TOKEN.surface, border: `1.5px solid ${TOKEN.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden" }}>
//           <div style={{ display: "flex", gap: 4, padding: "10px 12px 0", background: TOKEN.subtle, borderBottom: `1.5px solid ${TOKEN.border}`, overflowX: "auto" }}>
//             {tabs.map((tab) => (
//               <TabButton key={tab.id} label={tab.label} icon={tab.icon} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} accentColor={ac?.primary} />
//             ))}
//           </div>
//           <div style={{ padding: "28px 28px 32px" }}>
//             {activeTab === "profile"  && <ProfileInfoTab  user={user} accent={user.accent} onProfileUpdate={handleProfileUpdate} returnTo={returnTo} />}
//             {activeTab === "details"  && <DetailsTab      accent={user.accent} roleKey={roleKey} returnTo={returnTo} />}
//             {activeTab === "security" && <SecurityTab     accent={user.accent} />}
//             {activeTab === "billing"  && <BillingTab      user={user} accent={user.accent} />}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


































































































































