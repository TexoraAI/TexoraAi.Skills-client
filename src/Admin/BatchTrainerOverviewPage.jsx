
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTrainerStudents,
  removeTrainerFromBatch,
} from "../services/batchService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BatchTrainerOverviewPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});

  const load = async () => {
    try {
      const map = await getTrainerStudents(batchId);
      setData(map || {});
    } catch (e) {
      console.error("Failed loading trainer students", e);
    }
  };

  useEffect(() => {
    load();
  }, [batchId]);

  /* 🔥 DELETE TRAINER */
  const deleteTrainer = async (trainerEmail) => {
    if (!window.confirm("Delete trainer and release all students?")) return;

    try {
      await removeTrainerFromBatch(batchId, trainerEmail);
      await load();
    } catch (e) {
      console.error("Failed deleting trainer", e);
      alert("Failed deleting trainer");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Batch Trainers & Students</h1>

      {Array.isArray(Object.entries(data)) &&
  Object.entries(data || {}).map(([trainerEmail, students]) => (
        <Card key={trainerEmail}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold text-lg">
                  {trainerEmail.split("@")[0]}
                </p>
                <p className="text-sm text-muted-foreground">{trainerEmail}</p>
              </div>
      
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    navigate(
                      `/admin/batches/${batchId}/students/${encodeURIComponent(trainerEmail)}`
                    )
                  }
                >
                  Manage Students
                </Button>
      
                <Button
                  variant="destructive"
                  onClick={() => deleteTrainer(trainerEmail)}
                >
                  Delete Trainer
                </Button>
              </div>
            </div>
      
            <div className="pl-4 space-y-1">
              {!students || students.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No students assigned
                </p>
              ) : (
                Array.isArray(students) &&
                students.map((s) => (
                  <p key={s} className="text-sm">
                    • {s}
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatchTrainerOverviewPage;
