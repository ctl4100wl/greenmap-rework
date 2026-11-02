import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// base "./" keeps every URL relative, so the build works at
// ctl4100wl.github.io/greenmap-rework/ and on the workers.dev backup alike.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("html5-qrcode")) return "scanner";
          if (id.includes("node_modules/qrcode")) return "qrcode";
        },
      },
    },
  },
});
