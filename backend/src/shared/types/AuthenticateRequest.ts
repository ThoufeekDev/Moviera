import { Request } from 'express';
import { Role } from '../enums/Role';
export interface AuthenticatedRequest<
  Params = Record<string, string>,
  Body = unknown,
  Query = Record<string, string>
> extends Request<Params,any,Body,Query> {
  userId?: string;
  role?: Role;
}
