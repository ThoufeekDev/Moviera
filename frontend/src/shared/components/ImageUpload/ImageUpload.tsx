import { useState, useRef } from 'react';
import ImageCropModal from './ImageCropModal';
import './ImageUpload.css';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File) => void;
}

export default function ImageUpload({ label, onImageSelect }: ImageUploadProps) {
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
    <div className="image-upload-wrapper">
      <label className="upload-label">{label}</label>

      {preview ? (
        <div className="image-preview-card">
          <img src={preview} alt="Selected Banner Preview" className="preview-thumbnail" />
          <div className="preview-actions">
            <button
              type="button"
              className="change-img-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </button>
            <button
              type="button"
              className="remove-img-btn"
              onClick={handleRemoveImage}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span className="dropzone-text">Click to upload hospital photo (JPG, PNG)</span>
          <span className="dropzone-sub">Max 5MB • 16:9 Aspect Ratio</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
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

