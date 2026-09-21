import Skeleton from '../../../../../../shared/components/Skeleton';
import styles from '../../movie-details/MovieDetailsPage.module.css';

export default function MovieDetailSkeleton() {
  return (
    <div className={styles.page}>
      {/* Top Navigation Bar Skeleton */}
      <nav className={styles.topNav}>
        <Skeleton width="120px" height="20px" borderRadius="6px" />
        <Skeleton width="220px" height="18px" borderRadius="4px" />
      </nav>

      {/* Hero Banner Section Skeleton */}
      <header className={styles.heroSection}>
        <div className={styles.heroContentContainer}>
          {/* Left Poster Column Skeleton */}
          <div className={styles.posterColumn}>
            <div className={styles.posterCard}>
              <Skeleton width="100%" height="320px" borderRadius="12px" />
            </div>
          </div>

          {/* Right Details Column Skeleton */}
          <div className={styles.detailsColumn}>
            {/* Badges Row Skeleton */}
            <div className={styles.badgeRow}>
              <Skeleton width="40px" height="24px" borderRadius="4px" />
              <Skeleton width="90px" height="24px" borderRadius="16px" />
              <Skeleton width="80px" height="24px" borderRadius="16px" />
            </div>

            {/* Title Skeleton */}
            <Skeleton width="75%" height="36px" borderRadius="8px" style={{ margin: '8px 0' }} />

            {/* Languages & Formats Chips Skeleton */}
            <div className={styles.chipRow}>
              <Skeleton width="180px" height="22px" borderRadius="12px" />
              <Skeleton width="220px" height="22px" borderRadius="12px" />
            </div>

            {/* Release Date Skeleton */}
            <Skeleton width="200px" height="20px" borderRadius="4px" style={{ margin: '6px 0' }} />

            {/* Hero Actions Skeleton */}
            <div className={styles.heroActions}>
              <Skeleton width="140px" height="42px" borderRadius="8px" />
              <Skeleton width="120px" height="42px" borderRadius="8px" />
              <Skeleton width="150px" height="42px" borderRadius="8px" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body Skeleton */}
      <main className={styles.mainContent}>
        {/* Section 1: About the Movie */}
        <section className={styles.sectionCard}>
          <Skeleton width="180px" height="28px" borderRadius="6px" style={{ marginBottom: '16px' }} />
          <Skeleton width="100%" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
          <Skeleton width="92%" height="16px" borderRadius="4px" style={{ marginBottom: '8px' }} />
          <Skeleton width="70%" height="16px" borderRadius="4px" style={{ marginBottom: '24px' }} />

          {/* Info Grid Tiles Skeleton */}
          <div className={styles.infoGrid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.infoTile}>
                <Skeleton width="80px" height="14px" borderRadius="4px" style={{ marginBottom: '6px' }} />
                <Skeleton width="110px" height="20px" borderRadius="4px" />
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Cast & Crew Skeleton */}
        <section className={styles.sectionCard}>
          <Skeleton width="150px" height="28px" borderRadius="6px" style={{ marginBottom: '20px' }} />
          <div className={styles.peopleGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.personCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Skeleton width="64px" height="64px" borderRadius="50%" style={{ marginBottom: '8px' }} />
                <Skeleton width="90px" height="16px" borderRadius="4px" style={{ marginBottom: '4px' }} />
                <Skeleton width="70px" height="12px" borderRadius="4px" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
