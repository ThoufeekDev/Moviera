import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-page pb-12 text-ink">
      {/* Top Navigation Bar Skeleton */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border/20 bg-nav px-4 sm:px-6 lg:px-8 py-3.5 backdrop-blur-md">
        <Skeleton className="h-5 w-28 rounded-md bg-white/20" />
        <Skeleton className="h-4 w-48 rounded bg-white/20" />
      </nav>

      {/* Hero Banner Section Skeleton */}
      <header className="relative min-h-[440px] overflow-hidden bg-nav py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-nav-ink">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
          {/* Left Poster Column Skeleton */}
          <div className="w-48 sm:w-56 shrink-0 aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-nav shadow-float">
            <Skeleton className="h-full w-full rounded-none bg-white/10" />
          </div>

          {/* Right Details Column Skeleton */}
          <div className="flex flex-1 min-w-0 flex-col gap-4 pt-2 w-full">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 rounded-sm bg-white/15" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/15" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/15" />
            </div>

            <Skeleton className="h-9 w-3/4 rounded-md bg-white/20" />

            <div className="flex gap-2">
              <Skeleton className="h-5 w-36 rounded-full bg-white/15" />
              <Skeleton className="h-5 w-44 rounded-full bg-white/15" />
            </div>

            <Skeleton className="h-4 w-48 rounded bg-white/15" />

            <div className="mt-4 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-32 rounded-md bg-white/20" />
              <Skeleton className="h-11 w-28 rounded-md bg-white/20" />
              <Skeleton className="h-11 w-36 rounded-md bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body Skeleton */}
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <Skeleton className="h-6 w-44 rounded-md mb-4" />
          <Skeleton className="h-4 w-full rounded mb-2" />
          <Skeleton className="h-4 w-5/6 rounded mb-2" />
          <Skeleton className="h-4 w-3/4 rounded mb-6" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-md border border-border bg-surface-muted p-4">
                <Skeleton className="h-3 w-16 rounded mb-2" />
                <Skeleton className="h-5 w-24 rounded" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-6 shadow-card">
          <Skeleton className="h-6 w-36 rounded-md mb-5" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full mb-2" />
                <Skeleton className="h-4 w-20 rounded mb-1" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
