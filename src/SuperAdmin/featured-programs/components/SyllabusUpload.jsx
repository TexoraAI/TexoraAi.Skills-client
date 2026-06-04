import { useState, useRef } from "react";
import { ACCEPTED_SYLLABUS_FILES } from "../constants/featuredProgramConstants";

export default function SyllabusUpload({ syllabusFile, onFileChange }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_SYLLABUS_FILES.includes(ext)) {
      alert("Only PDF, DOC, or DOCX files are accepted.");
      return;
    }
    setUploading(true);
    setTimeout(() => {
      onFileChange({
        name: file.name,
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
        uploadDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        url: URL.createObjectURL(file),
        type: ext,
      });
      setUploading(false);
    }, 1200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const getFileIcon = (type) => {
    if (type === ".pdf") return { icon: "📄", color: "text-red-500", bg: "bg-red-50 border-red-200" };
    if (type === ".doc" || type === ".docx") return { icon: "📝", color: "text-blue-500", bg: "bg-blue-50 border-blue-200" };
    return { icon: "📎", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" };
  };

  return (
    <div>
      {!syllabusFile ? (
        <div>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragging ? "border-indigo-500 bg-indigo-50 scale-[1.01]" : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                </div>
                <p className="text-gray-600 font-medium">Uploading file...</p>
                <p className="text-sm text-gray-400">Please wait</p>
              </div>
            ) : (
              <>
                <div className={`text-5xl mb-4 transition-transform ${dragging ? "scale-125" : ""}`}>
                  {dragging ? "📂" : "☁"}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {dragging ? "Drop your file here" : "Drag & Drop your syllabus file"}
                </h3>
                <p className="text-gray-500 text-sm mb-5">or</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
                >
                  Browse File
                </button>
                <p className="text-xs text-gray-400 mt-4">Supported: PDF, DOC, DOCX • Max 20MB</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => handleFile(e.target.files[0])}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Format Info */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { format: "PDF", icon: "📄", desc: "Portable Document Format", color: "border-red-200 bg-red-50" },
              { format: "DOC", icon: "📝", desc: "Microsoft Word 97-2003", color: "border-blue-200 bg-blue-50" },
              { format: "DOCX", icon: "📋", desc: "Microsoft Word Document", color: "border-blue-200 bg-blue-50" },
            ].map(f => (
              <div key={f.format} className={`border rounded-xl p-3 text-center ${f.color}`}>
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-sm font-semibold text-gray-700">{f.format}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Uploaded File Card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-3xl flex-shrink-0 ${getFileIcon(syllabusFile.type).bg}`}>
                {getFileIcon(syllabusFile.type).icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-base truncate">{syllabusFile.name}</div>
                <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><span>📦</span> {syllabusFile.size}</span>
                  <span className="flex items-center gap-1"><span>📅</span> {syllabusFile.uploadDate}</span>
                  <span className={`font-medium uppercase text-xs px-2 py-0.5 rounded ${getFileIcon(syllabusFile.type).bg} ${getFileIcon(syllabusFile.type).color}`}>
                    {syllabusFile.type?.replace(".", "").toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {syllabusFile.url && (
                  <a href={syllabusFile.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                    👁 Preview
                  </a>
                )}
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 border border-indigo-200 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
                  🔄 Replace
                </button>
                <button onClick={() => onFileChange(null)} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">
                  🗑 Delete
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={e => handleFile(e.target.files[0])} className="hidden" />
              </div>
            </div>
            <div className="px-5 py-3 bg-emerald-50 border-t border-emerald-200 flex items-center gap-2">
              <span className="text-emerald-600 text-sm">✅</span>
              <span className="text-sm text-emerald-700 font-medium">File uploaded successfully and ready to use</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-1">💡 What happens next?</p>
            <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
              <li>Click "Generate Structure" below to auto-detect weeks & modules from this file</li>
              <li>You can preview, edit, and confirm the detected structure before saving</li>
              <li>Alternatively, switch to Manual Builder to create the syllabus from scratch</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}