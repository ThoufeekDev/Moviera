import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  title = 'No items found',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8 text-center sm:p-12',
        className,
      )}
    >
      {icon && (
        <div className="mb-3 text-ink-muted flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-ink sm:text-lg">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-md text-xs md:text-sm text-ink-muted leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
