import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAllTheatres, CreateTheatreModal } from '@/features/theatres';
import SuperAdminTheatreCard from '@/features/theatres/components/SuperAdminTheatreCard';
import SuperAdminTheatreCardSkeleton from '@/features/theatres/components/SuperAdminTheatreCardSkeleton';
import {
  Pagination,
  ErrorState,
  EmptyState,
  Button,
  SearchBar,
  StatusFilter,
  RefreshButton,
} from '@/shared/ui';

export default function ManageTheatresPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);

  // Search handler (SearchBar handles debounce, Enter, and button click)
  const handleSearch = (term: string) => {
    setAppliedSearch(term);
    setPage(1);
  };

  // Status filter handler
  const handleStatusChange = (newStatus: 'ALL' | 'ACTIVE' | 'INACTIVE') => {
    setStatus(newStatus);
    setPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setAppliedSearch('');
    setStatus('ALL');
    setPage(1);
  };

  // TanStack Query with key-based caching, server pagination, and AbortSignal
  const { data, isLoading, isFetching, isError, error, refetch } = useAllTheatres({
    page,
    limit: 20,
    search: appliedSearch || undefined,
    status,
  });

  const theatres = data?.items ?? [];
  const pagination = data?.pagination;
  const isFiltering = appliedSearch !== '' || status !== 'ALL';

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <ErrorState
          title="Failed to load theatres"
          message={
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while fetching theatres from the server.'
          }
          onRetry={() => refetch()}
          icon="cinema"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
            Manage Theatres
          </h1>
          <p className="text-sm text-ink-muted">
            Browse, search, and monitor all registered multiplexes and single screens.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Reusable Refresh Button */}
          <RefreshButton
            onClick={() => refetch()}
            isRefreshing={isFetching}
            title="Refresh theatres list"
            ariaLabel="Refresh theatres list"
          />

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-11 shrink-0 flex items-center gap-2 font-medium shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Theatre</span>
          </Button>
        </div>
      </header>

      {/* Search and Filters Bar with Reusable Components */}
      <section className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={appliedSearch}
          placeholder="Search by name, email, or licence ID..."
          onSearch={handleSearch}
          className="flex-1"
        />

        <div className="flex items-center gap-2 shrink-0">
          <StatusFilter<'ALL' | 'ACTIVE' | 'INACTIVE'>
            label="Status:"
            value={status}
            onChange={handleStatusChange}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />

          {isFiltering && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClearFilters}
              className="h-11 shrink-0 text-xs"
              title="Clear all search and filters"
            >
              Clear
            </Button>
          )}
        </div>
      </section>

      {/* Refetching subtle indicator */}
      {isFetching && !isLoading && (
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-brand-500/20 bg-brand-50/80 px-3.5 py-1 text-xs font-semibold text-brand-700 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-brand-600 animate-ping" aria-hidden="true" />
          <span>Refreshing theatre list...</span>
        </div>
      )}

      {/* Active Results Summary */}
      {pagination && !isLoading && theatres.length > 0 && (
        <div className="flex items-center justify-between text-xs md:text-sm text-ink-muted">
          <span>
            Showing{' '}
            <strong className="text-ink">
              {(pagination.page - 1) * pagination.limit + 1}
            </strong>{' '}
            to{' '}
            <strong className="text-ink">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{' '}
            of <strong className="text-ink">{pagination.total}</strong> registered theatres
          </span>
          {appliedSearch && (
            <span className="italic">
              Matching &ldquo;{appliedSearch}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Content Area: Loading / Empty / Grid */}
      {isLoading ? (
        <section
          aria-label="Loading theatres"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <SuperAdminTheatreCardSkeleton key={index} />
          ))}
        </section>
      ) : theatres.length === 0 ? (
        isFiltering ? (
          <EmptyState
            title="No matching theatres found"
            description="We couldn't find any theatres matching your current search or status filters."
            action={
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleClearFilters}
              >
                Clear search and filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="No theatres registered"
            description="There are currently no theatres in the system. Registered theatres will appear here."
            action={
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create Theatre</span>
              </Button>
            }
          />
        )
      ) : (
        <section
          aria-label="Registered theatres grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {theatres.map((theatre) => (
            <SuperAdminTheatreCard
              key={theatre.id}
              theatre={theatre}
            />
          ))}
        </section>
      )}

      {/* Server Pagination with Reusable Component */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Create Theatre Modal */}
      <CreateTheatreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
