


import {
  ArrowLeft, Building2, CheckCircle2, ChevronRight,
  GitBranch, GripVertical, Layers, Plus, Search,
  Trash2, UserCheck, Users, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBatch, getAllBatches } from "../services/batchService";
import CreateBatchModal from "./CreateBatchModal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ── gradient pool ── */
const GRAD = [
  "from-violet-500 to-purple-600","from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
];
const grad = name => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

/* ── nav tabs ── */
const TABS = [
  { label:"Departments", path:"/admin/departmentlist", icon:Building2 },
  { label:"Branches",    path:"/admin/branches",        icon:GitBranch  },
  { label:"Batches",     path:"/admin/batches",         icon:Layers     },
];

/* ── workflow steps ── */
const STEPS = [
  { icon:Layers,    label:"Create a batch"                },
  { icon:UserCheck, label:"Assign trainer to batch"       },
  { icon:Users,     label:"Assign students under trainer" },
];

/* ══ drag-and-drop hook ══ */
function useDragList(items, setItems) {
  const dragIdx = useRef(null), overIdx = useRef(null);
  const [active, setActive] = useState(null), [over, setOver] = useState(null);

  const handlers = i => ({
    draggable: true,
    onDragStart: () => { dragIdx.current = i; setActive(i); },
    onDragOver:  e  => { e.preventDefault(); overIdx.current = i; setOver(i); },
    onDrop: () => {
      const f = dragIdx.current, t = overIdx.current;
      if (f !== null && t !== null && f !== t) {
        const n = [...items]; const [m] = n.splice(f, 1); n.splice(t, 0, m); setItems(n);
      }
      dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null); },
  });

  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const AdminBatches = () => {
  const navigate = useNavigate();

  /* ── backend state — all unchanged ── */
  const [batches, setBatches]               = useState([]);
  const [search, setSearch]                 = useState("");
  const [createdBatchId, setCreatedBatchId] = useState(null);
  const [panelOpen, setPanelOpen]           = useState(false);

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

  const filteredBatches = batches.filter(b =>
    b?.batchName?.toLowerCase().includes(search.toLowerCase())
  );

  /* drag for batch cards */
  const { handlers: dragH, active: dActive, over: dOver } = useDragList(batches, setBatches);

  /* ══════════ RENDER ══════════ */
  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-32 bottom-[-30px] h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
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
              {batches.length}<span className="ml-1 font-normal text-blue-100/80">Batches</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BAR ═══ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {TABS.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  active ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                         : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative md:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search batches…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm" />
          </div>
          <button onClick={() => setPanelOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap">
            <Plus className="h-4 w-4" /> Create Batch
          </button>
        </div>
      </div>

      {/* ═══ WORKFLOW CARD ═══ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
          <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">How it works</CardTitle>
        </CardHeader>
        <CardContent className="px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0">
            {STEPS.map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex md:flex-1 items-center gap-3 md:gap-0">
                <div className="flex items-center gap-3 md:flex-col md:items-center md:gap-2 md:flex-1">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="md:text-center">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-0.5">Step {i + 1}</span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block h-px flex-none w-8 bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700 mx-1" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ MAIN — batches list + inline panel ═══ */}
      <div className={`flex gap-4 ${panelOpen ? "items-start" : ""}`}>

        {/* BATCHES CARD */}
        <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
          <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">Existing Batches</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {filteredBatches.length} record{filteredBatches.length !== 1 && "s"} found
                  {batches.length > 0 && (
                    <span className="ml-2 text-slate-400">· Drag <GripVertical className="inline h-3 w-3" /> to reorder</span>
                  )}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {!Array.isArray(batches) || batches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Layers className="h-7 w-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No batches created yet</p>
                  <p className="text-xs text-slate-400">Click "Create Batch" to get started</p>
                </div>
              ) : (
                filteredBatches.map((b, index) => {
                  const dh         = dragH(index);
                  const isDragging = dActive === index;
                  const isOver     = dOver === index && dActive !== index;

                  return (
                    <div
                      key={b.id}
                      {...dh}
                      className={`group relative flex flex-col sm:flex-row sm:items-center sm:justify-between
                        gap-4 rounded-2xl border p-4 transition-all duration-150 cursor-default
                        ${isDragging
                          ? "opacity-40 scale-[0.98] border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
                          : isOver
                          ? "border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 shadow-md border-t-2 border-t-blue-400"
                          : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/40 dark:hover:bg-slate-800 hover:shadow-md"
                        }`}
                    >
                      {/* blue drop indicator */}
                      {isOver && (
                        <div className="absolute -top-0.5 left-6 right-6 h-0.5 bg-blue-400 rounded-full" />
                      )}

                      <div className="flex items-center gap-4">
                        {/* drag grip */}
                        <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0">
                          <GripVertical className="h-4 w-4 text-slate-400" />
                        </div>

                        {/* avatar */}
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${grad(b.batchName)} flex items-center justify-center text-white text-base font-bold shadow-sm shrink-0`}>
                          {b.batchName?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                            {b.batchName}
                          </p>
                          <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                              ID: {b.id}
                            </span>
                            <span className="flex items-center gap-1">
                              <GitBranch className="h-3 w-3" /> Branch: {b.branchId}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {b.trainerEmail ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{b.trainerEmail}</span>
                              </>
                            ) : (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Trainer not assigned</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* action buttons — unchanged logic */}
                      <div className="flex gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => navigate(`/admin/batches/${b.id}/assign-trainer`)}
                          className="flex items-center gap-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                          <UserCheck className="h-3.5 w-3.5" />
                          {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
                        </button>
                        <button onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
                          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                          <Users className="h-3.5 w-3.5" /> Trainers
                        </button>
                        <button onClick={async () => {
                            if (!window.confirm("Delete this batch permanently?")) return;
                            try { await deleteBatch(b.id); loadBatches(); }
                            catch (e) { console.error("Delete failed", e); alert("Failed to delete batch"); }
                          }}
                          className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* ═══ INLINE SLIDE PANEL ═══ */}
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${panelOpen ? "w-96 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>

          <div className="w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

            {/* panel header */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">New Batch</h2>
                    <p className="text-[11px] text-blue-100/70">Fill in the batch details</p>
                  </div>
                </div>
                <button onClick={() => setPanelOpen(false)}
                  className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* step bar */}
              <div className="flex gap-1.5 mt-4">
                {["Batch Info","Assign Trainer","Add Students"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                    i === 0 ? "bg-white/20 text-white" : "text-white/40"}`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"}`}>{i+1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* panel body — CreateBatchModal rendered inline */}
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <CreateBatchModal
                inline
                onClose={() => setPanelOpen(false)}
                onSuccess={newBatch => {
                  setPanelOpen(false);
                  setCreatedBatchId(newBatch.id);
                  loadBatches();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBatches;