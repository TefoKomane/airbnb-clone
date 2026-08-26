import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// runs on 5174 so it never collides with the guest client on 5173
// this matches ADMIN_URL in the backend .env
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
});
