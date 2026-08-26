import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// the dev server runs on 5173, this matches CLIENT_URL in the backend .env
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
