import styles from "./TheatreScreens.module.css";

export default function TheatreScreens() {
  return (
    <div className={styles.tabContent}>
      <div className={styles.tabHeaderRow}>
        <h2 className={styles.sectionHeading}>
          Screens Management
        </h2>

        <button
          type="button"
          className={styles.primaryBtn}
        >
          + Add New Screen
        </button>
      </div>

      <div className={styles.screensGrid}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className={styles.screenCard}
          >
            <div className={styles.screenCardHeader}>
              <h4>Screen {num}</h4>

              <span className={styles.screenBadge}>
                {num === 1 ? "IMAX 3D" : "Dolby 7.1"}
              </span>
            </div>

            <div className={styles.screenMeta}>
              <span>
                Total Capacity:{" "}
                {num % 2 === 0 ? 80 : 75} Seats
              </span>
            </div>

            <button
              type="button"
              className={styles.secondaryBtn}
            >
              Manage Layout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}