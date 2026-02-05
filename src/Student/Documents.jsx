
import React, { useEffect, useState } from "react";
import fileService from "../services/fileService";
import { Eye, Download, X, FileText, Folder, HardDrive, File } from "lucide-react";

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [preview, setPreview] = useState(null);

  // ================= FETCH FILES =================
  useEffect(() => {
    fileService
      .getFiles(0, 50)
      .then((res) => setDocs(res.data.content))
      .catch(console.error);
  }, []);

  // ================= PREVIEW =================
  const openPreview = async (file) => {
    try {
      const res = await fileService.downloadFileBlob(file.storedName);
      const blob = new Blob([res.data], { type: file.contentType });
      const url = URL.createObjectURL(blob);

      setPreview({
        url,
        type: file.contentType,
        name: file.originalName,
      });
    } catch (err) {
      console.error("Preview failed", err);
      alert("Preview failed");
    }
  };

  const closePreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  // ================= DOWNLOAD =================
  const downloadFile = async (file) => {
    try {
      const res = await fileService.downloadFileBlob(file.storedName);
      const blob = new Blob([res.data], { type: file.contentType });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed");
    }
  };

  // Calculate total size
  const totalSize = docs.reduce((acc, d) => acc + (d.size || 0), 0);
  const totalSizeKB = Math.round(totalSize / 1024);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* ================= MODERN HERO BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Text content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Folder className="h-4 w-4 text-emerald-300" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Document Library
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                Documents
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Access all study materials, notes, and guides shared by your trainers
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 justify-center md:justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <FileText className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{docs.length}</p>
                    <p className="text-xs text-white/70">Total Files</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <HardDrive className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">{totalSizeKB}</p>
                    <p className="text-xs text-white/70">KB Storage</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Download className="h-6 w-6 text-white/80" />
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">∞</p>
                    <p className="text-xs text-white/70">Downloads</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="relative">
                    {/* Stacked files effect */}
                    <div className="absolute top-2 left-2 w-32 h-40 rounded-lg bg-white/5 transform rotate-6" />
                    <div className="absolute top-1 left-1 w-32 h-40 rounded-lg bg-white/10 transform rotate-3" />
                    <div className="relative w-32 h-40 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FileText className="h-16 w-16 text-white/80" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-cyan-400/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                  <Folder className="h-10 w-10 text-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DOCUMENT LIST ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {docs.map((d) => (
            <div
              key={d.id}
              className="
                group
                flex items-center justify-between
                p-6 rounded-2xl
                bg-white dark:bg-slate-900
                border-2 border-slate-200 dark:border-slate-700
                shadow-sm hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-1
                hover:border-emerald-300 dark:hover:border-emerald-700
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 group-hover:from-emerald-200 dark:group-hover:from-emerald-800/50 group-hover:to-teal-200 dark:group-hover:to-teal-800/50 transition-all">
                  <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {d.originalName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <File className="h-3 w-3" />
                      {d.contentType?.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {Math.round(d.size / 1024)} KB
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 ml-4">
                <button
                  onClick={() => openPreview(d)}
                  className="
                    inline-flex items-center gap-2
                    text-xs font-semibold
                    px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-emerald-600 to-teal-600
                    hover:from-emerald-700 hover:to-teal-700
                    text-white
                    shadow-lg shadow-emerald-500/30
                    hover:shadow-xl hover:shadow-emerald-500/40
                    transition-all duration-300
                  "
                >
                  <Eye size={16} /> Preview
                </button>

                <button
                  onClick={() => downloadFile(d)}
                  className="
                    inline-flex items-center gap-2
                    text-xs font-semibold
                    px-5 py-2.5 rounded-xl
                    bg-slate-100 dark:bg-slate-800
                    hover:bg-slate-200 dark:hover:bg-slate-700
                    text-slate-700 dark:text-slate-300
                    border-2 border-slate-200 dark:border-slate-700
                    hover:border-emerald-300 dark:hover:border-emerald-700
                    transition-all duration-300
                  "
                >
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}

          {docs.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 mb-4">
                <FileText className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                No Documents Yet
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Documents shared by your trainers will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= PREVIEW MODAL ================= */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-11/12 max-w-6xl h-5/6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 p-6 flex flex-col">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {preview.name}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all ml-4"
              >
                <X size={20} />
              </button>
            </div>

            {/* PREVIEW CONTENT */}
            <div className="flex-1 overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
              {preview.type.includes("pdf") && (
                <iframe
                  src={preview.url}
                  title="PDF Preview"
                  className="w-full h-full"
                />
              )}

              {preview.type.startsWith("image") && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}

              {!preview.type.includes("pdf") &&
                !preview.type.startsWith("image") && (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Preview Not Available
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This file type cannot be previewed in the browser
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;