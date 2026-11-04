import { Skeleton } from '@/shared/ui/Skeleton';

export default function ScreenCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
        </div>
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}
