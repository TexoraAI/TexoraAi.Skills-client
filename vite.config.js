
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import dns from "node:dns";
// import path from "path";

// dns.setDefaultResultOrder("verbatim");

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
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
//     global: "globalThis",
//     "import.meta.env.VITE_GOOGLE_CLIENT_ID": JSON.stringify(
//       process.env.VITE_GOOGLE_CLIENT_ID || "",
//     ),
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes("node_modules")) {
//             // Heavy libraries alag alag
//             if (id.includes("firebase"))         return "vendor-firebase";
//             if (id.includes("@firebase"))        return "vendor-firebase";
//             if (id.includes("agora"))            return "vendor-agora";
//             if (id.includes("socket.io"))        return "vendor-socket";
//             if (id.includes("sockjs"))           return "vendor-socket";
//             if (id.includes("stomp"))            return "vendor-socket";
//             if (id.includes("chart") ||
//                 id.includes("recharts") ||
//                 id.includes("d3"))               return "vendor-charts";
//             if (id.includes("@mui") ||
//                 id.includes("@emotion"))         return "vendor-mui";
//             if (id.includes("antd") ||
//                 id.includes("@ant-design"))      return "vendor-antd";
//             if (id.includes("react-router"))     return "vendor-router";
//             if (id.includes("@react-oauth"))     return "vendor-oauth";
//             if (id.includes("axios"))            return "vendor-axios";
//             if (id.includes("react-dom"))        return "vendor-react-dom";
//             if (id.includes("react"))            return "vendor-react";
//             // Baaki sab vendor
//             return "vendor-misc";
//           }

//           // Src files role se split
//           if (id.includes("/SuperAdmin/"))       return "chunk-superadmin";
//           if (id.includes("/Business/"))         return "chunk-business";
//           if (id.includes("/Admin/"))            return "chunk-admin";
//           if (id.includes("/Trainer/"))          return "chunk-trainer";
//           if (id.includes("/Student/"))          return "chunk-student";
//         },
//       },
//     },
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
          if (id.includes("country-state-city")) return "vendor-country-data";
          if (id.includes("node_modules")) {
            if (id.includes("react-router"))    return "vendor-router";
            if (id.includes("@react-oauth"))    return "vendor-oauth";
            if (id.includes("axios"))           return "vendor-axios";
            if (id.includes("socket.io"))       return "vendor-socket";
            if (id.includes("sockjs"))          return "vendor-socket";
            if (id.includes("stomp"))           return "vendor-socket";
            if (id.includes("react-dom"))       return "vendor-react-dom";
            if (id.includes("react"))           return "vendor-react";
            return "vendor-misc";
          }
          if (id.includes("/SuperAdmin/"))      return "chunk-superadmin";
          if (id.includes("/Business/"))        return "chunk-business";
          if (id.includes("/Admin/"))           return "chunk-admin";
          if (id.includes("/Trainer/"))         return "chunk-trainer";
          if (id.includes("/Student/"))         return "chunk-student";
        },
      },
    },
  },
});