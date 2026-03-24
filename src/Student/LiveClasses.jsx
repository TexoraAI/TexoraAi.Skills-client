import React, { useState, useEffect } from "react";
import { getStudentClassroom } from "@/services/batchService";
import {
  getLiveSessionsByBatch,
  joinLiveSession,
} from "@/services/liveSessionService";
import LiveRoom from "@/components/live/LiveRoom";

const LiveClasses = () => {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(null);
  const [room, setRoom] = useState(null);

  // 🔥 LOAD LIVE SESSIONS (FIXED)
  useEffect(() => {
    const loadLive = async () => {
      try {
        // ✅ GET CLASSROOM
        const response = await getStudentClassroom();
        const classroom = response.data;

        console.log("CLASSROOM:", classroom);

        // ✅ ONLY THIS LINE (IMPORTANT FIX)
        const batchId = classroom.batchId;

        console.log("BATCH ID:", batchId);

        if (!batchId) {
          console.warn("No batch assigned");
          return;
        }

        // ✅ FETCH LIVE SESSIONS
        const res = await getLiveSessionsByBatch(batchId);

        console.log("LIVE SESSIONS:", res.data);

        setSessions(res.data || []);
      } catch (err) {
        console.error("Live fetch failed", err);
      }
    };

    loadLive();
  }, []);

  // 🔥 JOIN LIVE SESSION
  const handleJoin = async () => {
    try {
      if (!selected) return;

      const studentId = 1; // ⚠️ later from JWT

      const res = await joinLiveSession(selected.id, studentId);

      console.log("JOIN RESPONSE:", res.data);

      setToken(res.data.token);
      setRoom(res.data.room);
    } catch (err) {
      console.error("Join failed", err);
    }
  };

  // 🎥 IF JOINED → SHOW LIVE VIDEO
  if (token) {
    return <LiveRoom token={token} roomName={room} />;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">🔴 Live Classes</h2>

      {sessions.length === 0 ? (
        <p>No live sessions available</p>
      ) : (
        sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelected(s)}
            className={`p-3 border rounded mb-2 cursor-pointer ${
              selected?.id === s.id ? "bg-red-100" : ""
            }`}
          >
            {s.title}
          </div>
        ))
      )}

      {selected && (
        <button
          onClick={handleJoin}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded"
        >
          🔴 Join Live Session
        </button>
      )}
    </div>
  );
};

export default LiveClasses;
