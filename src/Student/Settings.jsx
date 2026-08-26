
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../SuperAdmin/context/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();

  /* ================= THEME HANDLER ================= */
    const handleThemeChange = (newTheme) => {
    const wantDark =
      newTheme === "dark" ||
      (newTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (wantDark !== (theme === "dark")) toggleTheme();
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
