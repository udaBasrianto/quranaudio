import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Moon, Sun, Bookmark, Search, Shield, LogIn, LogOut,
  Download, Users, Menu, X, Clock, Hand, Settings, GraduationCap,
  HardDrive, Home, ChevronRight,
} from "lucide-react";
import { ThemeColor, FontSize, AutoNightMode, themeColors } from "@/hooks/useTheme";
import type { PrayerTimes } from "@/hooks/usePrayerTimes";
import { useAuth } from "@/hooks/useAuth";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { usePWAInstallCount } from "@/hooks/usePWAInstallCount";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FontSizePicker } from "./FontSizePicker";
import { AutoNightModePicker } from "./AutoNightModePicker";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
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

export function AppSidebar({
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
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { isInstallable, installApp } = usePWAInstall();
  const { installCount, recordInstallation } = usePWAInstallCount();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) await recordInstallation();
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setShowSettings(false);
  };

  const menuAction = (action: () => void) => {
    action();
    closeSidebar();
  };

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">Quran Audio</h1>
                <p className="text-[11px] text-primary-foreground/70 leading-none">Dengarkan Al-Quran</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
              aria-label="Cari ayat"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onShowBookmarks}
              className="relative w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
              aria-label="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </button>
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-xl bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25 transition-all"
              aria-label={theme === "light" ? "Mode gelap" : "Mode terang"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[300px] bg-card shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="bg-primary text-primary-foreground p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Quran Audio</h2>
              <p className="text-xs text-primary-foreground/70">Menu Navigasi</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center hover:bg-primary-foreground/25"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User section */}
        {user && (
          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Masuk</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">Navigasi</p>
            <SidebarItem icon={Home} label="Beranda" onClick={() => menuAction(() => navigate("/"))} />
            <SidebarItem icon={Search} label="Cari Ayat" onClick={() => menuAction(() => onOpenSearch?.())} />
            <SidebarItem icon={Bookmark} label="Bookmark" badge={bookmarkCount} onClick={() => menuAction(() => onShowBookmarks?.())} />
          </div>

          <div className="px-3 py-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">Fitur</p>
            <SidebarItem icon={Clock} label="Waktu Sholat" onClick={() => menuAction(() => navigate("/prayer-times"))} />
            <SidebarItem icon={Hand} label="Dzikir Counter" onClick={() => menuAction(() => navigate("/dzikir-counter"))} />
            <SidebarItem icon={Sun} label="Dzikir Pagi & Petang" onClick={() => menuAction(() => navigate("/dzikir-pagi-petang"))} />
            <SidebarItem icon={GraduationCap} label="Kuis Kosakata" onClick={() => menuAction(() => navigate("/quran-quiz"))} />
            <SidebarItem icon={HardDrive} label="Storage Offline" onClick={() => menuAction(() => navigate("/offline-storage"))} />
          </div>

          <div className="px-3 py-1">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">Pengaturan</p>
            <SidebarItem
              icon={Settings}
              label="Pengaturan Tampilan"
              hasArrow
              onClick={() => setShowSettings(!showSettings)}
            />
            {showSettings && (
              <div className="ml-3 pl-3 border-l-2 border-primary/20 space-y-4 py-3 pr-3">
                {/* Theme colors */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Warna Tema</p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {themeColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => onColorChange(color.id)}
                        className="flex flex-col items-center gap-0.5 p-1 rounded-lg hover:bg-muted transition-colors"
                        title={color.name}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                          style={{ backgroundColor: `hsl(${color.hue}, 70%, 45%)` }}
                        >
                          {themeColor === color.id && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[9px] text-muted-foreground leading-tight">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <FontSizePicker currentSize={arabicFontSize} onSizeChange={onFontSizeChange} />
                </div>
                <div className="border-t border-border pt-3">
                  <AutoNightModePicker
                    autoNightMode={autoNightMode}
                    onAutoNightModeChange={onAutoNightModeChange}
                    customNightStart={customNightStart}
                    onCustomNightStartChange={onCustomNightStartChange}
                    customNightEnd={customNightEnd}
                    onCustomNightEndChange={onCustomNightEndChange}
                    prayerTimes={prayerTimes}
                  />
                </div>
              </div>
            )}
            <SidebarItem
              icon={theme === "light" ? Moon : Sun}
              label={theme === "light" ? "Mode Gelap" : "Mode Terang"}
              onClick={() => onToggleTheme()}
            />
          </div>

          {isInstallable && (
            <div className="px-3 py-1">
              <SidebarItem
                icon={Download}
                label="Install Aplikasi"
                badge={installCount > 0 ? installCount : undefined}
                onClick={handleInstall}
                highlight
              />
            </div>
          )}

          {isAdmin && (
            <div className="px-3 py-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">Admin</p>
              <SidebarItem icon={Shield} label="Dashboard Admin" onClick={() => menuAction(() => navigate("/admin"))} />
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          {user ? (
            <SidebarItem icon={LogOut} label="Keluar" onClick={() => menuAction(() => signOut())} />
          ) : (
            <SidebarItem icon={LogIn} label="Masuk / Daftar" onClick={() => menuAction(() => navigate("/auth"))} highlight />
          )}
        </div>
      </aside>
    </>
  );
}

// Sidebar menu item component
function SidebarItem({
  icon: Icon,
  label,
  badge,
  onClick,
  highlight,
  hasArrow,
}: {
  icon: React.ElementType;
  label: string;
  badge?: number;
  onClick?: () => void;
  highlight?: boolean;
  hasArrow?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        highlight
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "text-foreground hover:bg-muted"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {hasArrow && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}
