import React, { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Building2,
  Mail,
  Palette,
  Phone,
  Pencil,
  Plus,
  Timer,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── stats config ── */
const STATS = [
  {
    label: "Active Users",
    value: 0,
    trend: "up",
    change: "0%",
    icon: Users,
    grad: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
  },
  {
    label: "Monthly Growth",
    value: "0%",
    trend: "down",
    change: "0%",
    icon: TrendingUp,
    grad: "from-indigo-500 to-violet-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
  },
  {
    label: "Support Emails",
    value: 0,
    trend: "up",
    change: "0",
    icon: Mail,
    grad: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
  },
];

/* ================= MAIN ================= */
const OrgSettings = () => {
  const [mode, setMode] = useState("view");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    timezone: "IST",
    primaryColor: "#4F46E5",
  });

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const modeBadge = {
    view:   { label: "View Mode",   cls: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700" },
    create: { label: "Create Mode", cls: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
    edit:   { label: "Edit Mode",   cls: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  }[mode];

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══════ HERO ═══════ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl
        bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Organisation Settings
              </h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Manage branding, configuration &amp; organisation health
              </p>
            </div>
          </div>

          {/* mode badge */}
          <span className={`hidden md:inline-flex items-center rounded-xl border px-3 py-1.5
            text-xs font-semibold backdrop-blur-sm ${modeBadge.cls}`}>
            {modeBadge.label}
          </span>
        </div>
      </div>

      {/* ═══════ STATS ═══════ */}
      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((s) => {
          const Icon  = s.icon;
          const Trend = s.trend === "up" ? ArrowUp : ArrowDown;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200
                dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
            >
              {/* faint bg blob */}
              <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
                rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {s.value}
                  </p>
                  <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                    s.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                  }`}>
                    <Trend className="h-3 w-3" />
                    {s.change}
                  </div>
                </div>

                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${s.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ ACTIONS ═══════ */}
      <div className="flex flex-wrap justify-end gap-2">
        {mode !== "view" && (
          <button
            onClick={() => setMode("view")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200
              dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2
              text-sm font-medium text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        )}

        <button
          onClick={() => setMode("create")}
          className="flex items-center gap-1.5 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2
            text-sm font-semibold text-white shadow
            hover:opacity-90 hover:scale-105 transition-all"
        >
          <Plus className="h-4 w-4" /> Create Org
        </button>

        <button
          onClick={() => setMode("edit")}
          className="flex items-center gap-1.5 rounded-xl
            bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
            text-sm font-semibold text-white shadow
            hover:opacity-90 hover:scale-105 transition-all"
        >
          <Pencil className="h-4 w-4" /> Edit Org
        </button>

        <button
          className="flex items-center gap-1.5 rounded-xl
            bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800
            px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400
            hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Delete Org
        </button>
      </div>

      {/* ═══════ FORM ═══════ */}
      {mode !== "view" && (
        <div className="space-y-4">

          {/* ── BASIC INFO ── */}
          <Card className="overflow-hidden rounded-2xl border border-slate-200
            dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

            <CardHeader className="border-b border-slate-100 dark:border-slate-800
              bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
                  flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Organisation Details
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6 grid gap-5 md:grid-cols-2">
              <Field label="Organisation Name" name="name" value={formData.name} onChange={onChange} icon={Building2} placeholder="e.g. Texora AI" />
              <Field label="Support Email"      name="email" value={formData.email} onChange={onChange} icon={Mail}      placeholder="support@company.com" />
              <Field label="Contact Number"     name="phone" value={formData.phone} onChange={onChange} icon={Phone}     placeholder="+91 98765 43210" />

              {/* timezone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Timer className="h-3.5 w-3.5" /> Default Timezone
                </label>
                <Select
                  value={formData.timezone}
                  onValueChange={(v) => setFormData((p) => ({ ...p, timezone: v }))}
                >
                  <SelectTrigger className="h-10 rounded-xl border-slate-200
                    dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200
                    dark:border-slate-700 bg-white dark:bg-slate-900">
                    {["IST", "UTC", "EST", "CET"].map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* ── BRANDING ── */}
          <Card className="overflow-hidden rounded-2xl border border-slate-200
            dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

            <CardHeader className="border-b border-slate-100 dark:border-slate-800
              bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-950/50
                  flex items-center justify-center">
                  <Palette className="h-4 w-4 text-violet-500" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Branding
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6 grid md:grid-cols-2 gap-6">

              {/* logo preview */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Logo Preview
                </label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 rounded-xl border-2 border-slate-200 dark:border-slate-700">
                    <AvatarFallback className="rounded-xl text-sm font-bold
                      bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
                      ORG
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Organisation Logo
                    </p>
                    <span className="mt-1 inline-flex items-center rounded-lg
                      bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5
                      text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Upload later
                    </span>
                  </div>
                </div>
              </div>

              {/* primary colour */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" /> Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={onChange}
                    className="h-10 w-14 rounded-xl border border-slate-200
                      dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                  />
                  <Input
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={onChange}
                    className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                      bg-slate-50 dark:bg-slate-800 font-mono text-sm"
                  />
                </div>
                {/* colour preview swatch */}
                <div
                  className="mt-2 h-3 w-full rounded-full opacity-80"
                  style={{ background: formData.primaryColor }}
                />
              </div>
            </CardContent>
          </Card>

          {/* ── SAVE ── */}
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 rounded-xl px-8 py-2.5
                bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white
                shadow hover:opacity-90 hover:scale-105 transition-all"
            >
              {mode === "create" ? (
                <><Plus className="h-4 w-4" /> Create Organisation</>
              ) : (
                <><Pencil className="h-4 w-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── reusable field ── */
const Field = ({ label, icon: Icon, placeholder, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </label>
    <Input
      {...props}
      placeholder={placeholder}
      className="h-10 rounded-xl border-slate-200 dark:border-slate-700
        bg-slate-50 dark:bg-slate-800"
    />
  </div>
);

export default OrgSettings;














