
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import dns from "node:dns";
// import path from "path"; // ✅ ADD THIS

// dns.setDefaultResultOrder("verbatim");

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"), // ✅ ADD THIS
//     },
//   },
//   server: {
//     port: 5173,
//     strictPort: true,
//     headers: {
//       "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
//       "Cross-Origin-Embedder-Policy": "unsafe-none",
//     },
//   },
//   define: {
//     "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
//       process.env.VITE_GOOGLE_CLIENT_ID || ""
//     ),
//   },
// });










import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "node:dns";
import path from "path";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  define: {
    global: "globalThis", // ✅ ADD THIS LINE — fixes sockjs-client error
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
      process.env.VITE_GOOGLE_CLIENT_ID || "",
    ),
  },
});