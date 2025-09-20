import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "lucide-react",
            "@radix-ui/react-dialog",
            "@radix-ui/react-toast",
          ],
        },
      },
    },
    cssCodeSplit: false,
    minify: true,
  },
  css: {
    devSourcemap: true,
  },
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000",
    },
  },
});
