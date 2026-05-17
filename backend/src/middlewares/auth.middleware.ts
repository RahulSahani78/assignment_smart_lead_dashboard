import type { Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import type { AuthRequest, UserRole } from '../types';

const extractToken = (header: string | undefined): string | null => {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim();
};

export const requireAuth = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      return next(ApiError.unauthorized('Authentication token missing'));
    }
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: ${roles.join(' or ')}`
        )
      );
    }
    return next();
  };
