import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOfflineAudio, type DownloadedSurah } from "@/hooks/useOfflineAudio";
import { useSurahs } from "@/hooks/useQuranData";
import { ArrowLeft, Trash2, HardDrive, Music, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function OfflineStorage() {
  const navigate = useNavigate();
  const { downloadedSurahs, deleteAudio, deleteAllAudio, getStorageSize, isLoading } = useOfflineAudio();
  const { data: surahsData } = useSurahs();
  const [storageSize, setStorageSize] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getStorageSize().then(setStorageSize);
  }, [getStorageSize, downloadedSurahs]);

  const downloadedList = Array.from(downloadedSurahs.values());

  const getSurahName = (surahId: number) => {
    return surahsData?.suwar.find((s) => s.id === surahId)?.name || `Surah ${surahId}`;
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await deleteAllAudio();
      setStorageSize(0);
      toast.success("Semua download berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus download");
    }
    setIsDeleting(false);
  };

  const handleDeleteOne = async (item: DownloadedSurah) => {
    try {
      await deleteAudio(item.reciterId, item.moshafId, item.surahId);
      toast.success(`${getSurahName(item.surahId)} dihapus`);
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Manajemen Storage Offline</h1>
        </div>

        {/* Storage Summary */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total Penyimpanan</p>
              <p className="text-2xl font-bold text-foreground">{formatBytes(storageSize)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Music className="w-4 h-4" />
              {downloadedList.length} surah tersimpan
            </span>
          </div>

          {downloadedList.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={isDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Semua Download
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Hapus Semua Download?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini akan menghapus {downloadedList.length} surah ({formatBytes(storageSize)}) dari penyimpanan offline. 
                    Data ini tidak dapat dikembalikan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll}>Hapus Semua</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </Card>

        {/* Downloaded Items List */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat data...</div>
        ) : downloadedList.length === 0 ? (
          <div className="text-center py-12">
            <HardDrive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">Belum ada download offline</p>
            <p className="text-sm text-muted-foreground mt-1">Download surah dari halaman utama untuk pemutaran offline</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
              Kembali ke Beranda
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Daftar Download</h2>
            {downloadedList.map((item) => (
              <Card
                key={`${item.reciterId}-${item.moshafId}-${item.surahId}`}
                className="p-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                  {item.surahId}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{getSurahName(item.surahId)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.downloadedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteOne(item)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
