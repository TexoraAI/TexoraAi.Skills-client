
// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import {
//   FileText,
//   Upload,
//   Link2,
//   AlertCircle,
//   CheckCircle,
//   Plus,
//   Paperclip,
// } from "lucide-react";

// const CreateAssignments = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     batchId: "",   // ✅ changed from batch to batchId
//     deadline: "",
//     maxMarks: "",
//     duration: "",
//     attachments: [],
//     referenceLinks: [""],
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     await new Promise((r) => setTimeout(r, 1200));
//     setIsSubmitting(false);
//     setShowSuccess(true);

//     setTimeout(() => {
//       setShowSuccess(false);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

//       {/* HERO – COMPACT */}
//       <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
//         <div className="max-w-5xl mx-auto px-5 py-6 text-white">
//           <p className="text-[11px] uppercase tracking-widest text-white/80">
//             Assessment Studio
//           </p>
//           <h1 className="text-2xl font-bold mt-1">Create Assignment</h1>
//           <p className="text-sm text-white/90 mt-1">
//             Design tasks and evaluate students
//           </p>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-5 py-6 space-y-5">

//         {showSuccess && (
//           <div className="flex gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
//             <CheckCircle className="text-emerald-600 w-4 h-4 mt-0.5" />
//             <div>
//               <p className="text-sm font-semibold">Assignment Published</p>
//               <p className="text-xs opacity-80">
//                 Students notified successfully
//               </p>
//             </div>
//           </div>
//         )}

//         {/* BASIC INFO */}
//         <Card className="p-4 space-y-3">
//           <h2 className="text-sm font-semibold flex items-center gap-2">
//             <FileText className="text-blue-600 w-4 h-4" />
//             Basic Information
//           </h2>

//           <Input
//             className="h-9 text-sm"
//             placeholder="Assignment title"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//           />

//           <Textarea
//             rows={4}
//             className="text-sm"
//             placeholder="Describe assignment"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//           />
//         </Card>

//         {/* DETAILS */}
//         <Card className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input
//             className="h-9 text-sm"
//             placeholder="Batch ID"
//             value={formData.batchId}
//             onChange={(e) =>
//               setFormData({ ...formData, batchId: e.target.value })
//             }
//           />
//           <Input
//             className="h-9 text-sm"
//             type="datetime-local"
//             value={formData.deadline}
//             onChange={(e) =>
//               setFormData({ ...formData, deadline: e.target.value })
//             }
//           />
//           <Input
//             className="h-9 text-sm"
//             type="number"
//             placeholder="Max Marks"
//             value={formData.maxMarks}
//             onChange={(e) =>
//               setFormData({ ...formData, maxMarks: e.target.value })
//             }
//           />
//           <Input
//             className="h-9 text-sm"
//             placeholder="Expected duration"
//             value={formData.duration}
//             onChange={(e) =>
//               setFormData({ ...formData, duration: e.target.value })
//             }
//           />
//         </Card>

//         {/* REFERENCES */}
//         <Card className="p-4 space-y-3">
//           <div className="flex justify-between items-center">
//             <h2 className="text-sm font-semibold flex items-center gap-2">
//               <Link2 className="text-blue-600 w-4 h-4" />
//               Reference Material
//             </h2>
//             <Button size="sm" variant="outline">
//               <Plus className="w-3 h-3 mr-1" /> Add
//             </Button>
//           </div>

//           <Input
//             className="h-9 text-sm"
//             placeholder="https://resource-link"
//           />
//         </Card>

//         {/* ATTACHMENTS */}
//         <Card className="p-4 space-y-3">
//           <h2 className="text-sm font-semibold flex items-center gap-2">
//             <Paperclip className="text-blue-600 w-4 h-4" />
//             Attachments
//           </h2>

//           <label className="block border border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
//             <Upload className="mx-auto mb-1 text-slate-400 w-5 h-5" />
//             <p className="text-xs font-medium">Upload files</p>
//             <input type="file" className="hidden" />
//           </label>
//         </Card>

//         {/* INFO */}
//         <div className="flex gap-2 p-3 rounded-lg bg-blue-50 border">
//           <AlertCircle className="text-blue-600 w-4 h-4 mt-0.5" />
//           <p className="text-xs">
//             Students will be notified once assignment is created.
//           </p>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex gap-3">
//           <Button
//             size="sm"
//             disabled={isSubmitting}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
//             onClick={handleSubmit}
//           >
//             {isSubmitting ? "Creating…" : "Create Assignment"}
//           </Button>
//           <Button size="sm" variant="outline">Save Draft</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateAssignments;















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CheckCircle, FileText, List, Upload } from "lucide-react";

import {
  createAssignment,
  uploadAssignmentFile,
} from "@/services/assessmentService";

import { getTrainerBatches } from "@/services/batchService";

const CreateAssignments = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    batch: "",
    deadline: "",
    maxMarks: "",
    duration: "",
    attachments: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ FIXED BATCH LOADING
  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await getTrainerBatches();

        // 🔥 IMPORTANT FIX
        setBatches(res || []);
      } catch (err) {
        console.error("Failed to load trainer batches", err);
      }
    };

    loadBatches();
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createAssignment({
        title: formData.title,
        description: formData.description,
        batchId: Number(formData.batch),
        deadline: formData.deadline,
        maxMarks: Number(formData.maxMarks),
        duration: formData.duration,
      });

      const assignmentId = response.data.id;

      if (formData.attachments.length > 0) {
        for (let file of formData.attachments) {
          await uploadAssignmentFile(assignmentId, file);
        }
      }

      setShowSuccess(true);

      setFormData({
        title: "",
        description: "",
        batch: "",
        deadline: "",
        maxMarks: "",
        duration: "",
        attachments: [],
      });
    } catch (error) {
      console.error("Assignment creation error:", error);
      alert("Failed to create assignment.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs font-semibold tracking-wide text-purple-100 uppercase">
                  Assessments
                </p>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Create Assignment
              </h1>

              <p className="text-purple-100">
                Share tasks with deadlines and attachments
              </p>
            </div>

            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => navigate("/trainer/my-assignments")}
            >
              <List size={16} />
              My Assignments
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">
              Assignment Created Successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>

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
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">Assignment Details</h2>

            <select
              value={formData.batch}
              onChange={(e) =>
                setFormData({ ...formData, batch: e.target.value })
              }
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  Batch {b.id}
                </option>
              ))}
            </select>

            <Input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              required
            />

            <Input
              type="number"
              placeholder="Maximum Marks"
              value={formData.maxMarks}
              onChange={(e) =>
                setFormData({ ...formData, maxMarks: e.target.value })
              }
              required
            />

            <Input
              placeholder="Duration (Optional)"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg">Attachments</h2>

            <label className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer block hover:border-purple-500 transition">
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p>Select PDF, DOC, ZIP files</p>

              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.txt"
              />
            </label>

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignments;
