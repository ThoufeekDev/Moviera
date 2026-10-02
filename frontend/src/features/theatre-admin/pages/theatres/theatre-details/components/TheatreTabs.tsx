import styles from "./TheatreTabs.module.css";

export type TheatreTab =
  | "OVERVIEW"
  | "SCREENS"
  | "SHOWS"
  | "SETTINGS";

interface TheatreTabsProps {
  activeTab: TheatreTab;
  onTabChange: (tab: TheatreTab) => void;
  totalScreens: number;
  totalShows: number;
}

export default function TheatreTabs({
  activeTab,
  onTabChange,
  totalScreens,
  totalShows,
}: TheatreTabsProps) {
  return (
    <nav
      className={styles.tabsNav}
      aria-label="Theatre management tabs"
    >
      <button
        type="button"
        className={`${styles.tabBtn} ${
          activeTab === "OVERVIEW" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("OVERVIEW")}
      >
        Overview
      </button>

      <button
        type="button"
        className={`${styles.tabBtn} ${
          activeTab === "SCREENS" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("SCREENS")}
      >
        Screens ({totalScreens})
      </button>

      <button
        type="button"
        className={`${styles.tabBtn} ${
          activeTab === "SHOWS" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("SHOWS")}
      >
        Shows ({totalShows})
      </button>

      <button
        type="button"
        className={`${styles.tabBtn} ${
          activeTab === "SETTINGS" ? styles.activeTab : ""
        }`}
        onClick={() => onTabChange("SETTINGS")}
      >
        Settings
      </button>
    </nav>
  );
}