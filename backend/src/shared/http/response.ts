import { CookieOptions, HttpCookie, HttpResponse } from "./HttpTypes";

export interface ResponseOptions {
  cookies?: HttpCookie[];
  clearCookies?: { name: string; options?: CookieOptions }[];
}

export const ok = <T>(
  data?: T,
  message?: string,
  options?: ResponseOptions,
): HttpResponse<T> => ({
  status: 200,
  body: {
    success: true,
    message,
    data,
  },
  cookies: options?.cookies,
  clearCookies: options?.clearCookies,
});

export const created = <T>(
  data?: T,
  message?: string,
  options?: ResponseOptions,
): HttpResponse<T> => ({
  status: 201,
  body: {
    success: true,
    message,
    data,
  },
  cookies: options?.cookies,
  clearCookies: options?.clearCookies,
});