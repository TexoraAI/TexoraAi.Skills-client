// src/trainer/UploadVideos.jsx
import { useEffect, useState } from "react";
import videoService from "../services/videoService";
import VideoList from "./VideoList";
import UploadDocuments from "./UploadDocuments";
import CreateQuiz from "./CreateQuiz";
import CreateAssignments from "./CreateAssignments";
import {
  UploadCloud, Video, FileText, ClipboardEdit, BookOpen,
} from "lucide-react";
import {
  useTrainerTheme, PageShell, PageHero, ThemedCard, CardHeader,
  ThemedInput, ThemedTextarea, ThemedSelect, FieldLabel,
  PrimaryButton,
} from "./trainerTheme";

/* ─────────────────── TAB CONFIG ─────────────────── */
const TABS = [
  { key: "upload-video",      label: "Upload Video",      icon: Video },
  { key: "upload-document",   label: "Upload Document",   icon: FileText },
  { key: "create-quiz",       label: "Create Quiz",       icon: ClipboardEdit },
  { key: "create-assignment", label: "Create Assignment", icon: BookOpen },
];

/* ─────────────────── TAB BAR ─────────────────── */
const TabBar = ({ activeTab, setActiveTab, t }) => (
  <div style={{
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 24,
    background: t.cardBg,
    border: `1px solid ${t.inputBorder}`,
    borderRadius: 14,
    padding: 6,
  }}>
    {TABS.map(({ key, label, icon: Icon }) => {
      const isActive = activeTab === key;
      return (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13,
            fontWeight: isActive ? 700 : 500,
            transition: "all 0.18s ease",
            background: isActive ? "#7c3aed" : "transparent",
            color: isActive ? "#fff" : t.textSub,
          }}
        >
          <Icon size={15} />
          {label}
        </button>
      );
    })}
  </div>
);

/* ─────────────────── UPLOAD VIDEO PANEL ─────────────────── */
const UploadVideoPanel = ({ t, isDark }) => {
  const [file, setFile]               = useState(null);
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId]         = useState(null);
  const [batches, setBatches]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [message, setMessage]         = useState("");
  const [refreshKey, setRefreshKey]   = useState(0);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const res = await videoService.getTrainerBatches();
        setBatches(res.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    loadBatches();
  }, []);

  const handleUpload = async () => {
    if (!file || !title.trim() || !batchId) {
      setMessage("❌ Select video, title & batch");
      return;
    }
    try {
      setLoading(true);
      setMessage("");
      await videoService.uploadVideo(file, title, description, batchId);
      setMessage("✅ Video uploaded successfully");
      setRefreshKey((p) => p + 1);
      setFile(null);
      setTitle("");
      setDescription("");
      setBatchId(null);
    } catch {
      setMessage("❌ Upload failed (not assigned to batch)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThemedCard t={t} style={{ marginBottom: 20 }}>
        <CardHeader t={t} icon={UploadCloud} color="#7c3aed" title="Upload Video" />

        {/* DROP ZONE */}
        <div style={{
          borderRadius: 16,
          border: `2px dashed ${t.inputBorder}`,
          padding: "40px 24px",
          textAlign: "center",
          background: t.inputBg,
          marginBottom: 24,
          transition: "border 0.2s",
        }}>
          <UploadCloud size={40} color="#7c3aed" style={{ display: "block", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 13, color: t.textSub, fontFamily: "'Poppins',sans-serif", marginBottom: 16 }}>
            Drag & drop your lecture video here
          </p>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 12,
            background: "#7c3aed", color: "#fff",
            fontSize: 13, fontWeight: 700,
            fontFamily: "'Poppins',sans-serif", cursor: "pointer",
          }}>
            <Video size={14} />
            Browse Video
            <input type="file" accept="video/*" hidden onChange={(e) => setFile(e.target.files[0])} />
          </label>
          {file && (
            <p style={{ marginTop: 12, fontSize: 11, color: t.liveText, fontFamily: "'Poppins',sans-serif" }}>
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* INPUTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 24 }}>
          <div>
            <FieldLabel t={t}>Lecture Title</FieldLabel>
            <ThemedInput
              t={t}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="React State Management – Lecture 1"
            />
          </div>
          <div>
            <FieldLabel t={t}>Short Description</FieldLabel>
            <ThemedTextarea
              t={t}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What students will learn in this lecture"
            />
          </div>
          <div>
            <FieldLabel t={t}>Select Batch</FieldLabel>
            <ThemedSelect
              t={t}
              value={batchId || ""}
              onChange={(e) => setBatchId(Number(e.target.value))}
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name || "Batch"} (ID: {b.id})
                </option>
              ))}
            </ThemedSelect>
          </div>
        </div>

        {/* ACTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {message && (
            <p style={{
              fontSize: 13, fontFamily: "'Poppins',sans-serif",
              color: message.startsWith("✅") ? t.liveText : "#f87171",
            }}>{message}</p>
          )}
          <PrimaryButton
            color="#34d399"
            onClick={handleUpload}
            disabled={loading}
            style={{ marginLeft: "auto", opacity: loading ? 0.6 : 1 }}
          >
            <FileText size={14} />
            {loading ? "Uploading..." : "Publish Lecture"}
          </PrimaryButton>
        </div>
      </ThemedCard>

      {/* VIDEO LIST */}
      <VideoList refreshKey={refreshKey} trainerMode={true} />
    </>
  );
};

/* ─────────────────── MAIN PAGE ─────────────────── */
const UploadVideos = () => {
  const { t, isDark } = useTrainerTheme();
  const [activeTab, setActiveTab] = useState("upload-video");

  const renderPanel = () => {
    switch (activeTab) {
      case "upload-video":
        return <UploadVideoPanel t={t} isDark={isDark} />;
      case "upload-document":
        return <UploadDocuments />;
      case "create-quiz":
        return <CreateQuiz />;
      case "create-assignment":
        return <CreateAssignments />;
      default:
        return null;
    }
  };

  /* Hero title & subtitle change with active tab */
  const heroMeta = {
    "upload-video":      { title: "Publish New Lecture",   subtitle: "Upload recorded lectures for students.",           icon: Video,         color: "#7c3aed" },
    "upload-document":   { title: "Upload Documents",      subtitle: "Share study material and resources with students.", icon: FileText,       color: "#2563eb" },
    "create-quiz":       { title: "Create Quiz",           subtitle: "Build interactive quizzes for your batch.",         icon: ClipboardEdit,  color: "#d97706" },
    "create-assignment": { title: "Create Assignment",     subtitle: "Set assignments and track submissions.",            icon: BookOpen,       color: "#059669" },
  }[activeTab];

  return (
    <PageShell t={t}>
      {/* HERO */}
      <PageHero
        t={t} isDark={isDark}
        icon={heroMeta.icon}
        badge="Trainer Studio"
        title={heroMeta.title}
        subtitle={heroMeta.subtitle}
        color={heroMeta.color}
      />

      {/* TABS */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      {/* PANEL */}
      {renderPanel()}
    </PageShell>
  );
};

export default UploadVideos;