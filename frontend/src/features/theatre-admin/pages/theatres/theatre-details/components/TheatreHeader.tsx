import type { ReactNode } from "react";
import type { Theatre } from "../../types/theatre.type";
import styles from "./TheatreHeader.module.css";

interface TheatreHeaderProps {
  theatre: Theatre;
  children: ReactNode;
}

export default function TheatreHeader({
  theatre,
  children,
}: TheatreHeaderProps) {
  return (
    <div className={styles.headerCard}>
      <div className={styles.headerMain}>
        <div className={styles.theatreAvatar}>
          {theatre.logoUrl ? (
            <img
              src={theatre.logoUrl}
              alt={`${theatre.name} logo`}
              className={styles.avatarImg}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="15"
                  rx="2"
                  ry="2"
                />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            </div>
          )}
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.theatreTitle}>
              {theatre.name}
            </h1>

            <span
              className={`${styles.statusBadge} ${
                theatre.isActive
                  ? styles.activeBadge
                  : styles.inactiveBadge
              }`}
            >
              <span className={styles.statusDot} />

              {theatre.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <p className={styles.locationSubtitle}>
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
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            {theatre.city.name} {theatre.city.state}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}