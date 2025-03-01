// axiosInstance.js
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://happy-lungs.onrender.com/api",
    withCredentials: true, // ensure cookies are sent
});
