import { Role } from "../enums/Role";

export interface HttpRequest<P = unknown, B = unknown, Q = unknown>{
    params: P;
    body: B,
    query: Q,
    user?: {
        userId: string;
        role: Role,
        
    };
    files?: Record<string, { buffer: Buffer }[]>;
}

export interface HttpResponse<T = unknown>{
    status: number;
    body: {
        message?: string;
        data?:T,
    }
}

export type Controller<
  P = unknown,
  B = unknown,
  Q = unknown,
  R = unknown,
> = (
  req: HttpRequest<P, B, Q>,
) => Promise<HttpResponse<R>>;