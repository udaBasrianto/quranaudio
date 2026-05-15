import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut, Mail, Save, Shield, User as UserIcon, KeyRound, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password minimal 6 karakter").max(72, "Password terlalu panjang"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirm"],
  });

const nameSchema = z
  .string()
  .trim()
  .min(1, "Nama tidak boleh kosong")
  .max(60, "Nama maksimal 60 karakter");

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, signOut } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    setLoadingProfile(true);
    supabase
      .from("profiles")
      .select("display_name, email")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(
          data?.display_name ?? user.user_metadata?.display_name ?? ""
        );
        setProfileEmail(data?.email ?? user.email ?? "");
        setLoadingProfile(false);
      });
  }, [user, loading]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = nameSchema.safeParse(displayName);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSavingProfile(true);
    const { error: pErr } = await supabase
      .from("profiles")
      .update({ display_name: parsed.data })
      .eq("user_id", user.id);
    const { error: mErr } = await supabase.auth.updateUser({
      data: { display_name: parsed.data },
    });
    setSavingProfile(false);
    if (pErr || mErr) {
      toast.error(pErr?.message || mErr?.message || "Gagal menyimpan profil");
      return;
    }
    toast.success("Profil berhasil diperbarui");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPassword(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Password berhasil diubah");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Berhasil keluar");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="container mx-auto px-4 py-4 max-w-lg space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Profil</h1>
          </div>
          <Card className="p-8 text-center space-y-4">
            <div className="text-5xl">🔒</div>
            <h2 className="text-xl font-bold text-foreground">Belum Login</h2>
            <p className="text-muted-foreground">
              Silakan login untuk mengakses halaman profil Anda.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              <LogIn className="w-4 h-4" />
              Login / Daftar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const initial = (displayName || profileEmail || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-4 max-w-lg space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Profil Saya</h1>
        </div>

        {/* Profile header */}
        <Card className="p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/15 text-primary flex items-center justify-center text-2xl font-bold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">
              {displayName || "Pengguna"}
            </p>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {profileEmail}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-accent-foreground bg-accent px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
        </Card>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info" className="gap-1">
              <UserIcon className="w-4 h-4" /> Info
            </TabsTrigger>
            <TabsTrigger value="password" className="gap-1">
              <KeyRound className="w-4 h-4" /> Password
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Card className="p-5">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profileEmail} disabled />
                  <p className="text-xs text-muted-foreground">
                    Email tidak dapat diubah
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_name">Nama Tampilan</Label>
                  <Input
                    id="display_name"
                    placeholder="Nama Anda"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={60}
                    disabled={loadingProfile}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={savingProfile}>
                  {savingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Perubahan
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="mt-4">
            <Card className="p-5">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Password Baru</Label>
                  <Input
                    id="new_password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Ketik ulang password baru"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={savingPassword}>
                  {savingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  Ubah Password
                </Button>
                <p className="text-xs text-muted-foreground">
                  Tip: gunakan kombinasi huruf, angka, dan simbol agar lebih aman.
                </p>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {isAdmin && (
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => navigate("/admin")}
          >
            <Shield className="w-4 h-4" /> Buka Dashboard Admin
          </Button>
        )}

        <Button
          variant="destructive"
          className="w-full gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" /> Keluar
        </Button>
      </div>
    </div>
  );
}
