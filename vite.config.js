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
    global: "globalThis",
    "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
      process.env.VITE_GOOGLE_CLIENT_ID || "",
    ),
  },
  optimizeDeps: {
    exclude: ["country-state-city"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ✅ country-state-city pehle check karo (heavy data library)
          if (id.includes("country-state-city")) return "vendor-country-data";

          if (id.includes("node_modules")) {
            // ✅ react + react-dom + scheduler SATH rakho — kabhi alag mat karo
            if (
              id.includes("/react-dom/") ||
              id.includes("/react/") ||
              id.includes("/scheduler/")
            ) return "vendor-react";

            if (id.includes("react-router"))  return "vendor-router";
            if (id.includes("@react-oauth"))  return "vendor-oauth";
            if (id.includes("axios"))         return "vendor-axios";
            if (
              id.includes("socket.io") ||
              id.includes("sockjs") ||
              id.includes("stomp")
            ) return "vendor-socket";

            // ✅ Baaki sab ek chunk mein
            return "vendor-misc";
          }

          // ✅ Route-based chunks — shared components ko mat assign karo
          if (id.includes("/pages/SuperAdmin/")) return "chunk-superadmin";
          if (id.includes("/pages/Business/"))   return "chunk-business";
          if (id.includes("/pages/Admin/"))      return "chunk-admin";
          if (id.includes("/pages/Trainer/"))    return "chunk-trainer";
          if (id.includes("/pages/Student/"))    return "chunk-student";

          // shared components, hooks, services — main bundle mein rahenge
        },
      },
    },
  },
});