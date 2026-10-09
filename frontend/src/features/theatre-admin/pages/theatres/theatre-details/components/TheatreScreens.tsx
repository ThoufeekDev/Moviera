import { Button } from '@/shared/ui/Button';

export default function TheatreScreens() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900">Screens Management</h2>

        <Button variant="primary" size="sm">
          + Add New Screen
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand-500/30"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">Screen {num}</h4>
                <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {num === 1 ? 'IMAX 3D' : 'Dolby 7.1'}
                </span>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                <span>Total Capacity: {num % 2 === 0 ? 80 : 75} Seats</span>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="mt-5 w-full">
              Manage Layout
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}