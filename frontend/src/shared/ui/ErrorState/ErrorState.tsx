import { cn } from '@/shared/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// ── Variants ──────────────────────────────────────────────────────────────────

const errorStateVariants = cva(
  [
    'relative flex w-full flex-col items-center justify-center overflow-hidden',
    'text-center font-sans text-slate-200',
    '[animation:scaleFadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]',
  ],
  {
    variants: {
      variant: {
        card: [
          'm-4 rounded-[20px] p-10',
          'bg-[rgba(17,22,36,0.65)] border border-[rgba(255,255,255,0.08)] border-t-[rgba(248,68,100,0.35)]',
          'backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.35),0_0_24px_rgba(248,68,100,0.06)]',
        ],
        full: [
          'min-h-[65vh] rounded-3xl p-12',
          'bg-[radial-gradient(circle_at_center,rgba(17,22,36,0.8)_0%,rgba(11,14,23,0.95)_100%)]',
        ],
        inline: [
          'rounded-[14px] p-5',
          'bg-[rgba(248,68,100,0.05)] border border-[rgba(248,68,100,0.2)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  },
);

// ── Icon helper ───────────────────────────────────────────────────────────────

function ErrorIcon({ type }: { type: 'cinema' | 'network' | 'server' | 'notfound' }) {
  if (type === 'network') {
    return (
      <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    );
  }
  if (type === 'notfound') {
    return (
      <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  // Default 'cinema' reel icon
  return (
    <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeWidth="1.5" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ErrorStateProps extends VariantProps<typeof errorStateVariants> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  icon?: 'cinema' | 'network' | 'server' | 'notfound';
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load the requested data. Please try again.",
  onRetry,
  retryText = 'Try Again',
  variant = 'card',
  icon = 'cinema',
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(errorStateVariants({ variant }), className)}>
      {/* Soft Radial Ambient Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[40px] [animation:ambientPulse_6s_ease-in-out_infinite_alternate]"
        style={{ background: 'radial-gradient(circle, rgba(248,68,100,0.15) 0%, transparent 70%)' }}
      />

      {/* Animated Icon Badge */}
      <div className="group relative mb-5 flex h-[72px] w-[72px] items-center justify-center">
        <div className="absolute inset-[-6px] rounded-full [animation:haloPulse_2.5s_ease-in-out_infinite_alternate]" style={{ background: 'radial-gradient(circle, rgba(248,68,100,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-[2] flex h-full w-full items-center justify-center rounded-[20px] border border-[rgba(248,68,100,0.25)] bg-[rgba(248,68,100,0.1)] text-brand-500 shadow-[0_8px_20px_rgba(248,68,100,0.15)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
          <ErrorIcon type={icon} />
          <span className="absolute right-[2px] top-[2px] h-[10px] w-[10px] rounded-full border-2 border-slate-900 bg-brand-500 shadow-[0_0_8px_var(--color-brand-500)] [animation:blinkDot_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative z-[2] max-w-[440px]">
        <h3 className="mb-2 text-[1.35rem] font-bold leading-[1.3] tracking-[-0.015em] text-white">
          {title}
        </h3>
        <p className="mb-6 text-[0.9rem] leading-[1.55] text-slate-400">
          {message}
        </p>
      </div>

      {/* Retry Action Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-[1.4rem] py-[0.65rem]',
            'text-[0.88rem] font-semibold text-white',
            'bg-gradient-to-br from-brand-500 to-brand-700',
            'shadow-[0_6px_18px_rgba(248,68,100,0.3)]',
            'transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(248,68,100,0.45)]',
            'active:translate-y-0 active:scale-[0.98]',
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover/btn:rotate-180"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6" />
            <path d="M21.5 12a9 9 0 0 1-15.55 6.36L2.5 16M2.5 12a9 9 0 0 1 15.55-6.36L21.5 8" />
          </svg>
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
}
