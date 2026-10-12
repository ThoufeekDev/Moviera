import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyTheatres } from '../hooks/useMyTheatres';
import TheatreCard from '../components/TheatreCard';
import TheatreCardSkeleton from '../components/TheatreCardSkeleton';
import { ErrorState } from '@/shared/ui/ErrorState';
import { EmptyState } from '@/shared/ui/EmptyState';

export function MyTheatrePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const { data: theatres, isLoading, isError, error, refetch } = useMyTheatres();

  const handleManageTheatre = (theatreId: string) => {
    navigate(`/theatre-admin/theatres/${theatreId}`);
  };

  const filteredTheatres = theatres?.filter((theatre) => {
    const matchesSearch =
      theatre.name.toLowerCase().includes(search.toLowerCase()) ||
      theatre.address.toLowerCase().includes(search.toLowerCase()) ||
      theatre.city?.name.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'ACTIVE') return theatre.isActive;
    if (filter === 'INACTIVE') return !theatre.isActive;
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
            My Theatres
          </h1>
          <p className="text-xs md:text-sm text-ink-muted">
            Manage, update, and monitor all multiplexes and screens assigned to your account.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <TheatreCardSkeleton key={key} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load theatres"
        message={
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading theatres.'
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
          My Theatres
        </h1>
        <p className="text-xs md:text-sm text-ink-muted">
          Manage, update, and monitor all multiplexes and screens assigned to your account.
        </p>
      </header>

      {/* Controls: Search Bar and Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-card">
        <div className="relative flex-1 min-w-0">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 min-h-[44px] w-full rounded-md border border-border bg-surface pl-10 pr-4 text-base text-ink placeholder:text-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 transition-colors"
            placeholder="Search theatre by name, location, address..."
          />
        </div>

        {/* Filter chips / tabs with min 44px touch targets */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto" role="tablist" aria-label="Filter theatres">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ALL'}
            className={`inline-flex h-11 min-h-[44px] items-center justify-center rounded-md px-4 text-xs md:text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
              filter === 'ALL'
                ? 'bg-brand-600 text-white font-bold shadow-card'
                : 'border border-border bg-surface text-ink hover:bg-surface-muted'
            }`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'ACTIVE'}
            className={`inline-flex h-11 min-h-[44px] items-center justify-center rounded-md px-4 text-xs md:text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
              filter === 'ACTIVE'
                ? 'bg-brand-600 text-white font-bold shadow-card'
                : 'border border-border bg-surface text-ink hover:bg-surface-muted'
            }`}
            onClick={() => setFilter('ACTIVE')}
          >
            Active
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'INACTIVE'}
            className={`inline-flex h-11 min-h-[44px] items-center justify-center rounded-md px-4 text-xs md:text-sm font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
              filter === 'INACTIVE'
                ? 'bg-brand-600 text-white font-bold shadow-card'
                : 'border border-border bg-surface text-ink hover:bg-surface-muted'
            }`}
            onClick={() => setFilter('INACTIVE')}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Main Content / Cards Grid */}
      {!filteredTheatres || filteredTheatres.length === 0 ? (
        <EmptyState
          title="No theatres found"
          description={
            theatres && theatres.length > 0
              ? 'No theatres matched your search or filter criteria.'
              : "You don't currently have any theatres assigned to your account."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTheatres.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              theatre={theatre}
              onManage={handleManageTheatre}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTheatrePage;