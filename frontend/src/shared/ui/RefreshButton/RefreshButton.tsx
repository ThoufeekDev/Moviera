import { RefreshCw } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface RefreshButtonProps {
  onClick: () => void | Promise<unknown>;
  isRefreshing?: boolean;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'labeled';
  label?: string;
  className?: string;
  iconClassName?: string;
}

export function RefreshButton({
  onClick,
  isRefreshing = false,
  disabled = false,
  title = 'Refresh data',
  ariaLabel = 'Refresh data',
  size = 'md',
  variant = 'icon',
  label = 'Refresh',
  className,
  iconClassName,
}: RefreshButtonProps) {
  const sizeClasses = {
    sm: variant === 'icon' ? 'h-9 w-9' : 'h-9 px-3 text-xs gap-1.5',
    md: variant === 'icon' ? 'h-11 w-11 min-h-[44px] min-w-[44px]' : 'h-11 px-4 text-sm gap-2 min-h-[44px]',
    lg: variant === 'icon' ? 'h-12 w-12 min-h-[48px] min-w-[48px]' : 'h-12 px-5 text-base gap-2.5 min-h-[48px]',
  };

  const iconSizes = {
    sm: 15,
    md: 17,
    lg: 19,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isRefreshing}
      title={title}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border border-border bg-surface text-ink-muted',
        'hover:text-ink hover:bg-surface-muted transition-colors cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
        sizeClasses[size],
        className,
      )}
    >
      <RefreshCw
        size={iconSizes[size]}
        className={cn(
          'transition-transform duration-200 shrink-0',
          isRefreshing && 'animate-spin text-brand-600',
          iconClassName,
        )}
      />
      {variant === 'labeled' && <span className="font-medium">{label}</span>}
    </button>
  );
}

export default RefreshButton;
