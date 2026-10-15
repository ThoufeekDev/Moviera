import { MapPin, Filter } from 'lucide-react';
import { SearchBar, StatusFilter } from '@/shared/ui';

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
        {/* Reusable Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onSearch={onSearchChange}
          showButton={false}
          placeholder="Search by cinema name, location, or chain..."
          className="flex-1"
          inputClassName="h-10 bg-surface-muted/50 text-xs sm:text-sm py-2 pl-9"
        />

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

      {/* Reusable Segmented Status Filter */}
      <StatusFilter<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>
        variant="segmented"
        value={statusFilter}
        onChange={onStatusFilterChange}
        ariaLabel="Filter cinemas by assignment status"
        className="self-start sm:self-auto"
        options={[
          {
            value: 'ALL',
            label: 'All',
            count: totalTheatresCount,
          },
          {
            value: 'ASSIGNED',
            label: 'Assigned',
            count: assignedTheatresCount,
            activeClassName: 'text-emerald-700',
            badgeClassName: 'bg-emerald-50 text-emerald-700',
          },
          {
            value: 'UNASSIGNED',
            label: 'Unassigned',
            count: unassignedTheatresCount,
            activeClassName: 'text-amber-700',
            badgeClassName: 'bg-amber-50 text-amber-700',
          },
        ]}
      />
    </div>
  );
};

