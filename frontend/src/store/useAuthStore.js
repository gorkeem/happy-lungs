import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import Leaderboard from "../components/Leaderboard";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    stats: null,
    users_public_stats: null, // for public profiles, need to use it in public_stats
    isCheckingAuth: true,
    isLoggingIn: false,
    isSigningUp: false,
    isLoggingOut: false,
    isUpdatingProfile: false,
    isLoadingStats: false,
    leaderboard_list: [],
    isLoadingLeaderboard: false,

    checkAuth: async () => {
        set({ isLoadingStats: true });
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
            set({ isLoadingStats: false });
        }
    },

    public_stats: async (user_id) => {
        set({ isLoadingStats: true });
        try {
            const endpoint = user_id
                ? `/dashboard/stats/${user_id}/`
                : "/dashboard/stats/";
            const response = await axiosInstance.get(endpoint);
            set({ users_public_stats: response.data });
        } catch (error) {
            console.log("Error in public_stats", error);
            set({ users_public_stats: null });
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
            await get().checkAuth();
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
            await get().checkAuth();
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
                await get().checkAuth();
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    leaderboard: async () => {
        set({ isLoadingLeaderboard: true });
        try {
            const response = await axiosInstance.get("/dashboard/leaderboard/");
            set({ leaderboard_list: response.data });
        } catch (error) {
            console.log("error in leaderboard", error);
            toast.error(
                error.response?.data?.message || "Failed to load leaderboard"
            );
        } finally {
            set({ isLoadingLeaderboard: false });
        }
    },
}));
