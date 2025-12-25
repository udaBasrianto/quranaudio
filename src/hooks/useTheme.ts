import { useState, useEffect } from "react";

type Theme = "light" | "dark";
export type ThemeColor = "green" | "blue" | "purple" | "orange" | "red" | "teal";

const THEME_KEY = "quran-audio-theme";
const COLOR_KEY = "quran-audio-color";

export const themeColors: { id: ThemeColor; name: string; hue: number }[] = [
  { id: "green", name: "Hijau", hue: 160 },
  { id: "blue", name: "Biru", hue: 220 },
  { id: "purple", name: "Ungu", hue: 270 },
  { id: "orange", name: "Oranye", hue: 25 },
  { id: "red", name: "Merah", hue: 0 },
  { id: "teal", name: "Teal", hue: 180 },
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_KEY) as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(COLOR_KEY) as ThemeColor;
      if (stored) return stored;
    }
    return "green";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const colorConfig = themeColors.find((c) => c.id === themeColor);
    if (colorConfig) {
      const hue = colorConfig.hue;
      // Light mode colors
      root.style.setProperty("--primary", `${hue} 84% 28%`);
      root.style.setProperty("--ring", `${hue} 84% 28%`);
      root.style.setProperty("--sidebar-primary", `${hue} 84% 28%`);
      root.style.setProperty("--sidebar-ring", `${hue} 84% 28%`);
      
      if (theme === "dark") {
        root.style.setProperty("--primary", `${hue} 70% 45%`);
        root.style.setProperty("--ring", `${hue} 70% 45%`);
        root.style.setProperty("--sidebar-primary", `${hue} 70% 45%`);
        root.style.setProperty("--sidebar-ring", `${hue} 70% 45%`);
      }
    }
    localStorage.setItem(COLOR_KEY, themeColor);
  }, [themeColor, theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme, themeColor, setThemeColor };
}
