import styles from "./TheatreShows.module.css";

interface TheatreShowsProps {
  totalShows: number;
  totalScreens: number;
}

export default function TheatreShows({
  totalShows,
  totalScreens,
}: TheatreShowsProps) {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeaderRow}>
        <h2 className={styles.sectionHeading}>
          Today's Showtimes
        </h2>

        <button
          type="button"
          className={styles.primaryBtn}
        >
          + Schedule Show
        </button>
      </div>

      <div className={styles.showsPlaceholder}>
        <p>
          {totalShows} active showtimes scheduled for today
          across {totalScreens} screens.
        </p>
      </div>
    </div>
  );
}