import { useFormContext, type FieldErrors, type UseFormRegister, type UseFormSetValue, type UseFormWatch } from 'react-hook-form';
import { Input } from '@/shared/ui/Input';
import { ImageUpload } from '@/shared/ui/ImageUpload';
import FormSection from './FormSection';

interface MovieMediaProps {
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  errors?: FieldErrors<any>;
  watch?: UseFormWatch<any>;
  initialPosterUrl?: string | null;
  initialBackdropUrl?: string | null;
}

export default function MovieMedia(props: MovieMediaProps = {}) {
  const context = useFormContext();
  const register = props.register ?? context?.register;
  const setValue = props.setValue ?? context?.setValue;
  const errors = props.errors ?? context?.formState?.errors ?? {};
  const watch = props.watch ?? context?.watch;
  const initialPosterUrl = props.initialPosterUrl;
  const initialBackdropUrl = props.initialBackdropUrl;

  const trailerUrlVal = watch ? (watch as any)('trailerUrl') : '';

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(trailerUrlVal);

  const handlePosterChange = (file: File) => {
    if (setValue) setValue('poster', file, { shouldValidate: true });
  };

  const handleBackdropChange = (file: File) => {
    if (setValue) setValue('backdrop', file, { shouldValidate: true });
  };

  return (
    <FormSection
      id="media-section"
      title="Movie Media & Visuals"
      description="Upload high-resolution poster artwork, backdrop banners, and trailer URL."
      icon={
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          id="movie-poster"
          label="Vertical Poster"
          aspect={2 / 3}
          aspectLabel="2:3 Ratio"
          initialUrl={initialPosterUrl}
          onImageSelect={handlePosterChange}
          error={errors.poster?.message as string}
        />

        <ImageUpload
          id="movie-backdrop"
          label="Wide Backdrop"
          aspect={16 / 9}
          aspectLabel="16:9 Ratio"
          initialUrl={initialBackdropUrl}
          onImageSelect={handleBackdropChange}
          error={errors.backdrop?.message as string}
        />
      </div>

      {/* Trailer URL */}
      <div className="mt-6 border-t border-border pt-6 flex flex-col gap-4">
        <Input
          id="movie-trailer-url"
          label="YouTube Trailer Link"
          placeholder="https://www.youtube.com/watch?v=..."
          {...(register ? register('trailerUrl') : {})}
          error={errors.trailerUrl?.message as string}
        />

        {embedUrl && (
          <div className="overflow-hidden rounded-lg border border-border">
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
    </FormSection>
  );
}