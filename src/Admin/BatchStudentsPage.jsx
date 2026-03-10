
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableStudents,
  getTrainerStudents,
  assignStudentsToTrainer,
  removeStudentFromTrainer,
} from "../services/batchService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BatchStudentsPage = () => {
  const { batchId, trainerEmail } = useParams();
  const decodedEmail = decodeURIComponent(trainerEmail);

  const [availableStudents, setAvailableStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);

  /* ================= LOAD DATA ================= */

  const load = async () => {
    try {
      // available
      const available = await getAvailableStudents(batchId, decodedEmail);

const list =
  available?.data?.data ||
  available?.data?.students ||
  available?.data ||
  [];

setAvailableStudents(Array.isArray(list) ? list : []);

      // assigned
      const map = await getTrainerStudents(batchId);
      const assignedList = map?.[decodedEmail] || [];

const assigned = Array.isArray(assignedList)
  ? assignedList.filter((e) => e && e !== "__EMPTY__")
  : [];

      setAssignedStudents(assigned);
    } catch (e) {
      console.error("Failed loading students", e);
    }
  };

  useEffect(() => {
    load();
  }, [batchId, trainerEmail]);

  /* ================= ACTIONS ================= */

  const assignStudent = async (email) => {
    try {
      const updated = [...assignedStudents, email];
      await assignStudentsToTrainer(batchId, decodedEmail, updated);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  const removeStudent = async (email) => {
    try {
      await removeStudentFromTrainer(batchId, decodedEmail, email);
      await load();
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Students under {decodedEmail}</h1>

      {/* ASSIGNED STUDENTS */}
      {Array.isArray(assignedStudents) &&
  assignedStudents.map((email) => (
    <Card key={email}>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <p className="font-semibold">{email.split("@")[0]}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>

        <Button variant="destructive" onClick={() => removeStudent(email)}>
          Remove
        </Button>
      </CardContent>
    </Card>
  ))}

      {/* AVAILABLE STUDENTS */}
      {Array.isArray(availableStudents) &&
  availableStudents.map((s) => (
    <Card key={s.email}>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <p className="font-semibold">
            {s.displayName || s.email.split("@")[0]}
          </p>
          <p className="text-sm text-muted-foreground">{s.email}</p>
        </div>

        <Button onClick={() => assignStudent(s.email)}>Assign</Button>
      </CardContent>
    </Card>
  ))}
    </div>
  );
};

export default BatchStudentsPage;
