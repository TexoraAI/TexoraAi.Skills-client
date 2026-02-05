import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, FileText, Video } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API = "http://localhost:9000";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
});

export default function TrainerCourseModules() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("VIDEO");
  const [loading, setLoading] = useState(false);

  // VIDEO LIBRARY
  const [videoLibrary, setVideoLibrary] = useState([]);
  const [useLibrary, setUseLibrary] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // PDF LIBRARY
  const [pdfLibrary, setPdfLibrary] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    loadModules();
    loadVideoLibrary();
    loadPdfLibrary();
  }, [courseId]);

  const loadModules = async () => {
    const res = await axios.get(`${API}/api/content/course/${courseId}`, {
      headers: authHeader(),
    });
    setModules(res.data);
  };

  const loadVideoLibrary = async () => {
    const res = await axios.get(`${API}/api/video`, {
      headers: authHeader(),
    });
    setVideoLibrary(res.data);
  };

  const loadPdfLibrary = async () => {
    const res = await axios.get(`${API}/api/files`, {
      headers: {
        ...authHeader(),
        "X-ROLE": JSON.parse(localStorage.getItem("lms_user"))?.role,
      },
    });
    setPdfLibrary(res.data?.content || []);
  };

  const uploadAsset = async () => {
    if (!title) return alert("Title required");

    try {
      setLoading(true);
      let fileName = null;

      if (type === "VIDEO") {
        if (useLibrary) {
          if (!selectedVideo?.storedFileName) return alert("Select video");
          fileName = selectedVideo.storedFileName;
        } else {
          if (!file) return alert("Video required");

          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await axios.post(
            `${API}/api/video/upload`,
            formData,
            { headers: authHeader() }
          );

          fileName = uploadRes.data?.storedFileName;
        }
      }

      if (type === "PDF") {
        if (useLibrary) {
          if (!selectedPdf?.storedName) return alert("Select PDF");
          fileName = selectedPdf.storedName;
        } else {
          if (!file) return alert("PDF required");

          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await axios.post(
            `${API}/api/files/upload`,
            formData,
            {
              headers: {
                ...authHeader(),
                "X-ROLE": JSON.parse(localStorage.getItem("lms_user"))?.role,
              },
            }
          );

          fileName = uploadRes.data?.storedName;
        }
      }

      await axios.post(
        `${API}/api/content`,
        {
          courseId,
          title,
          contentType: type,
          url: fileName,
          orderIndex: modules.length + 1,
        },
        { headers: authHeader() }
      );

      setTitle("");
      setFile(null);
      setSelectedVideo(null);
      setSelectedPdf(null);
      setUseLibrary(false);

      loadModules();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm("Delete this module?")) return;
    await axios.delete(`${API}/api/content/${id}`, {
      headers: authHeader(),
    });
    loadModules();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          Course
        </p>
        <h1 className="text-2xl font-semibold text-foreground">
          Course Modules
        </h1>
      </div>

      {/* ADD MODULE */}
      <Card className="p-6 space-y-4">
        <Input
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VIDEO">Video</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <label className="flex gap-2 items-center">
            <input
              type="radio"
              checked={!useLibrary}
              onChange={() => setUseLibrary(false)}
            />
            Upload New
          </label>

          <label className="flex gap-2 items-center">
            <input
              type="radio"
              checked={useLibrary}
              onChange={() => setUseLibrary(true)}
            />
            Select from Library
          </label>
        </div>

        {type === "VIDEO" && useLibrary && (
          <Select onValueChange={(id) =>
            setSelectedVideo(videoLibrary.find(v => v.id === Number(id)))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select video" />
            </SelectTrigger>
            <SelectContent>
              {videoLibrary.map(v => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.originalFileName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {type === "PDF" && useLibrary && (
          <Select onValueChange={(id) =>
            setSelectedPdf(pdfLibrary.find(p => p.id === Number(id)))
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select PDF" />
            </SelectTrigger>
            <SelectContent>
              {pdfLibrary.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.originalName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!useLibrary && (
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        )}

        <Button onClick={uploadAsset} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Add Module"}
        </Button>
      </Card>

      {/* MODULE LIST */}
      <div className="space-y-3">
        {modules.map((m) => (
          <Card
            key={m.id}
            className="p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {m.contentType === "VIDEO" ? <Video /> : <FileText />}
              <div>
                <p className="font-semibold text-foreground">{m.title}</p>
                <p className="text-xs text-muted-foreground">{m.url}</p>
              </div>
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteModule(m.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
