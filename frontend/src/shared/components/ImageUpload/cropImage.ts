const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = url;
  });

export default async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const cropX = pixelCrop?.x ?? 0;
  const cropY = pixelCrop?.y ?? 0;
  const cropWidth = pixelCrop?.width || image.naturalWidth;
  const cropHeight = pixelCrop?.height || image.naturalHeight;

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx?.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(new File([], 'hospital-banner.jpg', { type: 'image/jpeg' }));
          return;
        }
        const file = new File([blob], 'hospital-banner.jpg', {
          type: 'image/jpeg',
        });
        resolve(file);
      },
      'image/jpeg',
      0.92
    );
  });
}

