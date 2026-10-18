import { useState, useEffect } from 'react';
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
import {
  useAssignTheatreAdmin,
  type AdminRole,
  type EligibleAdminUserResponse,
} from '@/features/theatres';
import { extractFormErrors } from '@/shared/lib/extractFormErrors';
import { type TheatreItem, ROLE_CONFIG } from './types';

export interface TheatreAdminAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatres: TheatreItem[];
  eligibleAdmins: EligibleAdminUserResponse[];
  initialTheatreId?: string;
  onAssignSuccess: (adminName: string, theatreName: string, role: AdminRole) => void;
}

type OnboardingMode = 'EMAIL' | 'EXISTING';

export const TheatreAdminAssignModal = ({
  isOpen,
  onClose,
  theatres,
  eligibleAdmins,
  initialTheatreId,
  onAssignSuccess,
}: TheatreAdminAssignModalProps) => {
  const [mode, setMode] = useState<OnboardingMode>('EMAIL');
  const [selectedTheatreId, setSelectedTheatreId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('PRIMARY_MANAGER');

  // Form fields for new admin creation
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Dual-layer validation error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Success state when a new user is created with a temporary password
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

  // Reset or initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTheatreId(initialTheatreId || theatres[0]?.id || '');
      setSelectedRole('PRIMARY_MANAGER');
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
      setErrorMessage(null);
      setFieldErrors({});
      setCreatedCredentials(null);
      setHasCopied(false);

      if (eligibleAdmins.length > 0) {
        setSelectedUserId(eligibleAdmins[0].id);
        setMode('EMAIL');
      } else {
        setSelectedUserId('');
        setMode('EMAIL');
      }
    }
  }, [isOpen, initialTheatreId, theatres, eligibleAdmins]);

  // Clear specific field error as user types or modifies a field
  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

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

  // ── Client-side validation rules (used for blur feedback & backend error fallback) ──
  const validateClient = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!selectedTheatreId) {
      errors.theatreId = 'Please select a target theatre multiplex.';
    }

    if (mode === 'EMAIL') {
      const trimmedName = adminName.trim();
      const trimmedEmail = adminEmail.trim();
      const trimmedPhone = adminPhone.trim();

      if (!trimmedName) {
        errors.name = 'Full name is required.';
      } else if (trimmedName.length < 2) {
        errors.name = 'Full name must be at least 2 characters.';
      }

      if (!trimmedEmail) {
        errors.email = 'Email address is required.';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
          errors.email = 'Please enter a valid email address (e.g. manager@theatre.com).';
        }
      }

      if (trimmedPhone && trimmedPhone.length < 7) {
        errors.phone = 'Contact phone must be at least 7 digits.';
      }
    } else {
      if (!selectedUserId) {
        errors.userId = 'Please select an eligible administrator user.';
      }
    }

    return errors;
  };

  const handleBlurField = (field: 'theatreId' | 'name' | 'email' | 'phone' | 'userId') => {
    // Only run frontend blur check if no error is currently set for this field
    if (fieldErrors[field]) return;

    if (field === 'name' && mode === 'EMAIL') {
      const trimmed = adminName.trim();
      if (!trimmed) {
        setFieldErrors((prev) => ({ ...prev, name: 'Full name is required.' }));
        setErrorMessage('Full name is required.');
      } else if (trimmed.length < 2) {
        setFieldErrors((prev) => ({ ...prev, name: 'Full name must be at least 2 characters.' }));
        setErrorMessage('Full name must be at least 2 characters.');
      }
    } else if (field === 'email' && mode === 'EMAIL') {
      const trimmed = adminEmail.trim();
      if (!trimmed) {
        setFieldErrors((prev) => ({ ...prev, email: 'Email address is required.' }));
        setErrorMessage('Email address is required.');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          setFieldErrors((prev) => ({
            ...prev,
            email: 'Please enter a valid email address (e.g. manager@theatre.com).',
          }));
          setErrorMessage('Please enter a valid email address (e.g. manager@theatre.com).');
        }
      }
    } else if (field === 'phone' && mode === 'EMAIL') {
      const trimmed = adminPhone.trim();
      if (trimmed && trimmed.length < 7) {
        setFieldErrors((prev) => ({
          ...prev,
          phone: 'Contact phone must be at least 7 digits.',
        }));
        setErrorMessage('Contact phone must be at least 7 digits.');
      }
    } else if (field === 'userId' && mode === 'EXISTING') {
      if (!selectedUserId) {
        setFieldErrors((prev) => ({ ...prev, userId: 'Please select an eligible administrator user.' }));
        setErrorMessage('Please select an eligible administrator user.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const targetTheatre = theatres.find((t) => t.id === selectedTheatreId);
    const theatreName = targetTheatre?.name || 'Theatre';

    // ── Primary: Send to Backend & Let Backend Validation Flow Through ────────
    try {
      const result = await assignMutation.mutateAsync({
        theatreId: selectedTheatreId,
        role: selectedRole,
        ...(mode === 'EMAIL'
          ? {
              email: adminEmail.trim(),
              name: adminName.trim(),
              phone: adminPhone.trim() || undefined,
            }
          : {
              userId: selectedUserId,
            }),
      });

      if (result.temporaryPassword) {
        // Show credentials dialog so Super Admin can immediately view and copy them
        setCreatedCredentials({
          email: adminEmail.trim(),
          temporaryPassword: result.temporaryPassword,
          adminName: adminName.trim(),
          theatreName,
          role: selectedRole,
          emailSent: result.emailSent,
        });
      } else {
        const assignedName =
          mode === 'EMAIL'
            ? adminName.trim()
            : eligibleAdmins.find((u) => u.id === selectedUserId)?.name || 'Administrator';

        onAssignSuccess(assignedName, theatreName, selectedRole);
        onClose();
      }
    } catch (err: unknown) {
      // ── Layer 1: Extract authoritative Backend Validation & Business Errors ─
      const backendResult = extractFormErrors(
        err,
        'Failed to assign theatre administrator. Please verify input.',
      );

      // ── Layer 2: Frontend Fallback Validation (if backend validation not returned for any field) ─
      const clientFallback = validateClient();

      // Merge: Backend validation always takes priority over client fallback
      const mergedErrors: Record<string, string> = {
        ...clientFallback,
        ...backendResult.fieldErrors,
      };

      setFieldErrors(mergedErrors);
      setErrorMessage(
        backendResult.generalMessage ||
          Object.values(mergedErrors)[0] ||
          'Validation failed. Please verify inputs.',
      );
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
        <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
          {/* Top Error Alert Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 animate-in fade-in duration-150">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-800">Action could not be completed</p>
                <p className="text-[11px] text-rose-700 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 rounded-lg border border-border bg-surface-muted/50 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('EMAIL');
                setErrorMessage(null);
                setFieldErrors({});
              }}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors cursor-pointer ${
                mode === 'EMAIL'
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
                  setMode('EXISTING');
                  setErrorMessage(null);
                  setFieldErrors({});
                }
              }}
              disabled={eligibleAdmins.length === 0}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                eligibleAdmins.length === 0
                  ? 'opacity-40 cursor-not-allowed text-ink-muted'
                  : mode === 'EXISTING'
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
            <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Building2 size={13} className="text-brand-600" />
              Target Theatre
            </label>
            <select
              value={selectedTheatreId}
              onChange={(e) => {
                setSelectedTheatreId(e.target.value);
                clearFieldError('theatreId');
              }}
              onBlur={() => handleBlurField('theatreId')}
              className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink transition-colors focus:outline-none focus:ring-1 ${
                fieldErrors.theatreId
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
          </div>

          {/* Mode A: Invite by Email */}
          {mode === 'EMAIL' ? (
            <div className="space-y-3 rounded-lg border border-border/80 bg-surface-muted/30 p-3">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <User size={13} className="text-brand-600" />
                  Administrator Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rachel Green"
                  value={adminName}
                  onChange={(e) => {
                    setAdminName(e.target.value);
                    clearFieldError('name');
                  }}
                  onBlur={() => handleBlurField('name')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    fieldErrors.name
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Mail size={13} className="text-brand-600" />
                  Email Address (Login ID)
                </label>
                <input
                  type="email"
                  placeholder="e.g. manager@theatrepartner.com"
                  value={adminEmail}
                  onChange={(e) => {
                    setAdminEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  onBlur={() => handleBlurField('email')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    fieldErrors.email
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                  <Phone size={13} className="text-brand-600" />
                  Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={adminPhone}
                  onChange={(e) => {
                    setAdminPhone(e.target.value);
                    clearFieldError('phone');
                  }}
                  onBlur={() => handleBlurField('phone')}
                  className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-1 ${
                    fieldErrors.phone
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/30'
                      : 'border-border bg-surface focus:border-brand-600 focus:ring-brand-600'
                  }`}
                />
              </div>

              <p className="text-[11px] text-ink-muted leading-relaxed">
                ℹ️ The system will create a verified Theatre Administrator account and dispatch an
                email with a temporary password and direct login instructions.
              </p>
            </div>
          ) : (
            /* Mode B: Existing Eligible Admin */
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <UserPlus size={13} className="text-brand-600" />
                Eligible Administrator User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  clearFieldError('userId');
                }}
                onBlur={() => handleBlurField('userId')}
                className={`w-full rounded-md border py-2 px-3 text-xs sm:text-sm text-ink transition-colors focus:outline-none focus:ring-1 ${
                  fieldErrors.userId
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
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    type="button"
                    key={roleKey}
                    onClick={() => {
                      setSelectedRole(roleKey);
                      clearFieldError('role');
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
                assignMutation.isPending || (mode === 'EXISTING' && eligibleAdmins.length === 0)
              }
            >
              {assignMutation.isPending
                ? mode === 'EMAIL'
                  ? 'Creating & Emailing...'
                  : 'Assigning...'
                : mode === 'EMAIL'
                  ? 'Create & Dispatch Access'
                  : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
