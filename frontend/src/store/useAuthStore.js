import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    stats: null,
    users_public_stats: null,
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
            toast.error("Failed to load profile");
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
            const { access, refresh } = response.data;
            if (access) {
                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${access}`;
            }
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
            if (error.response?.status === 401) {
                document.cookie = "access=; Max-Age=0; path=/";
                document.cookie = "refresh=; Max-Age=0; path=/";
                await get().logout();
            }

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
            console.log("📤 Sending update payload:", data);
            const response = await axiosInstance.put(
                "/dashboard/auth/update/",
                data
            );
            console.log("✅ Update response:", response);

            set({ authUser: { ...get().authUser, ...data } });
            if ("quit_date" in data || "cigs_per_day" in data) {
                await get().checkAuth();
            }
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("❌ Update failed:", error.response?.data);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    delete_account: async () => {
        try {
            await axiosInstance.delete("/dashboard/auth/delete/");
            set({ authUser: null, stats: null });
            toast.success("Account deleted successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Account deletion failed"
            );
        }
    },

    relapse: async () => {
        try {
            const response = await axiosInstance.post(
                "/dashboard/auth/relapse/"
            );
            toast.success(
                response.data.message || "Relapsed successfully. Stats reset!"
            );
            await get().checkAuth(); // Refresh stats
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to relapse");
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
