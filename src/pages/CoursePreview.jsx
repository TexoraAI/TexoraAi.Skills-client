
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const API = "http://localhost:9000";

export default function CoursePreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("lms_user"));
  const role = user?.role?.toUpperCase();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);

  const [active, setActive] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
  });

  useEffect(() => {
    load();

    return () => {
      if (mediaUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
    // eslint-disable-next-line
  }, []);

  const load = async () => {
    try {
      const courseRes = await axios.get(`${API}/api/courses/${id}`, {
        headers: authHeader(),
      });
      setCourse(courseRes.data);

      const contentUrl =
        role === "TRAINER"
          ? `${API}/api/content/course/${id}`
          : `${API}/api/content/student/course/${id}`;

      const res = await axios.get(contentUrl, {
        headers: authHeader(),
      });

      // ✅ FILTER INVALID ROWS
      const valid = res.data.filter(
        (c) => c.url && c.url !== "undefined" && c.url.trim() !== ""
      );

      setContents(valid);
    } catch (err) {
      console.error("Load failed", err);
    }
  };

  // ================= VIDEO (JWT SAFE) =================
  const playVideo = async (e, c) => {
    e.preventDefault();
    e.stopPropagation();

    if (!c?.url) {
      alert("Video file missing");
      return;
    }

    try {
      // cleanup previous blob
      if (mediaUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(mediaUrl);
      }

      const res = await axios.get(`${API}/api/video/play/${c.url}`, {
        responseType: "blob",
        headers: authHeader(), // 🔐 THIS FIXES STUDENT ISSUE
      });

      const blobUrl = URL.createObjectURL(res.data);
      setMediaUrl(blobUrl);
      setMediaType("VIDEO");
      setActive(c);
    } catch (err) {
      console.error("Video failed", err);
      alert("Video cannot be loaded");
    }
  };

  // ================= PDF =================
  const viewPdf = async (e, c) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!c?.url) {
        alert("File missing");
        return;
      }

      if (mediaUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(mediaUrl);
      }

      const res = await axios.get(`${API}/api/files/view/${c.url}`, {
        responseType: "blob",
        headers: authHeader(),
      });

      const blobUrl = URL.createObjectURL(res.data);
      setMediaUrl(blobUrl);
      setMediaType("PDF");
      setActive(c);
    } catch (e) {
      console.error("PDF failed", e);
      alert("PDF cannot be opened");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#0b1120] to-[#020617] text-white">
      <button
        type="button"
        onClick={() =>
          role === "TRAINER"
            ? navigate("/trainer/TrainerCourseManagement")
            : navigate("/student/courses")
        }
        className="mb-4 text-cyan-400"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold">{course?.title}</h1>

      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* LEFT */}
        <div className="space-y-3">
          <h2 className="text-xl">Modules</h2>

          {contents.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded ${
                active?.id === c.id ? "bg-indigo-600" : "bg-slate-800"
              }`}
            >
              <p className="font-semibold">{c.title}</p>
              <p className="text-xs text-cyan-400">{c.contentType}</p>

              {role === "STUDENT" && c.contentType === "VIDEO" && (
                <button
                  type="button"
                  onClick={(e) => playVideo(e, c)}
                  className="mt-2 bg-blue-600 px-3 py-1 rounded"
                >
                  ▶ Play
                </button>
              )}

              {role === "STUDENT" && c.contentType === "PDF" && (
                <button
                  type="button"
                  onClick={(e) => viewPdf(e, c)}
                  className="mt-2 bg-green-600 px-3 py-1 rounded"
                >
                  📄 View
                </button>
              )}

              {role === "TRAINER" && (
                <p className="text-xs text-gray-400 mt-2">Preview mode</p>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="col-span-2 bg-slate-900 rounded-xl p-6">
          {!mediaUrl && (
            <p className="text-gray-400 text-center mt-20">
              Select a module to view
            </p>
          )}

          {mediaType === "VIDEO" && mediaUrl && (
            <video
              src={mediaUrl}
              controls
              autoPlay
              controlsList="nodownload"
              disablePictureInPicture
              className="w-full rounded-xl"
            />
          )}

          {mediaType === "PDF" && mediaUrl && (
            <iframe
              src={mediaUrl}
              className="w-full h-[600px] rounded-xl"
              title="PDF"
            />
          )}
        </div>
      </div>
    </div>
  );
}
