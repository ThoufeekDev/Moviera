import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface FormErrorBannerProps {
  message?: string | null;
  unmappedErrors?: string[];
  onDismiss?: () => void;
  className?: string;
  id?: string;
}

export default function FormErrorBanner({
  message,
  unmappedErrors = [],
  onDismiss,
  className,
  id,
}: FormErrorBannerProps) {
  if (!message && unmappedErrors.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      data-testid="form-error-banner"
      role="alert"
      aria-live="polite"
      className={cn(
        'relative flex items-start gap-3 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm text-danger-600 shadow-sm transition-all',
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" aria-hidden="true" />

      <div className="flex-1 space-y-1">
        {message && <p className="font-medium text-danger-600">{message}</p>}

        {unmappedErrors.length > 0 && (
          <ul className="list-inside list-disc space-y-0.5 text-xs text-danger-600/90">
            {unmappedErrors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-danger-600/70 transition-colors hover:bg-brand-100/50 hover:text-danger-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
          aria-label="Dismiss error banner"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
