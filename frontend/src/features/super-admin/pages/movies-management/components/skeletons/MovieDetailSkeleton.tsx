import { Skeleton } from '@/shared/ui/Skeleton';

export default function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 pb-12 text-white">
      {/* Top Navigation Bar Skeleton */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 py-4 backdrop-blur-md">
        <Skeleton className="h-5 w-28 rounded-md bg-slate-800" />
        <Skeleton className="h-4 w-48 rounded bg-slate-800" />
      </nav>

      {/* Hero Banner Section Skeleton */}
      <header className="relative min-h-[460px] overflow-hidden bg-slate-900 py-10 px-6">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row gap-8 items-start">
          {/* Left Poster Column Skeleton */}
          <div className="w-56 shrink-0 aspect-[2/3] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <Skeleton className="h-full w-full rounded-none bg-slate-800" />
          </div>

          {/* Right Details Column Skeleton */}
          <div className="flex flex-1 flex-col gap-4 pt-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12 rounded bg-slate-800" />
              <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
              <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
            </div>

            <Skeleton className="h-9 w-3/4 rounded-lg bg-slate-800" />

            <div className="flex gap-2">
              <Skeleton className="h-5 w-36 rounded-full bg-slate-800" />
              <Skeleton className="h-5 w-44 rounded-full bg-slate-800" />
            </div>

            <Skeleton className="h-4 w-48 rounded bg-slate-800" />

            <div className="mt-4 flex flex-wrap gap-3">
              <Skeleton className="h-10 w-32 rounded-xl bg-slate-800" />
              <Skeleton className="h-10 w-28 rounded-xl bg-slate-800" />
              <Skeleton className="h-10 w-36 rounded-xl bg-slate-800" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body Skeleton */}
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <Skeleton className="h-6 w-44 rounded-md mb-4 bg-slate-800" />
          <Skeleton className="h-4 w-full rounded mb-2 bg-slate-800" />
          <Skeleton className="h-4 w-5/6 rounded mb-2 bg-slate-800" />
          <Skeleton className="h-4 w-3/4 rounded mb-6 bg-slate-800" />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-slate-800/80 bg-slate-900 p-4">
                <Skeleton className="h-3 w-16 rounded mb-2 bg-slate-800" />
                <Skeleton className="h-5 w-24 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <Skeleton className="h-6 w-36 rounded-md mb-5 bg-slate-800" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full mb-2 bg-slate-800" />
                <Skeleton className="h-4 w-20 rounded mb-1 bg-slate-800" />
                <Skeleton className="h-3 w-14 rounded bg-slate-800" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
