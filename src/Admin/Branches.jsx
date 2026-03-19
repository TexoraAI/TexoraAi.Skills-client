import { ArrowLeft, Building2, ChevronRight, GitBranch, GripVertical, Layers, MapPin, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createBranch, deleteBranch, getBranches, updateBranch } from "../services/batchService";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GRAD = [
  "from-violet-500 to-purple-600","from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
];
const grad = name => GRAD[(name?.charCodeAt(0) ?? 0) % GRAD.length];

const TABS = [
  { label:"Departments", path:"/admin/departmentlist", icon:Building2 },
  { label:"Branches",    path:"/admin/branches",        icon:GitBranch  },
  { label:"Batches",     path:"/admin/batches",         icon:Layers     },
];

/* ══ drag list hook ══ */
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
        const n = [...items]; const [m] = n.splice(f,1); n.splice(t,0,m); setItems(n);
      }
      dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null); },
  });
  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const Branches = () => {
  const navigate = useNavigate();

  /* ── backend state (all unchanged) ── */
  const [branches, setBranches]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({ name:"", city:"" });
  const [panelOpen, setPanelOpen] = useState(false);
  const [locationOptions, setLocationOptions] = useState([
    "Delhi","Mumbai","Kolkata","Chennai","Bangalore","Hyderabad","Pune",
    "Ahmedabad","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore",
    "Bhopal","Patna","Ranchi","Raipur","Chandigarh","Noida","Gurgaon",
    "Faridabad","Ghaziabad","Meerut","Agra","Varanasi","Prayagraj",
    "Gwalior","Jabalpur","Udaipur","Jodhpur","Amritsar","Ludhiana",
    "Dehradun","Shimla","Srinagar","Jammu","Thiruvananthapuram","Kochi",
    "Coimbatore","Madurai","Mysore","Mangalore","Visakhapatnam","Vijayawada",
    "Tirupati","Bhubaneswar","Cuttack","Guwahati","Silchar","Imphal",
    "Aizawl","Shillong","Gangtok","Itanagar","Panaji",
  ]);

  useEffect(() => { loadBranches(); }, []);

  const loadBranches = async () => {
    try {
      const res  = await getBranches();
      const data = res?.data;
      if      (Array.isArray(data))       setBranches(data);
      else if (Array.isArray(data?.data)) setBranches(data.data);
      else                                setBranches([]);
    } catch (e) { console.error("Failed to load branches", e); setBranches([]); }
    finally { setLoading(false); }
  };

  const filtered = Array.isArray(branches)
    ? branches.filter(b => b?.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const resetPanel = () => { setPanelOpen(false); setEditingId(null); setForm({ name:"", city:"" }); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) return;
    try {
      editingId ? await updateBranch(editingId, form) : await createBranch(form);
      resetPanel(); loadBranches();
    } catch (e) { console.error("Save failed", e); }
  };

  const handleEdit = branch => {
    setEditingId(branch.id); setForm({ name:branch.name, city:branch.city }); setPanelOpen(true);
  };

  const handleDelete = async branch => {
    if (!confirm(`Delete branch "${branch.name}"?\nAll batches will also be removed.`)) return;
    try { await deleteBranch(branch.id); loadBranches(); }
    catch (e) { console.error("Delete failed", e); alert("Failed to delete branch"); }
  };

  /* drag */
  const { handlers: dragH, active: dActive, over: dOver } = useDragList(branches, setBranches);

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Branch Management</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage organisation branches &amp; locations</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <GitBranch className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {branches.length}<span className="ml-1 font-normal text-blue-100/80">Branches</span>
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
            <Input placeholder="Search branches…" value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm" />
          </div>
          <button onClick={() => { resetPanel(); setPanelOpen(true); }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap">
            <Plus className="h-4 w-4" /> Add Branch
          </button>
        </div>
      </div>

      {/* ═══ MAIN — table + inline panel ═══ */}
      <div className={`flex gap-4 ${panelOpen ? "items-start" : ""}`}>

        {/* TABLE */}
        <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
          <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Branches</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {filtered.length} record{filtered.length !== 1 && "s"} found
                  {branches.length > 0 && (
                    <span className="ml-2 text-slate-400">· Drag <GripVertical className="inline h-3 w-3" /> to reorder</span>
                  )}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                      <TableHead className="pl-4 py-3 w-8" />
                      <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                      <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Branch</TableHead>
                      <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">City</TableHead>
                      <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Students</TableHead>
                      <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {loading ? (
                      [1,2,3].map(i => (
                        <TableRow key={i} className="border-b border-slate-100 dark:border-slate-800">
                          <TableCell className="pl-4 py-4 w-8"><div className="h-3 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                          <TableCell><div className="h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                          <TableCell><div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                          <TableCell><div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                          <TableCell><div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                          <TableCell />
                        </TableRow>
                      ))
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <GitBranch className="h-7 w-7 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">No branches yet</p>
                            <p className="text-xs text-slate-400">Click "Add Branch" to get started</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((b, index) => {
                        const dh = dragH(index);
                        const isDragging = dActive === index;
                        const isOver     = dOver === index && dActive !== index;
                        return (
                          <TableRow key={b.id} {...dh}
                            className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
                              ${isDragging ? "opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50" : ""}
                              ${isOver ? "bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400" : "hover:bg-blue-50/40 dark:hover:bg-slate-800/40"}`}>

                            {/* grip */}
                            <TableCell className="pl-4 py-3.5 w-8">
                              <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                                <GripVertical className="h-4 w-4 text-slate-400" />
                              </div>
                            </TableCell>

                            <TableCell className="py-3.5 text-sm text-slate-400 font-medium w-10">
                              {String(index + 1).padStart(2, "0")}
                            </TableCell>

                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(b.name)} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                                  {b.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                  {b.name}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                  {b.city}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-3.5">
                              <div className="flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-slate-400" />
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">0 Students</span>
                              </div>
                            </TableCell>

                            <TableCell className="pr-6 py-3.5 text-right">
                              <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(b)}
                                  className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(b)}
                                  className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ INLINE SLIDE PANEL ═══ */}
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${panelOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>

          <div className="w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

            {/* panel header */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    {editingId ? <Pencil className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {editingId ? "Edit Branch" : "New Branch"}
                    </h2>
                    <p className="text-[11px] text-blue-100/70">Fill in the details below</p>
                  </div>
                </div>
                <button onClick={resetPanel}
                  className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* step bar */}
              <div className="flex gap-1.5 mt-4">
                {["Branch Info", "Location"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    i === 0 ? "bg-white/20 text-white" : "text-white/40"}`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"}`}>{i+1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* panel body */}
            <div className="p-5 space-y-4">

              {/* branch name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5" /> Branch Name *
                </label>
                <Input placeholder="e.g. North Campus" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>

              {/* city */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> City / Location *
                </label>
                <div className="flex gap-2">
                  <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select City</option>
                    {locationOptions.map((city, i) => (
                      <option key={i} value={city}>{city}</option>
                    ))}
                  </select>
                  <button onClick={() => {
                    const newCity = prompt("Enter new location");
                    if (!newCity) return;
                    if (!locationOptions.includes(newCity)) setLocationOptions(p => [...p, newCity]);
                    setForm(f => ({ ...f, city: newCity }));
                  }}
                    className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* live preview */}
              {form.name && form.city && (
                <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-3">
                  <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide mb-2">Preview</p>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(form.name)} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                      {form.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{form.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{form.city}</span>
                      </div>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* panel footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <button onClick={resetPanel}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow hover:opacity-90 hover:scale-105 transition-all">
                {editingId ? "Save Changes" : "Add Branch"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;