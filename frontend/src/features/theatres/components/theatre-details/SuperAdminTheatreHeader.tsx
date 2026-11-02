import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  Edit,
  MoreVertical,
  ShieldAlert,
  Archive,
  UserCheck,
  Building2,
  Film,
  CalendarClock,
  Ticket,
  History,
} from 'lucide-react';
import type { SuperAdminTheatreDetail } from '../../types/superAdminTheatreDetail.types';
import { Button } from '@/shared/ui/Button';

export type SuperAdminTheatreTab = 'OVERVIEW' | 'SCREENS' | 'SHOWS' | 'BOOKINGS' | 'ACTIVITY';

interface SuperAdminTheatreHeaderProps {
  theatre: SuperAdminTheatreDetail;
  activeTab: SuperAdminTheatreTab;
  onTabChange: (tab: SuperAdminTheatreTab) => void;
  onActionNotice: (action: string) => void;
}

export default function SuperAdminTheatreHeader({
  theatre,
  activeTab,
  onTabChange,
  onActionNotice,
}: SuperAdminTheatreHeaderProps) {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(theatre.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const initials = (() => {
    const parts = theatre.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return theatre.name.slice(0, 2).toUpperCase() || 'TH';
  })();

  const formattedDate = theatre.createdAt
    ? new Date(theatre.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Unknown';

  const tabs: Array<{ id: SuperAdminTheatreTab; label: string; icon: typeof Building2; count?: number }> = [
    { id: 'OVERVIEW', label: 'Overview', icon: Building2 },
    { id: 'SCREENS', label: 'Screens & Facilities', icon: Film, count: theatre.statistics.totalScreens },
    { id: 'SHOWS', label: 'Shows', icon: CalendarClock, count: theatre.statistics.todayShows },
    { id: 'BOOKINGS', label: 'Bookings', icon: Ticket, count: theatre.statistics.todayBookings },
    { id: 'ACTIVITY', label: 'Activity & Audit', icon: History, count: theatre.activityHistory.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/super-admin/alltheatres')}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-card transition-all hover:border-brand-500/40 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Manage Theatres</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span>Theatres</span>
          <span>/</span>
          <span className="font-medium text-ink truncate max-w-[200px]">{theatre.name}</span>
        </div>
      </div>

      {/* Main Header Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-nav via-[#1c1d24] to-[#121316] p-6 sm:p-8 text-nav-ink shadow-card">
        {/* Ambient lighting glow */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Logo & Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 shadow-inner">
              {theatre.logoUrl ? (
                <img
                  src={theatre.logoUrl}
                  alt={`${theatre.name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold tracking-wider text-brand-400">
                  {initials}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {theatre.name}
                </h1>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm border ${
                    theatre.isActive
                      ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/20 text-rose-300'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      theatre.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span>{theatre.isActive ? 'Active' : 'Inactive'}</span>
                </span>

                {/* Slug Badge */}
                <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/80 font-mono">
                  /{theatre.slug}
                </span>
              </div>

              {/* Meta details row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-nav-ink/75">
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  title="Click to copy Theatre ID"
                >
                  <span>ID: {theatre.id}</span>
                  {copiedId ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>

                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={13} className="text-brand-400" />
                  <span>Registered {formattedDate}</span>
                </span>

                <span className="text-white/40">•</span>

                <span>
                  {theatre.city.name}, {theatre.city.state}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Menu */}
          <div className="relative flex items-center gap-2.5 self-start shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => onActionNotice('Edit Theatre')}
              className="flex items-center gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"
            >
              <Edit size={16} />
              <span>Edit Theatre</span>
            </Button>

            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                size="md"
                aria-label="More actions"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="flex items-center justify-center p-2.5 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white cursor-pointer"
              >
                <MoreVertical size={18} />
              </Button>

              {isActionsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsActionsOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-xl text-ink">
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionsOpen(false);
                        onActionNotice(
                          theatre.isActive ? 'Deactivate Theatre' : 'Activate Theatre',
                        );
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-ink hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <ShieldAlert size={15} className="text-amber-500" />
                      <span>{theatre.isActive ? 'Deactivate Theatre' : 'Activate Theatre'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsActionsOpen(false);
                        onActionNotice('Archive Theatre');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-danger-600 hover:bg-danger-600/10 transition-colors cursor-pointer"
                    >
                      <Archive size={15} />
                      <span>Archive Theatre</span>
                    </button>

                    <div className="my-1 border-t border-border" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsActionsOpen(false);
                        navigate('/super-admin/theatres');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-ink hover:bg-surface-muted transition-colors cursor-pointer"
                    >
                      <UserCheck size={15} className="text-brand-600" />
                      <span>Manage Admin Assignments</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 border-t border-white/10 pt-4">
          <nav
            aria-label="Theatre Detail Tabs"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`group relative flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-nav-ink/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? 'text-white' : 'text-nav-ink/60 group-hover:text-white'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
