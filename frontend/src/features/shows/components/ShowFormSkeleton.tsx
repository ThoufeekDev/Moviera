import { Skeleton } from '@/shared/ui';

const CATEGORY_ROW_COUNT = 4;

export default function ShowFormSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading show form"
    >
      <span className="sr-only">Loading show details...</span>

      {/* Breadcrumb + Page Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="skeleton-shimmer h-3.5 w-40 rounded-sm" />
        <Skeleton className="skeleton-shimmer h-8 w-48 rounded-md" />
        <Skeleton className="skeleton-shimmer h-4 w-64 rounded-sm" />
      </div>

      {/* 3-Step Stepper Card */}
      <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-6 py-4 shadow-card">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex flex-1 items-center gap-3">
            <Skeleton className="skeleton-shimmer h-8 w-8 shrink-0 rounded-full" />
            <div className="hidden flex-col gap-1.5 sm:flex">
              <Skeleton className="skeleton-shimmer h-3.5 w-24 rounded-sm" />
              <Skeleton className="skeleton-shimmer h-3 w-32 rounded-sm" />
            </div>
            {idx < 2 && <div className="hidden h-px flex-1 bg-border md:block" />}
          </div>
        ))}
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Form Column */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          {/* Show Details Card */}
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center gap-2.5">
              <Skeleton className="skeleton-shimmer h-5 w-5 rounded" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="skeleton-shimmer h-5 w-32 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-3.5 w-52 rounded-sm" />
              </div>
            </div>

            {/* Movie Selector */}
            <div className="flex flex-col gap-2">
              <Skeleton className="skeleton-shimmer h-3.5 w-16 rounded-sm" />
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <Skeleton className="skeleton-shimmer h-10 w-8 shrink-0 rounded" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="skeleton-shimmer h-4 w-48 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-3 w-64 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Screen Selector */}
            <div className="flex flex-col gap-2">
              <Skeleton className="skeleton-shimmer h-3.5 w-16 rounded-sm" />
              <div className="flex items-center justify-between rounded-md border border-border p-3">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="skeleton-shimmer h-4 w-32 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-3 w-52 rounded-sm" />
                </div>
                <Skeleton className="skeleton-shimmer h-4 w-4 rounded" />
              </div>
            </div>

            {/* Date / Start Time / End Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <Skeleton className="skeleton-shimmer h-3.5 w-20 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-10 w-full rounded-md" />
                </div>
              ))}
            </div>

            {/* Scheduling Info Banner */}
            <Skeleton className="skeleton-shimmer h-14 w-full rounded-md" />
          </div>

          {/* Ticket Pricing Card */}
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center gap-2.5">
              <Skeleton className="skeleton-shimmer h-5 w-5 rounded" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="skeleton-shimmer h-5 w-32 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-3.5 w-60 rounded-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Skeleton className="skeleton-shimmer h-3.5 w-28 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-10 w-full rounded-md" />
              </div>
              <Skeleton className="skeleton-shimmer h-14 w-full self-end rounded-md" />
            </div>

            {/* Seat Category Adjustments Table */}
            <div className="flex flex-col divide-y divide-border rounded-md border border-border">
              {Array.from({ length: CATEGORY_ROW_COUNT }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="skeleton-shimmer h-3 w-3 rounded-full" />
                    <Skeleton className="skeleton-shimmer h-4 w-24 rounded-sm" />
                  </div>
                  <Skeleton className="skeleton-shimmer h-9 w-24 rounded-md" />
                  <Skeleton className="skeleton-shimmer h-7 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 shadow-card">
            <Skeleton className="skeleton-shimmer h-5 w-32 rounded-sm" />

            {/* Poster + Movie Info */}
            <div className="flex items-start gap-3.5">
              <Skeleton className="skeleton-shimmer h-20 w-14 shrink-0 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="skeleton-shimmer h-5 w-3/4 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-3.5 w-5/6 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-3.5 w-1/2 rounded-sm" />
              </div>
            </div>

            {/* Summary Metadata Rows */}
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <Skeleton className="skeleton-shimmer h-3.5 w-20 rounded-sm" />
                  <Skeleton className="skeleton-shimmer h-3.5 w-28 rounded-sm" />
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="flex flex-col gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <Skeleton className="skeleton-shimmer h-3.5 w-20 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-4 w-16 rounded-sm" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="skeleton-shimmer h-4 w-24 rounded-sm" />
                <Skeleton className="skeleton-shimmer h-5 w-24 rounded-sm" />
              </div>
            </div>

            <Skeleton className="skeleton-shimmer h-14 w-full rounded-md" />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="skeleton-shimmer h-10 rounded-md" />
              <Skeleton className="skeleton-shimmer h-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

