import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieFormSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-24 font-sans">
      {/* Top Nav Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-5 w-32 rounded" />
      </div>

      {/* Hero Header Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Stepper Bar Skeleton */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Step Content Form Card Skeleton */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <Skeleton className="h-7 w-48 rounded-lg" />

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </div>
  );
}
