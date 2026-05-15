import { Home, Trophy, User, BookOpen, Clock } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Beranda", icon: Home },
  { to: "/quran-index", label: "Indeks", icon: BookOpen },
  { to: "/prayer-times", label: "Sholat", icon: Clock },
  { to: "/quran-quiz", label: "Kuis", icon: Trophy },
  { to: "/profile", label: "Profil", icon: User },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();

  // Hide on auth page itself for cleanliness
  if (pathname === "/auth") return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border shadow-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isActive && "fill-primary/10"
                  )}
                />
                <span
                  className={cn(
                    "text-[11px] leading-none font-medium",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
