import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import type { SuperAdminManageTheatreItem } from '../api/getAllTheatres.api';
import { Button } from '@/shared/ui/Button';

interface SuperAdminTheatreCardProps {
  theatre: SuperAdminManageTheatreItem;
  onViewDetails?: (theatreId: string) => void;
}

export default function SuperAdminTheatreCard({
  theatre,
  onViewDetails,
}: SuperAdminTheatreCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [copiedLicence, setCopiedLicence] = useState(false);

  const handleDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(theatre.id);
    } else {
      // Navigate to theatre detail route
      navigate(`/theatre-admin/theatres/${theatre.id}`);
    }
  };

  const handleCopyLicence = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!theatre.licenseNumber) return;
    navigator.clipboard.writeText(theatre.licenseNumber);
    setCopiedLicence(true);
    setTimeout(() => setCopiedLicence(false), 2000);
  };

  // Generate 2-letter uppercase initials for fallback monogram
  const initials = (() => {
    const parts = theatre.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return theatre.name.slice(0, 2).toUpperCase() || 'TH';
  })();

  const formattedDate = theatre.createdAt
    ? new Date(theatre.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <article
      onClick={handleDetailsClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl cursor-pointer"
    >
      {/* ── Top Atmospheric Banner ────────────────────────────────────────── */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-br from-[#121316] via-[#1c1d24] to-[#262833]">
        {/* Subtle decorative glow & ambient logo backdrop */}
        {theatre.logoUrl && !imgError && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 blur-sm scale-110 transition-transform duration-500 group-hover:scale-125"
            style={{ backgroundImage: `url(${theatre.logoUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Ambient brand light beam */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-500/20 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

        {/* Top Badges Row */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between z-10">
          {/* Screen Count Pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white/95 border border-white/10 shadow-sm">
            <Film size={12} className="text-brand-400" />
            <span>
              {theatre.totalScreens} {theatre.totalScreens === 1 ? 'Screen' : 'Screens'}
            </span>
          </span>

          {/* Status Badge with Live Pulse */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md shadow-sm border ${
              theatre.isActive
                ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/20 text-rose-300'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {theatre.isActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  theatre.isActive ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
            </span>
            <span>{theatre.isActive ? 'Active' : 'Inactive'}</span>
          </span>
        </div>
      </div>

      {/* ── Overlapping Avatar & Header Metadata ──────────────────────────── */}
      <div className="-mt-9 px-5 flex items-end justify-between relative z-10">
        {/* Theatre Logo / Monogram Frame */}
        <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl border-2 border-surface bg-surface shadow-md overflow-hidden flex items-center justify-center shrink-0 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
          {theatre.logoUrl && !imgError ? (
            <img
              src={theatre.logoUrl}
              alt={`${theatre.name} logo`}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-600 via-brand-700 to-rose-900 text-white font-bold tracking-wider shadow-inner">
              <span className="text-lg font-extrabold drop-shadow-sm">{initials}</span>
            </div>
          )}
        </div>

        {/* Registered Date Badge */}
        {formattedDate && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-ink-muted bg-surface-muted/80 backdrop-blur-sm border border-border/80 px-2 py-0.5 rounded-md mb-0.5">
            <Calendar size={11} className="text-ink-muted shrink-0" />
            <span>Since {formattedDate}</span>
          </div>
        )}
      </div>

      {/* ── Card Content Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-3">
        <div className="space-y-3.5">
          {/* Theatre Name & Location */}
          <div>
            <h3
              className="text-base font-bold text-ink transition-colors group-hover:text-brand-600 line-clamp-1"
              title={theatre.name}
            >
              {theatre.name}
            </h3>

            {theatre.city && (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <MapPin size={13} className="text-brand-600 shrink-0" />
                <span className="truncate">
                  {theatre.city.name}
                  {theatre.city.state ? `, ${theatre.city.state}` : ''}
                </span>
              </p>
            )}
          </div>

          {/* Licence Card (Admin Security & Verification) */}
          {theatre.licenseNumber ? (
            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-surface-muted/50 px-3 py-2 transition-colors hover:border-brand-500/30 hover:bg-surface-muted">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Licence ID
                  </div>
                  <div
                    className="font-mono text-xs font-semibold text-ink truncate"
                    title={theatre.licenseNumber}
                  >
                    {theatre.licenseNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyLicence}
                className="ml-2 flex h-7 w-7 items-center justify-center rounded-md border border-border/70 bg-surface text-ink-muted transition-colors hover:border-brand-500 hover:text-brand-600"
                title={copiedLicence ? 'Copied to clipboard' : 'Copy licence number'}
                aria-label="Copy licence number"
              >
                {copiedLicence ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/70 bg-surface-muted/30 px-3 py-2 text-xs text-ink-muted/80">
              <ShieldCheck size={14} className="text-ink-muted/50 shrink-0" />
              <span className="text-[11px] italic">No licence number registered</span>
            </div>
          )}

          {/* Contact Details & Address */}
          <div className="space-y-1.5 pt-0.5 text-xs text-ink-muted">
            {/* Contact Email */}
            <div className="flex items-center gap-2">
              <Mail size={13} className="shrink-0 text-ink-muted" />
              <span
                className="truncate font-normal"
                title={theatre.email || 'No email registered'}
              >
                {theatre.email || 'No email registered'}
              </span>
            </div>

            {/* Contact Phone if present */}
            {theatre.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="shrink-0 text-ink-muted" />
                <span className="truncate font-normal" title={theatre.phone}>
                  {theatre.phone}
                </span>
              </div>
            )}

            {/* Physical Address */}
            {theatre.address && (
              <p
                className="mt-1 line-clamp-1 rounded-md bg-surface-muted/30 px-2 py-1 text-[11px] text-ink-muted/80 leading-relaxed"
                title={theatre.address}
              >
                {theatre.address}
              </p>
            )}
          </div>
        </div>

        {/* ── Interactive Action Button ───────────────────────────────────── */}
        <div className="mt-4 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              handleDetailsClick();
            }}
            className="group/btn flex items-center justify-center gap-2 font-semibold text-ink group-hover:border-brand-500/40 group-hover:bg-brand-50 group-hover:text-brand-700 transition-all duration-200"
          >
            <span>View Theatre Details</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover:text-brand-600"
            />
          </Button>
        </div>
      </div>
    </article>
  );
}
