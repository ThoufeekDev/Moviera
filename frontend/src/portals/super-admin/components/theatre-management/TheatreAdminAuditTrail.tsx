import { History, UserPlus, RefreshCw, UserX, Shield, Clock } from 'lucide-react';
import type { ActivityItem } from './types';

export interface TheatreAdminAuditTrailProps {
  activities: ActivityItem[];
}

export const TheatreAdminAuditTrail = ({ activities }: TheatreAdminAuditTrailProps) => {
  const getBadge = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ASSIGN':
        return {
          icon: <UserPlus size={13} className="text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          label: 'Assigned',
        };
      case 'REVOKE':
        return {
          icon: <UserX size={13} className="text-rose-600" />,
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          label: 'Revoked',
        };
      case 'STATUS_CHANGE':
        return {
          icon: <RefreshCw size={13} className="text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          label: 'Status Change',
        };
      case 'ROLE_CHANGE':
        return {
          icon: <Shield size={13} className="text-purple-600" />,
          bg: 'bg-purple-50 border-purple-200 text-purple-700',
          label: 'Role Change',
        };
    }
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3.5">
        <div className="flex items-center gap-2">
          <History size={17} className="text-brand-600" />
          <h2 className="text-sm sm:text-base font-bold text-ink">Recent Audit Trail</h2>
        </div>
        <span className="text-[11px] text-ink-muted flex items-center gap-1 font-mono">
          <Clock size={12} />
          Current Session Activity
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="flex min-h-[100px] items-center justify-center rounded-md border border-dashed border-border bg-surface-muted/40 p-6 text-center">
          <p className="text-xs text-ink-muted">
            No administrative assignment modifications recorded in this session.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border -my-1">
          {activities.map((item) => {
            const badge = getBadge(item.type);
            return (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border ${badge.bg}`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <p className="font-medium text-ink">
                      <span className="font-semibold text-ink">{item.adminName}</span>
                      <span className="text-ink-muted"> — </span>
                      <span>{item.action}</span>
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Target Cinema: <span className="font-medium text-ink">{item.theatreName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto pl-8.5 sm:pl-0">
                  <span
                    className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[11px] text-ink-muted font-mono">{item.timestamp}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
