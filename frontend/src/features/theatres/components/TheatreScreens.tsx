import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Button,
  EmptyState,
  ErrorState,
  Pagination,
  RefreshButton,
  SearchBar,
  StatusFilter,
} from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useScreens } from '../hooks/useScreens';
import type { ScreenStatusFilter } from '../types/screen.types';
import ScreenCard from './screens/ScreenCard';
import ScreenCardSkeleton from './screens/ScreenCardSkeleton';
import CreateScreenModal from './screens/CreateScreenModal';

const PAGE_SIZE = 20;

const STATUS_OPTIONS: { value: ScreenStatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export interface TheatreScreensProps {
  theatreId: string;
}

export default function TheatreScreens({ theatreId }: TheatreScreensProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ScreenStatusFilter>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error, refetch } = useScreens(theatreId, {
    search: search || undefined,
    status,
    page,
    limit: PAGE_SIZE,
  });

  const screens = data?.items ?? [];
  const pagination = data?.pagination;
  const isFiltering = search !== '' || status !== 'ALL';

  const handleSearch = (term: string) => {
    setSearch(term.trim());
    setPage(1);
  };

  const handleStatusChange = (next: ScreenStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('ALL');
    setPage(1);
  };

  const openCreate = () => setIsCreateOpen(true);

  const renderContent = () => {
    if (isLoading) {
      return (
        <section
          aria-label="Loading screens"
          aria-busy="true"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ScreenCardSkeleton key={index} />
          ))}
        </section>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title="Failed to load screens"
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      );
    }

    if (screens.length === 0) {
      return isFiltering ? (
        <EmptyState
          title="No matching screens found"
          description="No screens match your current search or status filter."
          action={
            <Button type="button" variant="primary" size="md" onClick={handleClearFilters}>
              Clear search and filters
            </Button>
          }
        />
      ) : (
        <EmptyState
          title="No screens yet"
          description="Add the first screen for this theatre to start configuring seats and shows."
          action={
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={openCreate}
              className="flex items-center gap-2"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Add New Screen</span>
            </Button>
          }
        />
      );
    }

    return (
      <section
        aria-label="Theatre screens"
        aria-busy={isFetching}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {screens.map((screen) => (
          <ScreenCard key={screen.id} screen={screen} />
        ))}
      </section>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">Screens Management</h2>

        <div className="flex items-center gap-2.5">
          <RefreshButton
            onClick={() => refetch()}
            isRefreshing={isFetching}
            title="Refresh screens"
            ariaLabel="Refresh screens"
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={openCreate}
            className="flex h-11 items-center gap-2"
          >
            <Plus size={18} aria-hidden="true" />
            <span>Add New Screen</span>
          </Button>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onSearch={handleSearch}
          placeholder="Search by screen name or identifier..."
          ariaLabel="Search screens"
          debounceMs={400}
          searchOnSubmitOnly={false}
          className="flex-1"
        />
        <StatusFilter<ScreenStatusFilter>
          label="Status:"
          value={status}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
        />
      </section>

      {pagination && !isLoading && !isError && screens.length > 0 && (
        <p className="text-xs text-ink-muted md:text-sm">
          Showing <strong className="text-ink">{screens.length}</strong> of{' '}
          <strong className="text-ink">{pagination.total}</strong>{' '}
          {pagination.total === 1 ? 'screen' : 'screens'}
        </p>
      )}

      {renderContent()}

      {pagination && !isError && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}

      <CreateScreenModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        theatreId={theatreId}
      />
    </div>
  );
}
