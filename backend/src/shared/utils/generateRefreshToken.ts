import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { TokenPayload } from '../types/TokenPayload';

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET!, {
    expiresIn: '7d',
  });
};
