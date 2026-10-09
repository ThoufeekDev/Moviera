import { cn } from '@/shared/lib/cn';

export interface InlineLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

export default function InlineLoader({
  size = 'md',
  text,
  className,
}: InlineLoaderProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 text-slate-500', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-brand-500',
          sizeClasses[size]
        )}
      />
      {text && <span className="text-sm font-medium">{text}</span>}
    </div>
  );
}
