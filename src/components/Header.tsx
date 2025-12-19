import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Quran Audio</h1>
            <p className="text-sm text-primary-foreground/80">Dengarkan Al-Quran</p>
          </div>
        </div>
      </div>
    </header>
  );
}
