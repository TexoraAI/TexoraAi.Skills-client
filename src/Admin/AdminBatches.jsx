import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { deleteBatch, getAllBatches } from "../services/batchService";
import CreateBatchModal from "./CreateBatchModal";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminBatches = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [createdBatchId, setCreatedBatchId] = useState(null);
  const [batches, setBatches] = useState([]);

  /* ================= LOAD EXISTING BATCHES ================= */
  const loadBatches = async () => {
    try {
      const res = await getAllBatches();
  
      const list =
        res?.data?.data ||
        res?.data?.batches ||
        res?.data ||
        [];
  
      setBatches(Array.isArray(list) ? list : []);
  
    } catch (err) {
      console.error("Failed to load batches", err);
      setBatches([]);
    }
  };

useEffect(() => {
  loadBatches();
}, []);

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="rounded-2xl p-6 text-white shadow-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-bold">Batch Management</h1>
        <p className="mt-1 text-sm opacity-90">
          Create batch and assign trainer & students
        </p>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Button
          className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Batch
        </Button>
      </div>

      {/* WORKFLOW CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1️⃣ Create a batch</p>
          <p>2️⃣ Assign trainer to batch</p>
          <p>3️⃣ Assign students under trainer</p>

          {createdBatchId && (
            <div className="pt-4">
              <Button
                onClick={() =>
                  navigate(`/admin/batches/${createdBatchId}/assign-trainer`)
                }
              >
                Go to Assign Trainer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* EXISTING BATCHES */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Batches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {batches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No batches created yet
            </p>
          ) : (
            Array.isArray(batches) &&
            batches.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                <div className="space-y-1">
                  <p className="font-semibold">{b.batchName}</p>
                  <p className="text-xs text-muted-foreground">
                    Batch ID: {b.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Branch ID: {b.branchId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Trainer: {b.trainerEmail || "Not Assigned"}
                  </p>
                </div>

                <div className="flex gap-2">
                  {/* EXISTING BUTTON */}
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/batches/${b.id}/assign-trainer`)
                    }
                  >
                    {b.trainerEmail ? "Manage Students" : "Assign Trainer"}
                  </Button>

                  {/* EXISTING BUTTON */}
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/admin/batches/${b.id}/trainers`)}
                  >
                    View Trainers
                  </Button>

                  {/* 🧨 DELETE BUTTON (ADDED) */}
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      if (!window.confirm("Delete this batch permanently?"))
                        return;

                      try {
                        await deleteBatch(b.id);
                        loadBatches();
                      } catch (e) {
                        console.error("Delete failed", e);
                        alert("Failed to delete batch");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* MODAL */}
      {showModal && (
        <CreateBatchModal
          onClose={() => setShowModal(false)}
          onSuccess={(newBatch) => {
            setShowModal(false);
            setCreatedBatchId(newBatch.id);
            loadBatches();
          }}
        />
      )}
    </div>
  );
};

export default AdminBatches;
