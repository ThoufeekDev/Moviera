import { Users, Building2, Check, Copy } from 'lucide-react';
import { type AssignedAdmin, type TheatreItem, ROLE_CONFIG } from './types';

interface TheatreAdminDirectoryViewProps {
  admins: AssignedAdmin[];
  theatres: TheatreItem[];
  activeAdminsCount: number;
  onSelectTheatre: (theatreId: string) => void;
  onToggleAdminStatus: (adminId: string) => void;
  onRevokeAdmin: (admin: AssignedAdmin) => void;
  onCopyEmail: (email: string) => void;
  copiedEmail: string | null;
}

export const TheatreAdminDirectoryView = ({
  admins,
  theatres,
  activeAdminsCount,
  onSelectTheatre,
  onToggleAdminStatus,
  onRevokeAdmin,
  onCopyEmail,
  copiedEmail,
}: TheatreAdminDirectoryViewProps) => {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex flex-col gap-1 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <Users size={18} className="text-brand-600" />
            Global Administrator Directory ({admins.length})
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Complete roster of all assigned cinema operators and administrators across Moviera.
          </p>
        </div>

        <span className="text-xs text-ink-muted font-mono">
          {activeAdminsCount} active • {admins.length - activeAdminsCount} suspended
        </span>
      </div>

      {admins.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/40 p-8 text-center">
          <Users size={32} className="text-ink-muted mb-3" />
          <h3 className="text-base font-bold text-ink">No Administrators Assigned</h3>
          <p className="text-xs text-ink-muted mt-1 max-w-sm">
            There are currently no theatre administrators assigned to any cinema on the platform.
            Click &ldquo;Assign Theatre Admin&rdquo; to authorize cinema managers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {admins.map((admin) => {
            const assignedCinema = theatres.find((t) => t.id === admin.theatreId);
            const roleInfo = ROLE_CONFIG[admin.role];

            return (
              <div
                key={admin.id}
                className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-card hover:border-ink-muted/30 transition-all"
              >
                <div>
                  {/* Top Row: User Avatar & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${admin.avatarColor} font-bold text-sm shadow-card`}
                      >
                        {admin.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-ink">{admin.name}</h3>
                        <span className="text-xs text-ink-muted truncate block max-w-[180px]">
                          {admin.email}
                        </span>
                      </div>
                    </div>

                    {admin.isActive ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        Suspended
                      </span>
                    )}
                  </div>

                  {/* Assigned Cinema Box */}
                  <div className="mt-3 rounded-md border border-border bg-surface-muted p-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-ink-muted block font-semibold">
                      Assigned Cinema
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (assignedCinema) {
                          onSelectTheatre(assignedCinema.id);
                        }
                      }}
                      className="mt-0.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1 cursor-pointer text-left"
                    >
                      <Building2 size={12} className="shrink-0" />
                      <span className="truncate">{assignedCinema?.name ?? 'Unknown Cinema'}</span>
                    </button>
                    <span className="text-[11px] text-ink-muted block mt-0.5">
                      {assignedCinema?.city} • {roleInfo.label}
                    </span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => onCopyEmail(admin.email)}
                    className="text-ink-muted hover:text-brand-600 transition-colors flex items-center gap-1 text-xs cursor-pointer"
                  >
                    {copiedEmail === admin.email ? (
                      <>
                        <Check size={11} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleAdminStatus(admin.id)}
                      className="text-ink-muted hover:text-ink transition-colors text-xs font-medium cursor-pointer"
                    >
                      {admin.isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRevokeAdmin(admin)}
                      className="text-rose-600 hover:text-rose-700 transition-colors text-xs font-medium cursor-pointer"
                    >
                      Unassign
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
