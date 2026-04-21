// // public/firebase-messaging-sw.js
// // This file MUST be at the root of your built site: /dist/firebase-messaging-sw.js
// // It handles FCM push notifications when the tab is closed or minimized.

// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey:            "AIzaSyBxJu_ouuACgbZqTfcY-haf85ImBvgeTA4",
//   authDomain:        "lms-notifications-fa6a8.firebaseapp.com",
//   projectId:         "lms-notifications-fa6a8",
//   storageBucket:     "lms-notifications-fa6a8.firebasestorage.app",
//   messagingSenderId: "515851866451",
//   appId:             "1:515851866451:web:f55886bc38b68dd18891a6",
// });

// const messaging = firebase.messaging();

// // ── Background message handler ─────────────────────────────────
// // Fires when app is minimized, tab is hidden, or browser is closed
// messaging.onBackgroundMessage((payload) => {
//   console.log("[SW] Background FCM received:", payload);

//   const title = payload.notification?.title
//     || payload.data?.title
//     || "New Notification";

//   const body = payload.notification?.body
//     || payload.data?.body
//     || "";

//   const type = payload.data?.type || "DEFAULT";

//   const options = {
//     body,
//     icon:  "/logo.png",   // update to your actual logo path in /public
//     badge: "/logo.png",
//     tag:   type,          // groups same-type notifications (replaces old ones)
//     data: {
//       url: "/student/notifications", // clicked notification opens this URL
//       type,
//     },
//     actions: [
//       { action: "view", title: "View" },
//       { action: "dismiss", title: "Dismiss" },
//     ],
//     requireInteraction: false, // set true to keep notification until clicked
//   };

//   self.registration.showNotification(title, options);
// });

// // ── Notification click handler ─────────────────────────────────
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   if (event.action === "dismiss") return;

//   const targetUrl = event.notification.data?.url || "/";

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         // If the app is already open, focus it and navigate
//         for (const client of clientList) {
//           if (client.url.includes(self.location.origin) && "focus" in client) {
//             client.focus();
//             client.navigate(targetUrl);
//             return;
//           }
//         }
//         // Otherwise open a new tab
//         if (clients.openWindow) {
//           return clients.openWindow(targetUrl);
//         }
//       })
//   );
// });










// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:            "AIzaSyBxJu_ouuACgbZqTfcY-haf85ImBvgeTA4",
  authDomain:        "lms-notifications-fa6a8.firebaseapp.com",
  projectId:         "lms-notifications-fa6a8",
  storageBucket:     "lms-notifications-fa6a8.firebasestorage.app",
  messagingSenderId: "515851866451",
  appId:             "1:515851866451:web:f55886bc38b68dd18891a6",
});

const messaging = firebase.messaging();

// ── Background message handler ─────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background FCM received:", payload);

  const title = payload.notification?.title
    || payload.data?.title
    || "New Notification";

  const body = payload.notification?.body
    || payload.data?.body
    || "";

  const type      = payload.data?.type || "DEFAULT";
  // ✅ FIX 2: Read role from FCM payload data so URL is role-aware
  const userRole  = payload.data?.userRole || "student"; // trainer / student / admin

  // ✅ FIX 3: Role-aware click URL
  const notifUrl = userRole === "trainer"
    ? "/trainer/notifications"
    : userRole === "admin"
      ? "/admin/notifications"
      : userRole === "business"
        ? "/business/notifications"
        : "/student/notifications";

  const options = {
    body,
    icon:  "/logo.png",
    badge: "/logo.png",
    tag:   type,
    data: {
      url: notifUrl,
      type,
    },
    actions: [
      { action: "view",    title: "View"    },
      { action: "dismiss", title: "Dismiss" },
    ],
    // ✅ FIX 4: requireInteraction = true → notification stays until user clicks it
    requireInteraction: true,
  };

  self.registration.showNotification(title, options);
});

// ── Notification click handler ─────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.navigate(targetUrl);
            return;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});