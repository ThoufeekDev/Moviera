import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSuperAdminTheatreDetail } from '../hooks/useSuperAdminTheatreDetail';
import SuperAdminTheatreHeader, {
  type SuperAdminTheatreTab,
} from '../components/theatre-details/SuperAdminTheatreHeader';
import SuperAdminTheatreOverviewTab from '../components/theatre-details/SuperAdminTheatreOverviewTab';
import SuperAdminTheatreScreensTab from '../components/theatre-details/SuperAdminTheatreScreensTab';
import SuperAdminTheatreShowsTab from '../components/theatre-details/SuperAdminTheatreShowsTab';
import SuperAdminTheatreBookingsTab from '../components/theatre-details/SuperAdminTheatreBookingsTab';
import SuperAdminTheatreActivityTab from '../components/theatre-details/SuperAdminTheatreActivityTab';
import { Skeleton, ErrorState, Button } from '@/shared/ui';

export default function SuperAdminTheatreDetailPage() {
  const { theatreId } = useParams<{ theatreId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<SuperAdminTheatreTab>('OVERVIEW');

  const {
    data: theatre,
    isLoading,
    isError,
    error,
    refetch,
  } = useSuperAdminTheatreDetail(theatreId ?? '');

  // If the user accessed the page via a raw CUID, canonicalize to slug-friendly URL
  useEffect(() => {
    if (theatre?.slug && theatreId && theatreId !== theatre.slug) {
      const currentPath = location.pathname;
      const isAllTheatresPath = currentPath.includes('/alltheatres/');
      const targetBase = isAllTheatresPath
        ? '/super-admin/alltheatres/'
        : '/super-admin/theatres/';
      navigate(`${targetBase}${theatre.slug}`, { replace: true });
    }
  }, [theatre?.slug, theatreId, location.pathname, navigate]);

  const handleActionNotice = (actionName: string) => {
    toast.info(`${actionName} functionality will be supported in the next update.`, {
      position: 'top-right',
      autoClose: 3500,
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Top Breadcrumb Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Header Banner Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-nav p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-8 w-64 rounded-md" />
              <Skeleton className="h-4 w-48 rounded" />
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-4 flex gap-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>

        {/* Content Section Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !theatre) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 p-4 sm:p-6 lg:p-8">
        <ErrorState
          title="Theatre details unavailable"
          message={
            error instanceof Error
              ? error.message
              : 'Failed to retrieve theatre details from the server.'
          }
          onRetry={() => refetch()}
          icon="theatre"
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => navigate('/super-admin/alltheatres')}
        >
          Back to Manage Theatres
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {/* ── Theatre Header & Tab Navigation ─────────────────────────────────── */}
      <SuperAdminTheatreHeader
        theatre={theatre}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onActionNotice={handleActionNotice}
      />

      {/* ── Tab Views ───────────────────────────────────────────────────────── */}
      <main>
        {activeTab === 'OVERVIEW' && (
          <SuperAdminTheatreOverviewTab
            theatre={theatre}
            onNavigateToScreens={() => setActiveTab('SCREENS')}
          />
        )}

        {activeTab === 'SCREENS' && (
          <SuperAdminTheatreScreensTab theatre={theatre} />
        )}

        {activeTab === 'SHOWS' && (
          <SuperAdminTheatreShowsTab theatre={theatre} />
        )}

        {activeTab === 'BOOKINGS' && (
          <SuperAdminTheatreBookingsTab theatre={theatre} />
        )}

        {activeTab === 'ACTIVITY' && (
          <SuperAdminTheatreActivityTab theatre={theatre} />
        )}
      </main>
    </div>
  );
}
