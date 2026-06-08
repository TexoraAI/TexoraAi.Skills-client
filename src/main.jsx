
/**
 * main.jsx  —  AvatarProvider ko yahan wrap karo (sirf ek baar)
 *
 * ✅ AvatarProvider poore app ke upar hai
 * ✅ Navbar, Sidebar, ProfilePage — sab ek hi context share karte hain
 * ✅ Image upload → instantly sab jagah update
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// ✅ Shared context — src/context/AvatarContext.js
import { AvatarProvider } from "./context/AvatarContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ AvatarProvider sabse bahar — Navbar, Sidebar, ProfilePage sab cover ho jaate hain */}
    <AvatarProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AvatarProvider>
  </React.StrictMode>
);