import axios from "axios";

// same pattern as the client — hardcoded to production API
// no environment variable needed on Vercel
const api = axios.create({
  baseURL: "https://airbnb-clone-api-0xoz.onrender.com/api",
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
