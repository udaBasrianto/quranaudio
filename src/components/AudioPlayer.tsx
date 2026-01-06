import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, BookOpen, Repeat, Repeat1, Shuffle, WifiOff } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Surah, Reciter, Moshaf } from "@/types/quran";
import { getSurahAudioUrl } from "@/lib/api";

type RepeatMode = "off" | "one" | "all";

interface AudioPlayerProps {
  surah: Surah | null;
  reciter: Reciter | null;
  moshaf: Moshaf | null;
  surahs: Surah[];
  availableSurahs: number[];
  onSurahChange: (surah: Surah) => void;
  onClose: () => void;
  onShowText: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  getOfflineAudioUrl?: (reciterId: number, moshafId: number, surahId: number) => Promise<string | null>;
  isOffline?: boolean;
}

export function AudioPlayer({
  surah,
  reciter,
  moshaf,
  surahs,
  availableSurahs,
  onSurahChange,
  onClose,
  onShowText,
  onTimeUpdate,
  getOfflineAudioUrl,
  isOffline,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [isShuffle, setIsShuffle] = useState(false);
  const [isUsingOffline, setIsUsingOffline] = useState(false);

  useEffect(() => {
    if (!surah || !moshaf || !reciter) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const loadAudio = async () => {
      setIsLoading(true);
      
      // Try offline audio first
      if (getOfflineAudioUrl) {
        const offlineUrl = await getOfflineAudioUrl(reciter.id, moshaf.id, surah.id);
        if (offlineUrl) {
          audio.src = offlineUrl;
          setIsUsingOffline(true);
          audio.load();
          audio.play().then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          }).catch(() => {
            setIsLoading(false);
          });
          return;
        }
      }
      
      // Use online audio
      const audioUrl = getSurahAudioUrl(moshaf.server, surah.id);
      audio.src = audioUrl;
      setIsUsingOffline(false);
      audio.load();
      
      audio.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    };
    
    loadAudio();
  }, [surah, moshaf, reciter, getOfflineAudioUrl]);

  const getNextSurah = useCallback(() => {
    if (!surah) return null;
    const currentIndex = availableSurahs.indexOf(surah.id);
    
    if (isShuffle) {
      const otherSurahs = availableSurahs.filter((_, i) => i !== currentIndex);
      if (otherSurahs.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * otherSurahs.length);
      const nextSurahId = otherSurahs[randomIndex];
      return surahs.find(s => s.id === nextSurahId) || null;
    }
    
    if (currentIndex < availableSurahs.length - 1) {
      const nextSurahId = availableSurahs[currentIndex + 1];
      return surahs.find(s => s.id === nextSurahId) || null;
    } else if (repeatMode === "all") {
      const firstSurahId = availableSurahs[0];
      return surahs.find(s => s.id === firstSurahId) || null;
    }
    
    return null;
  }, [surah, availableSurahs, surahs, isShuffle, repeatMode]);

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
      return;
    }
    
    const nextSurah = getNextSurah();
    if (nextSurah) {
      onSurahChange(nextSurah);
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, getNextSurah, onSurahChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime, audio.duration);
    };
    const updateDuration = () => setDuration(audio.duration);
    const handleError = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [handleEnded, onTimeUpdate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handlePrevious = () => {
    if (!surah) return;
    const currentIndex = availableSurahs.indexOf(surah.id);
    if (currentIndex > 0) {
      const prevSurahId = availableSurahs[currentIndex - 1];
      const prevSurah = surahs.find(s => s.id === prevSurahId);
      if (prevSurah) onSurahChange(prevSurah);
    }
  };

  const handleNext = () => {
    const nextSurah = getNextSurah();
    if (nextSurah) {
      onSurahChange(nextSurah);
    }
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "one";
      if (prev === "one") return "all";
      return "off";
    });
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!surah || !reciter) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <audio ref={audioRef} />
      
      {/* Progress bar */}
      <div className="px-4 pt-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex items-center gap-4">
          {/* Song info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-foreground truncate text-sm">
                {surah.name}
              </h4>
              {isUsingOffline && (
                <span title="Mode Offline">
                  <WifiOff className="w-3 h-3 text-primary flex-shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {reciter.name}
            </p>
          </div>

          {/* Text button */}
          <button
            onClick={onShowText}
            className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            title="Lihat Teks & Terjemahan"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Repeat & Shuffle controls */}
          <button
            onClick={cycleRepeatMode}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              repeatMode !== "off" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
            }`}
            title={repeatMode === "off" ? "Repeat Off" : repeatMode === "one" ? "Repeat One" : "Repeat All"}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleShuffle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isShuffle ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
            }`}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-0.5" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 w-32">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-foreground">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
