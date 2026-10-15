import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyTheatres } from '../hooks/useMyTheatres';
import TheatreCard from '../components/TheatreCard';
import TheatreCardSkeleton from '../components/TheatreCardSkeleton';
import { ErrorState, EmptyState, SearchBar, StatusFilter } from '@/shared/ui';

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

      {/* Controls: Reusable Search Bar and Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3.5 shadow-card">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={setSearch}
          showButton={false}
          placeholder="Search theatre by name, location, address..."
          className="flex-1"
        />

        <StatusFilter<'ALL' | 'ACTIVE' | 'INACTIVE'>
          variant="segmented"
          value={filter}
          onChange={setFilter}
          ariaLabel="Filter theatres by status"
          className="self-start sm:self-auto"
          options={[
            { value: 'ALL', label: 'All' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
          ]}
        />
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