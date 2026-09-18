import { Link } from "react-router-dom";
import type { Movie } from "../../types/movie.types";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  onToggleStatus?: (movieId: string, currentStatus: boolean) => void;
}

export default function MovieCard({ movie, onToggleStatus }: MovieCardProps) {
  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const hours = Math.floor(movie.duration / 60);
  const mins = movie.duration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
console.log("Movie status:", movie.id, movie.isActive);
  return (
    <article className={styles.card}>
      {/* Left: Poster */}
      <div className={styles.posterWrapper}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`${movie.title} poster`}
            className={styles.poster}
            loading="lazy"
          />
        ) : (
          <div className={styles.posterPlaceholder}>
            <svg
              className={styles.placeholderIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <span>No Poster</span>
          </div>
        )}

        <div className={styles.posterBadges}>
          <span
            className={`${styles.statusBadge} ${
              movie.isActive ? styles.activeBadge : styles.inactiveBadge
            }`}
          >
            <span className={styles.statusDot} />
            {movie.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Right: Rich Details & Actions */}
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <h3 className={styles.title} title={movie.title}>
              {movie.title}
            </h3>
            {movie.certification && (
              <span className={styles.certBadge}>{movie.certification}</span>
            )}
          </div>
        </div>

        {/* Genres, Duration & Formats */}
        <div className={styles.metaTagsRow}>
          {movie.primaryGenre && (
            <span className={styles.genreTag}>{movie.primaryGenre.name}</span>
          )}

          <span className={styles.durationTag}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.iconSm}>
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
            </svg>
            {durationText}
          </span>

          {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
            <div className={styles.formatGroup}>
              {movie.cinemaFormats.map((fmt) => (
                <span key={fmt.id} className={styles.formatTag}>
                  {fmt.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Languages */}
        {movie.languages && movie.languages.length > 0 && (
          <p className={styles.languages}>
            <span className={styles.metaLabel}>Languages:</span>{" "}
            {movie.languages.map((lang) => lang.name).join(", ")}
          </p>
        )}

        {/* Short Synopsis / Description preview */}
        {movie.description && (
          <p className={styles.descriptionSnippet}>{movie.description}</p>
        )}

        {/* Footer info & Action buttons */}
        <div className={styles.footerRow}>
          <div className={styles.releaseInfo}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.iconSm}>
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Release: <strong>{formattedReleaseDate}</strong></span>
          </div>

          <div className={styles.actions}>
            <Link
              to={`/super-admin/movies/${movie.id}`}
              className={styles.viewButton}
            >
              <span>View Details</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to={`/super-admin/movies/${movie.id}/edit`}
              className={styles.editButton}
              title="Edit Movie"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </Link>

            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(movie.id, movie.isActive)}
                className={`${styles.toggleButton} ${
                  movie.isActive ? styles.deactivateBtn : styles.activateBtn
                }`}
              >
                {movie.isActive ? "Deactivate" : "Active"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}