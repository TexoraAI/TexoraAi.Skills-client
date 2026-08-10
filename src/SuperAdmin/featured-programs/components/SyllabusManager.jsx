import { useState, useRef, useEffect } from "react";
import SyllabusZipUpload from "./SyllabusZipUpload";
import ToggleSwitch from "./ToggleSwitch";
import { courseService } from "../../../services/courseService";
import videoService from "../../../services/videoService";
import fileService from "../../../services/fileService";
const DISPLAY_FLAGS = [
  { key: "showOnHomepage", label: "Show on Homepage", icon: "🏠" },
  { key: "isFeatured", label: "Featured Course", icon: "⭐" },
  { key: "isTrending", label: "Trending", icon: "📈" },
  { key: "isBestseller", label: "Bestseller", icon: "🏆" },
  { key: "isPopular", label: "Popular", icon: "🔥" },
  { key: "isRecommended", label: "Recommended", icon: "👍" },
  { key: "isComingSoon", label: "Coming Soon", icon: "🚀" },
];
const SESSION_TYPES = ["Video", "Live", "Assignment", "Quiz", "Reading"];

// Turns a raw seconds count from videoDurationSeconds into a friendly
// "m:ss" label (e.g. 294 -> "4:54"), matching how the player displays it.
// Falls back to nothing if the value isn't a usable number yet (video
// still processing, or type doesn't carry a real duration).
function formatDurationLabel(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// Monotonically-increasing counter for generating unique client-side ids
// for weeks/modules/sessions that only exist locally (not yet saved to
// the backend). `Date.now()` alone returns the SAME value for every item
// created within the same millisecond — which is exactly what happens
// when the PDF-extract "Apply to Syllabus" flow (see handleGenerate
// below) builds many weeks/modules/sessions in a single synchronous
// loop. The counter guarantees uniqueness no matter how fast items are
// created; the Date.now() prefix just keeps ids roughly sortable/
// debuggable. Module-scoped so it's shared across every generation pass
// and every component in this file (ManualSyllabusBuilder, SyllabusUpload).
let clientIdCounter = 0;
const makeClientId = (prefix) =>
  `${prefix}-${Date.now()}-${(clientIdCounter += 1)}`;

const ManualSyllabusBuilder = ({ weeks, onChange }) => {
  const addWeek = () => {
    onChange([
      ...weeks,
      {
        id: makeClientId("week"),
        title: `Week ${weeks.length + 1}`,
        modules: [],
      },
    ]);
  };

  const updateWeek = (weekId, field, val) => {
    onChange(weeks.map((w) => (w.id === weekId ? { ...w, [field]: val } : w)));
  };

  const deleteWeek = (weekId) => {
    onChange(weeks.filter((w) => w.id !== weekId));
  };

  const addModule = (weekId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: [
                ...w.modules,
                {
                  id: makeClientId("module"),
                  title: `Module ${w.modules.length + 1}`,
                  sessions: [],
                  isPersisted: false,
                },
              ],
            }
          : w,
      ),
    );
  };

  const updateModule = (weekId, modId, field, val) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId ? { ...m, [field]: val } : m,
              ),
            }
          : w,
      ),
    );
  };

  const deleteModule = (weekId, modId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? { ...w, modules: w.modules.filter((m) => m.id !== modId) }
          : w,
      ),
    );
  };

  const addSession = (weekId, modId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: [
                        ...m.sessions,
                        {
                          id: makeClientId("session"),
                          title: `Session ${m.sessions.length + 1}`,
                          type: "Video",
                          duration: "",
                          isPersisted: false,
                          videoStatus: "NONE",
                        },
                      ],
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const updateSession = (weekId, modId, sessId, field, val) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.map((s) =>
                        s.id === sessId ? { ...s, [field]: val } : s,
                      ),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const deleteSession = (weekId, modId, sessId) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.filter((s) => s.id !== sessId),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };
  const fileInputRefs = useRef({});
  const [videoState, setVideoState] = useState({}); // sessionId -> {uploading, progress, polling, timedOut}
  // sessionId -> { open, title, description, thumbnailFile, thumbnailPreview, pendingFile }
  const [videoMetaForm, setVideoMetaForm] = useState({});
  const fileInputRefsFile = useRef({});
  const [fileState, setFileState] = useState({});

  const openVideoMetaForm = (sessId, file, existing = {}) => {
    setVideoMetaForm((prev) => ({
      ...prev,
      [sessId]: {
        open: true,
        title: existing.title || "",
        description: existing.description || "",
        thumbnailFile: null,
        thumbnailPreview: existing.videoThumbnailUrl || null,
        pendingFile: file || null, // null when editing an existing video, not replacing it
      },
    }));
  };

  const closeVideoMetaForm = (sessId) => {
    setVideoMetaForm((prev) => {
      const next = { ...prev };
      delete next[sessId];
      return next;
    });
  };

  const updateVideoMetaField = (sessId, field, val) => {
    setVideoMetaForm((prev) => ({
      ...prev,
      [sessId]: { ...prev[sessId], [field]: val },
    }));
  };

  const handleThumbnailPick = (sessId, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setVideoMetaForm((prev) => ({
      ...prev,
      [sessId]: {
        ...prev[sessId],
        thumbnailFile: file,
        thumbnailPreview: preview,
      },
    }));
  };

  const setSessionVideoField = (weekId, modId, sessId, patch) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.map((s) =>
                        s.id === sessId ? { ...s, ...patch } : s,
                      ),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };
  const setSessionFileField = (weekId, modId, sessId, patch) => {
    onChange(
      weeks.map((w) =>
        w.id === weekId
          ? {
              ...w,
              modules: w.modules.map((m) =>
                m.id === modId
                  ? {
                      ...m,
                      sessions: m.sessions.map((s) =>
                        s.id === sessId ? { ...s, ...patch } : s,
                      ),
                    }
                  : m,
              ),
            }
          : w,
      ),
    );
  };

  const pollVideoStatus = (weekId, modId, sess) => {
    let attempts = 0;
    const sessId = sess.id;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const { data } = await courseService.getSessionVideoStatus(sessId);
        if (data?.videoStatus === "READY" || data?.videoStatus === "FAILED") {
          clearInterval(interval);
          setSessionVideoField(weekId, modId, sessId, {
            videoStatus: data.videoStatus,
            videoUrl: data.videoUrl || sess.videoUrl,
            videoDurationSeconds:
              data.videoDurationSeconds ?? sess.videoDurationSeconds,
            videoThumbnailUrl: data.videoThumbnailUrl || sess.videoThumbnailUrl,
          });
          setVideoState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], uploading: false, polling: false },
          }));
        } else if (attempts >= 20) {
          clearInterval(interval);
          setVideoState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], polling: false, timedOut: true },
          }));
        }
      } catch {
        if (attempts >= 20) {
          clearInterval(interval);
          setVideoState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], polling: false, timedOut: true },
          }));
        }
      }
    }, 3000);
  };

  const pollFileStatus = (weekId, modId, sess) => {
    let attempts = 0;
    const sessId = sess.id;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const { data } = await courseService.getSessionFileStatus(sessId);
        if (data?.fileStatus === "READY" || data?.fileStatus === "FAILED") {
          clearInterval(interval);
          setSessionFileField(weekId, modId, sessId, {
            fileStatus: data.fileStatus,
            fileUrl: data.fileUrl || sess.fileUrl,
            fileName: data.fileName || sess.fileName,
          });
          setFileState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], uploading: false, polling: false },
          }));
        } else if (attempts >= 20) {
          clearInterval(interval);
          setFileState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], polling: false, timedOut: true },
          }));
        }
      } catch {
        if (attempts >= 20) {
          clearInterval(interval);
          setFileState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], polling: false, timedOut: true },
          }));
        }
      }
    }, 3000);
  };

  // File picked → just open the metadata form. The actual upload now
  // happens from handleConfirmUpload once title/description/thumbnail
  // (all optional) are filled in and the admin clicks "Upload".
  const handleVideoFileSelect = (weekId, modId, sess, file) => {
    if (!file) return;
    openVideoMetaForm(sess.id, file, sess);
  };

  const handleConfirmUpload = async (weekId, modId, sess) => {
    const form = videoMetaForm[sess.id];
    if (!form?.pendingFile) return;
    const sessId = sess.id;
    setVideoState((prev) => ({
      ...prev,
      [sessId]: {
        uploading: true,
        progress: 0,
        polling: false,
        timedOut: false,
      },
    }));
    setSessionVideoField(weekId, modId, sessId, { videoStatus: "PROCESSING" });
    closeVideoMetaForm(sessId);
    try {
      courseService.startSessionVideoUpload(sessId).catch(() => {});
      const { data } = await videoService.uploadFeaturedSessionVideo(
        sessId,
        form.pendingFile,
        {
          title: form.title,
          description: form.description,
          thumbnail: form.thumbnailFile,
        },
        (pct) => {
          setVideoState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], progress: pct },
          }));
        },
      );
      setSessionVideoField(weekId, modId, sessId, {
        videoId: data.id, // the FeaturedSessionVideo row id — needed for edit/delete
        title: data.title,
        description: data.description,
        videoThumbnailUrl: data.thumbnailUrl,
      });
      setVideoState((prev) => ({
        ...prev,
        [sessId]: { ...prev[sessId], uploading: false, polling: true },
      }));
      pollVideoStatus(weekId, modId, { ...sess, videoStatus: "PROCESSING" });
    } catch {
      setVideoState((prev) => ({
        ...prev,
        [sessId]: { ...prev[sessId], uploading: false, polling: false },
      }));
      setSessionVideoField(weekId, modId, sessId, { videoStatus: "FAILED" });
    }
  };

  const handleConfirmEdit = async (weekId, modId, sess) => {
    const form = videoMetaForm[sess.id];
    if (!form) return;
    if (!sess.videoId) {
      alert("No video exists for this session yet — upload one first.");
      closeVideoMetaForm(sess.id);
      return;
    }
    try {
      const { data } = await videoService.updateFeaturedSessionVideo(
        sess.videoId,
        {
          title: form.title,
          description: form.description,
          thumbnail: form.thumbnailFile || undefined,
        },
      );
      setSessionVideoField(weekId, modId, sess.id, {
        title: data.title,
        description: data.description,
        videoThumbnailUrl: data.thumbnailUrl,
      });
      closeVideoMetaForm(sess.id);
    } catch (err) {
      alert(
        "Failed to save changes: " +
          (err?.response?.data?.message || err.message),
      );
    }
  };

  const handleDeleteVideo = async (weekId, modId, sess) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await courseService.deleteSessionVideo(sess.id);
      setSessionVideoField(weekId, modId, sess.id, {
        videoStatus: "NONE",
        videoUrl: "",
        videoId: null,
        title: "",
        description: "",
        videoDurationSeconds: null,
        videoThumbnailUrl: "",
      });
      closeVideoMetaForm(sess.id); // clear any stale edit/upload form for this session
    } catch (err) {
      alert(
        "Failed to delete video: " +
          (err?.response?.data?.message || err.message),
      );
    }
  };

  const handleFileFileSelect = async (weekId, modId, sess, file) => {
    if (!file) return;
    const sessId = sess.id;
    setFileState((prev) => ({
      ...prev,
      [sessId]: {
        uploading: true,
        progress: 0,
        polling: false,
        timedOut: false,
      },
    }));
    setSessionFileField(weekId, modId, sessId, { fileStatus: "PROCESSING" });
    try {
      courseService.startSessionFileUpload(sessId).catch(() => {});
      const { data } = await fileService.uploadFeaturedSessionFile(
        sessId,
        file,
        (pct) => {
          setFileState((prev) => ({
            ...prev,
            [sessId]: { ...prev[sessId], progress: pct },
          }));
        },
      );
      setSessionFileField(weekId, modId, sessId, {
        fileId: data.id,
        fileName: data.fileName,
        fileUrl: data.url,
      });
      setFileState((prev) => ({
        ...prev,
        [sessId]: { ...prev[sessId], uploading: false, polling: true },
      }));
      pollFileStatus(weekId, modId, { ...sess, fileStatus: "PROCESSING" });
    } catch {
      setFileState((prev) => ({
        ...prev,
        [sessId]: { ...prev[sessId], uploading: false, polling: false },
      }));
      setSessionFileField(weekId, modId, sessId, { fileStatus: "FAILED" });
    }
  };

  const handleDeleteFile = async (weekId, modId, sess) => {
    if (!window.confirm("Delete this file?")) return;
    try {
      await courseService.deleteSessionFile(sess.id);
      setSessionFileField(weekId, modId, sess.id, {
        fileStatus: "NONE",
        fileUrl: "",
        fileId: null,
        fileName: "",
      });
    } catch (err) {
      alert(
        "Failed to delete file: " +
          (err?.response?.data?.message || err.message),
      );
    }
  };

  // resume polling for sessions still PROCESSING when the page (re)opens
  useEffect(() => {
    weeks.forEach((w) =>
      (w.modules || []).forEach((m) =>
        (m.sessions || []).forEach((s) => {
          if (
            s.type === "Video" &&
            s.videoStatus === "PROCESSING" &&
            s.isPersisted
          ) {
            setVideoState((prev) => ({
              ...prev,
              [s.id]: { ...prev[s.id], polling: true },
            }));
            pollVideoStatus(w.id, m.id, s);
          }
          if (
            s.type === "Reading" &&
            s.fileStatus === "PROCESSING" &&
            s.isPersisted
          ) {
            setFileState((prev) => ({
              ...prev,
              [s.id]: { ...prev[s.id], polling: true },
            }));
            pollFileStatus(w.id, m.id, s);
          }
        }),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderVideoRow = (week, mod, sess) => {
    const vs = videoState[sess.id] || {};
    const fileInput = (
      <input
        type="file"
        accept="video/*"
        ref={(el) => (fileInputRefs.current[sess.id] = el)}
        onChange={(e) => {
          const file = e.target.files[0];
          e.target.value = "";
          handleVideoFileSelect(week.id, mod.id, sess, file);
        }}
        className="hidden"
      />
    );

    if (!sess.isPersisted) {
      return (
        <p className="text-xs text-gray-400 italic pl-1">
          Save syllabus first to enable video upload
        </p>
      );
    }
    if (vs.uploading) {
      return (
        <div className="flex items-center gap-2 text-xs text-indigo-600 pl-1">
          {fileInput}
          <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
          Uploading… {vs.progress ?? 0}%
        </div>
      );
    }
    if (vs.polling || sess.videoStatus === "PROCESSING") {
      return (
        <div className="flex items-center gap-2 text-xs text-amber-600 pl-1">
          {fileInput}
          <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
          {vs.timedOut ? "Still processing, refresh later" : "Processing…"}
        </div>
      );
    }
    if (sess.videoStatus === "READY") {
      const durationLabel = formatDurationLabel(sess.videoDurationSeconds);
      return (
        <div className="flex items-center gap-2.5 pl-1">
          {/* Real, backend-generated thumbnail preview — this is the
              piece that was missing: the field (videoThumbnailUrl) was
              already coming back from the API, it just was never
              rendered anywhere in this form. */}
          {sess.videoThumbnailUrl ? (
            <img
              src={sess.videoThumbnailUrl}
              alt=""
              className="w-14 h-9 rounded-md object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-9 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
              <i
                className="ti ti-photo text-gray-300 text-sm"
                aria-hidden="true"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-emerald-600 flex-wrap">
            {fileInput}
            <span className="inline-flex items-center gap-1">
              <i className="ti ti-circle-check" aria-hidden="true" />
              Ready
            </span>
            {durationLabel && (
              <span className="text-gray-500">{durationLabel}</span>
            )}
            <button
              onClick={() => fileInputRefs.current[sess.id]?.click()}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Replace Video
            </button>
            <button
              onClick={() => openVideoMetaForm(sess.id, null, sess)}
              className="text-indigo-600 hover:text-indigo-800 underline"
            >
              Edit Details
            </button>
            <button
              onClick={() => handleDeleteVideo(week.id, mod.id, sess)}
              className="text-red-600 hover:text-red-800 underline font-medium"
            >
              Delete Video
            </button>
          </div>
        </div>
      );
    }
    if (sess.videoStatus === "FAILED") {
      return (
        <div className="flex items-center gap-2 text-xs pl-1">
          {fileInput}
          <button
            onClick={() => fileInputRefs.current[sess.id]?.click()}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Upload failed, retry
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs pl-1">
        {fileInput}
        <button
          onClick={() => fileInputRefs.current[sess.id]?.click()}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Upload Video
        </button>
      </div>
    );
  };
  const renderFileRow = (week, mod, sess) => {
    const fs = fileState[sess.id] || {};
    const fileInputEl = (
      <input
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx"
        ref={(el) => (fileInputRefsFile.current[sess.id] = el)}
        onChange={(e) => {
          const file = e.target.files[0];
          e.target.value = "";
          handleFileFileSelect(week.id, mod.id, sess, file);
        }}
        className="hidden"
      />
    );

    if (!sess.isPersisted) {
      return (
        <p className="text-xs text-gray-400 italic pl-1">
          Save syllabus first to enable file upload
        </p>
      );
    }
    if (fs.uploading) {
      return (
        <div className="flex items-center gap-2 text-xs text-indigo-600 pl-1">
          {fileInputEl}
          <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
          Uploading… {fs.progress ?? 0}%
        </div>
      );
    }
    if (fs.polling || sess.fileStatus === "PROCESSING") {
      return (
        <div className="flex items-center gap-2 text-xs text-amber-600 pl-1">
          {fileInputEl}
          <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
          {fs.timedOut ? "Still processing, refresh later" : "Processing…"}
        </div>
      );
    }
    if (sess.fileStatus === "READY") {
      const ext = (sess.fileName || "").split(".").pop()?.toLowerCase();
      const iconClass =
        ext === "pdf"
          ? "ti-file-type-pdf"
          : ext === "doc" || ext === "docx"
            ? "ti-file-type-doc"
            : ext === "ppt" || ext === "pptx"
              ? "ti-presentation"
              : "ti-file";
      return (
        <div className="flex items-center gap-2 text-xs text-emerald-600 pl-1 flex-wrap">
          {fileInputEl}
          <i className={`ti ${iconClass} text-sm`} aria-hidden="true" />
          <span className="text-gray-700">{sess.fileName}</span>
          <span className="inline-flex items-center gap-1">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Ready
          </span>
          <button
            onClick={() => fileInputRefsFile.current[sess.id]?.click()}
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Replace File
          </button>
          <button
            onClick={() => handleDeleteFile(week.id, mod.id, sess)}
            className="text-red-600 hover:text-red-800 underline font-medium"
          >
            Delete File
          </button>
        </div>
      );
    }
    if (sess.fileStatus === "FAILED") {
      return (
        <div className="flex items-center gap-2 text-xs pl-1">
          {fileInputEl}
          <button
            onClick={() => fileInputRefsFile.current[sess.id]?.click()}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Upload failed, retry
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs pl-1">
        {fileInputEl}
        <button
          onClick={() => fileInputRefsFile.current[sess.id]?.click()}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Upload File
        </button>
      </div>
    );
  };
  const typeColors = {
    Video: "bg-blue-100 text-blue-700",
    Live: "bg-emerald-100 text-emerald-700",
    Assignment: "bg-orange-100 text-orange-700",
    Quiz: "bg-purple-100 text-purple-700",
    Reading: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-3">
      {weeks.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <i
            className="ti ti-calendar-event text-3xl text-gray-300 block mb-2"
            aria-hidden="true"
          />
          <h4 className="font-semibold text-gray-700 mb-1 text-sm">
            No weeks yet
          </h4>
          <p className="text-xs text-gray-400 mb-3">
            Start building your syllabus week by week
          </p>
          <button
            onClick={addWeek}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            Add First Week
          </button>
        </div>
      )}

      {weeks.map((week, wIdx) => (
        <div
          key={week.id}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Week Header */}
          <div className="bg-indigo-50 border-b border-indigo-100 px-3 py-2.5 flex items-center gap-2.5">
            <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
              {wIdx + 1}
            </span>
            <input
              type="text"
              value={week.title}
              onChange={(e) => updateWeek(week.id, "title", e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-indigo-800 border-none outline-none placeholder-indigo-300"
              placeholder="Week title..."
            />
            <button
              onClick={() => addModule(week.id)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-white border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <i className="ti ti-plus text-xs" aria-hidden="true" /> Module
            </button>
            <button
              onClick={() => deleteWeek(week.id)}
              className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
              aria-label="Delete week"
            >
              <i className="ti ti-trash text-sm" aria-hidden="true" />
            </button>
          </div>

          {/* Modules */}
          <div className="p-3 space-y-2.5">
            {week.modules.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-2">
                No modules. Click "+ Module" to add one.
              </p>
            )}
            {week.modules.map((mod, mIdx) => (
              <div
                key={mod.id}
                className="border border-gray-100 rounded-lg bg-gray-50 overflow-hidden"
              >
                {/* Module Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="w-4 h-4 bg-gray-400 text-white rounded flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {mIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={mod.title}
                    onChange={(e) =>
                      updateModule(week.id, mod.id, "title", e.target.value)
                    }
                    className="flex-1 bg-transparent text-xs font-semibold text-gray-700 border-none outline-none"
                    placeholder="Module title..."
                  />
                  <button
                    onClick={() => addSession(week.id, mod.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium px-1.5 py-0.5 bg-white border border-gray-200 rounded transition-colors flex items-center gap-1"
                  >
                    <i
                      className="ti ti-plus"
                      style={{ fontSize: 10 }}
                      aria-hidden="true"
                    />{" "}
                    Session
                  </button>
                  <button
                    onClick={() => deleteModule(week.id, mod.id)}
                    className="text-red-300 hover:text-red-500"
                    aria-label="Delete module"
                  >
                    <i className="ti ti-x text-xs" aria-hidden="true" />
                  </button>
                </div>

                {/* Sessions */}
                <div className="px-3 py-2 space-y-1.5">
                  {mod.sessions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-1">
                      No sessions. Click "+ Session".
                    </p>
                  )}
                  {mod.sessions.map((sess, sIdx) => (
                    // <div
                    //   key={sess.id}
                    //   className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-2 py-1.5"
                    // >
                    <div key={sess.id} className="space-y-1">
                      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-2 py-1.5">
                        <span className="text-xs text-gray-400 w-4 text-center">
                          {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={sess.title}
                          onChange={(e) =>
                            updateSession(
                              week.id,
                              mod.id,
                              sess.id,
                              "title",
                              e.target.value,
                            )
                          }
                          className="flex-1 text-xs text-gray-700 border-none outline-none bg-transparent"
                          placeholder="Session title..."
                        />
                        <select
                          value={sess.type}
                          onChange={(e) =>
                            updateSession(
                              week.id,
                              mod.id,
                              sess.id,
                              "type",
                              e.target.value,
                            )
                          }
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium border-none outline-none ${typeColors[sess.type] || "bg-gray-100 text-gray-600"}`}
                        >
                          {SESSION_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={sess.duration}
                          onChange={(e) =>
                            updateSession(
                              week.id,
                              mod.id,
                              sess.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="w-14 text-xs text-gray-500 border border-gray-100 rounded px-1.5 py-0.5 outline-none text-center"
                          placeholder="20 min"
                          title={
                            sess.type === "Video"
                              ? "Only used as a fallback label until the uploaded video finishes processing — the real duration below always wins once it's Ready."
                              : undefined
                          }
                        />
                        <button
                          onClick={() =>
                            deleteSession(week.id, mod.id, sess.id)
                          }
                          className="text-red-200 hover:text-red-400"
                          aria-label="Delete session"
                        >
                          <i className="ti ti-x text-xs" aria-hidden="true" />
                        </button>
                      </div>

                      {sess.type === "Video" && (
                        <div className="pl-6 space-y-2">
                          {renderVideoRow(week, mod, sess)}
                          {videoMetaForm[sess.id]?.open && (
                            <div className="border border-indigo-100 rounded-lg bg-indigo-50/50 p-3 space-y-2">
                              <input
                                type="text"
                                value={videoMetaForm[sess.id].title}
                                onChange={(e) =>
                                  updateVideoMetaField(
                                    sess.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                placeholder="Video title (optional)"
                                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none"
                              />
                              <textarea
                                value={videoMetaForm[sess.id].description}
                                onChange={(e) =>
                                  updateVideoMetaField(
                                    sess.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Description (optional)"
                                rows={2}
                                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none resize-none"
                              />
                              <div className="flex items-center gap-3">
                                {videoMetaForm[sess.id].thumbnailPreview && (
                                  <img
                                    src={
                                      videoMetaForm[sess.id].thumbnailPreview
                                    }
                                    alt=""
                                    className="w-16 h-10 rounded-md object-cover border border-gray-200"
                                  />
                                )}
                                <label className="text-xs text-indigo-600 hover:text-indigo-800 underline cursor-pointer">
                                  {videoMetaForm[sess.id].thumbnailPreview
                                    ? "Change thumbnail"
                                    : "Add thumbnail"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleThumbnailPick(
                                        sess.id,
                                        e.target.files[0],
                                      )
                                    }
                                  />
                                </label>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() =>
                                    videoMetaForm[sess.id].pendingFile
                                      ? handleConfirmUpload(
                                          week.id,
                                          mod.id,
                                          sess,
                                        )
                                      : handleConfirmEdit(week.id, mod.id, sess)
                                  }
                                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg"
                                >
                                  {videoMetaForm[sess.id].pendingFile
                                    ? "Upload Video"
                                    : "Save Changes"}
                                </button>
                                <button
                                  onClick={() => closeVideoMetaForm(sess.id)}
                                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {/* ── NEW: sibling condition, not nested inside Video's ── */}
                      {sess.type === "Reading" && (
                        <div className="pl-6 space-y-2">
                          {renderFileRow(week, mod, sess)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {weeks.length > 0 && (
        <button
          onClick={addWeek}
          className="w-full py-2 border-2 border-dashed border-indigo-200 rounded-xl text-xs font-semibold text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1"
        >
          <i className="ti ti-plus text-xs" aria-hidden="true" /> Add Week
        </button>
      )}
    </div>
  );
};

const SyllabusUpload = ({ uploadedFile, onUpload, onGenerate }) => {
  const fileInputRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      alert("Only PDF, DOC, DOCX files are supported.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      alert("File must be under 20 MB.");
      return;
    }
    setError("");
    onUpload({
      name: file.name,
      size: file.size,
      sizeLabel: `${(file.size / 1024).toFixed(0)} KB`,
      type: ext.toUpperCase(),
      rawFile: file,
    });
  };

  const handleGenerate = async () => {
    if (!uploadedFile?.rawFile) return;
    setGenerating(true);
    setError("");
    try {
      const { data } = await courseService.extractSyllabusFromFile(
        uploadedFile.rawFile,
      );
      // Every week/module/session created here comes from a single
      // synchronous loop, so plain Date.now() (or Date.now() + a small
      // integer offset) reliably collides across items — the arithmetic
      // offset trick doesn't fully prevent it either, since it's easy for
      // a session's offset to land on the exact value another module or
      // session ends up with. makeClientId() guarantees a unique value
      // per call regardless of timing. These are freshly generated,
      // never-saved rows, so isPersisted is explicitly false — only
      // loadFromDTO (hydrating from a real backend response) may set it
      // to true.
      const weeks = (data || []).map((w, wIdx) => ({
        id: makeClientId("week"),
        title: w.title || `Week ${wIdx + 1}`,
        modules: (w.modules || []).map((m, mIdx) => ({
          id: makeClientId("module"),
          title: m.title || `Module ${mIdx + 1}`,
          isPersisted: false,
          sessions: (m.sessions || []).map((s, sIdx) => ({
            id: makeClientId("session"),
            title: s.title || `Session ${sIdx + 1}`,
            type: s.type || "Reading",
            duration: s.duration || "",
            isPersisted: false,
            videoStatus: "NONE",
          })),
        })),
      }));
      onGenerate({ weeks });
    } catch (err) {
      console.error("Syllabus extraction failed", err);
      setError(
        "Could not extract a syllabus from this file. Try a more clearly structured PDF/DOCX, or use Manual Builder.",
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${uploadedFile ? "border-emerald-300 bg-emerald-50" : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFile}
          className="hidden"
        />
        {uploadedFile ? (
          <div>
            <i
              className="ti ti-circle-check text-3xl text-emerald-500 block mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-emerald-700">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-emerald-500 mt-1">
              {uploadedFile.sizeLabel} • {uploadedFile.type}
            </p>
            <p className="text-xs text-gray-400 mt-2">Click to replace file</p>
          </div>
        ) : (
          <div>
            <i
              className="ti ti-file-upload text-3xl text-gray-300 block mb-2"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-gray-700">
              Drop or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, DOC, DOCX • Max 20 MB
            </p>
          </div>
        )}
      </div>

      {uploadedFile && (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          {generating ? (
            <>
              <i
                className="ti ti-refresh animate-spin text-sm"
                aria-hidden="true"
              />{" "}
              Generating Syllabus…
            </>
          ) : (
            <>
              <i className="ti ti-sparkles text-sm" aria-hidden="true" />{" "}
              Auto-Generate from File
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
};

// ─── Syllabus Preview ─────────────────────────────────────────────────────────
const SyllabusPreview = ({ generatedData }) => {
  const [expanded, setExpanded] = useState(new Set([0]));

  const toggle = (idx) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const typeColors = {
    Video: "bg-blue-100 text-blue-700",
    Live: "bg-emerald-100 text-emerald-700",
    Assignment: "bg-orange-100 text-orange-700",
    Quiz: "bg-purple-100 text-purple-700",
    Reading: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-2">
      {(generatedData.weeks || []).map((week, wIdx) => (
        <div
          key={week.id || wIdx}
          className="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggle(wIdx)}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {wIdx + 1}
            </span>
            <span className="flex-1 text-left text-sm font-semibold text-indigo-800">
              {week.title}
            </span>
            <span className="text-xs text-indigo-500">
              {week.modules?.length || 0} modules
            </span>
            <i
              className="ti ti-chevron-down text-xs text-indigo-500 transition-transform"
              style={{
                transform: expanded.has(wIdx) ? "rotate(180deg)" : "none",
              }}
              aria-hidden="true"
            />
          </button>
          {expanded.has(wIdx) && (
            <div className="p-3 space-y-2">
              {(week.modules || []).map((mod, mIdx) => (
                <div
                  key={mod.id || mIdx}
                  className="bg-gray-50 rounded-lg p-2.5 border border-gray-100"
                >
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">
                    {mod.title}
                  </p>
                  <div className="space-y-1">
                    {(mod.sessions || []).map((sess, sIdx) => (
                      <div
                        key={sess.id || sIdx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${typeColors[sess.type] || "bg-gray-100 text-gray-600"}`}
                        >
                          {sess.type}
                        </span>
                        <span className="flex-1 text-gray-700">
                          {sess.title}
                        </span>
                        {sess.duration && (
                          <span className="text-gray-400">{sess.duration}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── MAIN SyllabusManager ─────────────────────────────────────────────────────
export default function SyllabusManager({
  syllabusData,
  onChange,
  displaySettings,
  onDisplaySettingsChange,
}) {
  const flags = displaySettings || {};
  const setFlag = (key, val) =>
    onDisplaySettingsChange &&
    onDisplaySettingsChange({ ...flags, [key]: val });
  const data = syllabusData || {
    mode: "manual",
    weeks: [],
    uploadedFile: null,
    generatedPreview: null,
  };
  const [showPreview, setShowPreview] = useState(false);

  const emit = (patch) => onChange({ ...data, ...patch });

  const totalModules = (data.weeks || []).reduce(
    (a, w) => a + (w.modules?.length || 0),
    0,
  );
  const totalSessions = (data.weeks || []).reduce(
    (a, w) =>
      a + (w.modules || []).reduce((b, m) => b + (m.sessions?.length || 0), 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">Syllabus Management</h3>
        <p className="text-xs text-gray-500">
          Build week-by-week or upload a file
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            mode: "manual",
            icon: "ti-tool",
            label: "Manual Builder",
            desc: "Week-by-week builder",
          },
          {
            mode: "upload",
            icon: "ti-cloud-upload",
            label: "Upload File",
            desc: "PDF / DOC / DOCX",
          },
          {
            mode: "zip",
            icon: "ti-archive",
            label: "Upload ZIP",
            desc: "Auto Generate",
          },
        ].map(({ mode, icon, label, desc }) => (
          <button
            key={mode}
            onClick={() => emit({ mode })}
            className={`p-3 rounded-xl border-2 text-left transition-all ${data.mode === mode ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${data.mode === mode ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}`}
              >
                {data.mode === mode && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <i
                className={`ti ${icon} text-sm ${data.mode === mode ? "text-indigo-600" : "text-gray-400"}`}
                aria-hidden="true"
              />
              <span
                className={`text-xs font-semibold ${data.mode === mode ? "text-indigo-700" : "text-gray-600"}`}
              >
                {label}
              </span>
            </div>
            <p className="text-xs text-gray-400 ml-6">{desc}</p>
          </button>
        ))}
      </div>

      {/* Stats */}
      {(data.mode === "manual" || data.mode === "zip") &&
        data.weeks?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {[
              {
                label: "Weeks",
                value: data.weeks.length,
                color: "bg-blue-50 text-blue-700 border-blue-200",
              },
              {
                label: "Modules",
                value: totalModules,
                color: "bg-violet-50 text-violet-700 border-violet-200",
              },
              {
                label: "Sessions",
                value: totalSessions,
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
            ].map((s) => (
              <span
                key={s.label}
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}
              >
                <span className="font-bold">{s.value}</span> {s.label}
              </span>
            ))}
          </div>
        )}

      <div className="border-t border-gray-100" />

      {/* Manual Builder */}
      {data.mode === "manual" && (
        <ManualSyllabusBuilder
          weeks={data.weeks || []}
          onChange={(weeks) => emit({ weeks })}
        />
      )}

      {data.mode === "upload" && (
        <div className="space-y-4">
          <SyllabusUpload
            uploadedFile={data.uploadedFile}
            onUpload={(file) =>
              emit({ uploadedFile: file, generatedPreview: null })
            }
            onGenerate={(preview) => emit({ generatedPreview: preview })}
          />
          {data.generatedPreview && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Generated Structure
                  </p>
                  <p className="text-xs text-gray-500">
                    Auto-detected from your file
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPreview((v) => !v)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                  <button
                    onClick={() =>
                      emit({
                        mode: "manual",
                        weeks: data.generatedPreview.weeks,
                        generatedPreview: null,
                      })
                    }
                    className="text-xs text-white font-semibold bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Apply to Syllabus →
                  </button>
                </div>
              </div>
              {showPreview && (
                <SyllabusPreview generatedData={data.generatedPreview} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Upload ZIP Mode */}
      {data.mode === "zip" && (
        <SyllabusZipUpload
          onApply={(generatedWeeks) =>
            emit({ mode: "manual", weeks: generatedWeeks })
          }
        />
      )}

      {/* Tips */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
        <p className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
          <i
            className={`ti ${data.mode === "manual" ? "ti-bulb" : data.mode === "zip" ? "ti-archive" : "ti-info-circle"} text-sm`}
            aria-hidden="true"
          />
          {data.mode === "manual"
            ? "Manual Builder Tips"
            : data.mode === "zip"
              ? "ZIP Upload Tips"
              : "Upload Tips"}
        </p>
        {data.mode === "manual" ? (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>Organize content into logical weeks to guide learners.</li>
            <li>
              Use <strong>Live</strong> for interactive sessions and Q&amp;A.
            </li>
            <li>
              Add <strong>Assignment</strong> sessions for practice at end of
              modules.
            </li>
          </ul>
        ) : data.mode === "zip" ? (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>
              Folder = Module, files inside = Sessions (videos, PDFs, docs).
            </li>
            <li>
              If your ZIP already has "Week 1", "Week 2" folders, those are used
              directly.
            </li>
            <li>
              Otherwise modules are auto-grouped into weeks using the count you
              set.
            </li>
            <li>
              Applying loads the result into Manual Builder so you can fine-tune
              before saving.
            </li>
          </ul>
        ) : (
          <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
            <li>
              Upload a structured PDF/DOCX for best auto-detection results.
            </li>
            <li>
              Ensure headings like "Week 1", "Module 1" are clearly formatted.
            </li>
            <li>
              Max file size: <strong>20 MB</strong>. Accepted: PDF, DOC, DOCX.
            </li>
          </ul>
        )}
      </div>

      {/* Display Settings */}
      <div className="pt-3 border-t border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-1">
          Display Settings
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Control where and how this program is surfaced across the site
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DISPLAY_FLAGS.map(({ key, label, icon }) => (
            <ToggleSwitch
              key={key}
              icon={icon}
              label={label}
              checked={!!flags[key]}
              onChange={(val) => setFlag(key, val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
