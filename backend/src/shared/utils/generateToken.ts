import { generateAccessToken } from './generateAccessToken';
import { generateRefreshToken } from './generateRefreshToken';
import { TokenPayload } from '../types/TokenPayload';

export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
