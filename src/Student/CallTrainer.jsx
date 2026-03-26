

import { startCall } from "@/services/liveSessionService";
import { useNavigate } from "react-router-dom";

const CallTrainer = () => {
  const navigate = useNavigate();

  const handleCall = async () => {
    try {
      console.log("Calling trainer...");

      const trainerEmail = "trainer1@gmail.com";

      const res = await startCall(trainerEmail);

      console.log("API RESPONSE:", res);

      if (!res || !res.data) {
        alert("No response from server");
        return;
      }

      const { room, token } = res.data;

      if (!room || !token) {
        alert("Invalid response from backend");
        return;
      }

      console.log("Navigating to call room...");

      // ✅ FIX: PASS STATE HERE
      navigate("/student/call-room", {
        state: {
          room: room,
          token: token,
        },
      });
    } catch (err) {
      console.error("CALL ERROR:", err);
      alert("Call failed. Check backend or token.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold mb-6">📞 Call Your Trainer</h2>

      <button
        onClick={handleCall}
        className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg"
      >
        Start Call
      </button>
    </div>
  );
};

export default CallTrainer;
