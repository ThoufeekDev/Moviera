import { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

interface Props {
  imageSrc: string;
  onClose: () => void;
  onCropDone: (file: File) => void;
}

export default function ImageCropModal({ imageSrc, onClose, onCropDone }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = (_: any, croppedPixels: any) => {
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
    <div className="crop-modal" role="dialog" aria-modal="true">
      <div className="crop-modal-card">
        <header className="crop-header">
          <span>Crop & Adjust Banner Image</span>
          <button type="button" className="crop-close-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="crop-container">
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

        <div className="crop-actions">
          <button type="button" className="crop-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="crop-btn save" onClick={handleSave} disabled={isProcessing}>
            {isProcessing ? 'Processing Image...' : 'Apply Crop & Use Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

