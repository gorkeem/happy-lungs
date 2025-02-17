import create from "zustand";

const useAuthStore = create((set) => ({
    authUser: null,
    setAuthUser: (user) => set({ authUser: user }),

    checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) return set({ authUser: null });
        try {
            const res = await fetch("/api/me", {
                headers: {
                    authorization: `bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                set({ authUser: data.user });
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            set({ authUser: null });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ authUser: null });
    },
}));

export default useAuthStore;
