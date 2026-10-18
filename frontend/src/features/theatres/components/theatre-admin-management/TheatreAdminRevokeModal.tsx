import { AlertTriangle, Trash2, Building2 } from 'lucide-react';
import Modal from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { useRevokeTheatreAdminAssignment } from '@/features/theatres';
import { extractFormErrors } from '@/shared/lib/extractFormErrors';
import type { AssignedAdmin, TheatreItem } from './types';

export interface TheatreAdminRevokeModalProps {
  adminToRevoke: AssignedAdmin | null;
  onClose: () => void;
  theatres: TheatreItem[];
  onRevokeSuccess: (adminName: string, theatreName: string) => void;
  onError: (msg: string) => void;
}

export const TheatreAdminRevokeModal = ({
  adminToRevoke,
  onClose,
  theatres,
  onRevokeSuccess,
  onError,
}: TheatreAdminRevokeModalProps) => {
  const revokeMutation = useRevokeTheatreAdminAssignment();

  if (!adminToRevoke) return null;

  const targetTheatre = theatres.find((t) => t.id === adminToRevoke.theatreId);

  const handleConfirmRevoke = async () => {
    try {
      await revokeMutation.mutateAsync(adminToRevoke.id);
      onRevokeSuccess(adminToRevoke.name, targetTheatre?.name || 'Theatre');
      onClose();
    } catch (err: unknown) {
      const { generalMessage } = extractFormErrors(
        err,
        'Failed to revoke administrator assignment.',
      );
      onError(generalMessage || 'Failed to revoke administrator assignment.');
    }
  };

  return (
    <Modal
      isOpen={Boolean(adminToRevoke)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle size={18} />
          <span>Revoke Administrator Access</span>
        </div>
      }
      description="Are you sure you want to revoke operational privileges for this administrator?"
      size="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4 text-xs space-y-2">
          <p className="font-semibold text-rose-900">
            You are revoking access for:
          </p>
          <div className="bg-surface rounded-md p-2.5 border border-rose-200/60 space-y-1">
            <p className="font-bold text-ink text-sm">{adminToRevoke.name}</p>
            <p className="text-ink-muted text-[11px]">{adminToRevoke.email}</p>
            <p className="text-[11px] text-brand-600 flex items-center gap-1 mt-1">
              <Building2 size={12} />
              {targetTheatre?.name || 'Assigned Theatre'}
            </p>
          </div>
          <p className="text-rose-700 text-[11px] leading-relaxed">
            This operator will immediately lose access to manage screens, schedules, seat layouts, and box office controls for this theatre.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={revokeMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleConfirmRevoke}
            disabled={revokeMutation.isPending}
          >
            <Trash2 size={14} className="mr-1.5" />
            {revokeMutation.isPending ? 'Revoking...' : 'Revoke Privileges'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
