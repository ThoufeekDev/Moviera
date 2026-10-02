
import type { TheatreOverview as TheatreOverviewData } from "../../types/theatreOverview";
import styles from "./TheatreOverview.module.css";

interface TheatreOverviewProps {
  overview: TheatreOverviewData;
}

const recentActivities = [
  {
    id: 1,
    text: "Theatre profile was updated",
    time: "Recently",
  },
  {
    id: 2,
    text: "Screen configuration was updated",
    time: "Recently",
  },
  {
    id: 3,
    text: "Theatre facilities were updated",
    time: "Recently",
  },
];

export default function TheatreOverview({
  overview,
}: TheatreOverviewProps) {
  const { theatre, statistics, facilities, reviews } = overview;

  return (
    <div className={styles.tabContent}>
      {/* Statistics */}
      <section>
        <h2 className={styles.sectionHeading}>
          Theatre Overview
        </h2>

        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statIconWrapper}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>

            <div className={styles.statText}>
              <span className={styles.statLabel}>
                Total Screens
              </span>
              <span className={styles.statValue}>
                {statistics.totalScreens}
              </span>
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statIconWrapper}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </div>

            <div className={styles.statText}>
              <span className={styles.statLabel}>
                Total Seats
              </span>
              <span className={styles.statValue}>
                {statistics.totalSeats}
              </span>
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statIconWrapper}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div className={styles.statText}>
              <span className={styles.statLabel}>
                Total Shows
              </span>
              <span className={styles.statValue}>
                {statistics.totalShows}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Theatre Information */}
      <section className={styles.infoCard}>
        <h3 className={styles.cardTitle}>
          Theatre Information
        </h3>

        <div className={styles.infoGrid}>
          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>
              Address
            </span>

            <p className={styles.infoValue}>
              {theatre.address || "N/A"}
            </p>
          </div>

          <div className={styles.contactRow}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>
                Email
              </span>

              <p className={styles.infoValue}>
                {theatre.email || "N/A"}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>
                Phone
              </span>

              <p className={styles.infoValue}>
                {theatre.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <span className={styles.infoLabel}>
              Description
            </span>

            <p className={styles.infoValue}>
              {theatre.description || "No description available"}
            </p>
          </div>
        </div>

        {/* Facilities */}
        <div className={styles.facilitiesSection}>
          <span className={styles.infoLabel}>
            Facilities
          </span>

          <div className={styles.facilityPills}>
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <span
                  key={facility.id}
                  className={styles.facilityTag}
                >
                  <span className={styles.facIcon}>
                    {facility.icon ?? "•"}
                  </span>

                  {facility.name}
                </span>
              ))
            ) : (
              <span className={styles.infoValue}>
                No facilities added
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.infoCard}>
        <h3 className={styles.cardTitle}>
          Reviews
        </h3>

        <div className={styles.reviewSummary}>
          <div className={styles.ratingValue}>
            {reviews.averageRating.toFixed(1)}
          </div>

          <div>
            <div className={styles.ratingStars}>
              ★★★★★
            </div>

            <p className={styles.reviewCount}>
              {reviews.totalReviews}{" "}
              {reviews.totalReviews === 1
                ? "review"
                : "reviews"}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.infoCard}>
        <h3 className={styles.cardTitle}>
          Recent Activity
        </h3>

        <div className={styles.activityList}>
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className={styles.activityItem}
            >
              <div className={styles.activityLeft}>
                <span className={styles.activityDot} />

                <span className={styles.activityText}>
                  {activity.text}
                </span>
              </div>

              <span className={styles.activityTime}>
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}