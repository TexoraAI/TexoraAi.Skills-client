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
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-misc":  ["axios", "@react-oauth/google"],
        },
      },
    },
  },
});