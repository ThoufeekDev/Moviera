import { Skeleton } from '@/shared/ui';

const ROW_COUNT = 4;

export default function TheatreShowsSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading shows"
    >
      <span className="sr-only">Loading your theatres and shows...</span>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="skeleton-shimmer h-7 w-44 rounded-md" />
          <Skeleton className="skeleton-shimmer h-4 w-64 rounded-sm" />
        </div>
        <Skeleton className="skeleton-shimmer h-10 w-36 rounded-md" />
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="skeleton-shimmer h-10 flex-1 rounded-md" />
        <div className="flex flex-wrap items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton
              key={idx}
              className="skeleton-shimmer h-9 w-20 rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Show List Rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: ROW_COUNT }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-3.5">
              <Skeleton className="skeleton-shimmer h-20 w-14 shrink-0 rounded" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="skeleton-shimmer h-5 w-44 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="skeleton-shimmer h-4 w-60 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-3.5 w-48 rounded-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-center">
              <Skeleton className="skeleton-shimmer h-5 w-20 rounded-sm" />
              <Skeleton className="skeleton-shimmer h-9 w-20 rounded-md" />
              <Skeleton className="skeleton-shimmer h-9 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

