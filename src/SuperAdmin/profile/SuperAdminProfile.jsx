// import React, { useState } from "react";
// import { useTheme } from "../context/ThemeContext";

// // ─── Avatar Upload ────────────────────────────────────────────
// const AvatarSection = ({ user, dark }) => {
//   const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SA";
//   return (
//     <div className="flex items-center gap-5">
//       <div className="relative group">
//         <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-500/25">
//           {initials}
//         </div>
//         <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//           <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
//             <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
//             <circle cx={12} cy={13} r={4}/>
//           </svg>
//         </button>
//       </div>
//       <div>
//         <h2 style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-xl font-bold">{user?.name}</h2>
//         <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mt-0.5">Super Administrator</p>
//         <p style={{ color: dark ? "#64748b" : "#94a3b8" }} className="text-xs mt-1">{user?.email}</p>
//         <div className="flex items-center gap-1.5 mt-2">
//           <span className="w-2 h-2 rounded-full bg-emerald-400" />
//           <span className="text-xs text-emerald-500 font-medium">Active</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Info Field ───────────────────────────────────────────────
// const InfoField = ({ label, value, edit, type = "text", dark }) => (
//   <div>
//     <label style={{ color: dark ? "#94a3b8" : "#475569" }}
//       className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
//       {label}
//     </label>
//     {edit ? (
//       <input
//         type={type}
//         defaultValue={value}
//         style={{
//           background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
//           border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//           color: dark ? "#ffffff" : "#0f172a",
//         }}
//         className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
//       />
//     ) : (
//       <p style={{
//         color: dark ? "#e2e8f0" : "#1e293b",
//         background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
//         border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
//       }} className="text-sm px-3 py-2.5 rounded-lg">
//         {value || "—"}
//       </p>
//     )}
//   </div>
// );

// // ─── Card ─────────────────────────────────────────────────────
// const Card = ({ title, icon, children, action, dark }) => (
//   <div style={{
//     background: dark ? "rgba(255,255,255,0.03)" : "#ffffff",
//     border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//     boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
//   }} className="rounded-xl overflow-hidden">
//     <div style={{
//       background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
//       borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
//     }} className="flex items-center justify-between px-5 py-4">
//       <div className="flex items-center gap-2.5">
//         <span className="text-lg">{icon}</span>
//         <h3 style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-sm font-semibold">{title}</h3>
//       </div>
//       {action}
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// // ─── Stat Badge ───────────────────────────────────────────────
// const StatBadge = ({ label, value, icon, dark }) => (
//   <div style={{
//     background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)",
//     border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(139,92,246,0.15)"}`,
//   }} className="rounded-xl p-4 text-center hover:opacity-80 transition-all">
//     <div className="text-2xl mb-1">{icon}</div>
//     <div style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-xl font-bold tabular-nums">{value}</div>
//     <div style={{ color: dark ? "#94a3b8" : "#64748b" }} className="text-xs mt-0.5">{label}</div>
//   </div>
// );

// // ─── Password Field ───────────────────────────────────────────
// const PwField = ({ label, value, onChange, dark }) => (
//   <div>
//     <label style={{ color: dark ? "#94a3b8" : "#475569" }}
//       className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
//       {label}
//     </label>
//     <input
//       type="password"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       style={{
//         background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
//         border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
//         color: dark ? "#ffffff" : "#0f172a",
//       }}
//       className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
//     />
//   </div>
// );

// // ─── Main ─────────────────────────────────────────────────────
// const SuperAdminProfile = () => {
//   const { dark } = useTheme();

//   const user = {
//     name: localStorage.getItem("userName") || "Super Admin",
//     email: localStorage.getItem("userEmail") || "superadmin@texora.ai",
//     id: localStorage.getItem("userId") || "SA-001",
//     joinedAt: null,
//     lastLogin: new Date().toISOString(),
//   };

//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   const [editing, setEditing]           = useState(false);
//   const [pwForm, setPwForm]             = useState({ current: "", newPw: "", confirm: "" });
//   const [pwSaved, setPwSaved]           = useState(false);
//   const [profileSaved, setProfileSaved] = useState(false);
//   const [activeTab, setActiveTab]       = useState("profile");

//   const TABS = [
//     { key: "profile",    label: "Profile Info",     icon: "👤" },
//     { key: "security",   label: "Account Security", icon: "🔐" },
//     { key: "activity",   label: "Recent Activity",  icon: "📋" },
//     { key: "preferences",label: "Preferences",      icon: "⚙️" },
//   ];

//   const recentActivity = [
//     { action: "Approved trainer: Rajesh Kumar",          time: "2 minutes ago",       icon: "✅" },
//     { action: "Updated permissions for Admin role",      time: "1 hour ago",          icon: "🔧" },
//     { action: "Suspended user: fake@spam.io",            time: "3 hours ago",         icon: "🚫" },
//     { action: "Exported Student Progress Report",        time: "Yesterday, 4:30 PM",  icon: "📥" },
//     { action: "Added new Admin: Kiran Desai",            time: "Yesterday, 2:15 PM",  icon: "➕" },
//     { action: "Modified Security Settings (2FA)",        time: "2 days ago",          icon: "🛡️" },
//     { action: "Logged in from Sasarām, Bihar",           time: "2 days ago",          icon: "🔑" },
//     { action: "Bulk approved 4 student registrations",   time: "3 days ago",          icon: "⚡" },
//   ];

//   const [prefs, setPrefs] = useState({
//     compactSidebar: false,
//     emailAlerts:    true,
//     desktopNotif:   true,
//     showTips:       false,
//     autoRefresh:    true,
//   });

//   const handleSaveProfile = () => {
//     setEditing(false);
//     setProfileSaved(true);
//     setTimeout(() => setProfileSaved(false), 2500);
//   };

//   const handleSavePassword = () => {
//     if (!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm) return;
//     setPwSaved(true);
//     setPwForm({ current: "", newPw: "", confirm: "" });
//     setTimeout(() => setPwSaved(false), 2500);
//   };

//   // Theme tokens
//   const heroBg     = dark ? "from-violet-500/10 via-indigo-500/5 to-transparent border-violet-500/20"
//                            : "from-violet-50 via-indigo-50/50 to-transparent border-violet-200";
//   const tabBarBg   = dark ? "rgba(255,255,255,0.03)" : "#ffffff";
//   const tabBarBdr  = dark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
//   const bodyText   = dark ? "#ffffff" : "#0f172a";
//   const mutedText  = dark ? "#64748b" : "#94a3b8";
//   const labelText  = dark ? "#94a3b8" : "#475569";

//   return (
//     <div className="w-full max-w-none space-y-6">

//       {/* ── Profile Hero ── */}
//       <div className={`rounded-xl bg-gradient-to-br border p-6 ${heroBg}`}>
//         <AvatarSection user={user} dark={dark} />
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
//           {[
//             { label: "Total Actions",    value: "1,284", icon: "⚡" },
//             { label: "Users Managed",    value: "72",    icon: "👥" },
//             { label: "Reports Generated",value: "36",    icon: "📊" },
//             { label: "Days Active",      value: "142",   icon: "📅" },
//           ].map((s) => <StatBadge key={s.label} {...s} dark={dark} />)}
//         </div>
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{
//         background: tabBarBg,
//         border: `1px solid ${tabBarBdr}`,
//         boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
//       }} className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto">
//         {TABS.map((t) => (
//           <button
//             key={t.key}
//             onClick={() => setActiveTab(t.key)}
//             style={activeTab !== t.key ? { color: dark ? "#94a3b8" : "#64748b" } : {}}
//             className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
//               ${activeTab === t.key
//                 ? "bg-violet-500 text-white"
//                 : "hover:text-violet-500"}`}
//           >
//             <span>{t.icon}</span>
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Tab: Profile ── */}
//       {activeTab === "profile" && (
//         <Card
//           dark={dark}
//           title="Personal Information"
//           icon="👤"
//           action={
//             editing ? (
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setEditing(false)}
//                   style={{ color: dark ? "#94a3b8" : "#64748b", background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
//                   className="px-3 py-1.5 text-xs rounded-lg transition-all hover:opacity-80"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveProfile}
//                   className="px-3 py-1.5 text-xs font-semibold bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all"
//                 >
//                   Save
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => setEditing(true)}
//                 style={{ color: dark ? "#94a3b8" : "#64748b", background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
//                 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:opacity-80"
//               >
//                 <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//                   <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
//                 </svg>
//                 Edit
//               </button>
//             )
//           }
//         >
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <InfoField dark={dark} label="Full Name"     value={user?.name}  edit={editing} />
//             <InfoField dark={dark} label="Email Address" value={user?.email} edit={editing} type="email" />
//             <InfoField dark={dark} label="User ID"       value={user?.id} />
//             <InfoField dark={dark} label="Role"          value="Super Administrator" />
//             <InfoField dark={dark} label="Account Status" value="Active" />
//             <InfoField dark={dark} label="Member Since"  value={user?.joinedAt
//               ? new Date(user.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
//               : "—"} />
//             <InfoField dark={dark} label="Last Login"    value={user?.lastLogin
//               ? new Date(user.lastLogin).toLocaleString("en-IN") : "—"} />
//             <InfoField dark={dark} label="Phone"         value="+91 98765 43210" edit={editing} type="tel" />
//           </div>
//           {profileSaved && <p className="mt-4 text-xs text-emerald-500 font-semibold">✓ Profile updated successfully</p>}
//         </Card>
//       )}

//       {/* ── Tab: Security ── */}
//       {activeTab === "security" && (
//         <div className="space-y-4">
//           <Card dark={dark} title="Change Password" icon="🔑">
//             <div className="space-y-4">
//               <PwField dark={dark} label="Current Password"     value={pwForm.current} onChange={(v) => setPwForm((p) => ({ ...p, current: v }))} />
//               <PwField dark={dark} label="New Password"         value={pwForm.newPw}   onChange={(v) => setPwForm((p) => ({ ...p, newPw: v }))} />
//               <PwField dark={dark} label="Confirm New Password" value={pwForm.confirm} onChange={(v) => setPwForm((p) => ({ ...p, confirm: v }))} />
//               {pwForm.newPw && pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
//                 <p className="text-xs text-red-500">Passwords do not match</p>
//               )}
//               <button
//                 onClick={handleSavePassword}
//                 disabled={!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm}
//                 className="px-5 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all disabled:opacity-40"
//               >
//                 {pwSaved ? "✓ Password Changed!" : "Update Password"}
//               </button>
//             </div>
//           </Card>

//           <Card dark={dark} title="Two-Factor Authentication" icon="📱">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p style={{ color: bodyText }} className="text-sm font-medium">
//                   TOTP App (Google Authenticator)
//                 </p>
//                 <p style={{ color: mutedText }} className="text-xs mt-0.5">
//                   Use an authenticator app for secure login
//                 </p>
//                 <span className="mt-2 inline-block text-xs bg-emerald-500/10 text-emerald-500 font-semibold px-2 py-0.5 rounded-full">
//                   ✓ Enabled
//                 </span>
//               </div>
//               <button className="px-3 py-2 text-xs font-semibold text-amber-500 border border-amber-500/20 hover:bg-amber-500/10 rounded-lg transition-all">
//                 Reconfigure
//               </button>
//             </div>
//           </Card>

//           <Card dark={dark} title="Active Sessions" icon="🖥️">
//             <div className="space-y-3">
//               {[
//                 { device: "Chrome on Windows 11",  location: "Sasarām, Bihar, IN", time: "Current session", current: true },
//                 { device: "Safari on iPhone 15",   location: "Patna, Bihar, IN",   time: "3 hours ago",     current: false },
//               ].map((s, i) => (
//                 <div key={i} style={{
//                   background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
//                   border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
//                 }} className="flex items-center justify-between p-3 rounded-lg">
//                   <div>
//                     <p style={{ color: bodyText }} className="text-sm font-medium">{s.device}</p>
//                     <p style={{ color: mutedText }} className="text-xs mt-0.5">{s.location} · {s.time}</p>
//                   </div>
//                   {s.current
//                     ? <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-semibold">This Device</span>
//                     : <button className="text-xs text-red-500 hover:text-red-400 font-semibold transition-colors">Revoke</button>
//                   }
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       )}

//       {/* ── Tab: Activity ── */}
//       {activeTab === "activity" && (
//         <Card dark={dark} title="Recent Account Activity" icon="📋">
//           <div className="space-y-0">
//             {recentActivity.map((item, i) => (
//               <div key={i} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}` }}
//                 className="flex items-start gap-3 py-3 last:border-0">
//                 <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
//                 <div>
//                   <p style={{ color: bodyText }} className="text-sm">{item.action}</p>
//                   <p style={{ color: mutedText }} className="text-xs mt-0.5">{item.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* ── Tab: Preferences ── */}
//       {activeTab === "preferences" && (
//         <Card dark={dark} title="Display & Notification Preferences" icon="⚙️">
//           <div className="space-y-0">
//             {[
//               { key: "compactSidebar", label: "Compact Sidebar",           desc: "Collapse sidebar by default on load" },
//               { key: "emailAlerts",    label: "Email Alerts",               desc: "Receive important activity via email" },
//               { key: "desktopNotif",   label: "Desktop Notifications",      desc: "Browser push for pending approvals" },
//               { key: "autoRefresh",    label: "Auto-Refresh Dashboard",     desc: "Refresh stats every 60 seconds" },
//               { key: "showTips",       label: "Show Onboarding Tips",       desc: "Show contextual help tooltips" },
//             ].map(({ key, label, desc }) => (
//               <div key={key} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}` }}
//                 className="flex items-start justify-between gap-4 py-4 last:border-0">
//                 <div>
//                   <p style={{ color: bodyText }} className="text-sm font-medium">{label}</p>
//                   <p style={{ color: mutedText }} className="text-xs mt-0.5">{desc}</p>
//                 </div>
//                 <button
//                   onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
//                   className={`relative w-11 h-6 rounded-full shrink-0 transition-all ${
//                     prefs[key] ? "bg-violet-500" : dark ? "bg-white/10" : "bg-slate-200"
//                   }`}
//                 >
//                   <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-5" : ""}`} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* ── Danger Zone ── */}
//       <div style={{
//         border: `1px solid ${dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.2)"}`,
//         background: dark ? "rgba(239,68,68,0.05)" : "rgba(254,242,242,0.8)",
//       }} className="rounded-xl p-5">
//         <h3 className="text-sm font-semibold text-red-500 mb-3">⚠️ Account Actions</h3>
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={logout}
//             className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all"
//           >
//             Sign Out
//           </button>
//           <button className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all">
//             Sign Out All Devices
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default SuperAdminProfile;

































import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// ─── SVG Icons ────────────────────────────────────────────────
const Icon = {
  Camera: () => (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx={12} cy={13} r={4}/>
    </svg>
  ),
  Edit: () => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  User: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx={12} cy={7} r={4}/>
    </svg>
  ),
  Shield: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Activity: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Settings: ({ size = 18, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={12} r={3}/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Zap: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Users: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx={9} cy={7} r={4}/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  BarChart: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <line x1={18} y1={20} x2={18} y2={10}/>
      <line x1={12} y1={20} x2={12} y2={4}/>
      <line x1={6}  y1={20} x2={6}  y2={14}/>
    </svg>
  ),
  Calendar: ({ size = 22, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={3} y={4} width={18} height={18} rx={2} ry={2}/>
      <line x1={16} y1={2} x2={16} y2={6}/>
      <line x1={8}  y1={2} x2={8}  y2={6}/>
      <line x1={3}  y1={10} x2={21} y2={10}/>
    </svg>
  ),
  Key: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  ),
  Phone: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15z"/>
    </svg>
  ),
  Monitor: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={2} y={3} width={20} height={14} rx={2} ry={2}/>
      <line x1={8} y1={21} x2={16} y2={21}/>
      <line x1={12} y1={17} x2={12} y2={21}/>
    </svg>
  ),
  CheckCircle: ({ size = 16, color = "#10b981" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  AlertTriangle: ({ size = 16, color = "#f59e0b" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1={12} y1={9} x2={12} y2={13}/>
      <line x1={12} y1={17} x2={12.01} y2={17}/>
    </svg>
  ),
  Lock: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={3} y={11} width={18} height={11} rx={2} ry={2}/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  Smartphone: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={5} y={2} width={14} height={20} rx={2} ry={2}/>
      <line x1={12} y1={18} x2={12.01} y2={18}/>
    </svg>
  ),
  LogOut: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  Bell: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  RefreshCw: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  HelpCircle: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <circle cx={12} cy={12} r={10}/>
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
    </svg>
  ),
  Sidebar: ({ size = 16, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <rect x={3} y={3} width={18} height={18} rx={2} ry={2}/>
      <line x1={9} y1={3} x2={9} y2={21}/>
    </svg>
  ),
  // Activity log icons
  Check:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>,
  Wrench:   () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={2}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  Ban:      () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={4.93} y1={4.93} x2={19.07} y2={19.07}/></svg>,
  Download: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  Plus:     () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>,
  ShieldOn: () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  LogIn:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={2}><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>,
  Flash:    () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ─── Avatar ───────────────────────────────────────────────────
const AvatarSection = ({ user, dark }) => {
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "SA";
  return (
    <div className="flex items-center gap-5">
      <div className="relative group">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-violet-500/25">
          {initials}
        </div>
        <button className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon.Camera />
        </button>
      </div>
      <div>
        <h2 style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-xl font-bold">{user?.name}</h2>
        <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mt-0.5">Super Administrator</p>
        <p style={{ color: dark ? "#64748b" : "#94a3b8" }} className="text-xs mt-1">{user?.email}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-emerald-500 font-medium">Active</span>
        </div>
      </div>
    </div>
  );
};

// ─── Info Field ───────────────────────────────────────────────
const InfoField = ({ label, value, edit, type = "text", dark }) => (
  <div>
    <label style={{ color: dark ? "#94a3b8" : "#475569" }}
      className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {edit ? (
      <input
        type={type}
        defaultValue={value}
        style={{
          background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
          border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
          color: dark ? "#ffffff" : "#0f172a",
        }}
        className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
      />
    ) : (
      <p style={{
        color: dark ? "#e2e8f0" : "#1e293b",
        background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
      }} className="text-sm px-3 py-2.5 rounded-lg">
        {value || "—"}
      </p>
    )}
  </div>
);

// ─── Card ─────────────────────────────────────────────────────
const Card = ({ title, icon, children, action, dark }) => (
  <div style={{
    background: dark ? "rgba(255,255,255,0.03)" : "#ffffff",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
  }} className="rounded-xl overflow-hidden">
    <div style={{
      background: dark ? "rgba(255,255,255,0.02)" : "#f8fafc",
      borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
    }} className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        {icon}
        <h3 style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-sm font-semibold">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// ─── Stat Badge ───────────────────────────────────────────────
const StatBadge = ({ label, value, icon, dark }) => (
  <div style={{
    background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(139,92,246,0.15)"}`,
  }} className="rounded-xl p-4 text-center hover:opacity-80 transition-all">
    <div className="flex justify-center mb-2">{icon}</div>
    <div style={{ color: dark ? "#ffffff" : "#0f172a" }} className="text-xl font-bold tabular-nums">{value}</div>
    <div style={{ color: dark ? "#94a3b8" : "#64748b" }} className="text-xs mt-0.5">{label}</div>
  </div>
);

// ─── Password Field ───────────────────────────────────────────
const PwField = ({ label, value, onChange, dark }) => (
  <div>
    <label style={{ color: dark ? "#94a3b8" : "#475569" }}
      className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
        color: dark ? "#ffffff" : "#0f172a",
      }}
      className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
    />
  </div>
);

// ─── Main ─────────────────────────────────────────────────────
const SuperAdminProfile = () => {
  const { dark } = useTheme();

  const user = {
    name:      localStorage.getItem("userName")  || "Super Admin",
    email:     localStorage.getItem("userEmail") || "superadmin@texora.ai",
    id:        localStorage.getItem("userId")    || "SA-001",
    joinedAt:  null,
    lastLogin: new Date().toISOString(),
  };

  const logout = () => { localStorage.clear(); window.location.href = "/login"; };

  const [editing,      setEditing]      = useState(false);
  const [pwForm,       setPwForm]       = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaved,      setPwSaved]      = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [activeTab,    setActiveTab]    = useState("profile");
  const [prefs,        setPrefs]        = useState({
    compactSidebar: false, emailAlerts: true, desktopNotif: true, showTips: false, autoRefresh: true,
  });

  const TABS = [
    { key: "profile",     label: "Profile Info",     icon: <Icon.User size={15} color={activeTab === "profile"     ? "#fff" : dark ? "#94a3b8" : "#64748b"} /> },
    { key: "security",    label: "Account Security", icon: <Icon.Shield size={15} color={activeTab === "security"   ? "#fff" : dark ? "#94a3b8" : "#64748b"} /> },
    { key: "activity",    label: "Recent Activity",  icon: <Icon.Activity size={15} color={activeTab === "activity" ? "#fff" : dark ? "#94a3b8" : "#64748b"} /> },
    { key: "preferences", label: "Preferences",      icon: <Icon.Settings size={15} color={activeTab === "preferences" ? "#fff" : dark ? "#94a3b8" : "#64748b"} /> },
  ];

  const recentActivity = [
    { action: "Approved trainer: Rajesh Kumar",        time: "2 minutes ago",      icon: <Icon.Check /> },
    { action: "Updated permissions for Admin role",    time: "1 hour ago",         icon: <Icon.Wrench /> },
    { action: "Suspended user: fake@spam.io",          time: "3 hours ago",        icon: <Icon.Ban /> },
    { action: "Exported Student Progress Report",      time: "Yesterday, 4:30 PM", icon: <Icon.Download /> },
    { action: "Added new Admin: Kiran Desai",          time: "Yesterday, 2:15 PM", icon: <Icon.Plus /> },
    { action: "Modified Security Settings (2FA)",      time: "2 days ago",         icon: <Icon.ShieldOn /> },
    { action: "Logged in from Sasarām, Bihar",         time: "2 days ago",         icon: <Icon.LogIn /> },
    { action: "Bulk approved 4 student registrations", time: "3 days ago",         icon: <Icon.Flash /> },
  ];

  const prefItems = [
    { key: "compactSidebar", label: "Compact Sidebar",        desc: "Collapse sidebar by default on load",   icon: <Icon.Sidebar size={15} color="#8b5cf6" /> },
    { key: "emailAlerts",    label: "Email Alerts",           desc: "Receive important activity via email",  icon: <Icon.Bell size={15} color="#8b5cf6" /> },
    { key: "desktopNotif",   label: "Desktop Notifications",  desc: "Browser push for pending approvals",    icon: <Icon.Bell size={15} color="#8b5cf6" /> },
    { key: "autoRefresh",    label: "Auto-Refresh Dashboard", desc: "Refresh stats every 60 seconds",        icon: <Icon.RefreshCw size={15} color="#8b5cf6" /> },
    { key: "showTips",       label: "Show Onboarding Tips",   desc: "Show contextual help tooltips",         icon: <Icon.HelpCircle size={15} color="#8b5cf6" /> },
  ];

  const handleSaveProfile  = () => { setEditing(false); setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500); };
  const handleSavePassword = () => {
    if (!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm) return;
    setPwSaved(true); setPwForm({ current: "", newPw: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const heroBg    = dark ? "from-violet-500/10 via-indigo-500/5 to-transparent border-violet-500/20"
                         : "from-violet-50 via-indigo-50/50 to-transparent border-violet-200";
  const bodyText  = dark ? "#ffffff" : "#0f172a";
  const mutedText = dark ? "#64748b" : "#94a3b8";

  return (
    <div className="w-full max-w-none space-y-6">

      {/* ── Hero ── */}
      <div className={`rounded-xl bg-gradient-to-br border p-6 ${heroBg}`}>
        <AvatarSection user={user} dark={dark} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: "Total Actions",     value: "1,284", icon: <Icon.Zap     size={22} color="#8b5cf6" /> },
            { label: "Users Managed",     value: "72",    icon: <Icon.Users   size={22} color="#3b82f6" /> },
            { label: "Reports Generated", value: "36",    icon: <Icon.BarChart size={22} color="#10b981" /> },
            { label: "Days Active",       value: "142",   icon: <Icon.Calendar size={22} color="#f59e0b" /> },
          ].map((s) => <StatBadge key={s.label} {...s} dark={dark} />)}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        background: dark ? "rgba(255,255,255,0.03)" : "#ffffff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        boxShadow: dark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
      }} className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={activeTab !== t.key ? { color: dark ? "#94a3b8" : "#64748b" } : {}}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === t.key ? "bg-violet-500 text-white" : "hover:text-violet-500"}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <Card
          dark={dark}
          title="Personal Information"
          icon={<Icon.User size={16} color="#8b5cf6" />}
          action={
            editing ? (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)}
                  style={{ color: dark ? "#94a3b8" : "#64748b", background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all hover:opacity-80">
                  Cancel
                </button>
                <button onClick={handleSaveProfile}
                  className="px-3 py-1.5 text-xs font-semibold bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all">
                  Save
                </button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)}
                style={{ color: dark ? "#94a3b8" : "#64748b", background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:opacity-80">
                <Icon.Edit />
                Edit
              </button>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField dark={dark} label="Full Name"      value={user?.name}  edit={editing} />
            <InfoField dark={dark} label="Email Address"  value={user?.email} edit={editing} type="email" />
            <InfoField dark={dark} label="User ID"        value={user?.id} />
            <InfoField dark={dark} label="Role"           value="Super Administrator" />
            <InfoField dark={dark} label="Account Status" value="Active" />
            <InfoField dark={dark} label="Member Since"   value={user?.joinedAt
              ? new Date(user.joinedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"} />
            <InfoField dark={dark} label="Last Login"     value={user?.lastLogin
              ? new Date(user.lastLogin).toLocaleString("en-IN") : "—"} />
            <InfoField dark={dark} label="Phone"          value="+91 98765 43210" edit={editing} type="tel" />
          </div>
          {profileSaved && (
            <div className="mt-4 flex items-center gap-2">
              <Icon.CheckCircle size={14} color="#10b981" />
              <p className="text-xs text-emerald-500 font-semibold">Profile updated successfully</p>
            </div>
          )}
        </Card>
      )}

      {/* ── Security Tab ── */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <Card dark={dark} title="Change Password" icon={<Icon.Key size={16} color="#8b5cf6" />}>
            <div className="space-y-4">
              <PwField dark={dark} label="Current Password"     value={pwForm.current} onChange={(v) => setPwForm((p) => ({ ...p, current: v }))} />
              <PwField dark={dark} label="New Password"         value={pwForm.newPw}   onChange={(v) => setPwForm((p) => ({ ...p, newPw: v }))} />
              <PwField dark={dark} label="Confirm New Password" value={pwForm.confirm} onChange={(v) => setPwForm((p) => ({ ...p, confirm: v }))} />
              {pwForm.newPw && pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
                <div className="flex items-center gap-1.5">
                  <Icon.AlertTriangle size={13} color="#ef4444" />
                  <p className="text-xs text-red-500">Passwords do not match</p>
                </div>
              )}
              <button onClick={handleSavePassword}
                disabled={!pwForm.current || !pwForm.newPw || pwForm.newPw !== pwForm.confirm}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all disabled:opacity-40">
                <Icon.Lock size={14} color="white" />
                {pwSaved ? "Password Changed!" : "Update Password"}
              </button>
            </div>
          </Card>

          <Card dark={dark} title="Two-Factor Authentication" icon={<Icon.Smartphone size={16} color="#8b5cf6" />}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: bodyText }} className="text-sm font-medium">TOTP App (Google Authenticator)</p>
                <p style={{ color: mutedText }} className="text-xs mt-0.5">Use an authenticator app for secure login</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Icon.CheckCircle size={12} color="#10b981" />
                  <span className="text-xs text-emerald-500 font-semibold">Enabled</span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-500 border border-amber-500/20 hover:bg-amber-500/10 rounded-lg transition-all">
                <Icon.Settings size={13} color="#f59e0b" />
                Reconfigure
              </button>
            </div>
          </Card>

          <Card dark={dark} title="Active Sessions" icon={<Icon.Monitor size={16} color="#8b5cf6" />}>
            <div className="space-y-3">
              {[
                { device: "Chrome on Windows 11", location: "Sasarām, Bihar, IN", time: "Current session", current: true },
                { device: "Safari on iPhone 15",  location: "Patna, Bihar, IN",   time: "3 hours ago",    current: false },
              ].map((s, i) => (
                <div key={i} style={{
                  background: dark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#e2e8f0"}`,
                }} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon.Monitor size={16} color={dark ? "#64748b" : "#94a3b8"} />
                    <div>
                      <p style={{ color: bodyText }} className="text-sm font-medium">{s.device}</p>
                      <p style={{ color: mutedText }} className="text-xs mt-0.5">{s.location} · {s.time}</p>
                    </div>
                  </div>
                  {s.current
                    ? <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-emerald-500 font-semibold">This Device</span>
                      </div>
                    : <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-400 font-semibold transition-colors">
                        <Icon.Ban />
                        Revoke
                      </button>
                  }
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Activity Tab ── */}
      {activeTab === "activity" && (
        <Card dark={dark} title="Recent Account Activity" icon={<Icon.Activity size={16} color="#8b5cf6" />}>
          <div>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}` }}
                className="flex items-start gap-3 py-3 last:border-0">
                <div style={{
                  background: dark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  borderRadius: "8px", padding: "6px", flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ color: bodyText }} className="text-sm">{item.action}</p>
                  <p style={{ color: mutedText }} className="text-xs mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Preferences Tab ── */}
      {activeTab === "preferences" && (
        <Card dark={dark} title="Display & Notification Preferences" icon={<Icon.Settings size={16} color="#8b5cf6" />}>
          <div>
            {prefItems.map(({ key, label, desc, icon }) => (
              <div key={key} style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}` }}
                className="flex items-center justify-between gap-4 py-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div style={{
                    background: dark ? "rgba(139,92,246,0.1)" : "#f5f3ff",
                    borderRadius: "8px", padding: "7px", flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ color: bodyText }} className="text-sm font-medium">{label}</p>
                    <p style={{ color: mutedText }} className="text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-11 h-6 rounded-full shrink-0 transition-all ${
                    prefs[key] ? "bg-violet-500" : dark ? "bg-white/10" : "bg-slate-200"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Danger Zone ── */}
      <div style={{
        border: `1px solid ${dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.2)"}`,
        background: dark ? "rgba(239,68,68,0.05)" : "rgba(254,242,242,0.8)",
      }} className="rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Icon.AlertTriangle size={16} color="#ef4444" />
          <h3 className="text-sm font-semibold text-red-500">Account Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all">
            <Icon.LogOut size={14} color="#ef4444" />
            Sign Out
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all">
            <Icon.LogOut size={14} color="#ef4444" />
            Sign Out All Devices
          </button>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminProfile;