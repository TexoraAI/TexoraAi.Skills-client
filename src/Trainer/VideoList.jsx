import React, { useEffect, useState } from "react";
import { Play, Clock, Trash2, Loader2, Video } from "lucide-react";
import videoService from "../services/videoService";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VideoList = ({ refreshKey }) => {
  const [videos, setVideos] = useState([]);
  const [videoUrls, setVideoUrls] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await videoService.getAllVideos();

        const sorted = (res.data || [])
          .filter(v => v?.id && v?.originalFileName)
          .sort(
            (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
          );

        setVideos(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [refreshKey]);

  const loadVideo = async (video) => {
    if (videoUrls[video.id]) return;
    const res = await videoService.getVideoBlob(video.storedFileName);
    setVideoUrls(p => ({
      ...p,
      [video.id]: URL.createObjectURL(res.data),
    }));
  };

  const deleteVideo = async (id) => {
    if (!confirm("Delete this video?")) return;
    await videoService.deleteVideo(id);
    setVideos(p => p.filter(v => v.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Video className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Uploaded Videos
          </h2>
          <p className="text-xs text-muted-foreground">
            {videos.length} videos • latest first
          </p>
        </div>
      </div>

      {/* Empty State */}
      {videos.length === 0 ? (
        <Card className="border-dashed p-14 text-center">
          <Video className="w-14 h-14 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No videos uploaded yet
          </p>
        </Card>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map(video => (
            <Card key={video.id} className="p-4">
              {/* Preview */}
              <div className="h-44 rounded-lg bg-muted flex items-center justify-center mb-4 overflow-hidden">
                {!videoUrls[video.id] ? (
                  <Button
                    variant="ghost"
                    onClick={() => loadVideo(video)}
                    className="flex gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Load Video
                  </Button>
                ) : (
                  <video
                    src={videoUrls[video.id]}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground line-clamp-1 mb-1">
                {video.originalFileName}
              </h3>

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(video.uploadedAt).toLocaleDateString()}
                </span>
                <span>
                  {(video.fileSize / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => loadVideo(video)}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteVideo(video.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoList;
