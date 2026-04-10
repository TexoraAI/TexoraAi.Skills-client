import React, { useEffect, useState } from "react";
import { Play, Trash2, Loader2 } from "lucide-react";
import videoService from "../services/videoService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VideoList = ({ refreshKey, trainerMode }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // 🔥 FIXED: trainer should see only his batch videos
        const res = trainerMode
          ? await videoService.getTrainerVideos()
          : await videoService.getStudentVideos();

        setVideos(res.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [refreshKey, trainerMode]);

  const loadVideo = async (video) => {
    if (videoUrls[video.id]) return;
    const res = await videoService.getVideoBlob(video.storedFileName);
    setVideoUrls((p) => ({
      ...p,
      [video.id]: URL.createObjectURL(res.data),
    }));
  };

  const deleteVideo = async (id) => {
    if (!trainerMode) return;
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos((p) => p.filter((v) => v.id !== id));
  };

  if (loading) {
    return <Loader2 className="w-7 h-7 animate-spin mx-auto mt-10" />;
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Card key={video.id} className="p-4 space-y-2">
          <div className="h-36 flex items-center justify-center bg-muted rounded-lg">
            {!videoUrls[video.id] ? (
              <Button size="sm" onClick={() => loadVideo(video)}>
                <Play className="w-4 h-4 mr-1" /> Play
              </Button>
            ) : (
              <video
                src={videoUrls[video.id]}
                controls
                className="w-full h-full"
              />
            )}
          </div>

          <h3 className="text-sm font-semibold">{video.title}</h3>

          {trainerMode && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteVideo(video.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default VideoList;
