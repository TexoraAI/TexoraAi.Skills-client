
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getAvailableStudents,
//   getTrainerStudents,
//   assignStudentsToTrainer,
//   removeStudentFromTrainer,
// } from "../services/batchService";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";

// const BatchStudentsPage = () => {
//   const { batchId, trainerEmail } = useParams();
//   const decodedEmail = decodeURIComponent(trainerEmail);

//   const [availableStudents, setAvailableStudents] = useState([]);
//   const [assignedStudents, setAssignedStudents] = useState([]);

//   /* ================= LOAD DATA ================= */

//   const load = async () => {
//     try {
//       // available
//       const available = await getAvailableStudents(batchId, decodedEmail);

// const list =
//   available?.data?.data ||
//   available?.data?.students ||
//   available?.data ||
//   [];

// setAvailableStudents(Array.isArray(list) ? list : []);

//       // assigned
//       const map = await getTrainerStudents(batchId);
//       const assignedList = map?.[decodedEmail] || [];

// const assigned = Array.isArray(assignedList)
//   ? assignedList.filter((e) => e && e !== "__EMPTY__")
//   : [];

//       setAssignedStudents(assigned);
//     } catch (e) {
//       console.error("Failed loading students", e);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [batchId, trainerEmail]);

//   /* ================= ACTIONS ================= */

//   const assignStudent = async (email) => {
//     try {
//       const updated = [...assignedStudents, email];
//       await assignStudentsToTrainer(batchId, decodedEmail, updated);
//       await load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const removeStudent = async (email) => {
//     try {
//       await removeStudentFromTrainer(batchId, decodedEmail, email);
//       await load();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Students under {decodedEmail}</h1>

//       {/* ASSIGNED STUDENTS */}
//       {Array.isArray(assignedStudents) &&
//   assignedStudents.map((email) => (
//     <Card key={email}>
//       <CardContent className="flex justify-between items-center p-4">
//         <div>
//           <p className="font-semibold">{email.split("@")[0]}</p>
//           <p className="text-sm text-muted-foreground">{email}</p>
//         </div>

//         <Button variant="destructive" onClick={() => removeStudent(email)}>
//           Remove
//         </Button>
//       </CardContent>
//     </Card>
//   ))}

//       {/* AVAILABLE STUDENTS */}
//       {Array.isArray(availableStudents) &&
//   availableStudents.map((s) => (
//     <Card key={s.email}>
//       <CardContent className="flex justify-between items-center p-4">
//         <div>
//           <p className="font-semibold">
//             {s.displayName || s.email.split("@")[0]}
//           </p>
//           <p className="text-sm text-muted-foreground">{s.email}</p>
//         </div>

//         <Button onClick={() => assignStudent(s.email)}>Assign</Button>
//       </CardContent>
//     </Card>
//   ))}
//     </div>
//   );
// };

// export default BatchStudentsPage;












import { ArrowLeft, CheckCircle2, Mail, Search, UserMinus, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  assignStudentsToTrainer,
  getAvailableStudents,
  getTrainerStudents,
  removeStudentFromTrainer,
} from "../services/batchService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ── gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-indigo-500 to-blue-700",
];
const grad     = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];
const initials = (name, email) =>
  name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() ?? "??";

/* ================= MAIN ================= */
const BatchStudentsPage = () => {
  const { batchId, trainerEmail } = useParams();
  const navigate                  = useNavigate();
  const decodedEmail              = decodeURIComponent(trainerEmail);

  const [availableStudents, setAvailableStudents] = useState([]);
  const [assignedStudents, setAssignedStudents]   = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [searchAssigned, setSearchAssigned]       = useState("");
  const [searchAvailable, setSearchAvailable]     = useState("");

  /* ── LOAD (unchanged) ── */
  const load = async () => {
    try {
      const available = await getAvailableStudents(batchId, decodedEmail);
      const list =
        available?.data?.data ||
        available?.data?.students ||
        available?.data ||
        [];
      setAvailableStudents(Array.isArray(list) ? list : []);

      const map          = await getTrainerStudents(batchId);
      const assignedList = map?.[decodedEmail] || [];
      const assigned     = Array.isArray(assignedList)
        ? assignedList.filter((e) => e && e !== "__EMPTY__")
        : [];
      setAssignedStudents(assigned);
    } catch (e) {
      console.error("Failed loading students", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [batchId, trainerEmail]);

  /* ── ACTIONS (unchanged) ── */
  const assignStudent = async (email) => {
    try {
      const updated = [...assignedStudents, email];
      await assignStudentsToTrainer(batchId, decodedEmail, updated);
      await load();
    } catch (e) { console.error(e); }
  };

  const removeStudent = async (email) => {
    try {
      await removeStudentFromTrainer(batchId, decodedEmail, email);
      await load();
    } catch (e) { console.error(e); }
  };

  /* ── filtered lists ── */
  const filteredAssigned  = assignedStudents.filter((e) =>
    e.toLowerCase().includes(searchAssigned.toLowerCase())
  );
  const filteredAvailable = availableStudents.filter((s) =>
    (s.displayName || s.email)?.toLowerCase().includes(searchAvailable.toLowerCase())
  );

  /* ── skeleton row ── */
  const SkeletonRow = () => (
    <div className="flex items-center justify-between rounded-2xl border
      border-slate-100 dark:border-slate-800 p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-2.5 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
    </div>
  );

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
                Student Management
              </h1>
              <p className="mt-0.5 text-sm text-blue-100/80 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {decodedEmail}
              </p>
            </div>
          </div>

          {/* stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-semibold text-white">
                {assignedStudents.length}
                <span className="ml-1 font-normal text-blue-100/80">Assigned</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
              <UserPlus className="h-4 w-4 text-cyan-200" />
              <span className="text-sm font-semibold text-white">
                {availableStudents.length}
                <span className="ml-1 font-normal text-blue-100/80">Available</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ ASSIGNED STUDENTS ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4 gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Assigned Students
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredAssigned.length} student{filteredAssigned.length !== 1 && "s"}
            </p>
          </div>
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search…"
              value={searchAssigned}
              onChange={(e) => setSearchAssigned(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
                border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {loading && [1, 2].map((i) => <SkeletonRow key={i} />)}

          {!loading && filteredAssigned.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Users className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No students assigned yet</p>
            </div>
          )}

          {!loading && filteredAssigned.map((email) => (
            <div
              key={email}
              className="group flex items-center justify-between rounded-2xl
                border border-slate-100 dark:border-slate-800
                bg-slate-50/50 dark:bg-slate-800/40 p-4
                hover:border-emerald-200 dark:hover:border-emerald-800
                hover:bg-emerald-50/30 dark:hover:bg-slate-800
                hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(email)}
                  flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                  {initials(null, email)}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                    group-hover:text-emerald-600 transition-colors">
                    {email.split("@")[0]}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3" />
                    {email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1 rounded-full
                  bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800
                  px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Assigned
                </span>

                <button
                  onClick={() => removeStudent(email)}
                  className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-950/50
                    flex items-center justify-center text-red-500
                    hover:bg-red-100 dark:hover:bg-red-900 transition-colors
                    opacity-70 group-hover:opacity-100"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ═══════ AVAILABLE STUDENTS ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4 gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Available Students
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredAvailable.length} student{filteredAvailable.length !== 1 && "s"}
            </p>
          </div>
          <div className="relative w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search…"
              value={searchAvailable}
              onChange={(e) => setSearchAvailable(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
                border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {loading && [1, 2, 3].map((i) => <SkeletonRow key={i} />)}

          {!loading && filteredAvailable.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No available students</p>
              <p className="text-xs text-slate-400">All students are already assigned</p>
            </div>
          )}

          {!loading && filteredAvailable.map((s) => (
            <div
              key={s.email}
              className="group flex items-center justify-between rounded-2xl
                border border-slate-100 dark:border-slate-800
                bg-slate-50/50 dark:bg-slate-800/40 p-4
                hover:border-blue-200 dark:hover:border-blue-800
                hover:bg-blue-50/30 dark:hover:bg-slate-800
                hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3.5">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${grad(s.displayName || s.email)}
                  flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0`}>
                  {initials(s.displayName, s.email)}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                    group-hover:text-blue-600 transition-colors">
                    {s.displayName || s.email.split("@")[0]}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3" />
                    {s.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => assignStudent(s.email)}
                className="flex items-center gap-1.5 rounded-xl opacity-80 group-hover:opacity-100
                  bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1.5
                  text-xs font-semibold text-white shadow
                  hover:opacity-90 hover:scale-105 transition-all"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Assign
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchStudentsPage;