import type { Theatre } from "../../types/theatre.type";
import styles from "./TheatreCard.module.css";

interface TheatreCardProps {
  theatre: Theatre;
  onManage: (theatreId: string) => void;
}

const TheatreCard = ({ theatre, onManage }: TheatreCardProps) => {
  return (
    <article className={styles.card}>
      {/* Top Banner / Header Decoration */}
      <div className={styles.cardHeaderBg}>
        <span
          className={`${styles.statusBadge} ${
            theatre.isActive ? styles.activeBadge : styles.inactiveBadge
          }`}
        >
          <span className={styles.statusDot} />
          {theatre.isActive ? "Active" : "Inactive"}
        </span>

        {theatre.licenseNumber && (
          <span className={styles.licenseBadge} title={`License: ${theatre.licenseNumber}`}>
            <svg
              className={styles.metaIcon}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {theatre.licenseNumber}
          </span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.logoAndTitle}>
          <div className={styles.logoWrapper}>
            {theatre.logoUrl ? (
              <img
                src={theatre.logoUrl}
                alt={`${theatre.name} logo`}
                className={styles.logo}
                onError={(e) => {
                  // Fallback on image load error
                  (e.target as HTMLElement).style.display = "none";
                  if (e.currentTarget.parentElement) {
                    const fallback = e.currentTarget.parentElement.querySelector(
                      `.${styles.logoPlaceholder}`
                    );
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={styles.logoPlaceholder}
              style={{ display: theatre.logoUrl ? "none" : "flex" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            </div>
          </div>

          <div className={styles.headerText}>
            <h3 className={styles.theatreName}>{theatre.name}</h3>
            {theatre.cityId && (
              <span className={styles.cityTag}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location: {theatre.city.name}, {theatre.city.state} 
              </span>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <svg
              className={styles.infoIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className={styles.addressText}>{theatre.address}</span>
          </div>

          {(theatre.email || theatre.phone) && (
            <div className={styles.contactDetails}>
              {theatre.email && (
                <span className={styles.contactItem} title={theatre.email}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {theatre.email}
                </span>
              )}
              {theatre.phone && (
                <span className={styles.contactItem} title={theatre.phone}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {theatre.phone}
                </span>
              )}
            </div>
          )}

          {theatre.description && (
            <p className={styles.description}>{theatre.description}</p>
          )}
        </div>

        <div className={styles.footerRow}>
          <button
            type="button"
            onClick={() => onManage(theatre.id)}
            className={styles.manageButton}
          >
            <span>Manage Theatre</span>
            <svg
              className={styles.btnArrow}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default TheatreCard;