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
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <label className="text-[0.775rem] font-semibold text-slate-600">{label}</label>

      {preview ? (
        <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <img
            src={preview}
            alt="Selected Banner Preview"
            className="h-[50px] w-[90px] rounded-md border border-slate-300 object-cover"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-md border border-slate-300 bg-slate-100 px-[0.65rem] py-[0.3rem] text-[0.75rem] font-semibold text-slate-900 transition-all duration-150 hover:bg-slate-200"
            >
              Change Photo
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="cursor-pointer rounded-md border border-rose-300 bg-transparent px-[0.65rem] py-[0.3rem] text-[0.75rem] font-semibold text-danger-700 transition-all duration-150 hover:bg-danger-100"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-[0.35rem] rounded-lg border border-dashed border-slate-300 bg-white px-5 py-4 text-center text-sky-600',
            'transition-all duration-[180ms] ease-out',
            'hover:border-sky-500 hover:bg-sky-50',
          )}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-[0.8rem] font-semibold text-slate-900">
            Click to upload hospital photo (JPG, PNG)
          </span>
          <span className="text-[0.7rem] text-slate-400">Max 5MB • 16:9 Aspect Ratio</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
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
