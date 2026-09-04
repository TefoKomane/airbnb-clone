import axios from "axios";

// central axios instance — base URL is hardcoded to the production API
// so the app works on Vercel without any environment variable configuration
const api = axios.create({
  baseURL: "https://airbnb-clone-api-0xoz.onrender.com/api",
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
