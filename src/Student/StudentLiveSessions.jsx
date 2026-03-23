import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, Clock, Users, Circle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudentLiveSessions = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const batchId = 1; // later fetch from student profile

  /* ================= FETCH LIVE SESSIONS ================= */

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/live-sessions/batch/${batchId}`);

        const data = await res.json();

        setSessions(data);
      } catch (error) {
        console.error("Failed to fetch live sessions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [batchId]);

  /* ================= JOIN LIVE ================= */

  const handleJoin = (sessionId) => {
    navigate(`/student/live/${sessionId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0B1120] dark:text-white">
      {/* ================= HEADER ================= */}

      <div className="px-8 py-6 rounded-2xl mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Video size={22} />
          Live Classes
        </h2>

        <p className="text-sm opacity-90 mt-1">
          Join your upcoming and live sessions
        </p>
      </div>

      {/* ================= CONTENT ================= */}

      {loading ? (
        <div className="text-center py-20">Loading live sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 opacity-70">
          <Video size={40} className="mx-auto mb-4" />
          No live sessions available
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10"
            >
              <CardContent className="p-6 space-y-4">
                {/* TITLE */}

                <h3 className="font-semibold text-lg">{session.title}</h3>

                {/* DETAILS */}

                <div className="text-sm text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {session.date}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    {session.time}
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    {session.viewers ?? 0} students
                  </div>
                </div>

                {/* STATUS */}

                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    {session.status === "LIVE" && (
                      <Circle
                        size={10}
                        className="text-red-500 animate-pulse"
                      />
                    )}

                    {session.status}
                  </span>

                  {/* JOIN BUTTON */}

                  <Button
                    onClick={() => handleJoin(session.id)}
                    className="bg-blue-600 text-white hover:bg-blue-500"
                  >
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLiveSessions;
