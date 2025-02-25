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

        // Avoid infinite loops.
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call your refresh endpoint. This should update the cookies.
                await axiosInstance.post("/dashboard/auth/refresh/");
                // Retry original request after refresh.
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, propagate the error.
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
