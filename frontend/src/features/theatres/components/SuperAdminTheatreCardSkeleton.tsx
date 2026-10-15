import { Skeleton } from '@/shared/ui/Skeleton';

export default function SuperAdminTheatreCardSkeleton() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-0 shadow-card">
      {/* Top Banner Skeleton with Badges */}
      <div className="relative h-28 sm:h-32 w-full bg-surface-muted overflow-hidden">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded-full bg-surface/50" />
          <Skeleton className="h-6 w-20 rounded-full bg-surface/50" />
        </div>
      </div>

      {/* Overlapping Avatar Skeleton */}
      <div className="-mt-9 px-5 flex items-end justify-between relative z-10">
        <Skeleton className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl border-2 border-surface bg-surface" />
        <Skeleton className="h-5 w-24 rounded-md mb-0.5" />
      </div>

      {/* Card Body Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-3 space-y-4">
        <div className="space-y-3.5">
          {/* Title and city */}
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>

          {/* Licence card skeleton */}
          <Skeleton className="h-12 w-full rounded-xl" />

          {/* Contact rows */}
          <div className="space-y-2 pt-1">
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
            <Skeleton className="h-3.5 w-3/5 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="pt-3 border-t border-border/80">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
