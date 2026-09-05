import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

import { TokenPayload } from '../types/TokenPayload';

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
  });
};
