// src/pages/public/PublicJoinSession.jsx

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  verifyPublicBooking,
  markBookingAsJoined,
  markBookingAsLeft,
  getBookingDuration,
} from "@/services/publicBookingService";
import { joinLiveSession } from "@/services/liveSessionService";
import LiveKitRoomComponent from "@/components/live/LiveKitRoomComponent";
import { AlertCircle, CheckCircle2, Loader, LogOut, Clock } from "lucide-react";

const PublicJoinSession = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [booking, setBooking] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveKitToken, setLiveKitToken] = useState(null);
  const [duration, setDuration] = useState(null);
  const [joined, setJoined] = useState(false);
  const durationIntervalRef = useRef(null);

  // ✅ Verify booking and join session
  useEffect(() => {
    const verifyAndJoin = async () => {
      try {
        // Step 1: Verify booking by token
        const bookingRes = await verifyPublicBooking(token);
        setBooking(bookingRes.data);

        const bookingId = bookingRes.data.id;
        const sessionId = bookingRes.data.sessionId;

        // Step 2: Get LiveKit token to join live session
        const joinRes = await joinLiveSession(sessionId, bookingId); // Using bookingId as fake studentId
        setLiveKitToken(joinRes.data.token);
        setSession(joinRes.data);

        // Step 3: Mark booking as joined
        await markBookingAsJoined(bookingId);
        setJoined(true);

        // Step 4: Start tracking duration
        startDurationTracking(bookingId);

        console.log("✅ Public user joined session:", bookingId);
      } catch (err) {
        console.error("Verification failed:", err);
        setError(
          err.response?.data?.error ||
            "Invalid booking link or session not found",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAndJoin();

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [token]);

  // ✅ Track duration every 10 seconds
  const startDurationTracking = (bookingId) => {
    durationIntervalRef.current = setInterval(async () => {
      try {
        const res = await getBookingDuration(bookingId);
        setDuration(res.data.durationMinutes);
      } catch (err) {
        console.error("Failed to get duration:", err);
      }
    }, 10000); // Every 10 seconds
  };

  // ✅ Handle leave session
  const handleLeaveSession = async () => {
    try {
      if (booking?.id) {
        await markBookingAsLeft(booking.id);
        const finalRes = await getBookingDuration(booking.id);
        setDuration(finalRes.data.durationMinutes);
      }

      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      console.log(
        "✅ Public user left session. Duration: " + duration + " minutes",
      );
      navigate("/public/session-complete", {
        state: { duration, bookingId: booking?.id },
      });
    } catch (err) {
      console.error("Failed to leave session:", err);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ✅ Success - Show LiveKit Room
  if (joined && liveKitToken) {
    return (
      <div
        style={{ position: "relative", height: "100vh", overflow: "hidden" }}
      >
        {/* ✅ Duration counter in top-right */}
        {duration !== null && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              zIndex: 50,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <Clock size={16} /> {duration} min
          </div>
        )}

        {/* ✅ Leave button in top-left */}
        <button
          onClick={handleLeaveSession}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "#ef4444",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 50,
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <LogOut size={16} /> Leave Session
        </button>

        {/* ✅ LiveKit Room Component */}
        <LiveKitRoomComponent
          token={liveKitToken}
          onLeave={handleLeaveSession}
        />
      </div>
    );
  }

  return null;
};

export default PublicJoinSession;
