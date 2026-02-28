import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTrainerAssignments,
  deleteAssignment,
} from "@/services/assessmentService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Calendar, Pencil, Trash2, Eye } from "lucide-react";

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await getTrainerAssignments();
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;

    await deleteAssignment(id);
    loadAssignments();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Assignments</h1>

        <Button onClick={() => navigate("/trainer/create-assignment")}>
          Create Assignment
        </Button>
      </div>

      {assignments.length === 0 && (
        <p className="text-muted-foreground">No assignments created yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((a) => {
          const expired = new Date(a.deadline) < new Date();

          return (
            <Card key={a.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{a.title}</h2>

                <Badge variant={expired ? "destructive" : "outline"}>
                  {expired ? "Expired" : "Active"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">{a.description}</p>

              <div className="text-sm text-muted-foreground">
                <Calendar className="inline w-4 h-4 mr-1" />
                {new Date(a.deadline).toLocaleString()}
              </div>

              <div className="text-sm">
                <strong>{a.maxMarks}</strong> Marks
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => navigate(`/trainer/edit-assignment/${a.id}`)}
                >
                  <Pencil size={14} /> Edit
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 gap-1"
                  onClick={() => navigate(`/trainer/submissions/${a.id}`)}
                >
                  <Eye size={14} /> Submissions
                </Button>

                <Button
                  variant="destructive"
                  className="flex-1 gap-1"
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
