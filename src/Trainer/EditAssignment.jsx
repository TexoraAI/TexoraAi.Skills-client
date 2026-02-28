import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getTrainerAssignments,
  updateAssignment,
} from "@/services/assessmentService";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Calendar, Award, Save } from "lucide-react";

export default function EditAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    maxMarks: "",
    duration: "",
  });

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    try {
      const res = await getTrainerAssignments();

      const assignment = res.data.find((a) => a.id === Number(id));

      if (!assignment) {
        alert("Assignment not found");
        navigate("/trainer/my-assignments");
        return;
      }

      setFormData({
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline?.slice(0, 16), // format for datetime-local
        maxMarks: assignment.maxMarks,
        duration: assignment.duration || "",
      });
    } catch (error) {
      console.error("Error loading assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAssignment(id, {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks),
        duration: formData.duration,
      });

      alert("Assignment updated successfully!");
      navigate("/trainer/my-assignments");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="p-6">Loading assignment...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">Edit Assignment</h1>

      <Card className="p-6 space-y-4">
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            placeholder="Assignment Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Textarea
            rows={5}
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          />

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} />
            <Input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Award size={16} />
            <Input
              type="number"
              placeholder="Maximum Marks"
              value={formData.maxMarks}
              onChange={(e) =>
                setFormData({ ...formData, maxMarks: e.target.value })
              }
              required
            />
          </div>

          <Input
            placeholder="Duration (Optional)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          <Button
            type="submit"
            disabled={saving}
            className="bg-purple-600 text-white gap-2"
          >
            <Save size={16} />
            {saving ? "Updating..." : "Update Assignment"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
