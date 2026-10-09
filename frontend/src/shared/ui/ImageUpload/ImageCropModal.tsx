import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { cn } from '@/shared/lib/cn';

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropDone: (file: File) => void;
}

export default function ImageCropModal({ imageSrc, onClose, onCropDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropDone(croppedFile);
    } catch (err) {
      console.error('Failed to crop image:', err);
      alert('Failed to crop image. Please try selecting the image again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-[rgba(15,23,42,0.82)] p-4 backdrop-blur-md"
    >
      <div className="flex w-full max-w-[620px] flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <header className="flex items-center justify-between bg-slate-900 px-5 py-[0.875rem]">
          <span className="text-[0.875rem] font-semibold text-white">Crop &amp; Adjust Banner Image</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer border-none bg-transparent p-[0.2rem] text-slate-400 transition-colors duration-150 hover:text-white"
          >
            ✕
          </button>
        </header>

        {/* Crop area (react-easy-crop controls its own styles) */}
        <div className="relative h-80 w-full bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-[0.875rem]">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-slate-300 bg-transparent px-5 py-2 text-[0.825rem] font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-200 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className={cn(
              'cursor-pointer rounded-lg border border-transparent bg-sky-600 px-5 py-2',
              'text-[0.825rem] font-semibold text-white shadow-[0_4px_12px_rgba(2,132,199,0.25)]',
              'transition-all duration-150',
              'hover:not(:disabled):bg-sky-700',
              'disabled:cursor-not-allowed disabled:opacity-60',
            )}
          >
            {isProcessing ? 'Processing Image…' : 'Apply Crop & Use Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
