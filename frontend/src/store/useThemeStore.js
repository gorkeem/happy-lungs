import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
    persist(
        (set) => ({
            lightTheme: true,
            setLightTheme: (lightTheme) => {
                set({ lightTheme });
                document.documentElement.setAttribute(
                    "data-theme",
                    lightTheme ? "cupcake" : "night"
                );
            },
        }),
        {
            name: "theme-store", // key in localStorage
            getStorage: () => localStorage,
        }
    )
);
