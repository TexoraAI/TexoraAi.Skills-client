
// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import {
//   User,
//   Shield,
//   Bell,
//   Palette,
//   Mail,
//   Lock,
//   ChevronRight,
//   Moon,
//   Sun,
//   Monitor,
//   Check,
//   Trash2,
//   Smartphone,
//   Globe,
//   Key,
//   AlertTriangle,
//   Settings as SettingsIcon,
//   Zap,
// } from "lucide-react";

// const Settings = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ================= BASE PATH =================
//   const getBasePath = () => {
//     if (location.pathname.startsWith("/student")) return "/student";
//     if (location.pathname.startsWith("/trainer")) return "/trainer";
//     if (location.pathname.startsWith("/admin")) return "/admin";
//     if (location.pathname.startsWith("/business")) return "/business";
//     return "";
//   };

//   const basePath = getBasePath();

//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [pushNotifications, setPushNotifications] = useState(true);
//   const [courseUpdates, setCourseUpdates] = useState(true);
//   const [weeklyDigest, setWeeklyDigest] = useState(false);
//   const [theme, setTheme] = useState("system");

//   // ================= THEME HANDLER =================
//   const handleThemeChange = (newTheme) => {
//     setTheme(newTheme);

//     if (newTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else if (newTheme === "light") {
//       document.documentElement.classList.remove("dark");
//     } else {
//       const prefersDark = window.matchMedia(
//         "(prefers-color-scheme: dark)"
//       ).matches;
//       document.documentElement.classList.toggle("dark", prefersDark);
//     }
//   };

//   // ================= SMALL COMPONENTS =================
//   const SettingCard = ({ icon: Icon, title, description, children, badge, gradient }) => (
//     <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
//       <div className="p-6">
//         <div className="flex gap-4">
//           <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient || 'from-indigo-500 to-purple-600'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
//             <Icon className="w-6 h-6 text-white" />
//           </div>

//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               <h2 className="font-bold text-xl text-slate-900 dark:text-white">
//                 {title}
//               </h2>

//               {badge && (
//                 <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-sm">
//                   {badge}
//                 </span>
//               )}
//             </div>

//             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//               {description}
//             </p>
//           </div>
//         </div>

//         {children && (
//           <div className="mt-6 space-y-3">
//             {children}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const ActionButton = ({ icon: Icon, label, onClick, subtitle }) => (
//     <button
//       onClick={onClick}
//       className="
//         group flex items-center justify-between w-full
//         px-4 py-4 rounded-xl
//         bg-slate-50 dark:bg-slate-700/50
//         hover:bg-slate-100 dark:hover:bg-slate-700
//         border border-slate-200 dark:border-slate-600
//         transition-all duration-300
//         hover:shadow-md hover:scale-[1.02]
//       "
//     >
//       <div className="flex items-center gap-3">
//         <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
//           <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
//         </div>
//         <div className="text-left">
//           <span className="text-sm font-semibold text-slate-900 dark:text-white block">
//             {label}
//           </span>
//           {subtitle && (
//             <span className="text-xs text-slate-500 dark:text-slate-400">
//               {subtitle}
//             </span>
//           )}
//         </div>
//       </div>
//       <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-300" />
//     </button>
//   );

//   const ToggleSwitch = ({ label, description, enabled, onChange }) => (
//     <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200">
//       <div className="flex-1">
//         <span className="text-sm font-semibold text-slate-900 dark:text-white block">
//           {label}
//         </span>
//         {description && (
//           <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
//             {description}
//           </span>
//         )}
//       </div>

//       <button
//         onClick={() => onChange(!enabled)}
//         className={`relative w-12 h-6 rounded-full transition-all duration-300 shadow-inner ${
//           enabled 
//             ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg" 
//             : "bg-slate-300 dark:bg-slate-600"
//         }`}
//       >
//         <span
//           className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${
//             enabled ? "translate-x-6" : "translate-x-0"
//           }`}
//         />
//       </button>
//     </div>
//   );

//   const ThemeOption = ({ value, icon: Icon, label, description }) => (
//     <button
//       onClick={() => handleThemeChange(value)}
//       className={`group flex items-center gap-4 w-full px-5 py-4 rounded-xl border transition-all duration-300 ${
//         theme === value
//           ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-md"
//           : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30"
//       }`}
//     >
//       <div className={`p-2.5 rounded-lg transition-colors ${
//         theme === value 
//           ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
//           : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
//       }`}>
//         <Icon className="w-5 h-5" />
//       </div>
      
//       <div className="flex-1 text-left">
//         <span className="text-sm font-semibold text-slate-900 dark:text-white block">
//           {label}
//         </span>
//         {description && (
//           <span className="text-xs text-slate-500 dark:text-slate-400">
//             {description}
//           </span>
//         )}
//       </div>
      
//       {theme === value && (
//         <div className="p-1 rounded-full bg-indigo-500">
//           <Check className="w-4 h-4 text-white" />
//         </div>
//       )}
//     </button>
//   );

//   // ================= RENDER =================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
//       <div className="max-w-5xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
//           <div className="relative z-10">
//             <div className="flex items-center gap-4 mb-3">
//               <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
//                 <SettingsIcon className="w-8 h-8 text-white" />
//               </div>
//               <h1 className="text-4xl font-bold text-white">Settings</h1>
//             </div>
//             <p className="text-lg text-white/90 max-w-2xl">
//               Customize your experience and manage your account preferences
//             </p>
//           </div>
          
//           {/* Decorative elements */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
//                 <User className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-semibold text-slate-900 dark:text-white">Profile</span>
//             </div>
//             <p className="text-xs text-slate-600 dark:text-slate-400">Edit your personal info</p>
//           </button>

//           <button className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
//                 <Shield className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-semibold text-slate-900 dark:text-white">Security</span>
//             </div>
//             <p className="text-xs text-slate-600 dark:text-slate-400">Manage account safety</p>
//           </button>

//           <button className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
//                 <Bell className="w-5 h-5 text-white" />
//               </div>
//               <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
//             </div>
//             <p className="text-xs text-slate-600 dark:text-slate-400">Configure alerts</p>
//           </button>
//         </div>

//         {/* PROFILE */}
//         <SettingCard
//           icon={User}
//           title="Account Information"
//           description="Manage your personal details and contact information"
//           gradient="from-blue-500 to-indigo-600"
//         >
//           <ActionButton
//             icon={Mail}
//             label="Email Address"
//             subtitle="Update your email for notifications"
//             onClick={() => navigate(`${basePath}/settings/update-email`)}
//           />
//           <ActionButton
//             icon={User}
//             label="Edit Profile"
//             subtitle="Update name, bio, and avatar"
//             onClick={() => navigate(`${basePath}/edit-profile`)}
//           />
//           <ActionButton
//             icon={Globe}
//             label="Language & Region"
//             subtitle="English (US)"
//             onClick={() => {}}
//           />
//         </SettingCard>

//         {/* SECURITY */}
//         <SettingCard
//           icon={Shield}
//           title="Security & Privacy"
//           description="Keep your account secure with enhanced protection"
//           badge="Important"
//           gradient="from-emerald-500 to-teal-600"
//         >
//           <ActionButton
//             icon={Lock}
//             label="Change Password"
//             subtitle="Last changed 30 days ago"
//             onClick={() => navigate("/reset-password")}
//           />
//           <ActionButton
//             icon={Key}
//             label="Two-Factor Authentication"
//             subtitle="Add an extra layer of security"
//             onClick={() => navigate(`${basePath}/settings/2fa`)}
//           />
//           <ActionButton
//             icon={Smartphone}
//             label="Trusted Devices"
//             subtitle="Manage devices that can access your account"
//             onClick={() => {}}
//           />
//         </SettingCard>

//         {/* NOTIFICATIONS */}
//         <SettingCard
//           icon={Bell}
//           title="Notification Preferences"
//           description="Control how and when you receive updates"
//           gradient="from-purple-500 to-pink-600"
//         >
//           <ToggleSwitch
//             label="Email Notifications"
//             description="Receive important updates via email"
//             enabled={emailNotifications}
//             onChange={setEmailNotifications}
//           />
//           <ToggleSwitch
//             label="Push Notifications"
//             description="Get instant alerts on your device"
//             enabled={pushNotifications}
//             onChange={setPushNotifications}
//           />
//           <ToggleSwitch
//             label="Course Updates"
//             description="New lessons and announcements"
//             enabled={courseUpdates}
//             onChange={setCourseUpdates}
//           />
//           <ToggleSwitch
//             label="Weekly Digest"
//             description="Summary of your learning activity"
//             enabled={weeklyDigest}
//             onChange={setWeeklyDigest}
//           />
//         </SettingCard>

//         {/* APPEARANCE */}
//         <SettingCard
//           icon={Palette}
//           title="Appearance"
//           description="Customize how the app looks on your device"
//           gradient="from-amber-500 to-orange-600"
//         >
//           <ThemeOption 
//             value="light" 
//             icon={Sun} 
//             label="Light Mode" 
//             description="Bright and clean interface"
//           />
//           <ThemeOption 
//             value="dark" 
//             icon={Moon} 
//             label="Dark Mode" 
//             description="Easy on the eyes in low light"
//           />
//           <ThemeOption 
//             value="system" 
//             icon={Monitor} 
//             label="System Default" 
//             description="Matches your device settings"
//           />
//         </SettingCard>

//         {/* ADVANCED */}
//         <SettingCard
//           icon={Zap}
//           title="Advanced Settings"
//           description="Additional configuration options"
//           gradient="from-cyan-500 to-blue-600"
//         >
//           <ActionButton
//             icon={Globe}
//             label="Data & Storage"
//             subtitle="Manage cached content and downloads"
//             onClick={() => {}}
//           />
//           <ActionButton
//             icon={Shield}
//             label="Privacy Settings"
//             subtitle="Control your data and visibility"
//             onClick={() => {}}
//           />
//         </SettingCard>

//         {/* DANGER ZONE */}
//         <div className="rounded-2xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6 shadow-lg">
//           <div className="flex gap-4">
//             <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50">
//               <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
//             </div>
            
//             <div className="flex-1">
//               <h3 className="font-bold text-xl text-red-900 dark:text-red-200 mb-2">
//                 Danger Zone
//               </h3>
//               <p className="text-sm text-red-700 dark:text-red-300 mb-4 leading-relaxed">
//                 Once you delete your account, there is no going back. All your data, courses, and progress will be permanently removed. Please be certain.
//               </p>

//               <button
//                 onClick={() => {
//                   if (
//                     window.confirm(
//                       "⚠️ Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted."
//                     )
//                   ) {
//                     navigate(`${basePath}/delete-account`);
//                   }
//                 }}
//                 className="
//                   group flex items-center gap-2
//                   px-6 py-3 rounded-xl
//                   bg-red-600 hover:bg-red-700
//                   text-white font-semibold
//                   shadow-lg hover:shadow-xl
//                   transition-all duration-300
//                   hover:scale-105
//                 "
//               >
//                 <Trash2 className="w-4 h-4" />
//                 Delete Account Permanently
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer Info */}
//         <div className="text-center py-6">
//           <p className="text-sm text-slate-500 dark:text-slate-500">
//             Need help? Visit our{" "}
//             <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
//               Help Center
//             </button>{" "}
//             or{" "}
//             <button className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
//               Contact Support
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;










import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Palette,
  Mail,
  Lock,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
  Trash2,
  Smartphone,
  Globe,
  Key,
  AlertTriangle,
  Settings as SettingsIcon,
  Zap,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= BASE PATH ================= */
  const getBasePath = () => {
    if (location.pathname.startsWith("/student")) return "/student";
    if (location.pathname.startsWith("/trainer")) return "/trainer";
    if (location.pathname.startsWith("/admin")) return "/admin";
    if (location.pathname.startsWith("/business")) return "/business";
    return "";
  };

  const basePath = getBasePath();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [theme, setTheme] = useState("system");

  /* ================= THEME HANDLER ================= */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  };

  /* ================= SMALL COMPONENTS ================= */

  const SettingCard = ({
    icon: Icon,
    title,
    description,
    children,
    badge,
    gradient,
  }) => (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all">
      <div className="p-6">
        <div className="flex gap-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${
              gradient || "from-sky-500 to-indigo-600"
            } shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                {title}
              </h2>

              {badge && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-600 text-white font-semibold">
                  {badge}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
        </div>

        {children && <div className="mt-6 space-y-3">{children}</div>}
      </div>
    </div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, subtitle }) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-4 rounded-xl
                 bg-slate-50 dark:bg-slate-800
                 hover:bg-slate-100 dark:hover:bg-slate-700
                 border border-slate-200 dark:border-slate-700
                 transition hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
          <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        </div>
        <div className="text-left">
          <span className="text-sm font-semibold text-slate-900 dark:text-white block">
            {label}
          </span>
          {subtitle && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </button>
  );

  const ToggleSwitch = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition ${
          enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );

  const ThemeOption = ({ value, icon: Icon, label, description }) => (
    <button
      onClick={() => handleThemeChange(value)}
      className={`flex items-center gap-4 w-full px-5 py-4 rounded-xl border transition
        ${
          theme === value
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
    >
      <div
        className={`p-2.5 rounded-lg ${
          theme === value
            ? "bg-gradient-to-br from-sky-500 to-indigo-600 text-white"
            : "bg-slate-100 dark:bg-slate-700 text-slate-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      {theme === value && (
        <div className="p-1 rounded-full bg-blue-600">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </button>
  );

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= HERO ================= */}
        <div
          className="relative overflow-hidden rounded-3xl
                     bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
                     dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600
                     p-8 shadow-2xl text-white"
        >
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/30 backdrop-blur shadow">
              <SettingsIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-white/85">
                Customize your experience and manage preferences
              </p>
            </div>
          </div>
        </div>

        {/* PROFILE */}
        <SettingCard
          icon={User}
          title="Account Information"
          description="Manage personal details"
        >
          <ActionButton
            icon={Mail}
            label="Email Address"
            subtitle="Update email"
            onClick={() => navigate(`${basePath}/settings/update-email`)}
          />
          <ActionButton
            icon={User}
            label="Edit Profile"
            subtitle="Update name and avatar"
            onClick={() => navigate(`${basePath}/edit-profile`)}
          />
        </SettingCard>

        {/* SECURITY */}
        <SettingCard
          icon={Shield}
          title="Security & Privacy"
          description="Protect your account"
          badge="Important"
          gradient="from-emerald-500 to-teal-600"
        >
          <ActionButton
            icon={Lock}
            label="Change Password"
            onClick={() => navigate("/reset-password")}
          />
          <ActionButton
            icon={Key}
            label="Two-Factor Authentication"
            onClick={() => navigate(`${basePath}/settings/2fa`)}
          />
          <ActionButton
            icon={Smartphone}
            label="Trusted Devices"
            onClick={() => {}}
          />
        </SettingCard>

        {/* NOTIFICATIONS */}
        <SettingCard
          icon={Bell}
          title="Notifications"
          description="Manage alerts"
          gradient="from-blue-500 to-indigo-600"
        >
          <ToggleSwitch
            label="Email Notifications"
            description="Receive updates via email"
            enabled={emailNotifications}
            onChange={setEmailNotifications}
          />
          <ToggleSwitch
            label="Push Notifications"
            description="Instant alerts"
            enabled={pushNotifications}
            onChange={setPushNotifications}
          />
          <ToggleSwitch
            label="Course Updates"
            description="New lessons & announcements"
            enabled={courseUpdates}
            onChange={setCourseUpdates}
          />
          <ToggleSwitch
            label="Weekly Digest"
            description="Weekly summary"
            enabled={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </SettingCard>

        {/* APPEARANCE */}
        <SettingCard
          icon={Palette}
          title="Appearance"
          description="Choose your theme"
          gradient="from-amber-500 to-orange-600"
        >
          <ThemeOption value="light" icon={Sun} label="Light Mode" />
          <ThemeOption value="dark" icon={Moon} label="Dark Mode" />
          <ThemeOption value="system" icon={Monitor} label="System Default" />
        </SettingCard>

        {/* DANGER ZONE */}
        <div className="rounded-2xl border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-6">
          <div className="flex gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/40">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-red-900 dark:text-red-200">
                Danger Zone
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Deleting your account is permanent and cannot be undone.
              </p>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure? This action cannot be undone."
                    )
                  ) {
                    navigate(`${basePath}/delete-account`);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
