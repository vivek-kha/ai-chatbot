// frontend/src/api/adminApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const adminApi = axios.create({
  baseURL: `${BASE_URL}/admin`,
});

// Attach auth token (if you have login)
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // or whatever you use
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;

