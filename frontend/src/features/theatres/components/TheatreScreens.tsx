import { Button } from '@/shared/ui/Button';

export default function TheatreScreens() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">Screens Management</h2>

        <Button variant="primary" size="md">
          + Add New Screen
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="flex flex-col justify-between rounded-lg border border-border bg-surface p-5 shadow-card transition-colors hover:border-brand-600/40"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-ink">Screen {num}</h4>
                <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-ink-muted border border-border">
                  {num === 1 ? 'IMAX 3D' : 'Dolby 7.1'}
                </span>
              </div>

              <div className="mt-3 text-xs text-ink-muted">
                <span>Total Capacity: {num % 2 === 0 ? 80 : 75} Seats</span>
              </div>
            </div>

            <Button variant="secondary" size="md" className="mt-5 w-full">
              Manage Layout
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}