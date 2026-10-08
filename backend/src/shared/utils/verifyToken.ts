import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/TokenPayload';
import { Role } from '../enums/Role';

export const verifyToken = (token: string, secret: string): TokenPayload => {
    
  const decoded = jwt.verify(token, secret);

  if (typeof decoded === "string") throw new jwt.JsonWebTokenError("Invalid token payload");

  if (typeof decoded.userId !== "string" || !Object.values(Role).includes(decoded.role as Role)) 
    throw new jwt.JsonWebTokenError("Invalid token payload")

  return {
    userId: decoded.userId,
    role:decoded.role as Role
  }
};
