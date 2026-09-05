// components/InlineLoader.tsx
import { motion } from 'framer-motion';

const CUBIC: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function InlineLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      {/* Orbital rings */}
      <div style={{ width: 56, height: 56, position: 'relative' }}>
        {/* Outer ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: '#7F77DD',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: CUBIC }}
        />

        {/* Middle ring (reverse) */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderRightColor: '#1D9E75',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 0.85, repeat: Infinity, ease: CUBIC }}
        />

        {/* Inner ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 16,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderBottomColor: '#D85A30',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: CUBIC }}
        />

        {/* Center dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#7F77DD',
            marginTop: -3,
            marginLeft: -3,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Status row */}
      <div className="flex items-center gap-2 mt-4">
        <motion.div
          className="w-2 h-2 rounded-full bg-emerald-600"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-sm font-medium text-gray-500">Loading doctors...</span>
      </div>

      <p className="text-xs text-gray-400 mt-1">Fetching latest doctor records</p>
    </div>
  );
}
