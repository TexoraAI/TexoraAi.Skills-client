import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTrainerAssignments,
  deleteAssignment,
} from "@/services/assessmentService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Calendar, Pencil, Trash2, Plus } from "lucide-react";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await getTrainerAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?",
    );

    if (!confirmDelete) return;

    try {
      await deleteAssignment(id);
      loadAssignments();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading assignments...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Assignments</h1>
          <p className="text-muted-foreground text-sm">
            Manage your created assignments
          </p>
        </div>

        <Button
          onClick={() => navigate("/trainer/create-assignments")}
          className="gap-2"
        >
          <Plus size={16} />
          Create New
        </Button>
      </div>

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="text-muted-foreground">No assignments created yet.</div>
      )}

      {/* Assignment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((a) => {
          const isExpired = new Date(a.deadline) < new Date();

          return (
            <Card
              key={a.id}
              className="p-6 space-y-4 hover:shadow-lg transition"
            >
              {/* Title + Status */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{a.title}</h2>

                <Badge variant={isExpired ? "destructive" : "outline"}>
                  {isExpired ? "Expired" : "Active"}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {a.description}
              </p>

              {/* Details */}
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(a.deadline).toLocaleString()}
                </div>

                <div>
                  <strong>{a.maxMarks}</strong> Marks
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => navigate(`/trainer/edit-assignment/${a.id}`)}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => handleDelete(a.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>

                {/* ✅ ADDED VIEW SUBMISSIONS BUTTON */}
                <Button
                  className="w-full bg-blue-600 text-white"
                  onClick={() => navigate(`/trainer/submissions/${a.id}`)}
                >
                  View Submissions
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
