import { useState, useRef } from 'react';
import ImageCropModal from './ImageCropModal';
import { cn } from '@/shared/lib/cn';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File) => void;
  className?: string;
}

export default function ImageUpload({ label, onImageSelect, className }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState('');
  const [preview, setPreview] = useState('');
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageSelect(file);
    setIsCropOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setPreview('');
    setImageSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-ink">{label}</label>

      {preview ? (
        <div className="flex items-center gap-4 rounded-md border border-border bg-surface px-3.5 py-2.5">
          <img
            src={preview}
            alt="Selected Preview"
            className="h-12 w-20 rounded-md border border-border object-cover"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex min-h-[36px] cursor-pointer items-center justify-center rounded-md border border-border bg-surface-muted px-3 py-1.5 text-xs md:text-sm font-medium text-ink transition hover:bg-border"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex min-h-[36px] cursor-pointer items-center justify-center rounded-md border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs md:text-sm font-medium text-danger-600 transition hover:bg-brand-100"
            >
              Remove
            </button>
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
            'flex min-h-[100px] cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border bg-surface px-5 py-4 text-center',
            'transition-colors duration-150',
            'hover:border-brand-600 hover:bg-brand-50/30',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
          )}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-muted" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-sm font-medium text-ink">
            Click to upload photo (JPG, PNG, WebP)
          </span>
          <span className="text-xs text-ink-muted">Max 5MB • 16:9 Aspect Ratio</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
        aria-label={label}
      />

      {isCropOpen && (
        <ImageCropModal
          imageSrc={imageSrc}
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
