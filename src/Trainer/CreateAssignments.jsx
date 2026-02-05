import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Calendar,
  Clock,
  Award,
  Users,
  Upload,
  Link2,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Paperclip,
} from "lucide-react";

const CreateAssignments = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    deadline: "",
    maxMarks: "",
    duration: "",
    attachments: [],
    referenceLinks: [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        title: "",
        description: "",
        batch: "",
        deadline: "",
        maxMarks: "",
        duration: "",
        attachments: [],
        referenceLinks: [""],
      });
    }, 2000);
  };

  const addReferenceLink = () =>
    setFormData((p) => ({ ...p, referenceLinks: [...p.referenceLinks, ""] }));

  const removeReferenceLink = (i) =>
    setFormData((p) => ({
      ...p,
      referenceLinks: p.referenceLinks.filter((_, idx) => idx !== i),
    }));

  const updateReferenceLink = (i, v) =>
    setFormData((p) => ({
      ...p,
      referenceLinks: p.referenceLinks.map((l, idx) => (idx === i ? v : l)),
    }));

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((p) => ({
      ...p,
      attachments: [...p.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((p) => ({
      ...p,
      attachments: p.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* HERO */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
        <div className="max-w-5xl mx-auto px-6 py-10 text-white">
          <p className="text-xs uppercase tracking-widest text-white/80">
            Assessment Studio
          </p>
          <h1 className="text-4xl font-bold mt-2">Create Assignment</h1>
          <p className="text-white/80 mt-2">
            Design tasks, set deadlines, and evaluate student performance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {showSuccess && (
          <div className="flex gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="text-emerald-600" />
            <div>
              <p className="font-semibold">Assignment Published</p>
              <p className="text-sm opacity-80">
                Students have been notified instantly
              </p>
            </div>
          </div>
        )}

        {/* BASIC INFO */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="text-purple-600" /> Basic Information
          </h2>

          <Input
            placeholder="Assignment title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Textarea
            rows={5}
            placeholder="Describe the task, requirements, and expected output"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Card>

        {/* DETAILS */}
        <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            placeholder="Batch name"
            value={formData.batch}
            onChange={(e) =>
              setFormData({ ...formData, batch: e.target.value })
            }
          />
          <Input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Max Marks"
            value={formData.maxMarks}
            onChange={(e) =>
              setFormData({ ...formData, maxMarks: e.target.value })
            }
          />
          <Input
            placeholder="Expected duration (optional)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </Card>

        {/* REFERENCES */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <Link2 className="text-purple-600" /> Reference Material
            </h2>
            <Button variant="outline" size="sm" onClick={addReferenceLink}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          {formData.referenceLinks.map((link, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="https://resource-link"
                value={link}
                onChange={(e) => updateReferenceLink(i, e.target.value)}
              />
              {formData.referenceLinks.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeReferenceLink(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </Card>

        {/* ATTACHMENTS */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Paperclip className="text-purple-600" /> Attachments
          </h2>

          <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition">
            <Upload className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-medium">
              Click to upload or drag files here
            </p>
            <p className="text-xs opacity-60">
              PDFs, ZIPs, DOCs (frontend only)
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              {formData.attachments.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm bg-slate-100 dark:bg-slate-800 rounded px-3 py-2"
                >
                  {f.name}
                  <button onClick={() => removeAttachment(i)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* INFO */}
        <div className="flex gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border">
          <AlertCircle className="text-blue-600" />
          <p className="text-sm">
            Students will be notified immediately once the assignment is created.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            type="submit"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Creating…" : "Create Assignment"}
          </Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignments;
