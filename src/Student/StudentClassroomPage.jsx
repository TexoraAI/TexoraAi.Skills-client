import { useEffect, useState } from "react";
import { getStudentClassroom } from "../services/batchService";
import { Card, CardContent } from "@/components/ui/card";

const StudentClassroomPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStudentClassroom();
        setData(res.data);
      } catch (e) {
        console.error("Failed loading classroom", e);
      }
    };

    load();
  }, []);

  if (!data)
    return (
      <p className="text-muted-foreground">
        You are not assigned to any trainer yet
      </p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Classroom</h1>

      <Card>
        <CardContent className="p-5 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Batch</p>
            <p className="font-semibold text-lg">{data.batchName}</p>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground">Trainer</p>
            <p className="font-semibold">{data.trainerName}</p>
            <p className="text-sm text-muted-foreground">{data.trainerEmail}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentClassroomPage;
