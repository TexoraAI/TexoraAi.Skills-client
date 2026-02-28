import React, { useEffect, useState } from "react";
import { Radio, Trash2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminLiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    setSessions([
      {
        id: 1,
        title: "React Live Class",
        trainer: "John Doe",
        batch: "Batch A",
        status: "Active",
      },
      {
        id: 2,
        title: "NodeJS Live Session",
        trainer: "Jane Smith",
        batch: "Batch B",
        status: "Completed",
      },
    ]);
  }, []);

  const handleView = (session) => {
    setSelectedSession(session);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6">

      {/* ✅ Gradient Banner Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 
                        text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <Radio size={28} />
            <div>
              <h1 className="text-2xl font-semibold">
                Admin Live Sessions
              </h1>
              <p className="text-sm opacity-90 mt-1">
                Monitor and manage all live sessions conducted by trainers
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
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="p-2">{session.title}</td>
                  <td className="p-2">{session.trainer}</td>
                  <td className="p-2">{session.batch}</td>
                  <td className="p-2">{session.status}</td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(session)}
                    >
                      <Eye size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(session.id)}
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
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1F2937] p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Live Session Details
            </h2>

            <p><strong>Title:</strong> {selectedSession.title}</p>
            <p><strong>Trainer:</strong> {selectedSession.trainer}</p>
            <p><strong>Batch:</strong> {selectedSession.batch}</p>
            <p><strong>Status:</strong> {selectedSession.status}</p>

            <div className="flex justify-end mt-4">
              <Button onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLiveSessions;