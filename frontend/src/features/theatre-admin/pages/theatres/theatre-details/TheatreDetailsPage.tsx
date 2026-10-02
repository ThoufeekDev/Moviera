import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Skeleton from "../../../../../shared/components/Skeleton";
import { useTheatreOverview } from "../hooks/useTheatreOverview";

import TheatreHeader from "./components/TheatreHeader";
import TheatreOverview from "./components/TheatreOverview";
import TheatreScreens from "./components/TheatreScreens";
import TheatreSettings from "./components/TheatreSettings";
import TheatreShows from "./components/TheatreShows";
import TheatreTabs, {
  type TheatreTab,
} from "./components/TheatreTabs";

import styles from "./TheatreDetailsPage.module.css";

export default function TheatreDetailsPage() {
  const { theatreId } = useParams<{ theatreId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<TheatreTab>("OVERVIEW");

  const {
    data: overview,
    isLoading,
  } = useTheatreOverview(theatreId!);

  const theatre = overview?.theatre;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Skeleton
          width="140px"
          height="36px"
          borderRadius="10px"
          style={{ marginBottom: "20px" }}
        />

        <Skeleton
          width="100%"
          height="160px"
          borderRadius="18px"
          style={{ marginBottom: "24px" }}
        />

        <Skeleton
          width="100%"
          height="50px"
          borderRadius="12px"
          style={{ marginBottom: "24px" }}
        />

        <div className={styles.loadingStatsGrid}>
          <Skeleton
            width="100%"
            height="100px"
            borderRadius="16px"
          />

          <Skeleton
            width="100%"
            height="100px"
            borderRadius="16px"
          />

          <Skeleton
            width="100%"
            height="100px"
            borderRadius="16px"
          />
        </div>
      </div>
    );
  }

  if (!theatre || !overview) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Back Navigation */}
      <button
        type="button"
        onClick={() =>
          navigate("/theatre-admin/theatres")
        }
        className={styles.backButton}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line
            x1="19"
            y1="12"
            x2="5"
            y2="12"
          />
          <polyline points="12 19 5 12 12 5" />
        </svg>

        <span>My Theatres</span>
      </button>

      {/* Theatre Header + Tabs */}
      <TheatreHeader theatre={theatre}>
        <TheatreTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalScreens={overview.statistics.totalScreens}
          totalShows={overview.statistics.totalShows}
        />
      </TheatreHeader>

      {/* Overview */}
      {activeTab === "OVERVIEW" && (
        <TheatreOverview overview={overview} />
      )}

      {/* Screens */}
      {activeTab === "SCREENS" && <TheatreScreens />}

      {/* Shows */}
      {activeTab === "SHOWS" && (
        <TheatreShows
          totalShows={overview.statistics.totalShows}
          totalScreens={overview.statistics.totalScreens}
        />
      )}

      {/* Settings */}
      {activeTab === "SETTINGS" && <TheatreSettings />}
    </div>
  );
}