
// import React, { useEffect, useState } from "react";
// import {
//   getBranches,
//   createBranch,
//   updateBranch,
// } from "../services/batchService";

// const Branches = () => {
//   const [branches, setBranches] = useState([]);
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // 🔥 NEW: track edit mode
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     city: "",
//   });

//   /* ===============================
//      LOAD FROM BACKEND
//      =============================== */
//   useEffect(() => {
//     loadBranches();
//   }, []);

//   const loadBranches = async () => {
//     try {
//       const res = await getBranches();
//       setBranches(res.data);
//     } catch (err) {
//       console.error("Failed to load branches", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBranches = branches.filter((b) =>
//     b.name.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ===============================
//      FORM HANDLERS
//      =============================== */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 🔥 SAVE = CREATE or UPDATE (same modal)
//   const handleSave = async () => {
//     if (!form.name.trim() || !form.city.trim()) return;

//     try {
//       if (editingId) {
//         // 🔥 EDIT
//         await updateBranch(editingId, form);
//       } else {
//         // 🔥 CREATE
//         await createBranch(form);
//       }

//       resetModal();
//       loadBranches();
//     } catch (err) {
//       console.error("Failed to save branch", err);
//     }
//   };

//   // 🔥 OPEN EDIT MODAL
//   const handleEdit = (branch) => {
//     setEditingId(branch.id);
//     setForm({
//       name: branch.name,
//       city: branch.city,
//     });
//     setShowModal(true);
//   };

//   const resetModal = () => {
//     setShowModal(false);
//     setEditingId(null);
//     setForm({ name: "", city: "" });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-slate-100">Branches</h1>
//         <p className="mt-1 text-sm text-slate-400">
//           Manage different branches / centres of your organisation.
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <button
//           onClick={() => {
//             resetModal();
//             setShowModal(true);
//           }}
//           className="px-4 py-2 rounded-md bg-violet-600 text-sm font-medium text-white hover:bg-violet-500"
//         >
//           + Add Branch
//         </button>

//         <input
//           type="text"
//           placeholder="Search branches..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full md:w-64 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//         />
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
//         <div className="flex text-xs font-semibold text-slate-400 border-b border-slate-800 pb-2 mb-3">
//           <div className="w-2/6">Branch name</div>
//           <div className="w-2/6">City / location</div>
//           <div className="w-1/6">Students</div>
//           <div className="w-1/6 text-right">Actions</div>
//         </div>

//         {loading ? (
//           <p className="text-sm text-slate-400">Loading...</p>
//         ) : filteredBranches.length === 0 ? (
//           <p className="text-sm text-slate-400">No branches found.</p>
//         ) : (
//           filteredBranches.map((branch) => (
//             <div
//               key={branch.id}
//               className="flex items-center text-sm text-slate-200 py-2 border-b border-slate-800 last:border-0"
//             >
//               <div className="w-2/6">{branch.name}</div>
//               <div className="w-2/6">{branch.city}</div>
//               <div className="w-1/6">{branch.students ?? 0}</div>
//               <div className="w-1/6 text-right">
//                 <button
//                   onClick={() => handleEdit(branch)}
//                   className="text-xs px-3 py-1 rounded-md border border-slate-700 hover:bg-slate-800"
//                 >
//                   Edit
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-700">
//             <h2 className="text-lg font-semibold text-slate-100 mb-4">
//               {editingId ? "Edit Branch" : "Add Branch"}
//             </h2>

//             <div className="space-y-4">
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Branch name"
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//               />

//               <input
//                 name="city"
//                 value={form.city}
//                 onChange={handleChange}
//                 placeholder="City / Location"
//                 className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={resetModal}
//                 className="px-4 py-2 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-500"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Branches;



import React, { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";

import {
  getBranches,
  createBranch,
  updateBranch,
} from "../services/batchService";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: "", city: "" });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const res = await getBranches();
      setBranches(res.data);
    } catch (e) {
      console.error("Failed to load branches", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ name: "", city: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.city.trim()) return;

    try {
      editingId
        ? await updateBranch(editingId, form)
        : await createBranch(form);

      resetModal();
      loadBranches();
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleEdit = (branch) => {
    setEditingId(branch.id);
    setForm({ name: branch.name, city: branch.city });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="rounded-3xl p-8 text-white shadow-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-3xl font-bold">Branches</h1>
        <p className="mt-2 text-sm opacity-90">
          Manage organisation branches & locations
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 w-fit"
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>

        <Input
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Branch List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No branches found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">
                      {b.name}
                    </TableCell>
                    <TableCell>{b.city}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {b.students ?? 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(b)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="name"
              placeholder="Branch name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="city"
              placeholder="City / Location"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={resetModal}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;
