import axios from "axios";

// same pattern as the client app, kept as a separate file since the
// admin dashboard is a fully separate app with its own login session
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
