
import React, { useState } from "react";
import axios from "axios";

const API_GATEWAY = "http://localhost:9000";

const ALLOWED_TYPES = {
  document: ["application/pdf"],
  video: ["video/mp4", "video/mpeg", "video/quicktime"],
  diagram: ["image/png", "image/jpeg", "image/svg+xml"],
};

const ResourceUploadAdmin = () => {
  const [type, setType] = useState("document");
  const [title, setTitle] = useState("");
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

    if (!file) {
      alert("File required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      // 🔑 ROUTING BASED ON TYPE
      if (type === "video") {
        await axios.post(`${API_GATEWAY}/api/video/upload`, formData, {
          headers: {
            "X-ROLE": "ADMIN", // ✅ THIS WAS MISSING
            Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          },
        });
      } else {
        await axios.post(`${API_GATEWAY}/api/files/upload`, formData, {
          headers: {
            "X-ROLE": "ADMIN",
            Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
          },
        });
      }

      alert("Upload successful");
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const acceptAttr =
    type === "document" ? ".pdf" : type === "video" ? "video/*" : "image/*";

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Upload{" "}
        {type === "document"
          ? "Document (PDF)"
          : type === "video"
          ? "Video"
          : "Diagram"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="flex gap-4 text-sm">
          {["document", "video", "diagram"].map((t) => (
            <label key={t} className="flex items-center gap-1">
              <input
                type="radio"
                value={t}
                checked={type === t}
                onChange={() => {
                  setType(t);
                  setFile(null);
                }}
              />
              {t}
            </label>
          ))}
        </div>

        <input type="file" accept={acceptAttr} onChange={handleFileChange} />

        <button
          disabled={uploading}
          className="bg-emerald-500 text-white px-6 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ResourceUploadAdmin;
