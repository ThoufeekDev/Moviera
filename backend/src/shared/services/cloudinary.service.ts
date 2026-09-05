import { rejects } from 'node:assert';
import cloudinary from '../../config/cloudinary';

import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
export class CloudinaryService {
  async uploadImage(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result!.secure_url);
        },
      );
      stream.end(buffer);
    });
  }
}
