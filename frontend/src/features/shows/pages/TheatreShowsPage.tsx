import { useMyTheatres } from '@/features/theatres';
import { ErrorState } from '@/shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShowListSection from '../components/ShowListSection';
import TheatreShowsSkeleton from '../components/TheatreShowsSkeleton';

export default function TheatreShowsPage() {
  const navigate = useNavigate();
  const { data: theatres = [], isLoading, isError, refetch } = useMyTheatres();
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('ALL');

  if (isLoading) {
    return <TheatreShowsSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ErrorState
          title="Failed to load theatres"
          message="Could not fetch your assigned theatres."
          onRetry={refetch}
        />
      </div>
    );
  }

  const activeTheatreId =
    selectedTheatreId === 'ALL' ? undefined : selectedTheatreId;

  const handleScheduleShow = () => {
    if (activeTheatreId) {
      navigate(`/theatre-admin/theatres/${activeTheatreId}/shows/create`);
    } else if (theatres.length === 1) {
      navigate(`/theatre-admin/theatres/${theatres[0].id}/shows/create`);
    } else {
      navigate('/theatre-admin/shows/create');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {theatres.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4 shadow-card">
          <label
            htmlFor="shows-theatre-filter"
            className="text-xs font-semibold text-ink"
          >
            Filter by Theatre:
          </label>
          <select
            id="shows-theatre-filter"
            value={selectedTheatreId}
            onChange={(e) => setSelectedTheatreId(e.target.value)}
            className="min-h-[38px] rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink focus:border-brand-600 focus:outline-none"
          >
            <option value="ALL">All Assigned Theatres</option>
            {theatres.map((theatre) => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name} ({theatre.city.name})
              </option>
            ))}
          </select>
        </div>
      )}

      <ShowListSection
        theatreId={activeTheatreId}
        onScheduleShow={handleScheduleShow}
      />
    </div>
  );
}
