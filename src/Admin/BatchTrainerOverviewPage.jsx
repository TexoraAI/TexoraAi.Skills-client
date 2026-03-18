
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getTrainerStudents,
//   removeTrainerFromBatch,
// } from "../services/batchService";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const BatchTrainerOverviewPage = () => {
//   const { batchId } = useParams();
//   const navigate = useNavigate();

//   const [data, setData] = useState({});

//   const load = async () => {
//     try {
//       const map = await getTrainerStudents(batchId);
//       setData(map || {});
//     } catch (e) {
//       console.error("Failed loading trainer students", e);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [batchId]);

//   /* 🔥 DELETE TRAINER */
//   const deleteTrainer = async (trainerEmail) => {
//     if (!window.confirm("Delete trainer and release all students?")) return;

//     try {
//       await removeTrainerFromBatch(batchId, trainerEmail);
//       await load();
//     } catch (e) {
//       console.error("Failed deleting trainer", e);
//       alert("Failed deleting trainer");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Batch Trainers & Students</h1>

//       {Array.isArray(Object.entries(data)) &&
//   Object.entries(data || {}).map(([trainerEmail, students]) => (
//         <Card key={trainerEmail}>
//           <CardContent className="p-4 space-y-3">
//             <div className="flex justify-between items-center border-b pb-2">
//               <div>
//                 <p className="font-semibold text-lg">
//                   {trainerEmail.split("@")[0]}
//                 </p>
//                 <p className="text-sm text-muted-foreground">{trainerEmail}</p>
//               </div>
      
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() =>
//                     navigate(
//                       `/admin/batches/${batchId}/students/${encodeURIComponent(trainerEmail)}`
//                     )
//                   }
//                 >
//                   Manage Students
//                 </Button>
      
//                 <Button
//                   variant="destructive"
//                   onClick={() => deleteTrainer(trainerEmail)}
//                 >
//                   Delete Trainer
//                 </Button>
//               </div>
//             </div>
      
//             <div className="pl-4 space-y-1">
//               {!students || students.length === 0 ? (
//                 <p className="text-muted-foreground text-sm">
//                   No students assigned
//                 </p>
//               ) : (
//                 Array.isArray(students) &&
//                 students.map((s) => (
//                   <p key={s} className="text-sm">
//                     • {s}
//                   </p>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default BatchTrainerOverviewPage;



















import { ArrowLeft, CheckCircle2, Mail, Trash2, UserCheck, UserMinus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTrainerStudents,
  removeTrainerFromBatch,
} from "../services/batchService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* ── gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-indigo-500 to-blue-700",
];
const grad    = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];
const initials = (email) => email?.slice(0, 2).toUpperCase() ?? "??";

/* ── student chip colours ── */
const CHIP = [
  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800",
];
const chip = (i) => CHIP[i % CHIP.length];

/* ================= MAIN ================= */
const BatchTrainerOverviewPage = () => {
  const { batchId } = useParams();
  const navigate    = useNavigate();

  const [data, setData]       = useState({});
  const [loading, setLoading] = useState(true);

  /* ── LOAD (unchanged) ── */
  const load = async () => {
    try {
      const map = await getTrainerStudents(batchId);
      setData(map || {});
    } catch (e) {
      console.error("Failed loading trainer students", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [batchId]);

  /* ── DELETE (unchanged) ── */
  const deleteTrainer = async (trainerEmail) => {
    if (!window.confirm("Delete trainer and release all students?")) return;
    try {
      await removeTrainerFromBatch(batchId, trainerEmail);
      await load();
    } catch (e) {
      console.error("Failed deleting trainer", e);
      alert("Failed deleting trainer");
    }
  };

  const entries        = Object.entries(data || {});
  const totalTrainers  = entries.length;
  const totalStudents  = entries.reduce((acc, [, s]) => acc + (s?.length ?? 0), 0);

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
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Trainers &amp; Students
              </h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Batch ID: <span className="font-semibold text-white">{batchId}</span>
              </p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <UserCheck className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {totalTrainers}
                <span className="ml-1 font-normal text-blue-100/80">Trainers</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {totalStudents}
                <span className="ml-1 font-normal text-blue-100/80">Students</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ CONTENT CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Trainer Overview
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {totalTrainers} trainer{totalTrainers !== 1 && "s"} · {totalStudents} student{totalStudents !== 1 && "s"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">

          {/* skeleton */}
          {loading && [1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2.5 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="flex gap-2 pl-14">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          ))}

          {/* empty state */}
          {!loading && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <UserCheck className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No trainers assigned yet</p>
              <p className="text-xs text-slate-400">Assign trainers from the batch page</p>
            </div>
          )}

          {/* trainer blocks */}
          {!loading && entries.map(([trainerEmail, students]) => (
            <div
              key={trainerEmail}
              className="group rounded-2xl border border-slate-100 dark:border-slate-800
                bg-slate-50/50 dark:bg-slate-800/40 p-4 space-y-3
                hover:border-blue-200 dark:hover:border-blue-800
                hover:bg-blue-50/30 dark:hover:bg-slate-800
                hover:shadow-md transition-all duration-200"
            >
              {/* trainer header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div className="flex items-center gap-3.5">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad(trainerEmail)}
                    flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                    {initials(trainerEmail)}
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                      group-hover:text-blue-600 transition-colors">
                      {trainerEmail.split("@")[0]}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Mail className="h-3 w-3" />
                      {trainerEmail}
                    </div>
                    <div className="flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {students?.length ?? 0} student{(students?.length ?? 0) !== 1 && "s"} assigned
                      </span>
                    </div>
                  </div>
                </div>

                {/* action buttons — logic unchanged */}
                <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/admin/batches/${batchId}/students/${encodeURIComponent(trainerEmail)}`)}
                    className="flex items-center gap-1.5 rounded-xl
                      bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5
                      text-xs font-semibold text-white shadow
                      hover:opacity-90 hover:scale-105 transition-all"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Manage Students
                  </button>

                  <button
                    onClick={() => deleteTrainer(trainerEmail)}
                    className="flex items-center gap-1.5 rounded-xl
                      bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800
                      px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400
                      hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <UserMinus className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {/* divider */}
              <div className="border-t border-slate-100 dark:border-slate-800" />

              {/* students */}
              <div className="pl-1">
                {!students || students.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No students assigned yet</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(students) && students.map((s, i) => (
                      <span
                        key={s}
                        className={`inline-flex items-center gap-1.5 rounded-full border
                          px-2.5 py-0.5 text-[11px] font-semibold ${chip(i)}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchTrainerOverviewPage;