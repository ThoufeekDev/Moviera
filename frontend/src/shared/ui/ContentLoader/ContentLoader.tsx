import { cn } from '@/shared/lib/cn';

export interface ContentLoaderProps {
  text?: string;
  subtext?: string;
  variant?: 'spinner' | 'skeleton' | 'cards';
  minHeight?: string | number;
  className?: string;
}

export default function ContentLoader({
  text = 'Moviera',
  subtext = 'Loading content...',
  variant = 'spinner',
  minHeight,
  className = '',
}: ContentLoaderProps) {
  if (variant === 'cards' || variant === 'skeleton') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'relative flex w-full flex-1 flex-col items-center justify-center p-4',
          'min-h-[320px]',
          className,
        )}
        style={minHeight ? { minHeight } : undefined}
      >
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
              <div className="h-44 w-full rounded-md bg-surface-muted animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-surface-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-surface-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'relative flex w-full flex-1 flex-col items-center justify-center p-8 text-center',
        'min-h-[320px]',
        className,
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <div className="flex max-w-sm flex-col items-center justify-center rounded-lg border border-border bg-surface p-8 shadow-card">
        <div className="mb-4 h-10 w-10 rounded-full border-3 border-border border-t-brand-600 animate-spin" />
        <h4 className="text-base font-bold text-ink">{text}</h4>
        <p className="mt-1 text-xs md:text-sm text-ink-muted">{subtext}</p>
      </div>
    </div>
  );
}
