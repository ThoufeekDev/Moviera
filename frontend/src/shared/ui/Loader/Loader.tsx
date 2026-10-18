import { cn } from '@/shared/lib/cn';
import MovieraLogo from '@/shared/ui/MovieraLogo/MovieraLogo';

interface LoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loader({
  text = 'Moviera',
  subtext = 'Loading theatre experience...',
  fullScreen = true,
  className,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center p-6 text-center',
        fullScreen
          ? 'fixed inset-0 z-50 min-h-dvh bg-page text-ink'
          : 'relative z-10 min-h-[260px] bg-transparent text-ink',
        className,
      )}
    >
      <div className="flex max-w-xs flex-col items-center justify-center">
        <MovieraLogo size="lg" />

        {/* Brand red spinner */}
        <div className="my-6 relative flex h-10 w-10 items-center justify-center">
          <div className="h-10 w-10 rounded-full border-3 border-border border-t-brand-600 animate-spin" />
        </div>

        <p className="text-base font-semibold text-ink">
          {text}
        </p>
        <p className="mt-1 text-xs md:text-sm text-ink-muted">
          {subtext}
        </p>
      </div>
    </div>
  );
}
