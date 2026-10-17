import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFacilities } from '../hooks/useFacilities';
import FacilityCard from '../components/FacilityCard';
import FacilityCardSkeleton from '../components/FacilityCardSkeleton';
import FacilityModal from '../components/FacilityModal';
import FacilityStatusConfirmModal from '../components/FacilityStatusConfirmModal';
import type { SuperAdminFacilityItem } from '../api/facilities.api';
import {
  Pagination,
  ErrorState,
  EmptyState,
  Button,
  SearchBar,
  StatusFilter,
  RefreshButton,
  SuccessModal,
} from '@/shared/ui';

export default function FacilitiesPage() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<SuperAdminFacilityItem | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ name: string; isEditing: boolean } | null>(null);

  // Status confirmation modal state
  const [statusConfirmFacility, setStatusConfirmFacility] = useState<SuperAdminFacilityItem | null>(null);

  // Filter & pagination states
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [page, setPage] = useState(1);

  // Handlers
  const handleSearch = (term: string) => {
    setAppliedSearch(term.trim());
    setPage(1);
  };

  const handleStatusChange = (newStatus: 'ALL' | 'ACTIVE' | 'INACTIVE') => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleClearFilters = () => {
    setAppliedSearch('');
    setStatus('ALL');
    setPage(1);
  };

  const handleOpenCreateModal = () => {
    setEditingFacility(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (facility: SuperAdminFacilityItem) => {
    setEditingFacility(facility);
    setIsModalOpen(true);
  };

  const handleOpenStatusConfirm = (facility: SuperAdminFacilityItem) => {
    setStatusConfirmFacility(facility);
  };

  // TanStack Query with key caching, server pagination, and AbortSignal
  const { data, isLoading, isFetching, isError, error, refetch } = useFacilities({
    page,
    limit: 8,
    search: appliedSearch || undefined,
    status,
  });

  const facilities = data?.items ?? [];
  const pagination = data?.pagination;
  const isFiltering = appliedSearch !== '' || status !== 'ALL';

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <ErrorState
          title="Failed to load facilities"
          message={
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred while fetching facilities from the server.'
          }
          onRetry={() => refetch()}
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
            Theatre Facilities
          </h1>
          <p className="text-sm text-ink-muted">
            Configure master amenities and services that theatres can feature on their public profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Reusable Refresh Button */}
          <RefreshButton
            onClick={() => refetch()}
            isRefreshing={isFetching}
            title="Refresh facilities list"
            ariaLabel="Refresh facilities list"
          />

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleOpenCreateModal}
            className="h-11 shrink-0 flex items-center gap-2 font-medium shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Facility</span>
          </Button>
        </div>
      </header>

      {/* Search and Filters Bar */}
      <section className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={appliedSearch}
          placeholder="Search by facility name or description..."
          onSearch={handleSearch}
          debounceMs={400}
          searchOnSubmitOnly={false}
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
          <span>Refreshing facilities...</span>
        </div>
      )}

      {/* Active Results Summary */}
      {pagination && !isLoading && facilities.length > 0 && (
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
            of <strong className="text-ink">{pagination.total}</strong> master facilities
          </span>
          {appliedSearch && (
            <span className="italic">
              Matching &ldquo;{appliedSearch}&rdquo;
            </span>
          )}
        </div>
      )}

      {/* Content Grid Area */}
      {isLoading ? (
        <section
          aria-label="Loading facilities"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <FacilityCardSkeleton key={index} />
          ))}
        </section>
      ) : facilities.length === 0 ? (
        isFiltering ? (
          <EmptyState
            title="No matching facilities found"
            description="We couldn't find any facilities matching your current search or status filter."
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
            title="No facilities yet"
            description="Start building your master facility catalogue by adding parking, food court, wifi, etc."
            action={
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create Facility</span>
              </Button>
            }
          />
        )
      ) : (
        <section
          aria-label="Registered facilities grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onEdit={handleOpenEditModal}
              onToggleStatus={handleOpenStatusConfirm}
            />
          ))}
        </section>
      )}

      {/* Server Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Create / Edit Facility Modal */}
      <FacilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facility={editingFacility}
        onSuccess={(name, isEditing) => {
          setIsModalOpen(false);
          setSuccessInfo({ name, isEditing });
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={Boolean(successInfo)}
        onClose={() => setSuccessInfo(null)}
        title={
          successInfo?.isEditing
            ? 'Facility Updated Successfully!'
            : 'Facility Created Successfully!'
        }
        description={
          successInfo?.isEditing
            ? 'The facility configuration has been updated and applied across all theatre profiles.'
            : 'The new theatre facility has been created and is now available for cinema theatres to feature.'
        }
        entityName={successInfo?.name}
        entityType="Facility"
        primaryAction={{
          label: 'Done',
          onClick: () => setSuccessInfo(null),
        }}
        secondaryAction={
          !successInfo?.isEditing
            ? {
                label: 'Create Another Facility',
                onClick: () => {
                  setSuccessInfo(null);
                  handleOpenCreateModal();
                },
              }
            : undefined
        }
      />

      {/* Status Toggle Confirmation Modal */}
      <FacilityStatusConfirmModal
        isOpen={Boolean(statusConfirmFacility)}
        onClose={() => setStatusConfirmFacility(null)}
        facility={statusConfirmFacility}
      />
    </div>
  );
}
