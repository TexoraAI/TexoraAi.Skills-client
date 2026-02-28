import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrainerBatchStudents } from "../services/batchService";
import { Card, CardContent } from "@/components/ui/card";

const TrainerClassroomPage = () => {
  const { batchId } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await getTrainerBatchStudents(batchId);
      setStudents(res.data || []);
    };
    load();
  }, [batchId]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Classroom Students</h1>

      {students.length === 0 ? (
        <p className="text-muted-foreground">No students assigned</p>
      ) : (
        students.map((email) => (
          <Card key={email}>
            <CardContent className="p-4">
              <p className="font-semibold">{email.split("@")[0]}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default TrainerClassroomPage;
