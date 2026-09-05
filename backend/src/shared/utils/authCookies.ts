
import { Role } from "../enums/Role";
import { Response } from "express";
import { generateAccessToken } from "./generateAccessToken";
import { generateRefreshToken } from "./generateRefreshToken";
export async function setAuthCookies(res:Response,userId:string,role:Role) {
    
  const accessToken = generateAccessToken({
    userId,
    role,
  });

  const refreshToken = generateRefreshToken({
    userId,
    role,
  });
    
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
}

export function setAccessTokenCookie(res: Response, accessToken: string): void{
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      });
}