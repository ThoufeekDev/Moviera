import { motion } from 'framer-motion';
import styles from './ContentLoader.module.css';

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
        className={`${styles.container} ${className}`}
        style={minHeight ? { minHeight } : undefined}
      >
        <div className={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className={styles.skeletonCard}>
              <div className={styles.skeletonPoster}>
                <div className={styles.shimmer} />
              </div>
              <div className={styles.skeletonLine}>
                <div className={styles.shimmer} />
              </div>
              <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}>
                <div className={styles.shimmer} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${className}`}
      style={minHeight ? { minHeight } : undefined}
    >
      <motion.div
        className={styles.loaderCard}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Cinema Pulse Ring Engine */}
        <div className={styles.loaderIcon}>
          {/* Red Radial Aura Glow */}
          <motion.div
            className={styles.aura}
            animate={{
              scale: [0.9, 1.4, 0.9],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />

          {/* SVG Rotating Red Gradient Ring */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 80 80"
            className={styles.ring}
          >
            <defs>
              <linearGradient
                id="moviera-content-loader-spin"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
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
              stroke="url(#moviera-content-loader-spin)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="165 60"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                transformOrigin: '40px 40px',
              }}
            />
          </svg>

          {/* Central Cinema Reel Badge */}
          <motion.div
            className={styles.badge}
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
            <svg
              width="22"
              height="22"
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

        {/* Brand Header */}
        <div className={styles.brandName}>
          <span>{text === 'Moviera' ? 'Movie' : text}</span>
          {text === 'Moviera' && <span className={styles.brandAccent}>ra</span>}
        </div>

        {/* Subtext */}
        <div className={styles.subtext}>{subtext}</div>

        {/* Shimmer Progress Bar */}
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progress}
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
