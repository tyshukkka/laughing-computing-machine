import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  test: {
    environment: "happy-dom", // измените с jsdom на happy-dom
    globals: true,
  },
});
