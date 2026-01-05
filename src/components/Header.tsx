import { BookOpen, Moon, Sun, Bookmark, Search, Shield, LogIn, LogOut, Download } from "lucide-react";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { ThemeColor, FontSize, AutoNightMode } from "@/hooks/useTheme";
import type { PrayerTimes } from "@/hooks/usePrayerTimes";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  bookmarkCount?: number;
  onShowBookmarks?: () => void;
  themeColor: ThemeColor;
  onColorChange: (color: ThemeColor) => void;
  arabicFontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  onOpenSearch?: () => void;
  autoNightMode: AutoNightMode;
  onAutoNightModeChange: (mode: AutoNightMode) => void;
  customNightStart: string;
  onCustomNightStartChange: (time: string) => void;
  customNightEnd: string;
  onCustomNightEndChange: (time: string) => void;
  prayerTimes: PrayerTimes | null;
}

export function Header({ 
  theme, 
  onToggleTheme, 
  bookmarkCount = 0, 
  onShowBookmarks, 
  themeColor, 
  onColorChange,
  arabicFontSize,
  onFontSizeChange,
  onOpenSearch,
  autoNightMode,
  onAutoNightModeChange,
  customNightStart,
  onCustomNightStartChange,
  customNightEnd,
  onCustomNightEndChange,
  prayerTimes,
}: HeaderProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { isInstallable, installApp } = usePWAInstall();

  const handleSignOut = async () => {
    await signOut();
  };

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
            {isInstallable && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={installApp}
                      className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors animate-pulse"
                      aria-label="Install aplikasi"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Install ke Home Screen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <button
              onClick={onOpenSearch}
              className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
              aria-label="Cari ayat"
            >
              <Search className="w-5 h-5" />
            </button>
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
            <ThemeColorPicker 
              currentColor={themeColor} 
              onColorChange={onColorChange}
              arabicFontSize={arabicFontSize}
              onFontSizeChange={onFontSizeChange}
              autoNightMode={autoNightMode}
              onAutoNightModeChange={onAutoNightModeChange}
              customNightStart={customNightStart}
              onCustomNightStartChange={onCustomNightStartChange}
              customNightEnd={customNightEnd}
              onCustomNightEndChange={onCustomNightEndChange}
              prayerTimes={prayerTimes}
            />
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary-foreground/30 text-primary-foreground text-sm">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
                aria-label="Masuk"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
