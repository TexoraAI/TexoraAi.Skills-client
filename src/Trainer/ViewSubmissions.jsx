import {
  downloadAssignmentFileBlob,
  evaluateSubmission,
  getSubmissionsByAssignment,
} from "@/services/assessmentService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // ✅ ADDED

import { Download } from "lucide-react";

export default function ViewSubmissions() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [marks, setMarks] = useState({}); // ✅ ADDED

  useEffect(() => {
    loadSubmissions();
  }, [id]);

  const loadSubmissions = async () => {
    try {
      const res = await getSubmissionsByAssignment(id);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // DOWNLOAD
  const handleDownload = async (downloadUrl, fileName) => {
    try {
      const response = await downloadAssignmentFileBlob(downloadUrl);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // ✅ EVALUATE
  const handleEvaluate = async (submissionId) => {
    try {
      await evaluateSubmission(submissionId, marks[submissionId]);
      alert("Marks saved");
      loadSubmissions();
    } catch (err) {
      console.error(err);
      alert("Failed to save marks");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Assignment Submissions</h1>

      {submissions.length === 0 && (
        <p className="text-muted-foreground">No submissions yet.</p>
      )}

      <div className="space-y-4">
        {submissions.map((s) => (
          <Card key={s.id} className="p-6 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{s.studentEmail}</h2>

                <p className="text-sm text-muted-foreground">
                  Submitted At: {new Date(s.submittedAt).toLocaleString()}
                </p>

                <p className="text-sm">Status: {s.status}</p>

                {s.obtainedMarks !== null && (
                  <p className="text-green-600 font-medium">
                    Marks: {s.obtainedMarks}
                  </p>
                )}
              </div>

              <Button onClick={() => handleDownload(s.downloadUrl, s.fileName)}>
                <Download size={14} className="mr-2" />
                Download
              </Button>
            </div>

            {/* ✅ MARKS SECTION */}
            {s.status !== "EVALUATED" && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter marks"
                  value={marks[s.id] || ""}
                  onChange={(e) =>
                    setMarks({ ...marks, [s.id]: e.target.value })
                  }
                />

                <Button onClick={() => handleEvaluate(s.id)}>Save Marks</Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
