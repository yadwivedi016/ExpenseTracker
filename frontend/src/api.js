import axios from "axios";

const API = axios.create({
  baseURL: "https://expensetracker-puem.onrender.com/api",
});

// This interceptor runs BEFORE every API request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;