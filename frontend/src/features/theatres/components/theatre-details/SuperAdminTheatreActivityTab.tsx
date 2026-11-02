import { useState } from 'react';
import {
  History,
  Building,
  Edit,
  Film,
  UserCheck,
  ShieldCheck,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import type {
  SuperAdminTheatreDetail,
  SuperAdminTheatreActivityItem,
  SuperAdminTheatreActivityType,
} from '../../types/superAdminTheatreDetail.types';

interface SuperAdminTheatreActivityTabProps {
  theatre: SuperAdminTheatreDetail;
}

export default function SuperAdminTheatreActivityTab({
  theatre,
}: SuperAdminTheatreActivityTabProps) {
  const [filterType, setFilterType] = useState<string>('ALL');

  const getEventIcon = (type: SuperAdminTheatreActivityType) => {
    switch (type) {
      case 'THEATRE_CREATED':
        return <Building size={16} className="text-brand-600" />;
      case 'THEATRE_UPDATED':
        return <Edit size={16} className="text-amber-600" />;
      case 'SCREEN_CREATED':
      case 'SCREEN_UPDATED':
        return <Film size={16} className="text-sky-600" />;
      case 'ADMIN_ASSIGNED':
        return <UserCheck size={16} className="text-emerald-600" />;
      case 'STATUS_CHANGED':
        return <ShieldCheck size={16} className="text-rose-600" />;
      default:
        return <History size={16} className="text-ink-muted" />;
    }
  };

  const getEventBadgeClass = (type: SuperAdminTheatreActivityType) => {
    switch (type) {
      case 'THEATRE_CREATED':
        return 'border-brand-500/30 bg-brand-50 text-brand-700';
      case 'THEATRE_UPDATED':
        return 'border-amber-500/30 bg-amber-50 text-amber-700';
      case 'SCREEN_CREATED':
      case 'SCREEN_UPDATED':
        return 'border-sky-500/30 bg-sky-50 text-sky-700';
      case 'ADMIN_ASSIGNED':
        return 'border-emerald-500/30 bg-emerald-50 text-emerald-700';
      case 'STATUS_CHANGED':
        return 'border-rose-500/30 bg-rose-50 text-rose-700';
      default:
        return 'border-border bg-surface-muted text-ink-muted';
    }
  };

  const filteredEvents = theatre.activityHistory.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-ink">
            Activity &amp; Audit History ({theatre.activityHistory.length})
          </h2>
          <p className="text-xs text-ink-muted">
            Chronological audit log of theatre lifecycle milestones and configuration updates
          </p>
        </div>

        {/* Filter selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter size={15} className="text-ink-muted shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 cursor-pointer"
          >
            <option value="ALL">All Event Types</option>
            <option value="THEATRE_CREATED">Theatre Created</option>
            <option value="THEATRE_UPDATED">Theatre Updated</option>
            <option value="SCREEN_CREATED">Screens Added</option>
            <option value="ADMIN_ASSIGNED">Admin Assigned</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <History size={24} className="text-ink-muted" />
          <h3 className="mt-3 text-sm font-bold text-ink">No matching activity records</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Try resetting the filter to see all events recorded for this theatre.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:bottom-0 before:left-3 before:top-3 before:w-0.5 before:bg-border">
          <div className="flex flex-col gap-6">
            {filteredEvents.map((event: SuperAdminTheatreActivityItem) => (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Timeline Node Dot */}
                <div className="absolute -left-6 sm:-left-8 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-brand-600" />
                </div>

                {/* Event Card */}
                <div className="flex-1 rounded-xl border border-border bg-surface p-4 shadow-card hover:border-brand-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted">
                        {getEventIcon(event.type)}
                      </div>
                      <h3 className="text-sm font-bold text-ink">{event.title}</h3>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getEventBadgeClass(
                          event.type,
                        )}`}
                      >
                        {event.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock size={13} />
                      <time dateTime={event.timestamp}>{formatDate(event.timestamp)}</time>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-ink leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <User size={12} className="text-brand-600" />
                      <span>
                        Actor:{' '}
                        <strong className="text-ink">
                          {event.performedBy || 'Super Admin'}
                        </strong>
                      </span>
                    </div>

                    <span className="font-mono text-ink-muted">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
