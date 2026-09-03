import axios from "axios";

// central axios instance so the base URL only lives in one place
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
