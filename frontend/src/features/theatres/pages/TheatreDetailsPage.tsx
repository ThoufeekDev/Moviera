import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Skeleton } from '@/shared/ui/Skeleton';
import { useTheatreOverview } from '../hooks/useTheatreOverview';

import TheatreHeader from '../components/TheatreHeader';
import TheatreOverview from '../components/TheatreOverview';
import TheatreScreens from '../components/TheatreScreens';
import TheatreSettings from '../components/TheatreSettings';
import TheatreShows from '../components/TheatreShows';
import TheatreTabs, { type TheatreTab } from '../components/TheatreTabs';

export default function TheatreDetailsPage() {
  const { theatreId } = useParams<{ theatreId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TheatreTab>('OVERVIEW');

  const { data: overview, isLoading } = useTheatreOverview(theatreId!);

  const theatre = overview?.theatre;

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Skeleton className="h-11 w-32 rounded-md mb-2" />
        <Skeleton className="h-40 w-full rounded-lg mb-2" />
        <Skeleton className="h-12 w-full rounded-md mb-2" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!theatre || !overview) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* Back Navigation */}
      <button
        type="button"
        onClick={() => navigate('/theatre-admin/theatres')}
        className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>My Theatres</span>
      </button>

      {/* Theatre Header + Tabs */}
      <TheatreHeader theatre={theatre}>
        <TheatreTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalScreens={overview.statistics.totalScreens}
          totalShows={overview.statistics.totalShows}
        />
      </TheatreHeader>

      {/* Overview */}
      {activeTab === 'OVERVIEW' && <TheatreOverview overview={overview} />}

      {/* Screens */}
      {activeTab === 'SCREENS' && <TheatreScreens />}

      {/* Shows */}
      {activeTab === 'SHOWS' && (
        <TheatreShows
          totalShows={overview.statistics.totalShows}
          totalScreens={overview.statistics.totalScreens}
        />
      )}

      {/* Settings */}
      {activeTab === 'SETTINGS' && <TheatreSettings />}
    </div>
  );
}