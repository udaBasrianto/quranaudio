import { useState, useEffect } from "react";

type Theme = "light" | "dark";
export type ThemeColor = "green" | "blue" | "purple" | "orange" | "red" | "teal";
export type FontSize = "small" | "medium" | "large" | "xlarge";

const THEME_KEY = "quran-audio-theme";
const COLOR_KEY = "quran-audio-color";
const FONT_SIZE_KEY = "quran-arabic-font-size";

export const themeColors: { id: ThemeColor; name: string; hue: number }[] = [
  { id: "green", name: "Hijau", hue: 160 },
  { id: "blue", name: "Biru", hue: 220 },
  { id: "purple", name: "Ungu", hue: 270 },
  { id: "orange", name: "Oranye", hue: 25 },
  { id: "red", name: "Merah", hue: 0 },
  { id: "teal", name: "Teal", hue: 180 },
];

export const fontSizes: { id: FontSize; name: string; size: string; mobileSize: string }[] = [
  { id: "small", name: "Kecil", size: "1.5rem", mobileSize: "1.25rem" },
  { id: "medium", name: "Sedang", size: "2rem", mobileSize: "1.5rem" },
  { id: "large", name: "Besar", size: "2.5rem", mobileSize: "2rem" },
  { id: "xlarge", name: "Sangat Besar", size: "3rem", mobileSize: "2.5rem" },
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

  const [arabicFontSize, setArabicFontSize] = useState<FontSize>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FONT_SIZE_KEY) as FontSize;
      if (stored) return stored;
    }
    return "medium";
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

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, arabicFontSize);
  }, [arabicFontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const getArabicFontStyle = () => {
    const config = fontSizes.find((f) => f.id === arabicFontSize);
    return config || fontSizes[1];
  };

  return { theme, toggleTheme, themeColor, setThemeColor, arabicFontSize, setArabicFontSize, getArabicFontStyle };
}
