import { Search, X, MapPin, Filter } from 'lucide-react';

export interface TheatreAdminFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
  statusFilter: 'ALL' | 'ASSIGNED' | 'UNASSIGNED';
  onStatusFilterChange: (status: 'ALL' | 'ASSIGNED' | 'UNASSIGNED') => void;
  totalTheatresCount: number;
  assignedTheatresCount: number;
  unassignedTheatresCount: number;
}

export const TheatreAdminFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  cities,
  statusFilter,
  onStatusFilterChange,
  totalTheatresCount,
  assignedTheatresCount,
  unassignedTheatresCount,
}: TheatreAdminFilterBarProps) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input & City Dropdown */}
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by cinema name, location, or chain..."
            className="w-full rounded-md border border-border bg-surface-muted/50 py-2 pl-9 pr-9 text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="relative sm:w-48 shrink-0">
          <MapPin
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
          />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border bg-surface-muted/50 py-2 pl-8.5 pr-8 text-xs sm:text-sm text-ink focus:border-brand-600 focus:bg-surface focus:outline-none focus:ring-1 focus:ring-brand-600 transition-colors cursor-pointer"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === 'ALL' ? 'All Cities' : city}
              </option>
            ))}
          </select>
          <Filter
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
          />
        </div>
      </div>

      {/* Status Segmented Buttons */}
      <div
        className="inline-flex items-center rounded-md border border-border bg-surface-muted/60 p-1 self-start sm:self-auto"
        role="group"
        aria-label="Filter cinemas by assignment status"
      >
        <button
          type="button"
          onClick={() => onStatusFilterChange('ALL')}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-surface text-ink font-bold shadow-card'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <span>All</span>
          <span className="rounded-full bg-surface-muted px-1.5 py-0.2 text-[10px] text-ink-muted">
            {totalTheatresCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('ASSIGNED')}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'ASSIGNED'
              ? 'bg-surface text-emerald-700 font-bold shadow-card'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <span>Assigned</span>
          <span className="rounded-full bg-emerald-50 text-emerald-700 px-1.5 py-0.2 text-[10px] font-semibold">
            {assignedTheatresCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange('UNASSIGNED')}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            statusFilter === 'UNASSIGNED'
              ? 'bg-surface text-amber-700 font-bold shadow-card'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <span>Unassigned</span>
          <span className="rounded-full bg-amber-50 text-amber-700 px-1.5 py-0.2 text-[10px] font-semibold">
            {unassignedTheatresCount}
          </span>
        </button>
      </div>
    </div>
  );
};
