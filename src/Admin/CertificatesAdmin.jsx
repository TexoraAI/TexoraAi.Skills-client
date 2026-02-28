// src/Admin/CertificatesAdmin.jsx
import React, { useState } from "react";
import {
  Award,
  Plus,
  Search,
  Palette,
  FileText,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const API_GATEWAY = "http://localhost:9000";

/* ===== CERTIFICATE TEMPLATES ===== */
const templates = [
  {
    id: 1,
    name: "Completion Certificate",
    bg: "from-violet-600 to-indigo-700",
    font: "Serif",
    theme: "#7C3AED",
    linkedCourses: 4,
    type: "COMPLETION",
  },
  {
    id: 2,
    name: "Excellence Certificate",
    bg: "from-slate-800 to-slate-950",
    font: "Sans",
    theme: "#0F172A",
    linkedCourses: 2,
    type: "EXCELLENCE",
  },
  {
    id: 3,
    name: "Internship Certificate",
    bg: "from-amber-600 to-amber-800",
    font: "Serif",
    theme: "#F59E0B",
    linkedCourses: 3,
    type: "INTERNSHIP",
  },
];

const CertificatesAdmin = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [mode, setMode] = useState("GENERATE");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [certificateType, setCertificateType] = useState("COMPLETION");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!studentEmail || !courseName) {
      alert("Student email & course name required");
      return;
    }

    try {
      setLoading(true);

      if (mode === "GENERATE") {
        if (!studentName) {
          alert("Student name required");
          return;
        }

        await axios.post(
          `${API_GATEWAY}/api/files/certificates/generate`,
          null,
          {
            params: {
              email: studentEmail,
              studentName,
              courseName,
              type: certificateType,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
            },
          }
        );
      } else {
        if (!file) {
          alert("Please select certificate file");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("email", studentEmail);
        formData.append("courseName", courseName);

        await axios.post(
          `${API_GATEWAY}/api/files/certificates/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
            },
          }
        );
      }

      alert("Certificate processed successfully");
      setOpen(false);
      resetForm();
    } catch (err) {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStudentEmail("");
    setStudentName("");
    setCourseName("");
    setFile(null);
    setMode("GENERATE");
    setCertificateType("COMPLETION");
  };

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="rounded-2xl px-6 py-5 text-white shadow-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
        <h1 className="text-2xl font-semibold">Certificates</h1>
        <p className="text-sm opacity-90">
          Issue or upload certificates for students
        </p>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-8 pl-9 text-sm"
            placeholder="Search certificate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          size="sm"
          className="h-8 px-3 text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Issue Certificate
        </Button>
      </div>

      {/* TEMPLATE GRID */}
      <div className="grid gap-4 md:grid-cols-3">
        {filtered.map((tpl) => (
          <Card key={tpl.id} className="overflow-hidden">
            <div
              className={`h-24 bg-gradient-to-br ${tpl.bg} flex items-center justify-center`}
            >
              <Award className="h-8 w-8 text-white/90" />
            </div>

            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{tpl.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {tpl.font}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Palette className="h-3.5 w-3.5" />
                {tpl.theme}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                {tpl.linkedCourses} courses
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs bg-emerald-600"
                  onClick={() => {
                    setCertificateType(tpl.type);
                    setOpen(true);
                  }}
                >
                  Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-base font-semibold">Issue Certificate</h3>

            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* MODE */}
            <div className="flex gap-5 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-indigo-600"
                  checked={mode === "GENERATE"}
                  onChange={() => setMode("GENERATE")}
                />
                Generate
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="accent-emerald-600"
                  checked={mode === "UPLOAD"}
                  onChange={() => setMode("UPLOAD")}
                />
                Upload
              </label>
            </div>

            <Input
              className="h-8 text-sm"
              placeholder="Student Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
            />

            {mode === "GENERATE" && (
              <Input
                className="h-8 text-sm"
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            )}

            <Input
              className="h-8 text-sm"
              placeholder="Course Name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />

            {mode === "UPLOAD" && (
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files[0])}
                className="h-8 text-sm"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : mode === "UPLOAD"
                  ? "Upload"
                  : "Issue"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesAdmin;
