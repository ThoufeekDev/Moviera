// components/common/Loader.tsx
import { motion } from 'framer-motion';

interface LoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export default function Loader({
  text = 'Moviera',
  subtext = 'Loading cinema experience...',
  fullScreen = true,
}: LoaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: fullScreen ? '100dvh' : '100%',
        minHeight: fullScreen ? '100vh' : '300px',
        backgroundColor: fullScreen ? '#f8fafc' : 'transparent',
        backgroundImage: fullScreen
          ? 'radial-gradient(circle at 50% 35%, rgba(248, 68, 100, 0.08) 0%, rgba(248, 250, 252, 1) 75%)'
          : 'none',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: fullScreen ? 9999 : 1,
      }}
    >
      {/* Floating Movie Loader Card Container */}
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          maxWidth: '360px',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cinema Pulse Ring Engine */}
        <div style={{ position: 'relative', width: 80, height: 80, marginBottom: '1.25rem' }}>
          {/* Red Radial Aura Glow */}
          <motion.div
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(248, 68, 100, 0.22) 0%, rgba(248, 68, 100, 0) 70%)',
            }}
            animate={{ scale: [0.9, 1.45, 0.9], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* SVG Rotating Red Gradient Ring */}
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <linearGradient id="moviera-loader-spin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f84464" />
                <stop offset="70%" stopColor="#d62947" />
                <stop offset="100%" stopColor="rgba(248, 68, 100, 0.1)" />
              </linearGradient>
            </defs>
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
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
            style={{
              position: 'absolute',
              inset: 16,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f84464 0%, #d62947 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 22px rgba(248, 68, 100, 0.35)',
            }}
            animate={{
              scale: [1, 1.08, 1, 1.04, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            {/* Film Clapperboard Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
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
        <div
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.025em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
            marginBottom: '0.35rem',
          }}
        >
          <span>{text === 'Moviera' ? 'Movie' : text}</span>
          {text === 'Moviera' && <span style={{ color: '#f84464' }}>ra</span>}
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            fontWeight: 500,
            lineHeight: 1.45,
            marginBottom: '1.35rem',
          }}
        >
          {subtext}
        </div>

        {/* Cinema Shimmer Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '3.5px',
            background: '#e5e7eb',
            borderRadius: '99px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '45%',
              background:
                'linear-gradient(90deg, rgba(248, 68, 100, 0.1), #f84464, #d62947, rgba(214, 41, 71, 0.1))',
              borderRadius: '99px',
            }}
            animate={{
              left: ['-45%', '100%'],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}



