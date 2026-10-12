import { Skeleton } from '@/shared/ui/Skeleton';

export default function TheatreCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card">
      {/* Header Accent Bar Skeleton */}
      <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>

      {/* Card Body Skeleton */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3.5">
          <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-3.5 w-1/2 rounded-md" />
          </div>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2 border-t border-border pt-3">
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-4/5 rounded" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3.5 w-1/3 rounded" />
            <Skeleton className="h-3.5 w-1/3 rounded" />
          </div>
        </div>

        <div className="mt-5 pt-3">
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </div>
    </article>
  );
}
