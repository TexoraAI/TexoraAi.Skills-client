
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createBatch, getBranches } from "../services/batchService";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBatchModal = ({ onClose, onSuccess, inline = false }) => {
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [limitError, setLimitError] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ batchName: "", branchId: "" });

  useEffect(() => {
    getBranches().then((res) => {
      const list = res?.data?.data || res?.data?.branches || res?.data || [];
      setBranches(Array.isArray(list) ? list : []);
    });
  }, []);

  const handleSubmit = async () => {
    if (!form.batchName || !form.branchId) return;
    setError("");
    try {
      setLoading(true);
      const res = await createBatch({
        batchName: form.batchName,
        branchId: Number(form.branchId),
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Something went wrong.";
      const text = typeof msg === "string" ? msg : "Something went wrong.";
      if (
        text.toLowerCase().includes("limit") ||
        text.toLowerCase().includes("max")
      ) {
        setLimitError(text);
      } else {
        setError(text);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── rendered in BOTH inline and modal mode ──
  const limitModal = limitError && (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: "32px 28px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(244,63,94,0.1)",
            border: "1.5px solid rgba(244,63,94,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <span style={{ fontSize: 24 }}>🚫</span>
        </div>

        <p
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "#0f172a",
            fontFamily: "'Poppins',sans-serif",
            margin: "0 0 8px",
          }}
        >
          Batch Limit Reached
        </p>

        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            fontFamily: "'Poppins',sans-serif",
            margin: "0 0 20px",
            lineHeight: 1.6,
          }}
        >
          {limitError}. Please contact your Super Admin to upgrade your plan.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setLimitError(null)}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              color: "#64748b",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Close
          </button>
          <button
            onClick={() => setLimitError(null)}
            style={{
              padding: "9px 22px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#f43f5e,#be123c)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Poppins',sans-serif",
            }}
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );

  const formContent = (
    <div className="space-y-4">
      {error && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(244,63,94,0.08)",
            border: "1px solid rgba(244,63,94,0.25)",
            color: "#f43f5e",
            fontSize: 12,
            fontFamily: "'Poppins',sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ⚠️ {error}
        </div>
      )}

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

  // ── inline mode — used inside AdminBatches panel ──
  if (inline) {
    return (
      <>
        <div className="p-5 bg-white dark:bg-slate-900">{formContent}</div>
        {limitModal}
      </>
    );
  }

  // ── modal mode ──
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
      {limitModal}
    </>
  );
};

export default CreateBatchModal;
