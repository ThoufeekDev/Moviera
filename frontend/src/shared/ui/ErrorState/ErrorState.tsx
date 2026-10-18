import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: 'theatre' | 'network' | 'server' | 'notfound';
  className?: string;
}

function ErrorIcon({ type }: { type: 'theatre' | 'network' | 'server' | 'notfound' }) {
  if (type === 'network') {
    return (
      <svg className="h-8 w-8 text-danger-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    );
  }
  if (type === 'server') {
    return (
      <svg className="h-8 w-8 text-danger-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    );
  }
  if (type === 'notfound') {
    return (
      <svg className="h-8 w-8 text-danger-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  return (
    <svg className="h-8 w-8 text-danger-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeWidth="1.5" />
    </svg>
  );
}

export default function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load the requested data. Please try again.",
  onRetry,
  retryText = 'Try Again',
  icon = 'theatre',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex w-full flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 text-center text-ink shadow-card md:p-12',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 border border-brand-100">
        <ErrorIcon type={icon} />
      </div>

      <div className="max-w-md">
        <h3 className="mb-2 text-xl font-bold tracking-tight text-ink">
          {title}
        </h3>
        <p className="mb-6 text-sm text-ink-muted leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onRetry}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6" />
            <path d="M21.5 12a9 9 0 0 1-15.55 6.36L2.5 16M2.5 12a9 9 0 0 1 15.55-6.36L21.5 8" />
          </svg>
          <span>{retryText}</span>
        </Button>
      )}
    </div>
  );
}
