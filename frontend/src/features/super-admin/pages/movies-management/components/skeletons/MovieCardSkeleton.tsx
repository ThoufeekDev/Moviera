import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm sm:flex-row">
      {/* Floating Poster Skeleton */}
      <div className="relative h-60 sm:h-auto sm:w-44 shrink-0 bg-slate-100">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* Right Details Skeleton */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          {/* Title + Cert Badge */}
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-6 w-3/5 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
          </div>

          {/* Genre, Duration, Formats */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-18 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-10 rounded-md" />
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <Skeleton className="h-4 w-32 rounded" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      </div>
    </article>
  );
}