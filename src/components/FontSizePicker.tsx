import { Type } from "lucide-react";
import { FontSize, fontSizes } from "@/hooks/useTheme";

interface FontSizePickerProps {
  currentSize: FontSize;
  onSizeChange: (size: FontSize) => void;
}

export function FontSizePicker({ currentSize, onSizeChange }: FontSizePickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Type className="w-4 h-4" />
        <span>Ukuran Font Arab</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fontSizes.map((size) => (
          <button
            key={size.id}
            onClick={() => onSizeChange(size.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSize === size.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {size.name}
          </button>
        ))}
      </div>
      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
        <p
          className="font-arabic text-foreground text-right"
          dir="rtl"
          style={{ fontSize: fontSizes.find((f) => f.id === currentSize)?.size }}
        >
          بِسْمِ اللَّهِ
        </p>
      </div>
    </div>
  );
}
