// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { joinCall } from "@/services/liveSessionService";
// import { Client } from "@stomp/stompjs";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// // ✅ Helper: try every common key your app might use
// const getTrainerEmail = () => {
//   // ✅ lms_user = '{"email":"...","role":"trainer"}'
//   try {
//     const lmsUser = localStorage.getItem("lms_user");
//     if (lmsUser) {
//       const parsed = JSON.parse(lmsUser);
//       if (parsed.email) return parsed.email;
//     }
//   } catch {
//     return null;
//   }
//   return null;
// };

// const TrainerJoinCall = () => {
//   const [room, setRoom] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [trainerEmail, setTrainerEmail] = useState(null);
//   const navigate = useNavigate();
//   const stompClientRef = useRef(null);

//   useEffect(() => {
//     const email = getTrainerEmail();

//     if (!email) {
//       console.error(
//         "❌ No trainer email found. localStorage keys available:",
//         Object.keys(localStorage),
//       );
//       return;
//     }

//     console.log("✅ Trainer email found:", email);
//     setTrainerEmail(email);

//     const wsUrl = API_BASE_URL.replace("http", "ws") + "/live-chat";
//     console.log("Connecting to WebSocket:", wsUrl);

//     const client = new Client({
//       brokerURL: wsUrl,
//       reconnectDelay: 5000,
//       onConnect: () => {
//         console.log("✅ WebSocket connected");
//         setConnected(true);

//         client.subscribe(`/topic/calls/${email}`, (msg) => {
//           const incomingRoom = msg.body;
//           console.log("📞 Incoming call, room:", incomingRoom);
//           setRoom(incomingRoom);
//         });
//       },
//       onDisconnect: () => {
//         setConnected(false);
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error:", frame);
//       },
//     });

//     client.activate();
//     stompClientRef.current = client;

//     return () => client.deactivate();
//   }, []);

//   const handleJoin = async () => {
//     try {
//       if (!room) return alert("No incoming call");
//       const res = await joinCall(room);
//       const { token } = res.data;
//       if (!token) return alert("Invalid token from server");
//       navigate("/trainer/call-room", { state: { room, token } });
//     } catch (err) {
//       console.error("Join failed:", err);
//       alert("Failed to join call.");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
//       <h2 className="text-3xl font-bold mb-2">📞 Incoming Call</h2>

//       {/* Debug info */}
//       {!trainerEmail && (
//         <p className="text-red-400 text-xs mb-2">
//           ⚠️ Email not found — check localStorage keys in console
//         </p>
//       )}

//       <p
//         className={`text-sm mb-6 ${connected ? "text-green-400" : "text-red-400"}`}
//       >
//         {connected
//           ? `🟢 Listening as ${trainerEmail}`
//           : trainerEmail
//             ? "🔴 Connecting to server..."
//             : "🔴 Email not found in storage"}
//       </p>

//       {room ? (
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-4xl shadow-lg">
//             📲
//           </div>
//           <p className="text-green-400 text-lg font-semibold">
//             Student is calling!
//           </p>
//           <p className="text-gray-400 text-sm">Room: {room}</p>
//           <div className="flex gap-4 mt-4">
//             <button
//               onClick={handleJoin}
//               className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
//             >
//               ✅ Accept
//             </button>
//             <button
//               onClick={() => setRoom(null)}
//               className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
//             >
//               ❌ Decline
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col items-center gap-3 text-gray-400">
//           <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
//             📵
//           </div>
//           <p>Waiting for incoming calls...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrainerJoinCall;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { joinCall } from "@/services/liveSessionService";
import { Client } from "@stomp/stompjs";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const getTrainerEmail = () => {
  try {
    const lmsUser = localStorage.getItem("lms_user");
    if (lmsUser) {
      const parsed = JSON.parse(lmsUser);
      if (parsed.email) return parsed.email;
    }
  } catch {}
  return null;
};

const TrainerJoinCall = () => {
  const [room, setRoom] = useState(null);
  const [connected, setConnected] = useState(false);
  const [trainerEmail, setTrainerEmail] = useState(null);
  const navigate = useNavigate();
  const stompClientRef = useRef(null);

  useEffect(() => {
    const email = getTrainerEmail();
    if (!email) {
      console.error(
        "No trainer email found. localStorage:",
        Object.keys(localStorage),
      );
      return;
    }

    console.log("✅ Trainer email:", email);
    setTrainerEmail(email);

    const wsUrl = API_BASE_URL.replace("http", "ws") + "/live-chat";
    console.log("Connecting to WebSocket:", wsUrl);

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
        client.subscribe(`/topic/calls/${email}`, (msg) => {
          console.log("📞 Incoming call, room:", msg.body);
          setRoom(msg.body);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    client.activate();
    stompClientRef.current = client;
    return () => client.deactivate();
  }, []);

  const handleJoin = async () => {
    try {
      if (!room) return alert("No incoming call");
      const res = await joinCall(room);
      const { token } = res.data;
      if (!token) return alert("Invalid token from server");

      // ✅ Save to sessionStorage BEFORE navigating (state can be lost in nested routes)
      sessionStorage.setItem("call_state", JSON.stringify({ room, token }));

      navigate("/trainer/call-room", { state: { room, token } });
    } catch (err) {
      console.error("Join failed:", err);
      alert("Failed to join call.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-2">📞 Incoming Call</h2>

      <p
        className={`text-sm mb-6 ${connected ? "text-green-400" : "text-red-400"}`}
      >
        {connected
          ? `🟢 Listening as ${trainerEmail}`
          : trainerEmail
            ? "🔴 Connecting to server..."
            : "🔴 Email not found in storage"}
      </p>

      {room ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-4xl shadow-lg">
            📲
          </div>
          <p className="text-green-400 text-lg font-semibold">
            Student is calling!
          </p>
          <p className="text-gray-400 text-sm">Room: {room}</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleJoin}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
            >
              ✅ Accept
            </button>
            <button
              onClick={() => setRoom(null)}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all"
            >
              ❌ Decline
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
            📵
          </div>
          <p>Waiting for incoming calls...</p>
        </div>
      )}
    </div>
  );
};

export default TrainerJoinCall;
