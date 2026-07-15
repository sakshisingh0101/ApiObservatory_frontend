import axios from "axios";

// Backend ka base URL - .env mein VITE_API_URL set karna, jaise http://localhost:5000/api
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // httpOnly cookies (accessToken/refreshToken) automatically bhejega
});

// Response interceptor: agar access token expire ho gaya (401), automatically refresh try karo
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await client.post("/auth/refresh");
        return client(originalRequest); // original request dobara try karo naye token ke saath
      } catch (refreshError) {
        // refresh bhi fail hua - login page pe bhej do
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
