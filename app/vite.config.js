import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/images": "http://localhost:8000",
      "/uploads": "http://localhost:8000",
    },
  },
});
