import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import axios from "axios";

const firebaseConfig = {
  apiKey:            "AIzaSyBxJu_ouuACgbZqTfcY-haf85ImBvgeTA4",
  authDomain:        "lms-notifications-fa6a8.firebaseapp.com",
  projectId:         "lms-notifications-fa6a8",
  storageBucket:     "lms-notifications-fa6a8.firebasestorage.app",
  messagingSenderId: "515851866451",
  appId:             "1:515851866451:web:f55886bc38b68dd18891a6",
  measurementId:     "G-2Q9GPS2J82",
};

const VAPID_KEY =
  "BB1p9_1NaGuEmy7ukpNsQZuxU2pLRo7wXGghduqCEO6gA-GVKuYXvoFbFYSLtwcUM53AsNOgEqvsWU5woKQ2yWY";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

let messaging;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (err) {
  console.error("Firebase init error:", err);
}

const getJwt = () => localStorage.getItem("lms_token");

// Detect role from URL path
const detectRole = () => {
  const path = window.location.pathname;
  if (path.startsWith("/trainer"))  return "TRAINER";
  if (path.startsWith("/admin"))    return "ADMIN";
  if (path.startsWith("/business")) return "BUSINESS";
  return "STUDENT";
};

export const registerFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );
    console.log("✅ FCM SW registered:", registration.scope);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("⚠️ No FCM token received");
      return null;
    }

    const userRole = detectRole();

    // ✅ Always register — backend updates email+role if token already exists
    // This handles: same device different account, multiple devices same account
    await axios.post(
      `${API_BASE_URL}/notification/register-token`,
      { fcmToken: token, deviceType: "WEB", userRole },
      { headers: { Authorization: `Bearer ${getJwt()}` } }
    );

    localStorage.setItem("fcm_token", token);
    console.log("✅ FCM token registered, role:", userRole);
    return token;

  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};

// ✅ FIX: on logout — do NOT delete from DB
// Token stays so device keeps receiving FCM pushes
// On next login registerFcmToken updates email+role automatically
export const unregisterFcmToken = async () => {
  localStorage.removeItem("fcm_token");
  console.log("🔕 FCM token cleared from localStorage");
};

export const onForegroundMessage = (callback) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground FCM:", payload);
    callback(payload);
  });
};