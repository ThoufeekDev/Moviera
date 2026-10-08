import multer from 'multer';
import { BadRequestError } from '../errors/BadRequestError';
const storage = multer.memoryStorage();
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; //5MB
export const upload = multer({
  storage,
  limits: {
    fileSize:MAX_FILE_SIZE_BYTES
  },

  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new BadRequestError('Invalid image format'));
    }
    cb(null, true);
  },
});
