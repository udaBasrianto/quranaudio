import { Skeleton } from "@/components/ui/skeleton";

export function ReciterSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SurahSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      ))}
    </div>
  );
}
