import { Skeleton } from '@/shared/ui';

const CARD_COUNT = 3;

export default function MyTheatresSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-busy="true"
      aria-label="Loading theatres"
    >
      <span className="sr-only">
        Fetching multiplexes and screens assigned to your account...
      </span>

      {/* Controls Skeleton: Search Bar & Segmented Status Filter */}
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-card sm:flex-row sm:items-center">
        <Skeleton className="skeleton-shimmer h-10 flex-1 rounded-md" />
        <Skeleton className="skeleton-shimmer h-10 w-52 self-start rounded-md sm:self-auto" />
      </div>

      {/* Theatre Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: CARD_COUNT }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-surface shadow-card"
          >
            {/* Card Top Banner */}
            <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
              <Skeleton className="skeleton-shimmer h-5 w-16 rounded-full" />
              <Skeleton className="skeleton-shimmer h-4 w-24 rounded-sm" />
            </div>

            {/* Card Body */}
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-start gap-3.5">
                <Skeleton className="skeleton-shimmer h-12 w-12 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="skeleton-shimmer h-5 w-3/4 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-3.5 w-1/2 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-3 w-5/6 rounded-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-4">
                <Skeleton className="skeleton-shimmer h-12 rounded-md" />
                <Skeleton className="skeleton-shimmer h-12 rounded-md" />
              </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-border bg-surface-muted/40 px-5 py-3">
              <Skeleton className="skeleton-shimmer h-9 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

