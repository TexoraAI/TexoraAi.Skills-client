import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

/**
 * Shared image upload + preview control.
 * Stores the image as a data URL (base64) via onChange(dataUrl | null),
 * matching the existing SyllabusUpload pattern used elsewhere in this module.
 */
export default function ImageUploadField({
  label,
  value,
  onChange,
  aspect = "aspect-video", // "aspect-video" | "aspect-square" | "aspect-[3/1]"
  hint,
  required,
  error,
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {value ? (
        <div className={`relative ${aspect} w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group`}>
          <img src={value} alt={label || "preview"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 bg-white/90 hover:bg-white text-red-600 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <X size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`relative ${aspect} w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all
            ${dragging ? "border-indigo-500 bg-indigo-50" : error ? "border-red-300 bg-red-50/40" : "border-gray-200 hover:border-indigo-400 hover:bg-gray-50"}`}
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin text-indigo-500" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                <ImageIcon size={16} />
              </div>
              <span className="text-xs font-medium text-gray-500">Click or drag to upload</span>
            </>
          )}
        </div>
      )}

      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => readFile(e.target.files?.[0])}
        className="hidden"
      />
    </div>
  );
}
