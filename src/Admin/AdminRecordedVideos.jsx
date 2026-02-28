import React, { useEffect, useState } from "react";
import { Video, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminRecordedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    setVideos([
      {
        id: 1,
        title: "React Hooks Explained",
        trainer: "John Doe",
        batch: "Batch A",
        date: "2026-02-20",
      },
      {
        id: 2,
        title: "MongoDB Basics",
        trainer: "Jane Smith",
        batch: "Batch B",
        date: "2026-02-18",
      },
    ]);
  }, []);

  const handleView = (video) => {
    setSelectedVideo(video);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      setVideos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="p-6">

      {/* ✅ Gradient Banner Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 
                        text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <Video size={28} />
            <div>
              <h1 className="text-2xl font-semibold">
                Admin Recorded Videos
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Monitor and manage all recorded sessions uploaded by trainers
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Trainer</th>
                <th className="p-2">Batch</th>
                <th className="p-2">Upload Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {videos.map((video) => (
                <tr
                  key={video.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="p-2">{video.title}</td>
                  <td className="p-2">{video.trainer}</td>
                  <td className="p-2">{video.batch}</td>
                  <td className="p-2">{video.date}</td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(video)}
                    >
                      <Eye size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ✅ View Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Recorded Video Details
            </h2>

            <p><strong>Title:</strong> {selectedVideo.title}</p>
            <p><strong>Trainer:</strong> {selectedVideo.trainer}</p>
            <p><strong>Batch:</strong> {selectedVideo.batch}</p>
            <p><strong>Upload Date:</strong> {selectedVideo.date}</p>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedVideo(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminRecordedVideos;