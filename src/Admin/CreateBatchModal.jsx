
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createBatch, getBranches } from "../services/batchService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBatchModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);

  const [form, setForm] = useState({
    batchName: "",
    branchId: "",
  });

  useEffect(() => {
    getBranches().then((res) => setBranches(res.data || []));
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

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl p-6 bg-slate-900 text-white border border-slate-700 shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
            <h2 className="text-lg font-semibold">Create Batch</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Batch Name</Label>
              <Input
                value={form.batchName}
                onChange={(e) =>
                  setForm({ ...form, batchName: e.target.value })
                }
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label>Branch</Label>
              <select
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                className="w-full rounded-md px-3 py-2 text-sm bg-slate-800 text-white border border-slate-600"
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBatchModal;
