import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus,
  Building2,
  Shield,
  AlertCircle,
  CheckCircle2,
  Mail,
  User,
  Phone,
  KeyRound,
  Copy,
  Check,
  Sparkles,
  Users,
} from 'lucide-react';
import Modal from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button';
import { FormErrorBanner } from '@/shared/ui/FormErrorBanner';
import {
  useAssignTheatreAdmin,
  type AdminRole,
  type EligibleAdminUserResponse,
} from '@/features/theatres';
import { setFormServerErrors } from '@/shared/lib/formErrors';
import { type TheatreItem, ROLE_CONFIG } from './types';
import {
  theatreAdminAssignSchema,
  type TheatreAdminAssignFormData,
} from '../../schemas/theatreAdminAssign.schema';

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
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    temporaryPassword?: string;
    adminName: string;
    theatreName: string;
    role: AdminRole;
    emailSent?: boolean;
  } | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const assignMutation = useAssignTheatreAdmin();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<TheatreAdminAssignFormData>({
    resolver: zodResolver(theatreAdminAssignSchema),
    defaultValues: {
      theatreId: initialTheatreId || theatres[0]?.id || '',
      role: 'PRIMARY_MANAGER',
      mode: 'EMAIL',
      userId: eligibleAdmins[0]?.id || '',
      name: '',
      email: '',
      phone: '',
    },
  });

  const currentMode = useWatch({ control, name: 'mode' });
  const currentRole = useWatch({ control, name: 'role' });

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        theatreId: initialTheatreId || theatres[0]?.id || '',
        role: 'PRIMARY_MANAGER',
        mode: 'EMAIL',
        userId: eligibleAdmins[0]?.id || '',
        name: '',
        email: '',
        phone: '',
      });
      setGeneralError(null);
      setCreatedCredentials(null);
      setHasCopied(false);
    }
  }, [isOpen, initialTheatreId, theatres, eligibleAdmins, reset]);

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Moviera Theatre Partner Access\nTheatre: ${createdCredentials.theatreName}\nRole: ${ROLE_CONFIG[createdCredentials.role].label}\nLogin URL: ${window.location.origin}/theatre-admin/login\nEmail: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.temporaryPassword || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2200);
  };

  const handleFinishCredentials = () => {
    if (createdCredentials) {
      onAssignSuccess(
        createdCredentials.adminName,
        createdCredentials.theatreName,
        createdCredentials.role,
      );
    }
    onClose();
  };

  const onSubmit = async (data: TheatreAdminAssignFormData) => {
    setGeneralError(null);

    const targetTheatre = theatres.find((t) => t.id === data.theatreId);
    const theatreName = targetTheatre?.name || 'Theatre';

    try {
      const result = await assignMutation.mutateAsync({
        theatreId: data.theatreId,
        role: data.role,
        ...(data.mode === 'EMAIL'
          ? {
              email: data.email!.trim(),
              name: data.name!.trim(),
              phone: data.phone?.trim() || undefined,
            }
          : {
              userId: data.userId!,
            }),
      });

      if (result.temporaryPassword) {
        setCreatedCredentials({
          email: data.email!.trim(),
          temporaryPassword: result.temporaryPassword,
          adminName: data.name!.trim(),
          theatreName,
          role: data.role,
          emailSent: result.emailSent,
        });
      } else {
        const assignedName =
          data.mode === 'EMAIL'
            ? data.name!.trim()
            : eligibleAdmins.find((u) => u.id === data.userId)?.name || 'Administrator';

        onAssignSuccess(assignedName, theatreName, data.role);
        onClose();
      }
    } catch (err: unknown) {
      const result = setFormServerErrors(setError, err);
      setGeneralError(result.generalMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={createdCredentials ? handleFinishCredentials : onClose}
      title={
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-brand-600" />
          <span>Assign Theatre Administrator</span>
        </div>
      }
      description="Authorize a theatre operator or invite a new manager with direct login credentials."
      size="md"
    >
      {/* ── Success State: Credentials Ready ───────────────────────────────────── */}
      {createdCredentials ? (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div
            className={`flex items-start gap-3 rounded-lg border p-4 ${
              createdCredentials.emailSent
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
                : 'border-amber-200 bg-amber-50/70 text-amber-900'
            }`}
          >
            {createdCredentials.emailSent ? (
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-bold">
                Theatre Administrator Account Created!
              </h4>
              <p className="text-xs leading-relaxed opacity-90">
                {createdCredentials.emailSent
                  ? `Access credentials and portal instructions were sent to ${createdCredentials.email}.`
                  : `Account successfully created for ${createdCredentials.email}, but email dispatch failed (Resend API key is invalid or unverified). You can copy and share the login credentials below directly.`}
              </p>
            </div>
          </div>

          {/* Credentials Card */}
          <div className="rounded-lg border border-border bg-surface-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
                <KeyRound size={14} className="text-brand-600" />
                Temporary Access Credentials
              </span>
              <span className="inline-flex items-center rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-600 uppercase tracking-wider">
                {ROLE_CONFIG[createdCredentials.role].label}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded border border-border bg-surface p-2.5">
                <span className="text-ink-muted">Assigned Theatre:</span>
                <span className="font-semibold text-ink">{createdCredentials.theatreName}</span>
              </div>
              <div className="flex items-center justify-between rounded border border-border bg-surface p-2.5">
                <span className="text-ink-muted">Login Email:</span>
                <span className="font-mono font-medium text-ink">{createdCredentials.email}</span>
              </div>
              <div className="flex items-center justify-between rounded border border-border bg-surface p-2.5">
                <span className="text-ink-muted">Temporary Password:</span>
                <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                  {createdCredentials.temporaryPassword}
                </span>
              </div>
              <div className="flex items-center justify-between rounded border border-border bg-surface p-2.5">
                <span className="text-ink-muted">Partner Login Portal:</span>
                <span className="text-ink-muted text-[11px]">/theatre-admin/login</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyCredentials}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-muted px-3 py-2 text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Credentials to Clipboard</span>
                </>
              )}
            </button>
          </div>

          <div className="flex justify-end pt-2 border-t border-border">
            <Button type="button" variant="primary" size="sm" onClick={handleFinishCredentials}>
              Done & Return to Directory
            </Button>
          </div>
        </div>
      ) : (
        /* ── Input Form ───────────────────────────────────────────────────────── */
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pt-1">
          {/* Top Error Alert Banner */}
          <FormErrorBanner message={generalError} />

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 rounded-lg border border-border bg-surface-muted/50 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setValue('mode', 'EMAIL', { shouldValidate: true });
                setGeneralError(null);
                clearErrors();
              }}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors cursor-pointer ${
                currentMode === 'EMAIL'
                  ? 'bg-surface text-ink font-bold shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Sparkles size={13} className="text-brand-600" />
              <span>Invite by Email</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (eligibleAdmins.length > 0) {
                  setValue('mode', 'EXISTING', { shouldValidate: true });
                  setGeneralError(null);
                  clearErrors();
                }
              }}
              disabled={eligibleAdmins.length === 0}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                eligibleAdmins.length === 0
                  ? 'opacity-40 cursor-not-allowed text-ink-muted'
                  : currentMode === 'EXISTING'
                    ? 'bg-surface text-ink font-bold shadow-sm cursor-pointer'
                    : 'text-ink-muted hover:text-ink cursor-pointer'
              }`}
            >
              <Users size={13} />
              <span>Existing Admin ({eligibleAdmins.length})</span>
            </button>
          </div>

          {/* Theatre Selection */}
          <div className="space-y-1.5">
            <label htmlFor="theatreId" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Building2 size={13} className="text-brand-600" />
              Target Theatre
            </label>
            <select
              id="theatreId"
              {...register('theatreId')}
              className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink transition-colors focus:outline-none focus:ring-1 ${
                errors.theatreId
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                  : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
              }`}
            >
              {theatres.map((theatre) => (
                <option key={theatre.id} value={theatre.id}>
                  {theatre.name} ({theatre.city})
                </option>
              ))}
            </select>
            {errors.theatreId && (
              <p className="text-xs text-danger-600">{errors.theatreId.message}</p>
            )}
          </div>

          {/* Mode A: Invite by Email */}
          {currentMode === 'EMAIL' ? (
            <div className="space-y-3 rounded-lg border border-border/80 bg-surface-muted/30 p-3">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="adminName" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <User size={13} className="text-brand-600" />
                  Administrator Full Name
                </label>
                <input
                  id="adminName"
                  type="text"
                  placeholder="e.g. Rachel Green"
                  {...register('name')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    errors.name
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-danger-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="adminEmail" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Mail size={13} className="text-brand-600" />
                  Email Address (Login ID)
                </label>
                <input
                  id="adminEmail"
                  type="email"
                  placeholder="e.g. manager@theatrepartner.com"
                  {...register('email')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-danger-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="adminPhone" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Phone size={13} className="text-brand-600" />
                  Contact Phone (Optional)
                </label>
                <input
                  id="adminPhone"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  {...register('phone')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-danger-600">{errors.phone.message}</p>
                )}
              </div>

              <p className="text-[11px] text-ink-muted leading-relaxed">
                ℹ️ The system will create a verified Theatre Administrator account and dispatch an
                email with a temporary password and direct login instructions.
              </p>
            </div>
          ) : (
            /* Mode B: Existing Eligible Admin */
            <div className="space-y-1.5">
              <label htmlFor="userId" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <UserPlus size={13} className="text-brand-600" />
                Eligible Administrator User
              </label>
              <select
                id="userId"
                {...register('userId')}
                className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink transition-colors focus:outline-none focus:ring-1 ${
                  errors.userId
                    ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                    : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                }`}
              >
                {eligibleAdmins.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-xs text-danger-600">{errors.userId.message}</p>
              )}
            </div>
          )}

          {/* Operational Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Shield size={13} className="text-brand-600" />
              Operational Role & Responsibilities
            </label>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {(Object.keys(ROLE_CONFIG) as AdminRole[]).map((roleKey) => {
                const cfg = ROLE_CONFIG[roleKey];
                const isSelected = currentRole === roleKey;
                return (
                  <button
                    type="button"
                    key={roleKey}
                    onClick={() => {
                      setValue('role', roleKey, { shouldValidate: true, shouldDirty: true });
                    }}
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
              disabled={
                assignMutation.isPending || (currentMode === 'EXISTING' && eligibleAdmins.length === 0)
              }
            >
              {assignMutation.isPending
                ? currentMode === 'EMAIL'
                  ? 'Creating & Emailing...'
                  : 'Assigning...'
                : currentMode === 'EMAIL'
                  ? 'Create & Dispatch Access'
                  : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
