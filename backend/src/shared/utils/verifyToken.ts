import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../types/TokenPayload';
export const verifyToken = (token: string, secret: string): TokenPayload => {
  return jwt.verify(token, secret) as TokenPayload;
};
