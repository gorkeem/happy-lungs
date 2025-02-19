import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    stats: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    isLoadingStats: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/dashboard/auth/check/");
            set({
                authUser: response.data.user,
                stats: response.data.stats || null,
            });
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null, stats: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    public_stats: async (user_id) => {
        set({ isLoadingStats: true });
        try {
            const endpoint = user_id
                ? `/dashboard/stats/${user_id}/`
                : "/stats/";
            const response = await axiosInstance.get(endpoint);
            set({ stats: response.data });
        } catch (error) {
            console.log("Error in public_stats", error);
            set({ stats: null });
        } finally {
            set({ isLoadingStats: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post(
                "/dashboard/auth/register/",
                data
            );
            set({ authUser: response.data.user });
            toast.success("Account created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post(
                "/dashboard/auth/login/",
                data
            );
            set({ authUser: response.data.user });
            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/dashboard/auth/logout/");
            set({ authUser: null, stats: null });
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        } finally {
            set({ isLoggingOut: false });
        }
    },

    update_profile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put(
                "/dashboard/auth/update/",
                data
            );
            set({ authUser: { ...get().authUser, ...data } });

            if ("quit_date" in data || "cigs_per_day" in data) {
                await get().public_stats();
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));
