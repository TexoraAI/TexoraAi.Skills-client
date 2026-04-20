import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";

// ✅ Matches your authService API_BASE_URL pattern
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";
const WS_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:9000").replace(
    "/api",
    "",
  ) + "/ws";

// ─── Token — matches authService.getToken() ──────────────────
const getToken = () => localStorage.getItem("lms_token"); // ✅ fixed

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ─────────────────────────────────────────────────────────────
//  REST API CALLS
// ─────────────────────────────────────────────────────────────

export const fetchMyNotifications = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/my`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchMyNotifications error:", err);
    return [];
  }
};

export const fetchUnreadCount = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/unread-count`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.count ?? 0;
  } catch (err) {
    console.error("fetchUnreadCount error:", err);
    return 0;
  }
};

export const markOneRead = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/${id}/read`, {
      method: "PUT",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error("markOneRead error:", err);
  }
};

export const markAllReadAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/read-all`, {
      method: "PUT",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error("markAllReadAPI error:", err);
  }
};

// ─── NEW: permanently delete all notifications from DB ───────
export const clearAllNotificationsAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/clear-all`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error("clearAllNotificationsAPI error:", err);
  }
};



// ─────────────────────────────────────────────────────────────
//  NEW: FCM DEVICE TOKEN ENDPOINTS
// ─────────────────────────────────────────────────────────────

// Called by firebaseService.registerFcmToken() after login
// POST /api/notification/register-token
// Body: { fcmToken: string, deviceType: "WEB" | "ANDROID" | "IOS" }
export const registerDeviceToken = async (fcmToken, deviceType = "WEB") => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/register-token`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ fcmToken, deviceType }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("✅ Device token registered");
  } catch (err) {
    console.error("registerDeviceToken error:", err);
  }
};

// Called by firebaseService.unregisterFcmToken() on logout
// DELETE /api/notification/remove-token
// Body: { fcmToken: string }
export const removeDeviceToken = async (fcmToken) => {
  try {
    const res = await fetch(`${API_BASE_URL}/notification/remove-token`, {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ fcmToken }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log("🗑️ Device token removed");
  } catch (err) {
    console.error("removeDeviceToken error:", err);
  }
};
// ─────────────────────────────────────────────────────────────
//  WEBSOCKET
// ─────────────────────────────────────────────────────────────

let stompClient = null;

export const connectWebSocket = ({ userEmail, userRole, onMessage }) => {
  if (stompClient?.active) return;

  console.log("🔌 Connecting WebSocket to:", WS_URL);

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    connectHeaders: {
      Authorization: `Bearer ${getToken()}`,
    },
    reconnectDelay: 10000,

    onConnect: () => {
      console.log("✅ WebSocket connected");

      // Personal notifications
      if (userEmail) {
        stompClient.subscribe(
          `/topic/notifications/user/${userEmail}`,
          (msg) => {
            try {
              onMessage(JSON.parse(msg.body));
            } catch (e) {
              console.error("Parse error:", e);
            }
          },
        );
        console.log("📬 Subscribed to user:", userEmail);
      }

      // Role-based notifications
      if (userRole) {
        stompClient.subscribe(
          `/topic/notifications/role/${userRole.toUpperCase()}`,
          (msg) => {
            try {
              onMessage(JSON.parse(msg.body));
            } catch (e) {
              console.error("Parse error:", e);
            }
          },
        );
        console.log("📢 Subscribed to role:", userRole);
      }
    },

    onDisconnect: () => console.log("🔌 WebSocket disconnected"),
    onStompError: (f) => console.error("❌ STOMP error:", f.headers?.message),
    onWebSocketError: (e) => console.error("❌ WS error:", e),
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient?.active) {
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 WebSocket manually disconnected");
  }
};