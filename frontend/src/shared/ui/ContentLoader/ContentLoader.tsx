import { motion } from 'framer-motion';
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
        className={cn(
          'relative z-[1] flex w-full flex-1 flex-col items-center justify-center px-4 py-8',
          'min-h-[420px] animate-[fadeIn_0.3s_ease-out_forwards]',
          className,
        )}
        style={minHeight ? { minHeight } : undefined}
      >
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <div className="relative h-[200px] w-full overflow-hidden rounded-xl bg-slate-100">
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:shimmerMove_1.5s_infinite]" />
              </div>
              <div className="relative h-4 overflow-hidden rounded-md bg-slate-100">
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:shimmerMove_1.5s_infinite]" />
              </div>
              <div className="relative h-4 w-3/5 overflow-hidden rounded-md bg-slate-100">
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/60 to-transparent [animation:shimmerMove_1.5s_infinite]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative z-[1] flex w-full flex-1 flex-col items-center justify-center px-4 py-8',
        'min-h-[420px] [animation:fadeIn_0.3s_ease-out_forwards]',
        className,
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <motion.div
        className={cn(
          'flex w-full max-w-[380px] flex-col items-center justify-center p-8 text-center',
          'rounded-[20px] border border-[rgba(229,231,235,0.8)] bg-[rgba(255,255,255,0.7)]',
          'backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]',
          'max-sm:p-6',
        )}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cinema Pulse Ring Engine */}
        <div className="relative mb-[1.1rem] h-[72px] w-[72px]">
          <motion.div
            className="absolute inset-[-8px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(248,68,100,0.22) 0%, rgba(248,68,100,0) 70%)' }}
            animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <svg width="72" height="72" viewBox="0 0 80 80" className="absolute inset-0">
            <defs>
              <linearGradient id="moviera-content-loader-spin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-brand-500)" />
                <stop offset="70%" stopColor="var(--color-brand-700)" />
                <stop offset="100%" stopColor="rgba(248,68,100,0.1)" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="none" stroke="var(--color-slate-200)" strokeWidth="4" />
            <motion.circle
              cx="40" cy="40" r="35" fill="none"
              stroke="url(#moviera-content-loader-spin)"
              strokeWidth="4" strokeLinecap="round" strokeDasharray="165 60"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '40px 40px' }}
            />
          </svg>
          <motion.div
            className="absolute inset-[14px] flex items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_6px_18px_rgba(248,68,100,0.35)] text-white"
            animate={{ scale: [1, 1.08, 1, 1.04, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.4, 0.6, 1] }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3L20.2 6Z" />
              <path d="m6.2 5.3 3.1 3.9" />
              <path d="m12.4 3.4 3.1 4" />
              <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
            </svg>
          </motion.div>
        </div>

        <div className="mb-[0.35rem] flex items-center gap-[0.2rem] text-[1.25rem] font-extrabold tracking-tight text-slate-900">
          <span>{text === 'Moviera' ? 'Movie' : text}</span>
          {text === 'Moviera' && <span className="text-brand-500">ra</span>}
        </div>

        <div className="mb-5 text-[0.85rem] font-medium leading-[1.45] text-slate-500">{subtext}</div>

        <div className="relative h-[3.5px] w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="absolute top-0 bottom-0 w-[45%] rounded-full"
            style={{ background: 'linear-gradient(90deg, rgba(248,68,100,0.1), var(--color-brand-500), var(--color-brand-700), rgba(214,41,71,0.1))' }}
            animate={{ left: ['-45%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
