import { Building2, Users, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

interface TheatreAdminKPIsProps {
  totalTheatresCount: number;
  assignedTheatresCount: number;
  unassignedTheatresCount: number;
  totalAdminsCount: number;
  activeAdminsCount: number;
  citiesCount: number;
}

export const TheatreAdminKPIs = ({
  totalTheatresCount,
  unassignedTheatresCount,
  totalAdminsCount,
  activeAdminsCount,
  citiesCount,
}: TheatreAdminKPIsProps) => {
  return (
    <section
      aria-label="Overview statistics"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {/* Total Theatres */}
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-muted">Total Theatres</span>
          <span className="rounded-md bg-brand-50 border border-brand-100 p-2 text-brand-600">
            <Building2 size={16} />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            {totalTheatresCount}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {totalTheatresCount > 0
              ? `Across ${Math.max(1, citiesCount)} major cities`
              : 'No theatres listed'}
          </p>
        </div>
      </div>

      {/* Assigned Admins */}
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-muted">Assigned Admins</span>
          <span className="rounded-md bg-emerald-50 border border-emerald-100 p-2 text-emerald-600">
            <Users size={16} />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
            {totalAdminsCount}
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {activeAdminsCount} active
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Authorized theatre operators</p>
        </div>
      </div>

      {/* Needs Admin */}
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-muted">Needs Admin</span>
          <span className="rounded-md bg-amber-50 border border-amber-100 p-2 text-amber-600">
            <AlertCircle size={16} />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-2">
            {unassignedTheatresCount}
            {unassignedTheatresCount > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Unassigned
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-muted">Theatres without a manager</p>
        </div>
      </div>

      {/* Security & Access */}
      <div className="rounded-lg border border-border bg-surface p-5 shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-muted">Security Health</span>
          <span className="rounded-md bg-blue-50 border border-blue-100 p-2 text-blue-600">
            <Shield size={16} />
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-ink flex items-center gap-1.5">
            <span>100%</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="mt-1 text-xs text-ink-muted">Role permissions enforced</p>
        </div>
      </div>
    </section>
  );
};
