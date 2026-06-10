import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://library-management-system-production-bbaf.up.railway.app",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      localStorage.removeItem("isLogin");
      // Prevent redirect loops on login page itself
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
