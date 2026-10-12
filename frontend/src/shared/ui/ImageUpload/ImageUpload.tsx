import { useState, useRef, useEffect } from 'react';
import ImageCropModal from './ImageCropModal';
import { cn } from '@/shared/lib/cn';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File) => void;
  aspect?: number;
  aspectLabel?: string;
  initialUrl?: string | null;
  error?: string;
  id?: string;
  className?: string;
}

export default function ImageUpload({
  label,
  onImageSelect,
  aspect = 16 / 9,
  aspectLabel,
  initialUrl,
  error,
  id,
  className,
}: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [preview, setPreview] = useState(initialUrl || '');
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (file: File) => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageSelect(file);
    setIsCropOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview('');
    setImageSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-ink">
        <label htmlFor={id} className="cursor-pointer">{label}</label>
        {aspectLabel && (
          <span className="rounded-full bg-surface-muted border border-border px-2 py-0.5 text-ink-muted">
            {aspectLabel}
          </span>
        )}
      </div>

      {preview ? (
        <div className="relative group overflow-hidden rounded-lg border border-border bg-surface">
          <div className={cn(
            'flex w-full items-center justify-center overflow-hidden bg-black/5',
            aspect < 1 ? 'aspect-[2/3] max-h-80' : 'aspect-video'
          )}>
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between border-t border-border bg-surface px-3.5 py-2">
            <span className="text-xs text-ink-muted truncate max-w-[160px] sm:max-w-xs">{label} loaded</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-[32px] cursor-pointer items-center justify-center rounded-md border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink transition hover:bg-border"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="inline-flex min-h-[32px] cursor-pointer items-center justify-center rounded-md border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-medium text-danger-600 transition hover:bg-brand-100"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
          className={cn(
            'flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-muted p-6 text-center',
            aspect < 1 ? 'aspect-[2/3] max-h-80' : 'aspect-video',
            'transition-colors duration-150',
            'hover:border-brand-600 hover:bg-brand-50/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          )}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ink-muted" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-xs font-semibold text-ink">
            Click to upload {label.toLowerCase()}
          </span>
          <span className="text-[11px] text-ink-muted">
            JPG, PNG, or WebP up to 5MB {aspectLabel ? `• ${aspectLabel}` : ''}
          </span>
        </div>
      )}

      {error && <p className="text-xs font-medium text-danger-600">{error}</p>}

      <input
        ref={fileInputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />

      {isCropOpen && (
        <ImageCropModal
          imageSrc={imageSrc}
          aspect={aspect}
          onClose={() => {
            setIsCropOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
          onCropDone={handleCropComplete}
        />
      )}
    </div>
  );
}
