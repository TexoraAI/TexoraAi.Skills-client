import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerBatches } from "../services/batchService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TrainerBatchesPage = () => {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await getTrainerBatches();
      setBatches(res || []);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Batches</h1>

      {batches.map((b) => (
        <Card key={b.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">{b.batchName}</p>
              <p className="text-sm text-muted-foreground">Batch ID: {b.id}</p>
            </div>

            <Button
              onClick={() => navigate(`/trainer/batches/${b.id}/students`)}
            >
              Open Classroom
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TrainerBatchesPage;
