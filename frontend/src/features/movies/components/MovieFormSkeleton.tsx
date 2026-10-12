import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieFormSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-28 font-sans">
      {/* Top Nav Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-28 rounded-md" />
        <Skeleton className="h-5 w-32 rounded" />
      </div>

      {/* Hero Header Skeleton */}
      <div className="rounded-lg border border-border/20 bg-nav p-6 sm:p-8 text-nav-ink shadow-card">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md bg-white/20" />
          <Skeleton className="h-4 w-4/5 rounded bg-white/15" />
        </div>

        {/* Stepper Bar Skeleton */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-32 rounded-md bg-white/20" />
          ))}
        </div>
      </div>

      {/* Step Content Form Card Skeleton */}
      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 shadow-card space-y-6">
        <Skeleton className="h-7 w-48 rounded-md" />

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-28 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-28 rounded-md" />
        <Skeleton className="h-11 w-32 rounded-md" />
      </div>
    </div>
  );
}
