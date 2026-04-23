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

const VAPID_KEY = "BB1p9_1NaGuEmy7ukpNsQZuxU2pLRo7wXGghduqCEO6gA-GVKuYXvoFbFYSLtwcUM53AsNOgEqvsWU5woKQ2yWY";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

let messaging;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
} catch (err) {
  console.error("Firebase init error:", err);
}

const getJwt = () => localStorage.getItem("lms_token");

export const registerFcmToken = async () => {
  try {
    // 1. Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    // 2. Register the service worker explicitly  ← THIS WAS MISSING
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" }
    );
    console.log("✅ Service Worker registered:", registration.scope);

    // 3. Get FCM token and pass the SW registration
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration, // ← KEY FIX
    });

    if (!token) {
      console.warn("⚠️ No FCM token received");
      return null;
    }

    console.log("✅ FCM Token:", token);

    // 4. Send token to your backend
    await axios.post(
      `${API_BASE_URL}/notification/register-token`,
      { fcmToken: token, deviceType: "WEB" },
      { headers: { Authorization: `Bearer ${getJwt()}` } }
    );

    localStorage.setItem("fcm_token", token);
    return token;

  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
};

export const unregisterFcmToken = async () => {
  try {
    const token = localStorage.getItem("fcm_token");
    if (!token) return;

    await axios.delete(
      `${API_BASE_URL}/notification/remove-token`,
      {
        data:    { fcmToken: token },
        headers: { Authorization: `Bearer ${getJwt()}` },
      }
    );

    localStorage.removeItem("fcm_token");
    console.log("🗑️ FCM token removed");
  } catch (err) {
    console.error("FCM unregister error:", err);
  }
};

export const onForegroundMessage = (callback) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground FCM:", payload);
    callback(payload);
  });
};



















// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import axios from "axios";

// const firebaseConfig = {
//   apiKey:            "AIzaSyBxJu_ouuACgbZqTfcY-haf85ImBvgeTA4",
//   authDomain:        "lms-notifications-fa6a8.firebaseapp.com",
//   projectId:         "lms-notifications-fa6a8",
//   storageBucket:     "lms-notifications-fa6a8.firebasestorage.app",
//   messagingSenderId: "515851866451",
//   appId:             "1:515851866451:web:f55886bc38b68dd18891a6",
//   measurementId:     "G-2Q9GPS2J82",
// };

// const VAPID_KEY =
//   "BB1p9_1NaGuEmy7ukpNsQZuxU2pLRo7wXGghduqCEO6gA-GVKuYXvoFbFYSLtwcUM53AsNOgEqvsWU5woKQ2yWY";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api";

// let messaging;
// try {
//   const app = initializeApp(firebaseConfig);
//   messaging = getMessaging(app);
// } catch (err) {
//   console.error("Firebase init error:", err);
// }

// const getJwt = () => localStorage.getItem("lms_token");

// // ✅ Detect role from current URL path
// const detectRole = () => {
//   const path = window.location.pathname;
//   if (path.startsWith("/trainer"))  return "TRAINER";
//   if (path.startsWith("/admin"))    return "ADMIN";
//   if (path.startsWith("/business")) return "BUSINESS";
//   return "STUDENT";
// };

// export const registerFcmToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.warn("❌ Notification permission denied");
//       return null;
//     }

//     const registration = await navigator.serviceWorker.register(
//       "/firebase-messaging-sw.js",
//       { scope: "/" }
//     );
//     console.log("✅ FCM SW registered:", registration.scope);

//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//       serviceWorkerRegistration: registration,
//     });

//     if (!token) {
//       console.warn("⚠️ No FCM token received");
//       return null;
//     }

//     console.log("✅ FCM Token obtained");

//     const userRole = detectRole();

//     // ✅ Always call register — backend will UPDATE if token already exists
//     // This ensures email/role stays current even after switching accounts
//     await axios.post(
//       `${API_BASE_URL}/notification/register-token`,
//       { fcmToken: token, deviceType: "WEB", userRole },
//       { headers: { Authorization: `Bearer ${getJwt()}` } }
//     );

//     localStorage.setItem("fcm_token", token);
//     console.log("✅ FCM token registered for role:", userRole);
//     return token;

//   } catch (err) {
//     console.error("FCM token error:", err);
//     return null;
//   }
// };

// // ✅ FIX: On logout — do NOT delete token from DB
// // The device should still receive notifications if someone else logs in
// // Token stays in DB and gets updated with new email/role on next login
// export const unregisterFcmToken = async () => {
//   // Just clear from localStorage — backend keeps the token
//   // so the device can still receive FCM pushes
//   localStorage.removeItem("fcm_token");
//   console.log("🔕 FCM token cleared from localStorage (kept in DB for device)");
// };

// export const onForegroundMessage = (callback) => {
//   if (!messaging) return;
//   onMessage(messaging, (payload) => {
//     console.log("📩 Foreground FCM:", payload);
//     callback(payload);
//   });
// };



