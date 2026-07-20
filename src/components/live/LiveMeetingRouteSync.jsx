import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLiveMeeting } from "../../context/LiveMeetingContext";

const isOnFullMeetingRoute = (pathname, meeting) => {
  if (!meeting) return false;
  if (meeting.role === "trainer") return pathname.startsWith(`/trainer/live-controls/${meeting.sessionId}`);
  if (meeting.role === "student") return pathname === "/student/live-classes";
  return false;
};

export default function LiveMeetingRouteSync() {
  const location = useLocation();
  const { activeMeeting, setMinimized } = useLiveMeeting();

  useEffect(() => {
    if (!activeMeeting) return;
    setMinimized(!isOnFullMeetingRoute(location.pathname, activeMeeting));
  }, [location.pathname, activeMeeting, setMinimized]);

  return null;
}