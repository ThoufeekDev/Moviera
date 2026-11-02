import { Film, Armchair, Sparkles, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SuperAdminTheatreDetail } from '../../types/superAdminTheatreDetail.types';
import { FacilityIcon } from '../../icons/facilityIcons';
import { Button } from '@/shared/ui/Button';

interface SuperAdminTheatreScreensTabProps {
  theatre: SuperAdminTheatreDetail;
}

export default function SuperAdminTheatreScreensTab({
  theatre,
}: SuperAdminTheatreScreensTabProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-10">
      {/* ── Screens Section ─────────────────────────────────────────────────── */}
      <section aria-labelledby="screens-heading" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
          <div>
            <h2 id="screens-heading" className="text-xl font-bold text-ink">
              Auditoriums &amp; Screens ({theatre.screens.length})
            </h2>
            <p className="text-xs text-ink-muted">
              Screen configurations, projection formats, and seating capacities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink">
              Total Seats: <strong className="text-brand-600">{theatre.statistics.totalSeats}</strong>
            </span>
          </div>
        </div>

        {theatre.screens.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-ink-muted">
              <Film size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-ink">No screens registered</h3>
            <p className="mt-1 text-xs text-ink-muted max-w-sm">
              This theatre does not have any screens or auditoriums configured yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theatre.screens.map((screen, idx) => (
              <div
                key={screen.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:border-brand-500/40 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-bold text-sm">
                        #{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-ink text-base group-hover:text-brand-600 transition-colors">
                          {screen.name}
                        </h3>
                        <span className="text-[11px] font-mono text-ink-muted">
                          /{screen.slug}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                        screen.isActive
                          ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700'
                          : 'border-rose-500/30 bg-rose-50 text-rose-700'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          screen.isActive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span>{screen.isActive ? 'Active' : 'Inactive'}</span>
                    </span>
                  </div>

                  {/* Formats Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {screen.cinemaFormats.length > 0 ? (
                      screen.cinemaFormats.map((f) => (
                        <span
                          key={f.id}
                          className="rounded-md border border-brand-500/20 bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 tracking-wide"
                        >
                          {f.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-muted">Standard 2D</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-ink-muted">
                  <div className="flex items-center gap-1.5 text-ink font-semibold">
                    <Armchair size={15} className="text-emerald-600" />
                    <span>{screen.seatingCapacity} Seats</span>
                  </div>

                  <span className="text-[11px] font-mono text-ink-muted">
                    ID: {screen.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Facilities Section ──────────────────────────────────────────────── */}
      <section aria-labelledby="facilities-heading" className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-border">
          <div>
            <h2 id="facilities-heading" className="text-xl font-bold text-ink">
              Available Facilities ({theatre.facilities.length})
            </h2>
            <p className="text-xs text-ink-muted">
              Patron amenities and physical venue conveniences
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate('/super-admin/theatres/facilities')}
            className="flex items-center gap-1.5 text-xs cursor-pointer self-start sm:self-auto"
          >
            <span>Manage Master Facilities</span>
            <ExternalLink size={13} />
          </Button>
        </div>

        {theatre.facilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-muted text-ink-muted">
              <Sparkles size={24} />
            </div>
            <h3 className="mt-4 text-sm font-bold text-ink">No facilities assigned</h3>
            <p className="mt-1 text-xs text-ink-muted max-w-sm">
              No amenities or services have been tagged for this theatre yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {theatre.facilities.map((fac) => (
              <div
                key={fac.id}
                className="flex items-start gap-3.5 rounded-xl border border-border bg-surface p-4 shadow-card"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-500/20">
                  <FacilityIcon iconKey={fac.iconKey} size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-ink">{fac.name}</h3>
                  <p className="mt-0.5 text-xs text-ink-muted leading-relaxed line-clamp-2">
                    {fac.description || 'Facility available for all patrons.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
