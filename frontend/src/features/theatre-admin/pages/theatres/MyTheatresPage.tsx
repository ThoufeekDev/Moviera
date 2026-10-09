import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyTheatres } from './hooks/useMyTheatres';
import TheatreCard from './components/TheatreCard/TheatreCard';
import TheatreCardSkeleton from './components/TheatreCard/TheatreCardSkeleton';
import { ErrorState } from '@/shared/ui/ErrorState';

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
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-7 sm:p-9 shadow-lg">
          <div className="flex max-w-2xl flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-brand-500/35 bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]" />
              Partner Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-brand-500">Theatres</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-300">
              Manage, update, and monitor all multiplexes and screens assigned to your account.
            </p>
          </div>
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header Banner */}
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-7 sm:p-9 shadow-lg">
        <div className="flex max-w-2xl flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-brand-500/35 bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)]" />
            Partner Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-brand-500">Theatres</span>
          </h1>
          <p className="text-sm leading-relaxed text-slate-300">
            Manage, update, and monitor all multiplexes and screens assigned to your account.
          </p>
        </div>
      </header>

      {/* Controls: Search Bar and Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
        <div className="relative flex min-w-[280px] flex-1 items-center">
          <svg
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="Search theatre by name, location, address..."
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setFilter('ACTIVE')}
          >
            Active
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === 'INACTIVE'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setFilter('INACTIVE')}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Main Content / Cards Grid */}
      {!filteredTheatres || filteredTheatres.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-lg font-bold text-slate-800">No theatres found</h2>
          <p className="mt-1 text-sm text-slate-500">
            {theatres && theatres.length > 0
              ? 'No theatres matched your search or filter criteria.'
              : "You don't currently have any theatres assigned to your account."}
          </p>
        </div>
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