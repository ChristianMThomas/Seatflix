import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SEATFLIX_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Authorization header added to request:", config.url);
    } else {
      console.warn("⚠️ No auth token found for request:", config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth on 401 if it's actually an auth error, not a network error
    if (error.response?.status === 401) {
      console.warn("🚫 Received 401 Unauthorized - clearing auth and redirecting to login");
      // Clear token and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      // Use "/" instead of "/login" to match the route in App.jsx
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  register: `/api/v1/users/register`,
  login: `/api/v1/users/login`,
  uploadAvatar: `/api/v1/users/upload-avatar`,
  getUser: `/api/v1/users`,
  getCurrentUser: `/api/v1/users/me`,
};

export default api;
