// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App.jsx";

// // ✅ Shared context — src/context/AvatarContext.js
// import { AvatarProvider } from "./context/AvatarContext.jsx";

// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     {/* ✅ AvatarProvider sabse bahar — Navbar, Sidebar, ProfilePage sab cover ho jaate hain */}
//     <AvatarProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </AvatarProvider>
//   </React.StrictMode>
// );





























import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// ✅ Shared context — src/context/AvatarContext.js
import { AvatarProvider } from "./context/AvatarContext.jsx";

// ✅ NEW — Live meeting context (owns the LiveKit Room connection).
// Must sit ABOVE <BrowserRouter> so navigating between dashboard pages
// (sidebar clicks, route changes) never unmounts it and never tears
// down/disconnects the active meeting. This is what makes the floating
// Dashboard PiP possible for both student and trainer.
import { LiveMeetingProvider } from "./context/LiveMeetingContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ AvatarProvider sabse bahar — Navbar, Sidebar, ProfilePage sab cover ho jaate hain */}
    <AvatarProvider>
      {/* ✅ LiveMeetingProvider — router ke upar, taaki route change par
          meeting/Room connection kabhi disconnect na ho */}
      <LiveMeetingProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LiveMeetingProvider>
    </AvatarProvider>
  </React.StrictMode>
);