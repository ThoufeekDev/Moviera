import { Role } from "../enums/Role";
import { Response } from "express";
import { generateAccessToken } from "./generateAccessToken";
import { generateRefreshToken } from "./generateRefreshToken";
import { HttpCookie } from "../http/HttpTypes";

export function buildAuthCookies(userId: string, role: Role): HttpCookie[] {
  const accessToken = generateAccessToken({
    userId,
    role,
  });

  const refreshToken = generateRefreshToken({
    userId,
    role,
  });

  return [
    {
      name: 'accessToken',
      value: accessToken,
      options: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
      },
    },
    {
      name: 'refreshToken',
      value: refreshToken,
      options: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    },
  ];
}

export function buildAccessTokenCookie(accessToken: string): HttpCookie {
  return {
    name: 'accessToken',
    value: accessToken,
    options: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    },
  };
}

export async function setAuthCookies(res: Response, userId: string, role: Role) {
  const cookies = buildAuthCookies(userId, role);
  for (const cookie of cookies) {
    if (cookie.options) {
      res.cookie(cookie.name, cookie.value, cookie.options);
    } else {
      res.cookie(cookie.name, cookie.value);
    }
  }
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  const cookie = buildAccessTokenCookie(accessToken);
  if (cookie.options) {
    res.cookie(cookie.name, cookie.value, cookie.options);
  } else {
    res.cookie(cookie.name, cookie.value);
  }
}