import styles from "./TheatreSettings.module.css";

export default function TheatreSettings() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.sectionHeading}>
        Theatre Settings
      </h2>

      <div className={styles.infoCard}>
        <p className={styles.infoValue}>
          Configure pricing tiers, operational hours, and
          staff permissions.
        </p>
      </div>
    </div>
  );
}