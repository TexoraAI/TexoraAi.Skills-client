// import { Pencil, Plus, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import {
//   createBranch,
//   deleteBranch,
//   getBranches,
//   updateBranch,
// } from "../services/batchService";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogOverlay,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const Branches = () => {
//   const [branches, setBranches] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [form, setForm] = useState({ name: "", city: "" });

//   /* ================= LOAD FROM BACKEND ================= */
//   useEffect(() => {
//     loadBranches();
//   }, []);

//   const loadBranches = async () => {
//     try {
//       const res = await getBranches();

//       const data = res?.data;

//       // 🔥 SAFE ARRAY CHECK (FIX)
//       if (Array.isArray(data)) {
//         setBranches(data);
//       } else if (Array.isArray(data?.data)) {
//         setBranches(data.data);
//       } else {
//         setBranches([]);
//       }

//     } catch (e) {
//       console.error("Failed to load branches", e);
//       setBranches([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= SAFE FILTER ================= */
//   const filteredBranches = Array.isArray(branches)
//     ? branches.filter((b) =>
//         b?.name?.toLowerCase().includes(search.toLowerCase())
//       )
//     : [];

//   const resetModal = () => {
//     setShowModal(false);
//     setEditingId(null);
//     setForm({ name: "", city: "" });
//   };

//   const handleSave = async () => {
//     if (!form.name.trim() || !form.city.trim()) return;

//     try {
//       if (editingId) {
//         await updateBranch(editingId, form);
//       } else {
//         await createBranch(form);
//       }

//       resetModal();
//       loadBranches();
//     } catch (e) {
//       console.error("Save failed", e);
//     }
//   };

//   const handleEdit = (branch) => {
//     setEditingId(branch.id);
//     setForm({ name: branch.name, city: branch.city });
//     setShowModal(true);
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (branch) => {
//     if (
//       !confirm(
//         `Delete branch "${branch.name}"?\nAll batches will also be removed.`
//       )
//     )
//       return;

//     try {
//       await deleteBranch(branch.id);
//       loadBranches();
//     } catch (e) {
//       console.error("Delete failed", e);
//       alert("Failed to delete branch");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//         <h1 className="text-2xl font-bold">Branches</h1>
//         <p className="mt-1 text-sm opacity-90">
//           Manage organisation branches & locations
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <Button
//           className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
//           onClick={() => {
//             resetModal();
//             setShowModal(true);
//           }}
//         >
//           <Plus className="h-4 w-4 mr-1.5" />
//           Add Branch
//         </Button>

//         <Input
//           placeholder="Search branches..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="md:w-56 h-9"
//         />
//       </div>

//       <Card className="border border-slate-200 dark:border-slate-800">
//         <CardHeader className="py-3">
//           <CardTitle className="text-sm">Branch List</CardTitle>
//         </CardHeader>

//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow className="text-xs">
//                 <TableHead>Branch</TableHead>
//                 <TableHead>City</TableHead>
//                 <TableHead>Students</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="py-6 text-sm">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : filteredBranches.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="py-6 text-center text-sm">
//                     No branches found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredBranches.map((b) => (
//                   <TableRow key={b.id} className="text-sm">
//                     <TableCell className="font-medium">{b.name}</TableCell>
//                     <TableCell>{b.city}</TableCell>
//                     <TableCell>
//                       <Badge variant="secondary">—</Badge>
//                     </TableCell>
//                     <TableCell className="text-right flex justify-end gap-1">
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleEdit(b)}
//                       >
//                         <Pencil className="h-4 w-4 text-blue-600" />
//                       </Button>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleDelete(b)}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-600" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogOverlay className="bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm" />
//         <DialogContent className="max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
//           <DialogHeader>
//             <DialogTitle className="text-base font-semibold">
//               {editingId ? "Edit Branch" : "Add Branch"}
//             </DialogTitle>
//           </DialogHeader>

//           <div className="space-y-3 mt-4">
//             <Input
//               placeholder="Branch name"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//             <Input
//               placeholder="City / Location"
//               value={form.city}
//               onChange={(e) => setForm({ ...form, city: e.target.value })}
//             />
//           </div>

//           <DialogFooter className="mt-5">
//             <Button size="sm" variant="secondary" onClick={resetModal}>
//               Cancel
//             </Button>
//             <Button size="sm" onClick={handleSave}>
//               Save
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Branches;





















import { ArrowLeft, Building2, GitBranch, Layers, MapPin, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "../services/batchService";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/* ── branch initial colour ── */
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

/* ================= MAIN ================= */
const Branches = () => {
  const navigate = useNavigate();
  const [branches, setBranches]   = useState([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({ name: "", city: "" });
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

  /* ── LOAD (unchanged) ── */
  useEffect(() => { loadBranches(); }, []);

  const loadBranches = async () => {
    try {
      const res  = await getBranches();
      const data = res?.data;
      if      (Array.isArray(data))       setBranches(data);
      else if (Array.isArray(data?.data)) setBranches(data.data);
      else                                setBranches([]);
    } catch (e) {
      console.error("Failed to load branches", e);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = Array.isArray(branches)
    ? branches.filter((b) => b?.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const resetModal = () => { setShowModal(false); setEditingId(null); setForm({ name: "", city: "" }); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) return;
    try {
      editingId ? await updateBranch(editingId, form) : await createBranch(form);
      resetModal();
      loadBranches();
    } catch (e) { console.error("Save failed", e); }
  };

  const handleEdit = (branch) => {
    setEditingId(branch.id);
    setForm({ name: branch.name, city: branch.city });
    setShowModal(true);
  };

  const handleDelete = async (branch) => {
    if (!confirm(`Delete branch "${branch.name}"?\nAll batches will also be removed.`)) return;
    try {
      await deleteBranch(branch.id);
      loadBranches();
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete branch");
    }
  };

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
              <h1 className="text-2xl font-bold tracking-tight text-white">Branch Management</h1>
              <p className="mt-0.5 text-sm text-blue-100/80">Manage organisation branches &amp; locations</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 backdrop-blur-sm">
            <GitBranch className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-semibold text-white">
              {branches.length}
              <span className="ml-1 font-normal text-blue-100/80">Branches</span>
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
              placeholder="Search branches…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl bg-white dark:bg-slate-900
                border-slate-200 dark:border-slate-800 text-sm"
            />
          </div>

          {/* add button */}
          <button
            onClick={() => { resetModal(); setShowModal(true); }}
            className="flex items-center gap-1.5 rounded-xl
              bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2
              text-sm font-semibold text-white shadow
              hover:opacity-90 hover:scale-105 transition-all whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Branch
          </button>
        </div>
      </div>

      {/* ═══════ TABLE CARD ═══════ */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200
        dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">

        <CardHeader className="flex flex-row items-center justify-between
          border-b border-slate-100 dark:border-slate-800 bg-slate-50/60
          dark:bg-slate-900/60 px-6 py-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              All Branches
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredBranches.length} record{filteredBranches.length !== 1 && "s"} found
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="pl-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">#</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Branch</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">City</TableHead>
                  <TableHead className="py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Students</TableHead>
                  <TableHead className="pr-6 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  /* skeleton rows */
                  [1,2,3].map((i) => (
                    <TableRow key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <TableCell className="pl-6 py-4"><div className="h-3 w-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-3 w-36 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                      <TableCell><div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></TableCell>
                      <TableCell />
                    </TableRow>
                  ))
                ) : filteredBranches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
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
                  filteredBranches.map((b, index) => (
                    <TableRow
                      key={b.id}
                      className="group border-b border-slate-100 dark:border-slate-800/60
                        hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* # */}
                      <TableCell className="pl-6 py-3.5 text-sm text-slate-400 font-medium w-10">
                        {String(index + 1).padStart(2, "0")}
                      </TableCell>

                      {/* Branch */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${grad(b.name)}
                            flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                            {b.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100
                            group-hover:text-blue-600 transition-colors">
                            {b.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* City */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="inline-flex items-center rounded-full
                            bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5
                            text-xs font-semibold text-blue-700 dark:text-blue-400
                            border border-blue-200 dark:border-blue-800">
                            {b.city}
                          </span>
                        </div>
                      </TableCell>

                      {/* Students */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            0 Students
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 py-3.5 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(b)}
                            className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/50
                              flex items-center justify-center text-blue-600
                              hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b)}
                            className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/50
                              flex items-center justify-center text-red-500
                              hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ═══════ MODAL ═══════ */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogOverlay className="bg-black/50 backdrop-blur-md" />
        <DialogContent className="max-w-sm p-0 rounded-2xl overflow-hidden
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">

          {/* modal header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center">
                {editingId ? <Pencil className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-white">
                  {editingId ? "Edit Branch" : "Add New Branch"}
                </DialogTitle>
                <p className="text-[11px] text-blue-100/70">
                  {editingId ? "Update branch details" : "Fill in the details below"}
                </p>
              </div>
            </div>
          </div>

          {/* modal body */}
          <div className="p-5 space-y-4">

            {/* Branch name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Branch Name
              </label>
              <Input
                placeholder="e.g. North Campus"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-xl border-slate-200 dark:border-slate-700
                  bg-slate-50 dark:bg-slate-800"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                City / Location
              </label>
              <div className="flex gap-2">
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700
                    bg-slate-50 dark:bg-slate-800 px-3 text-sm text-slate-700 dark:text-slate-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select City</option>
                  {locationOptions.map((city, i) => (
                    <option key={i} value={city}>{city}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const newCity = prompt("Enter new location");
                    if (!newCity) return;
                    if (!locationOptions.includes(newCity))
                      setLocationOptions([...locationOptions, newCity]);
                    setForm({ ...form, city: newCity });
                  }}
                  className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700
                    bg-slate-50 dark:bg-slate-800 flex items-center justify-center
                    text-slate-600 hover:bg-blue-50 hover:text-blue-600
                    hover:border-blue-200 transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={resetModal}
                className="px-4 py-2 rounded-xl text-sm font-medium
                  bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                  hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-cyan-500 shadow
                  hover:opacity-90 hover:scale-105 transition-all"
              >
                {editingId ? "Save Changes" : "Add Branch"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;