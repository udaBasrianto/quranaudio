import { Moon, Sun, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import type { AutoNightMode } from "@/hooks/useTheme";
import type { PrayerTimes } from "@/hooks/usePrayerTimes";

interface AutoNightModePickerProps {
  autoNightMode: AutoNightMode;
  onAutoNightModeChange: (mode: AutoNightMode) => void;
  customNightStart: string;
  onCustomNightStartChange: (time: string) => void;
  customNightEnd: string;
  onCustomNightEndChange: (time: string) => void;
  prayerTimes: PrayerTimes | null;
}

export function AutoNightModePicker({
  autoNightMode,
  onAutoNightModeChange,
  customNightStart,
  onCustomNightStartChange,
  customNightEnd,
  onCustomNightEndChange,
  prayerTimes,
}: AutoNightModePickerProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Moon className="h-4 w-4" />
        Mode Malam Otomatis
      </Label>
      
      <RadioGroup
        value={autoNightMode}
        onValueChange={(value) => onAutoNightModeChange(value as AutoNightMode)}
        className="space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="off" id="off" />
          <Label htmlFor="off" className="text-sm cursor-pointer flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Nonaktif (Manual)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="prayer" id="prayer" />
          <Label htmlFor="prayer" className="text-sm cursor-pointer flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Waktu Shalat (Maghrib - Subuh)
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" />
          <Label htmlFor="custom" className="text-sm cursor-pointer flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Jam Kustom
          </Label>
        </div>
      </RadioGroup>

      {autoNightMode === "prayer" && prayerTimes && (
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
          <p>Maghrib: {prayerTimes.Maghrib} → Subuh: {prayerTimes.Fajr}</p>
        </div>
      )}

      {autoNightMode === "custom" && (
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Mulai</Label>
            <Input
              type="time"
              value={customNightStart}
              onChange={(e) => onCustomNightStartChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Selesai</Label>
            <Input
              type="time"
              value={customNightEnd}
              onChange={(e) => onCustomNightEndChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
