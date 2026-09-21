import styles from "./ErrorSate.module.css";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  variant?: "card" | "inline" | "full";
  icon?: "cinema" | "alert" | "wifi" | "film";
  className?: string;
}

function ErrorIcon({ type = "cinema" }: { type?: ErrorStateProps["icon"] }) {
  if (type === "wifi") {
    return (
      <svg
        className={styles.svgIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
      </svg>
    );
  }

  if (type === "film") {
    return (
      <svg
        className={styles.svgIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="8" x2="22" y2="8" />
        <line x1="2" y1="16" x2="22" y2="16" />
        <line x1="6" y1="4" x2="6" y2="20" />
        <line x1="18" y1="4" x2="18" y2="20" />
      </svg>
    );
  }

  if (type === "alert") {
    return (
      <svg
        className={styles.svgIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }

  // Default 'cinema' reel icon
  return (
    <svg
      className={styles.svgIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" strokeWidth="1.5" />
    </svg>
  );
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the requested data. Please try again.",
  onRetry,
  retryText = "Try Again",
  variant = "card",
  icon = "cinema",
  className = "",
}: ErrorStateProps) {
  const getVariantClass = () => {
    switch (variant) {
      case "full":
        return styles.variantFull;
      case "inline":
        return styles.variantInline;
      default:
        return styles.variantCard;
    }
  };

  return (
    <div
      className={`${styles.errorStateWrapper} ${getVariantClass()} ${className}`}
    >
      {/* Soft Radial Ambient Glow */}
      <div className={styles.glowBackground} />

      {/* Animated Icon Badge */}
      <div className={styles.iconContainer}>
        <div className={styles.iconHalo} />
        <div className={styles.iconBadge}>
          <ErrorIcon type={icon} />
          <span className={styles.warningDot} />
        </div>
      </div>

      {/* Title & Description */}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
      </div>

      {/* Retry Action Button */}
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retryBtn}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.retryIcon}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6" />
            <path d="M21.5 12a9 9 0 0 1-15.55 6.36L2.5 16M2.5 12a9 9 0 0 1 15.55-6.36L21.5 8" />
          </svg>
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
}