import { Modal, Button } from '@/shared/ui';
import { useToggleFacilityStatus } from '../hooks/useToggleFacilityStatus';
import type { SuperAdminFacilityItem } from '../api/facilities.api';
import { FacilityIcon } from '../icons/facilityIcons';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface FacilityStatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: SuperAdminFacilityItem | null;
}

export default function FacilityStatusConfirmModal({
  isOpen,
  onClose,
  facility,
}: FacilityStatusConfirmModalProps) {
  const toggleMutation = useToggleFacilityStatus();
  const isPending = toggleMutation.isPending;

  if (!facility) return null;

  const nextStatus = !facility.isActive;
  const isDeactivating = facility.isActive;

  const handleConfirm = async () => {
    try {
      await toggleMutation.mutateAsync({
        id: facility.id,
        isActive: nextStatus,
      });
      onClose();
    } catch {
      // Error handled by Tanstack query or caller
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isPending) onClose();
      }}
      size="sm"
      title={isDeactivating ? 'Deactivate Facility?' : 'Activate Facility?'}
      description={
        isDeactivating
          ? `Are you sure you want to deactivate "${facility.name}"?`
          : `Make "${facility.name}" active and selectable across theatres again.`
      }
    >
      <div className="flex flex-col gap-4">
        {/* Visual summary callout */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted/50 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface border border-border shadow-xs text-ink">
            <FacilityIcon iconKey={facility.iconKey} size={20} />
          </div>
          <div className="flex flex-col min-w-0 text-xs">
            <span className="font-semibold text-ink text-sm truncate">{facility.name}</span>
            <span className="text-ink-muted">
              Assigned to <strong>{facility.assignedTheatreCount}</strong> {facility.assignedTheatreCount === 1 ? 'theatre' : 'theatres'}
            </span>
          </div>
        </div>

        {/* Informative notice about theatre assignments */}
        <div
          className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
            isDeactivating
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          {isDeactivating ? (
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          )}
          <div>
            {isDeactivating ? (
              <>
                <strong>Important note:</strong> All existing theatre assignments will be{' '}
                <strong>preserved</strong>. Deactivating only hides this facility from public moviegoer listings and new theatre assignment forms.
              </>
            ) : (
              <>
                Activating this facility makes it immediately visible on theatre profiles and selectable in the theatre management forms.
              </>
            )}
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={isDeactivating ? 'outline' : 'primary'}
            size="md"
            onClick={handleConfirm}
            disabled={isPending}
            className={isDeactivating ? 'border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700' : ''}
          >
            {isPending
              ? isDeactivating
                ? 'Deactivating...'
                : 'Activating...'
              : isDeactivating
              ? 'Deactivate Facility'
              : 'Activate Facility'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
