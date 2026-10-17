import { Button } from '@/shared/ui';
import { FacilityIcon } from '../icons/facilityIcons';
import type { SuperAdminFacilityItem } from '../api/facilities.api';
import { Edit2, Power, Building2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface FacilityCardProps {
  facility: SuperAdminFacilityItem;
  onEdit: (facility: SuperAdminFacilityItem) => void;
  onToggleStatus: (facility: SuperAdminFacilityItem) => void;
}

export default function FacilityCard({
  facility,
  onEdit,
  onToggleStatus,
}: FacilityCardProps) {
  const isAssigned = facility.assignedTheatreCount > 0;

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-surface p-5 shadow-card transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        facility.isActive
          ? 'border-border hover:border-brand-500/40'
          : 'border-border/70 bg-surface-muted/30 opacity-90',
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Header Row: Icon + Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-colors',
              facility.isActive
                ? 'border-brand-500/20 bg-brand-50/70 text-brand-600 group-hover:bg-brand-100/70'
                : 'border-border bg-surface-muted text-ink-muted',
            )}
          >
            <FacilityIcon iconKey={facility.iconKey} size={24} />
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
              facility.isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200',
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                facility.isActive ? 'bg-emerald-600' : 'bg-zinc-400',
              )}
              aria-hidden="true"
            />
            {facility.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Title and Slug */}
        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="text-base font-bold text-ink tracking-tight truncate group-hover:text-brand-600 transition-colors">
            {facility.name}
          </h2>
          {/* <span className="font-mono text-[11px] text-ink-muted/80 truncate">
            slug: {facility.slug}
          </span> */}
        </div>

        {/* Description */}
        <p className="text-xs text-ink-muted leading-relaxed line-clamp-2 min-h-[32px]">
          {facility.description || 'No description provided for this facility.'}
        </p>

        {/* Relation Count Badge */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/60 text-xs text-ink-muted">
          <Building2 size={14} className={isAssigned ? 'text-brand-600' : 'text-ink-muted'} />
          <span>
            {facility.assignedTheatreCount}{' '}
            {facility.assignedTheatreCount === 1 ? 'theatre' : 'theatres'} assigned
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 pt-4 mt-2 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(facility)}
          className="flex-1 h-9 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          title="Edit facility name, description, or icon"
        >
          <Edit2 size={13} />
          <span>Edit</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(facility)}
          className={cn(
            'h-9 px-3 text-xs flex items-center justify-center gap-1.5 cursor-pointer',
            facility.isActive
              ? 'hover:border-red-300 hover:bg-red-50 hover:text-red-700 text-ink-muted'
              : 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 text-ink-muted',
          )}
          title={facility.isActive ? 'Deactivate facility' : 'Activate facility'}
        >
          <Power size={13} className={facility.isActive ? 'text-red-500' : 'text-emerald-600'} />
          <span>{facility.isActive ? 'Deactivate' : 'Activate'}</span>
        </Button>
      </div>
    </article>
  );
}
