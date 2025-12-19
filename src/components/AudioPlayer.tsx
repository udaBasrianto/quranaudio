import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, BookOpen } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Surah, Reciter, Moshaf } from "@/types/quran";
import { getSurahAudioUrl } from "@/lib/api";

interface AudioPlayerProps {
  surah: Surah | null;
  reciter: Reciter | null;
  moshaf: Moshaf | null;
  surahs: Surah[];
  availableSurahs: number[];
  onSurahChange: (surah: Surah) => void;
  onClose: () => void;
  onShowText: () => void;
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
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!surah || !moshaf) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const audioUrl = getSurahAudioUrl(moshaf.server, surah.id);
    audio.src = audioUrl;
    setIsLoading(true);
    audio.load();
    
    audio.play().then(() => {
      setIsPlaying(true);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [surah, moshaf]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
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
  }, [availableSurahs, surah]);

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
    if (!surah) return;
    const currentIndex = availableSurahs.indexOf(surah.id);
    if (currentIndex < availableSurahs.length - 1) {
      const nextSurahId = availableSurahs[currentIndex + 1];
      const nextSurah = surahs.find(s => s.id === nextSurahId);
      if (nextSurah) onSurahChange(nextSurah);
    }
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
            <h4 className="font-semibold text-foreground truncate text-sm">
              {surah.name}
            </h4>
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
