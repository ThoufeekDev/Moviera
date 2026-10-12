import { useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import getCroppedImg from './cropImage';
import { Button } from '@/shared/ui/Button';

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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-0 md:p-4 backdrop-blur-xs"
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-t-xl md:rounded-lg border border-border bg-surface shadow-float">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-nav px-5 py-3.5 text-nav-ink">
          <span className="text-sm md:text-base font-bold">Crop &amp; Adjust Image</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-nav-ink/70 hover:bg-white/10 hover:text-nav-ink"
          >
            ✕
          </button>
        </header>

        {/* Crop area */}
        <div className="relative h-80 w-full bg-black">
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
        <div className="flex items-center justify-end gap-3 border-t border-border bg-surface px-5 py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={isProcessing}
            disabled={isProcessing}
          >
            Apply Crop &amp; Save
          </Button>
        </div>
      </div>
    </div>
  );
}
