
// import React, { useEffect, useState } from "react";
// import {
//   createBatch,
//   updateBatch, // ✅ ADDED
//   getBranches,
// } from "../services/batchService";

// const CreateBatchModal = ({
//   onClose,
//   onSuccess,
//   isEdit = false, // ✅ ADDED
//   initialData = null, // ✅ ADDED
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [branches, setBranches] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     branchId: "",
//     courseId: "",
//     trainerId: "",
//     startDate: "",
//     endDate: "",
//   });

//   /* ===============================
//      LOAD BRANCHES
//      =============================== */
//   useEffect(() => {
//     loadBranches();
//   }, []);

//   /* ===============================
//      PREFILL FORM FOR EDIT
//      =============================== */
//   useEffect(() => {
//     if (isEdit && initialData) {
//       setForm({
//         name: initialData.name || "",
//         branchId: initialData.branchId || "",
//         courseId: initialData.courseId || "",
//         trainerId: initialData.trainerId || "",
//         startDate: initialData.startDate || "",
//         endDate: initialData.endDate || "",
//       });
//     }
//   }, [isEdit, initialData]);

//   const loadBranches = async () => {
//     try {
//       const res = await getBranches();
//       setBranches(res.data || []);
//     } catch (err) {
//       console.error("Failed to load branches", err);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ===============================
//      CREATE / UPDATE HANDLER
//      =============================== */
//   const handleSubmit = async () => {
//     if (!form.name || !form.branchId || !form.courseId || !form.trainerId)
//       return;

//     try {
//       setLoading(true);

//       if (isEdit && initialData?.id) {
//         // ✅ UPDATE
//         await updateBatch(initialData.id, form);
//       } else {
//         // ✅ CREATE
//         await createBatch(form);
//       }

//       onSuccess();
//       onClose();
//     } catch (err) {
//       console.error("Batch save failed", err);
//       alert("Batch save failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
//         <h2 className="text-lg font-semibold text-slate-100 mb-4">
//           Create Batch
//         </h2>

//         <div className="space-y-4">
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="Batch name"
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           />

//           <select
//             name="branchId"
//             value={form.branchId}
//             onChange={handleChange}
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           >
//             <option value="">Select branch</option>
//             {branches.map((b) => (
//               <option key={b.id} value={b.id}>
//                 {b.name}
//               </option>
//             ))}
//           </select>

//           <input
//             name="courseId"
//             value={form.courseId}
//             onChange={handleChange}
//             placeholder="Course ID"
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           />

//           <input
//             name="trainerId"
//             value={form.trainerId}
//             onChange={handleChange}
//             placeholder="Trainer ID"
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           />

//           <input
//             type="date"
//             name="startDate"
//             value={form.startDate}
//             onChange={handleChange}
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           />

//           <input
//             type="date"
//             name="endDate"
//             value={form.endDate}
//             onChange={handleChange}
//             className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
//           />
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-4 py-2 text-sm rounded-md bg-violet-600 text-white hover:bg-violet-500"
//           >
//             {loading ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBatchModal;




import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  createBatch,
  updateBatch,
  getBranches,
} from "../services/batchService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBatchModal = ({
  onClose,
  onSuccess,
  isEdit = false,
  initialData = null,
}) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);

  const [form, setForm] = useState({
    name: "",
    branchId: "",
    courseId: "",
    trainerId: "",
    startDate: "",
    endDate: "",
  });

  /* LOAD BRANCHES */
  useEffect(() => {
    getBranches()
      .then((res) => setBranches(res.data || []))
      .catch(console.error);
  }, []);

  /* PREFILL EDIT */
  useEffect(() => {
    if (isEdit && initialData) {
      setForm({
        name: initialData.name || "",
        branchId: initialData.branchId || "",
        courseId: initialData.courseId || "",
        trainerId: initialData.trainerId || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });
    }
  }, [isEdit, initialData]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.branchId || !form.courseId || !form.trainerId)
      return;

    try {
      setLoading(true);
      if (isEdit && initialData?.id) {
        await updateBatch(initialData.id, form);
      } else {
        await createBatch(form);
      }
      onSuccess();
      onClose();
    } catch {
      alert("Batch save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKDROP – NO BLUR */}
      <div
        className="
          fixed inset-0 z-40
          bg-white/90 dark:bg-black/80
        "
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className="
            w-full max-w-md rounded-xl p-6
            bg-black text-white
            dark:bg-slate-900 dark:text-slate-100
            border border-slate-700
            shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <h2 className="text-lg font-semibold">
              {isEdit ? "Edit Batch" : "Create Batch"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Batch Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Batch name"
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">Branch</Label>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                className="
                  w-full rounded-md px-3 py-2 text-sm
                  bg-slate-800 text-white
                  border border-slate-600
                "
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-300">Course ID</Label>
                <Input
                  name="courseId"
                  value={form.courseId}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">Trainer ID</Label>
                <Input
                  name="trainerId"
                  value={form.trainerId}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-300">Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-slate-300">End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-500 text-white"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBatchModal;
