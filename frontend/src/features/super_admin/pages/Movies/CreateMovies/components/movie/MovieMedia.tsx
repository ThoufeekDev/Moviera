import { useState, useRef, useEffect } from 'react';
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateMovieFormInput } from '../../../../../validators/createMovie.schema';
import Input from '../../../../../../../shared/components/Input/Input';
import styles from './MovieMedia.module.css';

interface MovieMediaProps {
  register: UseFormRegister<CreateMovieFormInput>;
  setValue: UseFormSetValue<CreateMovieFormInput>;
  errors: FieldErrors<CreateMovieFormInput>;
  watch?: UseFormWatch<CreateMovieFormInput>;
}

export default function MovieMedia({ register, setValue, errors, watch }: MovieMediaProps) {
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);

  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

  const trailerUrlVal = watch ? watch('trailerUrl') : '';

  // Extract Youtube Embed URL
  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(trailerUrlVal);

  const handlePosterChange = (file?: File) => {
    if (!file) return;
    setValue('poster', file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setPosterPreview(url);
  };

  const handleBackdropChange = (file?: File) => {
    if (!file) return;
    setValue('backdrop', file, { shouldValidate: true });
    const url = URL.createObjectURL(file);
    setBackdropPreview(url);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      if (backdropPreview) URL.revokeObjectURL(backdropPreview);
    };
  }, [posterPreview, backdropPreview]);

  return (
    <section className={styles.sectionCard} id="media-section">
      <div className={styles.sectionHeader}>
        <div className={styles.headerIcon}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <div className={styles.headerText}>
          <h2>Movie Media & Visuals</h2>
          <p>Upload high-resolution poster artwork, backdrop banners, and trailer URL.</p>
        </div>
      </div>

      <div className={styles.mediaGrid}>
        {/* Poster Upload Card */}
        <div className={styles.uploadCard}>
          <div className={styles.cardLabel}>
            <span>Vertical Poster</span>
            <span className={styles.badge}>2:3 Ratio</span>
          </div>

          <div
            className={styles.posterDropzone}
            onClick={() => posterInputRef.current?.click()}
          >
            <input
              ref={posterInputRef}
              id="movie-poster"
              type="file"
              className={styles.hiddenInput}
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                handlePosterChange(file);
              }}
            />

            {posterPreview ? (
              <>
                <img src={posterPreview} alt="Movie Poster Preview" className={styles.previewImage} />
                <div className={styles.previewOverlay}>
                  <button type="button" className={styles.overlayBtn}>
                    Replace Poster
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div className={styles.uploadText}>Upload Poster</div>
                <div className={styles.uploadSubtext}>JPG, PNG, WEBP (Max 5MB)</div>
              </>
            )}
          </div>

          {errors.poster && <p className={styles.errorMsg}>⚠️ {errors.poster.message as string}</p>}
        </div>

        {/* Backdrop Upload Card */}
        <div className={styles.uploadCard}>
          <div className={styles.cardLabel}>
            <span>Landscape Backdrop Banner</span>
            <span className={styles.badge}>16:9 Banner</span>
          </div>

          <div
            className={styles.backdropDropzone}
            onClick={() => backdropInputRef.current?.click()}
          >
            <input
              ref={backdropInputRef}
              id="movie-backdrop"
              type="file"
              className={styles.hiddenInput}
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                handleBackdropChange(file);
              }}
            />

            {backdropPreview ? (
              <>
                <img src={backdropPreview} alt="Movie Backdrop Preview" className={styles.previewImage} />
                <div className={styles.previewOverlay}>
                  <button type="button" className={styles.overlayBtn}>
                    Replace Backdrop
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div className={styles.uploadText}>Upload Backdrop Banner</div>
                <div className={styles.uploadSubtext}>JPG, PNG, WEBP (Max 5MB)</div>
              </>
            )}
          </div>

          {errors.backdrop && <p className={styles.errorMsg}>⚠️ {errors.backdrop.message as string}</p>}
        </div>
      </div>

      {/* Trailer Box */}
      <div className={styles.trailerBox}>
        <Input
          id="movie-trailer"
          type="url"
          label="YouTube Official Trailer URL"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register('trailerUrl')}
          error={errors.trailerUrl?.message}
        />

        {embedUrl && (
          <div className={styles.trailerPreviewContainer}>
            <iframe
              src={embedUrl}
              title="Movie Trailer Preview"
              className={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </section>
  );
}