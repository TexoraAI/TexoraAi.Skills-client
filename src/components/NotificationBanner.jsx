import { useEffect, useState } from "react";
import { registerFcmToken } from "../../services/firebaseService";

export default function NotificationBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner only if permission not yet decided
    if (Notification.permission === "default") {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    setShow(false);
    const token = await registerFcmToken(); // ← now triggered by user click ✅
    if (!token) {
      console.warn("FCM token not obtained");
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: "#1e293b", color: "#fff", padding: "14px 20px",
      borderRadius: 12, display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)", zIndex: 9999,
      fontFamily: "DM Sans, sans-serif", fontSize: "0.88rem", whiteSpace: "nowrap"
    }}>
      🔔 <span>Enable notifications to get video & course alerts</span>
      <button onClick={handleEnable} style={{
        background: "#F97316", color: "#fff", border: "none",
        borderRadius: 8, padding: "7px 16px", cursor: "pointer",
        fontWeight: 700, fontSize: "0.82rem"
      }}>
        Enable
      </button>
      <button onClick={() => setShow(false)} style={{
        background: "none", border: "none", color: "#94a3b8",
        cursor: "pointer", fontSize: "1rem"
      }}>✕</button>
    </div>
  );
}