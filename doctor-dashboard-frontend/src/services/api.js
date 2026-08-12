import axios from "axios";

// ==============================
// Axios Instance
// ==============================

const api = axios.create({
  baseURL: "https://docter-dashboard-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ==============================
// Request Interceptor
// Automatically Add JWT Token
// ==============================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Interceptor Token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// Handle Unauthorized Access
// ==============================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;