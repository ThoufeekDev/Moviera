import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/Button';

interface ComingSoonProps {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = "We're working on this feature and it will be available soon.",
  backTo,
  backLabel = 'Go Back',
  className,
}: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-lg flex-col items-center justify-center p-6 sm:p-8 text-center',
        className,
      )}
    >
      <div className="flex w-full flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 sm:p-10 shadow-card">
        {/* Cinema Reel Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 border border-brand-100 text-brand-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeWidth="1.5" />
          </svg>
        </div>

        <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
          Feature in development
        </span>

        <h1 className="text-2xl md:text-3xl font-bold text-ink">
          {title}
        </h1>

        <p className="mt-2 mb-6 text-sm md:text-base text-ink-muted leading-relaxed">
          {description}
        </p>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => {
            if (backTo) navigate(backTo);
            else navigate(-1);
          }}
        >
          {backLabel}
        </Button>
      </div>
    </div>
  );
}
