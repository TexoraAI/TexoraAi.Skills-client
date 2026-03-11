

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAvailableTrainers,
  assignTrainer,
  getTrainerStudents,
  removeTrainerFromBatch,
} from "../services/batchService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AssignTrainerPage = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [trainers, setTrainers] = useState([]);
  const [assignedMap, setAssignedMap] = useState({});

  const load = async () => {
    try {
      const t = await getAvailableTrainers(batchId);
      setTrainers(t.data || []);

      const map = await getTrainerStudents(batchId);
      setAssignedMap(map || {});
    } catch (e) {
      console.error("Failed to load trainers", e);
    }
  };

  useEffect(() => {
    load();
  }, [batchId]);

  const addTrainer = async (trainer) => {
    if (!trainer?.email) {
      alert("Trainer email missing");
      return;
    }

    try {
      await assignTrainer(batchId, trainer.email);

      navigate(
        `/admin/batches/${batchId}/students/${encodeURIComponent(trainer.email)}`,
      );
    } catch (e) {
      console.error(e);
      alert("Failed to assign trainer");
    }
  };

  const removeTrainer = async (email) => {
    if (!window.confirm("Remove trainer and all his students?")) return;

    await removeTrainerFromBatch(batchId, email);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assign Trainers</h1>

      {trainers.map((t) => {
        const isAssigned = assignedMap?.[t.email];

        return (
          <Card key={t.email}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <p className="font-semibold">
                  {t.displayName || t.email?.split("@")[0]}
                </p>
                <p className="text-sm text-muted-foreground">{t.email}</p>
              </div>

              {isAssigned ? (
                <div className="space-x-2">
                  <Button
                    onClick={() =>
                      navigate(
                        `/admin/batches/${batchId}/students/${encodeURIComponent(t.email)}`,
                      )
                    }
                  >
                    Manage Students
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => removeTrainer(t.email)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button onClick={() => addTrainer(t)}>Assign To Batch</Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AssignTrainerPage;

