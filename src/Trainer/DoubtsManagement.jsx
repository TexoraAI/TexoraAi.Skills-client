
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTrainerStudents } from "@/services/chatService";
import videoService from "@/services/videoService"; // ⭐ FIXED (was batchService)
import { MessageCircle, Search, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import DoubtsChatModal from "./DoubtsChatModal";

const DoubtsManagement = () => {
  const [batchId, setBatchId] = useState(null);
  const [batches, setBatches] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= LOAD TRAINER BATCHES (FIXED) ================= */
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await videoService.getTrainerBatches(); // ⭐ SAME AS UPLOAD VIDEOS
        const list = res.data || [];

        setBatches(list);

        if (list.length > 0) {
          setBatchId(list[0].id);
        }
      } catch (e) {
        console.error("Failed to load batches", e);
      }
    };

    loadBatches();
  }, []);

  /* ================= LOAD STUDENTS ================= */
  useEffect(() => {
    if (!batchId) return;

    const loadStudents = async () => {
      try {
        const res = await getTrainerStudents(batchId);

        const students = res.data.map((email, index) => ({
          id: index + 1,
          student: email.split("@")[0],
          studentEmail: email,
          batchId,
        }));

        setDoubts(students);
      } catch (e) {
        console.error("Failed to load students", e);
        setDoubts([]);
      }
    };

    loadStudents();
  }, [batchId]);

  const filteredDoubts = doubts.filter((d) =>
    d.student.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold">Doubts Management</h1>
          <p className="text-sm opacity-90">Track & reply to student queries</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* SELECT BATCH DROPDOWN */}
        <Card className="p-3 mb-4">
          <select
            value={batchId || ""}
            onChange={(e) => setBatchId(Number(e.target.value))}
            className="w-full h-9 rounded-md border px-3 text-sm"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name || "Batch"} (ID: {b.id})
              </option>
            ))}
          </select>
        </Card>

        {/* SEARCH */}
        <Card className="p-3 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              className="h-8"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* STUDENT LIST */}
        {filteredDoubts.length === 0 ? (
          <Card className="p-8 text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">
              {batchId
                ? "No students in this batch"
                : "Please select a batch first"}
            </p>
          </Card>
        ) : (
          <Card className="p-3 space-y-2">
            {filteredDoubts.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between border rounded-md px-3 py-2 hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{d.student}</p>
                  </div>
                </div>

                <Button size="sm" onClick={() => setActiveDoubt(d)}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            ))}
          </Card>
        )}
      </div>

      {activeDoubt && (
        <DoubtsChatModal
          doubt={activeDoubt}
          onClose={() => setActiveDoubt(null)}
        />
      )}
    </div>
  );
};

export default DoubtsManagement;
