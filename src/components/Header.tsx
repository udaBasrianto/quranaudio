import { BookOpen, Moon, Sun, Bookmark } from "lucide-react";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeColor } from "@/hooks/useTheme";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  bookmarkCount?: number;
  onShowBookmarks?: () => void;
  themeColor: ThemeColor;
  onColorChange: (color: ThemeColor) => void;
}

export function Header({ theme, onToggleTheme, bookmarkCount = 0, onShowBookmarks, themeColor, onColorChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Quran Audio</h1>
              <p className="text-sm text-primary-foreground/80">Dengarkan Al-Quran</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onShowBookmarks}
              className="relative w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              aria-label="Lihat bookmark"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </button>
            <button
              onClick={onToggleTheme}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <ThemeColorPicker currentColor={themeColor} onColorChange={onColorChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
