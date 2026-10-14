import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
  ShieldCheck,
  RefreshCw,
  Building2,
  Users,
  UserPlus,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import {
  useTheatresForAdmin,
  useTheatreAdminStats,
  useEligibleTheatreAdmins,
  useUpdateTheatreAdminAssignment,
} from '@/features/theatres';
import {
  TheatreAdminKPIs,
  TheatreAdminFilterBar,
  TheatreListRail,
  TheatreDetailWorkspace,
  TheatreAdminDirectoryView,
  TheatreAdminAssignModal,
  TheatreAdminRevokeModal,
  TheatreAdminAuditTrail,
  type TheatreItem,
  type AssignedAdmin,
  type ActivityItem,
  type AdminRole,
  AVATAR_PALETTE,
  ROLE_CONFIG,
} from '../components/theatre-management';

export default function TheatreAdminManagementPage() {
  // ── UI & View State ───────────────────────────────────────────────────────
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ASSIGNED' | 'UNASSIGNED'>('ALL');
  const [viewMode, setViewMode] = useState<'WORKSPACE' | 'DIRECTORY'>('WORKSPACE');

  // Debounced Search (400ms delay to prevent querying on every keystroke)
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Backend query parameters (limited to protect scale against 1M records)
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      city: selectedCity !== 'ALL' ? selectedCity : undefined,
      status: statusFilter,
      limit: 50,
    }),
    [debouncedSearch, selectedCity, statusFilter],
  );

  // ── TanStack Query Data Fetching ──────────────────────────────────────────
  const {
    data: rawTheatres = [],
    isLoading: isLoadingTheatres,
    error: theatresError,
    refetch: refetchTheatres,
    isRefetching,
  } = useTheatresForAdmin(queryParams);

  const { data: statsData } = useTheatreAdminStats();
  const { data: eligibleAdmins = [] } = useEligibleTheatreAdmins();
  const updateAssignmentMutation = useUpdateTheatreAdminAssignment();



  // Modals & Notifications
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignModalTargetTheatreId, setAssignModalTargetTheatreId] = useState<string>('');
  const [adminToRevoke, setAdminToRevoke] = useState<AssignedAdmin | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // ── Transform Backend Entities to View Models ─────────────────────────────
  const theatres = useMemo<TheatreItem[]>(() => {
    return rawTheatres.map((t) => ({
      id: t.id,
      name: t.name,
      chain: t.name.split(' ')[0] || 'Cinema',
      city: t.city?.name || 'Unknown',
      location: t.address,
      screensCount: t.screensCount ?? 0,
      totalSeats: t.totalSeats ?? 0,
      isActive: t.isActive,
      licenseNumber: t.licenseNumber ?? 'N/A',
      phone: t.phone ?? 'N/A',
      email: t.email ?? 'N/A',
    }));
  }, [rawTheatres]);

  const admins = useMemo<AssignedAdmin[]>(() => {
    const list: AssignedAdmin[] = [];
    rawTheatres.forEach((t) => {
      (t.assignedAdmins || []).forEach((a, idx) => {
        list.push({
          id: a.id,
          userId: a.userId,
          theatreId: t.id,
          name: a.name || 'Administrator',
          email: a.email,
          phone: a.phone || 'N/A',
          avatarColor: AVATAR_PALETTE[idx % AVATAR_PALETTE.length],
          role: a.role,
          isActive: a.isActive,
          assignedAt: a.assignedAt
            ? new Date(a.assignedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'Unknown',
        });
      });
    });
    return list;
  }, [rawTheatres]);

  // Keep selected theatre synchronized
  useEffect(() => {
    if (!selectedTheatreId && theatres.length > 0) {
      setSelectedTheatreId(theatres[0].id);
    } else if (selectedTheatreId && theatres.length > 0) {
      const exists = theatres.some((t) => t.id === selectedTheatreId);
      if (!exists) {
        setSelectedTheatreId(theatres[0].id);
      }
    }
  }, [theatres, selectedTheatreId]);

  // ── Derived Values & Filtering ────────────────────────────────────────────
  const uniqueCities = useMemo(() => {
    if (statsData?.cities && statsData.cities.length > 0) {
      return ['ALL', ...statsData.cities];
    }
    const cities = Array.from(new Set(theatres.map((t) => t.city).filter(Boolean)));
    return ['ALL', ...cities];
  }, [statsData?.cities, theatres]);

  // Theatres are filtered and limited directly on the backend database
  const filteredTheatres = theatres;

  const selectedTheatre = useMemo(() => {
    if (!theatres.length) return null;
    return theatres.find((t) => t.id === selectedTheatreId) || theatres[0];
  }, [theatres, selectedTheatreId]);

  const currentTheatreAdmins = useMemo(() => {
    if (!selectedTheatre) return [];
    return admins.filter((a) => a.theatreId === selectedTheatre.id);
  }, [admins, selectedTheatre]);

  // Global KPIs from backend stats query
  const totalTheatresCount = statsData ? statsData.totalCinemas : theatres.length;
  const assignedTheatresCount = statsData ? statsData.assignedCinemas : 0;
  const unassignedTheatresCount = statsData ? statsData.unassignedCinemas : 0;
  const totalAdminsCount = statsData ? statsData.totalAdmins : admins.length;
  const activeAdminsCount = statsData
    ? statsData.activeAdmins
    : admins.filter((a) => a.isActive).length;

  // ── User Actions ──────────────────────────────────────────────────────────
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const handleRefresh = async () => {
    await refetchTheatres();
    showToast('Theatre administrative directory refreshed.', 'info');
  };

  const handleOpenAssignModal = (targetTheatreId?: string) => {
    const idToUse = targetTheatreId || selectedTheatre?.id || theatres[0]?.id || '';
    setAssignModalTargetTheatreId(idToUse);
    setIsAssignModalOpen(true);
  };

  const handleToggleAdminStatus = async (adminId: string) => {
    const currentAdmin = admins.find((a) => a.id === adminId);
    if (!currentAdmin) return;
    const nextState = !currentAdmin.isActive;

    try {
      await updateAssignmentMutation.mutateAsync({
        assignmentId: adminId,
        data: { isActive: nextState },
      });

      const theatre = theatres.find((t) => t.id === currentAdmin.theatreId);
      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        adminName: currentAdmin.name,
        theatreName: theatre?.name ?? 'Cinema',
        action: `Status toggled to ${nextState ? 'Active' : 'Suspended'}`,
        type: 'STATUS_CHANGE',
        timestamp: 'Just now',
      };
      setActivities((prev) => [newAct, ...prev.slice(0, 9)]);

      showToast(
        `${currentAdmin.name} is now ${nextState ? 'Active' : 'Suspended'}.`,
        nextState ? 'success' : 'info',
      );
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update administrator status';
      showToast(errorMsg, 'error');
    }
  };

  const handleAssignSuccess = (adminName: string, theatreName: string, role: AdminRole) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      adminName,
      theatreName,
      action: `Assigned as ${ROLE_CONFIG[role].label}`,
      type: 'ASSIGN',
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 9)]);
    showToast(`✓ ${adminName} has been assigned to ${theatreName}!`, 'success');
  };

  const handleRevokeSuccess = (adminName: string, theatreName: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      adminName,
      theatreName,
      action: 'Administrative access revoked by Super Admin',
      type: 'REVOKE',
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 9)]);
    showToast(`Access revoked for ${adminName}.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-200 fixed top-20 right-4 z-50 max-w-md flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-float">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                toastMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-600'
                  : toastMessage.type === 'info'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-brand-50 text-brand-600'
              }`}
            >
              {toastMessage.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            </span>
            <p className="text-xs sm:text-sm font-medium text-ink">{toastMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-ink-muted hover:text-ink transition-colors p-1"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          {/* Breadcrumb / Category Badge */}
          <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-brand-50 border border-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-600">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Super Admin Control Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Theatre Admin Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-2xl">
            Manage theatre access, assign administrators, and control who operates each cinema on
            the Moviera platform.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefetching}
            className="inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-border bg-surface text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            title="Refresh directory"
            aria-label="Refresh directory"
          >
            <RefreshCw size={17} className={isRefetching ? 'animate-spin text-brand-600' : ''} />
          </button>

          {/* View Toggle Tabs */}
          <div
            className="inline-flex items-center rounded-md border border-border bg-surface p-1 shadow-card"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'WORKSPACE'}
              onClick={() => setViewMode('WORKSPACE')}
              className={`inline-flex h-9 items-center gap-1.5 rounded px-3 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'WORKSPACE'
                  ? 'bg-brand-600 text-white font-bold shadow-card'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <Building2 size={13} />
              <span>By Cinema</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'DIRECTORY'}
              onClick={() => setViewMode('DIRECTORY')}
              className={`inline-flex h-9 items-center gap-1.5 rounded px-3 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'DIRECTORY'
                  ? 'bg-brand-600 text-white font-bold shadow-card'
                  : 'text-ink hover:bg-surface-muted'
              }`}
            >
              <Users size={13} />
              <span>All Admins ({admins.length})</span>
            </button>
          </div>

          {/* Primary Assign Button */}
          <Button
            type="button"
            variant="primary"
            onClick={() => handleOpenAssignModal()}
            className="h-11 min-h-[44px] shrink-0"
          >
            <UserPlus size={17} className="mr-1.5 shrink-0" />
            <span>Assign Theatre Admin</span>
          </Button>
        </div>
      </header>

      {/* ── KPI Overview Cards ────────────────────────────────────────────────── */}
      <TheatreAdminKPIs
        totalTheatresCount={totalTheatresCount}
        assignedTheatresCount={assignedTheatresCount}
        unassignedTheatresCount={unassignedTheatresCount}
        totalAdminsCount={totalAdminsCount}
        activeAdminsCount={activeAdminsCount}
        citiesCount={uniqueCities.length - 1}
      />

      {/* ── Search Bar & Filter Controls ──────────────────────────────────────── */}
      <TheatreAdminFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        cities={uniqueCities}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalTheatresCount={theatres.length}
        assignedTheatresCount={assignedTheatresCount}
        unassignedTheatresCount={unassignedTheatresCount}
      />

      {/* ── Content View / Workspace / Directory ──────────────────────────────── */}
      {isLoadingTheatres ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-border bg-surface p-12 text-center shadow-card">
          <RefreshCw size={32} className="animate-spin text-brand-600 mb-3" />
          <h3 className="text-base font-bold text-ink">Loading Theatre Management</h3>
          <p className="text-xs text-ink-muted mt-1">
            Fetching cinemas and assigned administrators from backend...
          </p>
        </div>
      ) : theatresError ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-rose-200 bg-rose-50 p-8 text-center shadow-card">
          <AlertCircle size={32} className="text-rose-600 mb-2" />
          <h3 className="text-base font-bold text-rose-800">Failed to load data</h3>
          <p className="text-xs text-rose-600 mt-1 max-w-md">
            {theatresError instanceof Error
              ? theatresError.message
              : 'An unexpected error occurred while fetching data.'}
          </p>
          <Button variant="primary" size="sm" onClick={() => refetchTheatres()} className="mt-4">
            <RefreshCw size={14} className="mr-1.5" />
            Retry
          </Button>
        </div>
      ) : viewMode === 'WORKSPACE' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Theatre Selector Rail */}
          <TheatreListRail
            theatres={filteredTheatres}
            admins={admins}
            selectedTheatreId={selectedTheatre?.id || ''}
            onSelectTheatre={setSelectedTheatreId}
            totalTheatresCount={theatres.length}
          />

          {/* Right Column: Selected Cinema Command Workspace */}
          <TheatreDetailWorkspace
            selectedTheatre={selectedTheatre}
            theatreAdmins={currentTheatreAdmins}
            onOpenAssignModal={handleOpenAssignModal}
            onToggleAdminStatus={handleToggleAdminStatus}
            onRevokeAdmin={setAdminToRevoke}
            onCopyEmail={handleCopyEmail}
            copiedEmail={copiedEmail}
            totalTheatresCount={theatres.length}
          />
        </div>
      ) : (
        /* All Admins Directory Mode */
        <TheatreAdminDirectoryView
          admins={admins}
          theatres={theatres}
          activeAdminsCount={activeAdminsCount}
          onSelectTheatre={(theatreId) => {
            setSelectedTheatreId(theatreId);
            setViewMode('WORKSPACE');
          }}
          onToggleAdminStatus={handleToggleAdminStatus}
          onRevokeAdmin={setAdminToRevoke}
          onCopyEmail={handleCopyEmail}
          copiedEmail={copiedEmail}
        />
      )}

      {/* ── Recent Activity Log ──────────────────────────────────────────────── */}
      <TheatreAdminAuditTrail activities={activities} />

      {/* ── Assign Theatre Admin Modal ────────────────────────────────────────── */}
      <TheatreAdminAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        theatres={theatres}
        eligibleAdmins={eligibleAdmins}
        initialTheatreId={assignModalTargetTheatreId}
        onAssignSuccess={handleAssignSuccess}
      />

      {/* ── Revoke Confirmation Modal ─────────────────────────────────────────── */}
      <TheatreAdminRevokeModal
        adminToRevoke={adminToRevoke}
        onClose={() => setAdminToRevoke(null)}
        theatres={theatres}
        onRevokeSuccess={handleRevokeSuccess}
        onError={(msg) => showToast(msg, 'error')}
      />
    </div>
  );
}