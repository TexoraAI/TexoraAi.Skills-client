// import { Plus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { deleteBatch, getAllBatches } from "../services/batchService";
// import CreateBatchModal from "./CreateBatchModal";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const AdminBatches = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [createdBatchId, setCreatedBatchId] = useState(null);
//   const [batches, setBatches] = useState([]);

//   /* ================= LOAD EXISTING BATCHES ================= */
//   const loadBatches = async () => {
//     try {
//       const res = await getAllBatches();
  
//       const list =
//         res?.data?.data ||
//         res?.data?.batches ||
//         res?.data ||
//         [];
  
//       setBatches(Array.isArray(list) ? list : []);
  
//     } catch (err) {
//       console.error("Failed to load batches", err);
//       setBatches([]);
//     }
//   };

// useEffect(() => {
//   loadBatches();
// }, []);

//   return (
//     <div className="space-y-6">
//       {/* HERO */}
//       <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-bold">Batch Management</h1>
//         <p className="mt-1 text-sm opacity-90">
//           Create batch and assign trainer & students
//         </p>
//       </div>

//       {/* ACTION */}
//       <div className="flex justify-end">
//         <Button
//           className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
//           onClick={() => setShowModal(true)}
//         >
//           <Plus className="h-4 w-4 mr-1.5" />
//           Create Batch
//         </Button>
//       </div>

//       {/* WORKFLOW CARD */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Workflow</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-2 text-sm text-muted-foreground">
//           <p>1️⃣ Create a batch</p>
//           <p>2️⃣ Assign trainer to batch</p>
//           <p>3️⃣ Assign students under trainer</p>

//           {createdBatchId && (
//             <div className="pt-4">
//               <Button
//                 onClick={() =>
//                   navigate(`/admin/batches/${createdBatchId}/assign-trainer`)
//                 }
//               >
//                 Go to Assign Trainer
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* EXISTING BATCHES */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Existing Batches</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//         {!Array.isArray(batches) || batches.length === 0 ? (
//   <p className="text-sm text-muted-foreground">
//     No batches created yet
//   </p>
// ) : (
//   batches.map((b) => (
//     <div
//       key={b.id}
//       className="flex items-center justify-between border rounded-xl p-4"
//     >
//                 <div className="space-y-1">
//                   <p className="font-semibold">{b.batchName}</p>
//                   <p className="text-xs text-muted-foreground">
//                     Batch ID: {b.id}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Branch ID: {b.branchId}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Trainer: {b.trainerEmail || "Not Assigned"}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   {/* EXISTING BUTTON */}
//                   <Button
//                     variant="outline"
//                     onClick={() =>
//                       navigate(`/admin/batches/${b.id}/assign-trainer`)
//                     }
//                   >
//                     {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
//                   </Button>

//                   {/* EXISTING BUTTON */}
//                   <Button
//                     variant="secondary"
//                     onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
//                   >
//                     View Trainers
//                   </Button>

//                   {/* 🧨 DELETE BUTTON (ADDED) */}
//                   <Button
//                     variant="destructive"
//                     onClick={async () => {
//                       if (!window.confirm("Delete this batch permanently?"))
//                         return;

//                       try {
//                         await deleteBatch(b.id);
//                         loadBatches();
//                       } catch (e) {
//                         console.error("Delete failed", e);
//                         alert("Failed to delete batch");
//                       }
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       {showModal && (
//         <CreateBatchModal
//           onClose={() => setShowModal(false)}
//           onSuccess={(newBatch) => {
//             setShowModal(false);
//             setCreatedBatchId(newBatch.id);
//             loadBatches();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminBatches;
























// import { Plus, ArrowLeft } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { deleteBatch, getAllBatches } from "../services/batchService";
// import CreateBatchModal from "./CreateBatchModal";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const AdminBatches = () => {
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [createdBatchId, setCreatedBatchId] = useState(null);
//   const [batches, setBatches] = useState([]);

//   /* ================= LOAD EXISTING BATCHES ================= */
//   const loadBatches = async () => {
//     try {
//       const res = await getAllBatches();
  
//       const list =
//         res?.data?.data ||
//         res?.data?.batches ||
//         res?.data ||
//         [];
  
//       setBatches(Array.isArray(list) ? list : []);
  
//     } catch (err) {
//       console.error("Failed to load batches", err);
//       setBatches([]);
//     }
//   };

// useEffect(() => {
//   loadBatches();
// }, []);

//   return (
//     <div className="space-y-6">
//       {/* HERO */}
//       <div className="rounded-3xl p-7 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 relative overflow-hidden">

//   <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]"></div>

//   <div className="relative flex items-center gap-3">

//     <Button
//       variant="ghost"
//       className="text-white hover:bg-white/20"
//       onClick={() => navigate(-1)}
//     >
//       <ArrowLeft className="w-5 h-5 mr-1" />
//       Back
//     </Button>

//     <div>
//       <h1 className="text-2xl font-bold">Batch Management</h1>
//       <p className="mt-1 text-sm opacity-90">
//         Create batch and assign trainer & students
//       </p>
//     </div>

//   </div>

// </div>

//       {/* ACTION */}
//       <div className="flex justify-end">
//         <Button
//           className="h-10 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 shadow"
//           onClick={() => setShowModal(true)}
//         >
//           <Plus className="h-4 w-4 mr-1.5" />
//           Create Batch
//         </Button>
//       </div>

//       {/* WORKFLOW CARD */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Workflow</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">

//   <div className="flex items-center gap-3">
//     <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
//       1
//     </div>
//     <p className="text-sm text-muted-foreground">Create a batch</p>
//   </div>

//   <div className="flex items-center gap-3">
//     <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
//       2
//     </div>
//     <p className="text-sm text-muted-foreground">Assign trainer to batch</p>
//   </div>

//   <div className="flex items-center gap-3">
//     <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
//       3
//     </div>
//     <p className="text-sm text-muted-foreground">Assign students under trainer</p>
//   </div>

// </CardContent>
//       </Card>

//       {/* EXISTING BATCHES */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Existing Batches</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//         {!Array.isArray(batches) || batches.length === 0 ? (
//   <p className="text-sm text-muted-foreground">
//     No batches created yet
//   </p>
// ) : (
//   batches.map((b) => (
//     <div
//     key={b.id}
//     className="group flex items-center justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
//   >
  
//     {/* LEFT INFO */}
//     <div className="flex items-center gap-4">
  
//     <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow">
//         {b.batchName?.charAt(0)}
//       </div>
  
//       <div className="space-y-1">
//         <p className="font-semibold text-sm">{b.batchName}</p>
  
//         <div className="flex gap-4 text-xs text-muted-foreground">
//           <span>Batch ID: {b.id}</span>
//           <span>Branch: {b.branchId}</span>
//         </div>
  
//         <p className="text-xs text-muted-foreground">
//           Trainer: {b.trainerEmail || "Not Assigned"}
//         </p>
//       </div>
  
//     </div>
  
//     {/* ACTION BUTTONS */}
//     <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition">
  
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={() =>
//           navigate(`/admin/batches/${b.id}/assign-trainer`)
//         }
//       >
//         {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
//       </Button>
  
//       <Button
//         size="sm"
//         variant="secondary"
//         onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
//       >
//         Trainers
//       </Button>
  
//       <Button
//         size="sm"
//         variant="destructive"
//         onClick={async () => {
//           if (!window.confirm("Delete this batch permanently?"))
//             return;
  
//           try {
//             await deleteBatch(b.id);
//             loadBatches();
//           } catch (e) {
//             console.error("Delete failed", e);
//             alert("Failed to delete batch");
//           }
//         }}
//       >
//         Delete
//       </Button>
  
//     </div>
  
//   </div>
//             ))
//           )}
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       {showModal && (
//         <CreateBatchModal
//           onClose={() => setShowModal(false)}
//           onSuccess={(newBatch) => {
//             setShowModal(false);
//             setCreatedBatchId(newBatch.id);
//             loadBatches();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminBatches;

























import { ArrowLeft, Building2, CheckCircle2, GitBranch, Layers, Plus, Search, Trash2, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBatch, getAllBatches } from "../services/batchService";
import CreateBatchModal from "./CreateBatchModal";

import { Button } from "@/components/ui/button";
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
const grad = (name) => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

/* ── nav tabs ── */
const TABS = [
  { label: "Departments", path: "/admin/departmentlist", icon: Building2 },
  { label: "Branches",    path: "/admin/branches",        icon: GitBranch  },
  { label: "Batches",     path: "/admin/batches",         icon: Layers     },
];

/* ── workflow steps ── */
const STEPS = [
  { icon: Layers,     label: "Create a batch"                  },
  { icon: UserCheck,  label: "Assign trainer to batch"         },
  { icon: Users,      label: "Assign students under trainer"   },
];

/* ================= MAIN ================= */
const AdminBatches = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal]         = useState(false);
  const [createdBatchId, setCreatedBatchId] = useState(null);
  const [batches, setBatches]             = useState([]);
  const [search, setSearch]               = useState("");

  /* ── LOAD (unchanged) ── */
  const loadBatches = async () => {
    try {
      const res  = await getAllBatches();
      const list = res?.data?.data || res?.data?.batches || res?.data || [];
      setBatches(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load batches", err);
      setBatches([]);
    }
  };

  useEffect(() => { loadBatches(); }, []);

  const filteredBatches = batches.filter((b) =>
    b?.batchName?.toLowerCase().includes(search.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Batch Management</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Create batch and assign trainer &amp; students</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Layers className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {batches.length}
              <span className="ml-1 font-normal text-blue-100/80">Batches</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════ ACTION BAR ═══════ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* nav tabs */}
        <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900
          border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {TABS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all
                  ${active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* search */}
          <div className="relative md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search batches…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
                border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          {/* create */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl
              bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
              text-sm font-semibold text-white shadow
              hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Create Batch
          </button>
        </div>
      </div>

      {/* ═══════ WORKFLOW CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            How it works
          </CardTitle>
        </CardHeader>

        <CardContent className="px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {STEPS.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex md:flex-1 items-center gap-3 md:gap-0">

                {/* step */}
                <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2 md:flex-1">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500
                    flex items-center justify-center shadow-md shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="md:text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-widest
                      text-blue-500 dark:text-blue-400 mb-0.5">
                      Step {i + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                  </div>
                </div>

                {/* connector */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block h-px flex-none w-8 bg-gradient-to-r
                    from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 mx-1" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══════ BATCHES CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800
          bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Existing Batches
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredBatches.length} record{filteredBatches.length !== 1 && "s"} found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {!Array.isArray(batches) || batches.length === 0 ? (

            /* empty state */
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800
                flex items-center justify-center">
                <Layers className="h-7 w-7 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-500">No batches created yet</p>
              <p className="text-xs text-slate-400">Click "Create Batch" to get started</p>
            </div>

          ) : (
            filteredBatches.map((b) => (
              <div
                key={b.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-4 rounded-2xl border border-slate-100 dark:border-slate-800
                  bg-slate-50/50 dark:bg-slate-800/40 p-4
                  hover:border-blue-200 dark:hover:border-blue-800
                  hover:bg-blue-50/40 dark:hover:bg-slate-800
                  hover:shadow-md transition-all duration-200"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad(b.batchName)}
                    flex items-center justify-center text-white text-base font-bold shadow-sm shrink-0`}>
                    {b.batchName?.charAt(0)?.toUpperCase()}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100
                      group-hover:text-blue-600 transition-colors">
                      {b.batchName}
                    </p>

                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                        ID: {b.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        Branch: {b.branchId}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {b.trainerEmail ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {b.trainerEmail}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                            Trainer not assigned
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT — action buttons (unchanged logic) */}
                <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">

                  <button
                    onClick={() => navigate(`/admin/batches/${b.id}/assign-trainer`)}
                    className="flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800
                      bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5
                      text-xs font-semibold text-blue-700 dark:text-blue-400
                      hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
                  </button>

                  <button
                    onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700
                      bg-white dark:bg-slate-800 px-3 py-1.5
                      text-xs font-semibold text-slate-700 dark:text-slate-300
                      hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Users className="h-3.5 w-3.5" />
                    Trainers
                  </button>

                  <button
                    onClick={async () => {
                      if (!window.confirm("Delete this batch permanently?")) return;
                      try {
                        await deleteBatch(b.id);
                        loadBatches();
                      } catch (e) {
                        console.error("Delete failed", e);
                        alert("Failed to delete batch");
                      }
                    }}
                    className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-950/50
                      flex items-center justify-center text-red-500
                      hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* ═══════ MODAL (unchanged) ═══════ */}
      {showModal && (
        <CreateBatchModal
          onClose={() => setShowModal(false)}
          onSuccess={(newBatch) => {
            setShowModal(false);
            setCreatedBatchId(newBatch.id);
            loadBatches();
          }}
        />
      )}
    </div>
  );
};

export default AdminBatches;