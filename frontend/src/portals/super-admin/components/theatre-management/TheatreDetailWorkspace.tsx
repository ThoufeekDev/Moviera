import {
  Building2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Plus,
  Users,
  UserPlus,
  Mail,
  Copy,
  Check,
  Phone,
  UserX,
  UserCheck,
  Trash2,
  Clock,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { type TheatreItem, type AssignedAdmin, ROLE_CONFIG } from './types';

interface TheatreDetailWorkspaceProps {
  selectedTheatre: TheatreItem | null;
  theatreAdmins: AssignedAdmin[];
  onOpenAssignModal: (theatreId?: string) => void;
  onToggleAdminStatus: (adminId: string) => void;
  onRevokeAdmin: (admin: AssignedAdmin) => void;
  onCopyEmail: (email: string) => void;
  copiedEmail: string | null;
  totalTheatresCount: number;
}

export const TheatreDetailWorkspace = ({
  selectedTheatre,
  theatreAdmins,
  onOpenAssignModal,
  onToggleAdminStatus,
  onRevokeAdmin,
  onCopyEmail,
  copiedEmail,
  totalTheatresCount,
}: TheatreDetailWorkspaceProps) => {
  if (!selectedTheatre) {
    return (
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
        <div className="flex min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8 text-center shadow-card">
          <Building2 size={36} className="text-ink-muted mb-3" />
          <h3 className="text-base font-bold text-ink">No Cinema Selected</h3>
          <p className="text-xs text-ink-muted mt-1 max-w-sm">
            {totalTheatresCount === 0
              ? 'No cinemas exist in the system yet. Once theatres are added, you can assign administrators to manage them here.'
              : 'Select a cinema from the directory on the left to view and manage its assigned administrators.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
      {/* Active Cinema Detail Banner */}
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded bg-brand-50 border border-brand-100 px-2 py-0.5 text-xs font-bold text-brand-600">
                {selectedTheatre.chain}
              </span>
              <span className="rounded bg-surface-muted border border-border px-2 py-0.5 text-xs text-ink">
                {selectedTheatre.city}
              </span>
              {selectedTheatre.isActive ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 size={12} />
                  Active Multiplex
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <AlertCircle size={12} />
                  Inactive
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              {selectedTheatre.name}
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-ink-muted pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-brand-600 shrink-0" />
                {selectedTheatre.location}
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <span className="font-mono text-xs text-ink-muted">
                License: {selectedTheatre.licenseNumber}
              </span>
            </div>
          </div>

          {/* Quick Assign CTA Button */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => onOpenAssignModal(selectedTheatre.id)}
            className="shrink-0"
          >
            <Plus size={16} className="mr-1.5" />
            Assign Admin
          </Button>
        </div>
      </div>

      {/* Administrators Management Panel */}
      <div className="rounded-lg border border-border bg-surface shadow-card overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2">
              <Users size={18} className="text-brand-600" />
              Assigned Administrators ({theatreAdmins.length})
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              Authorized staff members who manage screens, showtimes, and cinema operations.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-muted px-2.5 py-1.5 text-xs text-ink-muted self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Role-Based Privileges
          </span>
        </div>

        <div className="p-4 sm:p-6">
          {theatreAdmins.length === 0 ? (
            /* Clean Empty State */
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/40 p-6 sm:p-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 border border-brand-100 text-brand-600">
                <AlertCircle size={28} />
              </div>

              <h4 className="text-base sm:text-lg font-bold text-ink">
                No Administrator Assigned Yet
              </h4>

              <p className="mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-ink-muted">
                <strong className="text-ink">{selectedTheatre.name}</strong> currently operates
                without an assigned manager. Assign an administrator to grant access to cinema
                operations.
              </p>

              <Button
                type="button"
                variant="primary"
                onClick={() => onOpenAssignModal(selectedTheatre.id)}
                className="mt-6"
              >
                <UserPlus size={17} className="mr-2" />
                Assign Administrator
              </Button>
            </div>
          ) : (
            /* Administrators List (Scrollable) */
            <div className="flex flex-col gap-3 max-h-[480px] sm:max-h-[540px] overflow-y-auto pr-1.5 sm:pr-2.5 overscroll-contain">
              {theatreAdmins.map((admin) => {
                const roleInfo = ROLE_CONFIG[admin.role];

                return (
                  <div
                    key={admin.id}
                    className="group relative flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 transition-all hover:shadow-card hover:border-ink-muted/30 sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {/* User Avatar & Info */}
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${admin.avatarColor} font-bold shadow-card text-sm`}
                        >
                          {admin.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-bold text-ink">
                              {admin.name}
                            </h4>
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${roleInfo.badgeClass}`}
                            >
                              {roleInfo.label}
                            </span>
                            {admin.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                                Suspended
                              </span>
                            )}
                          </div>

                          {/* Contact Details */}
                          <div className="flex items-center gap-3 text-xs text-ink-muted flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-ink-muted" />
                              <span>{admin.email}</span>
                              <button
                                type="button"
                                onClick={() => onCopyEmail(admin.email)}
                                className="ml-1 text-ink-muted hover:text-brand-600 transition-colors p-0.5 cursor-pointer"
                                title="Copy email"
                                aria-label="Copy email"
                              >
                                {copiedEmail === admin.email ? (
                                  <Check size={12} className="text-emerald-600" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </span>
                            <span className="hidden sm:inline text-border">•</span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-ink-muted" />
                              <span>{admin.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center border-t border-border pt-3 sm:border-0 sm:pt-0 w-full sm:w-auto justify-end">
                        {/* Toggle Status */}
                        <button
                          type="button"
                          onClick={() => onToggleAdminStatus(admin.id)}
                          className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                            admin.isActive
                              ? 'border-border bg-surface text-ink hover:bg-surface-muted'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                          title={admin.isActive ? 'Suspend access' : 'Activate access'}
                        >
                          {admin.isActive ? (
                            <>
                              <UserX size={14} className="text-rose-600" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} className="text-emerald-600" />
                              <span>Activate</span>
                            </>
                          )}
                        </button>

                        {/* Unassign Button */}
                        <button
                          type="button"
                          onClick={() => onRevokeAdmin(admin)}
                          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                          title="Revoke administrator access"
                        >
                          <Trash2 size={13} />
                          <span>Unassign</span>
                        </button>
                      </div>
                    </div>

                    {/* Role Scope Description Sub-strip */}
                    <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-ink-muted">
                      <span className="truncate pr-2">{roleInfo.description}</span>
                      <span className="shrink-0 flex items-center gap-1 font-mono text-[11px]">
                        <Clock size={11} />
                        Assigned {admin.assignedAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
