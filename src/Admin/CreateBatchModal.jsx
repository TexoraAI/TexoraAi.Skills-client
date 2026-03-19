


import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createBatch, getBranches } from "../services/batchService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBatchModal = ({ onClose, onSuccess, inline = false }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ batchName: "", branchId: "" });

  useEffect(() => {
    getBranches().then((res) => {
      const list =
        res?.data?.data ||
        res?.data?.branches ||
        res?.data ||
        [];
      setBranches(Array.isArray(list) ? list : []);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.batchName || !form.branchId) return;
    try {
      setLoading(true);
      const res = await createBatch({
        batchName: form.batchName,
        branchId: Number(form.branchId),
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Batch creation failed");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          Batch Name
        </Label>
        <Input
          value={form.batchName}
          onChange={(e) => setForm({ ...form, batchName: e.target.value })}
          placeholder="Enter batch name"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
          Branch
        </Label>
        <select
          value={form.branchId}
          onChange={(e) => setForm({ ...form, branchId: e.target.value })}
          className="w-full rounded-xl px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select branch</option>
          {Array.isArray(branches) &&
            branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
        </select>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="p-5 bg-white dark:bg-slate-900">
        {formContent}
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
            <h2 className="text-lg font-semibold">Create Batch</h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
          {formContent}
        </div>
      </div>
    </>
  );
};

export default CreateBatchModal;
