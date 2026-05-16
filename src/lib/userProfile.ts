import { User } from "@supabase/supabase-js";

export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "Sahabat";
  const meta = user.user_metadata || {};
  return (
    meta.full_name ||
    meta.name ||
    meta.display_name ||
    user.email?.split("@")[0] ||
    "Sahabat"
  );
}

export function getAvatarUrl(user: User | null | undefined): string | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  return meta.avatar_url || meta.picture || null;
}

export function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "S";
}

export function getProvider(user: User | null | undefined): string {
  if (!user) return "—";
  const provider = user.app_metadata?.provider;
  if (provider === "google") return "Google";
  if (provider === "email") return "Email";
  return provider || "—";
}
