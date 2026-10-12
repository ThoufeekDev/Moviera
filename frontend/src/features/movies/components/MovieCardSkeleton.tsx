import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieCardSkeleton() {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card sm:flex-row">
      {/* Poster Skeleton */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-surface-muted sm:h-auto sm:w-44">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Right Details Skeleton */}
      <div className="flex flex-1 min-w-0 flex-col justify-between p-4 sm:p-5 space-y-4">
        <div>
          {/* Title + Cert Badge */}
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-6 w-3/5 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-sm" />
          </div>

          {/* Genre, Duration, Formats */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-18 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>

          {/* Languages Line */}
          <div className="mt-2.5">
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>

          {/* Description Lines */}
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
        </div>

        {/* Footer & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-3">
          <Skeleton className="h-4 w-32 rounded" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-24 rounded-md" />
            <Skeleton className="h-11 w-16 rounded-md" />
            <Skeleton className="h-11 w-20 rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
}