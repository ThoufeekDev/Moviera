import { Request } from 'express';
import { Role } from '../enums/Role';
export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: Role;
}
