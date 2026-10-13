import { useState, useEffect } from 'react';
import { UserPlus, Building2, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { useAssignTheatreAdmin, type AdminRole, type EligibleAdminUserResponse } from '@/features/theatres';
import { type TheatreItem, ROLE_CONFIG } from './types';

export interface TheatreAdminAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatres: TheatreItem[];
  eligibleAdmins: EligibleAdminUserResponse[];
  initialTheatreId?: string;
  onAssignSuccess: (adminName: string, theatreName: string, role: AdminRole) => void;
}

export const TheatreAdminAssignModal = ({
  isOpen,
  onClose,
  theatres,
  eligibleAdmins,
  initialTheatreId,
  onAssignSuccess,
}: TheatreAdminAssignModalProps) => {
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('PRIMARY_MANAGER');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const assignMutation = useAssignTheatreAdmin();

  // Initialize or reset selections when modal opens or initialTheatreId changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTheatreId(initialTheatreId || theatres[0]?.id || '');
      setSelectedUserId(eligibleAdmins[0]?.id || '');
      setSelectedRole('PRIMARY_MANAGER');
      setErrorMessage(null);
    }
  }, [isOpen, initialTheatreId, theatres, eligibleAdmins]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheatreId || !selectedUserId) {
      setErrorMessage('Please select both a cinema and an eligible administrator.');
      return;
    }

    setErrorMessage(null);
    try {
      await assignMutation.mutateAsync({
        theatreId: selectedTheatreId,
        userId: selectedUserId,
        role: selectedRole,
      });

      const assignedUser = eligibleAdmins.find((u) => u.id === selectedUserId);
      const assignedTheatre = theatres.find((t) => t.id === selectedTheatreId);

      onAssignSuccess(
        assignedUser?.name || 'Administrator',
        assignedTheatre?.name || 'Cinema',
        selectedRole,
      );
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to assign theatre administrator. Please verify permissions.';
      setErrorMessage(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-brand-600" />
          <span>Assign Theatre Administrator</span>
        </div>
      }
      description="Authorize a platform administrator to operate and manage a cinema multiplex."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Cinema Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
            <Building2 size={13} className="text-brand-600" />
            Target Cinema
          </label>
          <select
            value={selectedTheatreId}
            onChange={(e) => setSelectedTheatreId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface py-2 px-3 text-xs sm:text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            {theatres.map((theatre) => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name} ({theatre.city})
              </option>
            ))}
          </select>
        </div>

        {/* Administrator Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
            <UserPlus size={13} className="text-brand-600" />
            Eligible Administrator User
          </label>
          {eligibleAdmins.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-surface-muted/40 p-3 text-center text-xs text-ink-muted">
              No eligible users found with theatre admin credentials.
            </div>
          ) : (
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-md border border-border bg-surface py-2 px-3 text-xs sm:text-sm text-ink focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            >
              {eligibleAdmins.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Operational Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
            <Shield size={13} className="text-brand-600" />
            Operational Role & Responsibilities
          </label>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {(Object.keys(ROLE_CONFIG) as AdminRole[]).map((roleKey) => {
              const cfg = ROLE_CONFIG[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  type="button"
                  key={roleKey}
                  onClick={() => setSelectedRole(roleKey)}
                  className={`flex items-start justify-between rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/50 ring-1 ring-brand-600'
                      : 'border-border bg-surface hover:bg-surface-muted/50'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="text-xs font-bold text-ink">{cfg.label}</p>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      {cfg.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={16} className="text-brand-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={assignMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={assignMutation.isPending || eligibleAdmins.length === 0}
          >
            {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
