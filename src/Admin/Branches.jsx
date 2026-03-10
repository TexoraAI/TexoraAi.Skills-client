
// import { Pencil, Plus, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";

// import {
//   createBranch,
//   getBranches,
//   updateBranch,
//   deleteBranch, // 🔥 added import
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

//   /* LOAD FROM BACKEND */
//   useEffect(() => {
//     loadBranches();
//   }, []);

//   const loadBranches = async () => {
//     try {
//       const res = await getBranches();
//       setBranches(res.data || []);
//     } catch (e) {
//       console.error("Failed to load branches", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredBranches = branches.filter((b) =>
//     b.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const resetModal = () => {
//     setShowModal(false);
//     setEditingId(null);
//     setForm({ name: "", city: "" });
//   };

//   const handleSave = async () => {
//     if (!form.name.trim() || !form.city.trim()) return;

//     try {
//       editingId
//         ? await updateBranch(editingId, form)
//         : await createBranch(form);

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

//   /* 🔥 DELETE HANDLER (ADDED ONLY THIS) */
//   const handleDelete = async (branch) => {
//     if (
//       !confirm(
//         `Delete branch "${branch.name}"?\nAll batches will also be removed.`,
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
//                       {/* EDIT (existing) */}
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => handleEdit(b)}
//                       >
//                         <Pencil className="h-4 w-4 text-blue-600" />
//                       </Button>

//                       {/* 🔥 DELETE (ADDED) */}
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

//       {/* MODAL unchanged */}
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












import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  createBranch,
  getBranches,
  updateBranch,
  deleteBranch, // 🔥 added import
} from "../services/batchService";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", city: "" });

  /* LOAD FROM BACKEND */
  useEffect(() => {
    loadBranches();
  }, []);

  const loadBranches = async () => {
    try {
      const res = await getBranches();
  
      const list = res.data?.data || res.data || [];
      setBranches(Array.isArray(list) ? list : []);
  
    } catch (e) {
      console.error("Failed to load branches", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredBranches = Array.isArray(branches)
  ? branches.filter((b) =>
      (b.name || "").toLowerCase().includes(search.toLowerCase())
    )
  : [];

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

  /* 🔥 DELETE HANDLER (ADDED ONLY THIS) */
  const handleDelete = async (branch) => {
    if (
      !confirm(
        `Delete branch "${branch.name}"?\nAll batches will also be removed.`,
      )
    )
      return;

    try {
      await deleteBranch(branch.id);
      loadBranches();
    } catch (e) {
      console.error("Delete failed", e);
      alert("Failed to delete branch");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-bold">Branches</h1>
        <p className="mt-1 text-sm opacity-90">
          Manage organisation branches & locations
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <Button
          className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
          onClick={() => {
            resetModal();
            setShowModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Branch
        </Button>

        <Input
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-56 h-9"
        />
      </div>

      <Card className="border border-slate-200 dark:border-slate-800">
        <CardHeader className="py-3">
          <CardTitle className="text-sm">Branch List</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>Branch</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredBranches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-sm">
                    No branches found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBranches.map((b) => (
                  <TableRow key={b.id} className="text-sm">
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.city}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">—</Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-1">
                      {/* EDIT (existing) */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(b)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>

                      {/* 🔥 DELETE (ADDED) */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(b)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL unchanged */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogOverlay className="bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm" />
        <DialogContent className="max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingId ? "Edit Branch" : "Add Branch"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Input
              placeholder="Branch name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="City / Location"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-5">
            <Button size="sm" variant="secondary" onClick={resetModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Branches;