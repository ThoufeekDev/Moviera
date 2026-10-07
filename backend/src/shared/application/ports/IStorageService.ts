export interface IStorageService {
  uploadImage(
    buffer: Buffer,
    folder: string,
  ): Promise<{
    secureUrl: string;
    publicId: string;
  }>;

  deleteImage(publicId: string): Promise<void>;
}