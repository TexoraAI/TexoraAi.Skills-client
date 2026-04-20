// import { Bell, Menu } from "lucide-react";
// import React, { useState } from "react";
// import { useLocation, useNavigate, Outlet } from "react-router-dom";

// const DashboardLayout = ({ SidebarComponent }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const base = "/" + location.pathname.split("/")[1];

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const closeSidebar  = () => setSidebarOpen(false);

//   return (
//     <div className="h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
//       <div className="flex h-full overflow-hidden">

//         {/* MOBILE OVERLAY */}
//         {sidebarOpen && (
//           <div
//             onClick={closeSidebar}
//             className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           />
//         )}

//         {/* SIDEBAR */}
//         <aside
//           className={`
//             fixed md:static z-40
//             top-0 left-0 h-full
//             w-64 md:w-auto
//             transform transition-transform duration-300
//             ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//             md:translate-x-0
//           `}
//         >
//           {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
//         </aside>

//         {/* RIGHT SIDE */}
//         <div className="flex flex-col flex-1 md:ml-0 min-w-0">

//           {/* TOPBAR */}
//           <div
//             className="
//               h-16 flex items-center justify-between
//               px-4 md:px-6
//               bg-white dark:bg-black
//               border-b border-slate-200 dark:border-[#1a1a1a]
//             "
//           >
//             {/* LEFT */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleSidebar}
//                 className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
//               >
//                 <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
//               </button>
//             </div>

//             {/* RIGHT */}
//             <div className="flex items-center gap-3 ml-auto">
//               {/* NOTIFICATION */}
//               <button
//                 onClick={() => navigate(`${base}/notifications`)}
//                 className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
//               >
//                 <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
//                 <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
//               </button>

//               {/* PROFILE AVATAR */}
//               <button
//                 onClick={() => navigate(`${base}/profile`)}
//                 className="w-9 h-9 rounded-full
//                   bg-gradient-to-br from-blue-600 to-indigo-600
//                   hover:opacity-90 transition
//                   text-white font-semibold text-sm
//                   flex items-center justify-center shadow-md"
//               >
//                 S
//               </button>
//             </div>
//           </div>

//           {/* PAGE CONTENT */}
//           <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
//             <Outlet />
//           </main>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;





















import { Bell, Menu, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { onForegroundMessage, registerFcmToken } from "../services/firebaseService";

// ─────────────────────────────────────────────
// Notification permission banner (shown once
// when permission is still "default").
// Must be triggered by a real user click so
// the browser allows the permission prompt.
// ─────────────────────────────────────────────
const NotificationBanner = () => {
  const [show, setShow] = useState(false);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    // Only show if user hasn't decided yet
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      setShow(true);
    }
  }, []);

  const handleEnable = async () => {
    setAsking(true);
    try {
      const token = await registerFcmToken(); // ← user click triggers this safely
      if (token) {
        console.log("✅ FCM registered:", token);
      }
    } catch (err) {
      console.error("FCM error:", err);
    } finally {
      setShow(false);
      setAsking(false);
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position:       "fixed",
      bottom:         24,
      left:           "50%",
      transform:      "translateX(-50%)",
      background:     "#1e293b",
      color:          "#f8fafc",
      padding:        "13px 18px",
      borderRadius:   14,
      display:        "flex",
      alignItems:     "center",
      gap:            12,
      boxShadow:      "0 8px 32px rgba(0,0,0,0.28)",
      border:         "1px solid rgba(255,255,255,0.08)",
      zIndex:         9998,
      fontFamily:     "DM Sans, sans-serif",
      fontSize:       "0.86rem",
      whiteSpace:     "nowrap",
      animation:      "bnrIn 0.35s ease",
    }}>
      <style>{`
        @keyframes bnrIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <span style={{ fontSize: 18 }}>🔔</span>
      <span style={{ color: "#cbd5e1" }}>
        Enable notifications to get video &amp; course alerts
      </span>

      <button
        onClick={handleEnable}
        disabled={asking}
        style={{
          background:   "#F97316",
          color:        "#fff",
          border:       "none",
          borderRadius: 8,
          padding:      "7px 16px",
          cursor:       asking ? "not-allowed" : "pointer",
          fontWeight:   700,
          fontSize:     "0.82rem",
          opacity:      asking ? 0.7 : 1,
          fontFamily:   "inherit",
          whiteSpace:   "nowrap",
        }}
      >
        {asking ? "Enabling…" : "Enable"}
      </button>

      <button
        onClick={() => setShow(false)}
        style={{
          background: "none",
          border:     "none",
          color:      "#64748b",
          cursor:     "pointer",
          display:    "flex",
          alignItems: "center",
          padding:    0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main layout
// ─────────────────────────────────────────────
const DashboardLayout = ({ SidebarComponent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/" + location.pathname.split("/")[1];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast,       setToast]       = useState(null);
  const toastTimer = useRef(null);

  // Firebase foreground push notifications
  useEffect(() => {
    onForegroundMessage((payload) => {
      const title = payload.notification?.title || "New Notification";
      const body  = payload.notification?.body  || "";
      showToast(`🔔 ${title}: ${body}`);
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const toggleSidebar = () => setSidebarOpen((o) => !o);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <div className="h-screen bg-white text-slate-900 dark:bg-black dark:text-white">
      <div className="flex h-full overflow-hidden">

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static z-40
            top-0 left-0 h-full
            w-64 md:w-auto
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
          `}
        >
          {SidebarComponent && <SidebarComponent closeSidebar={closeSidebar} />}
        </aside>

        {/* RIGHT SIDE */}
        <div className="flex flex-col flex-1 md:ml-0 min-w-0">

          {/* TOPBAR */}
          <div className="h-16 flex items-center justify-between
            px-4 md:px-6
            bg-white dark:bg-black
            border-b border-slate-200 dark:border-[#1a1a1a]">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 ml-auto">

              {/* NOTIFICATION BELL */}
              <button
                onClick={() => navigate(`${base}/notifications`)}
                className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* PROFILE AVATAR */}
              <button
                onClick={() => navigate(`${base}/profile`)}
                className="w-9 h-9 rounded-full
                  bg-gradient-to-br from-blue-600 to-indigo-600
                  hover:opacity-90 transition
                  text-white font-semibold text-sm
                  flex items-center justify-center shadow-md"
              >
                S
              </button>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ── Notification permission banner ── */}
      <NotificationBanner />

      {/* ── Foreground push toast ── */}
      {toast && (
        <div
          onClick={() => {
            setToast(null);
            navigate(`${base}/notifications`);
          }}
          style={{
            position:     "fixed",
            bottom:       24,
            right:        24,
            zIndex:       9999,
            background:   "#1e293b",
            color:        "#f8fafc",
            padding:      "12px 18px",
            borderRadius: 14,
            fontSize:     13,
            fontWeight:   600,
            maxWidth:     340,
            boxShadow:    "0 8px 32px rgba(0,0,0,0.25)",
            border:       "1px solid rgba(255,255,255,0.08)",
            display:      "flex",
            alignItems:   "center",
            gap:          10,
            animation:    "slideUp 0.3s ease",
            cursor:       "pointer",
          }}
        >
          <span style={{ fontSize: 18 }}>🔔</span>
          <span>{toast}</span>
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(16px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;