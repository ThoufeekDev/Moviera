import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMovieById } from "../hooks/useMovieById";
import Loader from "../../../../../shared/components/Loader/Loader";
import styles from "./MovieDetailsPage.module.css";
import api from "../../../../../api/axios";
import { useToggleMovieStatus } from "../hooks/useToggleMovieStatus";
import { toggleMovieStatus } from '../services/toggleMovieStatus.service';
export default function MovieDetailsPage() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: movie, isLoading, isError, refetch } = useMovieById(id);
  // const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const {mutate:toggleMovieStatus,isPending:isTogglingStatus} = useToggleMovieStatus()
  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          <h2>Movie Not Found</h2>
          <p>The requested movie details could not be loaded or may not exist.</p>
          <div className={styles.errorActions}>
            <button type="button" onClick={() => refetch()} className={styles.retryBtn}>
              Retry
            </button>
            <Link to="/super-admin/movies" className={styles.backBtn}>
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  const hours = Math.floor(movie.duration / 60);
  const mins = movie.duration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const handleToggleActiveStatus = async () => {
      toggleMovieStatus({
        movieId: movie.id,
        isActive:!movie.isActive,
      })


  };

  // Extract YouTube embed URL if trailerUrl is a valid YouTube link
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  const embedTrailerUrl = getEmbedUrl(movie.trailerUrl);

  return (
    <div className={styles.page}>
      {/* Top Header Navigation */}
      <nav className={styles.topNav}>
        <button
          type="button"
          onClick={() => navigate("/super-admin/movies")}
          className={styles.backLink}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.iconSm}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Movies
        </button>
        <span className={styles.navBreadcrumb}>
          Movies / <strong className={styles.breadcrumbTitle}>{movie.title}</strong>
        </span>
      </nav>

      {/* Hero Banner Section */}
      <header className={styles.heroSection}>
        {/* Backdrop background overlay */}
        <div className={styles.backdropContainer}>
          {movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl!}
              alt={`${movie.title} backdrop`}
              className={styles.backdropImg}
            />
          ) : (
            <div className={styles.backdropFallback} />
          )}
          <div className={styles.backdropOverlay} />
        </div>

        {/* Hero Content Grid */}
        <div className={styles.heroContentContainer}>
          {/* Left Column: Poster */}
          <div className={styles.posterColumn}>
            <div className={styles.posterCard}>
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={`${movie.title} poster`}
                  className={styles.posterImg}
                />
              ) : (
                <div className={styles.posterPlaceholder}>
                  <span>No Poster</span>
                </div>
              )}
              <div className={styles.statusRibbon}>
                <span
                  className={`${styles.statusDot} ${
                    movie.isActive ? styles.dotActive : styles.dotInactive
                  }`}
                />
                {movie.isActive ? "In Cinemas / Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className={styles.detailsColumn}>
            <div className={styles.badgeRow}>
              {movie.certification && (
                <span className={styles.certBadge}>{movie.certification}</span>
              )}
              {movie.primaryGenre && (
                <span className={styles.genreBadge}>{movie.primaryGenre.name}</span>
              )}
              <span className={styles.durationPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.iconSm}>
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <path strokeWidth="2" strokeLinecap="round" d="M12 7v5l3 2" />
                </svg>
                {durationText}
              </span>
            </div>

            <h1 className={styles.movieTitle}>{movie.title}</h1>

            {/* Languages & Formats Chips */}
            <div className={styles.chipRow}>
              {movie.cinemaFormats && movie.cinemaFormats.length > 0 && (
                <div className={styles.chipGroup}>
                  <span className={styles.groupLabel}>Formats:</span>
                  {movie.cinemaFormats.map((fmt) => (
                    <span key={fmt.id} className={styles.formatChip}>
                      {fmt.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.languages && movie.languages.length > 0 && (
                <div className={styles.chipGroup}>
                  <span className={styles.groupLabel}>Languages:</span>
                  {movie.languages.map((lang) => (
                    <span key={lang.id} className={styles.langChip}>
                      {lang.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <p className={styles.releaseMeta}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.iconSm}>
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              Releasing on <strong>{formattedReleaseDate}</strong>
            </p>

            {/* Quick Action Toolbar */}
            <div className={styles.heroActions}>
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trailerBtn}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className={styles.btnIcon}>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </a>
              )}

              <Link
                to={`/super-admin/movies/${movie.id}/edit`}
                className={styles.editBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.btnIcon}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Movie
              </Link>

              <button
                type="button"
                onClick={handleToggleActiveStatus}
                disabled={isTogglingStatus}
                className={`${styles.statusToggleBtn} ${
                  movie.isActive ? styles.deactivateStyle : styles.activateStyle
                }`}
              >
                {isTogglingStatus ? (
                  "Updating..."
                ) : movie.isActive ? (
                  "Deactivate Movie"
                ) : (
                  "Activate Movie"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className={styles.mainContent}>
        {/* Section 1: About the Movie */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionHeading}>About the Movie</h2>
          <p className={styles.descriptionText}>
            {movie.description || "No synopsis available for this movie yet."}
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoTile}>
              <span className={styles.infoLabel}>Certification</span>
              <span className={styles.infoValue}>{movie.certification || "Not Rated"}</span>
            </div>
            <div className={styles.infoTile}>
              <span className={styles.infoLabel}>Primary Genre</span>
              <span className={styles.infoValue}>{movie.primaryGenre?.name || "N/A"}</span>
            </div>
            <div className={styles.infoTile}>
              <span className={styles.infoLabel}>Duration</span>
              <span className={styles.infoValue}>{durationText}</span>
            </div>
            <div className={styles.infoTile}>
              <span className={styles.infoLabel}>Release Date</span>
              <span className={styles.infoValue}>{formattedReleaseDate}</span>
            </div>
          </div>
        </section>

        {/* Section 2: Cast & Crew */}
        {(movie.cast && movie.cast.length > 0) || (movie.crew && movie.crew.length > 0) ? (
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionHeading}>Cast & Crew</h2>

            {movie.cast && movie.cast.length > 0 && (
              <div className={styles.peopleBlock}>
                <h3 className={styles.subHeading}>Cast</h3>
                <div className={styles.peopleGrid}>
                  {movie.cast.map((item) => (
                    <div key={item.id} className={styles.personCard}>
                      <div className={styles.avatarWrapper}>
                        {item.person.imageUrl ? (
                          <img
                            src={item.person.imageUrl}
                            alt={item.person.name}
                            className={styles.avatarImg}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {item.person.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className={styles.personName}>{item.person.name}</span>
                      {item.character && (
                        <span className={styles.personRole}>as {item.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.crew && movie.crew.length > 0 && (
              <div className={styles.peopleBlock}>
                <h3 className={styles.subHeading}>Crew</h3>
                <div className={styles.peopleGrid}>
                  {movie.crew.map((item) => (
                    <div key={item.id} className={styles.personCard}>
                      <div className={styles.avatarWrapper}>
                        {item.person.imageUrl ? (
                          <img
                            src={item.person.imageUrl}
                            alt={item.person.name}
                            className={styles.avatarImg}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            {item.person.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className={styles.personName}>{item.person.name}</span>
                      <span className={styles.personRole}>{item.job}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : null}

        {/* Section 3: Trailer Media Embed */}
        {embedTrailerUrl && (
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionHeading}>Official Trailer</h2>
            <div className={styles.videoEmbedWrapper}>
              <iframe
                src={embedTrailerUrl}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoIframe}
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
