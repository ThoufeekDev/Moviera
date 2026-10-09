import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Skeleton } from '@/shared/ui/Skeleton';
import { useTheatreOverview } from '../hooks/useTheatreOverview';

import TheatreHeader from './components/TheatreHeader';
import TheatreOverview from './components/TheatreOverview';
import TheatreScreens from './components/TheatreScreens';
import TheatreSettings from './components/TheatreSettings';
import TheatreShows from './components/TheatreShows';
import TheatreTabs, { type TheatreTab } from './components/TheatreTabs';

export default function TheatreDetailsPage() {
  const { theatreId } = useParams<{ theatreId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TheatreTab>('OVERVIEW');

  const { data: overview, isLoading } = useTheatreOverview(theatreId!);

  const theatre = overview?.theatre;

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Skeleton className="h-9 w-32 rounded-xl mb-2" />
        <Skeleton className="h-40 w-full rounded-3xl mb-2" />
        <Skeleton className="h-12 w-full rounded-2xl mb-2" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
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
        className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 hover:-translate-x-0.5"
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