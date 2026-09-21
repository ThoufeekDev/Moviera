import Skeleton from '../../../../../../shared/components/Skeleton';
import styles from '../../movie-edit/EditMoviePage.module.css';

export default function MovieFormSkeleton() {
  return (
    <div className={styles.pageContainer}>
      {/* Top Nav Skeleton */}
      <div className={styles.topNav}>
        <Skeleton width="110px" height="36px" borderRadius="12px" />
        <Skeleton width="130px" height="20px" borderRadius="4px" />
      </div>

      {/* Hero Header Skeleton */}
      <div className={styles.heroHeader}>
        <div className={styles.headerTitleGroup}>
          <Skeleton width="260px" height="32px" borderRadius="8px" style={{ marginBottom: '10px' }} />
          <Skeleton width="80%" height="16px" borderRadius="4px" />
        </div>

        {/* Stepper Bar Skeleton */}
        <div className={styles.stepperBar}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.stepItem} style={{ border: 'none', pointerEvents: 'none' }}>
              <Skeleton width="140px" height="36px" borderRadius="30px" />
            </div>
          ))}
        </div>
      </div>

      {/* Step Content Form Card Skeleton */}
      <div className={styles.stepContentCard}>
        <Skeleton width="200px" height="26px" borderRadius="6px" style={{ marginBottom: '24px' }} />

        {/* Form Fields Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div>
            <Skeleton width="100px" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
            <Skeleton width="100%" height="44px" borderRadius="10px" />
          </div>
          <div>
            <Skeleton width="110px" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
            <Skeleton width="100%" height="44px" borderRadius="10px" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Skeleton width="120px" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
            <Skeleton width="100%" height="100px" borderRadius="10px" />
          </div>
          <div>
            <Skeleton width="90px" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
            <Skeleton width="100%" height="44px" borderRadius="10px" />
          </div>
          <div>
            <Skeleton width="130px" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
            <Skeleton width="100%" height="44px" borderRadius="10px" />
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width="120px" height="46px" borderRadius="12px" />
        <Skeleton width="140px" height="46px" borderRadius="12px" />
      </div>
    </div>
  );
}
