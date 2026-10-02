import Skeleton from "../../../../../../shared/components/Skeleton";
import cardStyles from "./TheatreCard.module.css";
import styles from "./TheatreCardSkeleton.module.css";

export default function TheatreCardSkeleton() {
  return (
    <article className={cardStyles.card}>
      {/* Header Accent Bar Skeleton */}
      <div className={cardStyles.cardHeaderBg}>
        <Skeleton width="70px" height="22px" borderRadius="20px" />
        <Skeleton width="90px" height="20px" borderRadius="6px" />
      </div>

      {/* Card Body Skeleton */}
      <div className={cardStyles.cardBody}>
        <div className={cardStyles.logoAndTitle}>
          <Skeleton width="52px" height="52px" borderRadius="14px" />
          <div className={cardStyles.headerText} style={{ flex: 1 }}>
            <Skeleton width="75%" height="22px" borderRadius="6px" style={{ marginBottom: "6px" }} />
            <Skeleton width="45%" height="14px" borderRadius="4px" />
          </div>
        </div>

        <div className={cardStyles.infoSection}>
          <div className={styles.skeletonLineGroup}>
            <Skeleton width="100%" height="14px" borderRadius="4px" />
            <Skeleton width="80%" height="14px" borderRadius="4px" />
          </div>
          <div className={styles.skeletonContactRow}>
            <Skeleton width="45%" height="16px" borderRadius="4px" />
            <Skeleton width="45%" height="16px" borderRadius="4px" />
          </div>
        </div>

        <div className={cardStyles.footerRow}>
          <Skeleton width="100%" height="44px" borderRadius="12px" />
        </div>
      </div>
    </article>
  );
}
