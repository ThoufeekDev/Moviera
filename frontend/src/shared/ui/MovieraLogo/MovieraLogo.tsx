import { cn } from '@/shared/lib/cn';
import { cva, type VariantProps } from 'class-variance-authority';

// ── Variants ──────────────────────────────────────────────────────────────────

const movieraLogoVariants = cva(
  'inline-flex select-none items-center justify-center gap-3 font-sans transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
  {
    variants: {
      variant: {
        default: '',
        light: '',
        badge: 'rounded-full border border-[rgba(248,68,100,0.2)] bg-[rgba(248,68,100,0.08)] px-4 py-[0.4rem]',
        'icon-only': '',
      },
      size: {
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

// ── Size maps ─────────────────────────────────────────────────────────────────

const containerHeight: Record<string, string> = {
  sm: 'h-8',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-[84px]',
};

const titleSize: Record<string, string> = {
  sm: 'text-[1.05rem]',
  md: 'text-[1.35rem]',
  lg: 'text-[1.65rem]',
  xl: 'text-[2.1rem]',
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MovieraLogoProps extends VariantProps<typeof movieraLogoVariants> {
  showText?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MovieraLogo({
  size = 'md',
  variant = 'default',
  showText = false,
  subtitle,
  className,
  onClick,
}: MovieraLogoProps) {
  return (
    <div
      className={cn(
        movieraLogoVariants({ variant, size }),
        onClick && 'cursor-pointer hover:-translate-y-[2px]',
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Logo image */}
      <div
        className={cn(
          'inline-flex shrink-0 items-center justify-center transition-transform duration-[220ms] ease-out',
          containerHeight[size ?? 'md'],
          onClick && 'group-hover:scale-[1.03]',
        )}
      >
        <img
          src="/logo.png"
          alt="Moviera Logo"
          className="block h-full w-auto max-w-full object-contain [filter:drop-shadow(0_2px_8px_rgba(248,68,100,0.15))]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Text (brand name + optional subtitle) */}
      {(showText || subtitle) && variant !== 'icon-only' && (
        <div className="flex flex-col text-left leading-[1.1]">
          {showText && (
            <span
              className={cn(
                'inline-flex font-extrabold tracking-[-0.03em]',
                titleSize[size ?? 'md'],
              )}
            >
              <span className={cn(variant === 'light' ? 'text-white' : 'text-slate-900')}>
                Movie
              </span>
              <span className="bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent">
                ra
              </span>
            </span>
          )}
          {subtitle && (
            <span className="mt-[0.15rem] text-[0.72rem] font-bold uppercase tracking-[0.08em] text-brand-500">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
