import axios from "axios";

const API = axios.create({
  baseURL: "https://expensetracker-puem.onrender.com/api",
});

// THIS RUNS AUTOMATICALLY BEFORE EVERY REQUEST:
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Attach the Bearer token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;