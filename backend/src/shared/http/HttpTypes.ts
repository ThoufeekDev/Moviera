import { Role } from "../enums/Role";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | boolean;
  maxAge?: number;
  path?: string;
}

export interface HttpCookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

export interface HttpRequest<P = unknown, B = unknown, Q = unknown> {
  params: P;
  body: B;
  query: Q;
  cookies?: Record<string, string>;
  user?: {
    userId: string;
    role: Role;
  };
  files?: Record<string, { buffer: Buffer }[]>;
  file?: { buffer: Buffer };
}

export interface HttpResponse<T = unknown> {
  status: number;
  body: {
    success?: boolean;
    message?: string;
    data?: T;
  };
  cookies?: HttpCookie[];
  clearCookies?: { name: string; options?: CookieOptions }[];
}

export type Controller<
  P = unknown,
  B = unknown,
  Q = unknown,
  R = unknown,
> = (
  req: HttpRequest<P, B, Q>,
) => Promise<HttpResponse<R>>;