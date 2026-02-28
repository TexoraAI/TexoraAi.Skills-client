import { useEffect, useState } from "react";
import { Calendar, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import {
  getStudentAssignments, // ✅ ADDED
  getMySubmissions,
} from "@/services/assessmentService";

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const assignmentRes = await getStudentAssignments(); // ✅ using new endpoint
      const submissionRes = await getMySubmissions();

      const submissionMap = {};
      submissionRes.data.forEach((s) => {
        submissionMap[s.assignmentId] = s;
      });

      const mergedAssignments = assignmentRes.data.map((a) => ({
        ...a,
        submission: submissionMap[a.id] || null,
      }));

      setAssignments(mergedAssignments);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground">Loading assignments...</div>
    );
  }

  if (!assignments.length) {
    return (
      <div className="p-6 text-muted-foreground">No assignments available.</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          View and submit your assignments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((a) => {
          const isLate = new Date(a.deadline) < new Date();
          const evaluated = a.submission && a.submission.obtainedMarks !== null;

          return (
            <Card key={a.id} className="hover:shadow-xl transition">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{a.title}</CardTitle>

                  {evaluated ? (
                    <Badge className="bg-green-600 text-white">
                      Marks: {a.submission.obtainedMarks}/{a.maxMarks}
                    </Badge>
                  ) : (
                    <Badge variant={isLate ? "destructive" : "outline"}>
                      {isLate ? "Deadline Passed" : "Active"}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{a.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(a.deadline).toLocaleDateString()}
                  </span>

                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {a.maxMarks} Marks
                  </span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => navigate(`/student/assignments/${a.id}`)}
                >
                  View / Submit <ArrowRight size={16} />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}