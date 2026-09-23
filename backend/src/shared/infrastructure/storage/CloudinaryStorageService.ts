
import cloudinary from '../../../config/cloudinary';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { IStorageService } from '../../domain/services/IStorageService';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

export class CloudinaryStorageService implements IStorageService {
  async uploadImage(
    buffer: Buffer,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (
          error?: UploadApiErrorResponse,
          result?: UploadApiResponse,
        ) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error('Cloudinary upload failed'));
            return;
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      stream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void>{
    return new Promise((res, rej) => {
      cloudinary.uploader.destroy(
        publicId,
        {
          resource_type:'image',
        },
        (error, result) => {
          if (error) return rej(error);
          if (result.result !== 'ok' && result.result !== 'not found') {
            rej(new Error(`Cloudinary deletion failed: ${result.result}`) )
            return
          }
          res()
        }
      )
    })
  }
}