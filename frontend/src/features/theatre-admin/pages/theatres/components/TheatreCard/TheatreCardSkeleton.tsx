import { Skeleton } from '@/shared/ui/Skeleton';

export default function TheatreCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      {/* Header Accent Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>

      {/* Card Body Skeleton */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3.5">
          <Skeleton className="h-13 w-13 shrink-0 rounded-xl" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2.5 border-t border-slate-100 pt-4">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3.5 w-2/5 rounded" />
            <Skeleton className="h-3.5 w-2/5 rounded" />
          </div>
        </div>

        <div className="mt-5 pt-3">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </article>
  );
}
