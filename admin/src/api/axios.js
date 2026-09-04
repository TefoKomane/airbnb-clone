import axios from "axios";

// same pattern as the client app — falls back to deployed Render API
// if no VITE_API_URL env var is configured at build time
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://airbnb-clone-api-0xoz.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const storedAdmin = localStorage.getItem("airbnbAdmin");
  if (storedAdmin) {
    try {
      const { token } = JSON.parse(storedAdmin);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("airbnbAdmin");
    }
  }
  return config;
});

export default api;
