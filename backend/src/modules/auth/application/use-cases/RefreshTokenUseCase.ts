import { generateAccessToken } from '../../../../shared/utils/generateAccessToken';

import { verifyToken } from '../../../../shared/utils/verifyToken';
import { env } from '../../../../config/env';
import { RefreshTokenResponseDTO } from '../dtos/response/RefreshTokenResponseDTO';
export class RefreshTokenUseCase {
  async execute(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    const decoded = verifyToken(refreshToken, env.JWT_REFRESH_SECRET!);

    const accessToken = generateAccessToken({
      userId: decoded.userId,
      role: decoded.role,
    });

    return {
      accessToken,
    };
  }
}
