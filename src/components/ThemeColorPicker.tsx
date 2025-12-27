import { Settings, Check } from "lucide-react";
import { useState } from "react";
import { themeColors, ThemeColor, FontSize, AutoNightMode } from "@/hooks/useTheme";
import { FontSizePicker } from "./FontSizePicker";
import { AutoNightModePicker } from "./AutoNightModePicker";
import type { PrayerTimes } from "@/hooks/usePrayerTimes";

interface ThemeColorPickerProps {
  currentColor: ThemeColor;
  onColorChange: (color: ThemeColor) => void;
  arabicFontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  autoNightMode: AutoNightMode;
  onAutoNightModeChange: (mode: AutoNightMode) => void;
  customNightStart: string;
  onCustomNightStartChange: (time: string) => void;
  customNightEnd: string;
  onCustomNightEndChange: (time: string) => void;
  prayerTimes: PrayerTimes | null;
}

export function ThemeColorPicker({
  currentColor,
  onColorChange,
  arabicFontSize,
  onFontSizeChange,
  autoNightMode,
  onAutoNightModeChange,
  customNightStart,
  onCustomNightStartChange,
  customNightEnd,
  onCustomNightEndChange,
  prayerTimes,
}: ThemeColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
        aria-label="Pengaturan"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 bg-card border border-border rounded-xl shadow-lg p-4 min-w-[280px] max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-semibold text-foreground mb-3">Warna Tema</h3>
            <div className="grid grid-cols-3 gap-2">
              {themeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    onColorChange(color.id);
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
                  title={color.name}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: `hsl(${color.hue}, 70%, 45%)` }}
                  >
                    {currentColor === color.id && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{color.name}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-border my-4" />
            
            <FontSizePicker 
              currentSize={arabicFontSize} 
              onSizeChange={onFontSizeChange} 
            />
            
            <div className="border-t border-border my-4" />
            
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
        </>
      )}
    </div>
  );
}
