import { Building2, AlertCircle, MapPin, Film, ChevronRight } from 'lucide-react';
import type { TheatreItem, AssignedAdmin } from './types';

interface TheatreListRailProps {
  theatres: TheatreItem[];
  admins: AssignedAdmin[];
  selectedTheatreId: string;
  onSelectTheatre: (id: string) => void;
  totalTheatresCount: number;
}

export const TheatreListRail = ({
  theatres,
  admins,
  selectedTheatreId,
  onSelectTheatre,
  totalTheatresCount,
}: TheatreListRailProps) => {
  return (
    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold tracking-wider text-ink-muted uppercase">
          Cinemas Directory ({theatres.length})
        </span>
        <span className="text-xs text-brand-600 font-medium">Select to manage</span>
      </div>

      {/* Scrollable Theatre Cards */}
      <div className="flex max-h-[640px] flex-col gap-2.5 overflow-y-auto pr-1 no-scrollbar">
        {theatres.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8 text-center shadow-card">
            <Building2 size={26} className="text-ink-muted mb-2" />
            <p className="text-sm font-medium text-ink">
              {totalTheatresCount === 0 ? 'No cinemas found on backend' : 'No matching cinemas'}
            </p>
            <p className="text-xs text-ink-muted mt-1">
              {totalTheatresCount === 0
                ? 'No cinemas have been added to the platform yet.'
                : 'Try adjusting your search criteria or city filter.'}
            </p>
          </div>
        ) : (
          theatres.map((theatre) => {
            const isSelected = theatre.id === selectedTheatreId;
            const adminCount = admins.filter((a) => a.theatreId === theatre.id).length;

            return (
              <div
                key={theatre.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectTheatre(theatre.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectTheatre(theatre.id);
                  }
                }}
                className={`group relative flex flex-col gap-2 rounded-lg border p-4 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 shadow-card ring-1 ring-brand-600/30'
                    : 'border-border bg-surface hover:bg-surface-muted hover:border-ink-muted/30 shadow-card'
                }`}
              >
                {/* Chain & Admin Count Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-brand-50 border border-brand-100 text-[10px] font-bold text-brand-600">
                      {theatre.chain.charAt(0)}
                    </span>
                    {theatre.chain}
                  </span>

                  {adminCount > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {adminCount} {adminCount === 1 ? 'Admin' : 'Admins'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      <AlertCircle size={11} />
                      Needs Admin
                    </span>
                  )}
                </div>

                {/* Cinema Title */}
                <div className="mt-0.5">
                  <h2 className="text-sm sm:text-base font-bold text-ink group-hover:text-brand-600 transition-colors">
                    {theatre.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin size={12} className="shrink-0 text-ink-muted" />
                    <span className="truncate">
                      {theatre.city} • {theatre.location}
                    </span>
                  </div>
                </div>

                {/* Footer: Screen count & selection state */}
                <div className="mt-1 flex items-center justify-between border-t border-border pt-2 text-xs text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Film size={12} />
                    {theatre.screensCount} Screens ({theatre.totalSeats} seats)
                  </span>
                  <span
                    className={`flex items-center gap-0.5 font-medium ${
                      isSelected ? 'text-brand-600' : 'text-ink-muted'
                    }`}
                  >
                    {isSelected ? 'Managing' : 'Select'}
                    <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
