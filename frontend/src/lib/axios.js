// axiosInstance.js
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:8000/api"
            : "/api",
    withCredentials: true, // ensure cookies are sent
});

// Interceptor: if a response comes back 401, try refreshing the token.
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post("/dashboard/auth/refresh/");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.log("Token refresh failed, logging out.");
                useAuthStore.getState().logout();
                toast.error("Session expired. Please log in again.");
            }
        }
        return Promise.reject(error);
    }
);
