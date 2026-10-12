import { cva, type VariantProps } from 'class-variance-authority';

export const movieraLogoVariants = cva(
  'inline-flex select-none items-center justify-center gap-2.5 font-sans transition-opacity duration-150',
  {
    variants: {
      variant: {
        default: '',
        light: 'text-white',
        badge: 'rounded-full border border-brand-100 bg-brand-50 px-3 py-1',
        'icon-only': '',
      },
      size: {
        sm: 'h-8 text-base',
        md: 'h-10 text-lg md:text-xl',
        lg: 'h-12 text-2xl',
        xl: 'h-16 text-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type MovieraLogoVariants = VariantProps<typeof movieraLogoVariants>;
