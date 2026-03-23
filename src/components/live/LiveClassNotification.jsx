import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LiveClassNotification = ({ batchId }) => {
  const navigate = useNavigate();

  const [liveSession, setLiveSession] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkLiveClass = async () => {
      try {
        const res = await fetch(`/api/live-sessions/batch/${batchId}`);

        const sessions = await res.json();

        const live = sessions.find((s) => s.status === "LIVE");

        if (live) {
          setLiveSession(live);
          setVisible(true);
        }
      } catch (error) {
        console.error("Live check failed", error);
      }
    };

    checkLiveClass();

    const interval = setInterval(checkLiveClass, 10000);

    return () => clearInterval(interval);
  }, [batchId]);

  if (!visible || !liveSession) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-[#111827] shadow-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 z-50">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>

        <span className="font-semibold text-red-600">Live Class Started</span>
      </div>

      <div className="text-sm mb-4">{liveSession.title}</div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/student/live/${liveSession.id}`)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Join Now
        </button>

        <button
          onClick={() => setVisible(false)}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default LiveClassNotification;
