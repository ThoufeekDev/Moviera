import { cn } from '@/shared/lib/cn';
import { movieraLogoVariants, type MovieraLogoVariants } from './movieraLogoVariants';

export interface MovieraLogoProps extends MovieraLogoVariants {
  showText?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

const heightMap: Record<string, string> = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-11',
  xl: 'h-14',
};

export default function MovieraLogo({
  size = 'md',
  variant = 'default',
  showText = true,
  subtitle,
  className,
  onClick,
}: MovieraLogoProps) {
  return (
    <div
      className={cn(
        movieraLogoVariants({ variant, size }),
        onClick && 'cursor-pointer hover:opacity-90',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Existing Logo image asset */}
      <div className={cn('inline-flex shrink-0 items-center justify-center', heightMap[size ?? 'md'])}>
        <img
          src="/logo.png"
          alt="Moviera Logo"
          className="block h-full w-auto max-w-full object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Brand text styled with Roboto brand font and colors */}
      {(showText || subtitle) && variant !== 'icon-only' && (
        <div className="flex flex-col text-left leading-none">
          {showText && (
            <span className="font-bold tracking-tight font-sans">
              <span className={variant === 'light' ? 'text-white' : 'text-ink'}>
                Movie
              </span>
              <span className="text-brand-600">ra</span>
            </span>
          )}
          {subtitle && (
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { MovieraLogo };
