// src/Admin/ResourceUploadAdmin.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  FileText,
  Video,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";

const API_GATEWAY = "http://localhost:9000";

const ALLOWED_TYPES = {
  document: ["application/pdf"],
  video: ["video/mp4", "video/mpeg", "video/quicktime"],
  diagram: ["image/png", "image/jpeg", "image/svg+xml"],
};

const ResourceUploadAdmin = () => {
  const [type, setType] = useState("document");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!ALLOWED_TYPES[type].includes(selected.type)) {
      alert(`Invalid file type for ${type}`);
      e.target.value = "";
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("File required");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const url =
        type === "video"
          ? `${API_GATEWAY}/api/video/upload`
          : `${API_GATEWAY}/api/files/upload`;

      await axios.post(url, formData, {
        headers: {
          "X-ROLE": "ADMIN",
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      });

      alert("Upload successful");
      setFile(null);
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const acceptAttr =
    type === "document" ? ".pdf" : type === "video" ? "video/*" : "image/*";

  const types = [
    { key: "document", label: "Document", icon: FileText },
    { key: "video", label: "Video", icon: Video },
    { key: "diagram", label: "Diagram", icon: ImageIcon },
  ];

  return (
    /* ✅ PERFECT CENTER WRAPPER */
    <div className="flex justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl border p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* RESOURCE TYPE */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Resource Type
            </label>

            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
              {types.map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setType(key);
                    setFile(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition
                    ${
                      type === key
                        ? "bg-white dark:bg-slate-900 shadow text-emerald-600"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Upload File
            </label>

            <label className="flex flex-col items-center justify-center gap-1.5
              border-2 border-dashed rounded-lg p-6 cursor-pointer
              bg-slate-50 dark:bg-slate-800
              hover:border-emerald-500 transition">
              <input
                type="file"
                accept={acceptAttr}
                onChange={handleFileChange}
                className="hidden"
              />

              <UploadCloud className="h-6 w-6 text-slate-400" />

              <span className="text-sm text-slate-600 dark:text-slate-300">
                {file ? file.name : "Click to upload or drag & drop"}
              </span>

              <span className="text-xs text-slate-400">
                PDF, Video or Image supported
              </span>
            </label>
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-emerald-600 text-white text-sm font-medium
                hover:bg-emerald-700 transition disabled:opacity-60"
            >
              <UploadCloud className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceUploadAdmin;
