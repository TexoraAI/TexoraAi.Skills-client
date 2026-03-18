// // src/Admin/FeedbackAdmin.jsx
// import React, { useState } from "react";
// import {
//   MessageSquare,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   Search,
// } from "lucide-react";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";

// const FeedbackAdmin = () => {
//   const [type, setType] = useState("all");
//   const [status, setStatus] = useState("all");

//   const selectContentClass = `
//     z-50 bg-white text-slate-900
//     border border-slate-200 shadow-lg
//     dark:bg-slate-900 dark:text-slate-100
//     dark:border-slate-700
//   `;

//   return (
//     <div className="space-y-6">

//       {/* ✅ HERO (IMAGE SAME COLOR) */}
//       <div className="rounded-2xl px-6 py-5 text-white shadow-lg
//         bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-semibold">
//           Feedback & Support
//         </h1>
//         <p className="text-sm opacity-90">
//           Review, track and respond to feedback
//         </p>
//       </div>

//       {/* SUMMARY */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 Open Feedback
//               </p>
//               <AlertCircle className="h-4 w-4 text-emerald-500" />
//             </div>
//             <p className="text-2xl font-semibold">0</p>
//             <p className="text-xs text-muted-foreground">
//               Awaiting response
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 In Progress
//               </p>
//               <Clock className="h-4 w-4 text-amber-500" />
//             </div>
//             <p className="text-2xl font-semibold">0</p>
//             <p className="text-xs text-muted-foreground">
//               Under review
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-4 space-y-1.5">
//             <div className="flex items-center justify-between">
//               <p className="text-xs text-muted-foreground">
//                 Resolved
//               </p>
//               <CheckCircle className="h-4 w-4 text-blue-500" />
//             </div>
//             <p className="text-2xl font-semibold">0</p>
//             <p className="text-xs text-muted-foreground">
//               Closed items
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* FILTERS */}
//       <Card>
//         <CardContent className="p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
//           <div className="flex gap-2">
//             <Select value={type} onValueChange={setType}>
//               <SelectTrigger className="w-36 h-8 text-xs">
//                 <SelectValue placeholder="Type" />
//               </SelectTrigger>
//               <SelectContent className={selectContentClass}>
//                 <SelectItem value="all">All types</SelectItem>
//                 <SelectItem value="bug">Bug</SelectItem>
//                 <SelectItem value="feature">Feature</SelectItem>
//                 <SelectItem value="general">General</SelectItem>
//               </SelectContent>
//             </Select>

//             <Select value={status} onValueChange={setStatus}>
//               <SelectTrigger className="w-36 h-8 text-xs">
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent className={selectContentClass}>
//                 <SelectItem value="all">All status</SelectItem>
//                 <SelectItem value="open">Open</SelectItem>
//                 <SelectItem value="progress">In progress</SelectItem>
//                 <SelectItem value="closed">Closed</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="relative w-full md:w-64">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               className="pl-9 h-8 text-sm"
//               placeholder="Search feedback..."
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* LIST */}
//       <Card>
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm flex items-center gap-2">
//             <MessageSquare className="h-4 w-4" />
//             Feedback Items
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
//             <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
//             <p className="text-sm">No feedback available</p>
//             <p className="text-xs">
//               Feedback will appear once users submit it
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FeedbackAdmin;






































import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle, ArrowLeft, CheckCircle, Clock,
  MessageSquare, Search, Tag, Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ── stat cards ── */
const STATS = [
  {
    label: "Open Feedback",
    value: "0",
    sub:   "Awaiting response",
    icon:  AlertCircle,
    grad:  "from-emerald-500 to-teal-600",
    bg:    "bg-emerald-50 dark:bg-emerald-950/40",
    text:  "text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "In Progress",
    value: "0",
    sub:   "Under review",
    icon:  Clock,
    grad:  "from-amber-500 to-orange-600",
    bg:    "bg-amber-50 dark:bg-amber-950/40",
    text:  "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Resolved",
    value: "0",
    sub:   "Closed items",
    icon:  CheckCircle,
    grad:  "from-blue-500 to-cyan-600",
    bg:    "bg-blue-50 dark:bg-blue-950/40",
    text:  "text-blue-600 dark:text-blue-400",
  },
];

/* ── type chip colours ── */
const TYPE_CFG = {
  bug:     "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  feature: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  general: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
};

/* ── status badge ── */
const STATUS_CFG = {
  open:     "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  progress: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  closed:   "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
};

/* ================= MAIN ================= */
const FeedbackAdmin = () => {
  const navigate = useNavigate();
  const [type, setType]     = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  /* ================= RENDER ================= */
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
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5
                text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Feedback &amp; Support</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Review, track and respond to feedback</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <MessageSquare className="h-4 w-4 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              0
              <span className="ml-1 font-normal text-blue-100/80">Items</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ STAT CARDS ═══════ */}
      <div className="grid gap-4 md:grid-cols-3">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl border border-slate-200
                dark:border-slate-800 bg-white dark:bg-slate-900 shadow p-5"
            >
              <div className={`pointer-events-none absolute -right-4 -top-4 h-24 w-24
                rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl`} />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest font-semibold
                    text-slate-500 dark:text-slate-400">
                    {s.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{s.sub}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.text}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════ FILTER BAR ═══════ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between
        rounded-2xl border border-slate-200 dark:border-slate-800
        bg-white dark:bg-slate-900 shadow px-4 py-3">

        <div className="flex gap-2 flex-wrap">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-36 rounded-xl bg-slate-50 dark:bg-slate-800
              border-slate-200 dark:border-slate-700 text-sm">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900 shadow-xl z-50">
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-36 rounded-xl bg-slate-50 dark:bg-slate-800
              border-slate-200 dark:border-slate-700 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700
              bg-white dark:bg-slate-900 shadow-xl z-50">
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="progress">In progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search feedback…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800
              border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>

      {/* ═══════ FEEDBACK LIST CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center gap-2.5
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
            flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Feedback Items
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              0 items found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* empty state */}
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
              flex items-center justify-center">
              <MessageSquare className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No feedback available</p>
            <p className="text-xs text-slate-400">Feedback will appear once users submit it</p>
          </div>

          {/* when data available, render rows like this: */}
          {/*
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="group flex items-center justify-between
                rounded-2xl border border-slate-100 dark:border-slate-800
                bg-slate-50/50 dark:bg-slate-800/40 px-5 py-4
                hover:border-blue-200 dark:hover:border-blue-800
                hover:bg-blue-50/30 dark:hover:bg-slate-800
                hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TYPE_CFG[item.type]}`}><Tag className="h-3 w-3 mr-1" />{item.type}</span>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_CFG[item.status]}`}>{item.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAdmin;