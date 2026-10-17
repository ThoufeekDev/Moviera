import { Skeleton } from '@/shared/ui/Skeleton';

export default function FacilityCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Name and slug */}
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/3 rounded-md" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-4/5 rounded-md" />
        </div>

        {/* Assigned theatre count */}
        <div className="pt-2 border-t border-border/60">
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}
