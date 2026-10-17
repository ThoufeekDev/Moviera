import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, Sparkles, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Button } from '../Button';

export interface SuccessModalDetail {
  label: string;
  value: ReactNode;
}

export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  entityName?: string;
  entityType?: string;
  details?: SuccessModalDetail[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  autoCloseSeconds?: number;
  className?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  entityName,
  entityType,
  details,
  primaryAction,
  secondaryAction,
  autoCloseSeconds,
  className,
}: SuccessModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(
    autoCloseSeconds ?? null,
  );

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(autoCloseSeconds ?? null);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, autoCloseSeconds]);

  useEffect(() => {
    if (!isOpen || !autoCloseSeconds) return;

    setSecondsRemaining(autoCloseSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, autoCloseSeconds, onClose]);

  if (!isOpen) return null;

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      aria-describedby="success-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-float transition-all animate-in zoom-in-95 duration-200',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Animated Celebration Icon Badge */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping opacity-35"
            aria-hidden="true"
          />
          <div
            className="absolute inset-1 rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/10"
            aria-hidden="true"
          />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
            <Check className="h-7 w-7 stroke-[2.5]" />
          </div>
          <Sparkles
            className="absolute -top-1 -right-1 h-5 w-5 text-amber-400"
            aria-hidden="true"
          />
        </div>

        {/* Text Content */}
        <div className="text-center">
          <h2
            id="success-modal-title"
            className="text-xl sm:text-2xl font-bold tracking-tight text-ink"
          >
            {title}
          </h2>
          <p
            id="success-modal-description"
            className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed"
          >
            {description}
          </p>
        </div>

        {/* Entity Highlights */}
        {entityName && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-muted/70 px-4 py-2.5">
            {entityType && (
              <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                {entityType}
              </span>
            )}
            <span className="truncate text-sm font-semibold text-ink">
              {entityName}
            </span>
          </div>
        )}

        {/* Additional Details Key-Value List */}
        {details && details.length > 0 && (
          <div className="mt-3 divide-y divide-border/60 rounded-xl border border-border/70 bg-surface-muted/40 px-3.5 py-1 text-xs">
            {details.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-ink-muted font-medium">{item.label}</span>
                <span className="text-ink font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Auto close countdown indicator */}
        {secondsRemaining !== null && secondsRemaining > 0 && (
          <p className="mt-3 text-center text-[11px] text-ink-muted">
            Auto-closing in {secondsRemaining}s...
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
          {secondaryAction && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={secondaryAction.onClick}
              className="w-full sm:flex-1 font-semibold"
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={primaryAction.onClick}
              className="w-full sm:flex-1 font-semibold shadow-card"
              autoFocus
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalNode, document.body)
    : modalNode;
}
