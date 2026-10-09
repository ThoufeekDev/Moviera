import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/cn';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Loader({
  text = 'Moviera',
  subtext = 'Loading cinema experience...',
  fullScreen = true,
  className,
}: LoaderProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center',
        fullScreen
          ? [
              'fixed inset-0 z-[9999] min-h-screen h-dvh',
              'bg-slate-50',
              '[background-image:radial-gradient(circle_at_50%_35%,rgba(248,68,100,0.08)_0%,rgba(248,250,252,1)_75%)]',
            ]
          : 'relative z-[1] h-full min-h-[300px] bg-transparent',
        className,
      )}
    >
      {/* Floating Movie Loader Card Container */}
      <motion.div
        className="flex max-w-[360px] w-full flex-col items-center justify-center p-6 text-center"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cinema Pulse Ring Engine */}
        <div className="relative mb-5 h-20 w-20">
          {/* Red Radial Aura Glow */}
          <motion.div
            className="absolute inset-[-10px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(248,68,100,0.22) 0%, rgba(248,68,100,0) 70%)',
            }}
            animate={{ scale: [0.9, 1.45, 0.9], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* SVG Rotating Red Gradient Ring */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0">
            <defs>
              <linearGradient id="moviera-loader-spin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-brand-500)" />
                <stop offset="70%" stopColor="var(--color-brand-700)" />
                <stop offset="100%" stopColor="rgba(248,68,100,0.1)" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="35" fill="none" stroke="var(--color-slate-200)" strokeWidth="4" />
            <motion.circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="url(#moviera-loader-spin)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="165 60"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '40px 40px' }}
            />
          </svg>

          {/* Central Cinema Reel Badge */}
          <motion.div
            className="absolute inset-4 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_8px_22px_rgba(248,68,100,0.35)] text-white"
            animate={{ scale: [1, 1.08, 1, 1.04, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3L20.2 6Z" />
              <path d="m6.2 5.3 3.1 3.9" />
              <path d="m12.4 3.4 3.1 4" />
              <path d="M4 11h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
            </svg>
          </motion.div>
        </div>

        {/* Brand Name Header */}
        <div className="mb-[0.35rem] flex items-center gap-[0.2rem] text-[1.35rem] font-extrabold tracking-tight text-slate-900">
          <span>{text === 'Moviera' ? 'Movie' : text}</span>
          {text === 'Moviera' && <span className="text-brand-500">ra</span>}
        </div>

        {/* Subtext */}
        <div className="mb-[1.35rem] text-[0.85rem] font-medium leading-[1.45] text-slate-500">
          {subtext}
        </div>

        {/* Cinema Shimmer Progress Bar */}
        <div className="relative h-[3.5px] w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="absolute top-0 bottom-0 w-[45%] rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(248,68,100,0.1), var(--color-brand-500), var(--color-brand-700), rgba(214,41,71,0.1))',
            }}
            animate={{ left: ['-45%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
