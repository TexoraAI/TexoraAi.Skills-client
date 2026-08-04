// export default IlmDemoProfilePage;
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
  ShieldCheck,
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
  UploadCloud,
  Camera,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  BookOpen,
  Globe,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Eye,
  EyeOff,
  Trophy,
  Crown,
  ArrowRight,
  Minus,
} from "lucide-react";

import { useAvatarContext } from "../context/AvatarContext";
import authService from "../services/authService";
import userService from "@/services/userService";
import { getOrgSummary } from "../services/batchService";

/* ── Mark the profile as complete ── */
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
  if (value && hasAuthToken()) {
    authService
      .markProfileCompleted()
      .catch((err) =>
        console.error("Failed to sync profileCompleted with backend:", err),
      );
  }
};

const syncProfileInfoCompleted = (value) => {
  try {
    const cached = JSON.parse(localStorage.getItem("lms_user") || "{}");
    localStorage.setItem(
      "lms_user",
      JSON.stringify({ ...cached, profileInfoCompleted: !!value }),
    );
  } catch {
    localStorage.setItem(
      "lms_user",
      JSON.stringify({ profileInfoCompleted: !!value }),
    );
  }
};

const readCompletionFlags = () => {
  try {
    const u = JSON.parse(localStorage.getItem("lms_user") || "{}");
    return { info: !!u.profileInfoCompleted, details: !!u.profileCompleted };
  } catch {
    return { info: false, details: false };
  }
};
/* ── NEW: safely read the locally-cached user (Google email/name land
   here at login time — see LoginModal's handleGoogleSuccess in
   IlmOraDemoPage.jsx). Used as a fallback whenever the backend profile
   fetch is missing a field or fails outright (e.g. brand-new user whose
   backend record doesn't exist yet → 404). ── */
const getLocalUser = () => {
  try {
    return JSON.parse(localStorage.getItem("lms_user") || "{}");
  } catch {
    return {};
  }
};

/* ── Real backend JWT check ──
   Brand-new Google demo users only get a local `lms_user` marker, no
   real `lms_token`. Calling authenticated endpoints without a token
   returns 401, and if a global interceptor exists that force-logs-out
   on 401, it silently bounces the user to "/" a couple seconds later.
   Guard every authenticated call with this check so the demo flow
   stays 100% local until a real token exists. */
const hasAuthToken = () => !!localStorage.getItem("lms_token");

/* ══════════════════════════════════════════════════════════════
   AVATAR COMPONENT — UNCHANGED
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
  const radius = shape === "circle" ? "9999px" : "22px";
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
          border: "3px solid rgba(255,255,255,0.9)",
          boxShadow: "0 6px 18px rgba(123,47,247,0.25)",
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
   ROLE CONFIG — UNCHANGED
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

/* ── role dropdown helpers for the editable Role field ──
   Derived from ROLE_CONFIG so the dropdown never drifts out of sync
   with the roles this page actually supports.

   NOTE: "Business" is intentionally excluded from the *selectable*
   dropdown list (ROLE_LABELS) — it duplicates the "Admin" concept
   (an organisation/tenant admin) and having both confused the role
   switch flow. ROLE_KEY_BY_LABEL still includes it so any pre-existing
   "business" role data continues to resolve correctly. */
const ROLE_LABELS = ["Student", "Trainer", "Business & Partnership"];
const ROLE_KEY_BY_LABEL = {
  Student: "student",
  Trainer: "trainer",
  "Business & Partnership": "admin", // selecting this opens the Admin profile, NOT a separate Business profile
};

/* ══════════════════════════════════════════════════════════════
   ACCENT MAP — UNCHANGED
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
    highlight:
      "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
    solid: "bg-violet-500",
    tabActive: "bg-violet-600 hover:bg-violet-600 text-white",
  },
  emerald: {
    btn: "bg-emerald-600 hover:bg-emerald-700",
    text: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30",
    bar: "bg-emerald-500",
    ring: "focus:ring-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    highlight:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    solid: "bg-emerald-500",
    tabActive: "bg-emerald-600 hover:bg-emerald-600 text-white",
  },
  rose: {
    btn: "bg-rose-600 hover:bg-rose-700",
    text: "text-rose-600 dark:text-rose-400",
    badge:
      "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
    bar: "bg-rose-500",
    ring: "focus:ring-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-500/20",
    highlight:
      "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300",
    solid: "bg-rose-500",
    tabActive: "bg-rose-600 hover:bg-rose-600 text-white",
  },
  amber: {
    btn: "bg-amber-500 hover:bg-amber-600",
    text: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
    bar: "bg-amber-500",
    ring: "focus:ring-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    highlight:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300",
    solid: "bg-amber-500",
    tabActive: "bg-amber-500 hover:bg-amber-500 text-white",
  },
};

/* ══════════════════════════════════════════════════════════════
   PROFILE SIDEBAR NAV — RESTYLED to match reference: mini profile
   card + "MAIN MENU" list + promo card + help footer, all inside
   one sticky white card. Same props/API as before (user, tabs,
   activeTab, onChange, accent) — no logic changed.
══════════════════════════════════════════════════════════════ */
const ProfileSidebarNav = ({ user, tabs, activeTab, onChange, accent }) => {
  const ac = ACCENT[accent] || ACCENT.violet;
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden lg:sticky lg:top-8">
        {/* Mini profile card */}
        <div className="flex flex-col items-center text-center gap-2 px-4 sm:px-6 pt-6 sm:pt-8 pb-5 sm:pb-6">
          <Avatar
            initials={user.avatar}
            size={80}
            shape="rounded"
            online
            className="sm:hidden"
          />
          <div className="hidden sm:block">
            <Avatar initials={user.avatar} size={92} shape="rounded" online />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white mt-2">
            {user.name}
          </p>
          <span
            className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${ac.badge}`}
          >
            {user.label}
          </span>
          <div className="flex flex-col items-center gap-1 mt-2 text-xs text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5" /> {user.id}
            </span>
            <span className="flex items-center gap-1.5 truncate max-w-[220px]">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-500 font-medium">Active</span>
          </div>
        </div>

        {/* Nav items */}
        <div className="px-2 sm:px-3">
          <p className="px-3 pb-2 text-[10px] font-bold text-gray-300 dark:text-slate-600 uppercase tracking-widest">
            Main Menu
          </p>
          <nav className="flex flex-row lg:flex-col gap-1 pb-3 overflow-x-auto lg:overflow-visible -mx-1 px-1 lg:mx-0 lg:px-0">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChange(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 lg:shrink ${
                    active
                      ? `${ac.tabActive} shadow-sm`
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {active && (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden lg:inline-block" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Promo card */}
        <div className="mx-2 sm:mx-3 mb-3 p-4 sm:p-5 rounded-2xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/15">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-3">
            <Crown className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            Complete Your Profile
          </h4>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
            Complete your profile to unlock all features and personalize your
            learning experience.
          </p>
          <button
            onClick={() => onChange("details")}
            className={`w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 border border-violet-200 dark:border-violet-500/20 hover:bg-violet-100/60 dark:hover:bg-white/15 transition-colors ${ac.text}`}
          >
            Learn More <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};

/* ══════════════════════════════════════════════════════════════
   PROFILE HERO CARD — presentational; percent derived from the same
   `completionItems` array the page already builds.
══════════════════════════════════════════════════════════════ */
const ProfileHeroCard = ({ user, accent, items }) => {
  const ac = ACCENT[accent] || ACCENT.violet;
  const percent = Math.round(
    (items.filter((i) => i.done).length / items.length) * 100,
  );
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/70 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-orange-500/10 border border-orange-100/70 dark:border-white/10 shadow-sm">
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-5 sm:gap-6">
        <Avatar
          initials={user.avatar}
          size={72}
          editable
          online
          shape="rounded"
          className="sm:hidden"
        />
        <div className="hidden sm:block">
          <Avatar
            initials={user.avatar}
            size={88}
            editable
            online
            shape="rounded"
          />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight break-words">
              {user.name}
            </h1>
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${ac.badge}`}
            >
              {user.label}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 sm:gap-x-5 gap-y-1.5 text-xs text-gray-500 dark:text-slate-400 mt-2">
            <span className="flex items-center gap-1.5">
              <IdCard className="w-3.5 h-3.5 shrink-0" /> {user.id}
            </span>
            <span className="flex items-center gap-1.5 break-all">
              <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" /> Joined {user.joined}
            </span>
          </div>

          <div className="mt-4 sm:mt-5 max-w-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-gray-700 dark:text-white/80">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {percent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/70 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${ac.solid} transition-all duration-500`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center text-center bg-white/70 dark:bg-white/5 rounded-2xl px-5 lg:px-6 py-4 lg:py-5 shrink-0 backdrop-blur-sm w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
            {percent < 100 ? "Keep Going!" : "All Done!"}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 max-w-[150px]">
            {percent < 100
              ? "Complete your profile to unlock all features."
              : "Your profile is fully set up."}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STAT CARD + STATS GRID
══════════════════════════════════════════════════════════════ */
const StatCard = ({
  icon: Icon,
  label,
  value,
  footer,
  footerColor,
  iconBg,
  iconColor,
}) => (
  <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-sm min-w-0">
    <div
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 ${iconBg}`}
    >
      <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
    </div>
    <p className="text-xs text-gray-400 dark:text-slate-500 mb-1 truncate">
      {label}
    </p>
    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
      {value}
    </p>
    {footer && (
      <p className={`text-xs font-medium mt-1 ${footerColor} truncate`}>
        {footer}
      </p>
    )}
  </div>
);

const ProfileStatsGrid = ({ items, user, accent }) => {
  const ac = ACCENT[accent] || ACCENT.violet;
  const percent = Math.round(
    (items.filter((i) => i.done).length / items.length) * 100,
  );
  const emailDone = !!items.find((i) => i.label === "Email Verified")?.done;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCard
        icon={User}
        label="Profile Completion"
        value={`${percent}%`}
        footer={percent < 100 ? "Keep it up!" : "Complete"}
        footerColor={ac.text}
        iconBg={ac.iconBg}
        iconColor={ac.text}
      />
      <StatCard
        icon={ShieldCheck}
        label="Email Verified"
        value={emailDone ? "Yes" : "No"}
        footer={emailDone ? "Verified" : "Pending"}
        footerColor={emailDone ? "text-emerald-500" : "text-red-500"}
        iconBg="bg-emerald-100 dark:bg-emerald-500/20"
        iconColor="text-emerald-500"
      />
      <StatCard
        icon={GraduationCap}
        label="Current Role"
        value={user.label}
        footer="Learning Journey"
        footerColor="text-orange-500"
        iconBg="bg-orange-100 dark:bg-orange-500/20"
        iconColor="text-orange-500"
      />
      <StatCard
        icon={Calendar}
        label="Member Since"
        value={user.joined}
        footer="—"
        footerColor="text-blue-500"
        iconBg="bg-blue-100 dark:bg-blue-500/20"
        iconColor="text-blue-500"
      />
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   PROFILE TIPS CARD
══════════════════════════════════════════════════════════════ */
const ProfileTipsCard = ({ accent, items }) => {
  const tips = [...items, { label: "Explore learning paths", done: false }];
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-500" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          Profile Tips
        </h4>
      </div>
      <ul className="space-y-2.5 mb-4">
        {tips.map((t) => (
          <li key={t.label} className="flex items-center gap-2 text-xs">
            {t.done ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-white/20 shrink-0" />
            )}
            <span
              className={
                t.done
                  ? "text-gray-700 dark:text-white/80"
                  : "text-gray-400 dark:text-slate-500"
              }
            >
              {t.label}
            </span>
          </li>
        ))}
      </ul>
      <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
        View Learning Paths <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   SECURITY STATUS CARD
══════════════════════════════════════════════════════════════ */
const SecurityStatusCard = ({ accent, emailVerified }) => {
  const ac = ACCENT[accent] || ACCENT.violet;
  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${ac.iconBg}`}
        >
          <Shield className={`w-4 h-4 ${ac.text}`} />
        </div>
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">
          Security Status
        </h4>
      </div>
      <ul className="space-y-3.5 mb-4">
        <li className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck
              className={`w-4 h-4 shrink-0 ${emailVerified ? "text-emerald-500" : "text-gray-300 dark:text-slate-600"}`}
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-white/85">
                Email Verification
              </p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                {emailVerified ? "Your email is verified" : "Not verified"}
              </p>
            </div>
          </div>
          {emailVerified && (
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          )}
        </li>
        <li className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Lock className="w-4 h-4 shrink-0 text-emerald-500" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-white/85">
                Password Strength
              </p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                Strong
              </p>
            </div>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        </li>
        <li className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-4 h-4 shrink-0 text-orange-400" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-white/85">
                Two-Factor Auth
              </p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                Not enabled
              </p>
            </div>
          </div>
          <Minus className="w-4 h-4 text-orange-400 shrink-0" />
        </li>
      </ul>
      <button
        className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80 ${ac.iconBg} ${ac.text}`}
      >
        Manage Security <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   TOAST COMPONENT — UNCHANGED
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
      className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-5 sm:right-5 z-50 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl border shadow-xl text-sm font-medium ${colors}`}
      style={{ animation: "slideIn 0.3s ease" }}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <X className="w-4 h-4 shrink-0" />
      )}
      <span className="min-w-0 flex-1">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   STEP 9: Profile Completed Success Popup
   Shown after "Save & Continue" whenever the user got here via
   returnTo (Step 8). "Continue" here triggers Step 10 — sending the
   user back to the exact page they originally clicked.
══════════════════════════════════════════════════════════════ */
const ProfileCompletedCelebration = ({ onContinue }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backdropFilter: "blur(4px)",
    }}
    onClick={(e) => e.target === e.currentTarget && onContinue()}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "36px 28px",
        width: "100%",
        maxWidth: 380,
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
        textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(22,163,74,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          position: "relative",
        }}
      >
        <CheckCircle size={32} color="#16a34a" strokeWidth={2} />
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -10,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#F97316",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 0,
            left: -10,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#16a34a",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: -6,
            right: -6,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#F97316",
          }}
        />
      </div>
      <h2
        style={{
          fontSize: "1.2rem",
          fontWeight: 900,
          color: "#1e0e02",
          marginBottom: 8,
        }}
      >
        Congratulations! 🎉
      </h2>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#64748b",
          lineHeight: 1.6,
          marginBottom: 22,
        }}
      >
        Your profile has been completed successfully.
      </p>
      <button
        onClick={onContinue}
        style={{
          width: "100%",
          padding: 13,
          background: "linear-gradient(135deg,#16a34a,#15803d)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   SEARCHABLE DROPDOWN COMPONENT — UNCHANGED
══════════════════════════════════════════════════════════════ */
const SearchableDropdown = ({
  name,
  value,
  onChange,
  options: initialOptions,
  placeholder = "Select…",
  error = false,
  accentRing = "focus:ring-violet-400",
  addNewLabel = "Add New",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [addingNew, setAddingNew] = useState(false);
  const [newVal, setNewVal] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const newInputRef = useRef(null);

  useEffect(() => {
    setOptions((prev) => {
      const merged = [...initialOptions];
      prev.forEach((o) => {
        if (!merged.includes(o)) merged.push(o);
      });
      return merged;
    });
  }, [initialOptions]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setAddingNew(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (addingNew && newInputRef.current) newInputRef.current.focus();
  }, [addingNew]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  const select = (val) => {
    onChange({ target: { name, value: val } });
    setOpen(false);
    setSearch("");
    setAddingNew(false);
  };

  const handleAddNew = () => {
    const trimmed = newVal.trim();
    if (!trimmed) return;
    if (!options.includes(trimmed)) setOptions((p) => [...p, trimmed]);
    select(trimmed);
    setNewVal("");
  };

  const borderCls = error
    ? "border-red-400"
    : "border-gray-300 dark:border-white/20";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${borderCls} text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${accentRing} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className={value ? "" : "text-gray-400 dark:text-white/30"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 shadow-xl"
          style={{ animation: "dropIn 0.15s ease" }}
        >
          <style>{`
            @keyframes dropIn {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Search */}
          <div className="p-1.5 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-white/70" />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto rounded-b-xl">
            {filtered.length === 0 && !addingNew && (
              <p className="pl-4 pr-3 py-2 text-xs text-gray-400 dark:text-slate-500">
                No results found
              </p>
            )}
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => select(opt)}
                className={`w-full text-left pl-4 pr-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between ${
                  value === opt
                    ? "text-gray-900 dark:text-white font-medium bg-gray-50 dark:bg-white/5"
                    : "text-gray-700 dark:text-white/80"
                }`}
              >
                {opt}
                {value === opt && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Add New */}
          <div className="border-t border-gray-100 dark:border-white/10 p-1.5">
            {addingNew ? (
              <div className="flex gap-2 px-1">
                <input
                  ref={newInputRef}
                  type="text"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNew();
                    if (e.key === "Escape") {
                      setAddingNew(false);
                      setNewVal("");
                    }
                  }}
                  placeholder="Type and press Enter"
                  className="flex-1 px-2.5 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 dark:bg-white/20 text-white transition-colors hover:bg-gray-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingNew(false);
                    setNewVal("");
                  }}
                  className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingNew(true)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {addNewLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MULTI-SELECT SEARCHABLE DROPDOWN — UNCHANGED
══════════════════════════════════════════════════════════════ */
const MultiSearchableDropdown = ({
  name,
  value = [],
  onChange,
  options: initialOptions,
  placeholder = "Select…",
  error = false,
  accentRing = "focus:ring-emerald-400",
  accentBadge = "",
  addNewLabel = "Add New",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState(initialOptions);
  const [addingNew, setAddingNew] = useState(false);
  const [newVal, setNewVal] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const newInputRef = useRef(null);

  useEffect(() => {
    setOptions((prev) => {
      const merged = [...initialOptions];
      prev.forEach((o) => {
        if (!merged.includes(o)) merged.push(o);
      });
      return merged;
    });
  }, [initialOptions]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setAddingNew(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (addingNew && newInputRef.current) newInputRef.current.focus();
  }, [addingNew]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (opt) => {
    const next = value.includes(opt)
      ? value.filter((x) => x !== opt)
      : [...value, opt];
    onChange({ target: { name, value: next } });
  };

  const handleAddNew = () => {
    const trimmed = newVal.trim();
    if (!trimmed) return;
    if (!options.includes(trimmed)) setOptions((p) => [...p, trimmed]);
    if (!value.includes(trimmed)) {
      onChange({ target: { name, value: [...value, trimmed] } });
    }
    setNewVal("");
    setAddingNew(false);
  };

  const borderCls = error
    ? "border-red-400"
    : "border-gray-300 dark:border-white/20";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${borderCls} text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${accentRing} transition-colors min-h-[38px]`}
      >
        <span
          className={
            value.length
              ? "text-gray-900 dark:text-white"
              : "text-gray-400 dark:text-white/30"
          }
        >
          {value.length ? `${value.length} selected` : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {value.map((v) => (
            <span
              key={v}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${accentBadge}`}
            >
              {v}
              <button
                type="button"
                onClick={() => toggle(v)}
                className="ml-0.5 opacity-70 hover:opacity-100"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 shadow-xl"
          style={{ animation: "dropIn 0.15s ease" }}
        >
          <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div className="p-1.5 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10">
              <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto rounded-b-xl">
            {filtered.map((opt) => {
              const checked = value.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`w-full text-left pl-4 pr-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-3 ${
                    checked
                      ? "font-medium text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-white/80"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300 dark:border-white/20"
                    }`}
                  >
                    {checked && <CheckCircle className="w-3 h-3 text-white" />}
                  </span>
                  {opt}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="pl-4 pr-3 py-2 text-xs text-gray-400 dark:text-slate-500">
                No results
              </p>
            )}
          </div>
          <div className="border-t border-gray-100 dark:border-white/10 p-1.5">
            {addingNew ? (
              <div className="flex gap-2 px-1">
                <input
                  ref={newInputRef}
                  type="text"
                  value={newVal}
                  onChange={(e) => setNewVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddNew();
                  }}
                  placeholder="Type and press Enter"
                  className="flex-1 px-2.5 py-1.5 rounded-lg text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 dark:bg-white/20 text-white"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingNew(false);
                    setNewVal("");
                  }}
                  className="px-2 py-1.5 rounded-lg text-xs text-gray-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingNew(true)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {addNewLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
/* ══════════════════════════════════════════════════════════════
   PROFILE INFO TAB — LOGIC MOSTLY UNCHANGED. Avatar block restyled
   to a dashed upload box; fields restyled with inline leading
   icons. Same state, same handlers, same API call — PLUS a new
   editable Role field (dropdown replaces the old "Locked" badge).

   FIX: the local role switch (setRoleKey via onRoleUpdate) now
   applies regardless of whether the backend `updateMyProfile` call
   succeeds. Previously, if that API call rejected (e.g. the backend
   doesn't support updating `role` yet), the whole save silently fell
   into the catch block and the local role/roleKey was NEVER updated —
   so picking "Trainer" or "Admin" in this dropdown and saving looked
   like it worked (toast said success... or errored) but the Details
   tab kept showing the Student form because the underlying roleKey
   state never actually changed.
══════════════════════════════════════════════════════════════ */
const ProfileInfoTab = ({
  user,
  accent,
  onProfileUpdate,
  returnTo,
  roleKey,
  onRoleUpdate,
  onProfileComplete,
}) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user.name);
  const [roleLabel, setRoleLabel] = useState(user.label); // editable role
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false); // Step 9
  const { uploadImage, removeImage, profileImage } = useAvatarContext();
  const fileInputRef = useRef(null);
  const ac = ACCENT[accent];

  useEffect(() => {
    if (!editing) setName(user.name);
  }, [user.name, editing]);

  useEffect(() => {
    if (!editing) setRoleLabel(user.label);
  }, [user.label, editing]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    setSaving(true);
    try {
      // Backend Role enum values, distinct from the frontend's own roleKey
      // convention. "admin" here → TENANT_ADMIN, never ADMIN.
      const BACKEND_ROLE_BY_KEY = {
        student: "STUDENT",
        trainer: "TRAINER",
        admin: "TENANT_ADMIN",
      };
      const newRoleKey = ROLE_KEY_BY_LABEL[roleLabel] || roleKey;
      const roleChanged = !!roleKey && newRoleKey !== roleKey;

      // Best-effort backend sync. NOTE: swap this for your real
      // role-update endpoint/payload once the backend supports it.
      // Whether this call succeeds or fails should NOT block the
      // local role switch below — the actual switch is applied via
      // localStorage + onRoleUpdate so the demo works end-to-end even
      // when the backend rejects/ignores the `role` field.

      // if (hasAuthToken()) {
      //   try {
      //     await userService.updateMyProfile({
      //       displayName: name.trim(),
      //       role: newRoleKey,
      //     });
      //   } catch (apiErr) {
      //     console.error(
      //       "updateMyProfile failed — continuing with local role switch:",
      //       apiErr,
      //     );
      //   }
      // }
      if (hasAuthToken()) {
        try {
          await userService.updateMyProfile({
            displayName: name.trim(),
            roles: `ROLE_${BACKEND_ROLE_BY_KEY[newRoleKey] || "STUDENT"}`,
          });
        } catch (apiErr) {
          console.error(
            "updateMyProfile failed — continuing with local role switch:",
            apiErr,
          );
        }
      }
      if (roleChanged) {
        localStorage.setItem("role", newRoleKey.toUpperCase());
        try {
          const cached = JSON.parse(localStorage.getItem("lms_user") || "{}");
          localStorage.setItem(
            "lms_user",
            JSON.stringify({ ...cached, role: newRoleKey }),
          );
        } catch {
          localStorage.setItem(
            "lms_user",
            JSON.stringify({ role: newRoleKey }),
          );
        }
        if (onRoleUpdate) onRoleUpdate(newRoleKey);
      }

      const wasFullyComplete = (() => {
        const f = readCompletionFlags();
        return f.info && f.details;
      })();
      syncProfileInfoCompleted(true);
      const isFullyCompleteNow = (() => {
        const f = readCompletionFlags();
        return f.info && f.details;
      })();

      if (onProfileUpdate) onProfileUpdate({ name: name.trim() });
      setEditing(false);
      showToast(
        roleChanged
          ? "Profile & role updated successfully"
          : "Profile updated successfully",
      );
      if (returnTo) {
        setShowCelebration(true);
      } else if (onProfileComplete && !wasFullyComplete && isFullyCompleteNow) {
        onProfileComplete();
      }
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {showCelebration && (
        <ProfileCompletedCelebration
          onContinue={() => {
            setShowCelebration(false);
            navigate(returnTo);
          }}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ac.iconBg}`}
          >
            <User className={`w-4 h-4 ${ac.text}`} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Manage and update your personal details
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 sm:gap-5">
        {/* Dashed upload box — same uploadImage / removeImage handlers as before */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-1.5 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/15 bg-gray-50/60 dark:bg-white/[0.02] cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/40 transition-colors text-center min-h-[160px] sm:min-h-[190px]"
        >
          {profileImage ? (
            <Avatar
              initials={user.avatar}
              size={56}
              shape="rounded"
              className="mb-1"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mb-1">
              <UploadCloud className="w-5 h-5 text-violet-500" />
            </div>
          )}
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            Profile Photo
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            JPG, PNG up to 5MB
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white ${ac.btn} transition-colors`}
          >
            <Upload className="w-3 h-3" /> Upload Image
          </button>
          {profileImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="text-xs text-red-500 hover:underline mt-1.5"
            >
              Remove Photo
            </button>
          )}
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

        <div className="space-y-3.5 min-w-0">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Full Name
            </label>
            {editing ? (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm transition-all bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
                />
              </div>
            ) : (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <p className="pl-9 pr-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85 truncate">
                  {name || "—"}
                </p>
              </div>
            )}
          </div>

          {/* ── Role — editable ──
              In view mode this still looks like the old read-only row.
              In edit mode it becomes a searchable dropdown (Student /
              Trainer / Admin) instead of the old Locked pill. */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Role
            </label>
            {editing ? (
              <div>
                <SearchableDropdown
                  name="role"
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  options={ROLE_LABELS}
                  placeholder="Select role"
                  accentRing={ac.ring}
                  addNewLabel="Add New Role"
                  disabled={saving}
                />
                <p className="text-xs text-gray-400 dark:text-slate-500 pl-1 mt-1">
                  Changing your role switches your dashboard & sidebar
                  experience after saving
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <p className="pl-9 pr-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85">
                    {user.label}
                  </p>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
                  Click "Edit Profile" to change your role
                </p>
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-slate-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0" />
              <p className="pl-9 pr-16 sm:pr-20 py-2 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none truncate">
                {user.email}
              </p>
              <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/10 whitespace-nowrap">
                <Lock className="w-2.5 h-2.5 shrink-0" />{" "}
                <span className="hidden xs:inline">Locked</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500 pl-1">
              Email cannot be changed from this page
            </p>
          </div>
        </div>
      </div>

      {editing && (
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60 w-full sm:w-auto justify-center sm:justify-start`}
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
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   COUNTRY CODES — UNCHANGED
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
   DETAILS TAB HELPERS — compact
══════════════════════════════════════════════════════════════ */
const LABEL_CLS =
  "flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-1";

const STATIC_CLS =
  "px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white/85 min-h-[38px]";

const DetailField = ({ icon: Icon, label, children }) => (
  <div className="space-y-1 min-w-0">
    <label className={LABEL_CLS}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </label>
    {children}
  </div>
);

const StaticVal = ({ val }) => (
  <p className={`${STATIC_CLS} truncate`}>{val || "—"}</p>
);

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <X className="w-3 h-3" /> {msg}
    </p>
  ) : null;

/* ══════════════════════════════════════════════════════════════
   DROPDOWN DATA CONSTANTS — UNCHANGED
══════════════════════════════════════════════════════════════ */
const DD_GENDER = ["Male", "Female", "Other", "Prefer not to say"];

const DD_COUNTRY = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Singapore",
  "Japan",
  "UAE",
  "Saudi Arabia",
  "Malaysia",
  "Nepal",
  "Sri Lanka",
  "Pakistan",
  "Bangladesh",
  "South Africa",
  "Brazil",
  "New Zealand",
  "Netherlands",
];

const DD_STATE = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const DD_CITY = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Mumbai",
  "Delhi",
  "Noida",
  "Gurgaon",
  "Pune",
  "Kolkata",
  "Lucknow",
  "Ahmedabad",
  "Surat",
  "Indore",
  "Jaipur",
  "Patna",
  "Ranchi",
  "Kochi",
  "Chandigarh",
  "Visakhapatnam",
  "Coimbatore",
];

const DD_QUALIFICATION = [
  "10th",
  "12th",
  "Diploma",
  "ITI",
  "Polytechnic",
  "B.Tech",
  "B.E.",
  "BCA",
  "B.Sc",
  "B.Com",
  "BA",
  "BBA",
  "MBA",
  "MCA",
  "M.Tech",
  "M.Sc",
  "MA",
  "PhD",
  "Post Doctorate",
  "Other",
];

const DD_COLLEGE = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "BITS Pilani",
  "NIT Trichy",
  "NIT Surathkal",
  "Delhi University",
  "Anna University",
  "VIT",
  "SRM",
  "KIIT",
  "Amity University",
  "LPU",
  "Chandigarh University",
  "Manipal University",
  "JNTU Hyderabad",
  "AMU",
  "Jamia",
];

const DD_DOMAIN = [
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
  "React.js",
  "Angular",
  "Vue.js",
  "Java",
  "Spring Boot",
  "Python",
  "Django",
  "Node.js",
  "DevOps",
  "AWS",
  "Azure",
  "Cyber Security",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "UI/UX Design",
  "Testing / QA",
  "Mobile Development",
];

const DD_EXPERIENCE = [
  "Fresher",
  "Internship",
  "Less than 1 Year",
  "1 Year",
  "2 Years",
  "3 Years",
  "4 Years",
  "5 Years",
  "6–10 Years",
  "10+ Years",
];

// Generate years dynamically from 1980 to current+5
const DD_YEAR_OF_PASSING = (() => {
  const cur = new Date().getFullYear();
  const years = [];
  for (let y = cur + 5; y >= 1980; y--) years.push(String(y));
  return years;
})();

const DD_TRAINER_COUNTRY = DD_COUNTRY;

const DD_COURSE_TOPIC = [
  "React.js",
  "Angular",
  "Vue.js",
  "Python",
  "Java",
  "Spring Boot",
  "Node.js",
  "AWS",
  "Azure",
  "Cloud Computing",
  "Networking",
  "Cyber Security",
  "AI / ML",
  "Data Science",
  "Testing / QA",
  "DevOps",
  "Docker & Kubernetes",
  "SQL / Databases",
  "UI/UX Design",
  "Blockchain",
];

const DD_AUDIENCE_SIZE = [
  "0–1K",
  "1K–10K",
  "10K–50K",
  "50K–100K",
  "100K+",
  "500K+",
];

const DD_FULL_TIME_ROLE = [
  "Yes",
  "No",
  "Part Time",
  "Freelancer",
  "Consultant",
];

const DD_PLATFORMS = [
  "YouTube",
  "Instagram",
  "LinkedIn",
  "Facebook",
  "Twitter/X",
  "Podcast",
  "Telegram",
  "WhatsApp",
  "Discord",
  "TikTok",
  "Blog",
  "Newsletter",
  "Other",
];

const DD_INDUSTRY = [
  "EdTech",
  "FinTech",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Government",
  "IT Services",
  "Media",
  "Real Estate",
  "Education",
  "Banking",
  "Insurance",
  "Telecom",
  "Logistics",
  "NGO",
  "E-Commerce",
  "Other",
];

const DD_LOCATION = [
  "Hyderabad, India",
  "Bangalore, India",
  "Mumbai, India",
  "Delhi, India",
  "Chennai, India",
  "Pune, India",
  "Kolkata, India",
  "Ahmedabad, India",
  "Dubai, UAE",
  "Singapore",
  "London, UK",
  "New York, USA",
  "Toronto, Canada",
  "Sydney, Australia",
  "Berlin, Germany",
];

const DD_ORG_DOMAIN = [
  "Education",
  "Software",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Enterprise",
  "Startup",
  "Government",
];

/* ══════════════════════════════════════════════════════════════
   STUDENT DETAILS TAB
   MODIFIED: added onProfileComplete prop + wasCompleted guard so
   the auto-redirect only fires the FIRST time this role's details
   are completed, not on every subsequent edit-save.

   BUG-2 FIX: the backend `updateStudentProfile` call is now wrapped
   in its OWN inner try/catch. Previously it lived inside the outer
   try, so a rejected/failed API call fell straight into the outer
   catch and skipped the success toast, `syncProfileCompleted(true)`,
   and the returnTo/onProfileComplete redirect entirely — the save
   looked completely broken even though the user's data was fine
   locally. Now the local "details completed" flow always runs.
══════════════════════════════════════════════════════════════ */
const StudentDetailsTab = ({ accent, returnTo, onProfileComplete }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false); // Step 9
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

  const fieldRefs = useRef({});

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
    if (!hasAuthToken()) return; // no token yet — stay on local empty form
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
    if (!d.localNumber.trim()) errs.localNumber = "Mobile number is required";
    else if (!/^\d{6,15}$/.test(d.localNumber.trim()))
      errs.localNumber = "Enter 6–15 digits only";

    if (!d.dateOfBirth) errs.dateOfBirth = "Date of birth is required";
    else {
      const dob = new Date(d.dateOfBirth);
      const now = new Date();
      const age = now.getFullYear() - dob.getFullYear();
      if (dob >= now) errs.dateOfBirth = "Must be a past date";
      else if (age < 10) errs.dateOfBirth = "Age must be at least 10";
      else if (age > 100) errs.dateOfBirth = "Age must be under 100";
    }

    if (!d.gender) errs.gender = "Gender is required";
    if (!d.city.trim()) errs.city = "City is required";
    if (!d.state.trim()) errs.state = "State is required";
    if (!d.country.trim()) errs.country = "Country is required";
    if (!d.qualification.trim())
      errs.qualification = "Qualification is required";
    if (!d.collegeName.trim())
      errs.collegeName = "College / Institute is required";
    if (!d.yearOfPassing) errs.yearOfPassing = "Year of Passing is required";
    if (!d.domain.trim()) errs.domain = "Domain is required";
    if (!d.experience.trim()) errs.experience = "Experience is required";

    return errs;
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast("Please fix all errors before saving", "error");
      const firstKey = Object.keys(errs)[0];
      if (fieldRefs.current[firstKey]) fieldRefs.current[firstKey].focus?.();
      return;
    }
    // Save se PEHLE check: profile pehle se complete tha ya nahi — isse
    // sirf "pehli baar complete hua" par hi auto-redirect fire hoga,
    // baad me edit karne par nahi. Sirf Details tab hi mandatory hai
    // (Profile Info tab optional hai), isliye sirf `profileCompleted`
    // flag check karo — `profileInfoCompleted` par depend mat karo.
    const wasFullyComplete = (() => {
      const f = readCompletionFlags();
      return f.details;
    })();
    setSaving(true);
    try {
      const payload = {
        mobileNumber: draft.localNumber.trim()
          ? `${draft.dialCode}${draft.localNumber.trim()}`
          : "",
        dateOfBirth: draft.dateOfBirth,
        gender: draft.gender,
        city: draft.city.trim(),
        state: draft.state.trim(),
        country: draft.country.trim(),
        qualification: draft.qualification.trim(),
        collegeName: draft.collegeName.trim(),
        yearOfPassing: draft.yearOfPassing,
        domain: draft.domain.trim(),
        experience: draft.experience.trim(),
      };

      // BUG-2 FIX: best-effort backend sync. Success/failure of this call
      // must NOT block the local "details completed" flow below — the
      // success toast, syncProfileCompleted(true), and
      // returnTo/onProfileComplete redirect must always fire.
      if (hasAuthToken()) {
        try {
          await userService.updateStudentProfile(payload);
        } catch (apiErr) {
          console.error(
            "updateStudentProfile failed — continuing with local completion:",
            apiErr,
          );
        }
      }

      setForm({ ...draft });
      setEditing(false);
      showToast("Details saved successfully");
      syncProfileCompleted(true);
      const isFullyCompleteNow = (() => {
        const f = readCompletionFlags();
        return f.details;
      })();
      if (returnTo) {
        setShowCelebration(true);
      } else if (onProfileComplete && !wasFullyComplete && isFullyCompleteNow) {
        onProfileComplete();
      }
    } catch (err) {
      console.error("Unexpected error while saving student details:", err);
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (f) =>
    `w-full px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${
      errors[f]
        ? "border-red-400 focus:ring-red-400"
        : `border-gray-300 dark:border-white/20 focus:ring-2 ${ac.ring}`
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none`;

  const displayMobile = form.localNumber
    ? `${form.dialCode} ${form.localNumber}`
    : "";

  return (
    <div className="space-y-5 sm:space-y-6">
      {showCelebration && (
        <ProfileCompletedCelebration
          onContinue={() => {
            setShowCelebration(false);
            navigate(returnTo);
          }}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Profile Details
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Personal, location and education details
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <User className="w-3.5 h-3.5" /> Personal Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <DetailField icon={Phone} label="Mobile Number">
            {editing ? (
              <div className="space-y-1">
                <div className="flex flex-col xs:flex-row gap-2">
                  <select
                    name="dialCode"
                    value={draft.dialCode}
                    onChange={handleChange}
                    className={`shrink-0 w-full xs:w-32 px-2 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:outline-none focus:ring-2 ${ac.ring}`}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    ref={(el) => (fieldRefs.current.localNumber = el)}
                    type="tel"
                    name="localNumber"
                    placeholder="9876543210"
                    value={draft.localNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      handleChange({
                        target: { name: "localNumber", value: val },
                      });
                    }}
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
                  ref={(el) => (fieldRefs.current.dateOfBirth = el)}
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
              <div>
                <SearchableDropdown
                  name="gender"
                  value={draft.gender}
                  onChange={handleChange}
                  options={DD_GENDER}
                  placeholder="Select gender"
                  error={!!errors.gender}
                  accentRing={ac.ring}
                  addNewLabel="Add New Gender"
                />
                <ErrorMsg msg={errors.gender} />
              </div>
            ) : (
              <StaticVal val={form.gender} />
            )}
          </DetailField>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" /> Location
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <DetailField icon={MapPin} label="City">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="city"
                  value={draft.city}
                  onChange={handleChange}
                  options={DD_CITY}
                  placeholder="Select city"
                  error={!!errors.city}
                  accentRing={ac.ring}
                  addNewLabel="Add New City"
                />
                <ErrorMsg msg={errors.city} />
              </div>
            ) : (
              <StaticVal val={form.city} />
            )}
          </DetailField>

          <DetailField icon={MapPin} label="State">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="state"
                  value={draft.state}
                  onChange={handleChange}
                  options={DD_STATE}
                  placeholder="Select state"
                  error={!!errors.state}
                  accentRing={ac.ring}
                  addNewLabel="Add New State"
                />
                <ErrorMsg msg={errors.state} />
              </div>
            ) : (
              <StaticVal val={form.state} />
            )}
          </DetailField>

          <DetailField icon={MapPin} label="Country">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="country"
                  value={draft.country}
                  onChange={handleChange}
                  options={DD_COUNTRY}
                  placeholder="Select country"
                  error={!!errors.country}
                  accentRing={ac.ring}
                  addNewLabel="Add New Country"
                />
                <ErrorMsg msg={errors.country} />
              </div>
            ) : (
              <StaticVal val={form.country} />
            )}
          </DetailField>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5" /> Education & Professional
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <DetailField icon={BookOpen} label="Qualification">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="qualification"
                  value={draft.qualification}
                  onChange={handleChange}
                  options={DD_QUALIFICATION}
                  placeholder="Select qualification"
                  error={!!errors.qualification}
                  accentRing={ac.ring}
                  addNewLabel="Add New Qualification"
                />
                <ErrorMsg msg={errors.qualification} />
              </div>
            ) : (
              <StaticVal val={form.qualification} />
            )}
          </DetailField>

          <DetailField icon={Building2} label="College / Institute">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="collegeName"
                  value={draft.collegeName}
                  onChange={handleChange}
                  options={DD_COLLEGE}
                  placeholder="Select college"
                  error={!!errors.collegeName}
                  accentRing={ac.ring}
                  addNewLabel="Add New College"
                />
                <ErrorMsg msg={errors.collegeName} />
              </div>
            ) : (
              <StaticVal val={form.collegeName} />
            )}
          </DetailField>

          <DetailField icon={Calendar} label="Year of Passing">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="yearOfPassing"
                  value={draft.yearOfPassing}
                  onChange={handleChange}
                  options={DD_YEAR_OF_PASSING}
                  placeholder="Select year"
                  error={!!errors.yearOfPassing}
                  accentRing={ac.ring}
                  addNewLabel="Add Custom Year"
                />
                <ErrorMsg msg={errors.yearOfPassing} />
              </div>
            ) : (
              <StaticVal val={form.yearOfPassing} />
            )}
          </DetailField>

          <DetailField icon={Briefcase} label="Domain / Area of Interest">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="domain"
                  value={draft.domain}
                  onChange={handleChange}
                  options={DD_DOMAIN}
                  placeholder="Select domain"
                  error={!!errors.domain}
                  accentRing={ac.ring}
                  addNewLabel="Add New Domain"
                />
                <ErrorMsg msg={errors.domain} />
              </div>
            ) : (
              <StaticVal val={form.domain} />
            )}
          </DetailField>

          <div className="sm:col-span-2">
            <DetailField icon={TrendingUp} label="Experience">
              {editing ? (
                <div>
                  <SearchableDropdown
                    name="experience"
                    value={draft.experience}
                    onChange={handleChange}
                    options={DD_EXPERIENCE}
                    placeholder="Select experience"
                    error={!!errors.experience}
                    accentRing={ac.ring}
                    addNewLabel="Add New Experience"
                  />
                  <ErrorMsg msg={errors.experience} />
                </div>
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

/* ══════════════════════════════════════════════════════════════
   TRAINER DETAILS TAB
   MODIFIED: same onProfileComplete + wasCompleted pattern as Student.
   BUG-2 FIX: updateTrainerProfile call isolated in its own try/catch
   so a backend failure no longer blocks the success toast +
   syncProfileCompleted + redirect/celebration.
══════════════════════════════════════════════════════════════ */
const TrainerDetailsTab = ({ accent, returnTo, onProfileComplete }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false); // Step 9
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (!hasAuthToken()) return;
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
    setErrors({});
    setEditing(true);
  };
  const cancelEdit = () => {
    setDraft({ ...form, platforms: [...(form.platforms || [])] });
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
    if (d.linkedinUrl && !/^https?:\/\/.+/.test(d.linkedinUrl.trim()))
      errs.linkedinUrl = "Enter a valid URL starting with http:// or https://";
    if (!d.country.trim()) errs.country = "Country is required";
    if (!d.courseTopic.trim()) errs.courseTopic = "Course topic is required";
    if (!d.audienceSize) errs.audienceSize = "Audience size is required";
    if (!d.fullTimeRole)
      errs.fullTimeRole = "Full-time role selection is required";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast("Please fix all errors before saving", "error");
      return;
    }
    const wasCompleted = (() => {
      try {
        return !!JSON.parse(localStorage.getItem("lms_user") || "{}")
          .profileCompleted;
      } catch {
        return false;
      }
    })();
    setSaving(true);
    try {
      // BUG-2 FIX: best-effort backend sync — isolated so a failed call
      // never blocks the local "details completed" flow below.
      if (hasAuthToken()) {
        try {
          await userService.updateTrainerProfile(draft);
        } catch (apiErr) {
          console.error(
            "updateTrainerProfile failed — continuing with local completion:",
            apiErr,
          );
        }
      }

      setForm({ ...draft });
      setEditing(false);
      showToast("Trainer profile saved");
      syncProfileCompleted(true);
      if (returnTo) {
        setShowCelebration(true);
      } else if (onProfileComplete && !wasCompleted) {
        onProfileComplete();
      }
    } catch (err) {
      console.error("Unexpected error while saving trainer profile:", err);
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (f) =>
    `w-full px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${
      errors[f] ? "border-red-400" : `border-gray-300 dark:border-white/20`
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {showCelebration && (
        <ProfileCompletedCelebration
          onContinue={() => {
            setShowCelebration(false);
            navigate(returnTo);
          }}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Trainer Profile
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your training background and platform details
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> Basic Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <DetailField icon={Globe} label="LinkedIn URL">
            {editing ? (
              <div>
                <input
                  type="url"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/..."
                  value={draft.linkedinUrl}
                  onChange={handleChange}
                  className={inputCls("linkedinUrl")}
                />
                <ErrorMsg msg={errors.linkedinUrl} />
              </div>
            ) : (
              <StaticVal val={form.linkedinUrl} />
            )}
          </DetailField>

          <DetailField icon={MapPin} label="Country">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="country"
                  value={draft.country}
                  onChange={handleChange}
                  options={DD_TRAINER_COUNTRY}
                  placeholder="Select country"
                  error={!!errors.country}
                  accentRing={ac.ring}
                  addNewLabel="Add New Country"
                />
                <ErrorMsg msg={errors.country} />
              </div>
            ) : (
              <StaticVal val={form.country} />
            )}
          </DetailField>

          <DetailField icon={BookOpen} label="Course Topic">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="courseTopic"
                  value={draft.courseTopic}
                  onChange={handleChange}
                  options={DD_COURSE_TOPIC}
                  placeholder="Select course topic"
                  error={!!errors.courseTopic}
                  accentRing={ac.ring}
                  addNewLabel="Add New Topic"
                />
                <ErrorMsg msg={errors.courseTopic} />
              </div>
            ) : (
              <StaticVal val={form.courseTopic} />
            )}
          </DetailField>

          <DetailField icon={Users} label="Audience Size">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="audienceSize"
                  value={draft.audienceSize}
                  onChange={handleChange}
                  options={DD_AUDIENCE_SIZE}
                  placeholder="Select audience size"
                  error={!!errors.audienceSize}
                  accentRing={ac.ring}
                  addNewLabel="Add Custom Range"
                />
                <ErrorMsg msg={errors.audienceSize} />
              </div>
            ) : (
              <StaticVal val={form.audienceSize} />
            )}
          </DetailField>

          <DetailField icon={Briefcase} label="Full-Time Role?">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="fullTimeRole"
                  value={draft.fullTimeRole}
                  onChange={handleChange}
                  options={DD_FULL_TIME_ROLE}
                  placeholder="Select role type"
                  error={!!errors.fullTimeRole}
                  accentRing={ac.ring}
                  addNewLabel="Add New Option"
                />
                <ErrorMsg msg={errors.fullTimeRole} />
              </div>
            ) : (
              <StaticVal val={form.fullTimeRole} />
            )}
          </DetailField>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5" /> Platforms
        </p>
        {editing ? (
          <MultiSearchableDropdown
            name="platforms"
            value={draft.platforms}
            onChange={handleChange}
            options={DD_PLATFORMS}
            placeholder="Select platforms"
            accentRing={ac.ring}
            accentBadge={ac.badge}
            addNewLabel="Add New Platform"
          />
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

/* ══════════════════════════════════════════════════════════════
   ADMIN DETAILS TAB
   MODIFIED: same onProfileComplete + wasCompleted pattern.
   BUG-2 FIX: updateAdminOrgProfile call isolated in its own
   try/catch so a backend failure no longer blocks the success
   toast + syncProfileCompleted + redirect/celebration.
══════════════════════════════════════════════════════════════ */
const AdminDetailsTab = ({ accent, returnTo, onProfileComplete }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false); // Step 9
  const [errors, setErrors] = useState({});

  const empty = {
    organizationName: "",
    domain: "",
    contactEmail: "",
    location: "",
    industry: "",
    description: "",
    mobileNumber: "",
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

  useEffect(() => {
    const orgId = localStorage.getItem("organizationId");
    if (!orgId || !hasAuthToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    authService
      .getOrgCapacity(orgId)
      .then((capacityData) =>
        getOrgSummary()
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
          }),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
    if (!d.organizationName.trim())
      errs.organizationName = "Organization name is required";
    if (!d.industry) errs.industry = "Industry is required";
    if (!d.location.trim()) errs.location = "Location is required";
    if (
      d.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contactEmail.trim())
    )
      errs.contactEmail = "Enter a valid email address";
    if (
      d.mobileNumber &&
      !/^\+?\d{7,15}$/.test(d.mobileNumber.replace(/\s/g, ""))
    )
      errs.mobileNumber = "Enter a valid mobile number";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast("Please fix all errors before saving", "error");
      return;
    }
    const wasCompleted = (() => {
      try {
        return !!JSON.parse(localStorage.getItem("lms_user") || "{}")
          .profileCompleted;
      } catch {
        return false;
      }
    })();
    setSaving(true);
    try {
      const orgId = localStorage.getItem("organizationId");
      const payload = {
        organizationName: draft.organizationName.trim(),
        domain: draft.domain.trim(),
        contactEmail: draft.contactEmail.trim(),
        location: draft.location.trim(),
        industry: draft.industry,
        description: draft.description.trim(),
        mobileNumber: draft.mobileNumber.trim(),
      };

      // BUG-2 FIX: best-effort backend sync — isolated so a failed call
      // never blocks the local "details completed" flow below.
      if (hasAuthToken()) {
        try {
          await authService.updateAdminOrgProfile(orgId, payload);
        } catch (apiErr) {
          console.error(
            "updateAdminOrgProfile failed — continuing with local completion:",
            apiErr,
          );
        }
      }

      setForm((prev) => ({ ...prev, ...payload }));
      setEditing(false);
      showToast("Organization details saved");
      syncProfileCompleted(true);
      if (returnTo) {
        setShowCelebration(true);
      } else if (onProfileComplete && !wasCompleted) {
        onProfileComplete();
      }
    } catch (err) {
      console.error("Unexpected error while saving organization details:", err);
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (f) =>
    `w-full px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border ${
      errors[f] ? "border-red-400" : `border-gray-300 dark:border-white/20`
    } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    <div className="space-y-5 sm:space-y-6">
      {showCelebration && (
        <ProfileCompletedCelebration
          onContinue={() => {
            setShowCelebration(false);
            navigate(returnTo);
          }}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Organization Details
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your organization information
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" /> Organization Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <DetailField icon={Building2} label="Organization Name">
            {editing ? (
              <div>
                <input
                  type="text"
                  name="organizationName"
                  placeholder="e.g. Texora AI"
                  value={draft.organizationName}
                  onChange={handleChange}
                  className={inputCls("organizationName")}
                />
                <ErrorMsg msg={errors.organizationName} />
              </div>
            ) : (
              <StaticVal val={form.organizationName} />
            )}
          </DetailField>

          <DetailField icon={Globe} label="Domain">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="domain"
                  value={draft.domain}
                  onChange={handleChange}
                  options={DD_ORG_DOMAIN}
                  placeholder="Select domain"
                  error={!!errors.domain}
                  accentRing={ac.ring}
                  addNewLabel="Add New Domain"
                />
                <ErrorMsg msg={errors.domain} />
              </div>
            ) : (
              <StaticVal val={form.domain} />
            )}
          </DetailField>

          <DetailField icon={Mail} label="Contact Email">
            {editing ? (
              <div>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="e.g. admin@texora.ai"
                  value={draft.contactEmail}
                  onChange={handleChange}
                  className={inputCls("contactEmail")}
                />
                <ErrorMsg msg={errors.contactEmail} />
              </div>
            ) : (
              <StaticVal val={form.contactEmail} />
            )}
          </DetailField>

          <DetailField icon={MapPin} label="Location">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="location"
                  value={draft.location}
                  onChange={handleChange}
                  options={DD_LOCATION}
                  placeholder="Select location"
                  error={!!errors.location}
                  accentRing={ac.ring}
                  addNewLabel="Add New Location"
                />
                <ErrorMsg msg={errors.location} />
              </div>
            ) : (
              <StaticVal val={form.location} />
            )}
          </DetailField>

          <DetailField icon={Briefcase} label="Industry">
            {editing ? (
              <div>
                <SearchableDropdown
                  name="industry"
                  value={draft.industry}
                  onChange={handleChange}
                  options={DD_INDUSTRY}
                  placeholder="Select industry"
                  error={!!errors.industry}
                  accentRing={ac.ring}
                  addNewLabel="Add New Industry"
                />
                <ErrorMsg msg={errors.industry} />
              </div>
            ) : (
              <StaticVal val={form.industry} />
            )}
          </DetailField>

          <DetailField icon={Phone} label="Mobile Number">
            {editing ? (
              <div>
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="+91 9876543210"
                  value={draft.mobileNumber}
                  onChange={handleChange}
                  className={inputCls("mobileNumber")}
                />
                <ErrorMsg msg={errors.mobileNumber} />
              </div>
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
                  className={`${inputCls("description")} resize-none`}
                />
              ) : (
                <StaticVal val={form.description} />
              )}
            </DetailField>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> Plan & Limits
          <span className="ml-1 text-xs font-normal normal-case text-gray-400 dark:text-slate-500">
            — managed by SuperAdmin
          </span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
            <div key={label} className="space-y-1 min-w-0">
              <label className={LABEL_CLS}>
                <Ic className="w-3.5 h-3.5" /> {label}
              </label>
              <div className="relative">
                <p className="px-3 py-2 rounded-xl text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 select-none pr-14 sm:pr-16 truncate">
                  {val || "—"}
                </p>
                <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40 border border-gray-300 dark:border-white/10">
                  Locked
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4">
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
            <div key={label} className="space-y-1 min-w-0">
              <label className={LABEL_CLS}>
                <Ic className="w-3.5 h-3.5" /> {label}
              </label>
              <p
                className={`${STATIC_CLS} text-emerald-600 dark:text-emerald-400 font-semibold truncate`}
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

/* ══════════════════════════════════════════════════════════════
   BUSINESS DETAILS TAB
   MODIFIED: same onProfileComplete + wasCompleted pattern.
   BUG-2 FIX: updateBusinessProfile call isolated in its own
   try/catch so a backend failure no longer blocks the success
   toast + syncProfileCompleted + redirect/celebration.
   NOTE: "Business" is no longer selectable via the Role dropdown
   (see ROLE_LABELS above), but this component is kept so any
   pre-existing accounts still carrying a "business" roleKey continue
   to render correctly.
══════════════════════════════════════════════════════════════ */
const BusinessDetailsTab = ({ accent, returnTo, onProfileComplete }) => {
  const navigate = useNavigate();
  const ac = ACCENT[accent];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false); // Step 9

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
    if (!hasAuthToken()) return;
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
    const wasCompleted = (() => {
      try {
        return !!JSON.parse(localStorage.getItem("lms_user") || "{}")
          .profileCompleted;
      } catch {
        return false;
      }
    })();
    setSaving(true);
    try {
      // BUG-2 FIX: best-effort backend sync — isolated so a failed call
      // never blocks the local "details completed" flow below.
      if (hasAuthToken()) {
        try {
          await userService.updateBusinessProfile(draft);
        } catch (apiErr) {
          console.error(
            "updateBusinessProfile failed — continuing with local completion:",
            apiErr,
          );
        }
      }

      setForm({ ...draft });
      setEditing(false);
      showToast("Business details saved");
      syncProfileCompleted(true);
      if (returnTo) {
        setShowCelebration(true);
      } else if (onProfileComplete && !wasCompleted) {
        onProfileComplete();
      }
    } catch (err) {
      console.error("Unexpected error while saving business details:", err);
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {showCelebration && (
        <ProfileCompletedCelebration
          onContinue={() => {
            setShowCelebration(false);
            navigate(returnTo);
          }}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Business Details
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Your company and contact information
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm text-white ${ac.btn} shadow transition-colors disabled:opacity-60`}
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
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/80 hover:bg-gray-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Details
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5" /> Company Info
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <SearchableDropdown
                name="industry"
                value={draft.industry}
                onChange={handleChange}
                options={DD_INDUSTRY}
                placeholder="Select industry"
                accentRing={ac.ring}
                addNewLabel="Add New Industry"
              />
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

/* ── DETAILS TAB ROUTER
   MODIFIED: threads onProfileComplete down to whichever role tab is
   active, so the "first-time completion" redirect works regardless
   of which role's Details form the user is filling in. ── */
const DetailsTab = ({ accent, roleKey, returnTo, onProfileComplete }) => {
  if (roleKey === "trainer")
    return (
      <TrainerDetailsTab
        accent={accent}
        returnTo={returnTo}
        onProfileComplete={onProfileComplete}
      />
    );
  // "business" ab sirf legacy alias hai — dono "admin" aur "business"
  // same Organization Details form kholte hain (BusinessDetailsTab ab use nahi hota).
  if (roleKey === "admin" || roleKey === "business")
    return (
      <AdminDetailsTab
        accent={accent}
        returnTo={returnTo}
        onProfileComplete={onProfileComplete}
      />
    );
  return (
    <StudentDetailsTab
      accent={accent}
      returnTo={returnTo}
      onProfileComplete={onProfileComplete}
    />
  );
};

/* ══════════════════════════════════════════════════════════════
   SECURITY TAB — UNCHANGED
══════════════════════════════════════════════════════════════ */
const SecurityTab = ({ accent }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const ac = ACCENT[accent];

  const showToast = (message, type = "success") => setToast({ message, type });
  const STRONG_PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("Both fields are required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      showToast(
        "Password must include uppercase, lowercase, a number & a special character",
        "error",
      );
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
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
            Change Password
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Choose a strong password with at least 6 characters
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" /> New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-11 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5" /> Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2.5 pr-11 rounded-xl text-sm bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 ${ac.ring}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white/70"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {confirmPassword && (
            <p
              className={`text-xs flex items-center gap-1.5 ${newPassword === confirmPassword ? "text-emerald-500" : "text-red-500"}`}
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
          className={`mt-6 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium ${ac.btn} shadow transition-colors disabled:opacity-60 w-full sm:w-auto`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Updating…
            </>
          ) : (
            <>
              <Shield className="w-4 h-4" /> Update Password
            </>
          )}
        </button>
      </div>
      <div className="rounded-2xl p-4 sm:p-5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
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
   BILLING TAB — UNCHANGED
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
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative flex flex-col sm:flex-row items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-4 h-4 ${ac.text}`} />
              <span className="text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">
                Current Plan
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {user.plan}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              {user.planPrice} · Billed monthly
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <BadgeCheck className={`w-4 h-4 ${ac.text}`} />
              <span className="text-xs text-gray-500 dark:text-slate-400">
                Renews on May 1, 2025
              </span>
            </div>
          </div>
          <button
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white ${ac.btn} transition-colors w-full sm:w-auto shrink-0`}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Payment Method
          </h3>
          <button className={`text-xs ${ac.text} hover:underline`}>
            Change
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
          <div className={`p-2.5 rounded-xl ${ac.iconBg}`}>
            <CreditCard className={`w-5 h-5 ${ac.text}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Visa ending in 4242
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-400">
              Expires 08/2027
            </p>
          </div>
          <span
            className={`sm:ml-auto text-xs px-2 py-1 rounded-full border ${ac.badge}`}
          >
            Default
          </span>
        </div>
      </div>
      <div className="rounded-2xl p-4 sm:p-6 shadow-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Payment History
        </h3>
        <div className="space-y-1">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800 dark:text-white/90">
                    {h.inv}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {h.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
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
   SKELETON — UNCHANGED
══════════════════════════════════════════════════════════════ */
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] p-4 sm:p-8 space-y-6 animate-pulse">
    <div className="h-40 rounded-2xl bg-gray-200 dark:bg-white/5" />
    <div className="h-64 rounded-2xl bg-gray-200 dark:bg-white/5" />
  </div>
);

/* ══════════════════════════════════════════════════════════════
   PROFILE PAGE — MAIN.
══════════════════════════════════════════════════════════════ */
const IlmDemoProfilePage = ({
  roleOverride,
  onClose,
  onProfileComplete,
} = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [activeTab, setActiveTab] = useState(returnTo ? "details" : "profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReturnBanner, setShowReturnBanner] = useState(!!returnTo);
  const { profileImage } = useAvatarContext();

  const initialRoleKey =
    roleOverride ||
    (pathname.startsWith("/trainer")
      ? "trainer"
      : pathname.startsWith("/admin")
        ? "admin"
        : pathname.startsWith("/business")
          ? "business"
          : "student");

  // roleKey is stateful so the Role dropdown in ProfileInfoTab can switch
  // it and have the rest of this page (hero badge, stat card, Details
  // tab form) update without a full page reload.
  const [roleKey, setRoleKey] = useState(initialRoleKey);

  // Seed from the locally-cached lms_user (set at Google-login time) so
  // the real name/email show immediately, even before — or if —
  // getMyProfile() resolves.
  const [user, setUser] = useState(() => {
    const lu = getLocalUser();
    const initial = (lu.name || ROLE_CONFIG[roleKey].name)
      .charAt(0)
      .toUpperCase();
    return {
      ...ROLE_CONFIG[roleKey],
      name: lu.name || ROLE_CONFIG[roleKey].name,
      email: lu.email || ROLE_CONFIG[roleKey].email,
      avatar: initial,
    };
  });

  // Fires from ProfileInfoTab after a successful role change. Updates the
  // local roleKey + user object (label/accent/plan/etc come from
  // ROLE_CONFIG) while keeping the person's real name/email/id/avatar.
  const handleRoleUpdate = (newRoleKey) => {
    if (!ROLE_CONFIG[newRoleKey]) return;
    setRoleKey(newRoleKey);
    setUser((prev) => ({
      ...prev,
      ...ROLE_CONFIG[newRoleKey],
      name: prev.name,
      email: prev.email,
      id: prev.id,
      avatar: prev.avatar,
    }));
  };

  useEffect(() => {
    let cancelled = false;
    setError("");

    // No real token yet — skip the authenticated fetch entirely
    // instead of letting it 401. Local/Google-seeded data already
    // renders fine.
    if (!hasAuthToken()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    userService
      .getMyProfile()
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        const lu = getLocalUser();
        const roleLabel = (() => {
          if (!data?.roles) return ROLE_CONFIG[roleKey].label;
          const r = data.roles.toString().toLowerCase();
          return r.charAt(0).toUpperCase() + r.slice(1);
        })();
        const apiName =
          data?.displayName || lu.name || ROLE_CONFIG[roleKey].name;
        const apiEmail = data?.email || lu.email || ROLE_CONFIG[roleKey].email;
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
          // A brand-new user (backend profile record doesn't exist yet)
          // will 404 here — that's expected, not a real error, so don't
          // scare them with a red banner. Local/Google-seeded data from
          // the initial useState above stays as-is.
          const status = err?.response?.status;
          if (status && status !== 404) {
            setError("Could not load profile — showing cached data.");
          }
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

  const localProfileCompleted = (() => {
    try {
      return !!JSON.parse(localStorage.getItem("lms_user") || "{}")
        .profileCompleted;
    } catch {
      return false;
    }
  })();

  const completionItems = [
    { label: "Profile Photo", done: !!profileImage },
    { label: "Full Name", done: !!user.name },
    { label: "Email Verified", done: !!user.email },
    { label: "Details Completed", done: localProfileCompleted },
  ];

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    {
      id: "details",
      label:
        roleKey === "admin" || roleKey === "business"
          ? "Organization Details"
          : "Details",
      icon:
        roleKey === "admin" || roleKey === "business"
          ? Building2
          : GraduationCap,
    },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  if (loading) return <Skeleton />;

  return (
    <div className="min-h-screen w-full bg-[#F8F7FA] dark:bg-[#0a0a0f] transition-colors duration-300">
      <div className="w-full px-3 sm:px-6 lg:px-10 py-4 sm:py-8">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        {showReturnBanner && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400 text-sm flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3">
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

        {/* SIDEBAR + MAIN COLUMN */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
          <ProfileSidebarNav
            user={user}
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            accent={user.accent}
          />

          <div className="flex-1 min-w-0 w-full space-y-4 sm:space-y-6">
            {/* HERO */}
            <ProfileHeroCard
              user={user}
              accent={user.accent}
              items={completionItems}
            />

            {/* STAT CARDS */}
            <ProfileStatsGrid
              items={completionItems}
              user={user}
              accent={user.accent}
            />

            {/* MAIN CONTENT + RIGHT RAIL */}
            <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 items-start">
              <div className="flex-1 min-w-0 w-full rounded-2xl shadow-sm bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10">
                <div className="p-4 sm:p-5 lg:p-6">
                  {activeTab === "profile" && (
                    <ProfileInfoTab
                      user={user}
                      accent={user.accent}
                      onProfileUpdate={handleProfileUpdate}
                      returnTo={returnTo}
                      roleKey={roleKey}
                      onRoleUpdate={handleRoleUpdate}
                      onProfileComplete={onProfileComplete}
                    />
                  )}
                  {activeTab === "details" && (
                    <DetailsTab
                      accent={user.accent}
                      roleKey={roleKey}
                      returnTo={returnTo}
                      onProfileComplete={onProfileComplete}
                    />
                  )}
                  {activeTab === "security" && (
                    <SecurityTab accent={user.accent} />
                  )}
                  {activeTab === "billing" && (
                    <BillingTab user={user} accent={user.accent} />
                  )}
                </div>
              </div>

              <div className="w-full xl:w-80 shrink-0 space-y-4 sm:space-y-6">
                <ProfileTipsCard accent={user.accent} items={completionItems} />
                <SecurityStatusCard
                  accent={user.accent}
                  emailVerified={!!user.email}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IlmDemoProfilePage;
