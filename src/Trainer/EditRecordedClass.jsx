import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaTrash,
  FaCloudUploadAlt,
  FaTimes,
  FaCheckCircle,
  FaEye,
  FaHeart,
  FaStar,
  FaVideo,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const EditRecordedClass = () => {
  const navigate = useNavigate();
  const { videoId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    status: "",
    preview: false,
    download: false,
    notify: false,
  });

  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    rating: null,
    duration: "",
    uploadedAt: "",
  });

  /* ================= FETCH VIDEO FROM BACKEND ================= */
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // 🔥 Future API Call
        // const res = await fetch(`/api/trainer/videos/${videoId}`);
        // const data = await res.json();
        // setForm({
        //   title: data.title,
        //   description: data.description,
        //   category: data.category,
        //   level: data.level,
        //   status: data.status,
        //   preview: data.settings.preview,
        //   download: data.settings.download,
        //   notify: data.settings.notify,
        // });
        // setTags(data.tags || []);
        // setStats(data.stats);

        // For now empty
        setForm({
          title: "",
          description: "",
          category: "",
          level: "",
          status: "",
          preview: false,
          download: false,
          notify: false,
        });
        setTags([]);
        setStats({ views: 0, likes: 0, rating: null, duration: "", uploadedAt: "" });
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  /* ================= SAVE CHANGES ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      // 🔥 Future API Call
      // await fetch(`/api/trainer/videos/${videoId}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ ...form, tags }),
      // });

      await new Promise((r) => setTimeout(r, 800));
      setSaved(true);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE VIDEO ================= */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      // 🔥 Future API Call
      // await fetch(`/api/trainer/videos/${videoId}`, { method: "DELETE" });

      await new Promise((r) => setTimeout(r, 600));
      navigate("/trainer/live/recorded");
    } catch (error) {
      console.error("Failed to delete:", error);
      setDeleting(false);
    }
  };

  /* ================= TOGGLE PUBLISH STATUS ================= */
  const handleTogglePublish = async () => {
    const newStatus = form.status === "published" ? "draft" : "published";
    try {
      // 🔥 Future API Call
      // await fetch(`/api/trainer/videos/${videoId}/status`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      set("status", newStatus);
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  /* ================= TAGS ================= */
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setTagInput("");
      setSaved(false);
    }
  };

  const removeTag = (tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
    setSaved(false);
  };

  const categories = [
    "Yoga",
    "Cardio",
    "Strength",
    "Pilates",
    "Mindfulness",
    "Flexibility",
    "Other",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white flex items-center justify-center">
        <p className="text-gray-500 dark:text-slate-400">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900 dark:bg-[#0B1120] dark:text-white">

      {/* ================= HEADER ================= */}
      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/trainer/live/recorded")}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h2 className="text-2xl font-semibold">✏️ Edit Recorded Class</h2>
              <p className="text-sm opacity-90 mt-1">
                Update video details and publishing settings
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleTogglePublish}
              className={
                form.status === "published"
                  ? "bg-yellow-500 hover:bg-yellow-400 text-white font-semibold"
                  : "bg-green-500 hover:bg-green-400 text-white font-semibold"
              }
            >
              {form.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-2"
            >
              {saved ? (
                <>
                  <FaCheckCircle size={13} className="text-green-500" /> Saved
                </>
              ) : (
                <>
                  <FaSave size={13} /> {saving ? "Saving..." : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT COLUMN: FORMS ================= */}
        <div className="lg:col-span-2 space-y-6">

          {/* Video Details */}
          <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-white/10 pb-3">
                Video Details
              </h3>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. 60-Minute Morning Yoga Flow"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className="dark:bg-[#1F2937] dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what students will learn in this session..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  className="dark:bg-[#1F2937] dark:border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => set("category", v)}
                  >
                    <SelectTrigger className="dark:bg-[#1F2937] dark:border-white/10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select
                    value={form.level}
                    onValueChange={(v) => set("level", v)}
                  >
                    <SelectTrigger className="dark:bg-[#1F2937] dark:border-white/10">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge
                      key={t}
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 flex items-center gap-1 pr-1"
                    >
                      {t}
                      <button
                        onClick={() => removeTag(t)}
                        className="ml-1 hover:text-red-500 transition"
                      >
                        <FaTimes size={9} />
                      </button>
                    </Badge>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="+ Add tag"
                    className="px-3 py-1 rounded-full text-xs border border-dashed border-gray-300 dark:border-white/20 bg-transparent outline-none text-gray-600 dark:text-slate-300 w-24"
                  />
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  Press Enter to add a tag
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-white/10 pb-3 mb-2">
                Publishing Settings
              </h3>
              {[
                {
                  key: "preview",
                  label: "Allow Free Preview",
                  desc: "Let non-enrolled students watch the first 2 minutes",
                },
                {
                  key: "download",
                  label: "Allow Download",
                  desc: "Students can download for offline viewing",
                },
                {
                  key: "notify",
                  label: "Notify on Update",
                  desc: "Notify enrolled students when this video is updated",
                },
              ].map((sw) => (
                <div
                  key={sw.key}
                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/10 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{sw.label}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {sw.desc}
                    </p>
                  </div>
                  <Switch
                    checked={form[sw.key]}
                    onCheckedChange={(v) => set(sw.key, v)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Replace Video File */}
          <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg border-b border-gray-100 dark:border-white/10 pb-3 mb-5">
                Replace Video File
              </h3>
              <div
                className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition"
                onClick={() => document.getElementById("replace-file-input").click()}
              >
                <FaCloudUploadAlt
                  size={36}
                  className="mx-auto mb-3 text-blue-400 opacity-60"
                />
                <p className="font-medium text-sm mb-1">
                  Upload a new video file
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  This will replace the existing video. Supports MP4, MOV, AVI
                  — max 4GB
                </p>
                <input
                  id="replace-file-input"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    // 🔥 Future: handle file replacement upload
                    console.log("Replace with:", e.target.files[0]);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save / Cancel */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/trainer/live/recorded")}
              className="dark:border-white/10 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <FaCheckCircle size={13} /> Changes Saved
                </>
              ) : (
                <>
                  <FaSave size={13} /> {saving ? "Saving..." : "Save Changes"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SIDEBAR ================= */}
        <div className="space-y-6">

          {/* Video Preview Card */}
          <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Video Preview</h3>
              <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/30">
                <FaVideo size={36} className="text-blue-300 opacity-50" />
              </div>
              <p className="font-semibold text-sm truncate mb-1">
                {form.title || "Untitled Video"}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  className={
                    form.status === "published"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"
                      : "bg-gray-100 text-gray-500 dark:bg-[#374151] dark:text-slate-400 text-xs"
                  }
                >
                  {form.status === "published" ? "✓ Published" : "Draft"}
                </Badge>
                {form.category && (
                  <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs border border-blue-100 dark:border-blue-900/30">
                    {form.category}
                  </Badge>
                )}
              </div>
              {stats.duration && (
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  ⏱ {stats.duration}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Video Stats</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: <FaEye className="text-blue-500" size={14} />,
                    label: "Total Views",
                    value: stats.views,
                  },
                  {
                    icon: <FaHeart className="text-red-400" size={14} />,
                    label: "Likes",
                    value: stats.likes,
                  },
                  {
                    icon: <FaStar className="text-yellow-400" size={14} />,
                    label: "Rating",
                    value: stats.rating ? `${stats.rating} / 5` : "No ratings yet",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/10 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                      {s.icon}
                      {s.label}
                    </div>
                    <span className="font-semibold text-sm">{s.value}</span>
                  </div>
                ))}
                {stats.uploadedAt && (
                  <p className="text-xs text-gray-400 dark:text-slate-500 pt-1">
                    Uploaded: {stats.uploadedAt}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/30">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-1 text-red-600 dark:text-red-400 flex items-center gap-2">
                <FaExclamationTriangle size={14} /> Danger Zone
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
                Deleting this video is permanent and cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <FaTrash size={12} /> Delete Video
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 dark:border-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white"
                    >
                      {deleting ? "Deleting..." : "Yes, Delete"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditRecordedClass;