import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      // Forward every /api request to the Railway backend.
      // The browser only sees requests to localhost → no CORS issues.
      "/api": {
        target: "https://ecochainbackend-production.up.railway.app",
        changeOrigin: true,  // rewrites the Host header to match the target
        secure: true,        // validate SSL certificate
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
