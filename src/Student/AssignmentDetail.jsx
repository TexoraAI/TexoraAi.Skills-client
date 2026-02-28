import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getAssignmentFiles,
  submitAssignment,
  getStudentAssignments, // ✅ ADDED
} from "@/services/assessmentService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FileText, Calendar, Award, Upload, CheckCircle } from "lucide-react";

export default function AssignmentDetail() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssignment();
    loadFiles();
  }, [id]);

  const loadAssignment = async () => {
    try {
      const assignmentRes = await getStudentAssignments(); // ✅ using new endpoint
      const found = assignmentRes.data.find((a) => a.id === Number(id));
      setAssignment(found);
    } catch (error) {
      console.error("Error loading assignment:", error);
    }
  };

  const loadFiles = async () => {
    try {
      const res = await getAssignmentFiles(id);
      setFiles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const res = await submitAssignment(id, selectedFile);
      setSubmissionStatus(res.data.status);
      alert("Assignment submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("You have already submitted this assignment.");
    } finally {
      setLoading(false);
    }
  };

  if (!assignment) {
    return <div className="p-6">Loading...</div>;
  }

  const isLate = new Date(assignment.deadline) < new Date();

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
        <p className="text-muted-foreground mt-2">{assignment.description}</p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <Calendar className="inline w-4 h-4 mr-2 text-purple-600" />
          Deadline:
          <strong className="ml-2">
            {new Date(assignment.deadline).toLocaleString()}
          </strong>
          {isLate && (
            <span className="ml-3 text-red-600 font-semibold">
              (Deadline Passed)
            </span>
          )}
        </div>

        <div>
          <Award className="inline w-4 h-4 mr-2 text-purple-600" />
          Max Marks:
          <strong className="ml-2">{assignment.maxMarks}</strong>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Assignment Files
        </h2>

        {files.map((file) => (
          <div key={file.id} className="flex justify-between items-center">
            <span>{file.fileName}</span>

            <Button
              onClick={async () => {
                try {
                  const token =
                    localStorage.getItem("lms_token") ||
                    localStorage.getItem("token") ||
                    localStorage.getItem("accessToken") ||
                    localStorage.getItem("jwt");

                  const response = await fetch(
                    `http://localhost:9000${file.downloadUrl}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = file.fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Download failed:", error);
                }
              }}
            >
              Download
            </Button>
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" />
          Submit Assignment
        </h2>

        {submissionStatus && (
          <div className="text-green-600 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Submitted ({submissionStatus})
          </div>
        )}

        <Input
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.zip,.txt"
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 text-white"
        >
          {loading ? "Submitting..." : "Submit Assignment"}
        </Button>
      </Card>
    </div>
  );
}
