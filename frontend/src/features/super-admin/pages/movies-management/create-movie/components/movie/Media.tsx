import { useState, useRef, useEffect } from 'react';
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';

interface MovieMediaProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  watch?: UseFormWatch<any>;
}

export default function MovieMedia({ register, setValue, errors, watch }: MovieMediaProps) {
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);

  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

  const trailerUrlVal = watch ? watch('trailerUrl') : '';

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

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      if (backdropPreview) URL.revokeObjectURL(backdropPreview);
    };
  }, [posterPreview, backdropPreview]);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm" id="media-section">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Movie Media &amp; Visuals</h2>
          <p className="text-xs text-slate-500">Upload high-resolution poster artwork, backdrop banners, and trailer URL.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Poster Upload Card */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Vertical Poster</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500">2:3 Ratio</span>
          </div>

          <div
            className="group relative flex aspect-[2/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-500 hover:bg-brand-50/20"
            onClick={() => posterInputRef.current?.click()}
          >
            <input
              ref={posterInputRef}
              id="movie-poster"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                handlePosterChange(file);
              }}
            />

            {posterPreview ? (
              <>
                <img src={posterPreview} alt="Movie Poster Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-lg">
                    Replace Poster
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 p-6 text-center text-slate-400">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-semibold text-slate-700">Click to upload poster</span>
                <span className="text-[11px] text-slate-400">JPG, PNG, or WebP up to 5MB</span>
              </div>
            )}
          </div>
          {errors.poster && <p className="text-xs text-rose-500">{errors.poster.message as string}</p>}
        </div>

        {/* Backdrop Upload Card */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Wide Backdrop</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500">16:9 Ratio</span>
          </div>

          <div
            className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-500 hover:bg-brand-50/20"
            onClick={() => backdropInputRef.current?.click()}
          >
            <input
              ref={backdropInputRef}
              id="movie-backdrop"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                handleBackdropChange(file);
              }}
            />

            {backdropPreview ? (
              <>
                <img src={backdropPreview} alt="Movie Backdrop Preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                  <span className="rounded-xl bg-white px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-lg">
                    Replace Backdrop
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 p-6 text-center text-slate-400">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-semibold text-slate-700">Click to upload backdrop</span>
                <span className="text-[11px] text-slate-400">Landscape wallpaper used on movie page</span>
              </div>
            )}
          </div>
          {errors.backdrop && <p className="text-xs text-rose-500">{errors.backdrop.message as string}</p>}
        </div>
      </div>

      {/* Trailer URL */}
      <div className="mt-6 border-t border-slate-100 pt-6 flex flex-col gap-4">
        <Input
          id="movie-trailer-url"
          label="YouTube Trailer Link"
          placeholder="https://www.youtube.com/watch?v=..."
          {...register('trailerUrl')}
          error={errors.trailerUrl?.message}
        />

        {embedUrl && (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title="Trailer Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}