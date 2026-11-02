import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film,
  Armchair,
  CalendarClock,
  Ticket,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Compass,
  Building,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  UserCheck,
} from 'lucide-react';
import type { SuperAdminTheatreDetail } from '../../types/superAdminTheatreDetail.types';
import { GoogleMapPicker } from '@/shared/ui/GoogleMapPicker';
import { Button } from '@/shared/ui/Button';

interface SuperAdminTheatreOverviewTabProps {
  theatre: SuperAdminTheatreDetail;
  onNavigateToScreens: () => void;
}

export default function SuperAdminTheatreOverviewTab({
  theatre,
  onNavigateToScreens,
}: SuperAdminTheatreOverviewTabProps) {
  const navigate = useNavigate();
  const [copiedLicence, setCopiedLicence] = useState(false);
  const [copiedPlaceId, setCopiedPlaceId] = useState(false);

  const handleCopyLicence = () => {
    if (!theatre.licenseNumber) return;
    navigator.clipboard.writeText(theatre.licenseNumber);
    setCopiedLicence(true);
    setTimeout(() => setCopiedLicence(false), 2000);
  };

  const handleCopyPlaceId = () => {
    if (!theatre.googlePlaceId) return;
    navigator.clipboard.writeText(theatre.googlePlaceId);
    setCopiedPlaceId(true);
    setTimeout(() => setCopiedPlaceId(false), 2000);
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Not available';
    return new Date(isoString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const coordinates =
    theatre.latitude !== null && theatre.longitude !== null
      ? { lat: theatre.latitude, lng: theatre.longitude }
      : null;

  return (
    <div className="flex flex-col gap-8">
      {/* ── 1. Key Statistics Cards ────────────────────────────────────────── */}
      <section aria-labelledby="theatre-stats-heading">
        <h2 id="theatre-stats-heading" className="sr-only">
          Theatre Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Screens */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Total Screens
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-ink">
                  {theatre.statistics.totalScreens}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-500/20">
                <Film size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">Active auditorium halls</p>
          </div>

          {/* Total Seats */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Total Seats
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-ink">
                  {theatre.statistics.totalSeats}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-500/20">
                <Armchair size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">Combined seating capacity</p>
          </div>

          {/* Today's Shows */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Today&apos;s Shows
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-ink">
                  {theatre.statistics.todayShows}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-500/20">
                <CalendarClock size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">Scheduled showtimes today</p>
          </div>

          {/* Today's Bookings */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Today&apos;s Bookings
                </p>
                <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-ink">
                  {theatre.statistics.todayBookings}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-500/20">
                <Ticket size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-muted">Completed reservations today</p>
          </div>
        </div>
      </section>

      {/* ── 2. Information & Location Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Theatre Information */}
        <section
          aria-labelledby="theatre-info-heading"
          className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Building size={18} />
            </div>
            <div>
              <h2 id="theatre-info-heading" className="text-base font-bold text-ink">
                Theatre Information
              </h2>
              <p className="text-xs text-ink-muted">Registration &amp; contact parameters</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col divide-y divide-border/60">
            {/* Description */}
            <div className="py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Description
              </span>
              <p className="mt-1 text-sm text-ink leading-relaxed">
                {theatre.description || 'No description provided for this theatre.'}
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <Mail size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Email Address</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {theatre.email || 'Not provided'}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <Phone size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Phone Number</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {theatre.phone || 'Not provided'}
              </span>
            </div>

            {/* Licence Number */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <ShieldCheck size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Licence Number</span>
              </div>
              {theatre.licenseNumber ? (
                <button
                  type="button"
                  onClick={handleCopyLicence}
                  className="inline-flex items-center gap-1.5 rounded-md bg-surface-muted px-2.5 py-1 text-xs font-mono font-medium text-ink hover:bg-border transition-colors cursor-pointer"
                  title="Click to copy licence number"
                >
                  <span>{theatre.licenseNumber}</span>
                  {copiedLicence ? (
                    <Check size={12} className="text-emerald-600" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              ) : (
                <span className="text-sm text-ink-muted">Unlicensed</span>
              )}
            </div>

            {/* Created At */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <Calendar size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Registration Date</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {formatDate(theatre.createdAt)}
              </span>
            </div>

            {/* Updated At */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <Clock size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Last Updated</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {formatDate(theatre.updatedAt)}
              </span>
            </div>

            {/* Registered By */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-ink-muted">
                <UserCheck size={15} />
                <span className="text-xs font-semibold uppercase tracking-wider">Registered By</span>
              </div>
              <span className="text-sm font-medium text-ink">
                {theatre.createdByName || 'Super Admin (System)'}
              </span>
            </div>
          </div>
        </section>

        {/* Location Information & Map */}
        <section
          aria-labelledby="location-info-heading"
          className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <div className="flex items-center gap-2.5 pb-4 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <MapPin size={18} />
            </div>
            <div>
              <h2 id="location-info-heading" className="text-base font-bold text-ink">
                Location Information
              </h2>
              <p className="text-xs text-ink-muted">Geographical placement and map preview</p>
            </div>
          </div>

          {/* Interactive Map Preview */}
          <div className="mt-4 overflow-hidden rounded-xl border border-border shadow-sm">
            <GoogleMapPicker
              readOnly
              label={null}
              onSelectLocation={() => {}}
              selectedCoordinates={coordinates}
              selectedAddress={theatre.address}
              selectedPlaceId={theatre.googlePlaceId}
              heightClassName="h-[220px] sm:h-[250px]"
            />
          </div>

          {/* Address Details Table */}
          <div className="mt-4 flex flex-col divide-y divide-border/60">
            <div className="py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Full Address
              </span>
              <p className="mt-1 text-sm font-medium text-ink">{theatre.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2.5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Area / Locality
                </span>
                <p className="mt-0.5 text-sm font-medium text-ink">
                  {theatre.area?.name || 'Not specified'}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  PIN Code
                </span>
                <p className="mt-0.5 text-sm font-medium text-ink font-mono">
                  {theatre.pincode || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 text-xs">
              <div>
                <span className="font-semibold text-ink-muted">City:</span>{' '}
                <span className="font-medium text-ink">{theatre.city.name}</span>
              </div>
              <div>
                <span className="font-semibold text-ink-muted">State:</span>{' '}
                <span className="font-medium text-ink">{theatre.city.state}</span>
              </div>
              <div>
                <span className="font-semibold text-ink-muted">Country:</span>{' '}
                <span className="font-medium text-ink">{theatre.city.country}</span>
              </div>
            </div>

            {/* Latitude and Longitude */}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Compass size={14} />
                <span className="font-semibold uppercase tracking-wider">Coordinates</span>
              </div>
              <span className="text-xs font-mono font-medium text-ink">
                {theatre.latitude && theatre.longitude
                  ? `${theatre.latitude.toFixed(5)}, ${theatre.longitude.toFixed(5)}`
                  : 'Coordinates not set'}
              </span>
            </div>

            {/* Google Place ID */}
            {theatre.googlePlaceId && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Place ID
                </span>
                <button
                  type="button"
                  onClick={handleCopyPlaceId}
                  className="inline-flex items-center gap-1.5 rounded bg-surface-muted px-2 py-0.5 text-[11px] font-mono text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  title="Click to copy Google Place ID"
                >
                  <span className="max-w-[160px] truncate">{theatre.googlePlaceId}</span>
                  {copiedPlaceId ? (
                    <Check size={11} className="text-emerald-600" />
                  ) : (
                    <Copy size={11} />
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── 3. Quick Snapshot Section ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Screens Snapshot */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Film size={18} className="text-brand-600" />
                <h3 className="text-sm font-bold text-ink">Screens ({theatre.screens.length})</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNavigateToScreens}
                className="text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>View All Screens</span>
                <ArrowRight size={13} />
              </Button>
            </div>

            {theatre.screens.length === 0 ? (
              <p className="mt-4 text-xs text-ink-muted">No screens registered yet.</p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {theatre.screens.slice(0, 3).map((screen) => (
                  <div
                    key={screen.id}
                    className="flex items-center justify-between rounded-lg bg-surface-muted/60 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">{screen.name}</span>
                      <span className="text-ink-muted">({screen.seatingCapacity} seats)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {screen.cinemaFormats.map((f) => (
                        <span
                          key={f.id}
                          className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700"
                        >
                          {f.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Administrators Snapshot */}
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-ink">
                  Assigned Admins ({theatre.assignedAdmins.length})
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/super-admin/theatres')}
                className="text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Assignments</span>
                <ExternalLink size={13} />
              </Button>
            </div>

            {theatre.assignedAdmins.length === 0 ? (
              <p className="mt-4 text-xs text-ink-muted">
                No administrators assigned to manage this theatre.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {theatre.assignedAdmins.slice(0, 3).map((admin) => (
                  <div
                    key={admin.assignmentId}
                    className="flex items-center justify-between rounded-lg bg-surface-muted/60 p-2.5 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-ink">{admin.name}</span>
                      <p className="text-[11px] text-ink-muted">{admin.email}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-500/20">
                      {admin.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
