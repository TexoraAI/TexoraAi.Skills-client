import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";

// ICONS
import {
  FaEye,
  FaTimes,
  FaFileAlt,
  FaFile,
  FaFilePdf,
  FaFileImage,
} from "react-icons/fa";

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [preview, setPreview] = useState(null);

  // ================= FETCH FILES =================
  useEffect(() => {
    fileService
      .getStudentFiles()
      .then((res) => setDocs(res.data || []))
      .catch(console.error);
  }, []);

  // ================= PREVIEW =================
  const openPreview = async (file) => {
    try {
      const res = await fileService.downloadFileBlob(file.storedName);
      const blob = new Blob([res.data], {
        type: file.contentType || "application/pdf",
      });
      const url = URL.createObjectURL(blob);

      setPreview({
        url,
        type: blob.type,
        name: file.originalName,
      });
    } catch {
      alert("Preview failed");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  // ================= TOTAL SIZE =================
  const totalSize = docs.reduce((acc, d) => acc + (d.size || 0), 0);
  const totalSizeKB = Math.round(totalSize / 1024);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ================= LIGHT BLUE HERO ================= */}
      <header
        className="relative overflow-hidden
        bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400
        dark:from-sky-600 dark:via-blue-600 dark:to-indigo-600"
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />

        <div className="relative px-6 py-8 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <FaFileAlt />
            Documents
          </h1>

          <p className="text-sm text-white/90 mb-4">
            Access all study materials shared by your trainers
          </p>

          <div className="flex gap-3 flex-wrap">
            <Stat label="Files" value={docs.length} />
            <Stat label="Storage (KB)" value={totalSizeKB} />
          </div>
        </div>
      </header>

      {/* ================= DOCUMENT LIST ================= */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-3">
        {docs.map((d) => {
          const type = d.contentType || "";

          return (
            <div
              key={d.id}
              className="flex items-center justify-between p-4 rounded-xl
                         bg-white dark:bg-slate-900
                         border border-slate-200 dark:border-slate-800
                         hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  {type.includes("pdf") ? (
                    <FaFilePdf />
                  ) : type.startsWith("image") ? (
                    <FaFileImage />
                  ) : (
                    <FaFile />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-medium truncate text-slate-900 dark:text-slate-100">
                    {d.originalName}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-2">
                    <span>{type.split("/")[1]?.toUpperCase() || "FILE"}</span>
                    <span>{Math.round(d.size / 1024)} KB</span>
                  </div>
                </div>
              </div>

              {/* PREVIEW */}
              <button
                onClick={() => openPreview(d)}
                className="px-3 py-1.5 text-xs rounded-lg
                           bg-blue-600 hover:bg-blue-700
                           text-white flex items-center gap-2 transition"
              >
                <FaEye size={12} />
                Preview
              </button>
            </div>
          );
        })}

        {docs.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400">
            No documents available
          </p>
        )}
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-900 w-full h-full md:h-[90%] md:w-[90%] rounded-none md:rounded-xl overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-sm truncate text-slate-900 dark:text-slate-100">
                {preview.name}
              </p>
              <button
                onClick={closePreview}
                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FaTimes />
              </button>
            </div>

            {/* CONTENT */}
            <div className="h-full bg-slate-100 dark:bg-slate-950">
              {preview.type.includes("pdf") && (
                <iframe
                  src={preview.url}
                  title="PDF Preview"
                  className="w-full h-full"
                />
              )}

              {preview.type.startsWith("image") && (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="max-w-full max-h-full"
                  />
                </div>
              )}

              {!preview.type.includes("pdf") &&
                !preview.type.startsWith("image") && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                    <FaFileAlt size={48} />
                    <p className="mt-2 text-sm">Preview not available</p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ================= STAT =================
const Stat = ({ label, value }) => (
  <div className="px-4 py-2 rounded-lg bg-white/30 backdrop-blur-sm text-white shadow">
    <p className="text-lg font-bold leading-none">{value}</p>
    <p className="text-[11px] text-white/80">{label}</p>
  </div>
);

export default Documents;
