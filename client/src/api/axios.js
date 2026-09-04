import axios from "axios";

// central axios instance so the base URL only lives in one place
// falls back to the deployed Render API if no env var is set at build time
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://airbnb-clone-api-0xoz.onrender.com/api",
});

// automatically attach the saved token to every request, if one exists
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("airbnbUser");
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("airbnbUser");
    }
  }
  return config;
});

export default api;
