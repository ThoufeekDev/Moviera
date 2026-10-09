import { Button } from '@/shared/ui/Button';

interface TheatreShowsProps {
  totalShows: number;
  totalScreens: number;
}

export default function TheatreShows({
  totalShows,
  totalScreens,
}: TheatreShowsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Today&apos;s Showtimes</h2>

        <Button variant="primary" size="sm">
          + Schedule Show
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
        <p>
          {totalShows} active showtimes scheduled for today across {totalScreens} screens.
        </p>
      </div>
    </div>
  );
}