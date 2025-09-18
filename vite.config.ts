import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/public": path.resolve(__dirname, "./public"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          router: ["react-router-dom"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
