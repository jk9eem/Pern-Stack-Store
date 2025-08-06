import { create } from "zustand"
// setter - take the user theme and set it as the theme
// used { } to return it as an object
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("preferred-theme") || "valentine",
    setTheme: (theme) => {
        localStorage.setItem("preferred-theme", theme);
        set({ theme })
    },
}))