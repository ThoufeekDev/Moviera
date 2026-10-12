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
        <h2 className="text-xl font-bold text-ink">Today&apos;s Showtimes</h2>

        <Button variant="primary" size="md">
          + Schedule Show
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface p-12 text-center text-sm text-ink-muted shadow-card">
        <p>
          {totalShows} active showtimes scheduled for today across {totalScreens} screens.
        </p>
      </div>
    </div>
  );
}