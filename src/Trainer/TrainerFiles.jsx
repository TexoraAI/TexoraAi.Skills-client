import { useEffect, useState } from "react";
import fileService from "@/services/fileService";
import { Eye, Download, Trash2, FileText, FileImage, File } from "lucide-react";

export default function TrainerFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const res = await fileService.getTrainerFiles();
      setFiles(res.data || []);
    } catch (e) {
      console.error("Failed loading trainer files", e);
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return;
    await fileService.deleteFile(id);
    loadFiles();
  };

  const getIcon = (name = "") => {
    name = name.toLowerCase();
    if (
      name.endsWith(".pdf") ||
      name.endsWith(".doc") ||
      name.endsWith(".docx") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    )
      return <FileText className="text-blue-600" />;
    if (
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg")
    )
      return <FileImage className="text-green-600" />;
    return <File />;
  };

  const previewUrl = (file) => `http://localhost:9000/api/file/view/${file.id}`;
  const downloadUrl = (file) =>
    `http://localhost:9000/api/file/download/${file.fileName}`;

  const renderPreview = () => {
    if (!selectedFile) return null;

    const name = selectedFile.fileName.toLowerCase();
    const url = previewUrl(selectedFile);

    if (name.endsWith(".pdf"))
      return (
        <iframe
          src={url}
          className="w-full h-[75vh] rounded-xl"
          title="preview"
        />
      );

    if (
      name.endsWith(".png") ||
      name.endsWith(".jpg") ||
      name.endsWith(".jpeg")
    )
      return (
        <img
          src={url}
          alt="preview"
          className="max-h-[75vh] mx-auto rounded-xl"
        />
      );

    if (
      name.endsWith(".doc") ||
      name.endsWith(".docx") ||
      name.endsWith(".ppt") ||
      name.endsWith(".pptx")
    )
      return (
        <iframe
          title="office-preview"
          className="w-full h-[75vh]"
          src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
        />
      );

    return (
      <div className="text-center text-gray-500">Preview not supported</div>
    );
  };

  if (loading)
    return (
      <div className="p-10 text-center text-lg">Loading uploaded files...</div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Uploaded Documents</h1>

      {files.length === 0 && (
        <div className="text-gray-500 text-center mt-20">
          No files uploaded yet
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {getIcon(file.fileName)}
              <div className="font-semibold break-all">{file.fileName}</div>
            </div>

            <div className="text-sm text-gray-500 line-clamp-2">
              {file.description}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedFile(file)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700"
              >
                <Eye size={18} /> Preview
              </button>

              <a
                href={downloadUrl(file)}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700"
              >
                <Download size={18} /> Download
              </a>

              <button
                onClick={() => deleteFile(file.id)}
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl p-5 relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {selectedFile.fileName}
            </h2>
            {renderPreview()}
          </div>
        </div>
      )}
    </div>
  );
}
