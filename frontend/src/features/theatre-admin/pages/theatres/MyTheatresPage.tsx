import { useNavigate } from "react-router-dom";
import { useMyTheatres } from "./hooks/useMyTheatres";
import TheatreCard from "./components/TheatreCard/TheatreCard";
import TheatreCardSkeleton from "./components/TheatreCard/TheatreCardSkeleton";
import styles from "./MyTheatre.module.css";
import ErrorState from "../../../../shared/components/ErrorState/ErrorState";

export function MyTheatrePage() {
  const navigate = useNavigate();

  const { data: theatres, isLoading, isError, error, refetch } = useMyTheatres();

  const handleManageTheatre = (theatreId: string) => {
    navigate(`/theatre-admin/theatres/${theatreId}`);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Partner Portal
            </div>
            <h1 className={styles.title}>
              My <span className={styles.highlightText}>Theatres</span>
            </h1>
            <p className={styles.subtitle}>
              Manage, update, and monitor all multiplexes and screens assigned to your account.
            </p>
          </div>
        </header>

        <div className={styles.controlsBar}>
          <div className={styles.searchWrapper}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search theatre by name, location, address..."
            />
          </div>

          <div className={styles.filterTabs}>
            <button type="button" className={`${styles.filterTab} ${styles.activeTab}`}>
              All
            </button>
            <button type="button" className={styles.filterTab}>
              Active
            </button>
            <button type="button" className={styles.filterTab}>
              Inactive
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {[1, 2,3,4,5].map((key) => (
            <TheatreCardSkeleton key={key} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load theatres"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading theatres."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Banner */}
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Partner Portal
          </div>
          <h1 className={styles.title}>
            My <span className={styles.highlightText}>Theatres</span>
          </h1>
          <p className={styles.subtitle}>
            Manage, update, and monitor all multiplexes and screens assigned to your account.
          </p>
        </div>
      </header>

      {/* Controls: Search Bar and Filter Tabs UI (UI Only) */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search theatre by name, location, address..."
          />
        </div>

        <div className={styles.filterTabs}>
          <button type="button" className={`${styles.filterTab} ${styles.activeTab}`}>
            All
          </button>
          <button type="button" className={styles.filterTab}>
            Active
          </button>
          <button type="button" className={styles.filterTab}>
            Inactive
          </button>
        </div>
      </div>

      {/* Main Content / Cards Grid */}
      {theatres?.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No theatres assigned</h2>
          <p>You don't currently have any theatres assigned to your account.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {theatres?.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              theatre={theatre}
              onManage={handleManageTheatre}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTheatrePage;