

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getAvailableTrainers,
//   assignTrainer,
//   getTrainerStudents,
//   removeTrainerFromBatch,
// } from "../services/batchService";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// const AssignTrainerPage = () => {
//   const { batchId } = useParams();
//   const navigate = useNavigate();

//   const [trainers, setTrainers] = useState([]);
//   const [assignedMap, setAssignedMap] = useState({});

//   const load = async () => {
//     try {
//       const t = await getAvailableTrainers(batchId);
//       setTrainers(t.data || []);

//       const map = await getTrainerStudents(batchId);
//       setAssignedMap(map || {});
//     } catch (e) {
//       console.error("Failed to load trainers", e);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [batchId]);

//   const addTrainer = async (trainer) => {
//     if (!trainer?.email) {
//       alert("Trainer email missing");
//       return;
//     }

//     try {
//       await assignTrainer(batchId, trainer.email);

//       navigate(
//         `/admin/batches/${batchId}/students/${encodeURIComponent(trainer.email)}`,
//       );
//     } catch (e) {
//       console.error(e);
//       alert("Failed to assign trainer");
//     }
//   };

//   const removeTrainer = async (email) => {
//     if (!window.confirm("Remove trainer and all his students?")) return;

//     await removeTrainerFromBatch(batchId, email);
//     load();
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Assign Trainers</h1>

//       {trainers.map((t) => {
//         const isAssigned = assignedMap?.[t.email];

//         return (
//           <Card key={t.email}>
//             <CardContent className="flex justify-between items-center p-4">
//               <div>
//                 <p className="font-semibold">
//                   {t.displayName || t.email?.split("@")[0]}
//                 </p>
//                 <p className="text-sm text-muted-foreground">{t.email}</p>
//               </div>

//               {isAssigned ? (
//                 <div className="space-x-2">
//                   <Button
//                     onClick={() =>
//                       navigate(
//                         `/admin/batches/${batchId}/students/${encodeURIComponent(t.email)}`,
//                       )
//                     }
//                   >
//                     Manage Students
//                   </Button>

//                   <Button
//                     variant="destructive"
//                     onClick={() => removeTrainer(t.email)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               ) : (
//                 <Button onClick={() => addTrainer(t)}>Assign To Batch</Button>
//               )}
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default AssignTrainerPage;




















import { ArrowLeft, CheckCircle2, Mail, Search, Trash2, UserCheck, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  assignTrainer,
  getAvailableTrainers,
  getTrainerStudents,
  removeTrainerFromBatch,
} from "../services/batchService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ── avatar gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-indigo-500 to-blue-700",
];
const grad = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

const initials = (name, email) => {
  if (name) return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return email?.slice(0, 2).toUpperCase() ?? "??";
};

/* ================= MAIN ================= */
const AssignTrainerPage = () => {
  const { batchId } = useParams();
  const navigate    = useNavigate();

  const [trainers, setTrainers]       = useState([]);
  const [assignedMap, setAssignedMap] = useState({});
  const [search, setSearch]           = useState("");
  const [loading, setLoading]         = useState(true);

  /* ── LOAD (unchanged) ── */
  const load = async () => {
    try {
      const t   = await getAvailableTrainers(batchId);
      setTrainers(t.data || []);
      const map = await getTrainerStudents(batchId);
      setAssignedMap(map || {});
    } catch (e) {
      console.error("Failed to load trainers", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [batchId]);

  /* ── HANDLERS (unchanged) ── */
  const addTrainer = async (trainer) => {
    if (!trainer?.email) { alert("Trainer email missing"); return; }
    try {
      await assignTrainer(batchId, trainer.email);
      navigate(`/admin/batches/${batchId}/students/${encodeURIComponent(trainer.email)}`);
    } catch (e) {
      console.error(e);
      alert("Failed to assign trainer");
    }
  };

  const removeTrainer = async (email) => {
    if (!window.confirm("Remove trainer and all his students?")) return;
    await removeTrainerFromBatch(batchId, email);
    load();
  };

  const filtered = trainers.filter((t) =>
    (t.displayName || t.email)?.toLowerCase().includes(search.toLowerCase())
  );

  const assignedCount   = trainers.filter((t) => assignedMap?.[t.email]).length;
  const unassignedCount = trainers.length - assignedCount;

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Assign Trainers</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">
                Batch ID: <span className="font-semibold text-white">{batchId}</span>
              </p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white">
                {assignedCount}
                <span className="ml-1 font-normal text-blue-100/80">Assigned</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <UserPlus className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {unassignedCount}
                <span className="ml-1 font-normal text-blue-100/80">Available</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ SEARCH ═══════ */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search trainers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
            border-slate-200 dark:border-slate-800 text-sm"
        />
      </div>

      {/* ═══════ TRAINER CARDS ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Available Trainers
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filtered.length} trainer{filtered.length !== 1 && "s"} found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">

          {/* skeleton */}
          {loading && [1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl
              border border-slate-100 dark:border-slate-800 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-2.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            </div>
          ))}

          {/* empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <Users className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No trainers found</p>
              <p className="text-xs text-slate-400">Try a different search term</p>
            </div>
          )}

          {/* trainer rows */}
          {!loading && filtered.map((t) => {
            const isAssigned = assignedMap?.[t.email];
            const name       = t.displayName || t.email?.split("@")[0];

            return (
              <div
                key={t.email}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-4 rounded-2xl border border-slate-100 dark:border-slate-800
                  bg-slate-50/50 dark:bg-slate-800/40 p-4
                  hover:border-blue-200 dark:hover:border-blue-800
                  hover:bg-blue-50/40 dark:hover:bg-slate-800
                  hover:shadow-md transition-all duration-200"
              >
                {/* LEFT — avatar + info */}
                <div className="flex items-center gap-3.5">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad(name)}
                    flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                    {initials(t.displayName, t.email)}
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                      group-hover:text-blue-600 transition-colors">
                      {name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Mail className="h-3 w-3" />
                      {t.email}
                    </div>

                    {/* assigned badge */}
                    {isAssigned && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Assigned to this batch
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT — action buttons (unchanged logic) */}
                <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {isAssigned ? (
                    <>
                      <button
                        onClick={() => navigate(`/admin/batches/${batchId}/students/${encodeURIComponent(t.email)}`)}
                        className="flex items-center gap-1.5 rounded-xl
                          bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5
                          text-xs font-semibold text-white shadow
                          hover:opacity-90 hover:scale-105 transition-all"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Manage Students
                      </button>

                      <button
                        onClick={() => removeTrainer(t.email)}
                        className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-950/50
                          flex items-center justify-center text-red-500
                          hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => addTrainer(t)}
                      className="flex items-center gap-1.5 rounded-xl
                        border border-blue-200 dark:border-blue-800
                        bg-blue-50 dark:bg-blue-950/50 px-4 py-1.5
                        text-xs font-semibold text-blue-700 dark:text-blue-400
                        hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Assign To Batch
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignTrainerPage;