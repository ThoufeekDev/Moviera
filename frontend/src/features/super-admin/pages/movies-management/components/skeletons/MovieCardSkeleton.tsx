import Skeleton from '../../../../../../shared/components/Skeleton';
import styles from './MovieCardSkeleton.module.css';

export default function MovieCardSkeleton() {
  return (
    <article className={styles.card}>
      {/* Floating Poster Skeleton */}
      <div className={styles.posterWrapper}>
        <Skeleton width="100%" height="100%" borderRadius="12px" />
        <div className={styles.posterBadge}>
          <Skeleton width="60px" height="20px" borderRadius="20px" />
        </div>
      </div>

      {/* Right Details Skeleton */}
      <div className={styles.content}>
        {/* Title + Cert Badge */}
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <Skeleton width="65%" height="24px" borderRadius="6px" />
            <Skeleton width="36px" height="20px" borderRadius="4px" />
          </div>
        </div>

        {/* Genre, Duration, Formats */}
        <div className={styles.metaTagsRow}>
          <Skeleton width="75px" height="22px" borderRadius="16px" />
          <Skeleton width="65px" height="18px" borderRadius="4px" />
          <Skeleton width="45px" height="18px" borderRadius="4px" />
          <Skeleton width="45px" height="18px" borderRadius="4px" />
        </div>

        {/* Languages Line */}
        <Skeleton width="55%" height="16px" borderRadius="4px" />

        {/* Description Lines */}
        <div className={styles.descriptionLines}>
          <Skeleton width="100%" height="14px" borderRadius="4px" />
          <Skeleton width="85%" height="14px" borderRadius="4px" />
        </div>

        {/* Footer & Action Buttons */}
        <div className={styles.footerRow}>
          <Skeleton width="140px" height="16px" borderRadius="4px" />

          <div className={styles.actions}>
            <Skeleton width="100%" height="34px" borderRadius="8px" style={{ flex: 1 }} />
            <Skeleton width="65px" height="34px" borderRadius="8px" />
            <Skeleton width="80px" height="34px" borderRadius="8px" />
          </div>
        </div>
      </div>
    </article>
  );
}