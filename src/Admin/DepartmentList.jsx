import { ArrowLeft, Building2, GitBranch, GripVertical, Layers, Pencil, Plus, Search, Trash2, Users, X, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600","from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600","from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600","from-indigo-500 to-blue-700",
];
const avatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ══════════ DRAG-LIST HOOK ══════════ */
function useDragList(items, setItems) {
  const dragIdx = useRef(null);
  const overIdx = useRef(null);
  const [active, setActive] = useState(null);
  const [over,   setOver]   = useState(null);

  const handlers = i => ({
    draggable: true,
    onDragStart: () => { dragIdx.current = i; setActive(i); },
    onDragOver:  e  => { e.preventDefault(); overIdx.current = i; setOver(i); },
    onDrop: () => {
      const from = dragIdx.current, to = overIdx.current;
      if (from !== null && to !== null && from !== to) {
        const next = [...items];
        const [m] = next.splice(from, 1);
        next.splice(to, 0, m);
        setItems(next);
      }
      dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null);
    },
    onDragEnd: () => { dragIdx.current = null; overIdx.current = null; setActive(null); setOver(null); },
  });

  return { handlers, active, over };
}

/* ══════════ MAIN ══════════ */
const DepartmentList = () => {
  const navigate = useNavigate();

  /* backend state — unchanged */
  const [departments, setDepartments]       = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([
    "Engineering","Human Resources","Marketing","Finance","Sales",
    "Customer Support","IT Services","Product Management","Operations",
    "Research & Development","Legal","Procurement","Quality Assurance",
    "Administration","Public Relations","Business Development","Security",
    "Training & Development","Logistics","Data Analytics","Content Management",
    "Design","Compliance","Technical Support","Strategy & Planning",
  ]);
  const [search, setSearch]   = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode]           = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm]           = useState({ name:"", head:"", status:"Active" });

  /* drag state for table rows */
  const { handlers: dragHandlers, active: dragActive, over: dragOver } = useDragList(departments, setDepartments);

  const filtered = departments.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  /* handlers — unchanged logic */
  const handleAdd = () => {
    setMode("create"); setForm({ name:"", head:"", status:"Active" });
    setPanelOpen(true);
  };
  const handleEdit = dept => {
    setMode("edit"); setCurrentId(dept.id); setForm(dept); setPanelOpen(true);
  };
  const handleSave = () => {
    if (!form.name || !form.head) return alert("Please fill all fields");
    if (mode === "create") {
      setDepartments(p => [...p, { ...form, id: Date.now() }]);
    } else {
      setDepartments(p => p.map(d => d.id === currentId ? { ...form, id: currentId } : d));
    }
    setPanelOpen(false);
  };
  const handleDelete = id => {
    if (confirm("Delete this department?")) setDepartments(p => p.filter(d => d.id !== id));
  };
  const handleAddDepartmentOption = () => {
    const v = prompt("Enter new department name");
    if (v?.trim()) { setDepartmentOptions(p => [...p, v]); setForm(f => ({ ...f, name: v })); }
  };

  const tabs = [
    { label:"Departments", path:"/admin/departmentlist", icon:Building2 },
    { label:"Branches",    path:"/admin/branches",        icon:GitBranch  },
    { label:"Batches",     path:"/admin/batches",         icon:Layers     },
  ];

  return (
    <div className="min-h-screen bg-[#f0f4ff] dark:bg-[#060b18] p-5 space-y-5">

      {/* ═══ HERO ═══ */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#1a56db] via-[#3b82f6] to-[#06b6d4]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Department Management</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage organisational departments &amp; leadership</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <Users className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {departments.length}<span className="ml-1 font-normal text-blue-100/80">Departments</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══ ACTION BAR ═══ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 shadow-sm">
          {tabs.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  active ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                         : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <Icon className="h-3.5 w-3.5" />{label}
              </button>
            );
          })}
        </div>
        <div className="relative md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search departments…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm" />
        </div>
      </div>

      {/* ═══ MAIN LAYOUT — table + inline panel ═══ */}
      <div className={`flex gap-4 transition-all duration-300 ${panelOpen ? "items-start" : ""}`}>

        {/* TABLE */}
        <div className={`transition-all duration-300 ${panelOpen ? "flex-1 min-w-0" : "w-full"}`}>
          <Card className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-6 py-4">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">All Departments</CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {filtered.length} record{filtered.length !== 1 && "s"} found
                  {departments.length > 0 && (
                    <span className="ml-2 text-slate-400">· Drag <GripVertical className="inline h-3 w-3" /> to reorder</span>
                  )}
                </p>
              </div>
              <button onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-105 transition-all">
                <Plus className="h-4 w-4" /> Add Department
              </button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                    <TableHead className="pl-4 py-3 w-8" />
                    <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                    <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Department</TableHead>
                    <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Head</TableHead>
                    <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</TableHead>
                    <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">No departments yet</p>
                          <p className="text-xs text-slate-400">Click "Add Department" to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((dept, index) => {
                      const dh = dragHandlers(index);
                      const isDragging = dragActive === index;
                      const isOver     = dragOver === index && dragActive !== index;
                      return (
                        <TableRow
                          key={dept.id}
                          {...dh}
                          className={`group border-b border-slate-100 dark:border-slate-800/60 transition-all duration-150 cursor-default
                            ${isDragging ? "opacity-40 scale-[0.98] bg-slate-50 dark:bg-slate-800/50" : ""}
                            ${isOver ? "bg-blue-50 dark:bg-blue-950/20 border-t-2 border-t-blue-400" : "hover:bg-blue-50/40 dark:hover:bg-slate-800/40"}
                          `}
                        >
                          {/* drag grip */}
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
                              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-blue-500" />
                              </div>
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{dept.name}</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${avatarColor(dept.head)} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
                                {dept.head.split(" ").map(n => n[0]).join("").slice(0,2)}
                              </div>
                              <span className="text-sm text-slate-700 dark:text-slate-300">{dept.head}</span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {dept.status}
                            </span>
                          </TableCell>

                          <TableCell className="pr-6 py-3.5 text-right">
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(dept)}
                                className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleDelete(dept.id)}
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
            </CardContent>
          </Card>
        </div>

        {/* ═══ INLINE SLIDE PANEL (CRM style) ═══ */}
        <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden
          ${panelOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"}`}>

          <div className="w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">

            {/* panel header — CRM style dark gradient */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#06b6d4] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                    {mode === "create" ? <Plus className="h-4 w-4 text-white" /> : <Pencil className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {mode === "create" ? "New Department" : "Edit Department"}
                    </h2>
                    <p className="text-[11px] text-blue-100/70">Fill in the details below</p>
                  </div>
                </div>
                <button onClick={() => setPanelOpen(false)}
                  className="h-7 w-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* step indicator — CRM style */}
              <div className="flex gap-1.5 mt-4">
                {["Basic Info", "Settings"].map((step, i) => (
                  <div key={step} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    i === 0 ? "bg-white/20 text-white" : "text-white/40"
                  }`}>
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-white text-blue-600" : "bg-white/20 text-white/60"
                    }`}>{i+1}</div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* panel body */}
            <div className="p-5 space-y-4">

              {/* Department Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Department Name *
                </label>
                <div className="flex gap-2">
                  <Select value={form.name} onValueChange={v => setForm(f => ({ ...f, name: v }))}>
                    <SelectTrigger className="flex-1 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-64 overflow-y-auto rounded-xl shadow-xl z-[999] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      {departmentOptions.map(d => (
                        <SelectItem key={d} value={d} className="text-sm cursor-pointer">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button onClick={handleAddDepartmentOption}
                    className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Department Head */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Department Head *
                </label>
                <Input
                  placeholder="Enter full name"
                  value={form.head}
                  onChange={e => setForm(f => ({ ...f, head: e.target.value }))}
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              {/* preview card */}
              {form.name && form.head && (
                <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/20 p-3">
                  <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide mb-2">Preview</p>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{form.name}</p>
                      <p className="text-xs text-slate-500">{form.head}</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* panel footer — CRM style Cancel / Save */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
              <button onClick={() => setPanelOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow hover:opacity-90 hover:scale-105 transition-all">
                {mode === "create" ? "Add Department" : "Save Changes"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentList;




